import type { Milestone, PracticeBuild, Project } from "@/content";
import { Icon } from "@/components/icons";

/** Three themes to pick from, so learners build their own version, not a copy. */
export function IdeaPicker({ ideas, color }: { ideas: string[]; color: string }) {
  return (
    <ol className="grid gap-3 sm:grid-cols-3">
      {ideas.map((idea, i) => (
        <li key={idea} className="rounded-2xl border border-rule bg-card p-4">
          <span className="text-[14px] font-semibold" style={{ color }}>Option {String.fromCharCode(65 + i)}</span>
          <p className="mt-1 text-ink/85">{idea}</p>
        </li>
      ))}
    </ol>
  );
}

/** The step-by-step build plan. Hints stay closed so learners try first. */
export function BuildPlan({ milestones, color }: { milestones: Milestone[]; color: string }) {
  return (
    <ol className="space-y-4">
      {milestones.map((m, i) => (
        <li key={m.title} className="flex gap-3 sm:gap-4">
          <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-full font-display font-bold text-white sm:h-9 sm:w-9" style={{ background: color }}>{i + 1}</span>
          <div className="min-w-0 flex-1 rounded-2xl border border-rule bg-card p-4 sm:p-5">
            <h3 className="font-display text-lg font-bold">{m.title}</h3>
            <p className="mt-1 text-ink/85">{m.task}</p>
            <p className="mt-3 flex gap-2 rounded-xl bg-ok-soft px-3 py-2 text-[15px]">
              <Icon name="check" size={18} className="mt-0.5 shrink-0 text-ok" />
              <span><span className="font-semibold">Done when: </span>{m.doneWhen}</span>
            </p>
            <details className="group mt-3">
              <summary className="cursor-pointer text-[15px] font-semibold text-brand marker:content-none">
                <span className="group-open:hidden">Stuck? Show a hint</span>
                <span className="hidden group-open:inline">Hide hint</span>
              </summary>
              <p className="mt-2 rounded-xl bg-card-2 px-3 py-2 text-[15px] text-ink/85">{m.hint}</p>
            </details>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function PracticeCard({ build, color }: { build: PracticeBuild; color: string }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-rule bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg font-bold">{build.title}</h3>
        <span className="shrink-0 rounded-full bg-card-2 px-3 py-0.5 text-[14px] text-muted">{build.minutes < 60 ? `${build.minutes} min` : `${build.minutes / 60} h`}</span>
      </div>
      <p className="mt-1 text-ink/85">{build.goal}</p>
      <ol className="mt-3 list-decimal space-y-1 pl-5 text-[15px] text-ink/80">
        {build.steps.map((s) => <li key={s}>{s}</li>)}
      </ol>
      <p className="mt-3 flex-1 text-[15px]"><span className="font-semibold">Done when: </span>{build.doneWhen}</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {build.skills.map((s) => <li key={s} className="rounded-full px-2.5 py-0.5 text-[13px] font-semibold" style={{ background: `color-mix(in oklch, ${color} 15%, transparent)`, color }}>{s}</li>)}
      </ul>
    </article>
  );
}

export function StarterKit({ kit }: { kit: Project["kit"] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {kit.map((r) => (
        <li key={r.url}>
          <a href={r.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 rounded-2xl border border-rule bg-card px-4 py-3 hover:border-brand/50">
            <span>{r.title}</span>
            <Icon name="external" size={16} className="shrink-0 text-muted" />
          </a>
        </li>
      ))}
    </ul>
  );
}

export function ReferenceBuild({ reference }: { reference: NonNullable<Project["reference"]> }) {
  return (
    <div className="rounded-2xl border border-rule bg-card p-5">
      <p className="font-semibold">{reference.label}</p>
      <p className="mt-1 text-[15px] text-muted">Build your own version first. Then open this to compare how a finished app handles the same problems, and borrow ideas.</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <a href={reference.repo} target="_blank" rel="noopener noreferrer" className="btn-secondary">Source code <Icon name="external" size={16} /></a>
        {reference.live && <a href={reference.live} target="_blank" rel="noopener noreferrer" className="btn-secondary">Live demo <Icon name="external" size={16} /></a>}
        {reference.video && <a href={reference.video} target="_blank" rel="noopener noreferrer" className="btn-secondary">Video walkthrough <Icon name="external" size={16} /></a>}
      </div>
    </div>
  );
}
