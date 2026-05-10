# Capstone Modules and Final Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Author the three Phase 8 capstone modules (`8-1-the-build-pipeline`, `8-2-the-request-lifecycle`, `8-3-the-architecture-of-a-real-app`), surface Phase 8 on the dashboard with a "Capstone" badge, and run a style-review pass across all four new modules (Phase 0 + Phase 8). Each capstone module is full Tier-A (7 sections) and references the deployed `taproot-blog` reference app via GitHub permalinks pinned to the `taproot-blog-v1.0` tag.

**Architecture:** Three new module files under `lib/modules/`, each rendered through the existing `MODULE_CONTENTS` registry. The modules use only existing primitive components — `StepByStepExplanation`, `SequenceDiagram`, `LayeredFlow`, `TerminalPlayground`, `Challenge`, `GotchaList`, `KeyTakeaways`, `CodeBlock`, `CodeComparison`, `ReactPlayground`, `RoadmapLink`. Curriculum metadata for Phase 8 is added to `lib/curriculum.ts`. The dashboard renders Phase 8 in the regular grid with a small "Capstone" badge.

**Tech Stack:** Next.js 15 (existing), TypeScript (strict), Tailwind, shadcn/ui, lucide-react, framer-motion (used by `StepByStepExplanation`). No new dependencies.

**Spec reference:** `docs/superpowers/specs/2026-05-10-end-to-end-app-walkthrough-design.md` §5.2 / §5.3 / §5.4 / §5.5.

**Predecessor plans (must be completed first):**
1. `2026-05-10-orientation-and-spec-deliverables.md` — Phase 0 module, catalog/outcomes deltas, Map icon registered.
2. `2026-05-10-taproot-blog-reference-app.md` — reference app deployed and tagged `taproot-blog-v1.0`.

If either predecessor is incomplete, **stop** and finish them first. The capstone modules cannot be authored faithfully without (a) the catalog vocabulary entries Plan 1 added and (b) the deployed pinnable blog Plan 2 produced.

**Note on quoted code:** Several module step bodies quote excerpts from the reference app, including `<div dangerouslySetInnerHTML={{ __html: html }} />` in `PostBody.tsx`. That excerpt is safe in context because Plan 2 wires `rehype-sanitize` into the markdown pipeline (see Plan 2 Task 8 step 2). When transcribing the example into module copy, keep the surrounding prose that names the sanitization step so learners do not copy the snippet without understanding the precondition.

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `lib/curriculum.ts` | Modify | Add Phase 8 entry with three modules |
| `lib/modules/8-1-the-build-pipeline.tsx` | Create | Tier-A module (7 sections) |
| `lib/modules/8-2-the-request-lifecycle.tsx` | Create | Tier-A module (7 sections) |
| `lib/modules/8-3-the-architecture-of-a-real-app.tsx` | Create | Tier-A module (7 sections, 8 steps) |
| `lib/modules/index.ts` | Modify | Register the three new modules |
| `app/page.tsx` | Modify | Add a "Capstone" badge to Phase 8 tiles |
| `docs/superpowers/specs/2026-05-09-learning-outcomes.md` | Modify | Add outcome blocks for `8-1`, `8-2`, `8-3` |

The `Layers` icon is already in the dashboard's `ICONS` map (line 10 of `app/page.tsx`) and the catalog entries the modules cite are already in `2026-05-09-concept-catalog.md` (added by Plan 1 Task 7). Both predecessors are required.

---

## Variables that must be set before authoring

Before Task 3, look up these values from the predecessor plan and substitute them into module copy:

- `BLOG_URL` — the deployed Vercel preview URL (e.g. `https://taproot-blog.vercel.app`).
- `BLOG_REPO` — the GitHub repository URL where `examples/taproot-blog/` lives (e.g. `https://github.com/<user>/frontend-learning-app`).
- `BLOG_TAG_SHA` — the short SHA of the `taproot-blog-v1.0` tag, used as the `<commit>` segment in GitHub permalinks: `${BLOG_REPO}/blob/<commit>/examples/taproot-blog/app/...`.

Where module copy below uses `<BLOG_URL>`, `<BLOG_REPO>`, or `<BLOG_TAG_SHA>` as a placeholder, substitute the actual values before writing the file.

---

## Task 1: Add Phase 8 to `lib/curriculum.ts`

**Files:**
- Modify: `lib/curriculum.ts` (the closing `]` of the `curriculum` array)

- [ ] **Step 1: Confirm Phase 7 is the current last entry**

Run: `tail -50 lib/curriculum.ts`
Expected: Phase 7 ends with `8-performance` module, the closing `}` of the Phase, then `];` closing the array, then helper functions.

- [ ] **Step 2: Insert Phase 8 before the array closing `];`**

Edit `lib/curriculum.ts`. Find the lines:

```ts
        roadmapUrl: ROADMAP,
      },
    ],
  },
];
```

