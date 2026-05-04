"use client";

import { memo } from "react";
import { type NodeProps } from "@xyflow/react";
import { Play } from "lucide-react";
import { WorkflowNode } from "@/components/workflow-node";

export const ManualTriggerNode = memo((props: NodeProps) => {
  return (
    <WorkflowNode
      {...props}
      icon={<Play className="h-4 w-4 text-emerald-600" />}
      name="Manual Trigger"
      description="Click Execute below to run"
      // No target handle — triggers are entry points (no upstream).
      showTargetHandle={false}
    />
  );
});

ManualTriggerNode.displayName = "ManualTriggerNode";
