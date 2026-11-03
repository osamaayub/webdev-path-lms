"use client";

import { ProgressBar } from "@/components/progress-bar";
import { percent } from "../model";
import { useProgress } from "../store";

export function PhaseProgress({ title, lessonIds, color }: { title: string; lessonIds: string[]; color: string }) {
  const { completed } = useProgress();
  const value = percent(completed, lessonIds);
  const done = lessonIds.filter((id) => completed.includes(id)).length;
  return (
    <div className="flex items-center gap-4">
      <ProgressBar value={value} label={`${title} progress`} color={color} />
      <span className="whitespace-nowrap text-[15px] text-muted">{done} of {lessonIds.length} weeks done</span>
    </div>
  );
}
