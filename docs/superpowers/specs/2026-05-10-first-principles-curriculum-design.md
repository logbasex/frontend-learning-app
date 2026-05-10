# First-Principles Curriculum Design

**Date:** 2026-05-10
**Status:** Proposed
**Supersedes (in part):** `2026-05-09-tier-a-curriculum-design.md` (sequencing and module count); `2026-05-09-frontend-roadmap-learning-app-design.md` (coverage strategy).
**Preserves:** `2026-05-09-tier-a-curriculum-design.md` §2.1 + §4 (the Tier-A 7-section template and structural conventions); `2026-05-09-concept-catalog.md` (canonical definitions).

## 1. Why this exists

The current curriculum is a **catalog** — 30 modules organized by topic (Internet, HTML, CSS, JavaScript, Workflow, Build, Beyond the Browser, Capstone), one module per yellow node on roadmap.sh. Each module is well-written, but the *between-module* logic is "this is the next topic on the roadmap," not "this exists because the previous module created a problem it cannot solve."

A learner finishing the catalog ends up tool-fluent but not foundation-fluent: they have practiced HTTP, the DOM, React, Next.js — but the *causal chain* connecting them is implicit. They can recognize tools; they cannot, on first encounter, place a new tool in a structure of "what problem does this solve, and how does that problem arise from the foundation?"

The user's stated goal: a curriculum where the learner finishes able to **build a real modern frontend app from scratch**, with **deep understanding** of how every piece works, **correct mindset** about when and why each piece exists, and the ability to recognize that **everything connects**. Step by step. First principles.

Achieving that goal requires reorganizing the curriculum around **a single derivation chain**, not a topic taxonomy. Each module exists because the previous module's world hit a wall. The reference app (`examples/taproot-blog`, with its static → SPA → Next.js gradient) is the spine: every module ships working code on it.

## 2. What changes (and what does not)

### 2.1. Preserved

- **The Tier-A 7-section module template.** Hook → Mental model → Step-by-step → Playground → Challenges → GotchaList → KeyTakeaways. This template is pedagogically sound; the issue is not the inside of a module, it is the count and ordering of modules. (`docs/superpowers/specs/2026-05-09-tier-a-curriculum-design.md` §2.1 + §4 remain authoritative for module structure.)
- **Structural conventions §4.1.** Hoisted data blocks, named step arrays, no `<h2>`/`<h3>` inside Hook/Mental Model cards, no emojis, italicize catalog terms on first use.
- **The concept catalog.** Canonical one-line definitions for ~100 terms remain the source of truth for first-introduction phrasing.
- **Per-module learning outcomes.** Each module still has a Bloom-verb outcome list; the list is rewritten to match the new module set.
- **The reference app `examples/taproot-blog`.** Three rungs (`static/` → `spa/` → `app/`) already exist and are exactly the gradient the spine climbs. No changes to the reference app's code are required by this spec.
- **The interactive components library.** `CodePlayground`, `EventLoopVisualizer`, `LiveCascadeDemo`, `FlexboxControls`, `GridControls`, `InteractiveDiagram`, `LayeredFlow`, `SequenceDiagram`, `StepByStepExplanation`, `TerminalPlayground` — all reused.
- **Tooling discipline.** Lint, typecheck, the Vietnamese-character language guard, the build green-bar requirement.

### 2.2. Changed

- **Module count: 30 → 15.** Fourteen spine modules + one closing "field map" module. Cuts come from comparison-only modules and from merges where two adjacent topics are most clearly understood as one derivation.
- **Phase structure: 8 phases by topic → 5 stages by stage-of-derivation.** Phases stop being "Internet / HTML / CSS / JS / Workflow / Build / Beyond / Capstone" and become "A document, made visible / A document, made alive / A page that lives on the internet / The walls of vanilla / A real modern frontend app." A sixth, terminal stage is the closing module.
- **Reference app: capstone-only → spine.** Today the reference app appears in Phase 8. In the new design, the reference app appears in module 1 — `examples/taproot-blog/static/index.html` is what the learner writes — and every module thereafter changes one specific thing about it. The capstone is not a separate phase; the entire curriculum is the capstone, derived one step at a time.
- **roadmap.sh coverage commitment: "every yellow node is a module" → "every yellow node is named and positioned."** The spine modules are taught in depth. Topics outside the spine (GraphQL, Web Components, PWAs, React Native, Flutter, alternative bundlers, alternative frameworks, the testing pyramid, performance budgets, accessibility audits, SSGs, desktop apps) appear in the closing module as *positioned references*: "given what you now know, here is what X changes about Y, and what it costs." Not a comparison shopping list — guided positioning.
- **CLAUDE.md update.** The current CLAUDE.md says "covering every yellow node in the official roadmap PDF." That commitment is rewritten to: "every yellow node is named and positioned in the curriculum; spine modules are taught to the Tier-A standard; non-spine topics are positioned in the closing module."

