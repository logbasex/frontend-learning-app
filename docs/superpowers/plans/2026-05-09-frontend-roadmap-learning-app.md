# Frontend Roadmap Learning App — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pivot the existing JavaFX learning app into a story-driven Frontend learning app whose curriculum mirrors `roadmap.sh/frontend` (per the official PDF), with one richly-authored reference module and scaffolds for every other module so the dashboard works end-to-end.

**Architecture:** Same shell as the JavaFX app — Next.js App Router, Zustand-persisted progress, Sandpack live code, Prism syntax highlighting, shadcn/ui primitives. Curriculum metadata lives in `lib/curriculum.ts`. Each module is a `Module_X_Y_Content()` React component in `lib/modules/<id>.tsx` registered in `lib/modules/index.ts`. Module shape stays as-is plus a `roadmapUrl` field; `hasHeroDesktop2Context` is dropped.

**Tech Stack:** Next.js 16 (App Router, React 19), TypeScript, Tailwind v4, shadcn/ui, `@codesandbox/sandpack-react`, `@xyflow/react`, `prism-react-renderer`, Zustand, framer-motion, lucide-react.

**Roadmap source of truth:** `https://roadmap.sh/pdfs/roadmaps/frontend.pdf` (read 2026-05-09). Coverage table is in §1 of this plan.

---

## §1. Roadmap → Curriculum Coverage Table

Every yellow node from the official PDF maps to one module below. Sub-nodes (purple/grey) are taught inside their parent module.

| Roadmap node (PDF) | Module ID | Phase |
|---|---|---|
| Internet — How does the internet work? | `1-1-how-the-internet-works` | 1 |
| Internet — What is HTTP? | `1-2-http-and-https` | 1 |
| Internet — What is Domain Name? / What is hosting? / DNS | `1-3-domain-dns-hosting` | 1 |
| Internet — Browsers and how they work? | `1-4-browsers-and-rendering` | 1 |
| HTML — Learn the basics / Writing Semantic HTML | `2-1-html-basics-and-semantics` | 2 |
| HTML — Forms and Validations | `2-2-forms-and-validation` | 2 |
| HTML — Accessibility | `2-3-accessibility` | 2 |
| HTML — SEO Basics | `2-4-seo-basics` | 2 |
| CSS — Learn the basics | `3-1-css-fundamentals` | 3 |
| CSS — Making Layouts (Flexbox + Grid) | `3-2-flexbox-and-grid` | 3 |
| CSS — Responsive Design | `3-3-responsive-design` | 3 |
| Writing CSS (Tailwind, CSS-in-JS, CSS Modules, Styled Components, Panda, Shadcn, Mantine) | `3-4-writing-css-modern` | 3 |
| CSS Architecture (BEM) + CSS Preprocessors (Sass, PostCSS) | `3-5-css-architecture-and-preprocessors` | 3 |
| JavaScript — Learn the Basics | `4-1-javascript-fundamentals` | 4 |
| JavaScript — Learn DOM Manipulation | `4-2-dom-and-events` | 4 |
| JavaScript — Fetch API / Ajax (XHR) | `4-3-fetch-and-async` | 4 |
| Version Control Systems — Git | `5-1-git-and-github` | 5 |
| VCS Hosting — GitHub / GitLab / Bitbucket | (folded into 5-1) | 5 |
| Package Managers — npm, pnpm, yarn | `5-2-package-managers` | 5 |
| Pick a Framework — React/Vue/Angular/Svelte/Solid/Qwik | `5-3-pick-a-framework` | 5 |
| Type Checkers — TypeScript | `5-4-typescript` | 5 |
| Build Tools — Linters & Formatters (ESLint, Prettier) | `6-1-linters-and-formatters` | 6 |
| Build Tools — Module Bundlers (Vite, Webpack, Rollup, Parcel, esbuild, SWC) | `6-2-module-bundlers` | 6 |
| Testing — Vitest, Jest, Playwright, Cypress | `6-3-testing` | 6 |
| Authentication Strategies — JWT, OAuth, SSO, Basic, Session | `6-4-authentication` | 6 |
| Web Security Basics — CORS, HTTPS, CSP, OWASP | `6-5-web-security` | 6 |
| Web Components — Custom Elements, HTML Templates, Shadow DOM | `7-1-web-components` | 7 |
| SSR — Next.js, Nuxt, SvelteKit, react-router, Angular SSR | `7-2-ssr` | 7 |
| GraphQL — Apollo, Relay Modern | `7-3-graphql` | 7 |
| Static Site Generators — Astro, Eleventy, Vuepress, Nuxt, Next | `7-4-static-site-generators` | 7 |
| PWAs — Storage, Web Sockets, SSE, Service Workers, Location, Notifications, Device Orientation, Payments, Credentials | `7-5-pwas-and-browser-apis` | 7 |
| Mobile Apps — React Native, Flutter, Ionic | `7-6-mobile-apps` | 7 |
| Desktop Apps — Electron, Tauri, Flutter | `7-7-desktop-apps` | 7 |
| Measure & Improve Perf. — PRPL, RAIL, Performance Metrics, Lighthouse, DevTools, Performance Best Practices | `7-8-performance` | 7 |

