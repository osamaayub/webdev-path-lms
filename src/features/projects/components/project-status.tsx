"use client";

import { useProgress } from "@/features/progress/store";

export function ProjectStatus({ project, total }: { project: string; total: number }) {
  const state = useProgress().projects[project];
  const text = state?.submission ? "Submitted" : state?.checked.length ? `${state.checked.length} of ${total} done` : "Not started";
  const tone = state?.submission ? "bg-[#E2F5EB] text-[#0A6B3C]" : state?.checked.length ? "bg-[#FEF6DC] text-[#7A5600]" : "bg-paper text-muted";
  return <span className={`whitespace-nowrap rounded-full px-3 py-1 text-[14px] font-semibold ${tone}`}>{text}</span>;
}
