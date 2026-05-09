"use client";

import { ScaffoldModule } from "./_template";
import { CodeBlock } from "@/components/CodeBlock";

const astroPageCode = `---
// src/pages/blog/[slug].astro
// Astro uses a "---" frontmatter fence for server-side JS (runs at build time).

import { getCollection } from 'astro:content';
import Layout from '../../layouts/Layout.astro';

// getStaticPaths tells Astro which URLs to pre-render.
// It runs ONCE at build time — not on every request.
export async function getStaticPaths() {
  // getCollection reads all Markdown/MDX files in src/content/blog/
  const posts = await getCollection('blog');

  // Each entry becomes a pre-rendered HTML page at /blog/<slug>
  return posts.map((post) => ({
    params: { slug: post.slug },
    props:  { post },        // passed to the component below
  }));
}

// Destructure the props Astro injected from getStaticPaths
const { post } = Astro.props;
const { Content } = await post.render(); // compile MDX → component

// "frontmatter" holds the YAML at the top of the .md / .mdx file
const { title, date, author } = post.data;
---

<!-- Everything below the second "---" is the HTML template -->
<Layout title={title}>
  <article>
    <header>
      <h1>{title}</h1>
      <!-- Astro pipes dates through toLocaleDateString automatically -->
      <time datetime={date.toISOString()}>
        {date.toLocaleDateString('en-AU', { dateStyle: 'long' })}
      </time>
      <p>By {author}</p>
    </header>

    <!--
      <Content /> renders the compiled MDX.
      No JavaScript is shipped for this component — Astro outputs plain HTML.
      To add interactivity, use client:load on a framework component:

        import Counter from '../../components/Counter.tsx';
        <Counter client:load />   ← this becomes an interactive "island"
    -->
    <Content />
  </article>
</Layout>`;

export function Module_7_4_Content() {
  return (
    <ScaffoldModule
      emoji="📰"
      problemTitle="Pre-render at build time, ship plain HTML"
      problem={
        <>
          <p>
            Static Site Generators — <strong>Astro</strong>, Eleventy, Hugo,
            Next.js export mode, Nuxt static, VuePress — turn your source
            content (Markdown, MDX, JSON, YAML, a CMS API) into{" "}
            <strong>pre-rendered HTML at build time</strong>. When a user
            requests a page, the server just returns a file from a CDN — no
            database query, no template rendering, no cold starts. The result is
            near-instant load times and near-zero hosting cost.
          </p>
          <p>
            <strong>Astro&apos;s &quot;islands&quot; architecture</strong> is
            especially compelling: the default output is{" "}
            <strong>zero JavaScript</strong>. Static content (headings,
            paragraphs, images) ships as plain HTML. Only components you
            explicitly annotate with <code>client:load</code>,{" "}
            <code>client:visible</code>, or <code>client:idle</code> hydrate as
            interactive &quot;islands&quot; in an otherwise static sea. This
            keeps the JS bundle minimal and the Lighthouse score high.
          </p>
          <p>
            The main trade-off is staleness: every content change requires a
            rebuild (typically seconds to minutes depending on site size). Modern
            platforms (Netlify, Vercel) mitigate this with webhook-triggered
            rebuilds, and Next.js ISR adds on-demand revalidation so individual
            pages can be regenerated without a full rebuild. For
            frequently-changing, personalised, or real-time content, SSR or
            client-side data fetching is a better fit.
          </p>
        </>
      }
      body={
        <CodeBlock
          language="tsx"
          fileName="src/pages/blog/[slug].astro"
          code={astroPageCode}
        />
      }
      challenge={{
        question: "What does Astro's 'islands' architecture mean?",
        options: [
          {
            id: "a",
            text: "Each page is an isolated micro-frontend served from a separate origin.",
          },
          {
            id: "b",
            text: "Pages are static HTML by default; only components you explicitly mark as client:load ship JavaScript and hydrate as interactive 'islands'.",
          },
          {
            id: "c",
            text: "Astro compiles all React, Vue, and Svelte components to Web Components at build time.",
          },
          {
            id: "d",
            text: "JavaScript is split into small 'islands' loaded in parallel to speed up hydration.",
          },
        ],
        correctAnswerId: "b",
        explanation: (
          <>
            Astro ships <em>zero</em> JavaScript by default. The page is fully
            static HTML. When you add <code>client:load</code> (or{" "}
            <code>client:visible</code> / <code>client:idle</code>) to a
            component, Astro turns that component into a self-contained
            interactive &quot;island&quot; — it hydrates independently without
            affecting the surrounding static HTML. This means a marketing page
            with one interactive widget ships only the JS for that widget, not
            for the entire framework.
          </>
        ),
      }}
      takeaways={[
        <>
          SSGs pre-render at <strong>build time</strong> — request-time cost is
          near zero, ideal for content that does not change per-user or per-hour.
        </>,
        <>
          Astro&apos;s islands model: <strong>HTML by default, JS by
          exception</strong>. Only annotated components hydrate; everything else
          is plain HTML.
        </>,
        <>
          For frequently-changing data, combine SSG with{" "}
          <strong>ISR</strong> (on-demand revalidation) or fall back to SSR /
          client-side fetching for truly dynamic routes.
        </>,
      ]}
      mentalModel="Build once, serve many. Islands = mostly-static + sprinkles of JS. SSG is the default; only opt out when you must."
      roadmapUrl="https://roadmap.sh/frontend"
    />
  );
}
