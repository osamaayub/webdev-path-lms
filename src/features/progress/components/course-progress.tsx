"use client";

import Link from "next/link";
import { ProgressBar } from "@/components/progress-bar";
import { colorFor } from "@/config/theme";
import { RouteMap, type RouteLine } from "@/features/route/route-map";
import { nextLesson, percent } from "../model";
import { useProgress } from "../store";

export function CourseProgress({ lines }: { lines: RouteLine[] }) {
  const progress = useProgress();
  const stops = lines.flatMap((l) => l.stops.map((s) => ({ ...s, line: l })));
  const all = percent(progress, stops.map((s) => s.id));
  const next = nextLesson(progress, stops);
  const done = stops.filter((s) => progress.completedLessons.includes(s.id)).length;
  const c = next ? colorFor(next.line.slug) : colorFor("ai-and-careers");

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
      <div className="space-y-8">
        <section className="rounded-[24px] p-7" style={{ background: c.soft }} aria-labelledby="next-stop">
          {next ? (
            <>
              <p id="next-stop" style={{ color: c.ink }}>{done === 0 ? "Your first stop" : "Your next stop"}</p>
              <p className="mt-2 font-display text-3xl font-bold leading-tight tracking-tight">Week {next.week}: {next.title}</p>
              <p className="mt-1 text-ink/70">{next.line.title} line</p>
              <Link href={next.href} className="mt-6 inline-flex rounded-full bg-ink px-6 py-3 font-semibold text-white hover:bg-[#22325a]">
                {done === 0 ? "Start week 1" : `Continue week ${next.week}`}
              </Link>
            </>
          ) : (
            <>
              <p id="next-stop" style={{ color: c.ink }}>Route complete</p>
              <p className="mt-2 font-display text-3xl font-bold tracking-tight">You finished all 24 weeks.</p>
              <p className="mt-1 text-ink/70">Send your applications and keep building.</p>
            </>
          )}
        </section>

        <section aria-labelledby="overall">
          <div className="flex items-baseline justify-between">
            <h2 id="overall" className="font-display text-xl font-bold">Overall</h2>
            <p className="text-muted">{done} of {stops.length} weeks, {all}%</p>
          </div>
          <div className="mt-3"><ProgressBar value={all} label="Course progress" color="#14213D" /></div>
        </section>

        <section aria-labelledby="lines">
          <h2 id="lines" className="font-display text-xl font-bold">By line</h2>
          <ul className="mt-3 divide-y divide-rule border-y border-rule">
            {lines.map((l) => {
              const v = percent(progress, l.stops.map((s) => s.id));
              const lc = colorFor(l.slug);
              return (
                <li key={l.slug}>
                  <Link href={`/learn/${l.slug}`} className="grid grid-cols-[10px_1fr_80px_44px] items-center gap-4 py-3.5 hover:bg-white">
                    <span aria-hidden className="h-6 w-2 rounded-full" style={{ background: lc.line }} />
                    <span className="font-semibold">{l.number}. {l.title}</span>
                    <ProgressBar value={v} label={`${l.title} progress`} color={lc.line} />
                    <span className="text-right text-[15px] text-muted">{v}%</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <section aria-label="Route map" className="rounded-[24px] border border-rule bg-white p-4 sm:p-6">
        <RouteMap lines={lines} />
        <p className="mt-2 text-center text-[15px] text-muted">Filled stops are weeks you&apos;ve finished. Click any stop to open it.</p>
      </section>
    </div>
  );
}
