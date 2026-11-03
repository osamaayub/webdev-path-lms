export type Resource = { title: string; url: string };

export type Lesson = {
  slug: string;
  week: number;
  title: string;
  summary: string;
  minutes: number;
  objectives: string[];
  learn: string[];
  practice: string[];
  build: string;
  resources: Resource[];
};

export type Phase = {
  slug: string;
  number: number;
  title: string;
  weeks: [number, number];
  outcome: string;
  gate: string;
  projectSlug: string;
  lessons: Lesson[];
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  /** 0-based index of the correct option. Server-only: never send to the browser. */
  answer: number;
  explain: string;
};

/** What the browser receives: no answers, no explanations until graded. */
export type PublicQuizQuestion = Pick<QuizQuestion, "id" | "prompt" | "options">;

export type Level ="Beginner" | "Intermediate" | "Advanced";

export type Project = {
  slug: string;
  number: number;
  title: string;
  phaseSlug: string;
  level: Level;
  hours: number;
  stack: string[];
  brief: string;
  userStories: string[];
  requirements: string[];
  stretch: string[];
  proves: string;
};
