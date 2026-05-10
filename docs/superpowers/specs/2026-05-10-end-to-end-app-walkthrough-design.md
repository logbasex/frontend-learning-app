# End-to-End App Walkthrough — Design Spec

**Date:** 2026-05-10
**Status:** Draft, awaiting user review
**Builds on:** `2026-05-09-tier-a-curriculum-design.md` (Tier-A pedagogy, primitives, voice rules — all carry over).

## 1. Goal

Add an integrated "how a modern frontend app actually works, end-to-end" walkthrough to the curriculum, so that a learner who finishes the existing 30 modules can answer the question:

> *I understand HTML, CSS, JS, React, Vite, Next.js, auth, and security — but I still can't picture how all of those stitch together in a real app. What happens between `git push` and a user typing in a comment box?*

The deliverable is **a Phase 0 orientation module + a 3-module Phase 8 capstone**, anchored to a real reference app (`taproot-blog`) that lives in this repo as a standalone workspace at `examples/taproot-blog/`.

The capstone shows the same app three ways: a static-HTML version, an SPA version, and a full-stack Next.js version. Each Phase 8 module looks at that app through one lens — build, request lifecycle, architecture — so the learner triangulates rather than walking through three independent toy examples.

## 2. Audience and pedagogical philosophy

Same audience as the existing curriculum: anyone learning frontend from zero, content optimised for the broader audience.

**This spec adds two pedagogical moves:**

1. **Orientation up front.** A 10-minute "map" module before Phase 1 so beginners have a frame to slot every later module into. No syntax taught, no playground — just a labelled diagram of the three lives of a modern app and a phase-by-phase preview.

2. **Integrative capstone with one shared example.** Three Tier-A modules at the end, all referencing the same reference app, so the learner sees how building, requesting, and architecting are three views of the same thing — not three separate topics. The reference app exists at three implementation levels (static, SPA, full-stack) so the learner can see what each layer of "modern" is adding.

Both moves preserve the existing Tier-A discipline: every Phase 8 module follows the 7-section template; the orientation module deliberately diverges (5 sections, no playground, no challenges) and §9 documents the exception.

## 3. Scope

**In scope:**
- One orientation module: `0-1-the-map`.
- Three capstone modules: `8-1-the-build-pipeline`, `8-2-the-request-lifecycle`, `8-3-the-architecture-of-a-real-app`.
- A reference app at `examples/taproot-blog/` with three levels (static / SPA / full-stack Next.js).
- Dashboard surface changes to expose Phase 0 (start-here callout) and Phase 8 (capstone badge).
- Catalog and learning-outcomes additions for the new modules.
- CI workflow for the reference app, separate from the learning-app CI.
- Vercel deploy of Level 3 of the reference app to a stable preview URL, pinned to a tagged commit.

**Out of scope:**
- New primitive components — the capstone reuses what exists.
- Modifying any existing module.
- Reordering the existing 30 modules.
- Translating the reference app into other frameworks (SvelteKit, Nuxt, Remix). The "Alternatives" sidebar in 8-3 mentions them in one paragraph.
- A rich CMS or a backend the learner has to operate. The blog uses SQLite locally and Postgres on the deployed preview; both are managed automatically.
- A dark/light theme toggle in the reference app. System preference only, kept simple.
- A monorepo / workspace integration of the reference app with the learning app. They are separate npm projects.

## 4. Deliverables

### 4.1. Curriculum additions

| ID | Title | Phase | Duration | Shape |
|---|---|---|---|---|
| `0-1-the-map` | The Map: How Modern Frontend Apps Are Shaped | 0 | 10 min | 5-section orientation |
| `8-1-the-build-pipeline` | The Build Pipeline | 8 | 35 min | Tier-A (7 sections) |
| `8-2-the-request-lifecycle` | The Request Lifecycle | 8 | 35 min | Tier-A (7 sections) |
| `8-3-the-architecture-of-a-real-app` | The Architecture of a Real App | 8 | 40 min | Tier-A (7 sections, 8 steps justified by integrative scope) |

