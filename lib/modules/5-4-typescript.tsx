"use client";

import { Card, CardContent } from "@/components/ui/card";
import { HTMLPlayground } from "@/components/CodePlayground";
import { StepByStepExplanation, Step } from "@/components/StepByStepExplanation";
import { CodeComparison } from "@/components/CodeComparison";
import { Challenge } from "@/components/Challenge";
import { GotchaList } from "@/components/GotchaList";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { RoadmapLink } from "@/components/RoadmapLink";

export function Module_5_4_Content() {
  // Data blocks hoisted out of JSX for readability — listed in render order.
  const fromJsToTsSteps: Step[] = [
    {
      title: "Step 1: Why types catch bugs",
      description: (
        <>
          JavaScript happily runs code that is obviously wrong. Pass a string where a number is
          expected, misspell a property name, call a method on <code>null</code> — the program
          starts, runs, and then crashes at runtime, maybe in production. TypeScript stops those bugs
          at build time, before you run anything. The example below has a deliberate typo:{" "}
          <code>user.nme</code> instead of <code>user.name</code>. JavaScript executes it and
          silently returns <code>undefined</code>. TypeScript refuses to compile it.
        </>
      ),
      code: `// JavaScript: runs, returns undefined, no warning
function greet(user) {
  return "Hello, " + user.nme; // typo — user.name intended
}

// TypeScript: compile error before any test runs
function greet(user: { name: string }): string {
  return "Hello, " + user.nme;
  //                       ^^^
  // tsc error: Property 'nme' does not exist on type '{ name: string }'.
  //            Did you mean 'name'?
}`,
    },
    {
      title: "Step 2: Adding types incrementally",
      description: (
        <>
          You don&apos;t have to type everything at once. Rename a file from{" "}
          <code>.js</code> to <code>.ts</code>, then address the errors TypeScript surfaces — one at
          a time. TypeScript&apos;s <code>strict</code> mode surfaces the most useful bugs
          (including implicit <code>any</code> and possible <code>null</code> dereferences). When you
          genuinely need to ship one untyped line — legacy code, a third-party library with no types
          — <code>{"// @ts-expect-error"}</code> is a documented escape hatch. It suppresses exactly one
          error and fails the build if no error appears (keeping it honest).
        </>
      ),
      code: `// Step 1: rename utils.js → utils.ts
// Step 2: tsc reports the first error

// @ts-expect-error — intentional: third-party lib has no types yet
const result = untypedLegacyLib.compute(input);

// Step 3: add types to each function one at a time
function parseId(raw: string): number {
  return parseInt(raw, 10);
}

// tsconfig.json — recommended starting point
// {
//   "compilerOptions": {
//     "strict": true,
//     "noEmit": true,
//     "target": "ES2022",
//     "moduleResolution": "bundler"
//   }
// }`,
    },
    {
      title: "Step 3: Structural typing — shape over name",
      description: (
        <>
          <em>Structural typing</em> means two types are compatible if their shapes match, regardless
          of name. TypeScript does not care whether a value was declared as a{" "}
          <code>User</code> or a <code>Member</code>; it only checks whether the required fields are
          present with the right types. This is fundamentally different from Java or C#, where
          &quot;same shape, different name&quot; means the types are not assignable. Structural
          typing maps naturally onto plain JavaScript objects, which are assembled dynamically all
          the time.
        </>
      ),
      code: `interface User   { name: string; age: number }
interface Member { name: string; age: number }

// Nominal typing (Java/C#): User and Member are different — not assignable.
// Structural typing (TypeScript): they have the same shape — fully interchangeable.

function greet(u: User): string {
  return "Hello, " + u.name;
}

const m: Member = { name: "Ada", age: 36 };
greet(m); // OK — Member has the same shape as User

// Anonymous objects also satisfy named types:
greet({ name: "Boole", age: 51 }); // OK — shape matches`,
    },
    {
      title: "Step 4: Unions and narrowing",
      description: (
        <>
          A union type like <code>string | number</code> tells TypeScript a value can be either one.
          To use it as just one, you <em>narrow</em> it — TypeScript&apos;s flow-analysis tracks
          which branch a control-flow check creates and restricts the type inside that branch.{" "}
          <code>typeof x === &quot;string&quot;</code>, <code>&quot;key&quot; in obj</code>, and
          discriminated union checks on a shared literal field (<code>if (r.ok)</code>) are all
          narrowers. Discriminated unions are the most powerful form: a tagged field like{" "}
          <code>ok: true | false</code> lets TypeScript automatically rule out the impossible arm.
        </>
      ),
      code: `// typeof narrowing
function format(v: string | number): string {
  if (typeof v === "string") {
    return v.toUpperCase(); // TypeScript knows v is string here
  }
  return v.toFixed(2); // TypeScript knows v is number here
}

// Discriminated union — the discriminator is the literal field 'ok'
type Result<T> =
  | { ok: true;  data: T }
  | { ok: false; error: string };

function divide(a: number, b: number): Result<number> {
  if (b === 0) return { ok: false, error: "Division by zero" };
  return { ok: true, data: a / b };
}

const r = divide(10, 2);
if (r.ok) {
  console.log(r.data);  // TypeScript knows r.data: number
} else {
  console.error(r.error); // TypeScript knows r.error: string
}

// 'in' narrowing
function printLength(v: string | string[]) {
  if ("length" in v) {
    // both string and string[] have .length — still union here
  }
  if (Array.isArray(v)) {
    console.log(v.length, "items"); // TypeScript knows v is string[]
  }
}`,
    },
    {
      title: "Step 5: Generics",
      description: (
        <>
          A <em>generic</em> is a type parameterized by another type. Instead of duplicating a
          function for every input type, you write it once and let the caller supply the type
          parameter — either explicitly or via inference. <code>Array&lt;T&gt;</code>,{" "}
          <code>Promise&lt;T&gt;</code>, and <code>Record&lt;K, V&gt;</code> are the generics you
          use every day. The <code>extends</code> keyword constrains what <code>T</code> may be:
          <code>K extends keyof T</code> means &quot;K must be one of T&apos;s own property
          names,&quot; so the compiler can check you aren&apos;t asking for a key that doesn&apos;t
          exist.
        </>
      ),
      code: `// Generic function — T is inferred from the argument
function identity<T>(x: T): T { return x; }

const n = identity(42);          // inferred: number
const s = identity("hello");     // inferred: string

// Generic with a constraint — K must be a key of T
function pluck<T, K extends keyof T>(arr: T[], key: K): T[K][] {
  return arr.map(item => item[key]);
}

const users = [{ name: "Ada", age: 36 }, { name: "Boole", age: 51 }];
const names = pluck(users, "name"); // string[]
// pluck(users, "agee");            // tsc error — 'agee' is not in 'name' | 'age'

// Generic type alias
type Pair<A, B> = { first: A; second: B };
const p: Pair<string, number> = { first: "hello", second: 42 };`,
    },
    {
      title: "Step 6: Reading tsc errors",
      description: (
        <>
          TypeScript error messages walk a chain. The top line names the outer mismatch; the lines
          below name the exact field where it breaks. The practical rule: <strong>read top-down to
          understand the context, fix bottom-up to address the actual problem</strong>. The bottom
          line is almost always the leaf property that is wrong. &quot;Type X is not assignable to
          type Y&quot; means Y expected something X doesn&apos;t provide. &quot;Property foo is
          missing in type X&quot; means foo is required in Y but absent in X — add the field.
        </>
      ),
      code: `// The code that triggers the error:
type Config = { host: string; port: number; secure: boolean };

function connect(cfg: Config) { /* ... */ }

connect({ host: "localhost", port: 8080 });
//
// tsc output:
//
// Argument of type '{ host: string; port: number; }' is not assignable
//   to parameter of type 'Config'.
//   Property 'secure' is missing in type '{ host: string; port: number; }'
//   but required in type 'Config'.
//
// Fix: add the missing field
connect({ host: "localhost", port: 8080, secure: false }); // OK

// Another common pattern: excess property check
connect({ host: "localhost", port: 8080, secure: false, debug: true });
//                                                        ^^^^^
// Object literal may only specify known properties,
// and 'debug' does not exist in type 'Config'.`,
    },
  ];

  const comparisonOldCode = `function pluck(arr, key) {
  return arr.map(item => item[key]);
}

const users = [
  { name: "Ada",   age: 36 },
  { name: "Boole", age: 51 },
];

const names = pluck(users, "name"); // ["Ada", "Boole"]
const ages  = pluck(users, "agee"); // [undefined, undefined] — typo!
// No error. The bug ships.`;

  const comparisonNewCode = `function pluck<T, K extends keyof T>(arr: T[], key: K): T[K][] {
  return arr.map(item => item[key]);
}

const users = [
  { name: "Ada",   age: 36 },
  { name: "Boole", age: 51 },
];

const names = pluck(users, "name"); // string[]
const ages  = pluck(users, "agee");
//                          ^^^^^^
// tsc error: Argument of type '"agee"' is not assignable
// to parameter of type '"name" | "age"'.
// The bug is caught at build time.`;

  const playgroundHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>TypeScript narrowing demo</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <h2>Narrowing demo</h2>
  <p class="hint">
    Try this: change the <code>inputs</code> array below. The runtime branches
    you see (string formatting, array length, object keys) are exactly what
    TypeScript&apos;s narrowing tracks at compile time.
  </p>
  <pre id="output"></pre>
  <script src="/script.js"></script>
</body>
</html>`;

  const playgroundCss = `body {
  font-family: system-ui, sans-serif;
  max-width: 640px;
  margin: 24px auto;
  padding: 0 16px;
  color: #1e293b;
}
h2 { margin-bottom: 4px; font-size: 1.1rem; }
.hint {
  font-size: 0.82rem;
  color: #64748b;
  margin-bottom: 16px;
  background: #f1f5f9;
  padding: 8px 12px;
  border-radius: 6px;
  border-left: 3px solid #3b82f6;
}
pre {
  background: #0f172a;
  color: #e2e8f0;
  padding: 16px;
  border-radius: 8px;
  font-family: monospace;
  font-size: 0.8rem;
  white-space: pre-wrap;
  word-break: break-word;
  min-height: 120px;
}`;

  const playgroundJs = `// Try this: change the inputs array below. The runtime branches you see
// (string formatting, array length, object keys) are exactly what
// TypeScript's narrowing tracks at compile time.

const inputs = [
  "hello world",
  42,
  ["alpha", "beta", "gamma"],
  { name: "Ada", age: 36 },
  null,
];

function formatValue(v) {
  if (v === null || v === undefined) {
    return "(null/undefined) — no value";
  }
  if (typeof v === "string") {
    // typeof narrows to string — safe to call .toUpperCase()
    return "(string) \\"" + v.toUpperCase() + "\\" — length: " + v.length;
  }
  if (typeof v === "number") {
    // typeof narrows to number — safe to call .toFixed()
    return "(number) " + v.toFixed(2);
  }
  if (Array.isArray(v)) {
    // Array.isArray narrows to array — safe to use .length and .join()
    return "(array)  [" + v.join(", ") + "] — " + v.length + " items";
  }
  if (typeof v === "object" && "name" in v) {
    // 'in' narrows — safe to access v.name
    return "(object) name=" + v.name + ", age=" + v.age;
  }
  return "(unknown) " + String(v);
}

const lines = inputs.map((v, i) => "input[" + i + "]: " + formatValue(v));
document.getElementById("output").textContent = lines.join("\\n");`;

  return (
    <div className="space-y-8">

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 1: Hook                                                       */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Card>
        <CardContent className="pt-6">
          <div className="prose dark:prose-invert max-w-none">
            <p>
              Half the bugs you would have shipped, you don&apos;t. The compiler stopped you. The
              other half — the ones types can&apos;t catch — you ship anyway. TypeScript&apos;s job
              is the first half: structural correctness at the boundaries of your code, before any
              test runs.
            </p>
            <p>
              You misspell a property. You pass an <code>id: number</code> where the API expects{" "}
              <code>id: string</code>. You call <code>.map()</code> on something that turned out to
              be <code>null</code>. These aren&apos;t logic bugs — they&apos;re structural
              mismatches. JavaScript runs them anyway and crashes at runtime. TypeScript catches them
              at build time, when the fix is cheap. This module walks the path from plain{" "}
              <code>.js</code> to fully typed <code>.ts</code>, step by step, building the mental
              model that makes the compiler a tool rather than an obstacle.
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
              TypeScript is a <strong>typed superset of JavaScript that adds static type
              checking</strong> and compiles to JS. Every type annotation you write is erased before
              your code reaches the browser or Node.js — TypeScript does nothing at runtime. What it
              does do is run a structural analysis pass at build time: it reads your source, checks
              that values flow through your code with consistent shapes, and rejects the file if they
              don&apos;t. The key insight is &quot;structural&quot;: TypeScript doesn&apos;t care
              about the name of a type, only its shape. Two completely unrelated interfaces with the
              same fields are interchangeable in TypeScript&apos;s eyes — which maps exactly onto how
              plain JavaScript objects actually behave.
            </p>
            <blockquote className="border-l-4 border-blue-500 pl-4 italic">
              &quot;TypeScript is a type-checker, not a runtime. Structural typing means a type is
              its shape, not its name. The compiler runs at build time; nothing TypeScript does
              survives to production.&quot;
            </blockquote>
          </div>
        </CardContent>
      </Card>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 3: Step-by-step                                               */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <StepByStepExplanation
        title="From .js to .ts"
        description="Six steps from untyped JavaScript to fully typed TypeScript"
        steps={fromJsToTsSteps}
      />

      {/* Optional: CodeComparison (JS to TS) */}
      <CodeComparison
        title="JS to TS, side by side"
        description="Same function, before and after types"
        oldCode={{
          title: "JavaScript — typo ships silently",
          code: comparisonOldCode,
          language: "javascript",
        }}
        newCode={{
          title: "TypeScript — typo caught at build time",
          code: comparisonNewCode,
          language: "typescript",
        }}
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 4: Playground                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <HTMLPlayground
        html={playgroundHtml}
        css={playgroundCss}
        js={playgroundJs}
        title="Narrowing in action"
        description="Change the inputs array and watch which branch each value takes. These runtime branches are exactly what TypeScript tracks statically."
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 5: Challenges                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Challenge
        question="What is structural typing?"
        options={[
          {
            id: "a",
            text: "A type system where two types are compatible only if their declared names match.",
          },
          {
            id: "b",
            text: "A type system where two types are compatible if their shape matches, regardless of name.",
          },
          {
            id: "c",
            text: "A type system that infers types from usage rather than declarations.",
          },
          {
            id: "d",
            text: "A type system that runs at runtime to check object shapes.",
          },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            TypeScript (and Go) use structural typing — <code>interface User {"{ name: string }"}</code>{" "}
            and <code>{"{ name: string }"}</code> are interchangeable because their shapes match. Java
            and C# use nominal typing — same shape, different name, not assignable without an
            explicit cast. Inference (c) is a separate concept that describes how TypeScript deduces
            types without annotations; runtime checking (d) is precisely what TypeScript does{" "}
            <em>not</em> do — it runs only at build time.
          </>
        }
      />

      <Challenge
        question={
          "Given type R = { ok: true; data: number } | { ok: false; error: string }, " +
          "which check correctly narrows r to the success arm?"
        }
        options={[
          {
            id: "a",
            text: "if (r.data) — TypeScript narrows on truthy.",
          },
          {
            id: "b",
            text: "if (r.ok) — discriminated union; TypeScript narrows on the literal true.",
          },
          {
            id: "c",
            text: "if (typeof r === \"object\").",
          },
          {
            id: "d",
            text: "if (\"data\" in r) — narrows by property existence.",
          },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            Discriminated unions narrow on the discriminator field — here <code>ok</code>. Inside{" "}
            <code>if (r.ok)</code>, TypeScript knows <code>ok</code> is <code>true</code>, so it
            narrows <code>r</code> to the <code>{"{ ok: true; data: number }"}</code> arm and makes{" "}
            <code>r.data</code> accessible. Option (a) doesn&apos;t work because{" "}
            <code>r.data</code> is only reachable after narrowing, not before. Option (d) also
            narrows in some cases but is less idiomatic for discriminated unions where the tag field
            is the conventional check.
          </>
        }
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 6: GotchaList                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <GotchaList
        items={[
          {
            title: "`any` defeats the entire system — prefer `unknown` and narrow it explicitly",
            body: (
              <>
                <code>any</code> tells TypeScript &quot;trust me, I know what this is&quot; — and
                TypeScript does, unconditionally, even when you are wrong. Use <code>unknown</code>{" "}
                instead: it forces you to narrow before using the value, which preserves safety.
                Reserve <code>any</code> for true escapes like auto-generated code you can&apos;t
                annotate.
              </>
            ),
          },
          {
            title:
              "`interface` and `type` are nearly interchangeable; `interface` is open (declaration-mergeable), `type` is closed",
            body: (
              <>
                Both declare a named shape. The meaningful difference: <code>interface</code> can
                be re-opened with a second declaration in the same scope (useful for augmenting
                library types); <code>type</code> cannot. For most application code, pick one and
                stay consistent — the common convention is <code>interface</code> for object shapes,{" "}
                <code>type</code> for unions and computed types.
              </>
            ),
          },
          {
            title:
              "TS doesn't validate at runtime — bad JSON from an API still crashes; pair with a runtime validator (zod, valibot)",
            body: (
              <>
                TypeScript&apos;s types are erased before runtime. When you cast an API response
                with <code>as MyType</code>, TypeScript believes you — but if the server sends a
                different shape, your code crashes with a runtime error that TypeScript never saw.
                A runtime validator like <strong>zod</strong> or <strong>valibot</strong> parses and
                validates the shape at the boundary, so you only get typed data if it genuinely
                matches.
              </>
            ),
          },
          {
            title:
              "The `as` cast is a lie — TS believes you, even when you're wrong; always prefer narrowing over assertion",
            body: (
              <>
                <code>value as SomeType</code> is a type assertion: you are telling the compiler to
                treat the value as <code>SomeType</code> without any check. TypeScript complies
                without question. If the assertion is wrong, the bug is fully invisible to the
                type system. Narrowing (<code>typeof</code>, <code>in</code>, discriminated union
                checks) actually proves the type rather than overriding it — always prefer that.
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
            TypeScript is a typed superset of JavaScript: every type annotation is erased at
            compile time and does nothing at runtime — it is a build-time correctness check, not a
            runtime guard.
          </>,
          <>
            Structural typing means two types are compatible if their shapes match, regardless of
            name. <code>{"interface User { name: string }"}</code> and an anonymous{" "}
            <code>{"{ name: string }"}</code> are interchangeable — this maps naturally onto how
            JavaScript objects are assembled.
          </>,
          <>
            Narrowing refines a union type to a single arm inside a branch:{" "}
            <code>typeof x === &quot;string&quot;</code>, <code>&quot;key&quot; in obj</code>, and
            discriminated union checks on a literal tag field are all narrowers.
          </>,
          <>
            Generics let you write a function or type once and have it work for many types without
            losing type information — <code>Array&lt;T&gt;</code>, <code>Promise&lt;T&gt;</code>,
            and constrained generics like <code>K extends keyof T</code> are the everyday building
            blocks.
          </>,
          <>
            Read tsc error messages top-down for context, fix bottom-up: the leaf property at the
            bottom of the chain is almost always the actual problem. &quot;Property X is missing&quot;
            means add the field; &quot;not assignable&quot; means the shapes diverged somewhere above.
          </>,
        ]}
        mentalModel="TypeScript is a type-checker, not a runtime. Structural typing means a type is its shape, not its name. The compiler runs at build time; nothing TypeScript does survives to production."
      />
    </div>
  );
}
