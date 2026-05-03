import { NodeType } from "@prisma/client";
import { type NodeExecutor } from "../types";
import { passthroughExecutor } from "./passthrough-executor";
import { httpRequestExecutor } from "../components/http-request/executor";
import { openAiExecutor } from "../components/openai/executor";
import { anthropicExecutor } from "../components/anthropic/executor";
import { geminiExecutor } from "../components/gemini/executor";
import { discordExecutor } from "../components/discord/executor";
import { slackExecutor } from "../components/slack/executor";

// Triggers + INITIAL pass through. Action nodes have real executors.
export const executorRegistry: Record<NodeType, NodeExecutor> = {
  [NodeType.INITIAL]: passthroughExecutor,
  [NodeType.MANUAL_TRIGGER]: passthroughExecutor,
  [NodeType.GOOGLE_FORM_TRIGGER]: passthroughExecutor,
  [NodeType.STRIPE_TRIGGER]: passthroughExecutor,
  [NodeType.HTTP_REQUEST]: httpRequestExecutor as NodeExecutor,
  [NodeType.OPENAI]: openAiExecutor as NodeExecutor,
  [NodeType.ANTHROPIC]: anthropicExecutor as NodeExecutor,
  [NodeType.GEMINI]: geminiExecutor as NodeExecutor,
  [NodeType.DISCORD]: discordExecutor as NodeExecutor,
  [NodeType.SLACK]: slackExecutor as NodeExecutor,
};

export function getExecutor(type: NodeType): NodeExecutor {
  const executor = executorRegistry[type];
  if (!executor) {
    throw new Error(`No executor registered for NodeType "${type}"`);
  }
  return executor;
}
