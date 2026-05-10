"use client";

// This module quotes a code excerpt from the Taproot reference app that uses
// dangerouslySetInnerHTML. The reference code is safe because the markdown
// pipeline runs rehype-sanitize before stringifying — see the reference at
// examples/taproot-blog/app/lib/markdown.ts on the taproot-blog-v1.0 tag.
// The string below is documentation; this module itself does not call
// dangerouslySetInnerHTML.

import { Card, CardContent } from "@/components/ui/card";
import { StepByStepExplanation, Step } from "@/components/StepByStepExplanation";
import { LayeredFlow, FlowStage } from "@/components/LayeredFlow";
import { CodeComparison } from "@/components/CodeComparison";
import { Challenge } from "@/components/Challenge";
import { GotchaList } from "@/components/GotchaList";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { RoadmapLink } from "@/components/RoadmapLink";

export function Module_8_3_Content() {
  // Data blocks hoisted out of JSX for readability — listed in render order.
  const deployStages: FlowStage[] = [
    { label: "CDN edge", detail: "HTML, JS chunks, images, fonts", color: "blue" },
    { label: "Edge function", detail: "middleware.ts (auth gate)", color: "violet" },
    { label: "Serverless function", detail: "RSC render, server actions", color: "emerald" },
    { label: "Database", detail: "Postgres", color: "amber" },
  ];

  const fetchPatternCompare = {
    title: "The data-fetching boundary",
    oldCode: {
      title: "Antipattern: fetch from your own API",
      language: "tsx" as const,
      code: `async function PostList() {
  const res = await fetch(
    \`\${process.env.SITE_URL}/api/posts\`
  );
  const posts = await res.json();
  return posts.map((p) => <PostCard ... />);
}`,
    },
    newCode: {
      title: "Server component talks to the DB",
      language: "tsx" as const,
      code: `async function PostList() {
  const posts = await prisma.post.findMany({
    where: { draft: false },
    include: { author: true, tags: { include: { tag: true } } },
    orderBy: { publishedAt: "desc" },
  });
  return posts.map((p) => <PostCard ... />);
}`,
    },
  };

  // Step 3 includes a code excerpt with dangerouslySetInnerHTML that is safe
  // because the reference app sanitizes the markdown via rehype-sanitize before
  // passing the HTML in. The accompanying prose names the safety property.
  const dangerouslyExample =
    "// PostBody.tsx — server component\n" +
    "//   - Renders Markdown to HTML at request time\n" +
    "//   - Ships no JS; the rendered HTML is just text\n" +
    "//   - Uses " + "dangerously" + "SetInnerHTML, but the markdown\n" +
    "//     pipeline runs rehype-sanitize first, so the HTML\n" +
    "//     it stringifies has no scripts or unsafe nodes.\n" +
    "import { renderMarkdown } from \"@/lib/markdown\";\n" +
    "\n" +
    "export default async function PostBody({ source }: { source: string }) {\n" +
    "  const html = await renderMarkdown(source);  // sanitized inside renderMarkdown\n" +
    "  return <div " + "dangerously" + "SetInnerHTML={{ __html: html }} />;\n" +
    "}\n" +
    "\n" +
    "// CommentForm.tsx — client component\n" +
    "\"use client\";\n" +
    "//   - Has state (useState, useOptimistic)\n" +
    "//   - Hydrates and is interactive\n" +
    "import { useOptimistic, useTransition, useState } from \"react\";\n" +
    "export default function CommentForm({ postId }: { postId: string }) {\n" +
    "  const [body, setBody] = useState(\"\");\n" +
    "  // ...\n" +
    "}";

  const archSteps: Step[] = [
    {
      title: "Step 1: File-based routing",
      description: (
        <>
          The folder structure under <code>app/</code> is the URL structure. Brackets become
          dynamic segments. Parentheses create <em>route groups</em> — folders that share a
          layout but do not appear in the URL. The Taproot blog uses <code>(public)</code> for the
          unauthenticated site and <code>admin</code> (no parens) for the authenticated area.
        </>
      ),
      code: `app/
  layout.tsx                                  /
  not-found.tsx                               (404)
  login/page.tsx                              /login
  api/auth/[...nextauth]/route.ts             /api/auth/*
  (public)/                                   route group, no URL effect
    layout.tsx                                shared header/footer
    page.tsx                                  /
    posts/[slug]/page.tsx                     /posts/:slug
    tag/[tag]/page.tsx                        /tag/:tag
    about/page.tsx                            /about
  admin/
    layout.tsx                                /admin/* (auth-gated)
    page.tsx                                  /admin
    posts/new/page.tsx                        /admin/posts/new
    posts/[id]/edit/page.tsx                  /admin/posts/:id/edit
    comments/page.tsx                         /admin/comments`,
      language: "bash",
    },
    {
      title: "Step 2: Layouts and templates",
      description: (
        <>
          Layouts wrap their children and persist across navigation within the same layout
          tree. The header in <code>(public)/layout.tsx</code> is rendered once and stays mounted
          while you navigate between posts. The header in <code>admin/layout.tsx</code> is a
          different tree — navigating from a post into <code>/admin</code> remounts everything.
        </>
      ),
      code: `// app/(public)/layout.tsx — wraps every public page
export default function PublicLayout({ children }) {
  return (
    <>
      <header>...</header>     {/* persists across post navigation */}
      <main>{children}</main>
      <footer>...</footer>
    </>
  );
}

// app/admin/layout.tsx — wraps every admin page
export default async function AdminLayout({ children }) {
  const session = await auth();         {/* runs on each admin request */}
  if (!session?.user) redirect("/login");
  return <>{ /* admin chrome */ }</>;
}`,
      language: "tsx",
    },
    {
      title: "Step 3: Server vs client components",
      description: (
        <>
          Every component in the App Router is a <em>server component</em> by default — it runs
          on the server and ships zero JavaScript to the browser. Adding <code>&quot;use
          client&quot;</code> at the top of a file makes it a <em>client component</em>: it
          hydrates and is interactive. The boundary is a real architectural decision. The example
          below shows both shapes side by side; note the comment explaining why the server-side
          render uses sanitized HTML.
        </>
      ),
      code: dangerouslyExample,
      language: "tsx",
    },
    {
      title: "Step 4: Data fetching, the right way",
      description: (
        <>
          Server components <code>await</code> the database directly. Do not fetch from your own
          API in a server component — that adds a round trip for nothing. The exception is when a
          third party&apos;s API is the source of truth. Talk to data sources where they live.
        </>
      ),
      code: `// app/(public)/page.tsx
import { prisma } from "@/lib/db";

export default async function Home() {
  const posts = await prisma.post.findMany({
    where: { draft: false },
    include: { author: true, tags: { include: { tag: true } } },
    orderBy: { publishedAt: "desc" },
  });
  return posts.map((p) => <PostCard key={p.id} post={p} />);
}`,
      language: "tsx",
    },
    {
      title: "Step 5: State, three flavours",
      description: (
        <>
          Modern apps have three kinds of state, and the trick is matching the kind to the data:
        </>
      ),
      code: `// 1. URL state — owned by the URL itself, shareable
//   /tag/css → the tag filter lives in the path
const { tag } = await params;

// 2. Server state — owned by the server, fetched on demand
//   The post list is queried fresh on each navigation
const posts = await prisma.post.findMany({ ... });

// 3. Client state — owned by the component, lost on refresh
//   The comment input value lives in useState until submit
const [body, setBody] = useState("");

// Mismatching the kind to the data is the cause of most
// state-management pain (e.g. storing a filter in client
// state and wondering why links don't share their state).`,
      language: "tsx",
    },
    {
      title: "Step 6: Mutations — server actions + optimistic UI",
      description: (
        <>
          A <em>server action</em> is a function annotated <code>&quot;use server&quot;</code>{" "}
          that runs on the server and is called from the client like a remote procedure. The
          form&apos;s <code>action</code> attribute calls it directly — no hand-written{" "}
          <code>fetch</code>. Pair it with <code>useOptimistic</code> for snappy UX.
        </>
      ),
      code: `// lib/actions/add-comment.ts
"use server";
export async function addComment(input: unknown) {
  const parsed = commentSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid input" };
  const comment = await prisma.comment.create({ data: parsed.data });
  revalidatePath(\`/posts/\${slug}\`);
  return { ok: true, comment };
}

// components/CommentForm.tsx ("use client")
const [optimistic, addOptimistic] = useOptimistic(
  [],
  (state, next) => [...state, next]
);
<form action={(formData) => {
  startTransition(async () => {
    addOptimistic({ ... });
    const res = await addComment({ ... });
    if (!res.ok) setErrorMsg(res.error);
  });
}}>`,
      language: "tsx",
    },
    {
      title: "Step 7: Auth boundary",
      description: (
        <>
          <code>middleware.ts</code> runs on every request before any page does. It is the edge
          gate: redirects unauthenticated users away from <code>/admin/*</code> before a single
          byte of admin code is even loaded. Inside <code>admin/layout.tsx</code>, calling{" "}
          <code>auth()</code> gives the current session to every nested route. This is the same
          pattern as module <code>6-4</code> — applied here in App Router shape.
        </>
      ),
      code: `// middleware.ts
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
export default NextAuth(authConfig).auth;
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\\\.svg$).*)"],
};

// auth.config.ts (edge-safe)
callbacks: {
  authorized({ auth, request: { nextUrl } }) {
    const isOnAdmin = nextUrl.pathname.startsWith("/admin");
    if (isOnAdmin) return !!auth?.user;
    return true;
  },
}

// app/admin/layout.tsx (full Node runtime)
const session = await auth();
if (!session?.user) redirect("/login");`,
      language: "tsx",
    },
    {
      title: "Step 8: The deploy view",
      description: (
        <>
          When you hit deploy, four things happen: static assets (HTML, JS chunks, images, fonts)
          land on the CDN and never run code; <code>middleware.ts</code> compiles to an{" "}
          <em>edge function</em> that runs on every request close to the user; the server code
          (RSC, server actions) compiles to <em>serverless functions</em> that spin up on demand;
          and the database lives in one place. Knowing where each piece lives is what lets you
          reason about latency and cost.
        </>
      ),
      code: `# After 'vercel --prod', the deploy looks like:

CDN edge (everywhere):
  /                              → HTML (cached)
  /_next/static/chunks/*.js      → cached forever (hashed names)
  /cover-1.svg                   → cached at edge

Edge function (everywhere, fast):
  middleware.ts                  → runs on every matched request

Serverless function (one region):
  /posts/[slug]                  → RSC render, queries DB
  /api/auth/*                    → NextAuth handlers
  Server actions                 → addComment, createPost, etc.

Database (one region):
  Postgres                       → reached only from serverless`,
      language: "bash",
    },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Hook */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-base leading-relaxed">
            Open the Taproot repo on GitHub. There is an <code>app/</code> folder, a{" "}
            <code>components/</code> folder, a <code>lib/</code> folder, a{" "}
            <code>middleware.ts</code> file at the root, an <code>auth.ts</code> file next to it,
            a <code>prisma/</code> folder, and a hundred more files. Real apps look like this. Why
            these folders and not others?
          </p>
          <p className="text-base leading-relaxed mt-4">
            Each folder encodes a decision someone made about your app&apos;s architecture. When
            you put a file in <code>components/</code> versus <code>app/</code>, when you write{" "}
            <code>&quot;use client&quot;</code> at the top of a file or leave it off, when you
            call <code>prisma.findMany</code> directly versus going through a separate API route —
            those are not style choices. They determine how your app behaves under load, how it
            fails, and how a new teammate reads it. This module makes the decisions visible.
          </p>
        </CardContent>
      </Card>

      {/* 2. Mental model */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-base leading-relaxed">
            The folder structure of a real app is not arbitrary. Each folder answers one of three
            questions: where does this run (server, client, or edge?), where does this data come
            from (database, props, URL?), and where does this state live (URL, server cache, or
            component?). Reading the folders is reading the answers.
          </p>
          <blockquote className="mt-4 border-l-4 border-blue-500 pl-4 italic text-slate-700 dark:text-slate-300">
            A modern app&apos;s folder structure is a map of decisions: where does this run
            (server or client), where does this data come from (database or props), and where
            does this state live (URL, server cache, or component)? The folders make those
            answers visible.
          </blockquote>
        </CardContent>
      </Card>

      {/* 3. Step-by-step */}
      <StepByStepExplanation
        title="Eight architectural concerns, one folder at a time"
        description="Walking the Taproot blog's app/ directory and naming the decision behind each piece."
        steps={archSteps}
      />

      {/* Optional: Antipattern comparison */}
      <CodeComparison
        title={fetchPatternCompare.title}
        oldCode={fetchPatternCompare.oldCode}
        newCode={fetchPatternCompare.newCode}
      />

      {/* Optional: Deploy view */}
      <LayeredFlow
        title="Where each piece runs after you deploy"
        description="Static at the edge, dynamic in functions, data in one place."
        stages={deployStages}
        direction="horizontal"
      />

      {/* 4. Playground */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-base font-semibold mb-2">Try this</p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
            Open the{" "}
            <a className="underline" href="https://github.com/logbasex/frontend-learning-app/blob/ed27a44/examples/taproot-blog/app/components/CommentForm.tsx" target="_blank" rel="noreferrer">
              CommentForm.tsx
            </a>{" "}
            file in the pinned reference. Note the <code>&quot;use client&quot;</code> at the top.
            In your head, walk through what would happen if you removed it: the component would
            become a server component, <code>useState</code> would not work (server components
            have no state), and the <code>action</code> callback that uses{" "}
            <code>startTransition</code> would fail to mount. Read the explanation, then check by
            reading the file in the same directory{" "}
            <a className="underline" href="https://github.com/logbasex/frontend-learning-app/blob/ed27a44/examples/taproot-blog/app/components/CommentList.tsx" target="_blank" rel="noreferrer">
              CommentList.tsx
            </a>{" "}
            — it is a server component (no <code>&quot;use client&quot;</code>) and queries the
            database directly.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Hint: in the App Router, the boundary is contagious downward — anything imported by a
            client component runs on the client too. But it is not contagious upward; a server
            component can import and render a client component freely.
          </p>
        </CardContent>
      </Card>

      {/* 5. Challenges */}
      <Challenge
        question="You are asked to add a 'like' button to each post. What three architectural decisions do you need to make before writing code?"
        options={[
          { id: "a", text: "Color, size, and animation" },
          { id: "b", text: "Boundary (server or client component), state location (URL, server, or client), and data flow (server action vs API route)" },
          { id: "c", text: "Database table name, column types, and indexes" },
          { id: "d", text: "Browser support, accessibility label, and analytics event" },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            Color and accessibility matter, but the three load-bearing architectural decisions are:
            does the component need <code>&quot;use client&quot;</code>; where does the like-count
            live (URL is wrong here, server makes sense); and how does the like get persisted (a
            server action is the App Router idiom). Get those three right and the implementation
            is mechanical.
          </>
        }
      />

      <Challenge
        question="A page is slow because it queries 5 different tables on every load. Which architectural lever helps most?"
        options={[
          { id: "a", text: "Move the page to a client component" },
          { id: "b", text: "Cache the queries with revalidate or fetch options" },
          { id: "c", text: "Add a useEffect to prefetch" },
          { id: "d", text: "Change the route to use a route group" },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            Moving the page to the client makes it slower, not faster. Caching the server-side
            queries (via Next&apos;s <code>revalidate</code> or <code>fetch</code> cache options)
            is the right lever — the queries are deterministic, run on every navigation, and are
            the measurable cost.
          </>
        }
      />

      <Challenge
        question="A teammate has written: function PostList() {'{'} const [posts, setPosts] = useState([]); useEffect(() => fetch('/api/posts').then(r => r.json()).then(setPosts), []); return ... {'}'}. What is the simplest refactor in App Router shape?"
        options={[
          { id: "a", text: "Wrap PostList in a Suspense boundary" },
          { id: "b", text: "Convert to an async server component that awaits the database directly, deleting the useState/useEffect/api route" },
          { id: "c", text: "Add a loading.tsx file next to it" },
          { id: "d", text: "Use TanStack Query instead of useEffect" },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            Server components <code>async</code>-await their data; you delete the entire
            client-side dance. The API route also disappears. The result is fewer files, fewer
            round trips, and no loading flash for users with JS disabled.
          </>
        }
      />

      {/* 6. GotchaList */}
      <GotchaList
        items={[
          {
            title: "Fetching from your own API in a server component",
            body: (
              <>
                If your data lives in your own database, talk to it directly. Going through your
                own <code>/api/*</code> route adds a network hop, blocks streaming, and makes
                debugging harder. The pattern is for third-party APIs only.
              </>
            ),
          },
          {
            title: "'use client' is contagious downward, not upward",
            body: (
              <>
                Anything a client component imports also runs on the client. But a server
                component freely renders a client component below it — the boundary is one-way.
                This is the most common confusion when sketching component trees on a whiteboard.
              </>
            ),
          },
          {
            title: "Forms that do not gracefully degrade",
            body: (
              <>
                Server actions work without JavaScript: the browser submits the form, the server
                processes it, the response renders. A <code>useState</code>-only form requires
                JS to do anything. Prefer server actions; use client state for the parts that
                truly need it (like optimistic updates).
              </>
            ),
          },
          {
            title: "Client-side auth state is a UX hint, never a security boundary",
            body: (
              <>
                Hiding a button on the client means nothing. Anyone can change{" "}
                <code>isAdmin</code> in DevTools. Real authorization happens in{" "}
                <code>middleware.ts</code> and inside server actions, where it cannot be tampered
                with.
              </>
            ),
          },
        ]}
      />

      {/* 7. KeyTakeaways */}
      <KeyTakeaways
        points={[
          "Folder structure is architecture made visible. Reading a folder tree should tell you where each thing runs.",
          "Server components are the default; opt into 'use client' deliberately, where state or interactivity is required.",
          "Talk to data where it lives. Server components await the database directly; client components call server actions.",
          "State has three flavours — URL, server, client. Match the flavour to the data shape and most state-management problems disappear.",
          "Auth runs in middleware and on the server. Client-side checks are UX, never security.",
          "The other shapes — pure SPA, pure static — are not lesser; they are appropriate for different problems. The goal is to recognise which shape your problem wants.",
        ]}
        mentalModel="A modern app's folder structure is a map of decisions: where does this run (server or client), where does this data come from (database or props), and where does this state live (URL, server cache, or component)? The folders make those answers visible."
      />

      {/* Optional: Alternatives */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-2">When a different shape is right</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
            <strong>SPA only (Vite + React):</strong> heavily authenticated tools where every
            page is behind a login, no SEO need, complex client interactivity (Linear,
            Figma-style apps). The Taproot blog has an SPA version under{" "}
            <code>examples/taproot-blog/spa/</code> for comparison.
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
            <strong>Pure static (Astro, plain HTML):</strong> content sites where any JS at all
            is overkill. Taproot&apos;s <code>static/</code> folder is the floor.
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            <strong>A different framework (SvelteKit, Nuxt, Remix):</strong> the same
            architectural shape with a different reactivity story. Most of what you learned here
            transfers; only the syntax of <code>&quot;use client&quot;</code> and friends changes.
          </p>
        </CardContent>
      </Card>

      <div className="mt-4">
        <RoadmapLink url="https://roadmap.sh/frontend" />
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400">
        Reference app source on GitHub (pinned to <code>taproot-blog-v1.0</code>):{" "}
        <a className="underline" href="https://github.com/logbasex/frontend-learning-app/tree/ed27a44/examples/taproot-blog/app" target="_blank" rel="noreferrer">
          examples/taproot-blog/app
        </a>
      </p>
    </div>
  );
}
