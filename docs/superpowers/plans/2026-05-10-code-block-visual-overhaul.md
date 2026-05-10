# Code Block Visual Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the unstyled `<pre><code>` block inside `StepByStepExplanation` with a syntax-highlighted, copy-enabled, language-tagged code surface so every module's primary teaching code reads like production documentation rather than a flat blob.

**Architecture:** Extend the existing `CodeBlock` (already wraps `prism-react-renderer`) with a copy button, a language badge, and an optional `language` per `Step`. Wire `StepByStepExplanation` to render `CodeBlock` instead of bare `<pre>`. Add a `language?: string` field to the `Step` type so module authors can tag each snippet; default to a sensible language (`tsx`) when omitted. No content rewrites required — 212 step `code` strings across 33 modules pick up new styling automatically.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind v4, `prism-react-renderer` (already installed), `lucide-react` icons (already installed).

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `components/CodeBlock.tsx` | Modify | Add copy button, language badge, accept `className` for embedding inside other surfaces. Stay backward-compatible with existing call sites. |
| `components/StepByStepExplanation.tsx` | Modify | (a) Fix the `useState`-as-effect bug at line 60; (b) replace the bare `<pre><code>` at lines 135–141 with `<CodeBlock>`; (c) extend `Step` type with `language?: string`. |
| `components/__tests__/CodeBlock.test.tsx` | Create | Smoke-test the copy button and the language badge using React Testing Library. |
| `components/__tests__/StepByStepExplanation.test.tsx` | Create | Smoke-test that step `code` renders through `CodeBlock` (asserts the CodeBlock copy-button is in the document when a step has `code`). |
| `package.json` | Modify | Add `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom` as dev dependencies; add `test` and `test:run` scripts. |
| `vitest.config.ts` | Create | Configure Vitest with jsdom + path alias matching `tsconfig`. |
| `vitest.setup.ts` | Create | Import `@testing-library/jest-dom/vitest`. |
| `tsconfig.json` | Modify | Add Vitest globals to `types`. |

Each task below produces a self-contained commit. Tasks 1–3 are setup; Tasks 4–6 are the visual fix; Task 7 is the bug fix; Task 8 is verification.

---

## Task 1: Add Vitest test infrastructure

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Modify: `tsconfig.json`

- [ ] **Step 1: Install Vitest and Testing Library**

Run:

```bash
npm install --save-dev vitest@^2 @testing-library/react@^16 @testing-library/jest-dom@^6 @testing-library/user-event@^14 jsdom@^25 @vitejs/plugin-react@^4
```

Expected: clean install, no peer-dep errors. (Vitest 2 is compatible with React 19's testing-library 16.)

- [ ] **Step 2: Add `test` and `test:run` scripts to `package.json`**

Edit the `scripts` block of `package.json` to add two scripts after `lint:lang`:

```json
"test": "vitest",
"test:run": "vitest run"
```

The full `scripts` block becomes:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint && node scripts/check-no-vietnamese.mjs",
  "lint:lang": "node scripts/check-no-vietnamese.mjs",
  "test": "vitest",
  "test:run": "vitest run"
}
```

- [ ] **Step 3: Create `vitest.config.ts`**

Create the file at the repo root:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["components/__tests__/**/*.test.tsx"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
```

- [ ] **Step 4: Create `vitest.setup.ts`**

Create the file at the repo root:

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 5: Add Vitest globals to `tsconfig.json`**

Read `tsconfig.json` first, then add `"vitest/globals"` to the `compilerOptions.types` array. If `types` does not exist in `compilerOptions`, add it. Example final fragment of `compilerOptions`:

```json
"types": ["vitest/globals"]
```

Also ensure `vitest.config.ts` and `vitest.setup.ts` are not excluded by the existing `include` / `exclude` blocks. If `tsconfig.json` has a tight `include` array (e.g. `["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"]`), the new files are picked up automatically — no change needed.

- [ ] **Step 6: Verify the test runner boots**

Run:

```bash
npx vitest run --reporter=verbose
```

