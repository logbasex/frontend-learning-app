"use client";

import { ScaffoldModule } from "./_template";
import { CodeBlock } from "@/components/CodeBlock";

const swCode = `// sw.js — Service Worker
// Sits between the page and the network. Intercepts every fetch().

const SHELL_CACHE = 'shell-v1';
const SHELL_ASSETS = ['/', '/index.html', '/styles.css', '/app.js'];

// install: pre-cache the app shell so it works offline
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_ASSETS))
  );
  // Activate this SW immediately instead of waiting for old tabs to close
  self.skipWaiting();
});

// activate: clean up stale caches from previous versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== SHELL_CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim(); // Take control of all open tabs immediately
});

// fetch: the programmable proxy
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Cache-first for shell assets — serve instantly from cache, never hit network
  if (SHELL_ASSETS.includes(url.pathname)) {
    event.respondWith(
      caches.match(event.request).then((cached) => cached ?? fetch(event.request))
    );
    return;
  }

  // Network-first for API requests — fresh data, fall back to cache on failure
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Store a clone in cache for offline fallback
          const clone = response.clone();
          caches.open('api-cache').then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request)) // offline fallback
    );
  }
});`;

const registerCode = `// register.js — add to your main HTML entry point
// Register the service worker once the page has loaded
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}`;

export function Module_7_5_Content() {
  return (
    <ScaffoldModule
      emoji="🛰️"
      problemTitle="Turning a tab into an app"
      problem={
        <>
          <p>
            A <strong>Progressive Web App</strong> is a regular web app plus
            three things: (1) a <strong>service worker</strong> — a
            programmable proxy living between the page and the network that
            caches the app shell, intercepts fetches, and enables offline
            support; (2) a <strong>Web App Manifest</strong> — a JSON file
            declaring the app&apos;s name, icons, and{" "}
            <code>display: &quot;standalone&quot;</code> so the OS can install it
            like a native app; and (3) <strong>HTTPS</strong> — required for
            service worker registration because SWs are powerful enough to
            intercept all network traffic.
          </p>
          <p>
            On top of the PWA baseline, modern browsers expose a growing stack
            of platform APIs. <strong>Storage</strong>: LocalStorage for tiny
            key-value strings, IndexedDB for structured queryable data,
            Cache API for HTTP response objects — pick by data shape.{" "}
            <strong>Real-time</strong>: WebSockets for full-duplex messaging,
            Server-Sent Events for server-to-client push over plain HTTP.{" "}
            <strong>Device</strong>: Notifications, Geolocation, Web Share,
            Payments, Bluetooth, USB — each gated behind a user permission
            prompt.
          </p>
          <p>
            The mental model for storage: if you are storing a{" "}
            <em>string preference</em>, use LocalStorage; if you are storing{" "}
            <em>structured records</em> you need to query or index, use
            IndexedDB; if you are caching <em>HTTP responses</em> for offline
            use, use the Cache API. For real-time communication, WebSockets are
            bidirectional (chat, games, live dashboards), while Server-Sent
            Events are server-to-client only (notifications, live feeds) — SSE
            is simpler and reconnects automatically.
          </p>
        </>
      }
      body={
        <>
          <CodeBlock
            language="javascript"
            fileName="sw.js"
            code={swCode}
          />
          <div className="mt-4">
            <CodeBlock
              language="javascript"
              fileName="register.js"
              code={registerCode}
            />
          </div>
        </>
      }
      challenge={{
        question: "Why is a service worker a 'programmable proxy'?",
        options: [
          {
            id: "a",
            text: "It runs on a proxy server between the CDN and the origin, compressing responses.",
          },
          {
            id: "b",
            text: "It replaces the browser's network stack with a custom implementation.",
          },
          {
            id: "c",
            text: "It sits between the page and the network — every fetch can be intercepted, served from cache, or modified before it goes out. The page doesn't know.",
          },
          {
            id: "d",
            text: "It proxies third-party requests to avoid CORS errors.",
          },
        ],
        correctAnswerId: "c",
        explanation: (
          <>
            A service worker registers as a network interceptor for its scope
            (e.g., everything under <code>/</code>). The browser routes every{" "}
            <code>fetch()</code> call through the SW&apos;s <code>fetch</code>{" "}
            event handler. Inside that handler you can serve from cache, hit the
            network, mix both, or return a synthetic response — entirely in
            JavaScript. The page never knows whether the response came from the
            network or a local cache.
          </>
        ),
      }}
      takeaways={[
        <>
          A PWA requires three things: a <strong>service worker</strong> (offline
          + caching), a <strong>Web App Manifest</strong> (icons + install
          prompt), and <strong>HTTPS</strong>.
        </>,
        <>
          Pick storage by data shape: <strong>LocalStorage</strong> for tiny
          strings, <strong>IndexedDB</strong> for structured queryable data,{" "}
          <strong>Cache API</strong> for HTTP response objects.
        </>,
        <>
          Service workers use <strong>cache-first</strong> for static shell
          assets (fast + offline) and <strong>network-first</strong> for API
          requests (fresh data, cached fallback).
        </>,
      ]}
      mentalModel="Service worker = programmable proxy. PWA = web app + offline + install + push. Pick storage by data shape."
      roadmapUrl="https://roadmap.sh/frontend"
    />
  );
}
