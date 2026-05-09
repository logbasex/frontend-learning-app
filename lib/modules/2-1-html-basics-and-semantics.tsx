"use client";
import { ScaffoldModule } from "./_template";
import { HTMLPlayground } from "@/components/CodePlayground";

export function Module_2_1_Content() {
  return (
    <ScaffoldModule
      emoji="🧱"
      problemTitle="<div>-soup hurts"
      problem={
        <>
          <p>
            Open almost any large legacy codebase and you will find the same
            pattern: a wall of nested <code>&lt;div&gt;</code> and{" "}
            <code>&lt;span&gt;</code> elements, all styled with class names that
            convey visual intent (&ldquo;sidebar-wrapper&rdquo;, &ldquo;header-container&rdquo;)
            but tell the browser and assistive technologies absolutely nothing
            about the meaning of the content inside.
          </p>
          <p>
            HTML5 introduced a set of <strong>semantic elements</strong> that
            carry intrinsic meaning:{" "}
            <code>&lt;header&gt;</code>, <code>&lt;nav&gt;</code>,{" "}
            <code>&lt;main&gt;</code>, <code>&lt;article&gt;</code>,{" "}
            <code>&lt;section&gt;</code>, <code>&lt;aside&gt;</code>, and{" "}
            <code>&lt;footer&gt;</code>. A screen reader navigating by landmarks
            can jump straight to <code>&lt;main&gt;</code> without reading every
            navigation link. A search engine crawler awards higher relevance to
            content wrapped in <code>&lt;article&gt;</code> than to the same
            text inside an anonymous <code>&lt;div&gt;</code>.
          </p>
          <p>
            Semantic HTML also produces a cleaner{" "}
            <strong>document outline</strong>. Heading elements (
            <code>&lt;h1&gt;</code> through <code>&lt;h6&gt;</code>) create an
            implicit table of contents that both screen readers and SEO tools
            parse. An <code>&lt;h1&gt;</code> should appear exactly once per
            page as the primary title; subsections use <code>&lt;h2&gt;</code>,
            topics within those use <code>&lt;h3&gt;</code>, and so on. Skipping
            levels (jumping from <code>&lt;h1&gt;</code> to <code>&lt;h4&gt;</code>)
            confuses the outline without providing any visual benefit that CSS
            could not achieve more cleanly.
          </p>
          <p>
            Another common trap is relying entirely on visual layout to
            communicate structure. A list of navigation links styled as a
            horizontal bar looks like a menu, but without a{" "}
            <code>&lt;nav&gt;</code> and a <code>&lt;ul&gt;</code> the browser
            accessibility tree has no idea it is a list of links. Always choose
            the element that describes what the content <em>is</em>, not how it
            should <em>look</em> &mdash; CSS handles appearance; HTML carries
            meaning.
          </p>
          <p>
            The live example below renders the same blog-post header twice: once
            as div-soup and once using semantic elements. Both look identical in
            a browser, but only the second one is meaningful to machines.
          </p>
        </>
      }
      body={
        <HTMLPlayground
          title="Semantic HTML vs div-soup"
          description="Both sections look the same visually — only the markup differs."
          html={`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="/styles.css">
</head>
<body>

  <h2 style="font-family:sans-serif;color:#6b7280;margin:16px">❌ div-soup</h2>
  <div class="page">
    <div class="top-bar">
      <div class="logo">MySite</div>
      <div class="links">
        <div class="link">Home</div>
        <div class="link">About</div>
        <div class="link">Blog</div>
      </div>
    </div>
    <div class="content">
      <div class="post">
        <div class="title">Why semantic HTML matters</div>
        <div class="body">Screen readers and bots can't understand divs.</div>
      </div>
      <div class="sidebar">Related posts</div>
    </div>
    <div class="bottom">© 2024 MySite</div>
  </div>

  <h2 style="font-family:sans-serif;color:#6b7280;margin:16px">✅ Semantic HTML</h2>
  <div class="page">
    <header class="top-bar">
      <span class="logo">MySite</span>
      <nav>
        <ul class="links">
          <li><a class="link" href="#">Home</a></li>
          <li><a class="link" href="#">About</a></li>
          <li><a class="link" href="#">Blog</a></li>
        </ul>
      </nav>
    </header>
    <main class="content">
      <article class="post">
        <h1 class="title">Why semantic HTML matters</h1>
        <p class="body">Screen readers and bots understand article, nav, header.</p>
      </article>
      <aside class="sidebar">Related posts</aside>
    </main>
    <footer class="bottom">© 2024 MySite</footer>
  </div>

</body>
</html>`}
          css={`body { font-family: sans-serif; margin: 0; background: #f9fafb; }
.page { border: 2px solid #e5e7eb; border-radius: 8px; margin: 16px; overflow: hidden; }
.top-bar { display: flex; align-items: center; justify-content: space-between;
           background: #1e3a5f; color: white; padding: 12px 20px; }
.logo { font-weight: bold; font-size: 1.1rem; }
.links { display: flex; gap: 16px; list-style: none; margin: 0; padding: 0; }
.link { color: #93c5fd; text-decoration: none; cursor: pointer; }
.content { display: flex; gap: 0; }
.post { flex: 1; padding: 20px; }
.title { font-size: 1.25rem; font-weight: bold; color: #111827; margin: 0 0 8px; }
.body { color: #374151; margin: 0; }
.sidebar { width: 180px; background: #f3f4f6; padding: 20px;
           border-left: 1px solid #e5e7eb; color: #6b7280; font-size: 0.875rem; }
.bottom { background: #f3f4f6; text-align: center; padding: 10px;
          color: #9ca3af; font-size: 0.8rem; border-top: 1px solid #e5e7eb; }`}
        />
      }
      challenge={{
        question: "A page has a sidebar with 'Related articles' links. Which HTML element best wraps that sidebar?",
        options: [
          { id: "a", text: "<div class=\"sidebar\">" },
          { id: "b", text: "<section>" },
          { id: "c", text: "<aside>" },
          { id: "d", text: "<nav>" },
        ],
        correctAnswerId: "c",
        explanation: (
          <>
            <code>&lt;aside&gt;</code> represents content that is tangentially
            related to the main content &mdash; exactly what a &ldquo;related
            articles&rdquo; sidebar is. <code>&lt;nav&gt;</code> is reserved for
            primary navigation links, not supplementary content. A plain{" "}
            <code>&lt;div&gt;</code> or <code>&lt;section&gt;</code> provides no
            semantic landmark for assistive technologies.
          </>
        ),
      }}
      takeaways={[
        <>Semantic elements (header, nav, main, article, aside, footer) carry meaning that screen readers and search engines use to navigate and rank content.</>,
        <>Heading levels (h1&ndash;h6) create a document outline &mdash; use them in order and never skip levels for purely visual reasons.</>,
        <>Always choose the element that describes what the content is, not how it looks; CSS handles appearance, HTML carries meaning.</>,
      ]}
      mentalModel="HTML elements are nouns &mdash; they say what something is; CSS is the adjective that says how it looks. Never let an adjective do a noun&apos;s job."
      roadmapUrl="https://roadmap.sh/frontend"
    />
  );
}
