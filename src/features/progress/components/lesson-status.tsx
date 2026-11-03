"use client";

import { useProgress } from "../store";

/** The stop on the line: filled when the week is done. */
export function StopDot({ id, week, color }: { id: string; week: number; color: string }) {
  const done = useProgress().completedLessons.includes(id);
  return (
    <span
      className="relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full border-[3px] border-ink font-display text-sm font-bold"
      style={{ background: done ? color : "#fff", color: done ? "#fff" : "#14213D" }}
    >
      {week}
      <span className="sr-only">{done ? "done" : "not done yet"}</span>
    </span>
  );
}
