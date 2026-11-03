# WebDev Path: free 24-week full-stack course (LMS)

[![CI](https://github.com/osamaayub/webdev-path-lms/actions/workflows/ci.yml/badge.svg)](https://github.com/osamaayub/webdev-path-lms/actions/workflows/ci.yml)
![Next.js 16](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6) ![License: MIT](https://img.shields.io/badge/license-MIT-green)

A learning portal that takes beginners from zero to job-ready full-stack developer in 24 weeks: 6 phases, 24 weekly lessons and 6 portfolio projects, with progress tracking and project submissions.

**Live:** see the Vercel link in the repo's About section · **Videos:** [@osamaayubdev](https://www.youtube.com/@osamaayubdev)

## Features

- **Structured course:** 6 phases (Foundations, JavaScript, React, TypeScript and Next.js, Backend and databases, AI and careers), each with an outcome and a gate to pass
- **24 lessons:** objectives, learn, practice, build and curated free resources for every week
- **6 portfolio projects:** brief, user stories, requirements checklist, stretch goals and a submission form (GitHub + live URL, validated)
- **Progress tracking:** dashboard with overall and per-phase progress and a "continue where you left off" button. Saved in the browser, synced across tabs, no sign-up
- **Fast and SEO-ready:** every page is pre-rendered; per-page metadata, Open Graph image, sitemap with all 36 pages, robots, `Course` JSON-LD, real 404 status for unknown URLs
- **Accessible:** semantic HTML, skip link, labelled forms, `aria-pressed` and `progressbar` roles, keyboard friendly
- **Tested:** content integrity and progress logic covered by Vitest, CI on every push

## Quick start

```bash
git clone https://github.com/osamaayub/webdev-path-lms.git
cd webdev-path-lms
npm install
npm run dev
```

Open http://localhost:3000. No environment variables are needed.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` / `build` / `start` | Next.js |
| `npm run check` | Lint, type-check and tests |
| `npm test` | Vitest unit tests |
| `npm run typecheck` | Generates route types, then runs `tsc` |

## Project structure

```
src/
  content/                 The course itself, as typed data
    types.ts               Phase, Lesson, Project types
    phases.ts              6 phases and 24 lessons
    projects.ts            6 projects
    index.ts               Lookups: allLessons, getLesson (with prev/next), getProject
    routes.ts              Every valid content URL (used by the proxy)
  features/
    progress/
      model.ts             Pure progress logic + Zod schemas (tested)
      store.ts             Browser storage adapter (useSyncExternalStore)
      components/          Dashboard, phase progress, lesson status, complete button
    projects/
      components/          Requirement checklist, submission form, status badge
  components/              Site header, footer, progress bar
  config/site.ts           Site name, URL and SEO text
  app/                     Routes only
    page.tsx               Landing page + Course JSON-LD
    learn/                 Dashboard, /learn/[phase], /learn/[phase]/[lesson]
    projects/              Project list and /projects/[slug]
    sitemap.ts, robots.ts, opengraph-image.tsx, not-found.tsx
  proxy.ts                 Real 404 status for unknown lesson and project URLs
test/                      Content and progress tests
docs/ARCHITECTURE.md       System design, decisions and the plan for accounts
```

Full system design: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

## Editing the course

All content lives in `src/content`. Add a lesson to a phase in `phases.ts`, or a project in `projects.ts`, and the pages, navigation, sitemap and 404 handling update automatically. The content tests fail if weeks skip, slugs repeat or a phase points to a missing project.

## Deploy

Import the repo on [Vercel](https://vercel.com). No environment variables are required. Optionally set `NEXT_PUBLIC_SITE_URL` to your custom domain for canonical URLs.

## Roadmap

- Accounts and cloud progress (Auth.js + Postgres), keeping the same progress model
- Mentor review of submitted projects
- Lesson videos embedded from YouTube
- Certificates when all 6 projects are submitted

## Author

Built by [Osama Ayub](https://osama-ayubpersonal.vercel.app/), full-stack developer. Need a web app or AI feature built? [Hire me on Upwork](https://www.upwork.com/freelancers/~01c0c3cf471b66a427).

## License

MIT
