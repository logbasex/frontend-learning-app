"use client";

import { Card, CardContent } from "@/components/ui/card";
import { HTMLPlayground } from "@/components/CodePlayground";
import { StepByStepExplanation, Step } from "@/components/StepByStepExplanation";
import { LayeredFlow } from "@/components/LayeredFlow";
import { Challenge } from "@/components/Challenge";
import { GotchaList } from "@/components/GotchaList";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { RoadmapLink } from "@/components/RoadmapLink";

export function Module_7_8_Content() {
  // Data blocks hoisted out of JSX for readability — listed in render order.
  const measureThenOptimizeSteps: Step[] = [
    {
      title: 'LCP — Largest Contentful Paint',
      description: (
        <>
          <strong>LCP</strong> records the moment the largest visible content element finishes
          painting — typically the hero image, the headline, or a video poster frame. Target:{' '}
          <strong>under 2.5 seconds</strong> from navigation start. The most common causes of
          slow LCP are a hero image with no width/height attributes (causes layout uncertainty),
          render-blocking CSS that prevents the browser from painting, and a slow origin server
          with no CDN edge nearby. Every millisecond before the LCP element paints is a
          millisecond the user stares at a partial or blank page.
        </>
      ),
      code: `<!-- Slow: browser doesn't know the size until the image arrives -->
<img src="/hero.jpg" alt="Hero">

<!-- Fast: browser reserves space immediately, no layout shift -->
<img src="/hero.jpg" alt="Hero" width="1200" height="600"
     fetchpriority="high">

<!-- Faster still: preload the LCP image so the browser
     fetches it as early as possible -->
<link rel="preload" as="image" href="/hero.jpg">`,
    },
    {
      title: 'INP — Interaction to Next Paint',
      description: (
        <>
          <strong>INP</strong> — the slowest interaction&apos;s delay-to-visual-update during
          the page lifetime — replaced the older First Input Delay metric in 2024. The key word
          is &quot;lifetime&quot;: INP is not the first click; it is the{' '}
          <em>worst</em> click during the whole session. Target:{' '}
          <strong>under 200 milliseconds</strong>. Poor INP is almost always caused by long
          JavaScript tasks blocking the main thread. A click handler that runs 600 ms of
          synchronous work will make the page feel frozen even if LCP was great. The fix is to
          break long tasks into 50 ms chunks using <code>scheduler.yield()</code> or{' '}
          <code>setTimeout(..., 0)</code>.
        </>
      ),
      code: `// Bad: 400 ms of synchronous work on the main thread.
// Every interaction queued during this time waits.
button.addEventListener('click', () => {
  processLargeDataset(10_000_items); // blocks for 400 ms
  updateUI();
});

// Better: yield after each chunk so the browser can
// service pending interactions between chunks.
button.addEventListener('click', async () => {
  for (const chunk of chunks(items, 100)) {
    processChunk(chunk);
    await scheduler.yield(); // hand control back
  }
  updateUI();
});`,
    },
    {
      title: 'CLS — Cumulative Layout Shift',
      description: (
        <>
          <strong>CLS</strong> is a unitless score of how much elements jumped while the page
          was loading. Each jump contributes a fraction; they accumulate for the lifetime of the
          page. Target: <strong>under 0.1</strong>. The three most common causes are: images
          and embeds without declared dimensions (the browser reserves zero space, then the
          element pops in and pushes everything down), fonts swapping mid-render (text reflows
          as the custom font loads), and dynamic content inserted above existing content (a
          cookie banner, an ad, a &quot;new messages&quot; bar). Reserved space — via{' '}
          <code>width</code>/<code>height</code> attributes or <code>aspect-ratio</code> CSS —
          eliminates the shift before the content arrives.
        </>
      ),
      code: `/* Bad: no reserved space; image loads and everything jumps */
img { width: 100%; }

/* Good: aspect-ratio reserves the exact space before
   the image bytes arrive — zero layout shift */
img {
  width: 100%;
  aspect-ratio: 16 / 9;
}

/* Font swap: the flash of unstyled text contributes to CLS.
   font-display: optional avoids the swap entirely by using
   the fallback if the font hasn't loaded. */
@font-face {
  font-family: 'MyFont';
  src: url('/my-font.woff2') format('woff2');
  font-display: optional;
}`,
    },
    {
      title: 'Read a Lighthouse report',
      description: (
        <>
          Lighthouse is a Google tool that audits a page for performance, accessibility, SEO,
          and best practices. The <strong>Performance score</strong> is a weighted average of
          six metrics (LCP 25%, INP 25%, CLS 25%, Total Blocking Time 25%, and two minor
          ones). A score of 90+ is &quot;green,&quot; 50–89 is &quot;orange,&quot; under 50 is
          &quot;red&quot; — but the score itself is secondary to the{' '}
          <strong>Opportunities</strong> section. Each Opportunity shows a specific fix and its
          estimated time saving. Address the top three by impact before anything else. The
          Diagnostics section below it surfaces issues that don&apos;t have a direct byte-saving
          estimate but still matter (long main-thread tasks, excessive DOM size, etc.).
        </>
      ),
      code: `// Lighthouse CLI (run against a production URL, not localhost)
npx lighthouse https://example.com \
  --only-categories=performance \
  --output=html \
  --output-path=report.html

// Key Opportunities to look for:
//
//  "Properly size images"         → serve WebP/AVIF at display size
//  "Remove unused JavaScript"     → code-split aggressively
//  "Eliminate render-blocking"    → inline critical CSS, defer the rest
//  "Reduce initial server resp"   → CDN, Edge, or caching headers
//  "Avoid large layout shifts"    → add width/height to every image`,
    },
    {
      title: 'Concrete fixes',
      description: (
        <>
          Five techniques with outsized impact, each targeting a specific vital:
          <br />
          <strong>1. Image dimensions:</strong> <code>width</code>/<code>height</code> attributes
          on every <code>&lt;img&gt;</code> — eliminates CLS immediately.
          <br />
          <strong>2. Lazy loading:</strong> <code>loading=&quot;lazy&quot;</code> on offscreen
          images defers their fetch until the user scrolls near — fewer bytes on initial load,
          better LCP for above-the-fold content.
          <br />
          <strong>3. Font preload:</strong>{' '}
          <code>&lt;link rel=&quot;preload&quot; as=&quot;font&quot;&gt;</code> for the primary
          typeface — eliminates FOUT and reduces CLS.
          <br />
          <strong>4. Critical CSS inline:</strong> pull above-the-fold styles into a{' '}
          <code>&lt;style&gt;</code> tag in <code>&lt;head&gt;</code>; defer the rest. Removes
          the render-blocking stylesheet request.
          <br />
          <strong>5. Code splitting:</strong> load only the JavaScript for the current route.
          React.lazy + dynamic <code>import()</code> keep the initial bundle small and reduce
          Total Blocking Time.
        </>
      ),
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <!-- 1. Inline critical CSS (above-the-fold only) -->
  <style>
    body { margin: 0; font-family: system-ui; }
    .hero { background: #1e293b; color: #f8fafc; padding: 4rem; }
  </style>

  <!-- 2. Preload the LCP image -->
  <link rel="preload" as="image" href="/hero.webp">

  <!-- 3. Preload the primary font -->
  <link rel="preload" as="font" type="font/woff2"
        href="/fonts/inter.woff2" crossorigin>

  <!-- 4. Defer non-critical CSS (doesn't block rendering) -->
  <link rel="preload" as="style" href="/styles/full.css"
        onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="/styles/full.css"></noscript>
</head>
<body>
  <!-- 5. Dimensions on hero image → no CLS -->
  <img src="/hero.webp" alt="Hero" width="1200" height="600"
       fetchpriority="high">

  <!-- 6. lazy on offscreen images → better initial LCP -->
  <img src="/below-fold.webp" alt="Article" width="800" height="450"
       loading="lazy">
</body>
</html>`,
    },
    {
      title: 'PRPL and RAIL — budgets to think in',
      description: (
        <>
          <strong>PRPL</strong> is a loading strategy, not a single technique. Push critical
          resources (via <code>preload</code> or HTTP/2 server push). Render the initial route
          as fast as possible — inline the CSS, pre-fetch the data. Pre-cache remaining routes
          with a Service Worker so repeat visits are instant. Lazy-load everything else on
          demand (images, code, third-party scripts).
          <br />
          <br />
          <strong>RAIL</strong> is a performance budget organized by interaction type. Response
          to a user input must complete within 100 ms so the interaction feels instant.
          Animation must produce a new frame every 16 ms (60 fps) — any JS that runs between
          frames steals time from the compositor. Idle work should be chunked into 50 ms tasks
          so the main thread can service inputs between chunks. Load: the key content should
          feel ready within 1 second on a mid-range device. RAIL gives you a number to defend
          when arguing a performance budget with your team.
        </>
      ),
      code: `// PRPL in code
// ──────────────
// Push: preload the most critical asset
<link rel="preload" as="script" href="/main.js">

// Render: inline critical CSS, no blocking requests
<style>/* above-the-fold only */</style>

// Pre-cache: service worker caches shell on first visit
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('shell-v1').then(c =>
      c.addAll(['/index.html', '/main.js', '/critical.css'])
    )
  );
});

// Lazy-load: dynamic import for non-critical routes
const Settings = React.lazy(() => import('./Settings'));

// RAIL budgets in DevTools
// ─────────────────────────
// Response  < 100 ms  → interaction handler + first paint of feedback
// Animation < 16 ms   → each JS frame budget (60fps = 16.67ms/frame)
// Idle      < 50 ms   → background task chunk size
// Load      < 1 s     → LCP target for the primary route`,
    },
  ];

  const playgroundHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Core Web Vitals Demo</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: system-ui, sans-serif;
      background: #0f172a;
      color: #f8fafc;
      padding: 16px;
      min-height: 100vh;
    }
    h1 { font-size: 1rem; margin-bottom: 16px; color: #94a3b8; }
    .demos { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .demo {
      background: #1e293b;
      border-radius: 10px;
      overflow: hidden;
      border: 1px solid #334155;
    }
    .demo-header {
      padding: 10px 14px;
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .slow .demo-header { background: #7f1d1d; color: #fca5a5; }
    .fast .demo-header { background: #14532d; color: #86efac; }
    .demo-body { padding: 14px; }
    .score-badge {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 700;
      margin-bottom: 10px;
    }
    .score-bad  { background: #7f1d1d; color: #fca5a5; }
    .score-good { background: #14532d; color: #86efac; }
    .image-slot {
      width: 100%;
      background: #334155;
      border-radius: 6px;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.7rem;
      color: #64748b;
      position: relative;
      overflow: hidden;
    }
    .slow-image { height: 0; transition: height 1.2s ease; }
    .slow-image.loaded { height: 90px; }
    .fast-image { height: 90px; }
    .image-inner {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .shift-indicator {
      font-size: 0.7rem;
      color: #ef4444;
      margin-bottom: 8px;
      min-height: 16px;
    }
    .no-shift { color: #22c55e; }
    .text-below {
      font-size: 0.75rem;
      color: #94a3b8;
      padding: 6px 0;
      border-top: 1px solid #334155;
      margin-top: 4px;
    }
    .font-slow  { font-family: serif; }
    .font-swap  { font-family: Georgia, serif; font-style: italic; color: #fbbf24; font-size: 0.65rem; }
    .font-fast  { font-family: system-ui, sans-serif; }
    .vitals-row {
      display: flex;
      gap: 6px;
      margin-top: 10px;
    }
    .vital {
      flex: 1;
      background: #0f172a;
      border-radius: 6px;
      padding: 6px 8px;
      font-size: 0.65rem;
    }
    .vital-label { color: #64748b; margin-bottom: 2px; }
    .vital-val   { font-weight: 700; font-size: 0.8rem; }
    .val-bad  { color: #f87171; }
    .val-good { color: #4ade80; }
    button {
      width: 100%;
      margin-top: 14px;
      padding: 8px;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.8rem;
    }
    button:hover { background: #2563eb; }
  </style>
</head>
<body>
  <h1>Core Web Vitals — Slow vs Fast</h1>
  <div class="demos">
    <div class="demo slow">
      <div class="demo-header">Slow page</div>
      <div class="demo-body">
        <span class="score-badge score-bad">Perf: 41</span>
        <div class="image-slot slow-image" id="slow-img">
          <div class="image-inner" style="display:none" id="slow-img-inner">Hero Image</div>
        </div>
        <div class="shift-indicator" id="slow-shift">Waiting for image...</div>
        <div class="text-below font-slow" id="slow-font">
          Body text in fallback font (swap pending)
        </div>
        <div class="text-below font-swap" id="slow-swap-note" style="display:none">
          Font swapped! Text reflowed (CLS contributor)
        </div>
        <div class="vitals-row">
          <div class="vital">
            <div class="vital-label">LCP</div>
            <div class="vital-val val-bad" id="slow-lcp">—</div>
          </div>
          <div class="vital">
            <div class="vital-label">CLS</div>
            <div class="vital-val val-bad" id="slow-cls">—</div>
          </div>
        </div>
      </div>
    </div>
    <div class="demo fast">
      <div class="demo-header">Fast page</div>
      <div class="demo-body">
        <span class="score-badge score-good">Perf: 97</span>
        <div class="image-slot fast-image">
          <div class="image-inner">Hero Image (preloaded)</div>
        </div>
        <div class="shift-indicator no-shift">Space reserved — no shift</div>
        <div class="text-below font-fast">
          Body text in system font (no swap, no reflow)
        </div>
        <div class="vitals-row">
          <div class="vital">
            <div class="vital-label">LCP</div>
            <div class="vital-val val-good">0.8 s</div>
          </div>
          <div class="vital">
            <div class="vital-label">CLS</div>
            <div class="vital-val val-good">0.00</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <button id="replay-btn">Replay demo</button>
</body>
</html>`;

  const playgroundCss = ``;

  const playgroundJs = `// Try this: scroll between the "Slow" and "Fast" demos. The Slow page
// jumps as the hero image loads (CLS) and renders late (LCP). The Fast
// page reserves space for the image (no jump) and preloads the font
// (no swap). Same content, different cost. The visible difference is
// the difference Web Vitals measure.

let slowTimeout1, slowTimeout2, slowTimeout3;

function runSlowDemo() {
  const img      = document.getElementById('slow-img');
  const imgInner = document.getElementById('slow-img-inner');
  const shift    = document.getElementById('slow-shift');
  const font     = document.getElementById('slow-font');
  const swapNote = document.getElementById('slow-swap-note');
  const lcpEl    = document.getElementById('slow-lcp');
  const clsEl    = document.getElementById('slow-cls');

  // Reset
  img.classList.remove('loaded');
  imgInner.style.display = 'none';
  shift.textContent = 'Waiting for image...';
  shift.className = 'shift-indicator';
  font.className = 'text-below font-slow';
  swapNote.style.display = 'none';
  lcpEl.textContent = '—';
  clsEl.textContent = '—';

  // Simulate late image arrival (1.2 s) → CLS spike
  slowTimeout1 = setTimeout(() => {
    img.classList.add('loaded');
    imgInner.style.display = 'flex';
    shift.textContent = 'Layout shifted! Content below jumped down.';
    shift.className = 'shift-indicator';
    clsEl.textContent = '0.27';
  }, 1200);

  // Simulate font swap (1.8 s) → additional CLS
  slowTimeout2 = setTimeout(() => {
    swapNote.style.display = 'block';
    font.className = 'text-below font-fast';
  }, 1800);

  // LCP resolves after image + repaint
  slowTimeout3 = setTimeout(() => {
    lcpEl.textContent = '3.8 s';
  }, 1400);
}

function clearSlowTimeouts() {
  [slowTimeout1, slowTimeout2, slowTimeout3].forEach(id => clearTimeout(id));
}

document.getElementById('replay-btn').addEventListener('click', () => {
  clearSlowTimeouts();
  runSlowDemo();
});

// Run automatically on load
runSlowDemo();`;

  return (
    <div className="space-y-8">

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 1: Hook                                                       */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Card>
        <CardContent className="pt-6">
          <div className="prose dark:prose-invert max-w-none">
            <p>
              Two pages with the same content can score wildly differently in Lighthouse. The fast
              one ships fewer bytes, lays out earlier, and doesn&apos;t shift. The slow one
              downloads megabytes, blocks rendering on a third-party script, and makes the
              user&apos;s click wait 800 ms for a busy main thread. Web performance isn&apos;t a
              separate skill — it&apos;s the consequence of every architectural decision you&apos;ve
              already made. Three Core Web Vitals tell you where the cost lands.
            </p>
            <p>
              Google uses Core Web Vitals directly in search ranking, so they have real business
              consequences. But even setting SEO aside, they describe something true about the
              experience: a page that loads slowly, responds sluggishly to clicks, and jumps around
              as it renders is a page users leave. Measuring vitals is how you find out which of
              those problems you actually have — before you optimize the wrong thing.
            </p>
          </div>
          <div className="mt-4">
            <RoadmapLink url="https://roadmap.sh/frontend" />
          </div>
        </CardContent>
      </Card>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 2: Mental model first                                         */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Card>
        <CardContent className="pt-6">
          <div className="prose dark:prose-invert max-w-none">
            <p>
              Each Core Web Vital targets a different moment in the user&apos;s experience: loading,
              interacting, and layout stability. They are independent costs. A page can have
              excellent LCP (the hero image appeared fast) but terrible INP (every button feels
              laggy) or terrible CLS (the layout jumped three times while reading). The vitals exist
              precisely because those three experiences are unrelated to each other and need separate
              fixes. Lighthouse aggregates them into one score — but the score is only a summary; the
              individual metrics tell you what to actually fix.
            </p>
            <blockquote className="border-l-4 border-blue-500 pl-4 italic">
              &quot;LCP is how fast the main thing appears. INP is how snappy interactions feel.
              CLS is how much things jumped while loading. Measure first; optimize second.&quot;
            </blockquote>
          </div>
        </CardContent>
      </Card>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 3: Step-by-step                                               */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <StepByStepExplanation
        title="Measure, then optimize"
        description="Six steps from understanding Core Web Vitals to shipping concrete improvements"
        steps={measureThenOptimizeSteps}
      />

      {/* Optional: LayeredFlow (Web Vitals timeline) */}
      <LayeredFlow
        title="Where each Web Vital is measured"
        description="The page-load timeline relative to LCP, INP, CLS"
        stages={[
          { label: 'Navigation start', detail: 'user clicks', color: 'slate' },
          { label: 'First byte', detail: 'TTFB', color: 'blue' },
          { label: 'First Contentful Paint', detail: 'any text/image', color: 'violet' },
          { label: 'LCP', detail: 'biggest visible element', color: 'emerald' },
          { label: 'Interactive', detail: 'first input', color: 'amber' },
          { label: 'INP (lifetime)', detail: 'worst interaction → next paint', color: 'rose' },
          { label: 'CLS (lifetime)', detail: 'sum of layout shifts', color: 'blue' },
        ]}
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 4: Live playground                                            */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <HTMLPlayground
        html={playgroundHtml}
        css={playgroundCss}
        js={playgroundJs}
        title="Slow vs Fast — same content, different cost"
        description="Watch the Slow page shift as the hero image loads late (CLS). The Fast page reserves space and preloads the image. Hit Replay to run the demo again."
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 5: Challenges                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Challenge
        question="Your Lighthouse report shows a CLS of 0.27 (target: < 0.1). The biggest contributor is the hero image. Most likely cause and fix?"
        options={[
          {
            id: 'a',
            text: 'The image is too large; downscale it.',
          },
          {
            id: 'b',
            text: 'The image has no width and height attributes (or aspect-ratio CSS), so the browser reserves zero space until it loads — when it loads, everything below jumps. Fix: add explicit dimensions or aspect-ratio to the <img>.',
          },
          {
            id: 'c',
            text: 'The image format is wrong; use AVIF.',
          },
          {
            id: 'd',
            text: 'The image is loaded by JavaScript; switch to a <picture> element.',
          },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            CLS is dominated by elements that load late and push existing content around.
            Reserved space (via dimensions or <code>aspect-ratio</code>) eliminates the shift
            because the browser holds the correct amount of vertical space from the start — the
            image flowing in changes nothing below it. File size and format affect LCP (how
            quickly the image loads), not CLS — those are different vitals targeting different
            costs.
          </>
        }
      />

      <Challenge
        question="You have 12 KB of CSS that's used on every page. Should you inline it in <head> or fetch it as a stylesheet?"
        options={[
          {
            id: 'a',
            text: "Always inline — it's faster.",
          },
          {
            id: 'b',
            text: 'Always fetch — it caches across pages.',
          },
          {
            id: 'c',
            text: 'Inline the critical portion (above-the-fold styles) and defer the rest with <link rel="preload" as="style"> plus an async load. Inlining everything blows up HTML; fetching everything blocks first paint.',
          },
          {
            id: 'd',
            text: "It doesn't matter for 12 KB.",
          },
        ]}
        correctAnswerId="c"
        explanation={
          <>
            Inlined critical CSS unblocks first paint; deferred non-critical CSS still caches
            and applies after paint so the page looks correct once the full stylesheet arrives.
            The right split between inline and external is per-page (often 5–10 KB inline), and
            tools like Critters automate it. &quot;Always inline&quot; wastes the HTTP cache
            across navigations; &quot;always fetch&quot; makes every first render wait for a
            full stylesheet download.
          </>
        }
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 6: GotchaList                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <GotchaList
        items={[
          {
            title:
              "LCP regressions are usually caused by hero images without dimensions — width/height attributes are still required for layout reservation, even if you set width via CSS",
            body: (
              <>
                CSS <code>width: 100%</code> controls how the image is displayed; it does not tell
                the browser the image&apos;s intrinsic size before the bytes arrive. The HTML{' '}
                <code>width</code>/<code>height</code> attributes (or <code>aspect-ratio</code> in
                CSS) are what reserves the space. Missing them causes CLS even when the CSS looks
                fine.
              </>
            ),
          },
          {
            title:
              "INP measures the worst interaction during the page lifetime — one slow click haunts the whole session",
            body: (
              <>
                Unlike First Input Delay, which only measured the first interaction, INP samples
                every click, key press, and tap. One slow handler — perhaps a search input that
                triggers an expensive filter on each keystroke — will degrade the INP score for the
                entire session regardless of how fast every other interaction was.
              </>
            ),
          },
          {
            title:
              "CLS spikes are nearly always caused by ads, embeds, or fonts — prevention is font-display: swap plus reserved space and aspect-ratio",
            body: (
              <>
                Third-party ads and embeds frequently inject into the page after load with no
                reserved space. Fonts using <code>font-display: block</code> hold invisible text for
                up to 3 seconds, then swap — causing a reflow. <code>font-display: optional</code>{' '}
                avoids any swap if the font hasn&apos;t loaded; <code>font-display: swap</code>{' '}
                shows the fallback immediately, which is better for LCP but still causes a small
                CLS unless the fallback and custom font are size-matched.
              </>
            ),
          },
          {
            title:
              "Lighthouse simulates a slow phone — your dev machine is a fantasy environment for perf; trust real-user metrics (RUM) for production",
            body: (
              <>
                Lighthouse applies CPU throttling (4x slowdown) and network throttling to simulate a
                mid-range mobile device on a 4G connection. Your MacBook Pro with gigabit fibre will
                score 98 on a page that real users experience as 55. Chrome&apos;s CrUX (Chrome User
                Experience Report) and the Web Vitals JavaScript library give you real-user data —
                Lighthouse gives you a reproducible lab baseline. Use both.
              </>
            ),
          },
        ]}
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 7: KeyTakeaways                                               */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <KeyTakeaways
        points={[
          <>
            <strong>LCP</strong> (Largest Contentful Paint) — time from navigation start to the
            largest visible element being painted. Target: under 2.5 s. Fix: preload the hero
            image, add dimensions, use a CDN.
          </>,
          <>
            <strong>INP</strong> (Interaction to Next Paint) — the slowest interaction&apos;s
            delay-to-visual-update during the page lifetime. Target: under 200 ms. Fix: break
            long JavaScript tasks into 50 ms chunks.
          </>,
          <>
            <strong>CLS</strong> (Cumulative Layout Shift) — a unitless score of how much elements
            jumped while the page was loading. Target: under 0.1. Fix: add{' '}
            <code>width</code>/<code>height</code> or <code>aspect-ratio</code> to every image and
            embed.
          </>,
          <>
            Lighthouse&apos;s <strong>Opportunities</strong> section ranks fixes by estimated time
            saving — address the top three by impact before anything else.
          </>,
          <>
            <strong>PRPL</strong>: Push critical, Render initial route, Pre-cache, Lazy-load.{' '}
            <strong>RAIL</strong>: Response &lt; 100 ms, Animation 16 ms/frame, Idle 50 ms chunks,
            Load &lt; 1 s. Both are frameworks for budgeting attention by interaction kind.
          </>,
        ]}
        mentalModel="LCP is how fast the main thing appears. INP is how snappy interactions feel. CLS is how much things jumped while loading. Measure first; optimize second."
      />
    </div>
  );
}