### 2.3. Out of scope

- **Reference app changes.** `examples/taproot-blog` is unchanged.
- **Component library additions.** No new interactive components are required.
- **App UX changes (dashboard, lesson viewer).** The Next.js app shell, progress system, and lesson viewer are unchanged. The dashboard reorganizes into 5 stages instead of 8 phases, but the rendering code and the progress store are untouched.
- **Migrating learner progress.** Existing progress in `localStorage` (key `frontend-learning-progress`) is invalidated by the module-id renaming. On first load after the rewrite, learners see a fresh dashboard. Acceptable cost — this is a learning app, not a SaaS; nobody paid for their progress; the new curriculum is a strict improvement.

## 3. The spine

Each entry below gives the **module id**, **title**, **driving failure** (what hits a wall), **what the module derives**, **what the module ships in the reference app**, and **roadmap.sh nodes covered**.

### Stage I — A document, made visible

#### 1-1 the-smallest-useful-thing
- **Driving failure:** You have words to share. A `.txt` file works on your laptop. Open it on a phone — fonts collapse, no structure, no links.
- **Derives:** Why HTML had to exist. Tags as structure. The browser as a document renderer.
- **Ships:** `examples/taproot-blog/static/index.html` — the homepage, plain HTML, no styling. Working `<a href>` links to `posts/*.html`.
- **Covers:** "How the internet works (introduction)", "What is HTML"

#### 1-2 meaning-before-appearance
- **Driving failure:** Your HTML works but reads like a list. A blind reader, a search engine, and a browser tab all need to know what role each chunk plays.
- **Derives:** Semantic HTML (`<article>`, `<nav>`, `<main>`, `<aside>`), the document outline, why ARIA is rarely the answer, accessibility as a side-effect of meaning, SEO as a side-effect of structure.
- **Ships:** `examples/taproot-blog/static/posts/*.html` — every post a real `<article>` with a heading hierarchy that a screen reader can follow.
- **Covers:** "Semantic HTML", "Accessibility", "SEO basics", "Forms and validation" (forms appear as the comment box on the static page).

#### 1-3 the-same-document-two-lives
- **Driving failure:** The same blog post on a phone and a billboard. Inline `style` attributes scale to nothing.
- **Derives:** Why CSS had to be separate. The cascade as the mechanism that makes "I'll override one rule" possible without coordination. The box model. Selectors and specificity. Layout (Flexbox, Grid). Responsive design.
- **Ships:** `examples/taproot-blog/static/assets/site.css` — the full styled blog, mobile-first, two-column on desktop, single-column on mobile. The cascade is *visible* (one rule overrides another, with specificity computed).
- **Covers:** "CSS basics", "Flexbox", "Grid", "Responsive design", "CSS cascade and specificity", "Box model".

### Stage II — A document, made alive

#### 2-1 when-the-page-has-to-react
- **Driving failure:** A "show comments" button on the static blog. HTML can't toggle visibility on click. CSS can fake it with `:checked` hacks but breaks the moment a third state appears.
- **Derives:** Why JavaScript had to be in the browser. What "the DOM" actually is — a tree the browser exposes for manipulation. Events, listeners, and event delegation. Mutation as the engine of interactivity.
- **Ships:** A `<script>` block in the static blog that toggles a comments section. Vanilla JS, no framework. The reader watches a state-vs-DOM bug appear (clicking twice toggles wrong) and *that bug becomes module 4-1's driving failure*.
- **Covers:** "JavaScript fundamentals (variables, types, control flow)", "DOM and events", "the event loop (introduction)".

