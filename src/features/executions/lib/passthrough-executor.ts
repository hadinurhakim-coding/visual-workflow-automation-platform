import { type NodeExecutor } from "../types";

/**
 * Passthrough — used for triggers and the INITIAL placeholder.
 * Returns the rolling context unchanged so downstream nodes inherit it.
 */
export const passthroughExecutor: NodeExecutor = async ({ context }) => context;
