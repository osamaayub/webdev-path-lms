import "server-only";
import { and, count, eq, gte, lt } from "drizzle-orm";
import { isAdminEmail } from "./auth-rules";
import { getDb } from "./db";
import { authAttempts, users } from "./db/schema";
import { hashPassword, verifyPassword } from "./password";

export const LIMITS = {
  signin: { max: 8, minutes: 15 }, // per email
  signup: { max: 5, minutes: 60 }, // per IP address
};

/** True when `key` already has `max` attempts in the window. Old rows are cleaned up as we go. */
export async function tooManyAttempts(key: string, kind: keyof typeof LIMITS) {
  const db = await getDb();
  const { max, minutes } = LIMITS[kind];
  const since = new Date(Date.now() - minutes * 60_000);
  await db.delete(authAttempts).where(and(eq(authAttempts.key, key), lt(authAttempts.createdAt, since)));
  const [row] = await db.select({ n: count() }).from(authAttempts).where(and(eq(authAttempts.key, key), gte(authAttempts.createdAt, since)));
  return Number(row?.n ?? 0) >= max;
}

export async function recordAttempt(key: string) {
  const db = await getDb();
  await db.insert(authAttempts).values({ key });
}

export async function clearAttempts(key: string) {
  const db = await getDb();
  await db.delete(authAttempts).where(eq(authAttempts.key, key));
}

export type CreateResult = { ok: true; id: string } | { ok: false; reason: "exists" | "reserved" };

/** Creates an email + password account. Admin emails can't be claimed this way (they must use GitHub or Google). */
export async function createPasswordUser(input: { name: string; email: string; password: string }): Promise<CreateResult> {
  if (isAdminEmail(input.email)) return { ok: false, reason: "reserved" };
  const db = await getDb();
  const passwordHash = await hashPassword(input.password);
  const [row] = await db.insert(users).values({ name: input.name, email: input.email, passwordHash }).onConflictDoNothing({ target: users.email }).returning({ id: users.id });
  return row ? { ok: true, id: row.id } : { ok: false, reason: "exists" };
}

/** Checks an email + password. Returns the public user fields, or null (same answer for every kind of failure). */
export async function checkPassword(email: string, password: string) {
  const db = await getDb();
  const [u] = await db.select().from(users).where(eq(users.email, email));
  const ok = await verifyPassword(password, u?.passwordHash);
  if (!u || !ok) return null;
  return { id: u.id, name: u.name, email: u.email, image: u.image };
}
