"use client";

import { ScaffoldModule } from "./_template";
import { CodeBlock } from "@/components/CodeBlock";

const eslintConfigCode = `// eslint.config.js  (ESLint v9 flat config)
import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier"; // turns OFF formatting rules

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  // 1. ESLint's built-in recommended rules (no-unused-vars, etc.)
  js.configs.recommended,

  // 2. TypeScript-aware rules — correctness only, not formatting
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: { project: "./tsconfig.json" },
    },
    plugins: { "@typescript-eslint": tsPlugin },
    rules: {
      // Correctness rules
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "prefer-const": "error",
      "no-shadow": "error",

      // This rule would fight Prettier's quote style — turned off below
      // "quotes": ["error", "double"],  // <-- do NOT add this
    },
  },

  // 3. eslint-config-prettier LAST — disables every ESLint rule that
  //    Prettier already handles (spacing, line length, quotes, semi, etc.)
  //    so the two tools never produce conflicting auto-fixes.
  prettierConfig,
];`;

export function Module_6_1_Content() {
  return (
    <ScaffoldModule
      emoji="🧹"
      problemTitle="ESLint catches; Prettier formats; never the same job"
      problem={
        <>
          <p>
            <strong>Linters</strong> check <em>correctness rules</em>: &quot;don&apos;t
            shadow variables&quot;, &quot;use <code>const</code> where possible&quot;, &quot;no
            unused imports&quot;. These rules have a right and wrong answer — they
            catch real bugs or bad practices. Running ESLint without
            auto-fixing is equivalent to a fast code review pass that never
            gets tired.
          </p>
          <p>
            <strong>Formatters</strong> reshape <em>whitespace</em>: &quot;80-char
            lines&quot;, &quot;2-space indent&quot;, &quot;trailing commas&quot;. There is no
            right-or-wrong here — only consistency. Prettier is opinionated
            by design; it removes all style debates from code review. The key
            insight is that linting and formatting are <em>separate
            concerns</em> — mixing them causes fights when both tools want to
            rewrite the same token differently.
          </p>
          <p>
            Wiring them together requires{" "}
            <code>eslint-config-prettier</code>, which turns{" "}
            <strong>OFF</strong> every ESLint formatting rule so Prettier
            wins without argument. Run lint on a pre-commit hook (cheap,
            local) and again in CI (authoritative, blocks merge). Never skip
            the CI check — local hooks can be bypassed.
          </p>
        </>
      }
      body={
        <CodeBlock
          language="javascript"
          fileName="eslint.config.js"
          code={eslintConfigCode}
        />
      }
      challenge={{
        question: "Why use `eslint-config-prettier` in your ESLint config?",
        options: [
          {
            id: "a",
            text: "It adds Prettier's formatting rules to ESLint so you only need one tool.",
          },
          {
            id: "b",
            text: "It disables ESLint rules that conflict with Prettier's formatting decisions, so the two tools stop arguing.",
          },
          {
            id: "c",
            text: "It runs Prettier automatically whenever ESLint finds a violation.",
          },
          {
            id: "d",
            text: "It upgrades ESLint to support TypeScript without a separate parser.",
          },
        ],
        correctAnswerId: "b",
        explanation: (
          <>
            ESLint and Prettier can both try to rewrite the same token (e.g.,
            quote style, trailing commas). Without{" "}
            <code>eslint-config-prettier</code> they produce conflicting
            auto-fixes. The package disables only the ESLint rules that
            overlap with Prettier, leaving correctness rules untouched, so
            each tool stays in its lane.
          </>
        ),
      }}
      takeaways={[
        <>
          Lint for correctness, format for style — they are different
          problems with different right answers.
        </>,
        <>
          Place <code>eslint-config-prettier</code> last in your config array
          so it overrides any formatting rules added by earlier configs.
        </>,
        <>
          Automate both in pre-commit hooks and CI; a rule that isn&apos;t
          enforced automatically will eventually be ignored.
        </>,
      ]}
      mentalModel="Lint = correctness; format = whitespace. Stop arguing about style — let the tool decide."
      roadmapUrl="https://roadmap.sh/frontend"
    />
  );
}
