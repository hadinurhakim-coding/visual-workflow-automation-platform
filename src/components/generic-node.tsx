"use client";

import { type NodeProps } from "@xyflow/react";
import { Box } from "lucide-react";
import { WorkflowNode } from "@/components/workflow-node";
import { NODE_TYPE_LABELS } from "@/config/node-types";

export function GenericNode(props: NodeProps) {
  const label = props.type
    ? (NODE_TYPE_LABELS[props.type as keyof typeof NODE_TYPE_LABELS] ?? props.type)
    : "Node";

  return (
    <WorkflowNode
      {...props}
      icon={<Box className="text-muted-foreground h-4 w-4" />}
      name={label}
      description="Not yet configured"
    />
  );
}
