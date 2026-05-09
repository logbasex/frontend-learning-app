"use client";

import { Card, CardContent } from "@/components/ui/card";
import { HTMLPlayground } from "@/components/CodePlayground";
import { StepByStepExplanation, Step } from "@/components/StepByStepExplanation";
import { CodeComparison } from "@/components/CodeComparison";
import { Challenge } from "@/components/Challenge";
import { GotchaList } from "@/components/GotchaList";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { RoadmapLink } from "@/components/RoadmapLink";

export function Module_4_3_Content() {
  // Data blocks hoisted out of JSX for readability — listed in render order.
  const asyncEndToEndSteps: Step[] = [
    {
      title: "Step 1: What a Promise is",
      description: (
        <>
          A <em>Promise</em> — an object representing a value that may be available now, later, or
          never — has exactly three states: <strong>pending</strong> (no result yet),{" "}
          <strong>fulfilled</strong> (settled with a value), or <strong>rejected</strong> (settled
          with a reason). Once a Promise settles it never changes state again. You can attach
          callbacks with <code>.then(onFulfilled, onRejected)</code> or <code>.catch(onRejected)</code>{" "}
          — these always run asynchronously, even if the Promise is already settled by the time you
          attach them. Most code you write will <em>consume</em> Promises rather than construct them
          from scratch; the platform hands them to you from <code>fetch()</code>, database calls, and
          file reads.
        </>
      ),
      code: `// A Promise in each of its three states

// Pending — no result yet
const pending = new Promise(() => {}); // never settles

// Fulfilled — settled with the value 42
const fulfilled = Promise.resolve(42);
fulfilled.then(v => console.log(v)); // 42  (async, but fast)

// Rejected — settled with an Error
const rejected = Promise.reject(new Error("no connection"));
rejected.catch(err => console.error(err.message)); // "no connection"

// States are final — you cannot go from fulfilled back to pending
console.log("this runs before the .then callbacks above");`,
    },
    {
      title: "Step 2: Constructing one",
      description: (
        <>
          When you need to wrap an old callback-based API in a Promise, use{" "}
          <code>new Promise((resolve, reject) =&gt; ...)</code>. Call <code>resolve(value)</code> to
          fulfill it or <code>reject(reason)</code> to reject it — calling one makes the other a
          no-op. The callback passed to <code>new Promise</code> is called the{" "}
          <em>executor</em>; it runs synchronously, but <code>resolve</code> and <code>reject</code>{" "}
          schedule their callbacks asynchronously. This pattern is how the entire Node.js ecosystem
          was gradually migrated from callbacks to Promises, and how you would wrap any legacy API
          that hands you a callback.
        </>
      ),
      code: `// Wrapping setTimeout (callback API) in a Promise
function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms); // resolve fires after ms milliseconds
  });
}

// Wrapping an XMLHttpRequest (old-school fetch) in a Promise
function loadUser(id) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/users/" + id);
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error("HTTP " + xhr.status));
      }
    };
    xhr.onerror = () => reject(new Error("Network error"));
    xhr.send();
  });
}

// Usage — just like any other Promise
loadUser(42).then(user => console.log(user.name)).catch(console.error);`,
    },
    {
      title: "Step 3: async/await is sugar",
      description: (
        <>
          <em><code>async</code>/<code>await</code></em> — syntax sugar over Promises: <code>await</code>{" "}
          pauses an <code>async</code> function until the Promise settles — makes Promise code read
          like synchronous code without any new machinery underneath. An <code>async</code> function
          always returns a Promise. Inside it, <code>await p</code> is equivalent to{" "}
          <code>p.then(result =&gt; ...)</code>. No new threads, no new concurrency model — just
          cleaner syntax for the same Promise chain. Marking a function <code>async</code> does not
          make it run faster; it makes the error flow easier to reason about.
        </>
      ),
      code: `// These two functions are semantically equivalent

// .then() version
function loadUserThen(id) {
  return fetch("/users/" + id)
    .then(res => {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    });
}

// async/await version — same Promise machinery, clearer control flow
async function loadUserAsync(id) {
  const res = await fetch("/users/" + id);
  if (!res.ok) throw new Error("HTTP " + res.status);
  return res.json(); // returning from async fn wraps the value in a Promise
}

// Both usages are identical
loadUserAsync(42).then(user => console.log(user.name));`,
    },
    {
      title: "Step 4: Errors travel",
      description: (
        <>
          A rejected Promise propagates down the chain until something catches it. In a{" "}
          <code>.then()</code> chain that is <code>.catch()</code>. Inside an <code>async</code>{" "}
          function that is <code>try</code>/<code>catch</code>. Forget both and you get an
          &quot;UnhandledPromiseRejection&quot; warning in Node.js and a console error in the
          browser — but the code keeps running (badly). The single most common bug with Promises is
          forgetting the <code>await</code> keyword: without it, the function returns a pending
          Promise instead of its value and any rejection is silently ignored unless you added a{" "}
          <code>.catch()</code>.
        </>
      ),
      code: `// A rejection propagates until it is caught
async function riskyOp() {
  throw new Error("something broke");
}

// Caught via try/catch inside an async function
async function main() {
  try {
    const result = await riskyOp();
    console.log(result);
  } catch (err) {
    console.error("caught:", err.message); // "caught: something broke"
  }
}

// Caught via .catch() on the returned Promise
main().catch(err => console.error("outer:", err.message));

// Missing await — the rejection is SWALLOWED
async function broken() {
  riskyOp(); // no await, no .catch — UnhandledPromiseRejection
  console.log("this runs, but the error is lost");
}`,
    },
    {
      title: "Step 5: fetch() and the response shape",
      description: (
        <>
          <em><code>fetch()</code></em> — the modern browser API for making HTTP requests — returns a
          Promise that resolves to a <code>Response</code> object, not the response body. Reading the
          body is a separate <code>await</code>: <code>await response.json()</code> or{" "}
          <code>await response.text()</code>. This split exists because HTTP headers arrive before
          the body, letting you inspect status and headers without buffering the entire payload.
          Crucially, <strong>
            <code>fetch()</code> does not reject on 4xx or 5xx status codes — it only rejects on
            network failure
          </strong>{" "}
          (DNS failure, no connection, CORS rejection). A 404 or 503 resolves normally; you must
          check <code>response.ok</code> (true when <code>status</code> is 200–299) yourself.
        </>
      ),
      code: `// fetch() resolves on ANY completed HTTP response — including 4xx and 5xx

async function getUser(id) {
  const response = await fetch("/users/" + id);

  // response.ok is true for 200–299 only
  if (!response.ok) {
    throw new Error("HTTP " + response.status); // 404, 503, etc.
  }

  // Second await: reads and parses the response body
  const user = await response.json();
  return user;
}

// What fetch() DOES reject on:
//   - DNS failure:          ERR_NAME_NOT_RESOLVED
//   - Network down:         ERR_NETWORK_CHANGED / Failed to fetch
//   - CORS blocked:         TypeError: Failed to fetch
//   - Aborted:              AbortError
//
// What fetch() does NOT reject on:
//   - 400 Bad Request       ← resolves, response.ok === false
//   - 404 Not Found         ← resolves, response.ok === false
//   - 500 Internal Error    ← resolves, response.ok === false`,
    },
    {
      title: "Step 6: Cancel with AbortController",
      description: (
        <>
          <em>AbortController</em> — a pair{" "}
          <code>{"{ signal, abort() }"}</code> used to cancel an in-flight <code>fetch</code> —
          works by passing the <code>signal</code> into <code>fetch(url, {"{ signal }"})</code>.
          Calling <code>controller.abort()</code> rejects the in-flight Promise with an{" "}
          <code>AbortError</code>. Always catch it explicitly — if you let it bubble up as an
          unhandled rejection, users see a spurious error message for something they themselves
          triggered. The classic use cases are: cancelling a search-as-you-type request when the
          user types another character, and cleaning up an in-flight request inside a React{" "}
          <code>useEffect</code> cleanup function when the component unmounts.
        </>
      ),
      code: `const controller = new AbortController();

async function fetchWithCancel(url) {
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error("HTTP " + response.status);
    return await response.json();
  } catch (err) {
    if (err.name === "AbortError") {
      console.log("fetch was cancelled — not an error");
      return null; // clean exit
    }
    throw err; // real error — re-throw
  }
}

// Start the fetch
fetchWithCancel("https://httpbin.org/delay/5").then(console.log);

// Cancel it after 2 seconds
setTimeout(() => controller.abort(), 2000);

// React useEffect cleanup pattern:
// useEffect(() => {
//   const c = new AbortController();
//   fetch(url, { signal: c.signal }).then(...);
//   return () => c.abort(); // cancels if component unmounts
// }, [url]);`,
    },
  ];

  const playgroundHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Fetch &amp; AbortController</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <h2>Fetch with cancellation</h2>
  <p class="hint">Click "Fetch slow data", then click "Cancel" within 3 seconds.</p>
  <div class="controls">
    <button id="btnFetch">Fetch slow data</button>
    <button id="btnCancel" disabled>Cancel</button>
  </div>
  <pre id="log" class="log">Waiting...</pre>
  <script src="/script.js"></script>
</body>
</html>`;

  const playgroundCss = `body {
  font-family: system-ui, sans-serif;
  max-width: 560px;
  margin: 24px auto;
  padding: 0 16px;
  color: #1e293b;
}
h2 { font-size: 1.1rem; margin-bottom: 4px; }
.hint { font-size: 0.82rem; color: #64748b; margin-bottom: 14px; }
.controls { display: flex; gap: 10px; margin-bottom: 14px; }
button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
}
#btnFetch  { background: #3b82f6; color: white; }
#btnFetch:hover:not(:disabled)  { background: #2563eb; }
#btnCancel { background: #ef4444; color: white; }
#btnCancel:hover:not(:disabled) { background: #dc2626; }
button:disabled { opacity: 0.4; cursor: not-allowed; }
.log {
  background: #0f172a;
  color: #e2e8f0;
  padding: 14px;
  border-radius: 8px;
  font-family: monospace;
  font-size: 0.82rem;
  min-height: 80px;
  white-space: pre-wrap;
  word-break: break-all;
}
.success { color: #4ade80; }
.aborted { color: #facc15; }
.error   { color: #f87171; }`;

  const playgroundJs = `// Try this: click "Fetch slow data", then click "Cancel" within 3 seconds.
// Watch the log show "aborted" instead of "got data". Then change the
// URL to httpbin.org/status/500 and click Fetch — fetch() does NOT reject
// on 5xx; you have to check response.ok yourself.

const btnFetch  = document.getElementById("btnFetch");
const btnCancel = document.getElementById("btnCancel");
const log       = document.getElementById("log");

let controller = null;

btnFetch.addEventListener("click", async () => {
  controller = new AbortController();
  btnFetch.disabled  = true;
  btnCancel.disabled = false;

  log.className = "log";
  log.textContent = "loading...";

  try {
    const response = await fetch(
      "https://httpbin.org/delay/3",
      { signal: controller.signal }
    );

    if (!response.ok) {
      log.className = "log error";
      log.textContent = "HTTP error " + response.status +
        "\\nfetch() did not reject — you had to check response.ok yourself.";
    } else {
      const data = await response.json();
      log.className = "log success";
      log.textContent = "got data\\n\\n" + JSON.stringify(data, null, 2);
    }
  } catch (err) {
    if (err.name === "AbortError") {
      log.className = "log aborted";
      log.textContent = "aborted";
    } else {
      log.className = "log error";
      log.textContent = "error: " + err.message;
    }
  } finally {
    btnFetch.disabled  = false;
    btnCancel.disabled = true;
    controller = null;
  }
});

btnCancel.addEventListener("click", () => {
  if (controller) controller.abort();
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
              Three of the worst bugs in your career will be a missing <code>await</code>, an
              unhandled rejection, and a fetch you forgot to cancel. The fixes are simple. The hard
              part is <em>seeing</em> them — async code lies about its own control flow.
            </p>
            <p>
              A function that looks synchronous might return a Promise you never read. An error that
              looks handled might be swallowed because you forgot one keyword. A network request that
              looks finished might still be running in the background, ready to overwrite the state
              the user just changed. This module is about making async code honest: you will trace
              Promises from construction to settlement, refactor callback spaghetti into readable{" "}
              <code>async</code>/<code>await</code>, cancel in-flight requests deliberately, and wire
              up error handling that actually catches what it should.
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
              JavaScript is single-threaded — there is only one call stack and it processes one thing
              at a time. Promises do not give you parallelism; they give you a way to schedule work
              after the current task finishes without blocking. When you <code>await</code> a
              Promise, your <code>async</code> function suspends and the event loop is free to run
              other tasks. When the Promise settles, your function resumes exactly where it left off.
              The word &quot;async&quot; is misleading — it does not mean &quot;runs on another
              thread.&quot; It means &quot;may resume later.&quot;
            </p>
            <blockquote className="border-l-4 border-blue-500 pl-4 italic">
              &quot;A Promise is a value that&apos;s not here yet. <code>async</code>/<code>await</code>{" "}
              is sugar — not a thread. <code>fetch()</code> doesn&apos;t reject on 4xx/5xx; check{" "}
              <code>response.ok</code>.&quot;
            </blockquote>
          </div>
        </CardContent>
      </Card>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 3: Step-by-step                                               */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <StepByStepExplanation
        title="Async, end to end"
        description="From raw Promise construction to cancellable fetch"
        steps={asyncEndToEndSteps}
      />

      {/* Optional: CodeComparison (callbacks → .then → async/await) */}
      <CodeComparison
        title="Same fetch, two eras"
        description="Callbacks (XHR) vs Promises (.then) — same request, very different ergonomics"
        oldCode={{
          title: "Callbacks (XHR)",
          language: "javascript",
          code: `function loadUser(id, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "/users/" + id);
  xhr.onload = () => {
    if (xhr.status === 200) {
      callback(null, JSON.parse(xhr.responseText));
    } else {
      callback(new Error("HTTP " + xhr.status));
    }
  };
  xhr.onerror = () => callback(new Error("Network"));
  xhr.send();
}

// Usage — error is the first argument (Node.js convention)
loadUser(42, (err, user) => {
  if (err) return handleError(err);
  render(user);
});`,
          cons: [
            "Error handling is manual at every call site",
            "Nesting callbacks for sequential requests creates deep indentation",
            "No standard way to cancel in-flight requests",
          ],
        }}
        newCode={{
          title: "async/await",
          language: "javascript",
          code: `async function loadUser(id) {
  const res = await fetch("/users/" + id);
  if (!res.ok) throw new Error("HTTP " + res.status);
  return res.json();
}

// Usage — errors propagate via try/catch
try {
  const user = await loadUser(42);
  render(user);
} catch (err) {
  handleError(err);
}`,
          pros: [
            "Errors propagate automatically — one try/catch handles all",
            "Sequential requests read top-to-bottom like synchronous code",
            "AbortController provides cancellation",
          ],
        }}
      />

      <CodeComparison
        title="Same fetch, two styles"
        description="Promises (.then chain) vs async/await — identical behaviour, different readability"
        oldCode={{
          title: "Promises (.then)",
          language: "javascript",
          code: `function loadUser(id) {
  return fetch("/users/" + id)
    .then(res => {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    })
    .then(user => {
      render(user);
      return user;
    })
    .catch(err => {
      showError(err);
    });
}`,
        }}
        newCode={{
          title: "async/await",
          language: "javascript",
          code: `async function loadUser(id) {
  try {
    const res = await fetch("/users/" + id);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const user = await res.json();
    render(user);
    return user;
  } catch (err) {
    showError(err);
  }
}`,
          pros: [
            "try/catch is the structural equivalent of .catch",
            "Control flow reads linearly — no nesting for sequential steps",
            "Debugger breakpoints land on the right line",
          ],
        }}
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 4: Playground                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <HTMLPlayground
        html={playgroundHtml}
        css={playgroundCss}
        js={playgroundJs}
        title="Fetch with cancellation"
        description="Click Fetch slow data, then Cancel within 3 seconds to abort the request mid-flight."
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 5: Challenges                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Challenge
        question="Your code does fetch('/api/users') and shows a success message. The server returned 503. Why didn't the catch block run?"
        options={[
          {
            id: "a",
            text: "5xx responses are silent in modern fetch.",
          },
          {
            id: "b",
            text: "fetch() only rejects on network failure (DNS, TCP). Status codes — including 5xx — resolve normally; you must check response.ok.",
          },
          {
            id: "c",
            text: "The browser cached a successful response and the catch never ran.",
          },
          {
            id: "d",
            text: "The server didn't set the right CORS headers.",
          },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            <code>fetch()</code> only treats network failures — no DNS, no connection, CORS rejected
            — as Promise rejections. HTTP errors are valid responses: the server <em>did</em>{" "}
            respond, so the Promise resolves and <code>response.ok</code> (or{" "}
            <code>response.status</code>) is your gate. A 503 resolves to a{" "}
            <code>Response</code> with <code>ok === false</code>; your <code>catch</code> block never
            sees it unless you explicitly <code>throw</code> after checking <code>response.ok</code>.
          </>
        }
      />

      <Challenge
        question={`Convert this .then chain to async/await while preserving error behavior:\n\nfetch('/users')\n  .then(r => r.json())\n  .then(users => render(users))\n  .catch(err => showError(err));`}
        options={[
          {
            id: "a",
            text: `async function load() {
  const r = await fetch('/users');
  const users = await r.json();
  render(users);
}`,
          },
          {
            id: "b",
            text: `async function load() {
  try {
    const r = await fetch('/users');
    const users = await r.json();
    render(users);
  } catch (err) {
    showError(err);
  }
}`,
          },
          {
            id: "c",
            text: `async function load() {
  await fetch('/users').then(render).catch(showError);
}`,
          },
          {
            id: "d",
            text: `function load() {
  await fetch('/users');
}`,
          },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            <code>try</code>/<code>catch</code> is how <code>async</code>/<code>await</code> catches
            rejected Promises — it is the structural equivalent of <code>.catch</code>. Option (a)
            drops error handling entirely: if <code>fetch()</code> or <code>r.json()</code> rejects,
            the rejection goes unhandled. Option (c) mixes paradigms unnecessarily. Option (d) won&apos;t
            even parse — <code>await</code> outside an <code>async</code> function is a SyntaxError.
          </>
        }
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 6: GotchaList                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <GotchaList
        items={[
          {
            title: "An unhandled Promise rejection is silent — try/catch doesn't catch it if you forgot the await",
            body: (
              <>
                <code>riskyOp()</code> without <code>await</code> returns a Promise you never read.
                Any rejection on it fires the global <code>unhandledrejection</code> event but never
                reaches the surrounding <code>try</code>/<code>catch</code>. The rule: if a function
                returns a Promise and you care about its outcome, always <code>await</code> it or
                attach a <code>.catch()</code>.
              </>
            ),
          },
          {
            title: "await in a loop serializes calls — use Promise.all for parallel work and Promise.allSettled if you need every result",
            body: (
              <>
                <code>for (const id of ids) {"{ await fetch(...) }"}</code> sends one request at a
                time — total time is the sum of all round-trips. Replace it with{" "}
                <code>await Promise.all(ids.map(id =&gt; fetch(...)))</code> to fire all requests in
                parallel — total time is the slowest one. Use <code>Promise.allSettled</code> when
                you want every result even if some reject.
              </>
            ),
          },
          {
            title: "fetch() doesn't reject on 4xx/5xx — only on network failure; check response.ok",
            body: (
              <>
                A 404, 422, or 503 response resolves the fetch Promise. If you want those to act
                like errors, add <code>if (!response.ok) throw new Error(&quot;HTTP &quot; +
                response.status)</code> immediately after the first <code>await</code>. Forgetting
                this is the single most common fetch bug.
              </>
            ),
          },
          {
            title: "Aborting a fetch rejects with AbortError — handle it explicitly or it looks like a real error",
            body: (
              <>
                When <code>controller.abort()</code> fires, the fetch Promise rejects with a{" "}
                <code>DOMException</code> whose <code>name</code> is <code>&quot;AbortError&quot;</code>.
                In your <code>catch</code> block, check <code>err.name === &quot;AbortError&quot;</code>{" "}
                first and return silently (or log a debug message). Re-throwing it or showing it to
                the user is almost always wrong — the user cancelled the request themselves.
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
            A <em>Promise</em> is an object with three possible states — pending, fulfilled,
            rejected — that transitions once and never changes again. The platform hands them to you;
            you rarely construct them directly.
          </>,
          <>
            <code>async</code>/<code>await</code> is syntactic sugar over Promises: <code>await p</code>{" "}
            suspends the current <code>async</code> function and resumes it when <code>p</code>{" "}
            settles. No new threads. <code>try</code>/<code>catch</code> inside an{" "}
            <code>async</code> function is the exact equivalent of <code>.catch()</code> on a chain.
          </>,
          <>
            <code>fetch()</code> resolves to a <code>Response</code> object on any completed HTTP
            response — including 4xx and 5xx. Always check <code>response.ok</code> before reading
            the body. <code>fetch()</code> only rejects on genuine network failures.
          </>,
          <>
            Cancel in-flight requests with <code>AbortController</code>: pass{" "}
            <code>{"{ signal: controller.signal }"}</code> to <code>fetch()</code> and call{" "}
            <code>controller.abort()</code> when done. Catch the resulting <code>AbortError</code>{" "}
            explicitly so it does not surface as a user-visible error.
          </>,
          <>
            Missing <code>await</code> is the most common async bug — a rejected Promise you never
            read silently swallows its error. If you call a function that returns a Promise, always{" "}
            <code>await</code> it or chain a <code>.catch()</code>.
          </>,
        ]}
        mentalModel="A Promise is a value that's not here yet. async/await is sugar — not a thread. fetch() doesn't reject on 4xx/5xx; check response.ok."
      />
    </div>
  );
}
