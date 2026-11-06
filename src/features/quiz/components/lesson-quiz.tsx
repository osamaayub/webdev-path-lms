"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import type { PublicQuizQuestion } from "@/content";
import { SignInPrompt } from "@/features/auth/components/sign-in-prompt";
import { submitQuiz } from "@/features/progress/actions";
import type { GradedQuiz } from "@/features/progress/model";
import { refreshLearner, useLearner } from "@/features/progress/store";

type Props = { lessonId: string; questions: PublicQuizQuestion[]; passPercent: number; color: string; nextHref?: string; nextLabel?: string };

export function LessonQuiz({ lessonId, questions, passPercent, color, nextHref, nextLabel }: Props) {
  const { state, status } = useLearner();
  const [answers, setAnswers] = useState<(number | undefined)[]>(() => questions.map(() => undefined));
  const [result, setResult] = useState<GradedQuiz | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const summary = state.quizzes[lessonId];
  const done = state.completed.includes(lessonId);
  const answered = answers.filter((a) => a !== undefined).length;
  const needed = Math.ceil((questions.length * passPercent) / 100);

  if (status !== "loading" && !state.viewer) {
    return <SignInPrompt title="Sign in to take the quiz" body={`Score ${needed} out of ${questions.length} to complete this week. Your progress is saved to your account.`} />;
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    start(async () => {
      const res = await submitQuiz(lessonId, answers.map((a) => a ?? -1));
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setResult(res.data);
      void refreshLearner();
      document.getElementById("quiz-result")?.focus();
    });
  }

  function retry() {
    setResult(null);
    setAnswers(questions.map(() => undefined));
  }

  return (
    <form onSubmit={submit} aria-describedby="quiz-intro">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-display text-2xl font-bold">Check your understanding</h2>
        {summary && (
          <p className="text-[15px] text-muted">
            Best score {summary.best} of {summary.total}, {summary.attempts} attempt{summary.attempts === 1 ? "" : "s"}
          </p>
        )}
      </div>
      <p id="quiz-intro" className="mt-1 text-ink/75">
        {done ? "You passed this week. Retake it any time to refresh your memory." : `Score ${needed} out of ${questions.length} to complete this week.`}
      </p>

      <ol className="mt-6 space-y-6">
        {questions.map((q, qi) => {
          const graded = result?.results[qi];
          return (
            <li key={q.id}>
              <fieldset disabled={!!result || pending}>
                <legend className="font-semibold">
                  <span className="text-muted">{qi + 1}. </span>
                  {q.prompt}
                </legend>
                <div className="mt-3 grid gap-2">
                  {q.options.map((opt, oi) => {
                    const chosen = answers[qi] === oi;
                    const isAnswer = graded && graded.answer === oi;
                    const wrongPick = graded && chosen && !graded.correct;
                    return (
                      <label
                        key={oi}
                        className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 px-4 py-3 transition-colors ${
                          isAnswer ? "border-ok bg-ok-soft" : wrongPick ? "border-bad bg-bad-soft" : chosen ? "border-ink bg-card" : "border-rule bg-card hover:border-ink/40"
                        }`}
                      >
                        <input
                          type="radio"
                          name={q.id}
                          value={oi}
                          checked={chosen}
                          onChange={() => setAnswers((a) => a.map((v, i) => (i === qi ? oi : v)))}
                          className="mt-1.5 h-4 w-4 shrink-0 accent-[var(--brand)]"
                        />
                        <span>
                          {opt}
                          {isAnswer && <span className="sr-only"> (correct answer)</span>}
                          {wrongPick && <span className="sr-only"> (your answer, incorrect)</span>}
                        </span>
                      </label>
                    );
                  })}
                </div>
                {graded && <p className={`mt-2 text-[15px] ${graded.correct ? "text-ok" : "text-bad"}`}>{graded.correct ? "Correct. " : "Not quite. "}{graded.explain}</p>}
              </fieldset>
            </li>
          );
        })}
      </ol>

      <div id="quiz-result" tabIndex={-1} aria-live="polite" className="mt-8 outline-none">
        {error && <p role="alert" className="mb-4 rounded-xl bg-bad-soft px-4 py-3 text-bad">{error}</p>}
        {result ? (
          <div className="rounded-[20px] p-6" style={{ background: result.passed ? "var(--ok-soft)" : "var(--warn-soft)" }}>
            <p className="font-display text-2xl font-bold">
              {result.score} of {result.total}. {result.passed ? "Week complete." : "Not there yet."}
            </p>
            <p className="mt-1 text-ink/80">{result.passed ? "Nice work. Your progress is saved." : `You need ${needed} to pass. Read the explanations above, then try again.`}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {result.passed && nextHref && (
                <Link href={nextHref} className="btn-primary">Go to {nextLabel}</Link>
              )}
              <button type="button" onClick={retry} className="rounded-full border border-ink/20 bg-card px-6 py-3 font-semibold hover:border-ink/40">
                {result.passed ? "Retake quiz" : "Try again"}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-4">
            <button type="submit" disabled={pending || answered < questions.length || status === "loading"} className="btn-primary">
              {pending ? "Checking..." : "Check answers"}
            </button>
            <span className="text-[15px] text-muted">{answered} of {questions.length} answered</span>
            {done && <span className="inline-flex items-center gap-2 text-[15px] font-semibold" style={{ color }}><span aria-hidden className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />Week complete</span>}
          </div>
        )}
      </div>
    </form>
  );
}
