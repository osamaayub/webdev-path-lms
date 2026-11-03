import { z } from "zod";

// Progress is plain data plus pure functions, so it is easy to test
// and easy to move to a database later (same shape, different storage).

export const submissionSchema = z.object({
  repoUrl: z
    .url({ message: "Enter a full URL, like https://github.com/you/project" })
    .refine((u) => /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/.test(u), "Use your GitHub repo URL: https://github.com/you/project"),
  liveUrl: z.url({ message: "Enter the full live URL" }).refine((u) => u.startsWith("https://"), "The live URL must start with https://"),
});

export type Submission = z.infer<typeof submissionSchema> & { submittedAt: string };

const progressSchema = z.object({
  version: z.literal(1),
  completedLessons: z.array(z.string()),
  projects: z.record(
    z.string(),
    z.object({
      checked: z.array(z.number().int().nonnegative()),
      submission: submissionSchema.extend({ submittedAt: z.string() }).optional(),
    }),
  ),
});

export type Progress = z.infer<typeof progressSchema>;

export const emptyProgress = (): Progress => ({ version: 1, completedLessons: [], projects: {} });

/** Reads stored progress. Anything corrupted or from an old version starts fresh instead of crashing. */
export function parseProgress(raw: string | null): Progress {
  if (!raw) return emptyProgress();
  try {
    const parsed = progressSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : emptyProgress();
  } catch {
    return emptyProgress();
  }
}

export function toggleLesson(p: Progress, id: string): Progress {
  const done = p.completedLessons.includes(id);
  return { ...p, completedLessons: done ? p.completedLessons.filter((x) => x !== id) : [...p.completedLessons, id] };
}

export function toggleRequirement(p: Progress, project: string, index: number): Progress {
  const current = p.projects[project] ?? { checked: [] };
  const checked = current.checked.includes(index) ? current.checked.filter((i) => i !== index) : [...current.checked, index].sort((a, b) => a - b);
  return { ...p, projects: { ...p.projects, [project]: { ...current, checked } } };
}

export function submitProject(p: Progress, project: string, input: unknown, now = new Date()) {
  const parsed = submissionSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, errors: z.flattenError(parsed.error).fieldErrors };
  }
  const current = p.projects[project] ?? { checked: [] };
  const submission = { ...parsed.data, submittedAt: now.toISOString() };
  return { ok: true as const, progress: { ...p, projects: { ...p.projects, [project]: { ...current, submission } } } };
}

/** Share of the given lesson ids that are done, 0 to 100. */
export function percent(p: Progress, lessonIds: string[]) {
  if (lessonIds.length === 0) return 0;
  const done = lessonIds.filter((id) => p.completedLessons.includes(id)).length;
  return Math.round((done / lessonIds.length) * 100);
}

/** First lesson not yet completed, in course order. */
export function nextLesson<T extends { id: string }>(p: Progress, lessons: T[]): T | undefined {
  return lessons.find((l) => !p.completedLessons.includes(l.id));
}
