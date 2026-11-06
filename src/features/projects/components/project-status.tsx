"use client";

import { statusLabel } from "@/features/progress/model";
import { useProgress } from "@/features/progress/store";

const tones = {
  approved: "bg-ok-soft text-ok",
  submitted: "bg-warn-soft text-warn",
  changes_requested: "bg-bad-soft text-bad",
  progress: "bg-brand-soft text-brand",
  none: "bg-card-2 text-muted",
};

export function ProjectStatus({ project, total }: { project: string; total: number }) {
  const { viewer, projects } = useProgress();
  if (!viewer) return null;
  const state = projects[project];
  const sub = state?.submission;
  const text = sub ? statusLabel[sub.status] : state?.checked.length ? `${state.checked.length} of ${total} done` : "Not started";
  const tone = sub ? tones[sub.status] : state?.checked.length ? tones.progress : tones.none;
  return <span className={`whitespace-nowrap rounded-full px-3 py-1 text-[14px] font-semibold ${tone}`}>{text}</span>;
}
