"use client";

import { Card, CardContent } from "@/components/ui/card";
import { HTMLPlayground } from "@/components/CodePlayground";
import { CodeBlock } from "@/components/CodeBlock";
import { StepByStepExplanation, Step } from "@/components/StepByStepExplanation";
import { Challenge } from "@/components/Challenge";
import { GotchaList } from "@/components/GotchaList";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { RoadmapLink } from "@/components/RoadmapLink";

export function Module_3_5_Content() {
  // Data blocks hoisted out of JSX for readability — listed in render order.
  const cssArchitectureSteps: Step[] = [
    {
      title: "BEM: Block, Element, Modifier",
      description: (
        <>
          <em>BEM</em> — a class-naming convention <code>Block__Element--Modifier</code> for keeping
          CSS scoped without tooling — gives every class a predictable shape. A <strong>Block</strong>{" "}
          is a standalone component: <code>.card</code>. An <strong>Element</strong> is a part of
          that block, separated by two underscores: <code>.card__title</code>,{" "}
          <code>.card__body</code>. A <strong>Modifier</strong> is a variation or state, separated by
          two hyphens: <code>.card--featured</code>. The punctuation is not aesthetic — it is a
          grammar rule. Two underscores mean &quot;part of.&quot; Two hyphens mean &quot;variant
          of.&quot; Names describe structure, not appearance.
        </>
      ),
      code: `/* Block */
.card { padding: 1rem; border-radius: 8px; background: #fff; }

/* Element — two underscores */
.card__title { font-size: 1.25rem; font-weight: 600; }
.card__body   { color: #475569; }

/* Modifier — two hyphens */
.card--featured { border: 2px solid #3b82f6; }`,
    },
    {
      title: "Why BEM scales",
      description: (
        <>
          BEM keeps every selector at one-class specificity: <code>(0,1,0)</code>. You never need to
          fight the cascade to override a BEM rule — you just add the right class. Collisions become
          visible in the class name itself: if two blocks share a class, one of them named it wrong.
          You can also grep the entire codebase for <code>.card__title</code> and find every place
          the block is used. Compare that to searching for <code>.title</code> in a codebase with
          generic names — you will spend an hour filtering false positives.
        </>
      ),
      code: `/* Not BEM — collision waiting to happen */
.card .title { font-weight: 600; }  /* specificity (0,1,1) */
.page .title { color: red; }        /* which wins? depends on order */

/* BEM — flat, grep-friendly, no collision */
.card__title  { font-weight: 600; } /* (0,1,0) */
.page__title  { color: #1e293b; }   /* (0,1,0) — totally separate */`,
    },
    {
      title: "Sass: nesting, variables, mixins",
      description: (
        <>
          <em>Sass</em> — a CSS preprocessor adding nesting, variables, mixins, and functions;
          compiles to CSS — lets you write BEM without repeating the block name. The{" "}
          <code>&amp;</code> parent selector inside a Sass rule expands to the selector of the outer
          block: <code>.card {"{"} &amp;__title {"{"} ... {"}"} {"}"}</code> compiles to{" "}
          <code>.card__title {"{"} ... {"}"}</code>. Variables (<code>$brand: #3b82f6</code>) live in
          one place. Mixins are reusable rule blocks you include anywhere with{" "}
          <code>@include</code>.
        </>
      ),
      code: `$brand: #3b82f6;

@mixin focus-ring { outline: 2px solid $brand; outline-offset: 2px; }

.card {
  padding: 1rem;
  border-radius: 8px;

  &__title { font-size: 1.25rem; }
  &--featured { border: 2px solid $brand; }
  &:focus-within { @include focus-ring; }
}

/* Compiles to: */
.card { padding: 1rem; border-radius: 8px; }
.card__title { font-size: 1.25rem; }
.card--featured { border: 2px solid #3b82f6; }
.card:focus-within { outline: 2px solid #3b82f6; outline-offset: 2px; }`,
    },
    {
      title: "Modern CSS replaces most of Sass",
      description: (
        <>
          In 2026, the browser ships CSS variables (<code>--brand: #3b82f6</code>), native nesting
          (same <code>&amp;</code> syntax), <code>@layer</code> for cascade control, and container
          queries. These cover most of what Sass added. The reasons to keep Sass are narrowing: mixins
          with logic, <code>@for</code> and <code>@each</code> loops, build-time math, and migrating
          an existing Sass codebase where rewriting is too expensive. Starting a project from scratch
          in 2026 with nothing but Vite and modern CSS is entirely reasonable.
        </>
      ),
      code: `/* Modern CSS — no preprocessor needed */
:root {
  --brand: #3b82f6;
  --radius: 8px;
}

/* Native nesting (supported in all modern browsers) */
.card {
  padding: 1rem;
  border-radius: var(--radius);

  & .card__title { font-size: 1.25rem; }
  &.card--featured { border: 2px solid var(--brand); }
}

/* @layer — explicit cascade ordering */
@layer base, components, utilities;

@layer components {
  .card { border-radius: var(--radius); }
}`,
    },
    {
      title: "PostCSS: a transform pipeline",
      description: (
        <>
          <em>PostCSS</em> — a CSS post-processor that transforms CSS via plugins — runs after you
          write CSS, not before. It is not a language extension; it is a plugin pipeline. You write
          modern syntax, a plugin transforms it, and you ship CSS that works in older browsers.{" "}
          <code>autoprefixer</code> adds <code>-webkit-</code> and <code>-moz-</code> vendor prefixes
          automatically based on your browserslist targets.{" "}
          <code>postcss-preset-env</code> polyfills future CSS syntax — it is to CSS what Babel is to
          JavaScript. Most projects already run PostCSS via Vite or Next.js without you configuring
          it explicitly.
        </>
      ),
      code: `/* postcss.config.mjs */
export default {
  plugins: {
    "postcss-preset-env": { stage: 2 },
    autoprefixer: {},
  },
};

/* You write: */
.card { display: flex; user-select: none; }

/* autoprefixer outputs: */
.card {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}`,
    },
    {
      title: "When to introduce each",
      description: (
        <>
          BEM costs nothing to adopt — it is just a naming rule. Add it whenever you write hand-named
          CSS classes on any project of any size. Sass earns its place when you have repeating
          patterns that mixins or loops fix, or when you are already in a Sass codebase. PostCSS is
          rarely something you need to add: Vite and Next.js already pipe your CSS through it. The
          question is which plugins you configure — <code>autoprefixer</code> for broad browser
          support, <code>postcss-preset-env</code> for future syntax. Adding all three to a clean
          Vite + Tailwind project is over-engineering; adding BEM naming rules costs nothing.
        </>
      ),
      code: `# Decision tree

BEM
  → Use it whenever you write class names by hand.
  → Zero build cost.

Sass
  → Use it when you have mixins with logic, @for loops,
    or an existing SCSS codebase.
  → Skip it if plain CSS + custom properties covers your needs.

PostCSS
  → You probably already have it (Vite, Next.js ship it).
  → Configure autoprefixer if you target old browsers.
  → Configure postcss-preset-env if you want future CSS today.`,
    },
  ];

  const playgroundHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>BEM Demo</title>
</head>
<body>
  <!-- Default card: Block + Elements -->
  <article class="card">
    <h2 class="card__title">Default Card</h2>
    <p class="card__body">
      This card uses the base BEM block. The title is
      <code>.card__title</code> and this paragraph is
      <code>.card__body</code>.
    </p>
    <a href="#" class="card__cta">Read more</a>
  </article>

  <!-- Featured card: Block + Modifier + Elements -->
  <article class="card card--featured">
    <h2 class="card__title">Featured Card</h2>
    <p class="card__body">
      Same elements, different modifier. Adding
      <code>card--featured</code> changes the border
      without touching any selector specificity.
    </p>
    <a href="#" class="card__cta">Read more</a>
  </article>
</body>
</html>`;

  const playgroundCss = `body {
  font-family: system-ui, sans-serif;
  max-width: 600px;
  margin: 24px auto;
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* BEM Block */
.card {
  padding: 1.25rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #fff;
}

/* BEM Elements — flat specificity (0,1,0) each */
.card__title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 0.5rem;
}

.card__body {
  font-size: 0.9rem;
  color: #475569;
  line-height: 1.6;
  margin: 0 0 0.75rem;
}

.card__cta {
  display: inline-block;
  font-size: 0.85rem;
  font-weight: 500;
  color: #3b82f6;
  text-decoration: none;
}

.card__cta:hover {
  text-decoration: underline;
}

/* BEM Modifier — same specificity as the block */
.card--featured {
  border: 2px solid #3b82f6;
  background: #eff6ff;
}`;

  const playgroundJs = `// Try this: in index.html, add the "card--featured" modifier class to the
// first card. Watch the border change without any selector specificity
// fight — modifiers compose, they don't override.
`;

  const bemCode = `/* Block */
.card { padding: 1rem; border-radius: 8px; }
/* Element */
.card__title { font-size: 1.25rem; font-weight: 600; }
.card__body { color: #475569; }
/* Modifier */
.card--featured { border: 2px solid #3b82f6; }`;

  const sassCode = `$brand: #3b82f6;

@mixin focus-ring { outline: 2px solid $brand; outline-offset: 2px; }

.card {
  padding: 1rem;
  border-radius: 8px;

  &__title { font-size: 1.25rem; }
  &--featured { border: 2px solid $brand; }
  &:focus-within { @include focus-ring; }
}`;

  const postcssCode = `export default {
  plugins: {
    "postcss-preset-env": { stage: 2 },
    autoprefixer: {},
  },
};`;

  return (
    <div className="space-y-8">

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 1: Hook                                                       */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Card>
        <CardContent className="pt-6">
          <div className="prose dark:prose-invert max-w-none">
            <p>
              Two CSS files do the same thing. One has 60 lines and you can read it in 30 seconds.
              The other has 600 lines, three deeply nested rules that override each other, and the
              team-lead who wrote it left two years ago. The difference isn&apos;t skill — it&apos;s
              architecture: BEM gave the first one a naming system; Sass gave it composition; PostCSS
              gave it tooling. Each solves a specific problem. Pick the one you have.
            </p>
            <p>
              This module covers the three tools in the order you would reach for them. BEM is just a
              naming rule — zero build cost, available today. Sass is a preprocessor you install when
              repeating patterns demand it. PostCSS is a transform pipeline you probably already have
              via Vite or Next.js; the question is which plugins to configure. By the end, you will
              be able to look at a tangled stylesheet and know exactly which of the three fixes the
              problem.
            </p>
          </div>
          <div className="mt-4">
            <RoadmapLink url="https://roadmap.sh/frontend" />
          </div>
        </CardContent>
      </Card>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 2: Mental model first                                         */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Card>
        <CardContent className="pt-6">
          <div className="prose dark:prose-invert max-w-none">
            <p>
              Three tools, three different jobs. BEM is a naming contract you apply at write time —
              no compiler, no config. Sass extends CSS so the compiler does the repetition for you.
              PostCSS transforms CSS after the fact, letting you write modern syntax and ship
              compatible output. The key insight is that they are not alternatives to each other:
              a codebase can use all three, or just one, depending on which problems are actually
              present. Reaching for all three on a small project adds cost for no benefit; reaching
              for none on a large team adds invisible technical debt.
            </p>
            <blockquote className="border-l-4 border-blue-500 pl-4 italic">
              &quot;Architecture beats clever selectors. BEM names what something is. Sass composes
              styles. PostCSS transforms CSS. Pick the one that fixes the problem you actually
              have.&quot;
            </blockquote>
          </div>
        </CardContent>
      </Card>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 3: Step-by-step                                               */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <StepByStepExplanation
        title="BEM, Sass, PostCSS — what each actually does"
        description="Six steps from raw class names to a full toolchain — and when to stop"
        steps={cssArchitectureSteps}
      />

      {/* Optional: Three CodeBlocks (BEM, Sass, PostCSS examples) */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-4">
            Three tools, three syntax shapes
          </p>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-500 mb-2 font-mono">
                BEM — plain CSS with a naming grammar
              </p>
              <CodeBlock code={bemCode} language="css" fileName="card.css" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-500 mb-2 font-mono">
                Sass — variables, nesting, and a mixin
              </p>
              <CodeBlock code={sassCode} language="scss" fileName="_card.scss" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-500 mb-2 font-mono">
                PostCSS config — two plugins, two jobs
              </p>
              <CodeBlock code={postcssCode} language="javascript" fileName="postcss.config.mjs" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 4: Playground                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <HTMLPlayground
        html={playgroundHtml}
        css={playgroundCss}
        js={playgroundJs}
        title="BEM cards — default and featured"
        description="A default card and a featured card rendered side by side. Each selector is exactly one class deep — flat specificity in action."
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 5: Challenges                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Challenge
        question={`Refactor the class "cardTitleBig cardTitleBlue" to correct BEM. The element is "title" inside a "card" block, and "big" and "blue" are variant states.`}
        options={[
          { id: "a", text: ".card-big-blue" },
          {
            id: "b",
            text: `.card__title card__title--big card__title--blue — written as <h2 class="card__title card__title--big card__title--blue">`,
          },
          { id: "c", text: "#card-title-big-blue" },
          { id: "d", text: ".card .title.big.blue (deeply nested)" },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            BEM&apos;s formula is Block__Element--Modifier. The element is{" "}
            <code>.card__title</code>; &quot;big&quot; and &quot;blue&quot; are modifiers expressed
            as separate classes you compose, not one combined name. Option (a) loses the
            Block__Element structure entirely. Option (c) violates flat specificity by using an ID.
            Option (d) is the descendant-selector mess BEM exists to avoid.
          </>
        }
      />

      <Challenge
        question="Your project uses Vite, Tailwind, and modern CSS. Should you also bring in Sass?"
        options={[
          { id: "a", text: "Yes — Sass is the standard; every project should use it." },
          {
            id: "b",
            text: "No — Tailwind covers utilities and modern CSS covers nesting/variables. Sass would only help if you have build-time loops or complex mixins to migrate.",
          },
          { id: "c", text: "Yes — Sass nesting is the only way to scope styles." },
          { id: "d", text: "No — Sass and Tailwind are mutually exclusive." },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            In 2026, native CSS has nesting, custom properties, <code>@layer</code>, and container
            queries. The cases where Sass still wins are build-time math, complex mixins, and
            migrating legacy code. Tailwind solves a different problem (composition via utility
            classes); they can coexist, but adding Sass to a clean Vite + Tailwind stack rarely
            justifies the build cost.
          </>
        }
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 6: GotchaList                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <GotchaList
        items={[
          {
            title:
              "Sass nesting deeper than 3 levels produces specificity bombs — .a .b .c .d (0,0,4,0) outweighs almost everything",
            body: (
              <>
                Every level of Sass nesting adds a class to the compiled selector. Four levels deep
                produces <code>.block .element .sub .variant</code> — specificity{" "}
                <code>(0,0,4,0)</code>. That beats every single-class BEM selector, and you will
                spend real time overriding it later. Keep nesting to three levels at most; use BEM
                naming to keep it flat.
              </>
            ),
          },
          {
            title:
              "BEM modifiers should be classes, not attribute selectors — .button[data-state=open] adds a specificity tier you don't want",
            body: (
              <>
                <code>.button[data-state=open]</code> has specificity <code>(0,1,1)</code> — one
                class plus one attribute — which beats any plain BEM modifier class at{" "}
                <code>(0,1,0)</code>. You have now created an asymmetry in the specificity budget.
                Use <code>.button--open</code> instead. Attribute selectors are useful for{" "}
                <em>styling</em> based on state set by the browser or JavaScript, but never as a
                stand-in for a BEM modifier.
              </>
            ),
          },
          {
            title:
              "postcss-preset-env lets you use future CSS today; autoprefixer adds vendor prefixes — they're different jobs, often confused",
            body: (
              <>
                <code>postcss-preset-env</code> polyfills new CSS syntax — things like{" "}
                <code>@custom-media</code> or <code>color-mix()</code> — by transforming them into
                older equivalents. <code>autoprefixer</code> takes <em>existing</em> standard CSS
                and adds the <code>-webkit-</code>/<code>-moz-</code> variants that old browser
                builds expect. Both are PostCSS plugins, but their inputs and outputs are different.
                Using only <code>autoprefixer</code> will not polyfill a future CSS feature; using
                only <code>postcss-preset-env</code> may not add the prefixes an old Safari build
                needs.
              </>
            ),
          },
          {
            title:
              "You probably don't need a preprocessor in 2026 — CSS variables + native nesting + container queries cover most of what Sass added",
            body: (
              <>
                The main reasons Sass was indispensable in 2015 — variables, nesting, reusable
                patterns — are now native CSS features. The browser ships them without a build step.
                Before reaching for Sass, check whether{" "}
                <code>--custom-properties</code>, the <code>&amp;</code> nesting selector, and{" "}
                <code>@layer</code> solve your problem. They probably do. Save Sass for the cases
                only it handles: loops, build-time math, and large legacy codebases where a full
                rewrite is not feasible.
              </>
            ),
          },
        ]}
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 7: KeyTakeaways                                               */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <KeyTakeaways
        points={[
          <>
            <em>BEM</em> — Block__Element--Modifier — is a naming convention that keeps every
            selector at one-class specificity and encodes the component hierarchy in the class name
            itself, making CSS searchable and collision-free.
          </>,
          <>
            Sass adds nesting, variables, and mixins to CSS. The <code>&amp;</code> parent selector
            expands to the outer rule, letting you write BEM without repeating the block name.
            Keep nesting to three levels or fewer to avoid high-specificity selectors.
          </>,
          <>
            Native CSS now ships variables (<code>--brand: #3b82f6</code>), the <code>&amp;</code>{" "}
            nesting selector, <code>@layer</code>, and container queries. Starting a new project
            in 2026 without Sass is entirely reasonable.
          </>,
          <>
            <em>PostCSS</em> transforms CSS after authoring via a plugin pipeline.{" "}
            <code>autoprefixer</code> adds vendor prefixes; <code>postcss-preset-env</code>{" "}
            polyfills future syntax. Most projects already have PostCSS running via Vite or Next.js.
          </>,
          <>
            Pick the tool that fixes the problem you have. BEM is free — use it on every project.
            Sass earns its place when you have loops or complex mixins. PostCSS is largely
            automatic; configure its plugins based on your browser targets.
          </>,
        ]}
        mentalModel="Architecture beats clever selectors. BEM names what something is. Sass composes styles. PostCSS transforms CSS. Pick the one that fixes the problem you actually have."
      />
    </div>
  );
}
