"use client";

import { useQueryStates } from "nuqs";
import { workflowsParams } from "../params";

export function useWorkflowsParams() {
  return useQueryStates(workflowsParams);
}
