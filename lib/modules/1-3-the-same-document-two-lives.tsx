"use client";

import { Card, CardContent } from "@/components/ui/card";
import { StepByStepExplanation } from "@/components/StepByStepExplanation";
import { HTMLPlayground } from "@/components/CodePlayground";
import { Challenge } from "@/components/Challenge";
import { GotchaList } from "@/components/GotchaList";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { RoadmapLink } from "@/components/RoadmapLink";
import { LiveCascadeDemo } from "@/components/LiveCascadeDemo";
import { FlexboxControls } from "@/components/FlexboxControls";

export function Module_1_3_Content() {
  // Data blocks hoisted out of JSX for readability — listed in render order.

  const documentToStyledSteps = [
    {
      title: "Inline styles: fine for one element, fatal for twenty",
      description: (
        <p>
          The <em>inline style</em> attribute — <code>style=&quot;...&quot;</code> — puts CSS
          directly on the element. It works immediately. But the moment you have more than one
          element, you are repeating yourself. Twenty post cards means twenty copies of the same
          color, font size, and padding declaration. Changing the brand color means 200 edits across
          every file. There is no single source of truth; the style is baked into the content.
        </p>
      ),
      code: `<!-- Inline styles: repeated, fragile, hard to change -->
<article style="padding: 1.5rem 0; border-bottom: 1px solid #e5e5e5;">
  <h2 style="margin: 0 0 .25rem; color: #1a1a1a;">Hello, world</h2>
  <p style="color: #666; font-size: .9rem;">By Alice — 2026-04-01</p>
  <p style="margin-top: .5rem;">Why we started this blog.</p>
</article>

<article style="padding: 1.5rem 0; border-bottom: 1px solid #e5e5e5;">
  <h2 style="margin: 0 0 .25rem; color: #1a1a1a;">The cascade</h2>
  <p style="color: #666; font-size: .9rem;">By Bob — 2026-04-15</p>
  <p style="margin-top: .5rem;">If you understand specificity, you understand CSS.</p>
</article>
<!-- Want to change the accent color? Find and replace 200 occurrences. -->`,
      language: "html",
    },
    {
      title: "A <style> block: CSS centralized for one page",
      description: (
        <p>
          Moving the declarations into a <code>&lt;style&gt;</code> block in the{" "}
          <code>&lt;head&gt;</code> introduces three new vocabulary words.{" "}
          A <em>selector</em> targets which elements to style. A <em>property</em> names what to
          change. A <em>value</em> says how to change it. Now the post cards share one definition:
          change the padding in one place and every card updates. But this CSS only exists on this
          one page.
        </p>
      ),
      code: `<head>
  <style>
    /* selector       property        value   */
    article.post-card { padding: 1.5rem 0; border-bottom: 1px solid #e5e5e5; }
    article.post-card h2 { margin: 0 0 .25rem; }
    article.post-card .meta { color: #666; font-size: .9rem; }
    article.post-card .excerpt { margin-top: .5rem; }
  </style>
</head>
<body>
  <article class="post-card">
    <h2>Hello, world</h2>
    <p class="meta">By Alice — 2026-04-01</p>
    <p class="excerpt">Why we started this blog.</p>
  </article>
</body>`,
      language: "html",
    },
    {
      title: "An external stylesheet: CSS centralized for every page",
      description: (
        <p>
          A <code>&lt;link rel=&quot;stylesheet&quot;&gt;</code> element tells the browser to fetch a
          separate <code>.css</code> file and apply it to this page. Every page on the site can point
          at the same file. The <em>selector</em> is now the API between the HTML and the CSS — as
          long as the HTML uses <code>class=&quot;post-card&quot;</code>, the styles apply
          automatically. Change the brand color in one file and every page updates at once.
        </p>
      ),
      code: `<!-- index.html -->
<head>
  <link rel="stylesheet" href="assets/styles.css">
</head>

<!-- posts/hello-world.html -->
<head>
  <link rel="stylesheet" href="../assets/styles.css">
</head>

<!-- Both pages share the same CSS file.
     The selector is the contract: any element with
     class="post-card" gets the post-card styles,
     on any page that links this stylesheet. -->`,
      language: "html",
    },
    {
      title: "The cascade: when two rules collide, one wins",
      description: (
        <p>
          What happens when two CSS rules target the same element and set the same property to
          different values? The <em>cascade</em> resolves the conflict in three steps: origin
          first (does one rule have <code>!important</code>?), then <em>specificity</em> (which
          selector is more specific?), then source order (which rule appeared later?). Specificity
          is computed as a three-number score: ID selectors add 1 to the first column, class/
          attribute/pseudo-class selectors add 1 to the second, element selectors add 1 to the
          third. The rule with the higher score wins; ties go to the later rule.
        </p>
      ),
      code: `/* Two rules targeting the same element: which color wins? */

/* Score: 0,1,1  (one class + one element) */
article.post-card .meta { color: blue; }

/* Score: 0,0,2  (two elements) */
article p { color: red; }

/* article.post-card .meta wins: 0,1,1 > 0,0,2
   The .meta paragraph is blue.
   The specificity score is computed column by column,
   left to right — never carry digits. */`,
      language: "css",
    },
    {
      title: "The box model: every element is a box",
      description: (
        <p>
          Every element in the browser is a rectangular box with four layers: content, then{" "}
          <code>padding</code> (space inside the border), then <code>border</code>, then{" "}
          <code>margin</code> (space outside the border). By default, <code>width</code> sets only
          the content area — adding <code>padding</code> makes the box wider than declared.
          The fix: <code>box-sizing: border-box</code> makes <code>width</code> include padding
          and border, so the box is exactly as wide as you declared. The reference stylesheet applies
          this globally with <code>* &#123; box-sizing: border-box; &#125;</code> — the very first
          non-<code>:root</code> rule.
        </p>
      ),
      code: `/* Without border-box: a 300px card is actually 340px */
.card { width: 300px; padding: 20px; }
/* actual rendered width = 300 + 20 + 20 = 340px */

/* With border-box: a 300px card is exactly 300px */
* { box-sizing: border-box; }
.card { width: 300px; padding: 20px; }
/* actual rendered width = 300px (padding included) */

/* margin still adds space *outside* the box.
   margin: 1.5rem 0 adds 1.5rem above and below,
   but does not change the box's own width. */`,
      language: "css",
    },
    {
      title: "Layout: Flexbox for the header row",
      description: (
        <p>
          <em>Flexbox</em> is a one-dimensional layout system — it arranges items along a single
          axis (row or column). The reference stylesheet uses it for the{" "}
          <code>&lt;header&gt;</code>: <code>display: flex; justify-content: space-between;</code>{" "}
          pushes the brand name to the left and the nav links to the right. For two-dimensional
          layouts — rows and columns simultaneously — <em>CSS Grid</em> is the stronger tool.
          This blog&apos;s simple single-column main layout does not need Grid, but a card grid
          would: <code>display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));</code>{" "}
          creates a responsive multi-column layout without any <em>media queries</em>.
        </p>
      ),
      code: `/* Flexbox: 1-D layout — used in the reference header */
header {
  display: flex;
  justify-content: space-between; /* brand left, nav right */
  align-items: center;            /* vertically centered */
}

/* Grid: 2-D layout — for a card grid layout */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  /* fills available width with columns at least 200px wide;
     no media query needed */
}`,
      language: "css",
    },
    {
      title: "Responsive design: mobile-first and dark mode",
      description: (
        <p>
          <em>Mobile-first</em> means writing CSS for small screens first, then using{" "}
          <code>@media (min-width: ...)</code> to add complexity for larger screens. The reference
          stylesheet uses a subtler technique: <code>max-width: var(--max-w)</code> and{" "}
          <code>margin: 0 auto</code> on <code>header</code>, <code>main</code>, and{" "}
          <code>footer</code> — the content never grows beyond 720px and stays centered on wide
          screens. The stylesheet also responds to the user&apos;s OS theme preference with{" "}
          <code>@media (prefers-color-scheme: dark)</code>, swapping every color via custom
          properties. Below is the complete <code>styles.css</code> of the reference blog — 34
          lines, no framework.
        </p>
      ),
      code: `:root {
  --bg: #fafafa; --fg: #1a1a1a; --muted: #666; --accent: #5b21b6;
  --border: #e5e5e5; --max-w: 720px;
}
@media (prefers-color-scheme: dark) {
  :root { --bg: #0a0a0a; --fg: #fafafa; --muted: #999; --accent: #a78bfa; --border: #2a2a2a; }
}
* { box-sizing: border-box; }
html { font: 16px/1.6 -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif; }
body { margin: 0; background: var(--bg); color: var(--fg); }
header, footer { border-bottom: 1px solid var(--border); }
footer { border-top: 1px solid var(--border); border-bottom: none; }
header, footer, main { padding: 1.5rem; max-width: var(--max-w); margin: 0 auto; }
header { display: flex; justify-content: space-between; align-items: center; }
header a.brand { font-weight: 700; text-decoration: none; color: var(--fg); font-size: 1.25rem; }
nav a { margin-left: 1rem; color: var(--muted); text-decoration: none; }
nav a:hover { color: var(--accent); }
h1, h2, h3 { line-height: 1.2; }
a { color: var(--accent); }
article.post-card { padding: 1.5rem 0; border-bottom: 1px solid var(--border); }
article.post-card h2 { margin: 0 0 .25rem; }
article.post-card .meta { color: var(--muted); font-size: .9rem; }
article.post-card .excerpt { margin-top: .5rem; }
.cover { aspect-ratio: 16/9; background: var(--border); border-radius: .5rem; overflow: hidden; margin-bottom: 1rem; }
.cover img { width: 100%; height: 100%; object-fit: cover; display: block; }
article.post-detail h1 { margin-bottom: .5rem; }
article.post-detail .meta { color: var(--muted); margin-bottom: 2rem; }
article.post-detail p { margin: 1em 0; }
article.post-detail pre { background: var(--border); padding: 1rem; border-radius: .5rem; overflow-x: auto; }
article.post-detail code { font-family: ui-monospace, SF Mono, Menlo, monospace; font-size: .9em; }
.tags { margin-top: 1rem; }
.tag { display: inline-block; background: var(--border); color: var(--fg); padding: .15rem .6rem; border-radius: 999px; font-size: .85rem; margin-right: .25rem; text-decoration: none; }
.tag:hover { background: var(--accent); color: white; }
.muted-block { background: var(--border); padding: 1rem 1.25rem; border-radius: .5rem; color: var(--muted); }`,
      language: "css",
    },
  ];

  const cascadeRules = [
    {
      selector: "article.post-card .meta",
      declaration: "color: blue",
      source: "stylesheet" as const,
    },
    {
      selector: "article p",
      declaration: "color: red",
      source: "stylesheet" as const,
    },
  ];

  const playgroundHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Taproot</title>
  <style>
    /* Try this: change --accent to a different color and watch every link update */
    :root {
      --bg: #fafafa;
      --fg: #1a1a1a;
      --muted: #666;
      --accent: #5b21b6;
      --border: #e5e5e5;
    }
    * { box-sizing: border-box; }
    body { margin: 0; font: 16px/1.6 system-ui, sans-serif;
           background: var(--bg); color: var(--fg); padding: 1rem; }
    header { display: flex; justify-content: space-between;
             align-items: center; border-bottom: 1px solid var(--border);
             padding-bottom: 1rem; margin-bottom: 1rem; }
    header a { font-weight: 700; text-decoration: none; color: var(--fg); }
    nav a { margin-left: 1rem; color: var(--muted); text-decoration: none; }
    nav a:hover { color: var(--accent); }
    a { color: var(--accent); }
    article.post-card { padding: 1rem 0; border-bottom: 1px solid var(--border); }
    article.post-card h2 { margin: 0 0 .25rem; }
    article.post-card .meta { color: var(--muted); font-size: .9rem; }

    /* Try this: add a @media (max-width: 600px) rule that stacks the header vertically */
    /* Try this: add @media (prefers-color-scheme: dark) and swap --bg and --fg */
  </style>
