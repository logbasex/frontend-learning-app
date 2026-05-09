"use client";

import { Card, CardContent } from "@/components/ui/card";
import { HTMLPlayground } from "@/components/CodePlayground";
import { StepByStepExplanation, Step } from "@/components/StepByStepExplanation";
import { SequenceDiagram } from "@/components/SequenceDiagram";
import { Challenge } from "@/components/Challenge";
import { GotchaList } from "@/components/GotchaList";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { RoadmapLink } from "@/components/RoadmapLink";

export function Module_1_2_Content() {
  // Data blocks hoisted out of JSX for readability — listed in render order.
  const httpAnatomySteps: Step[] = [
    {
      title: "Step 1: The request line",
      description: (
        <>
          Every <em>HTTP</em> exchange — the application-layer protocol for client-server requests
          and responses on the web — opens with a single request line: method, path, version. The
          method is the verb that names your intent. The path is the resource on the server you are
          targeting. The version tells the server which dialect of HTTP to speak. All three must be
          present; leave out the method and the server cannot guess what you want.
        </>
      ),
      code: `GET /frontend HTTP/1.1
Host: roadmap.sh

# Broken down:
#   method:  GET           (what you want to do)
#   path:    /frontend     (which resource)
#   version: HTTP/1.1      (protocol dialect)
#   Host:    roadmap.sh    (required in HTTP/1.1 — one IP, many domains)`,
    },
    {
      title: "Step 2: Methods carry intent",
      description: (
        <>
          The <em>HTTP method</em> — the verb in an HTTP request: GET, POST, PUT, PATCH, DELETE,
          HEAD, OPTIONS — tells the server what operation to perform. <code>GET</code> reads a
          resource without side effects. <code>POST</code> creates a new resource. <code>PUT</code>{" "}
          replaces a resource wholesale. <code>PATCH</code> updates selected fields only.{" "}
          <code>DELETE</code> removes the resource. <code>HEAD</code> fetches headers only, no body.{" "}
          <code>OPTIONS</code> asks what methods the server allows (used by CORS preflight). A
          critical distinction: GET, PUT, DELETE, HEAD, and OPTIONS are <em>idempotent</em> — a
          method whose result is the same whether called once or many times — while POST and PATCH
          are not, which is why double-clicking a submit button can create two records.
        </>
      ),
      code: `# GET  — read; safe, idempotent
GET  /users/42

# POST — create; NOT idempotent (double-submit = double record)
POST /users

# PUT  — replace wholesale; idempotent
PUT  /users/42

# PATCH — partial update; NOT idempotent in general
PATCH /users/42

# DELETE — remove; idempotent
DELETE /users/42

# HEAD — headers only, no body; idempotent
HEAD /users/42

# OPTIONS — preflight (CORS); idempotent
OPTIONS /users`,
    },
    {
      title: "Step 3: Headers are metadata",
      description: (
        <>
          An <em>HTTP header</em> — a <code>Name: value</code> line of metadata sent with a request
          or response — travels after the request line, one per line, and ends at a blank line.
          Headers carry everything the server needs to serve you correctly: <code>Host</code> names
          the target domain, <code>Accept</code> tells the server which content types you can handle,{" "}
          <code>Content-Type</code> describes the body you are sending, <code>Authorization</code>{" "}
          carries a credential, <code>Cookie</code> auto-attaches stored cookies, and{" "}
          <code>Cache-Control</code> / <code>If-None-Match</code> drive caching. You cannot put
          logic in a header — only key-value strings — but that constraint is what makes HTTP so
          composable.
        </>
      ),
      code: `GET /api/feed HTTP/1.1
Host: api.example.com
Accept: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
Cookie: session=abc123; theme=dark
Cache-Control: no-cache
If-None-Match: "etag-abc"

# Server response headers
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Cache-Control: max-age=60
Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Strict
ETag: "etag-abc"`,
    },
    {
      title: "Step 4: Status codes are categories",
      description: (
        <>
          The <em>HTTP status code</em> — a 3-digit response code: 1xx info, 2xx success, 3xx
          redirect, 4xx client error, 5xx server error — is the first thing you read in a response.
          The first digit tells you whose problem it is: 4xx means the client sent something wrong
          (bad URL, missing auth, malformed body); 5xx means the server understood the request but
          could not fulfill it. You will see 1xx rarely (used for server-push hints). 3xx redirects
          drive you to a new location. 2xx is the success family. Reading the first digit is
          usually enough to know where to start debugging.
        </>
      ),
      code: `# 1xx — Informational (rare in everyday code)
100 Continue        # server says "keep sending the body"
101 Switching Protocols  # WebSocket upgrade ack

# 2xx — Success
200 OK              # standard success with body
201 Created         # POST succeeded; check Location header
204 No Content      # success, no body (common for DELETE)

# 3xx — Redirect
301 Moved Permanently   # change your bookmark
302 Found               # temporary; keep original URL
304 Not Modified        # cache is valid, no new body

# 4xx — Client error (your bug)
400 Bad Request     # malformed request
401 Unauthorized    # missing or invalid credentials
403 Forbidden       # authenticated but not allowed
404 Not Found       # resource does not exist
422 Unprocessable Entity  # validation failed

# 5xx — Server error (their bug)
500 Internal Server Error  # unhandled exception
502 Bad Gateway            # upstream server returned garbage
503 Service Unavailable    # overloaded or down for maintenance`,
    },
    {
      title: "Step 5: The response",
      description: (
        <>
          The response mirrors the request: a status line (version + code + reason phrase), response
          headers, a blank line, and an optional body. The server uses{" "}
          <code>Content-Type</code> to tell you how to parse the body. It may send a{" "}
          <em>cookie</em> — a small key-value pair the server sends via <code>Set-Cookie</code> and
          the browser auto-attaches to subsequent requests — to remember state across the stateless
          exchange. The <em>HTTP cache</em> — a store that holds copies of responses and serves them
          without re-fetching when valid — is driven by response headers like{" "}
          <code>Cache-Control</code>, <code>ETag</code>, and <code>Expires</code>. Understanding
          the response shape lets you read raw network traffic and know immediately what went wrong.
        </>
      ),
      code: `HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Content-Encoding: gzip
Cache-Control: public, max-age=3600
ETag: "xyz789"
Set-Cookie: visited=1; Path=/; HttpOnly; Secure

<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Frontend Developer Roadmap</title>
  </head>
  <body>
    <h1>Frontend Developer</h1>
  </body>
</html>`,
    },
    {
      title: "Step 6: HTTPS = HTTP over TLS",
      description: (
        <>
          <em>HTTPS</em> — HTTP carried over a TLS-encrypted TCP connection — is not a different
          protocol. Every method, every status code, every header you just read works identically
          over HTTPS. The only difference is that before the first HTTP byte flows, the client and
          server perform a <em>TLS handshake</em> — the negotiation that exchanges cipher choice,
          server certificate, and key material; one extra RTT in TLS 1.3. A{" "}
          <em>certificate (TLS)</em> — a signed document binding a public key to a domain name,
          issued by a Certificate Authority — lets the browser verify it is talking to the real
          server and not an impostor. A{" "}
          <em>Certificate Authority (CA)</em> — a trusted issuer of TLS certificates whose root
          keys are bundled in browsers and operating systems — is the third party everyone has
          agreed to trust. The result: your HTTP conversation is encrypted and the server&apos;s
          identity is verified, at the cost of one extra round-trip.
        </>
      ),
      code: `# HTTP (port 80) — plaintext, anyone on the network can read it
GET /login HTTP/1.1
Host: example.com

# HTTPS (port 443) — TCP + TLS, then HTTP inside the encrypted tunnel
# The HTTP looks identical; the network layer is different

$ openssl s_client -connect example.com:443 2>&1 | grep -E "Protocol|Cipher"
Protocol  : TLSv1.3
Cipher    : TLS_AES_256_GCM_SHA384

# Certificate chain:
#  CN = example.com
#    issuer: Let's Encrypt   (a trusted CA)`,
    },
  ];

  const playgroundHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>HTTP Methods Demo</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <h2>HTTP method explorer</h2>
  <p class="hint">Open DevTools &rarr; Network. Click GET, then POST, then DELETE.<br>
    Watch the request line and headers change while the base URL stays the same.</p>
  <div class="btn-row">
    <button id="btn-get">GET /get</button>
    <button id="btn-post">POST /post</button>
    <button id="btn-delete">DELETE /delete</button>
  </div>
  <pre id="output" class="output">Response will appear here&hellip;</pre>
  <script src="/script.js"></script>
</body>
</html>`;

  const playgroundCss = `body {
  font-family: system-ui, sans-serif;
  max-width: 680px;
  margin: 24px auto;
  padding: 0 16px;
  color: #1e293b;
}
h2 { margin-bottom: 4px; font-size: 1.1rem; }
.hint { font-size: 0.82rem; color: #64748b; margin-bottom: 16px; }
.btn-row { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
button {
  padding: 8px 18px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
}
#btn-get    { background: #16a34a; }
#btn-post   { background: #2563eb; }
#btn-delete { background: #dc2626; }
#btn-get:hover    { background: #15803d; }
#btn-post:hover   { background: #1d4ed8; }
#btn-delete:hover { background: #b91c1c; }
button:disabled { background: #94a3b8 !important; cursor: not-allowed; }
.output {
  background: #0f172a;
  color: #e2e8f0;
  padding: 16px;
  border-radius: 8px;
  font-family: monospace;
  font-size: 0.78rem;
  min-height: 120px;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-all;
}`;

  const playgroundJs = `// Try this: open DevTools → Network. Click GET, then POST, then DELETE.
// Watch the request line and headers change while the URL stays the same.
// Then change \`https://httpbin.org/get\` to \`httpbin.org/status/418\` and see
// the request come back with status 418 — methods and paths are independent.

async function callMethod(url, method) {
  const out = document.getElementById('output');
  const allBtns = document.querySelectorAll('button');
  allBtns.forEach(b => b.disabled = true);

  out.textContent = method + ' ' + url + ' ...';

  try {
    const options = method === 'GET' ? {} : {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ demo: true }),
    };
    const res = await fetch(url, options);
    const data = await res.json();
    out.textContent =
      '→ ' + method + ' ' + url + '\\n' +
      '← ' + res.status + ' ' + res.statusText + '\\n\\n' +
      JSON.stringify(data, null, 2);
  } catch (err) {
    out.textContent = 'Error: ' + (err instanceof Error ? err.message : String(err));
  } finally {
    allBtns.forEach(b => b.disabled = false);
  }
}

document.getElementById('btn-get').addEventListener('click', () => {
  callMethod('https://httpbin.org/get', 'GET');
});
document.getElementById('btn-post').addEventListener('click', () => {
  callMethod('https://httpbin.org/post', 'POST');
});
document.getElementById('btn-delete').addEventListener('click', () => {
  callMethod('https://httpbin.org/delete', 'DELETE');
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
              Every API call you have ever made, every page that has ever loaded, every form that
              has ever submitted — all of it is the same three-act conversation. Method, path,
              headers, body. Method, path, headers, body. A few hundred billion times a day. The
              words change; the shape never does.
            </p>
            <p>
              By the end of this module you will be able to read a raw HTTP exchange and know
              immediately what it is asking, what the response means, and — when something goes
              wrong — whether to look at the client or the server.
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
              HTTP carries no memory between requests. The server does not know you sent a request
              five seconds ago. Every exchange is a self-contained question and answer: the client
              includes everything the server needs — path, credentials, acceptable formats — in the
              request itself. The server replies with a status code, some headers, and a body, then
              immediately forgets you exist. Cookies and sessions are application-level workarounds
              layered on top of this stateless foundation, not features of HTTP itself. Internalizing
              that statelessness explains nearly every surprising behavior you will encounter when
              building web applications.
            </p>
            <blockquote className="border-l-4 border-blue-500 pl-4 italic">
              &quot;HTTP is a stateless conversation: the client asks, the server answers, and
              neither side remembers anything between requests.&quot;
            </blockquote>
          </div>
        </CardContent>
      </Card>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 3: Step-by-step                                               */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <StepByStepExplanation
        title="Anatomy of an HTTP exchange"
        description="Method, path, headers, body — on the way out and on the way back"
        steps={httpAnatomySteps}
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 4: Live playground                                            */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <HTMLPlayground
        html={playgroundHtml}
        css={playgroundCss}
        js={playgroundJs}
        title="HTTP method explorer"
        description="Click each button to fire a real GET, POST, and DELETE. Watch the Network panel — same URL base, different method, different behavior."
      />

      {/* Optional: Sequence diagram (a single HTTPS request) */}
      <SequenceDiagram
        title="A single HTTPS request"
        description="The same conversation, end to end"
        actors={["Browser", "Server"]}
        messages={[
          { from: "Browser", to: "Server", label: "TCP SYN", note: "open the channel" },
          { from: "Server", to: "Browser", label: "SYN-ACK" },
          { from: "Browser", to: "Server", label: "ACK + ClientHello", note: "TLS begins" },
          { from: "Server", to: "Browser", label: "ServerHello + Cert" },
          { from: "Browser", to: "Server", label: "GET /frontend HTTP/1.1", note: "encrypted" },
          { from: "Server", to: "Browser", label: "200 OK + body" },
        ]}
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 5: Challenges                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Challenge
        question="Your front end has a 'mark all notifications as read' button. Which HTTP method best fits?"
        options={[
          { id: "a", text: "GET /notifications/mark-all-read" },
          { id: "b", text: "POST /notifications/mark-all-read" },
          { id: "c", text: 'PUT /notifications/read-state with body {"all": true}' },
          { id: "d", text: "DELETE /notifications" },
        ]}
        correctAnswerId="c"
        explanation={
          <>
            The action sets the read-state of a resource to a specific value, so PUT (replace) fits
            the <em>idempotent</em> shape — clicking twice does the same thing as clicking once.
            GET must never have side effects, so option a violates that rule. POST works but is
            non-idempotent and is best reserved for create-style operations where you want a new
            resource each time. DELETE removes the notifications entirely, which is not what was
            asked.
          </>
        }
      />

      <Challenge
        question="Your fetch returns 503 Service Unavailable. Whose bug is it?"
        options={[
          { id: "a", text: "The client's — the request was malformed." },
          { id: "b", text: "The server's — it is temporarily unable to handle the request." },
          { id: "c", text: "The DNS layer's — the hostname did not resolve." },
          { id: "d", text: "The browser cache's — a stale entry was returned." },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            5xx codes are the server saying the request was understood but it cannot fulfill it
            right now. 4xx codes blame the client — bad request, unauthorized, not found. DNS
            failures surface as a different class of error entirely (<code>ENOTFOUND</code>,
            connection refused) and never reach the HTTP layer. A stale cache entry would return
            whatever the cached status was — typically a 2xx — not a 5xx from the origin.
          </>
        }
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 6: GotchaList                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <GotchaList
        items={[
          {
            title: "Status codes 1xx and 3xx exist but most apps never see them",
            body: (
              <>
                Browsers handle 3xx redirects automatically and transparently — your{" "}
                <code>fetch()</code> call resolves at the final destination unless you pass{" "}
                <code>redirect: &quot;manual&quot;</code>. 1xx codes are an HTTP/2 server-push
                mechanism; almost no application code touches them. Know they exist so a 307 in
                your network tab does not surprise you, but do not design for them.
              </>
            ),
          },
          {
            title: "POST is not idempotent — refresh prompts a 'resubmit form?' dialog for exactly this reason",
            body: (
              <>
                When you refresh a page after a POST, the browser warns you because re-sending the
                POST could create a duplicate resource. GET and PUT are safe to replay; POST is not.
                The standard fix is the Post/Redirect/Get pattern: after a successful POST, redirect
                to a GET endpoint so a refresh just re-fetches the result page without resubmitting.
              </>
            ),
          },
          {
            title: "Cookies are sent automatically — that is both their strength and the source of CSRF",
            body: (
              <>
                A <em>cookie</em> — a small key-value pair the server sends via{" "}
                <code>Set-Cookie</code> and the browser auto-attaches to subsequent requests — is
                attached to every matching request without any JavaScript involved. That automation
                is what makes sessions convenient, but it also means an attacker&apos;s page can
                trigger requests that carry your cookies. <code>SameSite=Strict</code> is the
                modern defense.
              </>
            ),
          },
          {
            title: "HTTPS does not certify the site, only the domain — the certificate proves you are talking to whoever controls the DNS, not that the operator is trustworthy",
            body: (
              <>
                A valid TLS certificate means the connection to <code>evil-bank.com</code> is
                encrypted and you really are talking to whoever controls <code>evil-bank.com</code>.
                It says nothing about whether that operator is legitimate. Phishing sites routinely
                carry valid certificates. The padlock icon means &quot;nobody can read this in
                transit&quot; — not &quot;this site is safe.&quot;
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
            HTTP is method + path + headers + (optional) body. The same shape on the way out as on
            the way back — request line maps to status line, request headers map to response
            headers.
          </>,
          <>
            Methods carry intent: GET reads, POST creates, PUT replaces, PATCH updates, DELETE
            removes. The <em>idempotent</em> ones — GET, PUT, DELETE, HEAD, OPTIONS — can be safely
            retried without side effects.
          </>,
          <>
            Status codes group into five families: 1xx info, 2xx success, 3xx redirect, 4xx client
            error, 5xx server error. Reading the first digit tells you immediately whose problem it
            is.
          </>,
          <>
            HTTPS is HTTP wrapped in TLS — the conversation is identical, the channel is encrypted,
            and the server&apos;s identity is verified via a CA-signed certificate. It adds one extra
            RTT but does not change any HTTP semantics.
          </>,
        ]}
        mentalModel="HTTP is a stateless conversation: the client asks, the server answers, and neither side remembers anything between requests."
      />
    </div>
  );
}
