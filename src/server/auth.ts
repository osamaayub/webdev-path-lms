import "server-only";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import NextAuth, { CredentialsSignin, type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { checkPassword, clearAttempts, recordAttempt, tooManyAttempts } from "./accounts";
import { getDb, hasDatabase } from "./db";
import { accounts, sessions, users, verificationTokens } from "./db/schema";

/** Which sign-in options exist depends on which env vars are set. */
export function enabledProviders() {
  return {
    github: Boolean(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET),
    google: Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET),
    // Email + password needs only the database.
    password: hasDatabase(),
    // Local-only test login. Never available in a production build.
    dev: process.env.NODE_ENV !== "production" && process.env.AUTH_DEV_LOGIN === "1",
  };
}

/** Sign-in works only when there is a database, a secret and at least one provider. */
export function authConfigured() {
  const p = enabledProviders();
  return hasDatabase() && Boolean(process.env.AUTH_SECRET) && (p.github || p.google || p.password || p.dev);
}

export { isAdminEmail } from "./auth-rules";

async function config(): Promise<NextAuthConfig> {
  const p = enabledProviders();
  const db = hasDatabase() ? await getDb() : undefined;

  const providers: NextAuthConfig["providers"] = [];
  if (p.github) providers.push(GitHub);
  if (p.google) providers.push(Google);
  if (p.password && db) {
    providers.push(
      Credentials({
        id: "password",
        name: "Email and password",
        credentials: { email: { label: "Email", type: "email" }, password: { label: "Password", type: "password" } },
        async authorize(input) {
          const email = String(input?.email ?? "").trim().toLowerCase().slice(0, 254);
          const password = String(input?.password ?? "").slice(0, 200);
          if (!email || !password) return null;
          const key = `signin:${email}`;
          if (await tooManyAttempts(key, "signin")) throw new TooManyAttempts();
          const user = await checkPassword(email, password);
          if (!user) {
            await recordAttempt(key);
            return null;
          }
          await clearAttempts(key);
          return user;
        },
      }),
    );
  }
  if (p.dev && db) {
    providers.push(
      Credentials({
        id: "dev",
        name: "Dev login",
        credentials: { email: { label: "Email", type: "email" } },
        async authorize(input) {
          const email = String(input?.email ?? "").trim().toLowerCase();
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
          const [existing] = await db.select().from(users).where(eq(users.email, email));
          if (existing) return existing;
          const [created] = await db.insert(users).values({ email, name: email.split("@")[0] }).returning();
          return created;
        },
      }),
    );
  }

  return {
    adapter: db ? DrizzleAdapter(db, { usersTable: users, accountsTable: accounts, sessionsTable: sessions, verificationTokensTable: verificationTokens }) : undefined,
    providers,
    // JWT sessions: no database read on every request; the user row is still stored by the adapter.
    session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
    pages: { signIn: "/sign-in", error: "/sign-in" },
    trustHost: true,
    callbacks: {
      jwt({ token, user, account }) {
        if (user?.id) token.sub = user.id;
        // Remember how this session signed in. Password accounts have unverified emails,
        // so they can never be admins, even if the email matches ADMIN_EMAILS.
        if (account) token.method = account.provider;
        return token;
      },
      session({ session, token }) {
        if (token.sub) session.user.id = token.sub;
        (session.user as { method?: string }).method = typeof token.method === "string" ? token.method : undefined;
        return session;
      },
    },
  };
}

/** Thrown when an email has too many failed sign-ins; shown as its own message on the form. */
export class TooManyAttempts extends CredentialsSignin {
  code = "too_many_attempts";
}

export const { handlers, auth, signIn, signOut } = NextAuth(config);
