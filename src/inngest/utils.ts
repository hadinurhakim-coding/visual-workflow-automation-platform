import cuid from "cuid";
import toposort from "toposort";
import type { Connection, Node } from "@prisma/client";
import { inngest } from "./client";

/**
 * Topological sort: order nodes so every node appears AFTER all its upstream sources.
 * Standalone nodes (no inbound/outbound connections) are appended at the end.
 *
 * Throws if the graph contains a cycle.
 */
export function topologicalSort(
  nodes: readonly Node[],
  connections: readonly Connection[],
): Node[] {
  const nodeById = new Map(nodes.map((n) => [n.id, n]));

  // toposort takes [source, target] tuples
  const edges: [string, string][] = connections.map((c) => [
    c.fromNodeId,
    c.toNodeId,
  ]);

  const sortedIds = toposort.array(
    nodes.map((n) => n.id),
    edges,
  );

  return sortedIds.map((id) => {
    const node = nodeById.get(id);
    if (!node) {
      throw new Error(`Node ${id} appeared in toposort but not in source list`);
    }
    return node;
  });
}

/**
 * Fire an Inngest event to execute a workflow.
 * Returns the cuid event id which equals `Execution.inngestEventId`.
 */
export async function sendWorkflowExecution(params: {
  workflowId: string;
  initialData?: Record<string, unknown>;
}) {
  const id = cuid();
  await inngest.send({
    id,
    name: "workflows/execute.workflow",
    data: {
      workflowId: params.workflowId,
      initialData: params.initialData,
    },
  });
  return { inngestEventId: id };
}