#### 2-2 things-take-time
- **Driving failure:** Clicking a button to load comments isn't instant. The network exists. Synchronous JS freezes the page.
- **Derives:** Why async exists. Promises as a value-not-here-yet. `async`/`await` as sugar. The event loop with macrotasks and microtasks. `setTimeout`, `Promise.resolve`, `fetch` — three disguises of one problem.
- **Ships:** The comments section now loads asynchronously from a hardcoded JSON file, with a loading state.
- **Covers:** "JavaScript async (callbacks, promises, async/await)", "the event loop (deep dive)".

#### 2-3 talking-to-another-machine
- **Driving failure:** Comments live on a server. You typed a URL once and it worked; now you have to do that yourself, from JS. A wrong header makes the request fail with `CORS`.
- **Derives:** HTTP as a stateless conversation. Methods, status codes, headers. `fetch`, `Request`, `Response`. CORS, derived from "why is this request being blocked?", not from a list of headers. `AbortController` for cancellation. Errors in async chains.
- **Ships:** The comments section now `fetch`es from a real (mocked, but real-shaped) endpoint. CORS appears organically when the mock is on a different origin and the learner has to fix it.
- **Covers:** "HTTP and HTTPS", "Fetch API", "CORS", "REST API basics".

### Stage III — A page that lives on the internet

#### 3-1 the-journey-of-a-url
- **Driving failure:** You push your files somewhere; someone in Brazil types your domain. What has to happen between those two events?
- **Derives:** DNS, TCP, TLS, HTTP, the browser parser, the rendering pipeline (parse → DOM → CSSOM → render → layout → paint → composite). All derived from one trace, with the existing `SequenceDiagram` and `LayeredFlow` components.
- **Ships:** Nothing in the reference app — this is the one explanatory module on the spine. The `EventLoopVisualizer` and `InteractiveDiagram` carry the load.
- **Covers:** "How the internet works (deep dive)", "DNS, hosting, domains", "Browsers and rendering pipeline", "TLS / HTTPS".

#### 3-2 ship-it-and-version-it
- **Driving failure:** Your laptop has the only copy of the static blog. It works locally and breaks on production. You also accidentally rewrote `assets/site.css` and can't undo.
- **Derives:** Git as snapshots-not-diffs. Branches as movable pointers. GitHub as a remote. Hosting (static host, Netlify/Vercel-style). The deploy pipeline. Why "it works on my machine" is a real failure mode and what the floor of being a frontend dev is.
- **Ships:** `examples/taproot-blog/static/` is committed and deployed. Learner sees their own URL, opens it on a phone, the page works.
- **Covers:** "Git and GitHub", "Hosting and CDNs", "Continuous deployment basics".

### Stage IV — The walls of vanilla

#### 4-1 the-dom-is-a-footgun-at-scale
- **Driving failure:** The bug from module 2-1, plus a new feature: editing a comment. Adding it forces the learner to rebuild parts of the page by hand and keep state and DOM in sync. State and DOM drift apart. Bugs follow.
- **Derives:** Why React (and reactivity in general) had to be invented. Components as functions of state. JSX as a description, not a template. Hooks (`useState`, `useEffect`) as the surface of reactivity. The virtual DOM as the engine that lets you describe the result instead of the steps. Vite as the build tool that makes JSX and modules work in the browser.
- **Ships:** `examples/taproot-blog/spa/` — the same blog rebuilt as a Vite + React SPA. Same visual design. Comments and editing now work without the bugs from module 2-1. MSW mocks the API.
- **Covers:** "Modern JavaScript (ES modules, build tools)", "React fundamentals (components, JSX, hooks, state)", "Vite", "Package managers (npm)", "Linters and formatters (ESLint + Prettier)".

#### 4-2 types-and-the-editor-that-knows-them
- **Driving failure:** The SPA has authors, posts, and comments. JavaScript lets you pass the wrong shape to a component and find out at runtime, on production, from a user.
- **Derives:** Why TypeScript stopped being optional. Structural typing. Narrowing. Generics. The `tsc --noEmit` discipline.
- **Ships:** `examples/taproot-blog/spa/src/**` — the entire SPA in TypeScript. Real types for `Author`, `Post`, `Comment`. A `tsc` error the learner has to read and fix.
- **Covers:** "TypeScript".