### 4.2. Reference app

A two-author blog called *Taproot* implemented at three levels in one repo:

```
examples/taproot-blog/
  README.md                          how to run each level locally
  static/                            Level 1 — hand-written HTML+CSS, no build
  spa/                               Level 2 — Vite + React, mock JSON API
  app/                               Level 3 — Next.js 15 App Router, full-stack
```

Levels 1 and 2 are reading-only; Level 3 is the full-stack target with auth, comments, admin, mutations, deploy.

The blog is **not** part of the learning app's build. It is a separate workspace shipped as a standalone reference that learners can clone, run, and read.

### 4.3. Documentation updates

- `docs/superpowers/specs/2026-05-09-concept-catalog.md` — add ~10 new entries (module graph, bundle, chunk, tree-shaking, hydration mismatch, server component, client component, server action, optimistic UI, prefetch).
- `docs/superpowers/specs/2026-05-09-learning-outcomes.md` — add Bloom-verb outcome blocks for the four new modules.
- `CLAUDE.md` — document the orientation-module exception and the `examples/taproot-blog/` workspace.

## 5. Module shapes

### 5.1. `0-1-the-map` (orientation, 5 sections)

**Mental model (one sentence):** *A modern frontend app has three lives — written life (source), built life (bundle), and running life (browser + server). Each life has its own rules and its own debugging tools.*

| Section | Content |
|---|---|
| 1. Hook | "Open any modern web app's DevTools Network tab and you'll see hundreds of files — none of which exist in the source code. So what's between `git push` and the user's screen?" |
| 2. Mental model | The one-sentence model above, with a `<blockquote>` pull-quote. |
| 3. The map | One labelled `LayeredFlow` diagram: source → build → deploy → request → runtime, every box a phase or module the learner will visit. |
| Optional: Before/after | `CodeComparison` — 2010 frontend (one HTML, one JS, one CSS, no build) vs 2026 frontend (the same diagram with all the boxes filled in). Shows what "modern" is adding. |
| 4. Curriculum preview | Each phase mapped onto the diagram, with deep-links to the first module of each phase. |
| 5. KeyTakeaways | 4 bullets, mental model restated. No playground, no challenges. |

**Why 5 sections, not 7:** orientation is *preview*, not lesson. The learner has not yet been introduced to vocabulary, so an applied playground or a challenge would test something they have not seen. The Tier-A 7-section template is for lessons; orientation is structurally different.

### 5.2. `8-1-the-build-pipeline` (Tier-A)

**Mental model:** *Source code is what you write; the bundle is what runs. The build pipeline is the translator between them, and it makes choices the browser can't undo.*

**Hook:** "You wrote `import { Button } from './Button'` in your component. The browser has never heard of a `.tsx` file, has no idea what `./Button` resolves to, and won't fetch a thousand small files anyway. So how does the page in front of you actually exist?"

**Step-by-step (6 steps):**
1. The source tree — show 4 files from the blog side by side (TS, Tailwind classes, image import, env var).
2. Three transforms — TS → JS, JSX → `_jsx()`, Tailwind → CSS. `CodeComparison` for each.
3. The module graph — `LayeredFlow` showing entry → imports → leaves; Vite walks on demand, build walks exhaustively.
4. Dev mode — browser asks, Vite transforms, returns ESM. HMR keeps state.
5. Build mode — entire graph walked. Code-split per route. Tree-shake. Hash filenames. Output `.next/`. Show `ls -la .next/static/chunks/` from the real blog.
6. Asset pipeline — images hashed + optimised; CSS purged; fonts preloaded; env vars inlined (public) or kept server-only (private).

**Playground:** `TerminalPlayground` — scripted walkthrough of `npm run build` on the blog, annotated.

**Challenges (2):** chunk-prediction; bundle-size diagnosis.

**GotchaList (4):** "works in dev breaks in prod"; public vs server env vars; barrel files defeating tree-shaking; source maps.

**KeyTakeaways:** 5 bullets, mental model restated.

