"use client";

import { useQueryStates } from "nuqs";
import { executionsParams } from "../params";

export function useExecutionsParams() {
  return useQueryStates(executionsParams);
}
