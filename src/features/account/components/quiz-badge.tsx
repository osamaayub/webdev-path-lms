"use client";

import { useProgress } from "@/features/progress/store";

/** Best score for one lesson quiz, or "Not taken". */
export function QuizBadge({ id }: { id: string }) {
  const { viewer, quizzes } = useProgress();
  if (!viewer) return null;
  const q = quizzes[id];
  if (!q) return <span className="rounded-lg bg-card px-2.5 py-1 text-[13px] font-semibold text-muted">Not taken</span>;
  return (
    <span className={`rounded-lg px-2.5 py-1 text-[13px] font-semibold ${q.passed ? "bg-ok-soft text-ok" : "bg-warn-soft text-warn"}`}>
      {q.passed ? "Passed" : "Retry"} · best {q.best}/{q.total}
    </span>
  );
}

/** Totals for the quizzes page header. */
export function QuizTotals({ total }: { total: number }) {
  const { viewer, quizzes } = useProgress();
  if (!viewer) return null;
  const taken = Object.keys(quizzes).length;
  const passed = Object.values(quizzes).filter((q) => q.passed).length;
  return <p className="mt-3 text-[15px] text-muted">{passed} passed · {taken} taken · {total - taken} to go</p>;
}
