import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { colorFor } from "@/config/theme";
import { allLessons, getLesson, lessonId, PASS_MARK, publicQuiz } from "@/content";
import { LessonQuiz } from "@/features/quiz/components/lesson-quiz";
import { StopDot } from "@/features/progress/components/lesson-status";

// Every URL is prerendered by generateStaticParams, so pages are served from the CDN.
// Skip the dev-time "instant navigation" check, which flags the params read below.
export const instant = false;

export function generateStaticParams() {
  return allLessons.map((l) => ({ phase: l.phase.slug, lesson: l.slug }));
}

export async function generateMetadata({ params }: PageProps<"/learn/[phase]/[lesson]">): Promise<Metadata> {
  const { phase, lesson } = await params;
  const found = getLesson(phase, lesson);
  if (!found) return {};
  return { title: `Week ${found.lesson.week}: ${found.lesson.title}`, description: found.lesson.summary, alternates: { canonical: `/learn/${phase}/${lesson}` } };
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="grid grid-cols-[40px_1fr] gap-4 border-t border-rule pt-8">
      <span aria-hidden className="grid h-10 w-10 place-items-center rounded-full bg-ink font-display font-bold text-white">{n}</span>
      <div>
        <h2 className="font-display text-2xl font-bold">{title}</h2>
        <div className="mt-3">{children}</div>
      </div>
    </section>
  );
}

export default async function LessonPage({ params }: PageProps<"/learn/[phase]/[lesson]">) {
  const { phase, lesson } = await params;
  const found = getLesson(phase, lesson);
  if (!found) notFound();
  const { lesson: l, prev, next } = found;
  const c = colorFor(l.phase.slug);
  const href = (x: typeof l) => `/learn/${x.phase.slug}/${x.slug}`;

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[240px_1fr]">
      <aside className="hidden lg:block">
        <nav aria-label={`${l.phase.title} weeks`} className="sticky top-24">
          <Link href={`/learn/${l.phase.slug}`} className="font-display font-bold hover:underline">{l.phase.number}. {l.phase.title}</Link>
          <ol className="relative mt-5 space-y-4">
            <span aria-hidden className="absolute bottom-4 left-[22px] top-4 w-[5px] -translate-x-1/2 rounded-full" style={{ background: c.line }} />
            {l.phase.lessons.map((s) => {
              const current = s.slug === l.slug;
              return (
                <li key={s.slug} className="relative">
                  <Link href={`/learn/${l.phase.slug}/${s.slug}`} aria-current={current ? "page" : undefined} className="flex items-center gap-3">
                    <StopDot id={lessonId({ phase: l.phase, slug: s.slug })} week={s.week} color={c.line} />
                    <span className={`text-[15px] leading-snug ${current ? "font-bold" : "text-ink/70 hover:text-ink"}`}>{s.title}</span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </nav>
      </aside>

      <article className="max-w-[44rem]">
        <nav aria-label="Breadcrumb" className="text-[15px] text-muted lg:hidden">
          <Link href={`/learn/${l.phase.slug}`} className="hover:underline">{l.phase.number}. {l.phase.title}</Link>
        </nav>
        <p className="mt-2 lg:mt-0" style={{ color: c.ink }}>Week {l.week} of 24, about {Math.round(l.minutes / 60)} hours</p>
        <h1 className="mt-2 font-display text-[clamp(2.2rem,4.5vw,3.4rem)] font-extrabold leading-[1.05] tracking-tight">{l.title}</h1>
        <p className="mt-4 text-xl text-ink/80">{l.summary}</p>

        <section className="mt-10 rounded-[24px] p-7" style={{ background: c.soft }}>
          <h2 className="font-display text-xl font-bold">By the end of this week you can</h2>
          <ul className="mt-3 space-y-2">
            {l.objectives.map((o) => (
              <li key={o} className="flex gap-3">
                <span aria-hidden className="mt-2.5 h-2 w-2 shrink-0 rounded-full" style={{ background: c.line }} />
                {o}
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-12 space-y-12">
          <Step n={1} title="Learn">
            <ul className="list-disc space-y-1.5 pl-5 text-ink/85">{l.learn.map((i) => <li key={i}>{i}</li>)}</ul>
            <h3 className="mt-6 font-bold">Read or watch</h3>
            <ul className="mt-2 space-y-2">
              {l.resources.map((r) => (
                <li key={r.url}>
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="font-semibold underline decoration-2 underline-offset-4 hover:no-underline" style={{ textDecorationColor: c.line }}>
                    {r.title}<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </Step>
          <Step n={2} title="Practice">
            <ol className="list-decimal space-y-1.5 pl-5 text-ink/85">{l.practice.map((i) => <li key={i}>{i}</li>)}</ol>
          </Step>
          <Step n={3} title="Build">
            <p className="rounded-2xl border border-rule bg-white p-5 text-ink/90">{l.build}</p>
          </Step>
        </div>

        <section aria-label="Weekly quiz" className="mt-14 rounded-[24px] border border-rule bg-white p-6 sm:p-8">
          <LessonQuiz
            lessonId={lessonId(l)}
            questions={publicQuiz(lessonId(l))}
            passPercent={Math.round(PASS_MARK * 100)}
            color={c.line}
            nextHref={next ? href(next) : undefined}
            nextLabel={next ? `week ${next.week}` : undefined}
          />
        </section>

        <nav aria-label="Previous and next week" className="mt-8 grid gap-3 sm:grid-cols-2">
          {prev ? (
            <Link href={href(prev)} className="rounded-2xl border border-rule bg-white p-4 hover:border-ink/30">
              <span className="text-[15px] text-muted">Previous: week {prev.week}</span>
              <span className="mt-0.5 block font-semibold">{prev.title}</span>
            </Link>
          ) : <span />}
          {next && (
            <Link href={href(next)} className="rounded-2xl border border-rule bg-white p-4 text-right hover:border-ink/30">
              <span className="text-[15px] text-muted">Next: week {next.week}</span>
              <span className="mt-0.5 block font-semibold">{next.title}</span>
            </Link>
          )}
        </nav>
      </article>
    </div>
  );
}
