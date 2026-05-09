"use client";

import { ScaffoldModule } from "./_template";
import { CodeBlock } from "@/components/CodeBlock";

const lighthouseExcerpt = `{
  "fetchTime": "2025-05-09T08:00:00.000Z",
  "finalUrl": "https://example.com/",
  "categories": {
    "performance": {
      "id": "performance",
      "title": "Performance",
      "score": 0.72
    }
  },
  "audits": {
    "largest-contentful-paint": {
      "id": "largest-contentful-paint",
      "title": "Largest Contentful Paint",
      "description": "Marks the time when the largest content element is painted.",
      "score": 0.45,
      "displayValue": "3.8 s",
      "numericValue": 3800
    },
    "interactive": {
      "id": "interactive",
      "title": "Time to Interactive",
      "score": 0.68,
      "displayValue": "4.2 s",
      "numericValue": 4200
    },
    "cumulative-layout-shift": {
      "id": "cumulative-layout-shift",
      "title": "Cumulative Layout Shift",
      "score": 0.95,
      "displayValue": "0.04",
      "numericValue": 0.04
    },
    "total-blocking-time": {
      "id": "total-blocking-time",
      "title": "Total Blocking Time",
      "score": 0.6,
      "displayValue": "280 ms",
      "numericValue": 280
    }
  }
}`;

export function Module_7_8_Content() {
  return (
    <ScaffoldModule
      emoji="⚡"
      problemTitle="Measure, then improve — Core Web Vitals, RAIL, PRPL"
      problem={
        <>
          <p>
            Three <strong>Core Web Vitals</strong> capture what real users actually feel.{" "}
            <strong>LCP</strong> (Largest Contentful Paint) measures how fast the main content
            appears — target <code>≤ 2.5 s</code>. <strong>INP</strong> (Interaction to Next
            Paint) measures how snappy interactions feel — target <code>≤ 200 ms</code>.{" "}
            <strong>CLS</strong> (Cumulative Layout Shift) measures how much page content jumps
            around unexpectedly — target <code>≤ 0.1</code>. Google uses these scores directly
            in search ranking, so they have teeth.
          </p>
          <p>
            <strong>RAIL</strong> is a mental budget, not a metric. Response to user input must
            complete in <code>&lt; 100 ms</code>. Animations must produce a new frame every{" "}
            <code>16 ms</code> (60 fps). Idle work should be chunked into <code>50 ms</code>{" "}
            tasks so the main thread stays responsive. Page Load should feel complete under{" "}
            <code>1 s</code>. RAIL gives you a number to argue with when profiling.
          </p>
          <p>
            <strong>PRPL</strong> is a loading strategy: <em>Push</em> critical resources early
            (preload, HTTP/2 server push). <em>Render</em> the initial route as fast as
            possible. <em>Pre-cache</em> remaining routes with a Service Worker so repeat visits
            are instant. <em>Lazy-load</em> everything else on demand. Together, RAIL tells you
            the budget and PRPL tells you how to hit it.
          </p>
        </>
      }
      body={
        <CodeBlock
          language="json"
          fileName="lighthouse-excerpt.json"
          code={lighthouseExcerpt}
        />
      }
      challenge={{
        question: "Your LCP is 4.2 s. Which of these would help most?",
        options: [
          {
            id: "a",
            text: 'Move all <script> tags to the bottom of the <body>',
          },
          {
            id: "b",
            text: "Preload the LCP image with <link rel='preload'> and serve it from a CDN edge node close to the user",
          },
          {
            id: "c",
            text: "Disable JavaScript entirely so the page has nothing blocking the main thread",
          },
          {
            id: "d",
            text: "Increase the origin server's CPU allocation to generate HTML faster",
          },
        ],
        correctAnswerId: "b",
        explanation: (
          <>
            LCP is almost always bottlenecked by the hero image: the browser discovers it late
            (after parsing HTML and CSS) and then waits for a distant server to deliver it.
            Preloading with <code>&lt;link rel=&quot;preload&quot;&gt;</code> tells the browser
            to fetch it immediately, and a CDN edge node cuts the round-trip latency to tens of
            milliseconds instead of hundreds. Moving scripts down helps with TBT and TTI but
            rarely moves LCP; disabling JS and upgrading the server CPU are blunt instruments
            that address the wrong bottleneck.
          </>
        ),
      }}
      takeaways={[
        <>
          <strong>LCP ≤ 2.5 s</strong>, <strong>INP ≤ 200 ms</strong>,{" "}
          <strong>CLS ≤ 0.1</strong> — these Core Web Vitals directly influence Google search
          ranking and summarise what users feel.
        </>,
        <>
          <strong>RAIL</strong> is a budget: Response 100 ms, Animation 16 ms/frame, Idle
          chunks 50 ms, Load 1 s. Use it as the argument when profiling.
        </>,
        <>
          <strong>PRPL</strong> is the strategy: Push critical resources, Render initial route
          fast, Pre-cache with a Service Worker, Lazy-load the rest.
        </>,
      ]}
      mentalModel="LCP = how fast the main thing appears. INP = how snappy interactions feel. RAIL is a budget per kind of interaction."
      roadmapUrl="https://roadmap.sh/frontend"
    />
  );
}
