"use client";
import { ScaffoldModule } from "./_template";
import { HTMLPlayground } from "@/components/CodePlayground";

export function Module_3_2_Content() {
  return (
    <ScaffoldModule
      emoji="📐"
      problemTitle="Flex is 1-D; grid is 2-D"
      problem={
        <>
          <p>
            Before Flexbox and Grid, CSS layouts were hacked together with floats, inline-block
            tricks, and table-display hacks. The browser&apos;s layout engine now ships two
            purpose-built systems, each solving a distinct problem. Picking the wrong one does not
            break your layout — but it does make simple tasks needlessly complex.
          </p>
          <p>
            <strong>Flexbox</strong> distributes space along <em>one axis at a time</em>. Set{" "}
            <code>display: flex</code> on a container and its direct children become flex items
            that stretch, shrink, or grow to fill the available space. The main axis is horizontal
            by default (<code>flex-direction: row</code>); switch to{" "}
            <code>flex-direction: column</code> for vertical stacks. Flexbox shines for nav bars,
            button groups, card headers, or any row/column of items where the content size should
            influence the distribution.
          </p>
          <p>
            <strong>Grid</strong> divides space in <em>two dimensions simultaneously</em>. You
            define rows and columns up front with <code>grid-template-columns</code> and{" "}
            <code>grid-template-rows</code>, then items are placed into cells automatically or
            explicitly. The <code>fr</code> unit means &quot;a fraction of the remaining
            space&quot; after fixed sizes are subtracted. <code>repeat(3, 1fr)</code> is three
            equal columns. Grid is the right choice for page shells, card grids, form layouts, and
            anything where rows <em>and</em> columns must align.
          </p>
          <p>
            A practical heuristic: if you are thinking in <em>one direction</em> (a row of
            buttons, a column of stacked cards), reach for Flex. If you are thinking in{" "}
            <em>rows and columns</em> at the same time (a photo grid, a dashboard), reach for
            Grid. They compose freely — a Grid container can contain Flex children and vice versa.
          </p>
        </>
      }
      body={
        <HTMLPlayground
          title="Flex row vs. CSS Grid"
          description="Top section: a flex row where items grow equally. Bottom: a 3×2 grid with fr columns."
          html={`<!DOCTYPE html>
<html>
<head><link rel="stylesheet" href="/styles.css" /></head>
<body>

  <h2>Flexbox — 1-D row</h2>
  <div class="flex-container">
    <div class="flex-item">Alpha</div>
    <div class="flex-item">Beta</div>
    <div class="flex-item">Gamma</div>
  </div>

  <h2>CSS Grid — 2-D layout</h2>
  <div class="grid-container">
    <div class="grid-item">1</div>
    <div class="grid-item">2</div>
    <div class="grid-item">3</div>
    <div class="grid-item">4</div>
    <div class="grid-item">5</div>
    <div class="grid-item">6</div>
  </div>

</body>
</html>`}
          css={`body { font-family: sans-serif; padding: 1rem; }

/* ── Flex: items share horizontal space equally ── */
.flex-container {
  display: flex;
  gap: 12px;
  background: #e0f2fe;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.flex-item {
  flex: 1;          /* grow to fill; all items get equal shares */
  background: #0284c7;
  color: white;
  padding: 1rem;
  border-radius: 6px;
  text-align: center;
  font-weight: 600;
}

/* ── Grid: 3 equal columns, auto rows ── */
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);   /* 3 equal columns */
  gap: 12px;
  background: #fef9c3;
  padding: 12px;
  border-radius: 8px;
}

.grid-item {
  background: #ca8a04;
  color: white;
  padding: 1.5rem;
  border-radius: 6px;
  text-align: center;
  font-size: 1.25rem;
  font-weight: 700;
}`}
        />
      }
      challenge={{
        question:
          "What does the CSS value `grid-template-columns: repeat(4, 1fr)` produce?",
        options: [
          { id: "a", text: "Four columns where each takes up 1% of the container width" },
          { id: "b", text: "Four equal columns that share all available space" },
          { id: "c", text: "One column that repeats itself four times in the same row" },
          { id: "d", text: "Four columns where each is exactly 1 pixel wide" },
        ],
        correctAnswerId: "b",
        explanation: (
          <>
            <code>1fr</code> stands for &quot;1 fraction of the available space.&quot; After any
            fixed-width columns are sized, the remaining space is split equally among all{" "}
            <code>fr</code> tracks. <code>repeat(4, 1fr)</code> therefore creates four
            equal-width columns that together fill the container — no pixel values or
            percentages needed.
          </>
        ),
      }}
      takeaways={[
        <>Flexbox is for one-directional distribution (row <em>or</em> column); Grid is for two-dimensional placement (rows <em>and</em> columns simultaneously).</>,
        <>The <code>fr</code> unit means &quot;a fraction of the remaining space&quot; — <code>repeat(3, 1fr)</code> is the idiomatic way to create equal columns in Grid.</>,
        <>Both systems compose freely: a Grid cell can be a Flex container, and a Flex item can itself be a Grid container — pick the right tool for each level of the layout.</>,
      ]}
      mentalModel="Flex thinks in one line; Grid thinks in a table — start with the axis count to pick the right tool."
      roadmapUrl="https://roadmap.sh/frontend"
    />
  );
}
