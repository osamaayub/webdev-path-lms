import "server-only";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import * as schema from "./schema";

export type Db = PgDatabase<PgQueryResultHKT, typeof schema>;

// Kept on globalThis so every server bundle (route handlers, server actions, pages) and
// dev hot reloads share one client. Two PGlite instances on one folder would not see each other's writes.
const store = globalThis as unknown as { __lmsDb?: Promise<Db> };

/** True when a database is configured. Without one the site still serves the course, read-only. */
export const hasDatabase = () => Boolean(process.env.DATABASE_URL);

/**
 * One database client per server instance.
 * - Production (Vercel + Neon): node-postgres Pool on Neon's pooled URL, attached to Vercel
 *   Fluid compute with attachDatabasePool so idle connections close before the instance sleeps.
 *   This is the driver Neon recommends for Vercel.
 * - Local dev and tests: PGlite, real Postgres compiled to WASM, when DATABASE_URL starts with "pglite://".
 */
export function getDb(): Promise<Db> {
  store.__lmsDb ??= connect();
  return store.__lmsDb;
}

async function connect(): Promise<Db> {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");

  if (url.startsWith("pglite://")) {
    const { PGlite } = await import("@electric-sql/pglite");
    const { drizzle } = await import("drizzle-orm/pglite");
    const dir = url.slice("pglite://".length);
    return drizzle(new PGlite(dir === "memory" ? undefined : dir), { schema }) as unknown as Db;
  }

  const { Pool } = await import("pg");
  const { drizzle } = await import("drizzle-orm/node-postgres");
  const { attachDatabasePool } = await import("@vercel/functions");
  const pool = new Pool({ connectionString: url, max: 5, idleTimeoutMillis: 5_000, connectionTimeoutMillis: 5_000 });
  attachDatabasePool(pool);
  return drizzle(pool, { schema }) as unknown as Db;
}

/** Test hook: use a specific database (e.g. in-memory PGlite). */
export function setDbForTests(db: Db) {
  store.__lmsDb = Promise.resolve(db);
}

export { schema };
