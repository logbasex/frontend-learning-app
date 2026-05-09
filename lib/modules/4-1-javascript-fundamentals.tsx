"use client";

import { Card, CardContent } from "@/components/ui/card";
import { HTMLPlayground } from "@/components/CodePlayground";
import { StepByStepExplanation, Step } from "@/components/StepByStepExplanation";
import { Challenge } from "@/components/Challenge";
import { GotchaList } from "@/components/GotchaList";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { RoadmapLink } from "@/components/RoadmapLink";

export function Module_4_1_Content() {
  // Data blocks hoisted out of JSX for readability — listed in render order.
  const fourIdeasSteps: Step[] = [
    {
      title: "Step 1: Seven primitives, one reference world",
      description: (
        <>
          <em>JavaScript</em> — a single-threaded, dynamically typed language that runs in the
          browser and on Node.js — has exactly seven <em>primitive</em> types: <code>string</code>,{" "}
          <code>number</code>, <code>boolean</code>, <code>null</code>, <code>undefined</code>,{" "}
          <code>symbol</code>, and <code>bigint</code>. A primitive is a simple value type: copied by
          value and compared by value. Everything else — objects, arrays, functions — is a{" "}
          <em>reference type</em>: copied by reference and compared by identity. Two different object
          literals are never <code>===</code> even if they hold the same keys; two variables holding
          the same object reference are always <code>===</code>.
        </>
      ),
      code: `// Primitives compare by value
const a = "hello";
const b = "hello";
console.log(a === b); // true — same characters, same value

// Reference types compare by identity
const obj1 = { x: 1 };
const obj2 = { x: 1 };
console.log(obj1 === obj2); // false — two different objects in memory

const obj3 = obj1;          // copies the reference, not the object
console.log(obj3 === obj1); // true — same object in memory

// The seven primitives
typeof "hi"        // "string"
typeof 42          // "number"
typeof true        // "boolean"
typeof null        // "object"  ← historic bug, null IS a primitive
typeof undefined   // "undefined"
typeof Symbol()    // "symbol"
typeof 9007199254740993n // "bigint"`,
    },
    {
      title: "Step 2: `let`, `const`, `var`",
      description: (
        <>
          <code>let</code> and <code>const</code> are <em>block-scoped</em> — a scope created by{" "}
          <code>{"{ }"}</code>. <code>var</code> is function-scoped <em>and</em>{" "}
          <em>hoisted</em> to the top of its scope: the declaration is moved up (but not the
          assignment), which means a <code>var</code> is technically visible before its line but
          reads as <code>undefined</code>. This is the root cause of the classic{" "}
          &quot;why is X undefined here?&quot; bug. <code>const</code> binds the variable{" "}
          <em>name</em>, not the value: <code>const arr = []; arr.push(1)</code> works fine because
          you are mutating the array, not reassigning the name.
        </>
      ),
      code: `// var hoisting bug — all three buttons log "3" not 0, 1, 2
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // logs 3, 3, 3
}

// let creates a new binding per iteration — works correctly
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j), 0); // logs 0, 1, 2
}

// const binds the name, not the value
const arr = [1, 2, 3];
arr.push(4);          // OK — mutating the array
console.log(arr);     // [1, 2, 3, 4]
// arr = [];          // TypeError — reassigning the binding

// Temporal Dead Zone: let/const are NOT available before declaration
// console.log(x);   // ReferenceError
let x = 5;`,
    },
    {
      title: "Step 3: Closures — function + lexical environment",
      description: (
        <>
          Every function in JavaScript carries the variable bindings of where it was{" "}
          <em>defined</em>, not where it is called. That pairing of function code plus its
          surrounding variable bindings is a <em>closure</em>. Closures are how you build private
          state without classes: the outer function runs once and returns the inner function; the
          outer function&apos;s local variables stay alive as long as the returned function holds a
          reference to them. Each call to the factory produces a completely separate closure with its
          own copy of the private variables.
        </>
      ),
      code: `function makeCounter() {
  let count = 0;           // private — not accessible from outside

  return {
    increment() { count += 1; },
    decrement() { count -= 1; },
    value()     { return count; },
  };
}

const c1 = makeCounter();
const c2 = makeCounter();  // completely separate 'count'

c1.increment();
c1.increment();
c1.increment();

console.log(c1.value()); // 3
console.log(c2.value()); // 0 — c2's count is untouched

// The returned methods close over their OWN 'count'.
// There is no global count. There is no this.count.
// The closure IS the private state.`,
    },
    {
      title: "Step 4: `this` is set by the call site",
      description: (
        <>
          <em><code>this</code></em> — a binding set by the call site, not the declaration — is the
          most common source of confusion in JavaScript. The rule is simple once you see it: how you
          call the function determines what <code>this</code> is inside. Calling a function as a
          method on an object (<code>obj.method()</code>) binds <code>this</code> to <code>obj</code>
          . Calling the same function standalone (<code>fn()</code>) binds <code>this</code> to{" "}
          <code>undefined</code> in strict mode (the default for ES modules) or the global object in
          sloppy mode. Arrow functions are the exception: they do not bind <code>this</code> at all
          — they capture the enclosing scope&apos;s <code>this</code> at definition time, which is
          what you usually want for callbacks.
        </>
      ),
      code: `const user = {
  name: "Ada",
  greet() {
    return "Hi, " + this.name;  // this === user when called as user.greet()
  },
};

console.log(user.greet());      // "Hi, Ada"

// Detach the method — this changes
const fn = user.greet;
console.log(fn());              // "Hi, undefined" (strict) or TypeError

// Arrow function captures lexical this — safe for callbacks
class Timer {
  constructor() { this.ticks = 0; }
  start() {
    setInterval(() => {
      this.ticks++;             // 'this' is the Timer instance, always
    }, 1000);
  }
}

// Regular function in setInterval would lose 'this':
// setInterval(function() { this.ticks++; }, 1000); // this === undefined`,
    },
    {
      title: "Step 5: Prototypes — where methods live",
      description: (
        <>
          Every object has a hidden <code>[[Prototype]]</code> link. When you look up a property
          and it is not found on the object itself, JavaScript follows the link to the{" "}
          <em>prototype</em> — the object an object inherits from — and so on up the chain until{" "}
          <code>null</code>. This is why <code>arr.push</code> works: <code>arr</code> doesn&apos;t
          own <code>push</code>, but its prototype is <code>Array.prototype</code>, which does.
          Classes in JavaScript are syntactic sugar over this prototype chain — a{" "}
          <code>class</code> declaration creates a constructor function and assigns methods to its{" "}
          <code>prototype</code>. Nothing changes under the hood.
        </>
      ),
      code: `const arr = [1, 2, 3];

// arr doesn't own 'push' — look it up:
console.log(arr.hasOwnProperty("push")); // false
console.log(Array.prototype.hasOwnProperty("push")); // true

// The prototype chain:
// arr → Array.prototype → Object.prototype → null

// Classes are prototype sugar
class Animal {
  constructor(name) { this.name = name; }
  speak() { return this.name + " speaks"; }
}

const dog = new Animal("Rex");
// dog.speak is NOT on dog — it lives on Animal.prototype
console.log(dog.hasOwnProperty("speak"));       // false
console.log(Animal.prototype.hasOwnProperty("speak")); // true
console.log(dog.speak());                        // "Rex speaks"`,
    },
    {
      title: "Step 6: `==` vs `===`",
      description: (
        <>
          <code>===</code> (strict equality) compares type and value with no coercion.{" "}
          <code>==</code> (loose equality) runs a type-coercion algorithm first: it converts one or
          both operands to a common type before comparing, following rules that are non-obvious
          enough to be the subject of famous JavaScript memes. The fix is simple: always use{" "}
          <code>===</code> unless you have a deliberate reason not to. One additional fact worth
          knowing: <code>NaN</code> is the only value in JavaScript not equal to itself —{" "}
          <code>NaN === NaN</code> is <code>false</code>. Use <code>Number.isNaN()</code> to test
          for it.
        </>
      ),
      code: `// == coerces types — surprising results
console.log("5"  ==  5);   // true  (string coerced to number)
console.log(""   ==  0);   // true  (empty string → 0)
console.log(null == undefined); // true  (special case)
console.log([]   ==  0);   // true  ([] → "" → 0)

// === never coerces — predictable
console.log("5" === 5);   // false — different types
console.log(""  === 0);   // false

// NaN is never equal to itself
console.log(NaN === NaN); // false ← famous gotcha
console.log(Number.isNaN(NaN)); // true — use this instead

// Practical rule: write === everywhere.
// The only legitimate use of == is "x == null"
// which is shorthand for (x === null || x === undefined).`,
    },
  ];

  const playgroundHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Closure Counter</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <h2>Three independent closure counters</h2>
  <p class="hint">Each button group has its own private state — no shared variables.</p>
  <div class="counters" id="counters"></div>
  <pre id="log" class="log">Click a button to see output&hellip;</pre>
  <script src="/script.js"></script>
</body>
</html>`;

  const playgroundCss = `body {
  font-family: system-ui, sans-serif;
  max-width: 700px;
  margin: 24px auto;
  padding: 0 16px;
  color: #1e293b;
  background: #f8fafc;
}
h2 { font-size: 1.1rem; margin-bottom: 4px; }
.hint { font-size: 0.82rem; color: #64748b; margin-bottom: 16px; }
.counters { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 16px; }
.counter-box {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 16px;
  min-width: 150px;
  flex: 1;
  text-align: center;
}
.counter-label { font-size: 0.78rem; font-weight: 600; color: #64748b; margin-bottom: 6px; }
.counter-value {
  font-size: 2.4rem;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 10px;
}
.btn-row { display: flex; gap: 6px; justify-content: center; }
button {
  padding: 6px 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
}
button:hover { background: #2563eb; }
button.reset { background: #94a3b8; }
button.reset:hover { background: #64748b; }
.log {
  background: #0f172a;
  color: #e2e8f0;
  padding: 14px;
  border-radius: 8px;
  font-family: monospace;
  font-size: 0.78rem;
  min-height: 80px;
  overflow: auto;
  white-space: pre-wrap;
}`;

  const playgroundJs = `// Try this: change "let" to "var" in the loop below. Watch all three buttons
// start sharing the same counter. var is function-scoped and hoisted; let
// creates a new binding per iteration. Closures capture the binding, not
// the value.

function makeCounter(label) {
  let count = 0;           // private — each call to makeCounter gets its own
  return {
    increment() { count += 1; log(label + " incremented to " + count); return count; },
    decrement() { count -= 1; log(label + " decremented to " + count); return count; },
    reset()     { count = 0;  log(label + " reset");  return count; },
    value()     { return count; },
  };
}

function log(msg) {
  document.getElementById("log").textContent = msg;
}

// Build three independent counters using a loop.
// Try changing 'let' to 'var' here and see what breaks:
const labels = ["Counter A", "Counter B", "Counter C"];
const counters = [];
for (let i = 0; i < labels.length; i++) {
  counters.push(makeCounter(labels[i]));
}

// Render the UI
const container = document.getElementById("counters");
counters.forEach((counter, idx) => {
  const box = document.createElement("div");
  box.className = "counter-box";

  const label = document.createElement("div");
  label.className = "counter-label";
  label.textContent = labels[idx];

  const value = document.createElement("div");
  value.className = "counter-value";
  value.textContent = "0";

  const btnRow = document.createElement("div");
  btnRow.className = "btn-row";

  function refresh() { value.textContent = counter.value(); }

  const incBtn = document.createElement("button");
  incBtn.textContent = "+";
  incBtn.addEventListener("click", () => { counter.increment(); refresh(); });

  const decBtn = document.createElement("button");
  decBtn.textContent = "−";
  decBtn.addEventListener("click", () => { counter.decrement(); refresh(); });

  const resetBtn = document.createElement("button");
  resetBtn.textContent = "0";
  resetBtn.className = "reset";
  resetBtn.addEventListener("click", () => { counter.reset(); refresh(); });

  btnRow.append(incBtn, decBtn, resetBtn);
  box.append(label, value, btnRow);
  container.appendChild(box);
});`;

  return (
    <div className="space-y-8">

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 1: Hook                                                       */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Card>
        <CardContent className="pt-6">
          <div className="prose dark:prose-invert max-w-none">
            <p>
              Closures, <code>this</code>, and the difference between <code>==</code> and{" "}
              <code>===</code> come up in every JavaScript interview because they&apos;re the three
              things that surprise people in production code. Once you can predict what they do
              without running the code, the rest of the language is mostly syntax.
            </p>
            <p>
              But they&apos;re not random quirks — each one follows from a single underlying rule.
              Closures follow from how JavaScript resolves names at definition time, not call time.{" "}
              <code>this</code> follows from which object is left of the dot when you call a
              function. <code>===</code> follows from the principle that type conversions should be
              explicit, not silent. Once you own the rules, the surprises stop being surprising.
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
              Four ideas power almost every JavaScript bug you will ever debug. Primitives are
              copied; objects share a reference — so mutating through one name mutates for all names
              pointing at the same object. Every function remembers where it was defined, carrying
              those variable bindings with it wherever it is called. <code>this</code> is a run-time
              decision made by the call site, not the source location. And <code>==</code> silently
              converts types before comparing, while <code>===</code> never does. Internalize these
              four, and you have a working model of the language.
            </p>
            <blockquote className="border-l-4 border-blue-500 pl-4 italic">
              &quot;Primitives copy by value. Objects share by reference. A closure is a function
              plus the variable bindings of where it was defined. <code>this</code> is set by the
              call, not the declaration.&quot;
            </blockquote>
          </div>
        </CardContent>
      </Card>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 3: Step-by-step                                               */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <StepByStepExplanation
        title="The four ideas every JS bug uses"
        description="Six concepts, each adding one piece of the model"
        steps={fourIdeasSteps}
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 4: Playground                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <HTMLPlayground
        html={playgroundHtml}
        css={playgroundCss}
        js={playgroundJs}
        title="Closure-based counters"
        description="Three independent counters, each with private state. Try changing 'let' to 'var' in the loop and watch all three start sharing the same counter."
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 5: Challenges                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Challenge
        question={`What does this snippet print?\n\nconst x = [1, 2, 3];\nconst y = x;\ny.push(4);\nconsole.log(x.length);`}
        options={[
          { id: "a", text: "3 — y is a copy of x." },
          { id: "b", text: "4 — x and y reference the same array." },
          { id: "c", text: "0 — x is read-only after assignment." },
          { id: "d", text: "TypeError — can't mutate a const." },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            Arrays are reference types — assigning <code>y = x</code> copies the{" "}
            <em>reference</em>, not the contents. Both names point at the same array, so{" "}
            <code>y.push(4)</code> mutates what <code>x</code> points at.{" "}
            <code>const</code> prevents reassigning <code>x</code>, not mutating the array it
            references.
          </>
        }
      />

      <Challenge
        question={`What logs?\n\nconst obj = { name: "Ada", greet() { return \`Hi, \${this.name}\` } };\nconst fn = obj.greet;\nconsole.log(fn());`}
        options={[
          { id: "a", text: '"Hi, Ada"' },
          { id: "b", text: '"Hi, undefined" (or a TypeError in strict mode).' },
          { id: "c", text: '"Hi, " followed by the global object\'s string form.' },
          { id: "d", text: '"Hi, fn"' },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            <code>this</code> is set by the call site, not the declaration. Calling{" "}
            <code>obj.greet()</code> binds <code>this</code> to <code>obj</code>. Calling{" "}
            <code>fn()</code> (the same function, no receiver) binds <code>this</code> to{" "}
            <code>undefined</code> in strict mode (the default for ES modules), so{" "}
            <code>this.name</code> throws or evaluates to <code>undefined</code>.
          </>
        }
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 6: GotchaList                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <GotchaList
        items={[
          {
            title: "`var` is function-scoped and hoisted — `let`/`const` are block-scoped and hit the temporal dead zone before declaration",
            body: (
              <>
                A <code>var</code> inside a <code>for</code> loop is visible to the entire enclosing
                function — not just that loop body. Worse, its declaration is hoisted to the top of
                the function, so reading it before the assignment gives <code>undefined</code>, not
                a <code>ReferenceError</code>. <code>let</code> and <code>const</code> are block-scoped
                and in the temporal dead zone before their declaration line — reading them early
                throws a <code>ReferenceError</code>, which is the loud failure you actually want.
              </>
            ),
          },
          {
            title: "`==` does type coercion (`'5' == 5` is true) — always use `===` unless you have a deliberate reason not to",
            body: (
              <>
                <code>==</code> follows a multi-step coercion algorithm:
                string-to-number, boolean-to-number, object-to-primitive, and special rules for{" "}
                <code>null</code> and <code>undefined</code>. The results are non-obvious enough
                that most teams ban <code>==</code> outright with an ESLint rule. The only
                exception the community tolerates is <code>x == null</code>, which catches both{" "}
                <code>null</code> and <code>undefined</code> in one check.
              </>
            ),
          },
          {
            title: "Arrow functions don't have their own `this` — they capture the enclosing scope's, which is what you usually want for callbacks",
            body: (
              <>
                If you write <code>{"setTimeout(function() { this.x++ }, 1000)"}</code> inside a
                class method, <code>this</code> is <code>undefined</code> (strict mode) when the
                callback fires — the method&apos;s <code>this</code> is gone. Swap to an arrow
                function and <code>this</code> is whatever it was when the method ran, because the
                arrow captures it lexically. This is the primary reason arrow functions exist for
                callbacks.
              </>
            ),
          },
          {
            title: "Mutating a const-bound object doesn't reassign — `const` is about the binding, not the value",
            body: (
              <>
                <code>const arr = []</code> means the name <code>arr</code> will always point to
                that same array object. You can call <code>arr.push(1)</code>, sort it, clear it
                with <code>arr.length = 0</code> — none of those are reassignments. Only{" "}
                <code>arr = []</code> (rebinding the name) throws a <code>TypeError</code>.
                Developers new to JavaScript often expect <code>const</code> to mean immutable;
                it means <em>binding-constant</em>, which is a different thing.
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
            JavaScript has seven primitive types (<code>string</code>, <code>number</code>,{" "}
            <code>boolean</code>, <code>null</code>, <code>undefined</code>, <code>symbol</code>,{" "}
            <code>bigint</code>). Primitives are compared and copied by value; everything else is a
            reference type compared and copied by reference.
          </>,
          <>
            <code>let</code> and <code>const</code> are block-scoped. <code>var</code> is
            function-scoped and hoisted, which means a <code>var</code> reads as{" "}
            <code>undefined</code> before its assignment — the source of classic loop bugs. Prefer{" "}
            <code>const</code> by default; use <code>let</code> when you need to reassign.
          </>,
          <>
            A closure is a function plus the variable bindings of where it was defined. Every call
            to a factory function produces a new closure with its own private variables, even after
            the factory has returned.
          </>,
          <>
            <code>this</code> is set by the call site, not the declaration. Method calls bind{" "}
            <code>this</code> to the receiver object; standalone calls bind it to{" "}
            <code>undefined</code> in strict mode. Arrow functions capture the enclosing scope&apos;s{" "}
            <code>this</code> and never rebind it.
          </>,
          <>
            Always use <code>===</code> for equality. <code>==</code> coerces types silently and
            produces non-obvious results (<code>&apos;5&apos; == 5</code> is <code>true</code>).{" "}
            <code>NaN === NaN</code> is <code>false</code> — use{" "}
            <code>Number.isNaN()</code> to check for it.
          </>,
        ]}
        mentalModel="Primitives copy by value. Objects share by reference. A closure is a function plus the variable bindings of where it was defined. `this` is set by the call, not the declaration."
      />
    </div>
  );
}
