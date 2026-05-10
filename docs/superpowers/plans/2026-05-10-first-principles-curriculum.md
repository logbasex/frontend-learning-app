# First-Principles Curriculum — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the curriculum from a 30-module topic catalog into a 15-module first-principles derivation chain (14 spine modules + 1 closing field-map module), where the reference app `examples/taproot-blog` is the spine and every module ships working code on it.

**Architecture:** The Next.js app shell is unchanged. The curriculum metadata (`lib/curriculum.ts`), the module-content registry (`lib/modules/index.ts`), the per-module content files (`lib/modules/*.tsx`), the dashboard (`app/page.tsx`), the progress store (`lib/progress.ts`), and CLAUDE.md are rewritten. The reference app `examples/taproot-blog` is *not* changed — it is the existing static → SPA → Next.js gradient that the new curriculum derives one rung at a time. Each spine module follows the existing Tier-A 7-section template (Hook → Mental model → Step-by-step → Playground → Challenges → GotchaList → KeyTakeaways), refined to use a *driving failure* in the Hook and a *derivation* in the Step-by-step.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript (strict), Tailwind CSS, Zustand (progress store), Sandpack (playground), ReactFlow (diagrams), Prism (syntax highlighting). Quality gates: `npm run lint`, `npx tsc --noEmit`, `npm run build`.

**Source spec:** `docs/superpowers/specs/2026-05-10-first-principles-curriculum-design.md`. Read it before starting; tasks below assume familiarity with §3 (the spine), §4 (template refinements), and §7 (coverage map).

**Working scope note:** This plan rewrites every module. It is large — ~30 tasks, most of which are full module authorings. Work is structured so each task ends green (lint, typecheck, build) and is independently committable. Tasks are ordered so the app stays bootable at every commit; old modules are removed only after their replacements exist, *or* after the dashboard is updated to reference only the new modules.

---

## File Structure

**Created (new):**

- `lib/modules/1-1-the-smallest-useful-thing.tsx` — Stage I module 1
- `lib/modules/1-2-meaning-before-appearance.tsx` — Stage I module 2
- `lib/modules/1-3-the-same-document-two-lives.tsx` — Stage I module 3
- `lib/modules/2-1-when-the-page-has-to-react.tsx` — Stage II module 1
- `lib/modules/2-2-things-take-time.tsx` — Stage II module 2
- `lib/modules/2-3-talking-to-another-machine.tsx` — Stage II module 3
- `lib/modules/3-1-the-journey-of-a-url.tsx` — Stage III module 1
- `lib/modules/3-2-ship-it-and-version-it.tsx` — Stage III module 2
- `lib/modules/4-1-the-dom-is-a-footgun-at-scale.tsx` — Stage IV module 1
- `lib/modules/4-2-types-and-the-editor-that-knows-them.tsx` — Stage IV module 2
- `lib/modules/4-3-css-at-scale-collides.tsx` — Stage IV module 3
- `lib/modules/5-1-routes-layouts-and-where-should-this-render.tsx` — Stage V module 1
- `lib/modules/5-2-data-state-and-who-owns-the-truth.tsx` — Stage V module 2
- `lib/modules/5-3-identity-and-trust.tsx` — Stage V module 3
- `lib/modules/6-1-the-field-from-here.tsx` — Closing module
- `docs/superpowers/specs/2026-05-10-first-principles-learning-outcomes.md` — Per-module Bloom-verb outcomes, supersedes 2026-05-09-learning-outcomes.md

**Modified:**

- `lib/curriculum.ts` — Rewritten: 5 stages + 1 closing, 15 modules total. Phase IDs become 1-6 (Stage I–V + Closing). The orientation phase 0 is removed; its content is folded into Stage I module 1's Hook (the curriculum *opens* with the failure of a `.txt` file, not with a meta-orientation).
- `lib/modules/index.ts` — Rewritten: 15 imports, 15 entries in `MODULE_CONTENTS`.
- `lib/progress.ts` — `name: 'frontend-learning-progress'` → `name: 'frontend-learning-progress-v2'`; `useProgressStats` reads `totalModules` from `getAllModules().length` instead of hardcoded `30`.
- `app/page.tsx` — Dashboard renders 5 stages + 1 closing card; the "Start here: Phase 0" block is removed; the intro card is rewritten to describe the first-principles framing.
- `CLAUDE.md` — "Curriculum: 7 phases, 30 modules" → "Curriculum: 5 stages + 1 closing module, 15 modules total"; coverage commitment updated; architecture overview updated.

**Deleted:**

- `lib/modules/0-1-the-map.tsx` — orientation module, replaced by Stage I module 1's framing.
- `lib/modules/1-1-how-the-internet-works.tsx` through `lib/modules/8-3-the-architecture-of-a-real-app.tsx` — all 36 old module files.
- `lib/modules/_template.tsx` — already deprecated; final removal.
- `lib/modules/_demos/` — scaffolding for the deprecated template.
- `docs/superpowers/specs/2026-05-09-learning-outcomes.md` — superseded by the new outcomes doc (§9 of the spec calls this out).

**Unchanged:**

- `examples/taproot-blog/**` — the reference app's static/spa/app rungs are exactly what the spine derives; no edits required by this plan.
- `components/**` — every interactive component is reused.
- `app/lesson/[moduleId]/page.tsx` — reads from the module registry; works with whatever ids the registry defines.
- `app/layout.tsx`, app theme, `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, all build config.
- `scripts/check-no-vietnamese.mjs` — language guard still runs over `components/`, `lib/`, `app/`.

---

## Quality gate (run after every task)

```bash
npm run lint && npx tsc --noEmit && npm run build
```

All three must be green before committing. If any fail, fix before moving on. Do not skip.

---

## Task 1: Scaffold the new curriculum metadata (without breaking the app)

**Files:**
- Modify: `lib/curriculum.ts` (full rewrite)

The strategy: write the new 5-stage / 6-phase curriculum metadata first, with all 15 modules listed, but pointing the registry at *placeholder* content. The placeholder is a tiny stub component shipped in Task 2. This lets us update `curriculum.ts` and `index.ts` together (so the app still builds) without authoring all 15 lessons in the same task.

- [ ] **Step 1: Replace the contents of `lib/curriculum.ts` entirely**

Open `lib/curriculum.ts` and replace its contents with:

```typescript
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
```

- [ ] **Step 2: Verify TypeScript still type-checks**

Run: `npx tsc --noEmit`
Expected: errors *only* in files that import from the old API (`Phase`, `getModulesByPhase`, `getPhaseProgress`). These are: `app/page.tsx`, `app/lesson/[moduleId]/page.tsx`, and possibly the old module files (which we haven't touched yet). They will be fixed in subsequent tasks. Make a note of which files error — they form the dependency list for Task 2 and Task 3.

- [ ] **Step 3: Do not commit yet**

The app does not build at this point because `lib/modules/index.ts` still imports modules with old IDs that no longer match the new curriculum. The fix lands in Task 2.

---

## Task 2: Add a placeholder module component, point the registry at it for all 15 new modules

**Files:**
- Create: `lib/modules/_placeholder.tsx`
- Modify: `lib/modules/index.ts` (full rewrite)

The placeholder component renders a clear "this module is being authored" message so the app boots end-to-end on every commit, even before the real lesson content exists. We register it for all 15 new module ids; later tasks replace each entry one by one with the real component.

- [ ] **Step 1: Create `lib/modules/_placeholder.tsx`**

```typescript
"use client";

import { Card, CardContent } from "@/components/ui/card";

export function PlaceholderModuleContent() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <p className="text-slate-700 dark:text-slate-300">
            This module is being authored. Come back soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] **Step 2: Replace `lib/modules/index.ts` entirely**

