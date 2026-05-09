# CLAUDE.md

This file is guidance for Claude Code (claude.ai/code) working in this repo.

## What this is

A **Frontend Learning App** following [roadmap.sh/frontend](https://roadmap.sh/frontend), fully re-authored to the Tier-A standard. Every one of the 30 modules is a comprehensive lesson with 7 mandatory pedagogical sections: Hook → Mental model → Step-by-step → Playground → Challenges → GotchaList → KeyTakeaways.

**Audience:** anyone learning frontend from zero. No prior frontend knowledge assumed.

**Curriculum:** 7 phases, 30 modules, covering every yellow node in the official roadmap PDF (read 2026-05-09).

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
  page.tsx                        # Dashboard: 7 phase cards, 30 module tiles (soft-prereq UI)
  lesson/[moduleId]/page.tsx      # Lesson viewer: dynamically loads module content
  layout.tsx                      # Root metadata

lib/
  curriculum.ts                   # All 30 modules' metadata + helpers (single source of truth)
                                  # isModuleUnlocked() always returns true (soft prereqs)
  progress.ts                     # Zustand store; localStorage key 'frontend-learning-progress'
  modules/
    _template.tsx                 # ScaffoldModule helper — deprecated for new authoring; kept for reference
    _demos/                       # Primitive smoke-test pages (not registered, manual verification only)
    index.ts                      # Module-id → component registry
    <module-id>.tsx               # One file per module (e.g. 1-1-how-the-internet-works.tsx)

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
```

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

`{phase}-{order}-{slug}` — e.g. `1-1-how-the-internet-works`, `5-3-pick-a-framework`, `7-8-performance`.

The corresponding component export is `Module_<phase>_<order>_Content` — e.g. `Module_5_3_Content`.

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

The roadmap PDF was read on 2026-05-09 at `https://roadmap.sh/pdfs/roadmaps/frontend.pdf`. The `§1` coverage table in `docs/superpowers/plans/2026-05-09-tier-a-curriculum-plan.md` (and the original `2026-05-09-frontend-roadmap-learning-app.md`) maps every yellow node to a module ID.

## Style

- All copy in **English**. The `lint:lang` script enforces this.
- "You" not "we" — direct address to the reader.
- Use double quotes in JSX attributes.
- Escape `'`, `<`, `>`, `"` in JSX text where needed (`&apos;`, `&lt;`, `&gt;`, `&quot;`).
- Strict TypeScript — no `any`, no unused imports.
- No comments unless the *why* is non-obvious.
