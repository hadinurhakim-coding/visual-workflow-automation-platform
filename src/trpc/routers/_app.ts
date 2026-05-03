// src/trpc/routers/_app.ts
import { createTRPCRouter } from "../init";
import { workflowsRouter } from "@/features/workflows/server/routers";
import { executionsRouter } from "@/features/executions/server/routers";
import { credentialsRouter } from "@/features/credentials/server/routers";

export const appRouter = createTRPCRouter({
  workflows: workflowsRouter,
  executions: executionsRouter,
  credentials: credentialsRouter,
});

export type AppRouter = typeof appRouter;