```typescript
import React from "react";

import { PlaceholderModuleContent } from "./_placeholder";

export const MODULE_CONTENTS: Record<string, React.ComponentType> = {
  "1-1-the-smallest-useful-thing": PlaceholderModuleContent,
  "1-2-meaning-before-appearance": PlaceholderModuleContent,
  "1-3-the-same-document-two-lives": PlaceholderModuleContent,
  "2-1-when-the-page-has-to-react": PlaceholderModuleContent,
  "2-2-things-take-time": PlaceholderModuleContent,
  "2-3-talking-to-another-machine": PlaceholderModuleContent,
  "3-1-the-journey-of-a-url": PlaceholderModuleContent,
  "3-2-ship-it-and-version-it": PlaceholderModuleContent,
  "4-1-the-dom-is-a-footgun-at-scale": PlaceholderModuleContent,
  "4-2-types-and-the-editor-that-knows-them": PlaceholderModuleContent,
  "4-3-css-at-scale-collides": PlaceholderModuleContent,
  "5-1-routes-layouts-and-where-should-this-render": PlaceholderModuleContent,
  "5-2-data-state-and-who-owns-the-truth": PlaceholderModuleContent,
  "5-3-identity-and-trust": PlaceholderModuleContent,
  "6-1-the-field-from-here": PlaceholderModuleContent,
};

export function getModuleContent(moduleId: string): React.ComponentType | null {
  return MODULE_CONTENTS[moduleId] || null;
}
```

- [ ] **Step 3: Delete every old module file**

```bash
rm lib/modules/0-1-the-map.tsx
rm lib/modules/1-1-how-the-internet-works.tsx
rm lib/modules/1-2-http-and-https.tsx
rm lib/modules/1-3-domain-dns-hosting.tsx
rm lib/modules/1-4-browsers-and-rendering.tsx
rm lib/modules/2-1-html-basics-and-semantics.tsx
rm lib/modules/2-2-forms-and-validation.tsx
rm lib/modules/2-3-accessibility.tsx
rm lib/modules/2-4-seo-basics.tsx
rm lib/modules/3-1-css-fundamentals.tsx
rm lib/modules/3-2-flexbox-and-grid.tsx
rm lib/modules/3-3-responsive-design.tsx
rm lib/modules/3-4-writing-css-modern.tsx
rm lib/modules/3-5-css-architecture-and-preprocessors.tsx
rm lib/modules/4-1-javascript-fundamentals.tsx
rm lib/modules/4-2-dom-and-events.tsx
rm lib/modules/4-3-fetch-and-async.tsx
rm lib/modules/5-1-git-and-github.tsx
rm lib/modules/5-2-package-managers.tsx
rm lib/modules/5-3-pick-a-framework.tsx
rm lib/modules/5-4-typescript.tsx
rm lib/modules/6-1-linters-and-formatters.tsx
rm lib/modules/6-2-module-bundlers.tsx
rm lib/modules/6-3-testing.tsx
rm lib/modules/6-4-authentication.tsx
rm lib/modules/6-5-web-security.tsx
rm lib/modules/7-1-web-components.tsx
rm lib/modules/7-2-ssr.tsx
rm lib/modules/7-3-graphql.tsx
rm lib/modules/7-4-static-site-generators.tsx
rm lib/modules/7-5-pwas-and-browser-apis.tsx
rm lib/modules/7-6-mobile-apps.tsx
rm lib/modules/7-7-desktop-apps.tsx
rm lib/modules/7-8-performance.tsx
rm lib/modules/8-1-the-build-pipeline.tsx
rm lib/modules/8-2-the-request-lifecycle.tsx
rm lib/modules/8-3-the-architecture-of-a-real-app.tsx
rm lib/modules/_template.tsx
rm -rf lib/modules/_demos
```

- [ ] **Step 4: Run typecheck**

Run: `npx tsc --noEmit`
Expected: errors only in `app/page.tsx` (which still uses the old `Phase`, `getPhaseProgress`, etc.), and possibly `app/lesson/[moduleId]/page.tsx` if it references old phase shapes. Note these — fixed in Task 3.

- [ ] **Step 5: Do not commit yet**

The dashboard still imports the old API; we land Task 1, 2, and 3 together.

---

## Task 3: Update the dashboard, the progress store, and the lesson page

**Files:**
- Modify: `app/page.tsx` (full rewrite)
- Modify: `lib/progress.ts:83` (storage key bump) and `lib/progress.ts:91` (drop hardcoded total)
- Modify: `app/lesson/[moduleId]/page.tsx` if it imports `Phase` or `getModulesByPhase` (verify in Step 1)

The dashboard rewrites to render 5 stages + 1 closing card. The progress store bumps its `localStorage` key so existing learners' (now-invalid) progress is ignored on first load.

- [ ] **Step 1: Audit `app/lesson/[moduleId]/page.tsx` for old API usage**

Run: `grep -n "getModulesByPhase\|getPhaseProgress\|Phase\b" app/lesson/[moduleId]/page.tsx`
Expected: zero matches *or* a small number of matches that need updating. If matches exist, replace `getModulesByPhase` → `getModulesByStage`, `getPhaseProgress` → `getStageProgress`, `Phase` → `Stage`.

- [ ] **Step 2: Update `lib/progress.ts`**

Open `lib/progress.ts` and make two edits:

Replace:

```typescript
    {
      name: 'frontend-learning-progress',
      storage: createJSONStorage(() => localStorage),
    }
```

with:

```typescript
    {
      name: 'frontend-learning-progress-v2',
      storage: createJSONStorage(() => localStorage),
    }
```

And replace:

```typescript
export function useProgressStats() {
  const completedModules = useProgress((state) => state.completedModules);
  const totalModules = 30;
  const completedCount = completedModules.length;
  const progressPercentage = Math.round((completedCount / totalModules) * 100);
  return { completedCount, totalModules, progressPercentage };
}
```

with:

```typescript
import { getAllModules } from './curriculum';

export function useProgressStats() {
  const completedModules = useProgress((state) => state.completedModules);
  const totalModules = getAllModules().length;
  const completedCount = completedModules.length;
  const progressPercentage = totalModules === 0 ? 0 : Math.round((completedCount / totalModules) * 100);
  return { completedCount, totalModules, progressPercentage };
}
```

(Note: the new `useProgressStats` imports from `./curriculum`. If `lib/progress.ts` already imports from there, merge the import; otherwise add it at the top.)

- [ ] **Step 3: Replace `app/page.tsx` entirely**

