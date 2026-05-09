"use client";

import { Card, CardContent } from "@/components/ui/card";
import { HTMLPlayground } from "@/components/CodePlayground";
import { StepByStepExplanation, Step } from "@/components/StepByStepExplanation";
import { LayeredFlow } from "@/components/LayeredFlow";
import { Challenge } from "@/components/Challenge";
import { GotchaList } from "@/components/GotchaList";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { RoadmapLink } from "@/components/RoadmapLink";

export function Module_6_2_Content() {
  // Data blocks hoisted out of JSX for readability — listed in render order.
  const vitePipelineSteps: Step[] = [
    {
      title: "Step 1: What 'bundle' means",
      description: (
        <>
          Before native ES modules, browsers could not import one JavaScript file from another. The
          only way to ship a multi-file project was to concatenate every source file into one (or a
          handful) of output files — a process called <strong>bundling</strong>. A{" "}
          <em>bundler</em> — a tool that combines source modules into deliverable assets for the
          browser — crawls your <code>import</code> graph, resolves every dependency, and writes the
          merged output. The browser gets one file. The network makes one request. This was the right
          solution for 2013; modern browsers do not need it in development.
        </>
      ),
      code: `# Classic Webpack model (pre-ESM era)
# Every import becomes a require() call inside a runtime wrapper.
#
# src/
#   index.js
#   utils.js
#   helpers.js
#        ↓  build
# dist/
#   bundle.js   ← all three files concatenated + wrapped
#
# Browser fetches: 1 file. Size: all of the above.
# Cost: Webpack must parse + bundle EVERYTHING before first byte.`,
    },
    {
      title: "Step 2: Vite dev — no bundling",
      description: (
        <>
          <em>Vite</em> — a modern dev server + bundler: serves source as native ES modules in dev,
          bundles with Rollup for production — works differently. In development, Vite starts a
          server and lets the browser do the module loading. Your <code>.ts</code> and{" "}
          <code>.tsx</code> files are transformed on demand (TypeScript stripped, JSX compiled) by
          esbuild and served over HTTP as standard <code>import</code>s. The browser fetches each
          module the first time it is imported. Cold start is sub-second on large projects because
          Vite does not process files the browser has not asked for yet.
        </>
      ),
      code: `# Vite dev model
# vite.config.ts says: plugins: [react()]
#
# Browser loads /src/main.tsx
#   → sees: import App from "./App"
#   → fetches /src/App.tsx  (transformed by esbuild on-demand)
#   → sees: import { Button } from "./Button"
#   → fetches /src/Button.tsx (only now, on first use)
#
# Result: Vite never touches files the browser hasn't imported.
# Cold start: ~300 ms regardless of how many files exist.`,
    },
    {
      title: "Step 3: HMR — preserve state across edits",
      description: (
        <>
          <em>Hot Module Replacement (HMR)</em> — updating a module in the running page without a
          full reload, preserving state — is built into Vite. When you save a file, the Vite dev
          server sends the changed module over a WebSocket. The browser swaps only that module in
          the running page. Your component re-mounts with the new code; sibling components stay
          mounted with their state intact. A counter at 42 stays at 42 when you change the button
          color. A form half-filled in stays half-filled when you fix a validation bug. You never
          lose your place while debugging.
        </>
      ),
      code: `// You edit Button.tsx: change text from "Submit" to "Save"
//
// Without HMR: full page reload → form state gone → you retype.
//
// With Vite HMR:
//   1. Vite detects Button.tsx changed.
//   2. Re-transforms it with esbuild.
//   3. Pushes the new module over WebSocket.
//   4. React Fast Refresh swaps the component in-place.
//   5. Counter still reads 42. Form still has your typed text.
//
// The edit was live before your hand left Ctrl+S.`,
    },
    {
      title: "Step 4: Vite build — Rollup under the hood",
      description: (
        <>
          For production, Vite delegates to Rollup. Rollup is sharp at static analysis: it reads
          every <code>import</code> and <code>export</code>, drops any export that is never imported
          anywhere (<em>tree-shaking</em> — eliminating unused exports during bundling), and splits
          the bundle into smaller chunks that load on demand (<em>code splitting</em> — splitting the
          bundle into chunks loaded on demand). The output is a set of hashed static files —
          fingerprinted so you can serve them with a one-year <code>Cache-Control</code> without
          users being stuck on stale code after a deploy.
        </>
      ),
      code: `# vite build output (typical React + TypeScript project)
dist/
  index.html
  assets/
    index-Bx7kQ9pE.js       ← main chunk (your app code)
    index-CzWf3rNm.css       ← extracted styles
    vendor-DqPmHkJz.js       ← react + react-dom (separate chunk)

# Rollup tree-shook lodash: you used only \`_.debounce\`,
# so only that function ships. The rest of lodash: gone.
#
# Code-split: /dashboard route loads its chunk only on first visit.`,
    },
    {
      title: "Step 5: Configuration",
      description: (
        <>
          <code>vite.config.ts</code> exports a <code>defineConfig</code> object with four
          top-level sections: <code>plugins</code> (React Fast Refresh, SVG imports, etc.),{" "}
          <code>resolve</code> (path aliases like <code>@/</code>), <code>server</code> (port, proxy
          to a local backend), and <code>build</code> (Rollup options, sourcemaps, chunk splitting).
          Most projects need almost nothing beyond <code>plugins: [react()]</code>. Add configuration
          only when the default does not suit — Vite&apos;s defaults are opinionated in the right
          direction.
        </>
      ),
      code: `// vite.config.ts — a real-world TS + React project
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],            // React Fast Refresh + JSX transform

  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },

  server: {
    port: 3000,
    proxy: {
      "/api": {                  // forward /api/* to local backend
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ""),
      },
    },
  },

  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: { react: ["react", "react-dom"] },
      },
    },
  },
});`,
    },
    {
      title: "Step 6: Dev vs prod gotchas",
      description: (
        <>
          Dev and prod pipelines differ in ways that catch people off guard. The most common:{" "}
          <code>import.meta.env.DEV</code> is replaced at <em>build time</em> — its value is baked
          into the bundle. If you run <code>vite build</code> in a dev environment, the prod bundle
          ships with <code>DEV: true</code>. Static files in the <code>public/</code> folder are
          copied as-is — they are not processed, hashed, or tree-shaken. Assets imported from source
          code (e.g., <code>import logo from &apos;./logo.svg&apos;</code>) are processed and
          hashed; assets in <code>public/</code> are not. Dynamic imports work in both dev and prod
          but their chunking differs: in dev each dynamic import is its own file, in prod Rollup may
          merge small chunks.
        </>
      ),
      code: `// import.meta.env — replaced at BUILD TIME, not runtime

const apiBase = import.meta.env.DEV
  ? "http://localhost:8080"     // dev: this string is inlined
  : "https://api.example.com";  // prod: this string is inlined

// If you run "vite build" locally while the dev server is up,
// the bundle gets the WRONG branch. Always build in CI with
// NODE_ENV=production (Vite sets this automatically for vite build).

// public/ vs src/assets/
// <img src="/logo.png" />   ← public/logo.png, NOT hashed, NOT processed
// import logo from "./logo.png"  ← hashed, optimized, tree-shakeable`,
    },
  ];

  const playgroundHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Vite: dev vs prod</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <h2>What ships in dev vs prod</h2>
  <p class="subtitle">Toggle to see how the same source becomes different outputs.</p>

  <div class="toggle-row">
    <button id="btn-dev" class="active">Dev pipeline</button>
    <button id="btn-prod">Prod pipeline</button>
  </div>

  <div id="panel" class="panel"></div>
  <script src="/script.js"></script>
</body>
</html>`;

  const playgroundCss = `body {
  font-family: system-ui, sans-serif;
  max-width: 680px;
  margin: 24px auto;
  padding: 0 20px;
  color: #1e293b;
}
h2 { margin-bottom: 4px; font-size: 1.1rem; }
.subtitle { font-size: 0.82rem; color: #64748b; margin-bottom: 16px; }
.toggle-row { display: flex; gap: 8px; margin-bottom: 16px; }
button {
  padding: 8px 18px;
  background: #e2e8f0;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  color: #334155;
}
button.active { background: #3b82f6; color: white; border-color: #3b82f6; }
.panel {
  background: #0f172a;
  color: #e2e8f0;
  padding: 20px;
  border-radius: 8px;
  font-family: monospace;
  font-size: 0.8rem;
  line-height: 1.6;
  white-space: pre;
  min-height: 220px;
}
.key { color: #7dd3fc; }
.val { color: #86efac; }
.comment { color: #6b7280; }`;

  const playgroundJs = `// Try this: in vite.config.ts below, change \`build.minify\` to false. Then
// toggle the dev/prod view — the prod output now ships unminified. The
// config is the *only* place dev/prod differ. Same source, two pipelines.

const devOutput = [
  { key: "import.meta.env.DEV", val: "true" },
  { key: "import.meta.env.PROD", val: "false" },
  { key: "import.meta.env.MODE", val: "\\"development\\"" },
  { key: "Server", val: "esbuild (transform on demand)" },
  { key: "Bundling", val: "none — browser fetches ESM" },
  { key: "HMR", val: "enabled — state preserved" },
  { key: "Minification", val: "off" },
  { key: "Tree-shaking", val: "off" },
  { key: "Chunk hashing", val: "off" },
  { key: "Source maps", val: "inline" },
];

const prodOutput = [
  { key: "import.meta.env.DEV", val: "false (baked at build time)" },
  { key: "import.meta.env.PROD", val: "true (baked at build time)" },
  { key: "import.meta.env.MODE", val: "\\"production\\"" },
  { key: "Server", val: "Rollup" },
  { key: "Bundling", val: "all modules → hashed chunks" },
  { key: "HMR", val: "off" },
  { key: "Minification", val: "on (Terser)" },
  { key: "Tree-shaking", val: "on — unused exports dropped" },
  { key: "Chunk hashing", val: "on — e.g. index-Bx7kQ9pE.js" },
  { key: "Source maps", val: "external (sourcemap: true in config)" },
];

function render(rows) {
  const panel = document.getElementById('panel');
  const comment = '// vite.config.ts: build.minify controls minification below\\n\\n';
  panel.textContent = '';
  panel.appendChild(Object.assign(document.createElement('span'), {
    className: 'comment',
    textContent: comment,
  }));
  rows.forEach(function(row) {
    const line = document.createElement('span');
    const k = document.createElement('span');
    k.className = 'key';
    k.textContent = row.key.padEnd(32);
    const v = document.createElement('span');
    v.className = 'val';
    v.textContent = row.val + '\\n';
    line.appendChild(k);
    line.appendChild(v);
    panel.appendChild(line);
  });
}

var devBtn = document.getElementById('btn-dev');
var prodBtn = document.getElementById('btn-prod');

devBtn.addEventListener('click', function() {
  devBtn.classList.add('active');
  prodBtn.classList.remove('active');
  render(devOutput);
});

prodBtn.addEventListener('click', function() {
  prodBtn.classList.add('active');
  devBtn.classList.remove('active');
  render(prodOutput);
});

render(devOutput);`;

  return (
    <div className="space-y-8">

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 1: Hook                                                       */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Card>
        <CardContent className="pt-6">
          <div className="prose dark:prose-invert max-w-none">
            <p>
              You save a file. The page updates in the browser before your hand leaves the keyboard.
              Your component&apos;s state survived the edit. This is the dev loop the modern web
              ships, and it&apos;s shaped Vite&apos;s entire architecture: serve source as native ES
              modules, transform on demand, never bundle in development.
            </p>
            <p>
              To understand why that matters, you need to know what happened before. Older tools like
              Webpack were built when browsers could not load ES modules at all. They had no choice
              but to concatenate every source file into one giant bundle before serving anything.
              On a large project that could mean a 15-second cold start every time you started
              the dev server. Vite&apos;s answer was architectural: if modern browsers can load ES
              modules natively, stop bundling in dev and let the browser do the work. This module
              explains how those two pipelines — dev and prod — work, and where they differ in ways
              that will bite you.
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
              The confusion about Vite usually comes from treating it as a single thing. It is two
              things with different goals running from the same config. In development, Vite&apos;s
              job is speed: it serves your TypeScript and JSX source directly over the browser&apos;s
              native module system, transforming each file on demand with esbuild. Nothing is
              bundled. The browser fetches exactly the modules it needs, one request per file.
              In production, Vite&apos;s job is network efficiency: it hands the same source to
              Rollup, which bundles, tree-shakes, code-splits, and minifies into small hashed
              static files. Same source, two completely different pipelines. Once you hold both
              pipelines in your head simultaneously, every &quot;works in dev, breaks in prod&quot;
              bug becomes diagnosable in seconds.
            </p>
            <blockquote className="border-l-4 border-blue-500 pl-4 italic">
              &quot;Vite serves source as native ESM in dev, no bundling. For production, it bundles
              with Rollup. The dev loop is fast because the browser does more — and the prod build
              is small because Rollup does its job.&quot;
            </blockquote>
          </div>
        </CardContent>
      </Card>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 3: Step-by-step                                               */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <StepByStepExplanation
        title="What Vite does, in two phases"
        description="Six steps from source file to running app — in dev and in prod"
        steps={vitePipelineSteps}
      />

      {/* Optional: Two LayeredFlows (dev pipeline vs prod pipeline) */}
      <LayeredFlow
        title="Vite dev vs Vite build"
        description="Two completely different pipelines from the same source"
        stages={[
          { label: "Source", detail: ".ts/.tsx/.vue", color: "slate" },
          { label: "Vite dev server", detail: "esbuild transform on demand", color: "blue" },
          { label: "Browser fetches ESM", detail: "one request per module", color: "violet" },
          { label: "HMR via WebSocket", detail: "edits push updates", color: "emerald" },
        ]}
      />
      <LayeredFlow
        title=""
        description="Production: bundled, tree-shaken, code-split"
        stages={[
          { label: "Source", detail: ".ts/.tsx/.vue", color: "slate" },
          { label: "Rollup bundle", detail: "all modules combined", color: "amber" },
          { label: "Tree-shake", detail: "drop unused exports", color: "rose" },
          { label: "Code-split", detail: "chunk per route", color: "violet" },
          { label: "Minify + hash", detail: "static files", color: "emerald" },
        ]}
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 4: Playground                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <HTMLPlayground
        html={playgroundHtml}
        css={playgroundCss}
        js={playgroundJs}
        title="Dev pipeline vs prod pipeline"
        description="Toggle between what the same vite.config.ts produces in each mode."
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 5: Challenges                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Challenge
        question="Your code uses `import.meta.env.DEV ? 'localhost' : 'api.example.com'`. It works in dev. In prod the URL still says 'localhost'. What's wrong?"
        options={[
          {
            id: "a",
            text: "import.meta.env.DEV only exists in TypeScript, not JavaScript.",
          },
          {
            id: "b",
            text: "You're probably reading the variable from a cached file. Run vite build again and clear the dist folder.",
          },
          {
            id: "c",
            text: "import.meta.env.DEV is replaced at build time, not runtime — if the prod bundle was built with a stale env or local override, the value is wrong. Verify your build environment and CI variables.",
          },
          {
            id: "d",
            text: "It's a Vite bug; switch to a regular process.env.NODE_ENV check.",
          },
        ]}
        correctAnswerId="c"
        explanation={
          <>
            Vite replaces <code>import.meta.env.*</code> references at build time, baking the values
            into the bundle. If you build locally with <code>vite dev</code> running, or if your CI
            sets <code>NODE_ENV=development</code>, the prod bundle gets <code>DEV: true</code>.
            Always run <code>vite build</code> in a clean prod environment — Vite automatically sets{" "}
            <code>NODE_ENV=production</code> during <code>vite build</code>, so running the command
            in isolation is sufficient.
          </>
        }
      />

      <Challenge
        question="Your project uses Vite. Should you also configure Webpack as a fallback?"
        options={[
          {
            id: "a",
            text: "Yes — Webpack handles edge cases Vite doesn't.",
          },
          {
            id: "b",
            text: "Yes — Webpack is the industry standard.",
          },
          {
            id: "c",
            text: "No — Vite covers dev and prod; mixing two bundlers in one project doubles config complexity for marginal gain.",
          },
          {
            id: "d",
            text: "Yes — for legacy browsers Vite's esbuild transform doesn't support.",
          },
        ]}
        correctAnswerId="c"
        explanation={
          <>
            One bundler per project. Vite handles dev (esbuild) and prod (Rollup) internally; both
            are mature and battle-tested. Mixing Webpack adds two config formats and a second mental
            model with no real benefit. Legacy browser support (option d) has a real solution inside
            Vite itself: the <code>@vitejs/plugin-legacy</code> plugin generates a separate legacy
            bundle with Babel transforms and differential loading — no Webpack required.
          </>
        }
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 6: GotchaList                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <GotchaList
        items={[
          {
            title: "Dev and prod are different runtimes — import.meta.env.DEV is only true in dev; bake values carefully",
            body: (
              <>
                <code>import.meta.env.DEV</code> is not a variable that Vite reads at runtime — it is
                a static string substitution that happens during the build. If you build in the wrong
                environment, the wrong branch gets baked in. Always run <code>vite build</code> with{" "}
                <code>NODE_ENV=production</code>, which <code>vite build</code> sets automatically.
                Check your CI pipeline if the wrong value is shipping.
              </>
            ),
          },
          {
            title: "HMR preserves state across edits, but state can desync if you change a component's identity (rename function, swap default vs named export)",
            body: (
              <>
                React Fast Refresh identifies components by their function name. If you rename a
                component, React treats it as a new component and unmounts the old one — state is
                lost. Similarly, toggling between a default export and a named export in the same
                edit can confuse HMR. When you see HMR fail to preserve state, check whether the
                component&apos;s identity changed rather than just its body.
              </>
            ),
          },
          {
            title: "vite build uses Rollup; vite dev uses esbuild — different transform features; check both before relying on a corner case",
            body: (
              <>
                esbuild and Rollup have different levels of support for newer JavaScript syntax,
                decorators, and certain plugin transforms. Code that esbuild handles gracefully in dev
                may emit a Rollup error or produce different output in prod. When you adopt a new
                syntax feature or plugin, run <code>vite build</code> locally — not just the dev
                server — to confirm both pipelines agree.
              </>
            ),
          },
          {
            title: "Static assets in public/ aren't processed; assets imported from code are — pick the right location for what you're shipping",
            body: (
              <>
                Files in <code>public/</code> are copied verbatim to <code>dist/</code> with no
                hashing or optimization. They are referenced by their original path:{" "}
                <code>&lt;img src=&quot;/logo.png&quot; /&gt;</code>. Assets imported from source (
                <code>import logo from &quot;./logo.png&quot;</code>) are hashed, potentially
                optimized, and bundled. Use <code>public/</code> for files whose URL you need to
                control (favicons, <code>robots.txt</code>). Use source imports for everything the
                bundler should manage.
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
            Bundling exists because old browsers could not load ES modules natively — a{" "}
            <em>bundler</em> concatenates source files into deliverable assets. Modern browsers no
            longer need this in development.
          </>,
          <>
            Vite&apos;s dev server skips bundling entirely: it serves <code>.ts</code> and{" "}
            <code>.tsx</code> source as native ES modules, transforming each file on demand with
            esbuild. Cold starts are sub-second regardless of project size.
          </>,
          <>
            <em>HMR</em> pushes changed modules over a WebSocket without a full reload. State is
            preserved because only the changed module is swapped — siblings stay mounted.
          </>,
          <>
            <code>vite build</code> delegates to Rollup for production: tree-shaking drops unused
            exports, code-splitting creates on-demand chunks, and hashed filenames enable long-term
            caching.
          </>,
          <>
            <code>import.meta.env.*</code> values are replaced <strong>at build time</strong>. A
            prod bundle built in a dev environment ships the wrong values. Run{" "}
            <code>vite build</code> in a clean prod environment or CI.
          </>,
        ]}
        mentalModel="Vite serves source as native ESM in dev, no bundling. For production, it bundles with Rollup. The dev loop is fast because the browser does more — and the prod build is small because Rollup does its job."
      />

      {/* Alternatives — one paragraph after KeyTakeaways */}
      <Card>
        <CardContent className="pt-6 prose dark:prose-invert max-w-none">
          <p>
            <strong>Alternatives.</strong> <em>Webpack</em> is the industry-standard predecessor —
            endlessly configurable, slower than Vite, and the right pick if you have an established
            Webpack pipeline you can&apos;t migrate. <em>esbuild</em> is the fastest pure bundler —
            Vite uses it for transforms; you&apos;d use it directly for libraries or build tooling.{" "}
            <em>Rollup</em> is what Vite uses for prod builds — sharp at libraries, less
            feature-complete for apps. <em>Parcel</em> aims for zero-config with a friendly
            developer experience. Vite is the most popular pick for new apps in 2026 because the dev
            loop is fast and the prod output is small without configuration.
          </p>
        </CardContent>
      </Card>

    </div>
  );
}
