"use client";

import { ScaffoldModule } from "./_template";
import { CodeBlock } from "@/components/CodeBlock";

const viteConfigCode = `// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [
    // Enables React Fast Refresh in dev and JSX transform in build
    react(),
  ],

  resolve: {
    alias: {
      // "@/components/Button" → "src/components/Button"
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    port: 3000,
    proxy: {
      // Forward /api/* to a local backend during development
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\\/api/, ""),
      },
    },
  },

  build: {
    // Rollup handles the production bundle
    outDir: "dist",
    sourcemap: true,      // keep source maps for error tracking
    rollupOptions: {
      output: {
        // Split large vendor chunks for better long-term caching
        manualChunks: {
          react: ["react", "react-dom"],
        },
      },
    },
  },
});`;

export function Module_6_2_Content() {
  return (
    <ScaffoldModule
      emoji="📦"
      problemTitle="What &apos;bundling&apos; really means in 2026"
      problem={
        <>
          <p>
            In <strong>development</strong> you want fast feedback — Vite
            serves your source files over native ES Modules and only
            transforms what the browser actually imports. There is no upfront
            bundle step, so startup is near-instant regardless of project
            size. Under the hood, Vite uses <strong>esbuild</strong> (written
            in Go) for dependency pre-bundling and JSX/TS transforms — 10–100×
            faster than the equivalent Node.js transforms.
          </p>
          <p>
            In <strong>production</strong> you want few HTTP requests and
            aggressive optimization — that is &quot;bundling&quot;. Vite hands the
            production build to <strong>Rollup</strong>, which tree-shakes
            dead code, splits chunks, and generates hashed file names for
            long-term caching. Webpack predates native ESM; it bundles in dev
            too, which is why its cold-start is slow on large projects.
            esbuild and <strong>SWC</strong> (Rust) are the underlying speed
            engines that both Vite and modern Webpack configs delegate to.
          </p>
          <p>
            Rule of thumb for 2026: <strong>pick Vite for new projects</strong>.
            Its dev-server model is architecturally faster than Webpack&apos;s.
            Migrate from Webpack only when the pain is clear — the ecosystem
            and plugin APIs are different. For meta-frameworks (Next.js,
            Remix, Nuxt), the framework owns the bundler choice; you configure
            it, not replace it.
          </p>
        </>
      }
      body={
        <CodeBlock
          language="typescript"
          fileName="vite.config.ts"
          code={viteConfigCode}
        />
      }
      challenge={{
        question:
          "Why is Vite's dev server so much faster than Webpack's for large projects?",
        options: [
          {
            id: "a",
            text: "Vite uses Rust internally, which is faster than Webpack's JavaScript.",
          },
          {
            id: "b",
            text: "Vite caches every file to disk on first run and skips all subsequent transforms.",
          },
          {
            id: "c",
            text: "Vite serves your source files as native ES modules and only transforms files when the browser requests them — there's no upfront bundle step in dev.",
          },
          {
            id: "d",
            text: "Vite skips TypeScript type-checking entirely, while Webpack performs it on every save.",
          },
        ],
        correctAnswerId: "c",
        explanation: (
          <>
            Webpack builds a full in-memory bundle before serving the first
            request, which scales with project size. Vite exploits the
            browser&apos;s native <code>import</code> support: it only
            transforms files on demand, so cold-start time is proportional to
            the <em>entry point</em>, not the whole codebase. Hot Module
            Replacement (HMR) is also scoped to the changed module&apos;s
            dependency chain, not a full re-bundle.
          </>
        ),
      }}
      takeaways={[
        <>
          Dev bundlers optimize for speed; production bundlers optimize for
          network efficiency — they are different problems with different
          tools (even inside Vite: esbuild in dev, Rollup in build).
        </>,
        <>
          Native ESM in the browser is what makes Vite&apos;s dev model possible;
          Webpack predated it and carries architectural debt from that era.
        </>,
        <>
          For new projects in 2026, start with Vite. For existing Webpack
          projects, migrate only when cold-start or HMR pain is measurable.
        </>,
      ]}
      mentalModel="Dev: serve, transform on demand. Build: bundle for the network. Vite leans on the browser's ESM; Webpack predates it."
      roadmapUrl="https://roadmap.sh/frontend"
    />
  );
}
