"use client";

import { Card, CardContent } from "@/components/ui/card";
import { HTMLPlayground } from "@/components/CodePlayground";
import { StepByStepExplanation, Step } from "@/components/StepByStepExplanation";
import { Challenge } from "@/components/Challenge";
import { GotchaList } from "@/components/GotchaList";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { RoadmapLink } from "@/components/RoadmapLink";

export function Module_3_3_Content() {
  // Data blocks hoisted out of JSX for readability — listed in render order.
  const responsiveSteps: Step[] = [
    {
      title: "Step 1: Mobile-first means base styles, then add",
      description: (
        <>
          Write the simplest layout first — the one that works at any width, even 320px. Then
          use <code>@media (min-width: 600px)</code> to layer on complexity for wider screens.
          This is the mobile-first rule: your stylesheet grows <em>upward</em> in complexity, which
          keeps the cascade additive. Compare it to the alternative: writing desktop styles and
          overriding them with <code>max-width</code> queries for mobile. That approach fights the
          cascade — you keep adding rules to undo earlier rules. Mobile-first stacks cleaner and
          ships a leaner default payload to the devices that need it most.
        </>
      ),
      code: `/* ✗ Max-width approach: desktop default, override for mobile */
.sidebar { width: 300px; float: left; }
@media (max-width: 768px) {
  .sidebar { width: 100%; float: none; } /* undoing rules */
}

/* ✓ Min-width approach: mobile default, enhance for wider screens */
.sidebar { width: 100%; }               /* base: full width, stacks */
@media (min-width: 768px) {
  .sidebar { width: 300px; float: left; } /* add side-by-side layout */
}`,
    },
    {
      title: "Step 2: Pick breakpoints from content",
      description: (
        <>
          Open DevTools, drag the viewport handle slowly narrower. At what exact pixel count does
          your layout start looking bad — the text too cramped, the grid too narrow, the nav
          overflowing? That pixel count is your breakpoint. It might be 580px, 820px, 1100px.
          The number doesn&apos;t matter; only your layout does. Breakpoints named after devices
          (&quot;iPhone width&quot;, &quot;iPad width&quot;) age badly: devices change, your content
          stays. Breakpoints named after layout failures stay accurate forever.
        </>
      ),
      code: `/* ✗ Device-named breakpoints — fragile */
@media (min-width: 768px) { /* "iPad" */ ... }
@media (min-width: 1024px) { /* "iPad Pro" */ ... }

/* ✓ Content-driven breakpoints — durable */
/* Added because the card grid looked cramped below this width */
@media (min-width: 580px) { ... }

/* Added because the nav overflowed below this width */
@media (min-width: 860px) { ... }`,
    },
    {
      title: "Step 3: Fluid type with clamp()",
      description: (
        <>
          <em>
            <code>clamp()</code> — a CSS function <code>clamp(min, preferred, max)</code> that
            produces a value bounded by min/max
          </em>{" "}
          — lets you write font sizes that scale smoothly with the viewport, no media queries
          needed. The preferred expression mixes viewport units with a <code>rem</code> offset:
          the <code>rem</code> term keeps the value from collapsing to zero on tiny screens. The
          result: one rule, no jumps, hard bounds respected.
        </>
      ),
      code: `/* Heading that scales fluidly from 1rem to 1.5rem */
h1 {
  font-size: clamp(1rem, 0.5rem + 2vw, 1.5rem);
  /*         ↑ min  ↑ preferred      ↑ max
   *
   * At 320px viewport → 0.5rem + 2×3.2px = 0.5rem + 0.4rem = 0.9rem → clamped to 1rem (min)
   * At 800px viewport → 0.5rem + 2×8px   = 0.5rem + 1rem   = 1.5rem → clamped to 1.5rem (max)
   * Between those: perfectly smooth
   */
}

/* Spacing that breathes */
.section-padding {
  padding: clamp(1rem, 3vw, 3rem);
}`,
    },
    {
      title: "Step 4: Container queries beat viewport queries",
      description: (
        <>
          A <em>container query</em> — a <code>@container</code> query that styles based on a
          parent&apos;s size, not the viewport — solves the problem viewport queries can&apos;t: a
          card in a narrow sidebar needs to stack vertically regardless of whether the viewport is
          1400px wide. The card can&apos;t know its context from a viewport query alone. Container
          queries give it that power. The setup is two lines: mark the parent with{" "}
          <code>container-type: inline-size</code>, then write{" "}
          <code>@container (min-width: 400px)</code> inside the card&apos;s styles. The parent width
          is the measure — the viewport is irrelevant.
        </>
      ),
      code: `/* 1. Mark the parent as a named container */
.card-wrapper {
  container-type: inline-size;
  container-name: card;   /* optional but documents intent */
}

/* 2. Style the card based on its own container's width */
.card {
  display: grid;
  grid-template-columns: 1fr;   /* default: single column */
}

@container card (min-width: 400px) {
  .card {
    grid-template-columns: 120px 1fr;  /* thumbnail + text when wrapper is wide */
  }
}

/* This fires at the container's 400px, not the viewport's —
   works whether the card is in a full-width hero or a narrow sidebar. */`,
    },
    {
      title: "Step 5: Viewport units that don't lie",
      description: (
        <>
          <code>vh</code> jitters on mobile browsers. When the URL bar collapses as you scroll
          down, the viewport height changes — and <code>100vh</code> recalculates, causing a
          visible layout jump. The modern fix is the logical viewport units: <code>dvh</code>{" "}
          (dynamic — always the current visible height), <code>svh</code> (small — the smallest
          possible height, URL bar visible), and <code>lvh</code> (large — the largest possible,
          URL bar hidden). For a full-screen hero you almost always want <code>dvh</code> or{" "}
          <code>svh</code>. For animations you may want <code>lvh</code> so the element
          doesn&apos;t shift when the URL bar hides.
        </>
      ),
      code: `/* ✗ Causes a layout jump on mobile scroll */
.hero { height: 100vh; }

/* ✓ Dynamic: matches the visible viewport height at all times */
.hero { height: 100dvh; }

/* ✓ Small: the height when the URL bar is maximally shown (smallest viewport) */
.hero { min-height: 100svh; }

/* ✓ Large: the height when the URL bar is fully hidden (largest viewport) */
.sticky-panel { height: 100lvh; }

/* Fallback pattern for browsers that don't support dvh yet */
.hero {
  height: 100vh;          /* fallback */
  height: 100dvh;         /* override when supported */
}`,
    },
    {
      title: "Step 6: Test at the seams",
      description: (
        <>
          DevTools device toolbar is not a phone. It disables the viewport meta check, skips
          touch events, and doesn&apos;t emulate CPU throttling. Use it to find rough layout
          breaks, but test on a real device — or at minimum a browser-level emulation — before
          calling it done. The most common reason a layout looks fine in DevTools at 600px but
          breaks on a real phone at 600px: a missing{" "}
          <code>&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width, initial-scale=1&quot;&gt;</code>{" "}
          tag. Without it, mobile browsers render at a virtual 980px and scale everything down,
          so your media queries fire against 980, not the phone&apos;s actual width.
        </>
      ),
      code: `<!-- Required in every HTML document for responsive layouts -->
<meta name="viewport" content="width=device-width, initial-scale=1">

<!-- Without this line:
     - Mobile browser renders at a virtual 980px viewport
     - Your @media (min-width: 600px) always fires (980 > 600)
     - The page looks like a tiny, zoomed-out desktop site
     - DevTools won't catch this because it sets the viewport tag automatically
-->`,
    },
  ];

  const playgroundHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <h1>Fluid &amp; Responsive Demo</h1>

  <p class="intro">
    This heading uses <code>clamp()</code> for fluid type. The cards below use
    <code>auto-fit</code> grid &mdash; no media queries needed. The sidebar layout
    switches at 600px using a container query.
  </p>

  <!-- Card grid: intrinsically responsive with auto-fit + minmax -->
  <section class="card-grid">
    <div class="card">Alpha</div>
    <div class="card">Beta</div>
    <div class="card">Gamma</div>
    <div class="card">Delta</div>
    <div class="card">Epsilon</div>
    <div class="card">Zeta</div>
  </section>

  <!-- Container query demo: sidebar + main -->
  <div class="layout-wrapper">
    <aside class="sidebar">Sidebar</aside>
    <main class="main-content">
      <p>
        This layout switches from single-column to side-by-side when the
        <strong>.layout-wrapper</strong> container crosses 600px &mdash;
        driven by a container query, not the viewport.
      </p>
    </main>
  </div>

  <script src="/script.js"></script>
</body>
</html>`;

  const playgroundCss = `*, *::before, *::after { box-sizing: border-box; }

body {
  margin: 0;
  padding: clamp(1rem, 3vw, 2rem);
  font-family: system-ui, sans-serif;
  background: #f8fafc;
  color: #1e293b;
}

/* ── Fluid heading: scales smoothly between 1.25rem and 2rem ── */
h1 {
  font-size: clamp(1.25rem, 0.75rem + 2.5vw, 2rem);
  margin: 0 0 0.5rem;
  color: #0f172a;
}

.intro {
  font-size: clamp(0.875rem, 0.7rem + 0.9vw, 1.1rem);
  color: #475569;
  max-width: 65ch;
  margin-bottom: 2rem;
}

/* ── Card grid: auto-fit + minmax = intrinsically responsive ── */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  font-weight: 600;
  color: #6366f1;
  box-shadow: 0 1px 3px rgba(0,0,0,.06);
}

