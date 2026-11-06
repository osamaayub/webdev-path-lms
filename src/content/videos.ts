// Video lessons, matched to the week they teach. Only real, published videos are listed.
// provider "youtube" (default): a YouTube video id, played through youtube-nocookie.
// provider "bunny": a Bunny Stream video, id written as "<libraryId>/<videoId>" (the same
// private video hosting Talha's School uses). Upload a recording there and add a line here.

// creator: set for free lessons from other teachers, shown as a credit under the player.
// Osama's own videos leave it empty. When Osama records his own video for a week, replace that line.
export type VideoLesson = { id: string; title: string; minutes: number; lessonId?: string; provider?: "youtube" | "bunny"; creator?: string };

export const introVideo: VideoLesson = { id: "YNbeOEkOZ6Y", title: "Full-Stack Developer Roadmap 2026: What to Learn, Step by Step", minutes: 4 };

export const videos: VideoLesson[] = [
  introVideo,
  { id: "xVSAGMTklG4", title: "React useState and useEffect Explained: Examples + Common Mistakes", minutes: 2, lessonId: "react/react-effects" },
  { id: "HK-lkzUIPhc", title: "Next.js 16 middleware.ts to proxy.ts: How to Migrate (2 Minutes)", minutes: 2, lessonId: "nextjs-typescript/nextjs-app-router" },
  { id: "kH0TTJXe3eE", title: "Next.js 16 Breaking Changes: proxy.ts, Suspense and Cache Fixes", minutes: 2, lessonId: "nextjs-typescript/nextjs-data-performance" },
  { id: "U-IQqppZFN4", title: "Node.js Express REST API Tutorial for Beginners (CRUD, Step by Step)", minutes: 2, lessonId: "backend-databases/node-express-apis" },
  { id: "PkkfMet2ts4", title: "How to Use the OpenAI API in Next.js Safely (Hide Your API Key)", minutes: 2, lessonId: "ai-and-careers/ai-apis" },
  { id: "YjKn5UeH9t4", title: "Next.js AI Chatbot Tutorial: Vercel AI SDK 7, useChat + Streaming", minutes: 4, lessonId: "ai-and-careers/ai-chat-streaming" },
  { id: "AF0uYuU0z_M", title: "Build an AI SaaS with Next.js 16, OpenAI and Drizzle (Full Tutorial)", minutes: 9, lessonId: "ai-and-careers/production-deploy" },
  { id: "dIatRFANLCA", title: "How to Optimize Your Upwork Profile with Claude Code (8 Steps)", minutes: 4, lessonId: "ai-and-careers/job-ready" },

  // Free lessons from other teachers (checked: real, public, embedding allowed), one per remaining week.
  { id: "hJHvdBlSxug", title: "How The Web Works - The Big Picture", minutes: 12, lessonId: "foundations/how-the-web-works", creator: "Academind" },
  { id: "YOsMJQfwqow", title: "HTML & CSS for Absolute Beginners: Semantic HTML", minutes: 10, lessonId: "foundations/semantic-html", creator: "Kevin Powell" },
  { id: "3elGSZSWTbM", title: "Flexbox or grid - How to decide?", minutes: 19, lessonId: "foundations/css-layout", creator: "Kevin Powell" },
  { id: "x4u1yp3Msao", title: "A practical guide to responsive web design", minutes: 23, lessonId: "foundations/responsive-design", creator: "Kevin Powell" },
  { id: "lkIFF4maKMU", title: "100+ JavaScript Concepts you Need to Know", minutes: 12, lessonId: "javascript/js-basics", creator: "Fireship" },
  { id: "R8rmfD9Y5-c", title: "8 Must Know JavaScript Array Methods", minutes: 10, lessonId: "javascript/arrays-objects", creator: "Web Dev Simplified" },
  { id: "y17RuWkWdn8", title: "Learn DOM Manipulation In 18 Minutes", minutes: 19, lessonId: "javascript/dom-events", creator: "Web Dev Simplified" },
  { id: "vn3tm0quoqE", title: "The Async Await Episode I Promised", minutes: 12, lessonId: "javascript/async-fetch", creator: "Fireship" },
  { id: "P3aKRdUyr0s", title: "What is NPM, and why do we need it?", minutes: 14, lessonId: "javascript/modules-tooling", creator: "Coder Coder" },
  { id: "Tn6-PIqc4UM", title: "React in 100 Seconds", minutes: 2, lessonId: "react/react-components", creator: "Fireship" },
  { id: "O6P86uwfdR0", title: "Learn useState In 15 Minutes - React Hooks Explained", minutes: 16, lessonId: "react/react-state", creator: "Web Dev Simplified" },
  { id: "Ul3y1LXxzdU", title: "Learn React Router v6 In 45 Minutes", minutes: 46, lessonId: "react/react-routing-tailwind", creator: "Web Dev Simplified" },
  { id: "zQnBQ4tB3ZA", title: "TypeScript in 100 Seconds", minutes: 2, lessonId: "nextjs-typescript/typescript", creator: "Fireship" },
  { id: "n2Fluyr3lbc", title: "PostgreSQL in 100 Seconds", minutes: 3, lessonId: "backend-databases/sql-databases", creator: "Fireship" },
  { id: "UBUNrFtufWo", title: "Session vs Token Authentication in 100 Seconds", minutes: 2, lessonId: "backend-databases/authentication", creator: "Fireship" },
  { id: "4YOpILi9Oxs", title: "7 Security risks you should never take as a developer", minutes: 9, lessonId: "backend-databases/security-testing", creator: "Fireship" },
];

export const videoFor = (lessonId: string) => videos.find((v) => v.lessonId === lessonId);
