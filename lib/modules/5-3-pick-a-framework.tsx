"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ReactPlayground } from "@/components/CodePlayground";
import { StepByStepExplanation, Step } from "@/components/StepByStepExplanation";
import { Challenge } from "@/components/Challenge";
import { GotchaList } from "@/components/GotchaList";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { RoadmapLink } from "@/components/RoadmapLink";

// ─── Step definitions ────────────────────────────────────────────────────────

const reactIntuitionSteps: Step[] = [
  {
    title: "Step 1: Components and JSX",
    description: (
      <>
        A React component is a plain JavaScript function that returns JSX. JSX looks like HTML but
        compiles to <code>React.createElement</code> calls — it is just syntactic sugar. The
        function&apos;s return value describes what the UI <em>should look like right now</em>, not
        a sequence of mutations to make it look that way. React owns the DOM; you own the
        description.
      </>
    ),
    code: `// A component is a function returning JSX.
// JSX is sugar for React.createElement(type, props, ...children).

function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

// React.createElement equivalent (what JSX compiles to):
// React.createElement("h1", null, "Hello, ", name, "!")

// Render it:
// <Greeting name="Ada" />   →   <h1>Hello, Ada!</h1>`,
  },
  {
    title: "Step 2: Props are inputs",
    description: (
      <>
        Props are the single object argument every component receives. They flow one direction:
        parent to child. A component cannot modify its own props — they are read-only inputs, like
        function parameters. This one-way flow makes data tracing straightforward: to find where a
        value comes from, follow the props up the tree.
      </>
    ),
    code: `// Props are passed like HTML attributes — collected into one object.

function UserCard({ name, role, avatarUrl }) {
  return (
    <div className="card">
      <img src={avatarUrl} alt={name} />
      <h2>{name}</h2>
      <p>{role}</p>
    </div>
  );
}

// Usage — the parent controls all three values:
// <UserCard name="Ada" role="Engineer" avatarUrl="/ada.jpg" />

// Components can also accept children as a prop:
// <Button variant="primary">Save changes</Button>
// → props = { variant: "primary", children: "Save changes" }`,
  },
  {
    title: "Step 3: useState gives you change",
    description: (
      <>
        State is the <em>only</em> way to make a component re-render. When you call the setter
        returned by <code>useState</code>, React schedules a re-render: it calls the component
        function again with the new state value and reconciles the result against the previous
        output. If the new state is strictly equal (<code>===</code>) to the old state, React skips
        the re-render entirely — that&apos;s why mutating an object in place never triggers an
        update.
      </>
    ),
    code: `import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0); // initial value: 0

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>−</button>
    </div>
  );
}

// What useState returns:
//   count     — the current value (read-only snapshot)
//   setCount  — a function; calling it triggers a re-render
//               with the new value on the next call to Counter()`,
  },
  {
    title: "Step 4: Re-render and reconciliation",
    description: (
      <>
        When state changes, React calls the component function again, gets new JSX, and{" "}
        <strong>diffs</strong> it against the previous virtual DOM tree. Only the nodes that
        actually changed are written to the real DOM. This is reconciliation — re-render is{" "}
        <em>not</em> &quot;redraw everything.&quot; If you have a list of 100 items and only item
        3&apos;s state changes, only item 3 is re-rendered; items 1, 2, 4–100 are untouched. The{" "}
        <code>key</code> prop helps React match old and new list items correctly.
      </>
    ),
    code: `// Each ToggleItem manages its own state independently.
// Clicking item 2 only re-renders item 2.

function ToggleItem({ label }) {
  const [on, setOn] = useState(false);
  return (
    <li
      style={{ color: on ? "green" : "gray", cursor: "pointer" }}
      onClick={() => setOn(!on)}
    >
      {on ? "✓" : "○"} {label}
    </li>
  );
}

function List() {
  return (
    <ul>
      <ToggleItem key="a" label="Apples" />
      <ToggleItem key="b" label="Bananas" />
      <ToggleItem key="c" label="Cherries" />
    </ul>
  );
}

// Reconciliation: React diffs new JSX tree vs previous.
// key="b" toggled → only that <li> DOM node is updated.`,
  },
  {
    title: "Step 5: useEffect for sync with the outside",
    description: (
      <>
        Components must be pure — no side effects in the function body. <code>useEffect</code>{" "}
        is the escape hatch: run code that reaches outside React (fetch, timers, subscriptions,
        DOM APIs). The dependency array controls when the effect re-runs: <code>[]</code> means
        once on mount; <code>[id]</code> means whenever <code>id</code> changes. The optional
        return value is a cleanup function that runs before the next effect or on unmount — always
        return one when you open a subscription or start a timer.
      </>
    ),
    code: `import { useState, useEffect } from "react";

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(\`/api/users/\${userId}\`, { signal: controller.signal })
      .then(r => r.json())
      .then(setUser)
      .catch(() => {}); // ignore AbortError on cleanup

    // Cleanup: cancel the fetch when userId changes or component unmounts.
    return () => controller.abort();
  }, [userId]); // re-run whenever userId changes

  if (!user) return <p>Loading…</p>;
  return <h2>{user.name}</h2>;
}`,
  },
  {
    title: "Step 6: Lifting state",
    description: (
      <>
        When two sibling components need to share the same piece of state, lift it to their nearest
        common ancestor. The parent owns the state and passes it down as props. Siblings that need
        to <em>change</em> the state receive the setter (or a callback wrapping it) as a prop too —
        this is the &quot;props down, callbacks up&quot; pattern. Lifting is always the first answer
        before reaching for a global store.
      </>
    ),
    code: `// Parent owns "selected" — both children read from it.

function TabBar({ selected, onSelect }) {
  return (
    <nav>
      {["Overview", "Details"].map(tab => (
        <button
          key={tab}
          style={{ fontWeight: selected === tab ? "bold" : "normal" }}
          onClick={() => onSelect(tab)}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
}

function TabPanel({ selected }) {
  return <p>Showing: {selected}</p>;
}

function App() {
  const [selected, setSelected] = useState("Overview"); // lifted here

  return (
    <>
      <TabBar selected={selected} onSelect={setSelected} />
      <TabPanel selected={selected} />
    </>
  );
}`,
  },
  {
    title: "Step 7: Components must be pure",
    description: (
      <>
        A React component must be a pure function: given the same props and state, it always returns
        the same JSX. No fetching in the render body, no <code>Math.random()</code> in JSX, no
        <code> Date.now()</code> for IDs — these produce different output on every call, breaking
        reconciliation. Side effects belong exclusively in event handlers or{" "}
        <code>useEffect</code>. Keeping components pure is what makes React&apos;s concurrent
        features (like Suspense and transitions) safe to use: React can call your function multiple
        times without observable consequences.
      </>
    ),
    code: `// ✗ Impure — different output each render:
function BadCard() {
  const id = Math.random();          // new ID every render
  const time = new Date().toString(); // different every render
  const data = fetchSync('/api');     // side effect in render body

  return <div id={id}>{time} — {data}</div>;
}

// ✓ Pure — same props/state → same JSX:
function GoodCard({ createdAt, content }) {
  return (
    <div>
      <time>{createdAt}</time>
      <p>{content}</p>
    </div>
  );
}
// Fetching? → useEffect.
// Random ID? → generate once in useState initialiser or useMemo.
// Current time that updates? → useState + setInterval inside useEffect.`,
  },
];

