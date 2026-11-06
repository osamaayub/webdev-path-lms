"use client";

import { Icon } from "@/components/icons";
import { ProgressBar } from "@/components/progress-bar";
import { SignInPrompt } from "@/features/auth/components/sign-in-prompt";
import { useLearner } from "@/features/progress/store";

/**
 * Certificate of completion: unlocked when every week is passed and all projects are approved.
 * It is a record of finishing this free course, not an accredited qualification.
 */
export function Certificate({ lessonIds, projectSlugs, course }: { lessonIds: string[]; projectSlugs: string[]; course: string }) {
  const { state, status } = useLearner();
  if (status !== "loading" && !state.viewer) return <SignInPrompt title="Sign in to work towards your certificate" body="Pass all 24 weekly quizzes and get all 6 projects approved." />;
  const weeks = lessonIds.filter((id) => state.completed.includes(id)).length;
  const approved = projectSlugs.filter((s) => state.projects[s]?.submission?.status === "approved").length;
  const earned = weeks === lessonIds.length && approved === projectSlugs.length;
  const dates = projectSlugs.map((s) => state.projects[s]?.submission?.reviewedAt).filter(Boolean) as string[];
  const date = dates.sort().at(-1);

  if (!earned) {
    return (
      <section className="panel p-6 sm:p-8">
        <h2 className="text-xl font-bold">Your path to the certificate</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-rule bg-card-2 p-5">
            <p className="font-semibold">Weekly quizzes passed</p>
            <p className="mt-1 text-3xl font-bold">{weeks} <span className="text-lg text-muted">/ {lessonIds.length}</span></p>
            <div className="mt-3"><ProgressBar value={Math.round((weeks / lessonIds.length) * 100)} label="Quizzes passed" /></div>
          </div>
          <div className="rounded-2xl border border-rule bg-card-2 p-5">
            <p className="font-semibold">Projects approved</p>
            <p className="mt-1 text-3xl font-bold">{approved} <span className="text-lg text-muted">/ {projectSlugs.length}</span></p>
            <div className="mt-3"><ProgressBar value={Math.round((approved / projectSlugs.length) * 100)} label="Projects approved" /></div>
          </div>
        </div>
        <p className="mt-5 flex items-center gap-2 text-muted"><Icon name="lock" size={16} /> Unlocks when both reach 100%.</p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="rounded-[20px] border-2 border-brand/60 bg-card p-8 text-center sm:p-12 print:border-black">
        <span className="icon-tile mx-auto h-14 w-14"><Icon name="award" size={28} /></span>
        <p className="mt-5 text-[14px] font-semibold uppercase tracking-[0.2em] text-muted">Certificate of completion</p>
        <p className="mt-4 text-3xl font-bold sm:text-4xl">{state.viewer?.name ?? "Learner"}</p>
        <p className="mx-auto mt-3 max-w-xl text-ink/85">completed all 24 weeks and 6 reviewed projects of <span className="font-semibold">{course}</span> on WebDev Path.</p>
        {date && <p className="mt-4 text-muted">{new Date(date).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}</p>}
      </div>
      <button type="button" onClick={() => window.print()} className="btn-primary print:hidden">Print or save as PDF</button>
      <p className="text-[14px] text-muted print:hidden">A record of finishing this free course, not an accredited qualification.</p>
    </section>
  );
}