**Total: 30 modules across 7 phases.**

Reorganization rationale:
- The current 6-phase, 24-module curriculum (in the spec) under-covers the roadmap (8+ missing topics). This plan widens it to 30/7 to match.
- Phase 7 ("Beyond the Browser & Production") is new — bundles SSR/GraphQL/SSG/PWA/Mobile/Desktop/Performance/Web Components, which the roadmap groups loosely under "advanced".

## §2. File Structure

**Files to create:**
- `lib/modules/<each-of-30-module-ids>.tsx` — one per module (30 files total)
- `components/KeyTakeaways.tsx` — already created in earlier session, keep
- `components/RoadmapLink.tsx` — already created in earlier session, keep
- `lib/modules/_template.tsx` — minimal scaffold helpers (`ScaffoldModule`) shared by every short module

**Files to modify:**
- `lib/curriculum.ts` — replace with the 30-module curriculum (currently has 24, needs widening)
- `lib/modules/index.ts` — register all 30 modules
- `lib/progress.ts` — totalModules: 30 (currently 24)
- `app/page.tsx` — already rebranded
- `app/layout.tsx` — already rebranded
- `app/lesson/[moduleId]/page.tsx` — already updated
- `CLAUDE.md` — replace JavaFX guidance with frontend roadmap guidance
- `README.md` — rebrand
- `IMPLEMENTATION_GUIDE.md` — update or delete

**Files to delete:**
- `components/JavaFXDemoViewer.tsx` — already deleted
- `lib/modules/1-1-why-javafx.tsx` — already deleted

**Out of scope:**
- Migrating localStorage from old key.
- Test infrastructure (no tests in repo today; not requested).

## §3. Module Authoring Tiers

Authoring 30 deep modules in one pass is unrealistic at the JavaFX 1.1 standard (~1000 lines each). Two tiers:

- **Tier A (Reference, 1 module):** `1-1-how-the-internet-works`. Full template — problem statement → 5–7 step explanation → live HTMLPlayground → diagram → 2 challenges → KeyTakeaways. Target 600–900 lines.
- **Tier B (Scaffold, 29 modules):** Problem statement (3–5 paragraphs) → one piece of interactive content (playground OR diagram OR static code block) → 1 challenge → KeyTakeaways with mental model. Target 150–250 lines each.

Every module must render real content — no "coming soon" placeholders.

## §4. Tasks

### Task 1: Widen curriculum to 30 modules across 7 phases

**Files:**
- Modify: `lib/curriculum.ts` (replace whole file)
- Modify: `lib/progress.ts:96` (`totalModules: 24` → `30`)

- [ ] **Step 1: Replace `lib/curriculum.ts` with 30-module curriculum**

The new curriculum must export `Phase[]` matching §1. Field shape stays as in the current file (id/title/description/phase/order/duration/prerequisites/learningObjectives[]/mentalModels[]/hasInteractiveDemo/hasDiagram/hasChallenge/hasCodeComparison/roadmapUrl). All helper functions (`getAllModules`, `getModuleById`, `getModulesByPhase`, `getNextModule`, `getPreviousModule`, `isModuleUnlocked`, `getPhaseProgress`, `getTotalProgress`) stay byte-identical to the current file.

