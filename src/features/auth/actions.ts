"use server";

import { deleteUser } from "@/server/learner";
import { logger } from "@/server/logger";
import { signIn, signOut } from "@/server/auth";
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

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

/** Deletes the signed-in learner's account and all their data, then signs them out. */
export async function deleteAccountAction(form: FormData) {
  if (form.get("confirm") !== "DELETE") return;
  const user = await requireUser();
  await deleteUser(user.id);
  logger.info("account deleted", { userId: user.id });
  await signOut({ redirectTo: "/?deleted=1" });
}
