# Tier-A Curriculum — Design Spec

**Date:** 2026-05-09
**Status:** Draft, awaiting user review
**Supersedes (in scope):** the curriculum-content portion of `2026-05-09-frontend-roadmap-learning-app-design.md`. App-shell and architecture decisions in that doc remain in force.

## 1. Goal

Re-author the existing 30-module curriculum from scaffolds (~110–210 lines each) to **Tier-A comprehensive lessons** suitable for a learner with no prior frontend experience. Each module is defined by its **learning outcomes**, not its line count: a learner who finishes the module can do specific things.

**Localhost only.** No deployment, SEO, hosting, mobile-shell, analytics, landing page, or product polish in scope. The output is a content overhaul.

The deliverable is structured for **parallel subagent authoring**, dispatched in waves so the user can review progress and correct drift between sessions.

## 2. Audience and pedagogical philosophy

**Audience:** anyone learning frontend from zero. No assumed prior knowledge of HTML, CSS, JavaScript, the browser, or backend networking. (The user is a backend dev, but is publishing this for everyone — the content authoring optimizes for the broader audience.)

**Optimization target:** *learn as much as possible, as fast as possible.* Comprehensive *and* dense. Mental models over enumeration. Single popular pick per tool category over comparison catalogs.

**Single-popular-pick rule** (carried from earlier conversation):

| Category | Pick | Notes |
|---|---|---|
| Framework | React | One paragraph mentioning Vue/Svelte/Solid/Qwik at end of `5-3` |
| Bundler | Vite | One paragraph mentioning Webpack/esbuild/Rollup at end of `6-2` |
| Styling | Tailwind | One paragraph mentioning CSS Modules / styled-components at end of `3-4` |
| Package manager | pnpm | One paragraph mentioning npm/yarn at end of `5-2` |
| Testing | Vitest + Playwright | Vitest for unit/component, Playwright for E2E |
| SSR | Next.js | One paragraph mentioning Nuxt/SvelteKit |
| Mobile | React Native | (`7-6`) |
| TypeScript everywhere | yes | |

### 2.1. Module learning shape

Every module follows this learning shape, in order. This is the rigid structural skeleton of every Tier-A module.

1. **Hook** — a concrete failure, mystery, or felt tension. Not "today we'll learn X." Example: "You hit Refresh and the page flashes white before redrawing. Why?" One to two paragraphs.
2. **Mental model first** — the one-sentence model that organizes the rest. Stated *before* any syntax. Boxed/italicized so the reader can see it later. One paragraph + a one-sentence pull-quote.
3. **Build the model concretely** — step-by-step exposition where each step adds one piece. Code shown alongside; no syntax appears without context. 5–8 steps.
4. **Make the learner do something** — at least one playground where the *learner* must change a value or write a line to make something happen. Pre-loaded with a `// Try this:` comment guiding tinkering.
5. **Active recall** — challenges that test *application*, not definitions. ("Which CSS rule wins?" not "What does specificity mean?") 2–3 challenges.
6. **Edges & gotchas** — the 3–5 surprising facts that, if missed, lead to buggy code. Dedicated `GotchaList` section: "Things that surprise people."
7. **Mental model restated + takeaways** — the same one-line model from §2, now meaningful because the learner earned it. 4–6 takeaway bullets.

### 2.2. Voice rules

