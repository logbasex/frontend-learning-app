"use client";

import { Card, CardContent } from "@/components/ui/card";
import { StepByStepExplanation, Step } from "@/components/StepByStepExplanation";
import { SequenceDiagram, SequenceMessage } from "@/components/SequenceDiagram";
import { LayeredFlow, FlowStage } from "@/components/LayeredFlow";
import { Challenge } from "@/components/Challenge";
import { GotchaList } from "@/components/GotchaList";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { RoadmapLink } from "@/components/RoadmapLink";

export function Module_8_2_Content() {
  // Data blocks hoisted out of JSX for readability — listed in render order.
  const relayActors = ["User", "DNS", "CDN", "Server", "Parser", "JS engine", "Hydrator"];

  const relayMessages: SequenceMessage[] = [
    { from: "User", to: "DNS", label: "GET taproot-blog.example.com", note: "Resolve hostname" },
    { from: "DNS", to: "User", label: "76.76.x.x", note: "1 RTT" },
    { from: "User", to: "CDN", label: "TLS handshake + GET /posts/the-cascade", note: "1-2 RTT" },
    { from: "CDN", to: "Server", label: "Cache miss → forward", note: "edge → origin" },
    { from: "Server", to: "Server", label: "Run RSC tree, query DB" },
    { from: "Server", to: "User", label: "HTML (streaming)", note: "First paint can start" },
    { from: "User", to: "CDN", label: "GET /_next/chunks/*.js", note: "Parallel" },
    { from: "CDN", to: "User", label: "Hashed JS chunks", note: "Cached at edge" },
    { from: "User", to: "Parser", label: "Parse HTML, build DOM" },
    { from: "Parser", to: "JS engine", label: "Execute downloaded chunks" },
    { from: "JS engine", to: "Hydrator", label: "React.hydrateRoot()" },
    { from: "Hydrator", to: "User", label: "Page is interactive" },
  ];

  const hydrationStages: FlowStage[] = [
    { label: "TTFB", detail: "First byte arrives", color: "blue" },
    { label: "FCP", detail: "First content painted", color: "violet" },
    { label: "LCP", detail: "Largest element painted", color: "emerald" },
    { label: "Hydrated", detail: "Handlers attached", color: "amber" },
    { label: "TTI", detail: "Page fully interactive", color: "rose" },
  ];

  const lifecycleSteps: Step[] = [
    {
      title: "Step 1: DNS and connection",
      description: (
        <>
          You type the URL. The browser asks a DNS resolver for the hostname&apos;s IP, opens a
          TCP connection, completes the TLS handshake. None of this involves your code; it is the
          plumbing learned in modules <code>1-1</code> and <code>1-2</code>. On a fast network
          this all takes ~50–150 ms before any HTTP byte flows.
        </>
      ),
      code: `# DevTools waterfall, request 1 of N
DNS lookup:           12 ms
Initial connection:   24 ms
TLS handshake:        38 ms
TTFB (Time to First Byte): 187 ms
Content download:     14 ms
Total:                275 ms`,
      language: "bash",
    },
    {
      title: "Step 2: Server render (RSC)",
      description: (
        <>
          The server runs the React Server Components tree. It calls{" "}
          <code>await prisma.post.findUnique({"{...}"})</code>, awaits the database, and renders
          components into HTML strings. <em>This is the moment the page exists as text.</em>{" "}
          Importantly, it streams: the response begins flowing back before the server is done.
        </>
      ),
      code: `// taproot-blog/app/(public)/posts/[slug]/page.tsx
export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug, draft: false },
    include: { author: true, tags: { include: { tag: true } } },
  });
  if (!post) notFound();
  return (
    <article>
      <h1>{post.title}</h1>
      <PostBody source={post.body} />
      <CommentForm postId={post.id} />  {/* hydration boundary */}
    </article>
  );
}`,
      language: "tsx",
    },
    {
      title: "Step 3: HTML streams to the browser",
      description: (
        <>
          As bytes arrive, the browser begins parsing immediately. Critical CSS in the{" "}
          <code>&lt;head&gt;</code> means the first paint can happen while the rest of the document
          is still streaming. By the time the closing <code>&lt;/html&gt;</code> arrives, the page
          is often already visible.
        </>
      ),
      code: `<!doctype html>
<html lang="en">
<head>
  <link rel="stylesheet" href="/_next/static/css/abc123.css">
  <meta property="og:title" content="The cascade...">
</head>
<body>
  <article>
    <h1>The cascade is the only CSS thing that matters</h1>
    <p>If you understand origin, specificity...</p>

    <!-- Below is the marker for the comment-form island -->
    <!--$client-->
    <form><!-- inert until hydration --></form>
    <!--/$-->
  </article>
  <script type="module" src="/_next/static/chunks/main-def456.js"></script>
</body>
</html>`,
      language: "html",
    },
    {
      title: "Step 4: JS chunks download in parallel",
      description: (
        <>
          The bundler split chunks for this page in module <code>8-1</code>. The browser sees
          their <code>&lt;script&gt;</code> tags and fetches them in parallel — the route chunk
          (containing <code>CommentForm</code>), the framework chunk, the vendor chunk. While JS
          downloads, the page is visible but the comment form does nothing.
        </>
      ),
      code: `# DevTools Network — parallel chunk downloads
main-def456.js          (framework, ~50 kB)   ▓▓▓▓▓▓▓▓
chunks/page-ghi789.js   (route,     ~12 kB)   ▓▓▓
chunks/vendor-abc123.js (deps,      ~30 kB)   ▓▓▓▓▓
                                              0      400 ms`,
      language: "bash",
    },
    {
      title: "Step 5: Hydration",
      description: (
        <>
          With JS downloaded and parsed, React walks the existing server-rendered DOM, attaches
          event handlers, and brings client components to life. <em>Before this moment the comment
          button does nothing.</em> Most of the page on Taproot is RSC; only{" "}
          <code>CommentForm</code> hydrates. <em>Hydration mismatch</em> — server HTML differing
          from what the client renders — is the most painful failure mode here, and the cause is
          almost always non-deterministic render (e.g. <code>Date.now()</code> in JSX).
        </>
      ),
      code: `// What hydration is, conceptually
//
// 1. Server has already rendered:    <form>...</form>
// 2. JS arrives, runs:               React.hydrateRoot(node, <CommentForm/>);
// 3. React walks the existing DOM, attaches onSubmit, onChange, etc.
// 4. The form is now interactive.
//
// What it is NOT:
//   - Re-rendering the form
//   - Replacing the HTML with new HTML
// What it IS:
//   - Wiring handlers onto the HTML that is already there`,
      language: "javascript",
    },
    {
      title: "Step 6: First interaction",
      description: (
        <>
          The user types a comment, clicks Post. <em>Optimistic UI</em>: the comment appears
          immediately via <code>useOptimistic</code>, even though the server has not yet confirmed.
          A <em>server action</em> sends the data; on success, React reconciles the optimistic
          update with the real one. On failure, the optimistic update is rolled back and an error
          shows.
        </>
      ),
      code: `// taproot-blog/app/components/CommentForm.tsx (excerpt)
const [optimistic, addOptimistic] = useOptimistic([], (state, next) => [...state, next]);

<form action={(formData) => {
  startTransition(async () => {
    addOptimistic({ id: \`tmp-\${Date.now()}\`, authorName, body });
    const res = await addComment({ postId, authorName, body });
    if (!res.ok) setErrorMsg(res.error);
  });
}}>`,
      language: "tsx",
    },
    {
      title: "Step 7: Client navigation",
      description: (
        <>
          The user clicks another post. <em>No full reload.</em> Next.js prefetched the chunk on
          hover; the route transition is instant. The post-body data is fetched fresh from the
          server (RSC re-runs), but the framework chunk and the layout stay put. This is what
          makes a modern app feel like an app and not a multi-page site.
        </>
      ),
      code: `// What client navigation does:
// 1. <Link href="/posts/why-rsc"> — Next prefetched the route chunk on hover
// 2. Click → React Router state update → URL changes
// 3. Server is asked for the new page's RSC payload (NOT a fresh HTML doc)
// 4. Server runs page.tsx for /posts/why-rsc, returns serialized RSC tree
// 5. Client diffs, swaps the article body, layout stays mounted
//
// No flash, no scroll reset, no re-download of framework code.`,
      language: "javascript",
    },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Hook */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-base leading-relaxed">
            You click a Taproot post link. About 800 ms later the page is there and the comment
            box works. In those 800 ms, eight different machines did something: a DNS resolver, a
            CDN edge, a serverless function, a database, the browser&apos;s HTML parser, the JS
            engine, the React hydrator, and finally your eyes.
          </p>
          <p className="text-base leading-relaxed mt-4">
            If any one of those machines is slow, the whole page is slow. Telling them apart is
            the difference between a vague &quot;the site feels sluggish&quot; and a specific
            &quot;the TTFB is 600 ms because the database query is missing an index.&quot; That
            specificity is what this module is for.
          </p>
        </CardContent>
      </Card>

      {/* 2. Mental model */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-base leading-relaxed">
            A modern page does not render in one place. It is assembled across machines, with each
            one handing the result to the next. Different metrics — TTFB, FCP, LCP, TTI — measure
            different runners in this relay. Until you can name which runner is on the track, you
            cannot speed up the race.
          </p>
          <blockquote className="mt-4 border-l-4 border-blue-500 pl-4 italic text-slate-700 dark:text-slate-300">
            A page appearing in the browser is a relay race. Each runner — DNS, server, network,
            browser parser, JS engine, hydrator — hands the baton to the next, and the user
            perceives &quot;loading&quot; until the last runner crosses the line.
          </blockquote>
        </CardContent>
      </Card>

      {/* 3. Step-by-step */}
      <StepByStepExplanation
        title="The eight machines, in order"
        description="Walking a request to /posts/the-cascade end to end."
        steps={lifecycleSteps}
      />

      {/* Optional: Sequence diagram of the relay */}
      <SequenceDiagram
        title="The relay, as actors and messages"
        description="Same flow as the steps above, drawn vertically. Use this when reasoning about which actor is slow."
        actors={relayActors}
        messages={relayMessages}
      />

      {/* Optional: Hydration timeline */}
      <LayeredFlow
        title="The performance metrics, in order"
        description="LCP and TTI are not the same. Pages can look done while still being inert."
        stages={hydrationStages}
        direction="horizontal"
      />

      {/* 4. Playground */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-base font-semibold mb-2">Try this</p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
            Run the Taproot blog locally (see the README at{" "}
            <a className="underline" href="https://github.com/logbasex/frontend-learning-app/tree/ed27a44/examples/taproot-blog" target="_blank" rel="noreferrer">
              examples/taproot-blog
            </a>
            ). Open DevTools → Network. Throttle to &quot;Fast 3G&quot;. Reload. Identify which
            actor in the relay is the bottleneck for the home page. Then click into a post —
            observe that the framework chunk does not re-download.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Hint: TTFB measures DNS + server time before the first byte. LCP measures when the
            largest element finishes painting. They can be far apart.
          </p>
        </CardContent>
      </Card>

      {/* 5. Challenges */}
      <Challenge
        question="A Lighthouse report shows TTFB = 600 ms but LCP = 850 ms. Where is most of the time being spent?"
        options={[
          { id: "a", text: "DNS / network — the relay is slow before any byte arrives" },
          { id: "b", text: "Server — between connection open and first byte sent" },
          { id: "c", text: "JS hydration — the page rendered fast but is inert" },
          { id: "d", text: "Image decoding" },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            TTFB is the time from request start to first byte received. A 600 ms TTFB means the
            server (or a database query inside it) is the bottleneck. LCP is only ~250 ms after
            TTFB, so the network and rendering steps are fast.
          </>
        }
      />

      <Challenge
        question="A user reports: 'When I land on the page, the comment button does nothing for the first second or so.' What is the most likely cause?"
        options={[
          { id: "a", text: "The button is disabled in CSS" },
          { id: "b", text: "Hydration is incomplete — JS chunks are still downloading or parsing" },
          { id: "c", text: "The server action is rate-limited" },
          { id: "d", text: "The browser is offline" },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            Until hydration completes, the server-rendered HTML is visible but inert. This is the
            classic &quot;looks done but is not interactive&quot; gap. Fixes: ship less
            client-side JS, defer non-critical scripts, or move the component to a server
            component.
          </>
        }
      />

      <Challenge
        question="Page A is entirely RSC; page B is identical but uses 'use client' on the root component. Both render the same data. Which page has lower hydration cost?"
        options={[
          { id: "a", text: "Page A — RSC ships no JS, so there is nothing to hydrate" },
          { id: "b", text: "Page B — 'use client' is faster" },
          { id: "c", text: "They are equivalent — RSC and client components have the same cost" },
          { id: "d", text: "Page A — but only on slow connections" },
        ]}
        correctAnswerId="a"
        explanation={
          <>
            RSC does not ship its component code to the browser, so there is no hydration step
            for it. Page B forces React to walk the entire tree and attach handlers. The
            difference is most visible on slow CPUs, but it exists everywhere.
          </>
        }
      />

      {/* 6. GotchaList */}
      <GotchaList
        items={[
          {
            title: "Hydration mismatch",
            body: (
              <>
                Server HTML and client render must match exactly at hydration time. Calling{" "}
                <code>Date.now()</code>, <code>Math.random()</code>, or anything that depends on
                the user&apos;s locale inside JSX is the classic cause. The fix: derive the value
                on the server and pass it down, or move the component into a client-only effect.
              </>
            ),
          },
          {
            title: "TTI is not LCP",
            body: (
              <>
                The largest element can paint while interaction is still impossible. Optimizing
                for LCP alone produces pages that look fast but feel broken. Watch INP (Interaction
                to Next Paint) too.
              </>
            ),
          },
          {
            title: "A 3rd-party script tag without async or defer",
            body: (
              <>
                A plain <code>&lt;script src=&quot;...&quot;&gt;</code> blocks the parser at that
                point in the document. One slow analytics script can add 500 ms to FCP. Always{" "}
                <code>async</code> or <code>defer</code>; better, lazy-load on interaction.
              </>
            ),
          },
          {
            title: "RSC re-runs on every route change",
            body: (
              <>
                Client navigation reuses the JS bundle, but the server still runs its RSC tree
                fresh for each navigation (unless cached). Your database queries fire again. Cache
                explicitly via <code>revalidate</code> or <code>fetch</code> options when the data
                is safe to cache.
              </>
            ),
          },
        ]}
      />

      {/* 7. KeyTakeaways */}
      <KeyTakeaways
        points={[
          "The page you see is assembled across at least eight different machines; each one is a candidate for being slow.",
          "TTFB measures the server; LCP measures the paint; TTI measures interactivity. Different metrics, different fixes.",
          "Hydration attaches handlers to existing HTML. Until it finishes, your client components are inert.",
          "Client navigation reuses the JS bundle but re-runs server code; cache deliberately.",
          "Optimizing performance starts with naming which runner in the relay is slow, not with adding indexes everywhere.",
        ]}
        mentalModel="A page appearing in the browser is a relay race. Each runner — DNS, server, network, browser parser, JS engine, hydrator — hands the baton to the next, and the user perceives 'loading' until the last runner crosses the line."
      />

      <div className="mt-4">
        <RoadmapLink url="https://roadmap.sh/frontend" />
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400">
        Reference app source on GitHub (pinned to <code>taproot-blog-v1.0</code>):{" "}
        <a className="underline" href="https://github.com/logbasex/frontend-learning-app/blob/ed27a44/examples/taproot-blog/app/app/(public)/posts/%5Bslug%5D/page.tsx" target="_blank" rel="noreferrer">
          post page
        </a>
      </p>
    </div>
  );
}
