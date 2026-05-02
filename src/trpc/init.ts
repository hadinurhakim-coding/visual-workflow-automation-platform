// src/trpc/init.ts
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// Create the tRPC instance with superjson transformer
const t = initTRPC.create({
  transformer: superjson,
});

// Export reusable utilities
export const createTRPCRouter = t.router;
export const baseProcedure = t.procedure;

// ── Procedure: logged-in user required ──
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      ...ctx,
      auth: session,
    },
  });
});