- All copy in **English**. No Vietnamese. No other language.
- "You" not "we" — directly addresses the reader.
- Define every term on first use within the module. Use the **Concept Catalog** (`docs/superpowers/specs/2026-05-09-concept-catalog.md`) as the canonical one-line definition. Cross-link prerequisite modules by ID.
- Concrete-then-abstract: every abstract claim follows a concrete example, never precedes it.
- No "we'll see later" or "for advanced readers." If a thing is mentioned, it is explained or cut.
- One mental model per module. Multiple competing models is a sign the module should split (don't split — refine the model).
- Use double quotes in JSX attributes (project convention).
- Escape `'`, `<`, `>` in JSX text where required.

### 2.3. Cognitive-load budget

A module should fit in **one sitting (~20–35 minutes** of reading + tinkering). If it can't, it's secretly two modules — redesign rather than split.

**Length is an output, not a target.** Old guidance "600–1000 lines" is dropped. Lines emerge from completing the seven sections at the right depth. Some modules will be 500 lines, some 1200. The completeness measure is the per-module learning-outcome list (§5), not byte count.

The authoring rubric (§7) flags any module exceeding 1500 lines for human review.

## 3. Curriculum revisions

The 30-module structure stays. The IDs stay. Only three changes:

### 3a. Three retitles (drop comparison framing)

| ID | Old title | New title |
|---|---|---|
| `3-4-writing-css-modern` | Writing CSS in 2026 | **Tailwind CSS** |
| `5-3-pick-a-framework` | Pick a Framework | **React Fundamentals** |
| `6-2-module-bundlers` | Module Bundlers (Vite, Webpack, esbuild, Rollup, Parcel, SWC) | **Vite & the Dev Loop** |

Each retitled module ends with a one-paragraph "Alternatives" section so the reader knows what else exists, but the body teaches one tool deeply.

### 3b. Soft prerequisites

The current curriculum hard-locks every module behind a linear chain (`prerequisites: [previous-module-id]`). For a public learning resource this is hostile: a learner who wants to peek at React must first complete 25 prior modules.

**Change:** keep the `prerequisites` field shape (no schema change), but make `isModuleUnlocked` always return `true`. The dashboard surfaces a soft "Recommended: complete X first" badge instead of a lock icon. Prerequisites become a *map*, not a *gate*.

This is a tiny product change in service of pedagogy. Strictly within the content-authoring scope.

### 3c. No new modules, no module splits

A previous draft considered adding `5-3.5 Hooks` and `5-3.6 Thinking in React`. Reverted. React's depth lives inside `5-3`'s Tier-A treatment. The 30-module structure is stable.

### 3d. No reordering

A few modules are pedagogically out of order for an absolute beginner — `4-3 Fetch & Async` sits before `5-1 Git`, etc. Reordering breaks IDs and the prerequisites chain. Address via module copy: each module's hook acknowledges what the reader doesn't need to know yet.

## 4. The Tier-A template (implementation map)

Every module exports `Module_X_Y_Content()` and renders the **seven sections** of §2.1. Implementation:

| Pedagogical step | Primitive(s) used |
|---|---|
| 1. Hook | `Card` with prose (1–2 paragraphs) |
| 2. Mental model first | `Card` with prose ending in a callout/blockquote (1 paragraph + 1-sentence pull-quote) |
| 3. Build the model concretely | `StepByStepExplanation` (5–8 steps with `code`) |
| 4. Learner-does-something | `HTMLPlayground` / `ReactPlayground` / `TerminalPlayground` (new) |
| 5. Active recall | `Challenge` × 2–3 |
| 6. Edges & gotchas | `GotchaList` (new) |
| 7. Mental model restated + takeaways | `KeyTakeaways` |

**Required:** all seven sections must appear in every module.

**Optional sections** that may also appear when justified by topic:
- `InteractiveDiagram` (or `SequenceDiagram` / `LayeredFlow` — see §5) — when the concept is genuinely visual.
- `CodeComparison` — when contrast is the lesson.

The existing `_template.tsx` (`ScaffoldModule`) becomes deprecated for new authoring but stays in the file for reference. Tier-A modules render their sections directly without a wrapper component (the structure is rigid enough that a wrapper adds friction).

### 4.1. Structural conventions inferred from the Wave-3 pilot

Codified after the Wave-3 review found drift on these points across 4 parallel-authored modules:

- **No headings inside the Hook or Mental Model `<Card>`s.** Both sections are prose-only (only `<p>` and inline tags). The lesson frame supplies the module title from `curriculum.ts`; section 2's model is the `<blockquote>`, not a heading.
- **No emojis anywhere in the module file.** The dashboard and lesson frame may use emojis as part of the design system; module content does not.
- **First line inside the component function must be the comment** `// Data blocks hoisted out of JSX for readability — listed in render order.` followed by hoisted const declarations (step arrays, playground HTML strings, etc.).
- **Step arrays must have descriptive names** — `urlToPixelsSteps`, `semanticSteps`, `cascadeSteps` — never just `steps`.
- **Section comments in the JSX render are numbered 1–7** matching the seven mandatory sections (Hook, Mental model, Step-by-step, Playground, Challenges, GotchaList, KeyTakeaways). Optional sections (sequence diagram, code comparison) get a non-numbered comment like `{/* Optional: Sequence diagram (DNS resolution) */}`.

## 5. New primitive components

Two categories: **general-purpose** primitives (reusable across many modules) and **module-specific** demos (one-offs that live in their module file).

### 5a. General-purpose primitives (reusable, built once in Wave 1)

| Primitive | Used in modules | Purpose |
|---|---|---|
| `GotchaList` | All 30 | Section 6 "Things that surprise people" — title + bullet pairs, consistent styling |
| `SequenceDiagram` | 1-1, 1-2, 1-3, 6-4, 7-2 | Sequence-of-actors layout (browser, DNS, server, etc.) — author lists actors + messages, layout is automatic. Replaces the hand-positioned ReactFlow nodes used in `1-1` today. |
| `LayeredFlow` | 1-1, 1-4, 4-2, 6-2 | Left-to-right or top-to-bottom labeled stages with arrows — author lists stages, layout is automatic |
| `TerminalPlayground` | 5-1, 5-2, 6-1 | Animated/static terminal output for modules where Sandpack can't run (Git, npm, ESLint CLI). Author supplies an array of `{ command, output }` pairs; component plays them with realistic timing |
| `LiveCascadeDemo` | 3-1 | Two CSS rules side-by-side; specificity numerically computed; "winner" highlighted |
| `FlexboxControls` | 3-2 | Sliders/dropdowns for `justify-content`, `align-items`, `gap`, `flex-wrap`; live preview |
| `GridControls` | 3-2 | Same shape as FlexboxControls but for `grid-template-columns`, `gap`, `place-items` |
| `EventLoopVisualizer` | 4-2, 4-3 | Animated stack/queue/microtasks tracing through user-supplied code. The signature accepts `{ code: string, trace: TraceFrame[] }` so the author scripts the timing |

Each primitive ships with a 1-page demo file in `lib/modules/_demos/<name>.tsx` (not registered, just for manual smoke-testing). Verified before Wave 2 starts.

### 5b. Module-specific demos (one-off, lives in the module file)

These are too specific to be reusable. Authored inline in the module file as private components.

- `1-4` browser rendering pipeline — migrate the existing `BrowserRenderingPipeline` to `LayeredFlow`
- `5-3` React render tree — small ReactFlow diagram, similar shape to existing `ComponentTree`
- `7-2` hydration visualizer — split-pane animation, server HTML on left, client JS attaching on right

### 5c. Cleanup of existing components (Wave 0)

Existing components have **Vietnamese strings** that pollute every module. Audit (`grep` over `components/` and `lib/`) found:

- `components/Challenge.tsx` lines 124, 136, 141, 149, 156 — button text and feedback ("Kiểm tra đáp án", "Chính xác! 🎉", "Chưa đúng, thử lại nhé!", "💡 Giải thích:", "Thử lại")
- `components/InteractiveDiagram.tsx` lines 197, 299, 416 — descriptions of pre-built diagrams in Vietnamese

**Wave 0 strips all of these and replaces with English.** Wave 0 also adds a CI grep guard so no Vietnamese leaks into future authoring (a one-line `grep` in the lint script).

## 6. Concept Catalog

Before any module is authored, lock down the shared vocabulary. The catalog is a single markdown file at `docs/superpowers/specs/2026-05-09-concept-catalog.md` — produced as part of this spec deliverable.

It lists every term with:
- The **owning module** (where the term is first defined).
- The **canonical one-line definition**.
- Whether the term should be italicized as a callout on first use in non-owning modules.

Subagents authoring modules use the catalog as the canonical source. When a module needs to refer to a term defined elsewhere, the author italicizes the catalog's exact one-liner and links to the owning module by ID. This keeps voice consistent across 30 parallel-authored modules.

Estimated catalog size: ~100 entries.

## 7. Per-module learning outcomes

Each of the 30 modules gets a **3–6 line learning-outcome list**, produced as part of this spec deliverable at `docs/superpowers/specs/2026-05-09-learning-outcomes.md`.

Outcomes use Bloom-style verbs: **recall, apply, judge, build, debug.** Example for module `1-1`:

> After this module the learner can:
> - [recall] State what DNS, TCP, TLS, and HTTP each do, in one sentence each.
> - [apply] Read a `dig +trace` output and identify which step of resolution failed.
> - [judge] Choose between A and AAAA records for a given scenario.
> - [debug] Given a "site won't load" symptom, name three diagnostic checks in the right order.

Authoring a module is "done" when every outcome is testable from the module content (i.e. a challenge or playground exercise corresponds to each verb).

## 8. Authoring rubric

Every module-authoring task receives this rubric. The rubric is a 1-page checklist the agent self-applies before declaring done. (Will be embedded in the implementation plan, not duplicated here.)

```
Voice
[ ] All copy in English. No Vietnamese, no other language.
[ ] "You" not "we" throughout.
[ ] Every concept-catalog term used as the catalog states it (italicized callout the first time).
[ ] No "we'll see later" / "for advanced readers".

Structure
[ ] All 7 pedagogical sections present and in order.
[ ] Hook is concrete (a failure, mystery, or felt tension), not abstract.
[ ] Mental model stated as a single sentence, both early (§2 of module) and late (§7 of module).
[ ] Step-by-step has 5–8 steps, each with `code`.
[ ] Playground has a "Try this:" comment guiding tinkering.
[ ] At least one challenge tests application, not recall.
[ ] GotchaList has 3–5 entries.

Outcomes
[ ] Every learning outcome (§7) is exercised somewhere in the module.

Quality gates
[ ] `npx tsc --noEmit` clean.
[ ] `npm run lint` clean.
[ ] Page renders at /lesson/<id> with no console errors.
[ ] Playground iframes load and respond to learner input.
[ ] No string in the module file matches the Vietnamese-character regex.

Length sanity
[ ] If module > 1500 lines, escalate to user for review (probably needs to be tighter).
```

## 9. Architecture changes

```
app/                                            unchanged
lib/
  curriculum.ts                                 retitle 3 modules; comment soft-prereq
  progress.ts                                   isModuleUnlocked → return true
  modules/
    _template.tsx                               keep ScaffoldModule (deprecated for Tier A); no new helper needed
    _demos/                                     NEW dir for primitive smoke tests (not registered)
    index.ts                                    unchanged
    *.tsx (30 files)                            REWRITE per Tier-A template

components/
  Challenge.tsx                                 cleanup Vietnamese strings (Wave 0)
  InteractiveDiagram.tsx                        cleanup Vietnamese strings (Wave 0)
  GotchaList.tsx                                NEW
  SequenceDiagram.tsx                           NEW
  LayeredFlow.tsx                               NEW
  TerminalPlayground.tsx                        NEW
  LiveCascadeDemo.tsx                           NEW
  FlexboxControls.tsx                           NEW
  GridControls.tsx                              NEW
  EventLoopVisualizer.tsx                       NEW
  ... (others)                                  unchanged

docs/superpowers/
  specs/
    2026-05-09-frontend-roadmap-learning-app-design.md      existing — superseded for content scope
    2026-05-09-tier-a-curriculum-design.md                  THIS DOC
    2026-05-09-concept-catalog.md                           NEW (vocabulary)
    2026-05-09-learning-outcomes.md                         NEW (per-module outcomes)
  plans/
    2026-05-09-tier-a-curriculum-plan.md                    NEXT (writing-plans skill)
```

## 10. Implementation waves

The plan executes in **waves**, each independently shippable:

**Wave 0 — Cleanup** (1 task, blocks all subsequent work)
- Strip Vietnamese strings from `components/Challenge.tsx` and `components/InteractiveDiagram.tsx`. Replace with English.
- Add a `grep` guard to `package.json` lint script that fails if any Vietnamese character appears under `components/` or `lib/`.

**Wave 1 — Primitives** (8 tasks, parallelizable)
- Build the 8 general-purpose primitives in §5a (one task each).
- Each primitive task creates the component + a `_demos/<name>.tsx` smoke-test page.
- (The concept catalog and learning-outcomes file are produced as part of *this* spec, not Wave 1 — see `2026-05-09-concept-catalog.md` and `2026-05-09-learning-outcomes.md`.)

**Wave 2 — Re-author the gold standard, `1-1`** (1 task, blocks Wave 3+)
- Re-author `1-1-how-the-internet-works` to the new Tier-A template (all 7 sections, using the new `SequenceDiagram` and `LayeredFlow` primitives where they help, plus `GotchaList`).
- This is the **structural exemplar** for every subsequent module. Wave 3+ tasks reference it explicitly: "match the section ordering, prose density, and code-vs-prose ratio of `lib/modules/1-1-how-the-internet-works.tsx`."
- **User review gate.** User confirms voice/depth/shape match intent before Wave 3.

**Wave 3 — Phase 2 pilot, 4 modules in parallel** (4 tasks)
- Re-author 2-1, 2-2, 2-3, 2-4. Smallest phase, lets the user spot drift early.
- **User review gate.** If voice/style diverge, refine the rubric, possibly re-spin one or two before unlocking Wave 4.

**Wave 4 — Phase 1 remainder** (3 tasks: 1-2, 1-3, 1-4)

**Wave 5 — Phases 3 + 4** (8 tasks: 3-1, 3-2, 3-3, 3-4 (Tailwind), 3-5, 4-1, 4-2, 4-3)

**Wave 6 — Phases 5 + 6** (9 tasks: 5-1, 5-2, 5-3 (React), 5-4, 6-1, 6-2 (Vite), 6-3, 6-4, 6-5)

**Wave 7 — Phase 7** (8 tasks: 7-1, 7-2, 7-3, 7-4, 7-5, 7-6, 7-7, 7-8). Heaviest. May split into 7a (1–4) and 7b (5–8) if desired.

**Wave 8 — Style review pass** (1 task)
- Read 5 random modules end-to-end. Flag voice/depth/structure drift. Fix.
- Re-run quality gates across the whole repo.

**Wave 9 — Docs** (1 task)
- Update `CLAUDE.md` with the new Tier-A authoring guide.
- Update `README.md`.

**Total: ~44 tasks across 10 waves.**

**Wave-boundary smoke tests** vary by wave content:
- Wave 0: lint passes (Vietnamese guard active), no behavior change.
- Wave 1: every primitive's `_demos/<name>.tsx` renders without console errors when manually opened (these aren't routed; the user temporarily imports the demo into a throwaway page or imports it inside the lesson layout to verify).
- Wave 2+: each authored module's `/lesson/<id>` route renders, all 7 sections appear, playground iframes load, challenges accept answers.

