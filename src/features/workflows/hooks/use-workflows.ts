"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { trpc } from "@/trpc/client";
import { useWorkflowsParams } from "./use-workflows-params";

// ── Queries ────────────────────────────────────────────

export function useWorkflows() {
  const [params] = useWorkflowsParams();
  return trpc.workflows.getMany.useQuery(params);
}

export function useWorkflow(id: string) {
  return trpc.workflows.getOne.useQuery({ id });
}

// ── Mutations ──────────────────────────────────────────

export function useCreateWorkflow() {
  const router = useRouter();
  const utils = trpc.useUtils();
  return trpc.workflows.create.useMutation({
    onSuccess: (workflow) => {
      toast.success("Workflow created");
      utils.workflows.getMany.invalidate();
      router.push(`/workflows/${workflow.id}`);
    },
    onError: (err) => toast.error(err.message),
  });
}

export function useRemoveWorkflow() {
  const utils = trpc.useUtils();
  return trpc.workflows.remove.useMutation({
    onSuccess: () => {
      toast.success("Workflow deleted");
      utils.workflows.getMany.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });
}

export function useUpdateWorkflow() {
  const utils = trpc.useUtils();
  return trpc.workflows.update.useMutation({
    onSuccess: (_, variables) => {
      toast.success("Workflow saved");
      utils.workflows.getOne.invalidate({ id: variables.id });
      utils.workflows.getMany.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });
}

export function useUpdateWorkflowName() {
  const utils = trpc.useUtils();
  return trpc.workflows.updateName.useMutation({
    onSuccess: (_, variables) => {
      utils.workflows.getOne.invalidate({ id: variables.id });
      utils.workflows.getMany.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });
}

export function useExecuteWorkflow() {
  return trpc.workflows.execute.useMutation({
    onSuccess: () => toast.success("Workflow execution started"),
    onError: (err) => toast.error(err.message),
  });
}