### 5.3. `8-2-the-request-lifecycle` (Tier-A)

**Mental model:** *A page appearing in your browser is a relay race. Each runner — DNS, server, network, browser parser, JS engine, hydrator — hands the baton to the next, and the user perceives "loading" until the last runner crosses the line.*

**Hook:** "You click a Taproot post link. 800 ms later the page is there and the comment box works. In those 800 ms, eight different machines did something. If any of them is slow, the whole page is slow. Which one was it?"

**Step-by-step (7 steps):**
1. DNS + connection (references 1-1, 1-2). Real DevTools waterfall.
2. Server render — Next runs the RSC tree, produces HTML for `app/posts/[slug]/page.tsx`.
3. HTML streams to the browser — parsing starts before the server is done; critical CSS lets paint start early.
4. JS chunks download in parallel — page chunk, route chunk, vendor chunk.
5. Hydration — JS attaches handlers to server HTML; the comment button is inert until this completes.
6. First interaction — type a comment, click Post. Optimistic UI; server action behind the scenes.
7. Client navigation — click another post, no full reload, prefetched chunk, route transition is instant; only the post body re-fetches.

**Playground:** `SequenceDiagram` of the relay across actors (User → DNS → CDN → Server → Parser → JS engine → Hydrator → User), with code snippets per step.

**Challenges (3):** waterfall diagnosis; "button doesn't work for 2 s"; predict hydration cost across two routes.

**GotchaList (4):** hydration mismatch; TTI ≠ LCP; un-deferred 3rd-party scripts; RSC re-runs on every route change.

**KeyTakeaways:** 5 bullets, mental model restated.

### 5.4. `8-3-the-architecture-of-a-real-app` (Tier-A, slightly over budget)

**Mental model:** *A modern app's folder structure is a map of decisions: where does this run (server or client), where does this data come from (database or props), and where does this state live (URL, server cache, or component)? The folders make those answers visible.*

**Hook:** "Open the Taproot repo. There's an `app/` folder, a `components/` folder, a `lib/` folder, a `middleware.ts` file, an `auth.ts` file, a `prisma/` folder, and a hundred more files. Real apps look like this. Why these folders and not others?"

**Step-by-step (8 steps — one above the cap; explicitly justified by integrative scope):**
1. Routing — file-based, route groups, the actual tree.
2. Layouts and templates — nested layouts, where they re-render.
3. Server vs client components — `"use client"` boundary, one of each from the blog (`PostBody.tsx` server, `CommentForm.tsx` client).
4. Data fetching — server components `await prisma.post.findUnique` directly; no fetch-from-self-API antipattern.
5. State, three flavours — URL state (`?tag=react`), server state (post list), client state (comment input).
6. Mutations: server actions + optimistic UI — `addComment.ts`, the form, `useOptimistic`.
7. Auth boundary — `middleware.ts`, `auth.ts`, admin layout's `auth()` call. References 6-4.
8. The deploy view — `LayeredFlow` of edge (HTML, JS chunks, images on CDN) vs function (RSC render, server actions, DB).

**Playground:** `ReactPlayground` of a stripped post-page-with-comment-form. `// Try this:` comments guide the learner: change a comment to `"use client"`, watch what breaks; remove the optimistic update, watch the lag appear.

**Challenges (3):** "add a like button" — name three architectural decisions; "this page is slow" — pick the lever; refactor `useEffect` fetch into the server-component shape.

**GotchaList (4):** fetching from your own API in a server component; `"use client"` contagion; forms degrading without JS; client-side auth state as UX hint not security.

**KeyTakeaways:** 6 bullets, mental model restated. Final bullet: *The other shapes — pure SPA, pure static — are not lesser; they're appropriate for different problems.*

**Optional "Alternatives" section:** one paragraph each on SPA-only, pure-static, and other frameworks (SvelteKit, Nuxt, Remix).