Phase shape:
```ts
{
  id: 1, title: "Internet & Web Foundations", icon: "Globe",
  description: "How the web actually works under the hood",
  modules: [ /* 4 modules */ ]
}
```

Icon names per phase (must match the `ICONS` map in `app/page.tsx:12`):
- 1 Globe, 2 Palette (HTML), 3 Sparkles (CSS), 4 Zap (JS), 5 Wrench (Tooling), 6 Shield (Build/Test/Sec), 7 Boxes (Beyond)

For each module include 3 `learningObjectives`, 3 `mentalModels`, accurate `prerequisites` (linear chain by default: each module depends on its predecessor), and `roadmapUrl: "https://roadmap.sh/frontend"`.

- [ ] **Step 2: Update `lib/progress.ts:96`**

```ts
export function useProgressStats() {
  const completedModules = useProgress((state) => state.completedModules);
  const totalModules = 30;
  const completedCount = completedModules.length;
  const progressPercentage = Math.round((completedCount / totalModules) * 100);
  return { completedCount, totalModules, progressPercentage };
}
```

- [ ] **Step 3: Verify type-check**

Run: `npx tsc --noEmit`
Expected: No errors related to `curriculum.ts` or `progress.ts`. Errors about missing module content files in `lib/modules/index.ts` are fine — they're addressed in Task 2.

- [ ] **Step 4: Commit**

```bash
git add lib/curriculum.ts lib/progress.ts
git commit -m "feat(curriculum): widen to 30 modules matching roadmap.sh/frontend PDF"
```

---

### Task 2: Add `_template.tsx` scaffold helper and module registry

**Files:**
- Create: `lib/modules/_template.tsx`
- Modify: `lib/modules/index.ts`

- [ ] **Step 1: Create `lib/modules/_template.tsx`**

```tsx
"use client";

import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { Challenge, ChallengeOption } from "@/components/Challenge";
import { RoadmapLink } from "@/components/RoadmapLink";

export interface ScaffoldModuleProps {
  emoji: string;
  problemTitle: string;
  problem: ReactNode;
  body?: ReactNode;
  challenge: {
    question: string;
    options: ChallengeOption[];
    correctAnswerId: string;
    explanation: ReactNode;
  };
  takeaways: ReactNode[];
  mentalModel: string;
  roadmapUrl?: string;
}

export function ScaffoldModule({
  emoji,
  problemTitle,
  problem,
  body,
  challenge,
  takeaways,
  mentalModel,
  roadmapUrl,
}: ScaffoldModuleProps) {
  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="pt-6 prose dark:prose-invert max-w-none">
          <h2>{emoji} {problemTitle}</h2>
          {problem}
          {roadmapUrl && (
            <p className="not-prose mt-4">
              <RoadmapLink url={roadmapUrl} />
            </p>
          )}
        </CardContent>
      </Card>
      {body}
      <Challenge
        question={challenge.question}
        options={challenge.options}
        correctAnswerId={challenge.correctAnswerId}
        explanation={challenge.explanation}
      />
      <KeyTakeaways points={takeaways} mentalModel={mentalModel} />
    </div>
  );
}
```

- [ ] **Step 2: Replace `lib/modules/index.ts` to register all 30 modules**

