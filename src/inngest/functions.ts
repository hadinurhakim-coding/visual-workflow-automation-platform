import cuid from "cuid";
import { ExecutionStatus } from "@prisma/client";
import prisma from "@/lib/db";
import { getExecutor } from "@/features/executions/lib/executor-registry";
import type { WorkflowContext } from "@/features/executions/types";
import { inngest } from "./client";
import { topologicalSort } from "./utils";

export const executeWorkflow = inngest.createFunction(
  {
    id: "execute-workflow",
    // Single retry for transient failures; non-retriable errors short-circuit.
    retries: 1,
    onFailure: async ({ event, error }) => {
      // `event.data.event` is the original event that triggered the failed run.
      const original = event.data.event;
      const inngestEventId = original.id;
      if (!inngestEventId) return;
      await prisma.execution.updateMany({
        where: { inngestEventId },
        data: {
          status: ExecutionStatus.FAILED,
          error: error.message,
          errorStack: error.stack ?? null,
          completedAt: new Date(),
        },
      });
    },
  },
  { event: "workflows/execute.workflow" },
  async ({ event, step }) => {
    const { workflowId, initialData } = event.data;
    const inngestEventId = event.id;
    if (!inngestEventId) {
      throw new Error("Event id missing — cannot track execution row");
    }

    // 1. Create the Execution row in RUNNING state
    await step.run("create-execution", async () => {
      await prisma.execution.create({
        data: {
          id: cuid(),
          workflowId,
          inngestEventId,
          status: ExecutionStatus.RUNNING,
        },
      });
    });

    // 2. Load workflow + topo-sort nodes
    const ordered = await step.run("prepare-workflow", async () => {
      const workflow = await prisma.workflow.findUnique({
        where: { id: workflowId },
        include: { nodes: true, connections: true },
      });
      if (!workflow) {
        throw new Error(`Workflow ${workflowId} not found`);
      }
      return topologicalSort(workflow.nodes, workflow.connections);
    });

    // 3. Find userId for credential scoping in executors
    const userId = await step.run("find-user-id", async () => {
      const wf = await prisma.workflow.findUnique({
        where: { id: workflowId },
        select: { userId: true },
      });
      if (!wf) throw new Error("Workflow ownership lookup failed");
      return wf.userId;
    });

    // 4. Walk nodes, accumulating context
    let context: WorkflowContext = {
      ...(initialData ?? {}),
    };

    for (const node of ordered) {
      const executor = getExecutor(node.type);
      context = await executor({
        data: (node.data ?? {}) as Record<string, unknown>,
        nodeId: node.id,
        userId,
        context,
        step,
      });
    }

    // 5. Mark Execution SUCCESS with final context as output
    await step.run("update-execution", async () => {
      await prisma.execution.updateMany({
        where: { inngestEventId },
        data: {
          status: ExecutionStatus.SUCCESS,
          output: context as never,
          completedAt: new Date(),
        },
      });
    });

    return { workflowId, inngestEventId, output: context };
  },
);
