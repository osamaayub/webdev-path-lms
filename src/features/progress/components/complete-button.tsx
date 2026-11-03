"use client";

import Link from "next/link";
import { toggleLesson } from "../model";
import { useProgress, useUpdateProgress } from "../store";

export function CompleteButton({ id, nextHref }: { id: string; nextHref?: string }) {
  const done = useProgress().completedLessons.includes(id);
  const update = useUpdateProgress();
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        aria-pressed={done}
        onClick={() => update((p) => toggleLesson(p, id))}
        className={
          done
            ? "rounded-xl border border-emerald-300 bg-emerald-50 px-5 py-3 font-semibold text-emerald-800 hover:bg-emerald-100"
            : "rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
        }
      >
        {done ? "Completed (click to undo)" : "Mark lesson complete"}
      </button>
      {done && nextHref && (
        <Link href={nextHref} className="rounded-xl px-4 py-3 font-semibold text-indigo-700 hover:bg-indigo-50">
          Next lesson →
        </Link>
      )}
    </div>
  );
}