```ts
import React from "react";

import { Module_1_1_Content } from "./1-1-how-the-internet-works";
import { Module_1_2_Content } from "./1-2-http-and-https";
import { Module_1_3_Content } from "./1-3-domain-dns-hosting";
import { Module_1_4_Content } from "./1-4-browsers-and-rendering";
import { Module_2_1_Content } from "./2-1-html-basics-and-semantics";
import { Module_2_2_Content } from "./2-2-forms-and-validation";
import { Module_2_3_Content } from "./2-3-accessibility";
import { Module_2_4_Content } from "./2-4-seo-basics";
import { Module_3_1_Content } from "./3-1-css-fundamentals";
import { Module_3_2_Content } from "./3-2-flexbox-and-grid";
import { Module_3_3_Content } from "./3-3-responsive-design";
import { Module_3_4_Content } from "./3-4-writing-css-modern";
import { Module_3_5_Content } from "./3-5-css-architecture-and-preprocessors";
import { Module_4_1_Content } from "./4-1-javascript-fundamentals";
import { Module_4_2_Content } from "./4-2-dom-and-events";
import { Module_4_3_Content } from "./4-3-fetch-and-async";
import { Module_5_1_Content } from "./5-1-git-and-github";
import { Module_5_2_Content } from "./5-2-package-managers";
import { Module_5_3_Content } from "./5-3-pick-a-framework";
import { Module_5_4_Content } from "./5-4-typescript";
import { Module_6_1_Content } from "./6-1-linters-and-formatters";
import { Module_6_2_Content } from "./6-2-module-bundlers";
import { Module_6_3_Content } from "./6-3-testing";
import { Module_6_4_Content } from "./6-4-authentication";
import { Module_6_5_Content } from "./6-5-web-security";
import { Module_7_1_Content } from "./7-1-web-components";
import { Module_7_2_Content } from "./7-2-ssr";
import { Module_7_3_Content } from "./7-3-graphql";
import { Module_7_4_Content } from "./7-4-static-site-generators";
import { Module_7_5_Content } from "./7-5-pwas-and-browser-apis";
import { Module_7_6_Content } from "./7-6-mobile-apps";
import { Module_7_7_Content } from "./7-7-desktop-apps";
import { Module_7_8_Content } from "./7-8-performance";

export const MODULE_CONTENTS: Record<string, React.ComponentType> = {
  "1-1-how-the-internet-works": Module_1_1_Content,
  "1-2-http-and-https": Module_1_2_Content,
  "1-3-domain-dns-hosting": Module_1_3_Content,
  "1-4-browsers-and-rendering": Module_1_4_Content,
  "2-1-html-basics-and-semantics": Module_2_1_Content,
  "2-2-forms-and-validation": Module_2_2_Content,
  "2-3-accessibility": Module_2_3_Content,
  "2-4-seo-basics": Module_2_4_Content,
  "3-1-css-fundamentals": Module_3_1_Content,
  "3-2-flexbox-and-grid": Module_3_2_Content,
  "3-3-responsive-design": Module_3_3_Content,
  "3-4-writing-css-modern": Module_3_4_Content,
  "3-5-css-architecture-and-preprocessors": Module_3_5_Content,
  "4-1-javascript-fundamentals": Module_4_1_Content,
  "4-2-dom-and-events": Module_4_2_Content,
  "4-3-fetch-and-async": Module_4_3_Content,
  "5-1-git-and-github": Module_5_1_Content,
  "5-2-package-managers": Module_5_2_Content,
  "5-3-pick-a-framework": Module_5_3_Content,
  "5-4-typescript": Module_5_4_Content,
  "6-1-linters-and-formatters": Module_6_1_Content,
  "6-2-module-bundlers": Module_6_2_Content,
  "6-3-testing": Module_6_3_Content,
  "6-4-authentication": Module_6_4_Content,
  "6-5-web-security": Module_6_5_Content,
  "7-1-web-components": Module_7_1_Content,
  "7-2-ssr": Module_7_2_Content,
  "7-3-graphql": Module_7_3_Content,
  "7-4-static-site-generators": Module_7_4_Content,
  "7-5-pwas-and-browser-apis": Module_7_5_Content,
  "7-6-mobile-apps": Module_7_6_Content,
  "7-7-desktop-apps": Module_7_7_Content,
  "7-8-performance": Module_7_8_Content,
};

export function getModuleContent(moduleId: string): React.ComponentType | null {
  return MODULE_CONTENTS[moduleId] || null;
}
```

- [ ] **Step 3: Skip type-check until module files exist (Tasks 3+)**

This index will fail until module files are created. That's expected.

- [ ] **Step 4: Commit**

```bash
git add lib/modules/_template.tsx lib/modules/index.ts
git commit -m "feat(modules): add scaffold helper and full registry (will fail until module files exist)"
```

---

### Task 3: Author the reference module `1-1-how-the-internet-works` (Tier A)

**Files:**
- Create: `lib/modules/1-1-how-the-internet-works.tsx`

- [ ] **Step 1: Create the file**

The component must export `Module_1_1_Content` and contain in order:

