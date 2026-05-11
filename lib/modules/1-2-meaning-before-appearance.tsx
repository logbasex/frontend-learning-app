"use client";

import { Card, CardContent } from "@/components/ui/card";
import { StepByStepExplanation } from "@/components/StepByStepExplanation";
import { HTMLPlayground } from "@/components/CodePlayground";
import { CodeComparison } from "@/components/CodeComparison";
import { Challenge } from "@/components/Challenge";
import { GotchaList } from "@/components/GotchaList";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { RoadmapLink } from "@/components/RoadmapLink";

export function Module_1_2_Content() {
  // Data blocks hoisted out of JSX for readability — listed in render order.

  const divSoupCode = `<!-- div-soup: no landmarks, no meaning -->
<div class="header">
  <div class="brand">Taproot</div>
  <div class="nav">
    <a href="/about.html">About</a>
  </div>
</div>
<div class="content">
  <div class="post">
    <div class="title">
      <a href="posts/hello-world.html">Hello, world</a>
    </div>
    <div class="date">By Alice — 2026-04-01</div>
    <div class="excerpt">Why we started this blog.</div>
  </div>
</div>
<div class="footer">Taproot — a small blog by Alice and Bob.</div>`;

  const semanticCode = `<!-- semantic: every region has a name -->
<header>
  <a href="/" class="brand">Taproot</a>
  <nav>
    <a href="/about.html">About</a>
  </nav>
</header>
<main>
  <article class="post-card">
    <h2><a href="posts/hello-world.html">Hello, world</a></h2>
    <p class="meta">By Alice — 2026-04-01</p>
    <p class="excerpt">Why we started this blog.</p>
  </article>
</main>
<footer><p>Taproot — a small blog by Alice and Bob.</p></footer>`;

  const semanticTreeSteps = [
    {
      title: "Start state: the index.html from module 1-1",
      description: (
        <p>
          The page from module 1-1 already uses <code>&lt;h1&gt;</code>, <code>&lt;h2&gt;</code>,{" "}
          <code>&lt;p&gt;</code>, and <code>&lt;a&gt;</code> — so headings and links work. But the
          page has no <em>landmark</em> regions. Every part of the page — the site name, the
          navigation links, the post list, the footer — lives inside one undivided{" "}
          <code>&lt;body&gt;</code>. A screen reader cannot jump to &quot;navigation&quot; or
          &quot;main content&quot; because those regions have not been named.
        </p>
      ),
      code: `<body>
  <a href="/" class="brand">Taproot</a>
  <a href="/about.html">About</a>

  <h1>Taproot — a small blog about the web</h1>
  <p>A small blog by Alice and Bob about the web platform.</p>

  <h2><a href="posts/hello-world.html">Hello, world</a></h2>
  <p class="meta">By Alice — 2026-04-01 — 4 min read</p>
  <p class="excerpt">Why we started this blog.</p>
  <!-- more posts... -->

  <p>Taproot — a small blog by Alice and Bob.</p>
</body>`,
      language: "html",
    },
    {
      title: "Add <header> for the brand and navigation region",
      description: (
        <p>
          Wrapping the site name and nav links in <code>&lt;header&gt;</code> tells the browser —
          and every screen reader — that this region is the <em>banner</em> of the page. Wrapping the
          nav links specifically in <code>&lt;nav&gt;</code> adds a second landmark: now a screen
          reader user can press a single key to jump straight to navigation and hear &quot;navigation
          landmark — About&quot; instead of wading through all the heading links first.
        </p>
      ),
      code: `<header>
  <a href="/" class="brand">Taproot</a>
  <nav>
    <a href="/about.html">About</a>
  </nav>
</header>`,
      language: "html",
    },
    {
      title: "Wrap the post list in <main>",
      description: (
        <p>
          <code>&lt;main&gt;</code> marks the region that is unique to this page — not the header or
          footer shared across every page, but the content that changes from URL to URL. A document
          must have exactly one <code>&lt;main&gt;</code>. Screen reader users can press a shortcut
          to skip directly to it, bypassing the header and navigation they have already heard on
          every other page of the site.
        </p>
      ),
      code: `<header>
  <a href="/" class="brand">Taproot</a>
  <nav><a href="/about.html">About</a></nav>
</header>
<main>
  <h1>Taproot — a small blog about the web</h1>
  <p>A small blog by Alice and Bob about the web platform.</p>
  <!-- post list goes here -->
</main>`,
      language: "html",
    },
    {
      title: "Convert each post card to <article>",
      description: (
        <p>
          An <code>&lt;article&gt;</code> is a self-contained unit that makes sense on its own — you
          could copy it into a feed reader or another page and it would still be coherent. Each post
          summary on the index page qualifies. Using <code>&lt;article&gt;</code> means a screen
          reader can announce &quot;article&quot; as it enters the element, so users scanning the
          page know they are moving from one independent item to the next.
        </p>
      ),
      code: `<main>
  <article class="post-card">
    <h2><a href="posts/hello-world.html">Hello, world</a></h2>
    <p class="meta">By Alice — 2026-04-01 — 4 min read</p>
    <p class="excerpt">Why we started this blog and what you can expect.</p>
  </article>
  <article class="post-card">
    <h2><a href="posts/the-cascade.html">The cascade is the only CSS thing that matters</a></h2>
    <p class="meta">By Bob — 2026-04-15 — 6 min read</p>
    <p class="excerpt">If you understand origin, specificity, and source order, you understand CSS.</p>
  </article>
</main>`,
      language: "html",
    },
    {
      title: "Open the post detail page: heading hierarchy and tags",
      description: (
        <p>
          On <code>posts/hello-world.html</code> the post content lives in{" "}
          <code>&lt;article class=&quot;post-detail&quot;&gt;</code>. Inside it, the post title is{" "}
          <code>&lt;h1&gt;</code> — there is one <code>&lt;h1&gt;</code> per page, and on a post
          page the post title owns it. The byline uses <code>&lt;p class=&quot;meta&quot;&gt;</code>,
          not a heading, because a byline is not a section title. At the bottom,{" "}
          <code>&lt;div class=&quot;tags&quot;&gt;</code> holds tag links. These links navigate to
          filtered views, but the group of tags is not a navigation landmark for the site — so{" "}
          <code>&lt;div&gt;</code> is the right choice here, not <code>&lt;nav&gt;</code>.
        </p>
      ),
      code: `<main>
  <article class="post-detail">
    <div class="cover"><img src="../assets/cover-1.svg" alt=""></div>
    <h1>Hello, world</h1>
    <p class="meta">By Alice — 2026-04-01 — 4 min read</p>
    <p>This is the first post on Taproot. We started this blog because
    we wanted a place to write about the web that is not a thread on
    a social network.</p>
    <p>Posts here will be short, opinionated, and concrete.</p>
    <p>If you spot a mistake, the source is on GitHub.</p>
    <div class="tags">
      <a class="tag" href="#">meta</a>
    </div>
  </article>
</main>`,
      language: "html",
    },
    {
      title: "Add the comment form: labels wired to inputs",
      description: (
        <p>
          A form is part of meaning, not just interactivity. The critical rule:{" "}
          every <code>&lt;input&gt;</code> must have a <code>&lt;label&gt;</code> wired to it via
          matching <code>for</code> and <code>id</code> attributes. Without that wiring, a{" "}
          <em>screen reader</em> reads the input field as &quot;edit text blank&quot; — no hint of
          what to type. The <code>aria-describedby</code> attribute links an error hint to the
          input so the hint is announced when the field is focused. Native attributes{" "}
          <code>required</code> and <code>minlength</code> enable browser validation without any
          JavaScript.
        </p>
      ),
      code: `<!-- This form is shown as markup in the static build;
     the SPA build (Stage IV) wires up the submit handler. -->
<form class="comment-form" method="post" action="/comments">
  <div class="field">
    <label for="comment-name">Name</label>
    <input
      id="comment-name"
      name="name"
      type="text"
      required
      minlength="2"
      aria-describedby="comment-name-hint"
    >
    <span id="comment-name-hint" class="field-hint">
      At least 2 characters.
    </span>
  </div>
  <div class="field">
    <label for="comment-body">Comment</label>
    <textarea
      id="comment-body"
      name="body"
      required
      minlength="10"
      aria-describedby="comment-body-hint"
    ></textarea>
    <span id="comment-body-hint" class="field-hint">
      At least 10 characters.
    </span>
  </div>
  <button type="submit">Post comment</button>
</form>`,
      language: "html",
    },
    {
      title: "The finished post page: a faithful document outline",
      description: (
        <p>
          Putting it all together, the post page now has a clear{" "}
          <em>document outline</em>: a <code>&lt;header&gt;</code> banner, a <code>&lt;main&gt;</code>{" "}
          with a single <code>&lt;article&gt;</code> containing one <code>&lt;h1&gt;</code>, and a{" "}
          <code>&lt;footer&gt;</code>. Every <code>&lt;label&gt;</code> is wired to its{" "}
          <code>&lt;input&gt;</code>. A screen reader user can jump to the article, read it, tab
          into the form, and hear each field&apos;s label announced automatically. The visual
          appearance is unchanged from what you would get with a plain <code>&lt;div&gt;</code> —
          but the structure now travels with the document.
        </p>
      ),
      code: `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Hello, world — Taproot</title>
  <meta name="description" content="Why we started this blog.">
  <link rel="stylesheet" href="../assets/styles.css">
</head>
<body>
  <header>
    <a href="/" class="brand">Taproot</a>
    <nav><a href="/about.html">About</a></nav>
  </header>
  <main>
    <article class="post-detail">
      <div class="cover"><img src="../assets/cover-1.svg" alt=""></div>
      <h1>Hello, world</h1>
      <p class="meta">By Alice — 2026-04-01 — 4 min read</p>
      <p>This is the first post on Taproot.</p>
      <p>Posts here will be short, opinionated, and concrete.</p>
      <p>If you spot a mistake, the source is on GitHub.</p>
      <div class="tags"><a class="tag" href="#">meta</a></div>
    </article>

    <!-- Comment form: markup shown here; submit handler added in the SPA build -->
    <form class="comment-form" method="post" action="/comments">
      <div class="field">
        <label for="comment-name">Name</label>
        <input id="comment-name" name="name" type="text"
               required minlength="2"
               aria-describedby="comment-name-hint">
        <span id="comment-name-hint" class="field-hint">At least 2 characters.</span>
      </div>
      <div class="field">
        <label for="comment-body">Comment</label>
        <textarea id="comment-body" name="body"
                  required minlength="10"
                  aria-describedby="comment-body-hint"></textarea>
        <span id="comment-body-hint" class="field-hint">At least 10 characters.</span>
      </div>
      <button type="submit">Post comment</button>
    </form>

    <section class="muted-block">
      <strong>Comments are off in this version.</strong>
      The static build is read-only — no JavaScript, no server.
      The SPA and full-stack versions add live comments.
    </section>
  </main>
  <footer><p>Taproot — a small blog by Alice and Bob.</p></footer>
</body>
</html>`,
      language: "html",
    },
  ];

  const playgroundHtml = `<!-- Try this: replace <div class="post"> with <article> and notice
     that the page looks identical — but the document outline now has
     a named, self-contained unit a screen reader can announce. -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Taproot — post page</title>
</head>
<body>
  <header>
    <a href="/">Taproot</a>
    <nav><a href="/about.html">About</a></nav>
  </header>
  <main>
    <div class="post">
      <h1>Hello, world</h1>
      <p class="meta">By Alice — 2026-04-01</p>
      <p>This is the first post on Taproot.</p>
    </div>
    <form>
      <label for="name">Name</label>
      <input id="name" type="text" required>
      <button type="submit">Post comment</button>
    </form>
  </main>
  <footer><p>Taproot — a small blog by Alice and Bob.</p></footer>
</body>
</html>`;

  const gotchaItems = [
    {
      title: "ARIA's first rule: don't use ARIA",
      body: (
        <>
          When you reach for <code>role=&quot;navigation&quot;</code> or{" "}
          <code>role=&quot;article&quot;</code>, stop and ask whether the right HTML element exists.
          It almost always does. <code>&lt;nav&gt;</code> already carries <code>role=&quot;navigation&quot;</code>{" "}
          for free; <code>&lt;article&gt;</code> carries <code>role=&quot;article&quot;</code>. Adding
          ARIA on top of semantic HTML does not double the accessibility — it just adds noise, and
          the wrong ARIA attribute can actively break what the browser provides.
        </>
      ),
    },
    {
      title: "<section> without a heading is a code smell",
      body: (
        <>
          <code>&lt;section&gt;</code> creates a named sub-section in the{" "}
          <em>document outline</em>. But &quot;named&quot; means it needs an accessible name — either
          an <code>&lt;h2&gt;</code> inside it, or an <code>aria-label</code> attribute on it.
          A <code>&lt;section&gt;</code> with no heading is invisible to the outline: the section
          opens a new sub-tree but nothing labels it. If you cannot name the section, use a{" "}
          <code>&lt;div&gt;</code> instead.
        </>
      ),
    },
    {
      title: "<header> and <footer> are not unique — every <article> has its own",
      body: (
        <>
          <code>&lt;header&gt;</code> inside <code>&lt;body&gt;</code> is the page-level banner
          landmark. But <code>&lt;header&gt;</code> inside an <code>&lt;article&gt;</code> is just
          the header of that article — it carries no landmark role. The same is true of{" "}
          <code>&lt;footer&gt;</code>. This means a blog post can legitimately have{" "}
          <code>&lt;article&gt;&lt;header&gt;&lt;h1&gt;</code>...
          <code>&lt;/header&gt;</code>...<code>&lt;footer&gt;</code> for the byline without creating
          a second page-level banner.
        </>
      ),
    },
    {
      title: "A <label> with no 'for' (or no nesting) is invisible to a screen reader",
      body: (
        <>
          Two patterns wire a label to an input:{" "}
          <code>&lt;label for=&quot;id&quot;&gt;</code> with a matching <code>id</code> on the input,
          or wrapping the input inside the label element. Either works. Neither wiring means the
          screen reader reads the input field as &quot;edit text blank&quot; — the user has to guess
          what to type. Visually, the label may still appear near the input, which is why this bug
          is easy to miss in a sighted review.
        </>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-3xl font-bold">Meaning Before Appearance</h1>
        <RoadmapLink url="https://roadmap.sh/frontend" />
      </div>

      {/* Section 1: Hook */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            You open the blog from module 1-1 in a screen reader. The reader begins to speak. Here
            is what you hear as it scans the page:
          </p>
          <div className="bg-slate-100 dark:bg-slate-800 rounded p-4 font-mono text-sm mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">
            &quot;Taproot — link.{" "}
            About — link.{" "}
            Taproot — a small blog about the web — heading level one.{" "}
            A small blog by Alice and Bob about the web platform — text.{" "}
            Hello, world — link.{" "}
            By Alice — 2026-04-01 — 4 min read — text.{" "}
            Why we started this blog. — text.{" "}
            The cascade is the only CSS thing that matters — link.{" "}
            By Bob — 2026-04-15 — 6 min read — text.{" "}
            ...&quot;
          </div>
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            Every link on the page sounds the same. There is no announcement of &quot;navigation&quot;
            before the About link, so you cannot tell it apart from the post title links. There is no
            &quot;main content&quot; landmark to jump to — you must listen to the header links before
            reaching the posts. Move to the next page and it starts again: header links, then
            content, with no way to skip ahead.
          </p>
          <p className="text-slate-700 dark:text-slate-300">
            The page works visually. A sighted reader sees a header, a list of posts, a footer. But
            those visual regions exist only as CSS classes — <code>class=&quot;header&quot;</code>,{" "}
            <code>class=&quot;post&quot;</code> — and class names are invisible to the browser&apos;s
            accessibility tree and to search engines. What would have to change about the markup so
            the structure travels with the document, not just with the stylesheet?
          </p>
        </CardContent>
      </Card>

      {/* Section 2: Mental model */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            CSS classes are notes to yourself. They describe how an element should look; they carry
            no inherent meaning to any software that was not written by you. When you use{" "}
            <em>semantic HTML</em> — the right element for the job — the element name itself
            carries meaning that browsers, screen readers, and search engines all understand without
            any extra configuration.
          </p>
          <blockquote className="border-l-4 border-blue-500 pl-4 italic text-slate-600 dark:text-slate-400">
            HTML is a meaning tree, not a layout tree.
          </blockquote>
        </CardContent>
      </Card>

      {/* Optional: Code comparison (div-soup vs semantic) */}
      <CodeComparison
        title="The same content — with and without meaning"
        description="Both versions render identically in a browser with default styles. Only one of them gives the browser a map of the document's regions."
        oldCode={{
          title: "div-soup",
          code: divSoupCode,
          language: "html",
          cons: [
            "Screen reader cannot jump to navigation or main content",
            "Search engine sees one undifferentiated block of text and links",
            "No structural cue that the post is a self-contained unit",
            "CSS class names are invisible to accessibility tools",
          ],
        }}
        newCode={{
          title: "semantic HTML",
          code: semanticCode,
          language: "html",
          pros: [
            "<header> + <nav> give screen reader users a jumpable navigation landmark",
            "<main> lets users skip past the header to reach the content directly",
            "<article> marks each post as a self-contained, syndicatable unit",
            "Structure travels with the document, independent of any stylesheet",
          ],
        }}
      />

      {/* Section 3: Step-by-step */}
      <h2 className="text-xl font-semibold mb-3">Building the meaning tree, one decision at a time</h2>
      <StepByStepExplanation
        title="From a flat body to a structured document"
        description="Each step answers a specific question raised by the screen-reader failure. Introduce each element only when the need for it becomes concrete."
        steps={semanticTreeSteps}
      />

      {/* Section 4: Playground */}
      <h2 className="text-xl font-semibold mb-3">Try it yourself</h2>
      <HTMLPlayground
        html={playgroundHtml}
        title="Live semantic HTML editor"
        description="Edit the markup on the left. The browser renders it on the right. The visual result barely changes — the meaning changes."
      />

      {/* Section 5: Challenges */}
      <h2 className="text-xl font-semibold mb-3">Challenges</h2>

      <Challenge
        title="Spot the three problems"
        question={`A teammate submits this markup for the homepage:\n\n<div class="nav">\n  <a href="/about">About</a>\n  <a href="/contact">Contact</a>\n</div>\n<div class="main">\n  <div class="article">\n    <div class="title">Hello, world</div>\n    <div class="body">Why we started this blog.</div>\n  </div>\n</div>\n\nThree things are wrong from an accessibility and SEO standpoint. Which answer correctly identifies all three?`}
        options={[
          {
            id: "a",
            text: "No <nav> landmark so screen readers cannot jump to navigation; no <main> landmark so users cannot skip the header; no <h1>/<h2> so the post title carries no heading role in the document outline.",
          },
          {
            id: "b",
            text: "The CSS class names use hyphens instead of camelCase; there is no alt attribute on images; the <div> elements should be replaced with <span>.",
          },
          {
            id: "c",
            text: "The links are missing target='_blank'; the article has no id attribute; the page has no <title> in the head.",
          },
          {
            id: "d",
            text: "The markup is missing a <form>; the <div class='main'> needs a width property; there is no viewport meta tag.",
          },
        ]}
        correctAnswerId="a"
        explanation={
          <p>
            CSS class names like <code>class=&quot;nav&quot;</code> are invisible to the browser&apos;s
            accessibility tree — only element names matter. Replacing <code>&lt;div class=&quot;nav&quot;&gt;</code>{" "}
            with <code>&lt;nav&gt;</code> adds a navigation landmark; replacing{" "}
            <code>&lt;div class=&quot;main&quot;&gt;</code> with <code>&lt;main&gt;</code> adds the
            main-content landmark; replacing <code>&lt;div class=&quot;title&quot;&gt;</code> with{" "}
            <code>&lt;h2&gt;</code> (or <code>&lt;h1&gt;</code> if it is the page&apos;s primary
            topic) adds the heading to the document outline. None of those fixes change the visual
            appearance at all without a stylesheet.
          </p>
        }
      />

      <Challenge
        title="Why does the screen reader say 'edit text blank'?"
        question={`A form on the contact page contains this markup:\n\n<label>Email address</label>\n<input type="email" name="email">\n\nA screen reader user tabs to the input and hears 'edit text blank'. The label text is never announced. What is the cause?`}
        options={[
          {
            id: "a",
            text: "The <label> has no 'for' attribute, and the <input> has no 'id' attribute, so there is no programmatic association between them.",
          },
          {
            id: "b",
            text: "The input uses type='email' instead of type='text', which suppresses label announcement.",
          },
          {
            id: "c",
            text: "The label text contains the word 'address', which is a reserved ARIA keyword that conflicts with the input role.",
          },
          {
            id: "d",
            text: "The form has no 'action' attribute, so the browser puts the entire form into an error state and silences labels.",
          },
        ]}
        correctAnswerId="a"
        explanation={
          <p>
            A <code>&lt;label&gt;</code> that is not programmatically associated with its input is
            just decorative text — the screen reader has no way to know they belong together. Fix it
            with matching <code>for</code> and <code>id</code> values:{" "}
            <code>&lt;label for=&quot;email&quot;&gt;Email address&lt;/label&gt;</code> and{" "}
            <code>&lt;input id=&quot;email&quot; type=&quot;email&quot; name=&quot;email&quot;&gt;</code>.
            Alternatively, nest the input inside the label element — that also creates the
            association without a <code>for</code>/<code>id</code> pair. The input type and the
            form&apos;s action attribute have no effect on label announcement.
          </p>
        }
      />

      {/* Section 6: GotchaList */}
      <h2 className="text-xl font-semibold mb-3">Things that surprise people</h2>
      <GotchaList items={gotchaItems} />

      {/* Section 7: KeyTakeaways */}
      <KeyTakeaways
        mentalModel="HTML is a meaning tree, not a layout tree."
        points={[
          <>
            <em>Semantic HTML</em> gives each region an element name the browser understands:
            <code>&lt;header&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;main&gt;</code>,{" "}
            <code>&lt;article&gt;</code>, <code>&lt;footer&gt;</code>. CSS class names do the same
            job visually, but they are invisible to screen readers, search engines, and browser
            accessibility APIs.
          </>,
          <>
            Accessibility is a side-effect of using the right element. You do not add accessibility
            on top of HTML — you get it for free when you choose <code>&lt;nav&gt;</code> instead of{" "}
            <code>&lt;div class=&quot;nav&quot;&gt;</code>. Reaching for ARIA should be a last
            resort, not a first step.
          </>,
          <>
            The <em>document outline</em> is the tree that headings and sectioning elements
            (<code>&lt;article&gt;</code>, <code>&lt;section&gt;</code>) produce. Screen reader
            users navigate by it. Search engines weight it. A good outline has one{" "}
            <code>&lt;h1&gt;</code> per page, with <code>&lt;h2&gt;</code>/<code>&lt;h3&gt;</code>{" "}
            levels that reflect real content hierarchy — never skipped for visual reasons.
          </>,
          <>
            <em>Label association</em> is the most commonly broken accessibility pattern in forms.
            Every <code>&lt;input&gt;</code> needs a <code>&lt;label&gt;</code> connected via
            matching <code>for</code> and <code>id</code> values (or by nesting the input inside
            the label). Without it, a screen reader user hears &quot;edit text blank&quot; and must
            guess what to type.
          </>,
          <>
            Native validation attributes — <code>required</code>, <code>minlength</code>,{" "}
            <code>type=&quot;email&quot;</code> — give you browser-enforced validation without any
            JavaScript. The browser announces constraint violations to screen reader users
            automatically. Use them as a baseline; JavaScript validation is an enhancement on top.
          </>,
        ]}
      />
    </div>
  );
}
