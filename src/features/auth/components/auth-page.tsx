import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Logo } from "@/components/logo";
import { signInWith } from "@/features/auth/actions";
import { authConfigured, enabledProviders } from "@/server/auth";
import { getViewer } from "@/server/viewer";
import { SignInForm, SignUpForm } from "./password-forms";

const errors: Record<string, string> = {
  OAuthAccountNotLinked: "That email already has an account with a different sign-in method. Use the one you signed up with.",
  AccessDenied: "Sign-in was cancelled or denied.",
  Configuration: "Sign-in isn't configured correctly yet. Please try again later.",
  CredentialsSignin: "Wrong email or password.",
};

type Mode = "sign-in" | "sign-up";
type SP = Promise<Record<string, string | string[] | undefined>>;

const copy = {
  "sign-in": { title: "Welcome back", sub: "Sign in to pick up where you left off: your progress, quiz scores and project reviews." },
  "sign-up": { title: "Create your free account", sub: "Save your progress across devices, take the weekly quizzes and get your projects reviewed. Free, no card needed." },
};

/** Shared layout for /sign-in and /sign-up: social buttons, then email and password. */
export function AuthPage({ mode, searchParams }: { mode: Mode; searchParams: SP }) {
  return (
    <div className="mx-auto grid min-h-[calc(100vh-10rem)] max-w-5xl items-center gap-10 py-6 lg:grid-cols-[1fr_440px]">
      <section className="hidden lg:block">
        <span className="grid h-14 w-14 place-items-center rounded-2xl border border-rule bg-card"><Logo /></span>
        <h2 className="mt-6 text-4xl font-bold tracking-tight">Learn full-stack development, one week at a time.</h2>
        <ul className="mt-6 space-y-3 text-[17px] text-ink/85">
          <li className="flex gap-3"><span className="text-ok">✓</span> 24 weekly lessons, each with a video</li>
          <li className="flex gap-3"><span className="text-ok">✓</span> A 5-question quiz to close every week</li>
          <li className="flex gap-3"><span className="text-ok">✓</span> 6 portfolio projects, graded with feedback</li>
          <li className="flex gap-3"><span className="text-ok">✓</span> A certificate when you finish</li>
        </ul>
      </section>
      <section className="panel p-6 sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{copy[mode].title}</h1>
        <p className="mt-2 text-muted">{copy[mode].sub}</p>
        <Suspense fallback={<div className="mt-8 h-72 rounded-2xl bg-card-2" />}>
          <AuthOptions mode={mode} searchParams={searchParams} />
        </Suspense>
      </section>
    </div>
  );
}

async function AuthOptions({ mode, searchParams }: { mode: Mode; searchParams: SP }) {
  const sp = await searchParams;
  const raw = typeof sp.returnTo === "string" ? sp.returnTo : typeof sp.callbackUrl === "string" ? sp.callbackUrl : "/learn";
  const returnTo = raw.startsWith("/") && !raw.startsWith("//") && !raw.startsWith("/\\") ? raw : "/learn";
  if (await getViewer()) redirect(returnTo);

  if (!authConfigured()) {
    return <p className="mt-8 rounded-2xl bg-warn-soft p-6 text-warn">Accounts are being set up. You can read every lesson in the meantime.</p>;
  }
  const p = enabledProviders();
  const error = typeof sp.error === "string" ? (errors[sp.error] ?? "Sign-in failed. Please try again.") : null;
  const verb = mode === "sign-up" ? "Sign up" : "Continue";

  return (
    <div className="mt-7 space-y-5">
      {error && <p role="alert" className="rounded-xl bg-bad-soft px-4 py-3 text-[15px] text-bad">{error}</p>}
      {(p.google || p.github) && (
        <div className="grid gap-3 sm:grid-cols-2">
          {p.google && <ProviderButton provider="google" label={`${verb} with Google`} returnTo={returnTo} />}
          {p.github && <ProviderButton provider="github" label={`${verb} with GitHub`} returnTo={returnTo} />}
        </div>
      )}
      {p.password && (
        <>
          {(p.google || p.github) && (
            <div className="flex items-center gap-3 text-[14px] text-muted" role="separator">
              <span className="h-px flex-1 bg-rule" /> or with email <span className="h-px flex-1 bg-rule" />
            </div>
          )}
          {mode === "sign-up" ? <SignUpForm returnTo={returnTo} /> : <SignInForm returnTo={returnTo} />}
        </>
      )}
      {p.dev && (
        <form action={signInWith} className="space-y-3 rounded-2xl border-2 border-dashed border-rule p-5">
          <p className="text-[14px] text-muted">Local development login (never available in production)</p>
          <input type="hidden" name="provider" value="dev" />
          <input type="hidden" name="returnTo" value={returnTo} />
          <label htmlFor="dev-email" className="block font-semibold">Dev email</label>
          <input id="dev-email" name="email" type="email" required className="w-full rounded-xl border border-rule bg-card-2 px-4 py-3" />
          <button type="submit" className="btn-secondary w-full justify-center">Dev sign in</button>
        </form>
      )}
      <p className="text-[13px] leading-relaxed text-muted">
        {mode === "sign-up" ? "By creating an account" : "By signing in"} you agree that we store your name, email, quiz results and project submissions so you and your reviewer can see them. You can delete everything at any time from Privacy and security.
      </p>
    </div>
  );
}

function ProviderButton({ provider, label, returnTo }: { provider: "github" | "google"; label: string; returnTo: string }) {
  return (
    <form action={signInWith}>
      <input type="hidden" name="provider" value={provider} />
      <input type="hidden" name="returnTo" value={returnTo} />
      <button type="submit" className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-rule bg-card-2 px-4 py-3 text-[15px] font-semibold hover:border-brand/60">
        {provider === "github" ? <GitHubIcon /> : <GoogleIcon />}
        {label}
      </button>
    </form>
  );
}

function GitHubIcon() {
  return (
    <svg aria-hidden width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg aria-hidden width="20" height="20" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}
