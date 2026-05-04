"use client";

import { memo, useState } from "react";
import { useParams } from "next/navigation";
import { type NodeProps } from "@xyflow/react";
import { CreditCard } from "lucide-react";
import { WorkflowNode } from "@/components/workflow-node";
import { StripeTriggerDialog } from "./dialog";

export const StripeTriggerNode = memo((props: NodeProps) => {
  const [open, setOpen] = useState(false);
  const params = useParams<{ id: string }>();
  const workflowId = params.id;

  return (
    <>
      <WorkflowNode
        {...props}
        icon={<CreditCard className="h-4 w-4 text-purple-500" />}
        name="Stripe Trigger"
        description="Stripe webhook event"
        showTargetHandle={false}
        onSettings={() => setOpen(true)}
      />
      {workflowId ? (
        <StripeTriggerDialog
          open={open}
          onOpenChange={setOpen}
          workflowId={workflowId}
        />
      ) : null}
    </>
  );
});

StripeTriggerNode.displayName = "StripeTriggerNode";