1. **Problem statement card** — A 4-paragraph narrative starting "When you type `roadmap.sh` into your browser…" Walks through what the user *sees* (instant page) vs what *actually happens* (DNS lookup → TCP handshake → HTTP request → server response → render). Closes with: "This module is the layered map of that 200ms."

2. **`StepByStepExplanation`** with title "From URL to pixels" and 6 steps:
   - Step 1: "You type a URL" — keystroke handling, autocomplete hint
   - Step 2: "DNS resolution" — recursive resolver, root → TLD → authoritative
   - Step 3: "TCP handshake" — SYN, SYN-ACK, ACK
   - Step 4: "TLS handshake (for HTTPS)" — ClientHello, ServerHello, certificate, key exchange
   - Step 5: "HTTP request" — methods, headers, body
   - Step 6: "Server response → render" — status, headers, body, browser parses
   Each step has a `title`, `description` (3–4 sentences), and a small `code` snippet of the relevant artifact (a `dig` line for DNS, a raw HTTP request, etc.).

3. **`HTMLPlayground`** with title "Watch the network tab". Provide an HTML page with three buttons that `fetch()` from `https://httpbin.org/get`, `https://httpbin.org/headers`, and `https://httpbin.org/ip`, and print the response into a `<pre>`. Code uses vanilla JS only.

4. **`InteractiveDiagram`** showing nodes: `Browser → Local DNS → Recursive Resolver → Root → TLD → Authoritative → Recursive Resolver → Browser → Web Server`. Use a static layout (one row of nodes) with animated edges. Use `@xyflow/react` like `BrowserRenderingPipeline` already does.

5. **Two `Challenge` components:**
   - "What is DNS' job in one sentence?" with 4 options. Correct: "Translate human-readable names into IP addresses."
   - "Why does HTTPS need a TLS handshake?" with 4 options. Correct: "To agree on encryption keys and verify the server's identity."

6. **`KeyTakeaways`** with 5 points and mental model: "The internet is a layered postal service: DNS finds the address, TCP delivers reliably, HTTPS seals the envelope, HTTP is the letter inside."

The file must use `"use client"`. Aim for 600–900 lines.

- [ ] **Step 2: Verify the page renders**

Run: `npm run dev` (background)
Open: `http://localhost:3000/lesson/1-1-how-the-internet-works` (or 3001)
Expected: Module page loads, all six sections visible, no console errors, playground iframes successfully.

- [ ] **Step 3: Commit**

```bash
git add lib/modules/1-1-how-the-internet-works.tsx
git commit -m "feat(modules): author reference module 1-1 (How the Internet Works)"
```

---

### Tasks 4–32: Author Tier-B scaffold modules

Each scaffold module is a separate task, identical in structure. **Sub-agents authoring these tasks must use `ScaffoldModule` from `_template.tsx`.** Each scaffold file follows this exact pattern:

```tsx
"use client";

import { ScaffoldModule } from "./_template";
import { HTMLPlayground } from "@/components/CodePlayground"; // or another body element
import { CodeBlock } from "@/components/CodeBlock";

export function Module_<X>_<Y>_Content() {
  return (
    <ScaffoldModule
      emoji="..."
      problemTitle="..."
      problem={<><p>...</p><p>...</p></>}
      body={/* one playground OR diagram OR CodeBlock */}
      challenge={{
        question: "...",
        options: [
          { id: "a", text: "..." },
          { id: "b", text: "..." },
          { id: "c", text: "..." },
          { id: "d", text: "..." },
        ],
        correctAnswerId: "b",
        explanation: <>...</>,
      }}
      takeaways={[<>...</>, <>...</>, <>...</>]}
      mentalModel="..."
      roadmapUrl="https://roadmap.sh/frontend"
    />
  );
}
```

The 29 scaffold tasks use these IDs and topical hooks (the **problem statement** must hit the listed pain point; the **body** uses the listed primitive):

