"use client";

import { Card, CardContent } from "@/components/ui/card";
import { LayeredFlow, FlowStage } from "@/components/LayeredFlow";
import { CodeComparison } from "@/components/CodeComparison";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { RoadmapLink } from "@/components/RoadmapLink";
import Link from "next/link";

export function Module_0_1_Content() {
  // Data blocks hoisted out of JSX for readability — listed in render order.
  const mapStages: FlowStage[] = [
    { label: "Source", detail: "TS / JSX, CSS, images, env files", color: "blue" },
    { label: "Build", detail: "Vite or Next compiler → JS chunks, CSS, hashed assets", color: "violet" },
    { label: "Deploy", detail: "Static files on a CDN + serverless functions", color: "emerald" },
    { label: "Request", detail: "DNS → server → HTML → JS → hydration", color: "amber" },
    { label: "Runtime", detail: "Components → state → fetch → re-render → navigation", color: "rose" },
  ];

  const codeComparison = {
    title: "What 'modern' is adding",
    oldCode: {
      title: "2010 frontend",
      language: "html" as const,
      code: `<!-- index.html -->
<!doctype html>
<html>
  <head>
    <link rel="stylesheet" href="styles.css">
    <script src="app.js" defer></script>
  </head>
  <body>
    <h1>My site</h1>
  </body>
</html>

<!-- That's it. Three files, no build,
     served as-is from a single server. -->`,
    },
    newCode: {
      title: "2026 frontend",
      language: "tsx" as const,
      code: `// You write this:
// app/page.tsx
export default async function Home() {
  const posts = await db.post.findMany();
  return <PostList posts={posts} />;
}

// The browser receives:
//   index.html      (server-rendered)
//   _next/chunks/*.js   (10+ split chunks)
//   _next/css/*.css     (purged + hashed)
//   _next/image/*       (optimized images)
//   /api/...            (serverless calls)
//
// All of which is built, bundled,
// deployed, and stitched together
// by the framework you chose.`,
    },
  };

  const phasePreviews = [
    { phase: 1, title: "Internet & Web Foundations", firstModuleId: "1-1-how-the-internet-works", maps: "How the Request reaches the server" },
    { phase: 2, title: "HTML", firstModuleId: "2-1-html-basics-and-semantics", maps: "What the Source is written in (structure)" },
    { phase: 3, title: "CSS", firstModuleId: "3-1-css-fundamentals", maps: "What the Source is written in (style)" },
    { phase: 4, title: "JavaScript", firstModuleId: "4-1-javascript-fundamentals", maps: "What the Source is written in (behavior)" },
    { phase: 5, title: "Workflow & Frameworks", firstModuleId: "5-1-git-and-github", maps: "How you organize the Source and pick a framework" },
    { phase: 6, title: "Build, Test & Secure", firstModuleId: "6-1-linters-and-formatters", maps: "How the Source becomes the Build, plus tests and security" },
    { phase: 7, title: "Beyond the Browser & Production", firstModuleId: "7-1-web-components", maps: "Where the app Runs (server, edge, mobile, desktop)" },
    { phase: 8, title: "How a Modern Frontend App Works (Capstone)", firstModuleId: "8-1-the-build-pipeline", maps: "All five stages stitched together using a real reference app" },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Hook */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-base leading-relaxed">
            Open any modern web app, hit F12, and watch the Network tab. You will see hundreds of files
            flying in: HTML, dozens of JavaScript chunks, CSS, fonts, optimized images, calls to APIs you
            cannot see in the source code. None of those files exist as such in the developer&apos;s
            editor. So what happens between the developer typing <code>git push</code> and a user&apos;s
            screen lighting up?
          </p>
          <p className="text-base leading-relaxed mt-4">
            This is the question the next 30 modules answer, one piece at a time. Before you start, take
            ten minutes here to see the whole picture. You will return to this map after every phase.
          </p>
        </CardContent>
      </Card>

      {/* 2. Mental model */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-base leading-relaxed">
            A modern frontend app does not exist in one place. The code you write in your editor is not
            the code that runs in a browser. The code that runs in a browser is not the same as the code
            that runs on the server. Each form has its own rules, its own debugging tools, and its own
            failure modes. Mistaking one form for another is the source of nine out of ten frontend
            bugs that confuse beginners.
          </p>
          <blockquote className="mt-4 border-l-4 border-blue-500 pl-4 italic text-slate-700 dark:text-slate-300">
            A modern frontend app has three lives — written life (source), built life (bundle), and
            running life (browser + server). Each life has its own rules and its own debugging tools.
          </blockquote>
        </CardContent>
      </Card>

      {/* 3. The map */}
      <LayeredFlow
        title="The five stages every modern frontend app passes through"
        description="Every box on this diagram is a topic you will learn in detail. Phase 8 stitches them all together."
        stages={mapStages}
        direction="horizontal"
      />

      {/* Optional: Before/after — what 'modern' is adding */}
      <CodeComparison
        title={codeComparison.title}
        oldCode={codeComparison.oldCode}
        newCode={codeComparison.newCode}
      />

      {/* 4. Curriculum preview */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-3">How the curriculum maps onto the diagram</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Each phase teaches one or more boxes from the map. Click any phase to jump to its first
            module. The recommended order is top to bottom, but the modules are unlocked — skip around
            if a topic pulls you in.
          </p>
          <ul className="space-y-3">
            {phasePreviews.map((p) => (
              <li key={p.phase} className="flex items-start gap-3">
                <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 rounded px-2 py-1 mt-0.5 shrink-0">
                  Phase {p.phase}
                </span>
                <div className="flex-1">
                  <Link
                    href={`/lesson/${p.firstModuleId}`}
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    {p.title}
                  </Link>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{p.maps}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <RoadmapLink url="https://roadmap.sh/frontend" />
          </div>
        </CardContent>
      </Card>

      {/* 5. KeyTakeaways */}
      <KeyTakeaways
        points={[
          "The same app exists in three forms — source, bundle, and running app — and each form has its own debugging surface.",
          "'Frontend' today means more than the browser: a build step and often a server are part of the picture.",
          "You will learn each layer in isolation across Phases 1–7, then watch them stitch together in Phase 8 using a real reference app.",
          "Skip around if you want. Modules are unlocked; the recommended order is just a recommendation.",
        ]}
        mentalModel="A modern frontend app has three lives — written life (source), built life (bundle), and running life (browser + server). Each life has its own rules and its own debugging tools."
      />
    </div>
  );
}
