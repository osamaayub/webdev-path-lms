import type { Project } from "./types";

export const projects: Project[] = [
  {
    slug: "landing-page",
    number: 1,
    title: "Responsive landing page",
    phaseSlug: "foundations",
    level: "Beginner",
    hours: 12,
    stack: ["HTML", "CSS", "Git"],
    brief: "Build a landing page for a real or made-up product: a hero, features, pricing, testimonials and a contact form.",
    userStories: ["As a visitor, I understand what the product does in 5 seconds", "As a phone user, I can read and use every section", "As a keyboard user, I can reach the form and submit it"],
    requirements: ["Semantic HTML with one h1 and landmarks", "Responsive from 360 px to 1440 px", "Accessible form with labels", "Lighthouse accessibility 90+", "Deployed with a live URL"],
    stretch: ["Dark mode with prefers-color-scheme", "Subtle CSS animations that respect reduced motion"],
    proves: "Layout, responsive design, accessibility and deployment",
    ideas: [
      "A local café or bakery with a menu and opening hours",
      "A mobile app launch page with app store buttons",
      "A freelancer offering one service with 3 price plans"
    ],
    milestones: [
      {
        "title": "Plan the page",
        "task": "Pick your product, write the real text for every section and sketch the layout on paper for phone and desktop.",
        "doneWhen": "You have all the copy in a text file and two sketches.",
        "hint": "Write words first. A design built around lorem ipsum breaks when real text arrives."
      },
      {
        "title": "Write the HTML only",
        "task": "Build every section with semantic tags: header, nav, main, section, footer. No CSS yet.",
        "doneWhen": "The page reads in a sensible order with CSS turned off, and there is exactly one h1.",
        "hint": "Use headings in order (h1, then h2 per section). Screen readers use them to jump around."
      },
      {
        "title": "Style mobile first",
        "task": "Add CSS for a 360 px wide screen: spacing, colors, fonts, buttons.",
        "doneWhen": "Nothing scrolls sideways at 360 px and every button is at least 44 px tall.",
        "hint": "Set CSS variables for colors and spacing at the top so the whole page stays consistent."
      },
      {
        "title": "Grow to desktop",
        "task": "Add breakpoints so features and pricing become rows and columns on wider screens.",
        "doneWhen": "The page looks intentional at 768 px and 1440 px, not just stretched.",
        "hint": "Use CSS Grid with repeat(auto-fit, minmax(260px, 1fr)) for cards. It often needs no media query."
      },
      {
        "title": "Make the form accessible",
        "task": "Build the contact form with labels, required fields and clear error messages.",
        "doneWhen": "You can fill and submit it using only the keyboard.",
        "hint": "Every input needs a label with a matching for/id. Placeholder text is not a label."
      },
      {
        "title": "Test and fix",
        "task": "Run Lighthouse in Chrome DevTools and fix what it reports.",
        "doneWhen": "Accessibility scores 90 or more.",
        "hint": "Most points are lost on color contrast and images without alt text."
      },
      {
        "title": "Ship it",
        "task": "Push to GitHub and deploy on GitHub Pages or Vercel. Write a short README with a screenshot.",
        "doneWhen": "A live URL works on your phone.",
        "hint": "Add the live link to the GitHub repo's About box so recruiters see it first."
      }
    ],
    kit: [
      {
        "title": "Unsplash: free photos",
        "url": "https://unsplash.com"
      },
      {
        "title": "Heroicons: free SVG icons",
        "url": "https://heroicons.com"
      },
      {
        "title": "WebAIM contrast checker",
        "url": "https://webaim.org/resources/contrastchecker/"
      },
      {
        "title": "GitHub Pages: free hosting",
        "url": "https://pages.github.com"
      }
    ],
  },
  {
    slug: "api-search-app",
    number: 2,
    title: "Weather or movie search app",
    phaseSlug: "javascript",
    level: "Beginner",
    hours: 15,
    stack: ["JavaScript", "Fetch API", "CSS"],
    brief: "Let users search a public API (weather, movies or books) and see results with loading and error states.",
    userStories: ["As a user, I can search and see results without reloading", "As a user, I see a clear message when nothing is found", "As a user, my last searches are remembered"],
    requirements: ["Uses fetch with async/await", "Loading, empty and error states", "Search history in localStorage", "Code split into modules", "Deployed with a live URL"],
    stretch: ["Debounced search as you type", "Unit conversion or favorites"],
    proves: "DOM work, async code and handling real-world failures",
    ideas: [
      "Weather for any city with Open-Meteo (no API key)",
      "Book search with the Open Library API (no API key)",
      "Country facts explorer with REST Countries (no API key)"
    ],
    milestones: [
      {
        "title": "Call the API by hand",
        "task": "Open the API URL in your browser and read the JSON. Find the fields you need.",
        "doneWhen": "You can write down the exact path to every value you'll show, like data.current.temperature_2m.",
        "hint": "Install a JSON viewer extension, or paste the response into the browser console with console.log."
      },
      {
        "title": "Build the search form",
        "task": "Add an input and a button. On submit, stop the page reload and read the value.",
        "doneWhen": "Typing a city and pressing Enter logs it to the console.",
        "hint": "Listen for the form's submit event, not the button's click, so Enter works too."
      },
      {
        "title": "Fetch and show results",
        "task": "Write an async function that fetches data and renders cards into the page.",
        "doneWhen": "A real search shows real results without reloading.",
        "hint": "Build HTML with template literals, but put user text in with textContent, not innerHTML."
      },
      {
        "title": "Handle every state",
        "task": "Show a loading message, an empty message and an error message.",
        "doneWhen": "Turning off Wi-Fi in DevTools shows a friendly error, not a blank page.",
        "hint": "fetch only rejects on network errors. Check response.ok yourself for 404 and 500."
      },
      {
        "title": "Remember searches",
        "task": "Save the last 5 searches in localStorage and show them as buttons.",
        "doneWhen": "Refreshing the page keeps the history, and clicking one searches again.",
        "hint": "localStorage stores strings only. Use JSON.stringify and JSON.parse."
      },
      {
        "title": "Split into modules",
        "task": "Move API calls, rendering and storage into separate files with import and export.",
        "doneWhen": "main.js is short and only wires the pieces together.",
        "hint": "Use <script type=\"module\"> so the browser understands import."
      },
      {
        "title": "Ship it",
        "task": "Deploy and write a README with what it does, the API used, and one thing you'd improve.",
        "doneWhen": "A live URL works on your phone.",
        "hint": "Mention a problem you solved, like handling empty results. That's what interviewers ask about."
      }
    ],
    kit: [
      {
        "title": "Open-Meteo weather API",
        "url": "https://open-meteo.com/en/docs"
      },
      {
        "title": "Open Library search API",
        "url": "https://openlibrary.org/dev/docs/api/search"
      },
      {
        "title": "REST Countries API",
        "url": "https://restcountries.com"
      },
      {
        "title": "MDN: Using the Fetch API",
        "url": "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch"
      }
    ],
  },
  {
    slug: "admin-dashboard",
    number: 3,
    title: "Admin dashboard",
    phaseSlug: "react",
    level: "Intermediate",
    hours: 20,
    stack: ["React", "Tailwind CSS", "React Router"],
    brief: "Build an admin dashboard with a sidebar, stats cards, a searchable table and a detail page, using data from a mock API.",
    userStories: ["As an admin, I see key numbers at a glance", "As an admin, I can search, sort and open any record", "As an admin, I can switch pages without a full reload"],
    requirements: ["At least 4 routes plus a 404 page", "Reusable components with props", "Search and sort on the table", "Loading and error states", "No console errors or warnings"],
    stretch: ["Charts for the stats", "Dark mode saved per user"],
    proves: "Components, state, routing and data fetching in React",
    ideas: [
      "Online store admin: products, orders and customers",
      "Gym admin: members, plans and check-ins",
      "Clinic admin: patients, appointments and doctors (made-up data only)"
    ],
    milestones: [
      {
        "title": "Set up the shell",
        "task": "Create a React app with Vite, add Tailwind and React Router, and build the sidebar layout.",
        "doneWhen": "Clicking sidebar links changes the page without a reload, and an unknown URL shows your 404 page.",
        "hint": "Put the sidebar in a layout route and render pages with <Outlet />."
      },
      {
        "title": "Fetch real-looking data",
        "task": "Load products or users from DummyJSON into the table page.",
        "doneWhen": "The table shows 30 rows from the API, with a loading state.",
        "hint": "Write one small fetch helper and reuse it, so loading and error handling live in one place."
      },
      {
        "title": "Search and sort",
        "task": "Add a search box and clickable column headers that sort the table.",
        "doneWhen": "Searching and sorting work together, and the URL keeps the search term.",
        "hint": "Keep the search term in the URL with useSearchParams so a refresh or shared link keeps it."
      },
      {
        "title": "Detail page",
        "task": "Make each row open a detail page at /products/:id.",
        "doneWhen": "Opening a detail URL directly in a new tab works.",
        "hint": "Read the id with useParams and fetch that one item."
      },
      {
        "title": "Stats cards",
        "task": "Show 4 numbers at the top of the home page, worked out from the data.",
        "doneWhen": "The numbers change if the data changes.",
        "hint": "Calculate stats from the data with reduce instead of typing them in."
      },
      {
        "title": "Polish and clean up",
        "task": "Extract repeated UI into components and fix every console warning.",
        "doneWhen": "The console is clean and no component is longer than about 150 lines.",
        "hint": "The usual warning is a missing key prop in a list. Use the item's id, not the index."
      },
      {
        "title": "Ship it",
        "task": "Deploy on Vercel and record a 30-second screen recording for the README.",
        "doneWhen": "The live link and the recording are in the README.",
        "hint": "On Vercel, add a rewrite so refreshing /products/5 doesn't show a 404."
      }
    ],
    kit: [
      {
        "title": "DummyJSON: free fake data API",
        "url": "https://dummyjson.com"
      },
      {
        "title": "React Router docs",
        "url": "https://reactrouter.com"
      },
      {
        "title": "Recharts: charts for React",
        "url": "https://recharts.org"
      },
      {
        "title": "Vite: start a React project",
        "url": "https://vite.dev/guide/"
      }
    ],
  },
  {
    slug: "developer-portfolio",
    number: 4,
    title: "Developer portfolio",
    phaseSlug: "nextjs-typescript",
    level: "Intermediate",
    hours: 16,
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    brief: "Your personal site: who you are, your projects with case studies, and a way to contact you.",
    userStories: ["As a recruiter, I see your best work in 30 seconds", "As a client, I can read how you solved a real problem", "As anyone, I can contact you from any page"],
    requirements: ["Next.js App Router with TypeScript", "A page per project with problem, solution and stack", "SEO metadata and an Open Graph image", "Lighthouse performance 90+", "Live on Vercel"],
    stretch: ["Blog with MDX", "Contact form with a Server Action"],
    proves: "Next.js, TypeScript, SEO and your personal brand",
    ideas: [
      "Classic: about, projects, contact",
      "Case-study first: 3 deep project write-ups",
      "Portfolio plus a small blog of what you're learning"
    ],
    milestones: [
      {
        "title": "Write before you build",
        "task": "Write a 2-line intro, pick your 3 best projects, and for each one write the problem, what you built and what you learned.",
        "doneWhen": "A text file with all the words is done.",
        "hint": "Lead with what you build for people, not a list of technologies."
      },
      {
        "title": "Create the Next.js app",
        "task": "Start a Next.js app with TypeScript and Tailwind, and add the home, projects and contact routes.",
        "doneWhen": "All routes load and share one layout with a nav.",
        "hint": "Put shared header and footer in app/layout.tsx."
      },
      {
        "title": "Type your content",
        "task": "Store projects in a typed array (title, slug, problem, stack, links) and render cards from it.",
        "doneWhen": "Adding a project means adding one object, nothing else.",
        "hint": "Define a Project type first. TypeScript will then tell you if a card is missing a field."
      },
      {
        "title": "Project case-study pages",
        "task": "Build /projects/[slug] pages with generateStaticParams.",
        "doneWhen": "Every project has its own URL and a 404 for unknown slugs.",
        "hint": "Call notFound() from next/navigation when the slug doesn't match."
      },
      {
        "title": "SEO and sharing",
        "task": "Add metadata for each page and an Open Graph image.",
        "doneWhen": "Pasting your link in a chat app shows a title and preview image.",
        "hint": "Use generateMetadata on dynamic pages so each project gets its own title."
      },
      {
        "title": "Speed check",
        "task": "Use next/image and next/font, then run PageSpeed Insights.",
        "doneWhen": "Performance scores 90 or more on mobile.",
        "hint": "Large images are the usual problem. Give next/image a width and height."
      },
      {
        "title": "Ship it",
        "task": "Deploy on Vercel and add the link to your GitHub profile, LinkedIn and CV.",
        "doneWhen": "The link is live in all three places.",
        "hint": "A custom domain is cheap and looks more professional than a .vercel.app link."
      }
    ],
    kit: [
      {
        "title": "Next.js: Metadata and OG images",
        "url": "https://nextjs.org/docs/app/getting-started/metadata-and-og-images"
      },
      {
        "title": "PageSpeed Insights",
        "url": "https://pagespeed.web.dev"
      },
      {
        "title": "Next.js: deploying your app",
        "url": "https://nextjs.org/docs/app/getting-started/deploying"
      },
      {
        "title": "Tailwind CSS docs",
        "url": "https://tailwindcss.com/docs"
      }
    ],
  },
  {
    slug: "fullstack-app",
    number: 5,
    title: "Full-stack app with accounts",
    phaseSlug: "backend-databases",
    level: "Advanced",
    hours: 30,
    stack: ["Next.js", "PostgreSQL", "Drizzle or Prisma", "Auth.js"],
    brief: "A task manager, booking app or job board where users sign up and manage their own data.",
    userStories: ["As a user, I can sign up, log in and log out", "As a user, I can create, edit and delete my own items", "As a user, I can never see someone else's items"],
    requirements: ["Database with at least 3 related tables", "Authentication and protected pages", "Ownership checked on every request", "Input validated on the server", "At least 10 tests and a CI workflow", "Live on Vercel"],
    stretch: ["Email verification", "Role-based access (admin vs user)"],
    proves: "APIs, database design, authentication, security and testing",
    ideas: [
      "Task manager with projects and due dates",
      "Booking app for a barber or tutor with time slots",
      "Job board where companies post and people save jobs"
    ],
    milestones: [
      {
        "title": "Design the database",
        "task": "Draw your tables and how they relate, for example users, projects and tasks.",
        "doneWhen": "Every table has a primary key, and every item that belongs to a user has a user_id column.",
        "hint": "Draw it on paper first. Changing a drawing is free, changing a live database isn't."
      },
      {
        "title": "Set up Postgres and the ORM",
        "task": "Create a free Neon database, write your schema with Drizzle or Prisma, and run the first migration.",
        "doneWhen": "The tables exist and you can insert a row from a script.",
        "hint": "Keep DATABASE_URL in .env.local and add .env*.local to .gitignore before your first commit."
      },
      {
        "title": "Add sign-in",
        "task": "Add Auth.js with GitHub sign-in and protect your app pages.",
        "doneWhen": "Signed-out visitors are sent to the sign-in page.",
        "hint": "Check the session on the server in every protected page and action, not only in the UI."
      },
      {
        "title": "Create and list",
        "task": "Build a form that creates an item with a Server Action, and a page that lists the user's items.",
        "doneWhen": "New items appear for the user who made them and nobody else.",
        "hint": "Validate input with Zod on the server. Never trust what the browser sends."
      },
      {
        "title": "Edit and delete safely",
        "task": "Add edit and delete, checking ownership on every request.",
        "doneWhen": "Changing an id in the request can't touch someone else's item. Try it.",
        "hint": "Put the owner check in the database query itself: WHERE id = ? AND user_id = ?."
      },
      {
        "title": "Tests and CI",
        "task": "Write at least 10 tests for validation and ownership, and run them on every push with GitHub Actions.",
        "doneWhen": "A green check shows next to your commits on GitHub.",
        "hint": "Test the rules, not the UI: wrong owner, empty title, too-long text."
      },
      {
        "title": "Ship it",
        "task": "Deploy on Vercel with your environment variables and write a README with setup steps.",
        "doneWhen": "A friend can sign up on the live site and use it.",
        "hint": "Add a 'Security' section to the README listing how you protect user data. Clients love that."
      }
    ],
    kit: [
      {
        "title": "Neon: free serverless Postgres",
        "url": "https://neon.com"
      },
      {
        "title": "Drizzle ORM docs",
        "url": "https://orm.drizzle.team/docs/overview"
      },
      {
        "title": "Auth.js docs",
        "url": "https://authjs.dev"
      },
      {
        "title": "GitHub Actions docs",
        "url": "https://docs.github.com/en/actions"
      }
    ],
  },
  {
    slug: "ai-chatbot",
    number: 6,
    title: "AI chatbot or document assistant",
    phaseSlug: "ai-and-careers",
    level: "Advanced",
    hours: 20,
    stack: ["Next.js", "Vercel AI SDK", "OpenAI or Anthropic"],
    brief: "A streaming chatbot that answers from a business's facts or a set of documents, with cost and safety limits.",
    userStories: ["As a visitor, I get answers as they stream in", "As a visitor, I can stop a long answer", "As the owner, I know nobody can run up my AI bill"],
    requirements: ["API key used only on the server", "Streaming answers with stop and retry", "Input validation and rate limiting", "Answers limited to the provided facts", "Live on Vercel with a README"],
    stretch: ["Answer from uploaded PDFs (retrieval)", "Save chat history for signed-in users"],
    proves: "AI integration, streaming, cost control and production deployment",
    ideas: [
      "Chat with a PDF that cites the page of each answer",
      "Support bot for a made-up shop that answers from its FAQ",
      "Study helper that quizzes you on your own notes"
    ],
    milestones: [
      {
        "title": "Keep the key safe",
        "task": "Create a Next.js route handler that calls the AI API. Store the key in .env.local only.",
        "doneWhen": "Searching your browser's page source and network tab never shows the key.",
        "hint": "Only read process.env.OPENAI_API_KEY in server files. Add the server-only package to make leaks a build error."
      },
      {
        "title": "Stream the answer",
        "task": "Stream the model's reply to the page word by word.",
        "doneWhen": "Text appears as it's written, not all at once after a wait.",
        "hint": "Return a ReadableStream from the route and read it with response.body.getReader() in the browser."
      },
      {
        "title": "Add stop and retry",
        "task": "Let users stop a long answer and retry a failed one.",
        "doneWhen": "Stop ends the stream right away and Retry sends the last question again.",
        "hint": "Pass an AbortController's signal to fetch, and call abort() on Stop."
      },
      {
        "title": "Answer from your facts only",
        "task": "Put your facts or document chunks in the system prompt and tell the model to say \"I don't know\" otherwise.",
        "doneWhen": "Asking something outside your facts gets \"I don't know\", not a made-up answer.",
        "hint": "Set temperature to 0 and keep a list of 5 test questions, including 2 that shouldn't be answered."
      },
      {
        "title": "Protect your bill",
        "task": "Validate input length, cap max_tokens, and rate limit each visitor.",
        "doneWhen": "Sending 50 requests fast gets blocked after your limit.",
        "hint": "Also set a monthly budget in your AI provider's dashboard. Code limits can fail, a budget can't."
      },
      {
        "title": "Go further with retrieval",
        "task": "Optional: split a PDF into chunks, embed them, and send only the closest chunks to the model.",
        "doneWhen": "Answers come with the page number they came from.",
        "hint": "Compare your build with the reference project below once yours works."
      },
      {
        "title": "Ship it",
        "task": "Deploy on Vercel with the key as an environment variable, and write a README with a Security section.",
        "doneWhen": "The live chatbot works on your phone.",
        "hint": "Show the rate limit and the \"I don't know\" answer in your demo video. It proves you thought about real users."
      }
    ],
    kit: [
      {
        "title": "OpenAI API docs",
        "url": "https://platform.openai.com/docs"
      },
      {
        "title": "Vercel AI SDK docs",
        "url": "https://ai-sdk.dev/docs"
      },
      {
        "title": "Anthropic API docs",
        "url": "https://docs.anthropic.com"
      },
      {
        "title": "OWASP: top risks for AI and LLM apps",
        "url": "https://genai.owasp.org/llm-top-10/"
      }
    ],
    reference: {
      "label": "DocChat: AI PDF chatbot (Next.js + OpenAI, RAG)",
      "repo": "https://github.com/osamaayub/pdf-chat-ai"
    },
  },
];
