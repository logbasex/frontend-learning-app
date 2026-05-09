"use client";

import { Card, CardContent } from "@/components/ui/card";
import { HTMLPlayground } from "@/components/CodePlayground";
import { StepByStepExplanation, Step } from "@/components/StepByStepExplanation";
import { TerminalPlayground } from "@/components/TerminalPlayground";
import { Challenge } from "@/components/Challenge";
import { GotchaList } from "@/components/GotchaList";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { RoadmapLink } from "@/components/RoadmapLink";

export function Module_5_2_Content() {
  // Data blocks hoisted out of JSX for readability — listed in render order.
  const packageManagerSteps: Step[] = [
    {
      title: "Step 1: package.json declares dependencies",
      description: (
        <>
          <code>package.json</code> is the manifest that declares a project&apos;s
          dependencies and scripts. The <code>dependencies</code> field holds packages
          needed at runtime; <code>devDependencies</code> holds tools only needed during
          development (linters, test runners, bundlers); <code>peerDependencies</code> declares
          compatibility requirements a consumer must satisfy. Every entry is a name paired
          with a version <em>range</em> — not an exact version. The manifest says what you want;
          it does not say what you will get.
        </>
      ),
      code: `// package.json — the manifest
{
  "name": "my-app",
  "scripts": {
    "dev":   "vite",
    "build": "tsc && vite build",
    "test":  "vitest run"
  },
  "dependencies": {
    "react":     "^19.0.0",   // runtime — ships to users
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "vite":       "^6.0.0",   // build-time only
    "typescript": "^5.7.0",
    "vitest":     "^3.0.0"
  },
  "peerDependencies": {
    // used by libraries, not apps — "I work with react ^19"
  }
}`,
    },
    {
      title: "Step 2: Semver — major.minor.patch",
      description: (
        <>
          <em>Semver</em> (versioning scheme <code>major.minor.patch</code> — break, add, fix)
          is the convention every npm package uses. A MAJOR bump means a breaking change: your
          code may stop working. A MINOR bump adds a feature without breaking existing behavior.
          A PATCH bump fixes a bug. The prefix characters in your manifest control the range the
          package manager is allowed to install: <code>^</code> (caret) accepts any compatible
          major version; <code>~</code> (tilde) accepts only patch updates; a bare version pins
          exactly.
        </>
      ),
      code: `// Version range prefixes
"react": "^19.0.0"  // ← caret: ≥19.0.0 and <20.0.0
"react": "~19.0.0"  // ← tilde: ≥19.0.0 and <19.1.0
"react": "19.0.0"   // ← bare:  exactly 19.0.0

// Semver: 19  .  3  .  1
//         ↑       ↑     ↑
//       MAJOR  MINOR  PATCH
//       break   add    fix

// ^ accepts: 19.0.0, 19.1.4, 19.9.99 — NOT 20.0.0
// ~ accepts: 19.0.0, 19.0.9           — NOT 19.1.0
// bare:      19.0.0 only`,
    },
    {
      title: "Step 3: The lockfile resolves",
      description: (
        <>
          The <em>lockfile</em> (the resolved, exact dependency graph — <code>pnpm-lock.yaml</code>,
          &nbsp;<code>package-lock.json</code>, or <code>yarn.lock</code>) records the <em>exact</em>{" "}
          version of every direct and transitive dependency. When you run <code>pnpm install</code>,
          the package manager resolves your ranges to real versions, then writes those choices to
          the lockfile. Commit it. The next developer&apos;s <code>pnpm install</code> reads the
          lockfile and installs the identical graph — no surprises. Without it, two machines
          installing on different days can silently get different versions.
        </>
      ),
      code: `# pnpm-lock.yaml (excerpt)
lockfileVersion: '9.0'

importers:
  .:
    dependencies:
      react:
        specifier: ^19.0.0       # ← what package.json says (range)
        version: 19.3.1          # ← what was installed (exact)
    devDependencies:
      vite:
        specifier: ^6.0.0
        version: 6.2.4

packages:
  react@19.3.1:
    resolution:
      integrity: sha512-...    # ← tamper-evident hash
    dependencies:
      loose-envify: ^1.1.0      # ← transitive dep, also locked`,
    },
    {
      title: "Step 4: pnpm — content-addressed store + symlinks",
      description: (
        <>
          <em>pnpm</em> — a package manager that uses a content-addressed store and symlinks
          for fast installs and small disk usage — holds exactly one copy of every package
          version in <code>~/.local/share/pnpm/store</code>. Each project&apos;s{" "}
          <code>node_modules</code> is a tree of symlinks into that store; nothing is ever
          extracted twice. Three consequences: installs are fast (cache hit on every package
          you&apos;ve ever installed); disk usage stays small across many projects; and{" "}
          <em>phantom dependencies</em> are impossible — your code cannot reach a package it
          has not declared, because the symlink structure only exposes what is in your own{" "}
          <code>package.json</code>.
        </>
      ),
      code: `# npm/yarn: copy every package into node_modules per project
project-a/node_modules/react/    # 7 MB
project-b/node_modules/react/    # 7 MB again — duplicate on disk

# pnpm: one copy in the global store, symlinks in each project
~/.local/share/pnpm/store/
  react@19.3.1/                  # 7 MB — stored once

project-a/node_modules/.pnpm/react@19.3.1/ -> store
project-b/node_modules/.pnpm/react@19.3.1/ -> store (same inode)

# Phantom dependency: blocked by pnpm
# node_modules/some-transitive/  ← NOT accessible unless declared
import { x } from "some-transitive"; // Error — pnpm surfaces this bug`,
    },
    {
      title: "Step 5: Workspaces — monorepo basics",
      description: (
        <>
          A <em>workspace</em> (a root <code>package.json</code> orchestrating multiple
          sub-packages in one repo) lets you split a product into separately versioned
          packages while sharing a single install and a single lockfile. The root{" "}
          <code>package.json</code> declares which directories are packages via the{" "}
          <code>workspaces</code> field (or a <code>pnpm-workspace.yaml</code>). Running{" "}
          <code>pnpm install</code> from the root resolves cross-package dependencies locally
          first — if <code>app</code> depends on <code>lib@workspace:*</code>, pnpm symlinks
          the local <code>packages/lib</code> instead of fetching from the registry.
        </>
      ),
      code: `# Monorepo layout
my-repo/
  pnpm-workspace.yaml
  package.json          # root — no source code, just scripts
  packages/
    lib/
      package.json      # { "name": "lib", "version": "1.0.0" }
      src/index.ts
    app/
      package.json      # { "name": "app", "dependencies": { "lib": "workspace:*" } }
      src/main.tsx

# pnpm-workspace.yaml
packages:
  - "packages/*"

# pnpm install from root → resolves lib as a local symlink
# pnpm --filter app build  → builds only the app package`,
    },
    {
      title: "Step 6: When to pin vs float",
      description: (
        <>
          The right versioning strategy depends on who consumes the package. For an
          application you deploy, the lockfile already pins everything — the range in{" "}
          <code>package.json</code> only matters when you regenerate the lockfile. For a
          library you publish to npm, use a range (<code>^x.y.z</code>) in{" "}
          <code>peerDependencies</code> so consumers can deduplicate React or any shared
          dependency. For CI tools (linters, test runners), consider pinning the exact
          version so a new release from the tool author can&apos;t silently break your
          pipeline on a Tuesday morning.
        </>
      ),
      code: `// Application (deployed) — range is fine; lockfile is the real pin
"dependencies": {
  "react": "^19.0.0"    // lockfile pins to 19.3.1; range says "upgrade when I ask"
}

// Library you publish — use peerDependencies + range
"peerDependencies": {
  "react": "^19.0.0"    // "I work with any 19.x; consumer provides React"
}
// DO NOT put React in dependencies for a library — you'd ship two Reacts

// CI tool — pin to protect your pipeline
"devDependencies": {
  "eslint": "9.14.0"    // exact — no surprises from a bad patch release
}`,
    },
  ];

  const workspaceTerminalLines = [
    { command: "pnpm init", output: "Wrote to /tmp/demo/package.json" },
    {
      command: "echo 'packages:\\n  - \"packages/*\"' > pnpm-workspace.yaml",
      output: "",
    },
    { command: "mkdir -p packages/lib packages/app", output: "" },
    {
      command: "pnpm --filter ./packages/lib init",
      output: "Wrote to /tmp/demo/packages/lib/package.json",
    },
    {
      command: "pnpm --filter ./packages/app init",
      output: "Wrote to /tmp/demo/packages/app/package.json",
    },
    {
      command: "pnpm --filter app add lib@workspace:*",
      output:
        "Progress: resolved 1, reused 1, downloaded 0, added 1\nProgress: done\n+ lib 1.0.0 <- ../lib",
    },
    {
      command: "ls -la packages/app/node_modules/lib",
      output:
        "lrwxr-xr-x  1 you  staff  20 ../../lib  ← symlink, not copy",
    },
  ];

  const playgroundHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Manifest vs Lockfile</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <div class="layout">
    <div class="panel">
      <div class="panel-header">package.json <span class="badge manifest">manifest</span></div>
      <pre id="manifest" class="code-block">
{
  "dependencies": {
    <span class="dep" data-pkg="react">"react": "^19.0.0"</span>,
    <span class="dep" data-pkg="react-dom">"react-dom": "^19.0.0"</span>,
    <span class="dep" data-pkg="zod">"zod": "^3.23.0"</span>
  }
}</pre>
    </div>
    <div class="panel">
      <div class="panel-header">pnpm-lock.yaml <span class="badge lockfile">lockfile</span></div>
      <pre id="lockfile" class="code-block">
<span class="lock-entry" data-pkg="react">react@19.3.1:
  specifier: ^19.0.0
  integrity: sha512-aBc...</span>

<span class="lock-entry" data-pkg="react-dom">react-dom@19.3.1:
  specifier: ^19.0.0
  integrity: sha512-dEf...
  deps:
    react: 19.3.1</span>

<span class="lock-entry" data-pkg="zod">zod@3.24.2:
  specifier: ^3.23.0
  integrity: sha512-gHi...</span>

<span class="lock-entry transitive" data-pkg="react">loose-envify@1.4.0:
  (transitive dep of react)
  integrity: sha512-xyz...</span>
</pre>
    </div>
  </div>
  <p class="hint" id="hint">Click a dependency in package.json to see what it resolved to.</p>
  <script src="/script.js"></script>
</body>
</html>`;

  const playgroundCss = `* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: system-ui, sans-serif;
  padding: 16px;
  background: #0f172a;
  color: #e2e8f0;
  min-height: 100vh;
}
.layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.panel {
  background: #1e293b;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #334155;
}
.panel-header {
  background: #273548;
  padding: 8px 12px;
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid #334155;
}
.badge {
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
}
.badge.manifest  { background: #3b82f6; color: white; }
.badge.lockfile  { background: #7c3aed; color: white; }
.code-block {
  padding: 12px;
  font-family: monospace;
  font-size: 0.78rem;
  line-height: 1.7;
  white-space: pre-wrap;
  word-break: break-all;
  color: #94a3b8;
}
.dep {
  cursor: pointer;
  color: #67e8f9;
  border-radius: 3px;
  padding: 0 2px;
  transition: background 0.15s;
}
.dep:hover { background: #1e4060; }
.dep.active { background: #1d4ed8; color: #fff; }
.lock-entry {
  display: block;
  padding: 4px 6px;
  border-radius: 4px;
  transition: background 0.2s;
  color: #94a3b8;
}
.lock-entry.highlight { background: #1d4ed8; color: #e0f2fe; }
.lock-entry.transitive { color: #64748b; font-style: italic; }
.lock-entry.transitive.highlight { background: #312e81; color: #c7d2fe; }
.hint {
  margin-top: 12px;
  font-size: 0.8rem;
  color: #64748b;
  text-align: center;
}`;

  const playgroundJs = `// Try this: click "react" in the package.json on the left. Watch the
// matching entry in pnpm-lock.yaml on the right highlight, including
// its transitive deps. The lockfile is the resolved graph; the manifest
// is just the wishlist.

const deps = document.querySelectorAll('.dep');
const entries = document.querySelectorAll('.lock-entry');
const hint = document.getElementById('hint');

deps.forEach(function(dep) {
  dep.addEventListener('click', function() {
    const pkg = dep.dataset.pkg;

    // reset
    deps.forEach(function(d) { d.classList.remove('active'); });
    entries.forEach(function(e) { e.classList.remove('highlight'); });

    // activate clicked dep
    dep.classList.add('active');

    // highlight matching lockfile entries
    const matched = document.querySelectorAll('.lock-entry[data-pkg="' + pkg + '"]');
    matched.forEach(function(e) { e.classList.add('highlight'); });

    hint.textContent =
      'Showing lockfile entries for "' + pkg + '" — ' +
      matched.length + ' entr' + (matched.length === 1 ? 'y' : 'ies') +
      ' (direct + transitive).';
  });
});`;

  return (
    <div className="space-y-8">

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 1: Hook                                                       */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Card>
        <CardContent className="pt-6">
          <div className="prose dark:prose-invert max-w-none">
            <p>
              Your <code>node_modules</code> is enormous, your install is slow, and a
              colleague&apos;s machine just produced a different bug than yours from the same
              commit. Each one is the package manager talking. Once you see what{" "}
              <code>package.json</code> declares vs what the lockfile resolves, the surprises
              stop.
            </p>
            <p>
              The root cause of all three problems is the same: without a committed lockfile,
              two installs resolving <code>&quot;react&quot;: &quot;^19.0.0&quot;</code> on
              different days can land on different exact versions — and a transitive dependency
              three levels deep could be the one that changed. Package managers exist to make
              that resolution deterministic. Understanding what they pin, why they do it, and
              how pnpm does it faster is what this module is about.
            </p>
          </div>
          <div className="mt-4">
            <RoadmapLink url="https://roadmap.sh/frontend" />
          </div>
        </CardContent>
      </Card>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 2: Mental model                                               */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Card>
        <CardContent className="pt-6">
          <div className="prose dark:prose-invert max-w-none">
            <p>
              Think of <code>package.json</code> as a shopping list and the lockfile as the
              exact receipt after checkout. The shopping list says &quot;any 19.x of
              React.&quot; The receipt says exactly which jar, from which shelf, with which
              batch number, was actually put in your cart. The receipt is what you give to the
              warehouse to reproduce the order — the shopping list is not enough. Commit the
              receipt.
            </p>
            <blockquote className="border-l-4 border-blue-500 pl-4 italic">
              &quot;package.json declares; the lockfile resolves. The lockfile is the contract
              — commit it. Use pnpm: same npm registry, content-addressed store, symlinks
              instead of copies.&quot;
            </blockquote>
          </div>
        </CardContent>
      </Card>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 3: Step-by-step                                               */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <StepByStepExplanation
        title="From package.json to a clean install"
        description="Six steps from manifest to reproducible node_modules"
        steps={packageManagerSteps}
      />

      {/* Optional: TerminalPlayground (pnpm workspace) */}
      <TerminalPlayground
        title="A pnpm workspace from scratch"
        description="Two packages, one of which depends on the other"
        lines={workspaceTerminalLines}
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 4: Playground                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <HTMLPlayground
        html={playgroundHtml}
        css={playgroundCss}
        js={playgroundJs}
        title="Manifest vs Lockfile — click to explore"
        description="Click a dependency in package.json and watch the resolved entries light up in pnpm-lock.yaml."
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 5: Challenges                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Challenge
        question="What does the lockfile do that package.json doesn&apos;t?"
        options={[
          {
            id: "a",
            text: "Records the exact resolved version of every direct AND transitive dependency, so two machines install the same graph.",
          },
          {
            id: "b",
            text: "Lists the dependencies the project author wrote down.",
          },
          {
            id: "c",
            text: "Encrypts the dependency tree.",
          },
          {
            id: "d",
            text: "Configures npm/pnpm itself.",
          },
        ]}
        correctAnswerId="a"
        explanation={
          <>
            <code>package.json</code> declares ranges (e.g.{" "}
            <code>&quot;react&quot;: &quot;^19.0.0&quot;</code>); the lockfile records what
            those ranges resolved to <em>at install time</em> (e.g. exactly{" "}
            <code>19.3.1</code>), plus every transitive dep. Without committing the lockfile,
            two machines installing on different days can get different versions and behave
            differently — the entire point.
          </>
        }
      />

      <Challenge
        question="You&apos;re publishing a library called acme-utils. What range should you put on react as a peerDependency?"
        options={[
          {
            id: "a",
            text: '"react": "19.3.1" — pinned to one version.',
          },
          {
            id: "b",
            text: '"react": "^19.0.0" — any 19.x.',
          },
          {
            id: "c",
            text: '"react": "*" — any version.',
          },
          {
            id: "d",
            text: '"react": "~19.2.0" — only 19.2.x patches.',
          },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            peerDependencies should accept the widest range you&apos;ve tested.{" "}
            <code>^19.0.0</code> lets consumers dedupe a single React install across many
            libraries. Pinning (a) breaks dedupe and forces holders to upgrade in lockstep.{" "}
            <code>*</code> is too loose — you haven&apos;t tested it against every version of
            React that exists.
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
              "Floating ranges (^1.2.3) install different versions on different machines unless you commit the lockfile",
            body: (
              <>
                The range <code>^1.2.3</code> is a <em>constraint</em>, not a pin. On Monday
                the resolver picks <code>1.2.3</code>. On Friday a patch ships and the resolver
                picks <code>1.2.5</code>. Without a committed lockfile there is no way to know
                which version your colleague has — or which one broke the build.
              </>
            ),
          },
          {
            title:
              "npm ci and pnpm install --frozen-lockfile ignore the manifest if it conflicts with the lockfile — that&apos;s the point in CI",
            body: (
              <>
                <code>pnpm install --frozen-lockfile</code> (and <code>npm ci</code>) will
                error rather than update the lockfile when the manifest and lockfile disagree.
                That is a feature, not a bug: CI should reproduce the exact tree developers
                tested, not silently resolve a new one.
              </>
            ),
          },
          {
            title:
              "Phantom dependencies (using a transitive without declaring it) work in npm/yarn but fail with pnpm — that&apos;s a feature, not a bug",
            body: (
              <>
                In npm and yarn, <code>node_modules</code> is a flat directory. You can{" "}
                <code>import</code> any package present, whether you declared it or not.
                pnpm&apos;s symlink structure blocks that: your code can only reach what is
                in your own <code>package.json</code>. Migrating to pnpm surfaces hidden
                implicit dependencies — and that is exactly the point.
              </>
            ),
          },
          {
            title:
              "peerDependencies aren&apos;t auto-installed; they let you say what&apos;s compatible — the consumer installs the actual version",
            body: (
              <>
                When you publish a library with <code>&quot;react&quot;: &quot;^19.0.0&quot;</code>{" "}
                in <code>peerDependencies</code>, you are saying &quot;this library works with
                React 19.&quot; You are not installing React — the application that installs
                your library already has React in its own <code>dependencies</code>.
                pnpm will warn if the consumer&apos;s installed version is outside the range
                you declared.
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
            <code>package.json</code> declares intent with version ranges.{" "}
            The lockfile records the exact resolved version of every direct and transitive
            dependency. Commit the lockfile — it is the contract.
          </>,
          <>
            Semver: <strong>major.minor.patch</strong> — breaking change, new feature, bug fix.
            The <code>^</code> caret accepts any compatible minor/patch; <code>~</code> accepts
            only patches; a bare version pins exactly.
          </>,
          <>
            pnpm stores each package version once in a global content-addressed store and
            symlinks into each project&apos;s <code>node_modules</code>. Installs are fast,
            disk usage stays small, and phantom dependencies are surfaced — not silently allowed.
          </>,
          <>
            A workspace (monorepo root with <code>pnpm-workspace.yaml</code>) lets multiple
            packages share one lockfile and resolve cross-package dependencies locally via{" "}
            <code>workspace:*</code> protocol.
          </>,
          <>
            Pin vs float: for apps the lockfile is the real pin — float in the manifest.
            For libraries you publish, use a range (<code>^x.y.z</code>) in{" "}
            <code>peerDependencies</code>. For CI tools, consider pinning to avoid a bad
            release breaking your pipeline.
          </>,
        ]}
        mentalModel="package.json declares; the lockfile resolves. The lockfile is the contract — commit it. Use pnpm: same npm registry, content-addressed store, symlinks instead of copies."
      />

      {/* Alternatives — one paragraph after KeyTakeaways */}
      <Card>
        <CardContent className="pt-6 prose dark:prose-invert max-w-none">
          <p>
            <strong>Alternatives.</strong> <em>npm</em> ships with Node and is the default;
            it works everywhere but its install is slower and its disk usage larger.{" "}
            <em>yarn</em> (Berry) introduced PnP — no <code>node_modules</code>, packages
            resolved from a zip cache — and is fast but has more compatibility issues with
            tools that expect <code>node_modules</code>. <em>pnpm</em> hits the sweet spot in
            2026: same registry, fast installs, smaller disk, and the strict resolution
            surfaces hidden dependency bugs. Pick npm if you can&apos;t change the default;
            otherwise pnpm.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
