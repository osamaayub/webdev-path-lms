import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { getProject, getQuiz } from "@/content";
import { setDbForTests, type Db } from "@/server/db";
import * as schema from "@/server/db/schema";

// Server actions against a real Postgres (PGlite, in memory) with migrations applied.
// Only the session is faked: tests choose who is "signed in".

type FakeViewer = { id: string; name: string; email: string; image: null; isAdmin: boolean } | null;
let viewer: FakeViewer = null;

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/server/viewer", async () => {
  class AuthError extends Error {
    constructor(public code: string) {
      super(code === "UNAUTHENTICATED" ? "Sign in to do this." : "You don't have access to this.");
    }
  }
  return {
    AuthError,
    getViewer: async () => viewer,
    requireUser: async () => {
      if (!viewer) throw new AuthError("UNAUTHENTICATED");
      return viewer;
    },
    requireAdmin: async () => {
      if (!viewer) throw new AuthError("UNAUTHENTICATED");
      if (!viewer.isAdmin) throw new AuthError("FORBIDDEN");
      return viewer;
    },
  };
});

const { submitQuiz, setRequirement, submitProject } = await import("@/features/progress/actions");
const { reviewSubmissionAction } = await import("@/features/admin/actions");
const { getLearnerState, listSubmissions } = await import("@/server/learner");

let db: Db;
const ana = { id: "user-ana", name: "Ana", email: "ana@example.com", image: null, isAdmin: false };
const ben = { id: "user-ben", name: "Ben", email: "ben@example.com", image: null, isAdmin: false };
const admin = { id: "user-admin", name: "Admin", email: "admin@example.com", image: null, isAdmin: true };

beforeAll(async () => {
  const client = new PGlite();
  const pg = drizzle(client, { schema });
  await migrate(pg, { migrationsFolder: "./drizzle" });
  db = pg as unknown as Db;
  setDbForTests(db);
  await db.insert(schema.users).values([ana, ben, admin].map(({ id, name, email }) => ({ id, name, email })));
});

beforeEach(() => {
  viewer = null;
});

const LESSON = "foundations/how-the-web-works";
const correct = () => getQuiz(LESSON)!.map((q) => q.answer);
const form = (o: Record<string, string>) => {
  const f = new FormData();
  for (const [k, v] of Object.entries(o)) f.set(k, v);
  return f;
};

describe("quiz action", () => {
  it("rejects anonymous callers", async () => {
    expect(await submitQuiz(LESSON, correct())).toEqual({ ok: false, error: "Sign in to do this." });
  });

  it("rejects unknown quizzes and malformed answers", async () => {
    viewer = ana;
    expect((await submitQuiz("nope/nope", [0])).ok).toBe(false);
    expect((await submitQuiz(LESSON, [0, 1])).ok).toBe(false);
    expect((await submitQuiz(LESSON, [9, 9, 9, 9, 9])).ok).toBe(false);
    expect((await submitQuiz(LESSON, "hack" as unknown as number[])).ok).toBe(false);
  });

  it("records a failed attempt without completing the week", async () => {
    viewer = ana;
    const wrong = correct().map((a) => (a + 1) % 4);
    const res = await submitQuiz(LESSON, wrong);
    expect(res.ok && res.data).toMatchObject({ score: 0, passed: false });
    const s = await getLearnerState(ana.id);
    expect(s.completed).toEqual([]);
    expect(s.quizzes[LESSON]).toMatchObject({ best: 0, passed: false, attempts: 1 });
  });

  it("completes the week when the quiz is passed, and keeps the best score", async () => {
    viewer = ana;
    const res = await submitQuiz(LESSON, correct());
    expect(res.ok && res.data.passed).toBe(true);
    const s = await getLearnerState(ana.id);
    expect(s.completed).toEqual([LESSON]);
    expect(s.quizzes[LESSON]).toMatchObject({ best: 5, total: 5, passed: true, attempts: 2 });
    // Another learner's data is untouched
    expect((await getLearnerState(ben.id)).completed).toEqual([]);
  });

  it("rate-limits repeated attempts", async () => {
    viewer = ben;
    const lesson = "foundations/semantic-html";
    const answers = getQuiz(lesson)!.map(() => 0);
    for (let i = 0; i < 10; i++) expect((await submitQuiz(lesson, answers)).ok).toBe(true);
    const blocked = await submitQuiz(lesson, answers);
    expect(blocked.ok).toBe(false);
    if (!blocked.ok) expect(blocked.error).toMatch(/10 times/);
  });
});

