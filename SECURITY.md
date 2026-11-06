# Security

## Reporting a vulnerability

Please report privately through a [GitHub security advisory](https://github.com/osamaayub/webdev-path-lms/security/advisories/new), not a public issue. You'll get a reply within a few days.

## Threat model and controls

| Risk | Control | Where |
| --- | --- | --- |
| Account takeover / password leaks | No passwords stored. Sign-in is OAuth (GitHub, Google). Session is a signed, encrypted JWT in an `HttpOnly`, `Secure`, `SameSite=Lax` cookie. | `src/server/auth.ts` |
| Reading or changing someone else's data | Every query takes the user id from the verified session, never from the request. | `src/server/learner.ts`, `src/features/*/actions.ts` |
| Privilege escalation to reviewer | Admins are an env allowlist (`ADMIN_EMAILS`), checked on the server for the page and for every review action. Non-admins get a 404. | `src/server/viewer.ts`, `src/app/admin/page.tsx` |
| Forged or malformed input to Server Actions | Server Actions are treated as public endpoints: auth first, then Zod validation, then checks against the course content (lesson, project and requirement must exist). Next.js rejects cross-origin action calls. | `src/features/progress/model.ts`, `actions.ts` |
| Cheating on quizzes | The browser only gets prompts and options. Grading happens on the server. (The repo is open source, so this stops casual inspection, not a determined reader.) | `src/content/index.ts` (`publicQuiz`) |
| Abuse / brute force | 10 quiz attempts per lesson per hour; 60 s cool-down between resubmissions; field length limits. | `src/features/progress/actions.ts` |
| SQL injection | Drizzle ORM, parameterised queries only. | `src/server/learner.ts` |
| XSS | React escapes output; no `dangerouslySetInnerHTML` with user data; strict CSP (`default-src 'self'`, no third-party scripts, `object-src 'none'`). Learner links must be `https://` (blocks `javascript:` URLs). | `next.config.ts` |
| Clickjacking, sniffing, downgrade | `frame-ancestors 'none'`, `X-Frame-Options: DENY`, `nosniff`, HSTS with preload, `upgrade-insecure-requests`. | `next.config.ts` |
| Open redirect after sign-in | `returnTo` must be a same-site path. | `src/features/auth/actions.ts` |
| Leaking internals | Errors return a generic message; details go to structured logs (name and message only). `/api/me` is `Cache-Control: private, no-store`. | `src/server/action-result.ts`, `logger.ts` |
| Secrets in code | All credentials are environment variables; `.env*` is git-ignored. The dev email login only exists when `NODE_ENV !== "production"` **and** `AUTH_DEV_LOGIN=1`. | `.env.example` |
| Data retention | Learners can delete their account; foreign keys cascade to progress, attempts and submissions. | `src/app/security/page.tsx` |

## Known limitations

- The CSP allows `'unsafe-inline'` scripts because pages are statically prerendered (a nonce would force per-request rendering). There are no third-party scripts.
- Rate limits are stored in Postgres per user, not per IP. Anonymous users cannot call any write action.

## Email and password accounts

- Passwords are hashed with scrypt (N=16384, r=8, p=1, 16-byte random salt) from Node's built-in crypto. The plain password is never stored or logged, and the hash never leaves the server.
- Passwords need 8 to 72 characters with at least one letter and one number.
- Sign-in failures always say "Wrong email or password", and a missing account is checked against a dummy hash, so responses don't reveal which emails exist.
- Rate limits are stored in Postgres (`auth_attempt`), so they hold across serverless instances: 8 failed sign-ins per email per 15 minutes, 5 sign-ups per network address per hour.
- Emails are not verified yet (no email provider). For that reason a password session can never be an admin, and admin emails in `ADMIN_EMAILS` cannot be registered with a password.
- An email that already has an account (for example from Google) cannot be claimed by a new password account.
- No password reset yet: it needs an email provider. Learners who forget a password can contact the maintainer.
