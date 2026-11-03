import { connection } from "next/server";
import { signedOutState, type LearnerState } from "@/features/progress/model";
import { authConfigured } from "@/server/auth";
import { getLearnerState } from "@/server/learner";
import { logger } from "@/server/logger";
import { getViewer } from "@/server/viewer";

// Personal data for the signed-in learner. Course pages are static and cached on the CDN;
// this small private response fills in progress, quiz scores and submissions in the browser.
const headers = { "Cache-Control": "private, no-store" };

export async function GET() {
  await connection(); // always per request, never prerendered
  const configured = authConfigured();
  try {
    const viewer = await getViewer();
    if (!viewer) return Response.json(signedOutState(configured), { headers });
    const state: LearnerState = {
      configured,
      viewer: { name: viewer.name, image: viewer.image, isAdmin: viewer.isAdmin },
      ...(await getLearnerState(viewer.id)),
    };
    return Response.json(state, { headers });
  } catch (err) {
    logger.error("GET /api/me failed", err);
    return Response.json({ error: "Could not load your progress." }, { status: 500, headers });
  }
}
