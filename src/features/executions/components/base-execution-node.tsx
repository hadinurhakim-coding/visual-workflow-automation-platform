"use client";

import { useState, type ReactNode } from "react";
import { type NodeProps } from "@xyflow/react";
import { WorkflowNode } from "@/components/workflow-node";

type Props = NodeProps & {
  icon?: ReactNode;
  name: string;
  description?: string;
  /**
   * Optional dialog. When provided, the node toolbar's "Settings" button opens it
   * and the dialog can write back to the node's `data` via the `onSubmit` it owns.
   */
  dialog?: (open: boolean, onOpenChange: (open: boolean) => void) => ReactNode;
};

export function BaseExecutionNode({
  icon,
  name,
  description,
  dialog,
  ...nodeProps
}: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <WorkflowNode
        {...nodeProps}
        icon={icon}
        name={name}
        description={description}
        onSettings={dialog ? () => setOpen(true) : undefined}
      />
      {dialog ? dialog(open, setOpen) : null}
    </>
  );
}
