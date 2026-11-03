import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { colorFor } from "@/config/theme";
import { getPhase, lessonId, phases, projectFor } from "@/content";
import { StopDot } from "@/features/progress/components/lesson-status";
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
  return { title: `${phase.number}. ${phase.title}`, description: `Weeks ${phase.weeks[0]} to ${phase.weeks[1]}. ${phase.outcome}`, alternates: { canonical: `/learn/${phase.slug}` } };
}

export default async function PhasePage({ params }: PageProps<"/learn/[phase]">) {
  const phase = getPhase((await params).phase);
  if (!phase) notFound();
  const c = colorFor(phase.slug);
  const project = projectFor(phase);
  const ids = phase.lessons.map((l) => lessonId({ phase, slug: l.slug }));
  const next = phases[phase.number];

  return (
    <div>
      <header className="border-b border-rule" style={{ background: c.soft }}>
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <nav aria-label="Breadcrumb" className="text-[15px] text-ink/70">
            <Link href="/learn" className="hover:underline">My progress</Link> <span aria-hidden>/</span> Line {phase.number}
          </nav>
          <p className="mt-6" style={{ color: c.ink }}>Line {phase.number} of {phases.length}, weeks {phase.weeks[0]} to {phase.weeks[1]}</p>
          <h1 className="mt-1 font-display text-5xl font-extrabold tracking-tight">{phase.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-ink/80">{phase.outcome}</p>
          <div className="mt-8 max-w-md"><PhaseProgress title={phase.title} lessonIds={ids} color={c.line} /></div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <h2 className="sr-only">Weekly stops</h2>
        <ol className="relative">
          <span aria-hidden className="absolute bottom-6 left-[20px] top-6 w-[7px] -translate-x-1/2 rounded-full" style={{ background: c.line }} />
          {phase.lessons.map((l) => (
            <li key={l.slug} className="relative pb-8 last:pb-0">
              <Link href={`/learn/${phase.slug}/${l.slug}`} className="group flex gap-5">
                <StopDot id={lessonId({ phase, slug: l.slug })} week={l.week} color={c.line} />
                <span className="flex-1 rounded-2xl border border-transparent px-4 py-2 transition-colors group-hover:border-rule group-hover:bg-white">
                  <span className="block font-display text-xl font-bold leading-snug">{l.title}</span>
                  <span className="mt-1 block text-ink/75">{l.summary}</span>
                  <span className="mt-1 block text-[15px] text-muted">Week {l.week}, about {Math.round(l.minutes / 60)} hours</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>

        {project && (
          <section className="mt-14 grid gap-6 rounded-[24px] border border-rule bg-white p-7 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <p style={{ color: c.ink }}>End of the line project</p>
              <h2 className="mt-1 font-display text-2xl font-bold">{project.title}</h2>
              <p className="mt-2 text-ink/80">{project.brief}</p>
            </div>
            <Link href={`/projects/${project.slug}`} className="rounded-full bg-ink px-6 py-3 text-center font-semibold text-white hover:bg-[#22325a]">Open the brief</Link>
          </section>
        )}

        <section className="mt-6 rounded-[24px] p-7" style={{ background: c.soft }}>
          <h2 className="font-display text-xl font-bold">Gate to {next ? `line ${next.number}, ${next.title}` : "the finish"}</h2>
          <p className="mt-1 text-ink/80">{phase.gate}</p>
        </section>
      </div>
    </div>
  );
}
