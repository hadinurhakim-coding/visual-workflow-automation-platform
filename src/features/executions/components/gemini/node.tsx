"use client";

import { memo, useState } from "react";
import { useReactFlow, type NodeProps } from "@xyflow/react";
import { Sparkles } from "lucide-react";
import { WorkflowNode } from "@/components/workflow-node";
import { GeminiDialog } from "./dialog";
import type { GeminiData } from "./executor";

export const GeminiNode = memo((props: NodeProps) => {
  const [open, setOpen] = useState(false);
  const { setNodes } = useReactFlow();
  const data = (props.data ?? {}) as GeminiData;

  const description = data.userPrompt
    ? `${data.model ?? "gemini-2.0-flash"}: ${data.userPrompt.slice(0, 40)}${data.userPrompt.length > 40 ? "..." : ""}`
    : "Not configured";

  return (
    <>
      <WorkflowNode
        {...props}
        icon={<Sparkles className="h-4 w-4 text-blue-500" />}
        name="Gemini"
        description={description}
        onSettings={() => setOpen(true)}
      />
      <GeminiDialog
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

GeminiNode.displayName = "GeminiNode";
