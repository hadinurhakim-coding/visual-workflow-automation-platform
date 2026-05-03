// Rolling context that flows from one node to the next.
// Each executor reads `context` (outputs of upstream nodes) and returns the next context.
export type WorkflowContext = Record<string, unknown>;

export interface NodeExecutorParams<TData = Record<string, unknown>> {
  data: TData;
  nodeId: string;
  userId: string;
  context: WorkflowContext;
  // Inngest step tools — typed as `unknown` to avoid leaking the v3 vs v4 type surface
  // into every executor file. Each executor can cast as needed.
  step: unknown;
}

export type NodeExecutor<TData = Record<string, unknown>> = (
  params: NodeExecutorParams<TData>,
) => Promise<WorkflowContext>;
