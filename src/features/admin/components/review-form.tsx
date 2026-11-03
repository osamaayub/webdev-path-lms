"use client";

import { useActionState } from "react";
import { reviewSubmissionAction } from "../actions";

export function ReviewForm({ id, grade, feedback }: { id: string; grade: number | null; feedback: string | null }) {
  const [state, action, pending] = useActionState(reviewSubmissionAction, null);
  const fe = state && !state.ok ? state.fieldErrors : undefined;
  return (
    <form action={action} className="mt-4 grid gap-4 rounded-2xl bg-paper p-5">
      <input type="hidden" name="submissionId" value={id} />
      <div className="grid gap-4 sm:grid-cols-[140px_1fr]">
        <div>
          <label htmlFor={`grade-${id}`} className="block font-semibold">Grade</label>
          <input id={`grade-${id}`} name="grade" type="number" min={0} max={100} required defaultValue={grade ?? ""} className="mt-1 w-full rounded-xl border-2 border-rule bg-white px-3 py-2" />
          {fe?.grade && <p className="mt-1 text-[14px] text-[#C2361B]">{fe.grade[0]}</p>}
        </div>
        <div>
          <label htmlFor={`fb-${id}`} className="block font-semibold">Feedback for the learner</label>
          <textarea id={`fb-${id}`} name="feedback" rows={3} required minLength={10} maxLength={4000} defaultValue={feedback ?? ""} className="mt-1 w-full rounded-xl border-2 border-rule bg-white px-3 py-2" />
          {fe?.feedback && <p className="mt-1 text-[14px] text-[#C2361B]">{fe.feedback[0]}</p>}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button name="status" value="approved" disabled={pending} className="rounded-full bg-[#0F9D58] px-5 py-2.5 font-semibold text-white disabled:opacity-50">Approve</button>
        <button name="status" value="changes_requested" disabled={pending} className="rounded-full bg-white px-5 py-2.5 font-semibold text-[#9A2E10] ring-2 ring-[#E4572E] disabled:opacity-50">Request changes</button>
        <span aria-live="polite" className="text-[15px]">
          {pending ? "Saving..." : state?.ok ? "Saved." : state && !state.ok ? <span className="text-[#C2361B]">{state.error}</span> : null}
        </span>
      </div>
    </form>
  );
}
