"use client";

import { memo, useState } from "react";
import { useReactFlow, type NodeProps } from "@xyflow/react";
import { Hash } from "lucide-react";
import { WorkflowNode } from "@/components/workflow-node";
import { SlackDialog } from "./dialog";
import type { SlackData } from "./executor";

export const SlackNode = memo((props: NodeProps) => {
  const [open, setOpen] = useState(false);
  const { setNodes } = useReactFlow();
  const data = (props.data ?? {}) as SlackData;

  const description = data.text
    ? `${data.text.slice(0, 50)}${data.text.length > 50 ? "..." : ""}`
    : "Not configured";

  return (
    <>
      <WorkflowNode
        {...props}
        icon={<Hash className="h-4 w-4 text-pink-500" />}
        name="Slack"
        description={description}
        onSettings={() => setOpen(true)}
      />
      <SlackDialog
        open={open}
        onOpenChange={setOpen}
        defaultValues={data}
        onSubmit={(values) => {
          setNodes((nodes) =>
            nodes.map((n) =>
              n.id === props.id
                ? { ...n, data: { ...n.data, ...values } }
                : n,
            ),
          );
          setOpen(false);
        }}
      />
    </>
  );
});

SlackNode.displayName = "SlackNode";
