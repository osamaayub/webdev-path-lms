"use client";

import { useState } from "react";
import { submitProject } from "@/features/progress/model";
import { useProgress, useUpdateProgress } from "@/features/progress/store";

type Errors = { repoUrl?: string[]; liveUrl?: string[] };

export function SubmissionForm({ project, total }: { project: string; total: number }) {
  const state = useProgress().projects[project];
  const update = useUpdateProgress();
  const [errors, setErrors] = useState<Errors>({});
  const ready = (state?.checked.length ?? 0) === total;

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
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5" role="status">
        <p className="font-semibold text-emerald-900">Submitted {new Date(state.submission.submittedAt).toLocaleDateString()}</p>
        <ul className="mt-2 space-y-1 text-sm">
          <li><a className="text-emerald-900 underline" href={state.submission.repoUrl}>GitHub repo</a></li>
          <li><a className="text-emerald-900 underline" href={state.submission.liveUrl}>Live site</a></li>
        </ul>
        <p className="mt-3 text-sm text-emerald-900">Share it on LinkedIn and add it to your portfolio.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5">
      {!ready && <p className="text-sm text-zinc-600">Tick every requirement above before you submit.</p>}
      <Field name="repoUrl" label="GitHub repository URL" placeholder="https://github.com/you/project" errors={errors.repoUrl} />
      <Field name="liveUrl" label="Live site URL" placeholder="https://your-project.vercel.app" errors={errors.liveUrl} />
      <button
        type="submit"
        disabled={!ready}
        className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Submit project
      </button>
    </form>
  );
}

function Field({ name, label, placeholder, errors }: { name: string; label: string; placeholder: string; errors?: string[] }) {
  const id = `field-${name}`;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-zinc-800">{label}</label>
      <input
        id={id}
        name={name}
        type="url"
        inputMode="url"
        placeholder={placeholder}
        aria-invalid={errors ? true : undefined}
        aria-describedby={errors ? `${id}-error` : undefined}
        className="mt-1 w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-zinc-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
      />
      {errors && <p id={`${id}-error`} className="mt-1 text-sm text-red-700">{errors[0]}</p>}
    </div>
  );
}