(That is the closing of Phase 7's last module, then the `]` and `}` of Phase 7, then the `];` of the `curriculum` array.)

Insert a new Phase 8 block before `];`:

```ts
        roadmapUrl: ROADMAP,
      },
    ],
  },
  {
    id: 8,
    title: "How a Modern Frontend App Works (Capstone)",
    description: "Build, request, architecture — one real app, three lenses",
    icon: "Layers",
    modules: [
      {
        id: "8-1-the-build-pipeline",
        title: "The Build Pipeline",
        description: "From source files to a deployed bundle: Vite, transforms, code-splitting, the module graph",
        phase: 8,
        order: 1,
        duration: "35 mins",
        prerequisites: ["6-2-module-bundlers"],
        learningObjectives: [
          "Trace what happens between writing TS and serving JS chunks to the browser",
          "Distinguish dev-mode (on-demand) from build-mode (exhaustive) module graph traversal",
          "Reason about chunk-splitting, tree-shaking, and asset hashing on a real app",
        ],
        mentalModels: [
          "Source code is what you write; the bundle is what runs",
          "The module graph is the bundler's mental model",
          "Build mode picks decisions the browser can't undo",
        ],
        hasInteractiveDemo: true,
        hasDiagram: true,
        hasChallenge: true,
        hasCodeComparison: true,
        roadmapUrl: ROADMAP,
      },
      {
        id: "8-2-the-request-lifecycle",
        title: "The Request Lifecycle",
        description: "URL → DNS → server → HTML → JS → hydration → interactive — the eight machines a single page passes through",
        phase: 8,
        order: 2,
        duration: "35 mins",
        prerequisites: ["7-2-ssr"],
        learningObjectives: [
          "Walk a request from URL bar to first interaction across DNS, CDN, server, browser parser, JS engine, and React",
          "Diagnose where time goes in a real DevTools waterfall",
          "Reason about hydration cost and identify what hydrates vs what stays server-only",
        ],
        mentalModels: [
          "A page appearing in the browser is a relay race across machines",
          "Hydration is wiring up server HTML on the client; it is not the same as render",
          "Time-to-interactive is not the same as time-to-LCP",
        ],
        hasInteractiveDemo: true,
        hasDiagram: true,
        hasChallenge: true,
        hasCodeComparison: false,
        roadmapUrl: ROADMAP,
      },
      {
        id: "8-3-the-architecture-of-a-real-app",
        title: "The Architecture of a Real App",
        description: "A folder-by-folder walk through the reference app: routing, server vs client, data, state, mutations, auth, deploy",
        phase: 8,
        order: 3,
        duration: "40 mins",
        prerequisites: ["8-2-the-request-lifecycle", "6-4-authentication"],
        learningObjectives: [
          "Read a Next.js App Router project and place every file on the architecture map",
          "Decide where new code belongs (server component, client component, server action) on purpose",
          "Distinguish URL state, server state, and client state and pick the right one for a feature",
        ],
        mentalModels: [
          "Folder structure encodes architectural decisions",
          "Server components and client components are a deliberate boundary, not a syntax detail",
          "State has three flavors; matching the flavor to the data shape avoids 90% of state-management pain",
        ],
        hasInteractiveDemo: true,
        hasDiagram: true,
        hasChallenge: true,
        hasCodeComparison: true,
        roadmapUrl: ROADMAP,
      },
    ],
  },
];
```

- [ ] **Step 3: Verify schema and helpers**

Run: `npx tsc --noEmit`
Expected: zero errors.

- [ ] **Step 4: Commit**

```bash
git add lib/curriculum.ts
git commit -m "feat(curriculum): add Phase 8 capstone metadata"
```

---

## Task 2: Confirm prerequisites are in place

This is a verification step before authoring the module files.

- [ ] **Step 1: Confirm Phase 0 module file exists**

Run: `ls lib/modules/0-1-the-map.tsx`
Expected: file exists. If not, **stop** — finish Plan 1 first.

- [ ] **Step 2: Confirm catalog entries are in place**

Run: `grep -E '(module graph|hydration mismatch|server component|client component|server action|optimistic UI|prefetch|tree-shaking|chunk|bundle)' docs/superpowers/specs/2026-05-09-concept-catalog.md`
Expected: 10 matches. If any are missing, **stop** — finish Plan 1 Task 7.

- [ ] **Step 3: Confirm the reference app is deployed and tagged**

Run: `git ls-remote --tags origin | grep taproot-blog`
Expected: `taproot-blog-v1.0` tag is present. If not, **stop** — finish Plan 2 Task 15.

- [ ] **Step 4: Capture the substitution variables**

Run:
```sh
COMMIT_SHA=$(git rev-parse --short taproot-blog-v1.0)
echo "BLOG_TAG_SHA=$COMMIT_SHA"
echo "BLOG_REPO=$(git remote get-url origin | sed 's/\.git$//')"
echo "BLOG_URL=<paste the deployed preview URL from Plan 2 Task 15>"
```

Record these three values; they are substituted into module copy below.

- [ ] **Step 5: No commit needed (verification only).**

---

## Task 3: Author `8-1-the-build-pipeline`

This is the longest task in the plan. The module is full Tier-A — 7 sections, all required pedagogy. Before writing, re-read `lib/modules/1-1-how-the-internet-works.tsx` to anchor the voice and section-comment style; new module copy should match.

**Files:**
- Create: `lib/modules/8-1-the-build-pipeline.tsx`

- [ ] **Step 1: Create the file with full content**

Create `lib/modules/8-1-the-build-pipeline.tsx`. **Substitute `<BLOG_URL>`, `<BLOG_REPO>`, and `<BLOG_TAG_SHA>` with the values captured in Task 2 step 4 before saving.**

Component skeleton:

```tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { StepByStepExplanation, Step } from "@/components/StepByStepExplanation";
import { LayeredFlow, FlowStage } from "@/components/LayeredFlow";
import { CodeComparison } from "@/components/CodeComparison";
import { TerminalPlayground, TerminalLine } from "@/components/TerminalPlayground";
import { Challenge } from "@/components/Challenge";
import { GotchaList } from "@/components/GotchaList";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { RoadmapLink } from "@/components/RoadmapLink";

export function Module_8_1_Content() {
  // Data blocks hoisted out of JSX for readability — listed in render order.
  // (data blocks below — see step 1a)

  return (
    <div className="space-y-8">
      {/* 1. Hook */}
      {/* 2. Mental model */}
      {/* 3. Step-by-step */}
      {/* Optional: One transform, made explicit (CodeComparison) */}
      {/* Optional: Module graph diagram (LayeredFlow) */}
      {/* 4. Playground (TerminalPlayground) */}
      {/* 5. Challenges (Challenge x 2) */}
      {/* 6. GotchaList */}
      {/* 7. KeyTakeaways */}
      {/* RoadmapLink + footer with reference-app link */}
    </div>
  );
}
```

Then, fill in each placeholder with the content blocks from steps 1a–1g below.

**Step 1a — Data blocks** (hoisted at the top of the component function):

```tsx
  const moduleGraphStages: FlowStage[] = [
    { label: "Entry", detail: "app/layout.tsx", color: "blue" },
    { label: "Imports", detail: "PostCard, db, types", color: "violet" },
    { label: "Imports' imports", detail: "@prisma/client, next/image", color: "emerald" },
    { label: "Leaves", detail: "node_modules, no further imports", color: "amber" },
  ];

  const transformsCompare = {
    leftCode: `// What you wrote (TS + JSX)
import { Post } from "@/lib/types";

export function PostCard({ post }: { post: Post }) {
  return <article>{post.title}</article>;
}`,
    rightCode: `// What the bundler ships (transformed JS)
import { jsx as _jsx } from "react/jsx-runtime";

export function PostCard({ post }) {
  return _jsx("article", { children: post.title });
}`,
  };

  const buildTrace: TerminalLine[] = [
    { command: "npm run build", output: "▲ Next.js 15.1.0", delayMs: 600 },
    { command: "", output: "✓ Compiled successfully", delayMs: 800 },
    { command: "", output: "✓ Linting and checking validity of types", delayMs: 600 },
    { command: "", output: "✓ Collecting page data", delayMs: 700 },
    { command: "", output: "✓ Generating static pages (8/8)", delayMs: 900 },
    { command: "", output: "✓ Finalizing page optimization", delayMs: 500 },
    { command: "ls .next/static/chunks/", output: "vendor-abc123.js  app/page-def456.js  app/admin/page-ghi789.js", delayMs: 700 },
  ];
```

**Step 1b — `buildPipelineSteps` (Step array, 6 entries):**

```tsx
  const buildPipelineSteps: Step[] = [
    {
      title: "Step 1: The source tree",
      description: (
        <>
          Open <code>examples/taproot-blog/app/</code> in the reference repo. Four kinds of files
          live there, none of which any browser can run as written: <code>.tsx</code> (TypeScript +
          JSX), Tailwind class strings (which look like utility names but are not real CSS), an
          imported <code>.svg</code> cover image, and an <code>.env</code> file the runtime reads.
          Every one of these files needs a transform before a browser sees anything.
        </>
      ),
      code: `examples/taproot-blog/app/
  app/(public)/posts/[slug]/page.tsx     # TS + JSX
  app/globals.css                        # @tailwind directives
  public/cover-1.svg                     # raw SVG, still needs hashing
  .env.example                           # secrets vs public split`,
      language: "bash",
    },
    {
      title: "Step 2: Three transforms",
      description: (
        <>
          The first job of the build pipeline is to translate every kind of source file into
          something a browser can actually run. <em>TypeScript</em> drops to JavaScript by erasing
          types. <em>JSX</em> compiles to <code>_jsx()</code> calls. <em>Tailwind</em> reads your
          source files, finds every class name you used, and emits a single CSS file containing
          only those rules. Three transforms, three distinct tools.
        </>
      ),
      code: `// Tailwind: classes used in your JSX
className="bg-violet-500 hover:bg-violet-600 text-white"

// becomes the only CSS rules emitted:
.bg-violet-500 { background-color: rgb(139 92 246); }
.hover\\:bg-violet-600:hover { background-color: rgb(124 58 237); }
.text-white { color: rgb(255 255 255); }`,
      language: "css",
    },
    {
      title: "Step 3: The module graph",
      description: (
        <>
          With files transformed, the bundler walks every import statement starting from each
          entry point. The result is a directed graph called the <em>module graph</em> — every
          file your app actually reaches via <code>import</code>. Code that nothing imports never
          enters the graph and never ships.
        </>
      ),
      code: `// Walking from app/(public)/posts/[slug]/page.tsx
page.tsx
  ├─ @/lib/db          → imports @prisma/client
  ├─ @/components/PostBody  → imports @/lib/markdown
  │                            ├─ remark
  │                            ├─ remark-rehype
  │                            ├─ rehype-sanitize
  │                            └─ rehype-stringify
  ├─ @/components/AuthorCard
  └─ @/components/CommentForm  → "use client" — separate chunk`,
      language: "bash",
    },
    {
      title: "Step 4: Dev mode (npm run dev)",
      description: (
        <>
          In dev, the bundler walks the module graph <strong>on demand</strong>. The browser asks
          for a file; the dev server transforms it just-in-time and returns native ES modules.
          Nothing is bundled. <em>HMR</em> (Hot Module Replacement) intercepts file saves and
          patches the running page without a full reload, preserving component state. This is the
          "edit, save, see it instantly" feel modern frameworks ship.
        </>
      ),
      code: `# Browser request: GET /src/components/PostCard.tsx
# Dev server: transforms TS → JS on the fly, returns:

import { jsx } from "/node_modules/react/jsx-runtime";
export function PostCard({ post }) {
  return jsx("article", { children: post.title });
}

# Edit + save → HMR pushes only this module's update
# Component state survives, page does not reload`,
      language: "javascript",
    },
    {
      title: "Step 5: Build mode (npm run build)",
      description: (
        <>
          In production, the bundler walks the entire graph <strong>exhaustively</strong>. It
          splits the result into <em>chunks</em> along route boundaries, removes exports that
          nothing reaches (<em>tree-shaking</em>), hashes every filename for cache-busting, and
          writes the result into a single output directory ready to serve from a CDN. This is the
          deliverable.
        </>
      ),
      code: `$ cd examples/taproot-blog/app && npm run build

▲ Next.js 15.1.0
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (8/8)

Route (app)                  Size  First Load JS
┌ ○ /                      1.2 kB         97 kB
├ ○ /about                 156 B          90 kB
├ ƒ /posts/[slug]          2.4 kB         98 kB
├ ƒ /admin                 1.9 kB        103 kB
└ ƒ /admin/posts/new       8.1 kB        112 kB
+ First Load JS shared      89 kB
  └ chunks/vendor-abc123.js  86 kB`,
      language: "bash",
    },
    {
      title: "Step 6: The asset pipeline",
      description: (
        <>
          Code is only one of four assets the pipeline produces. CSS is purged (Tailwind drops
          unused rules), images are hashed and optionally re-encoded to AVIF/WebP, fonts are
          subset and preloaded, and environment variables are split: <code>NEXT_PUBLIC_*</code>{" "}
          inlined into the bundle, everything else kept server-side only. Each split is an
          architectural decision the bundler makes for you.
        </>
      ),
      code: `# After build, .next/static/ contains:

chunks/
  vendor-abc123.js          # framework + node_modules
  app/page-def456.js        # route-specific
  app/admin/page-ghi789.js  # separate chunk; only loaded for /admin
css/
  abc123.css                # purged Tailwind
media/
  cover-1.abc123.svg        # hashed for cache-busting

# Env vars in the bundle:
process.env.NEXT_PUBLIC_SITE_NAME  → "Taproot"  (inlined)
process.env.AUTH_SECRET             → undefined  (server-only, never shipped)`,
      language: "bash",
    },
  ];
