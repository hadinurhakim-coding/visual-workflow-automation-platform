"use client";

import { ErrorView, LoadingView } from "@/components/entity-components";
import { Editor } from "@/features/editor/components/editor";
import { EditorHeader } from "@/features/editor/components/editor-header";
import { useWorkflow } from "../hooks/use-workflows";

export function WorkflowDetail({ id }: { id: string }) {
  const query = useWorkflow(id);

  if (query.isLoading) return <LoadingView label="Loading workflow..." />;
  if (query.isError) return <ErrorView message={query.error.message} />;
  if (!query.data) return null;

  const workflow = query.data;

  return (
    <div className="-m-6 flex h-screen flex-col">
      <EditorHeader workflowId={workflow.id} name={workflow.name} />
      <div className="flex-1">
        <Editor
          workflowId={workflow.id}
          initialNodes={workflow.nodes}
          initialEdges={workflow.edges}
        />
      </div>
    </div>
  );
}
