"use client";

import { ScaffoldModule } from "./_template";
import { HTMLPlayground } from "@/components/CodePlayground";

const delegationHtml = `<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <h2>Event Delegation</h2>
  <p>One listener on the <code>&lt;ul&gt;</code> handles all items — including new ones.</p>
  <ul id="list">
    <li data-id="1">Item 1</li>
    <li data-id="2">Item 2</li>
    <li data-id="3">Item 3</li>
    <li data-id="4">Item 4</li>
    <li data-id="5">Item 5</li>
  </ul>
  <button id="add">Add new item</button>
  <p id="msg" class="msg">Click an item...</p>
  <script src="/script.js"></script>
</body>
</html>`;

const delegationCss = `body { font-family: sans-serif; margin: 20px; background: #f8fafc; }
ul {
  list-style: none;
  padding: 0;
  margin: 12px 0;
  max-width: 300px;
}
li {
  padding: 10px 14px;
  margin-bottom: 6px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
}
li:hover { background: #eff6ff; border-color: #93c5fd; }
li.selected { background: #dbeafe; border-color: #3b82f6; font-weight: bold; }
button {
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
button:hover { background: #2563eb; }
.msg { margin-top: 12px; color: #7c3aed; font-style: italic; }`;

const delegationJs = `const list = document.getElementById('list');
const msg  = document.getElementById('msg');
let nextId = 6;

// ONE listener on the parent <ul> — not one per <li>.
// Works for items added dynamically too.
list.addEventListener('click', (event) => {
  // Walk up from the click target to the nearest <li>
  const item = event.target.closest('li');
  if (!item) return; // clicked the gap between items

  // Deselect siblings, highlight clicked item
  list.querySelectorAll('li').forEach(el => el.classList.remove('selected'));
  item.classList.add('selected');

  msg.textContent = 'You clicked: "' + item.textContent + '" (id=' + item.dataset.id + ')';
});

document.getElementById('add').addEventListener('click', () => {
  const li = document.createElement('li');
  li.dataset.id = nextId;
  li.textContent = 'Item ' + nextId++;
  list.appendChild(li);
  msg.textContent = 'New item added — no listener rewiring needed!';
});`;

export function Module_4_2_Content() {
  return (
    <ScaffoldModule
      emoji="🖱️"
      problemTitle="One listener, many children"
      problem={
        <>
          <p>
            Attaching one event listener per element is fine for small static
            lists, but it does not scale. If you have hundreds of rows — or if
            rows are added and removed dynamically — you will leak memory and
            constantly rewire listeners. The solution is{" "}
            <strong>event delegation</strong>: attach a single listener to a
            stable parent element and check <code>event.target</code> (or{" "}
            <code>event.target.closest(selector)</code>) to determine which
            child was acted on. This works because DOM events{" "}
            <em>bubble upward</em> through the tree by default.
          </p>
          <p>
            You can stop bubbling with <code>event.stopPropagation()</code>, but
            this is rarely a good idea — it silently breaks delegation in parent
            elements. Prefer <code>event.preventDefault()</code> (which only
            cancels the browser&apos;s default action, like form submission) and
            leave propagation alone unless you have a very specific reason not
            to.
          </p>
          <p>
            The <strong>event loop</strong> determines when your callbacks run.
            Microtasks (Promise callbacks) run before the next macrotask
            (setTimeout, I/O). That is why{" "}
            <code>{"Promise.resolve().then(() => console.log('A'))"}</code> logs{" "}
            before <code>{"setTimeout(() => console.log('B'), 0)"}</code>, even
            though both are &quot;async&quot;. Understanding this order prevents
            subtle ordering bugs.
          </p>
        </>
      }
      body={
        <HTMLPlayground
          html={delegationHtml}
          css={delegationCss}
          js={delegationJs}
          title="Event delegation"
          description="Click any list item — one listener handles them all. Add new items and click them too."
        />
      }
      challenge={{
        question:
          "What is the main reason to prefer event delegation over per-element listeners?",
        options: [
          {
            id: "a",
            text: "It is required by modern browsers — per-element listeners are deprecated.",
          },
          {
            id: "b",
            text: "It makes the code shorter, but performance is actually slightly worse.",
          },
          {
            id: "c",
            text: "Items added later automatically work — no rewiring needed — and you save memory on long lists.",
          },
          {
            id: "d",
            text: "Delegation bypasses the event loop, so clicks feel more responsive.",
          },
        ],
        correctAnswerId: "c",
        explanation: (
          <>
            Because events bubble, a single listener on the parent sees every
            click on any descendant — including ones added after the listener was
            attached. This avoids the need to call{" "}
            <code>addEventListener</code> again when you add new items, and
            drastically reduces memory usage in large lists (one listener object
            instead of thousands).
          </>
        ),
      }}
      takeaways={[
        <>
          Events bubble by default. A listener on any ancestor will fire for
          clicks on its descendants — use <code>event.target.closest()</code> to
          identify the actual element the user meant.
        </>,
        <>
          Delegate to a stable parent element instead of attaching N listeners
          to N children. Dynamically added children work automatically and no
          cleanup is required when they are removed.
        </>,
        <>
          Microtasks (Promises) run before macrotasks (setTimeout). The event
          loop processes the entire microtask queue after every macrotask, which
          is why Promise callbacks always win the race against setTimeout.
        </>,
      ]}
      mentalModel="Events bubble. Listen at the parent and dispatch to the child. The event loop is a queue of work, not a thread."
      roadmapUrl="https://roadmap.sh/frontend"
    />
  );
}
