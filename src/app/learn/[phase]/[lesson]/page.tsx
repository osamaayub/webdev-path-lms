import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icons";
import { Badge, PageBar } from "@/components/page-parts";
import { VideoPlayer } from "@/components/video-player";
import { colorFor } from "@/config/theme";
import { allLessons, getLesson, lessonId, PASS_MARK, phases, publicQuiz } from "@/content";
import { videoFor } from "@/content/videos";
import { DoneMark } from "@/features/progress/components/lesson-status";
import { LessonQuiz } from "@/features/quiz/components/lesson-quiz";

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
    <section className="grid grid-cols-[36px_1fr] gap-4 border-t border-rule pt-6">
      <span aria-hidden className="icon-tile h-9 w-9 rounded-full text-[15px] font-bold">{n}</span>
      <div>
        <h2 className="text-xl font-bold">{title}</h2>
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
  const id = lessonId(l);
  const href = (x: typeof l) => `/learn/${x.phase.slug}/${x.slug}`;
  const video = videoFor(id);

  return (
    <div className="mx-auto max-w-[1280px]">
      <PageBar
        trail={[{ href: "/learn", label: "My course" }, { href: `/learn/${l.phase.slug}`, label: `Module ${l.phase.number}` }, { label: `Week ${l.week}` }]}
        badge={<Badge>Week {l.week} of 24</Badge>}
      />

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-6">
          <section className="panel overflow-hidden">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-rule px-4 py-3 sm:px-5">
              <Link href={prev ? href(prev) : `/learn/${l.phase.slug}`} className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-muted hover:bg-card-2 hover:text-ink">
                <Icon name="back" size={16} /> Back
              </Link>
              {/* On phones the title gets its own line instead of being cut off. */}
              <h1 className="order-last basis-full font-semibold leading-snug sm:order-none sm:min-w-0 sm:flex-1 sm:basis-0 sm:truncate">Week {l.week}: {l.title}</h1>
              {next && (
                <Link href={href(next)} className="btn-secondary ml-auto !px-3 !py-2 text-[15px] sm:ml-0">
                  {video ? "Next video" : "Next lesson"} <Icon name="chevronRight" size={16} />
                </Link>
              )}
            </div>
            <div className="p-4 sm:p-5">
              {video ? (
                <VideoPlayer id={video.id} title={video.title} provider={video.provider} />
              ) : (
                <div className="grid aspect-[21/9] place-items-center rounded-2xl border border-rule p-6 text-center" style={{ background: `linear-gradient(135deg, ${c.soft}, var(--card-2))` }}>
                  <div>
                    <p className="text-[14px] font-semibold" style={{ color: c.ink }}>Module {l.phase.number}: {l.phase.title}</p>
                    <p className="mt-1 text-2xl font-bold sm:text-3xl">{l.title}</p>
                    <p className="mx-auto mt-2 max-w-xl text-muted">{l.summary}</p>
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="panel p-5 sm:p-7">
            <h2 className="text-xl font-bold">About this lesson</h2>
            <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-[15px]">
              <div className="flex items-center gap-2"><Icon name="book" size={16} className="text-brand" /><dt className="font-semibold">Module:</dt><dd className="text-muted">{l.phase.title}</dd></div>
              <div className="flex items-center gap-2"><Icon name="cap" size={16} className="text-brand" /><dt className="font-semibold">Time:</dt><dd className="text-muted">about {Math.round(l.minutes / 60)} hours</dd></div>
              {video && <div className="flex items-center gap-2"><Icon name="video" size={16} className="text-brand" /><dt className="font-semibold">Video:</dt><dd className="text-muted">{video.minutes} min</dd></div>}
            </dl>
            <p className="mt-4 text-ink/85">{l.summary}</p>

            <div className="mt-6 rounded-2xl p-5" style={{ background: c.soft }}>
              <h3 className="font-bold">By the end of this week you can</h3>
              <ul className="mt-2 space-y-1.5">
                {l.objectives.map((o) => (
                  <li key={o} className="flex gap-3">
                    <Icon name="check" size={18} className="mt-0.5 shrink-0" />
                    <span className="text-ink/90">{o}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 space-y-8">
              <Step n={1} title="Learn">
                <ul className="list-disc space-y-1.5 pl-5 text-ink/85">{l.learn.map((i) => <li key={i}>{i}</li>)}</ul>
                <h3 className="mt-5 font-semibold">Read or watch</h3>
                <ul className="mt-2 space-y-2">
                  {l.resources.map((r) => (
                    <li key={r.url}>
                      <a href={r.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-semibold text-brand hover:underline">
                        {r.title} <Icon name="external" size={14} /><span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </Step>
              <Step n={2} title="Practice">
                <ol className="list-decimal space-y-1.5 pl-5 text-ink/85">{l.practice.map((i) => <li key={i}>{i}</li>)}</ol>
              </Step>
              <Step n={3} title="Build">
                <p className="rounded-2xl border border-rule bg-card-2 p-5 text-ink/90">{l.build}</p>
              </Step>
            </div>
          </section>

          <section id="quiz" aria-label="Weekly quiz" className="panel scroll-mt-20 p-5 sm:p-7">
            <LessonQuiz lessonId={id} questions={publicQuiz(id)} passPercent={Math.round(PASS_MARK * 100)} color={c.line} nextHref={next ? href(next) : undefined} nextLabel={next ? `week ${next.week}` : undefined} />
          </section>
        </div>

        <aside aria-label="Course modules" className="xl:sticky xl:top-20 xl:self-start">
          <div className="panel overflow-hidden">
            <h2 className="flex items-center gap-3 border-b border-rule px-5 py-4 text-lg font-bold"><Icon name="book" className="text-brand" /> Course modules</h2>
            <div className="max-h-[70vh] space-y-2 overflow-y-auto p-3">
              {phases.map((p) => (
                <details key={p.slug} open={p.slug === l.phase.slug} className="group rounded-xl border border-rule bg-card-2">
                  <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3">
                    <Icon name="chevronRight" size={16} className="shrink-0 text-muted transition-transform group-open:rotate-90" />
                    <span>
                      <span className="block font-semibold">Module {p.number}: {p.title}</span>
                      <span className="block text-[13px] text-muted">{p.lessons.length} lessons · {p.lessons.length} quizzes</span>
                    </span>
                  </summary>
                  <ol className="space-y-0.5 px-2 pb-2">
                    {p.lessons.map((s) => {
                      const current = p.slug === l.phase.slug && s.slug === l.slug;
                      return (
                        <li key={s.slug}>
                          <Link href={`/learn/${p.slug}/${s.slug}`} aria-current={current ? "page" : undefined} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-[14px] ${current ? "bg-brand-soft font-semibold" : "text-muted hover:bg-card hover:text-ink"}`}>
                            <DoneMark id={lessonId({ phase: p, slug: s.slug })} />
                            <span className="min-w-0 flex-1">Week {s.week}: {s.title}</span>
                            {videoFor(lessonId({ phase: p, slug: s.slug })) && <Icon name="video" size={14} className="shrink-0" />}
                          </Link>
                        </li>
                      );
                    })}
                  </ol>
                </details>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