#### 4-3 css-at-scale-collides
- **Driving failure:** Two components in the SPA both style `.button`. Last one wins. Specificity wars start. Reading any one component's CSS no longer tells you what it will look like.
- **Derives:** Why utility-first (Tailwind) and scoping (CSS Modules, scoped styles) exist. Why "just write CSS" stops scaling. CSS architecture (BEM is positioned as the answer of the previous era; Tailwind as the answer of this one).
- **Ships:** `examples/taproot-blog/spa/` is restyled with Tailwind. The before-and-after is visible: same UI, no global stylesheets, no specificity wars.
- **Covers:** "Tailwind CSS", "CSS architecture and methodology", "CSS preprocessors (positioned)".

### Stage V — A real modern frontend app

#### 5-1 routes-layouts-and-where-should-this-render
- **Driving failure:** The SPA is fast for users with JavaScript but invisible to Google. The first paint shows a blank page until the JS bundle downloads, parses, and runs. Sharing a post URL on social media shows no preview.
- **Derives:** Why server-side rendering (SSR), static site generation (SSG), and React Server Components (RSC) exist. The client/server boundary as a deliberate decision, not a syntax detail. Routing, layouts, nested routes. Hydration as wiring up server HTML on the client. Next.js as the most popular concrete answer (per user preference: pick the most popular, teach deeply).
- **Ships:** `examples/taproot-blog/app/` — the same blog, now Next.js App Router. Same visual design. The reader watches the network tab: HTML arrives ready-painted, JavaScript hydrates afterwards. Open Graph tags work. Google can index posts.
- **Covers:** "SSR, SSG, ISR, RSC", "Next.js (taught deeply)", "Module bundlers (positioned)".

#### 5-2 data-state-and-who-owns-the-truth
- **Driving failure:** Three places think they know the comment count: the URL (after a filter), the server (after a real database query), the client cache (after the user added one). They disagree. Which is right? When?
- **Derives:** State has flavors. URL state, server state, client state. Mismatching the flavor is the single hardest bug class in modern frontend. Server actions and data fetching in RSC. TanStack Query for client-side server state. Database (Prisma) and the persistence boundary. Forms as state transitions.
- **Ships:** `examples/taproot-blog/app/` — comments now persist to Postgres via Prisma; URL state controls which post is open; server actions handle the comment submission; the cache invalidates correctly.
- **Covers:** "State management", "Data fetching", "Server actions", "Forms and validation (deep dive)", "Database basics (positioned for frontend devs)".

#### 5-3 identity-and-trust
- **Driving failure:** The blog needs authors, not anonymous commenters. Now there are users, sessions, secrets, and adversaries. A logged-in author should see a "Delete" button on their own posts. An attacker should not.
- **Derives:** Authentication vs. authorization. Sessions vs. tokens. NextAuth as the most popular concrete answer. The frontend as not a security boundary — every check has to also exist on the server. Security headers (CSP, same-site cookies, CORS), XSS, CSRF — derived from "what can an attacker do, and what stops them?"
- **Ships:** `examples/taproot-blog/app/` — full auth via NextAuth, seeded users, role-based UI, server-side authorization checks, secure session cookies. Deployed.
- **Covers:** "Authentication", "Authorization", "Web security (XSS, CSRF, CSP, OWASP frontend top hits)".

### Closing — The field, from here

