"use client";

import { ScaffoldModule } from "./_template";
import { BrowserRenderingPipeline } from "@/components/InteractiveDiagram";

export function Module_1_4_Content() {
  return (
    <ScaffoldModule
      emoji="🎨"
      problemTitle="How text becomes pixels"
      problem={
        <>
          <p>
            When a browser receives an HTML document it does not draw pixels
            directly. It first parses the HTML into a{" "}
            <strong>DOM tree</strong> (Document Object Model) &mdash; a tree of
            nodes representing every element and text fragment. In parallel it
            parses the CSS into a <strong>CSSOM tree</strong> (CSS Object
            Model). Only once both trees are ready can the browser combine them
            into a <strong>render tree</strong> that contains only the visible
            nodes, each annotated with its computed style. JavaScript can block
            this process: a <code>&lt;script&gt;</code> tag in{" "}
            <code>&lt;head&gt;</code> without <code>defer</code> or{" "}
            <code>async</code> halts HTML parsing until the script is fetched,
            parsed, and executed &mdash; which is why a slow third-party script
            can make an otherwise fast page feel broken.
          </p>
          <p>
            After the render tree is built, the browser runs{" "}
            <strong>layout</strong> (also called reflow): it walks the tree and
            calculates the exact position and dimensions of every box on screen.
            Then comes <strong>paint</strong>: the browser fills in the pixels
            &mdash; colours, borders, shadows, text &mdash; layer by layer.
            Finally, <strong>composite</strong> stitches the layers together and
            sends the result to the GPU. Layout is the most expensive step;
            anything that changes the geometry of elements (width, height,
            margin, font-size) triggers a full reflow. Changing only a visual
            property like <code>color</code> or <code>opacity</code> skips
            layout and only triggers repaint, which is much cheaper.
          </p>
          <p>
            Understanding this pipeline explains many performance rules you will
            encounter: why <code>transform</code> and <code>opacity</code>{" "}
            animations are recommended over animating <code>top</code> and{" "}
            <code>left</code> (they bypass layout), why reading a DOM property
            like <code>offsetHeight</code> immediately after writing a style
            forces a synchronous reflow (called{" "}
            <strong>forced layout thrash</strong>), and why moving heavy
            animations to the GPU via <code>will-change: transform</code> can
            eliminate jank on lower-powered devices.
          </p>
        </>
      }
      body={<BrowserRenderingPipeline />}
      challenge={{
        question:
          "Why does a <script> tag in <head> (without defer or async) slow down first paint?",
        options: [
          {
            id: "a",
            text: "It increases the CSS file size, blocking the CSSOM build.",
          },
          {
            id: "b",
            text: "It blocks HTML parsing until the script is fetched and executed.",
          },
          {
            id: "c",
            text: "It forces the browser to rebuild the render tree from scratch.",
          },
          {
            id: "d",
            text: "It delays the DNS lookup for external resources.",
          },
        ],
        correctAnswerId: "b",
        explanation: (
          <>
            A classic <code>&lt;script&gt;</code> in <code>&lt;head&gt;</code>{" "}
            is a <strong>parser-blocking</strong> resource: the HTML parser
            stops at that tag and waits until the script file has been
            downloaded, parsed, and fully executed before it continues building
            the DOM. Since the render tree cannot be constructed until the DOM
            exists, this delays everything downstream &mdash; including first
            paint. Adding <code>defer</code> lets the script download in
            parallel and execute after parsing completes; <code>async</code>{" "}
            executes it as soon as it arrives, in whatever order that happens to
            be.
          </>
        ),
      }}
      takeaways={[
        <>
          The rendering pipeline is:{" "}
          <strong>
            parse HTML &rarr; DOM, parse CSS &rarr; CSSOM, combine &rarr; render
            tree, layout, paint, composite
          </strong>
          . Each stage feeds the next.
        </>,
        <>
          JavaScript is <strong>parser-blocking</strong> by default; use{" "}
          <code>defer</code> or <code>async</code> on every{" "}
          <code>&lt;script&gt;</code> that does not need to run before the DOM
          is ready.
        </>,
        <>
          <strong>Reflow</strong> (layout change) is expensive;{" "}
          <strong>repaint</strong> (visual-only change) is cheap. Animate with{" "}
          <code>transform</code> and <code>opacity</code> to stay on the cheap
          path.
        </>,
      ]}
      mentalModel="Render = parse + style + layout + paint + composite. Reflow is expensive; repaint is cheap."
      roadmapUrl="https://roadmap.sh/frontend"
    />
  );
}
