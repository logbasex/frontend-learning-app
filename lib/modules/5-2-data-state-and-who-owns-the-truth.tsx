"use client";

import { Card, CardContent } from "@/components/ui/card";
import { StepByStepExplanation } from "@/components/StepByStepExplanation";
import { Challenge } from "@/components/Challenge";
import { GotchaList } from "@/components/GotchaList";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { RoadmapLink } from "@/components/RoadmapLink";
import { SequenceDiagram } from "@/components/SequenceDiagram";
import { CodeComparison } from "@/components/CodeComparison";

export function Module_5_2_Content() {
  // Data blocks hoisted out of JSX for readability — listed in render order.

  const stateFlavorsSteps = [
    {
      title: "URL state: the browser address bar as source of truth",
      description: (
        <p>
          <em>URL state</em> is any value encoded in the address bar — query parameters like{" "}
          <code>?tag=meta&amp;page=2</code>, or path segments like{" "}
          <code>/posts/hello-world</code>. It has three properties no other flavor can match.
          First: it is <strong>shareable</strong> — copy the URL, paste it anywhere, and the
          recipient sees exactly the same page. Second: it is <strong>back-button-friendly</strong>{" "}
          — the browser history stack is built on URLs, so the back button works without any
          code. Third: it is <strong>server-readable</strong> — the URL arrives at the server
          before any JavaScript runs, so a server component can read the filter and return the
          right data in the first HTML response. In Next.js App Router, server components receive
          the current <code>searchParams</code> as a prop; client components call{" "}
          <code>useSearchParams()</code>. The rule: if a user might want to share or bookmark
          this view, the state belongs in the URL.
        </p>
      ),
      code: `// app/(public)/page.tsx — URL state read in a server component
// The URL ?tag=meta means only posts tagged "meta" should appear.
// searchParams arrives from Next.js before the page renders.

interface SearchParams { tag?: string; page?: string; }
interface Props { searchParams: Promise<SearchParams>; }

export default async function Home({ searchParams }: Props) {
  const { tag, page = "1" } = await searchParams;
  const pageNum = Math.max(1, parseInt(page, 10));
  const skip = (pageNum - 1) * 10;

  const posts = await prisma.post.findMany({
    where: {
      draft: false,
      // If ?tag=meta is in the URL, filter to that tag.
      // If no tag param, show all posts.
      ...(tag ? { tags: { some: { tag: { name: tag } } } } : {}),
    },
    orderBy: { publishedAt: "desc" },
    take: 10,
    skip,
  });

  return (
    <>
      {tag && <p>Showing posts tagged: <strong>{tag}</strong></p>}
      {posts.map((p) => <PostCard key={p.id} post={p} />)}
    </>
  );
}

// A user visits /?tag=meta, copies the URL, and sends it to a friend.
// The friend sees exactly the same filtered post list — no extra code needed.
// The back button restores the previous filter automatically.`,
      language: "tsx",
    },
    {
      title: "Server state: the database, shared across everyone",
      description: (
        <p>
          <em>Server state</em> is data that lives in a persistent store — a database, an
          external API, a file on disk — and is shared across all users and all sessions. Its
          defining property is that you do not own it entirely: another user can change it, the
          server can change it, and your tab will not know until it asks again. In Next.js App
          Router, a server component can call <code>prisma.post.findMany()</code> directly,
          without <code>useEffect</code>, without a separate API route, without a client-side
          fetch. The database call runs on the server; the result is serialized into HTML; the
          browser receives real content. This is the single biggest daily change React Server
          Components brought: data fetching is <em>just a function call</em> in a server
          component. The fetch happens at request time (SSR) or build time (SSG) depending on
          the page&apos;s caching strategy — but the code looks the same either way.
        </p>
      ),
      code: `// app/(public)/posts/[slug]/page.tsx
// Server state fetched directly in a server component.
// No useEffect. No useState. No API route. No client fetch.

import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import CommentList from "@/components/CommentList";
import CommentForm from "@/components/CommentForm";

interface Params { params: Promise<{ slug: string }>; }

export default async function PostPage({ params }: Params) {
  const { slug } = await params;

  // This runs on the server. prisma is never shipped to the browser.
  const post = await prisma.post.findUnique({
    where: { slug, draft: false },
    include: { author: true, tags: { include: { tag: true } } },
  });
  if (!post) notFound();

  return (
    <article>
      <h1>{post.title}</h1>
      <p>By {post.author.name}</p>
      {/* CommentList is also a server component — it queries the DB directly */}
      <CommentList postId={post.id} />
      {/* CommentForm is "use client" — it needs useState for the draft text */}
      <CommentForm postId={post.id} />
    </article>
  );
}

// The Prisma schema for reference (prisma/schema.prisma):
// model Comment {
//   id         String  @id @default(cuid())
//   postId     String
//   post       Post    @relation(...)
//   authorName String
//   body       String
//   approved   Boolean @default(false)
//   createdAt  DateTime @default(now())
// }`,
      language: "tsx",
    },
    {
      title: "Client state: ephemeral, per-tab, in-memory",
      description: (
        <p>
          <em>Client state</em> is data that exists only in a single browser tab, held in
          React&apos;s memory via <code>useState</code> or <code>useReducer</code>. It
          disappears when the tab closes, when the page refreshes, or when the user navigates
          away. Client state is the right home for anything that is purely about the current
          user&apos;s interaction: &quot;is this dropdown open?&quot;, &quot;what has the user
          typed in this textarea so far?&quot;, &quot;which accordion panel is expanded?&quot;.
          These questions have no meaning outside this tab — sharing a URL cannot answer them,
          and saving them to a database would be wasteful. The distinction matters when
          something seems like client state but is not: the comment list is not client state,
          because it is shared across users and lives in the database. The draft comment text
          is client state, because only this user cares about it and only until they submit
          or navigate away.
        </p>
      ),
      code: `// components/CommentForm.tsx — "use client"
// The draft text is client state: ephemeral, per-tab, not worth saving to a DB.

"use client";

import { useState, useTransition } from "react";
import { addComment } from "@/lib/actions/add-comment";

export default function CommentForm({ postId }: { postId: string }) {
  // Client state: the draft text the user is typing.
  // Only this tab cares about it. It disappears on refresh — that is correct.
  const [authorName, setAuthorName] = useState("");
  const [body, setBody] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        const an = String(formData.get("authorName") ?? "");
        const b = String(formData.get("body") ?? "");
        if (!an.trim() || !b.trim()) return;
        startTransition(async () => {
          const res = await addComment({ postId, authorName: an, body: b });
          if (res.ok) {
            // Clear the draft on success — the server now owns the comment.
            setAuthorName("");
            setBody("");
          }
        });
      }}
    >
      <input
        name="authorName"
        value={authorName}
        onChange={(e) => setAuthorName(e.target.value)}
        placeholder="Your name"
      />
      <textarea
        name="body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={4}
        placeholder="Write a comment..."
      />
      <button type="submit" disabled={isPending}>
        {isPending ? "Posting..." : "Post comment"}
      </button>
    </form>
  );
}`,
      language: "tsx",
    },
    {
      title: "The wrong flavor: what mismatches look like in practice",
      description: (
        <p>
          Each wrong-flavor choice produces a specific, reproducible bug. Storing a{" "}
          <em>server</em> truth in <em>client</em> state: you fetch the comment list into{" "}
          <code>useState</code> on mount. Another user posts a comment. Your state is now stale.
          Refresh the page — it works. But you will never see live updates, and if your fetch
          fails, you show old data forever with no retry. Storing a <em>URL</em> truth in{" "}
          <em>client</em> state: you put the active tag filter in <code>useState</code>. The
          user applies a filter, copies the URL, sends it to a colleague. The colleague opens it
          and sees all posts — the filter is gone, because it lived in memory and never touched
          the URL. The back button also stops working: the browser does not know the filter
          changed. Storing a <em>client</em> truth in the <em>URL</em>: you save the draft
          comment text in a query param. The URL becomes{" "}
          <code>?draft=hello+world</code>. The user hits refresh and the server receives their
          unsubmitted text. Worse, they accidentally share the URL with the draft attached.
          Mismatching flavor is the source of most &quot;it works on my machine&quot; state bugs.
        </p>
      ),
      code: `// Bug 1: server state in client state — goes stale silently
"use client";
import { useState, useEffect } from "react";

export function CommentListBug({ postId }: { postId: string }) {
  // WRONG: comment list fetched into useState.
  // Another user posts a comment — this component never knows.
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetch(\`/api/comments?postId=\${postId}\`)
      .then((r) => r.json())
      .then(setComments);
  }, [postId]);

  return <ul>{comments.map((c) => <li key={c.id}>{c.body}</li>)}</ul>;
}

// Fix: make it a server component and query directly.
// The server re-renders with fresh data on each request.

// ──────────────────────────────────────────────────────────
// Bug 2: URL state in client state — back button broken
"use client";
import { useState } from "react";

export function TagFilterBug() {
  // WRONG: active tag stored in useState.
  // The URL never changes. The back button does nothing.
  // Copy the URL — the filter is lost.
  const [activeTag, setActiveTag] = useState<string | null>(null);
  return (
    <button onClick={() => setActiveTag("meta")}>Filter: meta</button>
  );
}

// Fix: navigate to /?tag=meta instead.
// URL state = the back button works + URL is shareable.`,
      language: "tsx",
    },
    {
      title: "Server actions: forms as state transitions",
      description: (
        <p>
          A <em>server action</em> is a function marked with the <code>&quot;use server&quot;</code>{" "}
          directive that runs on the server when a form submits or when called from a client
          component. Under the hood it is a POST request — Next.js serializes the form data,
          sends it to a special endpoint, runs the function, and returns the result. Because it
          runs on the server, it can call <code>prisma</code> directly, validate inputs, check
          authorization, and write to the database — all in one function, no API route needed.
          The reference app&apos;s real <code>addComment</code> action shows the shape: receive
          input, validate with a schema, confirm the post exists and is published, call{" "}
          <code>prisma.comment.create</code>, then call <code>revalidatePath</code> to invalidate
          the page cache so the next request sees the new comment.
        </p>
      ),
      code: `// lib/actions/add-comment.ts — the real server action from taproot-blog/app
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { commentSchema } from "@/lib/validators/comment";

export async function addComment(input: unknown) {
  // 1. Validate — never trust client-supplied data.
  const parsed = commentSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Invalid input" };

  const { postId, authorName, body } = parsed.data;

  // 2. Confirm the post exists and is published.
  //    Authorization check — reject comments on draft posts.
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { slug: true, draft: true },
  });
  if (!post || post.draft) return { ok: false as const, error: "Post not found" };

  // 3. Write to the database.
  //    New comments enter the moderation queue (approved: false by default).
  const comment = await prisma.comment.create({
    data: { postId, authorName, body },
  });

  // 4. Invalidate the cache so the next page load shows the new comment.
  revalidatePath(\`/posts/\${post.slug}\`);

  return { ok: true as const, comment };
}

// The action is called from CommentForm (a client component):
//   const res = await addComment({ postId, authorName, body });
// Next.js serializes the call as a POST request.
// No API route needed. No fetch() needed. No Express handler needed.`,
      language: "ts",
    },
    {
      title: "Cache invalidation: telling Next.js the server state changed",
      description: (
        <p>
          After a server action mutates the database, the page cache still holds the pre-mutation
          HTML. The user sees the old comment list until they hard-refresh. The fix is{" "}
          <em>cache invalidation</em>: explicitly telling Next.js to discard a cached entry.
          Two functions do this. <code>revalidatePath(path)</code> invalidates all cached
          variants of a specific path — useful when you know exactly which page changed.{" "}
          <code>revalidateTag(tag)</code> invalidates all cached fetch calls tagged with a
          string, which is more surgical — useful when the same data appears on multiple pages.
          Both must be called from a server action or Route Handler. After invalidation, the
          next request to that path re-runs the server component, fetches fresh data from the
          database, and produces new HTML. The current request&apos;s user still sees the stale
          page; the next user (or the same user after navigation) sees the fresh one. This is the
          expected behavior — not a bug. If you need the current user to see the new comment
          immediately, use optimistic updates in the client component (the reference app does
          exactly this via <code>useOptimistic</code>).
        </p>
      ),
      code: `// Two invalidation strategies — path vs tag

// Strategy 1: revalidatePath — invalidate one specific page
// Use when you know exactly which URL changed.
import { revalidatePath } from "next/cache";

async function createComment(postSlug: string, data: unknown) {
  // ... validate + write to DB ...

  // Throws away the cached HTML for /posts/hello-world.
  // The next request re-renders the page with the new comment.
  revalidatePath(\`/posts/\${postSlug}\`);
}

// ──────────────────────────────────────────────────────────────
// Strategy 2: revalidateTag — surgical, multi-page invalidation
// Use when the same data appears on multiple pages.
import { revalidateTag } from "next/cache";
import { unstable_cache } from "next/cache";

// Tag a data-fetching call when you cache it:
const getComments = unstable_cache(
  async (postId: string) => prisma.comment.findMany({ where: { postId, approved: true } }),
  ["comments"],
  { tags: ["comments", \`post-comments:\${postId}\`] }
);

// After a mutation, invalidate by tag — affects all pages using this data:
async function createComment(postId: string, data: unknown) {
  // ... write to DB ...
  revalidateTag(\`post-comments:\${postId}\`);
  // Only the pages that display comments for THIS post are invalidated.
  // Other cached pages are untouched — no unnecessary re-renders.
}

// Common mistake: revalidatePath("/") invalidates every path that includes "/"
// — which is every path. It is a sledgehammer. Prefer revalidateTag for precision.`,
      language: "ts",
    },
    {
      title: "The full picture: URL + server + client + action + invalidation together",
      description: (
        <p>
          The comment flow in the reference app uses all three state flavors correctly in
          concert. <em>URL state</em> in the path segment (<code>/posts/hello-world</code>)
          determines which post to show — the server reads the slug and fetches the right post.{" "}
          <em>Server state</em> in the database holds the approved comments — the{" "}
          <code>CommentList</code> server component queries them directly. <em>Client state</em>{" "}
          in <code>CommentForm</code> holds the draft text the user is typing — ephemeral,
          per-tab, discarded on submit. When the user submits, the <em>server action</em>{" "}
          <code>addComment</code> validates, writes to the DB, and calls{" "}
          <code>revalidatePath</code> to invalidate the post page. The next request re-renders
          the page with the new comment visible. No flavor is mismatched: the right authority
          owns the right data.
        </p>
      ),
      code: `// The complete comment flow — all three flavors in one view

// ── 1. URL state: path segment tells the server which post to render ──
// app/(public)/posts/[slug]/page.tsx
export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;                         // URL state: which post?

  const post = await prisma.post.findUnique({ where: { slug, draft: false }, ... });
  if (!post) notFound();

  return (
    <article>
      <h1>{post.title}</h1>
      {/* Server state: CommentList queries the DB — no props drilling */}
      <CommentList postId={post.id} />
      {/* Client state: CommentForm tracks draft text in useState */}
      <CommentForm postId={post.id} />
    </article>
  );
}

// ── 2. Server state: CommentList reads directly from the DB ──
// components/CommentList.tsx (server component — no "use client")
export default async function CommentList({ postId }: { postId: string }) {
  const comments = await prisma.comment.findMany({
    where: { postId, approved: true },
    orderBy: { createdAt: "asc" },
  });
  return <ul>{comments.map((c) => <li key={c.id}>{c.body}</li>)}</ul>;
}

// ── 3. Server action: mutation + cache invalidation ──
// lib/actions/add-comment.ts
"use server";
export async function addComment(input: unknown) {
  const parsed = commentSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Invalid input" };
  const { postId, authorName, body } = parsed.data;

  const post = await prisma.post.findUnique({ where: { id: postId }, select: { slug: true, draft: true } });
  if (!post || post.draft) return { ok: false as const, error: "Post not found" };

  await prisma.comment.create({ data: { postId, authorName, body } });
  revalidatePath(\`/posts/\${post.slug}\`);          // server state invalidated
  return { ok: true as const };
}`,
      language: "tsx",
    },
  ];

  const wrongFilterCode = `// Filter stored in useState — back button and sharing are broken.
"use client";
import { useState } from "react";
import { PostCard } from "./PostCard";

export function PostList({ initialPosts }: { initialPosts: Post[] }) {
  // WRONG FLAVOR: the active tag is URL state, but we're storing it
  // in client state. The URL never changes.
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [posts] = useState(initialPosts);

  const visible = activeTag
    ? posts.filter((p) => p.tags.some((t) => t.name === activeTag))
    : posts;

  return (
    <div>
      <button onClick={() => setActiveTag("meta")}>meta</button>
      <button onClick={() => setActiveTag(null)}>all</button>
      {visible.map((p) => <PostCard key={p.id} post={p} />)}
    </div>
  );
}

// What breaks:
//   - User filters to "meta", copies URL, pastes to Slack.
//     Recipient sees ALL posts — the filter was in memory, not the URL.
//   - User clicks Back after filtering. Browser goes to the previous page,
//     not the previous filter — useState has no history entry.
//   - User refreshes. Filter resets to null — the page re-renders
//     with initialPosts, which may already be stale server state.`;

  const rightFilterCode = `// Filter in the URL — back button and sharing work automatically.
// app/(public)/page.tsx  (server component)
import { prisma } from "@/lib/db";
import { PostCard } from "@/components/PostCard";

interface Props { searchParams: Promise<{ tag?: string }>; }

export default async function Home({ searchParams }: Props) {
  const { tag } = await searchParams;

  // Server component reads ?tag=meta from the URL.
  // The URL is the source of truth — no useState needed.
  const posts = await prisma.post.findMany({
    where: {
      draft: false,
      ...(tag ? { tags: { some: { tag: { name: tag } } } } : {}),
    },
    orderBy: { publishedAt: "desc" },
    include: { author: true, tags: { include: { tag: true } } },
  });

  return (
    <div>
      {/* Navigating to /?tag=meta changes the URL — back button works */}
      <a href="/?tag=meta">meta</a>
      <a href="/">all</a>
      {posts.map((p) => <PostCard key={p.id} post={p} />)}
    </div>
  );
}

// What works now:
//   - Filter to "meta", copy URL /?tag=meta, paste to Slack.
//     Recipient sees the same filtered view.
//   - Click Back: URL changes back — server returns unfiltered posts.
//   - Refresh: URL still has ?tag=meta — server returns the same filtered list.`;

  const serverActionSequenceActors = ["Browser", "Next.js Server", "Database", "Page Cache"];
  const serverActionSequenceMessages = [
    { from: "Browser", to: "Next.js Server", label: "POST (server action: addComment)", note: "form data serialized by Next.js" },
    { from: "Next.js Server", to: "Database", label: "prisma.comment.create(...)", note: "insert new comment row" },
    { from: "Database", to: "Next.js Server", label: "new comment row", note: "" },
    { from: "Next.js Server", to: "Page Cache", label: "revalidatePath('/posts/hello-world')", note: "stale entry evicted" },
    { from: "Next.js Server", to: "Browser", label: "{ ok: true }", note: "action result returned" },
    { from: "Browser", to: "Next.js Server", label: "GET /posts/hello-world", note: "next navigation — cache miss" },
    { from: "Next.js Server", to: "Database", label: "prisma.comment.findMany(...)", note: "fresh query — includes new comment" },
    { from: "Next.js Server", to: "Browser", label: "new HTML (with comment)", note: "re-rendered page" },
  ];

  const gotchaItems = [
    {
      title: "URL state is public — never put tokens or user-specific secrets in query params",
      body: (
        <>
          Anything in <code>?...</code> is visible in browser history, server logs, referrer
          headers, and to anyone who receives the link. Filter tags, search terms, and page
          numbers belong in the URL. Session tokens, access tokens, and any personally
          identifying data do not. If you catch yourself adding <code>?userId=abc123</code> to
          a URL, stop — use a session cookie instead.
        </>
      ),
    },
    {
      title: "Server actions are POST requests — validate and authorize on the server, not the client",
      body: (
        <>
          A server action like <code>addComment</code> is a real HTTP POST endpoint. Any client
          can call it directly with <code>fetch</code> — your beautiful client-side validation
          can be bypassed entirely. Always validate the shape of the input (Zod{" "}
          <code>safeParse</code> works well), confirm authorization (is the post published? is
          the user allowed to comment?), and treat every input as untrusted. The client
          validation is a UX convenience, not a security gate.
        </>
      ),
    },
    {
      title: "revalidatePath('/') invalidates every cached page — use revalidateTag for precision",
      body: (
        <>
          <code>revalidatePath</code> matches by path prefix, and <code>&quot;/&quot;</code>{" "}
          matches everything. Calling <code>revalidatePath(&quot;/&quot;)</code> after adding
          one comment throws away the cached HTML for every single page on your site. The next
          request to each page triggers a full re-render. Under any real traffic this causes a
          cache stampede. Use <code>revalidateTag</code> with a specific tag like{" "}
          <code>&quot;post-comments:hello-world&quot;</code> to invalidate only the pages that
          need it.
        </>
      ),
    },
    {
      title: "useState in a server component is a TypeError — don't add 'use client' reflexively",
      body: (
        <>
          When you see the error &quot;React hooks cannot be called in a server component,&quot;
          the instinct is to add <code>&quot;use client&quot;</code> at the top and move on. But
          ask the question first: does this component actually need to run in the browser? A
          component that only fetches data and renders it has no reason to be a client component.
          Adding <code>&quot;use client&quot;</code> ships that component&apos;s code — and all
          its imports — to the browser bundle. If the component imports Prisma, you now have a
          build error. Prefer extracting the interactive part into a small client component and
          keeping the rest on the server.
        </>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-3xl font-bold">Data, State, and Who Owns the Truth</h1>
        <RoadmapLink url="https://roadmap.sh/frontend" />
      </div>

      {/* 1. Hook */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            The Next.js blog from Stage V, module one is deployed. A product feature request
            arrives: filter posts by tag. You implement it. The user clicks a tag, the URL
            updates to <code>/?tag=meta</code>, the server returns filtered posts, and the page
            re-renders. It works.
          </p>
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            Now the user clicks &quot;Add comment&quot; on a post. The form submits via a server
            action. The server creates the comment in the database and calls{" "}
            <code>revalidatePath</code>. But the page does not visibly update — the new comment
            is nowhere to be seen. Three separate places now hold a version of the comment list,
            and they disagree:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-slate-900 text-slate-100 rounded p-4 font-mono text-sm leading-relaxed">
              <p className="text-blue-400 font-semibold mb-2">URL</p>
              <p className="text-slate-400">
                <code>/posts/hello-world?tag=meta</code>
              </p>
              <p className="text-slate-500 text-xs mt-2">
                Was the user filtering when they posted? Does <code>?tag=meta</code> apply to
                comments? The URL does not answer this — nobody asked it to.
              </p>
            </div>
            <div className="bg-slate-900 text-slate-100 rounded p-4 font-mono text-sm leading-relaxed">
              <p className="text-green-400 font-semibold mb-2">Database (the server)</p>
              <p className="text-slate-300">3 comments</p>
              <p className="text-slate-500 text-xs mt-2">
                The server action ran. The database has the new row. This is the truth — but
                nothing on the page reflects it yet.
              </p>
            </div>
            <div className="bg-slate-900 text-slate-100 rounded p-4 font-mono text-sm leading-relaxed">
              <p className="text-amber-400 font-semibold mb-2">Client cache (the browser)</p>
              <p className="text-slate-300">2 comments</p>
              <p className="text-slate-500 text-xs mt-2">
                The router cached the pre-action HTML. The user sees 2 comments. The{" "}
                <code>revalidatePath</code> call expired the server cache — but the browser
                never re-fetched the page.
              </p>
            </div>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            Three sources. Three answers. One of them is right. Where is the truth, and who is
            allowed to know?
          </p>
        </CardContent>
      </Card>

      {/* 2. Mental model */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            Every value in a frontend application lives in one of three flavors of state, each
            with a different authority, a different lifetime, and a different audience. Confuse
            the flavors and you produce stale UIs, broken back buttons, and security
            vulnerabilities. Match them correctly and the complexity dissolves: each part of the
            system owns exactly what it should.
          </p>
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            The three flavors are <em>URL state</em> (the address bar — shareable, back-button
            driven, server-readable on first load), <em>server state</em> (the database — shared
            across users, fetched at request time, the authority for all persisted data), and{" "}
            <em>client state</em> (React&apos;s memory — ephemeral, per-tab, appropriate only
            for things that exist only in the current interaction). Each expires differently:
            URL state expires on navigation, server state expires when the database changes,
            client state expires when the tab closes.
          </p>
          <blockquote className="border-l-4 border-blue-500 pl-4 italic text-slate-600 dark:text-slate-400">
            State has three flavors; matching the flavor to the data shape avoids 90% of
            state-management pain.
          </blockquote>
        </CardContent>
      </Card>

      {/* 3. Step-by-step */}
      <h2 className="text-xl font-semibold mb-3">
        The three flavors, their mismatches, and how mutations work
      </h2>
      <StepByStepExplanation
        title="URL state, server state, client state, server actions, and cache invalidation"
        description="Each step adds one piece of the picture. By step 7 the full comment flow — URL routing, database reads, client drafts, server action mutation, and cache invalidation — fits together as a single coherent system."
        steps={stateFlavorsSteps}
      />

      {/* Optional: server-action sequence */}
      <SequenceDiagram
        title="Server action lifecycle: from form submit to fresh page"
        description="The browser POSTs the form data to the server action. The server writes to the database, evicts the stale cache entry, and returns a result. The next navigation re-renders the page with fresh data."
        actors={serverActionSequenceActors}
        messages={serverActionSequenceMessages}
      />

      {/* 4. Playground (no live playground; using comparison since Next.js needs server runtime) */}
      <CodeComparison
        title="Wrong flavor vs right flavor: the tag filter"
        description="Left: the tag filter stored in useState — the URL never changes, the back button is broken, sharing the URL loses the filter. Right: the filter in the URL as a searchParam — the server reads it, the back button works, and the URL is shareable."
        oldCode={{
          title: "Wrong: URL state in client state (useState)",
          code: wrongFilterCode,
          language: "tsx",
          cons: [
            "Sharing the URL loses the filter — it lived in memory, not the address bar.",
            "The back button goes to the previous page, not the previous filter.",
            "Refresh resets the filter to null — the server never knew about it.",
          ],
        }}
        newCode={{
          title: "Right: URL state in the URL (searchParams)",
          code: rightFilterCode,
          language: "tsx",
          pros: [
            "Share /?tag=meta — the recipient sees the same filtered view.",
            "Back button works: navigation changes the URL, which changes the filter.",
            "Refresh preserves the filter: the URL still has ?tag=meta.",
          ],
        }}
      />

      {/* 5. Challenges */}
      <h2 className="text-xl font-semibold mb-3">Challenges</h2>

      <Challenge
        title="Pick the right state flavor: the persistent draft"
        question={`You are adding a feature to the Taproot Blog comment form: if the user types a draft comment and then navigates to a different post and back, the draft should still be there.

Which state flavor — or combination — best matches this requirement?`}
        options={[
          {
            id: "a",
            text: "URL state. Encode the draft text as a query parameter (?draft=...) so it survives navigation and can be restored.",
          },
          {
            id: "b",
            text: "Server state. Save the draft to the database as a 'pending' comment so it survives even a browser close.",
          },
          {
            id: "c",
            text: "Plain client state (useState only). Store the draft in useState — it is ephemeral, which is fine for a draft.",
          },
          {
            id: "d",
            text: "localStorage-backed client state. Persist the draft to localStorage when it changes and restore it on mount. It survives navigation and refresh, is per-tab and per-user, and disappears when the user submits or clears it.",
          },
        ]}
        correctAnswerId="d"
        explanation={
          <p>
            The requirement is &quot;survives navigation and refresh, per this user, for this
            post.&quot; Plain <code>useState</code> (option c) does not survive navigation.
            URL state (option a) puts the draft in the address bar — the user could accidentally
            share a URL with their unsaved text attached; it also clutters the URL and confuses
            the back button. Server state (option b) is the wrong authority: a draft nobody has
            submitted yet is a client-side concern, not a database concern; saving every
            keystroke to the DB is wasteful and requires auth. The right answer is
            <code>localStorage</code>-backed client state: ephemeral from the server&apos;s
            perspective, persistent enough to survive a navigation, private to this browser,
            and cleared on submit. This is the standard pattern for form draft recovery.
          </p>
        }
      />

      <Challenge
        title="What does the user see after a server action with no revalidation?"
        question={`A developer ships a new createPost server action. The action validates the input, calls prisma.post.create(...), and returns { ok: true }. It does not call revalidatePath or revalidateTag.

The developer tests it: they submit the form, the action returns ok, and they are redirected to the homepage. What does the user see on the homepage?`}
        options={[
          {
            id: "a",
            text: "The new post appears immediately. Server actions always invalidate the page cache automatically.",
          },
          {
            id: "b",
            text: "The homepage shows the old post list — the cached HTML from before the action ran. The new post is in the database but the page cache does not know. The user must hard-refresh to see it.",
          },
          {
            id: "c",
            text: "The homepage shows a 500 error, because the page tried to re-render and the new post caused a Prisma type error.",
          },
          {
            id: "d",
            text: "The homepage shows the old list until the Next.js ISR revalidation window expires (default: 30 seconds), then the new post appears.",
          },
        ]}
        correctAnswerId="b"
        explanation={
          <p>
            Server actions do not automatically invalidate the page cache. The action wrote
            to the database, but Next.js still holds the previously cached HTML for the
            homepage. The next request to <code>/</code> returns that stale HTML — the new
            post is invisible. Option a is wrong: cache invalidation is explicit, not
            automatic. Option c is wrong: no error occurs; the cached HTML is served without
            touching the database again. Option d is wrong: there is no default ISR window
            that rescues you here. The fix is to call <code>revalidatePath(&quot;/&quot;)</code>{" "}
            or, better, <code>revalidateTag(&quot;posts&quot;)</code> before returning from the
            action. This is the most common mistake developers make the first time they write
            a server action.
          </p>
        }
      />

      {/* 6. GotchaList */}
      <h2 className="text-xl font-semibold mb-3">Things that surprise people</h2>
      <GotchaList items={gotchaItems} />

      {/* 7. KeyTakeaways */}
      <KeyTakeaways
        mentalModel="State has three flavors; matching the flavor to the data shape avoids 90% of state-management pain."
        points={[
          <>
            <em>URL state</em> lives in the address bar. It is shareable, back-button-friendly,
            and readable by the server before any JavaScript runs. Filters, pagination, and
            any view that a user might want to share belong here. In Next.js App Router, server
            components receive it via the <code>searchParams</code> prop; client components
            call <code>useSearchParams()</code>.
          </>,
          <>
            <em>Server state</em> is the database — shared across users and sessions. In a
            server component, fetching it is a direct function call:{" "}
            <code>prisma.post.findMany()</code>. No <code>useEffect</code>, no{" "}
            <code>fetch()</code>, no API route. The data is serialized into the HTML response
            and arrives at the browser already rendered. This is the biggest daily change React
            Server Components brought to data fetching.
          </>,
          <>
            <em>Client state</em> is React&apos;s in-memory state via <code>useState</code>.
            It is ephemeral, per-tab, and disappears when the tab closes. It is the right home
            for anything purely about the current interaction: draft text, open/closed UI state,
            optimistic updates. Storing server state in client state is the primary cause of
            stale UIs.
          </>,
          <>
            A <em>server action</em> is a function marked <code>&quot;use server&quot;</code>{" "}
            that runs on the server when a form submits or when called from a client component.
            It is a POST request under the hood. Validate inputs on the server — client
            validation can be bypassed. After mutating the database, call{" "}
            <code>revalidatePath</code> or <code>revalidateTag</code> to evict the stale cache
            entry so the next request produces fresh HTML.
          </>,
          <>
            <em>Cache invalidation</em> is explicit in Next.js — mutations do not automatically
            update cached pages. Use <code>revalidateTag</code> with a precise tag rather than{" "}
            <code>revalidatePath(&quot;/&quot;)</code>, which invalidates every cached page and
            can cause a cache stampede under real traffic.
          </>,
        ]}
      />
    </div>
  );
}
