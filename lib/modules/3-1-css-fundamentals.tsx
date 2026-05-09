"use client";
import { ScaffoldModule } from "./_template";
import { HTMLPlayground } from "@/components/CodePlayground";

export function Module_3_1_Content() {
  return (
    <ScaffoldModule
      emoji="🎨"
      problemTitle="The cascade is a sort, not a guess"
      problem={
        <>
          <p>
            When two CSS rules target the same element, the browser does not pick one randomly.
            It runs a deterministic <strong>cascade algorithm</strong>: origin (browser default vs
            author vs user), then <strong>specificity</strong>, then <strong>source order</strong>.
            Understanding that order turns &quot;why isn&apos;t my style applying?&quot; from a
            mystery into a five-second diagnosis.
          </p>
          <p>
            <strong>Specificity</strong> is a score written as four buckets{" "}
            <code>(inline, id, class/attr/pseudo-class, element)</code>. An inline{" "}
            <code>style=&quot;&quot;</code> attribute beats everything; an <code>#id</code> beats
            any number of classes; a <code>.class</code> beats any number of element selectors.
            Winning specificity is not about quantity — ten element selectors never beat one class.
          </p>
          <p>
            The <strong>box model</strong> describes how every element occupies space: a content
            area, surrounded by <code>padding</code>, then a <code>border</code>, then{" "}
            <code>margin</code>. The default <code>box-sizing: content-box</code> means width and
            height measure only the content — padding and border are <em>added</em> on top, which
            surprises nearly everyone. Setting <code>box-sizing: border-box</code> globally makes
            width mean &quot;the total box you see&quot;, which is almost always what you want.
          </p>
          <p>
            <strong>Inheritance</strong> follows a simple rule: properties that affect text
            (<code>color</code>, <code>font-size</code>, <code>font-family</code>,{" "}
            <code>line-height</code>) inherit by default; properties that affect box geometry
            (<code>background</code>, <code>border</code>, <code>width</code>,{" "}
            <code>margin</code>) do not. You can always override with the keywords{" "}
            <code>inherit</code>, <code>initial</code>, or <code>unset</code>.
          </p>
        </>
      }
      body={
        <HTMLPlayground
          title="Specificity in action"
          description="Three rules target the same paragraph — watch which one wins and why."
          html={`<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="/styles.css" />
</head>
<body>
  <p id="intro" class="highlight">
    Which rule wins the cascade?
  </p>
</body>
</html>`}
          css={`/* ── Reset to border-box so width means what you expect ── */
*, *::before, *::after { box-sizing: border-box; }

body { font-family: sans-serif; padding: 2rem; }

/* Rule 1 — element selector: specificity (0,0,0,1) */
p {
  color: gray;          /* loses to both rules below */
  font-size: 1rem;
}

/* Rule 2 — class selector: specificity (0,0,1,0) — beats rule 1 */
.highlight {
  color: royalblue;     /* loses to the id rule below */
  font-size: 1.1rem;
  background: #f0f4ff;
  padding: 0.75rem 1rem;
  border-radius: 6px;
}

/* Rule 3 — id selector: specificity (0,1,0,0) — wins over class and element */
#intro {
  color: #c0392b;       /* THIS wins — id beats class beats element */
  font-weight: 700;
  border-left: 4px solid #c0392b;
}`}
        />
      }
      challenge={{
        question:
          "Which CSS selector has the highest specificity?",
        options: [
          { id: "a", text: "p.card.active" },
          { id: "b", text: "#sidebar" },
          { id: "c", text: "div > span + em" },
          { id: "d", text: "[data-active='true']" },
        ],
        correctAnswerId: "b",
        explanation: (
          <>
            <code>#sidebar</code> scores <code>(0,1,0,0)</code> — one ID column. ID selectors
            always outrank any number of classes or elements.{" "}
            <code>p.card.active</code> scores <code>(0,0,2,1)</code> — two classes and one element
            — which loses to a single ID. Element and attribute selectors contribute to the lowest
            non-inline columns.
          </>
        ),
      }}
      takeaways={[
        <>Specificity is a four-column score (inline, id, class/attr, element); a single ID outweighs any number of classes, and adding more element selectors never beats a class.</>,
        <>Set <code>box-sizing: border-box</code> globally so <code>width</code> and <code>height</code> include padding and border — this matches every designer&apos;s mental model.</>,
        <>Text properties (<code>color</code>, <code>font-size</code>) inherit automatically; box properties (<code>background</code>, <code>border</code>) do not — use <code>inherit</code> when you want forced inheritance.</>,
      ]}
      mentalModel="The cascade is a sorted priority list, not a coin flip — specificity is the tiebreaker, source order is the last resort."
      roadmapUrl="https://roadmap.sh/frontend"
    />
  );
}
