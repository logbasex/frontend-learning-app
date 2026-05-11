export interface Module {
  id: string;
  title: string;
  description: string;
  stage: number;
  order: number;
  duration: string;
  prerequisites: string[];
  learningObjectives: string[];
  mentalModels: string[];
  hasInteractiveDemo: boolean;
  hasDiagram: boolean;
  hasChallenge: boolean;
  hasCodeComparison: boolean;
  drivingFailure: string;
  shipsInReferenceApp: string;
  roadmapUrl?: string;
}

export interface Stage {
  id: number;
  title: string;
  description: string;
  icon: string;
  modules: Module[];
}

const ROADMAP = "https://roadmap.sh/frontend";

export const curriculum: Stage[] = [
  {
    id: 1,
    title: "A document, made visible",
    description: "From a thought in your head to a styled document anyone can open",
    icon: "FileText",
    modules: [
      {
        id: "1-1-the-smallest-useful-thing",
        title: "The Smallest Useful Thing on the Web",
        description: "You have words to share. A .txt file works on your laptop. Open it on a phone — and the case for HTML writes itself.",
        stage: 1,
        order: 1,
        duration: "45 mins",
        prerequisites: [],
        learningObjectives: [
          "Recognize what a browser is and is not",
          "Write a working HTML document by hand",
          "Explain why structure has to travel with the words",
        ],
        mentalModels: [
          "A browser is a document renderer; HTML is the document format it understands",
          "Tags are structure, not decoration",
          "Working code is the unit of progress",
        ],
        hasInteractiveDemo: true,
        hasDiagram: false,
        hasChallenge: true,
        hasCodeComparison: true,
        drivingFailure: "A .txt blog post opens fine on your laptop. Open it on a phone — fonts collapse, links don't work, no headings.",
        shipsInReferenceApp: "examples/taproot-blog/static/index.html (homepage skeleton, no styling, working anchor links)",
        roadmapUrl: ROADMAP,
      },
      {
        id: "1-2-meaning-before-appearance",
        title: "Meaning Before Appearance",
        description: "Your HTML works but reads like a list. A blind reader, a search engine, and a browser tab all need to know what role each chunk plays.",
        stage: 1,
        order: 2,
        duration: "50 mins",
        prerequisites: ["1-1-the-smallest-useful-thing"],
        learningObjectives: [
          "Pick the right semantic element for the job",
          "Build a document outline a screen reader can follow",
          "Wire a form's labels and inputs accessibly",
        ],
        mentalModels: [
          "HTML is a meaning tree, not a layout tree",
          "Accessibility and SEO are side-effects of good semantics",
          "First rule of ARIA: don't use ARIA",
        ],
        hasInteractiveDemo: true,
        hasDiagram: false,
        hasChallenge: true,
        hasCodeComparison: true,
        drivingFailure: "A screen reader reads your homepage as 'link, link, link, text, text, text' — no sense of what is navigation, article, or aside.",
        shipsInReferenceApp: "examples/taproot-blog/static/posts/*.html (real <article>s with heading hierarchy, accessible comment form)",
        roadmapUrl: ROADMAP,
      },
      {
        id: "1-3-the-same-document-two-lives",
        title: "The Same Document, Two Lives",
        description: "The same blog post on a phone and a billboard. Inline style attributes scale to nothing. Why CSS had to be separate, and why it cascades.",
        stage: 1,
        order: 3,
        duration: "60 mins",
        prerequisites: ["1-2-meaning-before-appearance"],
        learningObjectives: [
          "Compute specificity by hand and predict cascade winners",
          "Reason about the box model (content-box vs border-box)",
          "Build a responsive two-column layout with Flexbox and Grid",
        ],
        mentalModels: [
          "Cascade = origin + specificity + source order",
          "Every element is a box; layout positions boxes",
          "Mobile-first is additive, not subtractive",
        ],
        hasInteractiveDemo: true,
        hasDiagram: true,
        hasChallenge: true,
        hasCodeComparison: true,
        drivingFailure: "Inline styles work for one paragraph. Apply them to twenty posts and your HTML doubles in size; the same CSS is repeated everywhere; changing the brand color means 200 edits.",
        shipsInReferenceApp: "examples/taproot-blog/static/assets/site.css (full styled blog, mobile-first, two-column desktop / single-column mobile)",
        roadmapUrl: ROADMAP,
      },
    ],
  },
  {
    id: 2,
    title: "A document, made alive",
    description: "From a styled document to an interactive page that responds to a human",
    icon: "Zap",
    modules: [
      {
        id: "2-1-when-the-page-has-to-react",
        title: "When the Page Has to React",
        description: "A 'show comments' button. HTML can't do that. CSS can fake it but breaks fast. JavaScript and the DOM, derived.",
        stage: 2,
        order: 1,
        duration: "55 mins",
        prerequisites: ["1-3-the-same-document-two-lives"],
        learningObjectives: [
          "Distinguish primitives, references, and how scope binds them",
          "Query and mutate the DOM efficiently",
          "Use event delegation for dynamic content",
        ],
        mentalModels: [
          "The DOM is a live tree the browser exposes for mutation",
          "Events bubble; delegation is listening on a parent",
          "JavaScript runs on a single thread; understanding that explains everything else",
        ],
        hasInteractiveDemo: true,
        hasDiagram: true,
        hasChallenge: true,
        hasCodeComparison: false,
        drivingFailure: "A 'show comments' button needs to toggle a section. HTML provides no syntax for that. CSS :checked hacks fail the moment a third state appears.",
        shipsInReferenceApp: "examples/taproot-blog/static/ + a <script> block that toggles a comments section (and contains a deliberate state-vs-DOM bug, the seed of module 4-1)",
        roadmapUrl: ROADMAP,
      },
      {
        id: "2-2-things-take-time",
        title: "Things Take Time",
        description: "Loading comments isn't instant. The network exists. Async, promises, and the event loop are the same problem in three disguises.",
        stage: 2,
        order: 2,
        duration: "50 mins",
        prerequisites: ["2-1-when-the-page-has-to-react"],
        learningObjectives: [
          "Convert callbacks into Promises and Promises into async/await",
          "Sketch the event loop with macrotasks and microtasks",
          "Handle errors in async chains",
        ],
        mentalModels: [
          "A Promise is a value that's not here yet",
          "async/await is sugar over Promises",
          "The event loop is a queue of work, not a thread of execution",
        ],
        hasInteractiveDemo: true,
        hasDiagram: true,
        hasChallenge: true,
        hasCodeComparison: true,
        drivingFailure: "Synchronous code freezes the page while comments load. Users click again, again, again — nothing happens until the call returns.",
        shipsInReferenceApp: "examples/taproot-blog/static/ — comments section now loads asynchronously from a hardcoded JSON file with a loading state",
        roadmapUrl: ROADMAP,
      },
      {
        id: "2-3-talking-to-another-machine",
        title: "Talking to Another Machine",
        description: "Comments live on a server. You typed a URL once and it worked; now you have to do that yourself, from JS. HTTP, fetch, status codes, and CORS — derived from real failures.",
        stage: 2,
        order: 3,
        duration: "55 mins",
        prerequisites: ["2-2-things-take-time"],
        learningObjectives: [
          "Read an HTTP request/response by hand",
          "Pick the right method and status code for an operation",
          "Diagnose and fix a CORS-blocked request",
        ],
        mentalModels: [
          "HTTP is a stateless conversation",
          "Status codes are categories: 1xx info, 2xx ok, 3xx redirect, 4xx you, 5xx me",
          "CORS is a browser policy, not a server feature",
        ],
        hasInteractiveDemo: true,
        hasDiagram: false,
        hasChallenge: true,
        hasCodeComparison: false,
        drivingFailure: "fetch('https://other-origin/comments') returns nothing useful. The console says 'CORS blocked'. Why? What header would unblock it?",
        shipsInReferenceApp: "examples/taproot-blog/static/ — comments section fetches from a real-shaped (mock-served) endpoint; CORS is fixed by the learner",
        roadmapUrl: ROADMAP,
      },
    ],
  },
  {
    id: 3,
    title: "A page that lives on the internet",
    description: "From works on your laptop to a stranger across the world can open it",
    icon: "Globe",
    modules: [
      {
        id: "3-1-the-journey-of-a-url",
        title: "The Journey of a URL",
        description: "You push your files somewhere; someone in Brazil types your domain. What has to happen between those two events? DNS, TCP, TLS, browsers, the rendering pipeline — all derived from one trace.",
        stage: 3,
        order: 1,
        duration: "60 mins",
        prerequisites: ["2-3-talking-to-another-machine"],
        learningObjectives: [
          "Trace what happens between typing a URL and seeing pixels",
          "Distinguish DNS, IP, TCP, TLS, and HTTP layers",
          "Walk through the critical rendering path (parse → DOM → CSSOM → render → layout → paint)",
        ],
        mentalModels: [
          "The internet is a layered postal system",
          "Render = parse + style + layout + paint + composite",
          "Hosting is a server willing to answer your IP",
        ],
        hasInteractiveDemo: true,
        hasDiagram: true,
        hasChallenge: true,
        hasCodeComparison: false,
        drivingFailure: "Your blog opens on your laptop because your laptop has the file. A friend in Brazil types your domain — what has to be true for them to see what you see?",
        shipsInReferenceApp: "(Explanatory module — no reference-app changes; uses SequenceDiagram and InteractiveDiagram)",
        roadmapUrl: ROADMAP,
      },
      {
        id: "3-2-ship-it-and-version-it",
        title: "Ship It and Version It",
        description: "Your laptop has the only copy. It works locally and breaks on production. You also rewrote the CSS and can't undo. Git, hosting, and a deploy pipeline.",
        stage: 3,
        order: 2,
        duration: "50 mins",
        prerequisites: ["3-1-the-journey-of-a-url"],
        learningObjectives: [
          "Work in feature branches and resolve a merge conflict without panic",
          "Deploy a static site to a hosting provider",
          "Read git log like a story",
        ],
        mentalModels: [
          "Git tracks snapshots, not diffs",
          "A branch is a movable pointer to a commit",
          "Deploys turn 'works on my machine' into 'works for everyone'",
        ],
        hasInteractiveDemo: false,
        hasDiagram: true,
        hasChallenge: true,
        hasCodeComparison: false,
        drivingFailure: "You accidentally rewrote assets/site.css. There's no Ctrl+Z that survives lunch. Your friend asks for the URL — your laptop is the only place it exists.",
        shipsInReferenceApp: "examples/taproot-blog/static/ committed to a real Git history and deployed to a real public URL",
        roadmapUrl: ROADMAP,
      },
    ],
  },
  {
    id: 4,
    title: "The walls of vanilla",
    description: "From a working hand-written page to a real app that doesn't collapse under its own weight",
    icon: "Wrench",
    modules: [
      {
        id: "4-1-the-dom-is-a-footgun-at-scale",
        title: "The DOM Is a Footgun at Scale",
        description: "Adding a comment-edit feature forces you to rebuild parts of the page by hand and keep state and DOM in sync. Why React (and reactivity) had to be invented.",
        stage: 4,
        order: 1,
        duration: "65 mins",
        prerequisites: ["3-2-ship-it-and-version-it"],
        learningObjectives: [
          "Recognize the state-vs-DOM divergence bug class",
          "Write a React component with hooks (useState, useEffect)",
          "Set up a Vite + React project and read its build output",
        ],
        mentalModels: [
          "A component is a function of state",
          "JSX is a description, not a template",
          "The build step is the hinge between writing and running",
        ],
        hasInteractiveDemo: true,
        hasDiagram: true,
        hasChallenge: true,
        hasCodeComparison: true,
        drivingFailure: "Adding 'edit your own comment' to the vanilla blog means: find the right node, replace its contents, swap classes, restore on cancel. State lives in three places. Bugs follow.",
        shipsInReferenceApp: "examples/taproot-blog/spa/ — same blog, rebuilt as Vite + React, comments and editing now work cleanly. MSW mocks the API.",
        roadmapUrl: ROADMAP,
      },
      {
        id: "4-2-types-and-the-editor-that-knows-them",
        title: "Types and the Editor That Knows Them",
        description: "JS lets you pass the wrong shape and find out at runtime, on production, from a user. Why TypeScript stopped being optional.",
        stage: 4,
        order: 2,
        duration: "50 mins",
        prerequisites: ["4-1-the-dom-is-a-footgun-at-scale"],
        learningObjectives: [
          "Add types to a JS file incrementally",
          "Use unions, generics, and narrowing",
          "Read and fix a tsc error",
        ],
        mentalModels: [
          "TypeScript is a type-checker, not a runtime",
          "Structural typing: shape > name",
          "Narrowing turns a union into a single arm",
        ],
        hasInteractiveDemo: true,
        hasDiagram: false,
        hasChallenge: true,
        hasCodeComparison: true,
        drivingFailure: "A user reports 'undefined is not a function'. The bug: a Comment had no .author because the API returned null. JS happily passed it through three layers before exploding.",
        shipsInReferenceApp: "examples/taproot-blog/spa/src/** — full TypeScript: real types for Author, Post, Comment; a tsc error the learner reads and fixes",
        roadmapUrl: ROADMAP,
      },
      {
        id: "4-3-css-at-scale-collides",
        title: "CSS at Scale Collides",
        description: "Two components style .button differently. Last one wins. Why utility-first (Tailwind) and scoping exist.",
        stage: 4,
        order: 3,
        duration: "50 mins",
        prerequisites: ["4-2-types-and-the-editor-that-knows-them"],
        learningObjectives: [
          "Diagnose a specificity collision",
          "Restyle a real component with Tailwind utilities",
          "Recognize when not to add a styling library",
        ],
        mentalModels: [
          "Atomic CSS scales utility; semantic CSS scales meaning",
          "Reading a component's class list should tell you what it looks like",
          "Architecture beats clever selectors",
        ],
        hasInteractiveDemo: true,
        hasDiagram: false,
        hasChallenge: true,
        hasCodeComparison: true,
        drivingFailure: "<CommentForm> and <PostForm> both style .button. CommentForm's button is now blue everywhere — including in PostForm, where it should be gray.",
        shipsInReferenceApp: "examples/taproot-blog/spa/ — restyled with Tailwind: same UI, no global stylesheets, no specificity wars",
        roadmapUrl: ROADMAP,
      },
    ],
  },
  {
    id: 5,
    title: "A real modern frontend app",
    description: "From a CSR app to a production app: SEO, auth, data, deploy",
    icon: "Layers",
    modules: [
      {
        id: "5-1-routes-layouts-and-where-should-this-render",
        title: "Routes, Layouts, and Where Should This Render",
        description: "The SPA is fast for users with JS but invisible to Google. Why SSR, RSC, and the client/server boundary exist.",
        stage: 5,
        order: 1,
        duration: "65 mins",
        prerequisites: ["4-3-css-at-scale-collides"],
        learningObjectives: [
          "Pick CSR / SSR / SSG / ISR / RSC for a route on purpose",
          "Reason about hydration cost and what it actually costs",
          "Set up Next.js App Router with nested layouts",
        ],
        mentalModels: [
          "Rendering location is a slider, not a switch",
          "Hydration = wiring up server HTML on the client",
          "RSC = render some components on the server, never ship their JS",
        ],
        hasInteractiveDemo: true,
        hasDiagram: true,
        hasChallenge: true,
        hasCodeComparison: true,
        drivingFailure: "Search 'taproot-blog' on Google — your blog isn't there. View source on the SPA — the body is empty until JS runs. The first paint is a blank screen on slow phones.",
        shipsInReferenceApp: "examples/taproot-blog/app/ — Next.js App Router; HTML arrives ready-painted; OG tags work; Google can index posts",
        roadmapUrl: ROADMAP,
      },
      {
        id: "5-2-data-state-and-who-owns-the-truth",
        title: "Data, State, and Who Owns the Truth",
        description: "Three places think they know the comment count: URL, server, client cache. Which is right? When? Why state has flavors.",
        stage: 5,
        order: 2,
        duration: "65 mins",
        prerequisites: ["5-1-routes-layouts-and-where-should-this-render"],
        learningObjectives: [
          "Distinguish URL state, server state, and client state",
          "Use server actions and cache invalidation in Next.js",
          "Pick a data-fetching strategy for a given feature",
        ],
        mentalModels: [
          "State has three flavors; matching the flavor to the data shape avoids 90% of state-management pain",
          "URL state is the back/forward button's source of truth",
          "Server state is shared; client state is local",
        ],
        hasInteractiveDemo: true,
        hasDiagram: true,
        hasChallenge: true,
        hasCodeComparison: true,
        drivingFailure: "User filters by tag → URL changes → server returns filtered posts → client cache thinks the old set is still valid → user sees the wrong list. Three sources of truth, all confident.",
        shipsInReferenceApp: "examples/taproot-blog/app/ — comments persist to Postgres via Prisma; URL state controls filters; server actions handle submissions; cache invalidates correctly",
        roadmapUrl: ROADMAP,
      },
      {
        id: "5-3-identity-and-trust",
        title: "Identity and Trust",
        description: "The blog needs authors, not anonymous commenters. Now there are users, sessions, secrets, and adversaries.",
        stage: 5,
        order: 3,
        duration: "60 mins",
        prerequisites: ["5-2-data-state-and-who-owns-the-truth"],
        learningObjectives: [
          "Distinguish authentication from authorization",
          "Set up session-based auth with NextAuth",
          "Identify and fix a CSRF and an XSS vulnerability",
        ],
        mentalModels: [
          "Cookies are sent automatically; tokens aren't",
          "The frontend is not the security boundary",
          "Every check on the client must also exist on the server",
        ],
        hasInteractiveDemo: true,
        hasDiagram: true,
        hasChallenge: true,
        hasCodeComparison: false,
        drivingFailure: "You add a 'Delete' button visible only to authors. A curious user opens DevTools, removes the hidden class, clicks delete. The post is gone. The frontend was the security boundary. It shouldn't have been.",
        shipsInReferenceApp: "examples/taproot-blog/app/ — full auth via NextAuth, role-based UI, server-side authorization checks, secure session cookies",
        roadmapUrl: ROADMAP,
      },
    ],
  },
  {
    id: 6,
    title: "The field, from here",
    description: "Use the foundation to position everything the spine didn't cover",
    icon: "Map",
    modules: [
      {
        id: "6-1-the-field-from-here",
        title: "The Field, From Here",
        description: "Given what you now know, here is what GraphQL changes about request 6, what React Native does to module 4-1, what PWAs add to module 3-1 — every roadmap topic the spine didn't cover, positioned against what you understand.",
        stage: 6,
        order: 1,
        duration: "75 mins",
        prerequisites: ["5-3-identity-and-trust"],
        learningObjectives: [
          "Position a new frontend tool against the foundation you have",
          "Reason about a tool's costs as well as its benefits",
          "Recognize when not to reach for a new tool",
        ],
        mentalModels: [
          "Every tool is an answer to a problem; understand the problem first",
          "New tech almost always trades one cost for another",
          "Foundations make new topics cheap",
        ],
        hasInteractiveDemo: false,
        hasDiagram: true,
        hasChallenge: true,
        hasCodeComparison: false,
        drivingFailure: "(closing module — no driving failure)",
        shipsInReferenceApp: "(closing module — no reference-app changes)",
        roadmapUrl: ROADMAP,
      },
    ],
  },
];

