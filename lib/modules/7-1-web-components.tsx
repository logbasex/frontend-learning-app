"use client";

import { ScaffoldModule } from "./_template";
import { HTMLPlayground } from "@/components/CodePlayground";

// Sandpack static-template files — run inside a sandboxed iframe
const counterHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Custom Element Demo</title>
  <link rel="stylesheet" href="/styles.css" />
</head>
<body>
  <my-counter><span slot="label">Clicks</span></my-counter>
  <script src="/script.js"></script>
</body>
</html>`;

const counterCss = `body {
  font-family: sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
  background: #f0f4f8;
}`;

// The shadow root markup is kept as a static string because this code
// runs inside Sandpack's sandboxed iframe — it is controlled content, not
// user-supplied input.
const counterJs = `class MyCounter extends HTMLElement {
  constructor() {
    super();
    this._count = 0;
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    // Build shadow DOM with createElement — no user input involved
    const style = document.createElement('style');
    style.textContent = \`
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        padding: 32px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0,0,0,.1);
      }
      .label { font-size: 0.85rem; text-transform: uppercase;
               letter-spacing: .1em; color: #64748b; }
      output  { font-size: 3rem; font-weight: bold; color: #3b82f6; }
      button  { padding: 10px 28px; font-size: 1rem; border: none;
                border-radius: 8px; background: #3b82f6; color: white;
                cursor: pointer; transition: background .2s; }
      button:hover { background: #2563eb; }
    \`;

    const label = document.createElement('span');
    label.className = 'label';
    const slot = document.createElement('slot');
    slot.name = 'label';
    slot.textContent = 'Count';
    label.appendChild(slot);

    const output = document.createElement('output');
    output.textContent = '0';

    const btn = document.createElement('button');
    btn.textContent = 'Increment';
    btn.addEventListener('click', () => {
      this._count++;
      output.textContent = String(this._count);
    });

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(label);
    this.shadowRoot.appendChild(output);
    this.shadowRoot.appendChild(btn);
  }
}

// Tag names must contain a hyphen
customElements.define('my-counter', MyCounter);`;

export function Module_7_1_Content() {
  return (
    <ScaffoldModule
      emoji="🧱"
      problemTitle="The platform's own component model"
      problem={
        <>
          <p>
            Web Components are three browser APIs that work together:{" "}
            <strong>Custom Elements</strong> (
            <code>class MyEl extends HTMLElement</code>) let you register new
            HTML tags with full lifecycle callbacks; <strong>Shadow DOM</strong>{" "}
            attaches an encapsulated DOM subtree so that its internal styles and
            nodes are invisible to the outside world; and{" "}
            <strong>
              <code>&lt;template&gt;</code> / <code>&lt;slot&gt;</code>
            </strong>{" "}
            give you inert markup you can stamp out, with named insertion points
            that project host-element children into the shadow tree.
          </p>
          <p>
            The killer feature is <strong>framework-agnosticism</strong>. A Web
            Component registered in a plain HTML page works identically when
            imported into React, Vue, Angular, or Svelte — the browser owns the
            API, not any library. This makes them ideal for design systems that
            must work across multiple tech stacks (a company-wide{" "}
            <code>&lt;ui-button&gt;</code> consumed by a React dashboard{" "}
            <em>and</em> a legacy jQuery page).
          </p>
          <p>
            The catch: the ergonomics are bare-bones compared to React or Vue.
            There is no reactive state, no JSX, and no built-in template syntax.
            Libraries like <strong>Lit</strong> (Google) fill the gap by adding a
            thin declarative layer on top of the native APIs while keeping the
            zero-dependency, framework-agnostic nature.
          </p>
        </>
      }
      body={
        <HTMLPlayground
          html={counterHtml}
          css={counterCss}
          js={counterJs}
          title="Define a <my-counter> custom element"
          description="A real custom element with shadow-encapsulated styles and a slotted label. Click Increment to test."
        />
      }
      challenge={{
        question:
          "What does Shadow DOM give you that a regular <div> doesn't?",
        options: [
          {
            id: "a",
            text: "Faster rendering — the browser can skip reflow for shadow trees.",
          },
          {
            id: "b",
            text: "True style and DOM encapsulation — outside CSS can't accidentally bleed in, and DOM queries from outside don't see the shadow tree.",
          },
          {
            id: "c",
            text: "Automatic two-way data binding between the host element and its children.",
          },
          {
            id: "d",
            text: "Built-in server-side rendering support for custom elements.",
          },
        ],
        correctAnswerId: "b",
        explanation: (
          <>
            Shadow DOM creates a scoped DOM subtree. Styles defined inside the
            shadow root do not leak out, and external stylesheets cannot
            unintentionally style shadow internals. Likewise,{" "}
            <code>document.querySelector</code> cannot traverse into a shadow
            root — you must go through <code>element.shadowRoot</code>. This is
            real encapsulation, not just a naming convention.
          </>
        ),
      }}
      takeaways={[
        <>
          <strong>Custom Elements</strong> let you define reusable HTML tags
          with lifecycle hooks (<code>connectedCallback</code>,{" "}
          <code>attributeChangedCallback</code>) using plain JavaScript classes.
        </>,
        <>
          <strong>Shadow DOM</strong> provides true style and DOM encapsulation
          — styles inside cannot leak out, and external CSS cannot accidentally
          style internals.
        </>,
        <>
          <code>&lt;slot&gt;</code> lets consumers project their own markup into
          named insertion points inside the shadow tree, enabling flexible
          composition without breaking encapsulation.
        </>,
      ]}
      mentalModel="Custom Elements + Shadow DOM + <template> = the platform's own component model. Framework-agnostic, ergonomically bare."
      roadmapUrl="https://roadmap.sh/frontend"
    />
  );
}
