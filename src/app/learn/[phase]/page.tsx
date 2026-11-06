import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icons";
import { Badge, HeaderCard, PageBar } from "@/components/page-parts";
import { colorFor } from "@/config/theme";
import { getPhase, getQuiz, lessonId, phases, projectFor } from "@/content";
import { videoFor } from "@/content/videos";
import { LessonRowStatus } from "@/features/progress/components/lesson-status";
import { PhaseProgress } from "@/features/progress/components/phase-progress";

// Every URL is prerendered by generateStaticParams, so pages are served from the CDN.
// Skip the dev-time "instant navigation" check, which flags the params read below.
export const instant = false;

export function generateStaticParams() {
  return phases.map((p) => ({ phase: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/learn/[phase]">): Promise<Metadata> {
  const phase = getPhase((await params).phase);
  if (!phase) return {};
  return { title: `Module ${phase.number}: ${phase.title}`, description: `Weeks ${phase.weeks[0]} to ${phase.weeks[1]}. ${phase.outcome}`, alternates: { canonical: `/learn/${phase.slug}` } };
}

export default async function PhasePage({ params }: PageProps<"/learn/[phase]">) {
  const phase = getPhase((await params).phase);
  if (!phase) notFound();
  const c = colorFor(phase.slug);
  const project = projectFor(phase);
  const ids = phase.lessons.map((l) => lessonId({ phase, slug: l.slug }));
  const next = phases[phase.number];
  const videoCount = phase.lessons.filter((l) => videoFor(lessonId({ phase, slug: l.slug }))).length;

  return (
    <div className="mx-auto max-w-6xl">
      <PageBar trail={[{ href: "/learn", label: "My course" }, { label: `Module ${phase.number}` }]} badge={<Badge>Weeks {phase.weeks[0]} to {phase.weeks[1]}</Badge>} />

      <HeaderCard title={`Module ${phase.number}: ${phase.title}`} subtitle={phase.outcome}>
        <div className="mt-4 max-w-2xl"><PhaseProgress title={phase.title} lessonIds={ids} color={c.line} /></div>
        <p className="mt-3 text-[14px] text-muted">
          {phase.lessons.length} lessons · {phase.lessons.length} quizzes{videoCount ? ` · ${videoCount} video${videoCount === 1 ? "" : "s"}` : ""} · 1 project
        </p>
      </HeaderCard>

      <section className="panel mt-6 p-5 sm:p-7" aria-labelledby="lessons">
        <h2 id="lessons" className="text-[15px] font-semibold text-muted">Lessons</h2>
        <ol className="mt-3 space-y-3">
          {phase.lessons.map((l) => {
            const id = lessonId({ phase, slug: l.slug });
            const hasVideo = Boolean(videoFor(id));
            return (
              <li key={l.slug}>
                <Link href={`/learn/${phase.slug}/${l.slug}`} className="group flex items-center gap-4 rounded-2xl border border-rule bg-card-2 px-4 py-3.5 hover:border-brand/50 sm:px-5">
                  <LessonRowStatus id={id} week={l.week} color={c.line} />
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">Week {l.week}: {l.title}</span>
                    <span className="block text-[14px] text-muted">
                      About {Math.round(l.minutes / 60)} hours · {getQuiz(id)?.length ?? 0}-question quiz{hasVideo ? " · video" : ""}
                    </span>
                  </span>
                  <span className="btn-primary hidden !px-4 !py-2 text-[15px] sm:inline-flex">Open lesson <Icon name="arrow" size={16} /></span>
                  <Icon name="chevronRight" className="text-muted sm:hidden" />
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      {project && (
        <section className="panel mt-6 grid gap-5 p-5 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-7">
          <span className="icon-tile h-12 w-12"><Icon name="kanban" size={22} /></span>
          <div>
            <p className="text-[14px] font-semibold" style={{ color: c.ink }}>Module project, graded by a reviewer</p>
            <h2 className="mt-0.5 text-xl font-bold">{project.title}</h2>
            <p className="mt-1 text-muted">{project.brief}</p>
          </div>
          <Link href={`/projects/${project.slug}`} className="btn-primary">Open the brief <Icon name="arrow" size={16} /></Link>
        </section>
      )}

      <section className="mt-6 rounded-[20px] border border-rule p-5 sm:p-7" style={{ background: c.soft }}>
        <h2 className="font-bold">Gate to {next ? `module ${next.number}, ${next.title}` : "the finish"}</h2>
        <p className="mt-1 text-ink/80">{phase.gate}</p>
      </section>
    </div>
  );
}
