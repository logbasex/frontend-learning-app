"use client";

import { Card, CardContent } from "@/components/ui/card";
import { HTMLPlayground } from "@/components/CodePlayground";
import { StepByStepExplanation, Step } from "@/components/StepByStepExplanation";
import { Challenge } from "@/components/Challenge";
import { GotchaList } from "@/components/GotchaList";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { RoadmapLink } from "@/components/RoadmapLink";

export function Module_2_3_Content() {
  const steps: Step[] = [
    {
      title: "Step 1: Tab through and listen",
      description: (
        <>
          Press Tab on any page and watch the focus indicator move. Every interactive element —
          links, buttons, inputs, custom widgets — should receive focus in visual reading order, and
          you should see a visible ring around whatever is focused. If Tab skips an element entirely,
          keyboard users cannot reach it at all. If it gets trapped inside a region and can never
          escape, the user is locked out of the rest of the page. Either symptom is an{" "}
          <em>accessibility (a11y)</em> bug — designing so every user, including users of screen
          readers, keyboards, and non-pointer devices, can use the page. Testing with Tab alone
          catches roughly 70% of real-world a11y issues before you even open a screen reader.
        </>
      ),
      code: `# Keyboard smoke test — press these keys, in order, on every new page
#
# Tab           move focus forward through interactive elements
# Shift+Tab     move focus backward
# Enter         activate links, submit forms, trigger buttons
# Space         activate buttons and checkboxes; scroll the page
# Arrow keys    navigate inside widgets (menus, sliders, tab-lists)
# Escape        close dialogs, popovers, or comboboxes
#
# What to watch for:
#   - Focus indicator disappears        → outline: none bug
#   - Tab skips an interactive element  → missing focusability
#   - Tab visits non-interactive text   → stray tabindex="0" or tabindex="1+"
#   - Focus is stuck inside a region   → missing focus-trap escape logic`,
    },
    {
      title: "Step 2: Real elements, real behavior",
      description: (
        <>
          A native <code>&lt;button&gt;</code> arrives with keyboard focusability, Space/Enter
          activation, and a screen-reader announcement of &quot;button&quot; — all for free, from
          the browser. A <code>&lt;div onClick&gt;</code> gives you none of that. This is the core
          of the first rule of <em>ARIA</em> — attributes that add accessibility metadata (
          <code>role</code>, <code>aria-label</code>) when the chosen HTML element can&apos;t express
          it — which is: <strong>don&apos;t use ARIA if a semantic element does the job.</strong>{" "}
          Reach for <code>&lt;button&gt;</code>, <code>&lt;a href&gt;</code>,{" "}
          <code>&lt;input&gt;</code>, and <code>&lt;select&gt;</code> first; they implement the full
          accessible contract without a single extra line. Every custom element you build from
          divs is debt you owe against that contract.
        </>
      ),
      code: `<!-- ❌ Broken for keyboard users — no focus, no Enter/Space, no role -->
<div class="btn" onclick="doThing()">Save</div>

<!-- ✅ Native button: focusable, keyboard-activatable, announced as "button" -->
<button type="button" onclick="doThing()">Save</button>

<!-- ✅ Link: focusable, Enter-activatable, announced as "link" -->
<a href="/settings">Settings</a>

<!-- ❌ Not a link — no href means no keyboard focus, no visit -->
<a onclick="navigate()">Settings</a>

<!-- ✅ Checkbox: focusable, Space-toggleable, state announced by screen reader -->
<label>
  <input type="checkbox" name="agree"> I agree to the terms
</label>`,
    },
    {
      title: "Step 3: When HTML can't, ARIA can",
      description: (
        <>
          HTML doesn&apos;t have a <code>&lt;tabs&gt;</code> element or a{" "}
          <code>&lt;combobox&gt;</code>. For those patterns, ARIA roles declare the widget&apos;s
          semantics to assistive technology: <code>role=&quot;tablist&quot;</code>,{" "}
          <code>role=&quot;tab&quot;</code>, <code>role=&quot;tabpanel&quot;</code>. But a role
          alone is an empty promise — you must also wire the matching keyboard behavior. The{" "}
          <a href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noopener noreferrer">
            ARIA Authoring Practices Guide
          </a>{" "}
          documents the exact key bindings each widget pattern requires. Without them, ARIA roles
          mislead screen-reader users into believing they can navigate an interface that doesn&apos;t
          respond to their keystrokes. Roles narrate; keyboard handlers perform; both are required.
        </>
      ),
      code: `<!-- ✅ Tab widget — roles alone are not enough; keyboard handling is mandatory -->
<div role="tablist" aria-label="Account sections">
  <button role="tab" aria-selected="true"  aria-controls="panel-profile" id="tab-profile">
    Profile
  </button>
  <button role="tab" aria-selected="false" aria-controls="panel-billing" id="tab-billing"
          tabindex="-1">
    Billing
  </button>
</div>

<div role="tabpanel" id="panel-profile" aria-labelledby="tab-profile">
  Profile content here
</div>
<div role="tabpanel" id="panel-billing"  aria-labelledby="tab-billing" hidden>
  Billing content here
</div>

<!-- Keyboard contract for tabs:
     Left/Right arrows → move between tabs + update aria-selected
     Tab               → move into the active panel
     Shift+Tab         → back to the tab strip                    -->`,
    },
    {
      title: "Step 4: Focus order vs visual order",
      description: (
        <>
          The Tab key follows <em>focus order</em> — the sequence in which keyboard Tab moves
          through interactive elements; it should match visual reading order. But CSS tools like
          flexbox <code>order</code>, <code>position: absolute</code>, and{" "}
          <code>grid-template-areas</code> can move elements visually without touching DOM order.
          When they diverge, a keyboard user tabs through a sequence that doesn&apos;t match what
          they see — confusing and, for screen-reader users, actively misleading. The fix is never
          to add <code>tabindex</code> to compensate; it is to keep the DOM order matching the
          reading order, and use CSS purely for visual arrangement on top of that correct structure.
        </>
      ),
      code: `/* ❌ Flexbox order: visual sequence is 2-1-3 but DOM (Tab) order is 1-2-3 */
.container { display: flex; }
.item-a { order: 2; }   /* visually second */
.item-b { order: 1; }   /* visually first  */
.item-c { order: 3; }   /* visually third  */

/* A keyboard user tabs: item-a → item-b → item-c (DOM order)
   A sighted user sees:  item-b → item-a → item-c (visual order)
   That mismatch is a focus-order bug.                              */

/* ✅ Keep DOM order == reading order; use CSS only for visual polish */
/* Reorder the HTML so item-b comes first in the markup.             */`,
    },
    {
      title: "Step 5: Accessible names",
      description: (
        <>
          Every interactive element needs an <em>accessible name</em> — the text a screen reader
          announces when the element receives focus. Visible text is the best source: a{" "}
          <code>&lt;button&gt;Save&lt;/button&gt;</code> is self-labeling. When there is no visible
          text — an icon button, an image link, a search input without a visible label — you must
          supply the name explicitly with <code>aria-label</code> or <code>aria-labelledby</code>.
          Color and shape are never names; an icon that looks like an X to sighted users is
          announced as nothing at all to a screen reader unless you add{" "}
          <code>aria-label=&quot;Close&quot;</code>. The{" "}
          <em>label association</em> — connecting an <code>&lt;input&gt;</code> to a{" "}
          <code>&lt;label&gt;</code> via <code>for</code>/id, wrapping, or{" "}
          <code>aria-labelledby</code> — is the same concept applied to form fields.
        </>
      ),
      code: `<!-- ❌ Icon button with no accessible name — announced as "" or "button" -->
<button onclick="closeModal()">
  <svg aria-hidden="true"><!-- X icon --></svg>
</button>

<!-- ✅ aria-label gives the button a name the screen reader announces -->
<button aria-label="Close" onclick="closeModal()">
  <svg aria-hidden="true"><!-- X icon --></svg>
</button>

<!-- ✅ aria-labelledby points at visible text elsewhere in the page -->
<h2 id="dialog-title">Delete account</h2>
<dialog aria-labelledby="dialog-title">…</dialog>

<!-- ✅ Linked label — clicking the label text focuses the input -->
<label for="email">Email address</label>
<input id="email" type="email" name="email">`,
    },
    {
      title: "Step 6: WCAG AA contrast",
      description: (
        <>
          <em>WCAG</em> — Web Content Accessibility Guidelines; AA is the practical baseline —
          specifies that normal-size body text must have a contrast ratio of at least{" "}
          <strong>4.5:1</strong> against its background. Large text (18 pt or 14 pt bold) and UI
          components like button borders and input outlines need only <strong>3:1</strong>. These
          ratios protect the 300 million people worldwide with some form of color vision deficiency,
          and are equally important in bright-sunlight screen conditions for everyone. Tools to
          measure: the DevTools color picker shows the ratio live as you adjust hex values; the axe
          browser extension flags contrast failures automatically; the
          {" "}<code>color-contrast()</code> CSS function (modern browsers) can calculate at
          build time. The 7:1 target is WCAG AAA — meaningful for text-heavy or high-stakes
          interfaces, but 4.5:1 is the non-negotiable floor.
        </>
      ),
      code: `/* Contrast ratio quick reference — WCAG AA */

/* Normal body text  → 4.5:1 minimum */
color: #374151;           /* gray-700 */
background: #ffffff;      /* white     */
/* → computed ratio: 9.73:1  ✅ passes AA */

/* Large text (18pt+ or 14pt+ bold) → 3:1 minimum */
color: #6b7280;           /* gray-500 */
background: #ffffff;
/* → computed ratio: 4.48:1  ✅ passes AA for large text */

/* ❌ Common failure — light gray on white */
color: #d1d5db;           /* gray-300 */
background: #ffffff;
/* → computed ratio: 1.60:1  ✗ fails for any text size */

/* Tools:
   Chrome DevTools: Inspect element → color swatch → contrast ratio shown
   axe extension: flags failures in Accessibility panel
   webaim.org/resources/contrastchecker — manual input             */`,
    },
  ];

  const playgroundHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <!-- Try this: click the page once to focus it, then press Tab. Only the real <button> receives focus. Press Space — only the real one fires its handler. -->

  <h2>Two buttons — one accessible, one not</h2>
  <p class="hint">Click anywhere on the page, then press <kbd>Tab</kbd>. Watch which element gets the focus ring. Then press <kbd>Space</kbd>.</p>

  <div class="row">
    <div class="card">
      <p class="label">&lt;div onClick&gt; — not a button</p>
      <div
        id="fake-btn"
        class="btn btn-fake"
        onclick="fire('fake')"
      >
        Save (fake)
      </div>
      <p id="out-fake" class="output"></p>
    </div>

    <div class="card">
      <p class="label">&lt;button&gt; — real button</p>
      <button
        id="real-btn"
        class="btn btn-real"
        onclick="fire('real')"
      >
        Save (real)
      </button>
      <p id="out-real" class="output"></p>
    </div>
  </div>

  <script src="/script.js"></script>
</body>
</html>`;

  const playgroundCss = `* { box-sizing: border-box; }
body {
  font-family: system-ui, sans-serif;
  margin: 32px;
  color: #1e293b;
  background: #f8fafc;
}
h2 { font-size: 1.15rem; margin-bottom: 4px; }
.hint {
  font-size: 0.82rem;
  color: #64748b;
  margin-bottom: 20px;
}
kbd {
  font-family: monospace;
  background: #e2e8f0;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  padding: 1px 5px;
  font-size: 0.78rem;
}
.row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
.card {
  flex: 1;
  min-width: 200px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 20px;
}
.label {
  font-family: monospace;
  font-size: 0.75rem;
  color: #94a3b8;
  margin: 0 0 12px;
}
.btn {
  display: inline-block;
  padding: 10px 22px;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  user-select: none;
}
.btn-fake {
  background: #3b82f6;
  color: white;
}
/* No :focus-visible here because a <div> never receives focus via Tab */
.btn-real {
  background: #3b82f6;
  color: white;
}
.btn-real:focus-visible {
  outline: 3px solid #93c5fd;
  outline-offset: 3px;
}
.output {
  margin-top: 10px;
  font-size: 0.82rem;
  color: #374151;
  min-height: 1.2em;
}`;

  const playgroundJs = `// Try this: click the page once to focus it, then press Tab.
// The <div> (fake button) is skipped entirely — Tab never lands on it.
// The <button> (real button) gets a visible focus ring.
// Press Space while the real button is focused — it fires.
// Press Space while anything else is focused — nothing from the fake button.

function fire(which) {
  if (which === 'fake') {
    document.getElementById('out-fake').textContent =
      'Fired! (but only by mouse click — Tab and Space can\\'t reach this)';
  } else {
    document.getElementById('out-real').textContent =
      'Fired! (mouse click, Enter, or Space — all work)';
  }
}`;

  return (
    <div className="space-y-8">

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 1: Hook                                                       */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Card>
        <CardContent className="pt-6">
          <div className="prose dark:prose-invert max-w-none">
            <p>
              70% of accessibility bugs are caught by pressing Tab. Most teams never press it. The
              result is a web that locks out keyboard users, screen-reader users, and — on a bad
              day — the same users on a slow phone with a glitchy touchscreen. No special equipment,
              no screen reader, no disability required to reproduce these bugs: just Tab, Shift+Tab,
              Space, and Enter.
            </p>
            <p>
              This module teaches you to read a page the way a keyboard user reads it, understand
              the contract between HTML semantics and assistive technology, and apply the handful of
              rules that cover the vast majority of real-world accessibility failures. By the end
              you&apos;ll be able to tab through any page, immediately spot what&apos;s broken, and
              know exactly why — and what the fix is.
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
              Every HTML element carries an implicit contract with the browser&apos;s accessibility
              tree: a <code>&lt;button&gt;</code> announces its role as &quot;button,&quot; accepts
              keyboard focus, and responds to Space and Enter. A <code>&lt;div&gt;</code> announces
              nothing, accepts no focus, and responds to nothing — it is structurally invisible to
              assistive technology. Accessibility is not a layer of polish you apply after the
              feature ships; it is baked into which elements you choose. When you pick the right
              element, the browser handles the entire contract for free. When you pick the wrong
              one, you owe that contract as custom code — and most teams never pay it.
            </p>
            <blockquote className="border-l-4 border-blue-500 pl-4 italic">
              &quot;Accessibility is a baseline, not a feature. The first rule of ARIA: don&apos;t
              use ARIA — use the right HTML element first.&quot;
            </blockquote>
          </div>
        </CardContent>
      </Card>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 3: Step-by-step                                               */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <StepByStepExplanation
        title="From keyboard-broken to keyboard-first"
        description="Six steps that cover the most common accessibility failures on the modern web"
        steps={steps}
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 4: Live playground                                            */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <HTMLPlayground
        html={playgroundHtml}
        css={playgroundCss}
        js={playgroundJs}
        title="Tab to feel the difference"
        description="Two visually identical buttons — one is a <div>, one is a <button>. Tab through them and press Space to see which one the browser treats as interactive."
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 5: Challenges                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Challenge
        question="You built a custom dropdown out of <div> elements. What is the minimum work to make it accessible?"
        options={[
          { id: "a", text: 'Add aria-label="Dropdown" to the outer <div>.' },
          {
            id: "b",
            text: "Replace it with a native <select>, or add role=\"combobox\" plus full keyboard handling (arrow keys, Enter, Escape) and aria-expanded.",
          },
          { id: "c", text: "Wrap it in a <button>." },
          { id: "d", text: 'Add tabindex="0" and call it done.' },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            Accessibility for a non-native widget is a <em>contract</em>: announce role, handle
            keyboard, manage focus, expose state. A native <code>&lt;select&gt;</code> fulfills that
            entire contract for free; <code>role=&quot;combobox&quot;</code> does none of it on its
            own — you must ship the arrow-key navigation, Enter/Escape handling, focus management,
            and <code>aria-expanded</code> state yourself. Half-measures like options a, c, and d
            only fool sighted keyboard users into thinking the widget works while screen-reader
            users are left with a silent, inoperable control.
          </>
        }
      />

      <Challenge
        question="What WCAG AA contrast ratio is required for normal-size body text?"
        options={[
          { id: "a", text: "3:1" },
          { id: "b", text: "4.5:1" },
          { id: "c", text: "7:1" },
          { id: "d", text: "21:1 (the maximum — pure black on pure white)" },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            WCAG AA requires <strong>4.5:1</strong> for normal text and <strong>3:1</strong> for
            large text (18 pt or 14 pt bold) and UI component boundaries like button borders and
            input outlines. The 7:1 target is WCAG AAA — the higher, aspirational bar. 21:1 is the
            theoretical maximum contrast (pure black on pure white), not a standard. If you remember
            one number, remember 4.5:1.
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
              "tabindex={-1} removes from sequence but stays focusable; tabindex={0} adds to natural sequence — tabindex={1+} is almost always a bug",
            body: (
              <>
                <code>tabindex=&quot;-1&quot;</code> means &quot;not in the Tab sequence, but
                reachable via <code>focus()</code> in JavaScript&quot; — useful for programmatically
                focusing a dialog header. <code>tabindex=&quot;0&quot;</code> inserts the element
                into the natural DOM-order Tab sequence. Any positive value (
                <code>tabindex=&quot;1&quot;</code>, <code>tabindex=&quot;2&quot;</code>, …)
                overrides the natural sequence globally and almost always produces confusing, broken
                Tab order. The only correct values are 0 and -1.
              </>
            ),
          },
          {
            title:
              "aria-hidden=true on a focusable element creates a phantom-focus bug — Tab lands on something the screen reader pretends doesn't exist",
            body: (
              <>
                <code>aria-hidden=&quot;true&quot;</code> hides an element from the accessibility
                tree, but it does not remove it from the Tab sequence. If that element is a{" "}
                <code>&lt;button&gt;</code> or has <code>tabindex=&quot;0&quot;</code>, Tab will
                still land on it — but the screen reader announces nothing, leaving users on a
                mystery focus target they cannot identify or interact with. Fix: also add{" "}
                <code>tabindex=&quot;-1&quot;</code>, or better, <code>inert</code>, when you hide
                something from the accessibility tree.
              </>
            ),
          },
          {
            title:
              "Color alone is not a name — every icon button needs an accessible name (aria-label or visible text)",
            body: (
              <>
                A button that renders a red X icon looks like &quot;close&quot; to sighted users.
                To a screen reader it is &quot;button&quot; — or worse, nothing. Accessible names
                come from visible text content, <code>aria-label</code>,{" "}
                <code>aria-labelledby</code>, or (for images) <code>alt</code>. Color, shape,
                position, and icon choice carry zero semantic weight in the accessibility tree.
                Always add <code>aria-label=&quot;Close&quot;</code> to icon-only buttons.
              </>
            ),
          },
          {
            title:
              "Skip-links must be visible on focus or they don't help anyone — position: absolute; left: -10000px plus :focus { left: 0 } is the canonical trick",
            body: (
              <>
                A skip-link positioned off-screen with <code>left: -10000px</code> is invisible
                until it receives keyboard focus — at which point the <code>:focus</code> rule moves
                it to <code>left: 0</code> so it appears. Without the focus rule, the link is
                permanently hidden and keyboard users can&apos;t see it even as they Tab past it,
                defeating its purpose entirely. Always pair the off-screen hide with a{" "}
                <code>:focus-visible</code> style that brings it back into the viewport.
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
            Press Tab. If the keyboard can&apos;t reach it, no assistive technology can either —
            and you catch 70% of bugs before opening a screen reader.
          </>,
          <>
            Use the right HTML element first; reach for ARIA only when HTML can&apos;t express the
            role. A <code>&lt;button&gt;</code> implements the full accessible contract for free;
            a <code>&lt;div&gt;</code> does not.
          </>,
          <>
            Focus order should match visual order. Flexbox <code>order</code> and absolute
            positioning are visual tricks, not structural ones — the DOM order is what Tab follows.
          </>,
          <>
            Every interactive element needs an accessible name. Color and shape are not names — icon
            buttons need <code>aria-label</code> or visible text.
          </>,
          <>
            WCAG AA requires <strong>4.5:1</strong> contrast for body text and{" "}
            <strong>3:1</strong> for large text and UI components. Measure with DevTools or axe;
            don&apos;t eyeball it.
          </>,
        ]}
        mentalModel="Accessibility is a baseline, not a feature. The first rule of ARIA: don't use ARIA — use the right HTML element first."
      />
    </div>
  );
}
