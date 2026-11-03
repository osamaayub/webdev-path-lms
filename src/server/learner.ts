import "server-only";
import { and, count, desc, eq, gte, sql } from "drizzle-orm";
import type { LearnerState, QuizSummary, SubmissionStatus, SubmissionView } from "@/features/progress/model";
import { getDb } from "./db";
import { lessonProgress, projectChecklists, quizAttempts, submissions, users } from "./db/schema";

// Data access for learner records. Every function takes the user id from the
// verified session (never from the request body), so learners only touch their own rows.

const iso = (d: Date | null) => (d ? d.toISOString() : null);

export async function getLearnerState(userId: string): Promise<Omit<LearnerState, "configured" | "viewer">> {
  const db = await getDb();
  const [done, quizRows, checklistRows, submissionRows] = await Promise.all([
    db.select({ lessonId: lessonProgress.lessonId }).from(lessonProgress).where(eq(lessonProgress.userId, userId)),
    db
      .select({
        lessonId: quizAttempts.lessonId,
        best: sql<number>`max(${quizAttempts.score})`.mapWith(Number),
        total: sql<number>`max(${quizAttempts.total})`.mapWith(Number),
        passed: sql<boolean>`bool_or(${quizAttempts.passed})`,
        attempts: count(),
      })
      .from(quizAttempts)
      .where(eq(quizAttempts.userId, userId))
      .groupBy(quizAttempts.lessonId),
    db.select({ projectSlug: projectChecklists.projectSlug, checked: projectChecklists.checked }).from(projectChecklists).where(eq(projectChecklists.userId, userId)),
    db
      .select({
        projectSlug: submissions.projectSlug,
        status: submissions.status,
        repoUrl: submissions.repoUrl,
        liveUrl: submissions.liveUrl,
        notes: submissions.notes,
        grade: submissions.grade,
        feedback: submissions.feedback,
        attempts: submissions.attempts,
        updatedAt: submissions.updatedAt,
        reviewedAt: submissions.reviewedAt,
      })
      .from(submissions)
      .where(eq(submissions.userId, userId)),
  ]);

  const quizzes: Record<string, QuizSummary> = {};
  for (const q of quizRows) quizzes[q.lessonId] = { best: q.best, total: q.total, passed: Boolean(q.passed), attempts: Number(q.attempts) };

  const projects: LearnerState["projects"] = {};
  for (const c of checklistRows) projects[c.projectSlug] = { checked: c.checked };
  for (const s of submissionRows) {
    const view: SubmissionView = { ...s, updatedAt: s.updatedAt.toISOString(), reviewedAt: iso(s.reviewedAt) };
    projects[s.projectSlug] = { checked: projects[s.projectSlug]?.checked ?? [], submission: view };
  }

  return { completed: done.map((d) => d.lessonId), quizzes, projects };
}

// ---------------------------------------------------------------- quizzes

export async function countRecentAttempts(userId: string, lessonId: string, since: Date) {
  const db = await getDb();
  const [row] = await db
    .select({ n: count() })
    .from(quizAttempts)
    .where(and(eq(quizAttempts.userId, userId), eq(quizAttempts.lessonId, lessonId), gte(quizAttempts.createdAt, since)));
  return Number(row?.n ?? 0);
}

export async function recordQuizAttempt(input: { userId: string; lessonId: string; score: number; total: number; passed: boolean; answers: number[] }) {
  const db = await getDb();
  await db.insert(quizAttempts).values(input);
  if (input.passed) {
    await db.insert(lessonProgress).values({ userId: input.userId, lessonId: input.lessonId }).onConflictDoNothing();
  }
}

// ---------------------------------------------------------------- projects

export async function getChecklist(userId: string, projectSlug: string) {
  const db = await getDb();
  const [row] = await db
    .select({ checked: projectChecklists.checked })
    .from(projectChecklists)
    .where(and(eq(projectChecklists.userId, userId), eq(projectChecklists.projectSlug, projectSlug)));
  return row?.checked ?? [];
}

/**
 * Ticks or unticks one requirement in a single SQL statement, so fast clicks
 * (several requests in flight at once) can't overwrite each other.
 */
