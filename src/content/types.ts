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

export type Level = "Beginner" | "Intermediate" | "Advanced";

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
