"use client";

import { Card, CardContent } from "@/components/ui/card";
import { HTMLPlayground } from "@/components/CodePlayground";
import { StepByStepExplanation, Step } from "@/components/StepByStepExplanation";
import { CodeComparison } from "@/components/CodeComparison";
import { Challenge } from "@/components/Challenge";
import { GotchaList } from "@/components/GotchaList";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { RoadmapLink } from "@/components/RoadmapLink";

export function Module_7_7_Content() {
  // Data blocks hoisted out of JSX for readability — listed in render order.
  const webToNativeSteps: Step[] = [
    {
      title: "Step 1: Electron — Chromium + Node, packaged",
      description: (
        <>
          Electron bundles a complete Chromium browser and a Node.js runtime into your distributable.
          Your web app runs inside that bundled Chromium; a Node process handles all native work —
          filesystem, OS notifications, window management — and talks to the renderer over{" "}
          <strong>IPC (inter-process communication)</strong>. The same web stack you already know
          works unchanged. Chromium&apos;s version is pinned per Electron release, so rendering is
          identical on every user&apos;s machine regardless of what browser they have installed.
        </>
      ),
      code: `// Electron architecture — two processes
//
// main process (Node.js)
//   - creates BrowserWindow instances
//   - handles filesystem, notifications, menus
//   - exposes APIs to the renderer over IPC
//
// renderer process (Chromium page)
//   - runs your normal HTML/CSS/JS
//   - calls contextBridge APIs to reach Node
//
// They never share memory; all communication is
// message-passing over the IPC bridge.`,
    },
    {
      title: "Step 2: Memory and bundle cost",
      description: (
        <>
          The predictability of a bundled Chromium comes at a cost: roughly <strong>150 MB on disk</strong>{" "}
          before a single line of your code is counted, and roughly <strong>300 MB of RAM at idle</strong>.
          Per app. Most users running VS Code or Slack don&apos;t notice — their machine has 16 GB and the
          extra memory buys them a predictable, battle-tested experience. Some teams care intensely:
          a background utility that sits in the tray cannot justify 300 MB of idle overhead. Know the
          cost before you commit to the stack.
        </>
      ),
      code: `# Typical Electron app on disk
$ du -sh /Applications/Visual\ Studio\ Code.app
 356M    /Applications/Visual Studio Code.app

# Idle memory (one window, no files open)
$ ps aux | grep "Electron Helper"
# Main process: ~80 MB
# Renderer:    ~120 MB
# GPU process: ~50 MB
# Total:       ~250-350 MB at idle`,
    },
    {
      title: "Step 3: Tauri — native webview + Rust",
      description: (
        <>
          Tauri flips the model. Instead of bundling a browser, it uses the OS&apos;s built-in webview
          — <strong>WebKit on macOS</strong>, <strong>WebKitGTK on Linux</strong>,{" "}
          <strong>Edge WebView2 on Windows</strong> — and a small Rust binary for native work. The
          result: roughly <strong>5&ndash;10 MB on disk</strong> and <strong>30&ndash;50 MB of RAM at idle</strong>.
          Your frontend code (React, Vue, plain HTML) runs in that native webview. Rust commands
          exposed to the renderer are the equivalent of Node&apos;s native APIs — but they&apos;re
          typed, memory-safe, and run in a Rust process your renderer cannot directly address.
        </>
      ),
      code: `// Tauri architecture — also two processes
//
// Rust core (native binary)
//   - owns the window and native APIs
//   - exposes #[tauri::command] functions to the renderer
//   - handles filesystem, OS, updates
//
// WebView (OS-native renderer)
//   - runs your HTML/CSS/JS as-is
//   - calls Tauri's invoke() to reach Rust
//
// Key difference from Electron: the renderer is
// whatever webview the OS already has installed —
// nothing extra is shipped with your binary.`,
    },
    {
      title: "Step 4: WebView differences cost time",
      description: (
        <>
          Electron&apos;s bundled Chromium means one rendering engine everywhere — the same engine that
          powers Chrome. Tauri&apos;s native webview means three rendering engines: WebKit on macOS,
          WebKitGTK on Linux, Edge WebView2 on Windows. They are not identical. CSS features land at
          different times; JavaScript engine quirks differ; some Flexbox and Grid edge cases render
          differently. Tauri abstracts most of this behind a consistent API, but <em>expect
          platform-specific bugs</em>. A team without someone willing to test on all three platforms
          will have gaps.
        </>
      ),
      code: `# Example: CSS Grid subgrid
# WebKit (macOS):     supported since Safari 16 (2022)
# WebKitGTK (Linux):  depends on distro's WebKitGTK version
# Edge WebView2:      supported since Chromium 117 (2023)
#
# Result: "works on macOS, broken on Ubuntu 22.04"
# Exactly the early-2000s browser-quirk debugging
# you thought you left behind.
#
# Rule: test on all three platforms before shipping.`,
    },
    {
      title: "Step 5: IPC and security",
      description: (
        <>
          Both Electron and Tauri expose a JS-to-native bridge — IPC — so your renderer can do things
          like read files, open dialogs, or trigger OS notifications. The critical security insight is
          the <strong>allowlist model</strong>: which native commands can the renderer call? Tauri
          enforces an explicit allowlist in <code>tauri.conf.json</code>; the renderer can only invoke
          commands listed there (default-deny). Electron&apos;s equivalent is disabling{" "}
          <code>nodeIntegration</code> in the renderer and using a preload script with{" "}
          <code>contextBridge</code> to expose only the specific APIs you choose. In both cases,{" "}
          <strong>default-allow is a security disaster</strong>: a reflected XSS in the renderer becomes
          full local file system access — read, write, execute.
        </>
      ),
      code: `// Tauri: tauri.conf.json (security boundary)
{
  "tauri": {
    "allowlist": {
      "fs": {
        "readFile": true,    // renderer may read files
        "writeFile": false,  // renderer may NOT write files
        "scope": ["$APPDATA/**"]  // scoped to app data only
      },
      "dialog": {
        "open": true         // renderer may open file picker
      }
      // everything else is denied by default
    }
  }
}`,
    },
    {
      title: "Step 6: Auto-update is non-trivial",
      description: (
        <>
          Both Electron and Tauri ship first-party auto-update mechanisms. Both have real caveats.
          On <strong>macOS</strong>, distributing outside the App Store requires code signing with an
          Apple Developer certificate and <em>notarization</em> — Apple&apos;s automated malware scan.
          Without notarization, macOS Gatekeeper blocks the app for new users. On <strong>Windows</strong>,
          Authenticode signing is technically optional but practically required for a clean install
          experience (unsigned apps trigger SmartScreen warnings). Setting up code signing in CI
          is its own subproject: certificates, signing servers, and pipeline secrets. Budget for it
          before you promise an auto-updating desktop app.
        </>
      ),
      code: `# macOS distribution checklist
# 1. Apple Developer account ($99/year)
# 2. Developer ID Application certificate (code signing)
# 3. Build: tauri build --target universal-apple-darwin
# 4. Notarize the .dmg: xcrun notarytool submit ...
# 5. Staple the ticket: xcrun stapler staple ...
# 6. Upload to your update server
#
# Only after all six steps will Gatekeeper allow the app
# on a fresh macOS install without a security warning.`,
    },
  ];

  const electronCode = `const { app, BrowserWindow } = require('electron');

app.whenReady().then(() => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // Default-deny is best practice — never enable
      // nodeIntegration in the renderer
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  win.loadURL('http://localhost:5173');
});`;

  const tauriCode = `// src-tauri/src/main.rs
fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![greet])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[tauri::command]
fn greet(name: &str) -> String {
  format!("Hello, {}!", name)
}`;

  const playgroundHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Tauri Security Model</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <div class="container">
    <h2>Tauri security boundary — annotated</h2>
    <p class="subtitle">The allowlist in <code>tauri.conf.json</code> is the only gate between renderer XSS and your file system.</p>
    <div class="split">
      <div class="panel">
        <div class="panel-header rust">src-tauri/src/main.rs</div>
        <pre class="code" id="rust-code"></pre>
      </div>
      <div class="panel">
        <div class="panel-header conf">tauri.conf.json (allowlist)</div>
        <pre class="code" id="conf-code"></pre>
        <div class="annotations" id="annotations"></div>
      </div>
    </div>
  </div>
  <script src="/script.js"></script>
</body>
</html>`;

  const playgroundCss = `* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: system-ui, sans-serif;
  background: #0f172a;
  color: #e2e8f0;
  padding: 20px;
  min-height: 100vh;
}
.container { max-width: 900px; margin: 0 auto; }
h2 { font-size: 1rem; font-weight: 600; margin-bottom: 6px; color: #f1f5f9; }
.subtitle { font-size: 0.78rem; color: #94a3b8; margin-bottom: 16px; }
.split { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
@media (max-width: 640px) { .split { grid-template-columns: 1fr; } }
.panel { background: #1e293b; border-radius: 8px; overflow: hidden; }
.panel-header {
  padding: 8px 12px;
  font-size: 0.72rem;
  font-weight: 600;
  font-family: monospace;
}
.panel-header.rust { background: #7c3aed; color: #ede9fe; }
.panel-header.conf { background: #0369a1; color: #e0f2fe; }
.code {
  padding: 12px;
  font-family: 'Fira Code', 'Cascadia Code', monospace;
  font-size: 0.72rem;
  line-height: 1.6;
  white-space: pre;
  overflow-x: auto;
  color: #cbd5e1;
}
.allow { color: #4ade80; }
.deny  { color: #f87171; }
.scope { color: #fbbf24; }
.cmd   { color: #60a5fa; }
.annotations { padding: 12px; border-top: 1px solid #334155; }
.ann-item {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  margin-bottom: 8px;
  font-size: 0.72rem;
}
.ann-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 4px;
}
.ann-dot.allow { background: #4ade80; }
.ann-dot.deny  { background: #f87171; }
.ann-dot.scope { background: #fbbf24; }
.ann-text { color: #94a3b8; line-height: 1.4; }`;

  const playgroundJs = `// Try this: in the tauri.conf.json on the right, find the "allowlist" key.
// That's the security boundary — the renderer can ONLY call Rust commands
// explicitly listed there. Default-deny + per-command allowlist is the
// safe pattern; default-allow turns every renderer XSS into RCE.

const rustLines = [
  { text: '// src-tauri/src/main.rs', cls: '' },
  { text: '', cls: '' },
  { text: '#[tauri::command]', cls: 'cmd' },
  { text: 'fn read_file(path: &str) -> String {', cls: 'cmd' },
  { text: '    fs::read_to_string(path).unwrap()', cls: '' },
  { text: '}', cls: '' },
  { text: '', cls: '' },
  { text: '#[tauri::command]', cls: 'cmd' },
  { text: 'fn greet(name: &str) -> String {', cls: 'cmd' },
  { text: '    format!("Hello, {}!", name)', cls: '' },
  { text: '}', cls: '' },
  { text: '', cls: '' },
  { text: 'fn main() {', cls: '' },
  { text: '  tauri::Builder::default()', cls: '' },
  { text: '    .invoke_handler(', cls: '' },
  { text: '      tauri::generate_handler![', cls: '' },
  { text: '        read_file, greet', cls: 'cmd' },
  { text: '      ])', cls: '' },
  { text: '    .run(tauri::generate_context!())', cls: '' },
  { text: '    .expect("error running app");', cls: '' },
  { text: '}', cls: '' },
];

const confLines = [
  { text: '{', cls: '' },
  { text: '  "tauri": {', cls: '' },
  { text: '    "allowlist": {', cls: '' },
  { text: '      "fs": {', cls: '' },
  { text: '        "readFile": true,   // ALLOWED', cls: 'allow' },
  { text: '        "writeFile": false, // DENIED', cls: 'deny' },
  { text: '        "scope": [', cls: '' },
  { text: '          "$APPDATA/**"', cls: 'scope' },
  { text: '        ]', cls: '' },
  { text: '      },', cls: '' },
  { text: '      "dialog": {', cls: '' },
  { text: '        "open": true        // ALLOWED', cls: 'allow' },
  { text: '      }', cls: '' },
  { text: '      // read_file listed above:', cls: '' },
  { text: '      // renderer CAN call it', cls: 'allow' },
  { text: '      // greet is NOT listed:', cls: '' },
  { text: '      // renderer CANNOT call it', cls: 'deny' },
  { text: '    }', cls: '' },
  { text: '  }', cls: '' },
  { text: '}', cls: '' },
];

const annotations = [
  { cls: 'allow', text: 'ALLOWED — renderer may call fs::read_file (scoped to $APPDATA)' },
  { cls: 'deny',  text: 'DENIED — writeFile is false; XSS cannot write arbitrary files' },
  { cls: 'scope', text: 'SCOPE — even allowed reads are path-scoped; no /etc/passwd access' },
];

function renderLines(el, lines) {
  const fragment = document.createDocumentFragment();
  lines.forEach((line, i) => {
    if (i > 0) fragment.appendChild(document.createTextNode('\\n'));
    if (line.cls) {
      const span = document.createElement('span');
      span.className = line.cls;
      span.textContent = line.text;
      fragment.appendChild(span);
    } else {
      fragment.appendChild(document.createTextNode(line.text));
    }
  });
  el.appendChild(fragment);
}

function renderAnnotations(el, items) {
  items.forEach(a => {
    const div = document.createElement('div');
    div.className = 'ann-item';
    const dot = document.createElement('span');
    dot.className = 'ann-dot ' + a.cls;
    const text = document.createElement('span');
    text.className = 'ann-text';
    text.textContent = a.text;
    div.appendChild(dot);
    div.appendChild(text);
    el.appendChild(div);
  });
}

renderLines(document.getElementById('rust-code'), rustLines);
renderLines(document.getElementById('conf-code'), confLines);
renderAnnotations(document.getElementById('annotations'), annotations);`;

  return (
    <div className="space-y-8">

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 1: Hook                                                       */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Card>
        <CardContent className="pt-6">
          <div className="prose dark:prose-invert max-w-none">
            <p>
              VS Code is Electron. Slack is Electron. Discord is Electron. Each ships ~150 MB of
              Chromium plus your app code; each takes ~300 MB of RAM at idle; each is &quot;the worst
              of both worlds&quot; until you remember the alternative is two native codebases. Tauri
              is the modern argument: same web stack, native OS webview, Rust backend. Smaller
              bundles, smaller memory, tighter security model — at the cost of a Rust toolchain in
              your build.
            </p>
            <p>
              The right pick depends on what your team can afford to ship and maintain. A six-person
              TypeScript team with a hard deadline and no Rust experience is not in the same position
              as a team with Rust engineers and six months to spare. This module gives you the mental
              model to make that call, and shows you exactly where the security boundary lives —
              because getting it wrong turns a renderer bug into a local file system exploit.
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
              Both Electron and Tauri let you ship a web app as a native desktop binary. The
              difference is what runs your frontend code. Electron bundles its own Chromium so the
              rendering environment is identical everywhere — predictable, fat, and battle-tested.
              Tauri delegates rendering to whatever webview the OS already ships — lean, fast, but
              with three distinct rendering engines across Windows, macOS, and Linux. The security
              model also differs: both use an IPC bridge between the renderer and native code, but
              the defaults push in opposite directions. Understanding which tradeoff matters for your
              project is the whole game.
            </p>
            <blockquote className="border-l-4 border-blue-500 pl-4 italic">
              &quot;Electron bundles Chromium + Node into your app — fat but predictable. Tauri uses
              the OS webview + a Rust backend — lean but with WebView quirks across platforms. Pick
              by what you can afford to ship and maintain.&quot;
            </blockquote>
          </div>
        </CardContent>
      </Card>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 3: Step-by-step                                               */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <StepByStepExplanation
        title="From web app to native binary"
        description="Six steps from bundled Chromium to native webview — and where security fits"
        steps={webToNativeSteps}
      />

      {/* Optional: CodeComparison (Electron vs Tauri main process) */}
      <CodeComparison
        title="Hello world: Electron vs Tauri"
        description="Same window, two stacks"
        oldCode={{
          title: "Electron main.js",
          code: electronCode,
          language: "javascript",
          pros: [
            "Zero Rust required — pure TypeScript/JavaScript",
            "Same Chromium on every platform",
          ],
          cons: [
            "~150 MB bundle, ~300 MB RAM idle",
            "Chromium security surface in every install",
          ],
        }}
        newCode={{
          title: "Tauri main.rs",
          code: tauriCode,
          language: "rust",
          pros: [
            "~5-10 MB bundle, ~30-50 MB RAM idle",
            "Rust memory safety in the native process",
          ],
          cons: [
            "Rust toolchain required in CI",
            "Three distinct webview engines across OSes",
          ],
        }}
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 4: Playground                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <HTMLPlayground
        html={playgroundHtml}
        css={playgroundCss}
        js={playgroundJs}
        title="Tauri allowlist — the security boundary"
        description="Read the annotated tauri.conf.json. The allowlist is the only gate between the renderer and your native Rust commands."
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 5: Challenges                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Challenge
        question="Your team builds VS Code-like dev tools. Has 8 engineers; needs to ship in 6 months; team knows TypeScript, no Rust. Pick the desktop stack."
        options={[
          {
            id: "a",
            text: "Electron — fastest to ship for a TS-only team; the bundle/memory cost is acceptable for a dev tool target audience.",
          },
          {
            id: "b",
            text: "Tauri — always lighter is better.",
          },
          {
            id: "c",
            text: "Flutter Desktop — pixel-perfect rendering.",
          },
          {
            id: "d",
            text: "Native Swift + Kotlin — best UX.",
          },
        ]}
        correctAnswerId="a"
        explanation={
          <>
            A 6-month deadline + no-Rust team makes Electron the rational pick. Tauri is lighter but
            adds Rust to the build <em>and</em> WebView quirks across platforms — a real cost when
            you don&apos;t have anyone to debug them. Flutter Desktop and native (c, d) abandon the
            team&apos;s existing skills entirely.
          </>
        }
      />

      <Challenge
        question="Your Tauri renderer can call any Rust command, including fs::read_file. A reflected XSS bug is reported. Why is this catastrophic?"
        options={[
          {
            id: "a",
            text: "It isn't — XSS in a desktop app is contained.",
          },
          {
            id: "b",
            text: "Because the XSS-injected JS can call fs::read_file (and any other allowlisted Rust command) — turning a renderer-level bug into local file read, write, or arbitrary code execution. Restrict the allowlist to specific commands with specific arguments.",
          },
          {
            id: "c",
            text: "Tauri is broken; switch to Electron.",
          },
          {
            id: "d",
            text: "Rust prevents this kind of bug automatically.",
          },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            Desktop apps with permissive IPC turn renderer-level bugs (XSS) into native-process bugs
            (RCE). Default-deny + specific-command allowlists is the modern safe pattern. Same lesson
            applies to Electron with <code>nodeIntegration</code> enabled — never enable it.
          </>
        }
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 6: GotchaList                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <GotchaList
        items={[
          {
            title: "Electron's Node integration in the renderer is a security footgun — disable it (`contextIsolation: true`, `nodeIntegration: false`) and use IPC",
            body: "With nodeIntegration enabled, any XSS in the renderer gets full Node.js access — read the filesystem, spawn processes, exfiltrate data. contextIsolation + contextBridge is the safe default since Electron 12.",
          },
          {
            title: "Tauri requires a Rust toolchain to build — that's a real CI cost; the binary size win is real but so is the build complexity",
            body: "Every developer and CI machine needs rustup, the target toolchain, and platform-specific linkers. On macOS you also need Xcode Command Line Tools. Factor this into onboarding time before committing to Tauri.",
          },
          {
            title: "WebView differences across OSes (Edge on Windows, WebKit on macOS, WebKitGTK on Linux) bring back early-2000s browser-quirk debugging",
            body: "CSS Grid subgrid, certain Flexbox edge cases, and newer JS APIs land at different times across the three engines. A feature that works on macOS may silently break on a recent Ubuntu LTS. Build a cross-platform test matrix early.",
          },
          {
            title: "Auto-update is non-trivial — both frameworks have first-party solutions, both with caveats around code signing and notarization",
            body: "macOS requires notarization (Apple malware scan) before Gatekeeper will allow your app. Windows Authenticode signing prevents SmartScreen warnings. Neither is free or trivial to set up in CI. Budget at least a sprint for the signing pipeline.",
          },
        ]}
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 7: KeyTakeaways                                               */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <KeyTakeaways
        points={[
          <>
            <em>Electron</em> — a desktop framework bundling Chromium + Node into a self-contained
            app — ships ~150 MB on disk and ~300 MB of RAM at idle; rendering is identical on every
            machine because Chromium is pinned.
          </>,
          <>
            <em>Tauri</em> — a desktop framework using the OS-native webview + a Rust backend —
            ships ~5&ndash;10 MB on disk and ~30&ndash;50 MB of RAM at idle; the trade-off is three
            rendering engines (WebKit, WebKitGTK, Edge WebView2) and a Rust build requirement.
          </>,
          <>
            The IPC allowlist is the security boundary. Default-deny + per-command allowlist is safe;
            default-allow turns any renderer XSS into local file system access or RCE.
          </>,
          <>
            Pick by what your team can afford: Electron for a TypeScript team under time pressure;
            Tauri when bundle size and memory matter and you can absorb Rust in the build.
          </>,
          <>
            Auto-update requires code signing on macOS (notarization) and Windows (Authenticode) —
            budget for it before you promise shipping.
          </>,
        ]}
        mentalModel="Electron bundles Chromium + Node into your app — fat but predictable. Tauri uses the OS webview + a Rust backend — lean but with WebView quirks across platforms. Pick by what you can afford to ship and maintain."
      />

      {/* Alternatives — one paragraph after KeyTakeaways */}
      <Card>
        <CardContent className="pt-6 prose dark:prose-invert max-w-none">
          <p>
            <strong>Alternatives.</strong> <em>Flutter Desktop</em> uses the same Skia renderer as
            Flutter mobile — pixel-perfect cross-platform, but Dart and a different ecosystem.{" "}
            <em>Native</em> (Swift / WinUI / GTK) is the right pick when you need the absolute
            platform fit and don&apos;t mind multiple codebases. <em>Wails</em> is a Tauri-like
            framework using Go instead of Rust. <em>Neutralino</em> is a lightweight cross-platform
            alternative without bundled WebView, simpler than Electron but with a smaller ecosystem.
            Pick by team skills and bundle/memory budget.
          </p>
        </CardContent>
      </Card>

    </div>
  );
}