// ─── Playground 1: Counter ────────────────────────────────────────────────────

const counterCode = `// Try this: click + a few times. Then change setCount(count + 1) to
// setCount(count) — nothing happens. React only re-renders when state
// *changes* (===). Then change to setCount(count - 1) — now it counts down.
import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ fontFamily: "system-ui", textAlign: "center", padding: "32px" }}>
      <h2 style={{ fontSize: "3rem", margin: "0 0 24px" }}>{count}</h2>
      <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
        <button
          onClick={() => setCount(count - 1)}
          style={btnStyle}
        >
          −
        </button>
        <button
          onClick={() => setCount(0)}
          style={{ ...btnStyle, background: "#64748b" }}
        >
          Reset
        </button>
        <button
          onClick={() => setCount(count + 1)}
          style={btnStyle}
        >
          +
        </button>
      </div>
      <p style={{ marginTop: "16px", color: "#64748b", fontSize: "0.85rem" }}>
        State value: <code>{count}</code> — change setCount(count + 1) to
        setCount(count) and notice nothing happens.
      </p>
    </div>
  );
}

const btnStyle = {
  padding: "12px 28px",
  fontSize: "1.25rem",
  background: "#3b82f6",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};
`;

// ─── Playground 2: Per-item state ────────────────────────────────────────────