```

**Step 1c — Hook + Mental model JSX (sections 1 and 2):**

```tsx
      {/* 1. Hook */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-base leading-relaxed">
            You wrote <code>import {"{ Button }"} from "./Button"</code> in your component. The
            browser has never heard of a <code>.tsx</code> file, has no idea what{" "}
            <code>./Button</code> resolves to, and would not fetch a thousand small files anyway.
            And yet, when you visit the deployed Taproot blog, the page is there in 800 ms.
          </p>
          <p className="text-base leading-relaxed mt-4">
            Eight machines did something in those 800 ms. The first three of them — transformer,
            module-graph walker, asset emitter — happened on a CI server long before you opened
            the page. This is the build pipeline. It is the part of "modern frontend" that beginners
            most often skip and most often regret skipping, because it makes choices the browser
            cannot undo.
          </p>
        </CardContent>
      </Card>

      {/* 2. Mental model */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-base leading-relaxed">
            The source code on your laptop is one thing. The bundle on the CDN is a different
            thing. The build pipeline is the translator. Once a build runs, the source no longer
            matters to the runtime — only the bundle does. So when something breaks "only in
            production," it is almost always because a build-time decision differs from what your
            dev server was doing.
          </p>
          <blockquote className="mt-4 border-l-4 border-blue-500 pl-4 italic text-slate-700 dark:text-slate-300">
            Source code is what you write; the bundle is what runs. The build pipeline is the
            translator between them, and it makes choices the browser cannot undo.
          </blockquote>
        </CardContent>
      </Card>
```

**Step 1d — Step-by-step + optional sections JSX:**

```tsx
      {/* 3. Step-by-step */}
      <StepByStepExplanation
        title="From .tsx to a deployed bundle, step by step"
        description="Walking the build pipeline using the Taproot blog as the source."
        steps={buildPipelineSteps}
      />

      {/* Optional: Three transforms */}
      <CodeComparison
        title="One transform, made explicit"
        leftTitle="What you wrote"
        rightTitle="What the bundler ships"
        leftCode={transformsCompare.leftCode}
        rightCode={transformsCompare.rightCode}
        leftLanguage="tsx"
        rightLanguage="javascript"
      />

      {/* Optional: Module graph diagram */}
      <LayeredFlow
        title="The module graph, walked from one route"
        description="Vite/Next walks this graph on demand in dev, exhaustively in build."
        stages={moduleGraphStages}
        direction="horizontal"
      />
```

**Step 1e — Playground + Challenges JSX:**

```tsx
      {/* 4. Playground */}
      <TerminalPlayground
        title="Watch a real production build"
        description="Each line is a phase of the pipeline running against the Taproot blog."
        lines={buildTrace}
      />

      {/* 5. Challenges */}
      <Challenge
        question="A new route at /api/embed/[id] is added. The existing home page imports nothing from it. After running npm run build, where does the route's code end up?"
        options={[
          { id: "a", text: "In the home-page chunk" },
          { id: "b", text: "In a vendor chunk shared with the home page" },
          { id: "c", text: "In its own chunk that loads only when /api/embed/[id] is hit" },
          { id: "d", text: "Tree-shaken away because nothing imports it" },
        ]}
        correctAnswerId="c"
        explanation={
          <>
            Routes are split into their own chunks at build time. Nothing on the home page imports
            this route, so it does not enter the home-page chunk; nor is it tree-shaken — it has
            its own entry point. It only ships when a user visits that route.
          </>
        }
      />

      <Challenge
        question="A teammate reports: 'The build is huge, but I do not know which dependency is the culprit.' Which command will most directly answer that?"
        options={[
          { id: "a", text: "npm run dev" },
          { id: "b", text: "npx next build --debug" },
          { id: "c", text: "npx @next/bundle-analyzer (or ANALYZE=true npm run build)" },
          { id: "d", text: "npm test" },
        ]}
        correctAnswerId="c"
        explanation={
          <>
            A bundle analyzer visualizes the size of every module in every chunk — exactly the
            question you are asking. <code>--debug</code> shows extra logs; <code>npm run dev</code>{" "}
            does not bundle; tests are unrelated.
          </>
        }
      />
```

**Step 1f — GotchaList + KeyTakeaways JSX:**

```tsx
      {/* 6. GotchaList */}
      <GotchaList
        items={[
          {
            title: "It works in dev but breaks in prod",
            body: (
              <>
                Almost always one of two things: an environment variable that exists locally but
                not in CI, or a dynamic <code>import()</code> path that the bundler cannot resolve
                at build time but the dev server happily runs ad hoc.
              </>
            ),
          },
          {
            title: "Public vs server env vars",
            body: (
              <>
                Anything prefixed <code>NEXT_PUBLIC_</code> is inlined into the bundle and shipped
                to every browser. Everything else stays server-only. Mis-naming an API key as{" "}
                <code>NEXT_PUBLIC_</code> leaks it to every visitor.
              </>
            ),
          },
          {
            title: "Barrel files defeat tree-shaking",
            body: (
              <>
                A file like <code>components/index.ts</code> that re-exports everything looks
                convenient but tells the bundler "I have side effects." Even if you import one
                component, the bundler may pull in all of them. Prefer direct imports.
              </>
            ),
          },
          {
            title: "Source maps are deployed too — to the wrong place",
            body: (
              <>
                You want stack traces in production to be readable, but you do not want{" "}
                <code>.map</code> files served to every visitor. Ship source maps to your error
                tracker (Sentry, etc.), not to the public CDN.
              </>
            ),
          },
        ]}
      />

      {/* 7. KeyTakeaways */}
      <KeyTakeaways
        points={[
          "The browser cannot run TS, JSX, or .css imports. The build pipeline translates each into something it can.",
          "The module graph is the bundler's mental model: only files reachable from an entry point ship.",
          "Dev mode walks the graph on demand and uses HMR; build mode walks it exhaustively, splits into chunks, and tree-shakes.",
          "Public and server-only env vars are different; the prefix is the only mechanism, so name them on purpose.",
          "When a bug only appears in production, suspect a build-time decision (env vars, dynamic imports, barrel files) before suspecting your code.",
        ]}
        mentalModel="Source code is what you write; the bundle is what runs. The build pipeline is the translator between them, and it makes choices the browser cannot undo."
      />
```

**Step 1g — Footer:**

```tsx
      <RoadmapLink url="https://roadmap.sh/frontend" />

      <p className="text-sm text-slate-500 dark:text-slate-400">
        Reference app: <a className="underline" href="<BLOG_URL>" target="_blank" rel="noreferrer">taproot-blog</a> (deployed) ·{" "}
        <a className="underline" href="<BLOG_REPO>/tree/<BLOG_TAG_SHA>/examples/taproot-blog" target="_blank" rel="noreferrer">source on GitHub (pinned)</a>
      </p>
```

- [ ] **Step 2: Verify lint and typecheck pass**

Run: `npm run lint && npx tsc --noEmit`
Expected: zero errors. Watch for `react/no-unescaped-entities` — replace any literal `'` in JSX text with `&apos;`.

- [ ] **Step 3: Commit**

```bash
git add lib/modules/8-1-the-build-pipeline.tsx
git commit -m "feat(modules): add 8-1 the build pipeline capstone module"
```

---

## Task 4: Author `8-2-the-request-lifecycle`

**Files:**
- Create: `lib/modules/8-2-the-request-lifecycle.tsx`

The module follows the same skeleton as `8-1`, with these differences:

- **Imports:** swap `CodeComparison` and `TerminalPlayground` for `SequenceDiagram` and `LayeredFlow`. Final import list:
  ```tsx
  import { Card, CardContent } from "@/components/ui/card";
  import { StepByStepExplanation, Step } from "@/components/StepByStepExplanation";
  import { SequenceDiagram, SequenceMessage } from "@/components/SequenceDiagram";
  import { LayeredFlow, FlowStage } from "@/components/LayeredFlow";
  import { Challenge } from "@/components/Challenge";
  import { GotchaList } from "@/components/GotchaList";
  import { KeyTakeaways } from "@/components/KeyTakeaways";
  import { RoadmapLink } from "@/components/RoadmapLink";
  ```

- **Hoisted data blocks:**

```tsx
  const relayActors = ["User", "DNS", "CDN", "Server", "Parser", "JS engine", "Hydrator"];

  const relayMessages: SequenceMessage[] = [
    { from: "User", to: "DNS", label: "GET taproot-blog.vercel.app", note: "Resolve hostname" },
    { from: "DNS", to: "User", label: "76.76.x.x", note: "1 RTT" },
    { from: "User", to: "CDN", label: "TLS handshake + GET /posts/the-cascade", note: "1-2 RTT" },
    { from: "CDN", to: "Server", label: "Cache miss → forward", note: "edge → origin" },
    { from: "Server", to: "Server", label: "Run RSC tree, query DB" },
    { from: "Server", to: "User", label: "HTML (streaming)", note: "First paint can start" },
    { from: "User", to: "CDN", label: "GET /_next/chunks/*.js", note: "Parallel" },
    { from: "CDN", to: "User", label: "Hashed JS chunks", note: "Cached at edge" },
    { from: "User", to: "Parser", label: "Parse HTML, build DOM" },
    { from: "Parser", to: "JS engine", label: "Execute downloaded chunks" },
    { from: "JS engine", to: "Hydrator", label: "React.hydrateRoot()" },
    { from: "Hydrator", to: "User", label: "Page is interactive" },
  ];

  const hydrationStages: FlowStage[] = [
    { label: "TTFB", detail: "First byte arrives", color: "blue" },
    { label: "FCP", detail: "First content painted", color: "violet" },
    { label: "LCP", detail: "Largest element painted", color: "emerald" },
    { label: "Hydrated", detail: "Handlers attached", color: "amber" },
    { label: "TTI", detail: "Page fully interactive", color: "rose" },
  ];
```

- [ ] **Step 1: Author `lifecycleSteps` (Step array, 7 entries)**

```tsx
  const lifecycleSteps: Step[] = [
    {
      title: "Step 1: DNS and connection",
      description: (
        <>
          You type the URL. The browser asks a DNS resolver for the hostname's IP, opens a TCP
          connection, completes the TLS handshake. None of this involves your code; it is the
          plumbing learned in modules <code>1-1</code> and <code>1-2</code>. On a fast network
          this all takes ~50–150 ms before any HTTP byte flows.
        </>
      ),
      code: `# DevTools waterfall, request 1 of N
DNS lookup:           12 ms
Initial connection:   24 ms
TLS handshake:        38 ms
TTFB (Time to First Byte): 187 ms
Content download:     14 ms
Total:                275 ms`,
      language: "bash",
    },
    {
      title: "Step 2: Server render (RSC)",
      description: (
        <>
          The server runs the React Server Components tree. It calls{" "}
          <code>await prisma.post.findUnique({"{...}"})</code>, awaits the database, and renders
          components into HTML strings. <em>This is the moment the page exists as text.</em>
          Importantly, it streams: the response begins flowing back before the server is done.
        </>
      ),
      code: `// taproot-blog/app/(public)/posts/[slug]/page.tsx
export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug, draft: false },
    include: { author: true, tags: { include: { tag: true } } },
  });
  if (!post) notFound();
  return (
    <article>
      <h1>{post.title}</h1>
      <PostBody source={post.body} />
      <CommentForm postId={post.id} />  {/* hydration boundary */}
    </article>
  );
}`,
      language: "tsx",
    },
    {
      title: "Step 3: HTML streams to the browser",
      description: (
        <>
          As bytes arrive, the browser begins parsing immediately. Critical CSS in the{" "}
          <code>&lt;head&gt;</code> means the first paint can happen while the rest of the document
          is still streaming. By the time the closing <code>&lt;/html&gt;</code> arrives, the page is
          often already visible.
        </>
      ),
      code: `<!doctype html>