## 11. Data flow & error handling

Unchanged from the existing app. The `getModuleContent` registry already gracefully handles unknown IDs. `isModuleUnlocked` returning `true` everywhere is the only behavior change; the dashboard component reads its result and renders a soft-recommendation badge instead of a lock.

## 12. Verification

Per module (in the rubric §8):
- `npx tsc --noEmit` clean
- `npm run lint` clean (now includes the Vietnamese-character guard)
- `npm run build` succeeds
- Manual smoke test at `/lesson/<id>`

The user runs all three commands at each wave boundary as a gate.

## 13. Risks

| Risk | Mitigation |
|---|---|
| **Voice drift across 30 parallel-authored modules** | Concept catalog (§6), authoring rubric (§8), gold-standard exemplar (Wave 2), Wave 3 pilot review gate, Wave 8 style pass. |
| **Sub-agents producing surface content that hits the rubric but lacks insight** | Per-module learning outcomes (§7) are the real measure. Rubric line "every outcome is exercised" forces depth. User spot-checks during Wave 3. |
| **Authoring 30 modules takes much longer than estimated** | Waves are independent — each wave produces a shippable improvement. User can stop at any wave and have a real product. |
| **New primitives have bugs nobody finds** | Wave-1 demo files in `lib/modules/_demos/` are smoke-tested before Wave 2 begins. |
| **Existing scaffolds have hidden good content lost on rewrite** | Wave-0 includes a "salvage list" pass: skim each existing scaffold, flag any body primitive (playground HTML, code block) worth preserving into the Tier-A version. |
| **Vietnamese strings missed in cleanup pollute new modules** | Wave-0 ships with a CI grep guard that fails the lint script if any Vietnamese character appears in `components/` or `lib/`. |
| **Tier-A modules become walls of text and lose the "fast" promise** | Cognitive-load budget (§2.3): one sitting per module. Rubric flags >1500 lines for review. |
| **Soft prerequisites confuse beginners who *want* hand-holding** | Dashboard still shows the recommended sequence; the soft "complete X first" badge is informational. Beginners who follow the sequence get the same experience as before. |

