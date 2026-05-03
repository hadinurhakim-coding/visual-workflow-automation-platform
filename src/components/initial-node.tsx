"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { type NodeProps } from "@xyflow/react";
import { PlaceholderNode } from "@/components/react-flow/placeholder-node";
import { NodeSelector } from "@/components/node-selector";

export function InitialNode(props: NodeProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <PlaceholderNode onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        Add a trigger to start
      </PlaceholderNode>
      <NodeSelector
        open={open}
        onOpenChange={setOpen}
        replaceNodeId={props.id}
      />
    </>
  );
}
