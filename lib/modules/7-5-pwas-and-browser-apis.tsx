"use client";

import { Card, CardContent } from "@/components/ui/card";
import { HTMLPlayground } from "@/components/CodePlayground";
import { StepByStepExplanation, Step } from "@/components/StepByStepExplanation";
import { Challenge } from "@/components/Challenge";
import { GotchaList } from "@/components/GotchaList";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { RoadmapLink } from "@/components/RoadmapLink";

export function Module_7_5_Content() {
  // Data blocks hoisted out of JSX for readability — listed in render order.

  const tabToAppSteps: Step[] = [
    {
      title: "Step 1: Service worker — a programmable proxy",
      description: (
        <>
          A <em>service worker</em> — a scriptable proxy between the browser and the network, used
          for caching, push, and offline — is a JavaScript file that runs in a separate thread,
          outside the page lifecycle. It installs once when the browser downloads it, then it
          intercepts every <code>fetch()</code> your origin makes. You decide what happens: serve
          from a local cache, hit the network, return a synthetic response. The page never knows the
          difference. Because it sits at the network boundary, it can make your app work even when
          there is no connection at all.
        </>
      ),
      code: `// sw.js — this file runs in a service worker thread, not the page
// 'self' here refers to the service worker global scope

self.addEventListener('install', (event) => {
  // Runs once when the browser first downloads this SW file.
  // Use event.waitUntil() to extend the install until async work is done.
  console.log('[SW] Installing...');
});

self.addEventListener('activate', (event) => {
  // Runs after install, once old SWs have cleared.
  // Good place to clean up stale caches.
  console.log('[SW] Active — controlling pages now');
});

self.addEventListener('fetch', (event) => {
  // Every fetch() from pages in the SW scope fires this event.
  // Do nothing here and the request passes through as normal.
  console.log('[SW] Intercepted:', event.request.url);
});`,
    },
    {
      title: "Step 2: App shell + Cache API",
      description: (
        <>
          The <em>Cache API</em> — the browser API for storing <code>Request</code>/
          <code>Response</code> pairs, typically used by service workers — is how you make the shell
          of your app available offline. On <code>install</code>, open a named cache and add every
          file that makes up the &quot;frame&quot; of the app: the HTML, CSS, and JavaScript that is
          common to every page. On <code>fetch</code>, check the cache first; serve from cache if
          present; fall back to the network if not. A user who visited before can now reload with no
          connection and see a real UI — not a browser error page.
        </>
      ),
      code: `const SHELL_CACHE = 'shell-v1';
const SHELL_ASSETS = ['/', '/styles.css', '/app.js', '/icons/icon-192.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL_ASSETS))
  );
  self.skipWaiting(); // explained in Step 6
});

self.addEventListener('fetch', (event) => {
  // Cache-first: check cache before network
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;          // instant, offline-safe
      return fetch(event.request);        // network fallback
    })
  );
});`,
    },
    {
      title: "Step 3: Storage choices",
      description: (
        <>
          Three browser storage APIs exist, each matched to a different data shape. Pick by what you
          are storing, not by habit:
          <br />
          <br />
          <strong>localStorage</strong> — synchronous, string key-value, ~5 MB cap. Right for small
          flags and preferences read on boot.
          <br />
          <strong>IndexedDB</strong> — an <em>IndexedDB</em> — a browser-native NoSQL database for
          structured client-side storage — is asynchronous, gigabyte-scale, and indexed. Right for
          structured rows, offline data sets, or anything you need to query.
          <br />
          <strong>Cache API</strong> — stores full <code>Request</code>/<code>Response</code> pairs.
          Used by service workers to cache HTTP responses. Not for arbitrary structured data.
        </>
      ),
      code: `// localStorage — synchronous, tiny preferences
localStorage.setItem('theme', 'dark');
const theme = localStorage.getItem('theme'); // 'dark'

// IndexedDB — async, structured rows
// (abbreviated — full example in the playground below)
const db = await openDB('my-app', 1, {
  upgrade(db) {
    db.createObjectStore('searches', { keyPath: 'query' });
  },
});
await db.put('searches', { query: 'css grid', results: [...] });

// Cache API — HTTP responses, used from a service worker
const cache = await caches.open('api-v1');
await cache.put('/api/user', new Response(JSON.stringify(user)));
const cached = await caches.match('/api/user');`,
    },
    {
      title: "Step 4: WebSocket — bidirectional, persistent",
      description: (
        <>
          A <em>WebSocket</em> — a persistent, bidirectional connection layered on a single TCP
          connection, used for real-time messaging — starts with a plain HTTP upgrade request. Once
          the server agrees, the connection switches protocol and both sides can push messages at any
          time with no polling overhead. This is the right transport for chat, multiplayer games,
          live presence indicators, and collaborative editing — anything that needs the server to
          push to the client without being asked. The trade-off is weight: WebSockets are persistent
          TCP connections that need reconnection logic and, at scale, sticky sessions on your load
          balancer.
        </>
      ),
      code: `// Client-side WebSocket — browser
const ws = new WebSocket('wss://example.com/chat');

ws.addEventListener('open', () => {
  ws.send(JSON.stringify({ type: 'join', room: 'general' }));
});

ws.addEventListener('message', (event) => {
  const msg = JSON.parse(event.data);
  console.log('Received:', msg);
});

ws.addEventListener('close', (event) => {
  // Auto-reconnect with exponential back-off in production
  console.log('Connection closed:', event.code, event.reason);
});

// Send a chat message
function sendMessage(text) {
  ws.send(JSON.stringify({ type: 'message', text }));
}`,
    },
    {
      title: "Step 5: Server-Sent Events — one-way streaming",
      description: (
        <>
          <em>Server-Sent Events (SSE)</em> — a one-way streaming protocol from server to client
          over HTTP — is simpler than WebSockets for scenarios where you only need the server to
          push. There is no upgrade handshake; it is just a long-lived HTTP response with a special
          content type. The browser&apos;s <code>EventSource</code> API handles reconnection
          automatically if the connection drops. Use SSE for live notifications, dashboard tickers,
          build log streaming, or any &quot;server talks, client listens&quot; pattern. Because it
          runs over plain HTTP it works through proxies and CDNs that WebSockets sometimes do not.
        </>
      ),
      code: `// Client-side SSE — browser
const source = new EventSource('/api/events');

source.addEventListener('message', (event) => {
  console.log('Default message:', event.data);
});

// Named events let the server categorize pushes
source.addEventListener('price-update', (event) => {
  const { symbol, price } = JSON.parse(event.data);
  updateTicker(symbol, price);
});

source.addEventListener('error', () => {
  // EventSource reconnects automatically — no manual retry needed
  console.log('Connection lost, retrying...');
});

// Server response looks like this (text/event-stream):
// event: price-update
// data: {"symbol":"AAPL","price":213.45}
//
// event: price-update
// data: {"symbol":"GOOG","price":175.12}`,
    },
    {
      title: "Step 6: Web App Manifest — installability",
      description: (
        <>
          The <code>manifest.json</code> file declares your app&apos;s identity to the OS: its name,
          icons at multiple sizes, theme color, background color, the URL to open on launch (
          <code>start_url</code>), and the display mode. Setting{" "}
          <code>&quot;display&quot;: &quot;standalone&quot;</code> tells the OS to open the app
          without browser chrome — it looks like a native app. The browser shows an &quot;Install
          app&quot; prompt once you have both a manifest and a registered service worker on HTTPS.
          That is the full PWA checklist: service worker + manifest + HTTPS.
        </>
      ),
      code: `// manifest.json — link it from <head>: <link rel="manifest" href="/manifest.json">
{
  "name": "My App",
  "short_name": "MyApp",
  "description": "An installable, offline-capable web app",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#3b82f6",
  "background_color": "#ffffff",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}

// register.js — call this from your main page script
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

// PWA install checklist:
//  [x] served over HTTPS (or localhost for dev)
//  [x] manifest.json linked in <head>
//  [x] service worker registered
//  => browser may show an "Add to home screen" prompt`,
    },
  ];

  const playgroundHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>PWA Storage Demo</title>
</head>
<body>
  <h2>localStorage demo</h2>
  <p class="hint">Open DevTools &rarr; Application &rarr; Storage &rarr; Local Storage.<br>
    Click "Save value" below to write to localStorage. Reload the playground &mdash;
    the value persists across reloads. That&apos;s the smallest building block of any
    PWA: state that survives without a network round-trip.</p>

  <div class="row">
    <input id="value-input" type="text" placeholder="Enter a value&hellip;" />
    <button id="btn-save">Save value</button>
    <button id="btn-read">Read value</button>
    <button id="btn-clear">Clear</button>
  </div>
  <pre id="output">Output will appear here&hellip;</pre>

  <hr>
  <h2>Service worker registration (annotated)</h2>
  <pre class="code-note">// register.js — add to your main HTML entry point
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(reg =&gt; console.log('SW registered, scope:', reg.scope))
    .catch(err =&gt; console.error('SW registration failed:', err));
}
// Note: SWs only work on HTTPS (or localhost).
// In Sandpack's sandboxed iframe SW registration is blocked —
// but the pattern above is exactly what you deploy.</pre>

  <hr>
  <h2>SSE listener (annotated)</h2>
  <pre class="code-note">// EventSource opens a long-lived HTTP connection.
