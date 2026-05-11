"use client";

import { Card, CardContent } from "@/components/ui/card";
import { StepByStepExplanation } from "@/components/StepByStepExplanation";
import { Challenge } from "@/components/Challenge";
import { GotchaList } from "@/components/GotchaList";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { RoadmapLink } from "@/components/RoadmapLink";
import { SequenceDiagram } from "@/components/SequenceDiagram";
import { LayeredFlow } from "@/components/LayeredFlow";
import { CodeComparison } from "@/components/CodeComparison";

export function Module_5_1_Content() {
  // Data blocks hoisted out of JSX for readability — listed in render order.

  const renderingSteps = [
    {
      title: "The CSR baseline: HTML arrives empty, JS paints the page",
      description: (
        <p>
          The Vite SPA from Stage IV delivers a minimal HTML shell to the browser. Open DevTools,
          click View Source on your deployed SPA, and you will see the entire document body is one
          line: <code>&lt;div id=&quot;root&quot;&gt;&lt;/div&gt;</code>. Nothing else. The browser
          receives that shell, then downloads the JavaScript bundle — sometimes hundreds of
          kilobytes — parses it, and runs it. Only after all three steps does React call{" "}
          <code>createRoot</code> and render your components into the empty div. <em>Time to first
          paint</em> equals the time to download, parse, and execute the bundle. On a fast desktop
          that is imperceptible. On a slow phone on a 3G network it is a blank white screen for 5
          or more seconds. This rendering strategy is called <em>CSR</em> — client-side rendering.
          The server delivers a shell; the client does all the work.
        </p>
      ),
      code: `<!-- What the server actually sends for a Vite React SPA -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Taproot Blog</title>
    <script type="module" src="/assets/index-C7dOK1Bz.js"></script>
  </head>
  <body>
    <div id="root"></div>  <!-- completely empty — Google sees this -->
  </body>
</html>

<!-- The browser then must:
  1. Download /assets/index-C7dOK1Bz.js  (often 300–600 KB)
  2. Parse the JS
  3. Execute React, which renders into #root
  Time to first paint = steps 1 + 2 + 3 combined. -->`,
      language: "html",
    },
    {
      title: "SSR: the server renders the HTML, ships it ready-painted",
      description: (
        <p>
          <em>SSR</em> — server-side rendering — moves the React render step to the server. When a
          request arrives, the server runs your React components, produces a full HTML string, and
          ships that string to the browser. The browser displays the page immediately upon
          receiving the HTML — no JS bundle needed for the first paint. Then a smaller JS bundle
          arrives and &quot;wakes up&quot; the already-visible HTML: attaching event listeners,
          restoring state, making the page interactive. That wake-up process is called{" "}
          <em>hydration</em>. The user sees content faster (Time to First Byte + one RTT to the
          server), and search engines index the real HTML. The trade: every request spins up a
          React render on the server, which adds CPU cost per request.
        </p>
      ),
      code: `// Conceptual: what an SSR server does on each request
// (Next.js handles this for you — this is the idea)

import { renderToString } from "react-dom/server";
import { App } from "./App";

export async function handleRequest(req) {
  // 1. Fetch any data the page needs (e.g. from a database)
  const posts = await db.post.findMany({ take: 10 });

  // 2. Run React on the server — produces a full HTML string
  const html = renderToString(<App posts={posts} />);

  // 3. Embed it in the shell and send it down
  return new Response(
    \`<!DOCTYPE html>
<html><body>
  <div id="root">\${html}</div>
  <script src="/bundle.js"></script>
</body></html>\`,
    { headers: { "Content-Type": "text/html" } }
  );
}

// The browser receives real HTML — Google can index it,
// OG tags are present, first paint is immediate.
// Then bundle.js arrives and hydrates the DOM.`,
      language: "tsx",
    },
    {
      title: "SSG: render at build time, serve from a CDN",
      description: (
        <p>
          For pages whose content does not change between requests — a blog post is the canonical
          case — there is no reason to run a server render on every request. <em>SSG</em> — static
          site generation — renders your React components at <em>build time</em> and writes the
          output to HTML files. Those files are uploaded to a CDN and served instantly worldwide
          with no server involved. A cold request to a CDN edge node is often under 50 ms. The
          trade is staleness: when you publish a new post, the HTML for the post-list page is stale
          until the next build. SSG is the fastest possible delivery for content that changes
          infrequently and where you control when it changes.
        </p>
      ),
      code: `// In Next.js App Router, a page component that fetches at build time
// is a Server Component with no dynamic data source — it SSGs automatically.

// app/(public)/posts/page.tsx
import { prisma } from "@/lib/db";

// No "use client" — this is a Server Component.
// It runs at build time (SSG) when there is no dynamic data.
export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    where: { draft: false },
    orderBy: { publishedAt: "desc" },
    take: 10,
  });

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <a href={\`/posts/\${post.slug}\`}>{post.title}</a>
        </li>
      ))}
    </ul>
  );
}

// At build time, Next.js renders this to posts/index.html.
// The CDN serves that file directly — zero server compute per request.
// When you add a new post, you redeploy to regenerate the HTML.`,
      language: "tsx",
    },
    {
      title: "ISR: SSG with a freshness timer",
      description: (
        <p>
          <em>ISR</em> — incremental static regeneration — is the hybrid. Pages start as SSG: the
          first user gets the cached HTML from the CDN. But each cached page carries a{" "}
          <em>revalidation window</em> — a number of seconds. After that window expires, the next
          request triggers a background re-render on the server. The user who triggered the
          re-render still sees the slightly-stale version; the <em>next</em> user sees the freshly
          rendered one. This pattern matches a blog well: posts change once a week, not once a
          second. A revalidation window of 3600 seconds means the page is at most one hour stale.
          You get CDN-speed delivery and automatic freshness without a full rebuild.
        </p>
      ),
      code: `// Next.js App Router — ISR via revalidate export
// app/(public)/posts/page.tsx

import { prisma } from "@/lib/db";

// This tells Next.js: cache this page as static HTML,
// but re-render it in the background after 3600 seconds.
export const revalidate = 3600; // seconds

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    where: { draft: false },
    orderBy: { publishedAt: "desc" },
    take: 10,
  });

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <a href={\`/posts/\${post.slug}\`}>{post.title}</a>
        </li>
      ))}
    </ul>
  );
}

// Timeline:
// Request at T+0:   CDN returns cached HTML (from last build or re-render).
// Request at T+3601: Cache expired. User sees stale page; server re-renders in background.
// Request at T+3602: User sees the freshly rendered page from the background job.`,
      language: "tsx",
    },
    {
      title: "RSC: some components never ship to the client at all",
      description: (
        <p>
          <em>RSC</em> — React Server Components — is the newest layer. In the App Router, every
          component is a Server Component by default. Server components run <em>only</em> on the
          server: they fetch data, render to HTML, and their source code is never included in the
          JS bundle the browser downloads. That means zero bytes of JS shipped for pure
          data-fetching components. Client components — anything that uses <code>useState</code>,
          <code>useEffect</code>, browser APIs, or event handlers — must be explicitly marked with
          the directive <code>&quot;use client&quot;</code> at the top of the file. The{" "}
          <em>client/server boundary</em> is that directive. You compose server and client
          components freely; a server component can render a client component as a child.
        </p>
      ),
      code: `// ServerPostList.tsx — a Server Component (default; no "use client")
// Runs only on the server. Its source code is never in the browser bundle.
import { prisma } from "@/lib/db";
import { ClientCommentInput } from "./ClientCommentInput";

export async function ServerPostList() {
  // This database call runs on the server. The browser never sees this code.
  const posts = await prisma.post.findMany({ where: { draft: false } });

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <h2>{post.title}</h2>
          {/* A client component can be a child of a server component */}
          <ClientCommentInput postId={post.id} />
        </li>
      ))}
    </ul>
  );
}

// ──────────────────────────────────────────────────────────────

// ClientCommentInput.tsx — a Client Component
"use client"; // ← this directive marks the client/server boundary

import { useState } from "react";

interface Props { postId: string; }

export function ClientCommentInput({ postId }: Props) {
  // useState is only valid in client components.
  const [body, setBody] = useState("");

  return (
    <form action={\`/api/comments/\${postId}\`} method="POST">
      <textarea value={body} onChange={(e) => setBody(e.target.value)} />
      <button type="submit">Post comment</button>
    </form>
  );
}

// The JS bundle includes ClientCommentInput but NOT ServerPostList.
// You pay JS cost only for the interactive parts.`,
      language: "tsx",
    },
    {
      title: "Hydration: waking up server-rendered HTML",
      description: (
        <p>
          <em>Hydration</em> is the process by which the client JS bundle attaches event listeners
          and React state to the HTML that the server already rendered. The browser has the HTML on
          screen (fast first paint). Then the bundle arrives, React walks the existing DOM, and
          &quot;claims&quot; each node — connecting <code>onClick</code> handlers, initializing{" "}
          <code>useState</code>, and subscribing to context. Until hydration completes, the page is
          visible but not interactive. The hydration cost is the cost of running the client
          components&apos; render functions against the existing DOM. RSC reduces it because server
          components have no client-side code to run. Streaming hydration via{" "}
          <code>Suspense</code> boundaries lets the page hydrate progressively — critical
          interactive sections hydrate first, the rest follows. A <em>hydration mismatch</em>
          occurs when the client renders something different from what the server sent —{" "}
          <code>Date.now()</code> or <code>Math.random()</code> at the top level of a component
          are the classic causes. React throws a warning or error and falls back to a full
          client-side re-render, discarding the server HTML.
        </p>
      ),
      code: `// Hydration mismatch — the classic footgun
// This component will mismatch on every request.

export function LastSeen() {
  // Date.now() returns a different value on the server (at render time)
  // and on the client (at hydration time, milliseconds later).
  // React detects the mismatch and logs an error.
  const ts = Date.now();
  return <p>Page generated at: {ts}</p>;
}

// Fix: suppress hydration for content that intentionally differs,
// or move time-sensitive rendering to useEffect (client-only).

"use client";
import { useState, useEffect } from "react";

export function LastSeenFixed() {
  const [ts, setTs] = useState<number | null>(null);

  useEffect(() => {
    // Only runs on the client — no mismatch.
    setTs(Date.now());
  }, []);

  if (ts === null) return <p>Loading...</p>;
  return <p>Page loaded at: {ts}</p>;
}

// Streaming hydration with Suspense:
// <Suspense fallback={<Spinner />}>
//   <HeavyClientComponent />   ← hydrates when its bundle chunk arrives
// </Suspense>
// The rest of the page is already interactive.`,
      language: "tsx",
    },
    {
      title: "Next.js App Router: file-system routes, nested layouts, and the reference app",
      description: (
        <p>
          <em>Next.js</em> is the most widely adopted concrete implementation of SSR + SSG + ISR +
          RSC. Its <em>App Router</em> (introduced in Next.js 13, stable in 14+) maps the file
          system to routes: a file at <code>app/posts/[slug]/page.tsx</code> is automatically the
          route <code>/posts/:slug</code>. A <em>route group</em> — a folder wrapped in
          parentheses like <code>(public)</code> — organizes routes without affecting the URL. A{" "}
          <code>layout.tsx</code> file wraps all routes in its subtree; layouts nest: the root{" "}
          <code>app/layout.tsx</code> wraps everything; <code>app/(public)/layout.tsx</code> adds
          the site header and footer for all public routes. The <code>loading.tsx</code> and{" "}
          <code>error.tsx</code> conventions handle loading UI and error boundaries automatically.
          Vite from Stage IV was a bundler you chose yourself; Next.js uses its own bundler
          (Webpack in older versions, Turbopack in newer ones) — you no longer select it.
        </p>
      ),
      code: `// app/(public)/posts/[slug]/page.tsx — the real route file from taproot-blog/app
// This is a Server Component: it runs on the server, fetches from the DB,
// and renders to HTML that Google can index. OG tags are set via generateMetadata.

import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import PostBody from "@/components/PostBody";
import AuthorCard from "@/components/AuthorCard";
import CommentList from "@/components/CommentList";
import CommentForm from "@/components/CommentForm";
import type { Metadata } from "next";

interface Params { params: Promise<{ slug: string }>; }

// generateMetadata runs on the server before the page renders.
// The <meta og:title> tag is in the HTML — social previews work.
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, images: [post.coverUrl] },
  };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug, draft: false },
    include: { author: true, tags: { include: { tag: true } } },
  });
  if (!post) notFound();

  return (
    <article>
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <p className="text-sm text-[var(--muted)] mt-2 mb-6">
        By {post.author.name} — {post.publishedAt?.toISOString().slice(0, 10)}
      </p>
      <PostBody source={post.body} />
      <AuthorCard author={post.author} />
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Comments</h2>
        <CommentList postId={post.id} />
        <CommentForm postId={post.id} />  {/* "use client" component */}
      </section>
    </article>
  );
}

// Route file system layout:
// app/
//   layout.tsx                    ← root layout: <html><body>
//   (public)/
//     layout.tsx                  ← adds header + footer for all public pages
//     page.tsx                    ← route: /
//     posts/
//       loading.tsx               ← Suspense fallback for this subtree
//       error.tsx                 ← error boundary for this subtree
//       [slug]/
//         page.tsx                ← route: /posts/:slug  (this file)
//   admin/                        ← route group — separate layout, auth-gated
//   api/                          ← Route Handlers (REST endpoints)
//   login/`,
      language: "tsx",
    },
  ];

  const csrCode = `// CSR: a component that fetches its own data on the client
// File: src/components/PostList.tsx  (Vite SPA)
"use client"; // implied in a Vite SPA — everything is a client component

import { useState, useEffect } from "react";

export function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // This runs in the browser, after the JS bundle loads.
    fetch("/api/posts")
      .then((r) => r.json())
      .then(setPosts);
  }, []);

  if (posts.length === 0) return <p>Loading...</p>;

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}

// What Google sees when it crawls the page:
// <div id="root"></div>
// (empty — the fetch hasn't run yet)

// What a slow-phone user sees for the first 5 seconds:
// a blank white screen`;

  const rscCode = `// RSC: the same component as a Server Component
// File: app/(public)/page.tsx  (Next.js App Router)
// No "use client" — this is a Server Component by default.

import { prisma } from "@/lib/db";

export default async function PostList() {
  // This runs on the server. The browser never downloads this code.
  // prisma is never shipped to the client.
  const posts = await prisma.post.findMany({
    where: { draft: false },
    orderBy: { publishedAt: "desc" },
    take: 10,
  });

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}

// What Google sees when it crawls the page:
// <ul>
//   <li>Hello World</li>
//   <li>Why I stopped using ORM</li>
//   ...
// </ul>
// (real HTML — fully indexable)

// What a slow-phone user sees immediately:
// the post list, painted from the HTML that arrived`;

  const renderingSliderStages = [
    {
      label: "CSR",
      detail: "Client renders everything. Server ships empty shell.",
      color: "rose" as const,
    },
    {
      label: "SSR",
      detail: "Server renders on every request. Client hydrates.",
      color: "amber" as const,
    },
    {
      label: "SSG",
      detail: "Server renders at build time. CDN serves static HTML.",
      color: "blue" as const,
    },
    {
      label: "ISR",
      detail: "SSG + background refresh after TTL expires.",
      color: "violet" as const,
    },
    {
      label: "RSC",
      detail: "Per-component: some stay on server, some go to client.",
      color: "emerald" as const,
    },
  ];

  const csrSequenceActors = ["Browser", "CDN / Server", "JS Bundle"];
  const csrSequenceMessages = [
    { from: "Browser", to: "CDN / Server", label: "GET /", note: "requests the page" },
    { from: "CDN / Server", to: "Browser", label: "<div id='root'></div>", note: "empty HTML shell" },
    { from: "Browser", to: "JS Bundle", label: "download bundle.js", note: "300–600 KB" },
    { from: "JS Bundle", to: "Browser", label: "React.render()", note: "first paint — blank until now" },
    { from: "Browser", to: "CDN / Server", label: "fetch('/api/posts')", note: "data request from client" },
    { from: "CDN / Server", to: "Browser", label: "JSON response", note: "page updates with data" },
  ];

  const ssrSequenceActors = ["Browser", "Next.js Server", "Database"];
  const ssrSequenceMessages = [
    { from: "Browser", to: "Next.js Server", label: "GET /posts/hello-world", note: "requests the page" },
    { from: "Next.js Server", to: "Database", label: "prisma.post.findUnique()", note: "server fetches data" },
    { from: "Database", to: "Next.js Server", label: "post row", note: "" },
    { from: "Next.js Server", to: "Browser", label: "full HTML response", note: "page is already painted" },
    { from: "Browser", to: "Next.js Server", label: "download client bundle", note: "small — only client components" },
    { from: "Browser", to: "Browser", label: "hydrate()", note: "attach event listeners to existing HTML" },
  ];

  const gotchaItems = [
    {
      title: "Hydration mismatch is the most common production-only bug",
      body: (
        <>
          <code>Date.now()</code> or <code>Math.random()</code> called at the top level of a
          component return different values on the server and the client. React detects the
          mismatch, logs a hydration error, and falls back to a full client-side re-render —
          discarding the server HTML entirely. The fix: move time-sensitive or random values into{" "}
          <code>useEffect</code>, or use <code>suppressHydrationWarning</code> on elements where
          the difference is intentional (e.g., a timestamp you want to show in the user&apos;s
          local timezone).
        </>
      ),
    },
    {
      title: "RSC components don&apos;t ship to the client — but their children&apos;s client components still do",
      body: (
        <>
          A Server Component&apos;s source code is never in the browser bundle. But if that
          Server Component renders a <code>&quot;use client&quot;</code> child, that child&apos;s
          code is in the bundle. The boundary is the <code>&quot;use client&quot;</code> directive,
          not the component tree depth. A Server Component can safely import a database library;
          the moment you add <code>&quot;use client&quot;</code> to that file, that import travels
          to the browser too — usually causing a runtime error or a large unexpected bundle size.
        </>
      ),
    },
    {
      title: "SSG is fast for users but can be slow for the build pipeline",
      body: (
        <>
          A blog with 50,000 posts that pre-renders every post page at deploy time may take hours
          to build. The correct answer is usually ISR: pre-render the most popular N posts at build
          time and let the rest generate on first request (the &quot;on-demand&quot; ISR pattern
          with <code>fallback: true</code>). Don&apos;t default to SSG for content-heavy sites
          without measuring build time first.
        </>
      ),
    },
    {
      title: "Streaming SSR surprises layout-shift watchers",
      body: (
        <>
          Streaming SSR with <code>Suspense</code> boundaries sends the HTML in chunks: the shell
          and above-the-fold content arrive first; slower data-dependent sections stream in
          afterwards. This is great for perceived performance — users see something immediately —
          but the page layout shifts as each chunk arrives. If a Cumulative Layout Shift (CLS)
          score matters (e.g., a Lighthouse audit), reserve space for streaming sections with
          fixed-height skeleton placeholders in the <code>fallback</code> prop.
        </>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-3xl font-bold">Routes, Layouts, and Where Should This Render</h1>
        <RoadmapLink url="https://roadmap.sh/frontend" />
      </div>

      {/* Section 1: Hook */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            The blog SPA from Stage IV works. Users can read posts, leave comments, and see updates
            without a page reload. But deploy it to production and three problems surface
            simultaneously — and none of them show up in your local Chrome on a fast MacBook.
          </p>
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            First: paste the URL into Google Search Console. Google reports zero indexed pages. Open
            View Source on the deployed URL: the entire body is{" "}
            <code>&lt;div id=&quot;root&quot;&gt;&lt;/div&gt;</code>. Google indexes HTML; the SPA
            delivers an empty div. The post content exists only after JavaScript runs, and
            Google&apos;s crawler does not execute JavaScript the way a browser does.
          </p>
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            Second: share a post URL on Slack or Twitter. The link preview shows no title, no
            description, no image — just the bare URL. Open Graph tags (<code>og:title</code>,{" "}
            <code>og:description</code>, <code>og:image</code>) need to be present in the HTML at
            request time. The SPA writes them after React runs, which is after the social media
            crawler has already given up.
          </p>
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            Third: test on a mid-range Android phone on a throttled 3G connection. The Lighthouse
            Largest Contentful Paint score comes back at 6.2 seconds — red. The user stares at a
            blank white screen for six seconds while the JavaScript bundle downloads, parses, and
            executes. Only then does React call <code>createRoot</code> and paint the page.
          </p>
          <div className="bg-slate-900 text-slate-100 rounded p-4 font-mono text-sm mb-4 overflow-x-auto leading-relaxed">
            <span className="text-red-400">LCP: 6.2s</span>
            <span className="text-slate-400">{" "}← Largest Contentful Paint (red: over 4s)</span>
            <br />
            <span className="text-slate-400">{"<!-- View Source: -->"}</span>
            <br />
            <span className="text-slate-400">{"<body>"}</span>
            <br />
            <span className="text-slate-300">{"  "}</span>
            <span className="text-amber-300">{"<div id=\"root\">"}</span>
            <span className="text-slate-400">{"  <!-- nothing here -->"}</span>
            <span className="text-amber-300">{"</div>"}</span>
            <br />
            <span className="text-slate-400">{"</body>"}</span>
            <br />
            <br />
            <span className="text-slate-400">{"<!-- Twitter Card: [no preview available] -->"}</span>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            All three failures share the same root cause: the SPA assumes JavaScript will run
            before anything meaningful is shown or read. Search engines, social media crawlers, and
            users on slow connections do not share that assumption. What if some of the page were
            already there when the HTML arrived?
          </p>
        </CardContent>
      </Card>

      {/* Section 2: Mental model */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            The instinct when first learning about SSR is to treat it as a binary: either the
            browser renders the app (CSR) or the server does (SSR). That framing leads to
            all-or-nothing rewrites and endless debates about which is better. It is the wrong
            model.
          </p>
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            The better model is a slider. On one end: everything runs in the browser (CSR). On the
            other end: nothing runs in the browser (a static HTML file). In between are SSR, SSG,
            ISR, and React Server Components — each a different position on the same slider, each
            optimising for a different trade between freshness, speed, server cost, and
            interactivity. Modern frameworks like Next.js let you set the slider position per
            route, and even per component.
          </p>
          <blockquote className="border-l-4 border-blue-500 pl-4 italic text-slate-600 dark:text-slate-400">
            Rendering location is a slider, not a switch.
          </blockquote>
        </CardContent>
      </Card>

      {/* Section 3: Step-by-step */}
      <h2 className="text-xl font-semibold mb-3">From empty div to ready-painted HTML</h2>
      <StepByStepExplanation
        title="CSR, SSR, SSG, ISR, RSC, and hydration"
        description="Each step adds one position on the rendering-location slider, building from the CSR baseline to React Server Components."
        steps={renderingSteps}
      />

      {/* Optional: CSR vs SSR sequence diagrams */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SequenceDiagram
          title="CSR — client does all the work"
          description="The server ships an empty shell. The browser downloads the bundle, runs React, then fetches data. First paint is gated on all three."
          actors={csrSequenceActors}
          messages={csrSequenceMessages}
        />
        <SequenceDiagram
          title="SSR / RSC — server ships ready HTML"
          description="The server fetches data and renders to HTML before responding. The browser paints immediately. A small client bundle hydrates interactive parts."
          actors={ssrSequenceActors}
          messages={ssrSequenceMessages}
        />
      </div>

      {/* Optional: rendering strategies as a slider */}
      <LayeredFlow
        title="The rendering-location slider"
        description="Each strategy is a different position between full client-side rendering (CSR) and zero client-side rendering (static HTML). Modern apps mix strategies per route."
        stages={renderingSliderStages}
        direction="horizontal"
      />

      {/* 4. Playground (no live playground; rendering-location requires a Next.js runtime) */}
      <CodeComparison
        title="The same component: CSR vs RSC"
        description="Left: a Vite SPA component that fetches data on the client — the HTML Google sees is empty. Right: the same component rewritten as a Next.js Server Component — the HTML Google sees has real content."
        oldCode={{
          title: "CSR (Vite SPA)",
          code: csrCode,
          language: "tsx",
          cons: [
            "Google indexes an empty <div> — the post list is invisible to search.",
            "First paint waits for JS bundle download, parse, and a separate data fetch.",
            "prisma or DB libraries cannot be used here — this code runs in the browser.",
          ],
        }}
        newCode={{
          title: "RSC (Next.js App Router)",
          code: rscCode,
          language: "tsx",
          pros: [
            "Google indexes real post titles in HTML — fully indexable.",
            "First paint is the HTML response — no bundle needed for this component.",
            "prisma runs on the server — DB credentials never reach the browser.",
          ],
        }}
      />

      {/* Section 5: Challenges */}
      <h2 className="text-xl font-semibold mb-3">Challenges</h2>

      <Challenge
        title="Pick a rendering strategy: the blog post-list page"
        question={`You are building the homepage for the Taproot Blog. It shows the 10 most recent posts. New posts are published roughly once a week, by two authors. The homepage does not show any per-user data (no "logged in as" state).

Which rendering strategy is the best fit?`}
        options={[
          {
            id: "a",
            text: "CSR. Fetch the post list from the client with useEffect and a REST endpoint. It works and requires no server configuration.",
          },
          {
            id: "b",
            text: "SSR. Render the post list on the server on every request to ensure the data is always fresh.",
          },
          {
            id: "c",
            text: "SSG or ISR. The content changes at most once a week. Pre-render the page to static HTML at build time (SSG) or with a revalidation window of a few hours (ISR). Serve it from a CDN — fastest delivery, zero server compute per request, fully indexable.",
          },
          {
            id: "d",
            text: "RSC without any caching. Run a database query on every request inside a Server Component to guarantee the freshest data.",
          },
        ]}
        correctAnswerId="c"
        explanation={
          <p>
            The homepage shows content that changes at most once a week and has no per-user
            dynamic data. SSG or ISR is the correct fit: the page can be pre-rendered to static
            HTML and served from a CDN in milliseconds, fully indexable by Google. CSR (option a)
            would work but leaves the page invisible to Google and slow on first paint. SSR (option
            b) adds server CPU cost on every request for content that rarely changes — that cost
            buys nothing here. Option d (RSC without caching) has the same problem as SSR: a
            database query per request for weekly-changing data is wasteful. The slider insight:
            the less frequently content changes and the less user-specific it is, the further right
            you push the slider toward static delivery.
          </p>
        }
      />

      <Challenge
        title="Why can&apos;t this component be a Server Component?"
        question={`A teammate writes the following component and marks it "use client":

\`\`\`tsx
"use client";
import { useState } from "react";

export function CommentInput({ postId }: { postId: string }) {
  const [body, setBody] = useState("");
  return (
    <form action={\`/api/comments/\${postId}\`} method="POST">
      <textarea value={body} onChange={(e) => setBody(e.target.value)} />
      <button type="submit">Post comment</button>
    </form>
  );
}
\`\`\`

Why is the "use client" directive necessary here?`}
        options={[
          {
            id: "a",
            text: "Server Components cannot render HTML form elements. Forms must always be client components.",
          },
          {
            id: "b",
            text: "Server Components cannot accept props. The postId prop requires the component to be a client component.",
          },
          {
            id: "c",
            text: "useState is a React hook that only works in client components. It relies on browser-side state that persists between re-renders triggered by user interaction. A Server Component runs once on the server and produces static HTML — it has no mechanism to track or update state in response to typing.",
          },
          {
            id: "d",
            text: "The fetch API used by the form action is a browser API. Server Components cannot reference browser APIs.",
          },
        ]}
        correctAnswerId="c"
        explanation={
          <p>
            <code>useState</code> — and all React hooks that manage client-side state or effects
            (<code>useEffect</code>, <code>useRef</code>, <code>useContext</code> with a
            client-side context) — only work in client components. A Server Component renders
            exactly once per request, produces HTML, and is done. It has no concept of re-rendering
            in response to user input. The <code>&quot;use client&quot;</code> directive marks the
            boundary: from this file downward in the tree, components run in the browser and have
            access to browser APIs, hooks, and event handlers. Option a is wrong — Server Components
            can render form elements; Next.js Server Actions let forms submit without any client JS.
            Option b is wrong — Server Components accept props freely. Option d is wrong — the
            form&apos;s action attribute is just a string; no browser API is called.
          </p>
        }
      />

      {/* Section 6: GotchaList */}
      <h2 className="text-xl font-semibold mb-3">Things that surprise people</h2>
      <GotchaList items={gotchaItems} />

      {/* Section 7: KeyTakeaways */}
      <KeyTakeaways
        mentalModel="Rendering location is a slider, not a switch."
        points={[
          <>
            <em>CSR</em> (client-side rendering) sends an empty HTML shell and lets the browser do
            all the work. First paint waits on the JS bundle. Search engines and social crawlers
            see an empty page. It is the right choice for highly interactive, auth-gated UIs where
            indexability does not matter.
          </>,
          <>
            <em>SSR</em> runs React on the server per request and ships full HTML. The browser
            paints immediately; then <em>hydration</em> attaches event handlers to the existing
            DOM. The cost is server CPU on every request. Use it for pages that need fresh,
            per-request data and must be indexed.
          </>,
          <>
            <em>SSG</em> renders at build time and serves static HTML from a CDN — the fastest
            possible delivery. <em>ISR</em> extends it with a revalidation TTL so pages refresh
            automatically without a full rebuild. These are the right defaults for content that
            changes infrequently and has no per-user data.
          </>,
          <>
            <em>RSC</em> — React Server Components — makes the rendering-location decision
            per component. Server components fetch data, render to HTML, and ship zero bytes of JS
            to the browser. Client components, marked with <code>&quot;use client&quot;</code>,
            are the only ones that ship JS and handle interactivity. The <em>client/server
            boundary</em> is that directive.
          </>,
          <>
            Next.js <em>App Router</em> implements all four strategies via file-system routing:
            folder structure maps to URLs, <code>layout.tsx</code> files compose nested layouts,
            and <code>loading.tsx</code> / <code>error.tsx</code> handle streaming and errors.
            A <em>route group</em> (a folder in parentheses) organises routes without affecting
            the URL. The rendering strategy is set per route via <code>export const revalidate</code>{" "}
            or by whether the page has dynamic data.
          </>,
        ]}
      />
    </div>
  );
}
