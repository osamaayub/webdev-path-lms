// Applies SQL migrations from ./drizzle before the app builds.
// Safe to run repeatedly: Drizzle records what it already applied.
// Uses Neon's direct (unpooled) URL when available, as Neon recommends for migrations.
// No database URL (for example a fork with no database yet) means nothing to do.

const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;

if (!url) {
  console.log("[migrate] DATABASE_URL not set, skipping (the site runs read-only).");
  process.exit(0);
}

const migrationsFolder = new URL("../drizzle", import.meta.url).pathname;

if (url.startsWith("pglite://")) {
  const { PGlite } = await import("@electric-sql/pglite");
  const { drizzle } = await import("drizzle-orm/pglite");
  const { migrate } = await import("drizzle-orm/pglite/migrator");
  const dir = url.slice("pglite://".length);
  if (dir !== "memory") (await import("node:fs")).mkdirSync(dir, { recursive: true });
  const client = new PGlite(dir === "memory" ? undefined : dir);
  await migrate(drizzle(client), { migrationsFolder });
  await client.close();
} else {
  const { default: pg } = await import("pg");
  const { drizzle } = await import("drizzle-orm/node-postgres");
  const { migrate } = await import("drizzle-orm/node-postgres/migrator");
  const client = new pg.Client({ connectionString: url });
  await client.connect();
  try {
    await migrate(drizzle(client), { migrationsFolder });
  } finally {
    await client.end();
  }
}

console.log("[migrate] database is up to date.");
