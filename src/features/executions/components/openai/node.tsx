"use client";

import { memo, useState } from "react";
import { useReactFlow, type NodeProps } from "@xyflow/react";
import { Sparkles } from "lucide-react";
import { WorkflowNode } from "@/components/workflow-node";
import { OpenAiDialog } from "./dialog";
import type { OpenAiData } from "./executor";

export const OpenAiNode = memo((props: NodeProps) => {
  const [open, setOpen] = useState(false);
  const { setNodes } = useReactFlow();
  const data = (props.data ?? {}) as OpenAiData;

  const description = data.userPrompt
    ? `${data.model ?? "gpt-4o-mini"}: ${data.userPrompt.slice(0, 40)}${data.userPrompt.length > 40 ? "..." : ""}`
    : "Not configured";

  return (
    <>
      <WorkflowNode
        {...props}
        icon={<Sparkles className="h-4 w-4 text-emerald-500" />}
        name="OpenAI"
        description={description}
        onSettings={() => setOpen(true)}
      />
      <OpenAiDialog
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

OpenAiNode.displayName = "OpenAiNode";