const listCode = `// Try this: open DevTools → React Profiler. Toggle item 2. Notice that
// only item 2's component re-renders — items 1 and 3 are skipped.
// That is reconciliation: React diffs the new tree against the old and
// only touches what changed.
import { useState } from "react";

function ToggleItem({ label, emoji }) {
  const [checked, setChecked] = useState(false);

  return (
    <li
      onClick={() => setChecked(c => !c)}
      style={{
        listStyle: "none",
        padding: "14px 18px",
        marginBottom: "8px",
        borderRadius: "10px",
        border: "2px solid",
        borderColor: checked ? "#22c55e" : "#cbd5e1",
        background: checked ? "#f0fdf4" : "#f8fafc",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        fontSize: "1rem",
        userSelect: "none",
        transition: "all 0.15s",
      }}
    >
      <span style={{ fontSize: "1.4rem" }}>{checked ? "✅" : "⬜"}</span>
      <span style={{ color: checked ? "#15803d" : "#334155" }}>
        {emoji} {label}
      </span>
    </li>
  );
}

export default function ShoppingList() {
  return (
    <div style={{ fontFamily: "system-ui", maxWidth: "360px", margin: "32px auto", padding: "0 16px" }}>
      <h2 style={{ marginBottom: "16px", color: "#1e293b" }}>Shopping list</h2>
      <ul style={{ padding: 0 }}>
        <ToggleItem key="apples"   label="Apples"   emoji="🍎" />
        <ToggleItem key="bananas"  label="Bananas"  emoji="🍌" />
        <ToggleItem key="cherries" label="Cherries" emoji="🍒" />
      </ul>
      <p style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "12px" }}>
        Each item manages its own state. Toggling one never re-renders the others.
      </p>
    </div>
  );
}
`;

// ─── Component ────────────────────────────────────────────────────────────────