<html lang="en">
<head>
  <link rel="stylesheet" href="/_next/static/css/abc123.css">
  <meta property="og:title" content="The cascade...">
</head>
<body>
  <article>
    <h1>The cascade is the only CSS thing that matters</h1>
    <p>If you understand origin, specificity...</p>

    <!-- Below is the marker for the comment-form island -->
    <!--$client-->
    <form><!-- inert until hydration --></form>
    <!--/$-->
  </article>
  <script type="module" src="/_next/static/chunks/main-def456.js"></script>
</body>
</html>`,
      language: "html",
    },
    {
      title: "Step 4: JS chunks download in parallel",
      description: (
        <>
          The bundler split chunks for this page in module <code>8-1</code>. The browser sees
          their <code>&lt;script&gt;</code> tags and fetches them in parallel — the route chunk
          (containing <code>CommentForm</code>), the framework chunk, the vendor chunk. While JS
          downloads, the page is visible but the comment form does nothing.
        </>
      ),
      code: `# DevTools Network — parallel chunk downloads
main-def456.js          (framework, ~50 kB)   ▓▓▓▓▓▓▓▓
chunks/page-ghi789.js   (route,     ~12 kB)   ▓▓▓
chunks/vendor-abc123.js (deps,      ~30 kB)   ▓▓▓▓▓
                                              0      400 ms`,
      language: "bash",
    },
    {
      title: "Step 5: Hydration",
      description: (
        <>
          With JS downloaded and parsed, React walks the existing server-rendered DOM, attaches
          event handlers, and brings client components to life. <em>Before this moment the comment
          button does nothing.</em> Most of the page on Taproot is RSC; only{" "}
          <code>CommentForm</code> hydrates. <em>Hydration mismatch</em> — server HTML differing
          from what the client renders — is the most painful failure mode here, and the cause is
          almost always non-deterministic render (e.g. <code>Date.now()</code> in JSX).
        </>
      ),
      code: `// What hydration is, conceptually
//
// 1. Server has already rendered:    <form>...</form>
// 2. JS arrives, runs:               React.hydrateRoot(node, <CommentForm/>);
// 3. React walks the existing DOM, attaches onSubmit, onChange, etc.
// 4. The form is now interactive.
//
// What it is NOT:
//   - Re-rendering the form
//   - Replacing the HTML with new HTML
// What it IS:
//   - Wiring handlers onto the HTML that is already there`,
      language: "javascript",
    },
    {
      title: "Step 6: First interaction",
      description: (
        <>
          The user types a comment, clicks Post. <em>Optimistic UI</em>: the comment appears
          immediately via <code>useOptimistic</code>, even though the server has not yet confirmed.
          A <em>server action</em> sends the data; on success, React reconciles the optimistic
          update with the real one. On failure, the optimistic update is rolled back and an error
          shows.
        </>
      ),
      code: `// taproot-blog/app/components/CommentForm.tsx (excerpt)
const [optimistic, addOptimistic] = useOptimistic([], (state, next) => [...state, next]);

<form action={(formData) => {
  startTransition(async () => {
    addOptimistic({ id: \`tmp-\${Date.now()}\`, authorName, body });
    const res = await addComment({ postId, authorName, body });
    if (!res.ok) setErrorMsg(res.error);
  });
}}>`,
      language: "tsx",
    },
    {
      title: "Step 7: Client navigation",
      description: (
        <>
          The user clicks another post. <em>No full reload.</em> Next.js prefetched the chunk on
          hover; the route transition is instant. The post-body data is fetched fresh from the
          server (RSC re-runs), but the framework chunk and the layout stay put. This is what
          makes a modern app feel like an app and not a multi-page site.
        </>
      ),
      code: `// What client navigation does:
// 1. <Link href="/posts/why-rsc"> — Next prefetched the route chunk on hover
// 2. Click → React Router state update → URL changes
// 3. Server is asked for the new page's RSC payload (NOT a fresh HTML doc)
// 4. Server runs page.tsx for /posts/why-rsc, returns serialized RSC tree
// 5. Client diffs, swaps the article body, layout stays mounted
//
// No flash, no scroll reset, no re-download of framework code.`,
      language: "javascript",
    },
  ];
