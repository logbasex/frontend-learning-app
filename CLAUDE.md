# CLAUDE.md

This file is guidance for Claude Code (claude.ai/code) working in this repo.

## What this is

A **Frontend Learning App** that teaches frontend from first principles. The curriculum is one continuous derivation: 5 stages of "the previous module's world hit a wall, here is what has to exist next" plus one closing module that uses the foundation to position every other roadmap topic. Every spine module is a comprehensive lesson with 7 mandatory pedagogical sections: Hook → Mental model → Step-by-step → Playground → Challenges → GotchaList → KeyTakeaways.

**Audience:** anyone learning frontend from zero. No prior frontend knowledge assumed.

**Curriculum:** 5 stages + 1 closing module, 15 modules total. The reference app `examples/taproot-blog` is the spine — every module ships working code on it (static → SPA → Next.js, climbed one rung at a time). Every roadmap.sh yellow node is named at least once; spine modules are taught in depth, non-spine topics are positioned in the closing module. Source-of-truth spec: `docs/superpowers/specs/2026-05-10-first-principles-curriculum-design.md`.

## Dev commands

```bash
npm run dev       # Next.js dev server (port 3000, falls back to 3001)
npm run build     # Production build (Turbopack)
npm run lint      # ESLint + the lint:lang Vietnamese guard
npm run lint:lang # just the language guard
npm start         # Run production build
```

## Architecture

```
app/
  page.tsx                        # Dashboard: 6 stage cards (Stage 1-5 + Closing), 15 module tiles (soft-prereq UI)
  lesson/[moduleId]/page.tsx      # Lesson viewer: dynamically loads module content
  layout.tsx                      # Root metadata

lib/
  curriculum.ts                   # All 15 modules' metadata + helpers (single source of truth, organized by Stage)
                                  # isModuleUnlocked() always returns true (soft prereqs)
                                  # Each module has drivingFailure and shipsInReferenceApp fields
  progress.ts                     # Zustand store; localStorage key 'frontend-learning-progress'
  modules/
    _placeholder.tsx              # Used only during multi-task module authoring; do not register in production
    index.ts                      # Module-id → component registry
    <module-id>.tsx               # One file per module (e.g. 1-1-the-smallest-useful-thing.tsx)

components/
  Challenge.tsx                   # Multiple-choice with feedback
  CodeBlock.tsx                   # Prism static syntax highlighting
  CodePlayground.tsx              # Sandpack live HTML/CSS/JS (also exports HTMLPlayground, ReactPlayground)
  CodeComparison.tsx              # Side-by-side old vs new
  EventLoopVisualizer.tsx         # Animated call-stack / queue / microtasks with scripted trace
  FlexboxControls.tsx             # Live Flexbox property explorer
  GotchaList.tsx                  # "Things that surprise people" — title + bullet pairs (section 6)
  GridControls.tsx                # Live CSS Grid property explorer
  InteractiveDiagram.tsx          # ReactFlow diagrams (incl. BrowserRenderingPipeline)
  KeyTakeaways.tsx                # Bulleted takeaways + "mental model" pull-quote
  LayeredFlow.tsx                 # Left-to-right or top-to-bottom labeled stages with arrows
  LiveCascadeDemo.tsx             # Two CSS rules side-by-side; specificity computed; winner highlighted
  RoadmapLink.tsx                 # Inline link back to the roadmap.sh node
  SequenceDiagram.tsx             # Sequence-of-actors layout (browser, DNS, server, etc.)
  StepByStepExplanation.tsx       # Animated step-through with progress bar
  TerminalPlayground.tsx          # Animated terminal for Git/npm/CLI modules
  ui/                             # shadcn/ui primitives

docs/superpowers/
  specs/
    2026-05-09-tier-a-curriculum-design.md      # Design spec (the WHY + structural conventions)
    2026-05-09-concept-catalog.md               # Canonical one-line definitions for ~100 terms
    2026-05-09-learning-outcomes.md             # Per-module Bloom-verb outcome lists
    2026-05-09-style-audit-findings.md          # Wave-8 audit findings (completed cleanup)
  plans/
    2026-05-09-tier-a-curriculum-plan.md        # 10-wave implementation plan (44 tasks, complete)
    2026-05-09-frontend-roadmap-learning-app.md # Original roadmap coverage table (§1)

scripts/
  check-no-vietnamese.mjs         # lint:lang guard — fails if any Vietnamese character appears
                                  # under components/, lib/, or app/

examples/taproot-blog/            # reference app for Phase 8 capstone (separate workspace)
  static/                         # Level 1 — hand-written HTML+CSS, no build
  spa/                            # Level 2 — Vite + React + MSW
  app/                            # Level 3 — Next.js + Prisma + NextAuth
```

The `examples/taproot-blog/` directory is a separate workspace and is **not** part of the learning app's build, lint, or typecheck. It has its own CI workflow at `.github/workflows/examples-blog.yml`. The Vietnamese-character lint guard does not scan `examples/`.

## Tier-A module template

Every module has exactly 7 mandatory sections in this order. Authoritative reference: `docs/superpowers/specs/2026-05-09-tier-a-curriculum-design.md` §2.1 + §4.

