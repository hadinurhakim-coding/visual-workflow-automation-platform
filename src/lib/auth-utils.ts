// src/lib/auth-utils.ts
import { auth } from "./auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Require authentication. If no session exists, redirect to /login.
 * Returns the session if the user is logged in.
 */
export async function requireAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return session;
}

/**
 * Require NO authentication. If a session exists, redirect to /workflows.
 * Used on login/signup pages to bounce already-logged-in users away.
 */
export async function requireUnauth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/workflows");
  }

  return null;
}