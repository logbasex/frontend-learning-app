"use client";

import { Card, CardContent } from "@/components/ui/card";
import { HTMLPlayground } from "@/components/CodePlayground";
import { StepByStepExplanation, Step } from "@/components/StepByStepExplanation";
import { EventLoopVisualizer } from "@/components/EventLoopVisualizer";
import { Challenge } from "@/components/Challenge";
import { GotchaList } from "@/components/GotchaList";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { RoadmapLink } from "@/components/RoadmapLink";

export function Module_4_2_Content() {
  // Data blocks hoisted out of JSX for readability — listed in render order.
  const domToEventLoopSteps: Step[] = [
    {
      title: "Step 1: Query the DOM",
      description: (
        <>
          <code>document.querySelector</code> and <code>querySelectorAll</code> are the modern
          API for reaching into the document tree. They accept any CSS selector and return a live
          reference to the element — not a copy. Change the element and the page changes
          immediately. <code>querySelector</code> returns the first match or <code>null</code>;{" "}
          <code>querySelectorAll</code> returns a <code>NodeList</code> of all matches.
        </>
      ),
      code: `// Grab one element
const title = document.querySelector('h1');
console.log(title.textContent); // "Hello"

// Grab many elements
const items = document.querySelectorAll('li.todo');
console.log(items.length); // 3

// Scoped queries also work
const nav = document.querySelector('nav');
const links = nav.querySelectorAll('a'); // only <a> inside <nav>`,
    },
    {
      title: "Step 2: Mutate safely",
      description: (
        <>
          To change text, use <code>textContent</code>. It writes the string as plain text — no
          HTML parsing, no XSS risk. <code>{"innerHTML"}</code> is an{" "}
          <strong>XSS sink</strong>: assigning user-supplied data to it can inject scripts.
          Use it only when the input is completely trusted (hardcoded strings, not user data). For
          structural changes, <code>appendChild</code>, <code>insertBefore</code>, and{" "}
          <code>removeChild</code> are your tools.
        </>
      ),
      code: `const el = document.querySelector('#greeting');

// Safe — always plain text
el.textContent = userInput;

// Dangerous — parses as HTML; do not use with user data
// el.innerHTML = userInput; // XSS risk!

// Adding new nodes
const li = document.createElement('li');
li.textContent = 'New item';
document.querySelector('ul').appendChild(li);

// Removing a node
li.parentElement?.removeChild(li);`,
    },
    {
      title: "Step 3: Listen for events",
      description: (
        <>
          <code>el.addEventListener(type, handler)</code> is how you register an{" "}
          <em>event listener</em> — a function that runs when an event fires on that element.
          The <code>event</code> object passed to your handler carries two key properties:{" "}
          <code>target</code> (the element the user actually interacted with) and{" "}
          <code>currentTarget</code> (the element where this handler is bound). They differ when
          events bubble.
        </>
      ),
      code: `const btn = document.querySelector('#save');

btn.addEventListener('click', (event) => {
  console.log(event.target);        // <button id="save"> — where it fired
  console.log(event.currentTarget); // <button id="save"> — where handler is bound
  // (same here; they differ when bubbling is involved)
});

// Remove when done to avoid memory leaks
function handleClick(e) { console.log(e.target); }
btn.addEventListener('click', handleClick);
btn.removeEventListener('click', handleClick); // same reference required`,
    },
    {
      title: "Step 4: Events bubble",
      description: (
        <>
          An <em>event</em> — a notification dispatched on a target element when something
          happens — fires first on the target, then fires again on every ancestor up to{" "}
          <code>document</code>. This is <em>event bubbling</em>. There is also a{" "}
          <strong>capturing phase</strong> that fires top-down before the target, but you almost
          never use it (pass <code>{"{ capture: true }"}</code> as the third argument if you do).
          You can stop bubbling with <code>event.stopPropagation()</code>, but that silently
          breaks delegation in parent elements — avoid it unless you have a very specific reason.
        </>
      ),
      code: `// HTML: <ul> <li> <button>click me</button> </li> </ul>

document.querySelector('button').addEventListener('click', () => {
  console.log('button'); // fires 1st — the target
});

document.querySelector('li').addEventListener('click', () => {
  console.log('li');     // fires 2nd — bubble reaches li
});

document.querySelector('ul').addEventListener('click', () => {
  console.log('ul');     // fires 3rd — bubble reaches ul
});

// Click the button → logs: "button", "li", "ul"
// Capturing (rare): fires in reverse order, before the target
document.querySelector('ul').addEventListener('click', () => {
  console.log('ul (capture)');
}, { capture: true }); // fires before "button"`,
    },
    {
      title: "Step 5: Delegate to a parent",
      description: (
        <>
          <em>Event delegation</em> — listening on a parent and using <code>event.target</code> to
          dispatch to the relevant child — is the right pattern for dynamic lists. One listener on
          the <code>&lt;ul&gt;</code> handles clicks on every <code>&lt;li&gt;</code>, including
          ones added after the listener was attached. Use <code>event.target.closest(selector)</code>{" "}
          to find the nearest matching ancestor of the actual click target — this handles clicks on
          nested elements inside a list item (like buttons or spans).
        </>
      ),
      code: `const ul = document.querySelector('ul');

// One listener — works for all current and future <li> children.
ul.addEventListener('click', (event) => {
  // closest() walks up from event.target to find the <li>
  const item = event.target.closest('li');
  if (!item) return; // clicked the gap between items

  item.classList.toggle('done');
  console.log('toggled:', item.textContent);
});

// Adding a new item later — no extra listener needed
const li = document.createElement('li');
li.textContent = 'Item added at runtime';
ul.appendChild(li); // click works immediately`,
    },
    {
      title: "Step 6: The event loop, briefly",
      description: (
        <>
          JavaScript runs single-threaded: only one thing executes at a time on the{" "}
          <em>call stack</em> — the active function-call frames, pushed on call and popped on
          return. When the stack empties, the runtime checks two queues. The{" "}
          <em>microtask queue</em> — fed by Promise callbacks and <code>queueMicrotask()</code>{" "}
          — drains <strong>completely</strong> before anything else runs. Only then does the{" "}
          <em>event loop</em> pick one item from the <em>macrotask queue</em> — fed by{" "}
          <code>setTimeout</code>, <code>setInterval</code>, and I/O callbacks — and run it.
          This is why <code>Promise.resolve().then()</code> always logs before{" "}
          <code>setTimeout(fn, 0)</code>, even though both are &quot;scheduled.&quot;
        </>
      ),
      code: `console.log("A");            // sync — runs immediately on the call stack

setTimeout(() => {
  console.log("B");           // macrotask — scheduled for a future turn
}, 0);

Promise.resolve().then(() => {
  console.log("C");           // microtask — drains before next macrotask
});

console.log("D");            // sync — runs immediately

// Output: A, D, C, B
//
// Why: sync (A, D) → microtask queue drains (C) → one macrotask runs (B)`,
    },
  ];

  const eventLoopFrames = [
    {
      description: "Initial — main script enters call stack",
      callStack: ["<script>"],
      macrotaskQueue: [],
      microtaskQueue: [],
      consoleLog: [],
    },
    {
      description: "console.log('A') runs",
      callStack: ["<script>"],
      macrotaskQueue: [],
      microtaskQueue: [],
      consoleLog: ["A"],
    },
    {
      description: "setTimeout schedules a macrotask",
      callStack: ["<script>"],
      macrotaskQueue: ["() => console.log('B')"],
      microtaskQueue: [],
      consoleLog: ["A"],
    },
    {
      description: "Promise.then schedules a microtask",
      callStack: ["<script>"],
      macrotaskQueue: ["() => console.log('B')"],
      microtaskQueue: ["() => console.log('C')"],
      consoleLog: ["A"],
    },
    {
      description: "console.log('D') runs",
      callStack: ["<script>"],
      macrotaskQueue: ["() => console.log('B')"],
      microtaskQueue: ["() => console.log('C')"],
      consoleLog: ["A", "D"],
    },
    {
      description: "Script ends; microtask queue drains first",
      callStack: [],
      macrotaskQueue: ["() => console.log('B')"],
      microtaskQueue: ["() => console.log('C')"],
      consoleLog: ["A", "D"],
    },
    {
      description: "Microtask runs — log 'C'",
      callStack: [],
      macrotaskQueue: ["() => console.log('B')"],
      microtaskQueue: [],
      consoleLog: ["A", "D", "C"],
    },
    {
      description: "Macrotask runs — log 'B'",
      callStack: [],
      macrotaskQueue: [],
      microtaskQueue: [],
      consoleLog: ["A", "D", "C", "B"],
    },
  ];

  const playgroundHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>TODO Delegation</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <h2>TODO list</h2>
  <p class="hint">One listener on the &lt;ul&gt; handles everything.</p>
  <div class="add-row">
    <input id="input" type="text" placeholder="New task…">
    <button id="add">Add</button>
  </div>
  <ul id="list">
    <li>Buy groceries <button class="remove" aria-label="remove">x</button></li>
    <li>Write tests <button class="remove" aria-label="remove">x</button></li>
    <li>Read the docs <button class="remove" aria-label="remove">x</button></li>
  </ul>
  <script src="/script.js"></script>
</body>
</html>`;

  const playgroundCss = `body {
  font-family: system-ui, sans-serif;
  max-width: 480px;
  margin: 24px auto;
  padding: 0 16px;
  color: #1e293b;
}
h2 { margin-bottom: 4px; font-size: 1.1rem; }
.hint { font-size: 0.82rem; color: #64748b; margin-bottom: 16px; }
.add-row { display: flex; gap: 8px; margin-bottom: 12px; }
input {
  flex: 1;
  padding: 8px 10px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.9rem;
}
input:focus { outline: 2px solid #3b82f6; border-color: transparent; }
button {
  padding: 8px 14px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
}
button:hover { background: #2563eb; }
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  margin-bottom: 6px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.12s;
}
li:hover { background: #f1f5f9; }
li.done {
  text-decoration: line-through;
  color: #94a3b8;
  background: #f8fafc;
}
.remove {
  padding: 2px 8px;
  background: #ef4444;
  font-size: 0.75rem;
  border-radius: 4px;
  flex-shrink: 0;
  margin-left: 8px;
}
.remove:hover { background: #dc2626; }`;

  const playgroundJs = `// Try this: open DevTools → Elements, find the <ul>, and look at the
// event listener — there is exactly one. Add 100 todos by clicking Add.
// Click any of them. The same listener handles everything via event.target.

const ul = document.getElementById('list');
const input = document.getElementById('input');

// ONE delegated listener on the <ul>
ul.addEventListener('click', (event) => {
  // Did the user click the X button?
  if (event.target.classList.contains('remove')) {
    event.target.closest('li').remove();
    return;
  }

  // Did the user click anywhere else on the <li>?
  const item = event.target.closest('li');
  if (item) {
    item.classList.toggle('done');
  }
});

document.getElementById('add').addEventListener('click', addItem);
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addItem();
});

function addItem() {
  const text = input.value.trim();
  if (!text) return;
  const li = document.createElement('li');
  li.textContent = text;
  const btn = document.createElement('button');
  btn.textContent = 'x';
  btn.className = 'remove';
  btn.setAttribute('aria-label', 'remove');
  li.appendChild(btn);
  ul.appendChild(li);
  input.value = '';
  // No new listener needed — the parent ul handles it automatically.
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
              You attach a click listener to a list. The list grows. New items don&apos;t fire
              your handler. You re-bind on every render. Soon you have hundreds of listeners and
              no idea which is which. Event delegation fixes all of this with one listener and
              one mental model.
            </p>
            <p>
              Underneath delegation sits the event loop — the mechanism that decides when your
              callback actually runs. You schedule two callbacks: one with{" "}
              <code>setTimeout(fn, 0)</code>, one with <code>Promise.resolve().then(fn)</code>.
              Both are &quot;async,&quot; both have zero delay — but they don&apos;t run in the
              order you wrote them. Knowing the rule that explains this order lets you predict
              every async-ordering puzzle you will ever encounter.
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
              When a user clicks a button deep inside a list, that click event does not stay on
              the button. It fires there first, then propagates upward through every ancestor all
              the way to <code>document</code>. A single listener placed on the parent sees every
              click on every descendant — now and in the future. This is why delegation scales: you
              never touch the listener as children are added or removed. The event loop is the
              companion rule: JavaScript executes synchronous code to completion first, then drains
              all microtasks (Promise callbacks), then takes one macrotask
              (<code>setTimeout</code>, I/O) and repeats. These two rules together explain most
              surprising behavior in frontend JavaScript.
            </p>
            <blockquote className="border-l-4 border-blue-500 pl-4 italic">
              &quot;Events bubble up the tree; one listener on a parent can serve thousands of
              children. The event loop is a queue, not a thread.&quot;
            </blockquote>
          </div>
        </CardContent>
      </Card>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 3: Step-by-step                                               */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <StepByStepExplanation
        title="From DOM to event loop"
        description="Six concepts, in the order you actually use them"
        steps={domToEventLoopSteps}
      />

      {/* Optional: EventLoopVisualizer (setTimeout vs Promise) */}
      <EventLoopVisualizer
        title="setTimeout vs Promise — order"
        code={`console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");`}
        frames={eventLoopFrames}
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 4: Playground                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <HTMLPlayground
        html={playgroundHtml}
        css={playgroundCss}
        js={playgroundJs}
        title="Delegated TODO list"
        description="Click an item to toggle it done. Click x to remove it. Add new items — no listener rewiring needed."
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 5: Challenges                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Challenge
        question={`What does this print?\n\nsetTimeout(() => console.log(1), 0);\nPromise.resolve().then(() => console.log(2));\nconsole.log(3);`}
        options={[
          { id: "a", text: "1, 2, 3" },
          { id: "b", text: "3, 2, 1" },
          { id: "c", text: "3, 1, 2" },
          { id: "d", text: "2, 3, 1" },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            The synchronous <code>console.log(3)</code> runs first, on the call stack. Then the
            microtask queue drains — <code>Promise.then</code> was scheduled there, so{" "}
            <code>2</code> logs next. Finally one macrotask runs — the{" "}
            <code>setTimeout(0)</code> callback — so <code>1</code> logs last.
          </>
        }
      />

      <Challenge
        question="Your delegated &lt;ul&gt; click listener calls event.target.closest(&apos;.todo&apos;) to find the right item. Sometimes the click on the X button works correctly, sometimes the listener does nothing. What&apos;s the most likely issue?"
        options={[
          { id: "a", text: "closest() is unsupported in modern browsers." },
          {
            id: "b",
            text: "A child element inside the <li> is calling event.stopPropagation(), so the click never reaches the <ul>.",
          },
          { id: "c", text: "The X button needs its own onclick attribute." },
          { id: "d", text: "Event delegation only works for one level of nesting." },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            <code>stopPropagation()</code> halts bubbling — once it&apos;s called inside a child,
            the event never reaches your delegated listener. Look for{" "}
            <code>stopPropagation</code> calls in nested handlers (especially library components).
            The fix is to remove the offending <code>stopPropagation</code> or to listen on a
            tighter common ancestor.
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
              "Delegation breaks when a child calls event.stopPropagation() — the bubble never reaches your listener",
            body: (
              <>
                Third-party UI libraries often call <code>stopPropagation</code> internally. If
                your delegated listener suddenly stops working after adding a library component
                inside a list item, that is the first thing to check. Inspect with{" "}
                <code>monitorEvents(element)</code> in DevTools to see propagation in action.
              </>
            ),
          },
          {
            title:
              "addEventListener('scroll', ...) without { passive: true } blocks scroll on mobile",
            body: (
              <>
                By default the browser must wait for your scroll handler to finish (in case you
                call <code>preventDefault</code>) before it can advance the scroll position. On
                mobile this causes visible jank. Add <code>{"{ passive: true }"}</code> to tell
                the browser it can scroll immediately:{" "}
                <code>{"el.addEventListener('scroll', fn, { passive: true })"}</code>.
              </>
            ),
          },
          {
            title:
              "Microtasks drain fully between macrotasks — a runaway promise chain freezes the UI between frames",
            body: (
              <>
                If a microtask schedules another microtask (a Promise that resolves to another
                Promise that resolves...), the microtask queue never fully drains and the browser
                cannot paint the next frame. The UI appears frozen even though the call stack is
                empty. Break the chain with <code>setTimeout</code> if you need to yield to the
                browser.
              </>
            ),
          },
          {
            title:
              "DOM mutations inside a loop trigger a repaint per change unless batched — use DocumentFragment or React",
            body: (
              <>
                Each <code>appendChild</code> in a loop may force the browser to recalculate
                layout and paint. Build your nodes into a{" "}
                <code>DocumentFragment</code> first (an off-screen tree), then append the fragment
                once — one repaint instead of N. In React this is handled automatically by
                reconciliation.
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
            Use <code>document.querySelector</code> and <code>querySelectorAll</code> to reach
            elements. Mutate text with <code>textContent</code> — not{" "}
            <code>{"innerHTML"}</code>, which is an XSS sink when used with user-supplied data.
          </>,
          <>
            Every DOM event fires on the target first, then bubbles up through every ancestor to{" "}
            <code>document</code>. There is also a capturing phase (top-down, before the target),
            but you almost never need it.
          </>,
          <>
            Place one listener on a stable parent element and use{" "}
            <code>event.target.closest(selector)</code> to identify the relevant child. Items
            added later work automatically — no rewiring needed.
          </>,
          <>
            Synchronous code runs to completion first. Then the microtask queue (Promise
            callbacks) drains fully. Then one macrotask (<code>setTimeout</code>, I/O) runs. This
            cycle is the event loop.
          </>,
          <>
            <code>Promise.resolve().then()</code> always runs before{" "}
            <code>setTimeout(fn, 0)</code> because Promises are microtasks and{" "}
            <code>setTimeout</code> is a macrotask — microtasks drain before the next macrotask.
          </>,
        ]}
        mentalModel="Events bubble up the tree; one listener on a parent can serve thousands of children. The event loop is a queue, not a thread."
      />
    </div>
  );
}
