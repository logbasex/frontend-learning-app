# CLAUDE.md

This file is guidance for Claude Code (claude.ai/code) working in this repo.

## What this is

A **Frontend Learning App** following [roadmap.sh/frontend](https://roadmap.sh/frontend). Story-driven curriculum: each module names the problem first, then teaches the mental model, then drops the learner into live code.

**Audience:** developers learning the frontend stack from first principles.

**Curriculum:** 7 phases, 30 modules, mapping every yellow node in the official roadmap PDF.

## Dev commands

```bash
npm run dev      # Next.js dev server (port 3000, falls back to 3001)
npm run build    # Production build (Turbopack)
npm run lint     # ESLint
npm start        # Run production build
```

## Architecture

```
app/
  page.tsx                        # Dashboard: 7 phase cards, 30 module tiles
  lesson/[moduleId]/page.tsx      # Lesson viewer: dynamically loads module content
  layout.tsx                      # Root metadata

lib/
  curriculum.ts                   # All 30 modules' metadata + helpers (single source of truth)
  progress.ts                     # Zustand store; localStorage key 'frontend-learning-progress'
  modules/
    _template.tsx                 # ScaffoldModule helper (used by Tier-B modules)
    index.ts                      # Module-id → component registry
    <module-id>.tsx               # One file per module (e.g. 1-1-how-the-internet-works.tsx)

components/
  Challenge.tsx                   # Multiple-choice with feedback
  CodeBlock.tsx                   # Prism static syntax highlighting
  CodePlayground.tsx              # Sandpack live HTML/CSS/JS + ReactPlayground
  CodeComparison.tsx              # Side-by-side old vs new
  InteractiveDiagram.tsx          # ReactFlow diagrams (incl. BrowserRenderingPipeline)
  KeyTakeaways.tsx                # Bulleted takeaways + "mental model" pull-quote
  RoadmapLink.tsx                 # Inline link back to the roadmap.sh node
  StepByStepExplanation.tsx       # Animated step-through with progress bar
  ui/                             # shadcn/ui primitives

docs/superpowers/
  specs/2026-05-09-...-design.md  # Design spec (the WHY)
  plans/2026-05-09-...-app.md     # Implementation plan (the HOW)
```

## Module content pattern — two tiers

**Tier A (deep, 1 module):** `lib/modules/1-1-how-the-internet-works.tsx`. ~570 lines. Full template:
problem statement → 6-step `StepByStepExplanation` → live `HTMLPlayground` → `InteractiveDiagram` → 2 `Challenge`s → `KeyTakeaways` with mental model.

**Tier B (scaffold, 29 modules):** All other modules use `ScaffoldModule` from `_template.tsx`. ~100–250 lines each:
problem statement (3 paragraphs) → ONE body primitive (`HTMLPlayground` OR `CodeBlock` OR `BrowserRenderingPipeline`) → 1 `Challenge` → `KeyTakeaways`. Consistent shape, fast to add.

### `ScaffoldModule` prop shape

```tsx
<ScaffoldModule
  emoji="🌐"
  problemTitle="..."
  problem={<><p>...</p><p>...</p></>}
  body={<HTMLPlayground html={...} css={...} js={...} title="..." />}
  challenge={{
    question: "...",
    options: [{ id: "a", text: "..." }, { id: "b", text: "..." }, ...],
    correctAnswerId: "b",
    explanation: <>...</>,
  }}
  takeaways={[<>...</>, <>...</>, <>...</>]}
  mentalModel="..."
  roadmapUrl="https://roadmap.sh/frontend"
/>
```

## Adding a new module

1. Add the module's metadata to the right `Phase` in `lib/curriculum.ts`. Pick a stable `id` (e.g. `8-1-graphql-mutations`).
2. Create `lib/modules/<id>.tsx`. Export `Module_<X>_<Y>_Content` (`X` = phase, `Y` = order).
3. Register the component in `lib/modules/index.ts`.
4. `npm run dev` and visit `/lesson/<id>`.

## Module content ID convention

`{phase}-{order}-{slug}` — e.g. `1-1-how-the-internet-works`, `5-3-pick-a-framework`, `7-8-performance`.

The corresponding component is `Module_<phase>_<order>_Content` — e.g. `Module_5_3_Content`.

## Progress system

`lib/progress.ts` is a Zustand store persisted to `localStorage` under the key `frontend-learning-progress`. It tracks:

- `completedModules: string[]`
- `bookmarkedModules: string[]`
- `notes: Record<string, string>`
- `currentModule: string | null`

Modules **unlock** as their prerequisites complete (`isModuleUnlocked` helper in `curriculum.ts`).

To wipe progress while developing: clear that localStorage key in DevTools.

## Quality gates

Every change should keep these green:

```bash
npm run lint        # zero errors
npx tsc --noEmit    # zero errors
npm run build       # succeeds
```

Lint rules to watch for:
- `@next/next/no-assign-module-variable` — don't name a local `module` (use `moduleData`, `m`, etc.).
- `react-hooks/static-components` — when receiving a component from a function, render it via `React.createElement(component)` rather than `<Component />` to avoid the "created during render" warning.

## Source of truth for the curriculum

The roadmap PDF was read on 2026-05-09 at `https://roadmap.sh/pdfs/roadmaps/frontend.pdf`. The `§1` coverage table in `docs/superpowers/plans/2026-05-09-frontend-roadmap-learning-app.md` maps every yellow node in the PDF to a module ID. If the user asks to add coverage, check that table first.

## Style

- All copy in **English**.
- Use double quotes in JSX attributes.
- Escape `'`, `<`, `>` in JSX text where needed (`&apos;`, `&lt;`, `&gt;`).
- Strict TypeScript — no `any`, no unused imports.
- No comments unless the *why* is non-obvious.