```typescript
"use client";

import { curriculum, getStageProgress, getTotalProgress } from "@/lib/curriculum";
import { useProgress } from "@/lib/progress";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Globe,
  Zap,
  Wrench,
  Layers,
  Check,
  BookMarked,
  Clock,
  FileText,
  Map as MapIcon,
} from "lucide-react";

const ICONS = {
  FileText,
  Zap,
  Globe,
  Wrench,
  Layers,
  Map: MapIcon,
};

export default function DashboardPage() {
  const { completedModules } = useProgress();
  const totalProgress = getTotalProgress(completedModules);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                Frontend, From First Principles
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                One real app, derived step by step. Each module exists because the previous one hit a wall.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Progress</p>
                <p className="text-2xl font-bold text-blue-600">{totalProgress}%</p>
              </div>
              <Progress value={totalProgress} className="w-32" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Intro Section */}
        <Card className="mb-8 border-blue-200 dark:border-blue-900 bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-950 dark:to-violet-950">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-500 rounded-lg">
                <BookMarked className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">How this curriculum works</h2>
                <p className="text-slate-700 dark:text-slate-300 mb-4">
                  Most frontend courses are catalogs: HTML, CSS, JavaScript, React, Next.js — one topic after another.
                  This one is a single derivation. You start with a text file, hit a wall, and every module exists because the previous module&apos;s world couldn&apos;t solve a real problem.
                  By the end you have built one real modern blog &mdash; the same app shows up in module 1 (broken), and grows one rung at a time.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="gap-1">
                    <Check className="w-3 h-3" /> First-principles derivation
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <Check className="w-3 h-3" /> One reference app, three rungs
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <Check className="w-3 h-3" /> Every module ships working code
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stages */}
        <div className="space-y-6">
          {curriculum.map((stage) => {
            const IconComponent = ICONS[stage.icon as keyof typeof ICONS] || Globe;
            const stageProgress = getStageProgress(stage.id, completedModules);
            const isStageComplete = stageProgress === 100;
            const isClosing = stage.id === 6;

            return (
              <Card key={stage.id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white dark:bg-slate-700 rounded-lg shadow-sm">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl flex items-center gap-2">
                          Stage {stage.id}: {stage.title}
                          {isClosing && (
                            <Badge className="bg-violet-500 hover:bg-violet-600 text-xs">Closing</Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="mt-1">{stage.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {isStageComplete && (
                        <Badge className="bg-green-500 hover:bg-green-600">
                          <Check className="w-3 h-3 mr-1" /> Completed
                        </Badge>
                      )}
                      <div className="text-right">
                        <p className="text-sm text-slate-600 dark:text-slate-400">Progress</p>
                        <p className="text-lg font-bold text-blue-600">{stageProgress}%</p>
                      </div>
                    </div>
                  </div>
                  <Progress value={stageProgress} className="mt-4" />
                </CardHeader>

                <CardContent className="p-6">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {stage.modules.map((moduleData) => {
                      const isCompleted = completedModules.includes(moduleData.id);
                      const recommendedPrereqs = moduleData.prerequisites.filter(
                        (p) => !completedModules.includes(p)
                      );
                      const hasRecommended = recommendedPrereqs.length > 0;

                      return (
                        <Link
                          key={moduleData.id}
                          href={`/lesson/${moduleData.id}`}
                          className="block"
                        >
                          <Card className={`h-full transition-all hover:shadow-lg hover:border-blue-300 ${
                            isCompleted ? "border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950/20" : ""
                          }`}>
                            <CardHeader>
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <CardTitle className="text-base flex items-center gap-2">
                                    {isCompleted && <Check className="w-4 h-4 text-green-600" />}
                                    {moduleData.title}
                                  </CardTitle>
                                </div>
                              </div>
                              <CardDescription className="text-sm line-clamp-2">
                                {moduleData.description}
                              </CardDescription>
                            </CardHeader>

                            <CardContent>
                              <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {moduleData.duration}
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-1 mt-3">
                                {moduleData.hasInteractiveDemo && (
                                  <Badge variant="outline" className="text-xs">Live Code</Badge>
                                )}
                                {moduleData.hasDiagram && (
                                  <Badge variant="outline" className="text-xs">Diagram</Badge>
                                )}
                                {moduleData.hasChallenge && (
                                  <Badge variant="outline" className="text-xs">Challenge</Badge>
                                )}
                                {moduleData.hasCodeComparison && (
                                  <Badge variant="outline" className="text-xs">Comparison</Badge>
                                )}
                              </div>

                              <Button className="w-full mt-4" variant={isCompleted ? "secondary" : "default"}>
                                {isCompleted ? "Review" : "Start Learning"}
                              </Button>

                              {hasRecommended && !isCompleted && (
                                <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 text-center">
                                  Recommended first: {recommendedPrereqs.length} earlier module{recommendedPrereqs.length === 1 ? "" : "s"}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </Link>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center text-slate-600 dark:text-slate-400">
          <p>Frontend, From First Principles &mdash; understand, then build</p>
          <p className="text-sm mt-2">Reference app: <code className="text-xs bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">examples/taproot-blog</code>. Built with Next.js, React, Sandpack, and Tailwind.</p>
        </div>
      </footer>
    </div>
  );
}
```

- [ ] **Step 4: Quality gate**

```bash
npm run lint && npx tsc --noEmit && npm run build
```
Expected: all green.

- [ ] **Step 5: Smoke-test in dev**

```bash
npm run dev
```
Open `http://localhost:3000`. Verify: 6 stage cards render (Stage 1–6), 15 module tiles total (3+3+2+3+3+1), each tile is clickable, the lesson page renders the placeholder for any module. Stop the server.

- [ ] **Step 6: Commit**

