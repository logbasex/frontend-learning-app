"use client";

import { ScaffoldModule } from "./_template";
import { CodeBlock } from "@/components/CodeBlock";

const serverComponentCode = `// app/dashboard/page.tsx
// This is a Server Component by default in Next.js App Router.
// No "use client" directive — this file never ships to the browser.

interface Post {
  id: number;
  title: string;
  views: number;
}

interface DashboardData {
  posts: Post[];
  totalViews: number;
}

// next: { revalidate: 60 } means Next.js regenerates this page
// at most once every 60 seconds (Incremental Static Regeneration).
// Change to 0 for full SSR (fresh on every request).
// Remove the option entirely for pure SSG (build-time only).
async function getDashboardData(): Promise<DashboardData> {
  const res = await fetch("https://api.example.com/dashboard", {
    next: { revalidate: 60 }, // ISR: stale-while-revalidate on the server
  });

  if (!res.ok) throw new Error("Failed to fetch dashboard data");
  return res.json();
}

// This component runs only on the server — no useState allowed here.
// The resolved data is serialised and streamed to the client as HTML.
export default async function DashboardPage() {
  // "await" at the top level is fine in Server Components
  const data = await getDashboardData();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="text-slate-600 mb-6">
        Total views: {data.totalViews.toLocaleString()}
      </p>
      <ul className="space-y-2">
        {data.posts.map((post) => (
          <li key={post.id} className="flex justify-between border-b py-2">
            <span>{post.title}</span>
            <span className="text-slate-500">{post.views} views</span>
          </li>
        ))}
      </ul>
    </main>
  );
}`;

export function Module_7_2_Content() {
  return (
    <ScaffoldModule
      emoji="🖥️"
      problemTitle="Where a page renders changes everything"
      problem={
        <>
          <p>
            Rendering location is a <strong>slider, not a switch</strong>. At
            one end is <strong>CSR</strong> (Client-Side Rendering) — the server
            ships an empty HTML shell and JavaScript builds the entire page in
            the browser. Fast to deploy, but slow first paint and invisible to
            search engines until hydration completes. At the other end is{" "}
            <strong>SSG</strong> (Static Site Generation) — every page is
            pre-rendered at build time into plain HTML files. Request time is
            nearly free, but data can go stale until the next build.
          </p>
          <p>
            Between those extremes sit <strong>SSR</strong> (Server-Side
            Rendering, fresh HTML on each request — great for personalised or
            real-time data at the cost of higher TTFB) and{" "}
            <strong>ISR</strong> (Incremental Static Regeneration — SSG pages
            that revalidate on a timer or on-demand, delivering the speed of
            static files with near-fresh data). The right choice is{" "}
            <em>per route</em>, not per app: a marketing landing page can be
            pure SSG while the user dashboard uses ISR and the live chat widget
            is CSR only.
          </p>
          <p>
            React Server Components (RSC) push the model further:{" "}
            <strong>
              individual components render on the server and their code never
              ships to the browser
            </strong>
            . A <code>DashboardPage</code> RSC can <code>await</code> a
            database query directly in the component body, render HTML, and send
            only that HTML downstream — the fetch logic and its dependencies are
            zero bytes in the client bundle. Client Components (marked{" "}
            <code>&quot;use client&quot;</code>) still hydrate normally;
            everything else defaults to server-only.
          </p>
        </>
      }
      body={
        <CodeBlock
          language="tsx"
          fileName="app/dashboard/page.tsx"
          code={serverComponentCode}
        />
      }
      challenge={{
        question:
          "What's the main benefit of React Server Components over plain SSR?",
        options: [
          {
            id: "a",
            text: "RSCs allow useState and useEffect to run on the server before sending HTML.",
          },
          {
            id: "b",
            text: "RSCs render on the server but their component code is NEVER shipped to the browser — you save bundle size on the parts of the UI that don't need interactivity.",
          },
          {
            id: "c",
            text: "RSCs replace the need for a CDN because the server always returns fresh HTML.",
          },
          {
            id: "d",
            text: "RSCs automatically hydrate all child components, eliminating the need for event listeners.",
          },
        ],
        correctAnswerId: "b",
        explanation: (
          <>
            Traditional SSR still ships all component JavaScript to the client
            for hydration — the HTML is pre-rendered, but the JS bundle includes
            every component. React Server Components break that coupling: a
            server component renders to HTML (or a special RSC payload) and its
            source code, imports, and dependencies <em>never appear</em> in the
            client bundle. Only components explicitly marked{" "}
            <code>&quot;use client&quot;</code> are included in the JS sent to
            the browser.
          </>
        ),
      }}
      takeaways={[
        <>
          Rendering location is a slider: <strong>CSR</strong> (client only),{" "}
          <strong>SSR</strong> (per-request), <strong>SSG</strong> (build time),{" "}
          <strong>ISR</strong> (SSG + revalidation), <strong>RSC</strong> (server
          components, zero client JS).
        </>,
        <>
          Choose <em>per route</em>, not per app — mix strategies to match the
          data-freshness and performance needs of each page.
        </>,
        <>
          RSC components can <code>await</code> data directly in the component
          body; their code never ships to the browser, shrinking the JS bundle.
        </>,
      ]}
      mentalModel="Rendering location is a slider, not a switch. Hydration wires up server HTML on the client. RSC ships HTML, not JS."
      roadmapUrl="https://roadmap.sh/frontend"
    />
  );
}
