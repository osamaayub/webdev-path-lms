"use client";

import { useState, useTransition } from "react";
import { SignInPrompt } from "@/features/auth/components/sign-in-prompt";
import { submitProject } from "@/features/progress/actions";
import { statusLabel, type SubmissionView } from "@/features/progress/model";
import { refreshLearner, useLearner } from "@/features/progress/store";

type Errors = Record<string, string[] | undefined>;

const tone: Record<SubmissionView["status"], { bg: string; fg: string; body: string }> = {
  submitted: { bg: "var(--warn-soft)", fg: "var(--warn)", body: "Your project is waiting for a review. You'll see the grade and feedback here." },
  changes_requested: { bg: "var(--bad-soft)", fg: "var(--bad)", body: "Read the feedback, make the changes, then submit again below." },
  approved: { bg: "var(--ok-soft)", fg: "var(--ok)", body: "Approved. Add it to your portfolio and share it on LinkedIn." },
};

export function SubmissionForm({ project, total }: { project: string; total: number }) {
  const { state, status } = useLearner();
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [pending, start] = useTransition();

  if (status !== "loading" && !state.viewer) {
    return <SignInPrompt title="Sign in to submit your project" body="Submit your GitHub repo and live link. A reviewer grades it and sends you feedback." />;
  }

  const p = state.projects[project];
  const sub = p?.submission;
  const remaining = total - (p?.checked.length ?? 0);
  const showForm = !sub || (sub.status !== "approved" && (sub.status === "changes_requested" || editing));

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const input = { repoUrl: String(form.get("repoUrl") ?? "").trim(), liveUrl: String(form.get("liveUrl") ?? "").trim(), notes: String(form.get("notes") ?? "").trim() };
    setMessage(null);
    start(async () => {
      const res = await submitProject(project, input);
      if (!res.ok) {
        setErrors(res.fieldErrors ?? {});
        setMessage(res.error);
        return;
      }
      setErrors({});
      setEditing(false);
      await refreshLearner();
    });
  }

  return (
    <div className="space-y-6">
      {sub && (
        <div className="rounded-[20px] p-7" style={{ background: tone[sub.status].bg }} role="status">
          <p className="font-display text-2xl font-bold" style={{ color: tone[sub.status].fg }}>
            {statusLabel[sub.status]}
            {sub.grade !== null && sub.status !== "submitted" && <span className="text-ink">, grade {sub.grade}/100</span>}
          </p>
          <p className="mt-1 text-ink/80">{tone[sub.status].body}</p>
          {sub.feedback && (
            <figure className="mt-4 rounded-2xl bg-card p-5">
              <figcaption className="text-[15px] text-muted">{sub.status === "submitted" ? "Feedback on your last version" : "Reviewer feedback"}</figcaption>
              <blockquote className="mt-1 whitespace-pre-line">{sub.feedback}</blockquote>
            </figure>
          )}
          <ul className="mt-4 flex flex-wrap gap-3">
            <li><a className="inline-flex rounded-full bg-card px-5 py-2.5 font-semibold" href={sub.repoUrl} target="_blank" rel="noopener noreferrer">View the code</a></li>
            <li><a className="inline-flex rounded-full bg-card px-5 py-2.5 font-semibold" href={sub.liveUrl} target="_blank" rel="noopener noreferrer">View the live site</a></li>
            {sub.status === "submitted" && !editing && (
              <li><button type="button" onClick={() => setEditing(true)} className="inline-flex rounded-full px-5 py-2.5 font-semibold underline underline-offset-4">Update links</button></li>
            )}
          </ul>
          <p className="mt-3 text-[15px] text-muted">Submitted {sub.attempts} time{sub.attempts === 1 ? "" : "s"}, last on {new Date(sub.updatedAt).toLocaleDateString()}.</p>
        </div>
      )}

      {showForm && (
        <form onSubmit={onSubmit} noValidate className="space-y-5 rounded-[20px] border border-rule bg-card p-7">
          <Field name="repoUrl" label="GitHub repository" placeholder="https://github.com/you/project" defaultValue={sub?.repoUrl} errors={errors.repoUrl} />
          <Field name="liveUrl" label="Live site" placeholder="https://your-project.vercel.app" defaultValue={sub?.liveUrl} errors={errors.liveUrl} />
          <div>
            <label htmlFor="field-notes" className="block font-semibold">Notes for the reviewer <span className="font-normal text-muted">(optional)</span></label>
            <textarea id="field-notes" name="notes" rows={3} maxLength={1000} defaultValue={sub?.notes ?? ""} className="mt-2 w-full rounded-xl border-2 border-rule bg-card-2 px-4 py-3 outline-none focus:border-ink focus:bg-card" />
          </div>
          {message && <p role="alert" className="rounded-xl bg-bad-soft px-4 py-3 text-bad">{message}</p>}
          <div className="flex flex-wrap items-center gap-4">
            <button type="submit" disabled={remaining > 0 || pending || status === "loading"} className="btn-primary">
              {pending ? "Submitting..." : sub ? "Submit again for review" : "Submit for review"}
            </button>
            {remaining > 0 && <p className="text-[15px] text-muted">Tick the {remaining} remaining requirement{remaining === 1 ? "" : "s"} to submit.</p>}
          </div>
        </form>
      )}
    </div>
  );
}

function Field({ name, label, placeholder, defaultValue, errors }: { name: string; label: string; placeholder: string; defaultValue?: string; errors?: string[] }) {
  const id = `field-${name}`;
  return (
    <div>
      <label htmlFor={id} className="block font-semibold">{label}</label>
      <input
        id={id}
        name={name}
        type="url"
        inputMode="url"
        required
        maxLength={300}
        placeholder={placeholder}
        defaultValue={defaultValue}
        aria-invalid={errors ? true : undefined}
        aria-describedby={errors ? `${id}-error` : undefined}
        className="mt-2 w-full rounded-xl border-2 border-rule bg-card-2 px-4 py-3 outline-none focus:border-ink focus:bg-card aria-[invalid=true]:border-bad"
      />
      {errors && <p id={`${id}-error`} className="mt-1.5 text-[15px] text-bad">{errors[0]}</p>}
    </div>
  );
}
