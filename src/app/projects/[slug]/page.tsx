import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, HeaderCard, PageBar } from "@/components/page-parts";
import { colorFor } from "@/config/theme";
import { getPhase, getProject, projects } from "@/content";
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
          <h2 className="font-display text-2xl font-bold">Submit</h2>
          <div className="mt-4"><SubmissionForm project={project.slug} total={project.requirements.length} /></div>
        </section>
      </div>
    </div>
  );
}
