"use client";

import { type ReactNode } from "react";
import {
  NodeToolbar,
  Position,
  useReactFlow,
  type NodeProps,
} from "@xyflow/react";
import { Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BaseHandle } from "@/components/react-flow/base-handle";
import { BaseNode } from "@/components/react-flow/base-node";
import {
  NodeStatusIndicator,
  type NodeStatus,
} from "@/components/react-flow/node-status-indicator";
import { cn } from "@/lib/utils";

type Props = NodeProps & {
  icon?: ReactNode;
  name: string;
  description?: string;
  status?: NodeStatus;
  showSourceHandle?: boolean;
  showTargetHandle?: boolean;
  onSettings?: () => void;
};

export function WorkflowNode({
  id,
  selected,
  icon,
  name,
  description,
  status = "initial",
  showSourceHandle = true,
  showTargetHandle = true,
  onSettings,
}: Props) {
  const { setNodes, setEdges } = useReactFlow();

  const handleDelete = () => {
    setNodes((nodes) => nodes.filter((n) => n.id !== id));
    setEdges((edges) => edges.filter((e) => e.source !== id && e.target !== id));
  };

  return (
    <NodeStatusIndicator status={status}>
      <NodeToolbar isVisible={selected} className="flex gap-1">
        {onSettings ? (
          <Button size="icon" variant="secondary" className="h-7 w-7" onClick={onSettings}>
            <Settings className="h-3.5 w-3.5" />
          </Button>
        ) : null}
        <Button
          size="icon"
          variant="destructive"
          className="h-7 w-7"
          onClick={handleDelete}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </NodeToolbar>

      <BaseNode selected={selected}>
        {showTargetHandle ? <BaseHandle type="target" position={Position.Left} /> : null}

        {icon ? <div className="shrink-0">{icon}</div> : null}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{name}</p>
          {description ? (
            <p
              className={cn(
                "text-muted-foreground truncate text-xs",
                "max-w-48",
              )}
            >
              {description}
            </p>
          ) : null}
        </div>

        {showSourceHandle ? <BaseHandle type="source" position={Position.Right} /> : null}
      </BaseNode>
    </NodeStatusIndicator>
  );
}
