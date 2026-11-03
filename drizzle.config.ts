import { defineConfig } from "drizzle-kit";

// `npm run db:generate` turns schema changes into SQL migrations in ./drizzle.
// Migrations are applied by scripts/migrate.mjs before every build.
export default defineConfig({
  schema: "./src/server/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
});
