import { NodeType } from "@prisma/client";
import { type NodeExecutor } from "../types";
import { passthroughExecutor } from "./passthrough-executor";
import { makeNotImplementedExecutor } from "./not-implemented-executor";
import { NODE_TYPE_LABELS } from "@/config/node-types";

// Registry of all executors. Triggers + INITIAL pass through;
// action nodes throw NonRetriableError until Tahap 7 implements them.
export const executorRegistry: Record<NodeType, NodeExecutor> = {
  [NodeType.INITIAL]: passthroughExecutor,
  [NodeType.MANUAL_TRIGGER]: passthroughExecutor,
  [NodeType.GOOGLE_FORM_TRIGGER]: passthroughExecutor,
  [NodeType.STRIPE_TRIGGER]: passthroughExecutor,
  [NodeType.HTTP_REQUEST]: makeNotImplementedExecutor(
    NODE_TYPE_LABELS[NodeType.HTTP_REQUEST],
  ),
  [NodeType.OPENAI]: makeNotImplementedExecutor(NODE_TYPE_LABELS[NodeType.OPENAI]),
  [NodeType.ANTHROPIC]: makeNotImplementedExecutor(
    NODE_TYPE_LABELS[NodeType.ANTHROPIC],
  ),
  [NodeType.GEMINI]: makeNotImplementedExecutor(NODE_TYPE_LABELS[NodeType.GEMINI]),
  [NodeType.DISCORD]: makeNotImplementedExecutor(
    NODE_TYPE_LABELS[NodeType.DISCORD],
  ),
  [NodeType.SLACK]: makeNotImplementedExecutor(NODE_TYPE_LABELS[NodeType.SLACK]),
};

export function getExecutor(type: NodeType): NodeExecutor {
  const executor = executorRegistry[type];
  if (!executor) {
    throw new Error(`No executor registered for NodeType "${type}"`);
  }
  return executor;
}
