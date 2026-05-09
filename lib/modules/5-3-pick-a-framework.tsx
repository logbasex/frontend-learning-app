"use client";

import { ScaffoldModule } from "./_template";
import { CodeBlock } from "@/components/CodeBlock";

const threeWays = `// ─── 1. React ─────────────────────────────────────────────────────────────────
// useState stores a value; React re-runs the entire component when it changes,
// then diffs the result against a virtual DOM to compute minimal DOM updates.

import { useState } from "react";

function HelloReact() {
  const [name, setName] = useState("World");
  return (
    <div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
      />
      <p>Hello, {name}!</p>
    </div>
  );
}

// ─── 2. Svelte ────────────────────────────────────────────────────────────────
// Svelte is a COMPILER. The \`bind:value\` directive compiles to precise DOM
// assignments — no virtual DOM, no runtime diffing.
// (Svelte uses .svelte files; this snippet shows the syntax pattern)

// <script>
//   let name = "World";
// </script>
//
// <input bind:value={name} placeholder="Enter your name" />
// <p>Hello, {name}!</p>

// The compiler tracks that \`name\` is used in the <p> and emits code that
// updates ONLY that text node when \`name\` changes — nothing else rerenders.

// ─── 3. Solid ─────────────────────────────────────────────────────────────────
// Solid also compiles fine-grained reactivity, but uses JSX like React.
// createSignal returns a [getter, setter] pair (not a value directly).
// The compiler records which DOM expressions depend on each signal.

import { createSignal } from "solid-js";

function HelloSolid() {
  const [name, setName] = createSignal("World");
  // Note: name is a FUNCTION — call it to read the value: name()
  return (
    <div>
      <input
        value={name()}
        onInput={(e) => setName(e.currentTarget.value)}
        placeholder="Enter your name"
      />
      <p>Hello, {name()}!</p>
    </div>
  );
}
// When setName() is called, Solid updates ONLY the DOM nodes that called name().
// The component function itself never re-runs after the initial render.`;

export function Module_5_3_Content() {
  return (
    <ScaffoldModule
      emoji="🧩"
      problemTitle="React, Vue, Angular, Svelte, Solid, Qwik — the reactivity question"
      problem={
        <>
          <p>
            Every UI framework answers the same core question:{" "}
            <em>how do we update the DOM when state changes?</em> React
            re-executes the component function and runs a{" "}
            <strong>virtual DOM diff</strong> to figure out the minimal set of
            real DOM mutations needed. It is predictable and the ecosystem is
            enormous, but the re-render cost is proportional to component tree
            size. Vue blends a virtual DOM with a reactive proxy system — it
            tracks which properties each component reads and only re-renders
            affected components. Angular is opinionated and batteries-included,
            with a two-way binding system, a built-in DI container, and a full
            CLI toolchain — preferred for large teams that want structure
            enforced by the framework.
          </p>
          <p>
            <strong>Svelte</strong> and <strong>Solid</strong> move reactivity
            to compile time. A Svelte compiler analyses the template and emits
            JavaScript that surgically updates the exact DOM nodes that depend
            on each variable — no runtime diffing required. Solid uses JSX but
            compiles it similarly: <code>createSignal</code> creates a reactive
            atom, and the compiler records which DOM expressions depend on which
            signals. When a signal changes, only those exact expressions update;
            the component function never re-runs. <strong>Qwik</strong> takes a
            different angle — it serialises application state to HTML during
            SSR, then resumes from that state on the client without re-running
            or re-downloading component code, achieving near-zero JS on initial
            load.
          </p>
          <p>
            The &quot;best&quot; framework is usually the one your team already
            knows well. React has the largest hiring pool and ecosystem. Svelte
            and Solid give excellent performance with a smaller bundle. Angular
            gives structure to large teams. Vue is often praised for its gentle
            learning curve. Pick based on team familiarity and ecosystem fit —
            boring, well-understood tooling ships faster than exciting new
            tooling your team is still learning.
          </p>
        </>
      }
      body={
        <CodeBlock
          language="tsx"
          fileName="hello-name-three-ways.tsx"
          code={threeWays}
        />
      }
      challenge={{
        question: "Why does Solid not need a virtual DOM diff?",
        options: [
          {
            id: "a",
            text: "Solid uses WebAssembly under the hood to update the DOM faster than JavaScript can.",
          },
          {
            id: "b",
            text: "Solid re-runs the whole component but caches the previous output to skip unchanged parts.",
          },
          {
            id: "c",
            text: "Solid's compiler tracks which signals each piece of UI depends on, and updates ONLY those exact DOM nodes when a signal changes — no diffing required.",
          },
          {
            id: "d",
            text: "Solid batches all DOM updates into a single requestAnimationFrame, making diffing unnecessary.",
          },
        ],
        correctAnswerId: "c",
        explanation: (
          <>
            At compile time, Solid analyses every JSX expression that references
            a signal. For each one it emits a fine-grained effect that runs only
            when that specific signal changes and updates only that specific DOM
            node. There is no tree to diff because the mapping from signal to
            DOM node is known statically. The component function runs once
            during setup and never again — subsequent updates are handled
            entirely by the compiled effects.
          </>
        ),
      }}
      takeaways={[
        <>
          Frameworks differ on where reactivity lives — virtual DOM diffing
          (React), compiled fine-grained updates (Svelte, Solid), reactive
          proxies with a virtual DOM (Vue), or resumability (Qwik). Each
          trade-off affects bundle size, runtime performance, and DX.
        </>,
        <>
          React&apos;s re-render model is predictable and well-understood by a
          huge developer pool. Svelte and Solid achieve better runtime
          performance by shifting work to compile time, but have smaller
          ecosystems.
        </>,
        <>
          Boring is fine. Team familiarity and ecosystem maturity ship features
          faster than chasing the fastest benchmark. Pick the framework your
          team can maintain confidently over years.
        </>,
      ]}
      mentalModel="Frameworks differ on where reactivity lives — diffing (React), compiled-fine-grained (Svelte/Solid), or hybrid (Vue). Boring is fine; team beats framework."
      roadmapUrl="https://roadmap.sh/frontend"
    />
  );
}
