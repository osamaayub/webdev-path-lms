import "server-only";
import { connection } from "next/server";
import { cache } from "react";
import { auth, authConfigured, isAdminEmail } from "./auth";

export type Viewer = { id: string; name: string | null; email: string | null; image: string | null; isAdmin: boolean };

/** The signed-in user for this request, or null. Cached per request. */
export const getViewer = cache(async (): Promise<Viewer | null> => {
  await connection(); // per-request data: never prerender the session
  if (!authConfigured()) return null;
  const session = await auth();
  const u = session?.user;
  if (!u?.id) return null;
  // Admin needs an allow-listed email AND a verified sign-in: never an email + password session,
  // whose email nobody has confirmed. (Sessions from before passwords existed carry no method.)
  const method = (u as { method?: string }).method;
  const verified = method !== "password";
  return { id: u.id, name: u.name ?? null, email: u.email ?? null, image: u.image ?? null, isAdmin: verified && isAdminEmail(u.email) };
});

export class AuthError extends Error {
  constructor(public readonly code: "UNAUTHENTICATED" | "FORBIDDEN") {
    super(code === "UNAUTHENTICATED" ? "Sign in to do this." : "You don't have access to this.");
  }
}

/** Every server action that touches learner data starts with one of these. */
export async function requireUser(): Promise<Viewer> {
  const v = await getViewer();
  if (!v) throw new AuthError("UNAUTHENTICATED");
  return v;
}

export async function requireAdmin(): Promise<Viewer> {
  const v = await requireUser();
  if (!v.isAdmin) throw new AuthError("FORBIDDEN");
  return v;
}
