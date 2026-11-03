"use client";

import { useProgress } from "../store";

export function LessonStatus({ id }: { id: string }) {
  const done = useProgress().completedLessons.includes(id);
  return done ? (
    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">Done</span>
  ) : (
    <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">To do</span>
  );
}
