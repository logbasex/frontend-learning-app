"use client";

import { Card, CardContent } from "@/components/ui/card";
import { HTMLPlayground } from "@/components/CodePlayground";
import { StepByStepExplanation, Step } from "@/components/StepByStepExplanation";
import { SequenceDiagram } from "@/components/SequenceDiagram";
import { Challenge } from "@/components/Challenge";
import { GotchaList } from "@/components/GotchaList";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { RoadmapLink } from "@/components/RoadmapLink";

export function Module_6_4_Content() {
  // Data blocks hoisted out of JSX for readability — listed in render order.
  const authSteps: Step[] = [
    {
      title: "Step 1: AuthN vs authZ",
      description: (
        <>
          <em>Authentication</em> answers &quot;who are you?&quot; — verifying an identity claim.{" "}
          <em>Authorization</em> answers &quot;what are you allowed to do?&quot; — enforcing access rules
          once identity is known. These are separate concerns. A user can be authenticated (the server
          knows it is Alice) but not authorized to view a given resource (Alice lacks the admin role).
          Conflating the two is the root cause of half the role-based-access bugs in production: a
          route that checks &quot;is the user logged in?&quot; without checking &quot;does this user own this
          resource?&quot; is vulnerable to horizontal privilege escalation — any authenticated user can
          fetch any other user&apos;s data by guessing an ID.
        </>
      ),
      code: `// AuthN: prove you are who you say you are
POST /login
  body: { email, password }
  → server verifies credentials → creates a session or issues a token

// AuthZ: once identity is known, check permissions
GET /api/invoices/42
  → server checks: does the authenticated user OWN invoice 42?
  → if not: 403 Forbidden (not 401 Unauthorized — they are logged in)

// 401 = not authenticated  →  "who are you?"
// 403 = not authorized     →  "I know who you are; you can't do this"`,
    },
    {
      title: "Step 2: Session cookies",
      description: (
        <>
          The classic server-side model: the server generates a random, opaque session ID, stores the
          actual session data (user ID, roles, cart) in a server-side store (database, Redis), and
          issues the client a <em>session cookie</em> — a cookie holding an opaque session ID; the
          server stores the actual session data. The browser attaches the cookie automatically to
          every same-origin request. Logout is instant: delete the session from the store and the
          cookie becomes worthless. The tradeoff is that horizontal scale requires a shared session
          store — every server must be able to read the session — but that is a solvable infra
          problem, not a fundamental flaw.
        </>
      ),
      code: `// Server (Node/Express example)
app.post('/login', async (req, res) => {
  const user = await verifyCredentials(req.body);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  req.session.userId = user.id;          // stored server-side
  req.session.roles  = user.roles;       // stored server-side

  res.json({ ok: true });
  // Set-Cookie: sessionId=abc123; HttpOnly; Secure; SameSite=Lax
});

app.post('/logout', (req, res) => {
  req.session.destroy();                 // instant revocation
  res.clearCookie('sessionId');
  res.json({ ok: true });
});

// Client: browser sends cookie automatically — no code needed
fetch('/api/me');   // Cookie: sessionId=abc123 (auto-attached)`,
    },
    {
      title: "Step 3: JWT (token-based)",
      description: (
        <>
          A <em>JWT</em> — a signed (not encrypted by default) token carrying claims as a
          base64-encoded JSON header.payload.signature — moves session state from the server to the
          token itself. The server signs <code>{`{ sub, iat, exp, roles }`}</code> with a secret key
          and hands the result to the client. The client stores it somewhere (more on where shortly)
          and sends it back explicitly in every request as{" "}
          <code>Authorization: Bearer &lt;jwt&gt;</code>. The server verifies the signature; no
          database lookup needed. The critical implication: <strong>revocation is hard</strong>. A
          valid JWT is valid until it expires. &quot;Logging out&quot; client-side just means the client
          forgets the token — but if an attacker already copied it, they keep access until expiry.
          Maintaining a server-side deny-list for invalidated tokens brings state back and erases the
          stateless advantage.
        </>
      ),
      code: `// A JWT is: base64url(header) + "." + base64url(payload) + "." + signature
//
// Decoded header:
{ "alg": "HS256", "typ": "JWT" }
//
// Decoded payload (public — NOT encrypted):
{
  "sub":   "user_01HXYZ",        // subject — stable user identifier
  "iat":   1746748800,           // issued-at  (Unix timestamp)
  "exp":   1746835200,           // expiry     (iat + 24 h)
  "email": "user@example.com",
  "roles": ["viewer", "editor"]
  // NEVER include: passwords, credit cards, private keys
}
//
// Server verifies:
import jwt from 'jsonwebtoken';
const payload = jwt.verify(token, process.env.JWT_SECRET);
// throws if signature invalid or token expired — no DB hit`,
    },
    {
      title: "Step 4: OAuth 2.0 — delegation",
      description: (
        <>
          <em>OAuth 2.0</em> — a delegation protocol where a third party gets permission to act on a
          user&apos;s behalf without seeing their password — is the mechanism behind &quot;Sign in with
          Google&quot; and &quot;Connect GitHub.&quot; The user never shares their Google password with your
          app. Instead, Google issues your app a short-lived <em>authorization code</em>, which your
          server exchanges for an <em>access token</em>. The access token lets you call Google APIs
          (e.g., read their email) within the scopes the user approved. OIDC (OpenID Connect) extends
          OAuth 2.0 with an <em>ID token</em> that contains identity claims so you learn who the user
          is — otherwise OAuth only tells you what you&apos;re allowed to do, not who granted the
          permission.
        </>
      ),
      code: `// OAuth 2.0 Authorization Code flow (simplified)

// 1. Redirect user to the provider
const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' +
  new URLSearchParams({
    client_id:     GOOGLE_CLIENT_ID,
    redirect_uri:  'https://myapp.com/auth/callback',
    response_type: 'code',
    scope:         'openid email profile',
    state:         randomState,          // CSRF protection
  });
window.location.href = authUrl;

// 2. Provider redirects back with ?code=... and ?state=...
// 3. Your server exchanges the code for tokens
const tokens = await fetch('https://oauth2.googleapis.com/token', {
  method: 'POST',
  body: new URLSearchParams({
    code,
    client_id:     GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,  // kept on your server
    redirect_uri:  'https://myapp.com/auth/callback',
    grant_type:    'authorization_code',
  }),
}).then(r => r.json());
// tokens = { access_token, id_token, refresh_token, expires_in }`,
    },
    {
      title: "Step 5: PKCE — required since 2020",
      description: (
        <>
          Public clients — browsers and mobile apps — cannot keep a{" "}
          <code>client_secret</code> secure (anyone can read the source). Without a secret,
          what stops an attacker who intercepts the <code>?code=...</code> redirect from
          exchanging it themselves? <em>PKCE</em> — Proof Key for Code Exchange — solves this
          with a per-flow secret the client generates. Before redirecting, the client creates a
          random <code>code_verifier</code>, hashes it into a <code>code_challenge</code> with
          SHA-256, and includes the challenge in the authorization URL. When exchanging the code
          for tokens, the client sends the original <code>code_verifier</code>. The auth
          server verifies that <code>SHA256(verifier) === challenge</code>. An interceptor who
          grabbed only the code does not have the verifier and cannot complete the exchange.
          OAuth 2.1 makes PKCE mandatory for all public clients — verify your auth library
          does it by default before shipping.
        </>
      ),
      code: `// PKCE — the client generates its own per-flow proof
import { createHash, randomBytes } from 'crypto';  // or Web Crypto

// 1. Generate verifier (random, 43-128 characters)
const codeVerifier  = randomBytes(32).toString('base64url');

// 2. Hash into challenge
const codeChallenge = createHash('sha256')
  .update(codeVerifier)
  .digest('base64url');

// 3. Include challenge in the redirect
const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' +
  new URLSearchParams({
    ...baseParams,
    code_challenge:        codeChallenge,
    code_challenge_method: 'S256',
  });

// 4. When exchanging the code, reveal the verifier
const tokens = await fetch('/token', {
  body: new URLSearchParams({
    code,
    code_verifier: codeVerifier,  // server re-hashes and checks
    ...otherParams,
  }),
});
// An interceptor who grabbed only ?code= has no verifier → exchange fails`,
    },
    {
      title: "Step 6: Where to store tokens",
      description: (
        <>
          Storage location is the most consequential security decision in browser auth. JWTs (or any
          access token) stored in <code>localStorage</code> are fully readable by any JavaScript
          running on your origin — including injected scripts from an <em>XSS</em> (cross-site
          scripting) vulnerability. One reflected-XSS bug makes every user&apos;s token harvestable.
          Storing the access token in an <code>httpOnly</code> cookie means JavaScript cannot read it
          at all, but introduces CSRF risk — mitigated by <code>SameSite=Lax</code>. The safer
          production pattern: <strong>refresh tokens always in <code>httpOnly</code> cookies</strong>{" "}
          (long-lived, never JS-visible); <strong>access tokens short-lived</strong> (minutes, not
          days) so a leaked token self-expires quickly; <strong>CSP</strong> (Content Security Policy)
          to restrict which scripts can run at all.
        </>
      ),
      code: `// DO NOT store long-lived tokens in localStorage
localStorage.setItem('jwt', token);   // any XSS script can read this
// document.cookie = 'jwt=...'        // also readable unless HttpOnly

// SAFER: httpOnly cookie (server sets it, JS cannot read it)
// Server response header:
// Set-Cookie: refreshToken=...; HttpOnly; Secure; SameSite=Lax; Path=/auth

// Access token: short-lived, can live in memory (JS variable)
let accessToken = null;               // lost on page reload — by design
// Refresh via POST /auth/refresh  ← uses the httpOnly refresh-token cookie
// SameSite=Lax blocks CSRF on top-level cross-site navigation
// SameSite=Strict blocks even first-party redirects from external sites

// Summary of tradeoffs
// localStorage  →  XSS readable    | easy to implement
// sessionStorage→  XSS readable    | cleared on tab close
// memory var    →  XSS readable    | lost on reload
// httpOnly cookie → XSS safe       | CSRF risk mitigated by SameSite=Lax`,
    },
  ];

  const playgroundHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>JWT Decoder</title>
</head>
<body>
  <h2>JWT Decoder</h2>
  <p class="hint">
    Paste a JWT below to see its three parts decoded. Each part is just
    base64url-encoded JSON — no secret needed to read it. The signature
    proves it wasn&apos;t tampered with, but it does NOT hide the payload.
  </p>
  <textarea id="jwtInput" placeholder="Paste a JWT here (e.g. eyJ...)"></textarea>
  <div class="btn-row">
    <button id="btnDecode">Decode</button>
    <button id="btnSample">Load sample JWT</button>
    <button id="btnClear">Clear</button>
  </div>
  <div id="output" class="hidden">
    <div class="part header-part">
      <div class="part-label">Header <span class="tag">algorithm + token type</span></div>
      <pre id="headerOut"></pre>
    </div>
    <div class="part payload-part">
      <div class="part-label">Payload <span class="tag">claims — public, not encrypted</span></div>
      <pre id="payloadOut"></pre>
    </div>
    <div class="part sig-part">
      <div class="part-label">Signature <span class="tag">server verifies this — we cannot here</span></div>
      <pre id="sigOut"></pre>
    </div>
  </div>
  <div id="error" class="error hidden"></div>
  <script src="/script.js"></script>
</body>
</html>`;

  const playgroundCss = `body {
  font-family: system-ui, sans-serif;
  max-width: 700px;
  margin: 24px auto;
  padding: 0 16px;
  color: #1e293b;
}
h2 { margin-bottom: 4px; font-size: 1.1rem; }
.hint { font-size: 0.82rem; color: #64748b; margin-bottom: 12px; line-height: 1.5; }
textarea {
  width: 100%;
  min-height: 80px;
  font-family: monospace;
  font-size: 0.78rem;
  padding: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  box-sizing: border-box;
  resize: vertical;
  word-break: break-all;
}
.btn-row { display: flex; gap: 8px; margin: 10px 0 16px; flex-wrap: wrap; }
button {
  padding: 7px 14px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
}
button:hover { background: #2563eb; }
#btnSample { background: #64748b; }
#btnSample:hover { background: #475569; }
#btnClear { background: #ef4444; }
#btnClear:hover { background: #dc2626; }
.part {
  margin-bottom: 14px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}
.part-label {
  padding: 6px 14px;
  font-weight: 600;
  font-size: 0.82rem;
  display: flex;
  align-items: center;
  gap: 8px;
}
.tag {
  font-weight: 400;
  font-size: 0.75rem;
  opacity: 0.75;
}
.header-part .part-label  { background: #fef3c7; color: #92400e; }
.payload-part .part-label { background: #dcfce7; color: #166534; }
.sig-part .part-label     { background: #ede9fe; color: #5b21b6; }
pre {
  margin: 0;
  padding: 12px 14px;
  background: #0f172a;
  color: #e2e8f0;
  font-size: 0.78rem;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
}
.error { color: #dc2626; font-size: 0.85rem; padding: 8px 0; }
.hidden { display: none; }`;

  const playgroundJs = `// Try this: paste your own JWT in the input below — DO NOT paste a real
// token from a production app. The decoder shows the header (algorithm),
// the payload (claims), and the signature (which we don't verify here —
// verification needs the server's public key). Note: the payload is just
// base64-encoded JSON. JWTs are signed, not encrypted.

const SAMPLE_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
  '.eyJzdWIiOiJ1c2VyXzAxSFhZWiIsImlhdCI6MTc0Njc0ODgwMCwiZXhwIjoxNzQ2ODM1MjAwLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJyb2xlcyI6WyJ2aWV3ZXIiLCJlZGl0b3IiXX0' +
  '.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

function base64urlDecode(str) {
  // base64url -> base64 -> JSON
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padded = b64 + '='.repeat((4 - b64.length % 4) % 4);
  try {
    return JSON.parse(atob(padded));
  } catch {
    return atob(padded);   // not JSON (e.g. signature is binary)
  }
}

function decode(raw) {
  const parts = raw.trim().split('.');
  if (parts.length !== 3) throw new Error('A JWT must have exactly 3 parts separated by dots.');
  return {
    header:  base64urlDecode(parts[0]),
    payload: base64urlDecode(parts[1]),
    sig:     parts[2],   // signature stays as base64url — we can't verify it here
  };
}

function show(decoded) {
  document.getElementById('headerOut').textContent  = JSON.stringify(decoded.header,  null, 2);
  document.getElementById('payloadOut').textContent = JSON.stringify(decoded.payload, null, 2);
  document.getElementById('sigOut').textContent     = decoded.sig + '\\n\\n(raw base64url — server verifies using its secret key)';
  document.getElementById('output').classList.remove('hidden');
  document.getElementById('error').classList.add('hidden');
}

function showError(msg) {
  document.getElementById('error').textContent = 'Error: ' + msg;
  document.getElementById('error').classList.remove('hidden');
  document.getElementById('output').classList.add('hidden');
}

document.getElementById('btnDecode').addEventListener('click', () => {
  const raw = document.getElementById('jwtInput').value;
  if (!raw.trim()) return showError('Paste a JWT first.');
  try { show(decode(raw)); } catch (e) { showError(e.message); }
});

document.getElementById('btnSample').addEventListener('click', () => {
  document.getElementById('jwtInput').value = SAMPLE_JWT;
  try { show(decode(SAMPLE_JWT)); } catch (e) { showError(e.message); }
});

document.getElementById('btnClear').addEventListener('click', () => {
  document.getElementById('jwtInput').value = '';
  document.getElementById('output').classList.add('hidden');
  document.getElementById('error').classList.add('hidden');
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
              Most authentication bugs aren&apos;t glamorous: a JWT in <code>localStorage</code> that
              XSS reads, a session cookie without <code>SameSite=Lax</code>, an OAuth implementation
              that skipped PKCE because the docs were written before it was mandatory. The mechanisms
              aren&apos;t hard once you see what each one is <em>for</em> — they&apos;re hard because
              every guide assumes you already know.
            </p>
            <p>
              This module untangles three things that are usually conflated: <strong>session cookies</strong>{" "}
              (the server keeps state), <strong>JWTs</strong> (the client keeps state), and{" "}
              <strong>OAuth 2.0</strong> (delegation — letting a third party act on a user&apos;s behalf
              without sharing their password). By the end you&apos;ll be able to pick the right
              mechanism for a given app, walk through an OAuth Authorization Code + PKCE flow step by
              step, and spot the storage decision that turns a reflective-XSS bug into a full
              credential leak.
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
              These three mechanisms answer different questions. A session cookie is the server
              saying &quot;I remember this browser.&quot; A JWT is a signed note the browser carries that
              the server can read without a database lookup. OAuth is neither of those — it is a
              handshake between your app and a third-party identity provider so the user never has to
              trust your app with their Google password. Keeping the three questions distinct —
              &quot;who is this?&quot; vs &quot;what token proves it?&quot; vs &quot;who delegated what?&quot; — is the model
              that makes every auth decision legible.
            </p>
            <blockquote className="border-l-4 border-blue-500 pl-4 italic">
              &quot;Cookies are sent automatically; tokens aren&apos;t. JWT is signed claims, not encrypted ones.
              OAuth is delegation, not authentication.&quot;
            </blockquote>
          </div>
        </CardContent>
      </Card>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 3: Step-by-step                                               */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <StepByStepExplanation
        title="Auth, end to end"
        description="From authentication vs authorization through session cookies, JWTs, OAuth, PKCE, and safe token storage"
        steps={authSteps}
      />

      {/* Optional: SequenceDiagram (OAuth Authorization Code + PKCE) */}
      <SequenceDiagram
        title="OAuth 2.0 Authorization Code + PKCE"
        description="The full hop-by-hop, including the verifier/challenge"
        actors={["Browser", "App", "AuthServer", "API"]}
        messages={[
          { from: "Browser", to: "App", label: "click 'Sign in with X'" },
          { from: "App", to: "App", label: "generate code_verifier", note: "random string" },
          { from: "App", to: "App", label: "code_challenge = SHA256(verifier)" },
          { from: "App", to: "Browser", label: "redirect to AuthServer", note: "with code_challenge" },
          { from: "Browser", to: "AuthServer", label: "/authorize?challenge=..." },
          { from: "AuthServer", to: "Browser", label: "consent screen" },
          { from: "Browser", to: "AuthServer", label: "I approve" },
          { from: "AuthServer", to: "Browser", label: "redirect back with auth code" },
          { from: "Browser", to: "App", label: "/callback?code=..." },
          { from: "App", to: "AuthServer", label: "POST /token { code, code_verifier }", note: "verifier proves we're the original client" },
          { from: "AuthServer", to: "App", label: "{ access_token, id_token, refresh_token }" },
          { from: "App", to: "API", label: "GET /me", note: "with access_token" },
          { from: "API", to: "App", label: "user data" },
        ]}
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 4: Live playground                                            */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <HTMLPlayground
        html={playgroundHtml}
        css={playgroundCss}
        js={playgroundJs}
        title="Decode a JWT"
        description="Click 'Load sample JWT' to see the three parts decoded, or paste your own. The payload is plain JSON — visible to anyone who holds the token."
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 5: Challenges                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Challenge
        question="Your app has a server backend you control and runs in a browser. Session cookies or JWT?"
        options={[
          {
            id: "a",
            text: "JWT — they're modern; cookies are legacy.",
          },
          {
            id: "b",
            text: "Session cookies — simpler, secure-by-default with SameSite=Lax and httpOnly, easy revocation. Reach for JWT only when you have a stateless multi-server architecture or non-browser clients.",
          },
          {
            id: "c",
            text: "It doesn't matter; they're equivalent.",
          },
          {
            id: "d",
            text: "Both — store a JWT in localStorage AND a session cookie.",
          },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            Session cookies are the simpler, more revocable option for a backend-with-browser-app
            setup. JWT shines when you need stateless verification across many servers or for
            non-browser clients (mobile, CLI). Storing both (d) doubles your attack surface — you
            now have two credential types to protect instead of one.
          </>
        }
      />

      <Challenge
        question="Your team stores JWTs in localStorage. A reflected-XSS bug is reported in the support page. Why is this an emergency?"
        options={[
          {
            id: "a",
            text: "It isn't — XSS bugs are common.",
          },
          {
            id: "b",
            text: "Because XSS-injected JavaScript can read localStorage and exfiltrate every user's JWT. JWTs in localStorage are an XSS target; httpOnly cookies aren't readable from JS.",
          },
          {
            id: "c",
            text: "Because XSS bugs always trigger CSRF.",
          },
          {
            id: "d",
            text: "Because the JWT will be modified by the XSS code.",
          },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            An XSS payload that runs in your origin can <code>localStorage.getItem(&quot;jwt&quot;)</code>{" "}
            and POST it anywhere — every JWT becomes harvestable. <code>httpOnly</code> cookies are
            not accessible to JavaScript, which is why CSP + httpOnly cookies + SameSite is the
            safer stack for browser auth.
          </>
        }
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 6: GotchaList                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <GotchaList
        items={[
          {
            title: "JWT in localStorage is a giant XSS target — any reflected-XSS bug becomes a credential leak",
            body: (
              <>
                JavaScript running in your origin can call <code>localStorage.getItem(&apos;token&apos;)</code>{" "}
                and POST it to an attacker-controlled server. Unlike <code>httpOnly</code> cookies,
                there is no browser mechanism that prevents this. If you store tokens in localStorage,
                a single XSS injection harvests every active session.
              </>
            ),
          },
          {
            title: "Sessions need server-side state — that's a feature for revocation, a cost for horizontal scale",
            body: (
              <>
                Instant revocation (logout, ban, password reset) is trivial with sessions: delete the
                record. But every server in a horizontally-scaled fleet must read the same session
                store — Redis or a shared database — which adds infrastructure. Neither model is free;
                pick based on your actual requirements, not fashion.
              </>
            ),
          },
          {
            title: "OAuth's 'Sign in with X' isn't authentication on its own — you must verify the returned ID token; otherwise an attacker forges identity",
            body: (
              <>
                The <code>access_token</code> proves you can call the provider&apos;s API on the
                user&apos;s behalf — it does not tell you who the user is. For identity, you need the
                OIDC <code>id_token</code> (a JWT) and you must <strong>verify its signature</strong>.
                Trusting an unverified <code>id_token</code> lets an attacker craft a token claiming
                to be anyone.
              </>
            ),
          },
          {
            title: "PKCE has been mandatory for public clients (browsers, mobile) since OAuth 2.1 — old guides skip it; verify your library does it by default",
            body: (
              <>
                Many tutorials from before 2020 show the Authorization Code flow without PKCE.
                Without PKCE, an authorization code intercepted in the redirect URL can be exchanged
                by the attacker. Check that your OAuth library sends <code>code_challenge</code> on
                every authorization request — if not, configure it explicitly.
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
            <em>Authentication</em> (who are you?) and <em>authorization</em> (what are you allowed
            to do?) are separate checks — conflating them leads to privilege-escalation bugs where any
            logged-in user can access any other user&apos;s data.
          </>,
          <>
            Session cookies store state on the server and give instant revocation; JWTs store signed
            state in the token and give stateless verification but hard revocation — choose based on
            your actual needs, not which one is &quot;modern.&quot;
          </>,
          <>
            A JWT&apos;s payload is <em>signed</em>, not encrypted — it is base64-encoded JSON readable
            by anyone who holds the token. Never include passwords, private keys, or sensitive PII in
            a JWT payload.
          </>,
          <>
            OAuth 2.0 is <em>delegation</em>: the user authorizes your app to act on their behalf at a
            third-party provider without sharing their password. It is not authentication — you still
            need to verify the OIDC ID token to learn who the user is.
          </>,
          <>
            PKCE protects browser and mobile OAuth flows from authorization-code interception by
            binding the code to a per-flow secret the client generates. It has been mandatory since
            OAuth 2.1 — check that your library uses it.
          </>,
          <>
            Refresh tokens belong in <code>httpOnly</code> cookies (JS-invisible); access tokens
            should be short-lived. <code>SameSite=Lax</code> on cookies mitigates CSRF without
            blocking legitimate same-site navigation.
          </>,
        ]}
        mentalModel="Cookies are sent automatically; tokens aren't. JWT is signed claims, not encrypted ones. OAuth is delegation, not authentication."
      />
    </div>
  );
}
