# Frontend Learning App

A comprehensive, interactive frontend learning app following the [roadmap.sh/frontend](https://roadmap.sh/frontend) curriculum. Localhost only.

## What this is

30 modules across 7 phases, covering every yellow node in the official roadmap PDF. Each module is a Tier-A lesson built around a concrete tension hook, a one-sentence mental model, step-by-step exposition with live code, a learner-operated playground, active-recall challenges, a gotcha list, and key takeaways. The goal: understand the why before the how.

## Run it locally

```bash
npm install
npm run dev
# open http://localhost:3000
```

## What's inside

- 7 phases, 30 modules covering every yellow node in roadmap.sh/frontend (read 2026-05-09)
- 8 reusable interactive primitives: `GotchaList`, `SequenceDiagram`, `LayeredFlow`, `TerminalPlayground`, `LiveCascadeDemo`, `FlexboxControls`, `GridControls`, `EventLoopVisualizer`
- Sandpack-powered live playgrounds in every module
- Soft prerequisites — every module is reachable from the start; the dashboard recommends a sequence

## Documentation

- Design spec: [`docs/superpowers/specs/2026-05-09-tier-a-curriculum-design.md`](docs/superpowers/specs/2026-05-09-tier-a-curriculum-design.md)
- Concept catalog (canonical term definitions): [`docs/superpowers/specs/2026-05-09-concept-catalog.md`](docs/superpowers/specs/2026-05-09-concept-catalog.md)
- Per-module learning outcomes: [`docs/superpowers/specs/2026-05-09-learning-outcomes.md`](docs/superpowers/specs/2026-05-09-learning-outcomes.md)
- Implementation plan (10 waves, 44 tasks, complete): [`docs/superpowers/plans/2026-05-09-tier-a-curriculum-plan.md`](docs/superpowers/plans/2026-05-09-tier-a-curriculum-plan.md)

## Tech

Next.js 16 / React 19 / TypeScript / Tailwind 4 / shadcn/ui / `@codesandbox/sandpack-react` / `@xyflow/react` / framer-motion / Zustand. Localhost only.

## Source

Following [roadmap.sh/frontend](https://roadmap.sh/frontend).
