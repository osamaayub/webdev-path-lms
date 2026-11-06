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

export type Milestone = {
  title: string;
  /** What to build in this step. */
  task: string;
  /** How the learner knows the step is finished. */
  doneWhen: string;
  /** A nudge for when they're stuck. Hidden until opened. */
  hint: string;
};

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
  /** Three themes to choose from, so every portfolio isn't the same app. */
  ideas: string[];
  /** The build plan, in order. */
  milestones: Milestone[];
  /** Free APIs, data, tools and docs for this project. */
  kit: Resource[];
  /** A finished example to compare against after building your own. */
  reference?: { label: string; repo: string; live?: string; video?: string };
};

export type PracticeBuild = {
  slug: string;
  phaseSlug: string;
  title: string;
  minutes: number;
  goal: string;
  steps: string[];
  doneWhen: string;
  skills: string[];
};
