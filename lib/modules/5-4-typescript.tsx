"use client";

import { ScaffoldModule } from "./_template";
import { CodeBlock } from "@/components/CodeBlock";

const narrowingCode = `// --- Narrowing a union ---
function format(value: string | number): string {
  if (typeof value === "string") {
    // TypeScript knows value is string here
    return value.toUpperCase();
  }
  // TypeScript knows value is number here
  return value.toFixed(2);
}

// --- Generic function ---
function first<T>(items: T[]): T | undefined {
  return items[0];
}

const num = first([1, 2, 3]);   // inferred: number | undefined
const str = first(["a", "b"]); // inferred: string | undefined

// --- Discriminated union ---
type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

function divide(a: number, b: number): Result<number> {
  if (b === 0) {
    return { ok: false, error: "Division by zero" };
  }
  return { ok: true, value: a / b };
}

const result = divide(10, 2);
if (result.ok) {
  console.log(result.value); // number — TypeScript knows it's safe
} else {
  console.error(result.error); // string
}`;

export function Module_5_4_Content() {
  return (
    <ScaffoldModule
      emoji="🛡️"
      problemTitle="The error you didn&apos;t ship is the test you didn&apos;t write"
      problem={
        <>
          <p>
            TypeScript is a <strong>type-checker, not a runtime</strong>. Every
            type annotation you write is erased before your code reaches the
            browser or Node.js. What TypeScript gives you is a static analysis
            pass at build time — it reads your source, proves consistency, then
            steps aside. That means a runtime error like{" "}
            <code>Cannot read properties of undefined</code> is still possible
            if your types are wrong; TypeScript only enforces what you declared.
          </p>
          <p>
            TypeScript uses <strong>structural typing</strong>: the name of a
            type is irrelevant — only its shape matters. If an object has a{" "}
            <code>name: string</code> and an <code>age: number</code>, it
            satisfies any type that asks for those two fields, regardless of
            what the type is called. This makes TypeScript practical for
            real-world JavaScript, where objects are often assembled
            dynamically.
          </p>
          <p>
            <strong>Narrowing</strong> is TypeScript&apos;s killer feature for
            union types. When you write <code>typeof x === &apos;string&apos;</code>,
            TypeScript&apos;s flow-analysis tracks that into the{" "}
            <code>if</code> branch and treats <code>x</code> as{" "}
            <code>string</code> — eliminating all the other union members.{" "}
            <strong>Generics</strong> let functions and types be parameterized
            over types, so <code>first&lt;T&gt;(items: T[]): T | undefined</code>{" "}
            works for any array without losing type information.
          </p>
        </>
      }
      body={
        <CodeBlock
          language="typescript"
          fileName="narrowing.ts"
          code={narrowingCode}
        />
      }
      challenge={{
        question:
          "Why does `typeof x === 'string'` narrow `x: string | number` to `string` inside the `if` block?",
        options: [
          {
            id: "a",
            text: "JavaScript coerces the value to a string at runtime when typeof is used.",
          },
          {
            id: "b",
            text: "TypeScript's flow-analysis recognizes `typeof` as a type guard and propagates the narrowed type into the matching branch.",
          },
          {
            id: "c",
            text: "The TypeScript compiler removes the `number` type from the union globally after the check.",
          },
          {
            id: "d",
            text: "Narrowing only works with custom type predicates, not with `typeof`.",
          },
        ],
        correctAnswerId: "b",
        explanation: (
          <>
            TypeScript performs control-flow analysis on every branch. When it
            sees a <code>typeof x === &apos;string&apos;</code> guard, it knows that
            inside the <code>if</code> block <code>x</code> can only be{" "}
            <code>string</code>, and outside it can only be the remaining union
            members. No runtime change happens — it is purely a static
            inference step.
          </>
        ),
      }}
      takeaways={[
        <>
          TypeScript is erased at build time — it adds zero runtime overhead
          and catches zero runtime bugs by itself; you still need good tests.
        </>,
        <>
          Structural typing means shape beats name: two unrelated types with
          the same fields are interchangeable, which maps naturally onto plain
          JavaScript objects.
        </>,
        <>
          Use discriminated unions (<code>ok: true | false</code> as a tag)
          to make illegal states unrepresentable and let narrowing guide the
          compiler to the right arm automatically.
        </>,
      ]}
      mentalModel="TS is a type-checker, not a runtime. Structural typing: shape > name. Narrowing turns a union into one arm."
      roadmapUrl="https://roadmap.sh/frontend"
    />
  );
}
