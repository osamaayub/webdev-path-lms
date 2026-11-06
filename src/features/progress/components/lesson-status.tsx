"use client";

import { Icon } from "@/components/icons";
import { useProgress } from "../store";

/** The stop on the route line: filled when the week is done. */
export function StopDot({ id, week, color }: { id: string; week: number; color: string }) {
  const done = useProgress().completed.includes(id);
  return (
    <span
      className="relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 text-[13px] font-bold"
      style={{ background: done ? color : "var(--card)", color: done ? "#fff" : "var(--ink)", borderColor: done ? color : "var(--rule)" }}
    >
      {done ? <Icon name="check" size={16} /> : week}
      <span className="sr-only">{done ? "done" : "not done yet"}</span>
    </span>
  );
}

/** Lesson row badge: week number, or a check once the quiz is passed. */
export function LessonRowStatus({ id, week, color }: { id: string; week: number; color: string }) {
  const done = useProgress().completed.includes(id);
  return (
    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[14px] font-bold" style={{ color: done ? "var(--ok)" : color, background: done ? "var(--ok-soft)" : `color-mix(in oklab, ${color} 16%, transparent)` }}>
      {done ? <Icon name="check" size={18} /> : week}
      <span className="sr-only">{done ? "completed" : "not completed"}</span>
    </span>
  );
}

/** Small check used in the course modules accordion. */
export function DoneMark({ id }: { id: string }) {
  const done = useProgress().completed.includes(id);
  return done ? <Icon name="check" size={16} className="shrink-0 text-ok" /> : <span aria-hidden className="h-4 w-4 shrink-0 rounded-full border-2 border-rule" />;
}
