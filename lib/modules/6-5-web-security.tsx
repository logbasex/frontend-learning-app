"use client";

import { ScaffoldModule } from "./_template";
import { CodeBlock } from "@/components/CodeBlock";

const headersCode = `# Strong security response headers
# (shown as a plain HTTP response header block)

HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8

# ── Content-Security-Policy ───────────────────────────────────────────────────
# Allowlist for scripts, styles, and other resources.
# 'strict-dynamic' + nonce means only server-injected scripts are trusted;
# inline scripts without the nonce are blocked — stops most XSS sinks.
Content-Security-Policy: default-src 'self'; script-src 'self' 'strict-dynamic' 'nonce-{RANDOM}'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; frame-ancestors 'none'; upgrade-insecure-requests;

# ── HSTS — force HTTPS for 1 year, include subdomains, allow preload ─────────
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload

# ── Prevent MIME-type sniffing (stops scripts disguised as images) ────────────
X-Content-Type-Options: nosniff

# ── Limit referrer info sent to third-party sites ────────────────────────────
Referrer-Policy: strict-origin-when-cross-origin

# ── Prevent clickjacking (legacy browsers; CSP frame-ancestors is preferred) ──
X-Frame-Options: DENY

# ── Cookie with all three security flags ─────────────────────────────────────
# HttpOnly  — JS cannot read it (blocks cookie theft via XSS)
# Secure    — only sent over HTTPS
# SameSite=Strict — never sent on cross-site requests (defeats CSRF)
Set-Cookie: session=<opaque-id>; Path=/; HttpOnly; Secure; SameSite=Strict`;

export function Module_6_5_Content() {
  return (
    <ScaffoldModule
      emoji="🛡️"
      problemTitle="XSS, CSRF, CSP — the OWASP top hits for the frontend"
      problem={
        <>
          <p>
            <strong>XSS (Cross-Site Scripting)</strong> means attacker
            JavaScript runs inside <em>your</em> origin. Because the script
            shares your origin, it can read cookies, call your APIs with the
            user&apos;s credentials, and exfiltrate data. The fix is to{" "}
            <strong>escape user input on output</strong> — never pass
            untrusted strings to raw HTML insertion points. Modern frameworks
            (React, Vue) auto-escape template expressions, but escape hatches
            that accept raw HTML markup bypass that protection entirely.
          </p>
          <p>
            <strong>CSRF (Cross-Site Request Forgery)</strong> works
            differently: the attacker&apos;s site triggers a request{" "}
            <em>to your origin</em> while the user is logged in — for example,
            a hidden form that POSTs to <code>/transfer-funds</code>. The
            browser helpfully includes the session cookie, so your server
            thinks it is a legitimate request. The fix is{" "}
            <code>SameSite=Strict</code> cookies (the browser refuses to
            attach them on cross-site requests) or explicit CSRF tokens
            embedded in forms and verified server-side.
          </p>
          <p>
            <strong>CSP (Content-Security-Policy)</strong> is an HTTP header
            that tells the browser which scripts are allowed to run — an
            allowlist rather than a blocklist. Even if an XSS sink slips
            through code review, a tight CSP prevents the injected script from
            executing. Think of it as defense-in-depth: CSP does not replace
            escaping, but it drastically limits the blast radius when escaping
            fails. Combine with <code>HttpOnly</code> cookies (so XSS cannot
            steal the session token via <code>document.cookie</code>) for
            layered protection.
          </p>
        </>
      }
      body={
        <CodeBlock
          language="http"
          fileName="response-headers.txt"
          code={headersCode}
        />
      }
      challenge={{
        question: "Why does `SameSite=Strict` mostly defeat CSRF attacks?",
        options: [
          {
            id: "a",
            text: "It encrypts the cookie value so the attacker's site cannot read it.",
          },
          {
            id: "b",
            text: "Browsers refuse to send same-site cookies on cross-site requests, so an attacker's site can't piggy-back on your authenticated session.",
          },
          {
            id: "c",
            text: "It generates a CSRF token automatically and embeds it in every form.",
          },
          {
            id: "d",
            text: "It blocks all POST requests that originate outside the same domain at the network level.",
          },
        ],
        correctAnswerId: "b",
        explanation: (
          <>
            <code>SameSite=Strict</code> instructs the browser not to include
            the cookie in any request initiated from a different site —
            including form submissions, image loads, and fetch calls from the
            attacker&apos;s origin. Without the session cookie in the request,
            your server sees an unauthenticated call and rejects it. The
            attack never reaches your application logic. Note that{" "}
            <code>SameSite=Lax</code> (the browser default since ~2020)
            offers partial protection; <code>Strict</code> is stronger but
            breaks cross-site navigation links.
          </>
        ),
      }}
      takeaways={[
        <>
          XSS: attacker JS in your origin — fix with output escaping and CSP.
          Never pass untrusted strings to raw HTML insertion APIs.
        </>,
        <>
          CSRF: attacker site, your session cookie — fix with{" "}
          <code>SameSite=Strict</code> or CSRF tokens. The browser is the
          attack surface, not your server.
        </>,
        <>
          CSP is an HTTP allowlist for code execution — set it early, tighten
          it over time. It is defense-in-depth, not a replacement for
          escaping.
        </>,
      ]}
      mentalModel="XSS: attacker JS in your origin. CSRF: attacker site, your session. CSP: allowlist for code execution."
      roadmapUrl="https://roadmap.sh/frontend"
    />
  );
}
