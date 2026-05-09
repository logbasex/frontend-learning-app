"use client";

import { Card, CardContent } from "@/components/ui/card";
import { HTMLPlayground } from "@/components/CodePlayground";
import { StepByStepExplanation, Step } from "@/components/StepByStepExplanation";
import { FlexboxControls } from "@/components/FlexboxControls";
import { GridControls } from "@/components/GridControls";
import { Challenge } from "@/components/Challenge";
import { GotchaList } from "@/components/GotchaList";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { RoadmapLink } from "@/components/RoadmapLink";

export function Module_3_2_Content() {
  // Data blocks hoisted out of JSX for readability — listed in render order.
  const flexVsGridSteps: Step[] = [
    {
      title: "Flex is one-dimensional",
      description: (
        <>
          When you set <code>display: flex</code> on a container, its direct children are laid
          along a single axis. That axis is called the <em>main axis</em> — horizontal when{" "}
          <code>flex-direction: row</code> (the default), vertical when{" "}
          <code>flex-direction: column</code>. The perpendicular direction is the{" "}
          <em>cross axis</em>. <code>justify-content</code> distributes leftover space along the
          main axis; <code>align-items</code> positions items along the cross axis. You can only
          target one axis at a time — that is the defining constraint of Flexbox.
        </>
      ),
      code: `.nav {
  display: flex;
  flex-direction: row;       /* main axis: horizontal → */
                             /* cross axis: vertical  ↕ */

  justify-content: space-between; /* distributes space along main axis */
  align-items: center;            /* aligns items along cross axis */
}

/* flex-direction: column flips the axes:
   main axis becomes vertical ↕
   cross axis becomes horizontal → */`,
    },
    {
      title: "Grid is two-dimensional",
      description: (
        <>
          <em>Grid</em> — a 2-D layout system that divides space into rows and columns
          simultaneously — lets you define a full coordinate system up front.{" "}
          <code>grid-template-columns</code> names the column tracks;{" "}
          <code>grid-template-rows</code> names the row tracks. Items auto-place into cells by
          default, but you can span multiple rows or columns with{" "}
          <code>grid-column: 1 / 3</code> or <code>grid-row: span 2</code>. The key difference
          from Flex: you can control <em>both</em> dimensions at once, so items in different rows
          align with each other.
        </>
      ),
      code: `.dashboard {
  display: grid;
  grid-template-columns: 240px 1fr 1fr; /* 3 column tracks */
  grid-template-rows: 60px 1fr 80px;    /* 3 row tracks */
  gap: 16px;
}

/* Span multiple cells: */
.header {
  grid-column: 1 / -1; /* stretches across all columns */
}

.sidebar {
  grid-row: 2 / 3;     /* sits in the middle row */
}`,
    },
    {
      title: "`fr` and the math",
      description: (
        <>
          The <em><code>fr</code> unit</em> — a unit in Grid representing a fraction of remaining
          space — makes proportional columns trivial. The browser first assigns fixed-width tracks
          (pixels, rems, percentages), then splits whatever is left among the{" "}
          <code>fr</code> tracks according to their weights.{" "}
          <code>1fr 2fr</code> gives the second column twice as much space as the first.{" "}
          <code>repeat(3, 1fr)</code> repeats a single <code>1fr</code> track three times —
          shorthand for <code>1fr 1fr 1fr</code>. The most useful responsive pattern is{" "}
          <code>repeat(auto-fit, minmax(200px, 1fr))</code>: columns that are at least 200px wide
          and grow to fill remaining space, with the count adapting to the container width
          automatically.
        </>
      ),
      code: `/* Two columns: second is twice the width of first */
grid-template-columns: 1fr 2fr;

/* Three equal columns */
grid-template-columns: repeat(3, 1fr);

/* Responsive: as many 200px+ columns as fit, all growing equally */
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));

/* Mixed: fixed sidebar + flexible main */
grid-template-columns: 240px 1fr;`,
    },
    {
      title: "Flex for nav, toolbar, button row",
      description: (
        <>
          Reach for <em>Flexbox</em> any time your layout is a single row or column of items —
          navbars, toolbars, button groups, card headers, form rows. The classic navbar pattern
          uses <code>justify-content: space-between</code> to push the logo to the left edge and
          the links to the right. Because there are only two groups and they sit on one axis, Flex
          does the job in three lines of CSS. Grid would add rows and named areas for no benefit.
        </>
      ),
      code: `/* Navbar: logo left, links right */
.nav {
  display: flex;
  justify-content: space-between; /* pushes children to opposite ends */
  align-items: center;
  padding: 0 24px;
  height: 60px;
  background: #1e293b;
}

.nav-links {
  display: flex;
  gap: 24px;        /* space between links */
  list-style: none;
}`,
    },
    {
      title: "Grid for cards, dashboards, calendars",
      description: (
        <>
          Reach for Grid when you need rows <em>and</em> columns to align simultaneously — card
          grids, dashboards, calendars, form tables. The responsive card grid pattern is the most
          common real-world use: <code>repeat(auto-fit, minmax(200px, 1fr))</code> gives you as
          many columns as fit, each at least 200px, with all items in a given column edge-aligning
          perfectly. No media queries needed for the column count.
        </>
      ),
      code: `/* 3-column responsive card grid */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  padding: 24px;
}

/* Every card: consistent height via stretch (Grid default) */
.card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
}`,
    },
    {
      title: "Picking on purpose",
      description: (
        <>
          The question to ask is: does my layout have one axis of distribution, or two? A nav bar
          distributes items along a single row — one axis, reach for Flex. A product page with a
          fixed sidebar and a main area that must align its cards in columns — two axes, reach for
          Grid. Mixing is encouraged: a Grid page shell can contain a Flex header, which can
          contain Flex button groups. Each level picks the tool that matches its dimensional needs.
          There is no wrong choice for simple cases where either works — but knowing why you picked
          is what separates intention from guessing.
        </>
      ),
      code: `/* Page shell: Grid (rows + columns) */
.page {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: 60px 1fr;
  min-height: 100vh;
}

/* Header inside the grid: Flex (single row) */
.header {
  grid-column: 1 / -1; /* span both columns */
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Cards inside the main area: Grid again (2-D alignment) */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}`,
    },
  ];

  const playgroundHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="/styles.css">
</head>
<body>

  <nav class="nav">
    <span class="logo">MyApp</span>
    <ul class="nav-links">
      <li><a href="#">Home</a></li>
      <li><a href="#">About</a></li>
      <li><a href="#">Work</a></li>
      <li><a href="#">Contact</a></li>
    </ul>
  </nav>

  <main class="main">
    <div class="card-grid">
      <div class="card"><strong>Design</strong><p>Visual identity and brand.</p></div>
      <div class="card"><strong>Engineering</strong><p>Systems that scale.</p></div>
      <div class="card"><strong>Product</strong><p>Shape what gets built.</p></div>
      <div class="card"><strong>Growth</strong><p>Reach the right people.</p></div>
    </div>
  </main>

  <script src="/script.js"></script>
</body>
</html>`;

  const playgroundCss = `*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: system-ui, sans-serif; background: #f8fafc; color: #1e293b; }

/* ── Flexbox navbar ── */
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: 60px;
  background: #1e293b;
  color: white;
}
.logo { font-size: 1.1rem; font-weight: 700; letter-spacing: -0.5px; }
.nav-links {
  display: flex;
  gap: 24px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.nav-links a { color: #cbd5e1; text-decoration: none; font-size: 0.9rem; }
.nav-links a:hover { color: white; }

/* ── Grid card area ── */
.main { padding: 32px 24px; }
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}
.card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  border: 1px solid #e2e8f0;
}
.card strong { display: block; margin-bottom: 6px; font-size: 1rem; }
.card p { margin: 0; font-size: 0.875rem; color: #64748b; }`;

  const playgroundJs = `// Try this: open DevTools → Elements, find the .nav element, change its
// justify-content value live (try center, flex-end, space-around). Then
// find .card-grid and change grid-template-columns. Watch each change
// ripple through the layout.`;

  return (
    <div className="space-y-8">

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 1: Hook                                                       */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Card>
        <CardContent className="pt-6">
          <div className="prose dark:prose-invert max-w-none">
            <p>
              Half the layouts you&apos;ll write fit cleanly into Flexbox or Grid. Picking the wrong
              one is the difference between three lines of CSS and thirty — and float-and-clear
              nightmares from 2010 still haunt codebases that picked wrong. The decision is
              architectural, not cosmetic: it determines whether adding a new column is a one-liner
              or a rework.
            </p>
            <p>
              By the end of this module you&apos;ll have the mental model that makes the choice
              obvious, the vocabulary to read and write both systems fluently, and two real-world
              patterns — a Flex navbar and a responsive Grid card layout — that you can copy into
              any project today.
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
              The cleanest way to carry these two systems in your head is to count axes.{" "}
              <em>Flexbox</em> — a 1-D layout system that distributes space along a single axis
              (row or column) — always works along one line at a time. You tell it which direction
              to flow and it handles the rest. <em>Grid</em> — a 2-D layout system that divides
              space into rows and columns simultaneously — lets you set up a full coordinate grid
              and place items anywhere in it. The{" "}
              <em><code>fr</code> unit</em> is what makes Grid columns flexible: it represents a
              fraction of whatever space is left after fixed tracks are sized. Know the axis count
              of your layout and you know which tool to reach for.
            </p>
            <blockquote className="border-l-4 border-blue-500 pl-4 italic">
              &quot;Flex distributes space along one axis. Grid divides space along two.{" "}
              <code>fr</code> is the unit of remaining space.&quot;
            </blockquote>
          </div>
        </CardContent>
      </Card>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 3: Step-by-step                                               */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <StepByStepExplanation
        title="Flex vs Grid: when to use which"
        description="Six steps from axis theory to picking on purpose"
        steps={flexVsGridSteps}
      />

      {/* Optional: FlexboxControls (interactive 1-D) */}
      <FlexboxControls itemCount={5} />

      {/* Optional: GridControls (interactive 2-D) */}
      <GridControls itemCount={8} />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 4: Playground                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <HTMLPlayground
        html={playgroundHtml}
        css={playgroundCss}
        js={playgroundJs}
        title="Flex navbar + Grid card layout"
        description="A page with a Flex navbar on top and a responsive Grid card section below. Edit the CSS live to see both systems respond."
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 5: Challenges                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Challenge
        question="You need to lay out a settings page with a left sidebar of fixed width 240px and a main column that fills the rest. Flex or Grid?"
        options={[
          { id: "a", text: "Flex with flex: 1 on the main column." },
          { id: "b", text: "Grid with grid-template-columns: 240px 1fr." },
          { id: "c", text: "Either works fine; pick by team preference." },
          { id: "d", text: "Float, because two-column layouts are simple." },
        ]}
        correctAnswerId="c"
        explanation={
          <>
            Both work cleanly here. Flex with <code>flex: 1</code> on the main and{" "}
            <code>flex: 0 0 240px</code> on the sidebar gives the same result as Grid&apos;s{" "}
            <code>240px 1fr</code>. The judgment is real but not stark — pick by what the rest of
            the page looks like, or by what your team finds clearer.
          </>
        }
      />

      <Challenge
        question="You set justify-content: center on a flex container but the items don't move. What's the most likely cause?"
        options={[
          { id: "a", text: "justify-content only works in a grid container." },
          {
            id: "b",
            text: "The flex container has no main-axis free space (the items already fill it, or the container has no defined size).",
          },
          { id: "c", text: "You forgot display: flex." },
          { id: "d", text: "align-items: stretch is conflicting with it." },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            <code>justify-content</code> distributes leftover main-axis space — if there is none,
            there&apos;s nothing to distribute. Either the items fill the container exactly, or the
            container has no width yet (e.g., it&apos;s an inline element or its parent hasn&apos;t
            laid out). <code>display: flex</code> is required, but if it were missing the items
            would stack, which is a different symptom.
          </>
        }
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 6: GotchaList                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <GotchaList
        items={[
          {
            title: "Flex align-items aligns on the cross axis — confusing on column flex because the cross axis is now horizontal",
            body: (
              <>
                When <code>flex-direction: column</code>, the main axis is vertical and the cross
                axis is horizontal. So <code>align-items: center</code> centers items horizontally,
                and <code>justify-content: center</code> centers them vertically — the opposite of
                the row default. Newcomers almost always have these reversed the first time they
                build a vertical stack.
              </>
            ),
          },
          {
            title: "Grid auto-fit collapses empty tracks; auto-fill keeps them — most responsive grids want auto-fit",
            body: (
              <>
                With <code>repeat(auto-fill, minmax(200px, 1fr))</code>, if the container is 900px
                wide and only 3 items exist, the browser still reserves columns for a 4th and 5th
                invisible track. With <code>auto-fit</code>, those empty tracks collapse to zero
                width and the three real items stretch to fill the space. For card grids, you almost
                always want <code>auto-fit</code>.
              </>
            ),
          },
          {
            title: "Flex gap is unsupported in Safari < 14.1 — older codebases use margin: -8px workarounds you should not copy",
            body: (
              <>
                <code>gap</code> on flex containers landed in Safari 14.1 (April 2021). Codebases
                targeting older Safari used negative-margin hacks on the container and positive
                margins on items to simulate gutters. If you see that pattern in a codebase, it
                predates modern <code>gap</code> support — don&apos;t copy it into new code.
              </>
            ),
          },
          {
            title: "display: grid on an inline element behaves like a block — use inline-grid to stay inline",
            body: (
              <>
                Like <code>display: flex</code>, <code>display: grid</code> generates a block-level
                box regardless of what display value the element had before. If you want the grid
                container to stay inline in text flow (rare, but valid for things like icon badges),
                use <code>display: inline-grid</code> instead.
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
            <em>Flexbox</em> is one-dimensional: items distribute along either a row or a column.
            Use it for navbars, button rows, card headers — anything that flows along a single axis.
          </>,
          <>
            <em>Grid</em> is two-dimensional: you define rows and columns at once and items snap to
            both. Use it for page shells, card grids, dashboards — anything where rows and columns
            must align simultaneously.
          </>,
          <>
            The <em><code>fr</code> unit</em> means &quot;a fraction of remaining space.&quot;{" "}
            <code>repeat(auto-fit, minmax(200px, 1fr))</code> is the canonical responsive grid: as
            many columns as fit, each at least 200px, no media queries needed for column count.
          </>,
          <>
            <code>justify-content</code> works on the <em>main axis</em>;{" "}
            <code>align-items</code> works on the <em>cross axis</em>. When{" "}
            <code>justify-content</code> appears to do nothing, the container has no free space on
            its main axis.
          </>,
          <>
            Flex and Grid compose freely. A Grid page shell can contain a Flex header, which can
            contain Flex button groups. Pick the tool that matches the axis count at each level of
            your layout.
          </>,
        ]}
        mentalModel="Flex distributes space along one axis. Grid divides space along two. `fr` is the unit of remaining space."
      />
    </div>
  );
}
