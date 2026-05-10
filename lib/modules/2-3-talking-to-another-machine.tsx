"use client";

import { Card, CardContent } from "@/components/ui/card";
import { StepByStepExplanation } from "@/components/StepByStepExplanation";
import { HTMLPlayground } from "@/components/CodePlayground";
import { Challenge } from "@/components/Challenge";
import { GotchaList } from "@/components/GotchaList";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { RoadmapLink } from "@/components/RoadmapLink";
import { CodeComparison } from "@/components/CodeComparison";

export function Module_2_3_Content() {
  // Data blocks hoisted out of JSX for readability — listed in render order.

  const httpToFetchSteps = [
    {
      title: "The conversation — HTTP as plain text",
      description: (
        <p>
          At the lowest level, <em>HTTP</em> is two pieces of text the machines exchange over a
          TCP connection. The client sends a <em>request</em>: a start line (method, path,
          protocol version), then headers (key–value pairs, one per line), then a blank line, then
          an optional body. The server sends a <em>response</em>: a status line, then headers,
          then a blank line, then the body. That is the entire protocol. Everything the browser
          does — loading a page, submitting a form, fetching JSON — reduces to this exchange. The
          conversation is <em>stateless</em>: each request–response pair is independent; the server
          does not remember the previous one unless explicitly told to (that is what cookies and
          tokens are for, covered in module 5-3).
        </p>
      ),
      code: `GET /comments HTTP/1.1
Host: api.taproot.example
Accept: application/json

(no body — GET requests do not have one)

---

HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 142

[{"id":1,"author":"Bob","body":"Great post."},
 {"id":2,"author":"Carol","body":"Helpful, thanks."}]`,
      language: "http",
    },
    {
      title: "Methods — derived from what a comment system needs",
      description: (
        <p>
          Every HTTP request carries a <em>method</em> that tells the server the <em>intent</em>{" "}
          of the request. Rather than memorizing a list, derive the methods from the operations a
          comments section needs. To read all comments: the client needs to retrieve data without
          changing anything — that is <strong>GET</strong>. To submit a new comment: the client
          needs to create a new resource — that is <strong>POST</strong>. To correct a typo in your
          own comment: the client needs to partially update an existing resource — that is{" "}
          <strong>PATCH</strong> (or <strong>PUT</strong> if you replace the whole thing). To
          remove a comment: <strong>DELETE</strong>. The server reads the method and knows what
          kind of work to do before it even looks at the body.
        </p>
      ),
      code: `// HTTP method   | What it means       | Comment-system mapping
// ---------------+-----------------------+-------------------------
// GET            | Read                 | Fetch all comments
// POST           | Create               | Submit a new comment
// PATCH          | Partial update       | Edit your comment body
// PUT            | Full replacement     | Replace the whole comment
// DELETE         | Delete               | Remove a comment

// Safe methods (GET) should never change server state.
// Idempotent methods (GET, PUT, DELETE) can be called
// multiple times with the same result.`,
      language: "javascript",
    },
    {
      title: "Status codes — the server's one-word reply",
      description: (
        <p>
          A <em>status code</em> is a three-digit number the server sends back to summarize what
          happened. The first digit is the category. <strong>1xx</strong> — informational (rarely
          seen). <strong>2xx</strong> — success, everything worked. <strong>3xx</strong> — redirect,
          look somewhere else. <strong>4xx</strong> — the client made a mistake (wrong URL, missing
          auth, bad input). <strong>5xx</strong> — the server made a mistake. The mnemonic:{" "}
          4xx is <em>you</em>, 5xx is <em>me</em> (the server). Knowing the category tells you who
          to blame and where to look when something goes wrong.
        </p>
      ),
      code: `// Category  | Example codes  | What it means
// ----------+----------------+----------------------------------
// 2xx ok    | 200 OK         | GET succeeded — body has the data
//           | 201 Created    | POST succeeded — new resource made
//           | 204 No Content | DELETE succeeded — no body to return
// 3xx redir | 301 Moved Perm | Resource has a new permanent URL
//           | 302 Found      | Temporary redirect
// 4xx you   | 400 Bad Request    | Malformed JSON in POST body
//           | 401 Unauthorized   | Missing or invalid auth token
//           | 403 Forbidden      | Valid token but no permission
//           | 404 Not Found      | No comment with that ID
// 5xx me    | 500 Internal Error | Server crashed handling request
//           | 502 Bad Gateway    | Upstream service unreachable
//           | 503 Unavailable    | Server overloaded or in maintenance

// Comment-system matrix:
//   GET /comments         -> 200 | 404 (no comments yet)
//   POST /comments        -> 201 | 400 (invalid body) | 401 (not logged in)
//   PATCH /comments/:id   -> 200 | 403 (not your comment) | 404
//   DELETE /comments/:id  -> 204 | 403 | 404`,
      language: "javascript",
    },
    {
      title: "The fetch API — Promises for HTTP",
      description: (
        <p>
          The browser exposes <em>fetch</em> as the modern way to send HTTP requests from
          JavaScript. Calling <code>fetch(url, options)</code> returns a Promise that resolves with
          a <code>Response</code> object when the server finishes sending headers. The{" "}
          <code>Response</code> has <code>.status</code> (the number), <code>.statusText</code>,{" "}
          <code>.ok</code> (a boolean: <code>true</code> if the status is 200–299),{" "}
          <code>.headers</code>, and body-reading methods. Reading the body is also async:{" "}
          <code>await response.json()</code> waits for the full body, then parses it as JSON.
          The <code>options</code> object controls method, headers, and body. For requests that
          send data (POST, PATCH, PUT) you must also set <code>Content-Type: application/json</code>{" "}
          so the server knows how to parse the body.
        </p>
      ),
      code: `// POST a new comment
async function postComment(postId, author, body) {
  const res = await fetch(\`https://api.taproot.example/posts/\${postId}/comments\`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept":        "application/json",
      // Authorization header would go here (module 5-3)
    },
    body: JSON.stringify({ author, body }),
  });

  // Response object properties
  console.log(res.status);     // e.g. 201
  console.log(res.ok);         // true if 200-299
  console.log(res.statusText); // "Created"

  // Body must be read explicitly — it is a stream
  const created = await res.json(); // waits for full body, parses JSON
  return created;
}`,
      language: "javascript",
    },
    {
      title: "The fetch gotcha — 404 does not throw",
      description: (
        <p>
          This surprises almost every developer who meets <em>fetch</em> for the first time:{" "}
          <code>fetch</code> only rejects its Promise on a <em>network failure</em> — DNS
          cannot resolve the host, no internet connection, the request was aborted. A 404 or a 500
          from the server is <em>not</em> a network failure — the server responded; it just
          responded with bad news. So a 404 resolves the Promise with a{" "}
          <code>Response</code> where <code>response.ok === false</code>. If you forget to
          check <code>.ok</code>, your code happily calls <code>response.json()</code> on an
          HTML error page and silently renders garbage — or throws a JSON parse error with no
          useful message. Always check <code>response.ok</code> before reading the body.
        </p>
      ),
      code: `// WRONG — 404/500 silently continues
async function loadCommentsWrong(postId) {
  const res = await fetch(\`/comments/\${postId}\`);
  const data = await res.json(); // no error check — if 404, this parses HTML as JSON
  renderComments(data);          // 'data' might be an error page object
}

// CORRECT — explicit check before reading the body
async function loadCommentsRight(postId) {
  const res = await fetch(\`/comments/\${postId}\`);
  if (!res.ok) {
    throw new Error(\`HTTP \${res.status} — \${res.statusText}\`);
  }
  const data = await res.json(); // only reached on 2xx
  renderComments(data);
}

// Caller wraps in try/catch to handle both network errors and HTTP errors
try {
  await loadCommentsRight("hello-world");
} catch (err) {
  showError(err.message);
}`,
      language: "javascript",
    },
    {
      title: "CORS — the browser is the gate",
      description: (
        <p>
          The page at <code>https://taproot.local</code> tries to <code>fetch</code> from{" "}
          <code>https://api.taproot.example</code>. These two URLs have different{" "}
          <em>origins</em> (different host). The browser&apos;s{" "}
          <em>same-origin policy</em> forbids a page from reading responses from a different
          origin — not to protect the server, but to protect the <em>user</em>: without it, any
          script on any website could silently read your bank balance. The browser sends the
          request (so simple GETs do cross the network — the server sees them), but it refuses to
          give your JavaScript the response body unless the server explicitly opts in via a{" "}
          <em>CORS</em> header. For non-simple requests (those with custom headers or bodies), the
          browser first sends an <em>preflight</em> — an <code>OPTIONS</code> request asking the
          server&apos;s permission before the real request is even attempted. The fix is always on
          the <em>server</em>: the client cannot grant itself permission.
        </p>
      ),
      code: `// DevTools error you see in the console:
// Access to fetch at 'https://api.taproot.example/comments'
// from origin 'https://taproot.local' has been blocked by CORS policy:
// No 'Access-Control-Allow-Origin' header is present on the requested resource.

// ---- SERVER SIDE FIX (e.g. Express.js) ----
// The server must set these response headers:

app.use((req, res, next) => {
  // Allow requests from this specific origin (or '*' for public APIs)
  res.setHeader("Access-Control-Allow-Origin", "https://taproot.local");

  // Required for preflight (OPTIONS) requests
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle the OPTIONS preflight request directly
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

// ---- CLIENT SIDE (no change needed) ----
// The browser sends the request; the server grants permission.
// You cannot fix CORS from JavaScript — the fix is on the server.`,
      language: "javascript",
    },
    {
      title: "AbortController — cancelling an in-flight request",
      description: (
        <p>
          When the user navigates away while a <code>fetch</code> is still in flight, the browser
          will eventually resolve the Promise — but the component that was waiting for it may no
          longer exist. In the best case that is wasted bandwidth; in the worst case it is a race
          condition where a slow response overwrites a fast one. An{" "}
          <em>AbortController</em> lets you cancel the request explicitly. You create one, pass its{" "}
          <code>signal</code> into <code>fetch</code>, and call <code>abort()</code> when you want
          to cancel. The fetch Promise then rejects with an <code>AbortError</code>. You must
          handle that error separately — it is intentional, not a failure, and users should not see
          a scary &quot;request failed&quot; message when they simply navigated away.
        </p>
      ),
      code: `// assets/comments.js — refined version for taproot-blog/static/
//
// Server-side CORS configuration required for cross-origin use:
//   Access-Control-Allow-Origin: https://taproot.local
//   Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS
//   Access-Control-Allow-Headers: Content-Type, Authorization
//   Handle OPTIONS preflight with 204 No Content

const toggleBtn       = document.querySelector(".js-toggle-comments");
const commentsSection = document.querySelector(".js-comments");

// NOTE: state-vs-DOM divergence preserved from module 2-1 — see module 4-1.
// This variable is set once from the DOM attribute; if anything else updates
// the attribute later, this JS variable and the DOM will disagree.
let commentCount = parseInt(commentsSection?.dataset.count ?? "0", 10);

let commentsLoaded = false;
let abortController = null;

async function fetchComments() {
  // Cancel any previous in-flight request before starting a new one
  if (abortController) abortController.abort();
  abortController = new AbortController();

  commentsSection.classList.add("is-loading");
  commentsSection.textContent = "Loading comments...";

  try {
    const res = await fetch("/assets/comments.json", {
      signal: abortController.signal,
    });

    if (!res.ok) throw new Error("HTTP " + res.status);

    const comments = await res.json();

    commentsSection.textContent = "";
    comments.forEach(function (c) {
      const item   = document.createElement("div");
      item.className = "comment";
      const author = document.createElement("p");
      author.className  = "author";
      author.textContent = c.author;
      const body   = document.createElement("p");
      body.className  = "body";
      body.textContent = c.body;
      item.appendChild(author);
      item.appendChild(body);
      commentsSection.appendChild(item);
    });

    commentsLoaded = true;
    // NOTE: state-vs-DOM divergence — commentCount still reflects the
    // initial data-count attribute, not the loaded comments array length.
    console.log("JS commentCount:", commentCount, "| loaded:", comments.length);
  } catch (err) {
    if (err.name === "AbortError") return; // intentional cancel — not an error
    commentsSection.textContent = "Could not load comments: " + err.message;
  } finally {
    commentsSection.classList.remove("is-loading");
    abortController = null;
  }
}

if (toggleBtn && commentsSection) {
  toggleBtn.addEventListener("click", async function handleToggle() {
    const isOpen = commentsSection.classList.toggle("is-open");
    toggleBtn.textContent = isOpen ? "Hide comments" : "Show comments";

    if (isOpen && !commentsLoaded) {
      await fetchComments();
    } else if (!isOpen && abortController) {
      abortController.abort(); // user closed section before load finished
    }
  });
}`,
      language: "javascript",
    },
  ];

  const unsafeResponseCode = `async function loadComments(postId) {
  const res = await fetch(\`/comments/\${postId}\`);
  // No .ok check — this will try to parse a 404 HTML page as JSON
  const data = await res.json();
  renderComments(data);
}`;

  const safeResponseCode = `async function loadComments(postId) {
  const res = await fetch(\`/comments/\${postId}\`);
  if (!res.ok) {
    throw new Error(\`HTTP \${res.status} — \${res.statusText}\`);
  }
  const data = await res.json(); // only reached on 2xx responses
  renderComments(data);
}`;

  const playgroundHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>fetch demo — Taproot comments</title>
  <style>
    body { margin: 0; font: 16px/1.6 system-ui, sans-serif;
           background: #fafafa; color: #1a1a1a; padding: 1.5rem; }
    button { padding: .5rem 1.2rem; margin-right: .5rem; margin-bottom: .5rem;
             cursor: pointer; background: #5b21b6; color: white;
             border: none; border-radius: .375rem; font-size: .9rem; }
    button.secondary { background: #6b7280; }
    #status { font-size: .875rem; color: #555; margin-bottom: .5rem; min-height: 1.5rem; }
    #output { background: #0f172a; color: #86efac; font-family: monospace;
              font-size: .85rem; padding: 1rem; border-radius: .375rem;
              min-height: 120px; white-space: pre-wrap; margin-top: .75rem; }
  </style>
</head>
<body>
  <p id="status">Click a button to run a fetch.</p>
  <button id="btn-ok">Fetch existing file (200 OK)</button>
  <button id="btn-missing" class="secondary">Fetch missing file (404)</button>
  <button id="btn-abort">Fetch then abort after 50ms</button>
  <div id="output">Output will appear here...</div>
</body>
</html>`;

  const playgroundJs = `// Try this: switch the URL to a non-existent path and inspect why
// response.ok is false but await fetch(...) did not throw.
//
// The "Fetch missing file (404)" button already does this —
// watch how the unsafe path silently tries to parse the HTML
// error page as JSON, while the safe path throws a clear error.

const status = document.getElementById("status");
const output = document.getElementById("output");

function log(msg) {
  output.textContent += msg + "\\n";
}

function clear() {
  output.textContent = "";
}

// Button 1: fetch a file that exists — happy path
document.getElementById("btn-ok").addEventListener("click", async function () {
  clear();
  status.textContent = "Fetching /index.html...";
  try {
    const res = await fetch("/index.html");
    log("response.ok    : " + res.ok);
    log("response.status: " + res.status);
    log("fetch resolved (not rejected) on success");
    const text = await res.text();
    log("body length    : " + text.length + " chars");
    status.textContent = "Done — 200 OK.";
  } catch (err) {
    log("fetch REJECTED: " + err.message);
    status.textContent = "Error: " + err.message;
  }
});

// Button 2: fetch a path that does not exist — the key gotcha
document.getElementById("btn-missing").addEventListener("click", async function () {
  clear();
  status.textContent = "Fetching /this-does-not-exist.json...";
  try {
    const res = await fetch("/this-does-not-exist.json");
    log("response.ok    : " + res.ok);       // false!
    log("response.status: " + res.status);   // 404
    log("fetch RESOLVED (not rejected) on 404 — this is the gotcha");

    // Unsafe: try to parse the 404 HTML page as JSON
    log("--- unsafe path: calling res.json() on a 404 ---");
    try {
      const data = await res.json();
      log("parsed data: " + JSON.stringify(data));
    } catch (parseErr) {
      log("JSON parse error: " + parseErr.message);
      log("(the 404 body was HTML, not JSON)");
    }

    // Safe: check .ok first
    log("--- safe path: checking res.ok before parsing ---");
    if (!res.ok) {
      log("throwing error because res.ok is false");
      throw new Error("HTTP " + res.status + " — " + res.statusText);
    }
  } catch (err) {
    if (err.message.startsWith("HTTP")) {
      log("caught expected HTTP error: " + err.message);
    }
    status.textContent = "Handled error: " + err.message;
  }
});

// Button 3: AbortController in action
document.getElementById("btn-abort").addEventListener("click", async function () {
  clear();
  status.textContent = "Fetching, then aborting after 50ms...";
  const ac = new AbortController();
  setTimeout(function () { ac.abort(); }, 50);
  try {
    const res = await fetch("/index.html", { signal: ac.signal });
    log("fetch resolved (abort was too slow): status " + res.status);
    status.textContent = "Resolved before abort fired.";
  } catch (err) {
    log("caught error: " + err.name + " — " + err.message);
    if (err.name === "AbortError") {
      log("intentional cancel — not a real error, no scary message for the user");
      status.textContent = "Request aborted (intentional).";
    } else {
      log("real network error");
      status.textContent = "Network error: " + err.message;
    }
  }
});`;

  const playgroundCss = `/* Styles are in the HTML <style> block. */`;

  const gotchaItems = [
    {
      title: "fetch does not reject on 4xx or 5xx — only on network failure. Always check response.ok",
      body: (
        <>
          A <code>fetch</code> to a URL that returns 404 or 500 <em>resolves</em> its Promise with
          a <code>Response</code> object where <code>response.ok === false</code>. It does{" "}
          <em>not</em> throw. If you skip the <code>.ok</code> check and call{" "}
          <code>response.json()</code> on an HTML error page, you get a silent JSON parse error —
          or worse, you silently render garbage. Every <code>fetch</code> call needs an explicit{" "}
          <code>if (!res.ok) throw ...</code> before reading the body.
        </>
      ),
    },
    {
      title: "CORS is a browser policy — curl works fine because curl is not a browser",
      body: (
        <>
          If you <code>curl https://api.taproot.example/comments</code> from your terminal, you get
          the response back with no complaints. The server is not blocking you — it has no idea
          about CORS. CORS is enforced by the browser&apos;s <em>same-origin policy</em>, which
          only applies to JavaScript running inside a browser page. Terminals, servers, and API
          clients do not implement it. When &quot;it works in curl but not in the browser,&quot; the
          fix is on the <em>server</em>: it needs to send{" "}
          <code>Access-Control-Allow-Origin</code>.
        </>
      ),
    },
    {
      title: "A simple GET is sent cross-origin — only the response is blocked by CORS",
      body: (
        <>
          The browser&apos;s <em>same-origin policy</em> is a <em>read</em> restriction, not a{" "}
          <em>send</em> restriction. For simple requests (GET, POST with plain-text content type),
          the browser sends the request across origins and the server processes it — the response
          just never reaches your JavaScript. This matters: a malicious page can trigger side
          effects on a server (a GET that increments a view counter, a POST that&apos;s actually a
          state change) even without CORS headers. CORS unblocks reading the response; it does not
          prevent the request from reaching the server.
        </>
      ),
    },
    {
      title: "An AbortError is an intentional cancel — handle it separately from real failures",
      body: (
        <>
          When you call <code>ac.abort()</code>, the <code>fetch</code> Promise rejects with a{" "}
          <code>DOMException</code> whose <code>name</code> is <code>&quot;AbortError&quot;</code>.
          If your generic <code>catch</code> block shows an error to the user, an intentional
          navigation cancel will look like a failure. Always check{" "}
          <code>if (err.name === &apos;AbortError&apos;) return;</code> before showing error UI.
          This is especially important in single-page apps where the user switches tabs quickly and
          multiple fetches may be in flight.
        </>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-3xl font-bold">Talking to Another Machine</h1>
        <RoadmapLink url="https://roadmap.sh/frontend" />
      </div>

      {/* Section 1: Hook */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            Module 2-2 ended with a working <code>fetchComments()</code> function that loaded
            comments from <code>/assets/comments.json</code> — a file shipped with the static blog
            itself. That works as a demo. Real comments, however, live on a server someone else
            operates. The first instinct: change one line.
          </p>
          <div className="bg-slate-900 text-slate-100 rounded p-4 font-mono text-sm mb-4 overflow-x-auto leading-relaxed">
            <div className="text-slate-400">{"// Before — reading a local file"}</div>
            <div>
              <span className="text-blue-400">const</span>
              <span className="text-slate-300"> res = </span>
              <span className="text-blue-400">await</span>
              <span className="text-slate-300"> fetch(</span>
              <span className="text-amber-300">&quot;/assets/comments.json&quot;</span>
              <span className="text-slate-300">);</span>
            </div>
            <div className="mt-2 text-slate-400">{"// After — pointing at the real API"}</div>
            <div>
              <span className="text-blue-400">const</span>
              <span className="text-slate-300"> res = </span>
              <span className="text-blue-400">await</span>
              <span className="text-slate-300"> fetch(</span>
              <span className="text-amber-300">
                &quot;https://api.taproot.example/comments&quot;
              </span>
              <span className="text-slate-300">);</span>
            </div>
          </div>
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            Open the browser. Click &quot;Show comments.&quot; The Network tab shows the request
            went out — it came back <strong>200 OK</strong>. The server responded. But the console
            is red:
          </p>
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded p-4 font-mono text-sm text-red-700 dark:text-red-300 mb-4">
            Access to fetch at &apos;https://api.taproot.example/comments&apos; from origin
            &apos;https://taproot.local&apos; has been blocked by CORS policy: No
            &apos;Access-Control-Allow-Origin&apos; header is present on the requested resource.
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            The <code>fetch</code> call returned. The network request completed. The response body
            is sitting in memory. But the browser is refusing to hand it to your JavaScript. The
            server did nothing wrong. The fix is not in your frontend code. What is the browser
            protecting, why is it doing this, and which side needs to change to unblock it?
          </p>
        </CardContent>
      </Card>

      {/* Section 2: Mental model */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            Before reaching CORS, step back to the foundation. Every <code>fetch</code> call is
            the browser&apos;s way of starting an <em>HTTP</em> conversation with a server.{" "}
            <em>HTTP</em> is a stateless, text-based protocol: the client sends a request (a
            method, a path, headers, an optional body) and the server sends back a response (a
            status code, headers, a body). Each exchange is independent — the server remembers
            nothing between requests unless you explicitly carry state forward (in a token or a
            cookie). That independence is both the simplicity and the power of the web.
          </p>
          <blockquote className="border-l-4 border-blue-500 pl-4 italic text-slate-600 dark:text-slate-400">
            HTTP is a stateless conversation.
          </blockquote>
        </CardContent>
      </Card>

      {/* Section 3: Step-by-step */}
      <h2 className="text-xl font-semibold mb-3">
        From raw HTTP bytes to fetch, CORS, and cancellation
      </h2>
      <StepByStepExplanation
        title="Deriving the fetch API from the HTTP protocol"
        description="Each step adds one concept needed to send a real request, handle the response safely, get past CORS, and clean up when the user navigates away."
        steps={httpToFetchSteps}
      />

      {/* Optional: status-code matrix table */}
      {/* Optional: status-code matrix table */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">
            Status-code category reference
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800">
                  <th className="text-left px-3 py-2 border border-slate-200 dark:border-slate-700 font-semibold">
                    Category
                  </th>
                  <th className="text-left px-3 py-2 border border-slate-200 dark:border-slate-700 font-semibold">
                    Range
                  </th>
                  <th className="text-left px-3 py-2 border border-slate-200 dark:border-slate-700 font-semibold">
                    Common codes
                  </th>
                  <th className="text-left px-3 py-2 border border-slate-200 dark:border-slate-700 font-semibold">
                    Who to blame
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-3 py-2 border border-slate-200 dark:border-slate-700">
                    Informational
                  </td>
                  <td className="px-3 py-2 border border-slate-200 dark:border-slate-700 font-mono">
                    1xx
                  </td>
                  <td className="px-3 py-2 border border-slate-200 dark:border-slate-700 text-slate-500">
                    Rarely visible to app code
                  </td>
                  <td className="px-3 py-2 border border-slate-200 dark:border-slate-700 text-slate-500">
                    —
                  </td>
                </tr>
                <tr className="bg-green-50 dark:bg-green-950/20">
                  <td className="px-3 py-2 border border-slate-200 dark:border-slate-700">
                    Success
                  </td>
                  <td className="px-3 py-2 border border-slate-200 dark:border-slate-700 font-mono">
                    2xx
                  </td>
                  <td className="px-3 py-2 border border-slate-200 dark:border-slate-700 font-mono text-xs">
                    200, 201, 204
                  </td>
                  <td className="px-3 py-2 border border-slate-200 dark:border-slate-700 text-green-700 dark:text-green-400">
                    Nobody — it worked
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 border border-slate-200 dark:border-slate-700">
                    Redirect
                  </td>
                  <td className="px-3 py-2 border border-slate-200 dark:border-slate-700 font-mono">
                    3xx
                  </td>
                  <td className="px-3 py-2 border border-slate-200 dark:border-slate-700 font-mono text-xs">
                    301, 302
                  </td>
                  <td className="px-3 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                    Look somewhere else
                  </td>
                </tr>
                <tr className="bg-amber-50 dark:bg-amber-950/20">
                  <td className="px-3 py-2 border border-slate-200 dark:border-slate-700">
                    Client error
                  </td>
                  <td className="px-3 py-2 border border-slate-200 dark:border-slate-700 font-mono">
                    4xx
                  </td>
                  <td className="px-3 py-2 border border-slate-200 dark:border-slate-700 font-mono text-xs">
                    400, 401, 403, 404
                  </td>
                  <td className="px-3 py-2 border border-slate-200 dark:border-slate-700 text-amber-700 dark:text-amber-400">
                    You (the client)
                  </td>
                </tr>
                <tr className="bg-red-50 dark:bg-red-950/20">
                  <td className="px-3 py-2 border border-slate-200 dark:border-slate-700">
                    Server error
                  </td>
                  <td className="px-3 py-2 border border-slate-200 dark:border-slate-700 font-mono">
                    5xx
                  </td>
                  <td className="px-3 py-2 border border-slate-200 dark:border-slate-700 font-mono text-xs">
                    500, 502, 503
                  </td>
                  <td className="px-3 py-2 border border-slate-200 dark:border-slate-700 text-red-700 dark:text-red-400">
                    The server (me)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Optional: unsafe vs safe response handling */}
      <CodeComparison
        title="Checking response.ok — unsafe vs safe"
        description="fetch resolves on 4xx and 5xx. The .ok check is the guard that turns a silent failure into a visible error."
        oldCode={{
          title: "Missing .ok check (unsafe)",
          code: unsafeResponseCode,
          language: "javascript",
          cons: [
            "A 404 resolves and proceeds to res.json()",
            "Tries to parse an HTML error page as JSON",
            "Either throws a confusing parse error or renders garbage silently",
          ],
        }}
        newCode={{
          title: "Explicit .ok check (safe)",
          code: safeResponseCode,
          language: "javascript",
          pros: [
            "Any non-2xx status throws immediately with a useful message",
            "res.json() is only called when the body is actually JSON",
            "Caller gets a clear error to display in the UI",
          ],
        }}
      />

      {/* Section 4: Playground */}
      <h2 className="text-xl font-semibold mb-3">Try it yourself</h2>
      <HTMLPlayground
        html={playgroundHtml}
        js={playgroundJs}
        css={playgroundCss}
        title="Live editor — fetch, the .ok gotcha, and AbortController"
        description="Three buttons demonstrate: a successful fetch, a 404 that resolves (the gotcha), and a request that gets aborted intentionally."
      />

      {/* Section 5: Challenges */}
      <h2 className="text-xl font-semibold mb-3">Challenges</h2>

      <Challenge
        title="Method and status for each operation"
        question={`A comment system has four operations: read all comments for a post, submit a new comment, edit the body of an existing comment, and delete a comment. Match the correct HTTP method and expected success status code for submitting a new comment.`}
        options={[
          {
            id: "a",
            text: "POST — 201 Created. POST creates a new resource; 201 signals the resource was created successfully.",
          },
          {
            id: "b",
            text: "POST — 200 OK. POST creates a new resource; 200 is the generic success code.",
          },
          {
            id: "c",
            text: "PUT — 201 Created. PUT is the standard method for creating resources when the client provides the body.",
          },
          {
            id: "d",
            text: "GET — 200 OK. GET retrieves resources; submitting a comment is equivalent to reading the comment list.",
          },
        ]}
        correctAnswerId="a"
        explanation={
          <p>
            <strong>POST</strong> is the standard <em>method</em> for creating a new resource when
            the server assigns the ID. The expected <em>status code</em> on success is{" "}
            <strong>201 Created</strong>, which tells the client a new resource was made —
            distinguished from 200 OK (the generic success code used for reads and updates that
            return a body). PUT is used when the client knows the exact URL of the new resource
            upfront, which is rare for comment creation. GET must never change server state.
          </p>
        }
      />

      <Challenge
        title="Who fixes a CORS error?"
        question={`A page at https://taproot.local runs this code:\n\nconst res = await fetch("https://api.taproot.example/comments");\n\nDevTools shows: "No 'Access-Control-Allow-Origin' header is present on the requested resource."\n\nWhich side needs to change to fix this, and what change is required?`}
        options={[
          {
            id: "a",
            text: "The server. It must add 'Access-Control-Allow-Origin: https://taproot.local' (or *) to its responses. The browser enforces CORS; the server opts in by sending the header.",
          },
          {
            id: "b",
            text: "The client. Add a 'mode: \"no-cors\"' option to the fetch call to disable the CORS check in the browser.",
          },
          {
            id: "c",
            text: "Both sides. The client must send an 'Origin' header and the server must echo it back in 'Access-Control-Allow-Origin'.",
          },
          {
            id: "d",
            text: "Neither side. Install a browser extension that disables CORS checks — this is the standard way to develop against external APIs.",
          },
        ]}
        correctAnswerId="a"
        explanation={
          <p>
            The fix is on the <strong>server</strong>. The browser already sends an{" "}
            <code>Origin</code> header automatically — the client does not need to change. CORS is
            the server <em>opting in</em> to cross-origin reads by sending{" "}
            <code>Access-Control-Allow-Origin</code>. Setting <code>mode: &quot;no-cors&quot;</code>{" "}
            on the client does not fix it — it produces an opaque response that your JavaScript
            still cannot read. Browser extensions disable the enforcement in your local browser
            only, which does not fix anything for real users. The only correct fix is the server
            sending the appropriate CORS headers.
          </p>
        }
      />

      {/* Section 6: GotchaList */}
      <h2 className="text-xl font-semibold mb-3">Things that surprise people</h2>
      <GotchaList items={gotchaItems} />

      {/* Section 7: KeyTakeaways */}
      <KeyTakeaways
        mentalModel="HTTP is a stateless conversation."
        points={[
          <>
            <em>HTTP</em> is a stateless, text-based protocol. A request is a{" "}
            <em>method</em> (GET, POST, PATCH, DELETE) plus headers and an optional body. A
            response is a <em>status code</em> plus headers and a body. Each exchange is
            independent — the server keeps no memory of the previous one.
          </>,
          <>
            <em>fetch</em> sends HTTP requests from JavaScript. <code>await fetch(url, options)</code>{" "}
            resolves with a <code>Response</code> object. Read the body with{" "}
            <code>await res.json()</code> or <code>await res.text()</code>. Always check{" "}
            <code>res.ok</code> first — <code>fetch</code> only rejects on network failure, not on
            4xx or 5xx responses.
          </>,
          <>
            Status codes tell you who to blame. 2xx means success. 4xx means the client made a
            mistake (wrong URL, missing auth, bad input). 5xx means the server failed. The mnemonic:
            4xx is <em>you</em>, 5xx is <em>me</em>.
          </>,
          <>
            <em>CORS</em> errors come from the browser&apos;s <em>same-origin policy</em>, which
            prevents JavaScript from reading responses from a different origin. The browser sends
            the request; the server must send{" "}
            <code>Access-Control-Allow-Origin</code> to let the browser hand the response to your
            JavaScript. The fix is always on the <em>server</em>. Non-simple requests trigger an{" "}
            <em>preflight</em> (<code>OPTIONS</code>) that the server must also handle.
          </>,
          <>
            An <em>AbortController</em> cancels an in-flight <code>fetch</code>. Pass its{" "}
            <code>signal</code> to <code>fetch</code>, call <code>abort()</code> to cancel, and
            handle the resulting <code>AbortError</code> separately from real failures — it is an
            intentional cancel, not a bug.
          </>,
        ]}
      />
    </div>
  );
}
