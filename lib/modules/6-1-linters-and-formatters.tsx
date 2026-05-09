"use client";

import { Card, CardContent } from "@/components/ui/card";
import { HTMLPlayground } from "@/components/CodePlayground";
import { StepByStepExplanation, Step } from "@/components/StepByStepExplanation";
import { TerminalPlayground } from "@/components/TerminalPlayground";
import { Challenge } from "@/components/Challenge";
import { GotchaList } from "@/components/GotchaList";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { RoadmapLink } from "@/components/RoadmapLink";

export function Module_6_1_Content() {
  // Data blocks hoisted out of JSX for readability — listed in render order.
  const eslintPrettierSteps: Step[] = [
    {
      title: "Step 1: What ESLint catches",
      description: (
        <>
          A <em>linter</em> — a tool that statically analyzes code for likely bugs and style issues
          — reads your source without running it and flags patterns that are almost certainly wrong.
          Unused variables declared but never read, <code>==</code> comparisons that coerce types
          unexpectedly, functions that can return <code>undefined</code> when callers expect a
          value, <code>await</code> accidentally dropped from an async call — these are ESLint&apos;s
          domain. Every rule has a right answer; the debate is which rules to turn on. ESLint ships
          with hundreds; plugin sets like <code>@typescript-eslint</code> add hundreds more for
          TypeScript-specific patterns.
        </>
      ),
      code: `// ESLint flags these — all likely bugs, not style opinions

let user = getUser();     // no-unused-vars: declared, never read
if (x == null) { }        // eqeqeq: use === for predictable coercion
async function load() {
  return fetchData();     // @typescript-eslint/no-floating-promises:
}                         //   Promise not awaited or returned

// ESLint does NOT care about:
//   indent size, quote style, trailing commas, line length
//   — those are Prettier's job`,
    },
    {
      title: "Step 2: What Prettier formats",
      description: (
        <>
          A <em>formatter</em> — a tool that rewrites code into a canonical layout — makes
          whitespace decisions so you never have to. Quote style (single vs double), trailing
          commas in argument lists, arrow function parentheses, maximum line length, indentation.
          Prettier is deliberately opinionated: it exposes almost no configuration because the goal
          is <em>not</em> to find the &quot;best&quot; style — it is to eliminate the decision
          entirely. The exact output does not matter; what matters is that every file looks the same
          and every PR diff is about code, not alignment.
        </>
      ),
      code: `// You write this:
const greet = (name) => { return "Hello, "+name }

// Prettier rewrites to:
const greet = (name) => {
  return "Hello, " + name;
};

// .prettierrc.json — the tiny amount Prettier lets you configure:
{
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100
}`,
    },
    {
      title: "Step 3: Wire them so they don't fight",
      description: (
        <>
          ESLint has formatting rules too — <code>quotes</code>, <code>semi</code>,{" "}
          <code>indent</code>. If you run both tools, ESLint may try to auto-fix quote style one
          way while Prettier fixes it another, and the two tools loop. The fix is{" "}
          <code>eslint-config-prettier</code>: a config that turns <strong>off</strong> every
          ESLint rule that conflicts with Prettier&apos;s output. Install it, add it last in your
          config array, and the tools stop fighting. Run Prettier first (to format), then ESLint
          (to catch bugs) — that order matters in CI.
        </>
      ),
      code: `// eslint.config.mjs  (ESLint v9 flat config)
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier"; // turns OFF formatting rules

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Your project rules (correctness only — no formatting):
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "prefer-const": "error",
    },
  },

  // LAST: disables any ESLint rule that Prettier already handles
  prettierConfig,
];`,
    },
    {
      title: "Step 4: ESLint flat config (v9+)",
      description: (
        <>
          ESLint v9 introduced a new config format: <code>eslint.config.js</code> (or{" "}
          <code>.mjs</code>), an exported array of config objects. This replaces the legacy{" "}
          <code>.eslintrc.json</code> / <code>.eslintrc.js</code> family. Each object in the array
          can target specific file globs, set a parser, declare plugins, and define rules. Objects
          are merged in order — later entries override earlier ones for the same rule. If you see a
          blog post or AI output suggesting <code>.eslintrc.*</code>, it is writing legacy syntax;
          the flat config format is what ESLint 9+ expects by default. The two formats cannot
          coexist in the same project.
        </>
      ),
      code: `// eslint.config.mjs — modern flat config array
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import prettierConfig from "eslint-config-prettier";

export default [
  // 1. ESLint built-ins
  js.configs.recommended,

  // 2. TypeScript
  ...tseslint.configs.recommended,

  // 3. React + hooks
  {
    files: ["**/*.{tsx,jsx}"],
    plugins: { react: reactPlugin, "react-hooks": reactHooks },
    rules: {
      "react/jsx-key": "error",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },

  // 4. Prettier LAST — disables formatting rules
  prettierConfig,
];`,
    },
    {
      title: "Step 5: Pre-commit hooks",
      description: (
        <>
          A <em>pre-commit hook</em> — a Git hook that runs before a commit; commonly runs
          lint/format — stops bad code from entering version control without blocking normal work.{" "}
          <code>husky</code> installs the Git hook; <code>lint-staged</code> runs format and lint
          only on the files you staged, not the whole codebase. That keeps the hook fast even in a
          large repo. The config in <code>package.json</code> under{" "}
          <code>&quot;lint-staged&quot;</code> maps glob patterns to commands: Prettier first, then
          ESLint, because Prettier&apos;s output is ESLint&apos;s input.
        </>
      ),
      code: `// package.json (relevant sections)
{
  "scripts": {
    "prepare": "husky"           // installs .husky/ hooks on npm install
  },
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": [
      "prettier --write",        // 1. format in place
      "eslint --fix"             // 2. auto-fix lint errors; fail if unfixable
    ],
    "*.{json,md,css}": [
      "prettier --write"         // format-only for non-JS files
    ]
  }
}

// .husky/pre-commit (created by husky init)
pnpm exec lint-staged`,
    },
    {
      title: "Step 6: CI catches the rest",
      description: (
        <>
          Pre-commit hooks protect the repository when everyone plays fair. A developer can skip
          them with <code>git commit --no-verify</code>. CI cannot be skipped: the pipeline runs
          the same lint and format check on every pushed commit and blocks the PR if it fails. The
          CI check is the source of truth; the pre-commit hook is the fast local catch that saves
          the round-trip to CI. Run format in &quot;check&quot; mode (<code>--check</code>) in CI
          so it fails without modifying files. A passing CI pipeline means the codebase is
          consistently formatted and lint-clean regardless of individual developer setups.
        </>
      ),
      code: `# .github/workflows/ci.yml (relevant lint job)
lint:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: pnpm/action-setup@v4
    - run: pnpm install --frozen-lockfile

    # Format check: fails if any file would be changed
    - run: pnpm exec prettier --check "**/*.{ts,tsx,js,jsx,json,md,css}"

    # Lint: fails on any error (warnings allowed)
    - run: pnpm exec eslint . --max-warnings 0`,
    },
  ];

  const terminalLines = [
    {
      command:
        "pnpm add -D eslint @eslint/js typescript-eslint prettier eslint-config-prettier husky lint-staged",
      output: "Progress: resolved 12, downloaded 12, added 12",
      delayMs: 900,
    },
    {
      command: "echo 'export default { ... }' > eslint.config.mjs",
      output: "",
      delayMs: 600,
    },
    {
      command: "echo '{ \"singleQuote\": true }' > .prettierrc.json",
      output: "",
      delayMs: 600,
    },
    {
      command: "pnpm exec husky init",
      output: "husky initialised in .husky/",
      delayMs: 700,
    },
    {
      command: "echo 'pnpm exec lint-staged' > .husky/pre-commit",
      output: "",
      delayMs: 600,
    },
    {
      command: "git add . && git commit -m 'lint setup'",
      output:
        "Running lint-staged...\n✓ Running ESLint and Prettier on 5 staged files\n[main 1a2b3c] lint setup",
      delayMs: 1000,
    },
  ];

  const playgroundHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>ESLint + Prettier config explorer</title>
</head>
<body>
  <h2>Config explorer</h2>
  <p class="hint">Click a rule to learn what it does and which tool owns it.</p>

  <div class="cols">
    <div class="panel">
      <div class="panel-title">eslint.config.mjs</div>
      <div class="config-code" id="eslint-list"></div>
    </div>
    <div class="panel">
      <div class="panel-title">.prettierrc.json</div>
      <div class="config-code" id="prettier-list"></div>
    </div>
  </div>

  <div class="detail-box">
    <strong id="detail-title">Click a rule above</strong>
    <p id="detail-body">Each item is interactive. Click to learn whether it belongs to ESLint (correctness) or Prettier (style).</p>
  </div>

  <script src="/script.js"></script>
</body>
</html>`;

  const playgroundCss = `* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: system-ui, sans-serif;
  padding: 16px;
  color: #1e293b;
  background: #f8fafc;
}
h2 { font-size: 1.1rem; margin-bottom: 4px; }
.hint { font-size: 0.8rem; color: #64748b; margin-bottom: 16px; }

.cols { display: flex; gap: 12px; flex-wrap: wrap; }
.panel {
  flex: 1;
  min-width: 260px;
  background: #0f172a;
  border-radius: 8px;
  overflow: hidden;
}
.panel-title {
  padding: 8px 12px;
  background: #1e293b;
  color: #94a3b8;
  font-size: 0.75rem;
  font-family: monospace;
}
.config-code {
  padding: 12px;
  font-family: monospace;
  font-size: 0.78rem;
  line-height: 1.8;
}

.rule-btn {
  display: block;
  width: 100%;
  text-align: left;
  background: transparent;
  border: none;
  color: #e2e8f0;
  font-family: monospace;
  font-size: 0.78rem;
  padding: 2px 4px;
  border-radius: 3px;
  cursor: pointer;
  transition: background 0.15s;
}
.rule-btn:hover { background: #334155; }
.rule-btn.active { background: #1d4ed8; color: #bfdbfe; }

.detail-box {
  margin-top: 16px;
  padding: 12px 16px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.85rem;
  min-height: 60px;
}
.detail-box strong { display: block; margin-bottom: 4px; color: #1d4ed8; }`;

  const playgroundJs = `// Try this: in the eslint.config.mjs displayed below, comment out the
// "no-unused-vars" rule. Then run the imagined input: \`let x = 5; console.log(1);\`
// Without the rule, ESLint won't flag x. With the rule, it will.
// Lint config is what your team agreed to enforce; the rules don't
// exist until you write them down.

var eslintRules = [
  {
    id: "no-unused-vars",
    label: '"no-unused-vars": "error"',
    title: "no-unused-vars",
    body: "Flags variables declared but never read. Likely bug: you wrote code that does nothing. Tool: ESLint (correctness)."
  },
  {
    id: "prefer-const",
    label: '"prefer-const": "error"',
    title: "prefer-const",
    body: "Flags let declarations that are never reassigned. Should be const to signal intent and prevent accidental mutation. Tool: ESLint (correctness)."
  },
  {
    id: "eqeqeq",
    label: '"eqeqeq": "error"',
    title: "eqeqeq",
    body: "Requires === instead of ==. The == operator coerces types (null == undefined is true). Almost always a bug when you meant strict equality. Tool: ESLint (correctness)."
  },
  {
    id: "no-explicit-any",
    label: '"@typescript-eslint/no-explicit-any": "error"',
    title: "@typescript-eslint/no-explicit-any",
    body: "Bans the any type, which disables TypeScript checks for that value. Signals incomplete typing. Tool: ESLint + typescript-eslint (correctness)."
  },
  {
    id: "prettier-last",
    label: "prettierConfig  // LAST — disables formatting rules",
    title: "eslint-config-prettier",
    body: "Not a rule — a config that turns OFF every ESLint rule Prettier already handles (quotes, indent, semi, trailing commas). Without it the two tools fight. Tool: eslint-config-prettier (integration)."
  }
];

var prettierOptions = [
  {
    id: "singleQuote",
    label: '"singleQuote": true',
    title: "singleQuote",
    body: "Prefer single quotes over double quotes. Pure style choice — no correctness implication. Belongs to Prettier, not ESLint."
  },
  {
    id: "trailingComma",
    label: '"trailingComma": "all"',
    title: "trailingComma",
    body: "Add trailing commas after the last item in arrays, objects, and parameter lists. Makes git diffs cleaner. Pure style — Prettier."
  },
  {
    id: "printWidth",
    label: '"printWidth": 100',
    title: "printWidth",
    body: "Wrap lines longer than 100 characters. Prettier uses this as a guide, not a hard limit. Pure layout — Prettier. Do NOT add a max-len rule to ESLint; it would conflict."
  },
  {
    id: "semi",
    label: '"semi": true',
    title: "semi",
    body: "Always print semicolons at statement ends. Prettier owns this. Do NOT add a semi rule to ESLint — eslint-config-prettier already turns it off to prevent conflicts."
  }
];

var allRules = eslintRules.concat(prettierOptions);

function buildList(containerId, rules) {
  var container = document.getElementById(containerId);
  rules.forEach(function(rule) {
    var btn = document.createElement("button");
    btn.className = "rule-btn";
    btn.dataset.id = rule.id;
    btn.textContent = rule.label;
    btn.addEventListener("click", function() {
      document.querySelectorAll(".rule-btn").forEach(function(b) {
        b.classList.remove("active");
      });
      btn.classList.add("active");
      var found = allRules.find(function(r) { return r.id === rule.id; });
      if (found) {
        document.getElementById("detail-title").textContent = found.title;
        document.getElementById("detail-body").textContent = found.body;
      }
    });
    container.appendChild(btn);
  });
}

buildList("eslint-list", eslintRules);
buildList("prettier-list", prettierOptions);`;

  return (
    <div className="space-y-8">

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 1: Hook                                                       */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Card>
        <CardContent className="pt-6">
          <div className="prose dark:prose-invert max-w-none">
            <p>
              Half your team uses tabs. The other half uses spaces. Every PR has 200 whitespace
              changes. Reviews stop noticing real bugs because the diff is ten times bigger than the
              code change. Lint catches likely bugs; format settles whitespace fights. Both stop
              being fights once they&apos;re automated.
            </p>
            <p>
              The trick is that linting and formatting are <em>different jobs</em>. A linter asks
              &quot;is this code wrong?&quot; and has a right answer. A formatter asks &quot;how
              should this code look?&quot; and any consistent answer is fine. Mixing them causes the
              tools to fight each other unless you wire them correctly. This module shows you how to
              configure ESLint and Prettier to stay in their lanes, automate both on every commit,
              and block bad code from reaching CI.
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
              Think of ESLint as a fast code reviewer who knows your team&apos;s rules cold and
              never gets tired. It flags code that is likely wrong — unused variables, unsafe type
              coercions, missing awaits. Think of Prettier as a robot that reformats every file into
              the same shape without asking. It does not know if your code is correct; it only knows
              if the whitespace is canonical. The two tools complement each other perfectly:
              ESLint&apos;s correctness and Prettier&apos;s consistency. The only coordination they
              need is <code>eslint-config-prettier</code>, which tells ESLint to stay out of
              Prettier&apos;s lane.
            </p>
            <blockquote className="border-l-4 border-blue-500 pl-4 italic">
              &quot;Lint catches likely bugs. Format makes whitespace decisions. Never have one tool
              fight the other — and never argue about style with a teammate when a tool can
              decide.&quot;
            </blockquote>
          </div>
        </CardContent>
      </Card>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 3: Step-by-step                                               */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <StepByStepExplanation
        title="ESLint + Prettier without the friction"
        description="Six steps from zero to a fully automated lint and format pipeline"
        steps={eslintPrettierSteps}
      />

      {/* Optional: TerminalPlayground (lint pipeline setup) */}
      <TerminalPlayground
        title="A clean lint pipeline"
        description="Install, configure, and run lint + format on staged files"
        lines={terminalLines}
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 4: Playground                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <HTMLPlayground
        html={playgroundHtml}
        css={playgroundCss}
        js={playgroundJs}
        title="ESLint vs Prettier: who owns which rule?"
        description="Click any rule to learn whether it belongs to ESLint (correctness) or Prettier (style)."
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 5: Challenges                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Challenge
        question="What&apos;s the right division of labor between ESLint and Prettier?"
        options={[
          { id: "a", text: "ESLint formats; Prettier finds bugs." },
          {
            id: "b",
            text: "Prettier formats whitespace and decides quotes/commas; ESLint catches likely bugs (unused vars, missing returns). They&apos;re wired together with eslint-config-prettier so they don&apos;t conflict.",
          },
          { id: "c", text: "Use only ESLint — Prettier is redundant." },
          { id: "d", text: "Use only Prettier — ESLint is redundant." },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            They&apos;re different jobs. Prettier is opinionated and stylistic; ESLint is
            configurable and bug-catching. Trying to pick one tool to do both means losing one job
            — most projects use both, with <code>eslint-config-prettier</code> to silence the
            overlap.
          </>
        }
      />

      <Challenge
        question="You want to enforce &apos;no unused imports&apos; on every commit. Where does that rule belong?"
        options={[
          {
            id: "a",
            text: "ESLint — it&apos;s a code-correctness rule (likely bug).",
          },
          { id: "b", text: "Prettier — it&apos;s a whitespace concern." },
          { id: "c", text: "Husky — pre-commit hooks enforce rules." },
          { id: "d", text: "TypeScript — noUnusedLocals covers it." },
        ]}
        correctAnswerId="a"
        explanation={
          <>
            &quot;No unused imports&quot; is a likely-bug rule, ESLint&apos;s domain (
            <code>@typescript-eslint/no-unused-vars</code> or{" "}
            <code>unused-imports/no-unused-imports</code>). Prettier doesn&apos;t analyze code
            semantics. Husky runs hooks, doesn&apos;t check rules.{" "}
            <code>noUnusedLocals</code> (d) covers some cases but not imports specifically.
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
              "ESLint can format and Prettier can lint a little — but neither is good at the other's job; pick the right tool per concern",
            body: (
              <>
                ESLint has formatting rules (<code>indent</code>, <code>quotes</code>,{" "}
                <code>semi</code>) and Prettier will refuse to format some malformed code. But
                using ESLint as your formatter means losing Prettier&apos;s opinionated consistency,
                and using Prettier as your linter means losing ESLint&apos;s configurable
                correctness checks. Run both. Let each do its job.
              </>
            ),
          },
          {
            title:
              "`eslint-config-prettier` turns off ESLint rules that conflict with Prettier — a one-line install most teams skip and then complain about fighting tools",
            body: (
              <>
                The symptom: you run <code>prettier --write</code> and then <code>eslint --fix</code>{" "}
                and they disagree on quote style. The fix is one dependency and one line in your
                ESLint config: add <code>prettierConfig</code> last in the config array. Without it
                the two tools will cycle indefinitely on auto-fix.
              </>
            ),
          },
          {
            title:
              "Pre-commit hooks that auto-fix can hide problems — run the same lint in CI so a `--no-verify` commit doesn't slip through",
            body: (
              <>
                <code>git commit --no-verify</code> bypasses every pre-commit hook. Any developer
                can do it; tired developers often do. CI is the gate that cannot be bypassed. Your
                pre-commit hook is a fast local shortcut; your CI pipeline is the authoritative
                check. Both must run the same commands.
              </>
            ),
          },
          {
            title:
              "ESLint flat config (`eslint.config.js`) replaced `.eslintrc` in v9 — older blog posts and AI training data still suggest the legacy syntax; verify before copying",
            body: (
              <>
                If a config snippet uses <code>module.exports = {"{}"}</code> or a file named{" "}
                <code>.eslintrc.json</code>, it is the legacy format. ESLint 9+ defaults to flat
                config and will not pick up legacy files automatically. The two formats cannot
                coexist in the same project without the <code>ESLINT_USE_FLAT_CONFIG=false</code>{" "}
                flag, which is a temporary compatibility shim. Prefer the flat format for all new
                projects.
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
            A <em>linter</em> catches likely bugs: unused variables, unsafe coercions, missing
            awaits. Every rule has a right answer. ESLint is configurable so you choose which rules
            to enforce.
          </>,
          <>
            A <em>formatter</em> makes whitespace decisions: indent, quotes, line length, trailing
            commas. No style rule has a &quot;right&quot; answer — only consistency. Prettier is
            opinionated so you don&apos;t have to be.
          </>,
          <>
            <code>eslint-config-prettier</code> disables ESLint rules that Prettier already
            handles. Add it last in your ESLint config array and the two tools stop fighting
            forever.
          </>,
          <>
            A <em>pre-commit hook</em> (husky + lint-staged) runs format and lint only on staged
            files, keeping the hook fast. It is a local convenience — not a security guarantee.
          </>,
          <>
            CI runs the same lint and format check and cannot be skipped with{" "}
            <code>--no-verify</code>. A PR that passes CI is clean regardless of developer setup.
          </>,
          <>
            ESLint v9 uses flat config (<code>eslint.config.js</code> or <code>.mjs</code>): an
            exported array of config objects. Legacy <code>.eslintrc.*</code> files are deprecated;
            copy only from sources that use the new format.
          </>,
        ]}
        mentalModel="Lint catches likely bugs. Format makes whitespace decisions. Never have one tool fight the other — and never argue about style with a teammate when a tool can decide."
      />
    </div>
  );
}
