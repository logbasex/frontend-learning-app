# Per-Module Learning Outcomes

**Date:** 2026-05-09
**Status:** Authoritative completeness criterion for each Tier-A module.

A module is "done" when every outcome below is exercised by something concrete in the module — a step in the step-by-step, a challenge, a playground exercise, a gotcha, or a takeaway. Outcomes use Bloom-style verbs:

- **[recall]** — state, name, define, list
- **[apply]** — read, use, configure, write
- **[judge]** — pick, choose, decide between
- **[build]** — implement, construct, wire up
- **[debug]** — diagnose, identify, trace

After the module the learner can:

---

## Phase 0 — Orientation

### `0-1-the-map`
- [recall] Name the three lives of a modern frontend app (source, build, runtime) and one example file or artifact for each.
- [recall] List the five stages on the architecture diagram (source → build → deploy → request → runtime) without looking.
- [apply] Given a curriculum phase, point to which stage(s) of the diagram it teaches.
- [judge] Identify what "modern" is adding compared to a 2010-style three-file site.

---

## Phase 1 — Internet & Web Foundations

### `1-1-how-the-internet-works`
- [recall] State what DNS, TCP, TLS, and HTTP each do, in one sentence each.
- [recall] Name the three messages of the TCP three-way handshake.
- [apply] Read a `dig +trace` output and identify which step of resolution succeeded.
- [judge] Choose between A and AAAA for a given scenario.
- [debug] Given a "site won't load" symptom, name three diagnostic checks (DNS, TCP, TLS) in the right order.

### `1-2-http-and-https`
- [recall] List the most common HTTP methods and what each is for.
- [recall] Recognize the five status-code categories (1xx–5xx).
- [apply] Read a raw HTTP request and response and identify method, path, headers, body, status.
- [judge] Pick the appropriate method (GET vs POST vs PUT vs DELETE) for a given operation.
- [debug] Given a 4xx or 5xx, decide whether the bug is in the client or the server.

### `1-3-domain-dns-hosting`
- [recall] Name the parts of a domain name (label, TLD, root).
- [apply] Configure A, CNAME, MX, TXT records for a real-world setup.
- [judge] Choose between static hosting, VPS, and serverless for a given app.
- [recall] State what a CDN does in one sentence.
- [build] Sketch the DNS records you'd add to point `app.example.com` at a Vercel deployment.

### `1-4-browsers-and-rendering`
- [recall] List the stages of the rendering pipeline in order.
- [apply] Predict whether a given JS snippet causes a reflow or only a repaint.
- [judge] Decide whether a given CSS or JS pattern blocks rendering.
- [debug] Given a "layout shift" symptom, identify three likely causes.
- [recall] State why JS blocks parsing and CSS blocks rendering.

---

## Phase 2 — HTML

### `2-1-html-basics-and-semantics`
- [recall] List the main semantic landmark elements (header, nav, main, article, aside, footer).
- [apply] Rewrite a `<div>`-soup snippet using semantic elements.
- [judge] Choose between `<section>`, `<article>`, and `<aside>` for a given block.
- [build] Construct a valid document outline for a blog post.
- [debug] Spot a heading-level skip in an existing page and propose a fix.

### `2-2-forms-and-validation`
- [recall] State three ways to associate a `<label>` with an `<input>`.
- [apply] Use `required`, `pattern`, and `type="email"` to drive native validation.
- [build] Construct an accessible login form from scratch.
- [judge] Decide when to fall back from native validation to custom JS validation.
- [debug] Identify why a screen reader is reading "edit text" instead of the field label.

### `2-3-accessibility`
- [recall] State the first rule of ARIA in one sentence.
- [apply] Tab through a page and identify focus-order bugs.
- [judge] Decide whether a given UI needs an ARIA role or a different semantic element.
- [build] Add accessible names and roles to a custom component.
- [recall] Recall the WCAG AA contrast ratios for normal and large text.