/* ── Container query layout ── */

/* 1. Mark the wrapper as a container */
.layout-wrapper {
  container-type: inline-size;
  container-name: layout;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

/* 2. Base (mobile): single column */
.layout-wrapper {
  display: grid;
  grid-template-columns: 1fr;
}

.sidebar {
  background: #6366f1;
  color: white;
  padding: 1.25rem;
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-content {
  padding: 1.25rem;
  font-size: 0.9rem;
  color: #475569;
}

/* 3. Container query: two-column when wrapper >= 600px */
@container layout (min-width: 600px) {
  .layout-wrapper {
    grid-template-columns: 200px 1fr;
  }

  .sidebar {
    min-height: 120px;
  }
}`;

  const playgroundJs = `// Try this: drag the bottom-right corner of the preview to resize it.
// Watch the heading shrink smoothly (clamp), the cards reflow (auto-fit
// grid), and the sidebar layout switch when the wrapper crosses 600px
// (container query — note the wrapper width, not the viewport).

const wrapper = document.querySelector('.layout-wrapper');
const indicator = document.createElement('p');
indicator.style.cssText =
  'font-size:0.75rem;color:#94a3b8;margin:0;padding:0 1.25rem 0.75rem;';
wrapper.appendChild(indicator);

function updateWidth() {
  indicator.textContent = 'Container width: ' + Math.round(wrapper.offsetWidth) + 'px';
}

const ro = new ResizeObserver(updateWidth);
ro.observe(wrapper);
updateWidth();`;

  return (
    <div className="space-y-8">

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 1: Hook                                                       */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Card>
        <CardContent className="pt-6">
          <div className="prose dark:prose-invert max-w-none">
            <p>
              Mobile traffic is half the web. Your design system probably tested at 1440px. The
              page works in your IDE and breaks on someone&apos;s commute. Responsive design
              isn&apos;t a separate skill — it&apos;s how you write CSS in the first place.
            </p>
            <p>
              The gap isn&apos;t that you forgot media queries. It&apos;s that you wrote them in
              the wrong direction: desktop styles first, mobile overrides on top. Every override
              fights the cascade. Every device-named breakpoint eventually lies.{" "}
              <strong>Start mobile, layer complexity upward, pick breakpoints from your
              content</strong> — those three habits change how CSS feels to write and how layouts
              hold up in the wild.
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
              Responsive design has one governing rule: base styles serve the smallest context,
              and every media query or container query <em>adds</em> to that base rather than
              undoing it. When you start from mobile, the cascade works with you — wider viewports
              pick up everything the narrow ones established, then get more. When you start from
              desktop, you spend the rest of your stylesheet undoing things. The question
              &quot;where should I break?&quot; has a concrete answer: wherever your content first
              looks bad, not wherever a device catalog says.
            </p>
            <blockquote className="border-l-4 border-blue-500 pl-4 italic">
              &quot;Start mobile-first, layer complexity at wider breakpoints. Pick breakpoints
              from where your content breaks, not from a phone catalog.&quot;
            </blockquote>
          </div>
        </CardContent>
      </Card>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 3: Step-by-step                                               */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <StepByStepExplanation
        title="Responsive without re-architecting"
        description="Six techniques that make any layout hold up at any width"
        steps={responsiveSteps}
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 4: Playground                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <HTMLPlayground
        html={playgroundHtml}
        css={playgroundCss}
        js={playgroundJs}
        title="Fluid type, auto-fit grid, and a container query — live"
        description="Three responsive techniques in one page. Resize the preview to see them all in action."
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 5: Challenges                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Challenge
        question="Your designer sends mockups at 'mobile (375px)', 'tablet (768px)', 'desktop (1280px)'. Should you use those exact widths as breakpoints?"
        options={[
          { id: "a", text: "Yes — match what the designer specified." },
          {
            id: "b",
            text: "No — pick breakpoints from where the content layout breaks, then check the design holds at the named widths.",
          },
          {
            id: "c",
            text: "Yes, but add 1px to each so they don&apos;t fight the device-specific media queries.",
          },
          { id: "d", text: "Use min-device-width instead of min-width." },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            Designs are reference points, not breakpoints. The actual breakpoint is wherever your
            layout — the cards, the navbar, the heading — starts looking bad. That place is rarely
            exactly 768px. Pick breakpoints from content; check that the design holds at the named
            widths.
          </>
        }
      />

      <Challenge
        question="Your card layout looks fine in DevTools at 600px, but breaks on a real phone at 600px. Most likely cause?"
        options={[
          { id: "a", text: "The phone's rendering engine is buggy." },
          {
            id: "b",
            text: "You're missing <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"> — the phone is rendering at 980px and scaling.",
          },
          { id: "c", text: "Container queries don't work on phones." },
          { id: "d", text: "vh is broken on mobile." },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            Without the viewport meta tag, mobile browsers default to a 980px virtual viewport for
            compatibility with old desktop sites, then scale the rendered page down. Your media
            queries fire against 980px, not the phone&apos;s actual width. The fix is one line in{" "}
            <code>&lt;head&gt;</code>.
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
              "Container queries need container-type: inline-size on the parent — without it, @container queries don't fire",
            body: (
              <>
                The <code>@container</code> rule looks up the DOM tree for the nearest ancestor
                with a <code>container-type</code> set. If no ancestor has one, nothing happens —
                no error, no match, just silence. Always add{" "}
                <code>container-type: inline-size</code> (or <code>size</code> if you need height
                queries too) to the intended parent before writing <code>@container</code> rules
                inside the child.
              </>
            ),
          },
          {
            title:
              "min-width queries layer additively; max-width queries fight the cascade — mobile-first stacks cleaner",
            body: (
              <>
                With <code>min-width</code> queries, every rule at a narrower breakpoint stays
                active at wider ones unless explicitly overridden — the cascade accumulates. With{" "}
                <code>max-width</code> queries you constantly re-declare properties to strip things
                away: more rules, more cognitive overhead, more specificity fights. The stylesheet
                reads in the same direction the cascade flows when you go mobile-first.
              </>
            ),
          },
          {
            title:
              "Viewport units (vh) jiggle on mobile when the URL bar collapses — use dvh/svh/lvh instead",
            body: (
              <>
                When a user scrolls down on mobile, the URL bar collapses and the visible viewport
                height increases. If an element is sized with <code>100vh</code>, it recalculates
                and causes a visible jump. <code>dvh</code> matches the current visible height
                dynamically; <code>svh</code> uses the smallest possible height (URL bar
                maximally visible); <code>lvh</code> uses the largest (URL bar fully hidden). For
                full-screen layouts, <code>100dvh</code> or <code>100svh</code> is almost always
                what you want.
              </>
            ),
          },
          {
            title:
              "Breakpoints named after devices (e.g. 768px = 'iPad') age badly — devices change, layouts stay; pick breakpoints from where the layout actually breaks",
            body: (
              <>
                The iPad mini, iPad, iPad Air, and iPad Pro all have different widths. The next
                generation will differ again. A breakpoint at 768px that &quot;means iPad&quot;
                will lie within two product cycles. A breakpoint at 740px because your nav overflows
                below 740px will stay accurate as long as your nav exists. Name your breakpoints
                after what they fix, not after the device you were looking at when you wrote them.
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
            <em>Mobile-first</em> — authoring base styles for narrow viewports, then layering
            wider-viewport overrides via <code>min-width</code> queries — means the cascade
            accumulates rather than fights itself. Fewer overrides, leaner default payloads.
          </>,
          <>
            Pick breakpoints from where your layout actually breaks, not from a device catalog.
            Drag the DevTools handle; add a breakpoint at the pixel count where things first look
            bad. Those breakpoints stay accurate as devices change.
          </>,
          <>
            <code>clamp(min, preferred, max)</code> gives continuously fluid values between bounds
            with no discrete jumps. Mix a <code>vw</code> term with a <code>rem</code> offset in
            the preferred expression to prevent collapsing to zero on tiny screens.
          </>,
          <>
            A <em>container query</em> (<code>@container</code>) styles based on the parent
            container&apos;s size, not the viewport — the right tool when the same component
            appears in both wide and narrow slots. Requires{" "}
            <code>container-type: inline-size</code> on the parent.
          </>,
          <>
            Use <code>dvh</code> / <code>svh</code> / <code>lvh</code> instead of <code>vh</code>{" "}
            for full-height layouts on mobile. <code>vh</code> recalculates when the URL bar
            collapses and causes visible jitter; the logical viewport units are stable.
          </>,
          <>
            Without <code>&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width, initial-scale=1&quot;&gt;</code>{" "}
            in <code>&lt;head&gt;</code>, mobile browsers render at a virtual 980px and scale the
            page down. Media queries fire against 980, not the device width. One line fixes it.
          </>,
        ]}
        mentalModel="Start mobile-first, layer complexity at wider breakpoints. Pick breakpoints from where your content breaks, not from a phone catalog."
      />
    </div>
  );
}