```bash
git add lib/curriculum.ts lib/modules/index.ts lib/modules/_placeholder.tsx lib/progress.ts app/page.tsx app/lesson/
git rm lib/modules/0-1-the-map.tsx lib/modules/1-1-how-the-internet-works.tsx lib/modules/1-2-http-and-https.tsx lib/modules/1-3-domain-dns-hosting.tsx lib/modules/1-4-browsers-and-rendering.tsx lib/modules/2-1-html-basics-and-semantics.tsx lib/modules/2-2-forms-and-validation.tsx lib/modules/2-3-accessibility.tsx lib/modules/2-4-seo-basics.tsx lib/modules/3-1-css-fundamentals.tsx lib/modules/3-2-flexbox-and-grid.tsx lib/modules/3-3-responsive-design.tsx lib/modules/3-4-writing-css-modern.tsx lib/modules/3-5-css-architecture-and-preprocessors.tsx lib/modules/4-1-javascript-fundamentals.tsx lib/modules/4-2-dom-and-events.tsx lib/modules/4-3-fetch-and-async.tsx lib/modules/5-1-git-and-github.tsx lib/modules/5-2-package-managers.tsx lib/modules/5-3-pick-a-framework.tsx lib/modules/5-4-typescript.tsx lib/modules/6-1-linters-and-formatters.tsx lib/modules/6-2-module-bundlers.tsx lib/modules/6-3-testing.tsx lib/modules/6-4-authentication.tsx lib/modules/6-5-web-security.tsx lib/modules/7-1-web-components.tsx lib/modules/7-2-ssr.tsx lib/modules/7-3-graphql.tsx lib/modules/7-4-static-site-generators.tsx lib/modules/7-5-pwas-and-browser-apis.tsx lib/modules/7-6-mobile-apps.tsx lib/modules/7-7-desktop-apps.tsx lib/modules/7-8-performance.tsx lib/modules/8-1-the-build-pipeline.tsx lib/modules/8-2-the-request-lifecycle.tsx lib/modules/8-3-the-architecture-of-a-real-app.tsx lib/modules/_template.tsx
git rm -r lib/modules/_demos

git commit -m "$(cat <<'EOF'
refactor(curriculum): scaffold first-principles structure with placeholders

Replaces the 30-module topic catalog with the 5-stage + 1-closing
first-principles structure (15 modules). Module content is a placeholder
in this commit; per-module authoring lands in Tasks 4-18. Old module
files and the deprecated _template/_demos are removed in this commit.

The progress store key is bumped to v2 so stale localStorage entries
from the old curriculum are ignored. Total progress is computed from
getAllModules().length, no longer hardcoded.

See docs/superpowers/specs/2026-05-10-first-principles-curriculum-design.md.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Update CLAUDE.md to reflect the new structure

**Files:**
- Modify: `CLAUDE.md`

CLAUDE.md is currently the source-of-truth for AI assistants working on the project. Several lines now contradict the spec.

- [ ] **Step 1: Read the current CLAUDE.md to find lines that need updating**

```bash
grep -n "30 modules\|7 phases\|Phase 0\|Phase 8\|every yellow node\|Phase\b" CLAUDE.md
```

- [ ] **Step 2: Apply these specific edits**

Replace:

```markdown
A **Frontend Learning App** following [roadmap.sh/frontend](https://roadmap.sh/frontend), fully re-authored to the Tier-A standard. Every one of the 30 modules is a comprehensive lesson with 7 mandatory pedagogical sections: Hook → Mental model → Step-by-step → Playground → Challenges → GotchaList → KeyTakeaways.

**Audience:** anyone learning frontend from zero. No prior frontend knowledge assumed.

**Curriculum:** 7 phases, 30 modules, covering every yellow node in the official roadmap PDF (read 2026-05-09).
```

with:

```markdown
A **Frontend Learning App** that teaches frontend from first principles. The curriculum is one continuous derivation: 5 stages of "the previous module's world hit a wall, here is what has to exist next" plus one closing module that uses the foundation to position every other roadmap topic. Every spine module is a comprehensive lesson with 7 mandatory pedagogical sections: Hook → Mental model → Step-by-step → Playground → Challenges → GotchaList → KeyTakeaways.

**Audience:** anyone learning frontend from zero. No prior frontend knowledge assumed.

**Curriculum:** 5 stages + 1 closing module, 15 modules total. The reference app `examples/taproot-blog` is the spine — every module ships working code on it (static → SPA → Next.js, climbed one rung at a time). Every roadmap.sh yellow node is named at least once; spine modules are taught in depth, non-spine topics are positioned in the closing module. Source-of-truth spec: `docs/superpowers/specs/2026-05-10-first-principles-curriculum-design.md`.
```

Replace:

```markdown
app/
  page.tsx                        # Dashboard: 7 phase cards, 30 module tiles (soft-prereq UI)
```

with:

```markdown
app/
  page.tsx                        # Dashboard: 6 stage cards (Stage 1-5 + Closing), 15 module tiles (soft-prereq UI)
```

Replace:

```markdown
  curriculum.ts                   # All 30 modules' metadata + helpers (single source of truth)
                                  # isModuleUnlocked() always returns true (soft prereqs)
```

with:

```markdown
  curriculum.ts                   # All 15 modules' metadata + helpers (single source of truth, organized by Stage)
                                  # isModuleUnlocked() always returns true (soft prereqs)
                                  # Each module has drivingFailure and shipsInReferenceApp fields
```

Replace:

```markdown
  modules/
    _template.tsx                 # ScaffoldModule helper — deprecated for new authoring; kept for reference
    _demos/                       # Primitive smoke-test pages (not registered, manual verification only)
    index.ts                      # Module-id → component registry
    <module-id>.tsx               # One file per module (e.g. 1-1-how-the-internet-works.tsx)
```

with:

```markdown
  modules/
    _placeholder.tsx              # Used only during multi-task module authoring; do not register in production
    index.ts                      # Module-id → component registry
    <module-id>.tsx               # One file per module (e.g. 1-1-the-smallest-useful-thing.tsx)
```

Replace:

```markdown
**Orientation modules (Phase 0) are an exception.** They follow a 5-section shape — Hook, Mental model, Map (a diagram), Curriculum preview, KeyTakeaways — and omit the playground and challenges, because the learner has not yet been introduced to the vocabulary the playground would exercise. This exception applies to Phase 0 only. All other modules — including Phase 8 capstone modules — follow the standard 7-section Tier-A template.
```

with:

```markdown
**The closing module (`6-1-the-field-from-here`) is an exception.** It does not introduce a new derivation; instead it uses the foundation the learner already has to position every roadmap.sh topic the spine did not cover. It has a Hook (an explicit framing of why this module is different), a "field map" diagram in place of a Step-by-step, and a Challenges section that asks the learner to position a tool against the foundation — but it does not have a Playground or a Driving Failure, because nothing is being derived. This exception applies to module 6-1 only. All other modules follow the standard 7-section Tier-A template.
```

Replace:

```markdown
## Module content ID convention

`{phase}-{order}-{slug}` — e.g. `1-1-how-the-internet-works`, `5-3-pick-a-framework`, `7-8-performance`.

The corresponding component export is `Module_<phase>_<order>_Content` — e.g. `Module_5_3_Content`.
```

with:

```markdown
## Module content ID convention

`{stage}-{order}-{slug}` — e.g. `1-1-the-smallest-useful-thing`, `5-3-identity-and-trust`, `6-1-the-field-from-here`.

The corresponding component export is `Module_<stage>_<order>_Content` — e.g. `Module_5_3_Content`.
```

Replace:

```markdown
## Source of truth for the curriculum

The roadmap PDF was read on 2026-05-09 at `https://roadmap.sh/pdfs/roadmaps/frontend.pdf`. The `§1` coverage table in `docs/superpowers/plans/2026-05-09-tier-a-curriculum-plan.md` (and the original `2026-05-09-frontend-roadmap-learning-app.md`) maps every yellow node to a module ID.
```

with:

```markdown
## Source of truth for the curriculum

The first-principles spec is `docs/superpowers/specs/2026-05-10-first-principles-curriculum-design.md`. §3 defines the spine module-by-module; §7 maps every roadmap.sh yellow node to a spine module (taught in depth) or to module 6-1 (positioned). The roadmap PDF was last read on 2026-05-09 at `https://roadmap.sh/pdfs/roadmaps/frontend.pdf`.
```

- [ ] **Step 3: Quality gate**

```bash
npm run lint && npx tsc --noEmit && npm run build
```
(CLAUDE.md edits don't affect lint/typecheck/build, but run anyway as habit.)

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md
git commit -m "$(cat <<'EOF'
docs: update CLAUDE.md for first-principles curriculum

Reflects the 5-stage + 1-closing structure, the 15-module count, the
new id convention, the closing-module exception (replaces the old
Phase-0 exception), the new source-of-truth spec, and the removal of
_template / _demos.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Tasks 5-19: Author each spine module (one task per module)

The 15 module-authoring tasks share an identical shape. To avoid 1500 lines of repetition, the shape is documented once in **Task 5** below in full, and **Tasks 6-19** reference it with a per-module brief.

Each module-authoring task replaces one entry in `lib/modules/index.ts` (so the placeholder is replaced by the real component) and creates one `lib/modules/<id>.tsx` file. Each task's quality gate is the same: lint, typecheck, build, smoke-test the lesson page in the browser. Each task is one commit.

---

## Task 5: Author module 1-1-the-smallest-useful-thing

**Files:**
- Create: `lib/modules/1-1-the-smallest-useful-thing.tsx`
- Modify: `lib/modules/index.ts` (one entry: replace placeholder with real component)

**Module brief (from spec §3):**
- Title: The Smallest Useful Thing on the Web
- Driving failure: A `.txt` blog post opens fine on your laptop. Open it on a phone — fonts collapse, links don't work, no headings.
- Derives: Why HTML had to exist. Tags as structure. The browser as a document renderer.
- Ships in reference app: `examples/taproot-blog/static/index.html` — the homepage skeleton, plain HTML, no styling, working `<a href>` links.
- Roadmap nodes covered: "How the internet works (introduction)", "What is HTML"
- Learning outcomes (Bloom verbs): *recognize* what a browser is and is not; *write* a working HTML document by hand; *explain* why structure has to travel with the words.

**Author the module to the Tier-A 7-section template, with these refinements (from spec §4):**
- Hook is the *driving failure* above, not "today we'll learn HTML." Open with the failure as a concrete observation; end the Hook with the question the rest of the module answers.
- Step-by-step has 5–7 steps, each a derivation step ("given the previous step's world, what minimally has to be added for the failure to stop being a failure?"). Step 1 is "the .txt file"; final step is the working `index.html` of `examples/taproot-blog/static/`.
- Mental model is one sentence — "A browser is a document renderer; HTML is the document format it understands." — verbatim mirrored in `KeyTakeaways.mentalModel`.
- Playground is `HTMLPlayground` containing a `// Try this:` first-line comment in any JS, here irrelevant since this is HTML — instead use a comment at the top of the HTML: `<!-- Try this: change <h1> to <h2> and watch the document outline shift -->`.
- Challenges: 2 challenges. (a) Given a `.txt` file, identify three things HTML adds. (b) Given a malformed HTML doc, find the missing closing tag.
- GotchaList: exactly 4 entries. Examples: "self-closing tags are not optional", "the browser will silently fix some malformed HTML, hiding bugs", "<title> is not a heading; it's the tab label", "URLs without https:// are protocol-relative".
- KeyTakeaways: 4-6 bullets, plus the verbatim mental-model pull-quote.
- Optional sections allowed: a CodeComparison showing the same content as `.txt` vs HTML (justifies the existence of HTML viscerally).

**Required structural conventions (from CLAUDE.md):**
- First line inside the component function: `// Data blocks hoisted out of JSX for readability — listed in render order.`
- Step arrays have descriptive names (e.g., `txtToHtmlSteps`).
- No `<h2>`/`<h3>` inside Hook or Mental Model `<Card>`s; prose only.
- No emojis anywhere.
- Catalog terms (per `docs/superpowers/specs/2026-05-09-concept-catalog.md`) italicized via `<em>` on first use in this module.
- All copy in English (the `lint:lang` script will fail otherwise).
- Escape `'`, `<`, `>`, `"` in JSX text where needed.
- Use double quotes in JSX attributes; plain `'` in JS object literals.

**Reference component for shape** (do not duplicate content): the existing module patterns in `lib/modules/` before this rewrite are gone, but the Tier-A spec lives in `docs/superpowers/specs/2026-05-09-tier-a-curriculum-design.md` §2.1 and §4. Read it.

- [ ] **Step 1: Author `lib/modules/1-1-the-smallest-useful-thing.tsx`**

Write the full module file following the brief above. The file exports a component named `Module_1_1_Content`. Keep the file ~400-650 lines, in line with the prior module size baseline. Use `HTMLPlayground` from `@/components/CodePlayground`, `StepByStepExplanation` and `Step` from `@/components/StepByStepExplanation`, `Challenge` from `@/components/Challenge`, `GotchaList` from `@/components/GotchaList`, `KeyTakeaways` from `@/components/KeyTakeaways`, `RoadmapLink` from `@/components/RoadmapLink`, and `Card` / `CardContent` from `@/components/ui/card`.

- [ ] **Step 2: Update the registry entry**

In `lib/modules/index.ts`, replace:

```typescript
import { PlaceholderModuleContent } from "./_placeholder";
```

(keep this import — other modules still use it) and add:

```typescript
import { Module_1_1_Content } from "./1-1-the-smallest-useful-thing";
```

Replace the `MODULE_CONTENTS` entry:

```typescript
  "1-1-the-smallest-useful-thing": PlaceholderModuleContent,
```

with:

```typescript
  "1-1-the-smallest-useful-thing": Module_1_1_Content,
```

- [ ] **Step 3: Quality gate**

```bash
npm run lint && npx tsc --noEmit && npm run build
```
Expected: all green.

- [ ] **Step 4: Smoke-test the lesson in the browser**

```bash
npm run dev
```
Open `http://localhost:3000/lesson/1-1-the-smallest-useful-thing`. Verify all 7 sections render, the `HTMLPlayground` is interactive, both challenges are answerable, the mental-model pull-quote matches the KeyTakeaways. Stop the server.

- [ ] **Step 5: Commit**

```bash
git add lib/modules/1-1-the-smallest-useful-thing.tsx lib/modules/index.ts
git commit -m "$(cat <<'EOF'
feat(modules): author 1-1-the-smallest-useful-thing

Stage I module 1. Driving failure: a .txt blog post opens on your
laptop but breaks on a phone. Derives why HTML had to exist; ships
the index.html of examples/taproot-blog/static.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Author module 1-2-meaning-before-appearance

Same shape as Task 5. Brief:

- Title: Meaning Before Appearance
- Driving failure: A screen reader reads your homepage as "link, link, link, text, text, text" — no sense of what is navigation, article, or aside.
- Derives: Semantic HTML (`<article>`, `<nav>`, `<main>`, `<aside>`), the document outline, why ARIA is rarely the answer, accessibility as a side-effect of meaning, SEO as a side-effect of structure.
- Ships in reference app: `examples/taproot-blog/static/posts/*.html` — every post a real `<article>` with heading hierarchy a screen reader can follow; an accessible comment form (`<label for>`, `aria-describedby` for errors).
- Roadmap nodes covered: "Semantic HTML", "Accessibility", "SEO basics", "Forms and validation".
- Learning outcomes: *pick* the right semantic element; *build* a document outline a screen reader can follow; *wire* a form's labels and inputs accessibly.
- Mental model: "HTML is a meaning tree, not a layout tree."
- Optional sections allowed: a `CodeComparison` of div-soup vs semantic HTML; an accessibility-tree screenshot or live demo.

Tasks 6 follows the same 5 steps as Task 5: author file, register, quality-gate, smoke-test, commit. Commit message references Stage I module 2.

---

## Task 7: Author module 1-3-the-same-document-two-lives

Brief:

- Title: The Same Document, Two Lives
- Driving failure: Inline styles work for one paragraph. Apply them to twenty posts and your HTML doubles in size; the same CSS is repeated everywhere; changing the brand color means 200 edits.
- Derives: Why CSS had to be separate. The cascade as the mechanism that makes "I'll override one rule" possible without coordination. Selectors and specificity. The box model. Layout (Flexbox, Grid). Responsive design (mobile-first, container-aware).
- Ships in reference app: `examples/taproot-blog/static/assets/site.css` — the full styled blog, mobile-first, two-column on desktop, single-column on mobile.
- Roadmap nodes covered: "CSS basics", "Flexbox", "Grid", "Responsive design", "CSS cascade and specificity", "Box model".
- Learning outcomes: *compute* specificity by hand; *reason* about content-box vs border-box; *build* a responsive two-column layout with Flexbox and Grid.
- Mental model: "Cascade = origin + specificity + source order."
- Optional sections allowed: `LiveCascadeDemo`, `FlexboxControls`, `GridControls`. This module benefits especially from the live demos because the cascade and box-model mental models are felt, not memorized.

Same 5 steps; commit references Stage I module 3.

---

## Task 8: Author module 2-1-when-the-page-has-to-react

Brief:

- Title: When the Page Has to React
- Driving failure: A "show comments" button needs to toggle a section. HTML provides no syntax for that. CSS `:checked` hacks fail the moment a third state appears.
- Derives: Why JavaScript had to be in the browser. What the DOM actually is — a tree the browser exposes for manipulation. Events, listeners, and event delegation. Mutation as the engine of interactivity. Variables, types, scope, closures, `this` binding, modern syntax.
- Ships in reference app: `examples/taproot-blog/static/` + a `<script>` block that toggles a comments section. Vanilla JS, no framework. **Include a deliberate state-vs-DOM divergence bug** that becomes the seed of module 4-1's driving failure (e.g., a counter that goes out of sync with the rendered count after a quick double-click).
- Roadmap nodes covered: "JavaScript fundamentals (variables, types, control flow)", "DOM and events", "the event loop (introduction)".
- Learning outcomes: *distinguish* primitives, references, and how scope binds them; *query* and *mutate* the DOM efficiently; *use* event delegation for dynamic content.
- Mental model: "The DOM is a live tree the browser exposes for mutation."

Same 5 steps; commit references Stage II module 1.

---

## Task 9: Author module 2-2-things-take-time

Brief:

- Title: Things Take Time
- Driving failure: Synchronous code freezes the page while comments load. Users click again, again, again — nothing happens until the call returns.
- Derives: Why async exists. Promises as a value-not-here-yet. `async`/`await` as sugar. The event loop with macrotasks and microtasks. `setTimeout`, `Promise.resolve`, `fetch` as three disguises of one problem. Error handling in async chains.
- Ships in reference app: `examples/taproot-blog/static/` — comments section now loads asynchronously from a hardcoded JSON file (e.g., `comments.json` shipped alongside the static HTML), with a loading state.
- Roadmap nodes covered: "JavaScript async (callbacks, promises, async/await)", "the event loop (deep dive)".
- Learning outcomes: *convert* callbacks into Promises and Promises into async/await; *sketch* the event loop with macrotasks and microtasks; *handle* errors in async chains.
- Mental model: "A Promise is a value that's not here yet."
- Optional sections allowed: `EventLoopVisualizer` (this module is its primary use site).

Same 5 steps; commit references Stage II module 2.

---

## Task 10: Author module 2-3-talking-to-another-machine

Brief:

- Title: Talking to Another Machine
- Driving failure: `fetch('https://other-origin/comments')` returns nothing useful. The console says "CORS blocked." Why? What header would unblock it?
- Derives: HTTP as a stateless conversation. Methods, status codes, headers. `fetch`, `Request`, `Response`. CORS, derived from "why is this request being blocked?", not from a list of headers. `AbortController` for cancellation. Errors in async chains specifically about network failures.
- Ships in reference app: `examples/taproot-blog/static/` — comments section now `fetch`es from a real-shaped (mock-served) endpoint. CORS is fixed by the learner adding the right `Access-Control-Allow-Origin` header.
- Roadmap nodes covered: "HTTP and HTTPS", "Fetch API", "CORS", "REST API basics".
- Learning outcomes: *read* an HTTP request/response by hand; *pick* the right method and status code; *diagnose* and *fix* a CORS-blocked request.
- Mental model: "HTTP is a stateless conversation."

Same 5 steps; commit references Stage II module 3.

---

## Task 11: Author module 3-1-the-journey-of-a-url

Brief:

- Title: The Journey of a URL
- Driving failure: Your blog opens on your laptop because your laptop has the file. A friend in Brazil types your domain — what has to be true for them to see what you see?
- Derives: DNS, TCP, TLS, HTTP, the browser parser, the rendering pipeline (parse → DOM → CSSOM → render → layout → paint → composite). All derived from one trace.
- Ships in reference app: nothing — this is the one explanatory module on the spine. The Step-by-step is the trace; `SequenceDiagram` and `LayeredFlow` and `InteractiveDiagram` carry the load.
- Roadmap nodes covered: "How the internet works (deep dive)", "DNS, hosting, domains", "Browsers and rendering pipeline", "TLS / HTTPS".
- Learning outcomes: *trace* what happens between typing a URL and seeing pixels; *distinguish* DNS, IP, TCP, TLS, and HTTP layers; *walk through* the critical rendering path.
- Mental model: "The internet is a layered postal system."
- Note: explicitly call out in the Hook that this module *does not* ship reference-app code — it is the one explanatory module on the spine, justified by "this is the foundation that the rest of the curriculum has been quietly leaning on."

Same 5 steps; commit references Stage III module 1.

---

## Task 12: Author module 3-2-ship-it-and-version-it

Brief:

- Title: Ship It and Version It
- Driving failure: You accidentally rewrote `assets/site.css`. There's no Ctrl+Z that survives lunch. Your friend asks for the URL — your laptop is the only place it exists.
- Derives: Git as snapshots-not-diffs. Branches as movable pointers. GitHub as a remote. Hosting (static host, Netlify/Vercel-style). The deploy pipeline. Why "it works on my machine" is a real failure mode and what the floor of being a frontend dev is.
- Ships in reference app: `examples/taproot-blog/static/` committed to a real Git history and deployed to a real public URL.
- Roadmap nodes covered: "Git and GitHub", "Hosting and CDNs", "Continuous deployment basics".
- Learning outcomes: *work* in feature branches and *resolve* a merge conflict without panic; *deploy* a static site; *read* `git log` like a story.
- Mental model: "Git tracks snapshots, not diffs."
- Optional sections allowed: `TerminalPlayground` (this module is its primary use site).

Same 5 steps; commit references Stage III module 2.

---

## Task 13: Author module 4-1-the-dom-is-a-footgun-at-scale

Brief:

- Title: The DOM Is a Footgun at Scale
- Driving failure: Adding "edit your own comment" to the vanilla blog means: find the right node, replace its contents, swap classes, restore on cancel. State lives in three places. Bugs follow. (Connect explicitly to the bug seeded in module 2-1.)
- Derives: Why React (and reactivity in general) had to be invented. Components as functions of state. JSX as a description, not a template. Hooks (`useState`, `useEffect`) as the surface of reactivity. The virtual DOM as the engine that lets you describe the result instead of the steps. Vite as the build tool. npm and `package.json` as the way you bring in code you didn't write. ESLint and Prettier.
- Ships in reference app: `examples/taproot-blog/spa/` — the same blog, rebuilt as a Vite + React SPA. Same visual design. Comments and editing now work without the bugs from module 2-1. MSW mocks the API.
- Roadmap nodes covered: "Modern JavaScript (ES modules, build tools)", "React fundamentals (components, JSX, hooks, state)", "Vite", "Package managers (npm)", "Linters and formatters (ESLint + Prettier)".
- Learning outcomes: *recognize* the state-vs-DOM divergence bug class; *write* a React component with hooks; *set up* a Vite + React project and *read* its build output.
- Mental model: "A component is a function of state."
- Optional sections allowed: `ReactPlayground`, code comparison of vanilla-DOM vs React for the same feature.

Same 5 steps; commit references Stage IV module 1.

---

## Task 14: Author module 4-2-types-and-the-editor-that-knows-them

Brief:

- Title: Types and the Editor That Knows Them
- Driving failure: A user reports "undefined is not a function." The bug: a `Comment` had no `.author` because the API returned `null`. JS happily passed it through three layers before exploding.
- Derives: Why TypeScript stopped being optional. Structural typing. Narrowing. Generics. The `tsc --noEmit` discipline.
- Ships in reference app: `examples/taproot-blog/spa/src/**` — full TypeScript: real types for `Author`, `Post`, `Comment`; a `tsc` error the learner reads and fixes.
- Roadmap nodes covered: "TypeScript".
- Learning outcomes: *add* types to a JS file incrementally; *use* unions, generics, and narrowing; *read* and *fix* a `tsc` error.
- Mental model: "TypeScript is a type-checker, not a runtime."

Same 5 steps; commit references Stage IV module 2.

---

## Task 15: Author module 4-3-css-at-scale-collides

Brief:

- Title: CSS at Scale Collides
- Driving failure: `<CommentForm>` and `<PostForm>` both style `.button`. CommentForm's button is now blue everywhere — including in PostForm, where it should be gray.
- Derives: Why utility-first (Tailwind) and scoping (CSS Modules, scoped styles) exist. Why "just write CSS" stops scaling. CSS architecture (BEM positioned as the answer of the previous era; Tailwind as the answer of this one).
- Ships in reference app: `examples/taproot-blog/spa/` is restyled with Tailwind. Same UI, no global stylesheets, no specificity wars.
- Roadmap nodes covered: "Tailwind CSS", "CSS architecture and methodology", "CSS preprocessors (positioned)".
- Learning outcomes: *diagnose* a specificity collision; *restyle* a real component with Tailwind utilities; *recognize* when not to add a styling library.
- Mental model: "Atomic CSS scales utility; semantic CSS scales meaning."

Same 5 steps; commit references Stage IV module 3.

---

## Task 16: Author module 5-1-routes-layouts-and-where-should-this-render

Brief:

- Title: Routes, Layouts, and Where Should This Render
- Driving failure: Search "taproot-blog" on Google — your blog isn't there. View source on the SPA — the body is empty until JS runs. The first paint is a blank screen on slow phones.
- Derives: Why server-side rendering (SSR), static site generation (SSG), and React Server Components (RSC) exist. The client/server boundary as a deliberate decision. Routing, layouts, nested routes. Hydration. Next.js as the most popular concrete answer (per saved user preference: pick most popular, teach deeply).
- Ships in reference app: `examples/taproot-blog/app/` — Next.js App Router; HTML arrives ready-painted; OG tags work; Google can index posts.
- Roadmap nodes covered: "SSR, SSG, ISR, RSC", "Next.js (taught deeply)", "Module bundlers (positioned)".
- Learning outcomes: *pick* CSR/SSR/SSG/ISR/RSC for a route on purpose; *reason* about hydration cost; *set up* Next.js App Router with nested layouts.
- Mental model: "Rendering location is a slider, not a switch."

Same 5 steps; commit references Stage V module 1.

---

## Task 17: Author module 5-2-data-state-and-who-owns-the-truth

Brief:

- Title: Data, State, and Who Owns the Truth
- Driving failure: User filters by tag → URL changes → server returns filtered posts → client cache thinks the old set is still valid → user sees the wrong list. Three sources of truth, all confident.
- Derives: State has flavors. URL state, server state, client state. Mismatching the flavor is the single hardest bug class in modern frontend. Server actions and data fetching in RSC. TanStack Query for client-side server state. Database (Prisma) and the persistence boundary. Forms as state transitions.
- Ships in reference app: `examples/taproot-blog/app/` — comments persist to Postgres via Prisma; URL state controls filters; server actions handle submissions; cache invalidates correctly.
- Roadmap nodes covered: "State management", "Data fetching", "Server actions", "Forms and validation (deep dive)", "Database basics (positioned for frontend devs)".
- Learning outcomes: *distinguish* URL state, server state, and client state; *use* server actions and cache invalidation; *pick* a data-fetching strategy.
- Mental model: "State has three flavors; matching the flavor to the data shape avoids 90% of state-management pain."

Same 5 steps; commit references Stage V module 2.

---

## Task 18: Author module 5-3-identity-and-trust

Brief:

- Title: Identity and Trust
- Driving failure: You add a "Delete" button visible only to authors. A curious user opens DevTools, removes the hidden class, clicks delete. The post is gone. The frontend was the security boundary. It shouldn't have been.
- Derives: Authentication vs. authorization. Sessions vs. tokens. NextAuth as the most popular concrete answer. The frontend as not a security boundary — every check has to also exist on the server. Security headers (CSP, same-site cookies, CORS), XSS, CSRF — derived from "what can an attacker do, and what stops them?"
- Ships in reference app: `examples/taproot-blog/app/` — full auth via NextAuth, role-based UI, server-side authorization checks, secure session cookies. Deployed.
- Roadmap nodes covered: "Authentication", "Authorization", "Web security (XSS, CSRF, CSP, OWASP frontend top hits)".
- Learning outcomes: *distinguish* authentication from authorization; *set up* session-based auth with NextAuth; *identify* and *fix* a CSRF and an XSS vulnerability.
- Mental model: "The frontend is not the security boundary."

Same 5 steps; commit references Stage V module 3.

---

## Task 19: Author module 6-1-the-field-from-here

This is the **closing module** and follows a **modified Tier-A template** (per spec §4):

- It has a **Hook** that explicitly frames why this module is different ("you have a foundation now; let's use it to position the rest of the field").
- It has a **Mental model**: "Every tool is an answer to a problem; understand the problem first."
- It has a **Step-by-step replaced by a "field map"** — an `InteractiveDiagram` (ReactFlow) where each non-spine topic is a node attached to the spine module it relates to. Clicking a node expands a paragraph with three subsections: *what problem this solves* / *what it changes about [the relevant spine module]* / *what it costs / when you'd reach for it*.
- It has a **Challenges** section: 3 challenges that ask the learner to position a tool the curriculum did not name (e.g., "Bun") against the foundation. Each challenge is open-text + a model answer reveal.
- It does **not** have a Playground (nothing to interact with mechanically).
- It does **not** have a Driving Failure (nothing is being derived).
- It does have a **GotchaList** — 4 entries about the *meta* skill of evaluating new tools (e.g., "popularity is not fitness", "bundle size is one cost; build complexity is another", "every abstraction has a leak", "the team beats the framework").
- It has **KeyTakeaways**: 4-6 bullets, plus the verbatim mental-model pull-quote.

**Topics positioned (one node each in the field map, per spec §3 closing module):** GraphQL (against module 2-3), Web Components (against module 4-1), PWAs and service workers (against module 3-1), React Native and Flutter and Ionic (against module 4-1), Electron and Tauri (against modules 3-1 and 4-1), alternative bundlers Webpack/esbuild/Rollup (against module 4-1), alternative frameworks Vue/Svelte/Solid (against module 4-1), the testing pyramid Vitest/Jest/Playwright (against modules 4-1 and 5-3), performance PRPL/RAIL/Lighthouse/Core Web Vitals (against modules 3-1 and 5-1), accessibility audits (against module 1-2), CSS preprocessors and other styling approaches (against module 4-3).

- [ ] **Step 1: Author `lib/modules/6-1-the-field-from-here.tsx`**

Write the closing-module component. Use `InteractiveDiagram` for the field map. The diagram nodes are positioned topics; the edges connect each to its spine-module anchor. Each node, when clicked, opens a side panel with the three-subsection paragraph above. Include the modified-template sections in this order: Hook, Mental model, **Field map** (replaces Step-by-step), Challenges, GotchaList, KeyTakeaways. Mark the field map with the comment `{/* Required for closing module: replaces Step-by-step */}`.

- [ ] **Step 2: Update the registry entry**

In `lib/modules/index.ts`, replace the `"6-1-the-field-from-here": PlaceholderModuleContent,` entry with the real component, and add the import.

- [ ] **Step 3: Quality gate** (lint + typecheck + build).

- [ ] **Step 4: Smoke-test in browser** at `http://localhost:3000/lesson/6-1-the-field-from-here`. Click each node in the field map; verify each opens its panel and the model answers are sensible.