#### 6-1 the-field-from-here
- **Purpose:** Use the foundation the learner now has to *position* every roadmap.sh topic the spine did not cover. Not a comparison shopping list — guided positioning. For each topic: "given what you know about [spine concept], here is what [topic] changes, what it adds, and what it costs."
- **Topics positioned (one paragraph each, no deep dive):** GraphQL (against module 2-3), Web Components (against module 4-1), PWAs and service workers (against module 3-1), React Native and Flutter and Ionic (against module 4-1), desktop apps with Electron / Tauri (against module 3-1 and 4-1), alternative bundlers (Webpack, esbuild, Rollup — against module 4-1), alternative frameworks (Vue, Svelte, Solid — against module 4-1), the testing pyramid (Vitest, Jest, Playwright — against modules 4-1 and 5-3), performance (PRPL, RAIL, Lighthouse, Core Web Vitals — against modules 3-1 and 5-1), accessibility audits (against module 1-2), CSS preprocessors and other styling approaches (against module 4-3).
- **Format:** A single longer module (probably 60–90 minutes) with a "field map" diagram (using `InteractiveDiagram`) where each non-spine topic is a node attached to the spine module that it relates to. Clicking a node expands a paragraph and a one-line "when you'd reach for this."
- **Why one module not many:** The job is positioning, not depth. A learner who has the foundation can read deeper docs about any of these on their own. The curriculum's job is to ensure they leave knowing where each piece goes.

## 4. Per-module template (unchanged in shape, refined in spirit)

Every spine module follows the existing 7-section Tier-A template. The refinement is in the **Hook** and the **Step-by-step**:

- **Hook is always the driving failure.** Not "today we'll learn X." Not "X is important because." A concrete, observable failure of the previous module's world: a screenshot, a bug, a network trace, a user complaint. The Hook ends with the question the rest of the module answers.
- **Step-by-step is always a derivation.** Each step is "given the previous step's world, what minimally has to be added for the failure to stop being a failure?" Not "here are the parts of HTTP." Rather: "we have a request that the browser blocks. Why does it block? What header would have to exist for it not to block? What is that header called? What else does that header imply?"
- **Mental model is one sentence the learner can carry forever.** Verbatim mirrored in `KeyTakeaways.mentalModel`. Short, memorable, generative — a sentence that *makes new topics cheap*.
- **GotchaList stays at exactly 4 entries.**
- **Playground always lets the learner make the failure happen on purpose, then fix it.** Not a feature tour. A reproduction.

The closing module (6-1) is an exception: it does not have a single Hook, Mental model, or Playground. Instead it has a "field map" interactive diagram and a paragraph per positioned topic. This exception is justified the same way Phase 0's exception is — the section is not introducing a new idea, it is organizing the ideas already introduced.

## 5. Module ID and naming convention

The new convention: `{stage}-{order}-{slug}` — `1-1-the-smallest-useful-thing`, `5-3-identity-and-trust`, `6-1-the-field-from-here`. This replaces the existing phase-based ids. The corresponding component export is `Module_<stage>_<order>_Content` — `Module_5_3_Content`.

Old module ids in `lib/curriculum.ts`, `lib/modules/index.ts`, and `lib/modules/<id>.tsx` are removed. The migration is total, not incremental — the curriculum is being rewritten, not extended. `lib/modules/_template.tsx` (already deprecated) and `lib/modules/_demos/` are also removed in the migration; the new modules are authored directly to the Tier-A template, and the demos served only as scaffolding for the deprecated template.

## 6. Dashboard and progress

- The dashboard renders 5 stages plus a closing card, matching the new structure.
- The progress store key changes from `frontend-learning-progress` to `frontend-learning-progress-v2` to avoid loading stale, mismatched state. (Learners on first load after the rewrite see a fresh dashboard. Acceptable cost — see §2.3.)
- `isModuleUnlocked` continues to always return `true` (soft prereqs).
- The "Recommended first: N earlier modules" badge becomes more meaningful in this design — because each module is genuinely a prerequisite for the next, the recommendation is real, not advisory.

## 7. Coverage map: roadmap.sh → spine modules

