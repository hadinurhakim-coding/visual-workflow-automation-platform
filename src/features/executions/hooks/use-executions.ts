"use client";

import { trpc } from "@/trpc/client";
import { useExecutionsParams } from "./use-executions-params";

export function useExecutions() {
  const [params] = useExecutionsParams();
  return trpc.executions.getMany.useQuery(params, {
    // Auto-refresh while user watches the list — picks up RUNNING → SUCCESS/FAILED transitions.
    refetchInterval: 3000,
  });
}

export function useExecution(id: string) {
  return trpc.executions.getOne.useQuery(
    { id },
    {
      // Refresh detail while it's still running. Once SUCCESS/FAILED, no need to keep polling.
      refetchInterval: (query) =>
        query.state.data?.status === "RUNNING" ? 2000 : false,
    },
  );
}
