import { NonRetriableError } from "inngest";
import { type NodeExecutor } from "../types";

/**
 * Stub executor for node types whose runtime hasn't been built yet (Tahap 7).
 * Throws a non-retriable error so Inngest stops the run immediately.
 */
export function makeNotImplementedExecutor(label: string): NodeExecutor {
  return async () => {
    throw new NonRetriableError(
      `Executor for "${label}" is not implemented yet. ` +
        `It will be added in Tahap 7 (action nodes).`,
    );
  };
}
