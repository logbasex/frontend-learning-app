"use client";
import { ScaffoldModule } from "./_template";
import { HTMLPlayground } from "@/components/CodePlayground";

export function Module_2_3_Content() {
  return (
    <ScaffoldModule
      emoji="♿"
      problemTitle="Keyboard-only users can't use most of the modern web"
      problem={
        <>
          <p>
            About 26% of adults in the US live with some form of disability, and
            a meaningful portion of them navigate the web exclusively via
            keyboard, switch access, or screen reader software. Yet most modern
            web apps are built entirely around mouse and touch, leaving these
            users to tab through pages that offer no visible focus indicator, no
            way to skip repetitive navigation, and interactive widgets that only
            respond to clicks.
          </p>
          <p>
            The <strong>first rule of ARIA</strong> (Accessible Rich Internet
            Applications) is: do not use ARIA if you can use the right native
            HTML element instead. A <code>&lt;button&gt;</code> is keyboard
            focusable, activatable with Enter and Space, announced as &ldquo;button&rdquo;
            by screen readers, and included in the browser&apos;s accessibility
            tree by default &mdash; for free. A <code>&lt;div&gt;</code> gives
            you none of that unless you manually bolt on <code>role=&quot;button&quot;</code>,{" "}
            <code>tabindex=&quot;0&quot;</code>, a keydown handler for Enter and
            Space, and the correct ARIA state attributes.
          </p>
          <p>
            <strong>Visible focus rings</strong> are not optional. The CSS rule{" "}
            <code>outline: none</code> is responsible for making millions of
            pages impossible for keyboard users to navigate. Browsers apply a
            default focus ring because it is a navigational aid, not a cosmetic
            annoyance. If the default style clashes with your design, replace it
            with a custom <code>:focus-visible</code> style &mdash; never simply
            remove it.
          </p>
          <p>
            <strong>Skip links</strong> are hidden-until-focused anchor tags
            placed at the very top of the document body that jump directly to
            the <code>&lt;main&gt;</code> element. Without one, a keyboard user
            arriving on a page with a 40-link navigation bar must press Tab 40
            times before reaching the content. A single{" "}
            <code>&lt;a href=&quot;#main-content&quot;&gt;Skip to main content&lt;/a&gt;</code>{" "}
            solves the problem entirely.
          </p>
          <p>
            <strong>Colour contrast</strong> is another common failure. WCAG AA
            requires a contrast ratio of at least 4.5:1 for normal text and
            3:1 for large text. Light grey text on a white background might look
            minimal and trendy but renders the page unreadable for the 300 million
            people worldwide who have some form of colour vision deficiency.
            Browser DevTools and tools like the axe extension can audit contrast
            ratios automatically.
          </p>
        </>
      }
      body={
        <HTMLPlayground
          title="Three buttons — only one is truly accessible"
          description="Tab through the buttons and press Enter or Space. Watch what happens with each approach."
          html={`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <h2>Button accessibility comparison</h2>
  <p>Use <strong>Tab</strong> to move focus, <strong>Enter</strong> or <strong>Space</strong> to activate.</p>

  <div class="demo">
    <div class="label">✅ Native &lt;button&gt;</div>
    <button id="btn-native" class="btn btn-green">
      Click or press Enter/Space
    </button>
    <p id="out-native" class="output"></p>
  </div>

  <div class="demo">
    <div class="label">⚠️ &lt;div role="button" tabindex="0"&gt; (needs JS keyboard handler)</div>
    <div
      id="btn-div-role"
      class="btn btn-yellow"
      role="button"
      tabindex="0"
    >
      Click or press Enter/Space
    </div>
    <p id="out-div-role" class="output"></p>
  </div>

  <div class="demo">
    <div class="label">❌ &lt;div onclick&gt; (broken for keyboard)</div>
    <div
      id="btn-div-onclick"
      class="btn btn-red"
      onclick="document.getElementById('out-div-onclick').textContent='Clicked (mouse only)!'"
    >
      Try pressing Enter/Space — it won't work
    </div>
    <p id="out-div-onclick" class="output"></p>
  </div>

  <script src="/script.js"></script>
</body>
</html>`}
          css={`* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 24px; color: #111827; background: #f9fafb; }
h2 { font-size: 1.25rem; }
.demo { margin-bottom: 24px; padding: 16px; background: white;
        border: 1px solid #e5e7eb; border-radius: 8px; }
.label { font-size: 0.8rem; color: #6b7280; margin-bottom: 8px; font-family: monospace; }
.btn { display: inline-block; padding: 10px 20px; border-radius: 6px;
       cursor: pointer; font-size: 0.95rem; font-weight: 600;
       border: none; user-select: none; }
.btn-green { background: #16a34a; color: white; }
.btn-green:focus-visible { outline: 3px solid #4ade80; outline-offset: 3px; }
.btn-yellow { background: #d97706; color: white; }
.btn-yellow:focus-visible { outline: 3px solid #fcd34d; outline-offset: 3px; }
.btn-red { background: #dc2626; color: white; }
.output { margin: 8px 0 0; font-size: 0.875rem; color: #374151; min-height: 1.2em; }`}
          js={`// Native button: works out of the box
document.getElementById('btn-native').addEventListener('click', function() {
  document.getElementById('out-native').textContent =
    'Activated! (works with mouse, Enter, and Space)';
});

// div with role="button": needs explicit keyboard handler to be truly equivalent
const divRole = document.getElementById('btn-div-role');
divRole.addEventListener('click', function() {
  document.getElementById('out-div-role').textContent =
    'Activated via click!';
});
divRole.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    document.getElementById('out-div-role').textContent =
      'Activated via keyboard! (but we had to add this handler manually)';
  }
});

// The third div has no keyboard handler — it will not respond to Enter/Space.
// This is the most common accessibility bug on the modern web.`}
        />
      }
      challenge={{
        question: "Which CSS rule is the most common cause of keyboard-inaccessible interfaces?",
        options: [
          { id: "a", text: "display: flex" },
          { id: "b", text: "outline: none (or outline: 0)" },
          { id: "c", text: "pointer-events: none" },
          { id: "d", text: "visibility: hidden" },
        ],
        correctAnswerId: "b",
        explanation: (
          <>
            <code>outline: none</code> removes the browser&apos;s default focus
            ring, making it impossible for keyboard users to see which element
            has focus as they tab through a page. The fix is to replace it with
            a custom <code>:focus-visible</code> style rather than deleting the
            indicator entirely. <code>visibility: hidden</code> and{" "}
            <code>pointer-events: none</code> are legitimate tools but do not
            broadly break keyboard navigation.
          </>
        ),
      }}
      takeaways={[
        <>Prefer native semantic elements over ARIA roles; a real button gives keyboard support, screen reader announcements, and focus management for free.</>,
        <>Never remove focus rings with outline: none &mdash; replace them with a custom :focus-visible style that matches your design system.</>,
        <>Add a skip link at the top of every page so keyboard users can bypass repeated navigation and jump straight to the main content.</>,
      ]}
      mentalModel="Accessibility is not a feature you bolt on at the end &mdash; it is the structural integrity of your HTML; neglect it and the whole building is unsound for a quarter of your users."
      roadmapUrl="https://roadmap.sh/frontend"
    />
  );
}
