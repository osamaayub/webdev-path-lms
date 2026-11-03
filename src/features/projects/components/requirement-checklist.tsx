"use client";

import { toggleRequirement } from "@/features/progress/model";
import { useProgress, useUpdateProgress } from "@/features/progress/store";

export function RequirementChecklist({ project, items, color }: { project: string; items: string[]; color: string }) {
  const checked = useProgress().projects[project]?.checked ?? [];
  const update = useUpdateProgress();
  return (
    <ul className="divide-y divide-rule overflow-hidden rounded-2xl border border-rule bg-white">
      {items.map((item, i) => {
        const on = checked.includes(i);
        return (
          <li key={item}>
            <label className="flex cursor-pointer items-start gap-4 px-5 py-4 hover:bg-paper">
              <input type="checkbox" checked={on} onChange={() => update((p) => toggleRequirement(p, project, i))} className="peer sr-only" />
              <span aria-hidden className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md border-2 border-ink peer-focus-visible:outline peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2" style={{ background: on ? color : "#fff", borderColor: on ? color : undefined }}>
                {on && <svg width="14" height="14" viewBox="0 0 12 12"><path d="M2 6.5l2.5 2.5L10 3.5" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>}
              </span>
              <span className={on ? "text-muted line-through decoration-1" : ""}>{item}</span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}