| roadmap.sh node | Spine module(s) | Depth |
|---|---|---|
| Internet, HTTP, DNS, TLS, browsers and rendering | 3-1 | Deep |
| HTML basics, semantics, forms, accessibility, SEO | 1-1, 1-2 | Deep |
| CSS basics, Flexbox, Grid, responsive | 1-3 | Deep |
| Tailwind | 4-3 | Deep |
| CSS preprocessors, BEM | 4-3 (positioned), 6-1 | Positioned |
| JavaScript language, DOM, events, async, fetch | 2-1, 2-2, 2-3 | Deep |
| Git, GitHub | 3-2 | Deep |
| Package managers (npm) | 4-1 | Deep |
| TypeScript | 4-2 | Deep |
| React | 4-1, 5-1, 5-2 | Deep |
| Other frameworks (Vue, Svelte, Angular, Solid) | 6-1 | Positioned |
| Vite | 4-1 | Deep |
| Other bundlers (Webpack, esbuild, Rollup) | 6-1 | Positioned |
| ESLint, Prettier | 4-1 | Deep |
| Testing | 6-1 | Positioned |
| Authentication, security | 5-3 | Deep |
| SSR, SSG, RSC, Next.js | 5-1 | Deep |
| State management, data fetching | 5-2 | Deep |
| GraphQL | 6-1 | Positioned |
| Web Components | 6-1 | Positioned |
| PWAs, service workers | 6-1 | Positioned |
| Mobile (React Native, Flutter, Ionic) | 6-1 | Positioned |
| Desktop (Electron, Tauri) | 6-1 | Positioned |
| Performance (Core Web Vitals, PRPL, RAIL) | 6-1 | Positioned |

Every yellow node is named at least once; the "Deep" ones are the spine.

## 8. Risks and tradeoffs

- **Existing progress is invalidated.** Acceptable; addressed in §2.3 and §6.
- **The CLAUDE.md commitment changes.** Today's CLAUDE.md says "covering every yellow node in the official roadmap PDF." The rewrite changes that to "named and positioned." This must be updated as part of implementation.
- **The reference app becomes load-bearing for the curriculum.** If the reference app breaks, the curriculum breaks. Mitigated by the existing `examples-blog.yml` CI workflow.
- **Module count drops from 30 to 15.** Some readers will see "15 modules" and assume the course is short. Addressed by making each module deeper (45–60 minutes) and by total course time being comparable. The dashboard can show estimated total minutes prominently.
- **The closing module is wide.** 11+ topics in one module is a lot. Mitigated by the "positioning, not depth" framing — each topic is one paragraph plus a node on the field map, not a section.
- **Topic ordering disagreements.** Some readers may want CSS before HTML semantics, or types before reactivity. The derivation order is defended by the failure each module addresses; if a reader proposes a different order, they are proposing a different failure chain — which is a coherent objection, but the spine in §3 is one defensible chain, not the only one.

## 9. Implementation strategy (high level — details belong in the plan)

1. **Update CLAUDE.md** to reflect the new coverage commitment and stage structure.
2. **Rewrite `lib/curriculum.ts`** with the new 15 modules across 5 stages + 1 closing.
3. **Rename `lib/modules/<id>.tsx` files** to the new ids, in module-id order. (Old files are deleted; the curriculum is rewritten, not extended — see §2.3.)
4. **Author each module** to the Tier-A 7-section template, following the §4 refinements.
5. **Update `lib/progress.ts`** to use the new `localStorage` key.
6. **Update the dashboard (`app/page.tsx`)** to render 5 stages + 1 closing card.
7. **Author the closing module** with its field-map diagram.
8. **Update the learning-outcomes spec** at `docs/superpowers/specs/2026-05-09-learning-outcomes.md` to match the new module set (or supersede with a new spec).
9. **Run `npm run lint && npx tsc --noEmit && npm run build`** green at the end of each stage.
10. **Smoke-test the reference app** at each rung (`static/`, `spa/`, `app/`) — the curriculum's claim is that the spine *is* the reference app's evolution; that claim has to be true at runtime.

## 10. Acceptance criteria

- 15 modules render in the lesson viewer; each follows the Tier-A 7-section template (closing module follows §4's exception).
- Every spine module's Hook is a concrete failure, not a topical introduction.
- Every spine module's Mental Model is one sentence; verbatim mirrored in KeyTakeaways.
- The dashboard shows 5 stages + 1 closing card; module count per stage matches §3.
- `npm run lint`, `npx tsc --noEmit`, `npm run build` all green.
- Every roadmap.sh yellow node is named in §7's coverage map and addressed by the corresponding module(s).
- A learner who finishes module 5-3 has, in `examples/taproot-blog/app/`, a working, deployed, auth-protected blog that they understand line-by-line because every line was added in response to a failure they felt.
