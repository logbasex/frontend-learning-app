"use client";

import { Card, CardContent } from "@/components/ui/card";
import { HTMLPlayground } from "@/components/CodePlayground";
import { StepByStepExplanation, Step } from "@/components/StepByStepExplanation";
import { LiveCascadeDemo } from "@/components/LiveCascadeDemo";
import { Challenge } from "@/components/Challenge";
import { GotchaList } from "@/components/GotchaList";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { RoadmapLink } from "@/components/RoadmapLink";

export function Module_3_1_Content() {
  // Data blocks hoisted out of JSX for readability — listed in render order.
  const cascadeSteps: Step[] = [
    {
      title: "Step 1: Selectors match elements",
      description: (
        <>
          Before the cascade runs, the browser has to find which rules apply at all. A{" "}
          <em>selector</em> — a pattern that matches elements — can target by element name (
          <code>p</code>), by class (<code>.lead</code>), by ID (<code>#hero</code>), by attribute (
          <code>[type=&quot;email&quot;]</code>), or by combinations of these. Every rule whose
          selector matches a given element puts its declarations into a pool. The cascade&apos;s job
          is to pick one winning declaration per property from that pool. If only one rule in the
          pool mentions <code>color</code>, there is no conflict — it wins by default.
        </>
      ),
      code: `/* These selectors all potentially match the same <p class="lead" id="hero"> */

p              { color: gray; }          /* element selector */
.lead          { color: navy; }          /* class selector */
#hero          { color: crimson; }       /* ID selector */
[lang="en"]    { color: teal; }          /* attribute selector */
p:first-child  { color: olive; }         /* pseudo-class selector */`,
    },
    {
      title: "Step 2: The cascade is a sort",
      description: (
        <>
          When multiple rules match the same element and all declare the same property, the browser
          resolves the conflict with a strict sort — not a guess. The sort runs through three levels in
          order. First, <em>origin</em>: declarations from the author (your stylesheet) beat the
          browser&apos;s built-in defaults (user-agent), which beat user-set preferences. Second,{" "}
          <em>importance</em>: any rule with <code>!important</code> is hoisted to the top of its
          origin tier, flipping the normal ranking. Third, <em>specificity</em>: among rules at the
          same origin and importance level, the score of the selector decides the winner. Source order
          is the final tiebreaker — last rule wins — but it rarely matters because specificity usually
          distinguishes the rules first.
        </>
      ),
      code: `/* Sort order (highest to lowest priority):
 *
 *  1. !important in author stylesheet
 *  2. !important in user stylesheet
 *  3. !important in user-agent (browser default)
 *  4. normal author declarations    ← your everyday CSS
 *  5. normal user declarations
 *  6. normal user-agent declarations
 *
 * Within each tier, specificity decides; source order breaks ties.
 */`,
    },
    {
      title: "Step 3: Specificity is a 4-tuple",
      description: (
        <>
          <em>Specificity</em> — the score that ranks colliding CSS rules — is computed as four
          columns: <code>(inline, id, class+attr+pseudo-class, element+pseudo-element)</code>. An
          inline <code>style=&quot;&quot;</code> attribute sets the first column to 1, beating
          everything else. Each <code>#id</code> increments the second column. Each class, attribute,
          or pseudo-class (<code>:hover</code>, <code>:first-child</code>) increments the third
          column. Each element name or pseudo-element (<code>::before</code>) increments the fourth
          column. Columns are compared left to right: <code>#hero p</code> is <code>(0,1,0,1)</code>
          ; <code>.lead.large</code> is <code>(0,0,2,0)</code>. Because the ID column is more
          significant than the class column, <code>(0,1,0,1)</code> beats <code>(0,0,2,0)</code>
          regardless of how many classes are stacked — ten classes still lose to one ID.
        </>
      ),
      code: `Selector                     Specificity    (inline, id, class, element)
-------------------------------------------------------------------
p                            (0, 0, 0, 1)
.lead                        (0, 0, 1, 0)
p.lead                       (0, 0, 1, 1)
#hero                        (0, 1, 0, 0)
#hero p                      (0, 1, 0, 1)
#hero .lead                  (0, 1, 1, 0)
style="color:red"            (1, 0, 0, 0)   ← inline beats everything

/* Ten classes vs one ID */
.a.b.c.d.e.f.g.h.i.j        (0, 0, 10, 0)  ← still loses to #x
#x                           (0, 1, 0, 0)   ← wins`,
    },
    {
      title: "Step 4: Inheritance fills in the gaps",
      description: (
        <>
          <em>Inheritance</em> — the CSS mechanism by which some properties propagate from parent to
          child unless overridden — fills in declarations that no rule explicitly sets. Properties
          that affect text (<code>color</code>, <code>font-size</code>, <code>font-family</code>,{" "}
          <code>line-height</code>) inherit by default, so setting <code>color</code> on{" "}
          <code>&lt;body&gt;</code> propagates to every element inside without you writing a
          rule for each. Properties that affect box geometry (<code>border</code>,{" "}
          <code>padding</code>, <code>width</code>, <code>margin</code>, <code>background</code>)
          do not inherit, which prevents headings from inheriting the button&apos;s border. You can
          always override this default with the keywords <code>inherit</code> (force it),{" "}
          <code>initial</code> (reset to the property&apos;s specified initial value), or{" "}
          <code>unset</code> (inherit if the property normally inherits, otherwise initial).
        </>
      ),
      code: `/* Inheritance in practice */

body {
  color: #1e293b;         /* inherits: every <p>, <span>, <a> inside gets this */
  font-family: sans-serif; /* inherits */
}

.card {
  border: 1px solid #e2e8f0; /* does NOT inherit — children won't get this border */
  background: white;          /* does NOT inherit */
}

/* Force inheritance when you need it */
.reset-link {
  color: inherit;  /* use the parent's color instead of the link default (blue) */
  text-decoration: inherit;
}`,
    },
    {
      title: "Step 5: Every element is a box",
      description: (
        <>
          The <em>box model</em> — the rule that every element is a rectangle of{" "}
          <code>content + padding + border + margin</code> — is the foundation of all CSS layout.
          The content area holds the text or child elements. Padding is transparent space inside the
          border, separating content from the edge. Border wraps the padding with an optional visible
          line. Margin is transparent space outside the border, separating the box from its neighbors.
          One famous CSS surprise: vertical margins between sibling block elements collapse — only
          the larger of the two margins is used, and they never sum. A{" "}
          <em>block element</em> — an element that takes a full row by default, like{" "}
          <code>&lt;div&gt;</code> or <code>&lt;p&gt;</code> — participates in margin collapsing;
          an <em>inline element</em> — one that flows alongside text, like{" "}
          <code>&lt;span&gt;</code> or <code>&lt;a&gt;</code> — does not.
        </>
      ),
      code: `/* Box model: content + padding + border + margin */

.card {
  width: 300px;       /* content width */
  padding: 20px;      /* space inside the border */
  border: 2px solid;  /* the visible edge */
  margin: 16px;       /* space outside, separating from neighbors */
}

/* Margin collapse: two siblings, 24px and 16px margins */
.first  { margin-bottom: 24px; }
.second { margin-top: 16px; }
/* The gap between them is 24px — not 40px. */`,
    },
    {
      title: "Step 6: box-sizing: border-box",
      description: (
        <>
          By default, <code>width</code> and <code>height</code> measure <em>only the content area</em>.
          That means a box with <code>width: 200px; padding: 20px; border: 4px solid</code> actually
          occupies <code>200 + 40 + 8 = 248px</code> of horizontal space — not 200. This is{" "}
          <code>box-sizing: content-box</code>, the spec default, and it surprises every newcomer.
          Setting <code>box-sizing: border-box</code> makes <code>width</code> include padding and
          border: what you type is what you get. The near-universal modern practice is to apply this
          globally with the <code>*</code> reset, so every element in your codebase behaves
          predictably. All major CSS frameworks and resets include this reset by default.
        </>
      ),
      code: `/* Global reset — put this at the top of every stylesheet */
*, *::before, *::after {
  box-sizing: border-box;
}

/* Now width is the total painted width */
.card {
  width: 200px;          /* total box = 200px exactly */
  padding: 20px;         /* included inside 200px */
  border: 4px solid;     /* also included inside 200px */
  /* content area = 200 - 40 - 8 = 152px */
}

/* Without border-box (content-box default): */
/* total box = 200 + 40 + 8 = 248px — not what you typed */`,
    },
  ];

  const playgroundHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Box Sizing Demo</title>
</head>
<body>
  <h2>content-box vs border-box</h2>
  <p class="note">All three cards have <code>width: 200px; padding: 20px; border: 4px solid</code>.</p>

  <div class="row">
    <div class="card content-box">
      <p class="label">content-box (default)</p>
      <p>Total painted width: 248px</p>
      <p>width + padding + border = 200 + 40 + 8</p>
    </div>

    <div class="card border-box">
      <p class="label">border-box</p>
      <p>Total painted width: 200px</p>
      <p>width includes padding + border</p>
    </div>
  </div>

  <div class="reset-demo">
    <div class="card border-box-reset">
      <p class="label">border-box (global reset applied)</p>
      <p>* { box-sizing: border-box } reset</p>
      <p>What you type is what you get.</p>
    </div>
  </div>
</body>
</html>`;

  const playgroundCss = `body {
  font-family: system-ui, sans-serif;
  padding: 24px;
  color: #1e293b;
  background: #f8fafc;
}

h2 { margin-bottom: 4px; font-size: 1.1rem; }
.note { font-size: 0.85rem; color: #64748b; margin-bottom: 20px; }
code { background: #e2e8f0; padding: 1px 4px; border-radius: 3px; font-size: 0.85em; }

.row {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
  align-items: flex-start;
}

.card {
  width: 200px;
  padding: 20px;
  border: 4px solid;
  border-radius: 6px;
}

.content-box {
  box-sizing: content-box; /* default */
  border-color: #ef4444;
  background: #fef2f2;
}

.border-box {
  box-sizing: border-box;
  border-color: #22c55e;
  background: #f0fdf4;
}

/* Global reset applied to the third card's context */
.reset-demo * {
  box-sizing: border-box;
}

.border-box-reset {
  width: 200px;
  padding: 20px;
  border: 4px solid #3b82f6;
  border-radius: 6px;
  background: #eff6ff;
}

.label {
  font-weight: 700;
  font-size: 0.85rem;
  margin-bottom: 8px;
}

p { margin: 4px 0; font-size: 0.82rem; }`;

  const playgroundJs = `// Try this: change the .content-box card's width and watch how its visible
// size diverges from the number you typed. Then change the .border-box
// card's width — what you type is what you get.`;

  return (
    <div className="space-y-8">

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 1: Hook                                                       */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Card>
        <CardContent className="pt-6">
          <div className="prose dark:prose-invert max-w-none">
            <p>
              You add <code>color: red</code> to a paragraph. Nothing happens. The text stays
              whatever color it was before. You add <code>!important</code>. Still nothing. You
              open DevTools and see three rules from somewhere else are outweighing yours, one of
              them also marked <code>!important</code>. CSS isn&apos;t broken — it&apos;s an
              algorithm, and once you can run that algorithm in your head, the surprises stop.
            </p>
            <p>
              This module builds the mental machinery you need: you will learn how the cascade
              resolves conflicts between rules, how specificity scores are computed, which
              properties inherit and which do not, how every element is secretly a rectangle with
              four layers, and why the one global setting <code>box-sizing: border-box</code>{" "}
              makes every layout you write more predictable. By the end, &quot;why isn&apos;t my
              style applying?&quot; will be a five-second diagnosis, not a coin flip.
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
              CSS is a language of declarations, but a declaration only wins if it survives the
              cascade. Think of the cascade as a sorting algorithm that runs every time a property
              needs a value on a given element: it collects all matching rules, sorts them by origin,
              importance, and specificity, and hands the winner to the renderer. The box model is the
              parallel truth about geometry: every element, no matter how it is styled, occupies a
              rectangular region composed of four concentric layers. Inheritance is the mechanism
              that lets you set <code>color</code> on <code>&lt;body&gt;</code> once and have it
              propagate everywhere, without writing 300 rules. These three ideas — cascade,
              box model, inheritance — compose into a single coherent system.
            </p>
            <blockquote className="border-l-4 border-blue-500 pl-4 italic">
              &quot;The cascade is a sort, not a guess: origin &times; specificity &times; source
              order. Every element is a box. Inheritance is a feature, not an accident.&quot;
            </blockquote>
          </div>
        </CardContent>
      </Card>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 3: Step-by-step                                               */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <StepByStepExplanation
        title="How CSS picks the winner"
        description="Six steps from selector matching through box geometry"
        steps={cascadeSteps}
      />

      {/* Optional: LiveCascadeDemo (cascade resolver) */}
      <LiveCascadeDemo
        title="Which rule wins?"
        description="Specificity score is shown as (inline, id, class+attr+pseudo, element)"
        rules={[
          { selector: "p", declaration: "color: black", source: "stylesheet" },
          { selector: ".lead", declaration: "color: navy", source: "stylesheet" },
          { selector: "#hero p", declaration: "color: crimson", source: "stylesheet" },
          { selector: "p", declaration: "color: orange !important", source: "important" },
        ]}
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 4: Playground                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <HTMLPlayground
        html={playgroundHtml}
        css={playgroundCss}
        js={playgroundJs}
        title="content-box vs border-box"
        description="Both cards have width: 200px, padding: 20px, border: 4px solid. Only box-sizing differs — watch the painted widths."
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 5: Challenges                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Challenge
        question="Two CSS rules apply to the same <p>: .intro p { color: blue } and #article p { color: red }. Which wins?"
        options={[
          { id: "a", text: ".intro p wins because it appears first in the stylesheet." },
          {
            id: "b",
            text: "#article p wins because it has higher specificity (1 ID + 1 element vs 1 class + 1 element).",
          },
          { id: "c", text: "They tie; the browser picks arbitrarily." },
          {
            id: "d",
            text: ".intro p wins because class selectors are more specific than ID selectors.",
          },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            Specificity is counted as <code>(inline, id, class+attr+pseudo, element)</code>.{" "}
            <code>#article p</code> scores <code>(0,1,0,1)</code>; <code>.intro p</code> scores{" "}
            <code>(0,0,1,1)</code>. The ID column is compared before the class column, and{" "}
            <code>1 &gt; 0</code> in the ID column means <code>#article p</code> wins regardless
            of source order. This is also why <code>!important</code> exists — it is the only
            way to override an ID rule without writing a more-specific selector.
          </>
        }
      />

      <Challenge
        question="What are the four parts of the box model, from inside out?"
        options={[
          { id: "a", text: "padding, content, border, margin" },
          { id: "b", text: "content, padding, border, margin" },
          { id: "c", text: "content, border, padding, margin" },
          { id: "d", text: "margin, border, padding, content" },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            The content sits at the center. Padding wraps it — transparent space between the content
            and the border. Border wraps the padding with the optional visible edge. Margin sits
            outside the border, separating the box from its neighbors. The order matters because{" "}
            <code>box-sizing</code> decides whether <code>width</code> covers content only (
            <code>content-box</code>) or content + padding + border (<code>border-box</code>).
            Margin is never included in either mode.
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
              "!important is the nuclear option — once one rule uses it, you need another !important to override it; this is how stylesheets become unmaintainable",
            body: (
              <>
                <code>!important</code> flips the rule&apos;s origin tier, putting it above all
                normal declarations. If two rules both carry <code>!important</code> then specificity
                and source order apply again, just within the important tier. The practical result is
                a specificity arms race that compounds over years. Reserve it for user-accessibility
                overrides or genuine last-resort fixes, never as a shortcut.
              </>
            ),
          },
          {
            title:
              "Inheritance is property-by-property — color inherits but border does not; check MDN before assuming",
            body: (
              <>
                MDN&apos;s property reference always lists whether a property is inherited. The
                heuristic — text properties inherit, box properties do not — holds most of the time
                but has exceptions: <code>visibility</code> inherits; <code>background</code> does
                not. When a child element shows an unexpected value, check whether the property
                inherits before blaming specificity.
              </>
            ),
          },
          {
            title:
              "Specificity has four columns, and IDs win even against many classes — #x (0,1,0,0) beats .a.b.c.d.e.f.g.h.i.j (0,0,10,0)",
            body: (
              <>
                Columns are compared left to right and are not interchangeable. You cannot accumulate
                enough element or class selectors to beat a single ID. This is why frameworks like
                Tailwind and CSS Modules avoid IDs entirely — they keep specificity low and
                predictable, so any override is easy to write.
              </>
            ),
          },
          {
            title:
              "Vertical margins between siblings collapse — the bigger margin wins, and the two never sum",
            body: (
              <>
                If a paragraph has <code>margin-bottom: 24px</code> and the next paragraph has{" "}
                <code>margin-top: 16px</code>, the gap between them is <code>24px</code>, not{" "}
                <code>40px</code>. This is intentional — it prevents headings and paragraphs from
                doubling up their spacing — but it surprises newcomers who expect margins to add.
                Margin collapse does not occur horizontally, and it does not apply to flex or grid
                children.
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
            The <em>cascade</em> is a sort — origin, then importance, then specificity, then source
            order — that picks exactly one winning declaration per property per element. It is
            deterministic, not random.
          </>,
          <>
            <em>Specificity</em> is a 4-tuple <code>(inline, id, class+attr+pseudo, element)</code>.
            Columns are compared left to right; a single ID outweighs any number of classes, and no
            amount of element selectors beats a class.
          </>,
          <>
            <em>Inheritance</em> fills gaps: text properties like <code>color</code> and{" "}
            <code>font-size</code> propagate from parent to child; box properties like{" "}
            <code>border</code> and <code>width</code> do not. Use <code>inherit</code> to opt in,{" "}
            <code>initial</code> to opt out.
          </>,
          <>
            Every element is a box: <strong>content &rarr; padding &rarr; border &rarr; margin</strong>,
            from inside out. Vertical margins between siblings collapse to the larger of the two
            values.
          </>,
          <>
            Set <code>* &#123; box-sizing: border-box &#125;</code> globally. It makes{" "}
            <code>width</code> include padding and border — what you type is what you get — and
            eliminates the most common sizing surprises.
          </>,
        ]}
        mentalModel="The cascade is a sort, not a guess: origin × specificity × source order. Every element is a box. Inheritance is a feature, not an accident."
      />
    </div>
  );
}