### `2-4-seo-basics`
- [build] Write a complete `<head>` (title, description, OG tags, canonical, robots).
- [recall] Name three meta tags and what each affects.
- [apply] Write a `robots.txt` and a minimal `sitemap.xml`.
- [judge] Choose appropriate `<title>` and `<meta description>` for a product page.
- [recall] State why semantic HTML earns ranking signals "for free."

---

## Phase 3 — CSS

### `3-1-css-fundamentals`
- [recall] Define cascade, specificity, and inheritance.
- [apply] Compute the specificity score of a given selector.
- [judge] Predict which of two colliding rules wins.
- [recall] Name the four parts of the box model.
- [build] Convert a `content-box` layout to `border-box` without changing visuals.

### `3-2-flexbox-and-grid`
- [recall] State the difference between Flexbox (1-D) and Grid (2-D) in one sentence.
- [build] Build a navbar with logo left, links right using Flexbox.
- [build] Build a 3-column responsive card grid using Grid.
- [judge] Choose Flex vs Grid for a given layout.
- [debug] Diagnose why `justify-content` doesn't seem to work (likely no main-axis space).

### `3-3-responsive-design`
- [apply] Write a mobile-first media-query stack.
- [build] Use `clamp()` for fluid type that respects min and max bounds.
- [build] Use a container query to style a card based on its parent's width.
- [judge] Pick breakpoints from content rather than device names.
- [debug] Identify why a layout breaks at an unexpected viewport width.

### `3-4-writing-css-modern` (Tailwind CSS)
- [recall] State what a utility class is and why utilities compose.
- [apply] Translate a CSS rule into the equivalent Tailwind classes.
- [build] Build a card component with hover/focus states using only Tailwind.
- [judge] Decide when to extract a Tailwind pattern into an `@apply` or a component.
- [recall] Name the alternatives to Tailwind in one paragraph and what each is good for.

### `3-5-css-architecture-and-preprocessors`
- [recall] State the BEM naming convention.
- [apply] Refactor a poorly-named class structure to BEM.
- [build] Use Sass nesting and a mixin without nesting more than 3 levels deep.
- [recall] Name two common PostCSS plugins and what they do.
- [judge] Decide when to introduce a preprocessor vs. relying on plain CSS + custom properties.

---

## Phase 4 — JavaScript

### `4-1-javascript-fundamentals`
- [recall] List the seven primitive types.
- [apply] Predict the output of a closure-using snippet.
- [judge] Decide why `this` is bound a given way in a given call.
- [debug] Identify a bug caused by `var` hoisting and rewrite it with `let`/`const`.
- [recall] State the difference between primitive and reference copy semantics.

### `4-2-dom-and-events`
- [build] Query the DOM and mutate text content via `textContent` (and explain why not `innerHTML`).
- [build] Use event delegation to handle clicks on a dynamic list.
- [recall] State the difference between bubbling and capturing.
- [apply] Trace a snippet's output through the event loop, naming macrotasks vs microtasks.
- [debug] Diagnose why a `setTimeout(0)` callback runs after a `Promise.resolve().then()`.

### `4-3-fetch-and-async`
- [build] Convert a callback-based API to a Promise-based one.
- [apply] Refactor a `.then()` chain into `async`/`await`.
- [build] Cancel an in-flight `fetch()` with `AbortController`.
- [judge] Decide where to put error handling in an async chain.
- [debug] Identify why a Promise rejection seems to be "swallowed" (no `.catch`, no `try/catch`).

---

## Phase 5 — Workflow & Frameworks

### `5-1-git-and-github`
- [build] Initialize a repo, make commits, push to GitHub.
- [apply] Resolve a merge conflict cleanly.
- [judge] Choose between merge and rebase for a given history goal.
- [recall] Read a `git log --oneline --graph` and tell the story.
- [debug] Recover a "lost" commit using `git reflog`.