| # | Module ID | Problem hook (what to write) | Body primitive |
|---|---|---|---|
| 4 | `1-2-http-and-https` | Why every API conversation has the same 3-act shape | `CodeBlock` of a raw HTTP/1.1 request + response |
| 5 | `1-3-domain-dns-hosting` | "I bought a domain. Now what?" — A → IP, CNAME → alias, hosting types | `CodeBlock` of `dig example.com +short` output |
| 6 | `1-4-browsers-and-rendering` | What turns text into pixels: parse → DOM → CSSOM → render → layout → paint | `BrowserRenderingPipeline` from `InteractiveDiagram.tsx` |
| 7 | `2-1-html-basics-and-semantics` | `<div>` soup vs. landmark elements | `HTMLPlayground` with semantic vs non-semantic side by side |
| 8 | `2-2-forms-and-validation` | The browser ships a free validator — most apps reinvent it badly | `HTMLPlayground` showing `required`, `pattern`, `type="email"` |
| 9 | `2-3-accessibility` | Keyboard-only users can't use 70% of the modern web | `HTMLPlayground` with a focus-trap demo |
| 10 | `2-4-seo-basics` | Why `<title>`, `<meta description>`, headings, and OG tags matter | `CodeBlock` of a complete `<head>` |
| 11 | `3-1-css-fundamentals` | The cascade is a sort, not a guess | `HTMLPlayground` showing specificity collisions |
| 12 | `3-2-flexbox-and-grid` | One-D vs two-D layout, with two examples | `HTMLPlayground` with a flex row + a grid |
| 13 | `3-3-responsive-design` | Mobile-first thinking, container queries | `HTMLPlayground` with a container-query demo |
| 14 | `3-4-writing-css-modern` | Tailwind / CSS Modules / CSS-in-JS / styled-components — pick one on purpose | `CodeBlock` showing the same button in 3 styling systems |
| 15 | `3-5-css-architecture-and-preprocessors` | BEM, Sass, PostCSS — what each actually does | `CodeBlock` of BEM + Sass nesting + a PostCSS plugin |
| 16 | `4-1-javascript-fundamentals` | Closures, scope, `this` — the three things every interview asks | `HTMLPlayground` with a counter using closure |
| 17 | `4-2-dom-and-events` | Event delegation: one listener, many children | `HTMLPlayground` with a delegated click handler |
| 18 | `4-3-fetch-and-async` | XHR → Promise → async/await | `HTMLPlayground` calling `fetch('https://httpbin.org/get')` |
| 19 | `5-1-git-and-github` | Branch, commit, push, PR — the muscle memory of the trade | `CodeBlock` with annotated git log |
| 20 | `5-2-package-managers` | npm vs pnpm vs yarn; lockfiles and semver | `CodeBlock` of a `package.json` + lockfile snippet |
| 21 | `5-3-pick-a-framework` | React/Vue/Angular/Svelte/Solid/Qwik — when to pick which | `CodeBlock` showing "hello, name" in three frameworks |
| 22 | `5-4-typescript` | The error you didn't ship is the test you didn't write | `CodeBlock` of a TS narrowing example |
| 23 | `6-1-linters-and-formatters` | ESLint catches; Prettier formats; never the same job | `CodeBlock` of an `eslint.config.js` excerpt |
| 24 | `6-2-module-bundlers` | What "bundling" means in 2026 (Vite vs Webpack vs esbuild) | `CodeBlock` of a `vite.config.ts` |
| 25 | `6-3-testing` | The pyramid: unit / integration / E2E | `CodeBlock` showing the same behavior tested at 3 levels |
| 26 | `6-4-authentication` | JWT vs session cookies vs OAuth — pick on purpose | `CodeBlock` decoding a sample JWT payload |
| 27 | `6-5-web-security` | XSS, CSRF, CSP — the OWASP top three for the frontend | `CodeBlock` of a CSP header + a sanitization example |
| 28 | `7-1-web-components` | Custom Elements, Shadow DOM, `<template>` — the platform's own component model | `HTMLPlayground` defining a `<my-counter>` element |
| 29 | `7-2-ssr` | Where a page renders changes everything | `CodeBlock` of a Next.js server component |
| 30 | `7-3-graphql` | One query, exactly the data you need | `CodeBlock` of a GraphQL query + JSON response |
| 31 | `7-4-static-site-generators` | Astro / Eleventy / Next-export — pre-render at build, ship HTML | `CodeBlock` of an Astro page |
| 32 | `7-5-pwas-and-browser-apis` | Service workers, storage, sockets — turning a tab into an app | `CodeBlock` of a service worker registering + a fetch handler |
| 33 | `7-6-mobile-apps` | React Native vs Flutter vs Ionic | `CodeBlock` of a "hello" screen in two of them |
| 34 | `7-7-desktop-apps` | Electron vs Tauri — Chromium-everywhere vs native-shell | `CodeBlock` of a Tauri `main.rs` and an Electron `main.js` |
| 35 | `7-8-performance` | LCP, INP, CLS — and how Lighthouse measures them | `CodeBlock` of a Lighthouse JSON excerpt |

