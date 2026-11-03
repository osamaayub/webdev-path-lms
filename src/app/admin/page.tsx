import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { colorFor } from "@/config/theme";
import { getProject } from "@/content";
import { ReviewForm } from "@/features/admin/components/review-form";
import { statusLabel, type SubmissionStatus } from "@/features/progress/model";
import { adminStats, listSubmissions } from "@/server/learner";
import { getViewer } from "@/server/viewer";

export const metadata: Metadata = { title: "Review submissions", robots: { index: false, follow: false } };

const tabs: { key: SubmissionStatus | "all"; label: string }[] = [
  { key: "submitted", label: "In review" },
  { key: "changes_requested", label: "Changes requested" },
  { key: "approved", label: "Approved" },
  { key: "all", label: "All" },
];

export default function AdminPage({ searchParams }: PageProps<"/admin">) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl font-extrabold tracking-tight">Review submissions</h1>
      <Suspense fallback={<p className="mt-8 text-muted">Loading...</p>}>
        <AdminContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function AdminContent({ searchParams }: Pick<PageProps<"/admin">, "searchParams">) {
  const viewer = await getViewer();
  if (!viewer) redirect("/sign-in?returnTo=/admin");
  if (!viewer.isAdmin) notFound(); // don't reveal that an admin area exists

  const sp = await searchParams;
  const active = tabs.find((t) => t.key === sp.status)?.key ?? "submitted";
  const [stats, rows] = await Promise.all([adminStats(), listSubmissions(active)]);

  return (
    <>
      <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[
          ["Learners", stats.learners],
          ["In review", stats.inReview],
          ["Changes requested", stats.changesRequested],
          ["Approved", stats.approved],
          ["Weeks completed", stats.lessonsCompleted],
          ["Quiz attempts", stats.quizAttempts],
        ].map(([label, n]) => (
          <div key={label} className="rounded-2xl border border-rule bg-white p-4">
            <dt className="text-[14px] text-muted">{label}</dt>
            <dd className="mt-1 font-display text-3xl font-bold">{n}</dd>
          </div>
        ))}
      </dl>

      <nav aria-label="Filter by status" className="mt-10 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <Link key={t.key} href={`/admin?status=${t.key}`} aria-current={t.key === active ? "page" : undefined} className={`rounded-full px-4 py-2 font-semibold ${t.key === active ? "bg-ink text-white" : "bg-white text-ink hover:bg-rule"}`}>
            {t.label}
          </Link>
        ))}
      </nav>

      {rows.length === 0 ? (
        <p className="mt-8 rounded-[24px] bg-white p-8 text-center text-muted">Nothing here. {active === "submitted" ? "New submissions will show up here, oldest first." : ""}</p>
      ) : (
        <ul className="mt-6 space-y-5">
          {rows.map((r) => {
            const project = getProject(r.projectSlug);
            const c = colorFor(project?.phaseSlug ?? "");
            return (
              <li key={r.id} className="overflow-hidden rounded-[24px] border border-rule bg-white">
                <div className="h-1.5" style={{ background: c.line }} />
                <div className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-xl font-bold">{project ? `Project ${project.number}: ${project.title}` : r.projectSlug}</p>
                      <p className="text-ink/75">{r.learnerName ?? "Learner"} <span className="text-muted">({r.learnerEmail ?? "no email"})</span></p>
                    </div>
                    <span className="rounded-full bg-paper px-3 py-1 text-[14px] font-semibold">{statusLabel[r.status]}{r.grade !== null ? `, ${r.grade}/100` : ""}</span>
                  </div>
                  <p className="mt-2 text-[15px] text-muted">Version {r.attempts}, updated {r.updatedAt.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" })} UTC</p>
                  <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
                    <li><a href={r.repoUrl} target="_blank" rel="noopener noreferrer nofollow" className="font-semibold underline underline-offset-4">Repository</a></li>
                    <li><a href={r.liveUrl} target="_blank" rel="noopener noreferrer nofollow" className="font-semibold underline underline-offset-4">Live site</a></li>
                  </ul>
                  {r.notes && <p className="mt-3 whitespace-pre-line rounded-xl bg-paper p-3 text-[15px]"><span className="font-semibold">Learner notes: </span>{r.notes}</p>}
                  <ReviewForm id={r.id} grade={r.grade} feedback={r.feedback} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
