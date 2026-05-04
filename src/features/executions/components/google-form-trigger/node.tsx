"use client";

import { memo, useState } from "react";
import { useParams } from "next/navigation";
import { type NodeProps } from "@xyflow/react";
import { ClipboardList } from "lucide-react";
import { WorkflowNode } from "@/components/workflow-node";
import { GoogleFormTriggerDialog } from "./dialog";

export const GoogleFormTriggerNode = memo((props: NodeProps) => {
  const [open, setOpen] = useState(false);
  // We need workflowId to construct the webhook URL. The node lives inside
  // /workflows/[id], so we read it from the route params.
  const params = useParams<{ id: string }>();
  const workflowId = params.id;

  return (
    <>
      <WorkflowNode
        {...props}
        icon={<ClipboardList className="h-4 w-4 text-violet-500" />}
        name="Google Form Trigger"
        description="Submit a form to start"
        showTargetHandle={false}
        onSettings={() => setOpen(true)}
      />
      {workflowId ? (
        <GoogleFormTriggerDialog
          open={open}
          onOpenChange={setOpen}
          workflowId={workflowId}
        />
      ) : null}
    </>
  );
});

GoogleFormTriggerNode.displayName = "GoogleFormTriggerNode";
