"use client";

import { Card, CardContent } from "@/components/ui/card";
import { StepByStepExplanation } from "@/components/StepByStepExplanation";
import { HTMLPlayground } from "@/components/CodePlayground";
import { Challenge } from "@/components/Challenge";
import { GotchaList } from "@/components/GotchaList";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { RoadmapLink } from "@/components/RoadmapLink";
import { EventLoopVisualizer } from "@/components/EventLoopVisualizer";

export function Module_2_1_Content() {
  // Data blocks hoisted out of JSX for readability — listed in render order.

  const domAndEventsSteps = [
    {
      title: "The page from module 1-3: HTML is what you wrote; the DOM is what the browser built",
      description: (
        <p>
          After module 1-3 the blog has structure, style, and a working stylesheet.
          But the source file on disk — <code>posts/hello-world.html</code> — is inert text.
          When the browser loads it, the browser <em>parses</em> that text and builds an
          internal tree of objects in memory. That tree is the <em>DOM</em>:{" "}
          <strong>Document Object Model</strong>. It is not the HTML file.
          Open DevTools and edit a node: the page changes instantly. Close the tab and reopen —
          the file on disk is unchanged. The DOM exists only while the browser holds the page in
          memory. Every node in the tree is a live JavaScript object with properties you can read
          and mutate. This distinction — HTML is the source, the DOM is the runtime — is the
          foundation of everything in this module.
        </p>
      ),
      code: `<!-- What you wrote (the file on disk) -->
<article class="post-detail">
  <h1>Hello, world</h1>
  <p class="meta">By Alice — 2026-04-01</p>
</article>

<!-- What the browser built (the DOM — in memory, not on disk)
     [document]
       └─ [html]
            ├─ [head] ...
            └─ [body]
                 └─ [article.post-detail]
                      ├─ [h1] "Hello, world"
                      └─ [p.meta] "By Alice — 2026-04-01"

     Open DevTools > Elements, double-click "Hello, world",
     type something new — the screen updates immediately.
     Reload — the file on disk is unchanged. -->`,
      language: "html",
    },
    {
      title: "Add a <script>: code that runs when the page loads",
      description: (
        <p>
          A <code>&lt;script&gt;</code> tag tells the browser to parse and execute JavaScript.
          Place it at the bottom of <code>&lt;body&gt;</code> — just before{" "}
          <code>&lt;/body&gt;</code> — so the HTML above it has already been parsed into the DOM
          before your code runs. The simplest script just logs a message:{" "}
          <code>console.log(&quot;hello&quot;)</code> appears in the DevTools console the moment
          the page loads. That is not very useful by itself. What you actually need is code that
          waits for something to happen — specifically, for the user to click a button. JavaScript
          has a name for &quot;waiting for something to happen&quot;: an <em>event</em>.
        </p>
      ),
      code: `<!-- posts/hello-world.html (bottom of <body>) -->
<script src="../assets/comments.js"></script>
</body>
</html>

/* assets/comments.js */
console.log("page loaded — script is running");
// This runs once, immediately.
// Not very useful — we need to react to the *user*, not the load.`,
      language: "html",
    },
    {
      title: "Querying the DOM: getting a reference to a node",
      description: (
        <p>
          <code>document.querySelector(selector)</code> searches the live DOM tree and returns the
          first matching node — or <code>null</code> if none exists. The result is a JavaScript
          object: a <em>reference</em> to the DOM node, not a copy of it. This is the primitive/
          reference distinction in practice. A primitive like <code>42</code> or{" "}
          <code>&quot;hello&quot;</code> is a value; touching it does not affect anything else.
          A reference points to an object that lives somewhere in memory. When you mutate a
          property on that object — <code>node.hidden = true</code> — you are mutating the live
          DOM, and the screen changes. Declare the variable with <code>const</code> when you will
          not reassign it; use <code>let</code> when you will. In practice, DOM references are
          almost always <code>const</code>.
        </p>
      ),
      code: `// assets/comments.js

const toggleBtn = document.querySelector(".js-toggle-comments");
const commentsSection = document.querySelector(".js-comments");

// toggleBtn is a *reference* to the DOM node.
// Mutating toggleBtn.textContent changes the visible button label.
// Mutating a primitive would only change a local copy.

// const vs let:
//   const toggleBtn — you won't reassign the variable itself
//   let count = 0   — you will reassign (count = count + 1)

console.log(toggleBtn); // <button class="js-toggle-comments">...</button>
console.log(commentsSection); // <section class="js-comments">...</section>`,
      language: "javascript",
    },
    {
      title: "Listening for events: functions as values",
      description: (
        <p>
          <code>addEventListener(type, handler)</code> registers a function that the browser
          will call every time the named event fires on that node. The handler is a function
          passed as a value — in JavaScript, functions are first-class values just like numbers
          or strings. The handler forms a <em>closure</em> over the surrounding scope: it can
          read and write variables declared outside it. When the user clicks the button, the
          browser pushes a click <em>event</em> into the macrotask queue; the event loop picks it
          up once the call stack is empty and calls the handler. The handler was not called when
          you wrote <code>addEventListener</code> — it is called later, by the browser, in response
          to user input.
        </p>
      ),
      code: `// The handler is a function value — passed, not called
toggleBtn.addEventListener("click", function handleToggle(event) {
  // This body runs only when the user clicks the button.
  // 'event' is the Event object the browser passes in.

  // Closure: handleToggle can see toggleBtn and commentsSection
  // because they are declared in the same outer scope.
  console.log("button clicked", event.target);
});

// At this line, nothing has happened yet.
// addEventListener stores a reference to handleToggle;
// the browser will call it when a click fires.`,
      language: "javascript",
    },
    {
      title: "Mutating the DOM: classes vs inline styles",
      description: (
        <p>
          The most important mutation is toggling visibility. Two approaches: set{" "}
          <code>node.hidden = true</code> (an inline <code>hidden</code> attribute) or call{" "}
          <code>node.classList.toggle(&quot;is-open&quot;)</code> (a class name). Inline style
          mutation is a one-off override — the CSS has no awareness of it. Class mutation is
          <em>declarative</em>: you write a CSS rule for <code>.is-open</code> once, and JavaScript
          just flips the class name on or off. The <em>DOM is live</em> — the instant you change
          a property, the browser re-renders only the affected part of the page. No reload, no
          round-trip to a server: the same in-memory tree updates and the screen reflects it
          immediately.
        </p>
      ),
      code: `toggleBtn.addEventListener("click", function handleToggle() {
  // Option A: inline hidden attribute
  // commentsSection.hidden = !commentsSection.hidden;
  // Fine for on/off, but CSS can't style a "loading" state with this.

  // Option B: CSS class — more flexible
  commentsSection.classList.toggle("is-open");

  // The matching CSS rule:
  // .js-comments            { display: none; }
  // .js-comments.is-open    { display: block; }
  //
  // Want a "loading" state? Add another rule:
  // .js-comments.is-loading { display: block; opacity: 0.4; }
  // JavaScript just sets the class; CSS handles the appearance.
});`,
      language: "javascript",
    },
    {
      title: "Event delegation: one listener for many buttons",
      description: (
        <p>
          The blog index page lists multiple posts, each with its own &quot;Show comments&quot;
          button. Querying all of them with <code>querySelectorAll</code> and attaching a listener
          to each is slow and — more importantly — <em>brittle</em>: buttons added to the page
          later (e.g. loaded via <code>fetch</code>) will not have a listener. The fix is{" "}
          <em>delegation</em>: attach one listener on a stable ancestor (like{" "}
          <code>&lt;main&gt;</code>) and let events <em>bubble</em> up to it. Inside the handler,
          <code>event.target.closest(&quot;.js-toggle-comments&quot;)</code> finds the button that
          was actually clicked, regardless of when it was added to the DOM.
        </p>
      ),
      code: `// Without delegation: fragile, misses dynamically added buttons
document.querySelectorAll(".js-toggle-comments").forEach((btn) => {
  btn.addEventListener("click", handleToggle); // only buttons that exist *right now*
});

// With delegation: one listener on <main>, works for all buttons past and future
const mainEl = document.querySelector("main");
mainEl.addEventListener("click", function (event) {
  const btn = event.target.closest(".js-toggle-comments");
  if (!btn) return; // click was somewhere else in <main>

  const postCard = btn.closest(".post-card");
  const section = postCard.querySelector(".js-comments");
  section.classList.toggle("is-open");
});`,
      language: "javascript",
    },
    {
      title: "The finished script — with a deliberate state-vs-DOM bug",
      description: (
        <p>
          Here is the complete <code>assets/comments.js</code> that wires the toggle on the post
          detail page. It works — mostly. Look at <code>commentCount</code>: it is initialized
          once from <code>data-count</code> on the comments section, but the rendered count in the
          DOM can change (e.g. a new comment arrives and the server re-renders the count). The
          JavaScript variable and the DOM are now out of sync. The page <em>looks</em> correct
          after the first interaction, but a careful code reader can spot the divergence. This
          gap — JavaScript state living separately from the DOM — is the seed of the problem
          that module 4-1 will make explicit.
        </p>
      ),
      code: `// assets/comments.js
// Vanilla JS toggle for posts/hello-world.html

const toggleBtn = document.querySelector(".js-toggle-comments");
const commentsSection = document.querySelector(".js-comments");

// Read the initial comment count from the DOM attribute.
// NOTE: state-vs-DOM divergence — see module 4-1
// If the server later updates the DOM (e.g. via a partial re-render
// or a WebSocket push that updates data-count on the element),
// this JS variable will be stale. The count shown in the UI and
// the count in 'commentCount' will disagree.
let commentCount = parseInt(commentsSection?.dataset.count ?? "0", 10);

if (toggleBtn && commentsSection) {
  toggleBtn.addEventListener("click", function handleToggle() {
    const isOpen = commentsSection.classList.toggle("is-open");
    toggleBtn.textContent = isOpen ? "Hide comments" : "Show comments";

    // Bug: we read the JS variable, not the live DOM attribute.
    // If data-count was updated externally, these two will differ.
    if (isOpen) {
      console.log("commentCount from JS variable:", commentCount);
      console.log("commentCount from DOM attribute:",
        commentsSection.dataset.count); // may differ after external update
    }
  });
}`,
      language: "javascript",
    },
  ];

  const playgroundHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Taproot — Hello, world</title>
  <style>
    body { margin: 0; font: 16px/1.6 system-ui, sans-serif;
           background: #fafafa; color: #1a1a1a; padding: 1rem; }
    header { display: flex; justify-content: space-between;
             align-items: center; border-bottom: 1px solid #e5e5e5;
             padding-bottom: 1rem; margin-bottom: 1.5rem; }
    header a { font-weight: 700; text-decoration: none; color: #1a1a1a; }
    article.post-detail h1 { margin-bottom: .25rem; }
    article.post-detail .meta { color: #666; font-size: .9rem; margin-bottom: 1.5rem; }
    article.post-detail p { margin: 1em 0; }
    button.js-toggle-comments {
      margin-top: 1.5rem; padding: .5rem 1rem; cursor: pointer;
      background: #5b21b6; color: white; border: none; border-radius: .375rem;
      font-size: .9rem;
    }
    section.js-comments { display: none; margin-top: 1rem;
                          border-top: 1px solid #e5e5e5; padding-top: 1rem; }
    section.js-comments.is-open { display: block; }
    .comment { padding: .75rem 0; border-bottom: 1px solid #e5e5e5; }
    .comment:last-child { border-bottom: none; }
    .comment .author { font-weight: 600; font-size: .9rem; }
    .comment .body { color: #444; font-size: .9rem; }
  </style>
</head>
<body>
  <header>
    <a href="/">Taproot</a>
  </header>
  <main>
    <article class="post-detail">
      <h1>Hello, world</h1>
      <p class="meta">By Alice &mdash; 2026-04-01 &mdash; 4 min read</p>
      <p>Why we started this blog and what you can expect from it over the coming months.</p>
      <p>We believe the web platform is worth understanding from the bottom up.</p>
      <button class="js-toggle-comments" type="button">Show comments</button>
      <section class="js-comments" data-count="2">
        <div class="comment">
          <p class="author">Bob</p>
          <p class="body">Great first post. Looking forward to the CSS one.</p>
        </div>
        <div class="comment">
          <p class="author">Carol</p>
          <p class="body">The bottom-up framing is exactly what I needed.</p>
        </div>
      </section>
    </article>
  </main>
</body>
</html>`;

  const playgroundJs = `// Try this: change addEventListener to onclick and see what breaks
// when you add a second button dynamically after the fact.
//
// Try this: change classList.toggle to node.hidden = !node.hidden
// and observe that CSS can no longer style a "loading" state.

const toggleBtn = document.querySelector(".js-toggle-comments");
const commentsSection = document.querySelector(".js-comments");

// NOTE: state-vs-DOM divergence — see module 4-1
let commentCount = parseInt(commentsSection?.dataset.count ?? "0", 10);

if (toggleBtn && commentsSection) {
  toggleBtn.addEventListener("click", function handleToggle() {
    const isOpen = commentsSection.classList.toggle("is-open");
    toggleBtn.textContent = isOpen ? "Hide comments" : "Show comments";
    console.log(
      "JS variable:", commentCount,
      "| DOM attribute:", commentsSection.dataset.count
    );
  });
}`;

  const playgroundCss = `/* Styles are already in the HTML <style> block above.
   This file is intentionally empty — the playground merges both. */`;

  const eventLoopFrames = [
    {
      description: "Page has loaded. Call stack is empty. User click is pending in the queue.",
      callStack: [],
      macrotaskQueue: ["click event (button)"],
      microtaskQueue: [],
      consoleLog: [],
    },
    {
      description: "Event loop picks up the click macrotask and pushes handleToggle onto the stack.",
      callStack: ["handleToggle()"],
      macrotaskQueue: [],
      microtaskQueue: [],
      consoleLog: [],
    },
    {
      description: "classList.toggle runs synchronously — the DOM updates, the screen re-renders.",
      callStack: ["classList.toggle()", "handleToggle()"],
      macrotaskQueue: [],
      microtaskQueue: [],
      consoleLog: [],
    },
    {
      description: "classList.toggle returns. handleToggle updates textContent and finishes.",
      callStack: ["handleToggle()"],
      macrotaskQueue: [],
      microtaskQueue: [],
      consoleLog: [],
    },
    {
      description: "handleToggle returns. Call stack is empty. Browser is ready for the next event.",
      callStack: [],
      macrotaskQueue: [],
      microtaskQueue: [],
      consoleLog: ["classList toggled: is-open added"],
    },
  ];

  const gotchaItems = [
    {
      title: "addEventListener on the same node with the same handler runs twice — listeners stack",
      body: (
        <>
          Calling <code>btn.addEventListener(&quot;click&quot;, handleToggle)</code> twice
          registers two listeners, not one. The handler fires twice per click. Only{" "}
          <code>removeEventListener</code> with the <em>exact same function reference</em> removes
          it — an inline arrow function like <code>() =&gt; ...</code> creates a new reference
          each call, so <code>removeEventListener</code> cannot find it. Store the handler in a
          variable when you need to remove it later.
        </>
      ),
    },
    {
      title: "event.target is what the user clicked; event.currentTarget is where the listener lives",
      body: (
        <>
          In an event delegation setup, the listener is on <code>&lt;main&gt;</code> but the user
          clicks a <code>&lt;span&gt;</code> inside the button.{" "}
          <code>event.target</code> is that inner <code>&lt;span&gt;</code>;{" "}
          <code>event.currentTarget</code> is <code>&lt;main&gt;</code>. That is why delegation
          uses <code>event.target.closest(&quot;.js-toggle-comments&quot;)</code> — it walks up
          the DOM from whatever was actually clicked to find the nearest matching ancestor.
          Checking <code>event.target</code> directly breaks the moment the button contains
          any child element.
        </>
      ),
    },
    {
      title: "this inside an arrow function is not the element — it is the surrounding scope",
      body: (
        <>
          <code>btn.addEventListener(&quot;click&quot;, function() &#123; console.log(this); &#125;)</code>{" "}
          logs the button element. <code>btn.addEventListener(&quot;click&quot;, () =&gt; &#123; console.log(this); &#125;)</code>{" "}
          logs whatever <code>this</code> is in the outer scope — often <code>undefined</code> in
          strict mode or the <code>window</code> object. Arrow functions do not have their own{" "}
          <code>this</code>. Use a regular <code>function</code> declaration when you need{" "}
          <code>this</code> to be the element; use an arrow function when you need the outer{" "}
          <code>this</code>.
        </>
      ),
    },
    {
      title: "Replacing node content with a string destroys all child listeners",
      body: (
        <>
          Assigning a string to a node&apos;s content property destroys all existing DOM children
          and replaces them with new ones. Any listeners attached to those children are gone.
          The replacement nodes are brand new objects with no listeners. Use{" "}
          <code>node.textContent = &quot;...&quot;</code> to update text safely, or{" "}
          <code>node.append(newElement)</code> to add a node without destroying existing
          children and their listeners.
        </>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-3xl font-bold">When the Page Has to React</h1>
        <RoadmapLink url="https://roadmap.sh/frontend" />
      </div>

      {/* Section 1: Hook */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            The blog from module 1-3 is beautiful: styled, readable, accessible. A reader opens a
            post and sees the comments section — or rather, does not see it. The designer wanted a
            &quot;Show comments&quot; button that toggles the section open and closed. Here is the
            first attempt using only HTML:
          </p>
          <div className="bg-slate-100 dark:bg-slate-800 rounded p-4 font-mono text-sm mb-4 overflow-x-auto leading-relaxed text-slate-700 dark:text-slate-300">
            <span className="text-blue-600 dark:text-blue-400">&lt;details&gt;</span>
            <br />
            <span className="pl-4 text-blue-600 dark:text-blue-400">&lt;summary&gt;</span>
            <span>Show comments (2)</span>
            <span className="text-blue-600 dark:text-blue-400">&lt;/summary&gt;</span>
            <br />
            <span className="pl-4 text-slate-500">...comment list...</span>
            <br />
            <span className="text-blue-600 dark:text-blue-400">&lt;/details&gt;</span>
          </div>
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            It toggles. Ship it? Not quite. The designer adds a requirement: when the user opens
            the section, load comments from the server — do not embed them in the initial HTML.
            The comment count badge needs to update when a new comment arrives. And when the user
            is waiting for comments to load, show a spinner. That is three states: closed, loading,
            open. The <code>&lt;details&gt;</code> element has two: open or closed. There is no
            attribute for &quot;loading,&quot; no way to run code when the user opens it, no way
            to update the count from outside the element. CSS <code>:checked</code> hacks — using
            a hidden <code>&lt;input type=&quot;checkbox&quot;&gt;</code> to simulate a toggle —
            hit the same wall the moment a third state appears.
          </p>
          <p className="text-slate-700 dark:text-slate-300">
            HTML is a declarative language: you describe what should exist. But the requirement
            here is procedural: &quot;when the user does X, do Y, then wait for Z, then do W.&quot;
            What would have to be added to the page so it can <em>react</em> to a click?
          </p>
        </CardContent>
      </Card>

      {/* Section 2: Mental model */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            When the browser loads an HTML file it does not simply display the text — it parses
            the markup into a tree of live JavaScript objects that it keeps in memory. That tree is
            called the <em>DOM</em>. Every node in the tree is an object. Every object has
            properties you can read and mutate. When you mutate a property, the browser immediately
            re-renders the affected portion of the page. JavaScript is in the browser because it
            is the only language that can talk to that live tree.
          </p>
          <blockquote className="border-l-4 border-blue-500 pl-4 italic text-slate-600 dark:text-slate-400">
            The DOM is a live tree the browser exposes for mutation.
          </blockquote>
        </CardContent>
      </Card>

      {/* Section 3: Step-by-step */}
      <h2 className="text-xl font-semibold mb-3">From a static post to an interactive toggle</h2>
      <StepByStepExplanation
        title="Deriving events, listeners, and the DOM from the problem they solve"
        description="Each step adds the minimum mechanism needed to satisfy one requirement the previous step could not handle."
        steps={domAndEventsSteps}
      />

      {/* Optional: event loop visualizer (introductory) */}
      <EventLoopVisualizer
        title="What happens when a user clicks a button"
        code={`toggleBtn.addEventListener("click", handleToggle);\n// ... user clicks ...\n// browser queues the event, event loop runs handleToggle`}
        frames={eventLoopFrames}
      />

      {/* Section 4: Playground */}
      <h2 className="text-xl font-semibold mb-3">Try it yourself</h2>
      <HTMLPlayground
        html={playgroundHtml}
        js={playgroundJs}
        css={playgroundCss}
        title="Live editor — Taproot post page with JS toggle"
        description="The HTML and JS panes together show the full post page. Edit the JS to experiment with the toggle, event delegation, and the state-vs-DOM divergence."
      />

      {/* Section 5: Challenges */}
      <h2 className="text-xl font-semibold mb-3">Challenges</h2>

      <Challenge
        title="Buttons that arrive late"
        question={`The blog index page renders post cards dynamically: a fetch() call returns JSON and your code appends new <article> cards to <main>. Each card has a "Show comments" button. You wired them like this:\n\ndocument.querySelectorAll(".js-toggle-comments").forEach((btn) => {\n  btn.addEventListener("click", handleToggle);\n});\n\nUsers report that buttons on the first batch of posts work, but buttons on later-loaded posts do nothing. What is the cause, and what is the fix?`}
        options={[
          {
            id: "a",
            text: "querySelectorAll runs once at wire-up time and only finds buttons that exist in the DOM at that moment. Buttons added later have no listener. Fix: use event delegation — attach one listener to <main> and check event.target.closest('.js-toggle-comments') inside it.",
          },
          {
            id: "b",
            text: "addEventListener can only be called once per element. Calling it on the same button twice causes it to stop working. Fix: use onclick = handleToggle instead.",
          },
          {
            id: "c",
            text: "The dynamically added buttons have a different class name because the server returns different HTML. Fix: inspect the network response and update the selector.",
          },
          {
            id: "d",
            text: "fetch() is asynchronous, so the event listener setup runs before the fetch resolves. Fix: move the querySelectorAll call inside the fetch .then() callback.",
          },
        ]}
        correctAnswerId="a"
        explanation={
          <p>
            <code>querySelectorAll</code> is a snapshot: it returns the nodes that match at the
            moment it runs. Nodes added to the DOM afterward are invisible to it. Event{" "}
            <em>delegation</em> solves this by listening on a stable ancestor that already exists
            when the page loads. Events from any descendant — including those added later — bubble
            up to that ancestor. <code>event.target.closest(&apos;.js-toggle-comments&apos;)</code>{" "}
            identifies which button was clicked regardless of when it was inserted. This is the
            canonical pattern for dynamic content.
          </p>
        }
      />

      <Challenge
        title="The closure and the counter"
        question={`A developer writes this code to count how many times the user has clicked the toggle button:\n\nlet clickCount = 0;\n\nconst btn = document.querySelector(".js-toggle-comments");\nbtn.addEventListener("click", () => {\n  clickCount++;\n});\n\nconsole.log("clicks so far:", clickCount);\n\nWhat does the console.log print immediately after addEventListener is called, and why?`}
        options={[
          {
            id: "a",
            text: "It prints 0. The arrow function runs only when the button is clicked — not when addEventListener is called. clickCount has not been incremented yet.",
          },
          {
            id: "b",
            text: "It prints 1. addEventListener immediately fires the handler once to confirm the listener was registered.",
          },
          {
            id: "c",
            text: "It prints undefined. clickCount is captured by the closure at declaration time and becomes undefined inside the arrow function.",
          },
          {
            id: "d",
            text: "The code throws a ReferenceError because clickCount is declared with let and arrow functions cannot close over let variables.",
          },
        ]}
        correctAnswerId="a"
        explanation={
          <p>
            <code>addEventListener</code> stores a reference to the function and returns
            immediately — it does not call the function. The <code>console.log</code> on the next
            line runs before any click has occurred, so <code>clickCount</code> is still{" "}
            <code>0</code>. The arrow function forms a <em>closure</em> over{" "}
            <code>clickCount</code>: when a click eventually fires, the function can read and
            write <code>clickCount</code> from the surrounding scope. But at wire-up time, the
            function body has not executed at all.
          </p>
        }
      />

      {/* Section 6: GotchaList */}
      <h2 className="text-xl font-semibold mb-3">Things that surprise people</h2>
      <GotchaList items={gotchaItems} />

      {/* Section 7: KeyTakeaways */}
      <KeyTakeaways
        mentalModel="The DOM is a live tree the browser exposes for mutation."
        points={[
          <>
            The HTML file on disk and the <em>DOM</em> in memory are different things. The browser
            parses HTML into a tree of live JavaScript objects. Editing a node in DevTools changes
            the live DOM but not the file. Reloading discards the DOM and rebuilds it from the file.
          </>,
          <>
            <code>document.querySelector</code> returns a <em>reference</em> to a DOM node — not
            a copy. Mutating a property on that reference (e.g.{" "}
            <code>node.classList.toggle(&apos;is-open&apos;)</code>) mutates the live tree and
            the browser re-renders immediately. This is the mechanism of all browser interactivity.
          </>,
          <>
            A <em>listener</em> registered with <code>addEventListener</code> is a function stored
            by the browser. It forms a <em>closure</em> over the surrounding scope. The browser
            calls it only when the named event fires — not at registration time. This is why the
            event loop matters: synchronous code runs to completion before any event handler
            can execute.
          </>,
          <>
            <em>Event delegation</em> — one listener on a stable ancestor, checking{" "}
            <code>event.target.closest(selector)</code> — is the correct pattern for dynamic
            content. It is faster than attaching a listener to every element and it automatically
            covers nodes added to the DOM after the listener is registered.
          </>,
          <>
            Keeping JavaScript variables in sync with the DOM is harder than it looks. A variable
            initialized from <code>dataset.count</code> at page load can drift from the DOM value
            the moment anything else updates the DOM. This state-vs-DOM divergence is the core
            tension that component frameworks (module 4-1) exist to resolve.
          </>,
        ]}
      />
    </div>
  );
}
