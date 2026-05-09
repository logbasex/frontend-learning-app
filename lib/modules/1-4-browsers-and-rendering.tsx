"use client";

import { Card, CardContent } from "@/components/ui/card";
import { HTMLPlayground } from "@/components/CodePlayground";
import { StepByStepExplanation, Step } from "@/components/StepByStepExplanation";
import { LayeredFlow } from "@/components/LayeredFlow";
import { Challenge } from "@/components/Challenge";
import { GotchaList } from "@/components/GotchaList";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { RoadmapLink } from "@/components/RoadmapLink";

export function Module_1_4_Content() {
  // Data blocks hoisted out of JSX for readability — listed in render order.
  const pipelineSteps: Step[] = [
    {
      title: "Step 1: Bytes arrive and parsing begins",
      description: (
        <>
          The browser does not wait for the full HTML document before it starts work. As bytes
          stream in over the network, the <em>HTML parser</em> reads them character by character and
          begins building a tree. It recognises tags, attributes, and text nodes on the fly. When it
          encounters a <code>&lt;link rel=&quot;stylesheet&quot;&gt;</code> or a blocking{" "}
          <code>&lt;script&gt;</code> it may pause to fetch that resource before continuing. The
          earlier a resource is discovered in the stream, the sooner the browser can kick off its
          own network request.
        </>
      ),
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Hello</title>
  <link rel="stylesheet" href="styles.css"> <!-- fetched immediately -->
</head>
<body>
  <h1>Hello</h1>       <!-- parser builds a node here...    -->
  <p>World</p>         <!-- ...and another here             -->
  <script src="app.js"></script> <!-- blocking: parser waits -->
</body>
</html>`,
    },
    {
      title: "Step 2: DOM tree",
      description: (
        <>
          Parsed HTML becomes the <em>DOM (Document Object Model)</em> — the browser&apos;s
          in-memory tree representation of an HTML document. Every element is a node; every piece
          of text is a text node. The tree mirrors nesting: children sit inside their parent. The
          DOM is mutable — JavaScript can read and rewrite it at any time. Scripts that run before
          parsing finishes see a partial tree; scripts with <code>defer</code> see the completed
          tree because they execute after parsing is done.
        </>
      ),
      code: `<!-- Source HTML -->
<body>
  <h1>Hello</h1>
  <p>World</p>
</body>

/* Resulting DOM tree
 *
 * Document
 * └── html
 *     ├── head
 *     └── body
 *         ├── h1
 *         │   └── "Hello"   (text node)
 *         └── p
 *             └── "World"   (text node)
 */`,
    },
    {
      title: "Step 3: CSSOM tree",
      description: (
        <>
          While HTML is being parsed, CSS is being parsed in parallel into the{" "}
          <em>CSSOM</em> — the browser&apos;s in-memory tree of CSS rules, parallel to the DOM.
          Every selector becomes a node; its declarations become the node&apos;s properties. Here
          is the critical constraint: <strong>CSS blocks rendering</strong>. The browser will not
          paint a single pixel until the CSSOM is fully built, because every visible node&apos;s
          appearance depends on the complete cascade. An unloaded stylesheet is not a cosmetic
          problem — it is a hard blocker on everything downstream.
        </>
      ),
      code: `/* Source CSS */
body   { font: 16px/1.5 system-ui; color: #1e293b; }
h1     { font-size: 2rem; margin-bottom: 0.5rem; }
p      { color: #475569; }

/* Resulting CSSOM tree (simplified)
 *
 * body  → { font-size: 16px, line-height: 1.5, color: #1e293b }
 * ├── h1 → { font-size: 32px, margin-bottom: 8px, (inherits color) }
 * └── p  → { color: #475569 }
 */`,
    },
    {
      title: "Step 4: Render tree = DOM intersect CSSOM",
      description: (
        <>
          The browser combines the DOM and the CSSOM into the <em>render tree</em> — the combined
          DOM + CSSOM tree containing only nodes that will be painted (no <code>display: none</code>
          ). Text nodes become part of their parent&apos;s render object. Nodes with{" "}
          <code>display: none</code> are simply absent from the render tree — they have no geometry
          and are never painted. Nodes with <code>visibility: hidden</code> <em>are</em> in the
          render tree; they just paint as transparent, so they still cost layout.
        </>
      ),
      code: `/* display: none — absent from render tree */
.tooltip { display: none; }

/* visibility: hidden — present in render tree, but transparent */
.placeholder { visibility: hidden; }

/*
 * Render tree (only visible nodes survive):
 *
 * html
 * └── body
 *     ├── h1   [computed: font-size:32px, color:#1e293b, …]
 *     └── p    [computed: color:#475569, …]
 *
 * Note: a node with display:none simply does not appear here.
 */`,
    },
    {
      title: "Step 5: Layout (reflow)",
      description: (
        <>
          With a render tree in hand, the browser runs <em>layout (reflow)</em> — computing
          geometry (positions and sizes) for every node in the render tree. It calculates the x, y,
          width, and height of every box. Layout is expensive because it is recursive: a width
          change on a parent can force every child to recompute. JavaScript also triggers
          synchronous reflow if you read a layout property — like{" "}
          <code>el.offsetHeight</code> — immediately after writing a style. The browser must flush
          its pending style changes to give you an accurate answer, which stalls the main thread.
        </>
      ),
      code: `// SLOW: interleaving writes and reads forces synchronous reflow
el.style.width = "400px";
const h = el.offsetHeight; // browser must reflow right now to answer

// FAST: batch all writes first, then read once
el.style.width  = "400px";
el.style.height = "200px";
// ... all writes done
const h = el.offsetHeight; // one reflow, then read`,
    },
    {
      title: "Step 6: Paint and composite",
      description: (
        <>
          After layout the browser runs <em>paint</em> — turning render-tree nodes into pixels on
          layers. It draws background colours, borders, shadows, and text onto separate surfaces.
          Then comes <em>composite</em> — combining those painted layers into the final image sent
          to the screen. Here is the performance insight: <code>transform</code> and{" "}
          <code>opacity</code> changes are handled entirely by the compositor — they skip layout{" "}
          <em>and</em> paint entirely. That is why animating <code>transform: translateX()</code>{" "}
          instead of <code>left</code> is the standard advice for smooth 60 fps animations.
        </>
      ),
      code: `/* Paint + Composite — whole pipeline triggered */
.box { background-color: red; }          /* paint */
.box { width: 200px; }                   /* layout + paint + composite */

/* Composite only — layout and paint skipped */
.box { transform: translateX(100px); }   /* composite only */
.box { opacity: 0.5; }                   /* composite only */

/* Use will-change to promote element to its own layer */
.animated { will-change: transform; }    /* hints GPU promotion */`,
    },
  ];

  const playgroundHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Rendering pipeline demo</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <h2>Rendering pipeline cost demo</h2>
  <p class="hint">Open DevTools &rarr; Performance, click Record, then click each button.</p>
  <div class="btn-row">
    <button id="btn-boxes">Add 100 boxes</button>
    <button id="btn-layout">Toggle layout</button>
    <button id="btn-anim">Animate transform</button>
    <button id="btn-clear">Clear</button>
  </div>
  <pre id="log" class="log">Click a button to see which pipeline stages fire.</pre>
  <div id="stage" class="stage"></div>
  <script src="/script.js"></script>
</body>
</html>`;

  const playgroundCss = `body {
  font-family: system-ui, sans-serif;
  max-width: 700px;
  margin: 24px auto;
  padding: 0 16px;
  color: #1e293b;
}
h2 { font-size: 1.1rem; margin-bottom: 4px; }
.hint { font-size: 0.8rem; color: #64748b; margin-bottom: 12px; }
.btn-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }
button {
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  background: #3b82f6;
  color: white;
}
button:hover { background: #2563eb; }
#btn-layout { background: #8b5cf6; }
#btn-layout:hover { background: #7c3aed; }
#btn-anim { background: #10b981; }
#btn-anim:hover { background: #059669; }
#btn-clear { background: #64748b; }
#btn-clear:hover { background: #475569; }
.log {
  background: #0f172a;
  color: #e2e8f0;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 0.78rem;
  min-height: 56px;
  white-space: pre-wrap;
  margin-bottom: 12px;
}
.stage {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  min-height: 40px;
}
.box {
  width: 40px;
  height: 40px;
  background: #3b82f6;
  border-radius: 4px;
  transition: none;
}
.box.wide { width: 80px; }`;

  const playgroundJs = `// Try this: open DevTools → Performance, click Record, then click each button.
// The "Add 100 boxes" run shows Layout + Paint + Composite frames.
// "Toggle layout" shows Layout + Paint + Composite (because width changed).
// "Animate transform" shows only Composite — the cheapest of the three.

const log   = document.getElementById('log');
const stage = document.getElementById('stage');

function setLog(msg) { log.textContent = msg; }

document.getElementById('btn-boxes').addEventListener('click', () => {
  setLog('Added 100 boxes → triggers Layout + Paint + Composite\\n(Each new box changes the flow of the document.)');
  for (let i = 0; i < 100; i++) {
    const b = document.createElement('div');
    b.className = 'box';
    stage.appendChild(b);
  }
});

document.getElementById('btn-layout').addEventListener('click', () => {
  const boxes = stage.querySelectorAll('.box');
  if (boxes.length === 0) {
    setLog('Add some boxes first, then try Toggle layout.');
    return;
  }
  const isWide = boxes[0].classList.contains('wide');
  boxes.forEach(b => b.classList.toggle('wide'));
  setLog(
    (isWide ? 'Toggled width: 80px → 40px' : 'Toggled width: 40px → 80px') +
    '\\n→ triggers Layout + Paint + Composite\\n(Width change cascades through the document flow.)'
  );
});

document.getElementById('btn-anim').addEventListener('click', () => {
  const boxes = stage.querySelectorAll('.box');
  if (boxes.length === 0) {
    setLog('Add some boxes first, then try Animate transform.');
    return;
  }
  setLog('Animating transform: translateX(60px) → 0\\n→ triggers Composite only — Layout and Paint are skipped.\\n(The compositor handles transform/opacity without touching the layout tree.)');
  boxes.forEach((b, i) => {
    b.style.transition = 'transform 0.6s ease';
    b.style.transform  = 'translateX(60px)';
    setTimeout(() => { b.style.transform = 'translateX(0)'; }, 400 + i * 4);
  });
});

document.getElementById('btn-clear').addEventListener('click', () => {
  while (stage.firstChild) { stage.removeChild(stage.firstChild); }
  setLog('Stage cleared.');
});`;

  return (
    <div className="space-y-8">

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 1: Hook                                                       */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Card>
        <CardContent className="pt-6">
          <div className="prose dark:prose-invert max-w-none">
            <p>
              You hit Refresh. The page flashes white. Then a header appears. Then the layout jumps
              as a hero image loads. Then the buttons start working. Why does the same site, on the
              same machine, paint in chunks instead of all at once? Because the browser is running a
              six-stage pipeline, and you can see every stage if you know where to look.
            </p>
            <p>
              Understanding that pipeline turns vague performance complaints — &quot;the page feels
              slow&quot;, &quot;the layout keeps jumping&quot;, &quot;the animation is janky&quot; —
              into specific, fixable diagnoses. By the end of this module you will be able to look
              at a CSS rule or a JavaScript snippet and predict exactly which pipeline stages it
              triggers — and whether you are paying layout&apos;s full cost or getting away with
              composite-only changes for nearly free.
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
              Think of a browser as a kitchen following a recipe. The recipe has strict steps: you
              cannot frost a cake before it is baked, and you cannot bake it before you have the
              ingredients. HTML bytes must become a DOM tree before a render tree can exist; the
              render tree must exist before geometry can be computed; geometry must be computed
              before pixels can be drawn. Skip a step — or block the one before it — and everything
              downstream stalls. That sequential dependency is the single most useful idea in this
              module. Once you see the pipeline as a chain of hard prerequisites, every browser
              performance rule becomes obvious rather than arbitrary.
            </p>
            <blockquote className="border-l-4 border-blue-500 pl-4 italic">
              &quot;A page is a recipe. The browser bakes it in stages: parse &rarr; DOM &rarr;
              CSSOM &rarr; render tree &rarr; layout &rarr; paint &rarr; composite. Skip a stage
              and the rest fall apart.&quot;
            </blockquote>
          </div>
        </CardContent>
      </Card>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 3: Step-by-step                                               */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <StepByStepExplanation
        title="From bytes to pixels"
        description="The six stages between HTML/CSS bytes and what you see on screen"
        steps={pipelineSteps}
      />

      {/* Optional: LayeredFlow (rendering pipeline) */}
      <LayeredFlow
        title="The rendering pipeline"
        description="Six stages between HTML/CSS bytes and pixels on screen"
        stages={[
          { label: "Bytes", detail: "from network", color: "slate" },
          { label: "DOM", detail: "parsed HTML tree", color: "blue" },
          { label: "CSSOM", detail: "parsed CSS tree", color: "violet" },
          { label: "Render tree", detail: "DOM intersect CSSOM", color: "emerald" },
          { label: "Layout", detail: "geometry", color: "amber" },
          { label: "Paint", detail: "pixels per layer", color: "rose" },
          { label: "Composite", detail: "final image", color: "blue" },
        ]}
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 4: Live playground                                            */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <HTMLPlayground
        html={playgroundHtml}
        css={playgroundCss}
        js={playgroundJs}
        title="Rendering pipeline cost demo"
        description="Add boxes, toggle their width, and animate with transform. The log tells you which pipeline stages each operation triggers."
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 5: Challenges                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Challenge
        question="Which CSS change is cheapest for the browser to apply?"
        options={[
          { id: "a", text: "width: 200px → width: 400px" },
          { id: "b", text: "background-color: red → background-color: blue" },
          { id: "c", text: "transform: translateX(100px) → transform: translateX(200px)" },
          { id: "d", text: "display: none → display: block" },
        ]}
        correctAnswerId="c"
        explanation={
          <>
            <code>transform</code> and <code>opacity</code> skip layout <em>and</em> paint — they
            are handled entirely by the compositor, which runs on the GPU without touching the
            layout tree. Changing <code>width</code> triggers full reflow + repaint + composite.
            Changing <code>background-color</code> is paint + composite — cheaper than reflow, but
            not free. Toggling <code>display: none</code> to <code>display: block</code> triggers
            reflow because the element re-enters the layout flow and its neighbours must all be
            repositioned.
          </>
        }
      />

      <Challenge
        question='A page jumps as it loads — text appears first, then a hero image pushes everything down. Which fix prevents the jump?'
        options={[
          { id: "a", text: 'Set loading="lazy" on the image.' },
          {
            id: "b",
            text: "Add explicit width and height attributes (or an aspect-ratio CSS rule) so the browser reserves the space before the image loads.",
          },
          { id: "c", text: "Wrap the image in a <div> with overflow: hidden." },
          { id: "d", text: "Move the image to the bottom of the page." },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            Cumulative layout shift happens because the browser does not know the image&apos;s
            dimensions during the first layout pass and assigns it zero height — then re-lays out
            everything once the image arrives and its real dimensions are known. Explicit{" "}
            <code>width</code>/<code>height</code> attributes (or an equivalent{" "}
            <code>aspect-ratio</code> CSS rule) let the browser reserve the correct space upfront,
            so no shift occurs. <code>loading=&quot;lazy&quot;</code> delays the load but does not
            fix the layout — the space is still unset.
          </>
        }
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 6: GotchaList                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <GotchaList
        items={[
          {
            title: "Reflow cascades — one element’s width change can re-layout the entire subtree above and below it",
            body: (
              <>
                Layout is a top-down recursive walk. Changing the width of an inner element can
                invalidate its parent&apos;s size, which can cascade up to the root. That is why a
                naive animation on a deeply nested element can stall the main thread even though only
                one element visually moved.
              </>
            ),
          },
          {
            title: "`display: none` removes from the render tree but `visibility: hidden` keeps it (still costs layout, just invisible)",
            body: (
              <>
                <code>display: none</code> fully removes the node from the render tree — it has no
                geometry and neighbours close the gap. <code>visibility: hidden</code> keeps the node
                in the render tree, preserves its geometry (neighbours do not move), and simply skips
                painting it. Use <code>display: none</code> when you want the space collapsed;{" "}
                <code>visibility: hidden</code> when you want the space preserved.
              </>
            ),
          },
          {
            title: "Reading layout during JS forces synchronous reflow — `el.offsetHeight` after a style write triggers an immediate recompute",
            body: (
              <>
                The browser batches pending style changes and applies them together at the end of a
                script for efficiency. But when you read a layout property — <code>offsetWidth</code>,{" "}
                <code>getBoundingClientRect()</code>, <code>scrollTop</code>, etc. — it must flush
                that batch immediately to return an accurate value. In a loop this becomes{" "}
                &quot;layout thrashing&quot; and can drop you from 60 fps to single digits.
              </>
            ),
          },
          {
            title: "Modern browsers paint on the GPU; `transform` and `opacity` are the two free-ish properties — animating anything else fights the compositor",
            body: (
              <>
                When an element has its own compositing layer (promoted via{" "}
                <code>will-change: transform</code> or implicitly by the browser), changes to{" "}
                <code>transform</code> and <code>opacity</code> are handled entirely on the GPU
                thread without involving the main thread at all. Every other animatable property —{" "}
                <code>width</code>, <code>height</code>, <code>top</code>, <code>left</code>,{" "}
                <code>background-color</code>, etc. — must go through layout or paint on the main
                thread and then be re-composited.
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
            The <em>rendering pipeline</em> is parse &rarr; DOM &rarr; CSSOM &rarr; render tree
            &rarr; layout &rarr; paint &rarr; composite. Each stage depends on the one before it;
            blocking any stage delays everything downstream.
          </>,
          <>
            JS blocks parsing because a <code>&lt;script&gt;</code> tag halts the HTML parser until
            the script is fetched and run — it could inject new markup mid-stream. CSS blocks
            rendering because computed styles affect layout, and the browser will not paint until
            the full CSSOM is ready.
          </>,
          <>
            <em>Reflow (layout)</em> is the expensive one — it is recursive and cascades through
            the tree. <em>Repaint (paint)</em> is cheaper. Composite-only changes (
            <code>transform</code>, <code>opacity</code>) are nearly free because they run on the
            GPU without touching the layout tree.
          </>,
          <>
            Reading layout properties from JS forces <strong>synchronous reflow</strong>. Batch all
            style writes first, then do your reads — never interleave them in a loop.
          </>,
          <>
            Cumulative layout shift happens when the browser does not know an element&apos;s
            dimensions during the first layout pass. Fix it by giving images explicit{" "}
            <code>width</code>/<code>height</code> or an <code>aspect-ratio</code> so the space is
            reserved before the content loads.
          </>,
        ]}
        mentalModel="A page is a recipe. The browser bakes it in stages: parse → DOM → CSSOM → render tree → layout → paint → composite. Skip a stage and the rest fall apart."
      />
    </div>
  );
}
