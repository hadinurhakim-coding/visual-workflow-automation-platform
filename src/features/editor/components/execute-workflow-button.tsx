"use client";

import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useExecuteWorkflow } from "@/features/workflows/hooks/use-workflows";

export function ExecuteWorkflowButton({ workflowId }: { workflowId: string }) {
  const execute = useExecuteWorkflow();
  return (
    <Button
      size="sm"
      onClick={() => execute.mutate({ id: workflowId })}
      disabled={execute.isPending}
    >
      <Play className="mr-1 h-4 w-4" />
      {execute.isPending ? "Starting..." : "Execute"}
    </Button>
  );
}
