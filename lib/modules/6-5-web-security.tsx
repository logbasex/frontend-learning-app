"use client";

import { Card, CardContent } from "@/components/ui/card";
import { HTMLPlayground } from "@/components/CodePlayground";
import { StepByStepExplanation, Step } from "@/components/StepByStepExplanation";
import { CodeComparison } from "@/components/CodeComparison";
import { Challenge } from "@/components/Challenge";
import { GotchaList } from "@/components/GotchaList";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { RoadmapLink } from "@/components/RoadmapLink";

export function Module_6_5_Content() {
  // Data blocks hoisted out of JSX for readability — listed in render order.

  const browserSecuritySteps: Step[] = [
    {
      title: "Step 1: Same-origin policy",
      description: (
        <>
          By default, code running on <code>evil.com</code> cannot read responses
          from <code>bank.com</code>. The browser enforces this automatically —
          you do not write any code to get it. An origin is the combination of
          scheme + host + port: <code>https://example.com:443</code> is a
          different origin from <code>http://example.com</code> (different
          scheme) and from <code>https://api.example.com</code> (different
          host). This wall is what every other browser security rule sits on top
          of. Without it, any page you visit could read your bank balance, your
          email, your session cookies — everything.
        </>
      ),
      code: `# Origin = scheme + host + port
# These are different origins:
https://example.com       # scheme: https, host: example.com, port: 443
http://example.com        # different scheme → different origin
https://api.example.com   # different host → different origin
https://example.com:8080  # different port → different origin

# Same-origin policy: code on origin A cannot READ a response from origin B.
# (It can *send* requests — but cannot read the result. That asymmetry matters.)`,
    },
    {
      title: "Step 2: CORS — the door",
      description: (
        <>
          <em>CORS (Cross-Origin Resource Sharing)</em> is the mechanism by
          which a server explicitly opts in to letting specific other origins
          read its responses. The browser sends an <code>Origin</code> header
          with every cross-origin request; if the server responds with a
          matching <code>Access-Control-Allow-Origin</code> header, the browser
          hands the response to the calling JavaScript. If not, the browser
          swallows the response and throws a CORS error — even though the
          request reached the server. The server permits; the browser enforces.
          You cannot fix a CORS error from the browser side alone.
        </>
      ),
      code: `# Cross-origin fetch from https://app.com → https://api.example.com
# Browser sends:
GET /data HTTP/1.1
Origin: https://app.com

# Server responds with CORS header — the door is open:
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://app.com
# ↑ Browser reads this and hands the response to JS.

# Without the ACAO header (or with *wrong* origin):
HTTP/1.1 200 OK
# (no Access-Control-Allow-Origin)
# → browser blocks JS from reading the response (CORS error in console)`,
    },
    {
      title: "Step 3: XSS — attacker JS in your origin",
      description: (
        <>
          <em>XSS (Cross-Site Scripting)</em> is attacker-controlled JavaScript
          executing in your origin. If you render user input as raw HTML —
          for example <code>element.innerHTML = comment</code> — a malicious
          comment can run code as if you wrote it. Because the script shares
          your origin, same-origin policy does not protect you: the attacker
          code can read cookies, call your APIs with the user&apos;s credentials,
          and exfiltrate anything. The fix is to render as text
          (<code>textContent</code>) or, when you genuinely need HTML, sanitize
          at the boundary with a library like DOMPurify.
        </>
      ),
      code: `// XSS sink — never do this with user input
function showComment(comment) {
  // Dangerous: treats comment as HTML markup
  el.innerHTML = comment;
}

// Attacker submits: <img src=x onerror="fetch('/steal?c='+document.cookie)">
// Your page renders it → onerror fires → attacker gets the session cookie.

// Safe version: text only
function showCommentSafe(comment) {
  document.getElementById("box").textContent = comment;
  // The <img> is rendered as literal text — harmless.
}

// If you genuinely need to render HTML, sanitize at the boundary:
import DOMPurify from "dompurify";
function showCommentRich(comment) {
  // Only safe because DOMPurify strips executable content before insertion
  el.innerHTML = DOMPurify.sanitize(comment);
}`,
    },
    {
      title: "Step 4: CSRF — your session, their request",
      description: (
        <>
          <em>CSRF (Cross-Site Request Forgery)</em> works differently from XSS:
          the attacker&apos;s site does not inject code into your origin. Instead,
          it tricks the user&apos;s browser into sending an authenticated request
          to your origin. A hidden form on <code>evil.com</code> that auto-submits
          a POST to <code>bank.com/transfer</code> causes the browser to include
          the user&apos;s session cookie — because cookies are sent on every request
          to their origin regardless of where the request originated. Your server
          sees a valid cookie and acts. Two fixes: <code>SameSite=Lax</code> or{" "}
          <code>SameSite=Strict</code> cookies (browser refuses to attach them on
          cross-site requests), and a per-form CSRF token the attacker cannot guess
          because same-origin policy prevents reading it.
        </>
      ),
      code: `# Attack: evil.com auto-submits this form
<form method="POST" action="https://bank.com/transfer">
  <input type="hidden" name="amount" value="1000">
  <input type="hidden" name="to"     value="attacker">
</form>
<script>document.forms[0].submit();</script>
# Browser includes bank.com session cookie → bank.com acts on it.

# Fix 1: SameSite cookie
Set-Cookie: session=<id>; SameSite=Lax; Secure; HttpOnly
# Browser refuses to send this cookie on cross-site POST requests.

# Fix 2: CSRF token (pairing with SameSite for defense-in-depth)
# Server embeds a random token in the page:
<input type="hidden" name="csrf_token" value="a7f3d...">
# Server verifies the token on every state-changing request.
# Attacker on evil.com cannot read the token (same-origin policy blocks it).`,
    },
    {
      title: "Step 5: CSP — narrow what runs",
      description: (
        <>
          <em>CSP (Content Security Policy)</em> is an HTTP response header that
          tells the browser &quot;only execute scripts from these origins, only
          load images from these origins.&quot; It is an explicit allowlist:
          anything not listed is blocked. Even if an XSS sink slips through
          code review, a tight CSP stops the injected script from running. It is
          the single most effective XSS mitigation when configured without the
          opt-outs that gut it — specifically, avoid <code>unsafe-inline</code>{" "}
          and <code>unsafe-eval</code>. Use nonces (a server-generated random
          value injected into both the CSP header and each legitimate script tag)
          or hashes instead.
        </>
      ),
      code: `# Tight CSP for a SPA — script nonce pattern
Content-Security-Policy:
  default-src 'self';
  script-src  'self' 'nonce-RANDOM_PER_REQUEST';
  style-src   'self' 'unsafe-inline';
  img-src     'self' data: https:;
  connect-src 'self' https://api.example.com;
  frame-ancestors 'none';

# How it works:
# - Scripts without the nonce are blocked (even inline <script> tags).
# - An attacker's injected <img onerror="..."> fires the onerror handler,
#   but any script tag the attacker injects lacks the nonce → blocked.
# - Adding a third-party script? Add its origin to script-src:
#     script-src 'self' 'nonce-...' https://www.googletagmanager.com;`,
    },
    {
      title: "Step 6: Supply chain",
      description: (
        <>
          Every npm package you install runs at build time and its code ships to
          your users at runtime. A compromised package — or a package that has
          always been malicious (typosquatting) — is XSS delivered through your
          own build. Mitigations: pin dependency versions in your lockfile (commit
          it to version control), run <code>pnpm audit</code> regularly, prefer
          packages with provenance attestations (npm provenance links the package
          to the exact Git commit and CI run that built it), and review what a
          package actually does before adding it. The supply chain is the one
          attack surface that bypasses all browser security layers — because the
          attack lives inside your own bundle.
        </>
      ),
      code: `# pnpm audit — find known vulnerabilities in your dependency tree
$ pnpm audit
# ┌─────────────────────────────────────────────────────────────────┐
# │                       === npm audit security report ===         │
# ├──────────────┬──────────────────────────────────────────────────┤
# │ high         │ Prototype Pollution in lodash                    │
# │ Package      │ lodash                                           │
# │ Patched in   │ >=4.17.21                                        │
# └──────────────┴──────────────────────────────────────────────────┘

# Check provenance (npm 9+):
$ npm info some-package dist.integrity dist.tarball
# Provenance links the tarball hash to the GitHub Actions run that built it.

# Lockfile strategy: always commit pnpm-lock.yaml.
# Without a lockfile, npm install can silently upgrade a dep to a
# compromised version that satisfies your semver range.`,
    },
  ];

  const xssSinkOldCode = `// XSS-vulnerable — the sink
function showComment(comment) {
  document.getElementById("box").innerHTML = comment;
  // <img src=x onerror="fetch('/exfiltrate?c=' + document.cookie)"> in comment
  // → attacker code runs in your origin, reads your session.
}`;

  const xssSinkNewCode = `// Safe — text only
function showComment(comment) {
  document.getElementById("box").textContent = comment;
  // <img src=x onerror=...> renders as literal text, never as HTML.
}

// If you genuinely need HTML, sanitize at the boundary:
import DOMPurify from "dompurify";
function showCommentRich(comment) {
  document.getElementById("box").innerHTML = DOMPurify.sanitize(comment);
}`;
  const playgroundHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>XSS: innerHTML vs textContent</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <h2>innerHTML vs textContent</h2>
  <p class="hint">
    Paste this into the <strong>unsafe</strong> box and click Insert:<br>
    <code>&lt;img src=x onerror=&quot;alert(&apos;XSS&apos;)&quot;&gt;</code>
  </p>

  <div class="panels">
    <div class="panel panel--unsafe">
      <label class="panel__label" for="unsafe-input">Unsafe (innerHTML)</label>
      <textarea id="unsafe-input" class="panel__input" placeholder="Type or paste HTML here..."></textarea>
      <button id="unsafe-btn" class="panel__btn panel__btn--unsafe">Insert (innerHTML)</button>
      <div class="panel__output" id="unsafe-output"></div>
    </div>

    <div class="panel panel--safe">
      <label class="panel__label" for="safe-input">Safe (textContent)</label>
      <textarea id="safe-input" class="panel__input" placeholder="Type or paste the same HTML here..."></textarea>
      <button id="safe-btn" class="panel__btn panel__btn--safe">Insert (textContent)</button>
      <div class="panel__output" id="safe-output"></div>
    </div>
  </div>

  <script src="/script.js"></script>
