"use client";

import { Card, CardContent } from "@/components/ui/card";
import { HTMLPlayground } from "@/components/CodePlayground";
import { StepByStepExplanation, Step } from "@/components/StepByStepExplanation";
import { Challenge } from "@/components/Challenge";
import { GotchaList } from "@/components/GotchaList";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { RoadmapLink } from "@/components/RoadmapLink";

export function Module_7_4_Content() {
  // Data blocks hoisted out of JSX for readability — listed in render order.
  const markdownToDeployedSteps: Step[] = [
    {
      title: 'Step 1: What an SSG does',
      description: (
        <>
          An <em>SSG (Static Site Generator)</em> — a tool that runs your code, fetches your data,
          composes your templates, and produces HTML files — does all of this at{' '}
          <strong>build time</strong>, not at request time. Once built, those HTML files are uploaded
          to a CDN and served verbatim. When a user visits the page, the CDN returns a file from
          the nearest edge; no server wakes up, no database query runs, no template is rendered.
          Build time can be seconds for a small site or minutes for thousands of pages, but that
          cost is paid once per deploy — not once per visitor.
        </>
      ),
      code: `# Traditional SSR: request-time work per visitor
GET /blog/my-post
  → server starts
  → query database for post
  → render template
  → return HTML
  # cost: database + render on every request

# SSG: build-time work once per deploy
$ npm run build
  → read Markdown files
  → render all 800 posts to HTML
  → output: dist/blog/my-post/index.html
  # cost: paid at build; CDN serves the file, no server needed`,
    },
    {
      title: 'Step 2: Astro — islands by default',
      description: (
        <>
          <em>Astro</em> — an island-architecture SSG that ships HTML by default and JavaScript only
          for interactive components — outputs <strong>zero JavaScript</strong> unless you ask for
          it. An Astro component is a template: the frontmatter fence (<code>---</code>) is
          server-side JavaScript that runs at build time; the markup below it is the HTML output.
          To make a component interactive, you annotate it with a hydration directive:{' '}
          <code>client:load</code> hydrates immediately, <code>client:visible</code> waits until the
          component scrolls into view, and <code>client:idle</code> waits until the browser is free.
          Everything else is plain HTML — no framework runtime shipped.
        </>
      ),
      code: `---
// src/pages/blog/[slug].astro
// This runs at BUILD TIME on Node — not in the browser.
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.slug },
    props:  { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
const { title, date } = post.data;
---

<!-- Plain HTML — no JavaScript shipped for this part -->
<article>
  <h1>{title}</h1>
  <time>{date.toLocaleDateString('en-AU')}</time>
  <Content />
</article>

<!-- This React component DOES ship JS — it's an "island" -->
<LikeButton client:load postId={post.slug} />`,
    },
    {
      title: 'Step 3: Eleventy — simpler, content-first',
      description: (
        <>
          <em>Eleventy (11ty)</em> — a simple, JavaScript-based SSG — takes a different bet:
          Markdown plus a templating language (Nunjucks, Liquid, or plain JS) maps directly to
          HTML files. There is no component model, no hydration, no framework runtime — just
          templates. File-based routing means <code>src/blog/my-post.md</code> becomes{' '}
          <code>/blog/my-post/index.html</code> automatically. Zero JavaScript ships by default.
          Eleventy is the right pick when your content shape is well-known, you don&apos;t need
          interactivity, and you want the fastest possible build. It is the SSG that most clearly
          treats HTML as the product.
        </>
      ),
      code: `# Eleventy: content/blog/my-post.md → _site/blog/my-post/index.html

---
title: My Post
date: 2026-01-15
layout: post.njk
---

# My Post

This Markdown compiles to HTML at build time.
No JavaScript is shipped — the output is a plain .html file.

# eleventy.config.js
export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('src/assets');
  return { dir: { input: 'content', output: '_site' } };
}`,
    },
    {
      title: 'Step 4: Next.js static export',
      description: (
        <>
          If your team is already on React, you don&apos;t have to switch tools. Setting{' '}
          <code>output: &apos;export&apos;</code> in <code>next.config.js</code> tells Next.js to
          produce a static site from your app instead of a Node.js server. You keep the React
          component model, TypeScript, and the App Router&apos;s file-based routing — you lose
          anything that requires a runtime server: dynamic routes with per-request data,{' '}
          <code>revalidate</code>, middleware, API routes, and image optimization. The output is a{' '}
          <code>out/</code> directory of HTML, CSS, and JS files deployable to any CDN. Best when
          the team knows Next.js and the site is genuinely static (blog, docs, marketing).
        </>
      ),
      code: `// next.config.js
const nextConfig = {
  output: 'export',  // ← produces /out directory of static files
  // trailingSlash: true,  // recommended for static hosts
};
export default nextConfig;

// $ npm run build
// → out/
//     index.html
//     blog/my-post/index.html
//     _next/static/...   (JS bundles, CSS)
//
// Deploy the whole 'out/' to Netlify, Vercel, S3, GitHub Pages, etc.
// No Node.js server required.`,
    },
    {
      title: 'Step 5: Islands architecture',
      description: (
        <>
          <em>Islands architecture</em> — a page is mostly static HTML with isolated interactive
          components (&quot;islands&quot;) that ship JS independently — solves the performance
          problem of framework-heavy SSR. A typical blog post is 80% static: title, paragraphs,
          images. The remaining 20% is interactive: a like button, a comment form, a syntax
          highlighter that responds to theme changes. With islands, only those components ship and
          hydrate JavaScript. The rest of the page is delivered as HTML — no download, no parse, no
          execution. Each island is a self-contained bundle; a broken island does not take down the
          page.
        </>
      ),
      code: `<!-- Islands architecture: most of the page is plain HTML -->

<article>               <!-- static HTML — no JS shipped -->
  <h1>My Post</h1>
  <p>Content here...</p>
  <img src="/photo.jpg" alt="..." />
</article>

<!-- Only these two components ship JavaScript: -->

<LikeButton
  client:load       <!-- hydrates immediately on page load -->
  postId="my-post"
/>

<Comments
  client:visible    <!-- hydrates only when scrolled into view -->
  postId="my-post"
/>

<!-- The page works as HTML even if JS fails to load.
     Each island hydrates independently, in parallel. -->`,
    },
    {
      title: 'Step 6: When SSG vs SSR',
      description: (
        <>
          The decision rule is simple: <strong>is the content known at build time?</strong> A blog
          post written yesterday, a documentation page, a product landing page — all known at build
          time, all perfect for SSG. A user&apos;s dashboard showing their own data, a search
          results page, a real-time price feed — per-request or per-user, requiring SSR. The bridge
          is <em>ISR (Incremental Static Regeneration)</em> — SSG with revalidation: pages
          re-build on demand after a TTL — which covers the case where content changes between
          deploys without a full rebuild. When in doubt, default to SSG and add SSR only where a
          page genuinely cannot be pre-rendered.
        </>
      ),
      code: `// Decision table

// SSG — content known at build time
// ✓ Blog posts, docs, marketing pages, portfolios
// ✓ ~same HTML for all visitors
// ✓ Cheap: CDN serves a file, no server needed

// SSR — content changes per request
// ✓ Auth'd dashboards, user-specific feeds
// ✓ Real-time data (prices, availability)
// ✓ Personalization at request time

// ISR — SSG + revalidation (Next.js)
// ✓ Content that changes occasionally between deploys
// ✓ Large sites where a full rebuild is slow

// Example in Next.js App Router:
export const revalidate = 3600; // re-generate this page every 1 hour
// or: export const dynamic = 'force-static'; // always SSG`,
    },
  ];

  const playgroundHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Islands architecture demo</title>
</head>
<body>
  <!-- STATIC HTML — no JavaScript needed for this section -->
  <header class="site-header">
    <nav>
      <a href="/">Home</a>
      <a href="/blog">Blog</a>
      <a href="/about">About</a>
    </nav>
  </header>

  <main>
    <article class="post">
      <h1>Why islands architecture wins</h1>
      <p class="byline">Published 15 Jan 2026 · 4 min read</p>

      <!-- This whole article section is plain HTML — zero JS shipped -->
      <p>
        Static HTML loads instantly and works even when JavaScript is disabled
        or slow. The browser renders the content from the first byte, with no
        framework runtime needed.
      </p>
      <p>
        The key insight is that most of a typical page is <strong>read-only</strong>.
        You only need JavaScript where the user actually interacts.
      </p>

      <blockquote>
        "Build once, serve many. Islands architecture: mostly-static HTML
        with sprinkles of JS where interaction is needed."
      </blockquote>
    </article>

    <!-- ISLAND — this section uses JavaScript -->
    <!-- In Astro: <SubscribeForm client:load /> -->
    <!-- Only this component ships a JS bundle -->
    <section class="island" id="subscribe-island">
      <h2>Stay in the loop</h2>
      <p class="island-label">[ JavaScript island — hydrates client:load ]</p>
      <form id="subscribe-form">
        <input
          type="email"
          id="email-input"
          placeholder="you@example.com"
          required
        />
        <button type="submit">Subscribe</button>
      </form>
      <p id="subscribe-msg" class="msg" hidden></p>
    </section>
  </main>

  <footer>
    <p>Built with Astro · Deployed to CDN · No server runtime</p>
  </footer>

  <script src="/script.js"></script>
</body>
</html>`;

  const playgroundCss = `* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: system-ui, sans-serif;
  color: #1e293b;
  max-width: 680px;
  margin: 0 auto;
  padding: 24px 16px;
  line-height: 1.6;
}
.site-header {
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 12px;
  margin-bottom: 32px;
}
nav { display: flex; gap: 20px; }
nav a { color: #3b82f6; text-decoration: none; font-size: 0.9rem; }
nav a:hover { text-decoration: underline; }
h1 { font-size: 1.6rem; font-weight: 700; margin-bottom: 4px; }
.byline { color: #64748b; font-size: 0.85rem; margin-bottom: 20px; }
p { margin-bottom: 14px; }
blockquote {
  border-left: 4px solid #3b82f6;
  padding: 10px 16px;
  background: #eff6ff;
  color: #1e40af;
  font-style: italic;
  margin: 20px 0;
  border-radius: 0 6px 6px 0;
}
strong { color: #0f172a; }
.island {
  margin-top: 36px;
  padding: 20px;
  background: #f0fdf4;
  border: 2px dashed #22c55e;
  border-radius: 8px;
}
.island h2 { font-size: 1.1rem; margin-bottom: 4px; }
.island-label {
  font-size: 0.75rem;
  color: #16a34a;
  font-family: monospace;
  margin-bottom: 14px;
}
#subscribe-form { display: flex; gap: 8px; flex-wrap: wrap; }
input[type="email"] {
  flex: 1;
  min-width: 180px;
  padding: 8px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.9rem;
}
input[type="email"]:focus {
  outline: 2px solid #22c55e;
  outline-offset: 2px;
  border-color: transparent;
}
button {
  padding: 8px 18px;
  background: #22c55e;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  font-weight: 500;
}
button:hover { background: #16a34a; }
.msg { margin-top: 10px; font-size: 0.9rem; }
.msg.success { color: #16a34a; }
.msg.error { color: #dc2626; }
footer {
  margin-top: 48px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
  color: #94a3b8;
  font-size: 0.8rem;
  text-align: center;
}`;

  const playgroundJs = `// Try this: open DevTools → Network. The page HTML loads in one request,
// most of the page renders without any JavaScript. Only the subscribe
// form (the "island") loads its tiny script. That's the islands architecture
// — the page is mostly HTML, with sprinkles of JS where interaction lives.

const form = document.getElementById('subscribe-form');
const msg  = document.getElementById('subscribe-msg');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = document.getElementById('email-input').value.trim();
  if (!email) return;

  // Simulate a subscribe API call
  msg.hidden = false;
  msg.className = 'msg';
  msg.textContent = 'Subscribing...';

  setTimeout(() => {
    msg.className = 'msg success';
    msg.textContent = 'Subscribed! Check your inbox for a confirmation email.';
    form.reset();
  }, 800);
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
              Your blog has 800 posts and a contact form. The blog never changes between deploys;
              the contact form needs JavaScript. Building an SSR app means a server that&apos;s
              mostly idle — building an SSG app means 800 static HTML files served from a CDN edge
              plus one tiny JS bundle for the form. Same content, dramatically different cost and
              speed.
            </p>
            <p>
              This is the central bet of <em>SSG (Static Site Generation)</em>: move all rendering
              work to build time so that request time is trivially cheap. The user gets back a
              pre-built file from the nearest CDN edge in milliseconds. No server spins up, no
              database query runs. The harder question is <em>when</em> that bet pays off — and
              when per-request SSR is worth the cost. That is what this module teaches.
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
              The promise of SSG is that a server doing the same work on every request is wasteful
              when the output would be identical. Pre-render once, cache everywhere. That logic
              extends down to the component level with islands architecture: even inside a mostly-static
              page, only the components that truly need JavaScript should ship it. The page is a
              sea of HTML with isolated interactive components — &quot;islands&quot; — floating in it.
              Each island hydrates independently; a broken island does not sink the page. This model
              keeps bundles small, first paint fast, and the fallback (plain HTML) always present.
            </p>
            <blockquote className="border-l-4 border-blue-500 pl-4 italic">
              &quot;Build once, serve many. Islands architecture: mostly-static HTML with sprinkles
              of JS where interaction is needed.&quot;
            </blockquote>
          </div>
        </CardContent>
      </Card>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 3: Step-by-step                                               */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <StepByStepExplanation
        title="From Markdown to deployed static site"
        description="Six steps from source content to a CDN-served HTML file"
        steps={markdownToDeployedSteps}
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 4: Playground                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <HTMLPlayground
        html={playgroundHtml}
        css={playgroundCss}
        js={playgroundJs}
        title="Islands architecture in the browser"
        description="The article section is plain HTML — it renders with no JavaScript. The subscribe form (outlined in green) is the 'island' — it is the only part that needs JS."
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 5: Challenges                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Challenge
        question="You build a personal blog with ~50 posts and an 'about' page. SSR or SSG?"
        options={[
          {
            id: 'a',
            text: 'SSR — server-rendering is more flexible.',
          },
          {
            id: 'b',
            text: "SSG — the content is known at build time; static HTML on a CDN is the cheapest, fastest, simplest option. Deploy via GitHub Pages, Netlify, Vercel.",
          },
          {
            id: 'c',
            text: 'ISR — you might add a comment system later.',
          },
          {
            id: 'd',
            text: 'CSR — let the client fetch posts.',
          },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            A blog of 50 posts where content changes only on push is the textbook SSG case. SSR
            adds a server you don&apos;t need; ISR is appropriate when content changes between
            deploys without a rebuild; CSR slows first paint and hurts SEO because the HTML arrives
            empty.
          </>
        }
      />

      <Challenge
        question='Your Astro build fails with: ReferenceError: window is not defined. What&apos;s wrong?'
        options={[
          {
            id: 'a',
            text: "Astro doesn't support browser APIs.",
          },
          {
            id: 'b',
            text: "A component runs at build time on the server; window only exists in the browser. Move the code into a client:load island, or guard with typeof window !== 'undefined'.",
          },
          {
            id: 'c',
            text: 'Your Node version is wrong.',
          },
          {
            id: 'd',
            text: 'A missing polyfill.',
          },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            SSG runs your component code at build time on Node, which has no DOM. Browser-only APIs
            (<code>window</code>, <code>document</code>, <code>localStorage</code>) error there.
            The fix is to move the code into a client island or to defer it with a{' '}
            <code>useEffect</code>-style guard — both ensure the code only executes in the browser
            after hydration.
          </>
        }
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 6: GotchaList                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <GotchaList
        items={[
          {
            title: "SSG breaks at scale of pages × build time — incremental builds and on-demand regeneration are real escape hatches",
            body: (
              <>
                A site with 10 000 pages that takes 20 minutes to build cannot ship a typo fix in
                under an hour. Astro&apos;s content collections support incremental builds; Next.js
                ISR regenerates individual pages on demand. Plan your escape before you hit the wall.
              </>
            ),
          },
          {
            title: "Islands ship per-component JS only when they hydrate — but adding ten of them on one page blows up the bundle anyway",
            body: (
              <>
                Islands avoid shipping the framework runtime for the whole page, but each island
                still ships its own component code plus any shared dependencies. Ten islands that all
                import the same 40 kB date library pay that cost ten times unless you deduplicate
                via a shared chunk.
              </>
            ),
          },
          {
            title: "Markdown sources are simple until you need plugins; an MDX or remark/rehype pipeline is itself a project",
            body: (
              <>
                Adding syntax highlighting, footnotes, custom directives, or embedded React
                components to Markdown requires a remark/rehype plugin chain. Each plugin has its
                own version requirements and interacts with the others. Budget time for the content
                pipeline before you start on the site itself.
              </>
            ),
          },
          {
            title: "An SSG with no per-request server loses you A/B tests and per-user content unless you bolt on edge functions",
            body: (
              <>
                Feature flags, personalisation, and A/B testing all need a decision point at request
                time. Pure SSG has none. The fix is to add edge middleware (Netlify Edge Functions,
                Vercel Edge Middleware) that rewrites the URL or injects a cookie before the CDN
                serves the file — but that is a meaningful architectural addition, not a free lunch.
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
            <em>SSG (Static Site Generation)</em> pre-renders HTML at <strong>build time</strong> —
            the CDN serves a file, no server or database needed at request time. Ideal for content
            known before a visitor arrives: blogs, docs, marketing.
          </>,
          <>
            <em>Astro</em> is the flagship islands SSG: HTML by default, zero JavaScript unless you
            annotate a component with <code>client:load</code>, <code>client:visible</code>, or{' '}
            <code>client:idle</code>.
          </>,
          <>
            <em>Islands architecture</em> keeps bundles small by shipping JS only for interactive
            components. Each island hydrates independently; the rest of the page is plain HTML that
            works without JavaScript.
          </>,
          <>
            The SSG vs SSR decision rule: <strong>is the content the same for every visitor at
            request time?</strong> Yes → SSG. No → SSR. Changing occasionally between deploys →
            ISR.
          </>,
          <>
            The classic SSG build-time error — <code>window is not defined</code> — means a
            component ran on Node where there is no DOM. Fix: move browser code into a{' '}
            <code>client:load</code> island or guard with{' '}
            <code>typeof window !== &apos;undefined&apos;</code>.
          </>,
        ]}
        mentalModel="Build once, serve many. Islands architecture: mostly-static HTML with sprinkles of JS where interaction is needed."
      />
    </div>
  );
}