export async function setChecklistItem(userId: string, projectSlug: string, index: number, on: boolean) {
  const db = await getDb();
  const col = projectChecklists.checked;
  const now = new Date();
  if (on) {
    const [row] = await db
      .insert(projectChecklists)
      .values({ userId, projectSlug, checked: [index] })
      .onConflictDoUpdate({
        target: [projectChecklists.userId, projectChecklists.projectSlug],
        set: {
          checked: sql`(select coalesce(jsonb_agg(v order by v::int), '[]'::jsonb) from (select distinct v from jsonb_array_elements(${col} || jsonb_build_array(${index}::int)) as t(v)) s)`,
          updatedAt: now,
        },
      })
      .returning({ checked: col });
    return row?.checked ?? [index];
  }
  const [row] = await db
    .update(projectChecklists)
    .set({
      checked: sql`(select coalesce(jsonb_agg(v order by v::int), '[]'::jsonb) from jsonb_array_elements(${col}) as t(v) where v <> to_jsonb(${index}::int))`,
      updatedAt: now,
    })
    .where(and(eq(projectChecklists.userId, userId), eq(projectChecklists.projectSlug, projectSlug)))
    .returning({ checked: col });
  return row?.checked ?? [];
}

export async function getSubmission(userId: string, projectSlug: string) {
  const db = await getDb();
  const [row] = await db
    .select({ status: submissions.status, updatedAt: submissions.updatedAt })
    .from(submissions)
    .where(and(eq(submissions.userId, userId), eq(submissions.projectSlug, projectSlug)));
  return row;
}

export async function upsertSubmission(userId: string, projectSlug: string, data: { repoUrl: string; liveUrl: string; notes?: string }) {
  const db = await getDb();
  const now = new Date();
  await db
    .insert(submissions)
    .values({ userId, projectSlug, ...data, notes: data.notes ?? null })
    .onConflictDoUpdate({
      target: [submissions.userId, submissions.projectSlug],
      set: { ...data, notes: data.notes ?? null, status: "submitted", attempts: sql`${submissions.attempts} + 1`, updatedAt: now },
    });
}

// ---------------------------------------------------------------- admin

export type AdminSubmission = {
  id: string;
  projectSlug: string;
  status: SubmissionStatus;
  repoUrl: string;
  liveUrl: string;
  notes: string | null;
  grade: number | null;
  feedback: string | null;
  attempts: number;
  updatedAt: Date;
  learnerName: string | null;
  learnerEmail: string | null;
};

export async function listSubmissions(status: SubmissionStatus | "all", limit = 100): Promise<AdminSubmission[]> {
  const db = await getDb();
  const rows = await db
    .select({
      id: submissions.id,
      projectSlug: submissions.projectSlug,
      status: submissions.status,
      repoUrl: submissions.repoUrl,
      liveUrl: submissions.liveUrl,
      notes: submissions.notes,
      grade: submissions.grade,
      feedback: submissions.feedback,
      attempts: submissions.attempts,
      updatedAt: submissions.updatedAt,
      learnerName: users.name,
      learnerEmail: users.email,
    })
    .from(submissions)
    .innerJoin(users, eq(users.id, submissions.userId))
    .where(status === "all" ? undefined : eq(submissions.status, status))
    .orderBy(status === "submitted" ? submissions.updatedAt : desc(submissions.updatedAt))
    .limit(limit);
  return rows;
}

export async function reviewSubmission(input: { submissionId: string; reviewerId: string; status: "approved" | "changes_requested"; grade: number; feedback: string }) {
  const db = await getDb();
  const now = new Date();
  const updated = await db
    .update(submissions)
    .set({ status: input.status, grade: input.grade, feedback: input.feedback, reviewedBy: input.reviewerId, reviewedAt: now, updatedAt: now })
    .where(eq(submissions.id, input.submissionId))
    .returning({ id: submissions.id });
  return updated.length === 1;
}

export async function adminStats() {
  const db = await getDb();
  const [[learners], byStatus, [attempts], [completions]] = await Promise.all([
    db.select({ n: count() }).from(users),
    db.select({ status: submissions.status, n: count() }).from(submissions).groupBy(submissions.status),
    db.select({ n: count() }).from(quizAttempts),
    db.select({ n: count() }).from(lessonProgress),
  ]);
  const s = Object.fromEntries(byStatus.map((r) => [r.status, Number(r.n)])) as Partial<Record<SubmissionStatus, number>>;
  return {
    learners: Number(learners?.n ?? 0),
    inReview: s.submitted ?? 0,
    changesRequested: s.changes_requested ?? 0,
    approved: s.approved ?? 0,
    quizAttempts: Number(attempts?.n ?? 0),
    lessonsCompleted: Number(completions?.n ?? 0),
  };
}

/** Removes the user and, through ON DELETE CASCADE, every record that belongs to them. */
export async function deleteUser(userId: string) {
  const db = await getDb();
  await db.delete(users).where(eq(users.id, userId));
}
