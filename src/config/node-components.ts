import { NodeType } from "@prisma/client";
import { InitialNode } from "@/components/initial-node";
import { GenericNode } from "@/components/generic-node";
import { HttpRequestNode } from "@/features/executions/components/http-request/node";
import { OpenAiNode } from "@/features/executions/components/openai/node";
import { AnthropicNode } from "@/features/executions/components/anthropic/node";
import { GeminiNode } from "@/features/executions/components/gemini/node";
import { DiscordNode } from "@/features/executions/components/discord/node";
import { SlackNode } from "@/features/executions/components/slack/node";

// Maps NodeType (DB enum) → React component rendered on the canvas.
// Triggers (Manual / Google Form / Stripe) still use GenericNode until Tahap 6
// builds their dedicated UI. All action nodes have real implementations.
export const nodeComponents = {
  [NodeType.INITIAL]: InitialNode,
  [NodeType.MANUAL_TRIGGER]: GenericNode,
  [NodeType.GOOGLE_FORM_TRIGGER]: GenericNode,
  [NodeType.STRIPE_TRIGGER]: GenericNode,
  [NodeType.HTTP_REQUEST]: HttpRequestNode,
  [NodeType.OPENAI]: OpenAiNode,
  [NodeType.ANTHROPIC]: AnthropicNode,
  [NodeType.GEMINI]: GeminiNode,
  [NodeType.DISCORD]: DiscordNode,
  [NodeType.SLACK]: SlackNode,
} as const;
