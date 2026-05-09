"use client";

import { Card, CardContent } from "@/components/ui/card";
import { HTMLPlayground } from "@/components/CodePlayground";
import { StepByStepExplanation, Step } from "@/components/StepByStepExplanation";
import { Challenge } from "@/components/Challenge";
import { GotchaList } from "@/components/GotchaList";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { RoadmapLink } from "@/components/RoadmapLink";

export function Module_3_4_Content() {
  // Data blocks hoisted out of JSX for readability — listed in render order.
  const tailwindSteps: Step[] = [
    {
      title: "Step 1: What a utility is",
      description: (
        <>
          A <em>utility class</em> — a class that does one thing — is the atomic unit of Tailwind.{" "}
          <code>.flex</code> sets <code>display: flex</code>. <code>.p-4</code> sets{" "}
          <code>padding: 1rem</code>. <code>.text-blue-500</code> sets a specific color drawn from
          the design system. Each class does exactly one thing and nothing else. There are no
          side effects, no cascade surprises, and no naming to invent.
        </>
      ),
      code: `/* Equivalent CSS ↔ Tailwind utility */
.flex    → display: flex
.p-4     → padding: 1rem          /* 4 × 0.25rem */
.py-2    → padding-top: 0.5rem; padding-bottom: 0.5rem
.px-4    → padding-left: 1rem; padding-right: 1rem
.rounded → border-radius: 0.25rem
.text-blue-500 → color: #3b82f6   /* from the color scale */
.bg-white      → background-color: #ffffff
.font-bold     → font-weight: 700`,
    },
    {
      title: "Step 2: Compose at the point of use",
      description: (
        <>
          Instead of writing a <code>.button-primary</code> class in a separate file, you compose
          the styling directly on the element. The markup and the styles are in the same place —
          you never need to jump between files to understand how something looks.
        </>
      ),
      code: `<!-- Hand-written CSS version -->
<button class="btn-primary">Click</button>

<!-- In button.css, somewhere else in the project: -->
/* .btn-primary { padding: 0.5rem 1rem; background: #3b82f6;
                 color: white; border-radius: 0.375rem; } */
/* .btn-primary:hover { background: #2563eb; } */


<!-- Tailwind version — everything inline, no separate file -->
<button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
  Click
</button>`,
    },
    {
      title: "Step 3: Variants for state and breakpoint",
      description: (
        <>
          Tailwind extends utilities with <em>variants</em> — prefixes that narrow when a utility
          applies. <code>hover:</code>, <code>focus:</code>, and <code>active:</code> apply on
          interaction. <code>sm:</code>, <code>md:</code>, and <code>lg:</code> apply at
          breakpoints. <code>md:flex</code> means &quot;apply <code>display: flex</code> only
          above the medium breakpoint.&quot; Responsive design is mobile-first: base classes apply
          everywhere, breakpoint variants override upward.
        </>
      ),
      code: `<!-- Hover and focus states -->
<button class="bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300">
  Button
</button>

<!-- Responsive layout: column on mobile, row on medium+ -->
<div class="flex flex-col md:flex-row gap-4">
  <aside class="w-full md:w-64">Sidebar</aside>
  <main class="flex-1">Content</main>
</div>

<!-- Dark mode -->
<p class="text-gray-900 dark:text-gray-100">Adapts to dark mode</p>`,
    },
    {
      title: "Step 4: Design tokens in tailwind.config",
      description: (
        <>
          Every color, spacing value, and font size in Tailwind comes from a design token defined
          in <code>tailwind.config.ts</code>. The utilities are just names for those tokens.
          Change the brand color in one place and every button, badge, and heading that references
          it updates automatically. This is the mechanism that replaces scattered{" "}
          <code>#3b82f6</code> hex values throughout a codebase.
        </>
      ),
      code: `// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#6366f1",   // bg-brand, text-brand
          light:   "#a5b4fc",   // bg-brand-light
          dark:    "#4338ca",   // bg-brand-dark
        },
      },
      spacing: {
        "18": "4.5rem",         // p-18, m-18, w-18 …
      },
      fontFamily: {
        display: ["'Inter Display'", "sans-serif"],
      },
    },
  },
} satisfies Config;`,
    },
    {
      title: "Step 5: When to reach for @apply",
      description: (
        <>
          When the same long class string repeats in many places you can define a named class with{" "}
          <code>@apply</code> inside a <code>.css</code> file. This gives you a short name to
          write on elements. Use it sparingly — too much <code>@apply</code> reintroduces the
          naming problem you came to Tailwind to avoid, and it removes the &quot;grep for
          the class string&quot; refactoring advantage.
        </>
      ),
      code: `/* globals.css */
@layer components {
  .btn {
    @apply px-4 py-2 rounded-md font-medium transition-colors;
  }
  .btn-primary {
    @apply bg-blue-500 text-white hover:bg-blue-600 focus:ring-2;
  }
}

/* Usage */
<button class="btn btn-primary">Save</button>

/* The better alternative in React/Vue/Svelte — a component: */
function Button({ children }: { children: React.ReactNode }) {
  return (
    <button className="px-4 py-2 rounded-md font-medium bg-blue-500
                       text-white hover:bg-blue-600 focus:ring-2 transition-colors">
      {children}
    </button>
  );
}`,
    },
    {
      title: "Step 6: When NOT to use Tailwind",
      description: (
        <>
          Tailwind&apos;s purger scans your files statically — it cannot find classes assembled at
          runtime by string concatenation. Global resets and base styles (<code>box-sizing</code>,
          custom scrollbars, third-party overrides) are easier to write in plain CSS. Dynamic
          styles that depend on JavaScript variables at render time — e.g.{" "}
          <code>{`style={{ width: progress + "%" }}`}</code> — belong as inline styles or CSS
          custom properties, not Tailwind classes. Keep a small <code>globals.css</code> for
          these cases.
        </>
      ),
      code: `/* globals.css — things that belong outside Tailwind */

/* 1. Global reset (already in Tailwind's preflight, but you may extend it) */
*, *::before, *::after { box-sizing: border-box; }

/* 2. Third-party library overrides */
.react-datepicker { border-radius: 0.5rem !important; }

/* 3. CSS custom property driven by JS — Tailwind can't express this */
.progress-bar {
  width: var(--progress);   /* set via element.style.setProperty */
  transition: width 300ms;
}

/* DON'T do this in Tailwind — class won't be generated: */
/* className={\`w-[\${progress}%]\`}  ← purger won't see it */`,
    },
  ];

  const playgroundHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Tailwind Card</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen flex items-center justify-center p-8">

  <div class="bg-white rounded-lg shadow-md overflow-hidden max-w-sm w-full">
    <!-- Card image -->
    <div class="bg-gradient-to-br from-blue-400 to-indigo-600 h-48 flex items-center justify-center">
      <span class="text-white text-5xl font-bold select-none">T</span>
    </div>

    <!-- Card body -->
    <div class="p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-2">Tailwind CSS</h2>
      <p class="text-gray-600 text-sm mb-4">
        A utility-first CSS framework. Every class does one thing — compose them
        inline and let the design system live in the config.
      </p>

      <!-- Tag row -->
      <div class="flex gap-2 mb-4">
        <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">utility-first</span>
        <span class="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">design tokens</span>
      </div>

      <!-- Action button -->
      <button
        class="w-full px-4 py-2 bg-blue-500 text-white rounded-md font-medium
               hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300
               transition-colors"
      >
        Get started
      </button>
    </div>
  </div>

  <script src="/script.js"></script>
</body>
</html>`;

  const playgroundCss = `/* No custom CSS needed — Tailwind handles everything.
   This file is intentionally empty so the card above uses
   only utility classes loaded from the CDN. */`;

  const playgroundJs = `// Try this: in index.html, change "bg-blue-500" to "bg-emerald-500" and watch
// the button color update. Then change "rounded-lg" to "rounded-full" on the
// card. Tailwind ships ~50,000 utility classes; you compose them inline.
`;

  return (
    <div className="space-y-8">

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 1: Hook                                                       */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Card>
        <CardContent className="pt-6">
          <div className="prose dark:prose-invert max-w-none">
            <p>
              You name a CSS class <code>.card-header-with-icon-on-left</code>. A week later you
              copy a card and break the icon. The class name said how it was <em>built</em>, not
              what it <em>is</em>, and now it&apos;s wrong twice.
            </p>
            <p>
              Tailwind&apos;s answer: stop naming things — compose styles inline from a fixed
              alphabet of utilities and let the design system live in the markup. There are no
              class names to invent, no <code>.css</code> file to jump to, and no cascade to fight.
              When you delete an element, its styles disappear with it.
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
              <em>Tailwind CSS</em> — a utility-first CSS framework: small, single-purpose classes
              (<code>.flex</code>, <code>.p-4</code>, <code>.text-blue-500</code>) composed inline
              — works because styling at the point of use is always cheaper than maintaining a
              separate naming system. You don&apos;t need to think of a name for a concept, keep
              a file in sync, or worry whether a class is used anywhere else. The entire design
              system — colors, spacing, typography — lives in one config file;{" "}
              <em>utility classes</em> are just named tokens from that file.
            </p>
            <blockquote className="border-l-4 border-blue-500 pl-4 italic">
              &quot;Utility classes compose styles inline. The cascade and naming go away — you
              describe the styling at the point of use, and the design tokens live in one config
              file.&quot;
            </blockquote>
          </div>
        </CardContent>
      </Card>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 3: Step-by-step                                               */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <StepByStepExplanation
        title="Tailwind from zero to component"
        description="Six steps from what a utility is to when you should and should not use Tailwind"
        steps={tailwindSteps}
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 4: Live playground                                            */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <HTMLPlayground
        html={playgroundHtml}
        css={playgroundCss}
        js={playgroundJs}
        title="Tailwind card — edit the utilities"
        description="The card is styled entirely with Tailwind utility classes loaded from CDN. Edit the class strings and see the result live."
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 5: Challenges                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Challenge
        question={`Translate .btn { padding: 8px 16px; background: #3b82f6; color: white; border-radius: 6px; } into Tailwind.`}
        options={[
          { id: "a", text: `class="btn" — Tailwind doesn't replace class names.` },
          { id: "b", text: `class="py-2 px-4 bg-blue-500 text-white rounded-md"` },
          { id: "c", text: `class="padding-2-4 background-blue-500 color-white border-radius-6"` },
          { id: "d", text: `class="@apply py-2 px-4 bg-blue-500 text-white rounded-md"` },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            Tailwind utilities map to design tokens, not raw CSS values: <code>py-2</code> is{" "}
            <code>padding-top: 0.5rem; padding-bottom: 0.5rem</code> and{" "}
            <code>bg-blue-500</code> is the system&apos;s blue. Option (c) invents class names
            Tailwind doesn&apos;t ship. <code>@apply</code> is for inside <code>.css</code> files,
            not on elements directly.
          </>
        }
      />

      <Challenge
        question={`You have ten buttons across the site that all use the same long class string "px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:ring-2". Should you extract it?`}
        options={[
          {
            id: "a",
            text: "No — Tailwind's philosophy is to repeat utilities inline, always.",
          },
          {
            id: "b",
            text: "Yes — build a <Button> React component that wraps the class string, and use <Button> everywhere.",
          },
          {
            id: "c",
            text: "Yes — define .btn with @apply and replace every long class string with class=\"btn\".",
          },
          {
            id: "d",
            text: "It doesn't matter; the bundle size is the same.",
          },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            A React (or Vue/Svelte) component wraps both the class string <em>and</em> the API
            surface — props, defaults, accessibility wiring. <code>@apply</code> (option c)
            re-creates the naming problem; you&apos;ve just moved long class strings into a{" "}
            <code>.css</code> file. Keeping the inline pattern (a) loses you the abstraction;
            component (b) is the modern answer.
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
              "Tailwind classes ship verbatim in HTML — the build step purges unused ones, but only if it can find them statically (no string concatenation in class names)",
            body: (
              <>
                The Tailwind CLI scans your source for complete class strings. If you write{" "}
                <code>{`\`text-\${color}-500\``}</code>, the purger never sees{" "}
                <code>text-red-500</code> or <code>text-blue-500</code> — they are removed from the
                final CSS. Always write full class names as static strings, or use the{" "}
                <code>safelist</code> option in <code>tailwind.config.ts</code>.
              </>
            ),
          },
          {
            title: "@apply reintroduces naming — use it sparingly, prefer component abstractions",
            body: (
              <>
                Every <code>@apply</code> creates a name you now have to maintain. The moment you
                start writing <code>.btn-primary-with-icon</code> you are back to the naming
                problem Tailwind was designed to avoid. Prefer a <code>{"<Button>"}</code>{" "}
                component — it gives you props and type-checking alongside the class string.
              </>
            ),
          },
          {
            title:
              "Arbitrary values (w-[372px], text-[#fa3]) are escape hatches — every one is mini design-debt; configure the design system instead",
            body: (
              <>
                Arbitrary values like <code>w-[372px]</code> and <code>text-[#fa3eb1]</code> let
                you express any CSS value inline. Used occasionally they are fine. Used
                prolifically they mean your design tokens are scattered across dozens of files
                rather than centralized in <code>tailwind.config.ts</code>. When an arbitrary
                value repeats more than twice, add it to the config.
              </>
            ),
          },
          {
            title:
              "dark: is opt-in — by default it requires a class=\"dark\" toggle on <html>, not a media query, unless you set darkMode: 'media'",
            body: (
              <>
                By default <code>dark:</code> variants activate when a parent element carries the{" "}
                <code>dark</code> class — typically set by a JavaScript toggle on{" "}
                <code>{"<html>"}</code>. If you want dark mode to follow the OS preference instead,
                set <code>darkMode: &apos;media&apos;</code> in <code>tailwind.config.ts</code>.
                The class strategy gives you a manual toggle; the media strategy is automatic but
                user-controlled.
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
            A <em>utility class</em> does one thing: <code>.flex</code> is{" "}
            <code>display: flex</code>, <code>.p-4</code> is <code>padding: 1rem</code>. You
            compose them inline rather than building bespoke CSS — no naming, no cascade, no
            separate file to maintain.
          </>,
          <>
            Variants extend utilities for state and breakpoint: <code>hover:bg-blue-600</code>,
            <code> focus:ring-2</code>, <code>md:flex</code>. Responsive design is mobile-first —
            base utilities apply everywhere, breakpoint variants override upward.
          </>,
          <>
            Design tokens (colors, spacing, typography) live in <code>tailwind.config.ts</code>.
            Change the brand color there and every element that uses it updates automatically.
          </>,
          <>
            When a long class string repeats, prefer a React component over <code>@apply</code>.
            A component wraps the class string <em>and</em> the API — props, defaults,
            accessibility. <code>@apply</code> reintroduces naming.
          </>,
          <>
            Tailwind&apos;s purger scans source files statically. Never build class names by string
            concatenation — the generated class won&apos;t survive the build step.
          </>,
          <>
            Utility classes compose styles inline. The cascade and naming go away — you describe
            the styling at the point of use, and the design tokens live in one config file.
          </>,
        ]}
        mentalModel="Utility classes compose styles inline. The cascade and naming go away — you describe the styling at the point of use, and the design tokens live in one config file."
      />

      {/* Alternatives — one paragraph after KeyTakeaways */}
      <Card>
        <CardContent className="pt-6 prose dark:prose-invert max-w-none">
          <p>
            <strong>Alternatives.</strong> CSS Modules scope class names per file via build-time
            hashing — good when you want hand-written CSS without leaks. CSS-in-JS
            (styled-components, emotion) writes CSS in JavaScript template literals, with runtime
            cost on the older variants. <code>vanilla-extract</code> and <code>linaria</code> are
            zero-runtime CSS-in-JS. Panda CSS combines utility-first with type safety. Pick by
            team familiarity and runtime budget; Tailwind is the most popular pick in 2026 because
            it scales without leaks.
          </p>
        </CardContent>
      </Card>

    </div>
  );
}
