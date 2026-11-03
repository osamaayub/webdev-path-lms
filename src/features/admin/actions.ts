"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { reviewSchema } from "@/features/progress/model";
import { fail, safely, type ActionResult } from "@/server/action-result";
import { reviewSubmission } from "@/server/learner";
import { logger } from "@/server/logger";
import { requireAdmin } from "@/server/viewer";

export async function reviewSubmissionAction(_prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  return safely("reviewSubmission", async () => {
    const admin = await requireAdmin();
    const parsed = reviewSchema.safeParse({
      submissionId: form.get("submissionId"),
      status: form.get("status"),
      grade: form.get("grade"),
      feedback: form.get("feedback"),
    });
    if (!parsed.success) return fail("Check the review fields.", z.flattenError(parsed.error).fieldErrors);
    const ok = await reviewSubmission({ ...parsed.data, reviewerId: admin.id });
    if (!ok) return fail("That submission no longer exists.");
    logger.info("submission reviewed", { submissionId: parsed.data.submissionId, status: parsed.data.status, by: admin.id });
    revalidatePath("/admin");
    return { ok: true, data: undefined };
  });
}
