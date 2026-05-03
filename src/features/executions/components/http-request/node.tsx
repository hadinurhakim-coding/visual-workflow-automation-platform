"use client";

import { memo, useState } from "react";
import { useReactFlow, type NodeProps } from "@xyflow/react";
import { Globe } from "lucide-react";
import { WorkflowNode } from "@/components/workflow-node";
import { HttpRequestDialog } from "./dialog";
import type { HttpRequestData } from "./executor";

export const HttpRequestNode = memo((props: NodeProps) => {
  const [open, setOpen] = useState(false);
  const { setNodes } = useReactFlow();
  const data = (props.data ?? {}) as HttpRequestData;

  const description = data.endpoint
    ? `${data.method ?? "GET"} ${data.endpoint}`
    : "Not configured";

  return (
    <>
      <WorkflowNode
        {...props}
        icon={<Globe className="h-4 w-4 text-sky-500" />}
        name="HTTP Request"
        description={description}
        onSettings={() => setOpen(true)}
      />
      <HttpRequestDialog
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

HttpRequestNode.displayName = "HttpRequestNode";
