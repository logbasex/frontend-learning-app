"use client";

import { Card, CardContent } from "@/components/ui/card";
import { HTMLPlayground } from "@/components/CodePlayground";
import { StepByStepExplanation, Step } from "@/components/StepByStepExplanation";
import { Challenge } from "@/components/Challenge";
import { GotchaList } from "@/components/GotchaList";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { RoadmapLink } from "@/components/RoadmapLink";

export function Module_2_1_Content() {
  // Data blocks hoisted out of JSX for readability — listed in render order.
  const semanticSteps: Step[] = [
    {
      title: "Step 1: What <div> soup costs you",
      description: (
        <>
          Open any large legacy site&apos;s DevTools and expand the DOM: you
          find hundreds of nested <code>&lt;div&gt;</code> and{" "}
          <code>&lt;span&gt;</code> elements, each carrying a class name like{" "}
          <code>header-container</code> or <code>sidebar-wrapper</code>. Those
          class names communicate visual intent to a human reading the source,
          but the browser&apos;s <em>accessibility tree</em> — the structure
          screen readers, search engines, and browser features use — sees
          nothing meaningful. To a screen reader, 200 nested{" "}
          <code>&lt;div&gt;</code>s all read as &ldquo;group&rdquo;, leaving
          a keyboard-only user with no way to skip navigation or jump straight
          to the main content. Search engines face the same problem: a crawler
          cannot distinguish the article from the sidebar when both are wrapped
          in anonymous <code>&lt;div&gt;</code>s.
        </>
      ),
      code: `<!-- div-soup: visually correct, semantically empty -->
<div class="page">
  <div class="top-bar">
    <div class="logo">MySite</div>
    <div class="links">
      <div class="link">Home</div>
      <div class="link">About</div>
    </div>
  </div>
  <div class="content">
    <div class="post">
      <div class="title">Why semantic HTML matters</div>
      <div class="body">Every div is invisible to assistive tech.</div>
    </div>
    <div class="sidebar">Related posts</div>
  </div>
  <div class="bottom">© 2025 MySite</div>
</div>`,
    },
    {
      title: "Step 2: The seven landmarks",
      description: (
        <>
          <em>Semantic HTML</em> — choosing elements that convey meaning (
          <code>&lt;article&gt;</code>, <code>&lt;nav&gt;</code>,{" "}
          <code>&lt;main&gt;</code>) over generic <code>&lt;div&gt;</code> and{" "}
          <code>&lt;span&gt;</code> — gives the browser a meaningful map of your
          page. The seven landmark elements are:{" "}
          <code>&lt;header&gt;</code> (introductory content or branding for its
          nearest sectioning ancestor), <code>&lt;nav&gt;</code> (primary
          navigation links), <code>&lt;main&gt;</code> (the page&apos;s unique
          central content — exactly one per page), <code>&lt;article&gt;</code>{" "}
          (self-contained, syndicatable content), <code>&lt;section&gt;</code>{" "}
          (a thematic group of content, needs a heading), <code>&lt;aside&gt;</code>{" "}
          (content tangentially related to the main content), and{" "}
          <code>&lt;footer&gt;</code> (closing metadata). Screen readers expose
          these as named navigation landmarks so users can jump between them
          with a single keystroke.
        </>
      ),
      code: `<!-- The seven landmark elements -->
<header>   <!-- introductory / branding content -->
<nav>      <!-- primary navigation -->
<main>     <!-- the page's unique central content (one per page) -->
<article>  <!-- self-contained, syndicatable content -->
<section>  <!-- thematic group within a parent (needs a heading) -->
<aside>    <!-- tangentially related content / sidebar -->
<footer>   <!-- closing metadata -->

<!-- Drop-in replacement for the div-soup above -->
<header>
  <span class="logo">MySite</span>
  <nav>
    <ul>
      <li><a href="#">Home</a></li>
      <li><a href="#">About</a></li>
    </ul>
  </nav>
</header>
<main>
  <article>
    <h1>Why semantic HTML matters</h1>
    <p>Landmarks let screen readers and crawlers navigate your page.</p>
  </article>
  <aside>Related posts</aside>
</main>
<footer>© 2025 MySite</footer>`,
    },
    {
      title: "Step 3: Headings build the document outline",
      description: (
        <>
          <em>HTML</em> — a markup language whose elements describe the{" "}
          <em>meaning</em> of content — includes six heading levels,{" "}
          <code>&lt;h1&gt;</code> through <code>&lt;h6&gt;</code>. Together
          they form the <em>document outline</em>: the implicit hierarchy of
          headings that screen readers and search engines parse as a table of
          contents. Every page should have exactly one <code>&lt;h1&gt;</code>{" "}
          naming the page&apos;s primary topic; subsections use{" "}
          <code>&lt;h2&gt;</code>, topics within those use{" "}
          <code>&lt;h3&gt;</code>, and so on. Skipping levels — jumping from{" "}
          <code>&lt;h1&gt;</code> directly to <code>&lt;h4&gt;</code> — breaks
          the outline: a screen-reader user navigating by heading hears
          &ldquo;heading level 4&rdquo; with no parent context. The fix is
          never to skip; if you need a smaller visual size, change the CSS
          font-size, not the heading level.
        </>
      ),
      code: `<!-- Correct outline for a blog post with two subsections -->
<h1>Why semantic HTML matters</h1>       <!-- page title -->
  <h2>Accessibility benefits</h2>        <!-- subsection 1 -->
    <h3>Screen readers</h3>              <!-- sub-subsection -->
    <h3>Keyboard navigation</h3>         <!-- sub-subsection -->
  <h2>SEO benefits</h2>                  <!-- subsection 2 -->
    <h3>Crawlers and ranking signals</h3>
    <h3>Structured data</h3>

<!-- WRONG: heading-level skip -->
<h1>Why semantic HTML matters</h1>
  <h4>Screen readers</h4>   <!-- jumps from h1 to h4 — outline is broken -->`,
    },
    {
      title: "Step 4: Lists vs paragraphs",
      description: (
        <>
          Not every group of text belongs in a paragraph. When content is
          genuinely enumerable — navigation links, recipe ingredients, a
          sequence of steps — use a list element, not{" "}
          <code>&lt;br&gt;</code>-separated runs of text.{" "}
          <code>&lt;ul&gt;</code> is for unordered items (order doesn&apos;t
          matter), <code>&lt;ol&gt;</code> is for ordered items (sequence
          matters), and <code>&lt;li&gt;</code> is each item within either.
          Screen readers announce &ldquo;list of 5 items&rdquo; so users know
          the count before they start reading; <code>&lt;br&gt;</code> lines
          announce nothing. A paragraph (<code>&lt;p&gt;</code>) is for
          flowing prose — a unit of thought. Choosing between them is not
          a styling decision; it is a meaning decision that CSS cannot undo.
        </>
      ),
      code: `<!-- WRONG: using <br> to simulate a list -->
<p>
  Home<br>
  About<br>
  Blog<br>
  Contact
</p>

<!-- CORRECT: unordered list for navigation links -->
<nav>
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/about">About</a></li>
    <li><a href="/blog">Blog</a></li>
    <li><a href="/contact">Contact</a></li>
  </ul>
</nav>

<!-- CORRECT: ordered list for sequential steps -->
<ol>
  <li>Open DevTools (F12)</li>
  <li>Switch to the Elements tab</li>
  <li>Inspect the document outline</li>
</ol>`,
    },
    {
      title: "Step 5: <article> vs <section> vs <aside> decision tree",
      description: (
        <>
          These three elements are the most commonly confused landmarks. The
          decision rule is:{" "}
          <strong>
            if you can syndicate it standalone, it&apos;s an article
          </strong>{" "}
          — a blog post, a forum comment, a product card that makes sense on
          its own. If it&apos;s a thematic group{" "}
          <em>within</em> a parent that would be orphaned if extracted, it&apos;s
          a <strong>section</strong> — for example, an &ldquo;Introduction&rdquo;
          chapter inside an article. If it&apos;s tangential to the main
          content — a sidebar of related links, an author bio that
          supplements the article — it&apos;s an <strong>aside</strong>.{" "}
          A plain <code>&lt;div&gt;</code> remains the right choice when no
          semantic meaning applies; it is a layout-only grouping container
          that makes no promise about content type.
        </>
      ),
      code: `<!-- Decision tree applied to a blog page -->

<main>

  <!-- <article>: self-contained, could appear in an RSS feed -->
  <article>
    <h1>Why semantic HTML matters</h1>

    <!-- <section>: thematic group inside the article -->
    <section>
      <h2>Accessibility benefits</h2>
      <p>Landmark navigation gives screen-reader users a shortcut...</p>
    </section>

    <section>
      <h2>SEO benefits</h2>
      <p>Crawlers trust article-wrapped content more than div-soup...</p>
    </section>
  </article>

  <!-- <aside>: tangential — related links, not the article itself -->
  <aside>
    <h2>Related posts</h2>
    <ul>
      <li><a href="#">HTML forms and validation</a></li>
      <li><a href="#">Accessibility deep-dive</a></li>
    </ul>
  </aside>

</main>`,
    },
    {
      title: "Step 6: Why screen readers care",
      description: (
        <>
          A screen reader presents a page as a series of audio announcements.
          Without landmarks, the only navigation strategy is linear — reading
          every element from top to bottom. With landmarks, the user can pull
          up a &ldquo;landmarks menu&rdquo; and jump directly to{" "}
          <code>&lt;main&gt;</code>, skipping the entire navigation header.
          The &ldquo;skip to main content&rdquo; link common in accessibility
          audits exists precisely because pages without a{" "}
          <code>&lt;main&gt;</code> element force screen-reader users to Tab
          through every navigation link on every page load. Search engine
          crawlers behave similarly: Google&apos;s crawler gives higher
          relevance weight to content inside <code>&lt;article&gt;</code> than
          to the same text floating inside a <code>&lt;div&gt;</code>. Good
          semantic HTML earns both accessibility and SEO improvements at zero
          extra cost — they are a side-effect of correct element choice, not
          features you bolt on later.
        </>
      ),
      code: `<!-- Without landmarks: screen reader must read everything linearly -->
<div>MySite</div>
<div>Home | About | Blog</div>   <!-- no way to skip this -->
<div><!-- 5 seconds of navigation links... --></div>
<div>Here is the article the user actually wanted.</div>

<!-- With landmarks: screen reader jumps straight to <main> -->
<header>MySite</header>
<nav>
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/about">About</a></li>
    <li><a href="/blog">Blog</a></li>
  </ul>
</nav>
<main>
  <!-- Screen reader can land here directly via landmarks menu -->
  <article>
    <h1>Here is the article the user actually wanted.</h1>
  </article>
</main>`,
    },
  ];

  const playgroundHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="/styles.css">
</head>
<body>

<!-- Try this: remove the <main>/<article>/<aside> wrappers from the second example. The visual is unchanged but the document outline collapses to one level. -->

<p class="label">❌ div-soup — looks the same, means nothing</p>
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
      <div class="body">Screen readers and bots cannot understand divs.</div>
    </div>
    <div class="sidebar">Related posts</div>
  </div>
  <div class="bottom">© 2025 MySite</div>
</div>

<p class="label">✅ Semantic HTML — identical pixels, full meaning</p>
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
  <footer class="bottom">© 2025 MySite</footer>
</div>

</body>
</html>`;

  const playgroundCss = `body {
  font-family: system-ui, sans-serif;
  margin: 0;
  padding: 16px;
  background: #f9fafb;
}
.label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #6b7280;
  margin: 16px 0 4px;
}
.page {
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 8px;
}
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #1e3a5f;
  color: white;
  padding: 12px 20px;
}
.logo { font-weight: bold; font-size: 1rem; }
.links {
  display: flex;
  gap: 16px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.link { color: #93c5fd; text-decoration: none; cursor: pointer; }
.content { display: flex; }
.post { flex: 1; padding: 20px; }
.title {
  font-size: 1.1rem;
  font-weight: bold;
  color: #111827;
  margin: 0 0 8px;
}
.body { color: #374151; margin: 0; font-size: 0.9rem; }
.sidebar {
  width: 160px;
  background: #f3f4f6;
  padding: 16px;
  border-left: 1px solid #e5e7eb;
  color: #6b7280;
  font-size: 0.85rem;
}
.bottom {
  background: #f3f4f6;
  text-align: center;
  padding: 8px;
  color: #9ca3af;
  font-size: 0.8rem;
  border-top: 1px solid #e5e7eb;
}`;

  return (
    <div className="space-y-8">

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 1: Hook                                                       */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Card>
        <CardContent className="pt-6">
          <div className="prose dark:prose-invert max-w-none">
            <h2>🧱 HTML Basics and Semantics</h2>
            <p>
              Open the average legacy site&apos;s DOM and you find 200 nested{" "}
              <code>&lt;div&gt;</code>s. To a screen reader, they all read as
              nothing — no landmarks to jump between, no document outline to
              navigate, no signal to a search engine about what the page is
              actually about. A sighted user sees a blog header; a blind user
              hears an endless stream of anonymous groups.
            </p>
            <p>
              HTML5 introduced a set of <strong>semantic landmark elements</strong>{" "}
              — <code>&lt;header&gt;</code>, <code>&lt;nav&gt;</code>,{" "}
              <code>&lt;main&gt;</code>, <code>&lt;article&gt;</code>,{" "}
              <code>&lt;section&gt;</code>, <code>&lt;aside&gt;</code>,{" "}
              <code>&lt;footer&gt;</code> — that carry intrinsic meaning the
              browser, screen readers, and crawlers all understand. This module
              shows you how to replace div-soup with the right element at every
              level, build a valid document outline, and spot the heading-level
              skips that silently break accessibility.
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
            <h3>The model: HTML is a meaning tree</h3>
            <p>
              Every HTML document is a tree of <em>elements</em> — tag pairs
              with optional content and <em>attributes</em> — and that tree has
              two entirely separate jobs. HTML answers &ldquo;what is this
              thing?&rdquo;: a heading, a navigation region, an article, a list.
              CSS answers &ldquo;how should it look?&rdquo;: blue, bold, 1.2rem,
              flexbox row. The two layers are deliberately separate. When you
              reach for a <code>&lt;div&gt;</code> because you want a block
              container, or a <code>&lt;table&gt;</code> because you want
              columns, you are letting the appearance layer make a meaning
              decision — and the accessibility tree, the document outline, and
              every machine that reads your page will be wrong as a result.
            </p>
            <blockquote className="border-l-4 border-blue-500 pl-4 italic">
              HTML elements are nouns — they say what something <em>is</em>.
              CSS is the adjective — it says how it looks. Never let an
              adjective do a noun&apos;s job.
            </blockquote>
          </div>
        </CardContent>
      </Card>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 3: Step-by-step                                               */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <StepByStepExplanation
        title="From <div> soup to landmarks"
        description="Six steps from meaningless markup to a fully semantic blog page"
        steps={semanticSteps}
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 4: Live playground                                            */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <HTMLPlayground
        html={playgroundHtml}
        css={playgroundCss}
        title="Same look, different meaning"
        description="Both blocks render identically. Only the second one is meaningful to machines."
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 5: Challenges                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Challenge
        question="A page has a sidebar with 'Related articles' links. Which HTML element best wraps that sidebar?"
        options={[
          { id: "a", text: '<div class="sidebar">' },
          { id: "b", text: "<section>" },
          { id: "c", text: "<aside>" },
          { id: "d", text: "<nav>" },
        ]}
        correctAnswerId="c"
        explanation={
          <>
            <code>&lt;aside&gt;</code> is for content tangentially related to
            the main content — exactly what a &ldquo;related articles&rdquo;
            sidebar is. <code>&lt;nav&gt;</code> is reserved for primary
            navigation, not supplementary content. A plain <code>&lt;div&gt;</code>{" "}
            or <code>&lt;section&gt;</code> provides no semantic landmark for
            assistive technologies.
          </>
        }
      />

      <Challenge
        question="Which heading sequence is correct for a blog post with two subsections, each with two sub-subsections?"
        options={[
          {
            id: "a",
            text: "h1 → h2 → h3 → h2 → h3 (one h3 per subsection)",
          },
          {
            id: "b",
            text: "h1 → h2 → h3 → h3 → h2 → h3 → h3 (two h3s per subsection)",
          },
          {
            id: "c",
            text: "h1 → h3 → h4 → h3 → h4 → h3 → h4 (skips h2)",
          },
          {
            id: "d",
            text: "h1 → h1 → h2 → h2 (multiple h1s)",
          },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            A blog post has one title (<code>&lt;h1&gt;</code>), two subsections
            (<code>&lt;h2&gt;</code> each), and two sub-sub-topics inside each
            subsection (<code>&lt;h3&gt;</code> each) — giving the sequence
            h1&nbsp;&rarr;&nbsp;h2&nbsp;&rarr;&nbsp;h3&nbsp;&rarr;&nbsp;h3&nbsp;&rarr;&nbsp;h2&nbsp;&rarr;&nbsp;h3&nbsp;&rarr;&nbsp;h3.
            Skipping levels (option&nbsp;c) breaks the outline; multiple
            &lt;h1&gt;s (option&nbsp;d) confuse screen readers and search
            engines that expect a single page title.
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
              "Multiple <h1> per page is fine in HTML5 outline mode but most tools still expect one",
            body: (
              <>
                The HTML5 spec allowed one <code>&lt;h1&gt;</code> per
                sectioning element, but browsers never implemented the outline
                algorithm, and screen readers still surface all{" "}
                <code>&lt;h1&gt;</code>s as top-level headings. In practice,
                use exactly one <code>&lt;h1&gt;</code> per page as the primary
                title.
              </>
            ),
          },
          {
            title: "<section> without a heading is invisible to the document outline",
            body: (
              <>
                A <code>&lt;section&gt;</code> with no heading child contributes
                nothing to the document outline — screen readers cannot name or
                navigate to it. Always pair <code>&lt;section&gt;</code> with an
                <code>&lt;h2&gt;</code>&ndash;<code>&lt;h6&gt;</code> heading as
                its first meaningful child.
              </>
            ),
          },
          {
            title: "<article> is for self-contained content, including a single forum comment",
            body: (
              <>
                It is a common misconception that <code>&lt;article&gt;</code>{" "}
                means &ldquo;news article.&rdquo; The spec defines it as any
                self-contained, independently distributable item — a blog post,
                a product card, or even a single comment thread reply each
                qualifies.
              </>
            ),
          },
          {
            title:
              "Visual order ≠ DOM order — flexbox `order` and CSS Grid placement do not change the document outline",
            body: (
              <>
                CSS properties like <code>order</code> or{" "}
                <code>grid-column</code> change where elements{" "}
                <em>appear</em> on screen but leave the DOM order — and
                therefore the document outline and tab order — unchanged.
                Screen readers and keyboard navigation follow the DOM, not
                the painted positions.
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
            Semantic elements (<code>header</code>, <code>nav</code>,{" "}
            <code>main</code>, <code>article</code>, <code>aside</code>,{" "}
            <code>footer</code>) carry meaning that screen readers and search
            engines use to navigate and rank content — replacing{" "}
            <code>&lt;div&gt;</code>-soup is the single highest-leverage
            accessibility improvement you can make.
          </>,
          <>
            Heading levels (<code>h1</code>&ndash;<code>h6</code>) create a
            document outline — use them in order and never skip levels for
            purely visual reasons; if you need a smaller font, change the CSS,
            not the heading level.
          </>,
          <>
            Visual layout is CSS&apos;s job; meaning is HTML&apos;s job. Do not
            let one impersonate the other: <code>&lt;table&gt;</code> is not a
            grid system, <code>&lt;br&gt;</code> is not a list, and a class
            named <code>sidebar</code> is not an <code>&lt;aside&gt;</code>.
          </>,
          <>
            Accessibility is a side-effect of good HTML, not a feature you bolt
            on later. A page authored with correct semantics gets landmark
            navigation, a parseable document outline, and meaningful search
            signals for free.
          </>,
          <>
            Use <code>&lt;article&gt;</code> for standalone syndicatable
            content, <code>&lt;section&gt;</code> for thematic groups within a
            parent (paired with a heading), and <code>&lt;aside&gt;</code> for
            tangential content — and fall back to <code>&lt;div&gt;</code> only
            when none of those meanings apply.
          </>,
        ]}
        mentalModel="HTML elements are nouns — they say what something is. CSS is the adjective — it says how it looks. Never let an adjective do a noun's job."
      />
    </div>
  );
}