</head>
<body>
  <header>
    <a href="/">Taproot</a>
    <nav>
      <a href="/about.html">About</a>
    </nav>
  </header>
  <main>
    <article class="post-card">
      <h2><a href="#">Hello, world</a></h2>
      <p class="meta">By Alice &mdash; 2026-04-01</p>
      <p>Why we started this blog.</p>
    </article>
    <article class="post-card">
      <h2><a href="#">The cascade</a></h2>
      <p class="meta">By Bob &mdash; 2026-04-15</p>
      <p>If you understand specificity, you understand CSS.</p>
    </article>
  </main>
</body>
</html>`;

  const gotchaItems = [
    {
      title: "!important is the nuclear option — it bypasses specificity entirely",
      body: (
        <>
          <code>!important</code> overrides every other rule for that property, regardless of
          specificity or source order. Use it once to &quot;fix&quot; a cascade conflict, and you
          will need a second <code>!important</code> to override the first. The nuclear option
          spreads. The correct fix for a specificity conflict is to raise the specificity of the
          rule you want to win — not to reach for <code>!important</code>.
        </>
      ),
    },
    {
      title: "Inheritance only applies to some properties — layout properties do not inherit",
      body: (
        <>
          <code>color</code> and <code>font-size</code> inherit down the tree automatically:{" "}
          set them on <code>body</code> and every element picks them up. But{" "}
          <code>padding</code>, <code>border</code>, <code>width</code>, and <code>display</code>{" "}
          do not inherit. If a child element seems to &quot;inherit&quot; a layout property, it
          is almost always because the browser&apos;s default stylesheet or a CSS reset applied
          it, not because the parent passed it down.
        </>
      ),
    },
    {
      title: "Margin collapses between adjacent block elements — the larger of the two wins",
      body: (
        <>
          When two block elements sit on top of each other — an <code>&lt;h2&gt;</code> above a{" "}
          <code>&lt;p&gt;</code>, for instance — the vertical margins between them collapse into
          a single margin equal to the larger of the two. <code>margin-bottom: 1rem</code> on the
          heading and <code>margin-top: 1rem</code> on the paragraph does not produce 2rem of
          space; it produces 1rem. Flexbox and Grid children are immune — collapse only affects
          normal block flow.
        </>
      ),
    },
    {
      title: "prefers-color-scheme only switches CSS — your content still has to be readable in both",
      body: (
        <>
          Swapping <code>--bg</code> and <code>--fg</code> via custom properties handles most of
          dark mode automatically. But hard-coded colors in image <code>src</code> attributes,
          SVG fills baked into markup, or <code>style=&quot;color: black&quot;</code> inline
          declarations will not follow the switch. Test your page in both modes in DevTools before
          shipping; the CSS toggle is the easy part.
        </>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-3xl font-bold">The Same Document, Two Lives</h1>
        <RoadmapLink url="https://roadmap.sh/frontend" />
      </div>

      {/* Section 1: Hook */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            The blog from module 1-2 has good structure. Open the HTML and look at a single post
            card:
          </p>
          <div className="bg-slate-100 dark:bg-slate-800 rounded p-4 font-mono text-sm mb-4 text-slate-700 dark:text-slate-300 leading-relaxed overflow-x-auto">
            <span className="text-slate-400">&lt;article style=&quot;</span>
            <span className="text-amber-600 dark:text-amber-400">
              padding: 1.5rem 0; border-bottom: 1px solid #e5e5e5; color: #5b21b6;
            </span>
            <span className="text-slate-400">&quot;&gt;</span>
            <br />
            <span className="text-slate-400 pl-4">
              &lt;h2 style=&quot;<span className="text-amber-600 dark:text-amber-400">margin: 0 0 .25rem; color: #1a1a1a;</span>&quot;&gt;Hello, world&lt;/h2&gt;
            </span>
            <br />
            <span className="text-slate-400 pl-4">
              &lt;p style=&quot;<span className="text-amber-600 dark:text-amber-400">color: #666; font-size: .9rem;</span>&quot;&gt;By Alice&lt;/p&gt;
            </span>
            <br />
            <span className="text-slate-400">&lt;/article&gt;</span>
          </div>
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            One card, fine. Now picture a blog with twenty posts. Every{" "}
            <code>&lt;article&gt;</code> tag carries an identical wall of style declarations.
            The HTML file doubles in size. The same color, <code>#5b21b6</code>, appears 200
            times — once per styleable element per post. When the designer asks to change the
            brand color to <code>#7c3aed</code>, you open a text editor and start hunting.
          </p>
          <p className="text-slate-700 dark:text-slate-300">
            Now open that same page on a phone. Without a viewport instruction and without a
            layout that reacts to screen width, the browser renders the desktop layout at full
            size and scales it down — every word is 4px tall and the user pinches to zoom. Or flip
            it: a layout designed for 375px looks laughably wide on a 1920px monitor, a single
            thin column drifting in an ocean of white space. The document has meaning, but it has
            no appearance of its own — and making it look right is its own problem, with its own
            answer.
          </p>
        </CardContent>
      </Card>

      {/* Section 2: Mental model */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            CSS exists so that appearance and content can change independently. The selector is
            the contract between HTML and CSS: as long as a <code>&lt;p class=&quot;meta&quot;&gt;</code>{" "}
            exists in the document, the rule <code>.meta &#123; color: var(--muted); &#125;</code>{" "}
            applies. Change the design in one file; no HTML changes required. When two rules
            target the same element, the <em>cascade</em> resolves the conflict. Its algorithm is
            a single sentence:
          </p>
          <blockquote className="border-l-4 border-blue-500 pl-4 italic text-slate-600 dark:text-slate-400">
            Cascade = origin + specificity + source order.
          </blockquote>
        </CardContent>
      </Card>

      {/* Section 3: Step-by-step */}
      <h2 className="text-xl font-semibold mb-3">From inline chaos to a 34-line stylesheet</h2>
      <StepByStepExplanation
        title="Deriving CSS from the problem it solves"
        description="Each step removes a specific pain introduced in the previous step. The final step shows the complete reference stylesheet."
        steps={documentToStyledSteps}
      />

      {/* Optional: live cascade demo (specificity computed live) */}
      <LiveCascadeDemo
        title="Cascade resolver: who wins?"
        description="Two rules target the same .meta paragraph. The cascade computes a specificity score for each. The score is three columns: IDs, classes, elements."
        rules={cascadeRules}
      />

      {/* Optional: Flexbox playground (header layout) */}
      <FlexboxControls
        title="Flexbox playground — experiment with the header layout"
        itemCount={3}
      />

      {/* Section 4: Playground */}
      <h2 className="text-xl font-semibold mb-3">Try it yourself</h2>
      <HTMLPlayground
        html={playgroundHtml}
        title="Live CSS editor — the Taproot blog"
        description="Edit the CSS inside the <style> block. The comments suggest three experiments: custom property cascade, a media query, and dark mode."
      />

      {/* Section 5: Challenges */}
      <h2 className="text-xl font-semibold mb-3">Challenges</h2>

      <Challenge
        title="Specificity showdown"
        question={`Two CSS rules both target the .meta element inside a post card:\n\n.post-card .meta { color: red; }\narticle .meta    { color: blue; }\n\nWhich rule wins, and why?`}
        options={[
          {
            id: "a",
            text: ".post-card .meta wins. Its specificity score is (0,2,0) — two class selectors — which beats article .meta at (0,1,1) — one class plus one element.",
          },
          {
            id: "b",
            text: "article .meta wins. Element selectors always beat class selectors in the cascade.",
          },
          {
            id: "c",
            text: "The second rule wins because it appears later in the file, and source order always takes priority.",
          },
          {
            id: "d",
            text: "Neither wins — when two class selectors collide the browser falls back to the default stylesheet.",
          },
        ]}
        correctAnswerId="a"
        explanation={
          <p>
            Specificity is computed as three columns: <strong>(IDs, classes/attributes/pseudo-classes,
            elements)</strong>. <code>.post-card .meta</code> has two class selectors, giving it
            (0,2,0). <code>article .meta</code> has one class selector and one element selector,
            giving it (0,1,1). Comparing column by column from left: both have 0 IDs, then 2 vs 1
            classes — <code>.post-card .meta</code> wins on the second column and the{" "}
            <code>color: red</code> declaration applies. Source order is the tiebreaker only when
            specificity scores are exactly equal.
          </p>
        }
      />

      <Challenge
        title="The mysteriously wide card"
        question={`A card is declared as 300px wide, but in the browser it renders as 340px. The CSS is:\n\n.card {\n  width: 300px;\n  padding: 20px;\n}\n\nWhat is the cause, and which fix is correct?`}
        options={[
          {
            id: "a",
            text: "The default box-sizing: content-box makes width apply to the content area only, so padding is added on top. Fix: add box-sizing: border-box to include padding inside the declared width.",
          },
          {
            id: "b",
            text: "The padding value of 20px is being doubled by an inherited property. Fix: add padding: 0 to the parent element.",
          },
          {
            id: "c",
            text: "300px is a relative unit that the browser resolves to 340px on high-DPI screens. Fix: use 300rem instead.",
          },
          {
            id: "d",
            text: "The card has a hidden border. Fix: add border: none explicitly.",
          },
        ]}
        correctAnswerId="a"
        explanation={
          <p>
            The browser&apos;s default <code>box-sizing</code> is <code>content-box</code>: the
            declared <code>width</code> applies to the content area only, and padding is added
            outside it. A 300px card with <code>padding: 20px</code> on all sides renders at
            300 + 20 + 20 = 340px. Adding <code>box-sizing: border-box</code> — or using the
            global reset <code>* &#123; box-sizing: border-box; &#125;</code> — makes{" "}
            <code>width</code> include the padding, so the card is exactly 300px as declared.
          </p>
        }
      />

      {/* Section 6: GotchaList */}
      <h2 className="text-xl font-semibold mb-3">Things that surprise people</h2>
      <GotchaList items={gotchaItems} />

      {/* Section 7: KeyTakeaways */}
      <KeyTakeaways
        mentalModel="Cascade = origin + specificity + source order."
        points={[
          <>
            Inline styles are the highest-specificity stylesheet you can write — but they create
            a maintenance nightmare the moment you have more than one element. An external{" "}
            <em>stylesheet</em> with <em>selectors</em> is the single source of truth: change one
            rule and every matching element updates.
          </>,
          <>
            The <em>cascade</em> resolves style conflicts in three steps: origin (does a rule have{" "}
            <code>!important</code>?), then <em>specificity</em> (ID beats class beats element),
            then source order (later rule wins ties). Being able to compute specificity by hand is
            the most useful CSS debugging skill you can have.
          </>,
          <>
            The <em>box model</em> means every element is a box: content + padding + border +
            margin. With the default <code>box-sizing: content-box</code>, padding expands the
            rendered size beyond the declared <code>width</code>. <code>box-sizing: border-box</code>{" "}
            makes <code>width</code> include padding and border, which is how most developers
            expect layout to work.
          </>,
          <>
            Flexbox handles one-dimensional layouts — a row of items with space between them, a
            centered header. Grid handles two-dimensional layouts — rows and columns
            simultaneously. Use Flexbox for the header; use Grid when you need both axes at once.
          </>,
          <>
            <em>Mobile-first</em> CSS means writing the small-screen layout first and adding
            complexity with <code>min-width</code> <em>media queries</em>. The reference stylesheet
            skips breakpoints entirely for the blog&apos;s single-column layout, instead capping
            width with <code>max-width</code> and centering with <code>margin: 0 auto</code>.
            Dark mode works the same way: a single <code>@media (prefers-color-scheme: dark)</code>{" "}
            block swaps every color at once via custom properties.
          </>,
        ]}
      />
    </div>
  );
}
