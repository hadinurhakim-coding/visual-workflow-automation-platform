"use client";

import { useState } from "react";
import Link from "next/link";
import { useAtomValue } from "jotai";
import { ChevronLeft, Save } from "lucide-react";
import { type Node, type Edge } from "@xyflow/react";
import { NodeType } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { editorAtom } from "@/features/editor/store/atoms";
import {
  useUpdateWorkflow,
  useUpdateWorkflowName,
} from "@/features/workflows/hooks/use-workflows";

type Props = {
  workflowId: string;
  name: string;
};

export function EditorHeader({ workflowId, name }: Props) {
  const editor = useAtomValue(editorAtom);
  const updateName = useUpdateWorkflowName();
  const updateWorkflow = useUpdateWorkflow();
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(name);

  const startEditing = () => {
    setDraftName(name);
    setEditing(true);
  };

  const commitName = async () => {
    const trimmed = draftName.trim();
    if (trimmed && trimmed !== name) {
      await updateName.mutateAsync({ id: workflowId, name: trimmed });
    }
    setEditing(false);
  };

  const handleSave = () => {
    if (!editor) return;
    const nodes: Node[] = editor.getNodes();
    const edges: Edge[] = editor.getEdges();

    updateWorkflow.mutate({
      id: workflowId,
      nodes: nodes.map((n) => ({
        id: n.id,
        type: (n.type as NodeType) ?? NodeType.INITIAL,
        position: n.position,
        data: (n.data ?? {}) as Record<string, unknown>,
      })),
      edges: edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        sourceHandle: e.sourceHandle ?? null,
        targetHandle: e.targetHandle ?? null,
      })),
    });
  };

  return (
    <div className="flex items-center gap-3 border-b px-4 py-2">
      <Button asChild variant="ghost" size="sm">
        <Link href="/workflows">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Workflows
        </Link>
      </Button>

      {editing ? (
        <Input
          autoFocus
          value={draftName}
          onChange={(e) => setDraftName(e.target.value)}
          onBlur={commitName}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitName();
            if (e.key === "Escape") setEditing(false);
          }}
          className="max-w-xs"
        />
      ) : (
        <button
          type="button"
          onClick={startEditing}
          className="hover:bg-accent/40 rounded-md px-2 py-1 font-medium transition-colors"
        >
          {name}
        </button>
      )}

      <div className="ml-auto">
        <Button
          size="sm"
          onClick={handleSave}
          disabled={!editor || updateWorkflow.isPending}
        >
          <Save className="mr-1 h-4 w-4" />
          {updateWorkflow.isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}