</body>
</html>`;

  const playgroundCss = `*, *::before, *::after { box-sizing: border-box; }
body {
  font-family: system-ui, sans-serif;
  max-width: 760px;
  margin: 24px auto;
  padding: 0 16px;
  color: #1e293b;
}
h2 { margin-bottom: 4px; font-size: 1.1rem; }
.hint {
  font-size: 0.82rem;
  background: #fef9c3;
  border: 1px solid #fde047;
  border-radius: 6px;
  padding: 10px 12px;
  margin-bottom: 16px;
}
.hint code {
  background: #fef08a;
  padding: 1px 4px;
  border-radius: 3px;
  font-size: 0.8rem;
}
.panels {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
@media (max-width: 540px) { .panels { grid-template-columns: 1fr; } }
.panel {
  border-radius: 8px;
  border: 2px solid;
  padding: 12px;
}
.panel--unsafe { border-color: #fca5a5; background: #fff1f1; }
.panel--safe   { border-color: #86efac; background: #f0fff4; }
.panel__label {
  display: block;
  font-weight: 600;
  font-size: 0.85rem;
  margin-bottom: 6px;
}
.panel--unsafe .panel__label { color: #b91c1c; }
.panel--safe   .panel__label { color: #15803d; }
.panel__input {
  width: 100%;
  height: 72px;
  resize: vertical;
  border: 1px solid #cbd5e1;
  border-radius: 5px;
  padding: 6px 8px;
  font-family: monospace;
  font-size: 0.78rem;
  margin-bottom: 8px;
  background: white;
}
.panel__btn {
  display: block;
  width: 100%;
  padding: 7px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: white;
}
.panel__btn--unsafe { background: #dc2626; }
.panel__btn--unsafe:hover { background: #b91c1c; }
.panel__btn--safe   { background: #16a34a; }
.panel__btn--safe:hover   { background: #15803d; }
.panel__output {
  min-height: 48px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 5px;
  padding: 8px;
  font-size: 0.82rem;
  word-break: break-all;
}`;

  const playgroundJs = `// Try this: paste this HTML into the "unsafe" box and click Insert:
//     <img src=x onerror="alert('XSS')">
// The alert fires — that's attacker code running in your origin.
// Paste the same text into the "safe" box. It renders as literal text.
// The difference is innerHTML vs textContent. textContent always wins.

document.getElementById("unsafe-btn").addEventListener("click", () => {
  const input = document.getElementById("unsafe-input").value;
  // innerHTML parses the string as HTML and executes embedded events/scripts.
  document.getElementById("unsafe-output").innerHTML = input;
});

document.getElementById("safe-btn").addEventListener("click", () => {
  const input = document.getElementById("safe-input").value;
  // textContent treats the string as plain text — angle brackets render as-is.
  document.getElementById("safe-output").textContent = input;
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
              Browsers come with three layers of security you mostly don&apos;t
              think about: same-origin policy, CORS, and CSP. They look like
              restrictions; they&apos;re actually the wall between your
              users&apos; data and any random page they visit. The OWASP top 10
              is what happens when one of those walls has a hole in it — and
              most holes are familiar (XSS, CSRF) and patchable.
            </p>
            <p>
              The hard part is not the concepts — each vulnerability has a
              one-sentence explanation. The hard part is that the fix must be
              applied at a specific place in the code, and every place you miss
              is a hole. This module names the place for each attack, shows you
              what a vulnerable pattern looks like, and gives you the exact
              substitution that closes it.
            </p>
          </div>
          <div className="mt-4">
            <RoadmapLink url="https://roadmap.sh/frontend" />
          </div>
        </CardContent>
      </Card>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 2: Mental model                                               */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Card>
        <CardContent className="pt-6">
          <div className="prose dark:prose-invert max-w-none">
            <p>
              Think of browser security as a set of nested walls. The
              same-origin policy is the outer wall: it prevents any page from
              reading another origin&apos;s data. CORS is the door in that
              wall — a server can open it selectively for origins it trusts.
              CSP is a second, inner wall: even if an attacker gets code into
              your origin (XSS), CSP limits what that code is allowed to do.
              XSS and CSRF are the two most common ways the walls get holes —
              XSS punches through by injecting code, CSRF slips around by
              reusing your credentials from another page.
            </p>
            <blockquote className="border-l-4 border-blue-500 pl-4 italic">
              &quot;Same-origin policy is the wall. CORS is the door (and who
              you let through). CSP narrows what runs inside. XSS, CSRF, and
              most OWASP top-10 frontend bugs are walls with holes.&quot;
            </blockquote>
          </div>
        </CardContent>
      </Card>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 3: Step-by-step                                               */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <StepByStepExplanation
        title="Browser security in five layers"
        description="Each layer defends against a different class of attack"
        steps={browserSecuritySteps}
      />

      {/* Optional: CodeComparison (XSS sink vs textContent fix) */}
      <CodeComparison
        title="The XSS sink and the safe version"
        description="Same data, two paths"
        oldCode={{
          title: "Vulnerable (innerHTML)",
          code: xssSinkOldCode,
          language: "javascript",
        }}
        newCode={{
          title: "Safe (textContent / DOMPurify)",
          code: xssSinkNewCode,
          language: "javascript",
        }}
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 4: Playground                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <HTMLPlayground
        html={playgroundHtml}
        css={playgroundCss}
        js={playgroundJs}
        title="innerHTML vs textContent — live XSS demo"
        description="The Sandpack iframe is sandboxed, so the alert runs safely inside it. Paste the XSS payload into each box and observe the difference."
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 5: Challenges                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Challenge
        question={`A code review flags this:
element.innerHTML = '<p>' + userComment + '</p>';
What's the safest fix?`}
        options={[
          {
            id: "a",
            text: "Replace with element.innerHTML = '<p>' + escape(userComment) + '</p>' — the escape function handles it.",
          },
          {
            id: "b",
            text: "Use textContent if you don't need HTML; if you do, sanitize at the boundary with DOMPurify (or equivalent). Never trust string concatenation as a sanitizer.",
          },
          {
            id: "c",
            text: "Add a CSP header — that blocks XSS automatically.",
          },
          {
            id: "d",
            text: "It's fine — modern browsers prevent XSS.",
          },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            <code>escape</code> (and <code>encodeURIComponent</code>) are
            URL-encoding functions, not HTML-encoding — they don&apos;t
            neutralize <code>&lt;script&gt;</code> or event handlers.
            CSP (c) is a great defense in depth but is not a substitute for
            safe rendering — it reduces blast radius; it does not eliminate
            the vulnerability. Modern browsers (d) absolutely do not
            auto-defang HTML you explicitly ask them to insert.
          </>
        }
      />

      <Challenge
        question="You want to add Google Analytics. The script lives at https://www.googletagmanager.com/gtag/js. What CSP change is required?"
        options={[
          {
            id: "a",
            text: "script-src 'self' — same-origin policy covers third-party scripts.",
          },
          {
            id: "b",
            text: "script-src 'self' 'unsafe-inline' 'unsafe-eval' * — wildcard everything.",
          },
          {
            id: "c",
            text: "script-src 'self' https://www.googletagmanager.com — explicitly allowlist the origin you're including.",
          },
          {
            id: "d",
            text: "Disable CSP entirely.",
          },
        ]}
        correctAnswerId="c"
        explanation={
          <>
            CSP is an explicit allowlist — third-party origins must be named.
            Wildcards (b) and disabling (d) defeat the purpose; they allow
            any origin, which is the opposite of defense. <code>&#39;self&#39;</code>{" "}
            (a) allows only your own origin, so the third-party script is still
            blocked. The right answer is: name the origins you trust, nothing
            more.
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
              "Sanitization libraries get out of date — prefer textContent over innerHTML whenever the design allows; sanitize only when you genuinely need user-supplied HTML",
            body: (
              <>
                DOMPurify is excellent and actively maintained — but it is a
                dependency that can lag behind new browser APIs or have its own
                vulnerabilities. Every time you use the raw HTML insertion API
                you are trusting that sanitizer to be perfect. When{" "}
                <code>textContent</code> is sufficient — and it usually is for
                displaying user text — use it, and there is nothing to sanitize.
              </>
            ),
          },
          {
            title:
              "CSRF tokens are useless if your CSP allows arbitrary scripts — XSS reads the token and forges any request",
            body: (
              <>
                The two mitigations interact. If an attacker can run XSS on your
                page, they can read the CSRF token from the DOM and include it in
                a forged request. That is why defense-in-depth matters: fix XSS
                first (output escaping + tight CSP), then CSRF tokens add a second
                layer for the case XSS slips through. Neither defense alone is
                enough against a determined attacker.
              </>
            ),
          },
          {
            title:
              "SameSite=Lax cookies block most CSRF but not navigation-based attacks (form posts from other origins) — pair with a token for sensitive endpoints",
            body: (
              <>
                <code>SameSite=Lax</code> is the browser default since Chrome
                80 (2020) and blocks cross-site subrequests (XHR, fetch, image
                loads). But it allows cookies on top-level navigations — so a
                form POST that results in a navigation (the classic CSRF attack
                shape) can still include the cookie in some configurations.{" "}
                <code>SameSite=Strict</code> is stronger but breaks cross-site
                links (a user arriving from a bookmark or external link won&apos;t
                have a session). Use <code>Strict</code> for sensitive operations
                and pair with a CSRF token for belt-and-suspenders.
              </>
            ),
          },
          {
            title:
              "CSP unsafe-inline is so common it's almost the default — and it neutralizes most of CSP's XSS protection; use nonces or hashes instead",
            body: (
              <>
                Many CSP tutorials show{" "}
                <code>script-src &apos;self&apos; &apos;unsafe-inline&apos;</code>{" "}
                as an example. With <code>unsafe-inline</code>, any inline{" "}
                <code>&lt;script&gt;</code> tag — including one injected by an
                attacker — is allowed to run. That makes the XSS-mitigation
                half of CSP completely inactive. Use a nonce (a random
                per-request value the server injects into both the CSP header
                and each legitimate script tag) so only your scripts get the
                nonce, and an attacker&apos;s injected script does not.
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
            <em>Same-origin policy</em> is the browser rule that prevents a
            page from reading another origin&apos;s data unless explicitly
            allowed. Origin = scheme + host + port.
          </>,
          <>
            <em>CORS</em> is the mechanism by which a server opts in to
            cross-origin reads via <code>Access-Control-Allow-Origin</code>.
            The browser enforces; the server permits. You cannot fix CORS from
            the client side alone.
          </>,
          <>
            <em>XSS</em> is attacker-controlled JavaScript executing in your
            origin — fix it with output escaping (<code>textContent</code> over
            raw HTML insertion) and a tight CSP. Every raw HTML insertion point
            is a potential sink.
          </>,
          <>
            <em>CSRF</em> is an attacker&apos;s site triggering an authenticated
            request from the victim&apos;s browser — fix it with{" "}
            <code>SameSite=Lax</code>/<code>Strict</code> cookies and a
            per-form CSRF token verified server-side.
          </>,
          <>
            <em>CSP</em> is an HTTP header allow-listing which sources of code,
            styles, and images may execute or load. It is defense-in-depth
            against XSS, not a replacement for escaping. Avoid{" "}
            <code>unsafe-inline</code>; use nonces or hashes.
          </>,
          <>
            The supply chain is an often-overlooked attack surface: a
            compromised npm package ships malicious code inside your own bundle,
            bypassing every browser security layer. Pin dependencies, audit
            regularly, prefer packages with provenance attestations.
          </>,
        ]}
        mentalModel="Same-origin policy is the wall. CORS is the door (and who you let through). CSP narrows what runs inside. XSS, CSRF, and most OWASP top-10 frontend bugs are walls with holes."
      />
    </div>
  );
}
