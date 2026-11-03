import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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
    <div>
      <header className="border-b border-rule" style={{ background: c.soft }}>
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <nav aria-label="Breadcrumb" className="text-[15px] text-ink/70">
            <Link href="/projects" className="hover:underline">Projects</Link> <span aria-hidden>/</span> Project {project.number}
          </nav>
          <p className="mt-6" style={{ color: c.ink }}>{project.level}, about {project.hours} hours</p>
          <h1 className="mt-1 font-display text-5xl font-extrabold leading-[1.05] tracking-tight">{project.title}</h1>
          <p className="mt-4 text-lg text-ink/80">{project.brief}</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {project.stack.map((s) => <li key={s} className="rounded-full bg-white px-3 py-1 text-[15px]">{s}</li>)}
          </ul>
          {phase && (
            <p className="mt-6 text-[15px] text-ink/75">
              The final project of <Link href={`/learn/${phase.slug}`} className="font-semibold underline underline-offset-4">line {phase.number}, {phase.title}</Link>. It proves: {project.proves.toLowerCase()}.
            </p>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-3xl space-y-14 px-4 py-14 sm:px-6">
        <section>
          <h2 className="font-display text-2xl font-bold">Who it&apos;s for</h2>
          <ul className="mt-4 space-y-3">
            {project.userStories.map((s) => (
              <li key={s} className="rounded-2xl border-l-4 bg-white px-5 py-3 text-ink/85" style={{ borderColor: c.line }}>{s}</li>
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
