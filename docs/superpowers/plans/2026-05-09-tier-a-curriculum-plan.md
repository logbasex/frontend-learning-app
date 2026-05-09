# Tier-A Curriculum Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-author the existing 30-module frontend curriculum from scaffolds to Tier-A comprehensive lessons that teach absolute beginners, with a content-only scope (no deployment work).

**Architecture:** Same Next.js app shell as today. New general-purpose React primitives in `components/` build the Tier-A pedagogy (Hook → Mental model → Step-by-step → Playground → Challenges → Gotchas → Takeaways). One `Module_X_Y_Content()` component per `lib/modules/<id>.tsx` file, registered in `lib/modules/index.ts`, rendered by `app/lesson/[moduleId]/page.tsx`. Module tasks are independent of each other once Wave 0–2 finish.

**Tech Stack:** Next.js 16 / React 19 / TypeScript 5 / Tailwind 4 / shadcn/ui primitives / `@codesandbox/sandpack-react` / `@xyflow/react` / `framer-motion` / `prism-react-renderer` / `lucide-react` / Zustand. **Localhost only — no deployment scope.**

**Specs this plan implements:**
- `docs/superpowers/specs/2026-05-09-tier-a-curriculum-design.md` (the design)
- `docs/superpowers/specs/2026-05-09-concept-catalog.md` (shared vocabulary)
- `docs/superpowers/specs/2026-05-09-learning-outcomes.md` (per-module completeness criteria)

---

## §0. Conventions every task obeys

- **All copy in English.** No Vietnamese, no other language. The lint script (Wave 0) enforces this.
- **Use `"use client"` at the top of every component file** that uses hooks, browser APIs, or interactivity.
- **Use double quotes** in JSX attributes (project convention).
- **Escape `'`, `<`, `>`** in JSX text where required (`&apos;`, `&lt;`, `&gt;`).
- **Strict TypeScript:** no `any`, no unused imports, no unused vars.
- **No comments unless the *why* is non-obvious.** Don't narrate what the code does.
- **No `module` as a local variable name** — Next/ESLint rule `@next/next/no-assign-module-variable`.
- **When receiving a component from a registry**, render it via `React.createElement(Component)` rather than `<Component />` (existing pattern in `app/lesson/[moduleId]/page.tsx`; matches the `react-hooks/static-components` rule).

**Quality gates run after every task:**

```bash
npx tsc --noEmit          # zero errors
npm run lint              # zero errors (includes Vietnamese guard from Wave 0)
npm run build             # succeeds
```

If a task changes a `lib/modules/<id>.tsx` file, **also** smoke-test:

```bash
npm run dev               # runs in background
# open http://localhost:3000/lesson/<id>
# verify all 7 sections render, playground iframe loads, challenges accept answers
```

---

## §1. Wave structure and dispatch rules

The plan executes in **10 waves**. Each wave's tasks may run in parallel via subagent dispatch **within the wave**; waves themselves are sequential.

| Wave | Tasks | Parallel? | Blocks | User review gate? |
|---|---|---|---|---|
| 0 — Cleanup + lint guard | 1 | n/a | Wave 1+ | No |
| 1 — Primitives | 8 | yes | Wave 2+ | No (per-primitive smoke test) |
| 2 — Re-author 1-1 (exemplar) | 1 | n/a | Wave 3+ | **Yes — review before Wave 3** |
| 3 — Phase 2 pilot (4 modules) | 4 | yes | Wave 4+ | **Yes — review for drift before Wave 4** |
| 4 — Phase 1 remainder (3) | 3 | yes | none | No |
| 5 — Phases 3 + 4 (8) | 8 | yes | none | No |
| 6 — Phases 5 + 6 (9) | 9 | yes | none | No |
| 7 — Phase 7 (8) | 8 | yes | none | No |
| 8 — Style review pass | 1 | n/a | Wave 9 | Yes (results inform fixes) |
| 9 — Docs (CLAUDE.md, README) | 1 | n/a | done | No |

**Total: 44 tasks.**

**Subagent dispatch rules (for Waves 3–7):**
1. Each module-authoring task is a self-contained subagent dispatch.
2. The dispatching agent passes the subagent: this plan path, the spec path, the catalog path, the learning-outcomes path, and the path to `lib/modules/1-1-how-the-internet-works.tsx` (the exemplar).
3. The subagent must read the exemplar before authoring.
4. The subagent runs the per-task quality gates (lint / tsc / build / smoke test) before reporting done.
5. The subagent **does not** look at neighboring module files — voice is enforced via the catalog and exemplar, not via cross-pollination (which causes drift).

---

## §2. Task list

### Wave 0 — Cleanup + lint guard

#### Task 1: Strip Vietnamese strings and add a CI grep guard

**Why:** `Challenge.tsx` and `InteractiveDiagram.tsx` contain Vietnamese strings that leak into every module that uses them. Need to be in English before any new authoring.

**Files:**
- Modify: `components/Challenge.tsx`
- Modify: `components/InteractiveDiagram.tsx`
- Create: `scripts/check-no-vietnamese.mjs`
- Modify: `package.json` (add `lint:lang` script and chain it from `lint`)

- [ ] **Step 1: Edit `components/Challenge.tsx` line 124** — replace button text:

```tsx
            Kiểm tra đáp án
```

with

```tsx
            Check answer
```

- [ ] **Step 2: Edit `components/Challenge.tsx` line 136**:

```tsx
                  Chính xác! 🎉
```

with

```tsx
                  Correct! 🎉
```

- [ ] **Step 3: Edit `components/Challenge.tsx` line 141**:

```tsx
                  Chưa đúng, thử lại nhé!
```

with

```tsx
                  Not quite — try again.
```

- [ ] **Step 4: Edit `components/Challenge.tsx` line 149**:

```tsx
                💡 Giải thích:
```

with

```tsx
                💡 Explanation:
```

- [ ] **Step 5: Edit `components/Challenge.tsx` line 156**:

```tsx
              Thử lại
```

with

```tsx
              Try again
```

- [ ] **Step 6: Edit `components/InteractiveDiagram.tsx` line 197**:

```tsx
      description="Quá trình browser xử lý HTML và CSS để hiển thị trang web"
```

with

```tsx
      description="How the browser turns HTML and CSS into pixels on screen"
```

- [ ] **Step 7: Edit `components/InteractiveDiagram.tsx` line 299**:

```tsx
      description="React's Virtual DOM diffing algorithm - chỉ update những phần thay đổi"
```

with

```tsx
      description="React's Virtual DOM diffing algorithm — only the changed parts hit the real DOM"
```

- [ ] **Step 8: Edit `components/InteractiveDiagram.tsx` line 416**:

```tsx
      description="Component composition - Props flow từ trên xuống (unidirectional)"
```

with

```tsx
      description="Component composition — props flow top-down (unidirectional)"
```

- [ ] **Step 9: Create `scripts/check-no-vietnamese.mjs`**:

```js
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const VN_RE = /[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđÀÁẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÈÉẺẼẸÊẾỀỂỄỆÌÍỈĨỊÒÓỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÙÚỦŨỤƯỨỪỬỮỰỲÝỶỸỴĐ]/;
const ROOTS = ["components", "lib", "app"];
const EXTS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".md"]);

let bad = 0;

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const st = statSync(path);
    if (st.isDirectory()) {
      if (name === "node_modules" || name.startsWith(".")) continue;
      walk(path);
      continue;
    }
    if (!EXTS.has(extname(name))) continue;
    const text = readFileSync(path, "utf8");
    const lines = text.split("\n");
    lines.forEach((line, i) => {
      if (VN_RE.test(line)) {
        console.error(`${path}:${i + 1}: ${line.trim()}`);
        bad++;
      }
    });
  }
}

for (const root of ROOTS) {
  try {
    walk(root);
  } catch {
    // root missing is fine
  }
}

if (bad > 0) {
  console.error(`\nFound ${bad} line(s) containing Vietnamese characters. All copy must be in English.`);
  process.exit(1);
}
console.log("Language guard: clean.");
```

- [ ] **Step 10: Modify `package.json` `scripts`**:

Replace:

```json
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
```

with:

```json
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint && node scripts/check-no-vietnamese.mjs",
    "lint:lang": "node scripts/check-no-vietnamese.mjs"
  },
```

- [ ] **Step 11: Run the guard, expect clean**

Run: `npm run lint:lang`
Expected: `Language guard: clean.`

- [ ] **Step 12: Run full lint**

Run: `npm run lint`
Expected: zero errors.

- [ ] **Step 13: Run type check**

Run: `npx tsc --noEmit`
Expected: zero errors.

- [ ] **Step 14: Run build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 15: Commit**

```bash
git add components/Challenge.tsx components/InteractiveDiagram.tsx scripts/check-no-vietnamese.mjs package.json
git commit -m "$(cat <<'EOF'
chore(i18n): strip Vietnamese strings, add lint:lang guard

Translates Challenge button/feedback/explanation text and three
InteractiveDiagram descriptions to English. Adds a node script that
fails the lint pipeline if any Vietnamese character appears under
components/, lib/, or app/. Shipping content authoring in mixed
languages was the largest single source of voice drift.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Wave 1 — Primitives (8 parallel tasks)

Each task creates one general-purpose component plus a `_demos/<name>.tsx` smoke-test page (not registered, not routed; the demo is opened by manually importing it from another file or via a throwaway page). Demo files exist only so a developer can verify the component renders.

#### Task 2: `components/GotchaList.tsx` + demo

**Why:** Section 6 of every Tier-A module is "Things that surprise people." Needs consistent styling.

**Files:**
- Create: `components/GotchaList.tsx`
- Create: `lib/modules/_demos/GotchaList.demo.tsx`

- [ ] **Step 1: Create `components/GotchaList.tsx`**

```tsx
"use client";

import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

export interface Gotcha {
  title: string;
  body: ReactNode;
}

export interface GotchaListProps {
  title?: string;
  items: Gotcha[];
}

