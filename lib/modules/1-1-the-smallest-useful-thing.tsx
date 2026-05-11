"use client";

import { Card, CardContent } from "@/components/ui/card";
import { StepByStepExplanation } from "@/components/StepByStepExplanation";
import { HTMLPlayground } from "@/components/CodePlayground";
import { CodeComparison } from "@/components/CodeComparison";
import { Challenge } from "@/components/Challenge";
import { GotchaList } from "@/components/GotchaList";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { RoadmapLink } from "@/components/RoadmapLink";

export function Module_1_1_Content() {
  // Data blocks hoisted out of JSX for readability — listed in render order.

  const txtContent = `Sourdough Bread

Ingredients:
500g bread flour
375g water
10g salt
100g active starter

Instructions:
Mix flour and water, rest 1 hour.
Add starter and salt, fold every 30 minutes for 3 hours.
Shape, refrigerate overnight.
Bake at 250C for 45 minutes.

This is my grandmother's method. The long cold ferment is the secret.
Visit my blog for more recipes: taprootbakery.com/recipes`;

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Sourdough Bread — Taproot Bakery</title>
</head>
<body>
  <h1>Sourdough Bread</h1>

  <h2>Ingredients</h2>
  <ul>
    <li>500g bread flour</li>
    <li>375g water</li>
    <li>10g salt</li>
    <li>100g active starter</li>
  </ul>

  <h2>Instructions</h2>
  <ol>
    <li>Mix flour and water, rest 1 hour.</li>
    <li>Add starter and salt, fold every 30 minutes for 3 hours.</li>
    <li>Shape, refrigerate overnight.</li>
    <li>Bake at 250C for 45 minutes.</li>
  </ol>

  <p>This is my grandmother&apos;s method. The long cold ferment is the secret.</p>

  <p>Visit my blog for more recipes:
    <a href="https://taprootbakery.com/recipes">taprootbakery.com/recipes</a>
  </p>
</body>
</html>`;

  const txtToHtmlSteps = [
    {
      title: "You have words in a file",
      description: (
        <p>
          A <code>.txt</code> file is raw text. Every program that can open a file can display it,
          but nothing agrees on how. On your laptop, the default font is readable. On a phone, that
          same font might be 6px. There are no headings, no clickable links, no way for the browser
          to know that &quot;Ingredients&quot; is a section title rather than a word in a sentence.
        </p>
      ),
      code: `Sourdough Bread

Ingredients:
500g bread flour
375g water
...`,
      language: "text",
    },
    {
      title: "Declare the document type",
      description: (
        <p>
          The first problem is identity: the browser does not know what kind of file it is reading.
          Adding <code>&lt;!DOCTYPE html&gt;</code> on line one tells the browser &quot;this is an
          HTML document; use modern parsing rules.&quot; Without it, browsers fall into
          &quot;quirks mode&quot; — a compatibility layer for 1999-era web pages — and your page may
          render unpredictably.
        </p>
      ),
      code: `<!DOCTYPE html>`,
      language: "html",
    },
    {
      title: "Give the document a language and a root",
      description: (
        <p>
          All content must live inside a root <code>&lt;html&gt;</code> element. The <code>lang</code>{" "}
          attribute tells screen readers and translation tools which language to expect.
          Without <code>lang=&quot;en&quot;</code>, a screen reader may mispronounce every word by guessing
          the wrong language from the operating system locale.
        </p>
      ),
      code: `<!DOCTYPE html>
<html lang="en">

</html>`,
      language: "html",
    },
    {
      title: "Add a head: title and character encoding",
      description: (
        <p>
          The <code>&lt;head&gt;</code> block carries metadata — information <em>about</em> the
          document rather than the content of it. Two entries matter immediately:{" "}
          <code>&lt;meta charset=&quot;utf-8&quot;&gt;</code> ensures that accents, quotes, and non-ASCII
          characters display correctly instead of turning into garbled symbols.{" "}
          <code>&lt;title&gt;</code> sets the browser-tab label and becomes the headline in search
          results — it is not a heading that appears on the page.
        </p>
      ),
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Taproot — a small blog about the web</title>
</head>
</html>`,
      language: "html",
    },
    {
      title: "Add a body: headings and paragraphs",
      description: (
        <p>
          The <code>&lt;body&gt;</code> contains everything the browser shows. Use{" "}
          <code>&lt;h1&gt;</code> for the main heading of the page — there should be exactly one.
          Use <code>&lt;p&gt;</code> for paragraphs. The browser renders these with visual
          hierarchy by default: <code>&lt;h1&gt;</code> is big and bold;{" "}
          <code>&lt;p&gt;</code> has margin above and below so paragraphs breathe. You have not
          written any CSS. The browser supplied those defaults.
        </p>
      ),
      code: `<body>
  <h1>Taproot — a small blog about the web</h1>
  <p>A small blog by Alice and Bob about the web platform.</p>
</body>`,
      language: "html",
    },
    {
      title: "Add an anchor: a working link",
      description: (
        <p>
          A plain URL written as text in a <code>.txt</code> file does nothing when tapped on a
          phone. Wrapping it in <code>&lt;a href=&quot;...&quot;&gt;</code> turns it into a real hyperlink.
          The <code>href</code> attribute holds the destination. The text between the opening and
          closing tags is what the user sees and clicks. This is the mechanism that makes the web a
          web — documents linked to other documents.
        </p>
      ),
      code: `<a href="posts/hello-world.html">Hello, world</a>`,
      language: "html",
    },
    {
      title: "The finished page: examples/taproot-blog/static/index.html",
      description: (
        <p>
          Putting all the pieces together produces a working page. Every post title is a link. The
          page has a <code>&lt;title&gt;</code> for the tab, a charset declaration so text renders
          correctly, and a heading hierarchy that a screen reader can follow. No CSS, no JavaScript
          — and it already works on every device that has a browser.
        </p>
      ),
      code: `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Taproot — a small blog about the web</title>
  <meta name="description" content="A small blog by Alice and Bob about the web platform.">
  <link rel="stylesheet" href="assets/styles.css">
</head>
<body>
  <header>
    <a href="/" class="brand">Taproot</a>
    <nav><a href="/about.html">About</a></nav>
  </header>
  <main>
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
    <article class="post-card">
      <h2><a href="posts/why-rsc.html">Why server components, in 500 words</a></h2>
      <p class="meta">By Alice — 2026-05-02 — 5 min read</p>
      <p class="excerpt">RSC is not magic. It is a deal: some of your tree runs on the server and never ships JS.</p>
    </article>
  </main>
  <footer><p>Taproot — a small blog by Alice and Bob.</p></footer>
</body>
</html>`,
      language: "html",
    },
  ];

  const playgroundHtml = `<!-- Try this: change <h1> to <h2> and watch the document outline shift -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>My First Page</title>
</head>
<body>
  <h1>Hello from HTML</h1>
  <p>This is a paragraph. The browser gave it spacing automatically.</p>
  <p>This is a second paragraph. Notice the gap between them.</p>
  <a href="https://example.com">This is a real link</a>
</body>
</html>`;

  const gotchaItems = [
    {
      title: "The browser silently fixes broken HTML",
      body: (
        <>
          Write <code>&lt;p&gt;Hello</code> with no closing tag. The browser will display it
          correctly anyway. This masks real bugs: by the time you notice strange layout behaviour,
          the underlying HTML error may be five elements away from where things went wrong. Always
          close your tags deliberately; do not rely on the browser&apos;s repair logic.
        </>
      ),
    },
    {
      title: "<title> is the tab label, not a heading",
      body: (
        <>
          <code>&lt;title&gt;</code> appears in the browser tab, in search-engine result snippets,
          and in the social-media preview card when someone shares your URL. It does not appear
          anywhere on the visible page. A common mistake is to set <code>&lt;title&gt;</code> to
          the site name and then skip <code>&lt;h1&gt;</code> — or to set them identically when
          the page title and the document heading convey different information.
        </>
      ),
    },
    {
      title: "An anchor with no href looks like a link but is not one",
      body: (
        <>
          <code>&lt;a&gt;Click me&lt;/a&gt;</code> with no <code>href</code> renders with the
          default cursor and no underline. It is not focusable by keyboard and is not announced
          as a link by screen readers. If JavaScript handles the click, use a{" "}
          <code>&lt;button&gt;</code> — that is what a button is for. Reserve{" "}
          <code>&lt;a href&gt;</code> for navigations.
        </>
      ),
    },
    {
      title: "<!DOCTYPE html> must be the very first line",
      body: (
        <>
          If anything appears before <code>&lt;!DOCTYPE html&gt;</code> — even a blank line or a
          byte-order mark — some browsers trigger quirks mode. In quirks mode, the box model
          behaves differently and several CSS properties change meaning. The symptom often shows up
          as a mysterious 4px gap or an unexpected scrollbar that disappears the moment you move
          the doctype to line 1.
        </>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl font-bold">The Smallest Useful Thing on the Web</h1>
        <RoadmapLink url="https://roadmap.sh/frontend" />
      </div>

      {/* Section 1: Hook */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            You write a blog post and save it as <code>post.txt</code>. On your laptop it opens
            fine: the text is there, the URL at the bottom is visible. You email the file to a
            friend on a phone. They open it and the font is 6px — the entire post is one unbroken
            wall of grey characters. The URL at the bottom is just text; tapping it does nothing.
            There is no title for the browser tab. There are no headings to skim. There is no way
            to get back to the homepage.
          </p>
          <p className="text-slate-700 dark:text-slate-300">
            The words are all there, but the document is unusable. The content survived the move;
            the <em>structure</em> did not — because a <code>.txt</code> file carries no structure.
            What would have to be true for that structure to travel with the words?
          </p>
        </CardContent>
      </Card>

      {/* Section 2: Mental model */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            Every device with a browser can display your document — as long as the document is in a
            format the browser understands. The browser&apos;s job is to take that format and turn
            it into pixels. <em>HTML</em> is that format: a markup language whose tags describe
            the structure and meaning of content.
          </p>
          <blockquote className="border-l-4 border-blue-500 pl-4 italic text-slate-600 dark:text-slate-400">
            A browser is a document renderer; HTML is the document format it understands.
          </blockquote>
        </CardContent>
      </Card>

      {/* Optional: Code comparison (.txt vs HTML) */}
      <CodeComparison
        title="The same content — with and without structure"
        description="A .txt file and an HTML file can hold identical words. Only one of them tells the browser what role each word plays."
        oldCode={{
          title: "post.txt",
          code: txtContent,
          language: "text",
          cons: [
            "No clickable links",
            "No heading hierarchy for screen readers or search engines",
            "Font size is whatever the OS default is — often unreadable on mobile",
            "No browser-tab title",
          ],
        }}
        newCode={{
          title: "post.html",
          code: htmlContent,
          language: "html",
          pros: [
            "Links are tappable on every device",
            "Heading tags create a document outline screen readers can navigate",
            "Browser applies legible default styles",
            "Tab title set by <title>",
          ],
        }}
      />

      {/* Section 3: Step-by-step */}
      <h2 className="text-xl font-semibold mb-3">Building the document, one decision at a time</h2>
      <StepByStepExplanation
        title="From a .txt file to a working HTML page"
        description="Each step adds the minimum necessary to fix one concrete failure from the previous step."
        steps={txtToHtmlSteps}
      />

      {/* Section 4: Playground */}
      <h2 className="text-xl font-semibold mb-3">Try it yourself</h2>
      <HTMLPlayground
        html={playgroundHtml}
        title="Live HTML editor"
        description="Edit the HTML on the left. The browser renders it on the right in real time."
      />

      {/* Section 5: Challenges */}
      <h2 className="text-xl font-semibold mb-3">Challenges</h2>

      <Challenge
        title="What does HTML add?"
        question={`You have a recipe as a plain .txt file:\n\nChocolate Chip Cookies\n\nIngredients: 200g butter, 200g sugar, 2 eggs, 300g flour, 200g chocolate chips\n\nMix butter and sugar. Add eggs. Fold in flour and chips. Bake at 180C for 12 minutes.\n\nFor variations, see: taprootbakery.com/cookies\n\nWhich three things can HTML add that the .txt file cannot provide?`}
        options={[
          {
            id: "a",
            text: "A clickable hyperlink, a browser-tab title, and a heading the browser treats as the main topic",
          },
          {
            id: "b",
            text: "A different font, animated transitions, and a dark-mode toggle",
          },
          {
            id: "c",
            text: "A database connection, server-side logic, and user authentication",
          },
          {
            id: "d",
            text: "Compressed file size, offline caching, and push notifications",
          },
        ]}
        correctAnswerId="a"
        explanation={
          <p>
            HTML&apos;s job at this stage is structure and meaning, not appearance. A{" "}
            <code>&lt;a href&gt;</code> makes a real link; <code>&lt;title&gt;</code> names the tab
            and the search snippet; <code>&lt;h1&gt;</code> marks the primary heading so the
            browser, screen readers, and search engines know the document&apos;s main topic. Fonts,
            animations, and dark mode belong to CSS (the next module). Databases and auth belong to
            a server. Caching belongs to service workers.
          </p>
        }
      />

      <Challenge
        title="Find the missing closing tag"
        question={`A teammate commits this HTML. The page renders strangely — everything after the heading appears inside the link. What is wrong?\n\n<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="utf-8">\n  <title>Taproot</title>\n</head>\n<body>\n  <h1>Welcome to Taproot</h1>\n  <a href="posts/hello-world.html">Hello, world\n  <p>By Alice — 2026-04-01</p>\n  <p>Why we started this blog.</p>\n</body>\n</html>`}
        options={[
          {
            id: "a",
            text: 'The <a> tag is never closed. Everything after "Hello, world" is inside the link.',
          },
          {
            id: "b",
            text: "The <h1> tag is missing its closing tag, so the heading absorbs the paragraphs.",
          },
          {
            id: "c",
            text: "The <body> tag needs a closing slash: <body />.",
          },
          {
            id: "d",
            text: "The <meta charset> must come after <title>, not before.",
          },
        ]}
        correctAnswerId="a"
        explanation={
          <p>
            The <code>&lt;a&gt;</code> tag on line 9 is opened but never closed. HTML parsers treat
            all following content as children of that anchor until they encounter a{" "}
            <code>&lt;/a&gt;</code> or a tag that cannot legally be a child of <code>&lt;a&gt;</code>.
            The browser&apos;s repair logic will try to fix this, but the repair is unpredictable
            — different browsers may produce different DOM structures. The fix is to add{" "}
            <code>&lt;/a&gt;</code> immediately after &quot;Hello, world&quot;.
          </p>
        }
      />

      {/* Section 6: GotchaList */}
      <h2 className="text-xl font-semibold mb-3">Things that surprise people</h2>
      <GotchaList items={gotchaItems} />

      {/* Section 7: KeyTakeaways */}
      <KeyTakeaways
        mentalModel="A browser is a document renderer; HTML is the document format it understands."
        points={[
          <>
            A <code>.txt</code> file carries words; an HTML file carries words <em>plus structure</em>.
            Structure is what makes the document usable on any device with a browser.
          </>,
          <>
            Every HTML document needs four things to be correct: a <code>&lt;!DOCTYPE html&gt;</code>{" "}
            declaration, an <code>&lt;html lang&gt;</code> root, a <code>&lt;head&gt;</code> with{" "}
            <code>&lt;meta charset&gt;</code> and <code>&lt;title&gt;</code>, and a{" "}
            <code>&lt;body&gt;</code> with the visible content.
          </>,
          <>
            <code>&lt;a href=&quot;...&quot;&gt;</code> is the mechanism that makes the web a web. A URL
            typed as plain text is invisible to the browser; wrapped in an anchor tag, it becomes a
            navigable link on every device.
          </>,
          <>
            The browser supplies default styles for headings, paragraphs, and links. You did not
            write any CSS and the page already has visual hierarchy. CSS (module 1-3) is where you
            override or extend those defaults — it is not required for the document to be usable.
          </>,
          <>
            HTML describes <em>meaning</em>, not appearance. <code>&lt;h1&gt;</code> means
            &quot;primary heading&quot; — the visual size is a consequence, not the definition.
            This distinction matters more in the next module.
          </>,
        ]}
      />
    </div>
  );
}
