"use client";

import { ScaffoldModule } from "./_template";
import { HTMLPlayground } from "@/components/CodePlayground";

const closureHtml = `<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <h2>Closure Counter</h2>
  <p>Each counter is independent — they share no state.</p>
  <div class="counters">
    <div class="counter-box">
      <h3>Counter A</h3>
      <span id="displayA">0</span>
      <button id="incA">+ Increment</button>
      <button id="getA">Get value</button>
    </div>
    <div class="counter-box">
      <h3>Counter B</h3>
      <span id="displayB">0</span>
      <button id="incB">+ Increment</button>
      <button id="getB">Get value</button>
    </div>
  </div>
  <p id="msg" class="msg"></p>
  <script src="/script.js"></script>
</body>
</html>`;

const closureCss = `body {
  font-family: sans-serif;
  margin: 20px;
  background: #f8fafc;
}
.counters { display: flex; gap: 24px; flex-wrap: wrap; }
.counter-box {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  min-width: 160px;
}
.counter-box h3 { margin: 0 0 8px; color: #475569; }
span {
  display: block;
  font-size: 2rem;
  font-weight: bold;
  color: #3b82f6;
  margin-bottom: 8px;
}
button {
  display: block;
  width: 100%;
  margin-bottom: 6px;
  padding: 6px 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
button:hover { background: #2563eb; }
.msg { margin-top: 16px; color: #7c3aed; font-style: italic; }`;

const closureJs = `// makeCounter returns a new closure each time it is called.
// 'count' lives inside the closure — not on the global scope.
function makeCounter() {
  let count = 0;          // private to each counter instance
  return {
    inc: () => ++count,   // arrow fn captures 'count' from enclosing scope
    get: () => count,
  };
}

const counterA = makeCounter();
const counterB = makeCounter(); // completely separate 'count'

function render(id, value) {
  document.getElementById(id).textContent = value;
}

document.getElementById('incA').addEventListener('click', () => {
  render('displayA', counterA.inc());
});
document.getElementById('getA').addEventListener('click', () => {
  document.getElementById('msg').textContent =
    'Counter A is at: ' + counterA.get();
});
document.getElementById('incB').addEventListener('click', () => {
  render('displayB', counterB.inc());
});
document.getElementById('getB').addEventListener('click', () => {
  document.getElementById('msg').textContent =
    'Counter B is at: ' + counterB.get();
});`;

export function Module_4_1_Content() {
  return (
    <ScaffoldModule
      emoji="🧠"
      problemTitle="Closures, scope, and `this` — the three things every interview asks"
      problem={
        <>
          <p>
            A <strong>closure</strong> is a function combined with its lexical
            environment — every inner function &quot;remembers&quot; the
            variables of the scope where it was defined, even after that outer
            function has returned. This is not a quirk; it is how JavaScript is
            designed, and it powers patterns like private state, factory
            functions, and memoisation.
          </p>
          <p>
            <strong>Scope</strong> governs which names are visible where.{" "}
            <code>let</code> and <code>const</code> are block-scoped (visible
            only inside the nearest <code>{"{}"}</code>); <code>var</code> is
            function-scoped and hoisted to the top of its enclosing function —
            which is why it causes surprising bugs and should not be used in
            modern code.
          </p>
          <p>
            <strong><code>this</code></strong> is set by the <em>call site</em>,
            not the declaration site. Inside a regular method called on an
            object, <code>this</code> is that object. Inside a standalone
            function call in strict mode, <code>this</code> is{" "}
            <code>undefined</code>. Arrow functions do <em>not</em> have their
            own <code>this</code> — they inherit it from the enclosing lexical
            scope, which is usually what you want in callbacks.
          </p>
        </>
      }
      body={
        <HTMLPlayground
          html={closureHtml}
          css={closureCss}
          js={closureJs}
          title="Closure-backed counter"
          description="Each call to makeCounter() returns a new counter with its own private count."
        />
      }
      challenge={{
        question:
          "Why does the inner function still see `count` after `makeCounter()` returns?",
        options: [
          {
            id: "a",
            text: "JavaScript copies the value of `count` into the returned object at call time.",
          },
          {
            id: "b",
            text: "Because the returned function closes over the `count` variable, keeping it alive as long as the function reference is alive.",
          },
          {
            id: "c",
            text: "`count` is stored on the global object so any function can read it.",
          },
          {
            id: "d",
            text: "Arrow functions always receive the parent scope as an argument.",
          },
        ],
        correctAnswerId: "b",
        explanation: (
          <>
            When <code>makeCounter</code> returns, the JavaScript engine keeps
            the activation record (the &quot;environment&quot;) alive because
            the returned arrow functions still hold a reference to it. That
            reference is the closure — the function plus its captured
            environment. The value is not copied; it is a live binding, so
            increments are reflected on every subsequent call.
          </>
        ),
      }}
      takeaways={[
        <>
          A closure is a function that carries a reference to its enclosing
          scope. Variables captured this way stay alive for as long as the
          function does.
        </>,
        <>
          Prefer <code>const</code> by default, <code>let</code> when you need
          to reassign, and never use <code>var</code> — its hoisting and
          function-scoping rules create bugs that are hard to trace.
        </>,
        <>
          Arrow functions inherit <code>this</code> from the surrounding scope,
          making them safe to use as callbacks inside class methods or event
          handlers.
        </>,
      ]}
      mentalModel="A closure is a function plus its lexical environment. `this` is set by the call, not the declaration."
      roadmapUrl="https://roadmap.sh/frontend"
    />
  );
}