export function GotchaList({ title = "Things that surprise people", items }: GotchaListProps) {
  return (
    <Card className="border-amber-200 dark:border-amber-900 bg-amber-50/40 dark:bg-amber-950/10">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Badge className="bg-amber-500 hover:bg-amber-600">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Gotchas
          </Badge>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <ul className="space-y-4">
          {items.map((item, i) => (
            <li key={i} className="border-l-4 border-amber-400 pl-4">
              <p className="font-semibold text-amber-700 dark:text-amber-300 mb-1">{item.title}</p>
              <div className="text-slate-700 dark:text-slate-300 text-sm">{item.body}</div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 2: Create `lib/modules/_demos/GotchaList.demo.tsx`**

```tsx
"use client";

import { GotchaList } from "@/components/GotchaList";

export function GotchaListDemo() {
  return (
    <GotchaList
      items={[
        {
          title: "DNS caches are layered",
          body: <>Your browser, OS, router, and ISP each cache DNS responses. A &quot;wrong&quot; result can be cached for the full TTL at any layer — flush them in order.</>,
        },
        {
          title: "TCP handshake costs an RTT before any data flows",
          body: <>Connection reuse (HTTP keep-alive, HTTP/2 multiplexing) exists because that one round-trip per request adds up.</>,
        },
        {
          title: "TLS doesn&apos;t skip TCP",
          body: <>TLS sits on top of TCP. The handshake order is always TCP first, then TLS, then HTTP.</>,
        },
      ]}
    />
  );
}
```

- [ ] **Step 3: Run quality gates**

```bash
npx tsc --noEmit
npm run lint
```

Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add components/GotchaList.tsx lib/modules/_demos/GotchaList.demo.tsx
git commit -m "feat(components): add GotchaList primitive for module section 6"
```

---

#### Task 3: `components/SequenceDiagram.tsx` + demo

**Why:** Replace hand-positioned ReactFlow diagrams (DNS resolution, OAuth flow, hydration) with a higher-level primitive where authors list actors and messages and layout is automatic.

**Files:**
- Create: `components/SequenceDiagram.tsx`
- Create: `lib/modules/_demos/SequenceDiagram.demo.tsx`

- [ ] **Step 1: Create `components/SequenceDiagram.tsx`**

```tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface SequenceMessage {
  from: string;
  to: string;
  label: string;
  note?: string;
}

export interface SequenceDiagramProps {
  title?: string;
  description?: string;
  actors: string[];
  messages: SequenceMessage[];
}

export function SequenceDiagram({ title, description, actors, messages }: SequenceDiagramProps) {
  const actorIndex = new Map(actors.map((a, i) => [a, i]));
  const colWidth = 160;
  const rowHeight = 56;
  const headerHeight = 60;
  const sideMargin = 40;
  const totalWidth = sideMargin * 2 + (actors.length - 1) * colWidth;
  const totalHeight = headerHeight + messages.length * rowHeight + 20;

  return (
    <Card className="overflow-hidden">
      {(title || description) && (
        <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 border-b">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className="text-xs">Sequence Diagram</Badge>
            {title && <h3 className="font-semibold">{title}</h3>}
          </div>
          {description && <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>}
        </div>
      )}
      <CardContent className="p-4 overflow-x-auto">
        <svg width={totalWidth} height={totalHeight} role="img" aria-label={title ?? "sequence diagram"}>
          {actors.map((actor, i) => {
            const x = sideMargin + i * colWidth;
            return (
              <g key={actor}>
                <rect x={x - 60} y={10} width={120} height={32} rx={6} className="fill-blue-500" />
                <text x={x} y={30} textAnchor="middle" className="fill-white text-sm font-semibold">
                  {actor}
                </text>
                <line x1={x} y1={headerHeight - 8} x2={x} y2={totalHeight - 10} className="stroke-slate-400 dark:stroke-slate-600" strokeDasharray="4 4" />
              </g>
            );
          })}
          {messages.map((msg, i) => {
            const fromX = sideMargin + (actorIndex.get(msg.from) ?? 0) * colWidth;
            const toX = sideMargin + (actorIndex.get(msg.to) ?? 0) * colWidth;
            const y = headerHeight + i * rowHeight + 10;
            const direction = toX > fromX ? 1 : -1;
            return (
              <g key={i}>
                <line x1={fromX} y1={y} x2={toX - 10 * direction} y2={y} className="stroke-slate-700 dark:stroke-slate-200" strokeWidth={1.5} />
                <polygon
                  points={`${toX},${y} ${toX - 10 * direction},${y - 5} ${toX - 10 * direction},${y + 5}`}
                  className="fill-slate-700 dark:fill-slate-200"
                />
                <text x={(fromX + toX) / 2} y={y - 6} textAnchor="middle" className="fill-slate-700 dark:fill-slate-300 text-xs">
                  {msg.label}
                </text>
                {msg.note && (
                  <text x={(fromX + toX) / 2} y={y + 14} textAnchor="middle" className="fill-slate-500 text-[10px] italic">
                    {msg.note}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 2: Create `lib/modules/_demos/SequenceDiagram.demo.tsx`**

```tsx
"use client";

import { SequenceDiagram } from "@/components/SequenceDiagram";

export function SequenceDiagramDemo() {
  return (
    <SequenceDiagram
      title="DNS resolution"
      description="From browser to authoritative nameserver and back"
      actors={["Browser", "Resolver", "Root", "TLD", "Authoritative"]}
      messages={[
        { from: "Browser", to: "Resolver", label: "query roadmap.sh" },
        { from: "Resolver", to: "Root", label: "ask .sh nameservers?" },
        { from: "Root", to: "Resolver", label: "see ns1.nic.sh" },
        { from: "Resolver", to: "TLD", label: "ask roadmap.sh nameservers?" },
        { from: "TLD", to: "Resolver", label: "see ns1.dnsimple.com" },
        { from: "Resolver", to: "Authoritative", label: "A record for roadmap.sh?" },
        { from: "Authoritative", to: "Resolver", label: "76.76.21.21" },
        { from: "Resolver", to: "Browser", label: "76.76.21.21", note: "cached for TTL seconds" },
      ]}
    />
  );
}
```

- [ ] **Step 3: Run quality gates and commit**

```bash
npx tsc --noEmit && npm run lint
git add components/SequenceDiagram.tsx lib/modules/_demos/SequenceDiagram.demo.tsx
git commit -m "feat(components): add SequenceDiagram primitive (auto-layout sequence-of-actors SVG)"
```

---

#### Task 4: `components/LayeredFlow.tsx` + demo

**Why:** Left-to-right or top-to-bottom labeled stages with arrows. Replaces ad-hoc xyflow positioning for pipeline-shaped diagrams (rendering pipeline, build pipeline, dev loop).

**Files:**
- Create: `components/LayeredFlow.tsx`
- Create: `lib/modules/_demos/LayeredFlow.demo.tsx`

- [ ] **Step 1: Create `components/LayeredFlow.tsx`**

```tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface FlowStage {
  label: string;
  detail?: string;
  color?: "blue" | "violet" | "emerald" | "amber" | "rose" | "slate";
}

export interface LayeredFlowProps {
  title?: string;
  description?: string;
  stages: FlowStage[];
  direction?: "horizontal" | "vertical";
}

const COLOR_MAP: Record<NonNullable<FlowStage["color"]>, string> = {
  blue: "bg-blue-500",
  violet: "bg-violet-500",
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
  slate: "bg-slate-500",
};

export function LayeredFlow({ title, description, stages, direction = "horizontal" }: LayeredFlowProps) {
  const isHorizontal = direction === "horizontal";
  return (
    <Card className="overflow-hidden">
      {(title || description) && (
        <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 border-b">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className="text-xs">Flow</Badge>
            {title && <h3 className="font-semibold">{title}</h3>}
          </div>
          {description && <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>}
        </div>
      )}
      <CardContent className="p-6">
        <ol className={isHorizontal ? "flex items-stretch gap-2 overflow-x-auto" : "flex flex-col gap-2"}>
          {stages.map((stage, i) => (
            <li key={i} className={isHorizontal ? "flex items-center gap-2" : "flex flex-col items-center gap-2"}>
              <div className={`${COLOR_MAP[stage.color ?? "blue"]} text-white rounded-lg px-4 py-3 min-w-[140px] shadow-sm`}>
                <div className="font-semibold text-sm">{stage.label}</div>
                {stage.detail && <div className="text-xs opacity-90 mt-1">{stage.detail}</div>}
              </div>
              {i < stages.length - 1 && (
                <span aria-hidden className={`text-slate-400 ${isHorizontal ? "" : "rotate-90"}`}>
                  →
                </span>
              )}
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 2: Create `lib/modules/_demos/LayeredFlow.demo.tsx`**

```tsx
"use client";

import { LayeredFlow } from "@/components/LayeredFlow";

export function LayeredFlowDemo() {
  return (
    <LayeredFlow
      title="Browser rendering pipeline"
      description="What turns HTML/CSS bytes into pixels"
      stages={[
        { label: "Bytes", detail: "from network", color: "slate" },
        { label: "DOM", detail: "parsed HTML tree", color: "blue" },
        { label: "CSSOM", detail: "parsed CSS tree", color: "violet" },
        { label: "Render tree", detail: "DOM ∩ CSSOM", color: "emerald" },
        { label: "Layout", detail: "geometry", color: "amber" },
        { label: "Paint", detail: "pixels per layer", color: "rose" },
        { label: "Composite", detail: "final image", color: "blue" },
      ]}
    />
  );
}
```

- [ ] **Step 3: Run quality gates and commit**

```bash
npx tsc --noEmit && npm run lint
git add components/LayeredFlow.tsx lib/modules/_demos/LayeredFlow.demo.tsx
git commit -m "feat(components): add LayeredFlow primitive for pipeline diagrams"
```

---

#### Task 5: `components/TerminalPlayground.tsx` + demo

**Why:** Modules for Git, npm, and ESLint can't run live in Sandpack. A static `CodeBlock` fails the "learner-does-something" pillar. This primitive plays a fake shell session at realistic speed; the learner can replay it.

**Files:**
- Create: `components/TerminalPlayground.tsx`
- Create: `lib/modules/_demos/TerminalPlayground.demo.tsx`

- [ ] **Step 1: Create `components/TerminalPlayground.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw } from "lucide-react";

export interface TerminalLine {
  command: string;
  output: string;
  delayMs?: number;
}

export interface TerminalPlaygroundProps {
  title?: string;
  description?: string;
  lines: TerminalLine[];
  prompt?: string;
}

export function TerminalPlayground({ title, description, lines, prompt = "$" }: TerminalPlaygroundProps) {
  const [cursor, setCursor] = useState(0);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!running) return;
    if (cursor >= lines.length) {
      setRunning(false);
      return;
    }
    const delay = lines[cursor].delayMs ?? 700;
    timerRef.current = setTimeout(() => setCursor((c) => c + 1), delay);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [cursor, running, lines]);

  const reset = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setCursor(0);
    setRunning(false);
  };

  const play = () => {
    if (cursor >= lines.length) reset();
    setRunning(true);
  };

  return (
    <Card className="overflow-hidden">
      {(title || description) && (
        <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 border-b">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className="text-xs">Terminal</Badge>
            {title && <h3 className="font-semibold">{title}</h3>}
          </div>
          {description && <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>}
        </div>
      )}
      <CardContent className="p-0">
        <div className="bg-slate-950 text-slate-100 p-4 font-mono text-sm min-h-[200px]">
          {lines.slice(0, cursor).map((line, i) => (
            <div key={i} className="mb-3">
              <div>
                <span className="text-emerald-400">{prompt}</span> <span>{line.command}</span>
              </div>
              {line.output && (
                <pre className="whitespace-pre-wrap text-slate-300 mt-1">{line.output}</pre>
              )}
            </div>
          ))}
          {cursor < lines.length && running && (
            <div className="text-slate-500">
              <span className="text-emerald-400">{prompt}</span> <span className="animate-pulse">▍</span>
            </div>
          )}
        </div>
        <div className="flex gap-2 p-3 border-t bg-slate-50 dark:bg-slate-900">
          <Button size="sm" onClick={play} disabled={running && cursor < lines.length}>
            <Play className="w-4 h-4 mr-1" />
            {cursor >= lines.length ? "Replay" : running ? "Running…" : "Play"}
          </Button>
          <Button size="sm" variant="outline" onClick={reset}>
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 2: Create `lib/modules/_demos/TerminalPlayground.demo.tsx`**

```tsx
"use client";

import { TerminalPlayground } from "@/components/TerminalPlayground";

export function TerminalPlaygroundDemo() {
  return (
    <TerminalPlayground
      title="Your first commit"
      description="A complete git init → push session"
      lines={[
        { command: "git init", output: "Initialized empty Git repository in /tmp/demo/.git/" },
        { command: "echo '# demo' > README.md", output: "" },
        { command: "git add README.md", output: "" },
        { command: "git commit -m 'initial'", output: "[main (root-commit) c0ffee] initial\n 1 file changed, 1 insertion(+)" },
        { command: "git log --oneline", output: "c0ffee initial" },
      ]}
    />
  );
}
```

- [ ] **Step 3: Run quality gates and commit**

```bash
npx tsc --noEmit && npm run lint
git add components/TerminalPlayground.tsx lib/modules/_demos/TerminalPlayground.demo.tsx
git commit -m "feat(components): add TerminalPlayground for non-runnable CLI modules"
```

---

#### Task 6: `components/LiveCascadeDemo.tsx` + demo

**Why:** Module 3-1 (CSS fundamentals) needs an interactive specificity resolver. Two CSS rules side-by-side; the component computes specificity numerically and highlights the winner.

**Files:**
- Create: `components/LiveCascadeDemo.tsx`
- Create: `lib/modules/_demos/LiveCascadeDemo.demo.tsx`

- [ ] **Step 1: Create `components/LiveCascadeDemo.tsx`**

```tsx
"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface CascadeRule {
  selector: string;
  declaration: string;
  source: "stylesheet" | "inline" | "important";
}

function specificity(selector: string): [number, number, number, number] {
  const ids = (selector.match(/#[\w-]+/g) ?? []).length;
  const classes = (selector.match(/\.[\w-]+/g) ?? []).length;
  const attrs = (selector.match(/\[[^\]]+\]/g) ?? []).length;
  const pseudoClasses = (selector.match(/:[\w-]+(?!\()/g) ?? []).length;
  const elements = (selector.match(/(^|[\s>+~])([a-z][\w-]*)/gi) ?? []).length;
  return [0, ids, classes + attrs + pseudoClasses, elements];
}

function score([a, b, c, d]: [number, number, number, number]) {
  return a * 1000 + b * 100 + c * 10 + d;
}

export interface LiveCascadeDemoProps {
  title?: string;
  description?: string;
  rules: CascadeRule[];
}

export function LiveCascadeDemo({ title, description, rules }: LiveCascadeDemoProps) {
  const ranked = useMemo(() => {
    return rules
      .map((r, i) => {
        const sp =
          r.source === "important" ? ([1, 0, 0, 0] as [number, number, number, number]) :
          r.source === "inline" ? ([0, 1, 0, 0] as [number, number, number, number]) :
          specificity(r.selector);
        return { ...r, originalIndex: i, sp, score: score(sp) };
      })
      .sort((a, b) => b.score - a.score || b.originalIndex - a.originalIndex);
  }, [rules]);
  const winner = ranked[0];

  return (
    <Card className="overflow-hidden">
      {(title || description) && (
        <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 border-b">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className="text-xs">Cascade Resolver</Badge>
            {title && <h3 className="font-semibold">{title}</h3>}
          </div>
          {description && <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>}
        </div>
      )}
      <CardContent className="p-4 space-y-2">
        {ranked.map((r, i) => {
          const isWinner = r.originalIndex === winner.originalIndex;
          return (
            <div
              key={r.originalIndex}
              className={`flex items-center gap-4 p-3 rounded-md border-2 ${
                isWinner
                  ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/20"
                  : "border-slate-200 dark:border-slate-800"
              }`}
            >
              <code className="font-mono text-sm flex-1">{r.selector} {`{`} {r.declaration} {`}`}</code>
              <span className="text-xs text-slate-500">
                ({r.sp.join(",")})
              </span>
              {isWinner && <Badge className="bg-emerald-500">Winner</Badge>}
              {i === 0 && r.source !== "stylesheet" && (
                <Badge variant="outline" className="text-xs">{r.source}</Badge>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 2: Create `lib/modules/_demos/LiveCascadeDemo.demo.tsx`**

```tsx
"use client";

import { LiveCascadeDemo } from "@/components/LiveCascadeDemo";

export function LiveCascadeDemoExample() {
  return (
    <LiveCascadeDemo
      title="Which rule wins?"
      description="Specificity score is shown as (inline, id, class, element)"
      rules={[
        { selector: "p", declaration: "color: black", source: "stylesheet" },
        { selector: ".lead", declaration: "color: navy", source: "stylesheet" },
        { selector: "#hero p", declaration: "color: crimson", source: "stylesheet" },
        { selector: "p", declaration: "color: orange !important", source: "important" },
      ]}
    />
  );
}
```

- [ ] **Step 3: Run quality gates and commit**

```bash
npx tsc --noEmit && npm run lint
git add components/LiveCascadeDemo.tsx lib/modules/_demos/LiveCascadeDemo.demo.tsx
git commit -m "feat(components): add LiveCascadeDemo for module 3-1 specificity teaching"
```

---

#### Task 7: `components/FlexboxControls.tsx` + demo

**Why:** Module 3-2 needs a controls panel that lets the learner manipulate `justify-content`, `align-items`, `gap`, `flex-wrap` and see the result live.

**Files:**
- Create: `components/FlexboxControls.tsx`
- Create: `lib/modules/_demos/FlexboxControls.demo.tsx`

- [ ] **Step 1: Create `components/FlexboxControls.tsx`**

```tsx
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const JUSTIFY_OPTIONS = ["flex-start", "flex-end", "center", "space-between", "space-around", "space-evenly"] as const;
const ALIGN_OPTIONS = ["stretch", "flex-start", "flex-end", "center", "baseline"] as const;
const WRAP_OPTIONS = ["nowrap", "wrap", "wrap-reverse"] as const;
const DIRECTION_OPTIONS = ["row", "row-reverse", "column", "column-reverse"] as const;

type Justify = (typeof JUSTIFY_OPTIONS)[number];
type Align = (typeof ALIGN_OPTIONS)[number];
type Wrap = (typeof WRAP_OPTIONS)[number];
type Direction = (typeof DIRECTION_OPTIONS)[number];

export interface FlexboxControlsProps {
  title?: string;
  itemCount?: number;
}

export function FlexboxControls({ title = "Flexbox playground", itemCount = 4 }: FlexboxControlsProps) {
  const [justify, setJustify] = useState<Justify>("flex-start");
  const [align, setAlign] = useState<Align>("stretch");
  const [wrap, setWrap] = useState<Wrap>("nowrap");
  const [direction, setDirection] = useState<Direction>("row");
  const [gap, setGap] = useState(8);

  const items = Array.from({ length: itemCount });

  return (
    <Card className="overflow-hidden">
      <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 border-b flex items-center gap-2">
        <Badge variant="secondary" className="text-xs">Flexbox</Badge>
        <h3 className="font-semibold">{title}</h3>
      </div>
      <CardContent className="p-4 grid md:grid-cols-2 gap-4">
        <div>
          <div
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-md p-2 min-h-[200px]"
            style={{
              display: "flex",
              flexDirection: direction,
              justifyContent: justify,
              alignItems: align,
              flexWrap: wrap,
              gap: `${gap}px`,
            }}
          >
            {items.map((_, i) => (
              <div key={i} className="bg-blue-500 text-white px-3 py-2 rounded">
                {i + 1}
              </div>
            ))}
          </div>
          <pre className="mt-3 text-xs bg-slate-900 text-slate-100 p-3 rounded">{`display: flex;
flex-direction: ${direction};
justify-content: ${justify};
align-items: ${align};
flex-wrap: ${wrap};
gap: ${gap}px;`}</pre>
        </div>
        <div className="space-y-3 text-sm">
          <Selector label="flex-direction" options={DIRECTION_OPTIONS} value={direction} onChange={(v) => setDirection(v as Direction)} />
          <Selector label="justify-content" options={JUSTIFY_OPTIONS} value={justify} onChange={(v) => setJustify(v as Justify)} />
          <Selector label="align-items" options={ALIGN_OPTIONS} value={align} onChange={(v) => setAlign(v as Align)} />
          <Selector label="flex-wrap" options={WRAP_OPTIONS} value={wrap} onChange={(v) => setWrap(v as Wrap)} />
          <label className="block">
            <span className="font-mono text-xs">gap (px)</span>
            <input
              type="range"
              min={0}
              max={48}
              value={gap}
              onChange={(e) => setGap(Number(e.target.value))}
              className="w-full"
            />
            <span className="text-xs text-slate-500">{gap}px</span>
          </label>
        </div>
      </CardContent>
    </Card>
  );
}

function Selector<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <label className="block">
      <span className="font-mono text-xs">{label}</span>
      <select
        className="w-full border rounded px-2 py-1 mt-1 bg-white dark:bg-slate-900"
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}
```

- [ ] **Step 2: Create `lib/modules/_demos/FlexboxControls.demo.tsx`**

```tsx
"use client";

import { FlexboxControls } from "@/components/FlexboxControls";

export function FlexboxControlsDemo() {
  return <FlexboxControls itemCount={5} />;
}
```

- [ ] **Step 3: Run quality gates and commit**

```bash
npx tsc --noEmit && npm run lint
git add components/FlexboxControls.tsx lib/modules/_demos/FlexboxControls.demo.tsx
git commit -m "feat(components): add FlexboxControls interactive playground"
```

---

#### Task 8: `components/GridControls.tsx` + demo

**Why:** Mirror of FlexboxControls for CSS Grid. Module 3-2 uses both.

**Files:**
- Create: `components/GridControls.tsx`
- Create: `lib/modules/_demos/GridControls.demo.tsx`

- [ ] **Step 1: Create `components/GridControls.tsx`**

```tsx
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const TEMPLATES = [
  "1fr 1fr 1fr",
  "200px 1fr",
  "1fr 2fr 1fr",
  "repeat(4, 1fr)",
  "repeat(auto-fit, minmax(120px, 1fr))",
] as const;

const PLACE_OPTIONS = ["stretch", "start", "center", "end"] as const;
type Place = (typeof PLACE_OPTIONS)[number];

export interface GridControlsProps {
  title?: string;
  itemCount?: number;
}

export function GridControls({ title = "Grid playground", itemCount = 6 }: GridControlsProps) {
  const [template, setTemplate] = useState<string>(TEMPLATES[0]);
  const [gap, setGap] = useState(8);
  const [placeItems, setPlaceItems] = useState<Place>("stretch");

  const items = Array.from({ length: itemCount });

  return (
    <Card className="overflow-hidden">
      <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 border-b flex items-center gap-2">
        <Badge variant="secondary" className="text-xs">Grid</Badge>
        <h3 className="font-semibold">{title}</h3>
      </div>
      <CardContent className="p-4 grid md:grid-cols-2 gap-4">
        <div>
          <div
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-md p-2 min-h-[220px]"
            style={{
              display: "grid",
              gridTemplateColumns: template,
              gap: `${gap}px`,
              placeItems,
            }}
          >
            {items.map((_, i) => (
              <div key={i} className="bg-violet-500 text-white px-3 py-2 rounded text-center">
                {i + 1}
              </div>
            ))}
          </div>
          <pre className="mt-3 text-xs bg-slate-900 text-slate-100 p-3 rounded">{`display: grid;
grid-template-columns: ${template};
gap: ${gap}px;
place-items: ${placeItems};`}</pre>
        </div>
        <div className="space-y-3 text-sm">
          <label className="block">
            <span className="font-mono text-xs">grid-template-columns</span>
            <select
              className="w-full border rounded px-2 py-1 mt-1 bg-white dark:bg-slate-900"
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
            >
              {TEMPLATES.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="font-mono text-xs">place-items</span>
            <select
              className="w-full border rounded px-2 py-1 mt-1 bg-white dark:bg-slate-900"
              value={placeItems}
              onChange={(e) => setPlaceItems(e.target.value as Place)}
            >
              {PLACE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="font-mono text-xs">gap (px)</span>
            <input
              type="range"
              min={0}
              max={48}
              value={gap}
              onChange={(e) => setGap(Number(e.target.value))}
              className="w-full"
            />
            <span className="text-xs text-slate-500">{gap}px</span>
          </label>
        </div>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 2: Create `lib/modules/_demos/GridControls.demo.tsx`**

```tsx
"use client";

import { GridControls } from "@/components/GridControls";

export function GridControlsDemo() {
  return <GridControls itemCount={8} />;
}
```

- [ ] **Step 3: Run quality gates and commit**

```bash
npx tsc --noEmit && npm run lint
git add components/GridControls.tsx lib/modules/_demos/GridControls.demo.tsx
git commit -m "feat(components): add GridControls interactive playground"
```

---

#### Task 9: `components/EventLoopVisualizer.tsx` + demo

**Why:** Modules 4-2 and 4-3 need to visualize the call stack, macrotask queue, and microtask queue stepping through user-supplied code. The author scripts the timing as a list of frames.

**Files:**
- Create: `components/EventLoopVisualizer.tsx`
- Create: `lib/modules/_demos/EventLoopVisualizer.demo.tsx`

- [ ] **Step 1: Create `components/EventLoopVisualizer.tsx`**

```tsx
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

export interface EventLoopFrame {
  description: string;
  callStack: string[];
  macrotaskQueue: string[];
  microtaskQueue: string[];
  consoleLog?: string[];
}

export interface EventLoopVisualizerProps {
  title?: string;
  code: string;
  frames: EventLoopFrame[];
}

export function EventLoopVisualizer({ title = "Event loop trace", code, frames }: EventLoopVisualizerProps) {
  const [i, setI] = useState(0);
  const f = frames[i];

  return (
    <Card className="overflow-hidden">
      <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 border-b flex items-center gap-2">
        <Badge variant="secondary" className="text-xs">Event Loop</Badge>
        <h3 className="font-semibold">{title}</h3>
      </div>
      <CardContent className="p-4 space-y-4">
        <pre className="bg-slate-900 text-slate-100 p-3 rounded text-xs overflow-x-auto">{code}</pre>

        <div className="text-sm font-medium">
          Frame {i + 1} of {frames.length}: <span className="text-blue-600 dark:text-blue-400">{f.description}</span>
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          <Pane label="Call stack" items={f.callStack} color="bg-blue-100 dark:bg-blue-950/40" />
          <Pane label="Microtask queue" items={f.microtaskQueue} color="bg-violet-100 dark:bg-violet-950/40" />
          <Pane label="Macrotask queue" items={f.macrotaskQueue} color="bg-amber-100 dark:bg-amber-950/40" />
        </div>

        {f.consoleLog && f.consoleLog.length > 0 && (
          <div>
            <div className="text-xs font-medium mb-1">Console</div>
            <pre className="bg-slate-950 text-emerald-300 p-2 rounded text-xs">
              {f.consoleLog.map((line, idx) => `> ${line}\n`).join("")}
            </pre>
          </div>
        )}

        <div className="flex items-center justify-between">
          <Button size="sm" variant="outline" onClick={() => setI((v) => Math.max(0, v - 1))} disabled={i === 0}>
            <ChevronLeft className="w-4 h-4 mr-1" /> Previous
          </Button>
          <Button size="sm" variant="outline" onClick={() => setI(0)}>
            <RotateCcw className="w-4 h-4 mr-1" /> Reset
          </Button>
          <Button size="sm" onClick={() => setI((v) => Math.min(frames.length - 1, v + 1))} disabled={i === frames.length - 1}>
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Pane({ label, items, color }: { label: string; items: string[]; color: string }) {
  return (
    <div className="border rounded p-2">
      <div className="text-xs font-medium mb-2">{label}</div>
      <div className={`${color} rounded min-h-[120px] p-2 space-y-1`}>
        {items.length === 0 ? (
          <div className="text-xs text-slate-500 italic">empty</div>
        ) : (
          items.map((item, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 px-2 py-1 rounded text-xs font-mono">
              {item}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `lib/modules/_demos/EventLoopVisualizer.demo.tsx`**

```tsx
"use client";

import { EventLoopVisualizer } from "@/components/EventLoopVisualizer";

export function EventLoopVisualizerDemo() {
  return (
    <EventLoopVisualizer
      title="setTimeout vs Promise — order"
      code={`console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");`}
      frames={[
        { description: "Initial — main script enters call stack", callStack: ["<script>"], macrotaskQueue: [], microtaskQueue: [], consoleLog: [] },
        { description: "console.log('A') runs", callStack: ["<script>"], macrotaskQueue: [], microtaskQueue: [], consoleLog: ["A"] },
        { description: "setTimeout schedules a macrotask", callStack: ["<script>"], macrotaskQueue: ["() => console.log('B')"], microtaskQueue: [], consoleLog: ["A"] },
        { description: "Promise.resolve().then schedules a microtask", callStack: ["<script>"], macrotaskQueue: ["() => console.log('B')"], microtaskQueue: ["() => console.log('C')"], consoleLog: ["A"] },
        { description: "console.log('D') runs", callStack: ["<script>"], macrotaskQueue: ["() => console.log('B')"], microtaskQueue: ["() => console.log('C')"], consoleLog: ["A", "D"] },
        { description: "Script ends; microtask queue drains first", callStack: [], macrotaskQueue: ["() => console.log('B')"], microtaskQueue: ["() => console.log('C')"], consoleLog: ["A", "D"] },
        { description: "Microtask runs — log 'C'", callStack: [], macrotaskQueue: ["() => console.log('B')"], microtaskQueue: [], consoleLog: ["A", "D", "C"] },
        { description: "Macrotask runs — log 'B'", callStack: [], macrotaskQueue: [], microtaskQueue: [], consoleLog: ["A", "D", "C", "B"] },
      ]}
    />
  );
}
```

- [ ] **Step 3: Run quality gates and commit**

```bash
npx tsc --noEmit && npm run lint
git add components/EventLoopVisualizer.tsx lib/modules/_demos/EventLoopVisualizer.demo.tsx
git commit -m "feat(components): add EventLoopVisualizer for modules 4-2 / 4-3"
```

---

### Wave 2 — Re-author the gold standard

#### Task 10: Re-author `lib/modules/1-1-how-the-internet-works.tsx` to Tier-A

**Why:** This module is the **structural exemplar** every later subagent will study. Get it right; the rest follow.

**Files:**
- Modify: `lib/modules/1-1-how-the-internet-works.tsx` (full rewrite)
- Modify: `lib/curriculum.ts` (3 retitles + soft-prereq comment, see Task 10b)
- Modify: `lib/progress.ts` (no behavior change in this task)
- Modify: `app/page.tsx` (replace lock UI with soft-recommendation badge)

**Section 7 of the spec defines the learning outcomes for `1-1`:**

> After this module the learner can:
> - [recall] State what DNS, TCP, TLS, and HTTP each do, in one sentence each.
> - [recall] Name the three messages of the TCP three-way handshake.
> - [apply] Read a `dig +trace` output and identify which step of resolution succeeded.
> - [judge] Choose between A and AAAA for a given scenario.
> - [debug] Given a "site won't load" symptom, name three diagnostic checks (DNS, TCP, TLS) in the right order.

- [ ] **Step 1: Rewrite `lib/modules/1-1-how-the-internet-works.tsx`** to render exactly the 7 sections from the spec (§2.1):

The component must:

1. **Hook section (Card with prose, 1–2 paragraphs):**
   - Open with a felt tension. Suggested opener: *"You type `roadmap.sh`, hit Enter, and the page appears. Looks instant. It isn't."*
   - End the hook with a sentence that promises what the module will deliver.

2. **Mental model first (Card with prose ending in a pull-quote):**
   - One paragraph stating the layered-postal-service model.
   - End with the pull-quote (boxed/italicized): *"The internet is a layered postal service: DNS finds the address, TCP delivers reliably, HTTPS seals the envelope, HTTP is the letter inside."*

3. **Step-by-step exposition** (`StepByStepExplanation`) — 6 steps. Use the existing 6 steps from the current file as a starting point (they're in good shape) but **trim each `description` to 3–5 sentences** (currently several are 6+) and ensure every step has a `code` snippet.

4. **Live playground** (`HTMLPlayground`):
   - Three buttons that `fetch()` `https://httpbin.org/get`, `https://httpbin.org/headers`, `https://httpbin.org/ip`.
   - Output appended into a `<pre>`.
   - **Add a `// Try this:` comment** at the top of the JS source: *"// Try this: open DevTools → Network, click a button, then change `'GET'` to `'POST'` and watch the request fail with a 405."*

5. **Sequence diagram** (`SequenceDiagram` from Wave 1 — replaces the existing 9-node ReactFlow that lives in this file today):
   - Actors: `["Browser", "Resolver", "Root", "TLD", "Authoritative", "Server"]`.
   - Messages cover: Browser → Resolver query, Resolver walking root → TLD → Authoritative, Authoritative returning A record, Resolver returning IP to Browser, Browser opening TCP/TLS to Server.

6. **Two `Challenge` components** (keep the current questions; both are good):
   - Q1: "What is DNS' job in one sentence?" — correct: "Translate human-readable names into IP addresses."
   - Q2: "Why does HTTPS need a TLS handshake?" — correct: "To agree on encryption keys and verify the server's identity."

7. **`GotchaList`** with 4 entries:
   - "DNS caches are layered" — browser, OS, router, ISP. A wrong record can be cached for the full TTL at any layer.
   - "TCP handshake costs an RTT before any data flows" — connection reuse exists for this reason.
   - "TLS doesn't skip TCP" — the order is always TCP first, then TLS, then HTTP.
   - "HTTPS isn't end-to-end secrecy from the browser to the database" — TLS terminates at the server's load balancer; from there, secrecy depends on the server's own architecture.

8. **`KeyTakeaways`** with 5 points and the same mental-model pull-quote restated.

9. **`RoadmapLink`** to `https://roadmap.sh/frontend` placed below the hook (existing pattern).

The full file structure (skeleton only — actual content per the rules above):

```tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { HTMLPlayground } from "@/components/CodePlayground";
import { StepByStepExplanation, Step } from "@/components/StepByStepExplanation";
import { SequenceDiagram } from "@/components/SequenceDiagram";
import { Challenge } from "@/components/Challenge";
import { GotchaList } from "@/components/GotchaList";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { RoadmapLink } from "@/components/RoadmapLink";

export function Module_1_1_Content() {
  const steps: Step[] = [ /* 6 steps as described above */ ];
  const playgroundHtml = ` ... `;
  const playgroundCss = ` ... `;
  const playgroundJs = `// Try this: open DevTools → Network, click a button, then change 'GET' to 'POST' and watch the request fail with a 405.\n ... `;

  return (
    <div className="space-y-8">
      {/* 1. Hook */}
      <Card>
        <CardContent className="pt-6">
          <div className="prose dark:prose-invert max-w-none">
            <h2>🌍 200 milliseconds of magic</h2>
            { /* hook prose */ }
          </div>
          <div className="mt-4">
            <RoadmapLink url="https://roadmap.sh/frontend" />
          </div>
        </CardContent>
      </Card>

      {/* 2. Mental model first */}
      <Card>
        <CardContent className="pt-6">
          <div className="prose dark:prose-invert max-w-none">
            <h3>The model: a layered postal service</h3>
            { /* one paragraph */ }
            <blockquote className="border-l-4 border-blue-500 pl-4 italic">
              The internet is a layered postal service: DNS finds the address, TCP delivers reliably, HTTPS seals the envelope, HTTP is the letter inside.
            </blockquote>
          </div>
        </CardContent>
      </Card>

      {/* 3. Step-by-step */}
      <StepByStepExplanation title="From URL to pixels" description="..." steps={steps} />

      {/* 4. Playground */}
      <HTMLPlayground html={playgroundHtml} css={playgroundCss} js={playgroundJs} title="Watch a real HTTP exchange" description="Open DevTools → Network and click the buttons. Each button is one HTTP request." />

      {/* 5. Sequence diagram */}
      <SequenceDiagram
        title="DNS resolution"
        description="From browser to authoritative nameserver and back"
        actors={["Browser", "Resolver", "Root", "TLD", "Authoritative", "Server"]}
        messages={[ /* 8 messages as described */ ]}
      />

      {/* 6. Challenges */}
      <Challenge question="..." options={[]} correctAnswerId="b" explanation={<>...</>} />
      <Challenge question="..." options={[]} correctAnswerId="c" explanation={<>...</>} />

      {/* 7. Gotchas */}
      <GotchaList items={[ /* 4 entries as described */ ]} />

      {/* 8. Takeaways */}
      <KeyTakeaways
        points={[ /* 5 points */ ]}
        mentalModel="The internet is a layered postal service: DNS finds the address, TCP delivers reliably, HTTPS seals the envelope, HTTP is the letter inside."
      />
    </div>
  );
}
```

The author **must consult `docs/superpowers/specs/2026-05-09-concept-catalog.md`** for canonical one-line definitions of: DNS, TCP, TCP three-way handshake, RTT, TLS, TLS handshake, HTTP, HTTPS. Use the catalog phrasing when introducing each.

- [ ] **Step 2: Confirm the file imports compile**

Run: `npx tsc --noEmit`
Expected: zero errors.

- [ ] **Step 3: Run lint**

Run: `npm run lint`
Expected: zero errors (lang guard included).

- [ ] **Step 4: Smoke test**

Run: `npm run dev` (in background) and open `http://localhost:3000/lesson/1-1-how-the-internet-works`.
Expected: all 7 sections render. Playground iframes load. Both challenges accept answers and show explanations. GotchaList shows 4 entries. No console errors.

- [ ] **Step 5: Commit**

```bash
git add lib/modules/1-1-how-the-internet-works.tsx
git commit -m "feat(modules): re-author 1-1 to Tier-A as the structural exemplar"
```

#### Task 10b: Soft prerequisites — replace lock with recommendation

**Files:**
- Modify: `lib/curriculum.ts` (3 retitles)
- Modify: `app/page.tsx` (lock UI → soft recommendation)

- [ ] **Step 1: Edit `lib/curriculum.ts` — three retitles**

Find module `3-4-writing-css-modern` (line ~316–338). Replace `title` and `description`:

```ts
        id: "3-4-writing-css-modern",
        title: "Tailwind CSS",
        description: "Utility-first CSS, in depth — alternatives mentioned at the end",
```

Find module `5-3-pick-a-framework` (line ~500–522). Replace:

```ts
        id: "5-3-pick-a-framework",
        title: "React Fundamentals",
        description: "Components, state, JSX, hooks — alternatives mentioned at the end",
```

Find module `6-2-module-bundlers` (line ~580–602). Replace:

```ts
        id: "6-2-module-bundlers",
        title: "Vite & the Dev Loop",
        description: "Modern dev server + bundler in depth — alternatives mentioned at the end",
```

Leave the IDs and prerequisites chains unchanged.

- [ ] **Step 2: Edit `app/page.tsx` — replace `Lock` UI with soft recommendation**

Replace lines around 130–192 (the module card render):

```tsx
                      const isCompleted = completedModules.includes(module.id);
                      const isUnlocked = module.prerequisites.every((prereq) =>
                        completedModules.includes(prereq)
                      ) || module.prerequisites.length === 0;

                      return (
                        <Link
                          key={module.id}
                          href={isUnlocked ? `/lesson/${module.id}` : "#"}
                          className={`block ${!isUnlocked && "pointer-events-none opacity-60"}`}
                        >
```

with:

```tsx
                      const isCompleted = completedModules.includes(module.id);
                      const recommendedPrereqs = module.prerequisites.filter(
                        (p) => !completedModules.includes(p)
                      );
                      const hasRecommended = recommendedPrereqs.length > 0;

                      return (
                        <Link
                          key={module.id}
                          href={`/lesson/${module.id}`}
                          className="block"
                        >
```

Then in the same JSX block, find and replace this section (the lock + "Complete previous module to unlock" text):

```tsx
                                  {!isUnlocked && <Lock className="w-4 h-4 text-slate-400" />}
```

with (remove the lock entirely — leave only the completed check):

```tsx
```

(empty — the line is deleted)

And replace the trailing block:

```tsx
                              {isUnlocked && (
                                <Button className="w-full mt-4" variant={isCompleted ? "secondary" : "default"}>
                                  {isCompleted ? "Review" : "Start Learning"}
                                </Button>
                              )}

                              {!isUnlocked && (
                                <div className="mt-4 p-2 bg-slate-100 dark:bg-slate-800 rounded text-sm text-slate-600 dark:text-slate-400 text-center">
                                  Complete previous module to unlock
                                </div>
                              )}
```

with:

```tsx
                              <Button className="w-full mt-4" variant={isCompleted ? "secondary" : "default"}>
                                {isCompleted ? "Review" : "Start Learning"}
                              </Button>

                              {hasRecommended && !isCompleted && (
                                <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 text-center">
                                  Recommended first: {recommendedPrereqs.length} earlier module{recommendedPrereqs.length === 1 ? "" : "s"}
                                </div>
                              )}
```

Finally, **remove `Lock` from the lucide-react import** at the top of the file (line 10) since it's no longer used.

- [ ] **Step 3: Edit `lib/progress.ts` — `isModuleUnlocked` becomes a no-op**

There is no `isModuleUnlocked` exported from `lib/progress.ts`; the helper lives in `lib/curriculum.ts`. Edit `lib/curriculum.ts`'s `isModuleUnlocked` (around line 905):

Replace:

```ts
export function isModuleUnlocked(moduleId: string, completedModules: string[]): boolean {
  const m = getModuleById(moduleId);
  if (!m) return false;
  return m.prerequisites.every((p) => completedModules.includes(p));
}
```

with:

```ts
export function isModuleUnlocked(_moduleId: string, _completedModules: string[]): boolean {
  return true;
}
```

(The function is kept exported so any caller still compiles. Soft prerequisites are surfaced via `module.prerequisites` directly in the UI.)

- [ ] **Step 4: Quality gates**

```bash
npx tsc --noEmit
npm run lint
npm run build
```

Expected: all clean.

- [ ] **Step 5: Smoke test**

Run: `npm run dev` (background) → `http://localhost:3000`.
Expected: dashboard renders 7 phase cards and 30 module tiles. Tiles for modules with un-completed prerequisites show "Recommended first: N earlier modules" instead of a lock. Every tile is clickable.

- [ ] **Step 6: Commit**

```bash
git add lib/curriculum.ts app/page.tsx
git commit -m "feat(curriculum): retitle 3 modules; soft prereqs (no more locks)"
```

---

### USER REVIEW GATE — after Wave 2

> After Tasks 10 and 10b: the user opens `http://localhost:3000/lesson/1-1-how-the-internet-works` and reads it end-to-end. Confirms voice, pacing, and section ordering match intent. **Wave 3 may not start until the user signs off.** If the user requests changes, fix and commit before Wave 3.

---

### Wave 3 — Phase 2 pilot (4 parallel tasks)

Each Wave-3 task is a **subagent dispatch**. The subagent receives:

1. This plan path.
2. The spec path: `docs/superpowers/specs/2026-05-09-tier-a-curriculum-design.md`.
3. The catalog path: `docs/superpowers/specs/2026-05-09-concept-catalog.md`.
4. The outcomes path: `docs/superpowers/specs/2026-05-09-learning-outcomes.md`.
5. The exemplar path: `lib/modules/1-1-how-the-internet-works.tsx`.

The subagent's prompt is the per-task brief below.

#### Task 11: Re-author `lib/modules/2-1-html-basics-and-semantics.tsx`

**Brief for subagent:**

> Re-author `lib/modules/2-1-html-basics-and-semantics.tsx` to Tier-A. Read the spec, catalog, outcomes, and exemplar first. Match the exemplar's section ordering and prose density.
>
> **Learning outcomes** (from `learning-outcomes.md` `2-1`):
> - [recall] List the main semantic landmark elements.
> - [apply] Rewrite a `<div>`-soup snippet using semantic elements.
> - [judge] Choose between `<section>`, `<article>`, and `<aside>` for a given block.
> - [build] Construct a valid document outline for a blog post.
> - [debug] Spot a heading-level skip in an existing page and propose a fix.
>
> **Required sections** (in order):
> 1. **Hook** — A real-feeling opener like "Open the average legacy site's DOM and you'll see 200 nested `<div>`s. To a screen reader, they all read as nothing."
> 2. **Mental model** — *HTML is a meaning tree. CSS is the appearance layer.* End with that pull-quote.
> 3. **Step-by-step** — 5–7 steps. Suggested: (a) `<div>` soup, (b) the landmark elements, (c) headings as document outline, (d) lists vs. paragraphs, (e) `<article>` vs `<section>` vs `<aside>` decision tree, (f) why screen readers care.
> 4. **Playground** — `HTMLPlayground` showing the same blog header twice — div-soup vs semantic — both styled identically. **Include a `<!-- Try this: -->` HTML comment** at the top suggesting "remove all the semantic elements one by one and watch the document outline collapse."
> 5. **Challenges** — 2 challenges. Suggested:
>    - "A page has a sidebar with 'Related articles' links. Best wrapper?" (Correct: `<aside>`)
>    - "Which heading sequence is correct for a blog post with two subsections, each with two sub-subsections?" (Correct: h1 → h2 → h3 → h3 → h2 → h3 → h3)
> 6. **GotchaList** — 4 entries:
>    - "Multiple `<h1>` per page is fine in HTML5 outline mode but most tools still expect one"
>    - "`<section>` without a heading is invisible to the outline"
>    - "`<article>` is for self-contained content, *including* a forum comment"
>    - "Visual order ≠ DOM order — flexbox `order` and CSS Grid placement do not change the document outline"
> 7. **KeyTakeaways** — 4–6 bullets, restate the mental model.
>
> Use the **concept catalog** for: HTML, semantic HTML, document outline, ARIA. Italicize on first use.
>
> When done, run `npx tsc --noEmit && npm run lint && npm run build`. All must pass. Smoke test at `/lesson/2-1-html-basics-and-semantics`. Commit:
> ```bash
> git add lib/modules/2-1-html-basics-and-semantics.tsx
> git commit -m "feat(modules): re-author 2-1 (HTML semantics) to Tier-A"
> ```

- [ ] **Step 1: Dispatch subagent with the brief above**
- [ ] **Step 2: Verify task output meets the rubric (§8 of spec)**
- [ ] **Step 3: If rubric fails, request revision; otherwise proceed**

#### Task 12: Re-author `lib/modules/2-2-forms-and-validation.tsx`

**Brief for subagent:**

> Re-author `lib/modules/2-2-forms-and-validation.tsx` to Tier-A. Same protocol as Task 11.
>
> **Learning outcomes:**
> - [recall] State three ways to associate a `<label>` with an `<input>`.
> - [apply] Use `required`, `pattern`, and `type="email"` to drive native validation.
> - [build] Construct an accessible login form from scratch.
> - [judge] Decide when to fall back from native validation to custom JS validation.
> - [debug] Identify why a screen reader reads "edit text" instead of the field label.
>
> **Sections:**
> 1. Hook — "Most JS form-validation libraries reimplement what the browser already ships, badly." (or similar felt tension)
> 2. Mental model — *The browser ships a validation engine. Use it before reaching for JavaScript.* (pull-quote)
> 3. Step-by-step — 6 steps: (a) the three label associations (`for`/wrap/`aria-labelledby`), (b) `required`, (c) `type=` attributes, (d) `pattern` regex, (e) `:invalid` styling and `novalidate`, (f) error messaging with `setCustomValidity`.
> 4. Playground — `HTMLPlayground` with a signup form using all of `required`, `type="email"`, `pattern`, and `:invalid` styling. `<!-- Try this: -->` comment: "submit with empty fields and watch the browser's native error UI; then add `novalidate` to the form and watch what changes."
> 5. Challenges — 2:
>    - "Which of these is **not** a valid label-input association?" — wrap, `for=`, `aria-labelledby`, putting them next to each other (correct: the last)
>    - "When should you reach for JS validation over native?" — multiple choice with "cross-field constraints" as correct
> 6. GotchaList — 4 entries:
>    - "`required` only blocks submit — the form still mounts in a 'pristine invalid' state until the user touches a field"
>    - "`type=email` accepts `a@b` (no TLD required)"
>    - "`:invalid` matches before any user input — use `:user-invalid` (where supported) or pair with `:placeholder-shown`"
>    - "`<input type=number>` discards the field's value if the user types `1.5e10` — beware locale and scientific notation"
> 7. KeyTakeaways — restate the model.
>
> Catalog terms: form, input, label association, native form validation. Italicize on first use.
>
> Quality gates → smoke test → commit:
> ```bash
> git add lib/modules/2-2-forms-and-validation.tsx
> git commit -m "feat(modules): re-author 2-2 (Forms & validation) to Tier-A"
> ```

- [ ] **Step 1: Dispatch subagent**
- [ ] **Step 2: Verify rubric**
- [ ] **Step 3: Iterate or accept**

#### Task 13: Re-author `lib/modules/2-3-accessibility.tsx`

**Brief for subagent:**

> Re-author `lib/modules/2-3-accessibility.tsx` to Tier-A. Same protocol.
>
> **Learning outcomes:**
> - [recall] State the first rule of ARIA in one sentence.
> - [apply] Tab through a page and identify focus-order bugs.
> - [judge] Decide whether a given UI needs an ARIA role or a different semantic element.
> - [build] Add accessible names and roles to a custom component.
> - [recall] Recall the WCAG AA contrast ratios.
>
> **Sections:**
> 1. Hook — "70% of accessibility bugs are caught by Tab. Most teams never press it."
> 2. Mental model — *Accessibility is a baseline, not a feature. The first rule of ARIA is: don't use ARIA.* (pull-quote)
> 3. Step-by-step — 6 steps: (a) keyboard reachability, (b) focus-visible vs focus, (c) accessible names, (d) ARIA roles only when HTML can't, (e) `aria-live` for dynamic content, (f) WCAG AA contrast.
> 4. Playground — `HTMLPlayground` with a custom button-from-`<div>` (broken) next to a real `<button>` (correct). `<!-- Try this: -->`: "Tab and Space your way through both buttons; only one will activate."
> 5. Challenges — 2:
>    - "A custom dropdown made from `<div>`s — minimum work to make it accessible?" (Correct: replace with `<select>` or pair `role=combobox` with full keyboard handling)
>    - "WCAG AA contrast for normal text?" (Correct: 4.5:1)
> 6. GotchaList — 4 entries:
>    - "`tabindex={-1}` removes from sequence but not from focus — `tabindex={0}` adds to natural sequence"
>    - "`aria-hidden=true` on a focusable element creates a 'phantom focus' bug"
>    - "Color is not a name — buttons must have an accessible name even if their icon is universally understood"
>    - "Skip-links must be visible on focus or they don't help anyone"
> 7. KeyTakeaways — restate.
>
> Catalog terms: accessibility, WCAG, ARIA, focus order. Italicize on first use.
>
> Quality gates → smoke test → commit:
> ```bash
> git add lib/modules/2-3-accessibility.tsx
> git commit -m "feat(modules): re-author 2-3 (Accessibility) to Tier-A"
> ```

- [ ] **Step 1: Dispatch subagent**
- [ ] **Step 2: Verify rubric**
- [ ] **Step 3: Iterate or accept**

#### Task 14: Re-author `lib/modules/2-4-seo-basics.tsx`

**Brief for subagent:**

> Re-author `lib/modules/2-4-seo-basics.tsx` to Tier-A. Same protocol.
>
> **Learning outcomes:**
> - [build] Write a complete `<head>` (title, description, OG, canonical, robots).
> - [recall] Name three meta tags and what each affects.
> - [apply] Write a `robots.txt` and a minimal `sitemap.xml`.
> - [judge] Choose appropriate `<title>` and `<meta description>` for a product page.
> - [recall] State why semantic HTML earns ranking signals "for free."
>
> **Sections:**
> 1. Hook — "Two pages with identical content rank wildly differently. The 16 lines in `<head>` explain most of the gap."
> 2. Mental model — *SEO is mostly accessibility plus the right metadata. Crawlers and screen readers want the same things.* (pull-quote)
> 3. Step-by-step — 6 steps: (a) `<title>` + `<meta description>`, (b) Open Graph + Twitter card, (c) canonical URL, (d) `robots.txt` and `noindex`, (e) `sitemap.xml`, (f) structured data (JSON-LD) — preview only.
> 4. Body primitive — `CodeBlock` of a complete `<head>` with annotations (use existing CodeBlock; **no playground for this module — call this out in the spec via comments).** Add a small mental "Try this:" prompt in prose: "Open any well-ranked product page's source and find these tags."
>
>    Actually, replace the `CodeBlock` with an `HTMLPlayground` whose HTML is just the `<head>` template plus a `<body><h1>Demo</h1></body>` so it renders. Comment in HTML: `<!-- Try this: change <title> and <meta description> and refresh; the tab title and the share preview both update. -->`
> 5. Challenges — 2:
>    - "Where does `<meta description>` show up?" (Correct: search-engine result snippet — *not* the rendered page)
>    - "What does `rel=canonical` do?" (Correct: point crawlers to the preferred URL when content is duplicated across paths)
> 6. GotchaList — 4 entries:
>    - "`og:image` should be 1200×630 — anything smaller crops badly on social platforms"
>    - "Crawlers respect `robots.txt` but it doesn't *block* — it's a request, not a wall"
>    - "Pages can be both `noindex` and crawlable — they get visited, just not listed"
>    - "Sites with bad heading hierarchy lose ranking even when keywords are perfect"
> 7. KeyTakeaways — restate.
>
> Catalog terms: SEO, meta tag, Open Graph, sitemap, robots.txt. Italicize on first use.
>
> Quality gates → smoke test → commit:
> ```bash
> git add lib/modules/2-4-seo-basics.tsx
> git commit -m "feat(modules): re-author 2-4 (SEO basics) to Tier-A"
> ```

- [ ] **Step 1: Dispatch subagent**
- [ ] **Step 2: Verify rubric**
- [ ] **Step 3: Iterate or accept**

---

### USER REVIEW GATE — after Wave 3

> After Tasks 11–14: user reads all four modules end-to-end and **flags voice/depth drift across them**. If three modules feel similar but one is off, the off one is re-spun. Wave 4 may not start until the user is satisfied that voice is consistent. If the rubric needs sharpening, edit the spec's §8 (rubric) and the spec's §2 (voice rules) before Wave 4.

---

### Wave 4 — Phase 1 remainder (3 parallel tasks)

Each task uses the same dispatch protocol as Wave 3.

#### Task 15: Re-author `lib/modules/1-2-http-and-https.tsx`

**Brief:**

> Re-author `1-2-http-and-https`. Outcomes from `learning-outcomes.md`. Use `SequenceDiagram` for the request/response flow and `LayeredFlow` for the TCP→TLS→HTTP stack. Suggested hook: "An HTTP request is the most-mailed letter on Earth. You'll send a billion of them this year. Knowing what's in the envelope makes everything that follows faster to debug." Mental model: *HTTP is a stateless conversation: request goes up, response comes down, no memory between them.* GotchaList: at least include "Status codes 1xx and 3xx exist but most apps never see them," "POST is not idempotent — refresh prompts a re-submit dialog," "Cookies are sent automatically — that's both their strength and the source of CSRF," "HTTPS doesn't certify the *site*, only the *domain*."
>
> Catalog terms: HTTP, HTTPS, HTTP method, HTTP status code, HTTP header, idempotent, cookie, TLS handshake, certificate, CA. Quality gates → smoke test → commit `feat(modules): re-author 1-2 (HTTP & HTTPS) to Tier-A`.

- [ ] **Step 1–3: Dispatch / verify / iterate**

#### Task 16: Re-author `lib/modules/1-3-domain-dns-hosting.tsx`

**Brief:**

> Re-author `1-3-domain-dns-hosting`. Outcomes from `learning-outcomes.md`. Use `SequenceDiagram` for "I bought a domain — now what?" walking through DNS records → hosting → CDN. Mental model: *Domain → DNS → IP → Server. A CDN is the same content, geographically duplicated.* GotchaList: "TTL is the worst-case lock-in for a record change," "CNAMEs can chain but each hop is an extra DNS lookup," "Apex (root) records can't CNAME — use ALIAS or A records," "Hosting provider's free tier limits often surface as cryptic 503s, not error pages."
>
> Catalog terms: domain name, TLD, DNS, A/AAAA/CNAME records, TTL, hosting, static hosting, CDN. Quality gates → commit `feat(modules): re-author 1-3 (Domains, DNS, hosting) to Tier-A`.

- [ ] **Step 1–3: Dispatch / verify / iterate**

#### Task 17: Re-author `lib/modules/1-4-browsers-and-rendering.tsx`

**Brief:**

> Re-author `1-4-browsers-and-rendering`. Outcomes from `learning-outcomes.md`. **Use `LayeredFlow`** to draw the rendering pipeline (Bytes → DOM → CSSOM → Render tree → Layout → Paint → Composite). Mental model: *A page is a recipe; the browser bakes it in stages. Skip a stage and you skip a check.* Show that `<script>` blocks parsing and CSS blocks rendering — give two `HTMLPlayground` snippets: one with `<script>` in `<head>` (slow), one with `<script defer>` in `<head>` (fast). GotchaList: "Reflow cascades — one element's geometry change can trigger reflow up the tree," "`display: none` removes from the render tree but `visibility: hidden` keeps it (still costs layout)," "Reading layout during JS forces synchronous reflow — `offsetHeight` is famously expensive," "Modern browsers paint on the GPU; `transform`/`opacity` change without layout."
>
> Catalog terms: rendering pipeline, DOM, CSSOM, render tree, layout, paint, composite, critical rendering path. Quality gates → commit `feat(modules): re-author 1-4 (Browsers & rendering) to Tier-A`.

- [ ] **Step 1–3: Dispatch / verify / iterate**

---

### Wave 5 — Phases 3 + 4 (8 parallel tasks)

Each follows the Wave 3+ subagent dispatch protocol. Briefs are condensed below — the subagent must read the spec/catalog/outcomes/exemplar before authoring.

#### Task 18: `lib/modules/3-1-css-fundamentals.tsx`

> Outcomes from `learning-outcomes.md` `3-1`. **Use the new `LiveCascadeDemo`** primitive in section 4 (playground). Mental model: *The cascade is a sort, not a guess: origin × specificity × source order.* Hook: "You add `color: red`. Nothing changes. Three rules from somewhere else outweigh it." Catalog terms: CSS, selector, property, cascade, specificity, inheritance, box model, `box-sizing`, block element, inline element. GotchaList: "`!important` doesn't beat inline styles unless inline isn't `!important`," "Inheritance is opt-in for *some* properties, opt-out for others — `color` inherits, `border` doesn't," "Specificity has four tiers, not three (inline counts)," "`* { box-sizing: border-box }` is the modern reset most projects do without thinking." Commit: `feat(modules): re-author 3-1 (CSS fundamentals) to Tier-A`.

- [ ] **Step 1–3: Dispatch / verify / iterate**

#### Task 19: `lib/modules/3-2-flexbox-and-grid.tsx`

> Outcomes from `learning-outcomes.md` `3-2`. **Use `FlexboxControls` and `GridControls`** primitives — two playgrounds, side by side conceptually. Mental model: *Flex distributes space along one axis; Grid divides it along two. `fr` is the unit of remaining space.* Hook: "Half the layouts you'll write fit cleanly into one or the other. Picking wrong is the difference between three lines and thirty." Catalog terms: Flexbox, Grid, main/cross axis, `fr` unit. GotchaList: "Flex `align-items` aligns on the cross axis — confusing on column flex," "Grid `auto-fit` collapses tracks; `auto-fill` keeps them — most responsive grids want `auto-fit`," "Flex doesn't `gap` on Safari < 14.1 — you'll see `margin: -8px` workarounds in old code," "Grid accepts `display: grid` on inline elements — use `inline-grid` to stay inline." Commit: `feat(modules): re-author 3-2 (Flexbox & Grid) to Tier-A`.

- [ ] **Step 1–3: Dispatch / verify / iterate**

#### Task 20: `lib/modules/3-3-responsive-design.tsx`

> Outcomes from `learning-outcomes.md` `3-3`. Mental model: *Mobile-first means writing the simplest layout first, then adding complexity at wider breakpoints. Pick breakpoints from your content, not your phone catalog.* Use `HTMLPlayground` showing a fluid card grid with `clamp()` for type and a container query that switches layout when the parent narrows. Catalog terms: media query, mobile-first, container query, `clamp()`. GotchaList: "Container queries need `container-type: inline-size` on the *parent*," "`min-width` queries layer additively; `max-width` queries fight the cascade," "Viewport units (`vh`) jiggle on mobile when the URL bar collapses — use `dvh`/`svh`," "Breakpoints set to device names (e.g. 768px = 'iPad') age badly; pick from where the layout actually breaks." Commit: `feat(modules): re-author 3-3 (Responsive design) to Tier-A`.

- [ ] **Step 1–3: Dispatch / verify / iterate**

#### Task 21: `lib/modules/3-4-writing-css-modern.tsx` (now **Tailwind CSS**)

> The module is **retitled** in `curriculum.ts` already (Task 10b). Outcomes from `learning-outcomes.md` `3-4`. **Drop the comparison framing.** Teach Tailwind in depth. End with a one-paragraph "Alternatives" section.
>
> Mental model: *Utility classes compose styles inline; the cascade and naming go away.* Hook: "You name a class `.card-header-with-icon-on-left`. A week later you copy a card and break the icon. Tailwind says: stop naming things." Step-by-step: (a) what a utility is, (b) the design tokens (spacing/colors), (c) variants (`hover:`, `focus:`, `md:`), (d) `@apply` for component extraction, (e) `@layer` and the safelist, (f) when to keep custom CSS. `HTMLPlayground` with Tailwind via CDN showing a card with hover/focus. Catalog terms: Tailwind CSS, utility class. (CSS Modules, CSS-in-JS appear only in the closing alternatives paragraph.) GotchaList: "Tailwind classes ship verbatim in HTML — purging unused classes happens at build time," "`@apply` reintroduces the naming you came to Tailwind to avoid; use sparingly," "Arbitrary values (`w-[372px]`) are escape hatches — every one is a mini-design-debt," "Dark-mode classes (`dark:`) are toggled by a class on `<html>` — not a media query unless you configure it." Commit: `feat(modules): re-author 3-4 (Tailwind CSS) to Tier-A`.

- [ ] **Step 1–3: Dispatch / verify / iterate**

#### Task 22: `lib/modules/3-5-css-architecture-and-preprocessors.tsx`

> Outcomes from `learning-outcomes.md` `3-5`. Mental model: *Architecture beats clever selectors. BEM, Sass, and PostCSS each solve a different problem; pick by the problem you have.* Use a `CodeBlock` for BEM + Sass nesting + a PostCSS plugin example. Catalog terms: BEM, Sass, PostCSS. GotchaList: "Nesting more than 3 levels in Sass produces specificity bombs," "BEM modifiers should be classes, not attribute selectors — `[data-state=open]` is fine, `.button[data-state=open]` is not," "PostCSS `preset-env` lets you use future CSS today; `autoprefixer` adds browser-specific prefixes — they're often confused," "You probably don't need a preprocessor in 2026 — CSS variables + nesting + container queries cover most of what Sass added." Commit: `feat(modules): re-author 3-5 (CSS architecture & preprocessors) to Tier-A`.

- [ ] **Step 1–3: Dispatch / verify / iterate**

#### Task 23: `lib/modules/4-1-javascript-fundamentals.tsx`

> Outcomes from `learning-outcomes.md` `4-1`. Mental model: *Primitives copy by value; objects share by reference. A closure is a function plus the variable bindings of where it was defined.* Use `HTMLPlayground` with a click counter built two ways — one with closure (correct), one with a global (broken when there are multiple counters). Catalog terms: JavaScript, primitive, reference type, scope, block scope, hoisting, closure, `this`, prototype. GotchaList: "`var` is function-scoped — and hoisted; `let`/`const` are block-scoped and hit the temporal dead zone," "`==` does type coercion; `===` doesn't — always use `===` unless you know why you don't," "Arrow functions don't have their own `this` — they capture the enclosing scope's `this`," "Mutating a const-bound object doesn't reassign — `const` is about the *binding*, not the value." Commit: `feat(modules): re-author 4-1 (JavaScript fundamentals) to Tier-A`.

- [ ] **Step 1–3: Dispatch / verify / iterate**

#### Task 24: `lib/modules/4-2-dom-and-events.tsx`

> Outcomes from `learning-outcomes.md` `4-2`. **Use `EventLoopVisualizer`** for the trace. Mental model: *Events bubble up the tree; one listener on a parent can serve thousands of children. The event loop is a queue, not a thread.* Use `HTMLPlayground` with a TODO list whose `<ul>` has one delegated click listener that handles checkboxes and delete buttons across all child `<li>`s. Catalog terms: DOM API, event, event listener, event bubbling, event delegation, event loop, call stack, macrotask, microtask. GotchaList: "Delegation broken by `event.stopPropagation()` calls inside children," "`addEventListener('scroll', …)` without `{ passive: true }` blocks scroll on mobile," "Microtasks drain *fully* between macrotasks — a runaway promise chain freezes the UI," "DOM mutations inside a loop trigger a repaint per change unless batched (use `documentFragment` or React)." Commit: `feat(modules): re-author 4-2 (DOM & events) to Tier-A`.

- [ ] **Step 1–3: Dispatch / verify / iterate**

#### Task 25: `lib/modules/4-3-fetch-and-async.tsx`

> Outcomes from `learning-outcomes.md` `4-3`. **Use `EventLoopVisualizer`** for an async-await trace, and `CodeComparison` for callbacks vs Promises vs async/await. Mental model: *A Promise is a value that's not here yet. `async`/`await` is sugar — not a thread.* Use `HTMLPlayground` with a `fetch()` call that uses `AbortController` to cancel itself when a button is clicked. Catalog terms: Promise, async/await, fetch, AbortController. GotchaList: "An unhandled promise rejection is silent — `try/catch` doesn't catch it if you forgot the `await`," "`await` in a loop serializes calls — use `Promise.all` for parallel," "`fetch()` doesn't reject on 4xx/5xx — it rejects on network failure only; check `response.ok`," "Aborting a fetch rejects the promise with an `AbortError` — handle it explicitly or it looks like a bug." Commit: `feat(modules): re-author 4-3 (Fetch & async) to Tier-A`.

- [ ] **Step 1–3: Dispatch / verify / iterate**

---

### Wave 6 — Phases 5 + 6 (9 parallel tasks)

#### Task 26: `lib/modules/5-1-git-and-github.tsx`

> Outcomes from `learning-outcomes.md` `5-1`. **Use `TerminalPlayground`** for a complete `init → commit → branch → merge → push` session. Mental model: *Git tracks snapshots, not diffs. A branch is just a movable pointer to a commit.* Catalog terms: Git, commit, branch, merge, rebase, pull request. GotchaList: "`git pull` is `fetch + merge` — and it makes commits silently; many teams prefer `pull --rebase`," "A detached HEAD is a footgun, not a bug — make a branch before you touch anything," "Force-pushing to a shared branch destroys others' work; force-pushing to your own feature branch is fine," "`git stash` is amnesia disguised as backup — prefer a WIP commit." Commit: `feat(modules): re-author 5-1 (Git & GitHub) to Tier-A`.

- [ ] **Step 1–3: Dispatch / verify / iterate**

#### Task 27: `lib/modules/5-2-package-managers.tsx`

> Outcomes from `learning-outcomes.md` `5-2`. **Use `TerminalPlayground`** for a `pnpm init → pnpm add → pnpm install → pnpm run` session, plus a `CodeBlock` of a `package.json` and a `pnpm-lock.yaml` excerpt side-by-side. Mental model: *`package.json` declares; the lockfile resolves. The lockfile is the contract; commit it.* Catalog terms: package.json, lockfile, semver, pnpm, workspace. GotchaList: "Floating ranges (`^1.2.3`) install different versions on different machines unless you commit the lockfile," "`npm ci` (and `pnpm install --frozen-lockfile`) ignore the manifest if it conflicts with the lockfile — that's the point in CI," "Phantom dependencies (using a transitive without declaring it) work in npm/yarn but break with pnpm — that's a feature," "`peerDependencies` aren't auto-installed — they let *you* say what's compatible." End with a one-paragraph alternatives section (npm, yarn). Commit: `feat(modules): re-author 5-2 (Package managers) to Tier-A`.

- [ ] **Step 1–3: Dispatch / verify / iterate**

#### Task 28: `lib/modules/5-3-pick-a-framework.tsx` (now **React Fundamentals**)

> Module retitled in `curriculum.ts` already. Outcomes from `learning-outcomes.md` `5-3` — note this is the largest outcome list. **This module is the longest in the curriculum** — likely to land at the upper end of the cognitive-load budget. If it exceeds 1500 lines, escalate to user.
>
> Mental model: *React describes UI as a function of state. Re-render is cheap because reconciliation only touches the changed parts of the DOM.* Hook: "You're used to thinking 'when X clicks, mutate Y in the DOM.' React asks: 'what does the DOM look like for this state?' — and figures out the rest." Step-by-step (7 steps): (a) components and JSX, (b) props, (c) `useState`, (d) re-rendering and reconciliation, (e) `useEffect` with cleanup, (f) lifting state up vs context, (g) custom hooks. Use **`ReactPlayground`** with a counter, a list, and a small fetch-on-mount example. Catalog terms: React, component, JSX, props, state, hook, render, reconciliation, effect. GotchaList: "Mutating state directly (`state.list.push(x)`) doesn't re-render — always create new objects/arrays," "`useEffect`'s dependency array matters — `[]` runs once; missing deps cause stale closures," "Setting state in render is an infinite loop — use an effect or an event handler," "Components must be pure — same props/state in, same JSX out (no side effects in render)." End with a one-paragraph alternatives section (Vue, Svelte, Solid, Qwik). Commit: `feat(modules): re-author 5-3 (React fundamentals) to Tier-A`.

- [ ] **Step 1–3: Dispatch / verify / iterate**

#### Task 29: `lib/modules/5-4-typescript.tsx`

> Outcomes from `learning-outcomes.md` `5-4`. Mental model: *TypeScript is a type-checker, not a runtime. Structural typing means a type is its shape, not its name.* Use a `CodeComparison` of a JS function vs the typed version, and a `CodeBlock` of a discriminated-union narrowing example. Catalog terms: TypeScript, type, structural typing, narrowing, generic. GotchaList: "`any` defeats the entire system — prefer `unknown`," "`interface` and `type` are nearly interchangeable; `interface` is open (declaration-mergeable), `type` is closed," "TS doesn't validate at runtime — bad JSON from an API still crashes; use a runtime validator (`zod`, `valibot`)," "The `as` cast is a lie — TS believes you, even when you're wrong." Commit: `feat(modules): re-author 5-4 (TypeScript) to Tier-A`.

- [ ] **Step 1–3: Dispatch / verify / iterate**

#### Task 30: `lib/modules/6-1-linters-and-formatters.tsx`

> Outcomes from `learning-outcomes.md` `6-1`. **Use `TerminalPlayground`** for `eslint .` + `prettier --write .` runs, plus a `CodeBlock` of a typical `eslint.config.js`. Mental model: *Lint catches likely bugs; format makes whitespace decisions. Never have one tool fight the other.* Catalog terms: linter, formatter, pre-commit hook. GotchaList: "ESLint can format and Prettier can lint — but neither is good at the other's job," "`eslint-config-prettier` turns off ESLint rules that conflict with Prettier — it's a one-line install most teams skip," "Pre-commit hooks that auto-fix can hide problems; CI should also lint," "ESLint flat config (`eslint.config.js`) replaced `.eslintrc` in v9 — older docs don't apply." Commit: `feat(modules): re-author 6-1 (Linters & formatters) to Tier-A`.

- [ ] **Step 1–3: Dispatch / verify / iterate**

#### Task 31: `lib/modules/6-2-module-bundlers.tsx` (now **Vite & the Dev Loop**)

> Module retitled. Outcomes from `learning-outcomes.md` `6-2`. **Drop comparison framing.** Teach Vite. **Use `LayeredFlow`** to show: "request a `.ts` file in dev → Vite transforms on the fly → ESM in browser; build → Rollup bundles → static files." Mental model: *Vite serves source as native ESM in dev (no bundling) and bundles for production. The dev loop is fast because the browser is doing more.* Use `CodeBlock` of `vite.config.ts`. Catalog terms: bundler, Vite, HMR, tree-shaking, code splitting. GotchaList: "Dev and prod are different runtimes — `import.meta.env.DEV` is only true in dev," "HMR keeps state across edits, but state can desync if you change the component's identity (rename function)," "`vite build` uses Rollup; `vite dev` uses esbuild for transforms — different feature sets," "Static assets in `public/` aren't processed; assets imported from code are." End with one-paragraph alternatives (Webpack, esbuild, Rollup, Parcel). Commit: `feat(modules): re-author 6-2 (Vite & the dev loop) to Tier-A`.

- [ ] **Step 1–3: Dispatch / verify / iterate**

#### Task 32: `lib/modules/6-3-testing.tsx`

> Outcomes from `learning-outcomes.md` `6-3`. Use `CodeComparison` to show the same behavior tested at three levels: a Vitest unit test, a Vitest + Testing Library component test, a Playwright E2E. **Use `TerminalPlayground`** for a `vitest run` + `playwright test` session. Mental model: *Test the behavior, not the implementation. Many cheap unit tests, fewer integration tests, fewest E2E tests.* Catalog terms: Vitest, Playwright, test pyramid. GotchaList: "Mocking the unit you're testing means you're testing the mock; mock at the boundary," "`getByTestId` is a code smell unless the user truly can't see the element," "Flaky tests are bugs — find and fix the race; never `sleep`," "`it.only` and `describe.only` ship to CI more often than anyone admits — add a lint rule." Commit: `feat(modules): re-author 6-3 (Testing) to Tier-A`.

- [ ] **Step 1–3: Dispatch / verify / iterate**

#### Task 33: `lib/modules/6-4-authentication.tsx`

> Outcomes from `learning-outcomes.md` `6-4`. **Use `SequenceDiagram`** for the OAuth Authorization Code + PKCE flow. Mental model: *Cookies are sent automatically; tokens aren't. JWT is signed claims, not encrypted ones. OAuth is delegation, not authentication.* Use `CodeBlock` decoding a sample JWT. Catalog terms: authentication, authorization, JWT, session cookie, OAuth 2.0, PKCE. GotchaList: "JWT in localStorage is a giant XSS target," "Sessions need server-side state — that's a feature for revocation, a cost for scale," "OAuth's 'Sign in with X' isn't authentication on its own — you have to verify the returned ID token," "PKCE is mandatory for public clients (browsers, mobile) since 2020 — old guides skip it." Commit: `feat(modules): re-author 6-4 (Authentication) to Tier-A`.

- [ ] **Step 1–3: Dispatch / verify / iterate**

#### Task 34: `lib/modules/6-5-web-security.tsx`

> Outcomes from `learning-outcomes.md` `6-5`. Use `CodeComparison` for an unsafe vs safe rendering pattern (e.g. `innerHTML = userInput` vs `textContent = userInput`). Mental model: *Same-origin policy is the main wall; CSP narrows what runs inside; CORS lets specific cross-origin requests through.* Catalog terms: same-origin policy, CORS, XSS, CSRF, CSP. GotchaList: "Sanitization libraries get out of date — prefer `textContent` over `innerHTML` whenever possible," "CSRF tokens are useless if your CSP allows arbitrary scripts — XSS makes both moot," "`SameSite=Lax` cookies block most CSRF but not navigation-based flows," "CSP `unsafe-inline` is so common it's almost the default — and it neutralizes 70% of XSS protection." Commit: `feat(modules): re-author 6-5 (Web security) to Tier-A`.

- [ ] **Step 1–3: Dispatch / verify / iterate**

---

### Wave 7 — Phase 7 (8 parallel tasks)

#### Task 35: `lib/modules/7-1-web-components.tsx`

> Outcomes from `learning-outcomes.md` `7-1`. Use `HTMLPlayground` defining a `<my-counter>` Custom Element with Shadow DOM and a `<slot>` for label content. Mental model: *Custom Elements are framework-agnostic components. Shadow DOM is real style encapsulation, not class-name conventions.* Catalog terms: Web Component, Custom Element, Shadow DOM, `<template>`, slot. GotchaList: "Lifecycle order: `constructor` → `connectedCallback` → `attributeChangedCallback` → `disconnectedCallback`," "Shadow DOM blocks CSS from leaking *in* and *out* — global resets won't reach your component," "`observedAttributes` is static; dynamic attribute names won't trigger `attributeChangedCallback`," "Web Components and React coexist — but binding events between them takes glue (`addEventListener`/`dispatchEvent`)." Commit: `feat(modules): re-author 7-1 (Web Components) to Tier-A`.

- [ ] **Step 1–3: Dispatch / verify / iterate**

#### Task 36: `lib/modules/7-2-ssr.tsx`

> Outcomes from `learning-outcomes.md` `7-2`. **The most architecturally important module in Phase 7** — it's where most React-trained devs hit the SSR wall. Use `LayeredFlow` to compare CSR vs SSR vs SSG vs ISR vs RSC: input HTML/JS shipped → user-perceived interactivity timeline. Use `SequenceDiagram` for the hydration handshake. Mental model: *Rendering location is a slider, not a switch. Hydration wires server HTML up on the client. RSC ships HTML, never JS.* Catalog terms: CSR, SSR, SSG, ISR, hydration, RSC, Next.js. GotchaList: "Hydration mismatch errors mean server HTML and client JSX disagree — usually a `Date.now()` or a browser-only API," "Server components can't use hooks or browser APIs — they're rendered once, on the server, period," "`use client` doesn't ship a separate bundle — it just marks the boundary; the parent server tree still controls rendering," "Streaming SSR shows the page progressively but breaks `<title>` and `<meta>` semantics if you're not careful." End with one-paragraph alternatives (Nuxt, SvelteKit, etc.). Commit: `feat(modules): re-author 7-2 (Next.js & SSR) to Tier-A`.

- [ ] **Step 1–3: Dispatch / verify / iterate**

#### Task 37: `lib/modules/7-3-graphql.tsx`

> Outcomes from `learning-outcomes.md` `7-3`. Use `CodeBlock` of a GraphQL schema, a query with fragments and variables, and the JSON response. Mental model: *Client asks for exactly the shape it wants; server resolves field by field. Cache by id, not by URL.* Catalog terms: GraphQL, schema, resolver, Apollo Client. GotchaList: "N+1 query problems are easy to make and easy to ship — Apollo's normalized cache helps but doesn't fix the server," "Optional fields in the schema mean optional in TypeScript — codegen won't save you from `null`," "Subscriptions need a transport (WebSocket, SSE) — they're not free with HTTP," "GraphQL plus REST gateways is increasingly common — the back-end pendulum is swinging." Commit: `feat(modules): re-author 7-3 (GraphQL) to Tier-A`.

- [ ] **Step 1–3: Dispatch / verify / iterate**

#### Task 38: `lib/modules/7-4-static-site-generators.tsx`

> Outcomes from `learning-outcomes.md` `7-4`. Use `CodeBlock` of an Astro page with an interactive island. Mental model: *Build once, serve many. Islands architecture: mostly-static HTML with sprinkles of JS where interaction is needed.* Catalog terms: SSG, Astro, Eleventy, islands architecture. GotchaList: "SSG breaks at scale of pages × build time — incremental builds and on-demand regen are real escape hatches," "Islands ship per-component JS only when they hydrate — but adding ten of them blows up the bundle anyway," "Markdown sources are simple until you need plugins; an MDX or remark/rehype pipeline is itself a project," "An SSG with no per-request server loses you A/B tests and per-user content unless you bolt on edge functions." Commit: `feat(modules): re-author 7-4 (SSGs) to Tier-A`.

- [ ] **Step 1–3: Dispatch / verify / iterate**

#### Task 39: `lib/modules/7-5-pwas-and-browser-apis.tsx`

> Outcomes from `learning-outcomes.md` `7-5`. Use `CodeBlock` of a service worker registering and a `fetch` handler that caches GET responses. Mental model: *A service worker is a programmable proxy. Pick the storage that matches the data shape.* Catalog terms: PWA, service worker, Cache API, IndexedDB, WebSocket, SSE. GotchaList: "`localStorage` is synchronous and capped at ~5 MB — never put anything important there," "Service workers update on `install` but only become active after all tabs close — `skipWaiting` is the escape hatch," "WebSockets aren't HTTP after the upgrade — load balancers and CORS rules differ," "Push notifications need a backend; client-only PWA tutorials skip this and surprise people." Commit: `feat(modules): re-author 7-5 (PWAs & browser APIs) to Tier-A`.

- [ ] **Step 1–3: Dispatch / verify / iterate**

#### Task 40: `lib/modules/7-6-mobile-apps.tsx`

> Outcomes from `learning-outcomes.md` `7-6`. **Pick: React Native is the canonical pick.** Drop comparison framing. Use `CodeBlock` of a "hello world" React Native screen. End with one-paragraph alternatives (Flutter, Ionic, native). Mental model: *React Native renders real native UI; Flutter renders pixels itself; Ionic ships a webview.* Catalog terms: React Native, Flutter, Ionic. GotchaList: "RN's JS bridge has a measurable cost — animations should run on the native side via `Animated` or `Reanimated`," "RN's CSS-like style API is *not* CSS — `display: flex` is the default, no inheritance," "`react-native-web` is not a substitute for a real web app — it's for code reuse, not for shipping the same app on the web," "Flutter is the right pick for pixel-perfect cross-platform; RN is the right pick for code-share with web teams." Commit: `feat(modules): re-author 7-6 (Mobile apps) to Tier-A`.

- [ ] **Step 1–3: Dispatch / verify / iterate**

#### Task 41: `lib/modules/7-7-desktop-apps.tsx`

> Outcomes from `learning-outcomes.md` `7-7`. Use `CodeComparison` between an Electron `main.js` and a Tauri `main.rs`. Mental model: *Electron bundles Chromium + Node into your app; Tauri uses the OS's webview + a Rust backend. Bundle size and security model are the trade.* Catalog terms: Electron, Tauri. GotchaList: "Electron's Node integration is a security footgun — disable it in renderers and use IPC," "Tauri requires Rust toolchain to build — that's a real CI cost," "WebView differences across OSes (Edge on Windows, WebKit on macOS, WebKitGTK on Linux) bring back early-2000s browser-quirk debugging," "Auto-update is non-trivial — both Electron and Tauri have first-party solutions, both with caveats." End with one-paragraph alternatives (Flutter desktop, native). Commit: `feat(modules): re-author 7-7 (Desktop apps) to Tier-A`.

- [ ] **Step 1–3: Dispatch / verify / iterate**

#### Task 42: `lib/modules/7-8-performance.tsx`

> Outcomes from `learning-outcomes.md` `7-8`. **Use `LayeredFlow`** to show the page-load timeline relative to LCP/INP/CLS measurement points. Use `CodeBlock` of a Lighthouse JSON excerpt. Mental model: *LCP is how fast the main thing appears; INP is how snappy interactions feel; CLS is how much things jumped while loading. Measure first, optimize second.* Catalog terms: Core Web Vitals, LCP, INP, CLS, Lighthouse, PRPL, RAIL. GotchaList: "LCP regressions are usually caused by hero images without dimensions — `width`/`height` attributes are still required for layout reservation," "INP measures the *worst* interaction during the page lifetime — one slow click haunts the whole session," "CLS spikes are nearly always caused by ads, embeds, or fonts — prevention is a `font-display: swap` plus reserved space," "Lighthouse simulates a slow phone — your dev machine is a fantasy environment for perf." Commit: `feat(modules): re-author 7-8 (Performance) to Tier-A`.

- [ ] **Step 1–3: Dispatch / verify / iterate**

---

### Wave 8 — Style review pass (1 task)

#### Task 43: Cross-module style audit

**Why:** With 30 modules authored across many subagent dispatches, voice and depth drift is the largest residual risk. One reviewer reads 5 random modules end-to-end and flags problems.

**Files (read-only audit):**
- 5 randomly chosen `lib/modules/<id>.tsx` files (excluding `1-1` exemplar)
- This plan + spec + catalog + outcomes for reference

- [ ] **Step 1: Pick 5 modules at random**

```bash
ls lib/modules/*.tsx | grep -v _template | grep -v _demos | grep -v 1-1 | shuf -n 5
```

Record the chosen module IDs.

- [ ] **Step 2: For each chosen module, read end-to-end and check the rubric**

Verify against §8 of the spec:
- Voice: English, "you" not "we", catalog terms italicized on first use, no "we'll see later."
- Structure: All 7 sections in order. Hook is concrete. Mental model stated twice.
- Outcomes: Every outcome in `learning-outcomes.md` exercised somewhere.
- Quality gates: lint/tsc/build pass; `/lesson/<id>` renders.

- [ ] **Step 3: Write findings to `docs/superpowers/specs/2026-05-09-style-audit-findings.md`**

For each module: `<id>: <pass/needs-work>`. For "needs-work", list the specific failures.

- [ ] **Step 4: For any "needs-work" module, fix inline**

If fixes are small (typos, missing italics, missing pull-quote), make them in this task. If a fix is structural (missing GotchaList, hook isn't a hook), open a follow-up task in this plan.

- [ ] **Step 5: Re-run quality gates across the whole repo**

```bash
npx tsc --noEmit
npm run lint
npm run build
```

Expected: clean.

- [ ] **Step 6: Commit findings + any fixes**

```bash
git add docs/superpowers/specs/2026-05-09-style-audit-findings.md
git add -p   # interactively stage any module fixes
git commit -m "docs(audit): cross-module style review and fixes"
```

---

### Wave 9 — Docs (1 task)

#### Task 44: Update `CLAUDE.md` and `README.md`

**Files:**
- Modify: `CLAUDE.md`
- Modify: `README.md`

- [ ] **Step 1: Rewrite `CLAUDE.md`**

The new `CLAUDE.md` must cover:
- Project description: a frontend learning app following roadmap.sh/frontend, Tier-A re-authored.
- Dev commands (unchanged).
- Architecture map (unchanged).
- The Tier-A authoring template — point to `docs/superpowers/specs/2026-05-09-tier-a-curriculum-design.md` as the source of truth, summarize the 7 sections in 5 lines.
- Concept catalog: link to `docs/superpowers/specs/2026-05-09-concept-catalog.md` and state that authors must use canonical phrasing.
- Learning outcomes: link to `docs/superpowers/specs/2026-05-09-learning-outcomes.md`.
- How to add a new module — same as today; mention the new general-purpose primitives (GotchaList, SequenceDiagram, LayeredFlow, TerminalPlayground, LiveCascadeDemo, FlexboxControls, GridControls, EventLoopVisualizer).
- Quality gates — `npm run lint` (now includes `lint:lang`).
- Style — All copy in **English**. The `lint:lang` script enforces this.
- Drop the Tier-A vs Tier-B distinction (everything is Tier-A now).
- Drop the `ScaffoldModule` mention from "every module" — it's deprecated for new authoring; existing scaffold-tier modules have all been re-authored.

- [ ] **Step 2: Rewrite `README.md`**

Short and punchy:
- Title.
- One-paragraph description: a comprehensive frontend learning app following roadmap.sh/frontend, with live code, diagrams, and active recall in every module.
- "Run it locally": `pnpm install && pnpm dev` (or npm equivalents — keep both since current README likely uses npm).
- Link to roadmap.sh, the design spec, the concept catalog, and the learning outcomes.

- [ ] **Step 3: Quality gates**

```bash
npm run lint
npm run build
```

Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md README.md
git commit -m "docs: update CLAUDE.md and README for Tier-A curriculum"
```

---

## §3. Self-review (post-plan)

Run after writing this plan. Found and fixed inline before commit:

**1. Spec coverage:**
- Spec §3a (3 retitles) → Task 10b. ✓
- Spec §3b (soft prereqs) → Task 10b. ✓
- Spec §5a (8 primitives) → Tasks 2–9. ✓
- Spec §5c (Vietnamese cleanup) → Task 1. ✓
- Spec §6 (concept catalog) — already shipped with the spec; this plan references it. ✓
- Spec §7 (learning outcomes) — already shipped; this plan references per-module. ✓
- Spec §8 (rubric) → embedded in every Wave 3+ subagent brief by reference. ✓
- Spec §10 wave structure → §1 of this plan. ✓
- Spec §13 risks → mitigated by user-review gates (Wave 2, Wave 3) and Task 43 audit. ✓

No gaps.

**2. Placeholder scan:**
- Searched plan for "TBD", "TODO", "fill in", "appropriate error handling," "similar to Task N." Found one acceptable use of "..." in skeleton code blocks (intentional — the brief tells the subagent what to fill in). All "..." are clearly bounded by surrounding rules. ✓
- Tasks 11–42 reference `learning-outcomes.md` rather than re-quoting the outcomes verbatim — *this is acceptable* because the outcomes file is part of the spec deliverable and is provided to every subagent dispatch. The task brief tells the subagent which outcomes to find. ✓

**3. Type consistency:**
- Component prop interfaces (`GotchaList`, `SequenceDiagram`, `LayeredFlow`, `TerminalPlayground`, `LiveCascadeDemo`, `FlexboxControls`, `GridControls`, `EventLoopVisualizer`) defined once in their creation tasks; module tasks consume them by import path. ✓
- Catalog term names match across spec, catalog, outcomes, and module briefs (verified DNS, TCP, HTTP, hydration, hook, etc.). ✓
- File paths consistent (`lib/modules/<id>.tsx`, `components/<Name>.tsx`, `lib/modules/_demos/<Name>.demo.tsx`). ✓

No issues.

---

## §4. How to dispatch this plan

Two patterns are supported:

**Subagent-driven (recommended):** Use `superpowers:subagent-driven-development`. Within a wave, dispatch all tasks in parallel — each gets a fresh subagent with the brief from this plan as its prompt.

**Inline:** Use `superpowers:executing-plans`. Execute tasks one at a time in the current session.

Within Waves 3–7 the user should expect a single agent (or single batch of parallel agents) per wave, with the user-review gate after Wave 2 and Wave 3 the only mandatory pauses. Waves 4–7 may run continuously without user gates if the Wave-3 review went well.
