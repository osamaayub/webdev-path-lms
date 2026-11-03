import { describe, expect, it } from "vitest";
import { allLessons, getLesson, getProject, lessonId, phases, projects } from "@/content";

describe("course content", () => {
  it("covers weeks 1 to 24 exactly once, in order", () => {
    expect(allLessons.map((l) => l.week)).toEqual(Array.from({ length: 24 }, (_, i) => i + 1));
  });
  it("keeps every lesson inside its phase's week range", () => {
    for (const p of phases) for (const l of p.lessons) {
      expect(l.week).toBeGreaterThanOrEqual(p.weeks[0]);
      expect(l.week).toBeLessThanOrEqual(p.weeks[1]);
    }
  });
  it("has unique slugs", () => {
    const ids = allLessons.map(lessonId);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(phases.map((p) => p.slug)).size).toBe(phases.length);
    expect(new Set(projects.map((p) => p.slug)).size).toBe(projects.length);
  });
  it("links every phase to a project and every project back to its phase", () => {
    for (const p of phases) expect(getProject(p.projectSlug)?.phaseSlug).toBe(p.slug);
  });
  it("gives every lesson objectives, practice and https resources", () => {
    for (const l of allLessons) {
      expect(l.objectives.length).toBeGreaterThanOrEqual(3);
      expect(l.practice.length).toBeGreaterThan(0);
      expect(l.resources.length).toBeGreaterThan(0);
      for (const r of l.resources) expect(r.url.startsWith("https://")).toBe(true);
    }
  });
  it("finds a lesson with its neighbours", () => {
    const found = getLesson("javascript", "dom-events");
    expect(found?.lesson.week).toBe(7);
    expect(found?.prev?.week).toBe(6);
    expect(found?.next?.week).toBe(8);
    expect(getLesson("javascript", "nope")).toBeUndefined();
  });
});
