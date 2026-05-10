# Orientation & Spec Deliverables Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Phase 0 orientation module (`0-1-the-map`), the supporting catalog/outcomes/CLAUDE.md edits, and the dashboard "Start here" callout — independent of the reference-app work. Ships a runnable orientation lesson on the dashboard.

**Architecture:** A new module file slots into the existing `MODULE_CONTENTS` registry; `lib/curriculum.ts` gains a `Phase` with `id: 0`; the dashboard splits its render to surface Phase 0 separately above the Phase 1–7 grid. Concept catalog and learning outcomes get the orientation entries plus the ten capstone-vocabulary entries (the capstone modules will use them in Plan 3, but the catalog is one file and is cheaper to add to once).

**Tech Stack:** Next.js 15 App Router (existing), TypeScript (strict), Tailwind, shadcn/ui, lucide-react. Existing primitives: `LayeredFlow`, `KeyTakeaways`, `CodeComparison`. No new components.

**Spec reference:** `docs/superpowers/specs/2026-05-10-end-to-end-app-walkthrough-design.md`

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `lib/curriculum.ts` | Modify | Add Phase 0 entry with `0-1-the-map` module metadata |
| `lib/modules/0-1-the-map.tsx` | Create | The 5-section orientation module content |
| `lib/modules/index.ts` | Modify | Register `Module_0_1_Content` in `MODULE_CONTENTS` |
| `app/page.tsx` | Modify | Render Phase 0 separately above the phase grid as a "Start here" callout |
| `docs/superpowers/specs/2026-05-09-concept-catalog.md` | Modify | Add 13 entries: 3 orientation (source life, build life, runtime life) + 10 capstone vocabulary |
| `docs/superpowers/specs/2026-05-09-learning-outcomes.md` | Modify | Add Bloom-verb outcome block for `0-1-the-map` |
| `CLAUDE.md` | Modify | Document the orientation-module 5-section exception |

No tests are added in this plan: the existing project has no test suite (per `CLAUDE.md` quality gates: lint + tsc + build + manual smoke), and the orientation module is content, not behavior. Verification is `npm run lint`, `npx tsc --noEmit`, `npm run build`, and a manual visit to `/lesson/0-1-the-map`.

---

## Task 1: Add Phase 0 to `lib/curriculum.ts`

**Files:**
- Modify: `lib/curriculum.ts:28`

- [ ] **Step 1: Read the current file to confirm the `curriculum: Phase[]` array start**

Run: `head -35 lib/curriculum.ts`
Expected: line 28 shows `export const curriculum: Phase[] = [` followed by Phase 1 starting on the next line.

- [ ] **Step 2: Insert Phase 0 as the first entry in the array**

Edit `lib/curriculum.ts`. Find the line:

```ts
export const curriculum: Phase[] = [
  {
    id: 1,
    title: "Internet & Web Foundations",
```

Insert a new Phase 0 block before Phase 1, so the file reads:

```ts
export const curriculum: Phase[] = [
  {
    id: 0,
    title: "Orientation",
    description: "A 10-minute map of what you're about to learn",
    icon: "Map",
    modules: [
      {
        id: "0-1-the-map",
        title: "The Map: How Modern Frontend Apps Are Shaped",
        description: "Three lives of an app: written, built, running",
        phase: 0,
        order: 1,
        duration: "10 mins",
        prerequisites: [],
        learningObjectives: [
          "Name the three lives of a modern frontend app (source, build, runtime)",
          "Map each curriculum phase onto the architecture diagram",
          "Recognize what 'modern' is adding on top of plain HTML+JS",
        ],
        mentalModels: [
          "Source code, bundle, and running app are three different things",
          "Each life has its own debugging surface",
          "The build step is the hinge between writing and running",
        ],
        hasInteractiveDemo: false,
        hasDiagram: true,
        hasChallenge: false,
        hasCodeComparison: true,
        roadmapUrl: ROADMAP,
      },
    ],
  },
  {
    id: 1,
    title: "Internet & Web Foundations",
```

- [ ] **Step 3: Run typecheck to verify the schema still validates**

Run: `npx tsc --noEmit`
Expected: zero errors. The `Phase` interface accepts `id: number`, so `0` is valid.

