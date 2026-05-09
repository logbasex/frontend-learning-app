"use client";
import { ScaffoldModule } from "./_template";
import { HTMLPlayground } from "@/components/CodePlayground";

export function Module_3_3_Content() {
  return (
    <ScaffoldModule
      emoji="📱"
      problemTitle="Mobile-first means additive media queries"
      problem={
        <>
          <p>
            The original responsive design approach started with a desktop stylesheet and
            progressively <em>overrode</em> rules for smaller screens using{" "}
            <code>max-width</code> queries. This works but produces a growing pile of
            overrides. <strong>Mobile-first</strong> inverts the model: write the smallest layout
            as your default, then <em>add</em> rules with <code>min-width</code> queries as the
            viewport grows. Fewer overrides, smaller default payloads, and a natural cascade
            direction.
          </p>
          <p>
            Breakpoints should follow your <strong>content</strong>, not arbitrary device
            widths. A card layout that looks broken at 580px needs a breakpoint at 580px, not at
            768px just because that is an iPad width. Open DevTools, drag the viewport handle, and
            add a breakpoint where the layout actually breaks.
          </p>
          <p>
            <strong><code>clamp(min, ideal, max)</code></strong> produces fluid values without
            media queries. For font sizes, <code>clamp(1rem, 2vw + 0.5rem, 1.5rem)</code> means:
            never smaller than <code>1rem</code>, never larger than <code>1.5rem</code>, and
            proportionally scales with the viewport in between. The ideal expression is evaluated
            in viewport-relative terms — mixing <code>vw</code> with a <code>rem</code> offset
            prevents the value from shrinking to zero on tiny screens.
          </p>
          <p>
            <strong>Container queries</strong> (<code>@container</code>) solve a problem
            viewport queries cannot: a component&apos;s layout should respond to its{" "}
            <em>own container&apos;s</em> width, not the viewport. A card that lives in a narrow
            sidebar should stack vertically regardless of whether the viewport is wide. Mark the
            parent with <code>container-type: inline-size</code> and write{" "}
            <code>@container (min-width: 400px) {"{...}"}</code> inside the component. Browser
            support is now excellent (Chrome 105+, Firefox 110+, Safari 16+).
          </p>
        </>
      }
      body={
        <HTMLPlayground
          title="Fluid type + responsive 1→2 column card"
          description="Resize the preview pane: font-size uses clamp() and the layout swaps at 600px."
          html={`<!DOCTYPE html>
<html>
<head><link rel="stylesheet" href="/styles.css" /></head>
<body>
  <div class="card">
    <div class="card__image"></div>
    <div class="card__body">
      <h2>Fluid & Responsive Card</h2>
      <p>
        Drag the preview pane narrower and wider. The font size scales
        continuously with <code>clamp()</code>, and the layout snaps from
        one column to two at 600 px.
      </p>
    </div>
  </div>
</body>
</html>`}
          css={`/* ── Base (mobile-first): single column ── */
*, *::before, *::after { box-sizing: border-box; }

body {
  margin: 0;
  padding: 1rem;
  font-family: sans-serif;
  background: #f8fafc;
}

.card {
  display: grid;
  grid-template-columns: 1fr;   /* 1 column by default (mobile) */
  gap: 0;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,.1);
}

.card__image {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  min-height: 180px;
}

.card__body {
  padding: 1.5rem;
}

/* ── Fluid font-size: never <1rem, never >1.5rem ── */
.card__body h2 {
  margin: 0 0 .75rem;
  /* clamp(minimum, fluid-ideal, maximum) */
  font-size: clamp(1rem, 2vw + 0.5rem, 1.5rem);
  color: #1e293b;
}

.card__body p {
  font-size: clamp(0.875rem, 1.5vw + 0.4rem, 1.1rem);
  color: #475569;
  line-height: 1.6;
  margin: 0;
}

/* ── Enhancement: 2-column layout from 600 px up ── */
@media (min-width: 600px) {
  .card {
    grid-template-columns: 240px 1fr;  /* image | text side by side */
  }

  .card__image {
    min-height: unset;  /* let the image fill the row height */
  }
}`}
        />
      }
      challenge={{
        question:
          "What does `font-size: clamp(1rem, 2vw + 0.5rem, 1.5rem)` guarantee?",
        options: [
          { id: "a", text: "The font size is always exactly 2vw" },
          { id: "b", text: "The font size is never smaller than 1rem and never larger than 1.5rem" },
          { id: "c", text: "The font size only changes at defined breakpoints" },
          { id: "d", text: "The font size is relative to the parent container, not the viewport" },
        ],
        correctAnswerId: "b",
        explanation: (
          <>
            <code>clamp(min, ideal, max)</code> clamps the computed value between the first and
            third arguments. The ideal expression <code>2vw + 0.5rem</code> produces a
            viewport-relative value that grows as the screen widens, but the result is always
            floored at <code>1rem</code> and capped at <code>1.5rem</code> — giving fluid scaling
            without extremes. It does not snap only at breakpoints; it is continuously smooth.
          </>
        ),
      }}
      takeaways={[
        <>Mobile-first means writing the smallest layout as default CSS and adding enhancements with <code>min-width</code> media queries — fewer overrides, leaner default payload.</>,
        <><code>clamp(min, ideal, max)</code> gives continuously fluid values (font size, spacing, width) without any breakpoints — combine <code>vw</code> with a <code>rem</code> offset to prevent shrinking to zero.</>,
        <>Container queries (<code>@container</code>) let a component respond to its own container width, not the viewport — the right tool when the same component appears in both wide and narrow slots.</>,
      ]}
      mentalModel="Mobile-first is gravity: start small and let layout grow upward — overriding downward fights the cascade."
      roadmapUrl="https://roadmap.sh/frontend"
    />
  );
}