**Why 8 steps, not 7:** this is the integrative module. Each step is one architectural concern (routing, layout, server/client, data, state, mutation, auth, deploy). Cutting any of them removes a load-bearing piece of "what makes a real app real." Rubric escalation point at >1500 lines still applies as a backstop.

### 5.5. Cross-module references

- 8-1 → referenced by 8-2 step 4 ("the chunks you saw built in 8-1 are now downloading").
- 8-2 step 5 → references 7-2 (hydration introduced there; here we walk it on the real app).
- 8-3 step 7 → references 6-4 (auth concepts; here we wire them).
- All three → link to the same GitHub permalinks of `taproot-blog` so the learner sees the same code three ways.

## 6. Reference app: `taproot-blog`

A two-author blog. Public reading + authenticated writing. Three implementation levels in one repo, same visual design.

### 6.1. Features (Level 3, the canonical version)

**Public:**
- Home page: list of recent posts (title, excerpt, author, cover image, read-time)
- Post page: rendered Markdown, author bio, comment thread
- Tag page: posts filtered by tag (URL state `?tag=react`)
- About page: static content
- RSS feed and sitemap

**Authenticated:**
- Email + password sign-in (one of two seeded authors)
- `/admin` dashboard: own drafts and published posts
- New / edit post form: title, slug, cover image upload, Markdown body with live preview, tag picker, save-as-draft / publish
- Comment moderation: approve / reject / delete

**Cross-cutting:**
- Optimistic comment posting
- Tag filter updates the URL (shareable)
- Image optimisation on cover images (`next/image`)
- Light/dark theme via CSS custom properties (system preference only)
- 404 page, error boundary, loading skeletons
- Real OG tags, real `<title>`/`<meta>` per route, accessible nav

### 6.2. Stack (Level 3)

| Layer | Pick | Curriculum reference |
|---|---|---|
| Framework | Next.js 15 (App Router, RSC) | 5-3, 7-2 |
| Language | TypeScript | 5-4 |
| Styling | Tailwind CSS | 3-4 |
| UI primitives | shadcn/ui (matches the learning app) | — |
| Data | Prisma + SQLite (local) / Postgres (deploy) | new for the learner; explained inline |
| Auth | NextAuth (Auth.js) — email+password + magic-link | 6-4 |
| Forms | React Hook Form + Zod | new; introduced in 8-3 |
| Server state | RSC + server actions; TanStack Query in the SPA level | 4-3, 7-2 |
| Markdown | `remark` + `rehype` | new; explained inline |
| Image opt. | `next/image` | 7-8 |
| Tests | Vitest unit + Playwright smoke | 6-3 |
| Deploy | Vercel (preview URL pinned) | 1-3 |
| CI | GitHub Actions (lint + tsc + build + Playwright) | 6-1, 6-3 |

### 6.3. Three-level breakdown

| Level | Folder | Stack | Teaches | Cannot do |
|---|---|---|---|---|
| 1 — Static | `static/` | Hand-written HTML + CSS, three sample posts | Baseline: HTML/CSS/anchors, full-page reload, no build | Comments, admin, auth, mutations |
| 2 — SPA | `spa/` | Vite + React + React Router + TanStack Query + MSW mock API | Build pipeline, SPA routing, client-side data fetching from a mock API; comments persist only in browser memory | SEO, real auth, real persistence (comments reset on refresh — that is the lesson, not a bug) |
| 3 — Full-stack | `app/` | Next.js 15 App Router + Prisma + NextAuth | Public/SEO + authenticated/interactive both work | — (this is the production target) |

### 6.4. Knowledge-coverage map

Every promised area lands somewhere in the reference app:

| Area | Where in app | Where in capstone |
|---|---|---|
| TS/JSX transform, CSS pipeline, asset hashing | All 3 levels' configs | 8-1 |
| Code-splitting per route | App Router automatic split | 8-1 |
| Env vars (public vs server-only) | `.env.example` in `app/` | 8-1, 8-3 |
| Production vs dev build | `npm run build` walkthrough | 8-1 |
| CDN + serverless functions | Vercel deploy diagram | 8-1, 8-2 |
| Initial HTML (SSG/SSR/RSC) | Home + post pages are RSC | 8-2 |
| JS chunk download + hydration | Comment form is a client component | 8-2 |
| Client navigation, no full reload | `<Link>` between posts | 8-2 |
| API request from client + cache + revalidation | Comment posting | 8-2 |
| File-based routing, layouts | `app/(public)/`, `app/admin/` | 8-3 |
| Server vs client components | `"use client"` boundary marked in every file | 8-3 |
| Data fetching boundary | Server: posts; client: optimistic comments | 8-3 |
| Auth middleware/guards | `middleware.ts` + `auth()` in admin layout | 8-3 |
| Error boundaries, loading states | `error.tsx`, `loading.tsx` per route | 8-3 |
| Forms with server actions | New-post form | 8-3 |
| Image optimisation | Cover images | 8-3 (referenced from 7-8) |
| URL state vs server state vs client state | Tag filter / posts list / comment optimistic | 8-3 |
| TypeScript across the boundary | Shared types in `lib/types.ts` | 8-3 |
| Accessibility | Semantic markup, focus management on route change | 8-3 (referenced from 2-3) |
| LCP/INP/CLS on a real page | Lighthouse run on home page | 8-3 (referenced from 7-8) |

### 6.5. Pinned reference

The reference app is tagged `taproot-blog-v1.0` at commit `fd9700e` in `https://github.com/logbasex/frontend-learning-app`. Capstone modules link to GitHub permalinks at this commit so module text never references moving code. **Vercel deployment is deferred** — the user will run `vercel link && vercel --prod` from `examples/taproot-blog/app/` themselves and update the modules' `BLOG_URL` references in a follow-up PR. Until then, capstone modules use the GitHub link as the canonical "live reference" and skip the live preview link.

## 7. Architecture changes

```
app/                                            small dashboard surface change (§7.5)
lib/
  curriculum.ts                                 add Phase 0 + Phase 8
  modules/
    index.ts                                    add 4 imports + 4 registry entries
    0-1-the-map.tsx                             NEW (5-section orientation)
    8-1-the-build-pipeline.tsx                  NEW (Tier-A)
    8-2-the-request-lifecycle.tsx               NEW (Tier-A)
    8-3-the-architecture-of-a-real-app.tsx      NEW (Tier-A)

components/                                     unchanged (no new primitives)

docs/superpowers/specs/
  2026-05-09-concept-catalog.md                 add ~10 capstone entries
  2026-05-09-learning-outcomes.md               add 4 outcome blocks
  2026-05-10-end-to-end-app-walkthrough-design.md  THIS DOC

CLAUDE.md                                       document orientation exception + examples dir

examples/                                       NEW top-level
  taproot-blog/
    README.md                                   how to run each level locally
    static/                                     Level 1 (HTML + CSS, three sample posts)
    spa/                                        Level 2 (Vite + React + MSW)
      package.json
      src/
    app/                                        Level 3 (Next.js + Prisma + NextAuth)
      package.json
      app/
      components/
      lib/
      prisma/
      auth.ts
      middleware.ts
      .env.example

.github/workflows/
  examples-blog.yml                             NEW CI workflow for the reference app
```

### 7.1. `lib/curriculum.ts`

Add a `Phase` with `id: 0` at the start of the array and a `Phase` with `id: 8` at the end. The existing `Phase` interface accepts `id: number`; `0` is a valid value. The helpers (`getPhaseProgress`, `getModulesByPhase`, etc.) iterate the array — none key on `id > 0`, so no helper changes are required. Verified by reading `lib/curriculum.ts` lines 879–920.

### 7.2. Module registry

Four imports and four `MODULE_CONTENTS` entries added to `lib/modules/index.ts`.

### 7.3. New module files

All four follow the §4.1 conventions of the existing curriculum spec:
- First line inside the component function: `// Data blocks hoisted out of JSX for readability — listed in render order.`
- Hoisted consts have descriptive names.
- Section comments numbered.
- No emojis, English only.

