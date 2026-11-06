/** Admins are listed by email in ADMIN_EMAILS (comma-separated). No role column to tamper with. */
export function isAdminEmail(email: string | null | undefined) {
  if (!email) return false;
  const admins = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
  return admins.includes(email.toLowerCase());
}