### `5-2-package-managers`
- [recall] State what a lockfile does.
- [apply] Read a `package.json` and a lockfile and explain the dependency graph.
- [judge] Pin, range-bound, or float a dependency on purpose.
- [build] Set up a pnpm workspace with two packages that depend on each other.
- [recall] Name the tradeoffs of npm vs pnpm vs yarn in one paragraph.

### `5-3-pick-a-framework` (React Fundamentals)
- [recall] State why React describes UI as a function of state.
- [build] Build a counter using `useState`.
- [build] Build a list of items, each with its own `useState`, demonstrating reconciliation.
- [build] Use `useEffect` to fetch data on mount with cleanup.
- [judge] Decide when to lift state vs. keep it local.
- [debug] Diagnose an infinite-render loop and fix the dependency array.
- [recall] Name React's main alternatives in one paragraph.

### `5-4-typescript`
- [build] Add types to an existing JS file incrementally (`.js` → `.ts`).
- [apply] Use a union and narrow it to a single arm with `typeof` or `in`.
- [build] Write a generic function and a generic type.
- [recall] State what structural typing means.
- [debug] Read and fix a `tsc` error message.

---

## Phase 6 — Build, Test & Secure

### `6-1-linters-and-formatters`
- [build] Configure ESLint for a TS+React project.
- [build] Wire Prettier in without fighting ESLint (use `eslint-config-prettier`).
- [build] Add a pre-commit hook that runs lint + format.
- [recall] State the difference between lint and format jobs.
- [judge] Decide whether a given rule belongs in ESLint or Prettier.

### `6-2-module-bundlers` (Vite & the Dev Loop)
- [recall] State what bundling is and why it exists.
- [recall] Explain how Vite's dev server differs from a traditional bundler's.
- [build] Add a Vite config for a TS+React project from scratch.
- [apply] Use HMR while editing a component and observe state preserved.
- [debug] Diagnose a "works in dev, breaks in prod" issue (typically environment or dynamic-import).
- [recall] Name the alternatives (Webpack, esbuild, Rollup, Parcel) in one paragraph.

### `6-3-testing`
- [build] Write a unit test with Vitest for a pure function.
- [build] Write a component test that asserts behavior, not implementation.
- [build] Write a Playwright E2E that logs in and asserts a page state.
- [judge] Decide which test level (unit / integration / E2E) catches a given bug class cheapest.
- [debug] Identify why an E2E test is flaky and propose a fix that doesn't add `sleep`.

### `6-4-authentication`
- [recall] State the difference between authentication and authorization.
- [recall] Explain a JWT's three parts.
- [judge] Pick session cookies vs JWT for a given app.
- [build] Walk through an OAuth Authorization Code + PKCE flow step by step.
- [debug] Spot a security issue with token storage (e.g. JWT in `localStorage` and what it implies for XSS).

### `6-5-web-security`
- [recall] Define XSS, CSRF, CORS, CSP in one sentence each.
- [debug] Spot an XSS sink (e.g. `innerHTML = userInput`) and patch it.
- [build] Defend against CSRF using same-site cookies and a CSRF token.
- [build] Write a sane Content-Security-Policy for a SPA.
- [judge] Decide whether a third-party script is safe to include and what CSP would allow it.

---

## Phase 7 — Beyond the Browser & Production

