"use client";

import Link from "next/link";
import { Icon } from "@/components/icons";
import type { Project } from "@/content";
import { SignInPrompt } from "@/features/auth/components/sign-in-prompt";
import { statusLabel } from "@/features/progress/model";
import { useLearner } from "@/features/progress/store";

const tone = { submitted: "bg-warn-soft text-warn", changes_requested: "bg-bad-soft text-bad", approved: "bg-ok-soft text-ok" } as const;

export function MySubmissions({ projects }: { projects: Pick<Project, "slug" | "number" | "title" | "requirements">[] }) {
  const { state, status } = useLearner();
  if (status !== "loading" && !state.viewer) return <SignInPrompt title="Sign in to see your submissions" body="Submit each module project for review and track grades and feedback here." />;
  return (
    <ul className="space-y-4">
      {projects.map((p) => {
        const s = state.projects[p.slug];
        const sub = s?.submission;
        return (
          <li key={p.slug} className="panel p-5 sm:p-6">
            <div className="flex flex-wrap items-start gap-4">
              <span className="icon-tile h-11 w-11 shrink-0"><Icon name="kanban" size={20} /></span>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] text-muted">Project {p.number}</p>
                <h2 className="text-lg font-bold">{p.title}</h2>
                {sub ? (
                  <p className="mt-1 text-[15px] text-muted">Version {sub.attempts}, updated {new Date(sub.updatedAt).toLocaleDateString()}</p>
                ) : (
                  <p className="mt-1 text-[15px] text-muted">{s?.checked.length ?? 0} of {p.requirements.length} requirements ticked</p>
                )}
              </div>
              <span className={`rounded-lg px-3 py-1.5 text-[14px] font-semibold ${sub ? tone[sub.status] : "bg-card-2 text-muted"}`}>
                {sub ? statusLabel[sub.status] : "Not submitted"}
                {sub?.grade != null && sub.status !== "submitted" ? ` · ${sub.grade}/100` : ""}
              </span>
            </div>
            {sub?.feedback && (
              <blockquote className="mt-4 whitespace-pre-line rounded-xl border border-rule bg-card-2 p-4 text-[15px]">
                <span className="mb-1 block text-[13px] font-semibold text-muted">Reviewer feedback</span>
                {sub.feedback}
              </blockquote>
            )}
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href={`/projects/${p.slug}`} className="btn-secondary !py-2 text-[15px]">{sub ? "Open project" : "Start project"} <Icon name="arrow" size={16} /></Link>
              {sub && <a href={sub.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary !py-2 text-[15px]">Live site <Icon name="external" size={14} /></a>}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