- [ ] **Step 5: Commit.**

```bash
git add lib/modules/6-1-the-field-from-here.tsx lib/modules/index.ts
git commit -m "$(cat <<'EOF'
feat(modules): author 6-1-the-field-from-here

Closing module. Uses the foundation built across stages 1-5 to position
every roadmap.sh topic the spine did not cover. Modified Tier-A template:
field-map InteractiveDiagram replaces Step-by-step; no Playground; no
driving failure; everything else (Hook, Mental model, Challenges,
Gotchas, KeyTakeaways) is present.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 20: Remove the placeholder module

**Files:**
- Delete: `lib/modules/_placeholder.tsx`
- Modify: `lib/modules/index.ts` (remove the placeholder import — no entries should reference it after Tasks 5-19)

After Tasks 5-19 land, every `MODULE_CONTENTS` entry points at a real module. The placeholder is dead code.

- [ ] **Step 1: Verify no entry in `MODULE_CONTENTS` still uses `PlaceholderModuleContent`**

Run: `grep -n "PlaceholderModuleContent" lib/modules/index.ts`
Expected: only the import line and zero entries; if any entry still uses it, an authoring task was missed — go author it before continuing.

- [ ] **Step 2: Remove the import and delete the file**

In `lib/modules/index.ts`, delete the line:

```typescript
import { PlaceholderModuleContent } from "./_placeholder";
```

Then:

```bash
rm lib/modules/_placeholder.tsx
```

- [ ] **Step 3: Quality gate**

```bash
npm run lint && npx tsc --noEmit && npm run build
```

- [ ] **Step 4: Commit**

```bash
git add lib/modules/index.ts
git rm lib/modules/_placeholder.tsx
git commit -m "$(cat <<'EOF'
chore(modules): remove placeholder now that all modules are authored

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 21: Write the new learning-outcomes spec