## 14. Out of scope

- Deployment, hosting, SEO, OG cards, sitemap, mobile-shell, analytics, dark/light toggle, landing page, deep-link share URLs, feedback widget.
- New modules beyond the existing 30.
- Changing module IDs.
- Test infrastructure (Vitest/Playwright) for the app itself.
- Translation/i18n.
- Migrating progress data.
- Module reordering across phases.
- Any backend/auth/database/syncing.

## 15. Decisions made (autonomously, per "go")

| Decision | Choice | Why |
|---|---|---|
| Soft vs hard prerequisites | Soft (lock removed, recommendation kept) | Hard locks make a 30-module gauntlet hostile to absolute beginners |
| Non-runnable modules (Git, npm, ESLint) | New `TerminalPlayground` primitive | Static `CodeBlock` alone fails the "learner-does-something" pillar |
| Wave-based delivery vs one mega-batch | Waves of ~1–10 tasks each, 10 waves total | Reviewable, recoverable, and matches subagent dispatch model |
| Concept catalog + learning outcomes as separate spec files | Yes, both | Single biggest lever for cross-agent voice consistency |
| Re-author 1-1 vs preserve | Re-author | User's explicit answer; current 1-1 is decent but not Tier-A under the new rubric (no Hook section, no GotchaList, hand-positioned diagrams) |
| Add new modules (Hooks, Thinking in React) | No | Single-popular-pick rule + existing 30-module structure is sufficient; depth lives inside modules |
| Drop modules (Web Components, GraphQL, Mobile, Desktop) | No | User pivoted to "comprehensive for everyone" — drops would hurt that goal |
| Module retitles (3-4 / 5-3 / 6-2) | Yes | Single-popular-pick rule applied to comparison-shaped modules |
| Module reordering | No | Breaks IDs and prereq chain; address via module copy |
