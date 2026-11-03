"use client";

import { toggleRequirement } from "@/features/progress/model";
import { useProgress, useUpdateProgress } from "@/features/progress/store";

export function RequirementChecklist({ project, items }: { project: string; items: string[] }) {
  const checked = useProgress().projects[project]?.checked ?? [];
  const update = useUpdateProgress();
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={item}>
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-zinc-200 bg-white p-3 hover:border-indigo-300">
            <input
              type="checkbox"
              checked={checked.includes(i)}
              onChange={() => update((p) => toggleRequirement(p, project, i))}
              className="mt-0.5 h-5 w-5 accent-indigo-600"
            />
            <span className={checked.includes(i) ? "text-zinc-500 line-through" : "text-zinc-800"}>{item}</span>
          </label>
        </li>
      ))}
    </ul>
  );
}
