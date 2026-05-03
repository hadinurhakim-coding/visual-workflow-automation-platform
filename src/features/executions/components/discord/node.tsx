"use client";

import { memo, useState } from "react";
import { useReactFlow, type NodeProps } from "@xyflow/react";
import { MessageCircle } from "lucide-react";
import { WorkflowNode } from "@/components/workflow-node";
import { DiscordDialog } from "./dialog";
import type { DiscordData } from "./executor";

export const DiscordNode = memo((props: NodeProps) => {
  const [open, setOpen] = useState(false);
  const { setNodes } = useReactFlow();
  const data = (props.data ?? {}) as DiscordData;

  const description = data.content
    ? `${data.content.slice(0, 50)}${data.content.length > 50 ? "..." : ""}`
    : "Not configured";

  return (
    <>
      <WorkflowNode
        {...props}
        icon={<MessageCircle className="h-4 w-4 text-indigo-500" />}
        name="Discord"
        description={description}
        onSettings={() => setOpen(true)}
      />
      <DiscordDialog
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

DiscordNode.displayName = "DiscordNode";