```

- [ ] **Step 2: Author the JSX render**

```tsx
  return (
    <div className="space-y-8">
      {/* 1. Hook */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-base leading-relaxed">
            You click a Taproot post link. About 800 ms later the page is there and the comment
            box works. In those 800 ms, eight different machines did something: a DNS resolver, a
            CDN edge, a serverless function, a database, the browser's HTML parser, the JS
            engine, the React hydrator, and finally your eyes.
          </p>
          <p className="text-base leading-relaxed mt-4">
            If any one of those machines is slow, the whole page is slow. Telling them apart is
            the difference between a vague "the site feels sluggish" and a specific "the TTFB is
            600 ms because the database query is missing an index." That specificity is what this
            module is for.
          </p>
        </CardContent>
      </Card>

      {/* 2. Mental model */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-base leading-relaxed">
            A modern page does not render in one place. It is assembled across machines, with
            each one handing the result to the next. Different metrics — TTFB, FCP, LCP, TTI —
            measure different runners in this relay. Until you can name which runner is on the
            track, you cannot speed up the race.
          </p>
          <blockquote className="mt-4 border-l-4 border-blue-500 pl-4 italic text-slate-700 dark:text-slate-300">
            A page appearing in the browser is a relay race. Each runner — DNS, server, network,
            browser parser, JS engine, hydrator — hands the baton to the next, and the user
            perceives "loading" until the last runner crosses the line.
          </blockquote>
        </CardContent>
      </Card>

      {/* 3. Step-by-step */}
      <StepByStepExplanation
        title="The eight machines, in order"
        description="Walking a request to /posts/the-cascade end to end."
        steps={lifecycleSteps}
      />

      {/* Optional: Sequence diagram of the relay */}
      <SequenceDiagram
        title="The relay, as actors and messages"
        description="Same flow as the steps above, drawn vertically. Use this when reasoning about which actor is slow."
        actors={relayActors}
        messages={relayMessages}
      />

      {/* Optional: Hydration timeline */}
      <LayeredFlow
        title="The performance metrics, in order"
        description="LCP and TTI are not the same. Pages can look done while still being inert."
        stages={hydrationStages}
        direction="horizontal"
      />

      {/* 4. Playground */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-base font-semibold mb-2">Try this</p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
            Open <a className="underline" href="<BLOG_URL>" target="_blank" rel="noreferrer">the deployed Taproot blog</a> in a new tab.
            Open DevTools → Network. Throttle to "Fast 3G". Reload. Identify which actor in the
            relay is the bottleneck for the home page. Then click into a post — observe that the
            framework chunk does not re-download.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Hint: TTFB measures DNS + server time before the first byte. LCP measures when the
            largest element finishes painting. They can be far apart.
          </p>
        </CardContent>
      </Card>

      {/* 5. Challenges */}
      <Challenge
        question="A Lighthouse report shows TTFB = 600 ms but LCP = 850 ms. Where is most of the time being spent?"
        options={[
          { id: "a", text: "DNS / network — the relay is slow before any byte arrives" },
          { id: "b", text: "Server — between connection open and first byte sent" },
          { id: "c", text: "JS hydration — the page rendered fast but is inert" },
          { id: "d", text: "Image decoding" },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            TTFB is the time from request start to first byte received. A 600 ms TTFB means the
            server (or a database query inside it) is the bottleneck. LCP is only ~250 ms after
            TTFB, so the network and rendering steps are fast.
          </>
        }
      />

      <Challenge
        question="A user reports: 'When I land on the page, the comment button does nothing for the first second or so.' What is the most likely cause?"
        options={[
          { id: "a", text: "The button is disabled in CSS" },
          { id: "b", text: "Hydration is incomplete — JS chunks are still downloading or parsing" },
          { id: "c", text: "The server action is rate-limited" },
          { id: "d", text: "The browser is offline" },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            Until hydration completes, the server-rendered HTML is visible but inert. This is the
            classic "looks done but is not interactive" gap. Fixes: ship less client-side JS,
            defer non-critical scripts, or move the component to a server component.
          </>
        }
      />

      <Challenge
        question="Page A is entirely RSC; page B is identical but uses 'use client' on the root component. Both render the same data. Which page has lower hydration cost?"
        options={[
          { id: "a", text: "Page A — RSC ships no JS, so there is nothing to hydrate" },
          { id: "b", text: "Page B — 'use client' is faster" },
          { id: "c", text: "They are equivalent — RSC and client components have the same cost" },
          { id: "d", text: "Page A — but only on slow connections" },
        ]}
        correctAnswerId="a"
        explanation={
          <>
            RSC does not ship its component code to the browser, so there is no hydration step
            for it. Page B forces React to walk the entire tree and attach handlers. The
            difference is most visible on slow CPUs, but it exists everywhere.
          </>
        }
      />

      {/* 6. GotchaList */}
      <GotchaList
        items={[
          {
            title: "Hydration mismatch",
            body: (
              <>
                Server HTML and client render must match exactly at hydration time. Calling{" "}
                <code>Date.now()</code>, <code>Math.random()</code>, or anything that depends on
                the user's locale inside JSX is the classic cause. The fix: derive the value on
                the server and pass it down, or move the component into a client-only effect.
              </>
            ),
          },
          {
            title: "TTI is not LCP",
            body: (
              <>
                The largest element can paint while interaction is still impossible. Optimizing
                for LCP alone produces pages that look fast but feel broken. Watch INP
                (Interaction to Next Paint) too.
              </>
            ),
          },
          {
            title: "A 3rd-party script tag without async or defer",
            body: (
              <>
                A plain <code>&lt;script src="..."&gt;</code> blocks the parser at that point in
                the document. One slow analytics script can add 500 ms to FCP. Always{" "}
                <code>async</code> or <code>defer</code>; better, lazy-load on interaction.
              </>
            ),
          },
          {
            title: "RSC re-runs on every route change",
            body: (
              <>
                Client navigation reuses the JS bundle, but the server still runs its RSC tree
                fresh for each navigation (unless cached). Your database queries fire again. Cache
                explicitly via <code>revalidate</code> or <code>fetch</code> options when the data
                is safe to cache.
              </>
            ),
          },
        ]}
      />

      {/* 7. KeyTakeaways */}
      <KeyTakeaways
        points={[
          "The page you see is assembled across at least eight different machines; each one is a candidate for being slow.",
          "TTFB measures the server; LCP measures the paint; TTI measures interactivity. Different metrics, different fixes.",
          "Hydration attaches handlers to existing HTML. Until it finishes, your client components are inert.",
          "Client navigation reuses the JS bundle but re-runs server code; cache deliberately.",
          "Optimizing performance starts with naming which runner in the relay is slow, not with adding indexes everywhere.",
        ]}
        mentalModel="A page appearing in the browser is a relay race. Each runner — DNS, server, network, browser parser, JS engine, hydrator — hands the baton to the next, and the user perceives 'loading' until the last runner crosses the line."
      />

      <RoadmapLink url="https://roadmap.sh/frontend" />

      <p className="text-sm text-slate-500 dark:text-slate-400">
        Reference app: <a className="underline" href="<BLOG_URL>" target="_blank" rel="noreferrer">taproot-blog</a> (deployed) ·{" "}
        <a className="underline" href="<BLOG_REPO>/blob/<BLOG_TAG_SHA>/examples/taproot-blog/app/app/(public)/posts/%5Bslug%5D/page.tsx" target="_blank" rel="noreferrer">post page on GitHub (pinned)</a>
      </p>
    </div>
  );
```

- [ ] **Step 3: Verify lint and typecheck**

Run: `npm run lint && npx tsc --noEmit`
Expected: zero errors.

- [ ] **Step 4: Commit**

```bash
git add lib/modules/8-2-the-request-lifecycle.tsx
git commit -m "feat(modules): add 8-2 the request lifecycle capstone module"
```

---

## Task 5: Author `8-3-the-architecture-of-a-real-app`

This module has 8 step-by-step entries (one above the §2.3 cap, justified by §5.4 of the spec).

**Files:**
- Create: `lib/modules/8-3-the-architecture-of-a-real-app.tsx`

- [ ] **Step 1: Imports + hoisted data**

```tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { StepByStepExplanation, Step } from "@/components/StepByStepExplanation";
import { LayeredFlow, FlowStage } from "@/components/LayeredFlow";
import { CodeComparison } from "@/components/CodeComparison";
import { Challenge } from "@/components/Challenge";
import { GotchaList } from "@/components/GotchaList";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { RoadmapLink } from "@/components/RoadmapLink";

export function Module_8_3_Content() {
  // Data blocks hoisted out of JSX for readability — listed in render order.
  const deployStages: FlowStage[] = [
    { label: "CDN edge", detail: "HTML, JS chunks, images, fonts", color: "blue" },
    { label: "Edge function", detail: "middleware.ts (auth gate)", color: "violet" },
    { label: "Serverless function", detail: "RSC render, server actions", color: "emerald" },
    { label: "Database", detail: "Postgres (Vercel)", color: "amber" },
  ];

  const fetchPatternCompare = {
    leftCode: `// Antipattern: fetch from your own API
async function PostList() {
  const res = await fetch(
    \`\${process.env.SITE_URL}/api/posts\`
  );
  const posts = await res.json();
  return posts.map((p) => <PostCard ... />);
}`,
    rightCode: `// Talk to the database directly
async function PostList() {
  const posts = await prisma.post.findMany({
    where: { draft: false },
    include: { author: true, tags: { include: { tag: true } } },
    orderBy: { publishedAt: "desc" },
  });
  return posts.map((p) => <PostCard ... />);
}`,
  };
```

- [ ] **Step 2: Author `archSteps` (Step array, 8 entries)**

```tsx
  const archSteps: Step[] = [
    {
      title: "Step 1: File-based routing",
      description: (
        <>
          The folder structure under <code>app/</code> is the URL structure. Brackets become
          dynamic segments. Parentheses create <em>route groups</em> — folders that share a layout
          but do not appear in the URL. The Taproot blog uses <code>(public)</code> for the
          unauthenticated site and <code>admin</code> (no parens) for the authenticated area.
        </>
      ),
      code: `app/
  layout.tsx                                  /
  not-found.tsx                               (404)
  login/page.tsx                              /login
  api/auth/[...nextauth]/route.ts             /api/auth/*
  (public)/                                   route group, no URL effect
    layout.tsx                                shared header/footer
    page.tsx                                  /
    posts/[slug]/page.tsx                     /posts/:slug
    tag/[tag]/page.tsx                        /tag/:tag
    about/page.tsx                            /about
  admin/
    layout.tsx                                /admin/* (auth-gated)
    page.tsx                                  /admin
    posts/new/page.tsx                        /admin/posts/new
    posts/[id]/edit/page.tsx                  /admin/posts/:id/edit
    comments/page.tsx                         /admin/comments`,
      language: "bash",
    },
    {
      title: "Step 2: Layouts and templates",
      description: (
        <>
          Layouts wrap their children and persist across navigation within the same layout
          tree. The header in <code>(public)/layout.tsx</code> is rendered once and stays mounted
          while you navigate between posts. The header in <code>admin/layout.tsx</code> is a
          different tree — navigating from a post into <code>/admin</code> remounts everything.
        </>
      ),
      code: `// app/(public)/layout.tsx — wraps every public page
export default function PublicLayout({ children }) {
  return (
    <>
      <header>...</header>     {/* persists across post navigation */}
      <main>{children}</main>
      <footer>...</footer>
    </>
  );
}

// app/admin/layout.tsx — wraps every admin page
export default async function AdminLayout({ children }) {
  const session = await auth();         {/* runs on each admin request */}
  if (!session?.user) redirect("/login");
  return <>{ /* admin chrome */ }</>;
}`,
      language: "tsx",
    },
    {
      title: "Step 3: Server vs client components",
      description: (
        <>
          Every component in the App Router is a <em>server component</em> by default — it runs on
          the server and ships zero JavaScript to the browser. Adding <code>"use client"</code> at
          the top of a file makes it a <em>client component</em>: it hydrates and is interactive.
          The boundary is a real architectural decision.
        </>
      ),
      code: `// PostBody.tsx — server component
//   - Renders Markdown to HTML at request time
//   - Ships no JS; the rendered HTML is just text
//   - Uses dangerouslySetInnerHTML, but the markdown
//     pipeline runs rehype-sanitize first, so the HTML
//     it stringifies has no scripts or unsafe nodes.
import { renderMarkdown } from "@/lib/markdown";

export default async function PostBody({ source }: { source: string }) {
  const html = await renderMarkdown(source);  // sanitized inside renderMarkdown
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

// CommentForm.tsx — client component
"use client";
//   - Has state (useState, useOptimistic)
//   - Hydrates and is interactive
import { useOptimistic, useTransition, useState } from "react";
export default function CommentForm({ postId }: { postId: string }) {
  const [body, setBody] = useState("");
  // ...
}`,
      language: "tsx",
    },
    {
      title: "Step 4: Data fetching, the right way",
      description: (
        <>
          Server components <code>await</code> the database directly. Do not fetch from your own
          API in a server component — that adds a round trip for nothing. The exception is when a
          third party's API is the source of truth. Talk to data sources where they live.
        </>
      ),
      code: `// app/(public)/page.tsx
import { prisma } from "@/lib/db";

export default async function Home() {
  const posts = await prisma.post.findMany({
    where: { draft: false },
    include: { author: true, tags: { include: { tag: true } } },
    orderBy: { publishedAt: "desc" },
  });
  return posts.map((p) => <PostCard key={p.id} post={p} />);
}`,
      language: "tsx",
    },
    {
      title: "Step 5: State, three flavours",
      description: (
        <>
          Modern apps have three kinds of state, and the trick is matching the kind to the data:
        </>
      ),
      code: `// 1. URL state — owned by the URL itself, shareable
//   /tag/css → the tag filter lives in the path
const { tag } = await params;

// 2. Server state — owned by the server, fetched on demand
//   The post list is queried fresh on each navigation
const posts = await prisma.post.findMany({ ... });

// 3. Client state — owned by the component, lost on refresh
//   The comment input value lives in useState until submit
const [body, setBody] = useState("");

// Mismatching the kind to the data is the cause of most
// state-management pain (e.g. storing a filter in client
// state and wondering why links don't share their state).`,
      language: "tsx",
    },
    {
      title: "Step 6: Mutations — server actions + optimistic UI",
      description: (
        <>
          A <em>server action</em> is a function annotated <code>"use server"</code> that runs on
          the server and is called from the client like a remote procedure. The form's{" "}
          <code>action</code> attribute calls it directly — no hand-written <code>fetch</code>.
          Pair it with <code>useOptimistic</code> for snappy UX.
        </>
      ),
      code: `// lib/actions/add-comment.ts
"use server";
export async function addComment(input: unknown) {
  const parsed = commentSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid input" };
  const comment = await prisma.comment.create({ data: parsed.data });
  revalidatePath(\`/posts/\${slug}\`);
  return { ok: true, comment };
}

// components/CommentForm.tsx ("use client")
const [optimistic, addOptimistic] = useOptimistic(
  [],
  (state, next) => [...state, next]
);
<form action={(formData) => {
  startTransition(async () => {
    addOptimistic({ ... });
    const res = await addComment({ ... });
    if (!res.ok) setErrorMsg(res.error);
  });
}}>`,
      language: "tsx",
    },
    {
      title: "Step 7: Auth boundary",
      description: (
        <>
          <code>middleware.ts</code> runs on every request before any page does. It is the edge
          gate: redirects unauthenticated users away from <code>/admin/*</code> before a single
          byte of admin code is even loaded. Inside <code>admin/layout.tsx</code>, calling{" "}
          <code>auth()</code> gives the current session to every nested route. This is the same
          pattern as module <code>6-4</code> — applied here in App Router shape.
        </>
      ),
      code: `// middleware.ts
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
export default NextAuth(authConfig).auth;
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\\\.svg$).*)"],
};

// auth.config.ts (edge-safe)
callbacks: {
  authorized({ auth, request: { nextUrl } }) {
    const isOnAdmin = nextUrl.pathname.startsWith("/admin");
    if (isOnAdmin) return !!auth?.user;
    return true;
  },
}

// app/admin/layout.tsx (full Node runtime)
const session = await auth();
if (!session?.user) redirect("/login");`,
      language: "tsx",
    },
    {
      title: "Step 8: The deploy view",
      description: (
        <>
          When you hit deploy, four things happen: static assets (HTML, JS chunks, images, fonts)
          land on the CDN and never run code; <code>middleware.ts</code> compiles to an{" "}
          <em>edge function</em> that runs on every request close to the user; the server code
          (RSC, server actions) compiles to <em>serverless functions</em> that spin up on demand;
          and the database lives in one place. Knowing where each piece lives is what lets you
          reason about latency and cost.
        </>
      ),
      code: `# After 'vercel --prod', the deploy looks like:

CDN edge (everywhere):
  /                              → HTML (cached)
  /_next/static/chunks/*.js      → cached forever (hashed names)
  /cover-1.svg                   → cached at edge

Edge function (everywhere, fast):
  middleware.ts                  → runs on every matched request

Serverless function (one region):
  /posts/[slug]                  → RSC render, queries DB
  /api/auth/*                    → NextAuth handlers
  Server actions                 → addComment, createPost, etc.

Database (one region):
  Postgres                       → reached only from serverless`,
      language: "bash",
    },
  ];
```

- [ ] **Step 3: Author the JSX render**

```tsx
  return (
    <div className="space-y-8">
      {/* 1. Hook */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-base leading-relaxed">
            Open the Taproot repo on GitHub. There is an <code>app/</code> folder, a{" "}
            <code>components/</code> folder, a <code>lib/</code> folder, a <code>middleware.ts</code>{" "}
            file at the root, an <code>auth.ts</code> file next to it, a <code>prisma/</code> folder,
            and a hundred more files. Real apps look like this. Why these folders and not others?
          </p>
          <p className="text-base leading-relaxed mt-4">
            Each folder encodes a decision someone made about your app's architecture. When you
            put a file in <code>components/</code> versus <code>app/</code>, when you write{" "}
            <code>"use client"</code> at the top of a file or leave it off, when you call{" "}
            <code>prisma.findMany</code> directly versus going through a separate API route — those
            are not style choices. They determine how your app behaves under load, how it fails,
            and how a new teammate reads it. This module makes the decisions visible.
          </p>
        </CardContent>
      </Card>

      {/* 2. Mental model */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-base leading-relaxed">
            The folder structure of a real app is not arbitrary. Each folder answers one of three
            questions: where does this run (server, client, or edge?), where does this data come
            from (database, props, URL?), and where does this state live (URL, server cache, or
            component?). Reading the folders is reading the answers.
          </p>
          <blockquote className="mt-4 border-l-4 border-blue-500 pl-4 italic text-slate-700 dark:text-slate-300">
            A modern app's folder structure is a map of decisions: where does this run (server or
            client), where does this data come from (database or props), and where does this state
            live (URL, server cache, or component)? The folders make those answers visible.
          </blockquote>
        </CardContent>
      </Card>

      {/* 3. Step-by-step */}
      <StepByStepExplanation
        title="Eight architectural concerns, one folder at a time"
        description="Walking the Taproot blog's app/ directory and naming the decision behind each piece."
        steps={archSteps}
      />

      {/* Optional: Antipattern comparison */}
      <CodeComparison
        title="The data-fetching boundary"
        leftTitle="Antipattern: fetch from your own API"
        rightTitle="Server component talks to the DB"
        leftCode={fetchPatternCompare.leftCode}
        rightCode={fetchPatternCompare.rightCode}
        leftLanguage="tsx"
        rightLanguage="tsx"
      />

      {/* Optional: Deploy view */}
      <LayeredFlow
        title="Where each piece runs after you deploy"
        description="Static at the edge, dynamic in functions, data in one place."
        stages={deployStages}
        direction="horizontal"
      />

      {/* 4. Playground */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-base font-semibold mb-2">Try this</p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
            Open the <a className="underline" href="<BLOG_REPO>/blob/<BLOG_TAG_SHA>/examples/taproot-blog/app/components/CommentForm.tsx" target="_blank" rel="noreferrer">CommentForm.tsx</a> file
            in the pinned reference. Note the <code>"use client"</code> at the top. In your head,
            walk through what would happen if you removed it: the component would become a server
            component, <code>useState</code> would not work (server components have no state), and
            the <code>action</code> callback that uses <code>startTransition</code> would fail to
            mount. Read the explanation, then check by reading the file in the same directory{" "}
            <a className="underline" href="<BLOG_REPO>/blob/<BLOG_TAG_SHA>/examples/taproot-blog/app/components/CommentList.tsx" target="_blank" rel="noreferrer">CommentList.tsx</a> —
            it is a server component (no <code>"use client"</code>) and queries the database directly.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Hint: in the App Router, the boundary is contagious downward — anything imported by a
            client component runs on the client too. But it is not contagious upward; a server
            component can import and render a client component freely.
          </p>
        </CardContent>
      </Card>

      {/* 5. Challenges */}
      <Challenge
        question="You are asked to add a 'like' button to each post. What three architectural decisions do you need to make before writing code?"
        options={[
          { id: "a", text: "Color, size, and animation" },
          { id: "b", text: "Boundary (server or client component), state location (URL, server, or client), and data flow (server action vs API route)" },
          { id: "c", text: "Database table name, column types, and indexes" },
          { id: "d", text: "Browser support, accessibility label, and analytics event" },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            Color and accessibility matter, but the three load-bearing architectural decisions are:
            does the component need <code>"use client"</code>; where does the like-count live (URL
            is wrong here, server makes sense); and how does the like get persisted (a server
            action is the App Router idiom). Get those three right and the implementation is
            mechanical.
          </>
        }
      />

      <Challenge
        question="A page is slow because it queries 5 different tables on every load. Which architectural lever helps most?"
        options={[
          { id: "a", text: "Move the page to a client component" },
          { id: "b", text: "Cache the queries with revalidate or fetch options" },
          { id: "c", text: "Add a useEffect to prefetch" },
          { id: "d", text: "Change the route to use a route group" },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            Moving the page to the client makes it slower, not faster. Caching the server-side
            queries (via Next's <code>revalidate</code> or <code>fetch</code> cache options) is
            the right lever — the queries are deterministic, run on every navigation, and are the
            measurable cost.
          </>
        }
      />

      <Challenge
        question="A teammate has written: function PostList() {'{'} const [posts, setPosts] = useState([]); useEffect(() => fetch('/api/posts').then(r => r.json()).then(setPosts), []); return ... {'}'}. What is the simplest refactor in App Router shape?"
        options={[
          { id: "a", text: "Wrap PostList in a Suspense boundary" },
          { id: "b", text: "Convert to an async server component that awaits the database directly, deleting the useState/useEffect/api route" },
          { id: "c", text: "Add a loading.tsx file next to it" },
          { id: "d", text: "Use TanStack Query instead of useEffect" },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            Server components <code>async</code>-await their data; you delete the entire
            client-side dance. The API route also disappears. The result is fewer files, fewer
            round trips, and no loading flash for users with JS disabled.
          </>
        }
      />

      {/* 6. GotchaList */}
      <GotchaList
        items={[
          {
            title: "Fetching from your own API in a server component",
            body: (
              <>
                If your data lives in your own database, talk to it directly. Going through your
                own <code>/api/*</code> route adds a network hop, blocks streaming, and makes
                debugging harder. The pattern is for third-party APIs only.
              </>
            ),
          },
          {
            title: "&apos;use client&apos; is contagious downward, not upward",
            body: (
              <>
                Anything a client component imports also runs on the client. But a server
                component freely renders a client component below it — the boundary is one-way.
                This is the most common confusion when sketching component trees on a whiteboard.
              </>
            ),
          },
          {
            title: "Forms that do not gracefully degrade",
            body: (
              <>
                Server actions work without JavaScript: the browser submits the form, the server
                processes it, the response renders. A <code>useState</code>-only form requires JS
                to do anything. Prefer server actions; use client state for the parts that truly
                need it (like optimistic updates).
              </>
            ),
          },
          {
            title: "Client-side auth state is a UX hint, never a security boundary",
            body: (
              <>
                Hiding a button on the client means nothing. Anyone can change <code>isAdmin</code>{" "}
                in DevTools. Real authorization happens in <code>middleware.ts</code> and inside
                server actions, where it cannot be tampered with.
              </>
            ),
          },
        ]}
      />

      {/* 7. KeyTakeaways */}
      <KeyTakeaways
        points={[
          "Folder structure is architecture made visible. Reading a folder tree should tell you where each thing runs.",
          "Server components are the default; opt into 'use client' deliberately, where state or interactivity is required.",
          "Talk to data where it lives. Server components await the database directly; client components call server actions.",
          "State has three flavours — URL, server, client. Match the flavour to the data shape and most state-management problems disappear.",
          "Auth runs in middleware and on the server. Client-side checks are UX, never security.",
          "The other shapes — pure SPA, pure static — are not lesser; they are appropriate for different problems. The goal is to recognise which shape your problem wants.",
        ]}
        mentalModel="A modern app's folder structure is a map of decisions: where does this run (server or client), where does this data come from (database or props), and where does this state live (URL, server cache, or component)? The folders make those answers visible."
      />

      {/* Optional: Alternatives */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-2">When a different shape is right</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
            <strong>SPA only (Vite + React):</strong> heavily authenticated tools where every page
            is behind a login, no SEO need, complex client interactivity (Linear, Figma-style
            apps). The Taproot blog has an SPA version under{" "}
            <code>examples/taproot-blog/spa/</code> for comparison.
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
            <strong>Pure static (Astro, plain HTML):</strong> content sites where any JS at all is
            overkill. Taproot's <code>static/</code> folder is the floor.
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            <strong>A different framework (SvelteKit, Nuxt, Remix):</strong> the same architectural
            shape with a different reactivity story. Most of what you learned here transfers; only
            the syntax of <code>"use client"</code> and friends changes.
          </p>
        </CardContent>
      </Card>

      <RoadmapLink url="https://roadmap.sh/frontend" />

      <p className="text-sm text-slate-500 dark:text-slate-400">
        Reference app: <a className="underline" href="<BLOG_URL>" target="_blank" rel="noreferrer">taproot-blog</a> (deployed) ·{" "}
        <a className="underline" href="<BLOG_REPO>/tree/<BLOG_TAG_SHA>/examples/taproot-blog/app" target="_blank" rel="noreferrer">app/ source on GitHub (pinned)</a>
      </p>
    </div>
  );
}
```

- [ ] **Step 4: Verify lint and typecheck**

Run: `npm run lint && npx tsc --noEmit`
Expected: zero errors. Watch for `react/no-unescaped-entities` on the apostrophe in the GotchaList title — it is already escaped to `&apos;` in the snippet above.

- [ ] **Step 5: Commit**

```bash
git add lib/modules/8-3-the-architecture-of-a-real-app.tsx
git commit -m "feat(modules): add 8-3 the architecture of a real app capstone module"
```

---

## Task 6: Register the three new modules

**Files:**
- Modify: `lib/modules/index.ts`

- [ ] **Step 1: Add the imports**

Edit `lib/modules/index.ts`. After the existing `Module_7_8_Content` import, add:

```ts
import { Module_8_1_Content } from "./8-1-the-build-pipeline";
import { Module_8_2_Content } from "./8-2-the-request-lifecycle";
import { Module_8_3_Content } from "./8-3-the-architecture-of-a-real-app";
```

- [ ] **Step 2: Add the registry entries**

In the `MODULE_CONTENTS` object, add at the end (after `7-8-performance`):

```ts
  "8-1-the-build-pipeline": Module_8_1_Content,
  "8-2-the-request-lifecycle": Module_8_2_Content,
  "8-3-the-architecture-of-a-real-app": Module_8_3_Content,
};
```

- [ ] **Step 3: Verify the build and visit each lesson**

Run: `npm run build`
Expected: build succeeds.

Run: `npm run dev` and visit:
- `/lesson/8-1-the-build-pipeline`
- `/lesson/8-2-the-request-lifecycle`
- `/lesson/8-3-the-architecture-of-a-real-app`

Expected: each module renders all 7 sections without console errors. Step-by-step is navigable. Challenges accept answers. Terminal Playground (in 8-1) plays through.

Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add lib/modules/index.ts
git commit -m "feat(modules): register Phase 8 capstone modules"
```

---

## Task 7: Add the "Capstone" badge to Phase 8 in the dashboard

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Read the current phase tile to locate the badge area**

Run: `sed -n '95,125p' app/page.tsx`
Expected: a `<Card>` with the phase header containing a `CardTitle` showing "Phase {phase.id}: {phase.title}".

- [ ] **Step 2: Add the badge conditional next to the title**

Edit `app/page.tsx`. Find:

```tsx
                      <div>
                        <CardTitle className="text-xl">
                          Phase {phase.id}: {phase.title}
                        </CardTitle>
                        <CardDescription className="mt-1">{phase.description}</CardDescription>
                      </div>
```

Replace with:

```tsx
                      <div>
                        <CardTitle className="text-xl flex items-center gap-2">
                          Phase {phase.id}: {phase.title}
                          {phase.id === 8 && (
                            <Badge className="bg-violet-500 hover:bg-violet-600 text-xs">Capstone</Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="mt-1">{phase.description}</CardDescription>
                      </div>
```

- [ ] **Step 3: Verify**

Run: `npm run lint && npx tsc --noEmit && npm run dev`
Open: `http://localhost:3000`
Expected: Phase 8 appears at the bottom of the grid with a violet "Capstone" badge next to its title. All three Phase 8 modules show in the grid. Phases 1–7 look unchanged.

Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat(dashboard): add Capstone badge to Phase 8"
```

---

## Task 8: Add learning outcomes for the three capstone modules

**Files:**
- Modify: `docs/superpowers/specs/2026-05-09-learning-outcomes.md`

- [ ] **Step 1: Read the existing file to copy the entry shape**

Run: `head -40 docs/superpowers/specs/2026-05-09-learning-outcomes.md`
Expected: per-module blocks with the shape `## \`<id>\`` and Bloom-tagged bullets.

- [ ] **Step 2: Append three new blocks**

Append at the end of the file (or insert in module-id order):

```markdown
## `8-1-the-build-pipeline`

After this module the learner can:
- [recall] State what the module graph is and how it differs in dev mode vs build mode.
- [apply] Read a `next build` output and explain which routes share which chunks.
- [judge] Decide between a barrel file and direct imports based on tree-shaking impact.
- [debug] Given a "works in dev, broken in prod" report, list the three most likely build-time causes (env vars, dynamic imports, side-effect imports).
- [build] Configure a project's env vars to split public from server-only correctly.

## `8-2-the-request-lifecycle`

After this module the learner can:
- [recall] Name the eight machines a request passes through and one example of each.
- [apply] Read a Lighthouse waterfall and identify which actor (DNS, server, network, parser, hydrator) is the bottleneck.
- [judge] Given two routes, predict which has lower hydration cost and explain why.
- [debug] Diagnose a "button does not work for the first second" report and name the most common cause.
- [recall] Distinguish hydration mismatch from a normal render error.

## `8-3-the-architecture-of-a-real-app`

After this module the learner can:
- [recall] Name the three flavors of state (URL, server, client) and one example of each from a real app.
- [apply] Given a feature ("add a like button to posts"), name the three architectural decisions before writing code.
- [judge] Choose between a server component and a client component for a given UI piece, with reasoning.
- [debug] Spot the "fetch from your own API in a server component" antipattern and refactor it.
- [build] Write a server action that performs a mutation, validates input with Zod, and revalidates the right paths.
- [recall] Distinguish between authentication that runs in middleware (security) and client-side state (UX hint).
```

- [ ] **Step 3: Commit**

```bash
git add docs/superpowers/specs/2026-05-09-learning-outcomes.md
git commit -m "docs(outcomes): add learning outcomes for Phase 8 capstone modules"
```

---

## Task 9: Style review pass across all four new modules

The Tier-A spec mandates a style-review pass after multiple modules are authored (per `2026-05-09-tier-a-curriculum-design.md` Wave 8). With Phase 0 and Phase 8 now both shipped, this is the right moment.

**Files (all read-only review unless drift is found):**
- `lib/modules/0-1-the-map.tsx`
- `lib/modules/8-1-the-build-pipeline.tsx`
- `lib/modules/8-2-the-request-lifecycle.tsx`
- `lib/modules/8-3-the-architecture-of-a-real-app.tsx`

- [ ] **Step 1: Run the rubric checklist on each module**

For each of the four files, verify:

```
Voice
[ ] All copy in English. No Vietnamese, no other language.
[ ] "You" not "we" throughout.
[ ] Concept-catalog terms used as the catalog states them, italicized on first use.
[ ] No "we'll see later" / "for advanced readers".

Structure
[ ] First line inside the component function is the comment "// Data blocks hoisted out of JSX for readability — listed in render order."
[ ] Hoisted consts have descriptive names.
[ ] Section comments numbered 1–7 (or 1–5 for orientation).
[ ] No emojis in module file.
[ ] Hook is concrete (a failure, mystery, or felt tension), not abstract.
[ ] Mental model stated once early, restated once late.

Tier-A specifics (8-1, 8-2, 8-3 only)
[ ] Step-by-step has 5–8 steps, each with a code field.
[ ] Playground or interactive element present.
[ ] At least one challenge tests application, not recall.
[ ] GotchaList has 3–5 entries.

Length sanity
[ ] If module > 1500 lines, escalate.
```

If any item fails, fix it inline and re-run lint/typecheck.

- [ ] **Step 2: Run the lint guards across all four files explicitly**

Run: `npm run lint -- --max-warnings 0`
Expected: zero errors and zero warnings.

Run: `npm run lint:lang`
Expected: no Vietnamese strings.

- [ ] **Step 3: Walk a learner through each module manually**

Run: `npm run dev`
For each new module, click through every section, every challenge, every step. Watch the browser console for errors.

Stop the dev server.

- [ ] **Step 4: If any drift was fixed, commit it**

```bash
git add lib/modules/
git commit -m "style(modules): post-authoring style review pass across Phase 0 + Phase 8"
```

If no drift found, skip the commit.

---

## Task 10: Final quality gates

- [ ] **Step 1: Lint, typecheck, build**

Run: `npm run lint && npx tsc --noEmit && npm run build`
Expected: all clean.

- [ ] **Step 2: Smoke test the dashboard end to end**

Run: `npm run dev` and visit `http://localhost:3000`. Confirm:
- Phase 0 "Start here" callout above the grid.
- Phase 8 tile in the grid with a "Capstone" badge.
- All three Phase 8 modules accessible.

Click into each new module and verify all sections render.

Stop the dev server.

- [ ] **Step 3: Verify reference-app links work**

In each Phase 8 module's footer, click the "source on GitHub (pinned)" link. The link should resolve to the `taproot-blog-v1.0` commit and show the relevant file.

If any link 404s, the substitution variables in Tasks 3, 4, or 5 were wrong — fix and recommit.

---

## Spec coverage check

| Spec section | Covered by |
|---|---|
| §3 Scope: capstone modules `8-1`, `8-2`, `8-3` | Tasks 3, 4, 5 |
| §3 Scope: dashboard Phase 8 capstone badge | Task 7 |
| §4.1 Phase 8 curriculum entries | Task 1 |
| §5.2 `8-1` shape (mental model, hook, 6 steps, playground, 2 challenges, 4 gotchas) | Task 3 |
| §5.3 `8-2` shape (mental model, hook, 7 steps, sequence diagram, 3 challenges, 4 gotchas) | Task 4 |
| §5.4 `8-3` shape (mental model, hook, 8 steps, playground, 3 challenges, 4 gotchas, alternatives) | Task 5 |
| §5.5 Cross-module references | Tasks 3, 4, 5 (each module&apos;s footer + cross-step references) |
| §6.5 Modules link to pinned reference | Tasks 3, 4, 5 (substitution variables) |
| §10 Verification | Tasks 6 step 3, 7 step 3, 9 step 3, 10 |
| §13 Decisions: 8-3 step count = 8 | Task 5 |
| Wave 8 style review | Task 9 |

---

## Out of scope

- Updates to existing modules (Phases 1–7) — out of scope here.
- Authoring net-new primitives — none required.
- Changes to the reference app (`examples/taproot-blog/`) — handled by Plan 2; this plan only references the pinned commit.
