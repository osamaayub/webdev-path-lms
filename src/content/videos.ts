// Video lessons, matched to the week they teach. Only real, published videos are listed.
// provider "youtube" (default): a YouTube video id, played through youtube-nocookie.
// provider "bunny": a Bunny Stream video, id written as "<libraryId>/<videoId>" (the same
// private video hosting Talha's School uses). Upload a recording there and add a line here.

export type VideoLesson = { id: string; title: string; minutes: number; lessonId?: string; provider?: "youtube" | "bunny" };

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
];

export const videoFor = (lessonId: string) => videos.find((v) => v.lessonId === lessonId);
