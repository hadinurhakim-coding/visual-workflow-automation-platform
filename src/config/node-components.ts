import { NodeType } from "@prisma/client";
import { InitialNode } from "@/components/initial-node";
import { GenericNode } from "@/components/generic-node";

// Maps NodeType (DB enum) → React component rendered on the canvas.
// Tahap 3: only INITIAL has its own placeholder UI; the rest use GenericNode
// until their dedicated node.tsx is built in Tahap 6 / 7.
export const nodeComponents = {
  [NodeType.INITIAL]: InitialNode,
  [NodeType.MANUAL_TRIGGER]: GenericNode,
  [NodeType.HTTP_REQUEST]: GenericNode,
  [NodeType.GOOGLE_FORM_TRIGGER]: GenericNode,
  [NodeType.STRIPE_TRIGGER]: GenericNode,
  [NodeType.GEMINI]: GenericNode,
  [NodeType.OPENAI]: GenericNode,
  [NodeType.ANTHROPIC]: GenericNode,
  [NodeType.DISCORD]: GenericNode,
  [NodeType.SLACK]: GenericNode,
} as const;