1. **Hook** — concrete failure, mystery, or felt tension (1–2 paragraphs). Not "today we'll learn X."
2. **Mental model first** — one-sentence model stated before any syntax, ending in a `<blockquote>` pull-quote.
3. **Step-by-step** — `StepByStepExplanation` with 5–7 steps; each `description` is a JSX fragment; each step has a `code` field.
4. **Playground** — `HTMLPlayground` / `ReactPlayground` / `TerminalPlayground`; first line of JS is always a `// Try this:` comment.
5. **Challenges** — 2 (or 3) `Challenge` components; test application or judgment, not definitions.
6. **GotchaList** — exactly 4 entries. Titles in JS object literals use plain `'`, not `&apos;`.
7. **KeyTakeaways** — 4–6 bullets; `mentalModel` prop verbatim mirrors the §2 pull-quote.

Optional sections (sequence diagram, layered flow, code comparison, alternatives card) may appear between mandatory sections; mark them with an unnumbered comment, e.g. `{/* Optional: Sequence diagram (DNS resolution) */}`.

**The closing module (`6-1-the-field-from-here`) is an exception.** It does not introduce a new derivation; instead it uses the foundation the learner already has to position every roadmap.sh topic the spine did not cover. It has a Hook (an explicit framing of why this module is different), a "field map" diagram in place of a Step-by-step, and a Challenges section that asks the learner to position a tool against the foundation — but it does not have a Playground or a Driving Failure, because nothing is being derived. This exception applies to module 6-1 only. All other modules follow the standard 7-section Tier-A template.

## Structural conventions (§4.1 of the spec)

These were codified after Wave 3 to prevent drift:

- No `<h2>` or `<h3>` inside Hook or Mental Model `<Card>`s — prose only (`<p>` and inline tags).
- No emojis anywhere in module files.
- **First line inside the component function** must be the comment `// Data blocks hoisted out of JSX for readability — listed in render order.` followed by hoisted consts (step arrays, playground HTML strings, etc.).
- Step arrays must have descriptive names — `cascadeSteps`, `httpAnatomySteps` — never just `steps`.
- Section comments in the JSX return are numbered 1–7 for mandatory sections; optional sections use unnumbered comments.
- Catalog terms italicized on first use via real `<em>` JSX (not markdown emphasis).

## Concept catalog

Before using any domain term, check `docs/superpowers/specs/2026-05-09-concept-catalog.md` for the canonical one-line definition. Use that exact phrasing when introducing the term for the first time. First use in a module that does not own the term: italicize via `<em>`.

## Per-module learning outcomes

Each module's completion criteria is defined in `docs/superpowers/specs/2026-05-09-learning-outcomes.md`. A module is "done" when every Bloom-verb outcome is exercised somewhere (challenge, playground exercise, or exposition).

## How to add a new module

1. Add the module's metadata to the right `Phase` in `lib/curriculum.ts`. Pick a stable `id` (e.g. `8-1-graphql-mutations`).
2. Create `lib/modules/<id>.tsx` following the 7-section Tier-A template. Export `Module_<X>_<Y>_Content`.
3. Register the component in `lib/modules/index.ts`.
4. `npm run dev` and visit `/lesson/<id>`.

Do not use `ScaffoldModule` for new modules — it is deprecated. Write the 7 sections directly.

## Module content ID convention

`{stage}-{order}-{slug}` — e.g. `1-1-the-smallest-useful-thing`, `5-3-identity-and-trust`, `6-1-the-field-from-here`.

The corresponding component export is `Module_<stage>_<order>_Content` — e.g. `Module_5_3_Content`.

## Progress system

`lib/progress.ts` is a Zustand store persisted to `localStorage` under the key `frontend-learning-progress`. It tracks:

- `completedModules: string[]`
- `bookmarkedModules: string[]`
- `notes: Record<string, string>`
- `currentModule: string | null`

**Prerequisites are soft.** `isModuleUnlocked()` always returns `true`. The dashboard shows a "Recommended first: N earlier modules" badge rather than locking a module. The `prerequisites` field in `curriculum.ts` still exists and informs that recommendation; it does not gate access.

To wipe progress while developing: clear the `frontend-learning-progress` key in DevTools → Application → Local Storage.

## Quality gates

Every change must keep these green:

```bash
npm run lint        # zero errors (ESLint + Vietnamese guard)
npx tsc --noEmit    # zero errors
npm run build       # succeeds
```

Lint rules to watch for:

- `@next/next/no-assign-module-variable` — don't name a local variable `module`; use `moduleData`, `m`, etc.
- `react-hooks/static-components` — render registry-fetched components via `React.createElement(component)`, not `<Component />`, to avoid the "created during render" warning.
- `react/no-unescaped-entities` — escape `'`, `<`, `>`, `"` in JSX text (`&apos;`, `&lt;`, `&gt;`, `&quot;`). Note: JSX attribute strings (`question="..."`) decode HTML entities correctly; JS object literals (`title: "..."`) do not — use plain characters in the latter.
- The `lint:lang` script blocks any Vietnamese character anywhere under `components/`, `lib/`, or `app/`.

## Source of truth for the curriculum

The first-principles spec is `docs/superpowers/specs/2026-05-10-first-principles-curriculum-design.md`. §3 defines the spine module-by-module; §7 maps every roadmap.sh yellow node to a spine module (taught in depth) or to module 6-1 (positioned). The roadmap PDF was last read on 2026-05-09 at `https://roadmap.sh/pdfs/roadmaps/frontend.pdf`.

## Style

- All copy in **English**. The `lint:lang` script enforces this.
- "You" not "we" — direct address to the reader.
- Use double quotes in JSX attributes.
- Escape `'`, `<`, `>`, `"` in JSX text where needed (`&apos;`, `&lt;`, `&gt;`, `&quot;`).
- Strict TypeScript — no `any`, no unused imports.
- No comments unless the *why* is non-obvious.
