"use client";
import { ScaffoldModule } from "./_template";
import { CodeBlock } from "@/components/CodeBlock";

export function Module_3_5_Content() {
  return (
    <ScaffoldModule
      emoji="🏛️"
      problemTitle="BEM, Sass, PostCSS — naming and tooling for CSS at scale"
      problem={
        <>
          <p>
            Plain CSS has no concept of scope, no variables before custom properties, no loops or
            functions, and no enforced naming. On a team of five working for six months, this
            compounds into thousands of lines of tangled selectors where changing one rule means
            grepping the entire codebase to find what else might break. Methodology and tooling
            exist to impose structure before the mess accumulates.
          </p>
          <p>
            <strong>BEM</strong> (Block, Element, Modifier) is a naming convention, not a tool.
            A <em>Block</em> is a standalone component (<code>.card</code>). An{" "}
            <em>Element</em> is a part of that block (<code>.card__title</code>,{" "}
            <code>.card__image</code>). A <em>Modifier</em> is a variation or state
            (<code>.card--featured</code>, <code>.card__title--truncated</code>). The double
            underscore and double hyphen are purely visual — they make the parent component
            obvious just by reading the class name, which eliminates most specificity
            conflicts because every selector stays at one class of specificity.
          </p>
          <p>
            <strong>Sass</strong> (SCSS syntax) is a CSS preprocessor: it extends CSS with
            nesting, variables (<code>$primary-color</code>), mixins (reusable rule blocks),
            and functions. The compiler outputs plain CSS that any browser can read. Keep nesting
            shallow — two levels maximum — because deeply nested Sass compiles into high-specificity
            selectors that are hard to override later.
          </p>
          <p>
            <strong>PostCSS</strong> is different from Sass: it is a post-processor that transforms
            valid CSS using a plugin pipeline <em>after</em> you have written it. The most used
            plugin, Autoprefixer, reads your CSS and automatically inserts vendor prefixes
            (<code>-webkit-</code>, <code>-moz-</code>) based on the browserslist target. Other
            plugins can inline <code>@import</code> statements, apply CSS nesting, or minify.
            PostCSS and Sass are not mutually exclusive — most projects run Sass first, then pipe
            the output through PostCSS.
          </p>
        </>
      }
      body={
        <CodeBlock
          language="scss"
          fileName="_card.scss — BEM naming, Sass nesting & mixin, PostCSS note"
          code={`// ── Sass variables ────────────────────────────────────────────
$color-primary:   #6366f1;
$color-surface:   #ffffff;
$color-border:    #e2e8f0;
$radius-card:     12px;
$shadow-card:     0 2px 8px rgba(0, 0, 0, 0.08);

// ── Mixin: reusable flex row helper ───────────────────────────
@mixin flex-row($gap: 0.5rem) {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: $gap;
}

// ── Block: .card ──────────────────────────────────────────────
// BEM convention: Block__Element--Modifier
// Max 2 levels of nesting to keep specificity low.

.card {
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: $radius-card;
  box-shadow: $shadow-card;
  overflow: hidden;

  // Element: .card__header
  &__header {
    @include flex-row(0.75rem);   // uses the mixin above
    padding: 1rem 1.25rem;
    border-bottom: 1px solid $color-border;
  }

  // Element: .card__title
  &__title {
    font-size: 1rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0;

    // Modifier: .card__title--truncated
    &--truncated {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  // Element: .card__body
  &__body {
    padding: 1.25rem;
    font-size: 0.9rem;
    color: #475569;
    line-height: 1.6;
  }

  // Modifier: .card--featured  (whole block variation)
  &--featured {
    border-color: $color-primary;
    box-shadow: 0 0 0 2px rgba($color-primary, 0.25);

    // Modifier affects nested element
    .card__header {
      background: lighten($color-primary, 42%);
    }
  }
}

// ─────────────────────────────────────────────────────────────
// What PostCSS Autoprefixer adds AFTER compiling this Sass:
//
// If your browserslist target includes older Safari/Firefox,
// Autoprefixer rewrites properties like:
//
//   display: flex;
//   → display: -webkit-box;       (very old Safari/Chrome)
//     display: -webkit-flex;      (older Safari)
//     display: -ms-flexbox;       (IE 10)
//     display: flex;
//
// You write standard CSS; Autoprefixer handles compatibility.
// Configure targets in package.json:
//   "browserslist": ["> 0.5%", "last 2 versions", "not dead"]
// ─────────────────────────────────────────────────────────────`}
        />
      }
      challenge={{
        question:
          "In BEM naming, which class correctly represents a 'disabled' state of the submit button inside a form block?",
        options: [
          { id: "a", text: ".form-submit-button-disabled" },
          { id: "b", text: ".form__submit--disabled" },
          { id: "c", text: ".form--submit__disabled" },
          { id: "d", text: ".form__submit__disabled" },
        ],
        correctAnswerId: "b",
        explanation: (
          <>
            BEM uses double underscore to separate <em>Block</em> from <em>Element</em> and double
            hyphen to separate an Element (or Block) from its <em>Modifier</em>. The submit button
            is an element of the form block (<code>.form__submit</code>) and disabled is a
            modifier, so the correct name is <code>.form__submit--disabled</code>. Double underscores
            are never used for modifiers, and modifiers never appear between two underscores.
          </>
        ),
      }}
      takeaways={[
        <>BEM (Block__Element--Modifier) keeps every selector at one-class specificity and makes the component owner obvious just by reading the class name — no grepping required.</>,
        <>Sass adds nesting, variables, and mixins to CSS; keep nesting to two levels maximum to avoid generating high-specificity selectors that fight the cascade later.</>,
        <>PostCSS is a post-processor, not a preprocessor — it transforms valid CSS after authoring. Autoprefixer, its most popular plugin, auto-inserts vendor prefixes based on your browserslist target.</>,
      ]}
      mentalModel="BEM is a naming contract, Sass is a CSS superset, PostCSS is a transformation pipeline — they solve different problems and compose without conflict."
      roadmapUrl="https://roadmap.sh/frontend"
    />
  );
}
