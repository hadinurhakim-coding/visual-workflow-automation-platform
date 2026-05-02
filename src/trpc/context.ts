// src/trpc/context.ts
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function createTRPCContext() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return {
    auth: session,
  };
}