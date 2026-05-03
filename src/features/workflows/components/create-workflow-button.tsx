"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateWorkflow } from "../hooks/use-workflows";

export function CreateWorkflowButton() {
  const create = useCreateWorkflow();
  return (
    <Button onClick={() => create.mutate()} disabled={create.isPending}>
      <Plus className="mr-1 h-4 w-4" />
      New Workflow
    </Button>
  );
}
