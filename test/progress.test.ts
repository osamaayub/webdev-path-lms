import { describe, expect, it } from "vitest";
import { allLessons, getQuiz, lessonId, PASS_MARK, publicQuiz, quizzes } from "@/content";
import { gradeQuiz, nextLesson, percent, reviewSchema, submissionSchema, toggleIndex } from "@/features/progress/model";

describe("quiz content", () => {
  it("has a 5-question quiz for every lesson, and nothing else", () => {
    const ids = allLessons.map(lessonId);
    expect(Object.keys(quizzes).sort()).toEqual([...ids].sort());
    for (const id of ids) expect(getQuiz(id)).toHaveLength(5);
  });
  it("gives every question 4 options, a valid answer and an explanation", () => {
    for (const qs of Object.values(quizzes)) {
      for (const q of qs) {
        expect(q.options).toHaveLength(4);
        expect(new Set(q.options).size).toBe(4);
        expect(q.answer).toBeGreaterThanOrEqual(0);
        expect(q.answer).toBeLessThan(q.options.length);
        expect(q.explain.length).toBeGreaterThan(10);
      }
    }
  });
  it("never sends answers or explanations to the browser", () => {
    const pub = publicQuiz("javascript/js-basics");
    expect(pub).toHaveLength(5);
    for (const q of pub) expect(Object.keys(q).sort()).toEqual(["id", "options", "prompt"]);
    expect(JSON.stringify(pub)).not.toContain("explain");
  });
  it("does not always put the right answer in the same position", () => {
    const positions = new Set(Object.values(quizzes).flat().map((q) => q.answer));
    expect(positions.size).toBeGreaterThanOrEqual(3);
  });
});

describe("grading", () => {
  const qs = getQuiz("foundations/how-the-web-works")!;
  const right = qs.map((q) => q.answer);
  it("passes at the pass mark and fails below it", () => {
    expect(gradeQuiz(qs, right, PASS_MARK)).toMatchObject({ score: 5, total: 5, passed: true });
    const fourRight = right.map((a, i) => (i === 0 ? (a + 1) % 4 : a));
    expect(gradeQuiz(qs, fourRight, PASS_MARK)).toMatchObject({ score: 4, passed: true });
    const threeRight = right.map((a, i) => (i < 2 ? (a + 1) % 4 : a));
    expect(gradeQuiz(qs, threeRight, PASS_MARK)).toMatchObject({ score: 3, passed: false });
  });
  it("treats missing answers as wrong and explains each question", () => {
    const g = gradeQuiz(qs, [], PASS_MARK);
    expect(g.score).toBe(0);
    expect(g.results.every((r) => r.chosen === -1 && r.explain)).toBe(true);
  });
  it("never passes an empty quiz", () => {
    expect(gradeQuiz([], [], PASS_MARK).passed).toBe(false);
  });
});

describe("progress helpers", () => {
  it("computes percent and the next lesson", () => {
    expect(percent(["a"], ["a", "b", "c", "d"])).toBe(25);
    expect(percent(["a"], [])).toBe(0);
    expect(nextLesson(["a"], [{ id: "a" }, { id: "b" }])?.id).toBe("b");
  });
  it("toggles requirement indexes and keeps them sorted", () => {
    expect(toggleIndex([], 2)).toEqual([2]);
    expect(toggleIndex([2], 0)).toEqual([0, 2]);
    expect(toggleIndex([0, 2], 2)).toEqual([0]);
  });
});

describe("validation", () => {
  it("accepts a GitHub repo and an https live URL", () => {
    expect(submissionSchema.safeParse({ repoUrl: "https://github.com/osama/landing", liveUrl: "https://landing.vercel.app" }).success).toBe(true);
  });
  it("rejects other hosts, plain http and script URLs", () => {
    for (const input of [
      { repoUrl: "https://gitlab.com/x/y", liveUrl: "https://ok.app" },
      { repoUrl: "https://github.com/x/y", liveUrl: "http://insecure.example" },
      { repoUrl: "javascript:alert(1)", liveUrl: "https://ok.app" },
      { repoUrl: "https://github.com/x/y", liveUrl: "javascript:alert(1)" },
    ]) expect(submissionSchema.safeParse(input).success).toBe(false);
  });
  it("checks reviews: grade 0 to 100 and real feedback", () => {
    const base = { submissionId: crypto.randomUUID(), status: "approved", grade: "92", feedback: "Clean code and a clear README." };
    expect(reviewSchema.safeParse(base).success).toBe(true);
    expect(reviewSchema.safeParse({ ...base, grade: "101" }).success).toBe(false);
    expect(reviewSchema.safeParse({ ...base, feedback: "ok" }).success).toBe(false);
    expect(reviewSchema.safeParse({ ...base, status: "submitted" }).success).toBe(false);
  });
});
