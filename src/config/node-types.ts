import { NodeType } from "@prisma/client";

export const NODE_TYPE_LABELS: Record<NodeType, string> = {
  [NodeType.INITIAL]: "Initial",
  [NodeType.MANUAL_TRIGGER]: "Manual Trigger",
  [NodeType.HTTP_REQUEST]: "HTTP Request",
  [NodeType.GOOGLE_FORM_TRIGGER]: "Google Form Trigger",
  [NodeType.STRIPE_TRIGGER]: "Stripe Trigger",
  [NodeType.GEMINI]: "Gemini",
  [NodeType.OPENAI]: "OpenAI",
  [NodeType.ANTHROPIC]: "Anthropic",
  [NodeType.DISCORD]: "Discord",
  [NodeType.SLACK]: "Slack",
};

export const TRIGGER_NODE_TYPES = [
  NodeType.MANUAL_TRIGGER,
  NodeType.GOOGLE_FORM_TRIGGER,
  NodeType.STRIPE_TRIGGER,
] as const;

export const ACTION_NODE_TYPES = [
  NodeType.HTTP_REQUEST,
  NodeType.OPENAI,
  NodeType.ANTHROPIC,
  NodeType.GEMINI,
  NodeType.DISCORD,
  NodeType.SLACK,
] as const;
