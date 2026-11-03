import Link from "next/link";
import { ButtonLink } from "@/components/button";
import { colorFor } from "@/config/theme";
import { site } from "@/config/site";
import { allLessons, course, phases, projectFor, projects } from "@/content";
import { RouteMap } from "@/features/route/route-map";
import { routeLines } from "@/features/route/to-lines";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: `${course.title}: zero to job-ready in 24 weeks`,
  description: site.description,
  url: site.url,
  provider: { "@type": "Person", name: site.author.name, url: site.author.url },
  isAccessibleForFree: true,
  educationalLevel: "Beginner",
  hasCourseInstance: { "@type": "CourseInstance", courseMode: "online", courseWorkload: "PT12H/week" },
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD", category: "Free" },
};

const week = [
  { name: "Learn", share: "30% of your time", text: "One focused lesson and the best free resources for it." },
  { name: "Practice", share: "40%", text: "Small exercises you solve yourself before checking." },
  { name: "Build", share: "30%", text: "Add the week's feature to your project and push it to GitHub." },
  { name: "Review", share: "Sunday, 30 minutes", text: "Mark your progress and note what was hard." },
];

export default function Home() {
  const lines = routeLines();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pt-20">
        <div>
          <p className="text-muted">A free course for complete beginners</p>
          <h1 className="mt-4 font-display text-[clamp(2.6rem,6vw,4.6rem)] font-extrabold leading-[1.02] tracking-[-0.03em]">
            Your route from first tag to first developer job.
          </h1>
          <p className="mt-6 max-w-[34rem] text-lg text-ink/80">
            {allLessons.length} weekly stops across HTML, CSS, JavaScript, React, Next.js, Node.js, databases and AI. {course.hoursPerWeek} hours a week, and a real project at the end of every line.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/learn/foundations/how-the-web-works">Start week 1</ButtonLink>
            <ButtonLink href="/projects" variant="secondary">See the {projects.length} projects</ButtonLink>
          </div>
          <p className="mt-6 text-[15px] text-muted">No sign-up. Your progress is saved in this browser.</p>
        </div>
        <div className="rounded-[28px] border border-rule bg-white p-4 shadow-[0_1px_0_#dfe3ec,0_24px_60px_-30px_rgba(20,33,61,0.35)] sm:p-6">
          <RouteMap lines={lines} animate />
        </div>
      </section>

      <section id="route" className="scroll-mt-20 border-y border-rule bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <h2 className="font-display text-4xl font-bold tracking-tight">Six lines, one route</h2>
          <p className="mt-3 max-w-2xl text-ink/80">Each line ends with a project and a gate. Pass the gate before you change lines: every line builds on the one before it.</p>
          <ol className="mt-12 grid gap-x-10 gap-y-12 md:grid-cols-2">
            {phases.map((p) => {
              const c = colorFor(p.slug);
              const project = projectFor(p);
              return (
                <li key={p.slug} className="grid grid-cols-[auto_1fr] gap-5">
                  <span aria-hidden className="mt-1 h-full w-2 rounded-full" style={{ background: c.line }} />
                  <div>
                    <p className="text-[15px] text-muted">Weeks {p.weeks[0]} to {p.weeks[1]}</p>
                    <h3 className="mt-1 font-display text-2xl font-bold tracking-tight">
                      <Link href={`/learn/${p.slug}`} className="hover:underline decoration-2 underline-offset-4" style={{ textDecorationColor: c.line }}>
                        {p.number}. {p.title}
                      </Link>
                    </h3>
                    <p className="mt-2 text-ink/80">{p.outcome}</p>
                    {project && (
                      <p className="mt-3 inline-block rounded-full px-3 py-1 text-[15px]" style={{ background: c.soft, color: c.ink }}>
                        Project {project.number}: {project.title}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="font-display text-4xl font-bold tracking-tight">What a week looks like</h2>
        <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {week.map((w, i) => (
            <li key={w.name} className="border-t-2 border-ink pt-5">
              <p className="font-display text-sm font-bold text-muted">Step {i + 1}</p>
              <h3 className="mt-1 font-display text-2xl font-bold">{w.name}</h3>
              <p className="mt-1 text-[15px] text-muted">{w.share}</p>
              <p className="mt-3 text-ink/80">{w.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 rounded-[28px] bg-ink px-8 py-12 text-white sm:flex-row sm:items-center sm:px-12">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Week 1 takes about 10 hours.</h2>
            <p className="mt-2 text-white/75">You&apos;ll set up your tools and put your first page on GitHub.</p>
          </div>
          <Link href="/learn/foundations/how-the-web-works" className="rounded-full bg-white px-6 py-3 font-semibold text-ink hover:bg-paper">
            Start week 1
          </Link>
        </div>
      </section>
    </>
  );
}