Expected: `No test files found, exiting with code 1` — but no config errors and no missing-module errors. If it crashes with a config error, fix before proceeding.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vitest.config.ts vitest.setup.ts tsconfig.json
git commit -m "chore(test): add Vitest + Testing Library infrastructure"
```

---

## Task 2: Write the failing CodeBlock tests

**Files:**
- Create: `components/__tests__/CodeBlock.test.tsx`

- [ ] **Step 1: Write the test file**

Create `components/__tests__/CodeBlock.test.tsx`:

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CodeBlock } from "@/components/CodeBlock";

describe("CodeBlock", () => {
  it("renders the code text", () => {
    render(<CodeBlock code={`const x = 1;`} language="javascript" />);
    expect(screen.getByText(/const/)).toBeInTheDocument();
  });

  it("renders the language badge when language is provided", () => {
    render(<CodeBlock code={`const x = 1;`} language="javascript" />);
    expect(screen.getByText("javascript")).toBeInTheDocument();
  });

  it("renders a Copy button with an accessible label", () => {
    render(<CodeBlock code={`const x = 1;`} language="javascript" />);
    expect(
      screen.getByRole("button", { name: /copy code/i })
    ).toBeInTheDocument();
  });

  it("copies the raw (untrimmed) code to the clipboard on click", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    const user = userEvent.setup();
    render(
      <CodeBlock code={`  const x = 1;\n`} language="javascript" />
    );
    await user.click(screen.getByRole("button", { name: /copy code/i }));

    expect(writeText).toHaveBeenCalledWith(`  const x = 1;\n`);
  });

  it("toggles the button label to 'Copied' after a successful copy", async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });

    const user = userEvent.setup();
    render(<CodeBlock code={`const x = 1;`} language="javascript" />);
    await user.click(screen.getByRole("button", { name: /copy code/i }));

    expect(
      await screen.findByRole("button", { name: /copied/i })
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the tests to confirm they fail**

Run:

```bash
npx vitest run components/__tests__/CodeBlock.test.tsx
```

Expected: at minimum the language-badge test, copy-button test, and copy-action test FAIL. Existing `CodeBlock` already renders code text but does not yet show a language badge or a copy button.

- [ ] **Step 3: Commit**

```bash
git add components/__tests__/CodeBlock.test.tsx
git commit -m "test(CodeBlock): add failing tests for copy button and language badge"
```

---

## Task 3: Implement the CodeBlock copy button + language badge

**Files:**
- Modify: `components/CodeBlock.tsx`

- [ ] **Step 1: Replace `components/CodeBlock.tsx` with the upgraded implementation**

Full new contents:

```tsx
"use client";

import { useState } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { Check, Copy } from "lucide-react";

export interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  fileName?: string;
  className?: string;
}

export function CodeBlock({
  code,
  language = "javascript",
  showLineNumbers = true,
  fileName,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard write can fail in insecure contexts; the user sees no toggle.
    }
  };

  return (
    <Highlight theme={themes.vsDark} code={code.trim()} language={language}>
      {({ className: prismClass, style, tokens, getLineProps, getTokenProps }) => (
        <div className={`relative group ${className ?? ""}`}>
          <div className="flex items-center justify-between bg-slate-800 text-slate-300 text-xs px-4 py-2 rounded-t-lg border-b border-slate-700">
            <span className="font-mono lowercase tracking-wide">
              {fileName ?? language}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              aria-label={copied ? "Copied" : "Copy code"}
              className="inline-flex items-center gap-1 px-2 py-1 rounded text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <pre
            className={`${prismClass} overflow-x-auto rounded-b-lg p-4 text-sm leading-relaxed`}
            style={style}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {showLineNumbers && (
                  <span className="inline-block w-8 text-right mr-4 select-none opacity-50">
                    {i + 1}
                  </span>
                )}
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        </div>
      )}
    </Highlight>
  );
}
```

Notes for the engineer:

- `code.trim()` is passed to Prism for rendering, but the unmodified `code` prop is what the copy button writes to the clipboard. The test `copies the raw (untrimmed) code` enforces this distinction.
- The header bar always renders now (previously only when `fileName` was set). If `fileName` is omitted, the language is shown instead — that's the new "language badge."

- [ ] **Step 2: Run the CodeBlock tests to confirm they pass**

Run:

```bash
npx vitest run components/__tests__/CodeBlock.test.tsx
```

Expected: all 5 tests pass.

- [ ] **Step 3: Commit**

```bash
git add components/CodeBlock.tsx
git commit -m "feat(CodeBlock): add copy button and language badge"
```

---

## Task 4: Write the failing StepByStepExplanation test

**Files:**
- Create: `components/__tests__/StepByStepExplanation.test.tsx`

- [ ] **Step 1: Write the test file**

Create `components/__tests__/StepByStepExplanation.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StepByStepExplanation } from "@/components/StepByStepExplanation";

