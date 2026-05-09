"use client";

import { Card, CardContent } from "@/components/ui/card";
import { HTMLPlayground } from "@/components/CodePlayground";
import { StepByStepExplanation, Step } from "@/components/StepByStepExplanation";
import { Challenge } from "@/components/Challenge";
import { GotchaList } from "@/components/GotchaList";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { RoadmapLink } from "@/components/RoadmapLink";

export function Module_7_1_Content() {
  // Data blocks hoisted out of JSX for readability — listed in render order.

  const webComponentSteps: Step[] = [
    {
      title: "Step 1: Define a Custom Element",
      description: (
        <>
          A <strong>Custom Element</strong> is a class extending <code>HTMLElement</code> and
          registered via <code>customElements.define()</code>. The string name you pass must contain
          a hyphen — that rule exists so the browser can distinguish your elements from future
          built-in HTML elements that might share a short name. Once registered, you use it like any
          other HTML tag. The browser calls your class each time it encounters that tag.
        </>
      ),
      code: `class MyCounter extends HTMLElement {
  // The class is your component's logic.
  // HTMLElement gives you the full DOM API.
}

// The hyphen is required — e.g. "my-counter", not "mycounter".
customElements.define("my-counter", MyCounter);

// Now usable in HTML anywhere on the page:
// <my-counter></my-counter>`,
    },
    {
      title: "Step 2: Lifecycle callbacks",
      description: (
        <>
          The browser calls four methods on your class at predictable moments.{" "}
          <code>connectedCallback</code> fires when the element is inserted into the document — this
          is where you build your DOM and attach listeners. <code>disconnectedCallback</code> fires
          when the element is removed — use it to cancel timers and remove listeners.{" "}
          <code>attributeChangedCallback</code> fires when one of the element&apos;s observed
          attributes changes — you declare which attributes to watch in the static{" "}
          <code>observedAttributes</code> array. The constructor runs earliest but the element is
          not yet in the document, so never touch the DOM there.
        </>
      ),
      code: `class MyCounter extends HTMLElement {
  // Declare which attributes fire attributeChangedCallback.
  static observedAttributes = ["start"];

  constructor() {
    super();
    // Only safe to set internal state here.
    // Do NOT touch the DOM here.
    this._count = 0;
  }

  connectedCallback() {
    // Element is now in the document — build UI here.
    this._render();
  }

  disconnectedCallback() {
    // Element removed — cancel timers, remove listeners.
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // "start" attribute changed — react to the new value.
    if (name === "start") {
      this._count = parseInt(newValue, 10) || 0;
      this._render();
    }
  }
}`,
    },
    {
      title: "Step 3: Shadow DOM for style encapsulation",
      description: (
        <>
          <strong>Shadow DOM</strong> is a subtree attached to an element whose styles and IDs are
          encapsulated from the outer document. You attach one by calling{" "}
          <code>{"this.attachShadow({ mode: 'open' })"}</code> in the constructor. Styles written
          inside the shadow root do not leak out to the page, and global page styles do not leak in.
          This is real encapsulation — not a class-naming convention like BEM, not a build-time hash
          like CSS Modules. The selector <code>:host</code> targets the custom element itself from
          inside its shadow root, which is how you style its outer box without exposing internal
          class names.
        </>
      ),
      code: `class MyCounter extends HTMLElement {
  constructor() {
    super();
    // mode: "open" lets JavaScript outside the component
    // reach this.shadowRoot. "closed" blocks that.
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const style = document.createElement("style");
    style.textContent = \`
      :host {
        display: block;         /* shadow root is inline by default */
        padding: 16px;
        border: 2px solid #3b82f6;
        border-radius: 8px;
      }
      button { background: #3b82f6; color: white; border: none; }
      /* This rule cannot affect buttons outside the shadow root. */
    \`;
    this.shadowRoot.appendChild(style);
  }
}`,
    },
    {
      title: "Step 4: Templates — inert HTML stamped on demand",
      description: (
        <>
          A <code>&lt;template&gt;</code> is an inert HTML fragment that the browser parses but
          never renders or executes until you clone it. That makes it efficient to reuse across many
          element instances: the parser work happens once. You clone the template&apos;s content
          with <code>template.content.cloneNode(true)</code> and append the clone into the shadow
          root. Because each instance gets its own clone, state inside one element never bleeds into
          another.
        </>
      ),
      code: `<!-- In your HTML file, declare once: -->
<template id="card-tmpl">
  <style>
    :host { display: block; padding: 16px; }
    h2 { color: #1e293b; }
  </style>
  <h2></h2>
  <slot></slot>
</template>

// In your class:
connectedCallback() {
  const tmpl = document.getElementById("card-tmpl");
  // cloneNode(true) deep-copies all descendants.
  const clone = tmpl.content.cloneNode(true);
  // Customize the clone before appending.
  clone.querySelector("h2").textContent =
    this.getAttribute("heading") ?? "Card";
  this.shadowRoot.appendChild(clone);
}`,
    },
    {
      title: "Step 5: Slots — projecting host content into the shadow tree",
      description: (
        <>
          A <strong>slot</strong> is a <code>&lt;slot&gt;</code> element inside a Web Component
          template that fills with light-DOM children projected by the host. &quot;Light DOM&quot;
          is the normal children you write between the element&apos;s opening and closing tags. The
          shadow root receives those children through its named or default slot. Named slots let you
          split host content across multiple injection points — a header slot and a body slot, for
          instance. Slotted content stays in the light DOM; it is only visually projected, so its
          styles remain under the outer page&apos;s control, not the shadow root&apos;s.
        </>
      ),
      code: `<!-- Shadow root template: -->
<template id="card-tmpl">
  <div class="header">
    <slot name="title">Untitled</slot>   <!-- named slot -->
  </div>
  <div class="body">
    <slot></slot>                        <!-- default slot -->
  </div>
</template>

<!-- Host usage — children project through the slots: -->
<my-card>
  <h3 slot="title">Hello</h3>  <!-- goes into name="title" -->
  <p>Body paragraph.</p>       <!-- goes into default slot -->
</my-card>`,
    },
    {
      title: "Step 6: When to reach for Web Components",
      description: (
        <>
          Web Components are the right tool when a component must outlive a single framework or work
          across many apps and teams — a company-wide design system consumed by a React dashboard,
          a Vue marketing site, and a 12-year-old jQuery admin panel simultaneously. A{" "}
          <code>&lt;ds-button&gt;</code> registered in one bundle file works in all three without
          any adapter. They are also strong for long-lived widgets (a video player, a chat box)
          embedded in legacy pages where importing a framework is not an option. When NOT to use
          them: tightly-coupled UI inside a single React app. You give up hooks, server components,
          and the React ecosystem without gaining any cross-framework portability you actually need.
          Pick by the goal, not by novelty.
        </>
      ),
      code: `// Good fit — a shared design-system button
// Registered once, works in any framework:
customElements.define("ds-button", DsButton);

// React:      <ds-button variant="primary">Save</ds-button>
// Vue:        <ds-button variant="primary">Save</ds-button>
// Plain HTML: <ds-button variant="primary">Save</ds-button>

// Poor fit — a form inside one Next.js app.
// You want React hooks, not custom elements:
function LoginForm() {
  const [email, setEmail] = useState("");
  // useEffect, server actions, React context, etc.
  // None of those work natively in a custom element.
  return <form>...</form>;
}`,
    },
  ];

  const playgroundHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Web Components Demo</title>
</head>
<body>
  <!--
    Try: change start="5" to start="100" on the first counter;
    attributeChangedCallback fires and it resets immediately.
    Duplicate the my-counter tag to add a second counter —
    each shadow root is independent so their counts never mix.
  -->
  <my-counter start="5">
    <span slot="label">Clicks</span>
  </my-counter>

  <my-counter start="0">
    <span slot="label">Score</span>
  </my-counter>

  <my-card style="margin-top:24px; display:block">
    <span slot="title">Shadow DOM card</span>
    <p>This paragraph lives in the light DOM, projected through
       the default slot. The card controls its own header styles;
       this paragraph keeps the outer page styles.</p>
  </my-card>

  <script src="/script.js"></script>
</body>
</html>`;

  const playgroundCss = `body {
  font-family: system-ui, sans-serif;
  padding: 24px;
  background: #f8fafc;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-start;
}`;

  const playgroundJs = `// Try this: change <my-counter start="10"> below to start="100" — the
// attributeChangedCallback fires and the counter resets. Then add another
// <my-counter> next to it; their state is independent because each
// shadow root holds its own. The encapsulation is real.

// ── Custom Element: <my-counter> ───────────────────────────────────────
class MyCounter extends HTMLElement {
  static observedAttributes = ["start"];

  constructor() {
    super();
    this._count = 0;
    this._output = null;
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this._count = parseInt(this.getAttribute("start") ?? "0", 10);
    this._buildShadow();
  }

  disconnectedCallback() {
    // If we had timers or external listeners, clean up here.
  }

  attributeChangedCallback(name, _old, value) {
    if (name === "start") {
      this._count = parseInt(value ?? "0", 10);
      if (this._output) {
        this._output.textContent = String(this._count);
      }
    }
  }

  _buildShadow() {
    const style = document.createElement("style");
    style.textContent = [
      ":host {",
      "  display: inline-flex;",
      "  flex-direction: column;",
      "  align-items: center;",
      "  gap: 10px;",
      "  padding: 24px 32px;",
      "  background: white;",
      "  border-radius: 12px;",
      "  box-shadow: 0 4px 16px rgba(0,0,0,.08);",
      "}",
      ".label {",
      "  font-size: .75rem;",
      "  text-transform: uppercase;",
      "  letter-spacing: .1em;",
      "  color: #64748b;",
      "}",
      "output {",
      "  font-size: 2.5rem;",
      "  font-weight: 700;",
      "  color: #3b82f6;",
      "}",
      "button {",
      "  padding: 8px 24px;",
      "  border: none;",
      "  border-radius: 6px;",
      "  background: #3b82f6;",
      "  color: white;",
      "  font-size: .9rem;",
      "  cursor: pointer;",
      "}",
      "button:hover { background: #2563eb; }",
    ].join("\\n");

    const labelEl = document.createElement("span");
    labelEl.className = "label";
    const slot = document.createElement("slot");
    slot.name = "label";
    slot.textContent = "Count";
    labelEl.appendChild(slot);

    const output = document.createElement("output");
    output.textContent = String(this._count);
    this._output = output;

    const btn = document.createElement("button");
    btn.textContent = "Increment";
    btn.addEventListener("click", () => {
      this._count++;
      output.textContent = String(this._count);
    });

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(labelEl);
    this.shadowRoot.appendChild(output);
    this.shadowRoot.appendChild(btn);
  }
}
customElements.define("my-counter", MyCounter);

// ── Custom Element: <my-card> ──────────────────────────────────────────
class MyCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const style = document.createElement("style");
    style.textContent = [
      ":host { display: block; }",
      ".card {",
      "  background: white;",
      "  border-radius: 12px;",
      "  box-shadow: 0 4px 16px rgba(0,0,0,.08);",
      "  overflow: hidden;",
      "}",
      ".header {",
      "  background: #1e293b;",
      "  color: white;",
      "  padding: 12px 20px;",
      "  font-weight: 600;",
      "}",
      ".body { padding: 16px 20px; }",
    ].join("\\n");

    const card = document.createElement("div");
    card.className = "card";

    const header = document.createElement("div");
    header.className = "header";
    const titleSlot = document.createElement("slot");
    titleSlot.name = "title";
    titleSlot.textContent = "Card";
    header.appendChild(titleSlot);

    const body = document.createElement("div");
    body.className = "body";
    const defaultSlot = document.createElement("slot");
    body.appendChild(defaultSlot);

    card.appendChild(header);
    card.appendChild(body);

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(card);
  }
}
customElements.define("my-card", MyCard);`;

  return (
    <div className="space-y-8">

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 1: Hook                                                      */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Card>
        <CardContent className="pt-6">
          <div className="prose dark:prose-invert max-w-none">
            <p>
              Two teams ship a button. One ships a React component that only works inside React. The
              other ships a <code>&lt;gov-button&gt;</code> element that works in React, Vue, vanilla
              HTML, and a 12-year-old jQuery codebase. Web Components are the platform&apos;s answer
              to &quot;reusable across frameworks&quot; — slow to gain ground because the developer
              experience is rougher than React, but unbeatable for design systems that outlive the
              framework.
            </p>
            <p>
              The platform gives you three APIs that compose: <strong>Custom Elements</strong>{" "}
              register new HTML tags with lifecycle callbacks, <strong>Shadow DOM</strong> gives each
              element its own style-encapsulated subtree, and{" "}
              <strong>
                <code>&lt;template&gt;</code> / <code>&lt;slot&gt;</code>
              </strong>{" "}
              handle inert markup and content projection. You do not need a framework to use them —
              or to use them alongside one. By the end of this module you will have built a working{" "}
              <code>&lt;my-counter&gt;</code> with Shadow DOM encapsulation, observed attributes, and
              named slots.
            </p>
          </div>
          <div className="mt-4">
            <RoadmapLink url="https://roadmap.sh/frontend" />
          </div>
        </CardContent>
      </Card>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 2: Mental model first                                        */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Card>
        <CardContent className="pt-6">
          <div className="prose dark:prose-invert max-w-none">
            <p>
              Think of a Web Component as three concentric boundaries. The outermost boundary is the{" "}
              <strong>Custom Element</strong> tag itself — a new HTML vocabulary word the browser
              accepts anywhere HTML is valid, regardless of which framework renders the page around
              it. The middle boundary is the <strong>Shadow DOM</strong> — a sealed subtree where
              styles and IDs are isolated; what happens in the shadow root stays in the shadow root.
              The innermost boundary is the <strong>slot</strong> — a deliberate hole cut through the
              shadow boundary so the host page can inject its own content without gaining access to
              the element&apos;s internals. Each boundary solves one real problem: tag registration,
              style isolation, and content projection.
            </p>
            <blockquote className="border-l-4 border-blue-500 pl-4 italic">
              &quot;Custom Elements are framework-agnostic components. Shadow DOM is real style
              encapsulation, not class-name conventions. Slots project content from the host into the
              component.&quot;
            </blockquote>
          </div>
        </CardContent>
      </Card>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 3: Step-by-step                                              */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <StepByStepExplanation
        title="Building a Web Component, end to end"
        description="Six steps from an empty class to a fully encapsulated, slot-powered element"
        steps={webComponentSteps}
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 4: Playground                                                */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <HTMLPlayground
        html={playgroundHtml}
        css={playgroundCss}
        js={playgroundJs}
        title="Live: <my-counter> and <my-card>"
        description="Two custom elements with Shadow DOM, observed attributes, and named slots. Try changing the start attribute or adding a second counter."
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 5: Challenges                                                */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Challenge
        question="Which lifecycle callback fires when a custom element is removed from the DOM?"
        options={[
          { id: "a", text: "connectedCallback" },
          { id: "b", text: "disconnectedCallback" },
          { id: "c", text: "attributeChangedCallback" },
          { id: "d", text: "removeCallback" },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            The platform names it <code>disconnectedCallback</code>, paired with{" "}
            <code>connectedCallback</code> for insertion. <code>attributeChangedCallback</code> only
            fires on observed attribute changes, not on removal. There is no{" "}
            <code>removeCallback</code> — that name does not exist in the spec.
          </>
        }
      />

      <Challenge
        question="Your team builds a single Next.js app for one product. Does adopting Web Components add value over React?"
        options={[
          {
            id: "a",
            text: "Yes — Web Components are always better than React for performance.",
          },
          {
            id: "b",
            text: "No — Web Components shine when components must outlive a framework or work across many apps. Inside one React app, you lose React's ergonomics (hooks, server components, ecosystem) without gaining cross-framework portability you don't need.",
          },
          {
            id: "c",
            text: "Yes — Shadow DOM is faster than React's rendering.",
          },
          {
            id: "d",
            text: "It doesn't matter; they're equivalent.",
          },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            Pick by the goal. Single-stack app: React stays — hooks, server components, and the
            broader ecosystem are real advantages you would give up. Design system shipped across
            many teams and frameworks: Web Components earn their keep because the browser, not any
            framework, is the runtime. Performance comparisons (options a and c) miss the point —
            both approaches are fast enough for almost any UI; the trade is portability versus
            ecosystem ergonomics.
          </>
        }
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 6: GotchaList                                                */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <GotchaList
        items={[
          {
            title: "Lifecycle order: constructor → connectedCallback → attributeChangedCallback → disconnectedCallback — code that touches the DOM goes in connectedCallback, not constructor",
            body: (
              <>
                The constructor runs before the element is added to the document, so{" "}
                <code>this.shadowRoot</code> exists (if you called <code>attachShadow</code> there)
                but any attempt to read attributes or parent nodes will return wrong values. Always
                defer DOM work to <code>connectedCallback</code>.
              </>
            ),
          },
          {
            title: "Shadow DOM blocks CSS from leaking *in* and *out* — global resets and CSS variables need explicit :host declarations or inheritance",
            body: (
              <>
                A global <code>{"* { box-sizing: border-box }"}</code> rule does not apply inside
                your shadow root. Neither do your design-system font-size resets. CSS custom
                properties (variables) are the standard escape hatch: they cross the shadow boundary
                via inheritance, so declaring <code>--color-primary</code> on the host element is
                the idiomatic way to theme a Web Component.
              </>
            ),
          },
          {
            title: "observedAttributes is a static array; dynamic attribute names won't trigger attributeChangedCallback",
            body: (
              <>
                <code>attributeChangedCallback</code> only fires for attributes listed in{" "}
                <code>static observedAttributes</code>. If you add <code>data-*</code> attributes at
                runtime and forget to list them, the callback silently does nothing. No error is
                thrown — the most common trap is a mistyped attribute name in the static array.
              </>
            ),
          },
          {
            title: "Web Components and React coexist — but binding events between them takes glue (addEventListener and dispatchEvent instead of React props)",
            body: (
              <>
                React&apos;s synthetic event system does not attach to shadow-root nodes. Custom
                events dispatched from inside a shadow root that set{" "}
                <code>{"{ composed: true }"}</code> will cross the shadow boundary; React can hear
                them with a plain <code>addEventListener</code> on the host element. Going the other
                direction — passing React state into a Web Component — means setting DOM properties
                or attributes imperatively via a ref, not via JSX props that happen to match.
              </>
            ),
          },
        ]}
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 7: KeyTakeaways                                              */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <KeyTakeaways
        points={[
          <>
            A <strong>Custom Element</strong> is a class extending <code>HTMLElement</code>,
            registered with <code>{"customElements.define(\"tag-name\", Class)"}</code>. The hyphen in the
            tag name is required to distinguish custom elements from built-in HTML elements.
          </>,
          <>
            The four lifecycle callbacks fire in order: <code>constructor</code> (internal init
            only), <code>connectedCallback</code> (added to DOM — build UI here),{" "}
            <code>attributeChangedCallback</code> (observed attribute changed), and{" "}
            <code>disconnectedCallback</code> (removed from DOM — clean up here).
          </>,
          <>
            <strong>Shadow DOM</strong> is real style encapsulation: styles inside the shadow root
            cannot leak out, and external styles cannot leak in. The <code>:host</code> selector
            targets the element itself from inside; CSS custom properties cross the boundary via
            inheritance and are the standard theming mechanism.
          </>,
          <>
            A <code>&lt;template&gt;</code> is inert HTML parsed once and cloned many times.{" "}
            <code>&lt;slot&gt;</code> elements inside the shadow root are holes through which the
            host&apos;s light-DOM children are visually projected — they remain in the light DOM, so
            the outer page still controls their styling.
          </>,
          <>
            Reach for Web Components when a component must work across multiple frameworks or
            long-lived codebases. Inside a single React app, prefer React — you keep hooks, server
            components, and the ecosystem without losing anything.
          </>,
        ]}
        mentalModel="Custom Elements are framework-agnostic components. Shadow DOM is real style encapsulation, not class-name conventions. Slots project content from the host into the component."
      />
    </div>
  );
}
