// src/trpc/routers/_app.ts
import { createTRPCRouter } from "../init";

// We'll add sub-routers here as we build features
// For now, it's an empty root router

export const appRouter = createTRPCRouter({});

export type AppRouter = typeof appRouter;