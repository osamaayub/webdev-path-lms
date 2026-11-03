import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { signInWith } from "@/features/auth/actions";
import { authConfigured, enabledProviders } from "@/server/auth";
import { getViewer } from "@/server/viewer";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in with GitHub or Google to save your progress, take quizzes and submit projects for review.",
  robots: { index: false },
};

const errors: Record<string, string> = {
  OAuthAccountNotLinked: "That email is already linked to another sign-in method. Use the one you signed up with.",
  AccessDenied: "Sign-in was cancelled or denied.",
  Configuration: "Sign-in isn't configured correctly yet. Please try again later.",
};

export default function SignInPage({ searchParams }: PageProps<"/sign-in">) {
  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="font-display text-4xl font-extrabold tracking-tight">Sign in</h1>
      <p className="mt-3 text-ink/80">Save your progress, take the weekly quizzes and get your projects reviewed. Free, and we only read your name, email and avatar.</p>
      <Suspense fallback={<div className="mt-8 h-32 rounded-[24px] bg-white" />}>
        <SignInOptions searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function SignInOptions({ searchParams }: Pick<PageProps<"/sign-in">, "searchParams">) {
  const sp = await searchParams;
  const returnTo = typeof sp.returnTo === "string" ? sp.returnTo : typeof sp.callbackUrl === "string" ? sp.callbackUrl : "/learn";
  if (await getViewer()) redirect(returnTo.startsWith("/") && !returnTo.startsWith("//") ? returnTo : "/learn");

  if (!authConfigured()) {
    return <p className="mt-8 rounded-[24px] bg-[#FEF6DC] p-6 text-[#7A5600]">Accounts are being set up. You can read every lesson in the meantime.</p>;
  }

  const p = enabledProviders();
  const error = typeof sp.error === "string" ? (errors[sp.error] ?? "Sign-in failed. Please try again.") : null;

  return (
    <div className="mt-8 space-y-3">
      {error && <p role="alert" className="rounded-xl bg-[#FDEDE8] px-4 py-3 text-[#9A2E10]">{error}</p>}
      {p.github && <ProviderButton provider="github" label="Continue with GitHub" returnTo={returnTo} />}
      {p.google && <ProviderButton provider="google" label="Continue with Google" returnTo={returnTo} />}
      {p.dev && (
        <form action={signInWith} className="space-y-3 rounded-[24px] border-2 border-dashed border-rule p-5">
          <p className="text-[15px] text-muted">Local development login (never available in production)</p>
          <input type="hidden" name="provider" value="dev" />
          <input type="hidden" name="returnTo" value={returnTo} />
          <label htmlFor="dev-email" className="block font-semibold">Email</label>
          <input id="dev-email" name="email" type="email" required className="w-full rounded-xl border-2 border-rule bg-paper px-4 py-3" />
          <button type="submit" className="w-full rounded-full bg-ink px-6 py-3 font-semibold text-white">Dev sign in</button>
        </form>
      )}
      <p className="pt-4 text-[15px] text-muted">By signing in you agree that we store your quiz results and project submissions so you and your reviewer can see them.</p>
    </div>
  );
}

function ProviderButton({ provider, label, returnTo }: { provider: "github" | "google"; label: string; returnTo: string }) {
  return (
    <form action={signInWith}>
      <input type="hidden" name="provider" value={provider} />
      <input type="hidden" name="returnTo" value={returnTo} />
      <button type="submit" className="flex w-full items-center justify-center gap-3 rounded-full border-2 border-ink bg-white px-6 py-3.5 font-semibold hover:bg-paper">
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
