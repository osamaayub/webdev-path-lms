"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLearner } from "@/features/progress/store";

/**
 * Shown in place of personal features when nobody is signed in.
 * Renders nothing while loading and nothing once signed in.
 */
export function SignInPrompt({ title, body, tone = "var(--brand-soft)" }: { title: string; body: string; tone?: string }) {
  const { status, state } = useLearner();
  const path = usePathname();
  if (status === "loading" || state.viewer) return null;
  if (status === "error") {
    return <p role="alert" className="rounded-2xl bg-bad-soft p-5 text-bad">We couldn&apos;t load your account. Refresh the page to try again.</p>;
  }
  return (
    <div className="rounded-[20px] p-7" style={{ background: tone }}>
      <p className="font-display text-xl font-bold">{state.configured ? title : "Accounts are being set up"}</p>
      <p className="mt-1 text-ink/80">{state.configured ? body : "You can read every lesson now. Progress, quizzes and project reviews open as soon as sign-in is live."}</p>
      {state.configured && (
        <Link href={`/sign-in?returnTo=${encodeURIComponent(path)}`} className="mt-5 inline-flex btn-primary">
          Sign in to continue
        </Link>
      )}
    </div>
  );
}

/** Renders children only for a signed-in learner. */
export function SignedIn({ children }: { children: React.ReactNode }) {
  const { state } = useLearner();
  return state.viewer ? <>{children}</> : null;
}
