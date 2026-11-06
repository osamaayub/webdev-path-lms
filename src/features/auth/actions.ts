"use server";

import { headers } from "next/headers";
import { AuthError as NextAuthError } from "next-auth";
import { createPasswordUser, recordAttempt, tooManyAttempts } from "@/server/accounts";
import { deleteUser } from "@/server/learner";
import { logger } from "@/server/logger";
import { authConfigured, enabledProviders, signIn, signOut } from "@/server/auth";
import { signInSchema, signUpSchema, type FormState } from "./schemas";
import { requireUser } from "@/server/viewer";

/** Only same-site paths are allowed as a return address, so sign-in can't be used as an open redirect. */
function safeReturn(to: FormDataEntryValue | null) {
  const s = typeof to === "string" ? to : "";
  return s.startsWith("/") && !s.startsWith("//") && !s.startsWith("/\\") ? s : "/learn";
}

export async function signInWith(form: FormData) {
  const provider = form.get("provider");
  if (provider !== "github" && provider !== "google" && provider !== "dev") return;
  const redirectTo = safeReturn(form.get("returnTo"));
  if (provider === "dev") {
    await signIn("dev", { email: String(form.get("email") ?? ""), redirectTo });
    return;
  }
  await signIn(provider, { redirectTo });
}

/** Clears the session cookie. The client then does a full page load, so no stale signed-in UI survives. */
export async function signOutAction() {
  await signOut({ redirect: false });
}

/** Deletes the signed-in learner's account and all their data, then signs them out. */
export async function deleteAccountAction(form: FormData): Promise<boolean> {
  if (form.get("confirm") !== "DELETE") return false;
  const user = await requireUser();
  await deleteUser(user.id);
  logger.info("account deleted", { userId: user.id });
  await signOut({ redirect: false });
  return true;
}

const fieldErrors = (issues: { path: PropertyKey[]; message: string }[]) => {
  const out: FormState["fieldErrors"] = {};
  for (const i of issues) {
    const k = i.path[0];
    if ((k === "name" || k === "email" || k === "password") && !out[k]) out[k] = i.message;
  }
  return out;
};

/** Creates an email + password account, then signs the new learner in. */
export async function signUpAction(_prev: FormState, form: FormData): Promise<FormState> {
  if (!authConfigured() || !enabledProviders().password) return { error: "Sign-up isn't available right now." };
  const values = { name: String(form.get("name") ?? ""), email: String(form.get("email") ?? "") };
  const parsed = signUpSchema.safeParse({ ...values, password: String(form.get("password") ?? "") });
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error.issues), values };

  const ip = ((await headers()).get("x-forwarded-for") ?? "local").split(",")[0].trim();
  if (await tooManyAttempts(`signup:${ip}`, "signup")) return { error: "Too many sign-ups from this network. Try again in an hour.", values };
  await recordAttempt(`signup:${ip}`);

  const created = await createPasswordUser(parsed.data);
  if (!created.ok) {
    return created.reason === "reserved"
      ? { error: "This email can only sign in with GitHub or Google.", values }
      : { error: "An account with this email already exists. Sign in instead, or use GitHub or Google if that's how you joined.", values };
  }
  logger.info("account created", { userId: created.id, method: "password" });
  await signIn("password", { email: parsed.data.email, password: parsed.data.password, redirectTo: safeReturn(form.get("returnTo")) });
  return {};
}

/** Email + password sign-in. Every failure gets the same message, so it never reveals which emails exist. */
export async function signInPasswordAction(_prev: FormState, form: FormData): Promise<FormState> {
  const values = { email: String(form.get("email") ?? "") };
  const parsed = signInSchema.safeParse({ ...values, password: String(form.get("password") ?? "") });
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error.issues), values };
  try {
    await signIn("password", { email: parsed.data.email, password: parsed.data.password, redirectTo: safeReturn(form.get("returnTo")) });
    return {};
  } catch (e) {
    // signIn redirects by throwing; only Auth.js errors are failures.
    if (!(e instanceof NextAuthError)) throw e;
    const tooMany = (e as { code?: string }).code === "too_many_attempts";
    return { error: tooMany ? "Too many failed attempts. Wait 15 minutes and try again." : "Wrong email or password.", values };
  }
}
