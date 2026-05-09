"use client";
import { ScaffoldModule } from "./_template";
import { CodeBlock } from "@/components/CodeBlock";

export function Module_2_4_Content() {
  return (
    <ScaffoldModule
      emoji="🔎"
      problemTitle="SEO is mostly accessibility plus metadata"
      problem={
        <>
          <p>
            Search engines rank pages they can <strong>understand</strong>. A crawler cannot run
            JavaScript well, cannot infer meaning from a sea of <code>&lt;div&gt;</code> tags, and
            cannot guess a page&apos;s topic if the <code>&lt;title&gt;</code> is missing or
            duplicated across a hundred URLs. Every SEO rule traces back to one idea: help the
            crawler parse your intent the same way a sighted reader would.
          </p>
          <p>
            The most impactful tag is a <strong>unique <code>&lt;title&gt;</code></strong> per page
            (50–60 characters). It is the blue headline in search results and the single strongest
            on-page signal. Follow it with a <code>&lt;meta name=&quot;description&quot;&gt;</code>
            (150–160 characters) — not a ranking factor, but it determines the snippet users click.
            One <strong><code>&lt;h1&gt;</code></strong> per page anchors the topic; use
            <code> h2</code>–<code>h6</code> in document order so the outline makes sense read
            linearly. Every accessibility improvement (alt text, landmark roles, skip links)
            doubles as an SEO win.
          </p>
          <p>
            <strong>OpenGraph</strong> (<code>og:title</code>, <code>og:description</code>,
            <code>og:image</code>) and <strong>Twitter Card</strong> (<code>twitter:card</code>)
            tags govern how your URL looks when shared on social platforms. They are invisible to
            Google rankings but hugely affect click-through rates from Slack, Twitter, and LinkedIn
            previews.
          </p>
          <p>
            A <strong>canonical link</strong> (<code>&lt;link rel=&quot;canonical&quot;&gt;</code>)
            tells crawlers which URL is the &quot;official&quot; version when the same content is
            reachable via multiple paths (HTTP vs HTTPS, trailing slash vs none, paginated
            variants). Without it, search engines may split ranking signals across duplicates and
            rank all of them lower.
          </p>
          <p>
            Finally, <code>robots.txt</code> gates crawl budget and <code>sitemap.xml</code>
            signals which URLs exist. Neither replaces good semantic HTML, but both reduce wasted
            crawler time — especially important on large sites where crawlers skip thin or
            duplicate pages anyway.
          </p>
        </>
      }
      body={
        <CodeBlock
          language="html"
          fileName="index.html — complete &lt;head&gt; for SEO"
          code={`<!DOCTYPE html>
<html lang="en">
<head>
  <!-- ── Core metadata ──────────────────────────────────────────── -->
  <meta charset="UTF-8" />

  <!-- Unique, descriptive title: 50-60 chars. Appears in SERPs. -->
  <title>Learn Flexbox in 10 Minutes | CSS Tricks</title>

  <!-- Viewport: required for mobile-friendly ranking signal. -->
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <!-- Meta description: not a ranking factor, but drives CTR. 150-160 chars. -->
  <meta
    name="description"
    content="A step-by-step guide to CSS Flexbox: axes, alignment,
             wrapping, and real-world layout patterns you can use today."
  />

  <!-- ── Canonical URL ─────────────────────────────────────────── -->
  <!-- Prevents split-ranking when the page is reachable via
       multiple paths (e.g. with/without trailing slash, HTTP vs HTTPS). -->
  <link
    rel="canonical"
    href="https://css-tricks.com/learn-flexbox/"
  />

  <!-- ── OpenGraph tags (Facebook, LinkedIn, Slack previews) ───── -->
  <meta property="og:type"        content="article" />
  <meta property="og:url"         content="https://css-tricks.com/learn-flexbox/" />
  <meta property="og:title"       content="Learn Flexbox in 10 Minutes" />
  <meta property="og:description" content="Step-by-step guide to CSS Flexbox." />
  <!-- og:image should be at least 1200×630 px for crisp previews. -->
  <meta property="og:image"       content="https://css-tricks.com/img/flexbox-share.png" />

  <!-- ── Twitter Card tags ─────────────────────────────────────── -->
  <!-- "summary_large_image" shows a full-width image above the snippet. -->
  <meta name="twitter:card"        content="summary_large_image" />
  <meta name="twitter:site"        content="@css" />
  <meta name="twitter:title"       content="Learn Flexbox in 10 Minutes" />
  <meta name="twitter:description" content="Step-by-step guide to CSS Flexbox." />
  <meta name="twitter:image"       content="https://css-tricks.com/img/flexbox-share.png" />

  <!-- ── Stylesheet ────────────────────────────────────────────── -->
  <link rel="stylesheet" href="/styles.css" />
</head>
<body>
  <!-- ONE h1 per page — the topical anchor for crawlers. -->
  <h1>Learn Flexbox in 10 Minutes</h1>

  <!-- h2, h3... used in document order — never skip a level. -->
  <h2>What is the main axis?</h2>
  <p>...</p>
</body>
</html>`}
        />
      }
      challenge={{
        question:
          "Which tag is the strongest on-page ranking signal in Google search?",
        options: [
          { id: "a", text: "<meta name=\"description\"> content" },
          { id: "b", text: "<title> element" },
          { id: "c", text: "og:title property" },
          { id: "d", text: "The first <h2> heading" },
        ],
        correctAnswerId: "b",
        explanation: (
          <>
            The <code>&lt;title&gt;</code> element is the single strongest on-page ranking signal
            Google uses; it also appears as the blue headline in SERPs. The{" "}
            <code>meta description</code> influences click-through rate but is not a direct ranking
            factor. OpenGraph tags only affect social-share previews and have no impact on Google
            rankings.
          </>
        ),
      }}
      takeaways={[
        <>Every page needs a unique <code>&lt;title&gt;</code> (50–60 chars) and a descriptive <code>meta description</code> (150–160 chars) — one anchors ranking, the other drives clicks.</>,
        <>Semantic HTML (a single <code>&lt;h1&gt;</code>, ordered headings, alt text) is free SEO: it helps crawlers and assistive technology simultaneously.</>,
        <>OpenGraph and Twitter Card tags control social preview appearance; <code>rel=&quot;canonical&quot;</code> prevents duplicate-content penalties across URL variants.</>,
      ]}
      mentalModel="SEO is accessibility for robots: if a screen reader can navigate your page logically, so can Google."
      roadmapUrl="https://roadmap.sh/frontend"
    />
  );
}
