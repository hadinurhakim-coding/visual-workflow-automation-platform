"use client";

import { useQueryStates } from "nuqs";
import { credentialsParams } from "../params";

export function useCredentialsParams() {
  return useQueryStates(credentialsParams);
}
