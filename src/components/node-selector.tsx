"use client";

import cuid from "cuid";
import { useReactFlow } from "@xyflow/react";
import { NodeType } from "@prisma/client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  ACTION_NODE_TYPES,
  NODE_TYPE_LABELS,
  TRIGGER_NODE_TYPES,
} from "@/config/node-types";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** If provided, the new node replaces the node with this id (used by InitialNode). */
  replaceNodeId?: string;
};

export function NodeSelector({ open, onOpenChange, replaceNodeId }: Props) {
  const { screenToFlowPosition, getNodes, setNodes } = useReactFlow();

  const handlePick = (type: NodeType) => {
    // Refuse a second MANUAL_TRIGGER (workflow can only have one entry point of that kind)
    if (type === NodeType.MANUAL_TRIGGER) {
      const exists = getNodes().some((n) => n.type === NodeType.MANUAL_TRIGGER);
      if (exists) {
        toast.error("A Manual Trigger already exists in this workflow");
        return;
      }
    }

    const newNode = {
      id: cuid(),
      type,
      data: {},
      position: replaceNodeId
        ? // Replace at the same position as the node we're replacing
          getNodes().find((n) => n.id === replaceNodeId)?.position ?? { x: 0, y: 0 }
        : // Otherwise drop near the viewport center with a small offset
          screenToFlowPosition({
            x: window.innerWidth / 2 + (Math.random() - 0.5) * 80,
            y: window.innerHeight / 2 + (Math.random() - 0.5) * 80,
          }),
    };

    setNodes((nodes) =>
      replaceNodeId
        ? nodes.map((n) => (n.id === replaceNodeId ? newNode : n))
        : [...nodes, newNode],
    );

    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle>Add a node</SheetTitle>
          <SheetDescription>
            Pick a trigger to start the workflow, or an action to add to it.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-4 pb-6">
          <div>
            <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
              Triggers
            </p>
            <div className="flex flex-col gap-1">
              {TRIGGER_NODE_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handlePick(type)}
                  className="hover:bg-accent rounded-md border px-3 py-2 text-left text-sm transition-colors"
                >
                  {NODE_TYPE_LABELS[type]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
              Actions
            </p>
            <div className="flex flex-col gap-1">
              {ACTION_NODE_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handlePick(type)}
                  className="hover:bg-accent rounded-md border px-3 py-2 text-left text-sm transition-colors"
                >
                  {NODE_TYPE_LABELS[type]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
