"use client";

import { memo, useState } from "react";
import { useReactFlow, type NodeProps } from "@xyflow/react";
import { Sparkles } from "lucide-react";
import { WorkflowNode } from "@/components/workflow-node";
import { AnthropicDialog } from "./dialog";
import type { AnthropicData } from "./executor";

export const AnthropicNode = memo((props: NodeProps) => {
  const [open, setOpen] = useState(false);
  const { setNodes } = useReactFlow();
  const data = (props.data ?? {}) as AnthropicData;

  const description = data.userPrompt
    ? `${data.model ?? "claude-3-5-sonnet-latest"}: ${data.userPrompt.slice(0, 40)}${data.userPrompt.length > 40 ? "..." : ""}`
    : "Not configured";

  return (
    <>
      <WorkflowNode
        {...props}
        icon={<Sparkles className="h-4 w-4 text-orange-500" />}
        name="Anthropic"
        description={description}
        onSettings={() => setOpen(true)}
      />
      <AnthropicDialog
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

AnthropicNode.displayName = "AnthropicNode";
