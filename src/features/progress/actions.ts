"use server";

import { z } from "zod";
import { getProject, getQuiz, PASS_MARK } from "@/content";
import { fail, safely, type ActionResult } from "@/server/action-result";
import { countRecentAttempts, getChecklist, getSubmission, recordQuizAttempt, saveChecklist, upsertSubmission } from "@/server/learner";
import { requireUser } from "@/server/viewer";
import { gradeQuiz, quizAnswersSchema, submissionSchema, toggleIndex, type GradedQuiz } from "./model";

// Server Actions are public HTTP endpoints. Each one: authenticates, validates every
// input against the course content, rate-limits, then writes only the caller's own rows.

const QUIZ_ATTEMPTS_PER_HOUR = 10;
const RESUBMIT_COOLDOWN_MS = 60_000;

export async function submitQuiz(lessonId: string, answers: number[]): Promise<ActionResult<GradedQuiz>> {
  return safely("submitQuiz", async () => {
    const user = await requireUser();
    const questions = typeof lessonId === "string" ? getQuiz(lessonId) : undefined;
    if (!questions) return fail("This quiz doesn't exist.");
    const parsed = quizAnswersSchema.safeParse(answers);
    if (!parsed.success || parsed.data.length !== questions.length) return fail("Answer every question before submitting.");
    if (parsed.data.some((a, i) => a >= questions[i].options.length)) return fail("One of the answers isn't valid.");

    const recent = await countRecentAttempts(user.id, lessonId, new Date(Date.now() - 60 * 60 * 1000));
    if (recent >= QUIZ_ATTEMPTS_PER_HOUR) return fail("You've tried this quiz 10 times in the last hour. Review the lesson and try again later.");

    const graded = gradeQuiz(questions, parsed.data, PASS_MARK);
    await recordQuizAttempt({ userId: user.id, lessonId, score: graded.score, total: graded.total, passed: graded.passed, answers: parsed.data });
    return { ok: true, data: graded };
  });
}

export async function toggleRequirement(projectSlug: string, index: number): Promise<ActionResult<number[]>> {
  return safely("toggleRequirement", async () => {
    const user = await requireUser();
    const project = typeof projectSlug === "string" ? getProject(projectSlug) : undefined;
    if (!project) return fail("This project doesn't exist.");
    if (!Number.isInteger(index) || index < 0 || index >= project.requirements.length) return fail("That requirement doesn't exist.");
    const checked = toggleIndex(await getChecklist(user.id, project.slug), index);
    await saveChecklist(user.id, project.slug, checked);
    return { ok: true, data: checked };
  });
}

export async function submitProject(projectSlug: string, input: { repoUrl: string; liveUrl: string; notes?: string }): Promise<ActionResult> {
  return safely("submitProject", async () => {
    const user = await requireUser();
    const project = typeof projectSlug === "string" ? getProject(projectSlug) : undefined;
    if (!project) return fail("This project doesn't exist.");

    const parsed = submissionSchema.safeParse(input);
    if (!parsed.success) return fail("Check the highlighted fields.", z.flattenError(parsed.error).fieldErrors);

    const checked = await getChecklist(user.id, project.slug);
    if (checked.length < project.requirements.length) return fail("Tick every requirement before you submit.");

    const existing = await getSubmission(user.id, project.slug);
    if (existing?.status === "approved") return fail("This project is already approved.");
    if (existing?.status === "submitted" && Date.now() - existing.updatedAt.getTime() < RESUBMIT_COOLDOWN_MS) {
      return fail("You just submitted. Wait a minute before updating it.");
    }

    await upsertSubmission(user.id, project.slug, parsed.data);
    return { ok: true, data: undefined };
  });
}
