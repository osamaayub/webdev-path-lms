"use client";

import Link from "next/link";
import { Icon } from "@/components/icons";
import { ProgressBar } from "@/components/progress-bar";
import { colorFor } from "@/config/theme";
import { SignInPrompt } from "@/features/auth/components/sign-in-prompt";
import { RouteMap, type RouteLine } from "@/features/route/route-map";
import { nextLesson, percent } from "../model";
import { useLearner } from "../store";

/** "My course": welcome, course progress with resume, the modules, and the route map. */
export function CourseProgress({ lines, title, intro }: { lines: RouteLine[]; title: string; intro: { href: string; title: string } }) {
  const { state, status } = useLearner();
  const { completed } = state;
  const stops = lines.flatMap((l) => l.stops.map((s) => ({ ...s, line: l })));
  const all = percent(completed, stops.map((s) => s.id));
  const done = stops.filter((s) => completed.includes(s.id)).length;
  const next = nextLesson(completed, stops);
  const first = (state.viewer?.name ?? "").split(" ")[0];

  return (
    <div className="space-y-6">
      <section className="panel flex items-center gap-4 p-5 sm:p-7">
        <span className="icon-tile h-12 w-12 shrink-0 sm:h-14 sm:w-14"><Icon name="book" size={26} /></span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-[2rem]">{state.viewer ? `Welcome back${first ? `, ${first}` : ""}!` : "Welcome to WebDev Path"}</h1>
          <p className="text-muted">{state.viewer ? "Pick up where you left off." : "A free 24-week course. Sign in to save your progress."}</p>
        </div>
      </section>

      <a href={intro.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 rounded-[20px] px-4 py-4 sm:px-5 text-white shadow-[0_18px_40px_-20px_var(--brand-2)] sm:px-6" style={{ background: "linear-gradient(100deg, var(--brand-2), var(--brand) 60%, var(--brand-2))" }}>
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/20"><Icon name="play" size={18} /></span>
        <span className="min-w-0 flex-1">
          <span className="block font-bold">New here? Watch the 4-minute course roadmap first.</span>
          <span className="hidden text-[14px] text-white/80 sm:block">{intro.title}</span>
        </span>
        <span className="hidden rounded-xl bg-white px-4 py-2 font-semibold text-[#1b2140] sm:inline">Watch now</span>
      </a>

      <SignInPrompt title="Sign in to track your progress" body="Pass each week's quiz to complete it. Your progress follows you to any device." />

      <section className="panel p-5 sm:p-7" aria-labelledby="course-title" aria-busy={status === "loading"}>
        <div className="flex flex-wrap items-start gap-4">
          <span className="icon-tile h-11 w-11 shrink-0"><Icon name="cap" size={22} /></span>
          <div className="min-w-0 flex-1">
            <h2 id="course-title" className="text-xl font-bold sm:text-2xl">{title}</h2>
            <p className="text-[15px] text-muted">{done} / {stops.length} lessons · {all}%</p>
            <div className="mt-3 max-w-3xl"><ProgressBar value={all} label="Course progress" /></div>
            {next ? (
              <Link href={next.href} className="btn-primary mt-4">
                <Icon name="play" size={14} />
                {done === 0 ? "Start week 1" : `Resume: week ${next.week}`}
              </Link>
            ) : (
              <p className="mt-4 font-semibold text-ok">All 24 weeks complete. Well done.</p>
            )}
          </div>
        </div>

        <h3 className="mt-8 text-[15px] font-semibold text-muted">Course modules</h3>
        <ol className="mt-3 space-y-3">
          {lines.map((l) => {
            const v = percent(completed, l.stops.map((s) => s.id));
            const n = l.stops.filter((s) => completed.includes(s.id)).length;
            const c = colorFor(l.slug);
            return (
              <li key={l.slug}>
                <Link href={`/learn/${l.slug}`} className="group flex items-center gap-4 rounded-2xl border border-rule bg-card-2 px-4 py-3.5 hover:border-brand/50 sm:px-5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl font-bold" style={{ color: c.line, background: c.soft }}>{v === 100 ? <Icon name="check" size={18} /> : l.number}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">Module {l.number}: {l.title}</span>
                    <span className="mt-1.5 flex items-center gap-3">
                      <span className="min-w-0 flex-1 sm:w-48 sm:flex-none"><ProgressBar value={v} label={`${l.title} progress`} color={c.line} /></span>
                      <span className="whitespace-nowrap text-[13px] text-muted">{n} / {l.stops.length} lessons</span>
                    </span>
                  </span>
                  <span className="btn-primary hidden !px-4 !py-2 text-[15px] sm:inline-flex">View module <Icon name="arrow" size={16} /></span>
                  <Icon name="chevronRight" className="text-muted sm:hidden" />
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      <section aria-label="Route map" className="panel p-4 sm:p-6">
        <h2 className="mb-2 font-semibold">Your route</h2>
        <RouteMap lines={lines} />
        <p className="mt-2 text-center text-[14px] text-muted">Filled stops are weeks you&apos;ve passed. Click any stop to open it.</p>
      </section>
    </div>
  );
}
