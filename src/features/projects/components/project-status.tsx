"use client";

import { useProgress } from "@/features/progress/store";

export function ProjectStatus({ project, total }: { project: string; total: number }) {
  const state = useProgress().projects[project];
  if (state?.submission) return <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">Submitted</span>;
  const n = state?.checked.length ?? 0;
  if (n > 0) return <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">{n}/{total} done</span>;
  return <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">Not started</span>;
}
