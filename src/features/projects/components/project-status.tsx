"use client";

import { statusLabel } from "@/features/progress/model";
import { useProgress } from "@/features/progress/store";

const tones = {
  approved: "bg-[#E2F5EB] text-[#0A6B3C]",
  submitted: "bg-[#FEF6DC] text-[#7A5600]",
  changes_requested: "bg-[#FDEDE8] text-[#9A2E10]",
  progress: "bg-[#E8ECFD] text-[#1F34A3]",
  none: "bg-paper text-muted",
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
