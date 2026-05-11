"use client";

import { Card, CardContent } from "@/components/ui/card";
import { StepByStepExplanation } from "@/components/StepByStepExplanation";
import { HTMLPlayground } from "@/components/CodePlayground";
import { Challenge } from "@/components/Challenge";
import { GotchaList } from "@/components/GotchaList";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { RoadmapLink } from "@/components/RoadmapLink";
import { EventLoopVisualizer } from "@/components/EventLoopVisualizer";
import { CodeComparison } from "@/components/CodeComparison";

export function Module_2_2_Content() {
  // Data blocks hoisted out of JSX for readability — listed in render order.

  const asyncSteps = [
    {
      title: "The synchronous baseline — why it freezes",
      description: (
        <p>
          The page has a &quot;Show comments&quot; button. In module 2-1 the comments were already
          embedded in the HTML. Now imagine they live in a separate JSON file. The first instinct is
          to load them synchronously: read the file, parse the JSON, render the list. This is how{" "}
          <em>synchronous</em> code works — each line runs to completion before the next line starts.
          But JavaScript runs on a single thread. While that thread is blocked reading a file (or
          spinning on a timer, or doing any slow work), it cannot do anything else — not paint the
          screen, not respond to clicks, not run any other code. The browser&apos;s UI thread is the
          same thread. A 2-second block is a 2-second freeze. Every click the user makes during that
          freeze piles up in the queue and fires all at once the moment the thread is free.
        </p>
      ),
      code: `// assets/comments.js — the broken synchronous version
const toggleBtn = document.querySelector(".js-toggle-comments");

toggleBtn.addEventListener("click", function handleToggle() {
  // Simulate a slow operation (reading a file, parsing large JSON, etc.)
  // While this loop runs, the entire browser tab is frozen.
  const start = Date.now();
  while (Date.now() - start < 2000) {
    // do nothing — just waste time
  }

  // These comments were supposed to load from a file.
  // Instead, the page was unresponsive for 2 seconds.
  // Every click the user made during the freeze fires NOW.
  renderComments([{ author: "Bob", body: "Great post." }]);
});

// The user clicked 5 times impatiently.
// After 2 seconds: renderComments runs 5 times. The UI is a mess.`,
      language: "javascript",
    },
    {
      title: "Callbacks — deferring work without blocking",
      description: (
        <p>
          The first answer to &quot;don&apos;t block the thread&quot; was the <em>callback</em>: pass a
          function to an API, and that API will call your function later, after the slow work is done.
          The browser&apos;s{" "}
          <code>setTimeout(fn, delay)</code> is the simplest example. It returns immediately, letting
          the thread continue; the browser adds <code>fn</code> to the task queue after{" "}
          <code>delay</code> milliseconds. The thread is never blocked. This is the foundation of
          asynchronous JavaScript. But callbacks have a structural problem: sequential async work
          requires nesting callbacks inside callbacks. After three levels, the code reads right-to-left
          and the indentation alone makes it hard to follow. This is &quot;callback hell.&quot;
          Callbacks are not bad — DOM event listeners are callbacks — but they compose poorly for
          sequential steps.
        </p>
      ),
      code: `// Callback approach: not blocking, but hard to chain
function loadComments(postId, onDone, onError) {
  // Imagine this triggers a real file read.
  setTimeout(function () {
    const data = [{ author: "Bob", body: "Great post." }];
    onDone(data);
  }, 500);
}

function loadAuthors(comments, onDone, onError) {
  setTimeout(function () {
    const authors = comments.map((c) => ({ name: c.author, avatar: "/img/default.png" }));
    onDone(authors);
  }, 300);
}

// Sequential steps via nested callbacks — "callback hell"
loadComments("hello-world", function (comments) {
  loadAuthors(comments, function (authors) {
    // Another step would add another level of nesting.
    renderComments(comments, authors);
  }, handleError);
}, handleError);`,
      language: "javascript",
    },
    {
      title: "Promises — a handle for a value not here yet",
      description: (
        <p>
          A <em>Promise</em> is an object that represents the eventual result of an async operation.
          The function that starts the work returns the Promise immediately — a synchronous return, not
          a block. The Promise starts in the &quot;pending&quot; state. Later, the async work either{" "}
          <em>resolves</em> (success) or <em>rejects</em> (failure). You register what to do in each
          case with <code>.then(onSuccess)</code> and <code>.catch(onError)</code>. These methods also
          return Promises, so you can chain them: <code>.then(...).then(...).catch(...)</code>. The
          chain reads top-to-bottom, matching the logical order of the steps — none of the sideways
          nesting of callbacks.
        </p>
      ),
      code: `// Promise approach: flat chaining, top-to-bottom
function loadComments(postId) {
  return new Promise(function (resolve, reject) {
    // resolve() hands the value to the next .then()
    // reject() hands the error to the next .catch()
    setTimeout(function () {
      const data = [{ author: "Bob", body: "Great post." }];
      resolve(data);
    }, 500);
  });
}

loadComments("hello-world")
  .then(function (comments) {
    return loadAuthors(comments); // returns another Promise
  })
  .then(function (authors) {
    renderComments(authors);
  })
  .catch(function (err) {
    // Any rejection in the chain falls through to here.
    showError(err.message);
  });`,
      language: "javascript",
    },
    {
      title: "async/await — Promises with synchronous-looking syntax",
      description: (
        <p>
          <em>async</em>/<em>await</em> is syntax sugar over Promises. An{" "}
          <code>async function</code> always returns a Promise. Inside it, the{" "}
          <code>await</code> keyword <em>unwraps</em> a Promise: it suspends the async function until
          the Promise settles, then gives you the resolved value. The rest of the function
          schedules as a microtask continuation — the thread is never blocked. The result reads like
          synchronous code while running asynchronously. Error handling uses the familiar{" "}
          <code>try</code>/<code>catch</code> syntax, which catches both synchronous throws and
          rejected Promises.
        </p>
      ),
      code: `// async/await: same Promises, reads like synchronous code
async function showComments(postId) {
  try {
    // await unwraps the Promise — suspends THIS function, not the thread
    const comments = await loadComments(postId);
    const authors  = await loadAuthors(comments);
    renderComments(authors);
  } catch (err) {
    // Catches both synchronous throws and rejected Promises
    showError(err.message);
  }
}

// Call it — the return value is a Promise (all async functions return one)
showComments("hello-world");

// Lines after this call are NOT blocked — they run immediately.
console.log("this runs before showComments resolves");`,
      language: "javascript",
    },
    {
      title: "Error handling in async chains",
      description: (
        <p>
          A rejected Promise that has no handler becomes an <em>unhandled rejection</em>. The browser
          fires an <code>unhandledrejection</code> event and logs a warning — but the app does not
          crash. That makes it easy to miss. Always attach a <code>.catch()</code> to the end of a
          Promise chain, or wrap <code>await</code> calls in <code>try</code>/<code>catch</code>.
          When the resource does not exist — a JSON file that returns 404, or a network timeout — you
          want a visible error state, not a silent failure. The two forms are equivalent; use whichever
          fits the surrounding code style.
        </p>
      ),
      code: `// Form 1: .catch() on the chain
fetch("/assets/comments.json")
  .then((res) => {
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
    return res.json();
  })
  .then((data) => renderComments(data))
  .catch((err) => showError("Could not load comments: " + err.message));

// Form 2: try/catch around await (equivalent)
async function loadAndRender() {
  try {
    const res = await fetch("/assets/comments.json");
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
    const data = await res.json();
    renderComments(data);
  } catch (err) {
    showError("Could not load comments: " + err.message);
  }
}`,
      language: "javascript",
    },
    {
      title: "The event loop — macrotasks and microtasks",
      description: (
        <p>
          JavaScript&apos;s runtime has two queues beyond the call stack. <em>Macrotasks</em> (also
          called tasks) hold coarse-grained work: <code>setTimeout</code> callbacks,{" "}
          <code>setInterval</code> ticks, I/O completions, and user-input events. <em>Microtasks</em>{" "}
          hold fine-grained continuations: resolved Promise callbacks (<code>.then</code>,{" "}
          <code>await</code> resumptions), and <code>queueMicrotask</code>. The{" "}
          <em>event loop</em> contract is: run one macrotask; drain the entire microtask queue to
          empty; paint if needed; repeat. This means{" "}
          <code>Promise.resolve().then(...)</code> always runs before{" "}
          <code>setTimeout(..., 0)</code>, even though both are &quot;deferred.&quot; Every{" "}
          <code>await</code> is a microtask checkpoint: the function suspends, the microtask queue
          drains any other pending microtasks, and then the function resumes.
        </p>
      ),
      code: `console.log("1 — synchronous");

setTimeout(() => console.log("4 — macrotask (setTimeout)"), 0);

Promise.resolve()
  .then(() => console.log("2 — microtask (Promise.then)"))
  .then(() => console.log("3 — microtask (chained .then)"));

console.log("1b — still synchronous");

// Output order:
// 1 — synchronous
// 1b — still synchronous
// 2 — microtask (Promise.then)
// 3 — microtask (chained .then)
// 4 — macrotask (setTimeout)
//
// Rule: call stack empties -> microtasks drain -> next macrotask`,
      language: "javascript",
    },
    {
      title: "The finished async comments loader for the static blog",
      description: (
        <p>
          Here is the real <code>assets/comments.js</code> for the Taproot static blog. It loads
          comments from <code>/assets/comments.json</code> using <code>fetch</code>, shows a loading
          state while the request is in flight, renders the comments on success, and shows an error
          message on failure. Notice what is intentionally left unchanged: the{" "}
          <code>commentCount</code> variable is still initialized from the DOM attribute at load time.
          If the server later updates <code>data-count</code>, the JS variable will be stale. This
          module&apos;s job is to make the load async, not to fix that divergence — that is module 4-1.
        </p>
      ),
      code: `// assets/comments.js — async version for taproot-blog/static/
// Loads comments from /assets/comments.json with loading + error states.

const toggleBtn       = document.querySelector(".js-toggle-comments");
const commentsSection = document.querySelector(".js-comments");

// NOTE: state-vs-DOM divergence preserved from module 2-1 — see module 4-1.
// This variable is set once from the DOM attribute; if anything else updates
// the attribute later, this JS variable and the DOM will disagree.
let commentCount = parseInt(commentsSection?.dataset.count ?? "0", 10);

let commentsLoaded = false;

async function fetchComments() {
  // Show loading state before the network request starts
  commentsSection.classList.add("is-loading");
  commentsSection.textContent = "Loading comments...";

  try {
    // await suspends this function; the thread stays free for other work
    const res = await fetch("/assets/comments.json");
    if (!res.ok) throw new Error("HTTP " + res.status);

    // await again — still not blocking the thread
    const comments = await res.json();

    // Build the comment list and insert it
    commentsSection.textContent = "";
    comments.forEach(function (c) {
      const item = document.createElement("div");
      item.className = "comment";
      const author = document.createElement("p");
      author.className = "author";
      author.textContent = c.author;
      const body = document.createElement("p");
      body.className = "body";
      body.textContent = c.body;
      item.appendChild(author);
      item.appendChild(body);
      commentsSection.appendChild(item);
    });

    commentsLoaded = true;

    // NOTE: state-vs-DOM divergence — commentCount still reflects the
    // initial data-count attribute, not the newly loaded comments array length.
    console.log("JS commentCount:", commentCount, "| loaded:", comments.length);
  } catch (err) {
    commentsSection.textContent = "Could not load comments: " + err.message;
  } finally {
    commentsSection.classList.remove("is-loading");
  }
}

if (toggleBtn && commentsSection) {
  toggleBtn.addEventListener("click", async function handleToggle() {
    const isOpen = commentsSection.classList.toggle("is-open");
    toggleBtn.textContent = isOpen ? "Hide comments" : "Show comments";

    // Only fetch once — re-opening re-uses the rendered DOM
    if (isOpen && !commentsLoaded) {
      await fetchComments();
    }
  });
}`,
      language: "javascript",
    },
  ];

  const callbackHellCode = `// Loading comments, then authors, then rendering
// Three sequential steps -> three levels of nesting
loadComments("hello-world", function (comments) {
  loadAuthors(comments, function (authors) {
    loadAvatars(authors, function (avatars) {
      renderAll(comments, authors, avatars);
    }, function (err) { showError(err); });
  }, function (err) { showError(err); });
}, function (err) { showError(err); });

// Indentation grows with each step.
// Error handlers are repeated at every level.
// You cannot break this chain across functions easily.`;

  const asyncAwaitCode = `// Same three steps with async/await
async function loadAndRender(postId) {
  try {
    const comments = await loadComments(postId);
    const authors  = await loadAuthors(comments);
    const avatars  = await loadAvatars(authors);
    renderAll(comments, authors, avatars);
  } catch (err) {
    // One handler catches failures from any step.
    showError(err);
  }
}

loadAndRender("hello-world");

// Reads top-to-bottom like synchronous code.
// One try/catch covers the whole chain.
// Each step is a separate, readable line.`;

  const playgroundHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Event loop order demo</title>
  <style>
    body { margin: 0; font: 16px/1.6 system-ui, sans-serif;
           background: #fafafa; color: #1a1a1a; padding: 1.5rem; }
    button { padding: .5rem 1.2rem; margin-right: .5rem; margin-bottom: .5rem;
             cursor: pointer; background: #5b21b6; color: white;
             border: none; border-radius: .375rem; font-size: .9rem; }
    #log { background: #0f172a; color: #86efac; font-family: monospace;
           font-size: .85rem; padding: 1rem; border-radius: .375rem;
           min-height: 120px; white-space: pre-wrap; margin-top: 1rem; }
    .label { font-weight: 600; margin-bottom: .5rem; }
  </style>
</head>
<body>
  <p class="label">Click the button and watch the order of the log entries.</p>
  <button id="run">Run order demo</button>
  <button id="clear">Clear</button>
  <div id="log">Output will appear here...</div>
</body>
</html>`;

  const playgroundJs = `// Try this: swap the inner setTimeout for a Promise.resolve().then()
// and observe the order in which the logs appear.
//
// Current order: sync -> microtask -> macrotask
// Change setTimeout(..., 0) to Promise.resolve().then(...) and watch
// what happens to entry "4 — setTimeout(0)".

const log = document.getElementById("log");
const runBtn = document.getElementById("run");
const clearBtn = document.getElementById("clear");

function print(msg) {
  log.textContent += msg + "\\n";
}

runBtn.addEventListener("click", function () {
  log.textContent = "";

  print("1 — synchronous (runs immediately)");

  // Macrotask: scheduled after current task AND after all microtasks
  setTimeout(function () {
    print("4 — macrotask: setTimeout(0)");
  }, 0);

  // Microtask: runs after current synchronous code, before any macrotask
  Promise.resolve()
    .then(function () {
      print("2 — microtask: Promise.resolve().then(...)");
    })
    .then(function () {
      print("3 — microtask: chained .then(...)");
    });

  print("1b — still synchronous (same task, runs before microtasks)");
});

clearBtn.addEventListener("click", function () {
  log.textContent = "Output will appear here...";
});`;

  const playgroundCss = `/* Styles are in the HTML <style> block. */`;

  const eventLoopFrames = [
    {
      description: "Synchronous code starts. Call stack: script entry point.",
      callStack: ["script"],
      macrotaskQueue: [],
      microtaskQueue: [],
      consoleLog: ["1 — synchronous"],
    },
    {
      description: "setTimeout(fn, 0) is called. Callback queued as a macrotask.",
      callStack: ["setTimeout()", "script"],
      macrotaskQueue: ["setTimeout callback"],
      microtaskQueue: [],
      consoleLog: ["1 — synchronous"],
    },
    {
      description: "Promise.resolve().then(fn) is called. Callback queued as a microtask.",
      callStack: ["Promise.resolve().then()", "script"],
      macrotaskQueue: ["setTimeout callback"],
      microtaskQueue: ["Promise.then callback"],
      consoleLog: ["1 — synchronous"],
    },
    {
      description: 'Second console.log runs synchronously — "1b — still synchronous".',
      callStack: ["console.log()", "script"],
      macrotaskQueue: ["setTimeout callback"],
      microtaskQueue: ["Promise.then callback"],
      consoleLog: ["1 — synchronous", "1b — still synchronous"],
    },
    {
      description: "Script finishes. Call stack empties. Microtask queue drains first.",
      callStack: ["Promise.then callback"],
      macrotaskQueue: ["setTimeout callback"],
      microtaskQueue: [],
      consoleLog: [
        "1 — synchronous",
        "1b — still synchronous",
        "2 — microtask: Promise.resolve().then(...)",
      ],
    },
    {
      description: "Chained .then() runs as another microtask before any macrotask.",
      callStack: ["chained .then callback"],
      macrotaskQueue: ["setTimeout callback"],
      microtaskQueue: [],
      consoleLog: [
        "1 — synchronous",
        "1b — still synchronous",
        "2 — microtask: Promise.resolve().then(...)",
        "3 — microtask: chained .then(...)",
      ],
    },
    {
      description: "Microtask queue empty. Event loop picks the macrotask: setTimeout callback.",
      callStack: ["setTimeout callback"],
      macrotaskQueue: [],
      microtaskQueue: [],
      consoleLog: [
        "1 — synchronous",
        "1b — still synchronous",
        "2 — microtask: Promise.resolve().then(...)",
        "3 — microtask: chained .then(...)",
        "4 — macrotask: setTimeout(0)",
      ],
    },
  ];

  const gotchaItems = [
    {
      title: "An async function always returns a Promise — even if you don't await it",
      body: (
        <>
          Writing <code>async function doWork() &#123; return 42; &#125;</code> means{" "}
          <code>doWork()</code> returns <code>Promise&lt;42&gt;</code>, not <code>42</code>. The
          caller must <code>await doWork()</code> or call <code>.then()</code> on the result to get
          the number. Forgetting this produces silent bugs: the variable holds a Promise object,
          not the value, and downstream comparisons like <code>if (result === 42)</code> silently
          evaluate to <code>false</code>.
        </>
      ),
    },
    {
      title: "Forgetting to await is silent — you get [object Promise] instead of the value",
      body: (
        <>
          <code>const data = fetchComments();</code> — without <code>await</code> — sets{" "}
          <code>data</code> to the Promise object itself. Concatenating it into a string gives{" "}
          &quot;[object Promise]&quot;. Passing it to a function that expects an array produces
          runtime errors. The browser does not warn you. Always check: if the function you are
          calling is <code>async</code>, or returns a Promise, you almost certainly want{" "}
          <code>await</code>.
        </>
      ),
    },
    {
      title: "await only suspends inside an async function — top-level await needs a module",
      body: (
        <>
          <code>await fetch(...)</code> at the top level of a <code>&lt;script&gt;</code> block is
          a syntax error. Top-level <code>await</code> is only valid in ES modules (
          <code>&lt;script type=&quot;module&quot;&gt;</code>). Inside a classic script, wrap async
          work in an <code>async function</code> and call it immediately:{" "}
          <code>(async function () &#123; ... &#125;)()</code>. The Immediately Invoked Async
          Function Expression is the standard workaround in non-module scripts.
        </>
      ),
    },
    {
      title: "Promise.resolve(x) defers even when x is already a plain value",
      body: (
        <>
          <code>Promise.resolve(42).then(fn)</code> does not call <code>fn</code> immediately —
          it schedules <code>fn</code> as a <em>microtask</em>. The current synchronous code
          finishes first, then <code>fn(42)</code> runs. This surprises people who expect
          &quot;already resolved&quot; to mean &quot;runs now.&quot; The same applies to an{" "}
          <code>await</code> on a value that is not a Promise:{" "}
          <code>await 42</code> still yields to the microtask queue before resuming.
        </>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-3xl font-bold">Things Take Time</h1>
        <RoadmapLink url="https://roadmap.sh/frontend" />
      </div>

      {/* Section 1: Hook */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            The toggle from module 2-1 worked because the comments were already in the page. But the
            product requirement changed: comments now live in a separate JSON file, fetched when the
            user opens the section. The first attempt looks obvious — click the button, load the
            data, render it. Here is that code:
          </p>
          <div className="bg-slate-900 text-slate-100 rounded p-4 font-mono text-sm mb-4 overflow-x-auto leading-relaxed">
            <div className="text-slate-400">{'// The first attempt — synchronous "load"'}</div>
            <div>
              <span className="text-blue-400">toggleBtn</span>
              <span className="text-slate-300">.addEventListener(</span>
              <span className="text-amber-300">&quot;click&quot;</span>
              <span className="text-slate-300">, function handleToggle() {'{'}</span>
            </div>
            <div className="pl-4 text-slate-400">
              {'// Block the thread for 2 seconds — simulating a slow read'}
            </div>
            <div className="pl-4">
              <span className="text-blue-400">const</span>
              <span className="text-slate-300"> start = Date.now();</span>
            </div>
            <div className="pl-4">
              <span className="text-blue-400">while</span>
              <span className="text-slate-300"> (Date.now() - start {'<'} 2000) {'{ }'}</span>
            </div>
            <div className="pl-4 text-slate-300">renderComments(...);</div>
            <div className="text-slate-300">{'});'}</div>
          </div>
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            Open a tab, click the button, and watch what happens. For two seconds the page is
            completely frozen. The spinner never spins. You cannot scroll. You cannot click anything.
            An impatient user clicks the button again — and again — and again. When the two seconds
            end, the click handler fires five times in a row and the UI is a mess of duplicated
            comments.
          </p>
          <p className="text-slate-700 dark:text-slate-300">
            The underlying problem is structural: the page has to <em>wait</em> for the data to
            arrive — but waiting synchronously means freezing. The page has to wait{" "}
            <em>without freezing</em>. What would have to be true about the language for that to be
            possible?
          </p>
        </CardContent>
      </Card>

      {/* Section 2: Mental model */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            The answer is that the slow work needs to happen <em>off to the side</em>: start it,
            hand back control to the browser immediately, and arrange for a callback to run when the
            result arrives. JavaScript formalizes this idea with an object called a{" "}
            <em>Promise</em>. You get the Promise back right now, before the slow work is done. The
            value inside it is not here yet — but you have a handle you can attach behavior to.
            When the value eventually arrives, the handle delivers it.
          </p>
          <blockquote className="border-l-4 border-blue-500 pl-4 italic text-slate-600 dark:text-slate-400">
            A Promise is a value that&apos;s not here yet.
          </blockquote>
        </CardContent>
      </Card>

      {/* Section 3: Step-by-step */}
      <h2 className="text-xl font-semibold mb-3">From freezing to flowing: deriving async JavaScript</h2>
      <StepByStepExplanation
        title="Why async exists — and how the API evolved from the problem"
        description="Each step addresses a concrete limitation of the previous step. By the end you have async/await, the event loop model, and a working async comment loader."
        steps={asyncSteps}
      />

      {/* Optional: callback nesting vs async/await comparison */}
      <CodeComparison
        title="Callback nesting vs async/await"
        description="The same three sequential async steps — load comments, load authors, load avatars — written both ways."
        oldCode={{
          title: "Callback nesting",
          code: callbackHellCode,
          language: "javascript",
          cons: [
            "Indentation grows with every step",
            "Error handlers repeated at each level",
            "Impossible to break into named functions cleanly",
          ],
        }}
        newCode={{
          title: "async/await",
          code: asyncAwaitCode,
          language: "javascript",
          pros: [
            "Reads top-to-bottom like synchronous code",
            "One try/catch handles the whole chain",
            "Easy to extract individual steps into named functions",
          ],
        }}
      />

      {/* Optional: event loop visualizer (microtasks vs macrotasks) */}
      <EventLoopVisualizer
        title="Microtasks drain before macrotasks — step through the execution order"
        code={`console.log("1 — synchronous");\nsetTimeout(() => console.log("4 — macrotask"), 0);\nPromise.resolve().then(() => console.log("2 — microtask")).then(() => console.log("3 — chained"));\nconsole.log("1b — still synchronous");`}
        frames={eventLoopFrames}
      />

      {/* Section 4: Playground */}
      <h2 className="text-xl font-semibold mb-3">Try it yourself</h2>
      <HTMLPlayground
        html={playgroundHtml}
        js={playgroundJs}
        css={playgroundCss}
        title="Live editor — macrotask vs microtask ordering"
        description="Click Run to see the log order. Then swap the setTimeout for a Promise.resolve().then() and observe how the order changes."
      />

      {/* Section 5: Challenges */}
      <h2 className="text-xl font-semibold mb-3">Challenges</h2>

      <Challenge
        title="Predict the log order"
        question={`What is the output order of this code?\n\nconsole.log("A");\n\nsetTimeout(() => console.log("B"), 0);\n\nPromise.resolve()\n  .then(() => console.log("C"))\n  .then(() => console.log("D"));\n\nconsole.log("E");`}
        options={[
          { id: "a", text: "A, E, C, D, B" },
          { id: "b", text: "A, B, C, D, E" },
          { id: "c", text: "A, C, D, E, B" },
          { id: "d", text: "A, E, B, C, D" },
        ]}
        correctAnswerId="a"
        explanation={
          <p>
            The call stack runs synchronous code to completion first: <code>A</code> then{" "}
            <code>E</code>. When the call stack empties, the <em>microtask</em> queue drains
            entirely before any <em>macrotask</em> runs: <code>C</code> then <code>D</code>
            (the chained <code>.then</code>). Only after the microtask queue is empty does the
            event loop pick up the <code>setTimeout</code> macrotask: <code>B</code>. The rule
            is: synchronous code, then microtasks to empty, then one macrotask, repeat.
          </p>
        }
      />

      <Challenge
        title="Where does the error go?"
        question={`A developer writes this code:\n\nasync function loadData() {\n  const res = await fetch("/missing.json");\n  if (!res.ok) throw new Error("not found");\n  return res.json();\n}\n\nfunction init() {\n  loadData(); // note: no await, no .catch()\n  console.log("init done");\n}\n\ninit();\n\nThe fetch returns a 404. What happens to the thrown Error?`}
        options={[
          {
            id: "a",
            text: "The error is silently lost. loadData() returns a Promise that rejects, but because init() neither awaits it nor calls .catch(), the rejection is unhandled. The browser fires an unhandledrejection event but the app continues running.",
          },
          {
            id: "b",
            text: "The error propagates synchronously out of loadData() into init(), crashing the app immediately.",
          },
          {
            id: "c",
            text: "The error is caught by the nearest surrounding try/catch, which is the event loop itself, so it is swallowed completely and nothing happens.",
          },
          {
            id: "d",
            text: "console.log('init done') never runs because init() waits for loadData() to settle before continuing.",
          },
        ]}
        correctAnswerId="a"
        explanation={
          <p>
            An <em>async</em> function always returns a <em>Promise</em>. When <code>init()</code>{" "}
            calls <code>loadData()</code> without <code>await</code>, it discards that Promise.
            The rejection has nowhere to go — no <code>.catch()</code>, no surrounding{" "}
            <code>try/catch</code> that covers it. The browser detects the unhandled rejected
            Promise and fires an <code>unhandledrejection</code> event, which appears as a warning
            in the console. The rest of <code>init()</code> — including <code>console.log</code>{" "}
            — runs immediately without waiting, because the async call is fire-and-forget from{" "}
            <code>init</code>&apos;s perspective.
          </p>
        }
      />

      {/* Section 6: GotchaList */}
      <h2 className="text-xl font-semibold mb-3">Things that surprise people</h2>
      <GotchaList items={gotchaItems} />

      {/* Section 7: KeyTakeaways */}
      <KeyTakeaways
        mentalModel="A Promise is a value that's not here yet."
        points={[
          <>
            Synchronous code blocks the thread — and the thread is also the browser&apos;s UI
            thread. A two-second synchronous operation freezes the page for two seconds and queues
            up every user interaction. This is why async exists: to hand back control to the browser
            while waiting for slow work to finish.
          </>,
          <>
            A <em>Promise</em> is a handle for a future value. You receive it synchronously, before
            the value exists. <code>.then(fn)</code> schedules <code>fn</code> to run when the
            Promise resolves; <code>.catch(fn)</code> handles rejection. Chains read top-to-bottom
            instead of nesting inside-out like <em>callback</em> hell.
          </>,
          <>
            <em>async</em>/<em>await</em> is syntax over Promises. Every <code>async</code>{" "}
            function returns a Promise. Every <code>await</code> expression unwraps a Promise —
            suspending the async function (not the thread) until the value arrives. Wrap multiple{" "}
            <code>await</code> lines in <code>try</code>/<code>catch</code> to handle errors from
            any step.
          </>,
          <>
            The <em>event loop</em> processes work in layers. One{" "}
            <em>macrotask</em> runs, then every pending <em>microtask</em> drains to empty, then
            the browser may paint, then the next macrotask runs. <code>setTimeout(..., 0)</code>{" "}
            is a macrotask; <code>Promise.resolve().then(...)</code> is a microtask. Microtasks
            always win the ordering race.
          </>,
          <>
            An unhandled rejected Promise does not crash the app — it fires{" "}
            <code>unhandledrejection</code> and logs a console warning. That makes it easy to miss.
            Always end a Promise chain with <code>.catch()</code>, or use{" "}
            <code>try</code>/<code>catch</code> around <code>await</code>, so failures surface as
            visible UI states rather than silent no-ops.
          </>,
        ]}
      />
    </div>
  );
}