`0-1-the-map.tsx` deliberately diverges in section count (5, not 7). The spec explicitly justifies this in §5.1 and CLAUDE.md is updated to record the exception.

### 7.4. Reference app integration

The blog at `examples/taproot-blog/` is a **separate workspace**, not integrated via npm/pnpm workspaces. Each level (`static/`, `spa/`, `app/`) has its own `package.json` and lockfile.

**Why separate, not workspaces:**
- The blog is meant to be cloneable as a standalone reference — workspaces couple it to the learning-app repo's setup.
- The blog and the learning app have different stacks (different Next versions, different Tailwind configs) and a workspace would force shared resolution.
- CI runs them as parallel jobs without needing workspace integration.

The Vietnamese-character lint guard (`scripts/check-no-vietnamese.mjs`) currently scans `components/`, `lib/`, `app/`. It does **not** scan `examples/`, which is correct — the blog is a real-app example, not lesson copy. No change needed.

### 7.5. Dashboard surface (`app/page.tsx`)

Two small changes:

1. **Phase 0 surfaces above the regular phase grid** as a single prominent "Start here" tile. The dashboard renders Phase 0 separately from `curriculum.filter(p => p.id !== 0)`.
2. **Phase 8 appears as the final phase tile** in the grid with a small "Capstone" badge on the tile.

The existing soft-prereq UI (`isModuleUnlocked` always returns `true`; tiles show "Recommended first: complete N earlier modules") already handles the multi-prerequisite case for `8-3`.

### 7.6. Reference-app deployment

Level 3 of the reference app deploys to Vercel under a fixed preview URL (e.g. `taproot-blog.vercel.app`), pinned to a tagged commit. Module 8-2 and 8-3 link to specific routes by URL. When the blog evolves the modules continue to reference the pinned commit; a periodic refresh task keeps things in sync.

## 8. Data flow & error handling

No changes to learning-app data flow — the existing module-content registry handles unknown IDs and the soft-prereq UI is already in place.

The reference app has its own data flow (Prisma → server components → HTML → hydrate → server actions for mutations). It is documented inside the blog's own README, not in the learning app.

## 9. Tier-A template exception

`0-1-the-map` is a documented exception to the 7-section template. CLAUDE.md gains a short paragraph:

> **Orientation modules** (Phase 0) follow a 5-section shape: Hook, Mental model, Map (diagram), Curriculum preview, KeyTakeaways. They omit the playground and challenges because the learner has not yet been introduced to the vocabulary the playground would exercise. This exception applies to Phase 0 only. All other modules — including Phase 8 capstone modules — follow the standard 7-section Tier-A template.

The authoring rubric in §8 of `2026-05-09-tier-a-curriculum-design.md` (the existing curriculum spec) adds a single check: `[ ] If this is an orientation module, 5 sections; otherwise, 7.`

## 10. Verification

Per module:
- `npx tsc --noEmit` clean
- `npm run lint` clean (Vietnamese guard active)
- `npm run build` succeeds
- Manual smoke test at `/lesson/<id>`

For the reference app (separately):
- `npm run lint`, `npx tsc --noEmit`, `npm run build` in each level that has a build.
- `npm test` runs Vitest unit tests in Level 2 and Level 3.
- `npm run e2e` runs Playwright smoke tests against Level 3.
- Vercel deployment succeeds and the pinned preview URL is reachable.

## 11. Implementation waves (preview)

Full plan will be produced by the writing-plans skill. Outline:

- **Wave A — Spec deliverables.** Catalog and outcomes additions; CLAUDE.md exception note.
- **Wave B — Orientation module.** `0-1-the-map.tsx`, dashboard "Start here" callout.
- **Wave C — Reference app, Levels 1 & 2.** `examples/taproot-blog/static/` and `examples/taproot-blog/spa/`.
- **Wave D — Reference app, Level 3.** `examples/taproot-blog/app/` (Next.js + Prisma + NextAuth + comments + admin + tests).
- **Wave E — Deploy & pin.** Vercel deploy, tag the commit, update module references.
- **Wave F — Capstone modules.** `8-1`, `8-2`, `8-3` in that order. They reference each other and the pinned blog.
- **Wave G — Dashboard surface.** Phase 8 capstone badge.
- **Wave H — Quality gates + style review.** Repo-wide lint, tsc, build; read all four new modules end-to-end; fix drift.

