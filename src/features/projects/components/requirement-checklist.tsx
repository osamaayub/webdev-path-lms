"use client";

import { useState } from "react";
import { setRequirement } from "@/features/progress/actions";
import { toggleIndex } from "@/features/progress/model";
import { patchLearner, refreshLearner, useLearner } from "@/features/progress/store";

export function RequirementChecklist({ project, items, color }: { project: string; items: string[]; color: string }) {
  const { state } = useLearner();
  const [error, setError] = useState<string | null>(null);
  const signedIn = Boolean(state.viewer);
  const checked = state.projects[project]?.checked ?? [];

  async function toggle(i: number) {
    setError(null);
    const on = !checked.includes(i);
    // Optimistic: tick now, confirm with the server, roll back on failure.
    patchLearner((s) => ({ ...s, projects: { ...s.projects, [project]: { ...s.projects[project], checked: toggleIndex(s.projects[project]?.checked ?? [], i) } } }));
    const res = await setRequirement(project, i, on);
    if (!res.ok) {
      setError(res.error);
      await refreshLearner();
    }
  }

  return (
    <>
      <ul className="divide-y divide-rule overflow-hidden rounded-2xl border border-rule bg-white">
        {items.map((item, i) => {
          const on = checked.includes(i);
          return (
            <li key={item}>
              <label className={`flex items-start gap-4 px-5 py-4 ${signedIn ? "cursor-pointer hover:bg-paper" : ""}`}>
                <input type="checkbox" checked={on} disabled={!signedIn} onChange={() => toggle(i)} className="peer sr-only" />
                <span aria-hidden className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md border-2 border-ink peer-focus-visible:outline peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-disabled:opacity-40" style={{ background: on ? color : "#fff", borderColor: on ? color : undefined }}>
                  {on && <svg width="14" height="14" viewBox="0 0 12 12"><path d="M2 6.5l2.5 2.5L10 3.5" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>}
                </span>
                <span className={on ? "text-muted line-through decoration-1" : ""}>{item}</span>
              </label>
            </li>
          );
        })}
      </ul>
      {error && <p role="alert" className="mt-3 text-[15px] text-[#C2361B]">{error}</p>}
    </>
  );
}