export function getAllModules(): Module[] {
  return curriculum.flatMap((stage) => stage.modules);
}

export function getModuleById(id: string): Module | undefined {
  return getAllModules().find((moduleData) => moduleData.id === id);
}

export function getModulesByStage(stageId: number): Module[] {
  return curriculum.find((s) => s.id === stageId)?.modules ?? [];
}

export function getNextModule(currentModuleId: string): Module | undefined {
  const all = getAllModules();
  const i = all.findIndex((m) => m.id === currentModuleId);
  if (i === -1 || i === all.length - 1) return undefined;
  return all[i + 1];
}

export function getPreviousModule(currentModuleId: string): Module | undefined {
  const all = getAllModules();
  const i = all.findIndex((m) => m.id === currentModuleId);
  if (i <= 0) return undefined;
  return all[i - 1];
}

export function isModuleUnlocked(_moduleId: string, _completedModules: string[]): boolean {
  return true;
}

export function getStageProgress(stageId: number, completedModules: string[]): number {
  const modules = getModulesByStage(stageId);
  if (modules.length === 0) return 0;
  const done = modules.filter((m) => completedModules.includes(m.id)).length;
  return Math.round((done / modules.length) * 100);
}

export function getTotalProgress(completedModules: string[]): number {
  const total = getAllModules().length;
  if (total === 0) return 0;
  return Math.round((completedModules.length / total) * 100);
}
