"use client";

import Link from "next/link";
import { toggleLesson } from "../model";
import { useProgress, useUpdateProgress } from "../store";

export function CompleteButton({ id, nextHref, nextLabel, color }: { id: string; nextHref?: string; nextLabel?: string; color: string }) {
  const done = useProgress().completedLessons.includes(id);
  const update = useUpdateProgress();
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        aria-pressed={done}
        onClick={() => update((p) => toggleLesson(p, id))}
        className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold transition-colors"
        style={done ? { background: "#fff", color: "#14213D", boxShadow: `inset 0 0 0 2px ${color}` } : { background: "#14213D", color: "#fff" }}
      >
        <span aria-hidden className="grid h-5 w-5 place-items-center rounded-full" style={{ background: done ? color : "rgba(255,255,255,.2)" }}>
          {done && <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 6.5l2.5 2.5L10 3.5" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>}
        </span>
        {done ? "Week done" : "Mark this week done"}
      </button>
      {done && nextHref && (
        <Link href={nextHref} className="rounded-full px-5 py-3 font-semibold underline decoration-2 underline-offset-4" style={{ textDecorationColor: color }}>
          Go to {nextLabel}
        </Link>
      )}
      {done && <span className="text-[15px] text-muted">Click again to undo.</span>}
    </div>
  );
}
