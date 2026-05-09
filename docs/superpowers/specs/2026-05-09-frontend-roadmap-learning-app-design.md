# Frontend Learning App — Spec

**Date:** 2026-05-09
**Author:** Claude (autonomous, auto mode)
**Status:** Draft (author offline; will review later)

## 1. Goal

Pivot the existing `frontend-learning-app` repo (currently a JavaFX learning app) into a **story-driven Frontend learning platform** that follows the public roadmap at `https://roadmap.sh/frontend`. Same teaching philosophy ("understand WHY, then HOW"), same interactive primitives, but the curriculum, branding, and runtime examples are now fully web-frontend.

## 2. Scope (single spec, one implementation pass)

In scope:
- Replace curriculum metadata with a frontend roadmap mapped to ~24 modules across 6 phases.
- Rebrand the app shell (titles, copy, README, persistence key).
- Reuse and extend existing components (`Challenge`, `CodeBlock`, `CodePlayground`/`HTMLPlayground`/`ReactPlayground`, `StepByStepExplanation`, `CodeComparison`, `InteractiveDiagram`). Drop/retire JavaFX-only viewers (`JavaFXDemoViewer`).
- Author one full reference module (Phase 1.1) at the same depth as the JavaFX gold-standard module (~700–1000 lines), and shorter scaffolds for the remaining modules so the dashboard works end-to-end without "content is being developed" placeholders dominating.
- Wire the existing dashboard + lesson pages to the new curriculum without changing their structure.

Out of scope (deliberate):
- Backend/server-rendered features beyond what Next.js already provides.
- Auth, accounts, syncing progress across devices.
- Video production. Demos use inline SVG, screenshots, or live Sandpack — no external image hosts.
- Hero-desktop-2 enterprise context (was JavaFX-specific). The `hasHeroDesktop2Context` field is removed.
- A second worktree, multi-PR sequence, or cross-repo work.

## 3. Curriculum (mapped from roadmap.sh/frontend)

Six phases, 24 modules. Order matches roadmap.sh's recommended path with light reorganization for narrative flow.

**Phase 1 — Internet & Web Foundations**
- `1-1-how-the-internet-works` — How the Internet, DNS, TCP/IP, HTTP work together
- `1-2-http-and-https` — Request/response anatomy, methods, status codes, HTTPS/TLS
- `1-3-browsers-and-rendering` — How browsers parse HTML/CSS/JS and paint pixels
- `1-4-domain-and-hosting` — Domains, hosting, CDNs, deployment basics

**Phase 2 — HTML & CSS**
- `2-1-semantic-html` — Semantic tags, document outline, accessibility-first HTML
- `2-2-forms-and-validation` — Inputs, native validation, accessible forms
- `2-3-css-fundamentals` — Selectors, specificity, the cascade, box model
- `2-4-flexbox-and-grid` — Modern layout: when to reach for which
- `2-5-responsive-design` — Media queries, fluid type, mobile-first
- `2-6-accessibility` — WCAG, ARIA, keyboard, screen readers

**Phase 3 — JavaScript & the DOM**
- `3-1-javascript-fundamentals` — Types, scope, closures, this
- `3-2-modern-js` — let/const, modules, destructuring, spread, optional chaining
- `3-3-dom-and-events` — Querying, mutating, delegation, the event loop
- `3-4-async-javascript` — Callbacks → Promises → async/await; fetch
- `3-5-modules-and-build` — ES Modules, bundlers, why we ship them

**Phase 4 — Tooling & Workflow**
- `4-1-git-and-github` — Branching model, PR workflow, conflict resolution
- `4-2-package-managers` — npm vs pnpm vs yarn; lockfiles; semver
- `4-3-bundlers` — Vite vs Webpack vs esbuild; what a bundler actually does
- `4-4-typescript-intro` — Why types; structural typing; from JS to TS

**Phase 5 — Frameworks & State**
- `5-1-react-fundamentals` — Components, JSX, props, state
- `5-2-state-management` — Local → lifted → context → Zustand/Redux
- `5-3-routing-and-data` — Client routing, server data, suspense
- `5-4-ssr-ssg-rsc` — When to render where; Next.js mental model

**Phase 6 — Production Concerns**
- `6-1-testing` — Unit, integration, E2E; the testing pyramid for the frontend
- `6-2-auth-and-apis` — Cookies, JWT, OAuth, REST, talking to GraphQL
- `6-3-web-security` — XSS, CSRF, CSP, supply chain
- `6-4-performance-and-pwa` — Core Web Vitals, service workers, offline

Total: **24 modules**.

Each module retains the existing metadata shape, with two changes:
- Drop `hasHeroDesktop2Context: boolean`.
- Add `roadmapUrl: string` — deep-link back to the corresponding roadmap.sh node, so the lesson page can include "See on roadmap.sh".

## 4. Architecture

The current architecture is fit for purpose. Reuse it as-is:

```
lib/curriculum.ts        — module metadata + helpers (replaced wholesale)
lib/progress.ts          — Zustand store (key renamed to frontend-learning-progress)
lib/modules/index.ts     — module-id → component registry
lib/modules/<id>.tsx     — one file per module's interactive content

app/page.tsx             — dashboard (reused, copy updated)
app/lesson/[moduleId]    — lesson viewer (reused as-is)
app/layout.tsx           — root metadata (title/description updated)

components/              — Challenge, CodeBlock, CodeComparison, CodePlayground,
                           HTMLPlayground, ReactPlayground, StepByStepExplanation,
                           InteractiveDiagram (all reused)
```

