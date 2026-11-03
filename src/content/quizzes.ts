import type { QuizQuestion } from "./types";

// One short quiz per weekly lesson. Passing it (see PASS_MARK) completes the week.
// Keep 5 questions per quiz, 4 options each, one correct answer (0-based index).
// Answers are graded on the server; the browser only receives prompts and options.

type Q = [prompt: string, options: [string, string, string, string], answer: 0 | 1 | 2 | 3, explain: string];

const quiz = (lessonId: string, qs: Q[]): [string, QuizQuestion[]] => [
  lessonId,
  qs.map(([prompt, options, answer, explain], i) => ({ id: `${lessonId}#${i + 1}`, prompt, options, answer, explain })),
];

export const quizzes: Record<string, QuizQuestion[]> = Object.fromEntries([
  // ---------------- Line 1: Foundations ----------------
  quiz("foundations/how-the-web-works", [
    ["What does DNS do?", ["Stores your website files", "Turns a domain name into a server's IP address", "Encrypts traffic between browser and server", "Compresses images"], 1, "DNS is the internet's phone book: it maps names like example.com to IP addresses."],
    ["Which HTTP status code means the page was not found?", ["200", "301", "404", "500"], 2, "404 is Not Found. 200 is OK, 301 is a permanent redirect and 500 is a server error."],
    ["In the request and response cycle, who sends the request?", ["The server", "The client (usually the browser)", "The DNS resolver", "GitHub"], 1, "The client asks, the server answers."],
    ["Which Git command records a snapshot of your staged changes?", ["git push", "git add", "git commit", "git clone"], 2, "git add stages changes, git commit records them, git push uploads commits."],
    ["Which HTTP method is normally used to send form data that creates something?", ["GET", "POST", "HEAD", "OPTIONS"], 1, "POST sends data in the request body to create or change something."],
  ]),
  quiz("foundations/semantic-html", [
    ["Which element should wrap the main navigation links of a site?", ["<div>", "<nav>", "<section>", "<span>"], 1, "<nav> tells browsers and screen readers that this is navigation."],
    ["Why does every image need an alt attribute?", ["It makes images load faster", "Screen readers read it, and it shows if the image fails", "Google requires it for HTTPS", "It sets the image size"], 1, "Alt text describes the image for people who can't see it. Use alt=\"\" for purely decorative images."],
    ["How many <h1> elements should a typical page have?", ["None", "One, for the main topic", "One per section", "As many as you like, it doesn't matter"], 1, "One clear <h1> per page, then <h2>, <h3> in order, gives a logical outline."],
    ["What is the best way to label a text input?", ["Placeholder text only", "A <label> linked with for and id", "Bold text above it", "A title attribute"], 1, "A real <label> is announced by screen readers and makes the label clickable. Placeholders disappear when typing."],
    ["Which element is right for a button that submits a form?", ["<a href=\"#\">", "<div onclick>", "<button type=\"submit\">", "<span role=\"link\">"], 2, "A real <button> is focusable and works with the keyboard by default."],
  ]),
  quiz("foundations/css-layout", [
    ["In the CSS box model, what sits between the content and the border?", ["Margin", "Padding", "Outline", "Gap"], 1, "Content, then padding, then border, then margin."],
    ["Which layout tool is best for a one-dimensional row of items?", ["Flexbox", "Grid", "Floats", "Tables"], 0, "Flexbox handles one direction at a time. Grid shines for two-dimensional layouts."],
    ["What does box-sizing: border-box change?", ["Removes borders", "Width includes padding and border", "Adds a shadow", "Makes boxes inline"], 1, "With border-box, width: 300px stays 300px even after you add padding and borders."],
    ["Which selector has the highest specificity?", [".card", "#hero", "p", "*"], 1, "IDs beat classes, classes beat elements, and * has no specificity."],
    ["In Grid, what does grid-template-columns: repeat(3, 1fr) create?", ["3 rows of equal height", "3 columns that share the space equally", "A 3px gap", "3 nested grids"], 1, "1fr is one share of the free space, so three equal columns."],
  ]),
  quiz("foundations/responsive-design", [
    ["What does a mobile-first stylesheet start with?", ["Desktop styles, then max-width queries", "Small-screen styles, then min-width queries", "Only print styles", "A separate mobile site"], 1, "Write the small-screen layout first, then add min-width media queries as space grows."],
    ["Why add <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">?", ["It enables HTTPS", "Phones render at real device width instead of zooming out a desktop page", "It improves SEO keywords", "It loads fonts faster"], 1, "Without it, phones pretend to be about 980px wide and shrink the page."],
    ["Which unit scales with the user's chosen font size?", ["px", "rem", "vh", "cm"], 1, "rem is relative to the root font size, so it respects user settings."],
    ["What makes an image never overflow its container?", ["img { max-width: 100%; height: auto; }", "img { width: 2000px; }", "img { float: left; }", "img { position: fixed; }"], 0, "max-width: 100% lets images shrink with their container while keeping their ratio."],
    ["Which Lighthouse category checks contrast, labels and alt text?", ["Performance", "Accessibility", "SEO", "Best practices"], 1, "Accessibility audits cover contrast, labels, alt text, focus and more."],
  ]),

  // ---------------- Line 2: JavaScript ----------------
  quiz("javascript/js-basics", [
    ["Which keyword should you use for a value that will be reassigned?", ["const", "let", "var", "static"], 1, "Use const by default and let when you need to reassign. Avoid var."],
    ["What does 2 === \"2\" return?", ["true", "false", "undefined", "An error"], 1, "=== compares value and type with no conversion, so a number never equals a string."],
    ["What is the value of typeof null?", ["\"null\"", "\"undefined\"", "\"object\"", "\"number\""], 2, "A famous old JavaScript quirk: typeof null is \"object\"."],
    ["What does this return? [\"a\", \"b\"].length", ["1", "2", "\"ab\"", "undefined"], 1, "length counts the items: 2."],
    ["What does a function return if it has no return statement?", ["null", "0", "undefined", "false"], 2, "Functions without return give back undefined."],
  ]),
  quiz("javascript/arrays-objects", [
    ["Which method makes a new array with each item transformed?", ["forEach", "map", "push", "find"], 1, "map returns a new array of the same length. forEach returns nothing."],
    ["Which method keeps only the items that pass a test?", ["filter", "reduce", "some", "sort"], 0, "filter returns a new array with matching items only."],
    ["How do you read the name property from const user = { name: \"Ana\" }?", ["user->name", "user.name", "user::name", "user(name)"], 1, "Dot notation, or user[\"name\"] when the key is dynamic."],
    ["What does const { name } = user do?", ["Copies the whole object", "Creates a variable name from user.name", "Deletes user.name", "Renames user"], 1, "That's destructuring: it pulls properties out into variables."],
    ["What does JSON.parse do?", ["Turns a JavaScript object into a JSON string", "Turns a JSON string into a JavaScript value", "Fetches JSON from a URL", "Validates a schema"], 1, "JSON.parse reads a string; JSON.stringify writes one."],
  ]),
  quiz("javascript/dom-events", [
    ["Which method finds the first element that matches a CSS selector?", ["document.getElementsByClassName", "document.querySelector", "document.find", "document.select"], 1, "querySelector takes any CSS selector and returns the first match."],
    ["Why is textContent safer than innerHTML for user input?", ["It is faster to type", "It never parses HTML, so it can't inject scripts", "It supports emojis", "It works in older browsers"], 1, "innerHTML with user input is a classic XSS hole. textContent treats input as plain text."],
    ["What does event.preventDefault() do on a form submit?", ["Stops the page from reloading", "Deletes the form", "Validates fields", "Disables the button"], 0, "It cancels the browser's default action, here the full-page submit."],
    ["What is event delegation?", ["Adding one listener on a parent to handle events from its children", "Passing events to a server", "Running events in a worker", "Delaying events with setTimeout"], 0, "Events bubble up, so one parent listener can handle many child elements, even new ones."],
    ["Where should a script tag go so it can find elements, without blocking rendering?", ["In <head> with no attributes", "In <head> with defer", "Inside a <div>", "After </html>"], 1, "defer downloads the script in parallel and runs it after the HTML is parsed."],
  ]),
  quiz("javascript/async-fetch", [
    ["What does fetch() return?", ["The data directly", "A Promise", "A callback", "A string"], 1, "fetch returns a Promise that resolves to a Response."],
    ["Does fetch reject the Promise on a 404 response?", ["Yes, always", "No, you must check response.ok", "Only for POST", "Only in Node.js"], 1, "fetch only rejects on network failure. Check response.ok or response.status yourself."],
    ["What does await do inside an async function?", ["Blocks the whole browser", "Pauses that function until the Promise settles", "Runs code in parallel", "Retries on error"], 1, "Other code keeps running; only this function waits."],
    ["How should you handle errors with async/await?", ["try/catch", "if/else on the Promise", "They can't fail", "window.onerror only"], 0, "Wrap awaits in try/catch and show the user a helpful message."],
    ["Which runs two independent requests at the same time?", ["await a(); await b();", "Promise.all([a(), b()])", "a().then(b)", "setTimeout(a, b)"], 1, "Promise.all starts both and waits for both."],
  ]),
  quiz("javascript/modules-tooling", [
    ["How do you make a function available to other files with ES modules?", ["module.exports only", "export it", "Put it on window", "Use a global variable"], 1, "export in one file, import in another."],
    ["Where does npm record your project's dependencies?", ["README.md", "package.json", ".gitignore", "index.html"], 1, "package.json lists dependencies; package-lock.json pins exact versions."],
    ["Should node_modules be committed to Git?", ["Yes, always", "No, it is rebuilt with npm install", "Only on Windows", "Only for production"], 1, "Add node_modules to .gitignore. The lockfile is enough to rebuild it."],
    ["What is the quickest way to pause code and inspect variables in the browser?", ["alert()", "A debugger statement or a breakpoint in DevTools", "Reload repeatedly", "Comment out code"], 1, "Breakpoints let you step through code and see every value."],
    ["What does a bundler like Vite mainly do?", ["Hosts your site", "Bundles and serves modules fast, with hot reload in dev", "Writes tests", "Manages Git"], 1, "Vite serves native modules in dev and bundles for production."],
  ]),

  // ---------------- Line 3: React ----------------
  quiz("react/react-components", [
    ["What is a React component?", ["A CSS class", "A function that returns UI (JSX)", "A database table", "An HTML file"], 1, "Components are functions that take props and return JSX."],
    ["How does a parent pass data to a child?", ["Props", "Global variables", "localStorage", "CSS"], 0, "Data flows down through props."],
    ["Why does React need a key on list items?", ["For styling", "To track which item is which between renders", "For SEO", "To sort the list"], 1, "Stable keys (like an id, not the index) let React update the right item."],
    ["In JSX, how do you set a CSS class?", ["class=", "className=", "css=", "styleClass="], 1, "class is a reserved word in JavaScript, so JSX uses className."],
    ["Can a component change its own props?", ["Yes, freely", "No, props are read-only", "Only in class components", "Only strings"], 1, "Props are inputs. Use state for values that change."],
  ]),
  quiz("react/react-state", [
    ["What happens when you call a state setter from useState?", ["Nothing until reload", "React re-renders the component with the new value", "The page reloads", "The DOM is replaced"], 1, "Setting state schedules a re-render."],
    ["Which update is safest when the new value depends on the old one?", ["setCount(count + 1)", "setCount(c => c + 1)", "count++", "setCount(++count)"], 1, "The updater function always gets the latest value."],
    ["How should you update an object in state?", ["Mutate it then call setState(sameObject)", "Create a new object: setUser({ ...user, name })", "Use delete", "Assign to state directly"], 1, "React compares references. A new object tells it something changed."],
    ["What is a controlled input?", ["An input with a ref", "An input whose value comes from state and updates through onChange", "A disabled input", "An input inside a form"], 1, "State is the single source of truth for the input's value."],
    ["Two sibling components need the same state. Where should it live?", ["In both", "In their closest common parent", "In localStorage", "In a CSS variable"], 1, "Lift state up to the nearest parent and pass it down."],
  ]),
  quiz("react/react-effects", [
    ["What is useEffect for?", ["Styling components", "Syncing with things outside React, like network or timers", "Declaring state", "Routing"], 1, "Effects connect React to external systems."],
    ["What does an empty dependency array [] mean?", ["Run on every render", "Run once after the first render", "Never run", "Run before render"], 1, "With [], the effect runs after mount, and its cleanup runs on unmount."],
    ["Why return a cleanup function from an effect?", ["To speed up rendering", "To stop timers, listeners or requests when the component unmounts or re-runs", "It's required", "To reset state"], 1, "Cleanup prevents leaks and stale updates."],
    ["What is a custom hook?", ["A function starting with use that reuses hook logic", "A React plugin", "A CSS helper", "A class component"], 0, "Custom hooks bundle state and effects so components can share them."],
    ["What is the common bug when fetching in an effect without handling it?", ["Fonts break", "A slow old request overwrites newer results", "CSS stops working", "Keys go missing"], 1, "Ignore or abort stale requests in the cleanup, or use a data library."],
  ]),
  quiz("react/react-routing-tailwind", [
    ["What does client-side routing avoid?", ["Writing components", "A full page reload on every navigation", "Using URLs", "SEO"], 1, "The router swaps components while keeping the app loaded."],
    ["In Tailwind, what does md:flex mean?", ["Always flex", "Flex from the md breakpoint and up", "Flex below md", "Flex on hover"], 1, "Tailwind is mobile-first: prefixes apply from that width up."],
    ["Which Tailwind classes add horizontal padding?", ["py-4", "px-4", "m-4", "gap-4"], 1, "px is padding-x (left and right). py is top and bottom."],
    ["How should you read a route parameter like /posts/:id?", ["window.location.split", "The router's params hook or prop", "A global variable", "document.title"], 1, "Routers expose params so components stay in sync with the URL."],
    ["What is a good way to structure a growing React app?", ["One huge file", "Group by feature, with shared components separate", "Group only by file type", "Put everything in App.jsx"], 1, "Feature folders keep related code together and easy to find."],
  ]),

  // ---------------- Line 4: TypeScript and Next.js ----------------
  quiz("nextjs-typescript/typescript", [
    ["What does TypeScript add to JavaScript?", ["A new runtime", "Static types checked before your code runs", "Faster execution", "A CSS framework"], 1, "Types catch mistakes at compile time. The output is plain JavaScript."],
    ["Which type allows only the strings \"draft\" or \"published\"?", ["string", "\"draft\" | \"published\"", "any", "enum string"], 1, "A union of literal types limits values to exactly those strings."],
    ["Why avoid the any type?", ["It is slow", "It switches off type checking for that value", "It is deprecated", "It breaks JSX"], 1, "any hides bugs. Prefer unknown and narrow it."],
    ["How do you type a React component's props?", ["With a type or interface for the props object", "With PropTypes only", "You can't", "With any"], 0, "type Props = { title: string }; function Card({ title }: Props) { ... }"],
    ["What does the ? in { name?: string } mean?", ["name is required", "name is optional", "name is null", "name is a number"], 1, "Optional properties may be missing, so their type includes undefined."],
  ]),
  quiz("nextjs-typescript/nextjs-app-router", [
    ["In the App Router, what file makes a folder a route?", ["index.js", "page.tsx", "route.json", "app.tsx"], 1, "app/blog/page.tsx serves /blog."],
    ["What is a Server Component's main advantage?", ["It can use useState", "It renders on the server and sends no component JavaScript to the browser", "It runs in a worker", "It replaces CSS"], 1, "Less JavaScript in the browser, and direct access to server data."],
    ["When do you need \"use client\"?", ["For every component", "When the component uses state, effects or browser events", "For SEO", "For server data"], 1, "Only interactive leaves need to be client components."],
    ["What does layout.tsx do?", ["Defines a database", "Wraps pages with shared UI that persists between navigations", "Sets environment variables", "Builds CSS"], 1, "Layouts keep headers, sidebars and state around child pages."],
    ["How do you make a dynamic route like /posts/123?", ["app/posts/[id]/page.tsx", "app/posts/:id/page.tsx", "app/posts/*/page.tsx", "app/posts?id/page.tsx"], 0, "Square brackets mark a dynamic segment."],
  ]),
  quiz("nextjs-typescript/nextjs-data-performance", [
    ["What is a Server Action?", ["A browser extension", "A server function you can call from a form or client component", "A cron job", "A CSS animation"], 1, "Mark a function \"use server\" and call it from forms; it runs only on the server."],
    ["What must every Server Action check before changing data?", ["The user's screen size", "That the user is signed in and allowed to do it", "The time of day", "Nothing"], 1, "Server Actions are public endpoints. Always authenticate, authorize and validate input."],
    ["Which tool improves image loading in Next.js?", ["<img> with no size", "next/image", "background-image only", "base64 everything"], 1, "next/image sizes, lazy-loads and serves modern formats."],
    ["Which Core Web Vital measures layout jumping?", ["LCP", "CLS", "INP", "TTFB"], 1, "Cumulative Layout Shift. Reserve space for images and fonts to keep it near 0."],
    ["What is the benefit of a statically rendered page?", ["It can show per-user data", "It is built once and served instantly from the CDN", "It never needs deploying", "It runs SQL in the browser"], 1, "Static pages are fast and cheap; personal parts can load separately."],
  ]),

  // ---------------- Line 5: Backend and databases ----------------
  quiz("backend-databases/node-express-apis", [
    ["Which HTTP method should update part of an existing resource?", ["GET", "PATCH", "DELETE", "HEAD"], 1, "PATCH changes some fields; PUT replaces the whole resource."],
    ["What status code fits \"created successfully\"?", ["200", "201", "204", "302"], 1, "201 Created, often with the new resource in the body."],
    ["What is Express middleware?", ["A database", "A function that runs between the request and your route handler", "A frontend library", "A test runner"], 1, "Middleware handles parsing, auth, logging and errors."],
    ["Where should secrets like API keys live?", ["In the frontend code", "In environment variables on the server", "In the README", "In a public JSON file"], 1, "Never ship secrets to the browser or commit them to Git."],
    ["What should an API return for invalid input?", ["500 with a stack trace", "400 with a clear error message", "200 with no body", "301 to the homepage"], 1, "400 Bad Request plus a helpful message. Never leak stack traces."],
  ]),
  quiz("backend-databases/sql-databases", [
    ["What does a primary key guarantee?", ["The row is encrypted", "Each row is uniquely identified", "The table is sorted", "The column is optional"], 1, "No two rows can share a primary key."],
    ["What does a foreign key do?", ["Links a row to a row in another table", "Speeds up all queries", "Hides a column", "Stores JSON"], 0, "It keeps relationships valid, for example every post has a real author."],
    ["Why use parameterised queries (or an ORM) instead of string concatenation?", ["Shorter code", "They prevent SQL injection", "They are required by Postgres", "They cache results"], 1, "Values are sent separately from SQL, so input can't change the query."],
    ["What is an index for?", ["Backups", "Making lookups on a column fast", "Validating emails", "Storing images"], 1, "Index the columns you filter or join on often."],
    ["Which SQL clause combines rows from two tables?", ["GROUP BY", "JOIN", "ORDER BY", "LIMIT"], 1, "JOIN matches rows using a related column."],
  ]),
  quiz("backend-databases/authentication", [
    ["What is the difference between authentication and authorization?", ["They are the same", "Authentication is who you are; authorization is what you may do", "Authorization comes first", "Authentication is only for admins"], 1, "Log in proves identity; permissions decide access."],
    ["How should passwords be stored?", ["Plain text", "Encrypted with a key you keep", "Hashed with a slow algorithm like bcrypt or Argon2", "Base64 encoded"], 2, "Slow, salted hashes make stolen databases far less useful. Better still: let OAuth providers handle it."],
    ["Which cookie flag stops JavaScript from reading a session cookie?", ["Secure", "HttpOnly", "SameSite", "Path"], 1, "HttpOnly blocks document.cookie access, limiting XSS damage."],
    ["What is OAuth used for in \"Sign in with GitHub\"?", ["Storing passwords", "Letting GitHub confirm who the user is, without sharing their password", "Hosting the app", "Sending emails"], 1, "The app gets proof of identity, never the password."],
    ["Where must permission checks happen?", ["Only in the UI", "On the server, for every request that reads or changes data", "In CSS", "In the README"], 1, "Hiding a button is not security. The server must check."],
  ]),
  quiz("backend-databases/security-testing", [
    ["What does XSS stand for?", ["Extra Style Sheets", "Cross-Site Scripting", "XML Server Sync", "Cross-Server Session"], 1, "Attackers inject scripts into pages other users see."],
    ["Which header limits where scripts can load from?", ["Content-Security-Policy", "Cache-Control", "Accept", "ETag"], 0, "A CSP tells the browser which sources are allowed."],
    ["What is a unit test?", ["A test of the whole deployed app", "A small test of one function or module", "A load test", "A manual check"], 1, "Unit tests are fast and pin down exact behaviour."],
    ["What does CI usually do on every push?", ["Deletes branches", "Runs lint, type checks, tests and a build", "Deploys without checks", "Formats your laptop"], 1, "CI catches problems before they reach main or production."],
    ["What is rate limiting for?", ["Making pages prettier", "Limiting how often one client can call an endpoint", "Compressing responses", "Sorting data"], 1, "It protects login, AI and form endpoints from abuse and runaway costs."],
  ]),

  // ---------------- Line 6: AI and careers ----------------
  quiz("ai-and-careers/ai-apis", [
    ["Where should you call an AI API from?", ["The browser, with the key in JavaScript", "Your server, with the key in an env var", "A public GitHub Action", "An HTML form action to the provider"], 1, "Keys in the browser get stolen. Call from the server."],
    ["What is a token, for AI pricing?", ["A login cookie", "A chunk of text, roughly 3 to 4 characters", "One API call", "A GPU second"], 1, "You pay per input and output token, so long prompts cost more."],
    ["What is a system prompt (or instructions) for?", ["Billing", "Setting the model's role, rules and tone", "Choosing the GPU", "Uploading files"], 1, "It shapes every answer, so keep it clear and specific."],
    ["How do you protect an AI endpoint from abuse?", ["Hide the URL", "Rate limits, input size limits and a cap on output tokens", "Use a longer prompt", "Turn off HTTPS"], 1, "Limits keep costs predictable and stop spam."],
    ["What should the app do when the AI call fails?", ["Show the raw error", "Show a friendly message and let the user retry", "Crash", "Silently do nothing"], 1, "Log details on the server; show users something helpful."],
  ]),
  quiz("ai-and-careers/ai-chat-streaming", [
    ["Why stream AI responses?", ["It's cheaper", "Users see words appear right away instead of waiting for the full answer", "It's required by law", "It improves SEO"], 1, "Streaming makes slow answers feel fast."],
    ["In the Vercel AI SDK, which hook manages chat messages in React?", ["useState", "useChat", "useFetch", "useStream"], 1, "useChat handles messages, sending, streaming status and stopping."],
    ["What should happen when the user clicks Stop?", ["Nothing", "The request is aborted so the model stops generating", "The page reloads", "Messages are deleted"], 1, "Abort the request and pass the abort signal to the model call."],
    ["Why limit how many past messages you send to the model?", ["To save tokens, cost and latency", "Models can't read history", "It's required", "For styling"], 0, "Trim history to keep requests small and predictable."],
    ["What does a demo mode without an API key help with?", ["Nothing", "Anyone can run and test the app for free", "It makes answers better", "It hides bugs"], 1, "Reviewers and recruiters can try the app without your key."],
  ]),
  quiz("ai-and-careers/production-deploy", [
    ["What triggers a new Vercel deployment when connected to GitHub?", ["Editing the README locally", "Pushing a commit", "Opening VS Code", "Starring the repo"], 1, "Every push builds; main goes to production."],
    ["Where do production secrets go on Vercel?", ["In the repo", "Project settings, Environment Variables", "In the page HTML", "In a public gist"], 1, "Set them per environment, then redeploy so they take effect."],
    ["Why add error monitoring or logs?", ["For decoration", "To find out about failures before users report them", "To slow the app", "To change fonts"], 1, "You can't fix what you can't see."],
    ["What does a custom domain need?", ["A DNS record pointing to the host", "A new framework", "A database", "A paid API"], 0, "Add the domain in Vercel and set the DNS records it shows."],
    ["What is a good check before calling a deploy done?", ["It built", "Open the live site, test key flows on a phone, and run Lighthouse", "Ask a friend", "Nothing"], 1, "Building is not the same as working. Check it live."],
  ]),
  quiz("ai-and-careers/job-ready", [
    ["What should a project README show first?", ["Your life story", "What it does, a live link and a screenshot", "The license", "A list of all commits"], 1, "Recruiters skim. Show the result first."],
    ["How many strong portfolio projects beat twenty tutorials?", ["None", "About 3 to 6 real, finished projects", "50", "1 unfinished one"], 1, "A few complete, well-explained projects prove more than many copies."],
    ["What makes a CV bullet stronger?", ["A list of buzzwords", "What you built, with what, and the result", "Long paragraphs", "Your hobbies"], 1, "Action, tools and outcome in one line."],
    ["How should you answer \"tell me about a project\" in an interview?", ["Read the README", "Problem, your decisions, trade-offs and what you'd improve", "Say it was easy", "Talk only about the framework"], 1, "Show your thinking, not just the stack."],
    ["What is a good habit while job hunting?", ["Stop coding", "Keep shipping small improvements and share them", "Apply only to one job", "Hide your GitHub"], 1, "Consistent, visible progress builds trust."],
  ]),
]);

export const PASS_MARK = 0.8;
