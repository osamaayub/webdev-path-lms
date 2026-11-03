"use client";

import { ProgressBar } from "@/components/progress-bar";
import { percent } from "../model";
import { useProgress } from "../store";

export function PhaseProgress({ title, lessonIds }: { title: string; lessonIds: string[] }) {
  const progress = useProgress();
  const value = percent(progress, lessonIds);
  const done = lessonIds.filter((id) => progress.completedLessons.includes(id)).length;
  return (
    <div className="flex items-center gap-3">
      <ProgressBar value={value} label={`${title} progress`} />
      <span className="whitespace-nowrap text-sm font-medium text-zinc-700">
        {done}/{lessonIds.length} lessons
      </span>
    </div>
  );
}
