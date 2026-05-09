"use client";

import { ScaffoldModule } from "./_template";
import { CodeBlock } from "@/components/CodeBlock";

// JSON does not support comments, so we use a TypeScript string that renders
// as a plain-text block with a comment header explaining the JWT structure.
const jwtCode = `// A JSON Web Token has three base64url-encoded parts separated by dots:
//
//   xxxxx.yyyyy.zzzzz
//   │     │     └── Signature  — HMAC-SHA256(base64(header) + "." + base64(payload), secret)
//   │     └──────── Payload    — the decoded JSON below (base64url-encoded)
//   └────────────── Header     — { "alg": "HS256", "typ": "JWT" }
//
// IMPORTANT: the payload is BASE64-ENCODED, NOT ENCRYPTED.
// Anyone who holds the token can decode and read the payload.
// The signature proves the payload was not tampered with — it does NOT hide it.

// Decoded payload:
{
  "sub":   "user_01HXYZ",          // subject — stable user identifier
  "iat":   1746748800,             // issued-at  (Unix timestamp)
  "exp":   1746835200,             // expiry     (issued-at + 24 h)
  "email": "user@example.com",     // safe to include — not a secret
  "roles": ["viewer", "editor"],   // authorization claims

  // DO NOT include:
  // "password_hash": "...",        // secrets belong in the DB, not the token
  // "credit_card":   "4111..."     // PII that must not leak in logs/CDN
}`;

export function Module_6_4_Content() {
  return (
    <ScaffoldModule
      emoji="🔑"
      problemTitle="JWT vs session cookies vs OAuth — pick on purpose"
      problem={
        <>
          <p>
            <strong>Session cookies</strong> are the classic server-side
            model: the server stores session state (user ID, roles, cart) in a
            database or memory store, and issues the client an opaque random
            ID. The browser sends that cookie automatically with every
            same-origin request — you get CSRF risk for free, but the server
            can revoke the session instantly by deleting it from the store.
          </p>
          <p>
            <strong>JWTs</strong> move state to the client. The server signs a
            payload of claims and hands it to the client, which must then pass
            it back explicitly — usually in an <code>Authorization: Bearer
            ...</code> header, or stored in a cookie. The server stays
            stateless: it only needs to verify the signature. The downside is
            that revocation is hard — a signed token is valid until it
            expires, so logout means &quot;forget it client-side&quot; unless you
            maintain a server-side deny-list (which re-introduces state).{" "}
            <strong>OAuth</strong> is a different concept entirely: it is
            delegated authorization (&quot;let this app act on my behalf&quot;). The
            &quot;sign in with Google&quot; flow is OAuth + OIDC; it does not tell
            you who the user is until you call the{" "}
            <code>/userinfo</code> endpoint.
          </p>
          <p>
            The most common confusion: <strong>authentication</strong> (who
            are you?) vs <strong>authorization</strong> (what are you allowed
            to do?). JWTs can carry both — a <code>sub</code> claim
            identifies the user, and a <code>roles</code> claim controls
            access — but they are conceptually separate. Never put secrets
            (passwords, private keys, PII) in a JWT payload; it is signed,
            not encrypted.
          </p>
        </>
      }
      body={
        <CodeBlock
          language="typescript"
          fileName="decoded-jwt.json"
          code={jwtCode}
        />
      }
      challenge={{
        question: "Why are JWTs not encrypted by default?",
        options: [
          {
            id: "a",
            text: "JWTs use HTTPS for encryption, so additional payload encryption would be redundant.",
          },
          {
            id: "b",
            text: "JWTs are signed, not encrypted — anyone with the token can read the payload. Don't put secrets in JWTs; treat them as public, signed credentials.",
          },
          {
            id: "c",
            text: "The JWT spec forbids encryption to keep the format simple.",
          },
          {
            id: "d",
            text: "JWTs are always encrypted when stored in an HttpOnly cookie.",
          },
        ],
        correctAnswerId: "b",
        explanation: (
          <>
            A JWT consists of a base64url-encoded header, a base64url-encoded
            payload, and a signature. Base64 is <em>encoding</em>, not
            encryption — any party holding the token can decode and read every
            claim. The signature proves the payload was not tampered with; it
            provides <em>integrity</em>, not <em>confidentiality</em>. JWE
            (JSON Web Encryption) is the separate spec for encrypted tokens,
            but it is rarely used. Treat the JWT payload as public and never
            put sensitive data in it.
          </>
        ),
      }}
      takeaways={[
        <>
          Session cookies are automatic and revocable; JWTs are stateless and
          hard to revoke before expiry — choose based on your revocation
          requirements.
        </>,
        <>
          OAuth is delegated authorization, not authentication. You still need
          an OIDC <code>/userinfo</code> call (or an ID token) to learn who
          the user is.
        </>,
        <>
          Never put secrets, passwords, or unencrypted PII in a JWT payload —
          it is signed (integrity), not encrypted (confidentiality).
        </>,
      ]}
      mentalModel="Cookies are sent automatically; tokens aren't. JWT is signed, not encrypted. OAuth is delegation, not authentication."
      roadmapUrl="https://roadmap.sh/frontend"
    />
  );
}
