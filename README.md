# Frontend Learning App 🌐

A story-driven, interactive learning app that follows the public [roadmap.sh/frontend](https://roadmap.sh/frontend) curriculum.

Each module starts with the *problem* a technology solves, walks through the *mental model*, drops you into *live code*, and ends with a *challenge* and a *takeaway*. The goal: understand the **why**, not just the **how**.

## Curriculum

**7 phases, 30 modules**, mapping every yellow node in the official roadmap PDF:

1. **Internet & Web Foundations** — how the internet, HTTP, DNS, hosting, and browsers actually work
2. **HTML** — semantic markup, forms, accessibility, SEO
3. **CSS** — fundamentals, Flexbox/Grid, responsive design, modern styling, BEM/preprocessors
4. **JavaScript** — language fundamentals, DOM/events, fetch & async
5. **Workflow & Frameworks** — Git, package managers, pick-a-framework, TypeScript
6. **Build, Test & Secure** — linters, bundlers, testing, auth, web security
7. **Beyond the Browser & Production** — Web Components, SSR, GraphQL, SSG, PWA, mobile, desktop, performance

Module 1.1 (`/lesson/1-1-how-the-internet-works`) is the gold-standard reference module with the full template; the other 29 are tighter scaffolds with a problem statement, one piece of interactive content, a challenge, and key takeaways.

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000 (or 3001 if 3000 is taken).

## How it's built

- **Next.js 16** (App Router, React 19, TypeScript)
- **Tailwind CSS v4** + **shadcn/ui** primitives
- **Sandpack** for live HTML/CSS/JS playgrounds
- **@xyflow/react** for interactive diagrams
- **Prism** for static syntax highlighting
- **Zustand** for progress tracking, persisted to `localStorage` under the key `frontend-learning-progress`

## Adding a module

1. Create `lib/modules/<id>.tsx` exporting `Module_<X>_<Y>_Content`. Use `ScaffoldModule` (from `lib/modules/_template.tsx`) for short modules, or hand-roll like `1-1-how-the-internet-works.tsx` for deep ones.
2. Register the new component in `lib/modules/index.ts`.
3. Make sure the `id` is also listed in `lib/curriculum.ts`. The dashboard reads from there.

## Spec & plan

The full design lives at `docs/superpowers/specs/2026-05-09-frontend-roadmap-learning-app-design.md`; the implementation plan lives at `docs/superpowers/plans/2026-05-09-frontend-roadmap-learning-app.md`.
