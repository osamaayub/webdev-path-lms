"use client";

import { useState } from "react";
import { submitProject } from "@/features/progress/model";
import { useProgress, useUpdateProgress } from "@/features/progress/store";

type Errors = { repoUrl?: string[]; liveUrl?: string[] };

export function SubmissionForm({ project, total }: { project: string; total: number }) {
  const state = useProgress().projects[project];
  const update = useUpdateProgress();
  const [errors, setErrors] = useState<Errors>({});
  const remaining = total - (state?.checked.length ?? 0);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const input = { repoUrl: String(form.get("repoUrl") ?? "").trim(), liveUrl: String(form.get("liveUrl") ?? "").trim() };
    let failed: Errors | undefined;
    update((p) => {
      const result = submitProject(p, project, input);
      if (!result.ok) {
        failed = result.errors;
        return p;
      }
      return result.progress;
    });
    setErrors(failed ?? {});
  }

  if (state?.submission) {
    return (
      <div className="rounded-[24px] bg-[#E2F5EB] p-7" role="status">
        <p className="font-display text-2xl font-bold text-[#0A6B3C]">Project submitted</p>
        <p className="mt-1 text-ink/80">On {new Date(state.submission.submittedAt).toLocaleDateString()}. Add it to your portfolio and share it on LinkedIn.</p>
        <ul className="mt-4 flex flex-wrap gap-3">
          <li><a className="inline-flex rounded-full bg-white px-5 py-2.5 font-semibold" href={state.submission.repoUrl}>View the code</a></li>
          <li><a className="inline-flex rounded-full bg-white px-5 py-2.5 font-semibold" href={state.submission.liveUrl}>View the live site</a></li>
        </ul>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5 rounded-[24px] border border-rule bg-white p-7">
      <Field name="repoUrl" label="GitHub repository" placeholder="https://github.com/you/project" errors={errors.repoUrl} />
      <Field name="liveUrl" label="Live site" placeholder="https://your-project.vercel.app" errors={errors.liveUrl} />
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={remaining > 0} className="rounded-full bg-ink px-6 py-3 font-semibold text-white hover:bg-[#22325a] disabled:cursor-not-allowed disabled:bg-ink/30">
          Submit project
        </button>
        {remaining > 0 && <p className="text-[15px] text-muted">Tick the {remaining} remaining requirement{remaining === 1 ? "" : "s"} to submit.</p>}
      </div>
    </form>
  );
}

function Field({ name, label, placeholder, errors }: { name: string; label: string; placeholder: string; errors?: string[] }) {
  const id = `field-${name}`;
  return (
    <div>
      <label htmlFor={id} className="block font-semibold">{label}</label>
      <input
        id={id}
        name={name}
        type="url"
        inputMode="url"
        placeholder={placeholder}
        aria-invalid={errors ? true : undefined}
        aria-describedby={errors ? `${id}-error` : undefined}
        className="mt-2 w-full rounded-xl border-2 border-rule bg-paper px-4 py-3 outline-none focus:border-ink focus:bg-white aria-[invalid=true]:border-[#C2361B]"
      />
      {errors && <p id={`${id}-error`} className="mt-1.5 text-[15px] text-[#C2361B]">{errors[0]}</p>}
    </div>
  );
}
