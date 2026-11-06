import type { Metadata } from "next";
import Link from "next/link";
import { Badge, HeaderCard, PageBar } from "@/components/page-parts";
import { colorFor } from "@/config/theme";
import { getPhase, projects } from "@/content";
import { ProjectStatus } from "@/features/projects/components/project-status";

export const metadata: Metadata = {
  title: "Portfolio projects",
  description: "Six real projects from a landing page to an AI chatbot, each with a brief, user stories, requirements and a submission checklist.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageBar trail={[{ href: "/learn", label: "My course" }, { label: "Projects" }]} badge={<Badge>{projects.length} projects</Badge>} />
      <HeaderCard icon="kanban" title="Six projects, one portfolio" subtitle="Each module ends with a project, reviewed and graded out of 100. Finish all six and you can show every skill a junior full-stack role asks for." />
      <ol className="mt-6 grid gap-5 md:grid-cols-2">
        {projects.map((p) => {
          const c = colorFor(p.phaseSlug);
          const phase = getPhase(p.phaseSlug);
          return (
            <li key={p.slug}>
              <Link href={`/projects/${p.slug}`} className="group flex h-full overflow-hidden panel transition-colors hover:border-brand/50">
                <span aria-hidden className="w-2 shrink-0" style={{ background: c.line }} />
                <span className="flex flex-1 flex-col p-6">
                  <span className="flex items-start justify-between gap-3">
                    <span style={{ color: c.ink }}>Project {p.number}, end of {phase?.title}</span>
                    <ProjectStatus project={p.slug} total={p.requirements.length} />
                  </span>
                  <span className="mt-2 font-display text-2xl font-bold group-hover:underline decoration-2 underline-offset-4">{p.title}</span>
                  <span className="mt-2 flex-1 text-ink/80">{p.brief}</span>
                  <span className="mt-5 flex flex-wrap gap-2">
                    {p.stack.map((s) => <span key={s} className="rounded-full bg-card-2 px-3 py-1 text-[14px]">{s}</span>)}
                    <span className="rounded-full px-3 py-1 text-[14px] text-muted">{p.level}, about {p.hours} h</span>
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
