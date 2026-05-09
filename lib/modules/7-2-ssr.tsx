"use client";

import { Card, CardContent } from "@/components/ui/card";
import { HTMLPlayground } from "@/components/CodePlayground";
import { StepByStepExplanation, Step } from "@/components/StepByStepExplanation";
import { LayeredFlow } from "@/components/LayeredFlow";
import { SequenceDiagram } from "@/components/SequenceDiagram";
import { Challenge } from "@/components/Challenge";
import { GotchaList } from "@/components/GotchaList";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { RoadmapLink } from "@/components/RoadmapLink";

export function Module_7_2_Content() {
  // Data blocks hoisted out of JSX for readability — listed in render order.
  const renderingModesSteps: Step[] = [
    {
      title: "Step 1: CSR — the browser does it all",
      description: (
        <>
          <em>CSR (Client-Side Rendering)</em> — the page is delivered as near-empty HTML;
          JavaScript fetches data and renders in the browser. The server ships a skeleton:
          one <code>&lt;div id=&quot;root&quot;&gt;&lt;/div&gt;</code> and a bundle URL. The
          browser downloads the JS, parses it, executes it, fetches the data, and finally
          renders the UI — all before the user sees anything meaningful. On a fast laptop with
          a fast connection this takes under a second. On a slow phone in a tunnel it can take
          four. Search-engine crawlers that do not execute JavaScript see an empty page.
        </>
      ),
      code: `<!-- CSR: what the server actually returns -->
<!DOCTYPE html>
<html>
  <head><title>My App</title></head>
  <body>
    <!-- The user sees nothing until JS runs -->
    <div id="root"></div>
    <script src="/bundle.js"></script>
  </body>
</html>

// bundle.js (simplified) — runs entirely in the browser
fetch('/api/user/42')
  .then(res => res.json())
  .then(user => {
    const h1 = document.createElement('h1');
    h1.textContent = 'Hello, ' + user.name;
    document.getElementById('root').appendChild(h1);
  });`,
    },
    {
      title: "Step 2: SSR — server renders per request",
      description: (
        <>
          <em>SSR (Server-Side Rendering)</em> — the server renders HTML for each request; the
          browser receives a fully-formed document. The user sees content on first paint because
          the HTML already contains it. Then the JS bundle arrives, React re-runs the component
          tree in memory, matches the existing DOM, and attaches event listeners — that process is
          called <em>hydration</em> (defined in Step 4). The first-paint win is real; the tradeoff
          is that every request hits the server, so TTFB (time to first byte) is higher than
          serving a pre-built file from a CDN.
        </>
      ),
      code: `// Next.js App Router — SSR: every request runs this function
// app/profile/page.tsx
export const dynamic = 'force-dynamic'; // opt-in to full SSR

async function getUser(id: string) {
  const res = await fetch(\`https://api.example.com/users/\${id}\`, {
    cache: 'no-store', // bypass the fetch cache — always fresh
  });
  return res.json();
}

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ id: string }>;
}) {
  const { id } = await searchParams;
  const user = await getUser(id);

  // This HTML is pre-rendered on the server for every request.
  return <h1>Hello, {user.name}</h1>;
}`,
    },
    {
      title: "Step 3: SSG and ISR — pre-rendered at build time",
      description: (
        <>
          <em>SSG (Static Site Generation)</em> — pages are pre-rendered at build time and served
          as static HTML. The output is a folder of <code>.html</code> files served from a CDN.
          Request time is nearly free: no server, no database, just a file delivery. Perfect for
          marketing pages, documentation, and blog posts whose content changes on a human schedule.
          The catch: data can go stale the moment the build finishes.{" "}
          <em>ISR (Incremental Static Regeneration)</em> — SSG with revalidation: pages re-build
          on demand after a TTL — adds a <code>revalidate</code> option that tells Next.js to
          regenerate the page in the background after a given number of seconds, serving the cached
          version until it&apos;s ready.
        </>
      ),
      code: `// Next.js App Router — SSG (default) + ISR
// app/blog/[slug]/page.tsx

async function getPost(slug: string) {
  const res = await fetch(\`https://api.example.com/posts/\${slug}\`, {
    next: { revalidate: 60 }, // ISR: regenerate at most once per 60 s
    // Remove revalidate entirely for pure SSG (build-time only).
    // Use cache: 'no-store' for full SSR (never cached).
  });
  return res.json();
}

// generateStaticParams tells Next.js which paths to pre-build.
export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json());
  return posts.map((post: { slug: string }) => ({ slug: post.slug }));
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  return <article><h1>{post.title}</h1><p>{post.body}</p></article>;
}`,
    },
    {
      title: "Step 4: Hydration — wiring server HTML to client React",
      description: (
        <>
          <em>Hydration</em> — attaching client-side React to server-rendered HTML so it becomes
          interactive. React renders the JSX tree in memory, walks the DOM the server produced, and
          attaches event listeners and state without rebuilding the markup from scratch. The DOM the
          server produced and the JSX the client thinks it should produce <strong>must match</strong>{" "}
          — that&apos;s the source of &quot;hydration mismatch&quot; errors. Any value that differs
          between server and client — <code>new Date()</code>, <code>Math.random()</code>, a
          browser-only API like <code>window.innerWidth</code> — will trigger a warning (or a full
          re-render in development). Hydration is why SSR still ships the JS bundle: the HTML gives
          you fast first paint, but React needs to &quot;take over&quot; to make it interactive.
        </>
      ),
      code: `// Hydration mismatch example — BAD
export default function ServerPage() {
  // new Date() is evaluated BOTH on the server and the client.
  // Server: "Wed Apr 12 2025 00:00:00 UTC"
  // Client: "Thu Apr 13 2025 07:23:11 UTC"  <- different timezone + time
  // React throws: "Hydration failed because the server rendered HTML
  //   didn't match the client."
  return <p>Today is {new Date().toLocaleDateString()}</p>;
}

// FIX — move the dynamic value to a client-only effect
'use client';
import { useState, useEffect } from 'react';

export default function ClientDate() {
  const [date, setDate] = useState<string | null>(null);
  useEffect(() => {
    // Runs only in the browser — never during SSR — so it never mismatches.
    setDate(new Date().toLocaleDateString());
  }, []);
  return <p>Today is {date ?? '...'}</p>;
}`,
    },
    {
      title: "Step 5: RSC — components that never ship JS",
      description: (
        <>
          <em>RSC (React Server Components)</em> — components rendered on the server only; their
          JavaScript is never shipped to the client. In the Next.js App Router, every component is
          a Server Component by default. They can do server-only things: read the filesystem, query
          a database directly, use secret API keys — none of that code or its imports ever reach the
          browser. A Server Component renders to HTML (or a special RSC payload), and only the
          output is sent downstream. Client Components — marked with{" "}
          <code>&quot;use client&quot;</code> at the top of the file — still hydrate normally. The
          two coexist inside the same React tree: a Server Component renders its children and may
          embed Client Components inside.
        </>
      ),
      code: `// app/dashboard/page.tsx — Server Component (no "use client")
// This entire file is zero bytes in the client bundle.

interface Post { id: number; title: string; views: number; }

async function getPosts(): Promise<Post[]> {
  // Direct DB or internal API call — the secret never reaches the browser.
  const res = await fetch('https://internal-api.example.com/posts', {
    headers: { Authorization: \`Bearer \${process.env.API_SECRET}\` },
    next: { revalidate: 30 },
  });
  return res.json();
}

export default async function DashboardPage() {
  const posts = await getPosts(); // top-level await is fine in Server Components

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <ul className="space-y-2">
        {posts.map(post => (
          <li key={post.id} className="flex justify-between border-b py-2">
            <span>{post.title}</span>
            {/* LikeButton is a Client Component — interactive, ships JS */}
            {/* <LikeButton postId={post.id} /> */}
            <span className="text-slate-500">{post.views} views</span>
          </li>
        ))}
      </ul>
    </main>
  );
}`,
    },
    {
      title: "Step 6: Picking modes by route",
      description: (
        <>
          The power of Next.js is that all five modes coexist in one app. The decision is
          per-route, driven by data freshness and interactivity requirements. Marketing landing
          page with copy written by humans? SSG — build once, serve from the CDN edge forever.
          User dashboard with personalized data? SSR or RSC — server renders fresh data per
          request. A live chart inside that dashboard? Client Component — must run in the browser
          for real-time updates. Product catalog with 10,000 SKUs that changes hourly? ISR with a
          3,600-second TTL — stale-while-revalidate without blocking the request. The three
          coexist in one Next.js app without any per-route config beyond the <code>fetch</code>{" "}
          cache options you set in each Server Component.
        </>
      ),
      code: `// One Next.js app — three routes, three strategies

// 1. SSG — marketing page
// app/page.tsx (no fetch cache option = SSG by default)
export default async function Home() {
  return <h1>Welcome</h1>; // built once at deploy time
}

// 2. ISR — product catalog
// app/products/page.tsx
async function getProducts() {
  const res = await fetch('/api/products', { next: { revalidate: 3600 } });
  return res.json();
}

// 3. SSR + RSC — authenticated dashboard
// app/dashboard/page.tsx
async function getUserData(userId: string) {
  const res = await fetch(\`/api/users/\${userId}\`, { cache: 'no-store' });
  return res.json();
}

// 4. Client Component — interactive widget anywhere in the tree
// components/LiveChart.tsx
'use client';
import { useState, useEffect } from 'react';
export function LiveChart() {
  const [data, setData] = useState<number[]>([]);
  useEffect(() => {
    const id = setInterval(() => {
      setData(prev => [...prev.slice(-19), Math.random() * 100]);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return <pre>{JSON.stringify(data)}</pre>;
}`,
    },
  ];

  const playgroundHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>SSR vs CSR</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <h2>What arrives in the HTML at t=0?</h2>
  <p class="hint">
    Open DevTools &rarr; Network &rarr; disable JS &rarr; reload.
    The SSR frame still shows content; the CSR frame is blank.
  </p>
  <div class="frames">
    <div class="frame">
      <div class="frame-label csr-label">CSR response</div>
      <div class="frame-body">
        <div class="source-code" id="csr-code"></div>
        <div class="annotation">User sees <strong>nothing</strong> until JS runs</div>
      </div>
    </div>
    <div class="frame">
      <div class="frame-label ssr-label">SSR response</div>
      <div class="frame-body">
        <div class="source-code" id="ssr-code"></div>
        <div class="annotation">User sees <strong>real content</strong> immediately; JS hydrates after</div>
      </div>
    </div>
  </div>
  <div id="timeline"></div>
  <script src="/script.js"></script>
</body>
</html>`;

  const playgroundCss = `body {
  font-family: system-ui, sans-serif;
  max-width: 780px;
  margin: 24px auto;
  padding: 0 16px;
  color: #1e293b;
}
h2 { margin-bottom: 4px; font-size: 1.05rem; }
.hint { font-size: 0.8rem; color: #64748b; margin-bottom: 20px; }
.frames {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}
.frame {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}
.frame-label {
  padding: 6px 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.csr-label { background: #fee2e2; color: #991b1b; }
.ssr-label { background: #dcfce7; color: #166534; }
.frame-body { padding: 12px; }
.source-code {
  font-family: monospace;
  font-size: 0.72rem;
  background: #0f172a;
  color: #94a3b8;
  padding: 10px;
  border-radius: 6px;
  white-space: pre;
  margin-bottom: 8px;
}
.annotation {
  font-size: 0.78rem;
  color: #475569;
}
#timeline {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  font-size: 0.8rem;
}
.tl-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}
.tl-label {
  width: 72px;
  font-weight: 600;
  font-size: 0.72rem;
  text-align: right;
  flex-shrink: 0;
}
.tl-bar {
  height: 18px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding: 0 6px;
  font-size: 0.68rem;
  color: white;
  white-space: nowrap;
}`;

  const playgroundJs = `// Try this: open DevTools -> Network. The CSR page (left) ships <div id="root">
// and a JS bundle URL -- the user sees nothing until JS runs. The SSR page
// (right) ships full HTML -- the user sees content immediately, then hydration
// attaches event handlers. The bytes-to-pixels timeline is the difference.

// Populate code previews using textContent (safe -- no HTML execution)
document.getElementById('csr-code').textContent =
  '<div id="root"></div>\\n<script src="/bundle.js"></script>';

document.getElementById('ssr-code').textContent =
  '<main>\\n  <h1>Hello, Alex</h1>\\n  <p>Balance: $1,200</p>\\n</main>\\n<script src="/bundle.js"></script>';

// Build the timeline diagram with DOM API (no markup strings executed)
const timeline = document.getElementById('timeline');

const heading = document.createElement('p');
heading.style.fontWeight = '600';
heading.style.marginBottom = '12px';
heading.textContent = 'Simplified time-to-interactive timeline (width = relative time)';
timeline.appendChild(heading);

const rows = [
  { label: 'CSR', segments: [
    { label: 'Download JS', width: 160, color: '#ef4444' },
    { label: 'Execute', width: 60, color: '#f97316' },
    { label: 'Fetch data', width: 90, color: '#eab308' },
    { label: 'Render', width: 40, color: '#22c55e' },
  ]},
  { label: 'SSR', segments: [
    { label: 'Server render', width: 80, color: '#6366f1' },
    { label: 'First paint', width: 10, color: '#22c55e' },
    { label: 'Download JS', width: 120, color: '#8b5cf6' },
    { label: 'Hydrate', width: 40, color: '#3b82f6' },
  ]},
  { label: 'SSG', segments: [
    { label: 'CDN (0ms server)', width: 20, color: '#10b981' },
    { label: 'First paint', width: 10, color: '#22c55e' },
    { label: 'Download JS', width: 120, color: '#8b5cf6' },
    { label: 'Hydrate', width: 40, color: '#3b82f6' },
  ]},
];

rows.forEach(function(row) {
  var div = document.createElement('div');
  div.className = 'tl-row';

  var lbl = document.createElement('span');
  lbl.className = 'tl-label';
  lbl.textContent = row.label;
  div.appendChild(lbl);

  row.segments.forEach(function(seg) {
    var bar = document.createElement('div');
    bar.className = 'tl-bar';
    bar.style.width = seg.width + 'px';
    bar.style.background = seg.color;
    bar.textContent = seg.label;
    div.appendChild(bar);
  });

  timeline.appendChild(div);
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
              You build a React app. The user opens it on a slow phone over a 4G connection in a
              tunnel. The page is blank for three seconds while React downloads, parses, executes,
              fetches, and renders. A search-engine crawler visits the same URL and sees an empty{" "}
              <code>&lt;div id=&quot;root&quot;&gt;</code> — nothing to index. Where a page
              renders — <em>server</em>, <em>client</em>, <em>build time</em>, <em>edge</em> —
              changes everything: the first paint, the SEO, the cost, the architecture.
            </p>
            <p>
              Next.js gives you all of them; the work is picking the right one per route. This
              module walks all five rendering modes, explains why hydration is the seam between
              server and client, and shows you how React Server Components change the equation by
              shipping HTML instead of JavaScript.
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
              Most React developers think of SSR as &quot;either the server renders the page or the
              client does.&quot; That framing makes the choice feel binary and the tradeoffs
              irreconcilable. The better mental model is a slider. At one end: 100% client — the
              server ships an empty HTML shell and JavaScript builds everything in the browser. At
              the other end: 100% server — pages pre-built at deploy time and served as static
              files, with no per-request server at all. Between those poles sit SSR (per-request
              server rendering), ISR (pre-built with a revalidation timer), and RSC (components that
              run on the server but never ship their JS to the client). Hydration is the mechanism
              that connects the two ends: server HTML gives you fast first paint; React attaches
              event listeners to that HTML so it becomes interactive.
            </p>
            <blockquote className="border-l-4 border-blue-500 pl-4 italic">
              &quot;Rendering location is a slider, not a switch. Hydration wires server HTML up on
              the client. RSC ships HTML, never JS — components rendered on the server only.&quot;
            </blockquote>
          </div>
        </CardContent>
      </Card>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 3: Step-by-step                                               */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <StepByStepExplanation
        title="Five rendering modes, one app"
        description="From pure-client to pure-server and every mode in between"
        steps={renderingModesSteps}
      />

      {/* Optional: LayeredFlow (rendering modes) */}
      <LayeredFlow
        title="Where the JavaScript runs"
        description="Five rendering modes on one timeline"
        stages={[
          { label: "CSR", detail: "100% client", color: "rose" },
          { label: "SSR", detail: "server + hydrate", color: "amber" },
          { label: "SSG", detail: "build + serve static", color: "emerald" },
          { label: "ISR", detail: "SSG + revalidate", color: "violet" },
          { label: "RSC", detail: "server-only React", color: "blue" },
        ]}
      />

      {/* Optional: SequenceDiagram (hydration handshake) */}
      <SequenceDiagram
        title="The hydration handshake"
        description="What 'hydrate' actually does"
        actors={["Browser", "Server", "ReactClient"]}
        messages={[
          { from: "Browser", to: "Server", label: "GET /page" },
          { from: "Server", to: "Server", label: "render page to HTML" },
          { from: "Server", to: "Browser", label: "200 OK + HTML + JS bundle URL" },
          { from: "Browser", to: "Browser", label: "paint HTML", note: "user sees content" },
          { from: "Browser", to: "Server", label: "GET /bundle.js" },
          { from: "Server", to: "Browser", label: "200 OK + bundle" },
          { from: "Browser", to: "ReactClient", label: "execute bundle" },
          {
            from: "ReactClient",
            to: "ReactClient",
            label: "render JSX, walk DOM, match server HTML, attach handlers",
          },
          { from: "ReactClient", to: "Browser", label: "page is interactive" },
        ]}
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 4: Live playground                                            */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <HTMLPlayground
        html={playgroundHtml}
        css={playgroundCss}
        js={playgroundJs}
        title="SSR vs CSR: what arrives in the HTML"
        description="Compare what the server actually sends for a CSR page vs an SSR page, and see the time-to-interactive difference."
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 5: Challenges                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Challenge
        question="What does hydration do?"
        options={[
          { id: "a", text: "It re-renders the page on the client from scratch." },
          {
            id: "b",
            text: "It walks the server-rendered DOM and attaches event listeners and React state, making the static HTML interactive.",
          },
          { id: "c", text: "It fetches data and updates the page after first paint." },
          { id: "d", text: "It compresses the HTML before sending." },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            Hydration is &quot;wire up the existing DOM&quot; — React renders the JSX, walks the
            server HTML the user already sees, and attaches handlers and state without rebuilding
            the markup. The HTML came for free (fast first paint); hydration makes it interactive.
            If the JSX disagrees with the server HTML, React throws a hydration mismatch — the DOM
            the browser painted is inconsistent with what React expects.
          </>
        }
      />

      <Challenge
        question="You see a hydration mismatch error: 'Server rendered Wed Apr 12 but client rendered Thu Apr 13'. What&apos;s the most likely cause?"
        options={[
          { id: "a", text: "The user&apos;s clock is wrong." },
          {
            id: "b",
            text: "The component renders the current date with new Date().toLocaleDateString() — the server&apos;s clock and timezone differ from the client&apos;s, producing different HTML. Move the dynamic part to a client-only effect or use a stable timestamp prop.",
          },
          { id: "c", text: "A network race condition — Next.js retries the render." },
          { id: "d", text: "A bug in React 19; downgrade to 18." },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            Hydration mismatches happen when server-rendered HTML and the client&apos;s first render
            disagree. <code>new Date()</code>, <code>Math.random()</code>, and any browser-only API
            are the usual suspects — they produce different values on the server and the client.
            Fix by moving the dynamic value to <code>useEffect</code> (client-only) or passing a
            fixed value as a prop from the server component.
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
              "Hydration mismatch errors mean server HTML and client JSX disagree — Date.now(), Math.random(), and browser-only APIs are the usual suspects",
            body: (
              <>
                The server renders at one point in time in one timezone; the client runs later in
                the user&apos;s timezone. Any value that depends on the current moment or the
                browser environment will mismatch. Move such values into <code>useEffect</code> so
                they only run on the client, after the initial hydration is complete.
              </>
            ),
          },
          {
            title:
              "Server components can't use hooks or browser APIs — they're rendered once on the server, period",
            body: (
              <>
                <code>useState</code>, <code>useEffect</code>, <code>useRef</code>,{" "}
                <code>window</code>, <code>document</code>, <code>localStorage</code> — all require
                a browser runtime. If you try to use them in a Server Component, Next.js throws a
                build-time error. The fix is to add <code>&quot;use client&quot;</code> at the top
                of the file and accept that the component will be part of the client bundle.
              </>
            ),
          },
          {
            title:
              "use client doesn't ship a separate bundle — it just marks the boundary; the parent server tree still controls rendering",
            body: (
              <>
                Adding <code>&quot;use client&quot;</code> does not create a new entry point or a
                separate file. It tells the bundler where the server/client boundary is. The Server
                Component above it in the tree still renders first; the Client Component is
                serialized as a reference and hydrated in the browser. The parent determines the
                data shape; the client component handles interactivity.
              </>
            ),
          },
          {
            title:
              "Streaming SSR shows the page progressively but breaks <title> and <meta> if you put them inside a streaming boundary",
            body: (
              <>
                React&apos;s streaming SSR with <code>Suspense</code> sends HTML in chunks as each
                suspended subtree resolves. The <code>&lt;head&gt;</code> is flushed first;
                anything inside a <code>&lt;Suspense&gt;</code> boundary is streamed later. If your{" "}
                <code>&lt;title&gt;</code> or <code>&lt;meta&gt;</code> tags depend on data inside a
                boundary, they arrive after crawlers have already read the head — defeating SEO.
                Keep head metadata in the outermost layout or use Next.js&apos;s{" "}
                <code>generateMetadata</code> export, which runs before streaming starts.
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
            <em>CSR</em> ships an empty HTML shell and builds everything in the browser — slow
            first paint, poor SEO, but zero server cost at request time.
          </>,
          <>
            <em>SSR</em> renders full HTML per request — fast first paint, always-fresh data, but
            every request hits the server and ships a JS bundle for hydration.
          </>,
          <>
            <em>SSG</em> pre-renders at build time and serves static files from a CDN — the fastest
            possible serving. <em>ISR</em> adds a revalidation timer so data can stay near-fresh
            without a full rebuild.
          </>,
          <>
            <em>Hydration</em> is the handshake between server HTML and client React — React walks
            the DOM, matches its JSX tree, and attaches event listeners. Server HTML and client JSX
            must be byte-for-byte identical or React throws a mismatch error.
          </>,
          <>
            <em>RSC</em> components run on the server and ship HTML, never JavaScript — their
            source code, imports, and secrets are zero bytes in the client bundle.
          </>,
          <>
            Pick the rendering mode per route: SSG for static marketing pages, ISR for slowly
            changing catalogs, SSR or RSC for personalized data, client components for interactive
            widgets — all coexist in one Next.js app.
          </>,
        ]}
        mentalModel="Rendering location is a slider, not a switch. Hydration wires server HTML up on the client. RSC ships HTML, never JS — components rendered on the server only."
      />

      {/* Alternatives — one paragraph after KeyTakeaways */}
      <Card>
        <CardContent className="pt-6 prose dark:prose-invert max-w-none">
          <p>
            <strong>Alternatives.</strong> <em>Nuxt</em> is the Vue-equivalent of Next.js with the
            same SSR/SSG/hybrid story. <em>SvelteKit</em> ships smaller bundles thanks to
            Svelte&apos;s compile-to-DOM model. <em>Remix</em> is a React framework that emphasizes
            data loading and progressive enhancement; merged into React Router 7. <em>Astro</em> is
            the islands-architecture pick for content-heavy sites. Pick the framework that matches
            your component model; SSR/SSG/RSC concepts transfer between them.
          </p>
        </CardContent>
      </Card>

    </div>
  );
}
