import { describe, expect, it } from "vitest";
import { emptyProgress, nextLesson, parseProgress, percent, submitProject, toggleLesson, toggleRequirement } from "@/features/progress/model";

describe("progress model", () => {
  it("starts empty when storage is missing or corrupted", () => {
    expect(parseProgress(null)).toEqual(emptyProgress());
    expect(parseProgress("{not json")).toEqual(emptyProgress());
    expect(parseProgress(JSON.stringify({ version: 99 }))).toEqual(emptyProgress());
  });
  it("round-trips through storage", () => {
    const p = toggleLesson(emptyProgress(), "foundations/semantic-html");
    expect(parseProgress(JSON.stringify(p))).toEqual(p);
  });
  it("toggles lessons on and off", () => {
    const on = toggleLesson(emptyProgress(), "a");
    expect(on.completedLessons).toEqual(["a"]);
    expect(toggleLesson(on, "a").completedLessons).toEqual([]);
  });
  it("computes percent and the next lesson", () => {
    const p = toggleLesson(emptyProgress(), "a");
    expect(percent(p, ["a", "b", "c", "d"])).toBe(25);
    expect(percent(p, [])).toBe(0);
    expect(nextLesson(p, [{ id: "a" }, { id: "b" }])?.id).toBe("b");
  });
  it("keeps requirement checks sorted and per project", () => {
    let p = toggleRequirement(emptyProgress(), "landing-page", 2);
    p = toggleRequirement(p, "landing-page", 0);
    expect(p.projects["landing-page"].checked).toEqual([0, 2]);
    expect(toggleRequirement(p, "landing-page", 2).projects["landing-page"].checked).toEqual([0]);
    expect(p.projects["api-search-app"]).toBeUndefined();
  });
  it("accepts a valid submission and rejects bad URLs", () => {
    const ok = submitProject(emptyProgress(), "landing-page", { repoUrl: "https://github.com/osama/landing", liveUrl: "https://landing.vercel.app" }, new Date("2026-11-02T00:00:00Z"));
    expect(ok.ok && ok.progress.projects["landing-page"].submission?.submittedAt).toBe("2026-11-02T00:00:00.000Z");
    const bad = submitProject(emptyProgress(), "landing-page", { repoUrl: "https://gitlab.com/x/y", liveUrl: "http://insecure.example" });
    expect(bad.ok).toBe(false);
    if (!bad.ok) {
      expect(bad.errors.repoUrl).toBeDefined();
      expect(bad.errors.liveUrl).toBeDefined();
    }
  });
});
