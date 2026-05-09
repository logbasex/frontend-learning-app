"use client";

import { ScaffoldModule } from "./_template";
import { CodeBlock } from "@/components/CodeBlock";

const electronCode = `// electron-main.js
const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      // Isolate renderer from Node.js for security
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // Load your web app (dev server or built files)
  win.loadFile("index.html");
}

app.whenReady().then(() => {
  createWindow();

  // macOS: re-create window when dock icon is clicked
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  // On Windows/Linux, quit when all windows are closed
  if (process.platform !== "darwin") app.quit();
});`;

const tauriCode = `// src-tauri/src/main.rs
// Prevents an extra console window from appearing on Windows in release mode.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;

// A simple Tauri command callable from the frontend via invoke()
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! — from Rust", name)
}

fn main() {
    tauri::Builder::default()
        // Register commands so the frontend can call them
        .invoke_handler(tauri::generate_handler![greet])
        .setup(|app| {
            // Access the main window after setup if needed
            let _window = app.get_window("main").unwrap();
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}`;

export function Module_7_7_Content() {
  return (
    <ScaffoldModule
      emoji="🖥️"
      problemTitle="Electron vs Tauri — Chromium-everywhere vs native-shell"
      problem={
        <>
          <p>
            Electron bundles <strong>Chromium and Node.js</strong> with your application. Every
            Electron app ships roughly 150 MB of browser before a single line of your code is
            counted. The upside is complete predictability: the same Chromium version runs on
            every user&apos;s machine, and the Node.js runtime gives you the full npm ecosystem for
            system access. That predictability is why battle-tested apps like VS Code, Slack,
            and Discord chose Electron.
          </p>
          <p>
            Tauri flips the model: instead of bundling Chromium, it uses the{" "}
            <strong>OS&apos;s native webview</strong> (WebView2 on Windows, WKWebView on macOS,
            WebKitGTK on Linux) and a small <strong>Rust core</strong> for system access. The
            result is a binary that is 10–20 MB instead of 150 MB+, with a meaningfully smaller
            attack surface. The trade-off is that the native webview differs slightly across
            platforms, and system APIs are exposed through Rust rather than Node.
          </p>
          <p>
            Flutter Desktop is a third option: it brings Flutter&apos;s own renderer to the
            desktop, giving you the same pixel-perfect parity as Flutter Mobile but requiring
            Dart. For new greenfield projects, Tauri is the pragmatic default unless you have a
            specific reason to need Electron&apos;s Node.js ecosystem or Chromium consistency.
          </p>
        </>
      }
      body={
        <div className="space-y-4">
          <CodeBlock
            language="javascript"
            fileName="electron-main.js"
            code={electronCode}
          />
          <CodeBlock
            language="rust"
            fileName="src-tauri/src/main.rs"
            code={tauriCode}
          />
        </div>
      }
      challenge={{
        question:
          "Why is a Tauri binary so much smaller than an Electron binary?",
        options: [
          {
            id: "a",
            text: "Tauri compresses assets more aggressively than Electron does.",
          },
          {
            id: "b",
            text: "Tauri uses the OS's existing webview instead of bundling its own Chromium, and uses Rust for the native shell instead of Node.js — together that's a hundred MB of dependencies it doesn't ship.",
          },
          {
            id: "c",
            text: "Electron includes the full V8 engine, while Tauri uses a faster, smaller JS engine called QuickJS.",
          },
          {
            id: "d",
            text: "Tauri only targets one platform at a time, whereas Electron ships a universal binary.",
          },
        ],
        correctAnswerId: "b",
        explanation: (
          <>
            Electron&apos;s size comes from two sources: a full Chromium build (~130 MB) and the
            Node.js runtime. Tauri eliminates both by delegating rendering to the OS&apos;s existing
            webview (already installed, not shipped) and by using a Rust binary for system calls
            instead of Node. The combined saving is typically 100–140 MB per app.
          </>
        ),
      }}
      takeaways={[
        <>
          Electron bundles <strong>Chromium + Node.js</strong> — predictable across every
          machine, but each app ships ~150 MB of browser.
        </>,
        <>
          Tauri uses the <strong>OS&apos;s native webview + a Rust core</strong> — apps are 10–20 MB,
          with a smaller attack surface and faster startup.
        </>,
        <>
          Flutter Desktop brings Flutter&apos;s own renderer to the desktop for pixel-perfect
          cross-platform parity, at the cost of adopting Dart.
        </>,
      ]}
      mentalModel="Electron: Chromium + Node, fat but predictable. Tauri: system webview + Rust core, lean. Flutter desktop: same renderer as mobile."
      roadmapUrl="https://roadmap.sh/frontend"
    />
  );
}