export function Module_5_3_Content() {
  return (
    <div className="space-y-8">

      {/* ────────────────────────────────────────────────────────────────── */}
      {/* Section 1: Hook                                                     */}
      {/* ────────────────────────────────────────────────────────────────── */}
      <Card>
        <CardContent className="pt-6">
          <div className="prose dark:prose-invert max-w-none">
            <p>
              You&apos;re used to thinking &quot;when X clicks, I mutate Y in the DOM.&quot; React
              asks a different question: &quot;what does the DOM <em>look like</em> for this
              state?&quot; — and figures out the rest. Once you internalize that flip, hooks,
              re-renders, and reconciliation stop feeling like magic and start feeling inevitable.
            </p>
            <p>
              Most frontend code written before React was a tangle of imperative mutations:{" "}
              <code>el.textContent = &hellip;</code>, <code>el.classList.toggle(&hellip;)</code>,{" "}
              <code>list.insertBefore(&hellip;)</code>. Every new feature had to reason about every
              possible previous state of the DOM. React&apos;s insight was that describing the
              desired output — given the current state — is far easier to reason about than
              describing the mutations needed to get there. That is the mental shift this module
              makes concrete.
            </p>
          </div>
          <div className="mt-4">
            <RoadmapLink url="https://roadmap.sh/frontend" />
          </div>
        </CardContent>
      </Card>

      {/* ────────────────────────────────────────────────────────────────── */}
      {/* Section 2: Mental model                                             */}
      {/* ────────────────────────────────────────────────────────────────── */}
      <Card>
        <CardContent className="pt-6">
          <div className="prose dark:prose-invert max-w-none">
            <blockquote className="border-l-4 border-blue-500 pl-4 italic">
              &quot;React describes UI as a function of state. Re-render is cheap because
              reconciliation only touches the changed parts of the DOM. Components must be pure
              — same inputs, same JSX out.&quot;
            </blockquote>
            <p>
              This means every component is a pure function: call it with the same props and state
              and you always get the same JSX back. React can call your function as many times as
              it needs to (and in concurrent mode, it may call it more than once before committing
              to the DOM). The only way to drive a change to what the user sees is to change state.
              Everything else follows from those two rules.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ────────────────────────────────────────────────────────────────── */}
      {/* Section 3: Step-by-step                                             */}
      {/* ────────────────────────────────────────────────────────────────── */}
      <StepByStepExplanation
        title="Building React intuition"
        description="Seven concepts, in the order you need them — from JSX to purity"
        steps={reactIntuitionSteps}
      />

      {/* ────────────────────────────────────────────────────────────────── */}
      {/* Section 4: Playgrounds                                              */}
      {/* ────────────────────────────────────────────────────────────────── */}
      <ReactPlayground
        code={counterCode}
        title="Counter with useState"
        description="State is the only way to trigger a re-render. Edit setCount(count + 1) to setCount(count) — nothing happens."
      />

      <ReactPlayground
        code={listCode}
        title="List with per-item useState"
        description="Three independent toggle items. Each owns its own state. Toggling one never re-renders the others — that is reconciliation."
      />

      {/* ────────────────────────────────────────────────────────────────── */}
      {/* Section 5: Challenges                                               */}
      {/* ────────────────────────────────────────────────────────────────── */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <p className="font-semibold">
            Your component fetches data inside the function body, before any hook:
          </p>
          <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">{`function UserList() {
  const users = await fetch('/users').then(r => r.json());
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}`}</pre>
        </CardContent>
      </Card>
      <Challenge
        question="What's wrong with the component shown above?"
        options={[
          { id: "a", text: "fetch isn't a thing in React." },
          {
            id: "b",
            text: "Fetching during render makes the component impure (different output across renders) and await doesn't work in non-async functions. Use useEffect (or a Suspense-aware data layer).",
          },
          { id: "c", text: "The key should be the user's name, not their id." },
          { id: "d", text: "Nothing — this is the standard pattern." },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            Components must be pure — same inputs, same JSX out. Fetching in render runs on every
            render, returns different data each time, and <code>await</code> is invalid in a
            synchronous function. Move the fetch into a <code>useEffect</code> (or a server
            component, or a data-fetching library that integrates with Suspense).
          </>
        }
      />

      <Challenge
        question="Two siblings need to know the selected tab. Where should the state live?"
        options={[
          {
            id: "a",
            text: "Each sibling owns its own copy of the state, kept in sync with useEffect.",
          },
          { id: "b", text: "A global Redux store." },
          {
            id: "c",
            text: "Lifted to the nearest common parent; the parent passes the value down as props and the setter to whichever child changes it.",
          },
          {
            id: "d",
            text: "A custom DOM event the siblings dispatch and listen for.",
          },
        ]}
        correctAnswerId="c"
        explanation={
          <>
            Lifting state to the nearest common ancestor is React&apos;s default answer for shared
            state — props down, callbacks up. Duplicating state and syncing with effects (a) creates
            race conditions. Redux (b) is overkill for a sibling pair. DOM events (d) bypass
            React&apos;s data flow.
          </>
        }
      />

      {/* ────────────────────────────────────────────────────────────────── */}
      {/* Section 6: GotchaList                                               */}
      {/* ────────────────────────────────────────────────────────────────── */}
      <GotchaList
        items={[
          {
            title:
              "Mutating state directly (state.list.push(x)) doesn't re-render — always create new objects/arrays so the reference changes",
            body: (
              <>
                React uses <code>===</code> to decide whether state changed. If you push into an
                existing array or mutate an object property, the reference is the same and React
                skips the re-render. Always return a new value:{" "}
                <code>setList([...list, newItem])</code> or{" "}
                <code>setUser({"{ ...user, name: 'Ada' }"})</code>.
              </>
            ),
          },
          {
            title:
              "useEffect's dependency array matters — [] runs once; missing deps cause stale closures; including a function reference re-runs every render",
            body: (
              <>
                <code>[]</code> means &quot;run once on mount, never again.&quot; If your effect
                uses a prop or state variable, omitting it from the deps array means the effect
                closes over a stale value. Adding an inline function to the array creates a new
                reference every render, re-triggering the effect infinitely. Wrap unstable functions
                in <code>useCallback</code> or move them inside the effect.
              </>
            ),
          },
          {
            title:
              "Setting state in render is an infinite loop — set state in event handlers or effects, never in the render body",
            body: (
              <>
                Calling <code>setState</code> at the top level of a component schedules a re-render,
                which calls the component again, which calls <code>setState</code> again — an
                infinite loop that crashes the tab. State updates belong in event handlers (onClick,
                onSubmit) or inside a <code>useEffect</code> with a carefully gated dependency array.
              </>
            ),
          },
          {
            title:
              "Components must be pure — same props/state in, same JSX out; no Math.random(), Date.now(), or fetch in render",
            body: (
              <>
                Impure renders break reconciliation (React may call your function multiple times
                before committing), break React DevTools time-travel, and break Concurrent Mode
                features like Suspense. Generate stable IDs in a <code>useState</code> initialiser
                or <code>useId()</code>; read the clock in an effect; fetch in an effect or a
                Suspense-compatible library.
              </>
            ),
          },
        ]}
      />

      {/* ────────────────────────────────────────────────────────────────── */}
      {/* Section 7: KeyTakeaways                                             */}
      {/* ────────────────────────────────────────────────────────────────── */}
      <KeyTakeaways
        points={[
          <>
            A React component is a pure function: given the same props and state it always returns
            the same JSX. React calls it whenever state changes and diffs the result against the
            previous output.
          </>,
          <>
            <code>useState</code> is the only way to make a component re-render. Call the setter
            with the same value (<code>===</code>) and React skips the update.
          </>,
          <>
            Reconciliation means re-render is not &quot;redraw everything.&quot; React diffs the
            new virtual DOM tree against the previous one and writes only the changed nodes to the
            real DOM.
          </>,
          <>
            <code>useEffect</code> is the escape hatch for side effects — fetch, timers,
            subscriptions. Always return a cleanup function; always list every dependency in the
            array.
          </>,
          <>
            When two components share state, lift it to their nearest common ancestor. Props flow
            down; callbacks flow up. Reach for a global store only when the ancestor is inconveniently
            far away.
          </>,
          <>
            Side effects in the render body break purity. No <code>fetch</code>,{" "}
            <code>Math.random()</code>, or <code>Date.now()</code> directly in JSX — move them into
            event handlers or effects.
          </>,
        ]}
        mentalModel="React describes UI as a function of state. Re-render is cheap because reconciliation only touches the changed parts of the DOM. Components must be pure — same inputs, same JSX out."
      />

      {/* Alternatives — one paragraph after KeyTakeaways */}
      <Card>
        <CardContent className="pt-6 prose dark:prose-invert max-w-none">
          <p>
            <strong>Alternatives.</strong> <em>Vue</em> uses templates and reactive refs —
            readable for beginners, with a strong ecosystem (Nuxt for SSR). <em>Svelte</em>{" "}
            compiles to plain DOM updates with no virtual DOM — smaller bundles and direct
            reactivity. <em>Solid</em> takes Svelte&apos;s reactivity model and pairs it with JSX
            — fastest fine-grained updates of any major framework. <em>Qwik</em> defers all
            JavaScript download until you interact — radical for performance, novel mental model.
            React is the most popular pick in 2026 because of ecosystem reach and the React Native
            + Next.js stack; the alternatives are picked when their specific tradeoff (bundle size,
            beginner clarity, performance ceiling) outweighs ecosystem mass.
          </p>
        </CardContent>
      </Card>

    </div>
  );
}