### `7-1-web-components`
- [build] Define a `<my-counter>` custom element with `connectedCallback` and an internal counter.
- [build] Use Shadow DOM for style encapsulation.
- [build] Use `<template>` and `<slot>` to compose content.
- [judge] Decide when Web Components beat React (and when they don't).
- [recall] State the lifecycle callbacks (`connected`, `disconnected`, `attributeChanged`).

### `7-2-ssr` (Next.js)
- [recall] Define CSR, SSR, SSG, ISR, RSC in one sentence each.
- [judge] Pick a rendering mode for a given route on purpose.
- [recall] Explain hydration in one paragraph.
- [build] Add a Next.js page using a server component to fetch data.
- [debug] Diagnose a hydration mismatch error and fix it.

### `7-3-graphql`
- [recall] Read a GraphQL schema and explain types, queries, mutations.
- [build] Write a query using fragments and variables.
- [build] Use Apollo Client to fetch and cache a query.
- [judge] Decide when GraphQL is worth its complexity over REST.
- [recall] Explain why caching by id beats caching by URL.

### `7-4-static-site-generators`
- [judge] Pick an SSG (Astro, Eleventy, Next-export) by content shape.
- [build] Build an Astro page with an interactive island.
- [recall] Explain islands architecture in one paragraph.
- [judge] Decide between SSG and SSR for a given page.
- [debug] Diagnose a build-time error like "tried to use a runtime API at build time."

### `7-5-pwas-and-browser-apis`
- [build] Register a service worker that caches the app shell.
- [judge] Choose between LocalStorage, IndexedDB, and the Cache API for a given data shape.
- [build] Use a WebSocket for real-time messaging.
- [build] Use SSE for one-way streaming from server.
- [debug] Diagnose a "service worker won't update" issue.

### `7-6-mobile-apps`
- [recall] State what React Native, Flutter, and Ionic each are.
- [judge] Pick a mobile stack for a given team and target.
- [build] Bootstrap a "hello world" screen in React Native.
- [recall] Explain the JS bridge in React Native.
- [judge] Decide when a PWA is enough (no native shell needed).

### `7-7-desktop-apps`
- [recall] State what Electron and Tauri each are and how they differ.
- [judge] Pick a desktop stack (Electron / Tauri / Flutter) for a given team.
- [build] Bootstrap a "hello world" Tauri app.
- [recall] Compare bundle size and memory tradeoffs.
- [debug] Diagnose a security issue from over-broad IPC permissions.

### `7-8-performance`
- [recall] Define LCP, INP, CLS in one sentence each.
- [apply] Read a Lighthouse report and prioritize three fixes.
- [build] Add `loading="lazy"` to images and `preload` to a critical font.
- [judge] Decide when to inline critical CSS vs. let it fetch.
- [debug] Diagnose a high CLS using DevTools Performance and fix it.

---

## Phase 8 — Capstone (How a Modern Frontend App Works)

### `8-1-the-build-pipeline`
- [recall] State what the module graph is and how it differs in dev mode vs build mode.
- [apply] Read a `next build` output and explain which routes share which chunks.
- [judge] Decide between a barrel file and direct imports based on tree-shaking impact.
- [debug] Given a "works in dev, broken in prod" report, list the three most likely build-time causes (env vars, dynamic imports, side-effect imports).
- [build] Configure a project's env vars to split public from server-only correctly.

### `8-2-the-request-lifecycle`
- [recall] Name the eight machines a request passes through and one example of each.
- [apply] Read a Lighthouse waterfall and identify which actor (DNS, server, network, parser, hydrator) is the bottleneck.
- [judge] Given two routes, predict which has lower hydration cost and explain why.
- [debug] Diagnose a "button does not work for the first second" report and name the most common cause.
- [recall] Distinguish hydration mismatch from a normal render error.

### `8-3-the-architecture-of-a-real-app`
- [recall] Name the three flavors of state (URL, server, client) and one example of each from a real app.
- [apply] Given a feature ("add a like button to posts"), name the three architectural decisions before writing code.
- [judge] Choose between a server component and a client component for a given UI piece, with reasoning.
- [debug] Spot the "fetch from your own API in a server component" antipattern and refactor it.
- [build] Write a server action that performs a mutation, validates input with Zod, and revalidates the right paths.
- [recall] Distinguish between authentication that runs in middleware (security) and client-side state (UX hint).

---

## How to use this file

- Authors of each module check **every outcome** is exercised somewhere in the module before declaring "done."
- Reviewers (and the user) verify by reading the module against this list.
- If an outcome turns out to belong elsewhere or to be unrealistic, edit it here and note the change in the module's commit.
- Outcomes are intentionally narrower than "everything about X" — they define the *floor*, not the *ceiling*. Authors may exceed them.
