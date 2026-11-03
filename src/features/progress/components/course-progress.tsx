"use client";

import Link from "next/link";
import { ProgressBar } from "@/components/progress-bar";
import { nextLesson, percent } from "../model";
import { useProgress } from "../store";

type PhaseSummary = { slug: string; number: number; title: string; weeks: string; lessonIds: string[] };
type LessonLink = { id: string; title: string; href: string };

export function CourseProgress({ phases, lessons }: { phases: PhaseSummary[]; lessons: LessonLink[] }) {
  const progress = useProgress();
  const all = percent(progress, lessons.map((l) => l.id));
  const next = nextLesson(progress, lessons);
  const done = progress.completedLessons.length;

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-zinc-600">Your progress</p>
            <p className="mt-1 text-3xl font-bold text-zinc-900">{all}% complete</p>
            <p className="text-sm text-zinc-600">{done} of {lessons.length} lessons done</p>
          </div>
          {next ? (
            <Link href={next.href} className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700">
              {done === 0 ? "Start week 1" : `Continue: ${next.title}`}
            </Link>
          ) : (
            <p className="rounded-xl bg-emerald-50 px-5 py-3 font-semibold text-emerald-800">Course complete. Well done!</p>
          )}
        </div>
        <div className="mt-5">
          <ProgressBar value={all} label="Course progress" />
        </div>
      </section>

      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {phases.map((p) => {
          const value = percent(progress, p.lessonIds);
          return (
            <li key={p.slug}>
              <Link href={`/learn/${p.slug}`} className="block h-full rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-indigo-300 hover:shadow">
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">Phase {p.number} · Weeks {p.weeks}</p>
                <h3 className="mt-1 text-lg font-semibold text-zinc-900">{p.title}</h3>
                <div className="mt-4 flex items-center gap-3">
                  <ProgressBar value={value} label={`${p.title} progress`} />
                  <span className="w-10 text-right text-sm font-medium text-zinc-700">{value}%</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
