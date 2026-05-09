"use client";

import { ScaffoldModule } from "./_template";
import { HTMLPlayground } from "@/components/CodePlayground";

const fetchHtml = `<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <h2>Fetch with Cancellation</h2>
  <p>Fetches a slow endpoint (2-second delay). Cancel before it resolves.</p>
  <div class="controls">
    <button id="btnFetch">Fetch (2 s delay)</button>
    <button id="btnCancel" disabled>Cancel</button>
  </div>
  <output id="out" class="out">Press Fetch to start...</output>
  <script src="/script.js"></script>
</body>
</html>`;

const fetchCss = `body { font-family: sans-serif; margin: 20px; background: #f8fafc; }
.controls { display: flex; gap: 10px; margin-bottom: 16px; }
button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}
#btnFetch  { background: #3b82f6; color: white; }
#btnFetch:hover:not(:disabled)  { background: #2563eb; }
#btnCancel { background: #ef4444; color: white; }
#btnCancel:hover:not(:disabled) { background: #dc2626; }
button:disabled { opacity: 0.4; cursor: not-allowed; }
.out {
  display: block;
  padding: 14px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  min-height: 48px;
  white-space: pre-wrap;
  font-family: monospace;
}
.success { color: #16a34a; }
.error   { color: #dc2626; }
.info    { color: #7c3aed; }`;

const fetchJs = `const btnFetch  = document.getElementById('btnFetch');
const btnCancel = document.getElementById('btnCancel');
const out       = document.getElementById('out');

let controller = null; // holds the AbortController for the active request

btnFetch.addEventListener('click', async () => {
  // Create a fresh controller for each request
  controller = new AbortController();

  btnFetch.disabled  = true;
  btnCancel.disabled = false;
  out.className = 'out info';
  out.textContent = 'Fetching... (click Cancel to abort)';

  try {
    // Pass the signal to fetch — it will abort when controller.abort() is called
    const response = await fetch(
      'https://httpbin.org/delay/2',
      { signal: controller.signal }
    );

    // fetch() resolves to a Response — we need a SECOND await to read the body
    const data = await response.json();

    out.className = 'out success';
    out.textContent = 'Done! Origin: ' + data.origin;
  } catch (err) {
    if (err.name === 'AbortError') {
      out.className = 'out error';
      out.textContent = 'Cancelled — fetch was aborted before completing.';
    } else {
      out.className = 'out error';
      out.textContent = 'Network error: ' + err.message;
    }
  } finally {
    btnFetch.disabled  = false;
    btnCancel.disabled = true;
    controller = null;
  }
});

btnCancel.addEventListener('click', () => {
  if (controller) controller.abort();
});`;

export function Module_4_3_Content() {
  return (
    <ScaffoldModule
      emoji="🔄"
      problemTitle="From callback hell to async/await"
      problem={
        <>
          <p>
            A <strong>Promise</strong> represents a value that is not available
            yet. It starts <em>pending</em>, then transitions to either{" "}
            <em>fulfilled</em> (resolved with a value) or <em>rejected</em>{" "}
            (failed with a reason). You chain work onto a Promise with{" "}
            <code>.then()</code> and handle errors with <code>.catch()</code>.
            The <code>async/await</code> syntax is pure sugar on top of this —{" "}
            <code>await p</code> is equivalent to <code>p.then(...)</code>, but
            reads like synchronous code and makes error handling with{" "}
            <code>try/catch</code> natural.
          </p>
          <p>
            <code>fetch(url)</code> returns a Promise that resolves to a{" "}
            <code>Response</code> object — not the data itself. Reading the body
            is a <em>separate</em> async step: <code>await response.json()</code>{" "}
            or <code>await response.text()</code>. This split exists because
            HTTP headers arrive before the body, and sometimes you only need the
            headers.
          </p>
          <p>
            <strong>AbortController</strong> lets you cancel an in-flight{" "}
            <code>fetch</code>. Pass <code>signal: controller.signal</code> to
            the options and call <code>controller.abort()</code> whenever you
            want to cancel. The Promise rejects with an <code>AbortError</code>,
            which you should detect explicitly in your catch block. Cancelling
            is important when users navigate away before a response arrives —
            without it, the callback still runs and can update unmounted
            components.
          </p>
        </>
      }
      body={
        <HTMLPlayground
          html={fetchHtml}
          css={fetchCss}
          js={fetchJs}
          title="Fetch with cancellation"
          description="Click 'Fetch'. Click 'Cancel' before the 2-second delay resolves to abort the request."
        />
      }
      challenge={{
        question: "Why does `await fetch(url)` ALONE not give you the JSON?",
        options: [
          {
            id: "a",
            text: "`fetch` is not actually async — it returns JSON synchronously.",
          },
          {
            id: "b",
            text: "You need to call `JSON.parse()` manually because `fetch` only returns strings.",
          },
          {
            id: "c",
            text: "`fetch` resolves to a Response object. You need `await response.json()` to read and parse the body — it is a separate async step.",
          },
          {
            id: "d",
            text: "`await fetch(url)` does return JSON, but only when the Content-Type header is set correctly.",
          },
        ],
        correctAnswerId: "c",
        explanation: (
          <>
            <code>fetch</code> resolves as soon as the HTTP headers are
            received, giving you a <code>Response</code> object. The body may
            not have fully arrived yet. Calling <code>response.json()</code>{" "}
            returns another Promise that resolves once the entire body has been
            read and parsed as JSON. This two-step design lets you inspect
            status codes and headers before paying the cost of reading a
            potentially large body.
          </>
        ),
      }}
      takeaways={[
        <>
          A Promise is a value that is not here yet. <code>async/await</code> is
          sugar over <code>.then()</code> chains — errors travel through{" "}
          <code>try/catch</code> exactly as they do through{" "}
          <code>.catch()</code>.
        </>,
        <>
          <code>fetch</code> resolves to a <code>Response</code>, not data.
          Always add a second <code>await</code> to read the body:{" "}
          <code>await response.json()</code> or{" "}
          <code>await response.text()</code>.
        </>,
        <>
          Use <code>AbortController</code> to cancel fetches when the user
          navigates away or triggers a new request before the previous one
          finishes. Catch <code>AbortError</code> separately so you do not
          display spurious error messages.
        </>,
      ]}
      mentalModel="A Promise is a value that's not here yet. async/await is sugar over Promises. Errors travel through .catch the same way."
      roadmapUrl="https://roadmap.sh/frontend"
    />
  );
}