Each scaffold task uses this 5-step pattern:

- [ ] **Step 1: Create `lib/modules/<id>.tsx` using `ScaffoldModule`**
- [ ] **Step 2: Verify import resolves**

Run: `npx tsc --noEmit lib/modules/<id>.tsx` (or full project tsc)
Expected: No errors in this file.

- [ ] **Step 3: Visit `/lesson/<id>` in dev server**
Expected: Page renders without runtime errors. Challenge accepts an answer and shows feedback.

- [ ] **Step 4: Commit**

```bash
git add lib/modules/<id>.tsx
git commit -m "feat(modules): scaffold <id>"
```

---

### Task 36: Update `CLAUDE.md` and `README.md` for new identity

**Files:**
- Modify: `CLAUDE.md` (replace entirely)
- Modify: `README.md` (replace entirely)
- Delete: `IMPLEMENTATION_GUIDE.md` if it's still JavaFX-only

- [ ] **Step 1: Rewrite `CLAUDE.md`**

Must cover:
- Project description (frontend learning app, mirrors roadmap.sh/frontend)
- 7-phase, 30-module curriculum overview (don't list every module — link to `lib/curriculum.ts`)
- The Tier A vs Tier B authoring distinction
- Module template (`ScaffoldModule` for Tier B; full template for Tier A)
- How to add a new module (create file → register in index → page picks it up)
- How to run: `npm run dev`, port 3001
- Drop all JavaFX-specific references

- [ ] **Step 2: Rewrite `README.md`**

Short and punchy: title, one-paragraph description, "Run it locally" section, link to roadmap.sh and to the design spec under `docs/superpowers/specs/`.

- [ ] **Step 3: Decide on `IMPLEMENTATION_GUIDE.md`**

If it's JavaFX-specific (likely), delete it. Otherwise rewrite for frontend.

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md README.md IMPLEMENTATION_GUIDE.md
git commit -m "docs: rewrite CLAUDE.md and README for frontend-roadmap pivot"
```

---

### Task 37: Build & lint verification

- [ ] **Step 1: Run lint**

Run: `npm run lint`
Expected: Zero errors. Warnings about prefer-const or unused vars in module content can be auto-fixed (`npm run lint -- --fix`) and re-committed.

- [ ] **Step 2: Run build**

Run: `npm run build`
Expected: Build succeeds. All 30 lesson routes statically generated (Next.js will report them).

- [ ] **Step 3: Smoke-test the dev server**

Run: `npm run dev` (background)
Click through:
1. Dashboard — shows 7 phases, 30 module cards. No "lock" icons on Phase 1.
2. `/lesson/1-1-how-the-internet-works` — full reference module renders, playground works.
3. `/lesson/7-8-performance` — last scaffold module renders.

- [ ] **Step 4: Commit any lint/build fixes**

```bash
git add -p
git commit -m "fix: lint and build pass after curriculum widening"
```

---

## §5. Self-review

- **Spec coverage:** Spec said 24 modules across 6 phases — this plan widens to 30/7 to match the roadmap PDF, which the user explicitly asked me to verify against. Spec is updated implicitly via this plan's §1 coverage table; I'll note the variance in the final commit message rather than rewriting the spec.
- **Placeholder scan:** Every Tier-B task lists exact problem hook + body primitive in the table; no "TODO" left.
- **Type consistency:** Module IDs in the registry (Task 2) match the IDs in the curriculum (Task 1) and the file names in Tasks 3–35. Component names follow `Module_<X>_<Y>_Content` (where X is phase, Y is order). Scaffold prop shapes match the `ScaffoldModule` interface in Task 2.
- **Risk:** Phase 7 has 8 modules; that's the heaviest phase. Sub-agents can run these in parallel since each scaffold is independent.