// The server streams events in text/event-stream format.
const source = new EventSource('/api/stream');

source.addEventListener('message', (event) =&gt; {
  console.log('Server pushed:', event.data);
});
// Auto-reconnects if the connection drops — no retry logic needed.
// Use for notifications, live tickers, build logs.</pre>
</body>
</html>`;

  const playgroundCss = `body {
  font-family: system-ui, sans-serif;
  max-width: 660px;
  margin: 24px auto;
  padding: 0 20px;
  color: #1e293b;
}
h2 { font-size: 1.05rem; margin: 20px 0 6px; }
.hint { font-size: 0.82rem; color: #64748b; margin-bottom: 12px; line-height: 1.5; }
.row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }
input {
  flex: 1;
  padding: 7px 10px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.9rem;
  min-width: 0;
}
button {
  padding: 7px 14px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  white-space: nowrap;
}
button:hover { background: #2563eb; }
pre#output {
  background: #0f172a;
  color: #e2e8f0;
  padding: 14px;
  border-radius: 8px;
  font-size: 0.8rem;
  min-height: 60px;
  white-space: pre-wrap;
  word-break: break-all;
}
pre.code-note {
  background: #f1f5f9;
  border-left: 4px solid #3b82f6;
  padding: 14px;
  border-radius: 0 8px 8px 0;
  font-size: 0.78rem;
  white-space: pre-wrap;
  word-break: break-word;
  color: #334155;
}
hr { border: none; border-top: 1px solid #e2e8f0; margin: 20px 0; }`;

  const playgroundJs = `// Try this: open DevTools → Application → Storage. Click "Save value"
// below to write to localStorage. Reload the playground — the value
// persists across reloads. That's the smallest building block of any
// PWA: state that survives without a network round-trip.

const KEY = 'pwa-demo-value';

document.getElementById('btn-save').addEventListener('click', () => {
  const val = document.getElementById('value-input').value.trim();
  if (!val) { show('Type something first.'); return; }
  localStorage.setItem(KEY, val);
  show('Saved: "' + val + '"\\n\\nCheck DevTools → Application → Local Storage.\\nReload the page — the value will still be there.');
});

document.getElementById('btn-read').addEventListener('click', () => {
  const stored = localStorage.getItem(KEY);
  show(stored ? 'Stored value: "' + stored + '"' : 'Nothing stored yet. Click "Save value" first.');
});

document.getElementById('btn-clear').addEventListener('click', () => {
  localStorage.removeItem(KEY);
  document.getElementById('value-input').value = '';
  show('Cleared. The key is gone from localStorage.');
});

// Show the stored value on load if it already exists
window.addEventListener('load', () => {
  const stored = localStorage.getItem(KEY);
  if (stored) show('Loaded from previous session: "' + stored + '"');
});

function show(msg) {
  document.getElementById('output').textContent = msg;
}`;

  return (
    <div className="space-y-8">

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 1: Hook                                                       */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Card>
        <CardContent className="pt-6">
          <div className="prose dark:prose-invert max-w-none">
            <p>
              A regular web app is dead the second the user goes through a tunnel. A PWA installs to
              the home screen, opens offline, syncs in the background, and shows push notifications
              &mdash; same JavaScript, dramatically different reach. The unlock is a small set of
              platform APIs you can adopt one at a time: service workers, the Cache API, IndexedDB,
              WebSocket, SSE.
            </p>
            <p>
              None of this requires a new language or a native build pipeline. A service worker is a
              JavaScript file you register from your existing page. The Web App Manifest is a JSON
              file you link from <code>&lt;head&gt;</code>. The storage APIs are plain async
              functions. You can turn any HTTPS web app into a PWA in an afternoon &mdash; the
              concepts are the hard part, not the syntax.
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
              Think of a service worker as the one checkpoint all network traffic must pass through.
              Everything your page requests &mdash; HTML, CSS, fonts, API calls &mdash; is routed
              through the service worker&apos;s <code>fetch</code> event. You write the logic that
              decides what to return: cached copy, live network response, or a mix. The storage
              question is separate: match the API to the shape of the data, not to habit. And the
              transport question is separate again: pick the protocol that matches how the
              conversation flows, not just what you already know.
            </p>
            <blockquote className="border-l-4 border-blue-500 pl-4 italic">
              &quot;A service worker is a programmable proxy between the browser and the network.
              Pick the storage that matches the data shape; pick the transport that matches the
              conversation.&quot;
            </blockquote>
          </div>
        </CardContent>
      </Card>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 3: Step-by-step                                               */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <StepByStepExplanation
        title="From a tab to an installable app"
        description="Six building blocks, each independently adoptable"
        steps={tabToAppSteps}
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 4: Playground                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <HTMLPlayground
        html={playgroundHtml}
        css={playgroundCss}
        js={playgroundJs}
        title="Storage in action"
        description="localStorage runs live here. The service worker and SSE snippets are annotated code — they show the exact patterns you deploy, but cannot run inside a sandboxed iframe."
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 5: Challenges                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Challenge
        question="You need to store user preferences (theme, language) and a small offline cache of recent search results. Which storage for each?"
        options={[
          {
            id: "a",
            text: "localStorage for both — they're both small.",
          },
          {
            id: "b",
            text: "localStorage for preferences (small, sync read on app start); IndexedDB for the search cache (structured rows, async access, room to grow).",
          },
          {
            id: "c",
            text: "Cache API for both.",
          },
          {
            id: "d",
            text: "Cookies for both.",
          },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            localStorage&apos;s 5 MB cap and synchronous API make it ideal for a few hundred bytes
            of preferences read on boot. The search cache is structured (rows by query, by date) and
            could grow &mdash; IndexedDB&apos;s indexed rows and async API are the right shape.
            Cache API is for full HTTP responses, not arbitrary structured data.
          </>
        }
      />

      <Challenge
        question="Your service worker code changed but the browser keeps using the old one. What's the fix?"
        options={[
          {
            id: "a",
            text: "Hard-refresh the page repeatedly.",
          },
          {
            id: "b",
            text: "Service workers update on next page navigation but the new SW waits for all old tabs to close. Call skipWaiting() in install and clients.claim() in activate, or close all tabs of your origin to force the swap.",
          },
          {
            id: "c",
            text: "Re-register the service worker manually.",
          },
          {
            id: "d",
            text: "Clear all browser data and reload.",
          },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            SW lifecycle is &quot;install &rarr; wait &rarr; activate&quot;. The waiting state
            exists so users in older tabs aren&apos;t disrupted; it&apos;s also the source of
            &quot;my SW won&apos;t update&quot; frustration.{" "}
            <code>skipWaiting</code>/<code>clients.claim</code> overrides it, but use carefully
            &mdash; old tabs can break if the API contract changed.
          </>
        }
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 6: GotchaList                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <GotchaList
        items={[
          {
            title: "localStorage is synchronous and capped at ~5 MB — never put anything important or large there",
            body: (
              <>
                Calling <code>localStorage.getItem</code> blocks the main thread. On slow devices,
                reading a large blob causes a visible freeze. Use IndexedDB for anything beyond a few
                preference flags, and never store sensitive data like tokens in localStorage (XSS
                can read it instantly).
              </>
            ),
          },
          {
            title: "Service workers update on install but only become active after all tabs close — skipWaiting is the escape hatch, with caveats",
            body: (
              <>
                The &quot;waiting&quot; state is intentional: a new SW with a changed cache strategy
                could break a tab still running the old app. <code>skipWaiting()</code> forces the
                swap immediately, which is fine if your API hasn&apos;t changed shape. If it has,
                old tabs can silently break. Know what you&apos;re doing before you add it.
              </>
            ),
          },
          {
            title: "WebSockets aren't HTTP after the upgrade — load balancers, CORS rules, and middleware behave differently; sticky sessions often required",
            body: (
              <>
                After the initial <code>101 Switching Protocols</code> response the connection is no
                longer HTTP. Stateless load balancers will round-robin subsequent messages to
                different instances, breaking the persistent channel. You need sticky sessions (or a
                pub/sub backend like Redis) to handle scale. Most &quot;chat in 5 minutes&quot;
                tutorials skip this because they run on a single server.
              </>
            ),
          },
          {
            title: "Push notifications need a backend to send the push event — client-only PWA tutorials skip this and surprise people in week 2",
            body: (
              <>
                The browser Push API requires your server to send a message to a push service (like
                Firebase Cloud Messaging or the Web Push protocol endpoint). The client registers a
                subscription object and sends it to your backend; from then on, pushes originate from
                your server, not the browser. A service worker alone cannot initiate a push.
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
            A <strong>PWA</strong> requires three things: a service worker (offline + caching), a
            Web App Manifest (name, icons, <code>display: standalone</code>), and HTTPS. All three
            are required for the browser to show the install prompt.
          </>,
          <>
            A <strong>service worker</strong> intercepts every fetch from its scope — it is a
            programmable proxy. The <code>install</code> event caches the shell; the{" "}
            <code>fetch</code> event decides cache-first vs. network-first per request type.
          </>,
          <>
            Pick storage by data shape: <strong>localStorage</strong> for tiny sync preferences;{" "}
            <strong>IndexedDB</strong> for structured, queryable, async rows; <strong>Cache API</strong>{" "}
            for HTTP <code>Request</code>/<code>Response</code> pairs.
          </>,
          <>
            Use <strong>WebSocket</strong> when both sides need to push in real time (chat,
            multiplayer, presence). Use <strong>SSE</strong> when only the server pushes (live
            tickers, notifications, streaming logs) — SSE is simpler and reconnects automatically.
          </>,
          <>
            The SW lifecycle trap: a new service worker waits until all old tabs close before
            activating. <code>skipWaiting()</code> + <code>clients.claim()</code> forces an
            immediate takeover — use it intentionally, not as a reflex.
          </>,
        ]}
        mentalModel="A service worker is a programmable proxy between the browser and the network. Pick the storage that matches the data shape; pick the transport that matches the conversation."
      />
    </div>
  );
}