describe("project submission and review", () => {
  const slug = "landing-page";
  const total = getProject(slug)!.requirements.length;
  const links = { repoUrl: "https://github.com/ana/landing", liveUrl: "https://ana-landing.vercel.app" };

  it("validates requirement indexes against the project", async () => {
    viewer = ana;
    expect((await setRequirement(slug, 99, true)).ok).toBe(false);
    expect((await setRequirement("nope", 0, true)).ok).toBe(false);
  });

  it("keeps every tick when several arrive at the same time, and unticks cleanly", async () => {
    viewer = ben;
    await Promise.all([0, 1, 2, 3, 4].map((i) => setRequirement("api-search-app", i, true)));
    expect((await getLearnerState(ben.id)).projects["api-search-app"].checked).toEqual([0, 1, 2, 3, 4]);
    await Promise.all([setRequirement("api-search-app", 1, false), setRequirement("api-search-app", 3, false), setRequirement("api-search-app", 1, false)]);
    expect((await getLearnerState(ben.id)).projects["api-search-app"].checked).toEqual([0, 2, 4]);
  });

  it("won't accept a submission until every requirement is ticked", async () => {
    viewer = ana;
    await setRequirement(slug, 0, true);
    const res = await submitProject(slug, links);
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error).toMatch(/Tick every requirement/);
  });

  it("returns field errors for bad links", async () => {
    viewer = ana;
    for (let i = 1; i < total; i++) await setRequirement(slug, i, true);
    const res = await submitProject(slug, { repoUrl: "https://gitlab.com/a/b", liveUrl: "http://x.com" });
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.fieldErrors?.repoUrl).toBeDefined();
      expect(res.fieldErrors?.liveUrl).toBeDefined();
    }
  });

  it("submits, then blocks instant resubmission", async () => {
    viewer = ana;
    expect(await submitProject(slug, { ...links, notes: "Lighthouse a11y is 100" })).toEqual({ ok: true, data: undefined });
    const again = await submitProject(slug, links);
    expect(again.ok).toBe(false);
    const s = await getLearnerState(ana.id);
    expect(s.projects[slug].checked).toHaveLength(total);
    expect(s.projects[slug].submission).toMatchObject({ status: "submitted", attempts: 1, notes: "Lighthouse a11y is 100" });
  });

  it("only admins can review", async () => {
    const [sub] = await listSubmissions("submitted");
    const review = form({ submissionId: sub.id, status: "approved", grade: "90", feedback: "Great semantic HTML and contrast." });
    viewer = null;
    expect((await reviewSubmissionAction(null, review)).ok).toBe(false);
    viewer = ana;
    expect(await reviewSubmissionAction(null, review)).toEqual({ ok: false, error: "You don't have access to this." });
  });

  it("lets an admin request changes, the learner resubmit, then approve", async () => {
    viewer = admin;
    const [sub] = await listSubmissions("submitted");
    expect(sub.learnerEmail).toBe("ana@example.com");
    const bad = await reviewSubmissionAction(null, form({ submissionId: sub.id, status: "approved", grade: "500", feedback: "x" }));
    expect(bad.ok).toBe(false);

    expect((await reviewSubmissionAction(null, form({ submissionId: sub.id, status: "changes_requested", grade: "60", feedback: "Add alt text to the hero image." }))).ok).toBe(true);
    expect((await getLearnerState(ana.id)).projects[slug].submission).toMatchObject({ status: "changes_requested", grade: 60, feedback: "Add alt text to the hero image." });

    viewer = ana;
    expect((await submitProject(slug, links)).ok).toBe(true);
    expect((await getLearnerState(ana.id)).projects[slug].submission).toMatchObject({ status: "submitted", attempts: 2 });

    viewer = admin;
    expect((await reviewSubmissionAction(null, form({ submissionId: sub.id, status: "approved", grade: "95", feedback: "Fixed. Lovely work." }))).ok).toBe(true);

    viewer = ana;
    const done = await submitProject(slug, links);
    expect(done.ok).toBe(false);
    if (!done.ok) expect(done.error).toMatch(/already approved/);
    expect((await getLearnerState(ana.id)).projects[slug].submission).toMatchObject({ status: "approved", grade: 95 });
  });
});