**Files:**
- Create: `docs/superpowers/specs/2026-05-10-first-principles-learning-outcomes.md`
- Delete: `docs/superpowers/specs/2026-05-09-learning-outcomes.md`

Per design spec §9.8, the old learning-outcomes spec is superseded.

- [ ] **Step 1: Create the new outcomes file**

Write `docs/superpowers/specs/2026-05-10-first-principles-learning-outcomes.md` with one section per module (1-1 through 6-1, in spine order). Each section is the module's id, title, driving failure (verbatim from `lib/curriculum.ts`), and a Bloom-verb outcome list (already drafted in the briefs of Tasks 5-19; collect them here). The acceptance contract is identical to the old learning-outcomes spec: a module is "done" when every Bloom-verb outcome is exercised somewhere (challenge, playground exercise, or exposition).

- [ ] **Step 2: Delete the old file**

```bash
rm docs/superpowers/specs/2026-05-09-learning-outcomes.md
```

- [ ] **Step 3: Quality gate**

```bash
npm run lint && npx tsc --noEmit && npm run build
```
(The outcomes spec is markdown, so this is a habit-keeping run.)

- [ ] **Step 4: Commit**

```bash
git add docs/superpowers/specs/2026-05-10-first-principles-learning-outcomes.md
git rm docs/superpowers/specs/2026-05-09-learning-outcomes.md
git commit -m "$(cat <<'EOF'
docs(outcomes): replace learning-outcomes spec for first-principles curriculum

Each spine module's outcomes restated in Bloom-verb form against the
new module set. The 'done = every outcome exercised somewhere' contract
is unchanged.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 22: Final smoke-test and acceptance check

**Files:** none modified — this task validates §10 of the spec.

- [ ] **Step 1: Quality gate**

```bash
npm run lint && npx tsc --noEmit && npm run build
```

All three must be green.

- [ ] **Step 2: Run the dev server and check every lesson loads**

```bash
npm run dev
```

Open `http://localhost:3000`. Verify the dashboard shows 6 stage cards with 15 module tiles total (3+3+2+3+3+1). Click into each of the 15 modules; verify each renders without console errors. Specifically confirm:

- Every spine module's Hook renders the driving failure (not a topical introduction).
- Every spine module's Mental Model is one sentence; verify it appears verbatim in the KeyTakeaways pull-quote.
- The closing module 6-1 renders the field-map diagram and each node opens its panel.

Stop the dev server.

- [ ] **Step 3: Verify the language guard runs over the new files**

```bash
npm run lint:lang
```
Expected: zero output (success).

- [ ] **Step 4: Verify the reference app still runs (the curriculum's central claim)**

```bash
cd examples/taproot-blog/static && python3 -m http.server 8000 &
sleep 2
curl -sf http://localhost:8000/index.html > /dev/null && echo "static OK" || echo "static FAIL"
kill %1 2>/dev/null
cd ../../..
```

If the spec's acceptance criterion §10 ("the spine *is* the reference app's evolution; that claim has to be true at runtime") is to mean anything, the static rung must serve. The SPA and Next.js rungs each have their own CI in `.github/workflows/examples-blog.yml` — trust that or run them locally if curious.

- [ ] **Step 5: Acceptance checklist (do not commit; just confirm)**

Tick each line as verified:

- [ ] 15 modules render in the lesson viewer.
- [ ] 14 spine modules follow the Tier-A 7-section template; module 6-1 follows the closing-module exception.
- [ ] Every spine module's Hook is a concrete failure, not a topical introduction.
- [ ] Every spine module's Mental Model is verbatim mirrored in KeyTakeaways.
- [ ] Dashboard shows 5 stages + 1 closing card.
- [ ] `npm run lint`, `npx tsc --noEmit`, `npm run build` all green.
- [ ] Every roadmap.sh yellow node is named in the design spec's coverage map (§7) and addressed by the corresponding module(s).

- [ ] **Step 6: Final commit (if any cleanup was needed during smoke-test)**

If steps 2-5 surfaced any minor issues, fix them and create a final commit:

```bash
git add <fixed files>
git commit -m "$(cat <<'EOF'
fix(modules): smoke-test cleanup

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

If nothing needed cleanup, skip this step.

---

## Self-review (run after writing this plan, before handing off)

**1. Spec coverage:** Each section of `docs/superpowers/specs/2026-05-10-first-principles-curriculum-design.md`:
- §1 (why) → no implementation; documented in commit messages.
- §2.1 (preserved) → Tasks 5-19 keep Tier-A 7-section template; Task 4 keeps the structural conventions in CLAUDE.md.
- §2.2 (changed) → Task 1 (curriculum metadata), Task 3 (dashboard, progress), Task 4 (CLAUDE.md), Tasks 5-19 (per-module reauthoring).
- §2.3 (out of scope) → no tasks; reference app and component library untouched.
- §3 (the spine) → Tasks 5-19 author each module from this section.
- §4 (template refinements) → enforced in Tasks 5-19's briefs (driving-failure Hook, derivation Step-by-step).
- §5 (id convention) → Task 1 (new ids); Task 2 (registry).
- §6 (dashboard, progress) → Task 3.
- §7 (coverage map) → Tasks 5-19 each cite their roadmap.sh nodes; Task 19 (closing module) covers the rest.
- §8 (risks) → addressed in execution: Task 3 bumps progress key (handles "existing progress invalidated"); Task 4 updates CLAUDE.md (handles "commitment changes"); Task 22 verifies reference app (handles "reference app load-bearing"); the dashboard's "estimated total minutes" UI is not adopted in this plan — left as future work since spec §8 lists it as a mitigation, not a hard requirement.
- §9 (implementation strategy) → Tasks 1-22 follow the order given.
- §10 (acceptance) → Task 22 verifies.

Gap: spec §8 also mentions "the dashboard can show estimated total minutes prominently" as a mitigation for the "module count drops from 30 to 15" risk. This plan does not implement that. Decision: leave it out — it is not a hard requirement, and the existing per-module duration badges are sufficient. If the user wants the totals added, file as follow-up.

**2. Placeholder scan:** No "TBD" / "TODO" / "implement later" / "fill in details" appear. Tasks 6-19 are abbreviated by referencing Task 5's shape, but each carries a complete module brief — title, driving failure, derives, ships, roadmap nodes, outcomes, mental model. Each is enough for the engineer to author the module, which is the unit of work.

**3. Type consistency:**
- `Stage`, `Module`, `getStageProgress`, `getModulesByStage` are defined in Task 1 and used consistently in Task 3 and the file structure.
- `MODULE_CONTENTS` is defined in Task 2 and updated entry-by-entry in Tasks 5-19.
- `Module_<stage>_<order>_Content` naming is consistent with existing convention (preserved from CLAUDE.md `## Module content ID convention`).
- `drivingFailure` and `shipsInReferenceApp` fields are added to the `Module` interface in Task 1 and populated in every entry.

All consistent.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-10-first-principles-curriculum.md`. Two execution options:

**1. Subagent-Driven (recommended)** — Dispatch a fresh subagent per task, review between tasks, fast iteration. Best fit for this plan because Tasks 5-19 are 15 large independent module-authoring tasks; subagents can author them in parallel (the plan is structured so each module-authoring task is independent of the others once Tasks 1-4 land).

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints. Better if you want tight oversight on each module, but slower because module-authoring tasks share no state and don't benefit from a single warm context.

Which approach?