- [ ] **Step 4: Commit**

```bash
git add lib/curriculum.ts
git commit -m "feat(curriculum): add Phase 0 orientation entry"
```

---

## Task 2: Add the `Map` icon mapping in `app/page.tsx`

The dashboard's `ICONS` map (line 12 of `app/page.tsx`) needs a `Map` entry so Phase 0's icon resolves. Without this, the icon falls back to `Globe`.

**Files:**
- Modify: `app/page.tsx:10-23`

- [ ] **Step 1: Read the current ICONS block to confirm shape**

Run: `sed -n '10,24p' app/page.tsx`
Expected: import line with `Globe, Zap, Sparkles, ...` and an `ICONS` const that maps strings to those imports.

- [ ] **Step 2: Add `Map` to the lucide-react import and to ICONS**

Edit `app/page.tsx`. Replace:

```ts
import { Globe, Zap, Sparkles, Server, Layers, Check, BookMarked, Clock, Code2, Palette, Wrench, Boxes, Shield } from "lucide-react";

const ICONS = {
  Globe,
  Zap,
  Sparkles,
  Server,
  Layers,
  Code2,
  Palette,
  Wrench,
  Boxes,
  Shield,
};
```

with:

```ts
import { Globe, Zap, Sparkles, Server, Layers, Check, BookMarked, Clock, Code2, Palette, Wrench, Boxes, Shield, Map as MapIcon } from "lucide-react";

const ICONS = {
  Globe,
  Zap,
  Sparkles,
  Server,
  Layers,
  Code2,
  Palette,
  Wrench,
  Boxes,
  Shield,
  Map: MapIcon,
};
```

The alias `Map as MapIcon` avoids a name collision with the JS `Map` global.

- [ ] **Step 3: Verify lint and typecheck pass**

Run: `npm run lint && npx tsc --noEmit`
Expected: zero errors.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat(dashboard): register Map icon for Phase 0"
```

---

## Task 3: Create the orientation module file

This is the bulk of the content work. The module is 5 sections (no playground, no challenges) per spec §5.1 / §9. It uses the existing `LayeredFlow`, `CodeComparison`, and `KeyTakeaways` primitives. Copy follows CLAUDE.md voice rules (English, "you" not "we", concrete-then-abstract, no emojis in module file, escaped JSX entities).

**Files:**
- Create: `lib/modules/0-1-the-map.tsx`

- [ ] **Step 1: Create the new file with full content**

Create `lib/modules/0-1-the-map.tsx`:

```tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { LayeredFlow, FlowStage } from "@/components/LayeredFlow";
import { CodeComparison } from "@/components/CodeComparison";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { RoadmapLink } from "@/components/RoadmapLink";
import Link from "next/link";

