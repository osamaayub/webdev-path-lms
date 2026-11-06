import { phases } from "./phases";
import { practiceBuilds, practiceFor } from "./practice";
import { projects } from "./projects";
import { PASS_MARK, quizzes } from "./quizzes";
import type { Lesson, Phase, Project, PublicQuizQuestion } from "./types";

export type { Lesson, Phase, Project, Resource, Level, QuizQuestion, PublicQuizQuestion, Milestone, PracticeBuild } from "./types";
export { phases, projects, quizzes, PASS_MARK, practiceBuilds, practiceFor };

export const course = {
  title: "Full-Stack Web Development",
  totalWeeks: 24,
  hoursPerWeek: "10 to 15",
};

export type LessonRef = Lesson & { phase: Phase };

/** Every lesson in course order, with its phase attached. */
export const allLessons: LessonRef[] = phases.flatMap((phase) => phase.lessons.map((lesson) => ({ ...lesson, phase })));

export const getPhase = (slug: string) => phases.find((p) => p.slug === slug);
export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export function getLesson(phaseSlug: string, lessonSlug: string) {
  const index = allLessons.findIndex((l) => l.phase.slug === phaseSlug && l.slug === lessonSlug);
  if (index === -1) return undefined;
  return { lesson: allLessons[index], prev: allLessons[index - 1], next: allLessons[index + 1], index };
}

export const lessonId = (l: { phase: { slug: string }; slug: string }) => `${l.phase.slug}/${l.slug}`;
export const projectFor = (phase: Phase): Project | undefined => getProject(phase.projectSlug);

export const getQuiz = (id: string) => quizzes[id];

/** The quiz as the browser may see it: prompts and options only. */
export const publicQuiz = (id: string): PublicQuizQuestion[] => (quizzes[id] ?? []).map(({ id, prompt, options }) => ({ id, prompt, options }));
