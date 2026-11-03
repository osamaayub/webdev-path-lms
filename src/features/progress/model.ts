import { z } from "zod";
import type { QuizQuestion } from "@/content";

// Pure data and rules, shared by server and browser. No I/O here, so it is easy to test.

export type SubmissionStatus = "submitted" | "changes_requested" | "approved";

export type SubmissionView = {
  status: SubmissionStatus;
  repoUrl: string;
  liveUrl: string;
  notes: string | null;
  grade: number | null;
  feedback: string | null;
  attempts: number;
  updatedAt: string;
  reviewedAt: string | null;
};

export type QuizSummary = { best: number; total: number; passed: boolean; attempts: number };

/** Everything the browser needs to personalise the course for one learner. */
export type LearnerState = {
  /** False until the site owner connects a database and sign-in providers. */
  configured: boolean;
  viewer: { name: string | null; image: string | null; isAdmin: boolean } | null;
  completed: string[];
  quizzes: Record<string, QuizSummary>;
  projects: Record<string, { checked: number[]; submission?: SubmissionView }>;
};

export const signedOutState = (configured: boolean): LearnerState => ({ configured, viewer: null, completed: [], quizzes: {}, projects: {} });

// ---------------------------------------------------------------- quizzes

export const quizAnswersSchema = z.array(z.number().int().min(0).max(9)).max(20);

export type GradedQuestion = { id: string; chosen: number; correct: boolean; answer: number; explain: string };
export type GradedQuiz = { score: number; total: number; passed: boolean; results: GradedQuestion[] };

export function gradeQuiz(questions: QuizQuestion[], answers: number[], passMark: number): GradedQuiz {
  const results = questions.map((q, i) => {
    const chosen = answers[i] ?? -1;
    return { id: q.id, chosen, correct: chosen === q.answer, answer: q.answer, explain: q.explain };
  });
  const score = results.filter((r) => r.correct).length;
  const total = questions.length;
  return { score, total, passed: total > 0 && score / total >= passMark, results };
}

// ---------------------------------------------------------------- projects

export const submissionSchema = z.object({
  repoUrl: z
    .url({ message: "Enter a full URL, like https://github.com/you/project" })
    .max(300)
    .refine((u) => /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/.test(u), "Use your GitHub repo URL: https://github.com/you/project"),
  liveUrl: z.url({ message: "Enter the full live URL" }).max(300).refine((u) => u.startsWith("https://"), "The live URL must start with https://"),
  notes: z.string().trim().max(1000, "Keep notes under 1000 characters").optional().transform((v) => v || undefined),
});

export const reviewSchema = z.object({
  submissionId: z.uuid(),
  status: z.enum(["approved", "changes_requested"]),
  grade: z.coerce.number().int().min(0).max(100),
  feedback: z.string().trim().min(10, "Write at least a sentence of feedback").max(4000),
});

export const checklistSchema = z.array(z.number().int().min(0).max(49)).max(50);

export function toggleIndex(list: number[], index: number) {
  return list.includes(index) ? list.filter((i) => i !== index) : [...list, index].sort((a, b) => a - b);
}

// ---------------------------------------------------------------- progress

/** Share of the given lesson ids that are done, 0 to 100. */
export function percent(completed: string[], lessonIds: string[]) {
  if (lessonIds.length === 0) return 0;
  const done = lessonIds.filter((id) => completed.includes(id)).length;
  return Math.round((done / lessonIds.length) * 100);
}

/** First lesson not yet completed, in course order. */
export function nextLesson<T extends { id: string }>(completed: string[], lessons: T[]): T | undefined {
  return lessons.find((l) => !completed.includes(l.id));
}

export const statusLabel: Record<SubmissionStatus, string> = {
  submitted: "In review",
  changes_requested: "Changes requested",
  approved: "Approved",
};
