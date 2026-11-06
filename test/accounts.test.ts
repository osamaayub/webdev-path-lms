import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { beforeAll, describe, expect, it } from "vitest";
import { signInSchema, signUpSchema } from "@/features/auth/schemas";
import { checkPassword, createPasswordUser, LIMITS, recordAttempt, tooManyAttempts } from "@/server/accounts";
import { setDbForTests, type Db } from "@/server/db";
import * as schema from "@/server/db/schema";
import { hashPassword, verifyPassword } from "@/server/password";

// Email + password accounts against a real Postgres (PGlite) with migrations applied.

beforeAll(async () => {
  process.env.ADMIN_EMAILS = "boss@example.com";
  const pg = drizzle(new PGlite(), { schema });
  await migrate(pg, { migrationsFolder: "./drizzle" });
  setDbForTests(pg as unknown as Db);
  await pg.insert(schema.users).values({ id: "github-user", name: "Gita", email: "gita@example.com" });
});

describe("password hashing", () => {
  it("never stores the password and verifies only the right one", async () => {
    const h = await hashPassword("correct horse 42");
    expect(h).toMatch(/^scrypt\$16384\$8\$1\$/);
    expect(h).not.toContain("correct horse");
    expect(await verifyPassword("correct horse 42", h)).toBe(true);
    expect(await verifyPassword("correct horse 43", h)).toBe(false);
  });

  it("uses a fresh salt every time", async () => {
    expect(await hashPassword("same pass 1")).not.toBe(await hashPassword("same pass 1"));
  });

  it("rejects accounts with no password (GitHub/Google users)", async () => {
    expect(await verifyPassword("anything 1", null)).toBe(false);
  });
});

describe("sign-up validation", () => {
  it("requires a real email and a password with a letter and a number", () => {
    expect(signUpSchema.safeParse({ name: "Ana", email: "not-an-email", password: "abc" }).success).toBe(false);
    expect(signUpSchema.safeParse({ name: "Ana", email: "ana@example.com", password: "onlyletters" }).success).toBe(false);
    expect(signUpSchema.safeParse({ name: "Ana", email: "ana@example.com", password: "12345678" }).success).toBe(false);
    const ok = signUpSchema.safeParse({ name: " Ana ", email: " ANA@Example.com ", password: "learning2026" });
    expect(ok.success && ok.data).toEqual({ name: "Ana", email: "ana@example.com", password: "learning2026" });
  });

  it("caps password length (scrypt input stays small)", () => {
    expect(signInSchema.safeParse({ email: "a@b.co", password: "x".repeat(201) }).success).toBe(false);
  });
});

describe("password accounts", () => {
  it("creates an account and signs in with the right password only", async () => {
    expect((await createPasswordUser({ name: "Ana", email: "ana@example.com", password: "learning2026" })).ok).toBe(true);
    expect(await checkPassword("ana@example.com", "learning2026")).toMatchObject({ email: "ana@example.com", name: "Ana" });
    expect(await checkPassword("ana@example.com", "wrong2026")).toBeNull();
    expect(await checkPassword("nobody@example.com", "learning2026")).toBeNull();
  });

  it("never returns the password hash to the session", async () => {
    const u = await checkPassword("ana@example.com", "learning2026");
    expect(Object.keys(u ?? {}).sort()).toEqual(["email", "id", "image", "name"]);
  });

  it("refuses an email that already has an account, including GitHub/Google ones", async () => {
    expect(await createPasswordUser({ name: "Ana 2", email: "ana@example.com", password: "another2026" })).toEqual({ ok: false, reason: "exists" });
    expect(await createPasswordUser({ name: "Not Gita", email: "gita@example.com", password: "takeover2026" })).toEqual({ ok: false, reason: "exists" });
    expect(await checkPassword("gita@example.com", "takeover2026")).toBeNull();
  });

  it("won't let anyone claim an admin email with a password", async () => {
    expect(await createPasswordUser({ name: "Boss", email: "boss@example.com", password: "letmein2026" })).toEqual({ ok: false, reason: "reserved" });
  });
});

describe("rate limits", () => {
  it("blocks after the limit and counts each key separately", async () => {
    const key = "signin:limit@example.com";
    for (let i = 0; i < LIMITS.signin.max; i++) {
      expect(await tooManyAttempts(key, "signin")).toBe(false);
      await recordAttempt(key);
    }
    expect(await tooManyAttempts(key, "signin")).toBe(true);
    expect(await tooManyAttempts("signin:other@example.com", "signin")).toBe(false);
  });
});