export function Module_0_1_Content() {
  // Data blocks hoisted out of JSX for readability — listed in render order.
  const mapStages: FlowStage[] = [
    { label: "Source", detail: "TS / JSX, CSS, images, env files", color: "blue" },
    { label: "Build", detail: "Vite or Next compiler → JS chunks, CSS, hashed assets", color: "violet" },
    { label: "Deploy", detail: "Static files on a CDN + serverless functions", color: "emerald" },
    { label: "Request", detail: "DNS → server → HTML → JS → hydration", color: "amber" },
    { label: "Runtime", detail: "Components → state → fetch → re-render → navigation", color: "rose" },
  ];

  const beforeAfter = {
    title: "What 'modern' is adding",
    leftTitle: "2010 frontend",
    rightTitle: "2026 frontend",
    leftCode: `<!-- index.html -->
<!doctype html>
<html>
  <head>
    <link rel="stylesheet" href="styles.css">
    <script src="app.js" defer></script>
  </head>
  <body>
    <h1>My site</h1>
  </body>
</html>

<!-- That's it. Three files, no build,
     served as-is from a single server. -->`,
    rightCode: `// You write this:
// app/page.tsx
export default async function Home() {
  const posts = await db.post.findMany();
  return <PostList posts={posts} />;
}

// The browser receives:
//   index.html      (server-rendered)
//   _next/chunks/*.js   (10+ split chunks)
//   _next/css/*.css     (purged + hashed)
//   _next/image/*       (optimized images)
//   /api/...            (serverless calls)
//
// All of which is built, bundled,
// deployed, and stitched together
// by the framework you chose.`,
    leftLanguage: "html" as const,
    rightLanguage: "tsx" as const,
  };

  const phasePreviews = [
    { phase: 1, title: "Internet & Web Foundations", firstModuleId: "1-1-how-the-internet-works", maps: "How the Request reaches the server" },
    { phase: 2, title: "HTML", firstModuleId: "2-1-html-basics-and-semantics", maps: "What the Source is written in (structure)" },
    { phase: 3, title: "CSS", firstModuleId: "3-1-css-fundamentals", maps: "What the Source is written in (style)" },
    { phase: 4, title: "JavaScript", firstModuleId: "4-1-javascript-fundamentals", maps: "What the Source is written in (behavior)" },
    { phase: 5, title: "Workflow & Frameworks", firstModuleId: "5-1-git-and-github", maps: "How you organize the Source and pick a framework" },
    { phase: 6, title: "Build, Test & Secure", firstModuleId: "6-1-linters-and-formatters", maps: "How the Source becomes the Build, plus tests and security" },
    { phase: 7, title: "Beyond the Browser & Production", firstModuleId: "7-1-web-components", maps: "Where the app Runs (server, edge, mobile, desktop)" },
    { phase: 8, title: "How a Modern Frontend App Works (Capstone)", firstModuleId: "8-1-the-build-pipeline", maps: "All five stages stitched together using a real reference app" },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Hook */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-base leading-relaxed">
            Open any modern web app, hit F12, and watch the Network tab. You will see hundreds of files
            flying in: HTML, dozens of JavaScript chunks, CSS, fonts, optimized images, calls to APIs you
            cannot see in the source code. None of those files exist as such in the developer&apos;s
            editor. So what happens between the developer typing <code>git push</code> and a user&apos;s
            screen lighting up?
          </p>
          <p className="text-base leading-relaxed mt-4">
            This is the question the next 30 modules answer, one piece at a time. Before you start, take
            ten minutes here to see the whole picture. You will return to this map after every phase.
          </p>
        </CardContent>
      </Card>

      {/* 2. Mental model */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-base leading-relaxed">
            A modern frontend app does not exist in one place. The code you write in your editor is not
            the code that runs in a browser. The code that runs in a browser is not the same as the code
            that runs on the server. Each form has its own rules, its own debugging tools, and its own
            failure modes. Mistaking one form for another is the source of nine out of ten frontend
            bugs that confuse beginners.
          </p>
          <blockquote className="mt-4 border-l-4 border-blue-500 pl-4 italic text-slate-700 dark:text-slate-300">
            A modern frontend app has three lives — written life (source), built life (bundle), and
            running life (browser + server). Each life has its own rules and its own debugging tools.
          </blockquote>
        </CardContent>
      </Card>

      {/* 3. The map */}
      <LayeredFlow
        title="The five stages every modern frontend app passes through"
        description="Every box on this diagram is a topic you will learn in detail. Phase 8 stitches them all together."
        stages={mapStages}
        direction="horizontal"
      />

      {/* Optional: Before/after — what 'modern' is adding */}
      <CodeComparison
        title={beforeAfter.title}
        leftTitle={beforeAfter.leftTitle}
        rightTitle={beforeAfter.rightTitle}
        leftCode={beforeAfter.leftCode}
        rightCode={beforeAfter.rightCode}
        leftLanguage={beforeAfter.leftLanguage}
        rightLanguage={beforeAfter.rightLanguage}
      />

      {/* 4. Curriculum preview */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-3">How the curriculum maps onto the diagram</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Each phase teaches one or more boxes from the map. Click any phase to jump to its first
            module. The recommended order is top to bottom, but the modules are unlocked — skip around
            if a topic pulls you in.
          </p>
          <ul className="space-y-3">
            {phasePreviews.map((p) => (
              <li key={p.phase} className="flex items-start gap-3">
                <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 rounded px-2 py-1 mt-0.5 shrink-0">
                  Phase {p.phase}
                </span>
                <div className="flex-1">
                  <Link
                    href={`/lesson/${p.firstModuleId}`}
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    {p.title}
                  </Link>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{p.maps}</p>
                </div>
              </li>
            ))}
          </ul>
          <RoadmapLink url="https://roadmap.sh/frontend" />
        </CardContent>
      </Card>

      {/* 5. KeyTakeaways */}
      <KeyTakeaways
        points={[
          "The same app exists in three forms — source, bundle, and running app — and each form has its own debugging surface.",
          "&apos;Frontend&apos; today means more than the browser: a build step and often a server are part of the picture.",
          "You will learn each layer in isolation across Phases 1–7, then watch them stitch together in Phase 8 using a real reference app.",
          "Skip around if you want. Modules are unlocked; the recommended order is just a recommendation.",
        ]}
        mentalModel="A modern frontend app has three lives — written life (source), built life (bundle), and running life (browser + server). Each life has its own rules and its own debugging tools."
      />
    </div>
  );
}
```

- [ ] **Step 2: Read `components/CodeComparison.tsx` to confirm the prop names match**

Run: `sed -n '1,40p' components/CodeComparison.tsx`
Expected: an interface with at least `title`, `leftTitle`, `rightTitle`, `leftCode`, `rightCode`, and language props. **If the actual prop names differ, adjust the call site in step 1 to match — do NOT modify CodeComparison.**

- [ ] **Step 3: Verify lint passes (Vietnamese guard, ESLint, no-unescaped-entities)**

Run: `npm run lint`
Expected: zero errors.

If `react/no-unescaped-entities` flags an apostrophe in JSX text, replace it with `&apos;` per CLAUDE.md.

- [ ] **Step 4: Verify typecheck passes**

Run: `npx tsc --noEmit`
Expected: zero errors.

- [ ] **Step 5: Commit**

```bash
git add lib/modules/0-1-the-map.tsx
git commit -m "feat(modules): add 0-1-the-map orientation module"
```

---

## Task 4: Register the orientation module in `lib/modules/index.ts`

**Files:**
- Modify: `lib/modules/index.ts:1-71`

- [ ] **Step 1: Read the current file**

Run: `cat lib/modules/index.ts`
Expected: imports for Module_1_1_Content through Module_7_8_Content, then a `MODULE_CONTENTS` record.

- [ ] **Step 2: Add the import**

Edit `lib/modules/index.ts`. After line 2 (`import React from "react";`) and before the existing module imports, add:

```ts
import { Module_0_1_Content } from "./0-1-the-map";
```

So the top of the imports section reads:

```ts
import React from "react";

import { Module_0_1_Content } from "./0-1-the-map";
import { Module_1_1_Content } from "./1-1-how-the-internet-works";
```

- [ ] **Step 3: Add the registry entry**

In the `MODULE_CONTENTS` object, add as the first entry:

```ts
export const MODULE_CONTENTS: Record<string, React.ComponentType> = {
  "0-1-the-map": Module_0_1_Content,
  "1-1-how-the-internet-works": Module_1_1_Content,
  ...
```

- [ ] **Step 4: Verify build still works**

Run: `npm run build`
Expected: build succeeds, no errors. Look for `/lesson/[moduleId]` in the routes output.

- [ ] **Step 5: Commit**

```bash
git add lib/modules/index.ts
git commit -m "feat(modules): register 0-1-the-map in MODULE_CONTENTS"
```

---

## Task 5: Manual smoke test the orientation lesson

**Files:** none modified.

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`
Expected: server listens on port 3000 (or 3001 if 3000 is taken).

- [ ] **Step 2: Visit the lesson page directly**

Open: `http://localhost:3000/lesson/0-1-the-map`
Expected:
- Page renders without console errors.
- Five sections visible in order: Hook, Mental model (with blockquote), the LayeredFlow diagram with five colored stages, the CodeComparison "What 'modern' is adding" block, the curriculum preview list with eight phase entries, the KeyTakeaways block.
- Clicking any phase link in the preview navigates to the corresponding lesson (404 is acceptable for `8-1-the-build-pipeline` since that module doesn&apos;t exist yet).
- No emojis in the module body itself (the `KeyTakeaways` component renders its own 🎓/💡 icons — that&apos;s the component, not the module).

- [ ] **Step 3: Stop the dev server**

Press `Ctrl+C` in the terminal running `npm run dev`.

- [ ] **Step 4: No commit needed (no files changed).**

---

## Task 6: Surface Phase 0 above the phase grid in the dashboard

The dashboard currently iterates `curriculum` and renders every phase identically. Phase 0 should appear **above** the regular grid as a single prominent "Start here" tile, and the regular grid should iterate Phases 1–7 only.

**Files:**
- Modify: `app/page.tsx:90-200`

- [ ] **Step 1: Read the current dashboard render to locate the curriculum loop**

Run: `sed -n '88,120p' app/page.tsx`
Expected: `<div className="space-y-6">` wrapping `{curriculum.map((phase) => { ... })}`.

- [ ] **Step 2: Split Phase 0 from the rest of the curriculum**

Edit `app/page.tsx`. Find the line:

```tsx
        <div className="space-y-6">
          {curriculum.map((phase) => {
```

Replace the opening of that block with:

```tsx
        {/* Start here: Phase 0 orientation, surfaced above the regular grid */}
        {curriculum
          .filter((phase) => phase.id === 0)
          .flatMap((phase) => phase.modules)
          .map((module) => {
            const isCompleted = completedModules.includes(module.id);
            return (
              <Card key={module.id} className="mb-8 border-violet-200 dark:border-violet-900 bg-gradient-to-br from-violet-50 to-blue-50 dark:from-violet-950 dark:to-blue-950">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-violet-500 rounded-lg">
                      <MapIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-violet-500 hover:bg-violet-600">Start here</Badge>
                        <span className="text-xs text-slate-600 dark:text-slate-400">{module.duration}</span>
                      </div>
                      <h2 className="text-xl font-semibold mb-2">{module.title}</h2>
                      <p className="text-slate-700 dark:text-slate-300 mb-4">{module.description}</p>
                      <Link href={`/lesson/${module.id}`}>
                        <Button variant={isCompleted ? "secondary" : "default"}>
                          {isCompleted ? "Re-read the map" : "Read the map (10 min)"}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

        <div className="space-y-6">
          {curriculum
            .filter((phase) => phase.id !== 0)
            .map((phase) => {
```

(The rest of the loop body stays the same; only the source array changes.)

- [ ] **Step 3: Verify the closing braces still match**

Run: `npx tsc --noEmit`
Expected: zero errors. If TS reports a brace mismatch, the closing `})}` of the original loop is still in place — the change above only adds new code before it and changes `curriculum.map` to `curriculum.filter(...).map`.

- [ ] **Step 4: Verify lint passes**

Run: `npm run lint`
Expected: zero errors.

- [ ] **Step 5: Manual smoke test the dashboard**

Run: `npm run dev` and open `http://localhost:3000`.
Expected:
- A single "Start here" violet/blue card appears above the regular phase grid, showing the orientation module title, description, duration, and a "Read the map (10 min)" button.
- The regular grid below shows Phases 1–7 (no Phase 0 duplicated).
- Clicking the "Read the map" button opens `/lesson/0-1-the-map`.
- The total-progress percentage at the top still computes correctly (Phase 0&apos;s single module is now part of the total, so 0/30 becomes 0/31).

Stop the dev server with `Ctrl+C`.

- [ ] **Step 6: Commit**

```bash
git add app/page.tsx
git commit -m "feat(dashboard): surface Phase 0 as a Start-here callout above the phase grid"
```

---

## Task 7: Add concept-catalog entries

The catalog file is the single source of truth for cross-module vocabulary. Adding the orientation entries here also adds the ten capstone-vocabulary entries (Plan 3 will reference them).

**Files:**
- Modify: `docs/superpowers/specs/2026-05-09-concept-catalog.md`

- [ ] **Step 1: Read the current catalog structure to copy the entry shape**

Run: `head -60 docs/superpowers/specs/2026-05-09-concept-catalog.md`
Expected: a markdown file where each term is structured as:

```markdown
### *term name*

> One-line canonical definition.

- **Owner:** module ID where the term is first defined
- **Italicize on first use elsewhere?** yes / no
```

(If the actual structure differs, **match the existing structure** — do not impose a new shape.)

- [ ] **Step 2: Append the 13 new entries at the end of the catalog**

Append the following block to `docs/superpowers/specs/2026-05-09-concept-catalog.md`. **Re-format each entry to match the existing entry shape** observed in step 1; the content below is the canonical text only.

Orientation entries (owned by `0-1-the-map`):

- **source life** — the form of the app as files in the developer&apos;s editor: `.ts`, `.tsx`, `.css`, `.png`, `.env`. Not directly runnable in any browser.
- **built life (bundle)** — the form of the app after the build step: hashed JavaScript chunks, purged CSS, optimized assets, the `.next/` or `dist/` directory. This is what the CDN serves.
- **runtime life** — the form of the app while the user is using it: HTML in the document, JavaScript handlers attached to the DOM, requests in flight, state in React.

Capstone-vocabulary entries (owned by the corresponding capstone module — these are added now so they exist before authoring):

- **module graph** — the directed graph of all imports the bundler walks to discover what to ship; entry → imports → imports&apos; imports → leaves. _Owner: `8-1-the-build-pipeline`._
- **bundle** — the output of running the build: the set of files the CDN serves to a browser. Distinct from the source. _Owner: `8-1-the-build-pipeline`._
- **chunk** — a single JavaScript file in the bundle, produced by code-splitting the module graph along route or dynamic-import boundaries. _Owner: `8-1-the-build-pipeline`._
- **tree-shaking** — the bundler&apos;s removal of exports the module graph never reaches. Requires ESM and side-effect-free modules to work. _Owner: `8-1-the-build-pipeline`._
- **hydration mismatch** — when the HTML produced on the server differs from what React renders on the client at hydration time. Causes a visible flash and a console error. _Owner: `8-2-the-request-lifecycle`._
- **server component** — a React component that runs only on the server (or at build time) and ships zero JavaScript to the browser. Default in the Next.js App Router. _Owner: `8-3-the-architecture-of-a-real-app`._
- **client component** — a React component opted into running in the browser via `"use client"`. Hydrated and interactive. _Owner: `8-3-the-architecture-of-a-real-app`._
- **server action** — a function annotated `"use server"` that runs on the server and is callable from the client like a remote procedure. The form-submission shape that replaces hand-written `fetch` calls. _Owner: `8-3-the-architecture-of-a-real-app`._
- **optimistic UI** — updating the UI to reflect a user&apos;s action before the server confirms it; reconciling on response. Makes interactions feel instant at the cost of handling rollback. _Owner: `8-3-the-architecture-of-a-real-app`._
- **prefetch** — the framework fetching a route&apos;s code or data ahead of an explicit navigation, usually on hover or visibility, so the actual click resolves instantly. _Owner: `8-2-the-request-lifecycle`._

- [ ] **Step 3: Verify markdown still parses (no broken sections, no duplicate headings)**

Run: `grep -c '^###' docs/superpowers/specs/2026-05-09-concept-catalog.md`
Expected: a count that increased by 13 from before.

- [ ] **Step 4: Commit**

```bash
git add docs/superpowers/specs/2026-05-09-concept-catalog.md
git commit -m "docs(catalog): add orientation and capstone vocabulary entries"
```

---

## Task 8: Add learning outcomes for `0-1-the-map`

**Files:**
- Modify: `docs/superpowers/specs/2026-05-09-learning-outcomes.md`

- [ ] **Step 1: Read the current outcomes file to copy an entry shape**

Run: `head -40 docs/superpowers/specs/2026-05-09-learning-outcomes.md`
Expected: a markdown file with per-module outcome blocks of the shape:

```markdown
## `1-1-how-the-internet-works`

After this module the learner can:
- [recall] State what DNS, TCP, TLS, and HTTP each do, in one sentence each.
- [apply] Read a `dig +trace` output and identify which step of resolution failed.
- [judge] Choose between A and AAAA records for a given scenario.
- [debug] Given a "site won't load" symptom, name three diagnostic checks in the right order.
```

- [ ] **Step 2: Insert the `0-1-the-map` block at the top of the per-module sections**

Insert the following block before the `1-1-how-the-internet-works` section. **Match the existing heading shape and Bloom-tag prefix shape** observed in step 1; the content below is the canonical text only.

```markdown
## `0-1-the-map`

After this module the learner can:
- [recall] Name the three lives of a modern frontend app (source, build, runtime) and one example file or artifact for each.
- [recall] List the five stages on the architecture diagram (source → build → deploy → request → runtime) without looking.
- [apply] Given a curriculum phase, point to which stage(s) of the diagram it teaches.
- [judge] Identify what "modern" is adding compared to a 2010-style three-file site.
```

(Note: orientation outcomes skip the `[build]` and `[debug]` verbs because the module has no playground or challenge — those verbs are exercised in subsequent modules.)

- [ ] **Step 3: Commit**

```bash
git add docs/superpowers/specs/2026-05-09-learning-outcomes.md
git commit -m "docs(outcomes): add 0-1-the-map learning outcomes"
```

---

## Task 9: Document the orientation-module exception in `CLAUDE.md`

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Find the "Tier-A module template" section**

Run: `grep -n '## Tier-A module template' CLAUDE.md`
Expected: one match line number, e.g. `42:## Tier-A module template`.

- [ ] **Step 2: Add an exception note after the existing 7-section bullet list**

Find the existing block:

```markdown
Optional sections (sequence diagram, layered flow, code comparison, alternatives card) may appear between mandatory sections; mark them with an unnumbered comment, e.g. `{/* Optional: Sequence diagram (DNS resolution) */}`.
```

After that paragraph, insert:

```markdown

**Orientation modules (Phase 0) are an exception.** They follow a 5-section shape — Hook, Mental model, Map (a diagram), Curriculum preview, KeyTakeaways — and omit the playground and challenges, because the learner has not yet been introduced to the vocabulary the playground would exercise. This exception applies to Phase 0 only. All other modules — including Phase 8 capstone modules — follow the standard 7-section Tier-A template.
```

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "docs(CLAUDE): document orientation-module 5-section exception"
```

---

## Task 10: Final quality gates

Run all three project quality commands and the dev-server smoke test.

- [ ] **Step 1: Lint (includes Vietnamese guard)**

Run: `npm run lint`
Expected: zero errors.

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: build succeeds. Confirm `/lesson/[moduleId]` route still appears in output.

- [ ] **Step 4: Dev-server smoke test**

Run: `npm run dev` and confirm:
- `http://localhost:3000` renders the dashboard with the "Start here" callout above the Phase 1–7 grid.
- `http://localhost:3000/lesson/0-1-the-map` renders all five sections.

Stop the dev server.

- [ ] **Step 5: No commit needed for the gate run.** All work is committed in earlier tasks.

---

## Spec coverage check

| Spec section | Covered by |
|---|---|
| §3 Scope: orientation module `0-1-the-map` | Tasks 1, 3, 4, 5 |
| §3 Scope: dashboard Phase 0 callout | Tasks 2, 6 |
| §3 Scope: catalog additions (orientation entries) | Task 7 |
| §3 Scope: catalog additions (capstone vocabulary, deferred but co-located) | Task 7 |
| §3 Scope: learning outcomes for `0-1-the-map` | Task 8 |
| §3 Scope: CLAUDE.md orientation-module exception | Task 9 |
| §5.1 5-section orientation shape | Task 3 (file content) |
| §7.1 Phase 0 schema validation | Task 1 step 3 |
| §7.5 dashboard split render | Task 6 |
| §9 documented Tier-A exception | Task 9 |
| §10 verification (lint + tsc + build + manual smoke) | Task 10 |

Phase 8 capstone modules and the reference app are out of scope for this plan — they are Plan 2 and Plan 3.

---

## Out of scope (deferred)

- The reference app at `examples/taproot-blog/` (Plan 2).
- Capstone modules `8-1`, `8-2`, `8-3` (Plan 3).
- Dashboard "Capstone" badge for Phase 8 (Plan 3).
- Style review pass after all four new modules ship (Plan 3).
