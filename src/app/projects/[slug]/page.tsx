import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, HeaderCard, PageBar } from "@/components/page-parts";
import { colorFor } from "@/config/theme";
import { getPhase, getProject, practiceFor, projects } from "@/content";
import { BuildPlan, IdeaPicker, PracticeCard, ReferenceBuild, StarterKit } from "@/features/projects/components/project-guide";
import { RequirementChecklist } from "@/features/projects/components/requirement-checklist";
import { SubmissionForm } from "@/features/projects/components/submission-form";

// Every URL is prerendered by generateStaticParams, so pages are served from the CDN.
// Skip the dev-time "instant navigation" check, which flags the params read below.
export const instant = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return { title: `Project ${project.number}: ${project.title}`, description: project.brief, alternates: { canonical: `/projects/${project.slug}` } };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  const phase = getPhase(project.phaseSlug);
  const c = colorFor(project.phaseSlug);
  const warmups = practiceFor(project.phaseSlug);

  return (
    <div className="mx-auto max-w-5xl">
      <PageBar trail={[{ href: "/projects", label: "Projects" }, { label: `Project ${project.number}` }]} badge={<Badge>{project.level} · about {project.hours} h</Badge>} />
      <HeaderCard icon="kanban" title={project.title} subtitle={project.brief}>
        <ul className="mt-4 flex flex-wrap gap-2">
          {project.stack.map((s) => <li key={s} className="rounded-lg border border-rule bg-card-2 px-3 py-1 text-[14px]">{s}</li>)}
        </ul>
        {phase && (
          <p className="mt-4 text-[15px] text-muted">
            The project for <Link href={`/learn/${phase.slug}`} className="font-semibold text-brand hover:underline">module {phase.number}, {phase.title}</Link>. It proves: {project.proves.toLowerCase()}.
          </p>
        )}
      </HeaderCard>

      <div className="panel mt-6 space-y-12 p-5 sm:p-8">
        <section>
          <h2 className="font-display text-2xl font-bold">Who it&apos;s for</h2>
          <ul className="mt-4 space-y-3">
            {project.userStories.map((s) => (
              <li key={s} className="rounded-2xl border-l-4 bg-card px-5 py-3 text-ink/85" style={{ borderColor: c.line }}>{s}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold">Pick your version</h2>
          <p className="mt-1 text-muted">Choose one theme, or your own idea. Same skills, but your portfolio won&apos;t look like everyone else&apos;s.</p>
          <div className="mt-4"><IdeaPicker ideas={project.ideas} color={c.ink} /></div>
        </section>

        {warmups.length > 0 && (
          <section>
            <h2 className="font-display text-2xl font-bold">Warm up first</h2>
            <p className="mt-1 text-muted">Two short builds that practise the skills this project needs. About {Math.round(warmups.reduce((n, b) => n + b.minutes, 0) / 60 * 2) / 2} hours in total.</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">{warmups.map((b) => <PracticeCard key={b.slug} build={b} color={c.ink} />)}</div>
          </section>
        )}

        <section>
          <h2 className="font-display text-2xl font-bold">Build plan</h2>
          <p className="mt-1 text-muted">{project.milestones.length} steps in order. Each one ends with a clear check, so you always know when to move on.</p>
          <div className="mt-5"><BuildPlan milestones={project.milestones} color={c.line} /></div>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold">Requirements</h2>
          <p className="mt-1 text-muted">Tick each one when it&apos;s done. Saved to your account.</p>
          <div className="mt-4"><RequirementChecklist project={project.slug} items={project.requirements} color={c.line} /></div>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold">Go further</h2>
          <p className="mt-1 text-muted">Optional. One of these makes your project stand out from the tutorial version.</p>
          <ul className="mt-4 list-disc space-y-1.5 pl-5 text-ink/85">{project.stretch.map((s) => <li key={s}>{s}</li>)}</ul>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold">Starter kit</h2>
          <p className="mt-1 text-muted">Free APIs, tools and docs for this project.</p>
          <div className="mt-4"><StarterKit kit={project.kit} /></div>
        </section>

        {project.reference && (
          <section>
            <h2 className="font-display text-2xl font-bold">Compare with a finished version</h2>
            <div className="mt-4"><ReferenceBuild reference={project.reference} /></div>
          </section>
        )}

        <section>
          <h2 className="font-display text-2xl font-bold">Submit</h2>
          <div className="mt-4"><SubmissionForm project={project.slug} total={project.requirements.length} /></div>
        </section>
      </div>
    </div>
  );
}
