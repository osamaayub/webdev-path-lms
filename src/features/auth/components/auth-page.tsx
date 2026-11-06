import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
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
  "sign-in": {
    title: "Welcome back",
    sub: "Sign in to pick up where you left off.",
    pitch: "Your route is saved. Pick up at the exact week you stopped.",
  },
  "sign-up": {
    title: "Create your free account",
    sub: "Free forever. No card needed. Takes 20 seconds.",
    pitch: "From your first HTML tag to your first developer job, one week at a time.",
  },
};

const stops = ["Foundations", "JavaScript", "React", "Next.js", "Backend", "AI + jobs"];

/** Focused full-screen layout for /sign-in and /sign-up: the course route on the left, the form on the right. */
export function AuthPage({ mode, searchParams }: { mode: Mode; searchParams: SP }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <RoutePanel mode={mode} />
      <section className="flex flex-col px-4 pb-10 pt-4 sm:px-8 lg:px-14 lg:pt-6">
        <div className="flex items-center justify-between">
          <Link href="/learn" className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[15px] text-muted hover:text-ink">
            <span aria-hidden>←</span> Back to the course
          </Link>
          <ThemeToggle />
        </div>
        <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center py-8">
          <ModeSwitch mode={mode} />
          <h1 className="mt-8 font-display text-3xl font-bold tracking-tight sm:text-[34px]">{copy[mode].title}</h1>
          <p className="mt-2 text-[17px] text-muted">{copy[mode].sub}</p>
          <Suspense fallback={<div className="mt-8 h-80 animate-pulse rounded-2xl bg-card-2" />}>
            <AuthOptions mode={mode} searchParams={searchParams} />
          </Suspense>
        </div>
      </section>
    </div>
  );
}

function ModeSwitch({ mode }: { mode: Mode }) {
  const tab = (m: Mode, label: string) => (
    <Link
      href={`/${m}`}
      aria-current={mode === m ? "page" : undefined}
      className={`flex-1 rounded-[10px] px-4 py-2.5 text-center text-[15px] font-semibold transition-colors ${mode === m ? "bg-[linear-gradient(90deg,var(--brand),var(--brand-2))] text-white shadow-sm" : "text-muted hover:text-ink"}`}
    >
      {label}
    </Link>
  );
  return (
    <nav aria-label="Account" className="flex rounded-xl border border-rule bg-card-2 p-1">
      {tab("sign-in", "Sign in")}
      {tab("sign-up", "Create account")}
    </nav>
  );
}

/** The left panel: the 24-week route as a line of stops, the product's own picture. Hidden detail on phones. */
function RoutePanel({ mode }: { mode: Mode }) {
  return (
    <aside className="relative overflow-hidden bg-[linear-gradient(150deg,var(--brand),var(--brand-2))] px-5 py-5 text-white sm:px-8 lg:flex lg:flex-col lg:px-12 lg:py-10">
      <Link href="/" className="relative z-10 inline-flex items-center gap-2.5 font-display text-lg font-bold">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/95"><Logo /></span>
        WebDev Path
      </Link>

      <div className="relative z-10 hidden flex-1 flex-col justify-center lg:flex">
        <p className="max-w-md font-display text-[40px] font-bold leading-[1.1] tracking-tight">{copy[mode].pitch}</p>
        <ol className="mt-12 max-w-md" aria-label="The course route">
          {stops.map((stop, i) => (
            <li key={stop} className="relative flex items-center gap-4 pb-5 last:pb-0">
              {i < stops.length - 1 && <span aria-hidden className="absolute left-[11px] top-6 h-full w-0.5 bg-white/35" />}
              <span aria-hidden className={`relative grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 border-white ${i === 0 ? "bg-white" : "bg-transparent"}`}>
                {i === 0 && <span className="h-2 w-2 rounded-full bg-[var(--brand)]" />}
              </span>
              <span className="text-[17px] font-semibold">
                <span className="mr-2 font-normal text-white/70">Module {i + 1}</span>
                {stop}
              </span>
              {i === 0 && <span className="ml-auto rounded-full bg-white/20 px-2.5 py-0.5 text-[13px] font-semibold">{mode === "sign-up" ? "You start here" : "Week 1"}</span>}
            </li>
          ))}
        </ol>
      </div>

      <p className="relative z-10 hidden text-[15px] text-white/80 lg:block">24 weeks · 24 video lessons · 6 portfolio projects · Free and open source</p>

      {/* One soft ring in the corner for depth. Decorative only. */}
      <span aria-hidden className="pointer-events-none absolute -right-40 -top-40 h-[28rem] w-[28rem] rounded-full border-[56px] border-white/[0.07]" />
    </aside>
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
    <div className="mt-7 space-y-6">
      {error && <p role="alert" className="rounded-xl bg-bad-soft px-4 py-3 text-[15px] text-bad">{error}</p>}
      {(p.google || p.github) && (
        <div className="space-y-3">
          {p.google && <ProviderButton provider="google" label={`${verb} with Google`} returnTo={returnTo} />}
          {p.github && <ProviderButton provider="github" label={`${verb} with GitHub`} returnTo={returnTo} />}
        </div>
      )}
      {p.password && (
        <>
          {(p.google || p.github) && (
            <div className="flex items-center gap-3 text-[14px] text-muted" role="separator">
              <span className="h-px flex-1 bg-rule" /> or use your email <span className="h-px flex-1 bg-rule" />
            </div>
          )}
          {mode === "sign-up" ? <SignUpForm returnTo={returnTo} /> : <SignInForm returnTo={returnTo} />}
        </>
      )}
      {p.dev && (
        <details className="rounded-2xl border-2 border-dashed border-rule p-4">
          <summary className="cursor-pointer text-[14px] font-semibold text-muted">Local development login</summary>
          <form action={signInWith} className="mt-3 space-y-3">
            <input type="hidden" name="provider" value="dev" />
            <input type="hidden" name="returnTo" value={returnTo} />
            <label htmlFor="dev-email" className="block text-[15px] font-semibold">Dev email</label>
            <input id="dev-email" name="email" type="email" required className="w-full rounded-xl border border-rule bg-card-2 px-4 py-3" />
            <button type="submit" className="btn-secondary w-full justify-center">Dev sign in</button>
          </form>
        </details>
      )}
      <p className="text-center text-[13px] leading-relaxed text-muted">
        {mode === "sign-up" ? "By creating an account" : "By signing in"} you agree that we store your name, email, quiz results and project submissions.{" "}
        <Link href="/security" className="underline underline-offset-2 hover:text-ink">You can delete everything at any time.</Link>
      </p>
    </div>
  );
}

function ProviderButton({ provider, label, returnTo }: { provider: "github" | "google"; label: string; returnTo: string }) {
  return (
    <form action={signInWith}>
      <input type="hidden" name="provider" value={provider} />
      <input type="hidden" name="returnTo" value={returnTo} />
      <button type="submit" className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-rule bg-card px-4 text-[16px] font-semibold transition-colors hover:border-brand/60 hover:bg-card-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand">
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
