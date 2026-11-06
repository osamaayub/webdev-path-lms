import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/config/site";
import { DeleteAccount } from "@/features/auth/components/delete-account";

export const metadata: Metadata = {
  title: "Privacy and security",
  description: "What WebDev Path stores about you, who can see it, and how your account and data are protected.",
  alternates: { canonical: "/security" },
};

const stored = [
  ["Your profile", "Name, email and avatar from GitHub or Google. We never see or store a password."],
  ["Course progress", "Which weeks you completed and when."],
  ["Quiz attempts", "Your answers, score and time for each attempt, so you can see your best score."],
  ["Project work", "Your requirement checklist, repo link, live link, notes, and the grade and feedback from your reviewer."],
];

const protections = [
  ["Sign-in through GitHub or Google", "OAuth means your password stays with them. Sessions are signed, HttpOnly, Secure cookies that JavaScript on the page can't read."],
  ["Every action is checked on the server", "Quizzes, checklists, submissions and reviews run as server actions that confirm who you are first. Your user id comes from the signed session, never from the browser, so you can only change your own records."],
  ["Reviewers are an allowlist", "Only email addresses the site owner lists can open the review dashboard. Everyone else gets a not-found page."],
  ["Quizzes are graded on the server", "The page only receives questions and options. Correct answers and explanations come back after you submit."],
  ["Input is validated", "Links must be a real GitHub repo and an https site, notes and feedback have length limits, and every value is checked against the course content."],
  ["Abuse limits", "At most 10 quiz attempts per lesson per hour, and a short cool-down between project resubmissions."],
  ["Browser protections", "A strict Content Security Policy, HSTS, no framing (clickjacking protection), no MIME sniffing, and a limited referrer."],
  ["Database", "Postgres on Neon, encrypted in transit and at rest. Queries are parameterised by the ORM, so input can't change SQL. Schema changes ship as reviewed migrations."],
  ["Secrets", "API keys and database credentials live only in server environment variables, never in the code or the browser."],
];

export default function SecurityPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Privacy and security</h1>
      <p className="mt-4 text-lg text-ink/80">
        Reading the course needs no account. If you sign in, this is exactly what we keep and how it&apos;s protected. The code is open source, so you can check every line on{" "}
        <a href={site.repo} className="font-semibold underline underline-offset-4">GitHub</a>.
      </p>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-bold">What we store</h2>
        <dl className="mt-4 divide-y divide-rule rounded-[20px] border border-rule bg-card">
          {stored.map(([t, d]) => (
            <div key={t} className="grid gap-1 p-5 sm:grid-cols-[180px_1fr] sm:gap-6">
              <dt className="font-semibold">{t}</dt>
              <dd className="text-ink/80">{d}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-ink/80">We don&apos;t sell data, show ads or use tracking cookies. Your reviewer sees your name, email, links and notes for the projects you submit. Nobody else sees your progress.</p>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-bold">How it&apos;s protected</h2>
        <ul className="mt-4 space-y-4">
          {protections.map(([t, d]) => (
            <li key={t} className="rounded-2xl border-l-4 border-brand bg-card px-5 py-4">
              <p className="font-semibold">{t}</p>
              <p className="mt-1 text-ink/80">{d}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 rounded-[20px] bg-brand-soft p-7">
        <h2 className="font-display text-2xl font-bold">Your choices</h2>
        <p className="mt-2 text-ink/80">
          You can delete your account at any time. It removes your profile, progress, quiz attempts and submissions straight away. Found a security problem? Please report it privately through{" "}
          <a href={`${site.repo}/security/advisories/new`} className="font-semibold underline underline-offset-4">a GitHub security advisory</a>, not a public issue.
        </p>
        <div className="flex flex-wrap items-start gap-3">
          <Link href="/learn" className="mt-5 inline-flex btn-primary">Back to my progress</Link>
          <DeleteAccount />
        </div>
      </section>
    </div>
  );
}