describe("StepByStepExplanation", () => {
  it("renders the title and the first step's title", () => {
    render(
      <StepByStepExplanation
        title="HTTP request lifecycle"
        steps={[
          { title: "Resolve DNS", description: "Find the IP." },
          { title: "Open TCP", description: "Three-way handshake." },
        ]}
      />
    );

    expect(screen.getByText("HTTP request lifecycle")).toBeInTheDocument();
    expect(screen.getByText("Resolve DNS")).toBeInTheDocument();
  });

  it("renders step code through CodeBlock (with copy button) when a step has code", () => {
    render(
      <StepByStepExplanation
        title="HTTP request lifecycle"
        steps={[
          {
            title: "Resolve DNS",
            description: "Find the IP.",
            code: `dig example.com`,
            language: "bash",
          },
        ]}
      />
    );

    expect(
      screen.getByRole("button", { name: /copy code/i })
    ).toBeInTheDocument();
    expect(screen.getByText("bash")).toBeInTheDocument();
  });

  it("does not render a code surface when a step has no code", () => {
    render(
      <StepByStepExplanation
        title="Concept walkthrough"
        steps={[{ title: "Just prose", description: "No code here." }]}
      />
    );

    expect(
      screen.queryByRole("button", { name: /copy code/i })
    ).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to confirm it fails**

Run:

```bash
npx vitest run components/__tests__/StepByStepExplanation.test.tsx
```

Expected: the "renders step code through CodeBlock" test FAILS — current implementation uses bare `<pre><code>`, so there is no `Copy code` button and no `bash` badge.

- [ ] **Step 3: Commit**

```bash
git add components/__tests__/StepByStepExplanation.test.tsx
git commit -m "test(StepByStepExplanation): expect code to render via CodeBlock"
```

---

## Task 5: Wire StepByStepExplanation through CodeBlock and add `language` to `Step`

**Files:**
- Modify: `components/StepByStepExplanation.tsx`

- [ ] **Step 1: Add `language` to the `Step` interface**

Replace the existing `Step` interface (currently lines 10–16) with:

```tsx
export interface Step {
  title: string;
  description: ReactNode;
  code?: string;
  language?: string; // Prism language id; defaults to "tsx"
  highlight?: string; // Code snippet to highlight
  visual?: React.ReactNode; // Custom visual component
}
```

- [ ] **Step 2: Import `CodeBlock`**

Add to the imports at the top of the file (after the `motion, AnimatePresence` import on line 8):

```tsx
import { CodeBlock } from "@/components/CodeBlock";
```

- [ ] **Step 3: Replace the bare `<pre><code>` with `<CodeBlock>`**

Locate the block at lines 134–141:

```tsx
{/* Code snippet */}
{currentStepData.code && (
  <div className="mb-4">
    <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
      <code>{currentStepData.code}</code>
    </pre>
  </div>
)}
```

Replace with:

```tsx
{/* Code snippet */}
{currentStepData.code && (
  <div className="mb-4">
    <CodeBlock
      code={currentStepData.code}
      language={currentStepData.language ?? "tsx"}
      showLineNumbers={false}
    />
  </div>
)}
```

`showLineNumbers={false}` is intentional — step-card snippets are typically short enough that line numbers add visual noise without aiding navigation. The fuller `CodeBlock` (with line numbers) remains available for module-body usage outside the step carousel.

- [ ] **Step 4: Run the StepByStepExplanation tests**

Run:

```bash
npx vitest run components/__tests__/StepByStepExplanation.test.tsx
```

Expected: all 3 tests pass.

- [ ] **Step 5: Run the full test suite to confirm no regressions**

Run:

```bash
npm run test:run
```

Expected: all tests pass (CodeBlock + StepByStepExplanation).

- [ ] **Step 6: Commit**

```bash
git add components/StepByStepExplanation.tsx
git commit -m "feat(StepByStepExplanation): render step code through CodeBlock"
```

---

## Task 6: Visual smoke test in the browser

**Files:**
- None (browser verification only)

- [ ] **Step 1: Start the dev server**

Run:

```bash
npm run dev
```

Expected: `Local: http://localhost:3000` appears within ~5 seconds.

- [ ] **Step 2: Open the Web Components module**

Navigate to `http://localhost:3000/lesson/7-1-web-components` (this is the module shown in the screenshot that prompted this work).

- [ ] **Step 3: Verify each step card**

Click "Next" through all 5–7 steps. For each step that has code, confirm:

- The header bar shows the language (e.g. `tsx`, `javascript`, `html`).
- A `Copy` button is visible in the header bar's right side.
- Keywords (`class`, `extends`, `const`, `function`) are colored.
- Strings are colored differently from keywords.
- Comments (`//`) are visually distinct (italic / dimmed).

- [ ] **Step 4: Verify the copy button works**

Click the `Copy` button on any step. Confirm:

- Label changes to `Copied` with a check icon.
- Label reverts to `Copy` after ~2 seconds.
- Pasting (Ctrl+V) elsewhere produces the exact step code.

- [ ] **Step 5: Spot-check 3 other modules**

Visit:

- `/lesson/3-2-flexbox-and-grid`
- `/lesson/4-3-fetch-and-async`
- `/lesson/5-3-pick-a-framework`

Confirm step code looks correctly highlighted in each. Different languages will appear in the badge (`css`, `javascript`, `tsx`) — that's expected and shows the default fallback works.

- [ ] **Step 6: Stop the dev server**

`Ctrl+C` in the terminal running `npm run dev`.

No commit for this task (verification only). If any of the checks above fail, return to the relevant earlier task and fix.

---

## Task 7: Fix the `useState`-as-effect bug

**Files:**
- Modify: `components/StepByStepExplanation.tsx`

This is the silent runtime bug from the architecture review. The auto-play feature has never worked because `useState` is being used where `useEffect` is intended. Fixing it independently keeps the commit history honest about what each commit does.

- [ ] **Step 1: Add `useEffect` to the React imports**

Locate line 3:

```tsx
import { ReactNode, useState } from "react";
```

Replace with:

```tsx
import { ReactNode, useEffect, useState } from "react";
```

- [ ] **Step 2: Replace the broken `useState` block with `useEffect`**

Locate lines 59–70 (the `// Auto-play effect` block):

```tsx
// Auto-play effect
useState(() => {
  let interval: NodeJS.Timeout;
  if (isPlaying) {
    interval = setInterval(() => {
      handleNext();
    }, autoPlayDelay);
  }
  return () => {
    if (interval) clearInterval(interval);
  };
});
```

Replace with:

```tsx
useEffect(() => {
  if (!isPlaying) return;
  const interval = setInterval(() => {
    setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : 0));
  }, autoPlayDelay);
  return () => clearInterval(interval);
}, [isPlaying, autoPlayDelay, steps.length]);
```

Notes for the engineer:

- The body now uses the functional `setCurrentStep` updater so the effect doesn't need `currentStep` in its dependency array (re-creating the interval on every tick would cause drift).
- Removing the dependency on `handleNext` (which is recreated every render) removes the cause of stale closures had this ever worked.
- `setCurrentStep` is stable across renders, so it does not need to be listed in the dependency array (React's exhaustive-deps lint rule allows omitting setters).

- [ ] **Step 3: Run lint and typecheck**

Run:

```bash
npm run lint
npx tsc --noEmit
```

Expected: zero errors. If `react-hooks/exhaustive-deps` flags the new `useEffect`, the dependency array as written should already satisfy it — re-read the warning carefully before silencing.

- [ ] **Step 4: Manually verify auto-play in the browser**

Run:

```bash
npm run dev
```

Visit any module that passes `autoPlay` to `StepByStepExplanation`. (At time of writing, none of the modules pass `autoPlay`, so this is a future-facing fix. To verify functionally, temporarily edit one module — e.g. `lib/modules/1-1-how-the-internet-works.tsx` — to add `autoPlay autoPlayDelay={1500}` to a `<StepByStepExplanation>`, confirm the steps advance, then revert the edit.)

- [ ] **Step 5: Stop the dev server and commit**

```bash
git add components/StepByStepExplanation.tsx
git commit -m "fix(StepByStepExplanation): replace useState misuse with useEffect for auto-play"
```

---

## Task 8: Final quality gates

**Files:**
- None (verification only)

- [ ] **Step 1: Run lint**

```bash
npm run lint
```

Expected: zero errors.

- [ ] **Step 2: Run typecheck**

```bash
npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 3: Run the test suite**

```bash
npm run test:run
```

Expected: all tests pass.

- [ ] **Step 4: Run a production build**

```bash
npm run build
```

Expected: build succeeds. Watch for any warnings about `prism-react-renderer` SSR — `CodeBlock` is `"use client"`, which is correct.

- [ ] **Step 5: Final visual confirmation in production-ish mode**

```bash
npm run start
```

Visit `/lesson/7-1-web-components` (the module from the original screenshot) and confirm the code blocks now display with syntax colors, language badge, and copy button. This is the screenshot regression check.

`Ctrl+C` to stop.

No commit (verification only). If anything fails, return to the relevant task above.

---

## Out of scope

Documented here so reviewers know these are intentional non-goals for this plan:

- **Tagging `language` on every existing step.** All 212 step `code` strings will fall back to `"tsx"`. That's correct for ~80% of them (React/JS-heavy modules); CSS, HTML, and Bash steps will be slightly mis-highlighted until a future content pass adds `language: "css"` / `"html"` / `"bash"` per step. This plan deliberately does not touch module content — picking up the new styling is automatic; perfect highlighting is a follow-up.
- **Other code surfaces** (`GotchaList` inline `<code>`, prose-level `<code>` in step `description`, `CodeComparison`). They have their own styling story and would balloon this plan. Address in a follow-up if needed.
- **Dark/light theme toggling** of the code block (it's always dark vsDark today). The dashboard does not have a theme toggle yet either — they should be tackled together as Wave C from the review.
- **Renaming the `bg-slate-900` raw class anywhere else.** The bare `<pre>` instance is removed from `StepByStepExplanation.tsx`; if other components still use raw `<pre>`, that's intentional out of scope.

---

## Self-review notes

- **Spec coverage:** the screenshot showed (a) no syntax highlighting, (b) flat heavy navy, (c) no copy button, (d) comment/code same weight. Tasks 3 + 5 address (a), (b), (c). Item (d) is solved by Prism's vsDark theme which dims comments — verified visually in Task 6.
- **The auto-play bug** was flagged in the review but is not strictly part of "fix the ugly code block." It's included as Task 7 because (i) it's a one-line lift in the same file, (ii) leaving it makes the next contributor wonder why an effect is written as `useState`, and (iii) the cost of a separate plan for one line is higher than the cost of bundling.
- **No placeholders.** Every step shows the exact code or command. No "add validation," no "similar to Task N."
- **Type consistency:** `Step.language` is added in Task 5 and consumed in Task 5 only. `CodeBlock`'s new props (`className?`) are added in Task 3 and used in Task 5. No drift.