Wave D is the critical-path cost. Capstone modules cannot be authored faithfully until the blog they reference exists and is deployed.

## 12. Risks

| Risk | Mitigation |
|---|---|
| Reference app sprawl — blog grows beyond what 3 modules can cover | Feature list in §6.1 is the contract. New features only after capstone modules ship. |
| Modules reference moving code — blog evolves, links rot | Pin module references to a tagged commit; periodic refresh task; URL-based references not file-line references. |
| Authoring all four modules without first having the blog produces shallow content | Wave order enforces blog-first. Capstone modules are last. |
| Three implementation levels of the same blog is 3× the work | Levels 1 and 2 are deliberately small and reading-only. Level 3 is the production target; Levels 1 and 2 are short stepping stones. |
| Orientation module spoils the curriculum — over-explains before the learner has context | Strict 10-minute budget; no syntax taught; map only. The §5.1 shape forces this. |
| 8-3 step count above the §2.3 cap drifts to other modules | Documented as a justified exception in §5.4. Rubric stays at 7. |
| Reference-app CI flakes block learning-app CI | Separate workflow; failure does not block learning-app deploys. |
| Learners try to run the blog locally and get stuck on Postgres / Prisma setup | Local default is SQLite; one-command `npm run dev` includes `prisma db push` and a seeded sample dataset. README documents both. |
| Vercel preview URL drifts from the pinned commit | Deployment uses a tagged commit hash; refreshing the modules updates both the link and the snapshot. |

## 13. Decisions made (autonomously, per "go")

| Decision | Choice | Why |
|---|---|---|
| Orientation placement | New Phase 0 + capstone Phase 8 (both ends of curriculum) | Scaffolding up front, payoff at end. Beginners need the map; finishers need the integration. |
| Capstone shape | 3 Tier-A modules (build / request / architecture) | One module can't carry all three views at depth. Three modules with a shared example app reinforces. |
| Reference app domain | A blog with comments + admin | Only domain that exercises both public/SEO/SSG and authenticated/interactive in one app at the right size. |
| Reference app levels | 3 (static, SPA, full-stack) | Backend devs especially benefit from seeing the layers being added on. Levels 1 and 2 are short. |
| Framework for Level 3 | Next.js 15 App Router | Already taught in 5-3 and 7-2; most representative of "modern frontend" today. |
| Reference app integration | Separate workspace, not pnpm workspaces | The blog should be cloneable standalone. Workspace coupling is more friction than value. |
| Orientation module shape | 5 sections (no playground, no challenges) | The learner has no vocabulary yet — applied exercises would test what hasn't been taught. |
| 8-3 step count | 8 (one above the §2.3 cap) | Each step is one architectural concern; cutting removes a load-bearing piece. Justified in §5.4. |
| New primitives needed | None | `LayeredFlow`, `SequenceDiagram`, `TerminalPlayground`, `ReactPlayground`, `CodeComparison`, `CodeBlock`, `Challenge`, `GotchaList`, `KeyTakeaways` cover everything. |
| Soft prereqs for capstone | Yes, multiple (`8-3` recommends both `8-2` and `6-4`) | Existing schema accepts `string[]`; existing dashboard handles "complete N first" badge. No change. |
| Local DB for the blog | SQLite | Zero-setup; new learners running the blog locally don't fight Postgres. Postgres only on the deployed preview. |
| Auth for the blog | NextAuth email+password and magic-link | Matches the auth strategies taught in 6-4. Magic-link gives a learner who doesn't want to remember a password an out. |

## 14. Open questions

None at draft time. Anything the user surfaces during review will be folded in here before the plan is written.
