"use client";

import { Card, CardContent } from "@/components/ui/card";
import { HTMLPlayground } from "@/components/CodePlayground";
import { StepByStepExplanation, Step } from "@/components/StepByStepExplanation";
import { Challenge } from "@/components/Challenge";
import { GotchaList } from "@/components/GotchaList";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { RoadmapLink } from "@/components/RoadmapLink";

export function Module_2_4_Content() {
  // Data blocks hoisted out of JSX for readability — listed in render order.
  const anatomySteps: Step[] = [
    {
      title: "Step 1: <title> and <meta name=\"description\">",
      description: (
        <>
          The <code>&lt;title&gt;</code> element is the blue headline users see in search-engine
          results — it is the single strongest on-page ranking signal you control directly. Keep it
          between 50 and 60 characters; longer titles get truncated in the results page. The{" "}
          <code>&lt;meta name=&quot;description&quot;&gt;</code> sits just below the title in the
          results snippet. It is not a direct ranking factor, but it drives click-through rate: a
          well-written description is the click-bait you write once and benefit from every day. Aim
          for 150–160 characters — a tight sentence or two that answers &quot;why should I click
          this?&quot;
        </>
      ),
      code: `<!-- In <head> -->
<title>Flexbox in 10 Minutes | CSS Tricks</title>
<!-- ↑ 50–60 chars — shows as the blue headline in search results -->

<meta
  name="description"
  content="A step-by-step guide to CSS Flexbox: axes,
           alignment, wrapping, and real-world layouts."
/>
<!-- ↑ 150–160 chars — the snippet text users read before clicking -->`,
    },
    {
      title: "Step 2: Open Graph + Twitter Card",
      description: (
        <>
          When someone pastes your URL into Slack, Twitter, iMessage, or LinkedIn, the platform
          fetches your page and reads a set of <em>Open Graph</em> tags — a meta-tag standard
          created by Facebook that lets social platforms render rich link previews. The four you
          always need are <code>og:title</code>, <code>og:description</code>, <code>og:image</code>,
          and <code>og:url</code>. The <code>twitter:card</code> tag tells Twitter specifically to
          render a large image above the text; set it to <code>summary_large_image</code> for
          maximum visibility. Your <code>og:image</code> must be 1200&nbsp;&times;&nbsp;630 pixels
          — anything smaller crops badly on Facebook, Twitter, and LinkedIn previews.
        </>
      ),
      code: `<!-- Open Graph — controls Facebook, LinkedIn, Slack, iMessage previews -->
<meta property="og:type"        content="article" />
<meta property="og:url"         content="https://example.com/flexbox/" />
<meta property="og:title"       content="Flexbox in 10 Minutes" />
<meta property="og:description" content="Step-by-step guide to CSS Flexbox." />
<meta property="og:image"       content="https://example.com/img/flexbox.png" />
<!-- ↑ Must be 1200×630 px for crisp previews across all platforms -->

<!-- Twitter Card — controls Twitter-specific rendering -->
<meta name="twitter:card"        content="summary_large_image" />
<meta name="twitter:title"       content="Flexbox in 10 Minutes" />
<meta name="twitter:description" content="Step-by-step guide to CSS Flexbox." />
<meta name="twitter:image"       content="https://example.com/img/flexbox.png" />`,
    },
    {
      title: "Step 3: Canonical URL",
      description: (
        <>
          The same page content can be reachable at multiple URLs:{" "}
          <code>https://example.com/flexbox</code>, <code>https://example.com/flexbox/</code>, and{" "}
          <code>https://example.com/flexbox?utm_source=twitter</code> are technically three separate
          URLs. Without guidance, search engines may split ranking signals across all three and rank
          every variant lower. The <code>&lt;link rel=&quot;canonical&quot;&gt;</code> tag solves
          this by pointing crawlers at the one preferred URL. Crawlers will consolidate all the
          link-juice onto that single version. Place the canonical on every page — even if you think
          there are no duplicates, UTM parameters and session tokens silently create them.
        </>
      ),
      code: `<!-- In <head> — always points to the "official" version of this page -->
<link
  rel="canonical"
  href="https://example.com/flexbox/"
/>

<!-- Example problem: same content reachable at three paths:
     /flexbox          ← missing trailing slash
     /flexbox/         ← canonical target
     /flexbox/?ref=nl  ← newsletter UTM parameter
  Without canonical, crawlers may rank all three separately.
  With canonical pointing at /flexbox/, all signals merge there. -->`,
    },
    {
      title: "Step 4: robots.txt and noindex",
      description: (
        <>
          <em>robots.txt</em> — a file at <code>/robots.txt</code> telling crawlers which paths to
          index or skip — is a request, not a wall. Every well-behaved crawler (Googlebot,
          Bingbot) obeys it; malicious scrapers ignore it entirely. Use it to save crawl budget by
          keeping thin or duplicate pages out of the index. For per-page control, add{" "}
          <code>&lt;meta name=&quot;robots&quot; content=&quot;noindex&quot;&gt;</code> to the{" "}
          <code>&lt;head&gt;</code>; that page gets visited but not listed. A page can be both
          crawlable and <code>noindex</code> — crawlers follow its links to reach other pages
          without surfacing it in search results.
        </>
      ),
      code: `# /robots.txt — a suggestion, not a firewall
User-agent: *
Disallow: /admin/
Disallow: /checkout/
Allow: /

Sitemap: https://example.com/sitemap.xml

---

<!-- Per-page noindex: page is crawlable but won't appear in search results -->
<meta name="robots" content="noindex" />

<!-- Allow crawling but block following links on a page: -->
<meta name="robots" content="noindex, nofollow" />`,
    },
    {
      title: "Step 5: sitemap.xml",
      description: (
        <>
          A <em>sitemap</em> — an XML file at <code>/sitemap.xml</code> listing the site&apos;s
          URLs for crawlers — lets you tell search engines which pages exist rather than waiting for
          crawlers to discover them by following links. Include a <code>&lt;lastmod&gt;</code> date
          on each URL to signal freshness; Google uses it to prioritize re-crawls. For large sites,
          you can reference multiple sitemaps in a sitemap index file. Submit your sitemap URL via
          Google Search Console to accelerate initial indexing — crawlers will pick it up from{" "}
          <code>robots.txt</code> automatically, but manual submission speeds up new content.
        </>
      ),
      code: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <url>
    <loc>https://example.com/</loc>
    <lastmod>2026-05-01</lastmod>
    <priority>1.0</priority>
  </url>

  <url>
    <loc>https://example.com/flexbox/</loc>
    <lastmod>2026-04-20</lastmod>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://example.com/grid/</loc>
    <lastmod>2026-03-15</lastmod>
    <priority>0.8</priority>
  </url>

</urlset>`,
    },
    {
      title: "Step 6: Structured Data (JSON-LD)",
      description: (
        <>
          Schema.org <em>structured data</em> is a JSON block you embed in a{" "}
          <code>&lt;script type=&quot;application/ld+json&quot;&gt;</code> tag. Search engines read
          it to understand entities on the page — Article, Product, BreadcrumbList, FAQ — and render
          them as <em>rich results</em>: star ratings in search, price ranges, recipe steps, and
          more. Structured data does not directly improve ranking position, but rich results
          dramatically improve click-through rates. JSON-LD is the Google-recommended format because
          it lives separately from the HTML markup and is easy to generate server-side. This is a
          preview of a large topic; the full reference is at{" "}
          <a href="https://schema.org" target="_blank" rel="noreferrer">schema.org</a>.
        </>
      ),
      code: `<!-- In <head> or <body> — JSON-LD for an Article -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Flexbox in 10 Minutes",
  "author": {
    "@type": "Person",
    "name": "Chris Coyier"
  },
  "datePublished": "2026-04-20",
  "image": "https://example.com/img/flexbox.png",
  "publisher": {
    "@type": "Organization",
    "name": "CSS Tricks",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.png"
    }
  }
}
</script>`,
    },
  ];

  // ── Section 4: Playground HTML ────────────────────────────────────────────
  const playgroundHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#3b82f6" />

  <!-- Try this: change <title> and <meta name="description"> below, then refresh. The browser tab updates and a real share preview would update on Twitter / Slack / iMessage in seconds. -->
  <title>Acme Widget Pro — Best Widget for Developers</title>
  <meta
    name="description"
    content="Acme Widget Pro handles every edge case your workflow throws at it.
             Trusted by 50,000 developers. Free 14-day trial, no credit card."
  />

  <!-- Canonical URL: one preferred path regardless of UTM params or trailing-slash variants -->
  <link rel="canonical" href="https://acme.example.com/widget-pro/" />

  <!-- Robots: let crawlers index this page (default, but explicit is better) -->
  <meta name="robots" content="index, follow" />

  <!-- Open Graph — controls what appears when you paste this URL into Slack / Twitter / iMessage -->
  <meta property="og:type"        content="product" />
  <meta property="og:url"         content="https://acme.example.com/widget-pro/" />
  <meta property="og:title"       content="Acme Widget Pro — Best Widget for Developers" />
  <meta property="og:description" content="Handles every edge case. Trusted by 50,000 devs." />
  <meta property="og:image"       content="https://acme.example.com/img/widget-pro-og.png" />
  <!-- og:image should be 1200×630 px — anything smaller crops on Facebook/Twitter/LinkedIn -->

  <!-- Twitter Card -->
  <meta name="twitter:card"  content="summary_large_image" />
  <meta name="twitter:image" content="https://acme.example.com/img/widget-pro-og.png" />

  <link rel="stylesheet" href="/styles.css" />
</head>
<body>
  <header>
    <nav aria-label="Site navigation">
      <a href="/" class="logo">Acme</a>
      <ul>
        <li><a href="/features">Features</a></li>
        <li><a href="/pricing">Pricing</a></li>
        <li><a href="/docs">Docs</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <section class="hero">
      <!-- ONE <h1> per page — the topical anchor for crawlers -->
      <h1>Acme Widget Pro</h1>
      <p class="tagline">The widget that handles every edge case your workflow throws at it.</p>
      <a href="/trial" class="cta">Start free trial</a>
    </section>

    <section aria-labelledby="features-heading">
      <h2 id="features-heading">Why 50,000 developers trust it</h2>
      <ul class="features">
        <li><strong>Zero config</strong> — works out of the box</li>
        <li><strong>Accessible</strong> — WCAG AA by default</li>
        <li><strong>Fast</strong> — 2 KB gzipped</li>
      </ul>
    </section>
  </main>

  <footer>
    <p>&copy; 2026 Acme Inc.</p>
  </footer>
</body>
</html>`;

  const playgroundCss = `*,
*::before,
*::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: system-ui, sans-serif;
  color: #1e293b;
  line-height: 1.6;
}

/* Nav */
nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: #1e293b;
}
.logo {
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
  text-decoration: none;
}
nav ul {
  list-style: none;
  display: flex;
  gap: 20px;
}
nav a {
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.9rem;
}
nav a:hover { color: #fff; }

/* Hero */
.hero {
  text-align: center;
  padding: 64px 24px 48px;
  background: linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%);
}
h1 {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 12px;
}
.tagline {
  font-size: 1.1rem;
  color: #475569;
  max-width: 480px;
  margin: 0 auto 28px;
}
.cta {
  display: inline-block;
  background: #3b82f6;
  color: #fff;
  padding: 12px 28px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: background 0.15s;
}
.cta:hover { background: #2563eb; }

/* Features */
section[aria-labelledby="features-heading"] {
  padding: 48px 24px;
  max-width: 640px;
  margin: 0 auto;
}
h2 {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: #0f172a;
}
.features {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.features li {
  padding: 14px 16px;
  background: #f8fafc;
  border-left: 4px solid #3b82f6;
  border-radius: 0 6px 6px 0;
  font-size: 0.95rem;
}

/* Footer */
footer {
  text-align: center;
  padding: 24px;
  font-size: 0.8rem;
  color: #94a3b8;
  border-top: 1px solid #e2e8f0;
}`;

  const playgroundJs = `// Nothing interactive needed — the lesson is in the <head>.
// Open the HTML tab and study the meta tags at the top of <head>.
// Try changing the <title> value — the Sandpack preview tab updates instantly.`;

  return (
    <div className="space-y-8">

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* Section 1: Hook                                                      */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <Card>
        <CardContent className="pt-6">
          <div className="prose dark:prose-invert max-w-none">
            <p>
              Two pages with identical content can rank wildly differently. One lands on page one of
              Google; the other is invisible. The difference usually isn&apos;t the writing — it is
              16 lines in <code>&lt;head&gt;</code> that most developers skip. A missing{" "}
              <code>&lt;title&gt;</code> and a handful of absent <code>&lt;meta&gt;</code> tags cost
              you ranking position and hand it to competitors who took ten minutes to fill them in.
            </p>
            <p>
              And it is not just ranking. The social-share previews everyone sees on Twitter, Slack,
              and iMessage — that rich card with the image, title, and description — are decided by
              four <code>&lt;meta&gt;</code> tags you control entirely. A page with no Open Graph
              tags shares as a bare URL; a page with correct Open Graph tags shares as a polished
              card. By the end of this module you will be able to write a complete, production-ready{" "}
              <code>&lt;head&gt;</code> for any page — one that ranks, shares beautifully, and gives
              crawlers every machine-readable signal they need.
            </p>
          </div>
          <div className="mt-4">
            <RoadmapLink url="https://roadmap.sh/frontend" />
          </div>
        </CardContent>
      </Card>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* Section 2: Mental model first                                        */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <Card>
        <CardContent className="pt-6">
          <div className="prose dark:prose-invert max-w-none">
            <p>
              <em>SEO</em> — search engine optimization, the practices that help search engines
              understand and rank a page — sounds like a specialist discipline, but most of it
              reduces to two things you already care about: semantic HTML and explicit metadata.
              Crawlers and screen readers both need the same signals: clear heading hierarchy, landmark
              elements that label regions, and machine-readable hints about content type, authorship,
              and canonical identity. Every accessibility improvement you make for human users is also
              an SEO improvement for robots — and vice versa. You do not need a separate SEO strategy;
              you need to build accessible, well-annotated pages and then add the{" "}
              <code>&lt;head&gt;</code> metadata that tells machines what they cannot infer from the
              markup alone.
            </p>
            <blockquote className="border-l-4 border-blue-500 pl-4 italic">
              &quot;SEO is mostly accessibility plus the right metadata. Crawlers and screen readers
              want the same things — clear semantics and explicit machine-readable hints.&quot;
            </blockquote>
          </div>
        </CardContent>
      </Card>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* Section 3: Step-by-step                                              */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <StepByStepExplanation
        title="Anatomy of a <head> that ranks and shares"
        description="Six elements that determine how your page appears in search results and social previews"
        steps={anatomySteps}
      />

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* Section 4: Live playground                                           */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <HTMLPlayground
        html={playgroundHtml}
        css={playgroundCss}
        js={playgroundJs}
        title="Demo product page with a complete <head>"
        description="Open the HTML tab. Study every meta tag in <head> — title, description, canonical, robots, Open Graph, Twitter Card. Change the <title> and watch the preview tab update immediately."
      />

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* Section 5: Challenges                                                */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <Challenge
        question={`Where does the <meta name="description"> text typically appear?`}
        options={[
          {
            id: "a",
            text: "At the top of the rendered page, above the <h1>.",
          },
          {
            id: "b",
            text: "In the search-engine result snippet under the title.",
          },
          {
            id: "c",
            text: "In the browser tab title bar.",
          },
          {
            id: "d",
            text: "As the page's first headline for screen readers.",
          },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            The meta description is the snippet text Google (and other crawlers) show under the
            page&apos;s title in search results. It does not appear on the rendered page; the browser
            tab uses <code>&lt;title&gt;</code>; screen readers use the document&apos;s headings, not
            meta tags. Meta description is not a ranking factor, but writing it carefully improves
            click-through rate from search results pages.
          </>
        }
      />

      <Challenge
        question={`What does <link rel="canonical" href="..."> do?`}
        options={[
          {
            id: "a",
            text: "Tells the browser to redirect to a different URL.",
          },
          {
            id: "b",
            text: "Tells crawlers which URL is the preferred one when the same content is reachable at multiple paths.",
          },
          {
            id: "c",
            text: "Sets the page's primary language.",
          },
          {
            id: "d",
            text: "Marks the page as not indexable.",
          },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            When the same content is reachable at <code>/page</code>,{" "}
            <code>/page?ref=twitter</code>, and <code>/page/</code>, the canonical tag tells
            crawlers which version to rank, consolidating link-juice on one URL. It does not
            redirect; that is the server&apos;s job. <code>noindex</code> is a separate{" "}
            <code>&lt;meta name=&quot;robots&quot;&gt;</code> directive — canonical and noindex
            solve completely different problems.
          </>
        }
      />

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* Section 6: GotchaList                                                */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <GotchaList
        items={[
          {
            title:
              "og:image should be 1200×630 — anything smaller crops badly on Facebook, Twitter, LinkedIn previews",
            body: (
              <>
                Social platforms render link previews in a fixed-aspect-ratio container. Images
                smaller than 1200&nbsp;&times;&nbsp;630 are upscaled and blurred, or the platform
                falls back to a tiny thumbnail. Always generate a dedicated share image at exactly
                1200&nbsp;&times;&nbsp;630 px — do not reuse product photos or hero images that
                happen to be the right width but wrong height.
              </>
            ),
          },
          {
            title:
              "robots.txt is a request, not a wall — well-behaved crawlers obey it; malicious ones ignore it entirely",
            body: (
              <>
                Googlebot and Bingbot are well-behaved; they read <code>robots.txt</code> and stay
                away from disallowed paths. Malicious scrapers and vulnerability scanners do not.
                Using <code>robots.txt</code> to &quot;hide&quot; an admin panel or a data file
                provides zero security — it is a courtesy signal to polite bots, not access control.
                For actual access control use server-side authentication.
              </>
            ),
          },
          {
            title:
              "Pages can be both noindex and crawlable — they get visited but never listed; that's how you let crawlers find linked content without surfacing the parent",
            body: (
              <>
                <code>noindex</code> means &quot;do not include this page in the search index&quot;;
                it does not mean &quot;do not visit this page.&quot; A crawler landing on a{" "}
                <code>noindex</code> page will still follow its links to reach other, indexable pages.
                This is intentional on tag pages or paginated archives: you want crawlers to discover
                the individual articles linked from them, but you do not want the archive page itself
                to rank.
              </>
            ),
          },
          {
            title:
              "Sites with bad heading hierarchy lose ranking even when the keywords are perfect — semantic HTML is part of the ranking signal",
            body: (
              <>
                A page that uses <code>&lt;h1&gt;</code> once, then jumps to <code>&lt;h4&gt;</code>,
                makes it hard for crawlers to build the <em>document outline</em> — the implicit
                hierarchy of headings that screen readers and search engines both rely on. Google
                reads the heading structure to understand the page&apos;s subtopics. Skipping heading
                levels or using multiple <code>&lt;h1&gt;</code> elements sends a confusing signal
                even if every keyword is present and the meta tags are perfect.
              </>
            ),
          },
        ]}
      />

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* Section 7: KeyTakeaways                                              */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <KeyTakeaways
        points={[
          <>
            <code>&lt;title&gt;</code> and <code>&lt;meta name=&quot;description&quot;&gt;</code>{" "}
            are the click-bait you control in search results — write them deliberately, keep title
            under 60 characters and description under 160.
          </>,
          <>
            <em>Open Graph</em> tags decide every social-share preview;{" "}
            <code>og:image</code> at 1200&nbsp;&times;&nbsp;630 is the safe default and the one
            dimension that trips people up most.
          </>,
          <>
            Canonical URLs consolidate ranking when the same content lives at multiple paths — UTM
            parameters and trailing-slash variants silently create duplicates without one.
          </>,
          <>
            Semantic HTML earns ranking signals for free — crawlers read landmark elements and
            headings the same way screen readers do, so every accessibility improvement doubles as
            an SEO improvement.
          </>,
          <>
            <em>robots.txt</em> is a request, not a wall — for actual access control, use
            server-side authentication. <code>noindex</code> hides a page from search results while
            still allowing crawlers to follow its links.
          </>,
        ]}
        mentalModel="SEO is mostly accessibility plus the right metadata. Crawlers and screen readers want the same things — clear semantics and explicit machine-readable hints."
      />
    </div>
  );
}
