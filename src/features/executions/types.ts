import type { GetStepTools } from "inngest";
import type { inngest } from "@/inngest/client";

// Rolling context that flows from one node to the next.
// Each executor reads `context` (outputs of upstream nodes) and returns the next context.
export type WorkflowContext = Record<string, unknown>;

// Inngest step tools, typed against our client so executors get autocomplete on
// `step.run`, `step.sleep`, etc.
export type StepTools = GetStepTools<typeof inngest>;

export interface NodeExecutorParams<TData = Record<string, unknown>> {
  data: TData;
  nodeId: string;
  userId: string;
  context: WorkflowContext;
  step: StepTools;
}

export type NodeExecutor<TData = Record<string, unknown>> = (
  params: NodeExecutorParams<TData>,
) => Promise<WorkflowContext>;
