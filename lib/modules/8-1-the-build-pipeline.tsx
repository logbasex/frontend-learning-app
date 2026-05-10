"use client";

import { Card, CardContent } from "@/components/ui/card";
import { StepByStepExplanation, Step } from "@/components/StepByStepExplanation";
import { LayeredFlow, FlowStage } from "@/components/LayeredFlow";
import { CodeComparison } from "@/components/CodeComparison";
import { TerminalPlayground, TerminalLine } from "@/components/TerminalPlayground";
import { Challenge } from "@/components/Challenge";
import { GotchaList } from "@/components/GotchaList";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { RoadmapLink } from "@/components/RoadmapLink";

export function Module_8_1_Content() {
  // Data blocks hoisted out of JSX for readability — listed in render order.
  const moduleGraphStages: FlowStage[] = [
    { label: "Entry", detail: "app/layout.tsx", color: "blue" },
    { label: "Imports", detail: "PostCard, db, types", color: "violet" },
    { label: "Imports' imports", detail: "@prisma/client, next/image", color: "emerald" },
    { label: "Leaves", detail: "node_modules, no further imports", color: "amber" },
  ];

  const transformsCompare = {
    title: "One transform, made explicit",
    oldCode: {
      title: "What you wrote (TS + JSX)",
      language: "tsx" as const,
      code: `import { Post } from "@/lib/types";

export function PostCard({ post }: { post: Post }) {
  return <article>{post.title}</article>;
}`,
    },
    newCode: {
      title: "What the bundler ships (transformed JS)",
      language: "javascript" as const,
      code: `import { jsx as _jsx } from "react/jsx-runtime";

export function PostCard({ post }) {
  return _jsx("article", { children: post.title });
}`,
    },
  };

  const buildPipelineSteps: Step[] = [
    {
      title: "Step 1: The source tree",
      description: (
        <>
          Open <code>examples/taproot-blog/app/</code> in the reference repo. Four kinds of files
          live there, none of which any browser can run as written: <code>.tsx</code> (TypeScript +
          JSX), Tailwind class strings (which look like utility names but are not real CSS), an
          imported <code>.svg</code> cover image, and an <code>.env</code> file the runtime reads.
          Every one of these files needs a transform before a browser sees anything.
        </>
      ),
      code: `examples/taproot-blog/app/
  app/(public)/posts/[slug]/page.tsx     # TS + JSX
  app/globals.css                        # @tailwind directives
  public/cover-1.svg                     # raw SVG, still needs hashing
  .env.example                           # secrets vs public split`,
      language: "bash",
    },
    {
      title: "Step 2: Three transforms",
      description: (
        <>
          The first job of the build pipeline is to translate every kind of source file into
          something a browser can actually run. <em>TypeScript</em> drops to JavaScript by erasing
          types. <em>JSX</em> compiles to <code>_jsx()</code> calls. <em>Tailwind</em> reads your
          source files, finds every class name you used, and emits a single CSS file containing
          only those rules. Three transforms, three distinct tools.
        </>
      ),
      code: `// Tailwind: classes used in your JSX
className="bg-violet-500 hover:bg-violet-600 text-white"

// becomes the only CSS rules emitted:
.bg-violet-500 { background-color: rgb(139 92 246); }
.hover\\:bg-violet-600:hover { background-color: rgb(124 58 237); }
.text-white { color: rgb(255 255 255); }`,
      language: "css",
    },
    {
      title: "Step 3: The module graph",
      description: (
        <>
          With files transformed, the bundler walks every import statement starting from each
          entry point. The result is a directed graph called the <em>module graph</em> — every
          file your app actually reaches via <code>import</code>. Code that nothing imports never
          enters the graph and never ships.
        </>
      ),
      code: `// Walking from app/(public)/posts/[slug]/page.tsx
page.tsx
  ├─ @/lib/db          → imports @prisma/client
  ├─ @/components/PostBody  → imports @/lib/markdown
  │                            ├─ remark
  │                            ├─ remark-rehype
  │                            ├─ rehype-sanitize
  │                            └─ rehype-stringify
  ├─ @/components/AuthorCard
  └─ @/components/CommentForm  → "use client" — separate chunk`,
      language: "bash",
    },
    {
      title: "Step 4: Dev mode (npm run dev)",
      description: (
        <>
          In dev, the bundler walks the module graph <strong>on demand</strong>. The browser asks
          for a file; the dev server transforms it just-in-time and returns native ES modules.
          Nothing is bundled. <em>HMR</em> (Hot Module Replacement) intercepts file saves and
          patches the running page without a full reload, preserving component state. This is the
          &quot;edit, save, see it instantly&quot; feel modern frameworks ship.
        </>
      ),
      code: `# Browser request: GET /src/components/PostCard.tsx
# Dev server: transforms TS → JS on the fly, returns:

import { jsx } from "/node_modules/react/jsx-runtime";
export function PostCard({ post }) {
  return jsx("article", { children: post.title });
}

# Edit + save → HMR pushes only this module's update
# Component state survives, page does not reload`,
      language: "javascript",
    },
    {
      title: "Step 5: Build mode (npm run build)",
      description: (
        <>
          In production, the bundler walks the entire graph <strong>exhaustively</strong>. It
          splits the result into <em>chunks</em> along route boundaries, removes exports that
          nothing reaches (<em>tree-shaking</em>), hashes every filename for cache-busting, and
          writes the result into a single output directory ready to serve from a CDN. This is the
          deliverable.
        </>
      ),
      code: `$ cd examples/taproot-blog/app && npm run build

▲ Next.js 15.1.0
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (8/8)

Route (app)                  Size  First Load JS
┌ ○ /                      1.2 kB         97 kB
├ ○ /about                 156 B          90 kB
├ ƒ /posts/[slug]          2.4 kB         98 kB
├ ƒ /admin                 1.9 kB        103 kB
└ ƒ /admin/posts/new       8.1 kB        112 kB
+ First Load JS shared      89 kB
  └ chunks/vendor-abc123.js  86 kB`,
      language: "bash",
    },
    {
      title: "Step 6: The asset pipeline",
      description: (
        <>
          Code is only one of four assets the pipeline produces. CSS is purged (Tailwind drops
          unused rules), images are hashed and optionally re-encoded to AVIF/WebP, fonts are
          subset and preloaded, and environment variables are split: <code>NEXT_PUBLIC_*</code>{" "}
          inlined into the bundle, everything else kept server-side only. Each split is an
          architectural decision the bundler makes for you.
        </>
      ),
      code: `# After build, .next/static/ contains:

chunks/
  vendor-abc123.js          # framework + node_modules
  app/page-def456.js        # route-specific
  app/admin/page-ghi789.js  # separate chunk; only loaded for /admin
css/
  abc123.css                # purged Tailwind
media/
  cover-1.abc123.svg        # hashed for cache-busting

# Env vars in the bundle:
process.env.NEXT_PUBLIC_SITE_NAME  → "Taproot"  (inlined)
process.env.AUTH_SECRET             → undefined  (server-only, never shipped)`,
      language: "bash",
    },
  ];

  const buildTrace: TerminalLine[] = [
    { command: "npm run build", output: "▲ Next.js 15.1.0", delayMs: 600 },
    { command: "", output: "✓ Compiled successfully", delayMs: 800 },
    { command: "", output: "✓ Linting and checking validity of types", delayMs: 600 },
    { command: "", output: "✓ Collecting page data", delayMs: 700 },
    { command: "", output: "✓ Generating static pages (8/8)", delayMs: 900 },
    { command: "", output: "✓ Finalizing page optimization", delayMs: 500 },
    { command: "ls .next/static/chunks/", output: "vendor-abc123.js  app/page-def456.js  app/admin/page-ghi789.js", delayMs: 700 },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Hook */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-base leading-relaxed">
            You wrote <code>import {"{ Button }"} from &quot;./Button&quot;</code> in your component. The
            browser has never heard of a <code>.tsx</code> file, has no idea what{" "}
            <code>./Button</code> resolves to, and would not fetch a thousand small files anyway.
            And yet, when you visit a deployed Next.js app, the page is there in 800 ms.
          </p>
          <p className="text-base leading-relaxed mt-4">
            Eight machines did something in those 800 ms. The first three of them — transformer,
            module-graph walker, asset emitter — happened on a CI server long before you opened
            the page. This is the build pipeline. It is the part of &quot;modern frontend&quot;
            that beginners most often skip and most often regret skipping, because it makes choices
            the browser cannot undo.
          </p>
        </CardContent>
      </Card>

      {/* 2. Mental model */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-base leading-relaxed">
            The source code on your laptop is one thing. The bundle on the CDN is a different
            thing. The build pipeline is the translator. Once a build runs, the source no longer
            matters to the runtime — only the bundle does. So when something breaks &quot;only in
            production,&quot; it is almost always because a build-time decision differs from what
            your dev server was doing.
          </p>
          <blockquote className="mt-4 border-l-4 border-blue-500 pl-4 italic text-slate-700 dark:text-slate-300">
            Source code is what you write; the bundle is what runs. The build pipeline is the
            translator between them, and it makes choices the browser cannot undo.
          </blockquote>
        </CardContent>
      </Card>

      {/* 3. Step-by-step */}
      <StepByStepExplanation
        title="From .tsx to a deployed bundle, step by step"
        description="Walking the build pipeline using the Taproot blog as the source."
        steps={buildPipelineSteps}
      />

      {/* Optional: One transform, made explicit */}
      <CodeComparison
        title={transformsCompare.title}
        oldCode={transformsCompare.oldCode}
        newCode={transformsCompare.newCode}
      />

      {/* Optional: Module graph diagram */}
      <LayeredFlow
        title="The module graph, walked from one route"
        description="Vite/Next walks this graph on demand in dev, exhaustively in build."
        stages={moduleGraphStages}
        direction="horizontal"
      />

      {/* 4. Playground */}
      <TerminalPlayground
        title="Watch a real production build"
        description="Each line is a phase of the pipeline running against the Taproot blog."
        lines={buildTrace}
      />

      {/* 5. Challenges */}
      <Challenge
        question="A new route at /api/embed/[id] is added. The existing home page imports nothing from it. After running npm run build, where does the route's code end up?"
        options={[
          { id: "a", text: "In the home-page chunk" },
          { id: "b", text: "In a vendor chunk shared with the home page" },
          { id: "c", text: "In its own chunk that loads only when /api/embed/[id] is hit" },
          { id: "d", text: "Tree-shaken away because nothing imports it" },
        ]}
        correctAnswerId="c"
        explanation={
          <>
            Routes are split into their own chunks at build time. Nothing on the home page imports
            this route, so it does not enter the home-page chunk; nor is it tree-shaken — it has
            its own entry point. It only ships when a user visits that route.
          </>
        }
      />

      <Challenge
        question="A teammate reports: 'The build is huge, but I do not know which dependency is the culprit.' Which command will most directly answer that?"
        options={[
          { id: "a", text: "npm run dev" },
          { id: "b", text: "npx next build --debug" },
          { id: "c", text: "npx @next/bundle-analyzer (or ANALYZE=true npm run build)" },
          { id: "d", text: "npm test" },
        ]}
        correctAnswerId="c"
        explanation={
          <>
            A bundle analyzer visualizes the size of every module in every chunk — exactly the
            question you are asking. <code>--debug</code> shows extra logs; <code>npm run dev</code>{" "}
            does not bundle; tests are unrelated.
          </>
        }
      />

      {/* 6. GotchaList */}
      <GotchaList
        items={[
          {
            title: "It works in dev but breaks in prod",
            body: (
              <>
                Almost always one of two things: an environment variable that exists locally but
                not in CI, or a dynamic <code>import()</code> path that the bundler cannot resolve
                at build time but the dev server happily runs ad hoc.
              </>
            ),
          },
          {
            title: "Public vs server env vars",
            body: (
              <>
                Anything prefixed <code>NEXT_PUBLIC_</code> is inlined into the bundle and shipped
                to every browser. Everything else stays server-only. Mis-naming an API key as{" "}
                <code>NEXT_PUBLIC_</code> leaks it to every visitor.
              </>
            ),
          },
          {
            title: "Barrel files defeat tree-shaking",
            body: (
              <>
                A file like <code>components/index.ts</code> that re-exports everything looks
                convenient but tells the bundler &quot;I have side effects.&quot; Even if you
                import one component, the bundler may pull in all of them. Prefer direct imports.
              </>
            ),
          },
          {
            title: "Source maps are deployed too — to the wrong place",
            body: (
              <>
                You want stack traces in production to be readable, but you do not want{" "}
                <code>.map</code> files served to every visitor. Ship source maps to your error
                tracker (Sentry, etc.), not to the public CDN.
              </>
            ),
          },
        ]}
      />

      {/* 7. KeyTakeaways */}
      <KeyTakeaways
        points={[
          "The browser cannot run TS, JSX, or .css imports. The build pipeline translates each into something it can.",
          "The module graph is the bundler's mental model: only files reachable from an entry point ship.",
          "Dev mode walks the graph on demand and uses HMR; build mode walks it exhaustively, splits into chunks, and tree-shakes.",
          "Public and server-only env vars are different; the prefix is the only mechanism, so name them on purpose.",
          "When a bug only appears in production, suspect a build-time decision (env vars, dynamic imports, barrel files) before suspecting your code.",
        ]}
        mentalModel="Source code is what you write; the bundle is what runs. The build pipeline is the translator between them, and it makes choices the browser cannot undo."
      />

      <div className="mt-4">
        <RoadmapLink url="https://roadmap.sh/frontend" />
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400">
        Reference app source on GitHub (pinned to <code>taproot-blog-v1.0</code>):{" "}
        <a className="underline" href="https://github.com/logbasex/frontend-learning-app/tree/ed27a44/examples/taproot-blog" target="_blank" rel="noreferrer">
          examples/taproot-blog
        </a>
      </p>
    </div>
  );
}
