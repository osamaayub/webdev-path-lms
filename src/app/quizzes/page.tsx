import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { Badge, HeaderCard, PageBar } from "@/components/page-parts";
import { colorFor } from "@/config/theme";
import { allLessons, lessonId, PASS_MARK, phases } from "@/content";
import { QuizBadge, QuizTotals } from "@/features/account/components/quiz-badge";
import { SignInPrompt } from "@/features/auth/components/sign-in-prompt";

export const metadata: Metadata = {
  title: "Quizzes",
  description: "One short quiz for every week of the course. Pass it to complete the week.",
  alternates: { canonical: "/quizzes" },
};

export default function QuizzesPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageBar trail={[{ href: "/learn", label: "My course" }, { label: "Quizzes" }]} badge={<Badge>{allLessons.length} quizzes · pass mark {Math.round(PASS_MARK * 100)}%</Badge>} />
      <HeaderCard icon="quiz" title="Quizzes" subtitle="Five questions at the end of every week. Score 4 of 5 to complete the week. Answers are checked on the server.">
        <QuizTotals total={allLessons.length} />
      </HeaderCard>
      <div className="mt-6"><SignInPrompt title="Sign in to take quizzes" body="Your scores and attempts are saved to your account." /></div>
      <div className="mt-6 space-y-6">
        {phases.map((p) => {
          const c = colorFor(p.slug);
          return (
            <section key={p.slug} className="panel p-5 sm:p-6" aria-labelledby={`q-${p.slug}`}>
              <h2 id={`q-${p.slug}`} className="flex items-center gap-3 font-bold">
                <span aria-hidden className="h-5 w-1.5 rounded-full" style={{ background: c.line }} />
                Module {p.number}: {p.title}
              </h2>
              <ul className="mt-3 divide-y divide-rule">
                {p.lessons.map((l) => {
                  const id = lessonId({ phase: p, slug: l.slug });
                  return (
                    <li key={l.slug}>
                      <Link href={`/learn/${p.slug}/${l.slug}#quiz`} className="flex flex-wrap items-center gap-3 py-3 hover:text-brand">
                        <Icon name="quiz" size={18} className="text-muted" />
                        <span className="min-w-0 flex-1 font-medium">Week {l.week}: {l.title}</span>
                        <QuizBadge id={id} />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