**Removed:** `components/JavaFXDemoViewer.tsx` and the `JavaCodePlayground` export inside `CodePlayground.tsx` (JavaFX-only). The file `lib/modules/1-1-why-javafx.tsx` is replaced by Phase 1 content.

**Added:** small helpers in `components/`:
- `KeyTakeaways.tsx` — boxed list + "Mental Model" pull-quote (this pattern was inlined in every JavaFX module; extracting it removes ~30 lines of boilerplate per module).
- `RoadmapLink.tsx` — small badge linking to the roadmap.sh node for a module.

## 5. Module template

Every module exports `Module_X_Y_Content()` and renders these sections (any may be omitted if the topic doesn't warrant it):

1. **Problem statement** — historical/practical context, the WHY.
2. **Step-by-step explanation** — 4–7 `Step` items via `StepByStepExplanation`.
3. **Live code** — `HTMLPlayground` or `ReactPlayground` for runnable web code; `CodeBlock` for static snippets.
4. **Comparison** — `CodeComparison` when contrasting old/new (e.g., callbacks vs async/await, jQuery vs vanilla DOM).
5. **Diagram** — `InteractiveDiagram` for flow-style visuals (rendering pipeline, virtual DOM, request lifecycle).
6. **Challenges** — at least 1, ideally 2 `Challenge` components.
7. **Key takeaways** — `KeyTakeaways` block with mental model.

For the reference module (`1-1-how-the-internet-works`), all seven sections are present and richly populated (~700–1000 lines). For the rest, scaffolds include problem statement + at least one playground or diagram + 1 challenge + key takeaways. This keeps the dashboard navigable without 23 "content coming soon" placeholders.

## 6. Data flow

Unchanged from the existing app:

```
curriculum.ts (Phase[])
        ↓
Dashboard renders phases → modules
        ↓
Lesson page reads moduleId → getModuleContent(moduleId)
        ↓
Renders <Module_X_Y_Content /> + navigation
        ↓
Progress store (Zustand+localStorage) tracks completion
```

Persistence key changes from `javafx-learning-progress` to `frontend-learning-progress`. Existing JavaFX progress is intentionally **not** migrated — different curriculum, no meaningful mapping.

## 7. Error handling

Boundary cases to handle explicitly:
- Unknown `moduleId` → dashboard "module not found" card (already handled).
- Module without content component → existing fallback already prints "content is being developed". Updated copy to reference the new curriculum.
- Sandpack failures (offline, sandbox restrictions) → Sandpack already shows its own error UI; no extra wrapping needed.

No new error paths are introduced.

## 8. Testing

The repo has no test infrastructure today and the user did not ask for one. Verification gates:
- `npm run lint` clean
- `npm run build` succeeds
- `npm run dev` boots; manual click-through of dashboard → at least the reference module renders without runtime errors

If the user wants automated tests later, that's a follow-up spec. Adding Jest/Vitest now would expand scope beyond the request.

## 9. Decisions & rationale (made autonomously per "decide everything yourself")

| Decision | Choice | Why |
|---|---|---|
| Repo strategy | In-place rewrite (no new repo, no worktree) | Existing infra is reusable; user said "follows this roadmap" — implying same project. |
| Migrate JavaFX progress? | No | Different domain; preserving stale state would confuse. |
| Languages in copy | English-only for new content | The JavaFX module mixed Vietnamese in some component strings (e.g., Challenge "Kiểm tra đáp án"). Leaving those component strings as-is for now (they're shared infra) and writing module copy in English. Translation pass is a follow-up if requested. |
| Module count | 24 (vs JavaFX's 18) | Roadmap.sh frontend is broader than desktop GUI; 24 is the smallest set that doesn't omit a major roadmap branch. |
| Reference module depth | One deep module + 23 scaffolds | A "rich content for all 24" interpretation would be 20k+ lines and not deliverable in a single autonomous pass at quality. One gold-standard module proves the pattern; scaffolds make every dashboard tile a real page. |
| `roadmapUrl` field | Added | Lets each lesson link back to the public roadmap so users can see where they are in the bigger picture. |
| Internationalization | Skipped | Not in original ask. |

## 10. Implementation order

1. Spec committed (this file).
2. Rebrand shell: `package.json`, `app/layout.tsx`, dashboard copy, README.
3. Replace `lib/curriculum.ts` with the 24-module curriculum.
4. Update `lib/progress.ts` (key + total).
5. Add `KeyTakeaways` and `RoadmapLink` helpers.
6. Remove `JavaFXDemoViewer.tsx` and the `JavaCodePlayground` export. Delete `lib/modules/1-1-why-javafx.tsx`.
7. Author reference module `1-1-how-the-internet-works` in full.
8. Author scaffolds for remaining 23 modules.
9. Register all 24 modules in `lib/modules/index.ts`.
10. Update `CLAUDE.md` to reflect the new project identity.
11. `npm run lint` + `npm run build`. Fix issues.
12. Commit in logical chunks (spec / shell / curriculum / components / content / docs).

## 11. Risks

- **Sandpack bundle weight on dashboard nav** — already a risk in the JavaFX app; not made worse here. Lazy import is already implicit since module content components are only loaded on `/lesson/[id]`.
- **Type-checker drift after deleting `JavaCodePlayground`** — only `lib/modules/1-1-why-javafx.tsx` imports it, and that file is being deleted in the same pass.
- **Scope creep into authoring full content for 24 modules** — explicitly bounded above: 1 deep + 23 scaffolds.
