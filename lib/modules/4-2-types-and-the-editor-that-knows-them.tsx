"use client";

import { Card, CardContent } from "@/components/ui/card";
import { StepByStepExplanation } from "@/components/StepByStepExplanation";
import { CodeBlock } from "@/components/CodeBlock";
import { Challenge } from "@/components/Challenge";
import { GotchaList } from "@/components/GotchaList";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { RoadmapLink } from "@/components/RoadmapLink";
import { CodeComparison } from "@/components/CodeComparison";

export function Module_4_2_Content() {
  // Data blocks hoisted out of JSX for readability — listed in render order.

  const typesSteps = [
    {
      title: "The diagnosis: JS trusts every caller",
      description: (
        <p>
          JavaScript has no syntax for &quot;this value must not be null.&quot; When{" "}
          <code>fetchComment()</code> returns an object, the caller trusts its shape. When that
          object is passed to <code>CommentList</code>, <code>CommentList</code> trusts the shape.
          When it is passed to <code>CommentItem</code>, <code>CommentItem</code> trusts the shape.
          Every layer is a silent handshake with no written contract. If the API ever returns{" "}
          <code>author: null</code> for an anonymous submission — which it does — every layer
          receives <code>null</code> without complaint, right up until{" "}
          <code>comment.author.name</code> throws at runtime. There is no signal anywhere earlier
          in the call stack. There is no way for any layer to <em>know to check</em>.
        </p>
      ),
      code: `// Three layers, none of which can see the shape contract.

// Layer 1: the data fetcher
async function fetchComment(id) {
  const res = await fetch(\`/api/comments/\${id}\`);
  return res.json();         // returns { id, body, author: null } — fine so far
}

// Layer 2: CommentList
function CommentList({ postId }) {
  const [comments, setComments] = useState([]);
  useEffect(() => {
    fetchComments(postId).then(setComments);
  }, [postId]);
  return comments.map(c => <CommentItem key={c.id} comment={c} />);
  // Passes c to CommentItem. No way to know c.author might be null.
}

// Layer 3: CommentItem — the crash site
function CommentItem({ comment }) {
  return (
    <li>
      <strong>{comment.author.name}</strong>  {/* Uncaught TypeError */}
      <p>{comment.body}</p>
    </li>
  );
}

// Uncaught TypeError: Cannot read properties of null (reading 'name')
// Stack: CommentItem → CommentList → render
// Root cause: the shape contract existed only in the developer's head.`,
      language: "javascript",
    },
    {
      title: "The first type: writing the contract explicitly",
      description: (
        <p>
          A <em>type</em> is a written shape contract. <code>interface Author</code> says: any
          value called <code>Author</code> must have an <code>id</code> string and a{" "}
          <code>name</code> string. <code>interface Comment</code> says:{" "}
          <code>author</code> is either an <code>Author</code> or <code>null</code>. That union{" "}
          <code>Author | null</code> is the moment the bug becomes a compile-time error. TypeScript
          sees that you are trying to access <code>comment.author.name</code> on a value that might
          be <code>null</code> and refuses to compile. The bug that took two weeks to surface in
          production would have been a red underline in the editor on day one.
        </p>
      ),
      code: `// types.ts — the written shape contracts

interface Author {
  id: string;
  name: string;
  email: string;
}

interface Comment {
  id: string;
  postId: string;
  body: string;
  author: Author | null;   // explicit: author may be absent for anonymous posts
  createdAt: string;
}

// Now CommentItem must accept the same contract:
function CommentItem({ comment }: { comment: Comment }) {
  return (
    <li>
      <strong>{comment.author.name}</strong>
      {/*                 ^^^
          error TS2531: Object is possibly 'null'.
          TypeScript refuses to compile this line.
          The bug is caught before it reaches a browser.
      */}
    </li>
  );
}`,
      language: "typescript",
    },
    {
      title: "Narrowing: how the type-checker follows your logic",
      description: (
        <p>
          An <code>if</code> statement that checks for <code>null</code> is not just runtime logic
          — TypeScript reads it too. Inside the <code>if (comment.author === null)</code> branch,
          the type-checker <em>knows</em> <code>comment.author</code> is <code>null</code>. In the{" "}
          <code>else</code> branch it <em>knows</em> it is <code>Author</code>. This is called{" "}
          <em>narrowing</em>: you start with a wide type (<code>Author | null</code>) and the
          control flow narrows it to a single arm. The editor hover proves it — hover over{" "}
          <code>comment.author</code> inside the <code>else</code> block and the tooltip shows{" "}
          <code>Author</code>, not <code>Author | null</code>. No casting required. No runtime
          overhead. The type-checker does the work by reading code you already had to write anyway.
        </p>
      ),
      code: `// CommentItem.tsx — narrowing fixes the compile error

interface Author { id: string; name: string; email: string; }
interface Comment { id: string; body: string; author: Author | null; }

function CommentItem({ comment }: { comment: Comment }) {
  // Narrowing: the if-check tells the type-checker which arm is which.
  if (comment.author === null) {
    // Inside here: comment.author is type 'null'.
    // Hover in VS Code: (property) Comment.author: null
    return (
      <li>
        <strong>Anonymous</strong>
        <p>{comment.body}</p>
      </li>
    );
  }

  // Outside the if: comment.author is type 'Author' — not null.
  // Hover in VS Code: (property) Comment.author: Author
  // Accessing .name is safe. TypeScript is satisfied.
  return (
    <li>
      <strong>{comment.author.name}</strong>
      <p>{comment.body}</p>
    </li>
  );
}

// Optional chaining (comment.author?.name) also satisfies the type-checker,
// but it silently returns undefined — you get no text instead of "Anonymous".
// Explicit narrowing communicates intent: "I chose what to show here."`,
      language: "tsx",
    },
    {
      title: "Structural typing: shape over name",
      description: (
        <p>
          If you are coming from Java, Kotlin, or C#, this will be the most surprising part of
          TypeScript. Those languages use <em>nominal typing</em>: two types are compatible only if
          one explicitly extends or implements the other. TypeScript uses{" "}
          <em>structural typing</em>: two types are compatible if they have the same shape —
          regardless of what they are named. <code>Author</code> and <code>User</code> below are
          two completely separate interfaces. Neither extends the other. But because they have
          identical properties, TypeScript treats them as interchangeable. A function that accepts
          an <code>Author</code> will accept a <code>User</code> without complaint. This models how
          JavaScript actually works: the runtime only cares about what properties an object has,
          not where it came from.
        </p>
      ),
      code: `// Structural typing — shape is what matters, not the name.

interface Author { id: string; name: string; }
interface User   { id: string; name: string; }   // same shape, different name

function greet(a: Author): string {
  return \`Hello, \${a.name}\`;
}

const user: User = { id: "u1", name: "Alice" };

greet(user);   // OK — TypeScript does not complain.
// User is structurally compatible with Author: it has id and name.
// The type-checker compares shapes, not names.

// Java/Kotlin equivalent would require:
//   class User extends Author { ... }   or   class User implements Author { ... }
// TypeScript requires nothing. If the shape fits, it is assignable.

// Practical consequence: types from an API response and your UI model
// stay compatible as long as their shapes overlap — no adapter layer needed.
// A type with *more* properties is still assignable to a type with fewer:
interface SuperUser { id: string; name: string; role: string; }
const su: SuperUser = { id: "su1", name: "Bob", role: "admin" };
greet(su);   // OK — SuperUser has at least the shape of Author.`,
      language: "typescript",
    },
    {
      title: "Generics: one function for many types",
      description: (
        <p>
          A <em>generic</em> is a type parameter — a placeholder that stands in for a concrete type
          until the function is called. Without generics, you would write{" "}
          <code>findPostById</code>, <code>findCommentById</code>, and{" "}
          <code>findAuthorById</code> separately — three identical functions that differ only in
          the type they operate on. With generics, you write one function that works for all three,
          and the type-checker fills in the concrete type at each call site. The constraint{" "}
          <code>T extends &#123; id: string &#125;</code> is a contract: &quot;T is some type that
          has at least an <code>id</code> string.&quot; It is not magic — it is just a way to say
          &quot;this placeholder must have this shape.&quot;
        </p>
      ),
      code: `// Without generics — repeated code for each type:
function findPostById(items: Post[], id: string): Post | undefined {
  return items.find(item => item.id === id);
}
function findCommentById(items: Comment[], id: string): Comment | undefined {
  return items.find(item => item.id === id);
}
// ... repeat for Author, Tag, etc.

// With generics — one function for any type that has an id:
function findById<T extends { id: string }>(items: T[], id: string): T | undefined {
  return items.find(item => item.id === id);
}

// The type-checker infers T at each call site:
const post    = findById(posts,    "p1");   // T inferred as Post    → Post | undefined
const comment = findById(comments, "c1");   // T inferred as Comment → Comment | undefined
const author  = findById(authors,  "a1");   // T inferred as Author  → Author | undefined

// If you pass a type without an id property, TypeScript refuses to compile:
findById(["hello", "world"], "hello");
// error TS2344: Type 'string' does not satisfy the constraint '{ id: string }'.

// The constraint is the load-bearing part. Without it, you could not access item.id.
// Read <T extends { id: string }> as: "T is some type that has at least these properties."`,
      language: "typescript",
    },
    {
      title: "The toolchain: tsc --noEmit and the editor",
      description: (
        <p>
          TypeScript is compiled to JavaScript before the browser runs it. The compiler{" "}
          (<code>tsc</code>) does two things: it type-checks your code and it emits JavaScript.
          In a Vite project the build step uses a faster tool (esbuild or SWC) to strip types and
          emit JavaScript — it does not type-check. That is why the <code>package.json</code> has a
          separate <code>typecheck</code> script: <code>tsc --noEmit</code> runs the type-checker
          without emitting any files. It is a pure validity gate. The editor (VS Code) runs the
          same checker in the background and shows errors as red underlines in real time. Both
          tools read the same <code>tsconfig.json</code>. The key setting is{" "}
          <code>strict: true</code>, which turns on a suite of checks including{" "}
          <em>type erasure</em>-aware rules and null-safety. Every new project should start with{" "}
          it on.
        </p>
      ),
      code: `// tsconfig.json — the configuration file tsc reads

{
  "compilerOptions": {
    "target": "ES2020",          // what JS syntax to emit (or preserve)
    "lib": ["ES2020", "DOM"],    // which global types to include
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,              // enables all strict checks — always on
    "noEmit": true,              // don't produce output; only type-check
    "jsx": "react-jsx"           // how to compile JSX
  },
  "include": ["src"]
}

// ── What 'strict: true' enables ────────────────────────────────────────────
// strictNullChecks    : null and undefined are not assignable to every type.
//                       This is what makes 'Author | null' meaningful.
// noImplicitAny       : parameters must have an explicit type or be inferrable.
// strictFunctionTypes : function parameter types are checked contravariantly.
// (and several more)

// ── The two-step build ──────────────────────────────────────────────────────
// tsc --noEmit         → type-checks; reports errors; produces no files
// vite build           → strips types; bundles; produces dist/ (no type-check)
//
// Run both in CI. The build alone is not a substitute for the type-check.

// package.json scripts:
// "typecheck": "tsc --noEmit"
// "build":     "tsc -b && vite build"   (tsc -b also runs the check first)`,
      language: "json",
    },
    {
      title: "Reading a tsc error and fixing it",
      description: (
        <p>
          A <code>tsc</code> error has a predictable shape: file path, line number, error code, and
          a message. The error code (<code>TS2531</code>, <code>TS2532</code>, etc.) is searchable.
          The message is specific enough to act on. Learning to read the error rather than
          reaching immediately for a cast (<code>as Type</code>) or a non-null assertion (
          <code>!</code>) is the skill that separates TypeScript users from TypeScript abusers. The
          example below shows the full round-trip: raw error, root cause, and the correct fix using
          narrowing. The result is code from{" "}
          <code>examples/taproot-blog/spa/src/components/CommentList.tsx</code>, fully typed with
          the <code>Comment</code> interface and the <code>author: Author | null</code> union
          handled explicitly.
        </p>
      ),
      code: `// ── The raw tsc error ─────────────────────────────────────────────────────
// src/components/CommentItem.tsx:12:22 - error TS2531: Object is possibly 'null'.
//
//  12       <strong>{comment.author.name}</strong>
//                            ~~~~~~
// Found 1 error. Exiting.

// ── Root cause ─────────────────────────────────────────────────────────────
// comment.author is typed as Author | null.
// Accessing .name on a union that includes null is an error.
// TypeScript is correctly telling you the bug exists.

// ── Wrong fix: non-null assertion ──────────────────────────────────────────
// <strong>{comment.author!.name}</strong>
// The ! operator tells TypeScript "I know this is not null — trust me."
// If you are wrong, the runtime crashes exactly as before. Types are erased;
// the ! provides no protection at runtime. Never use ! as a first resort.

// ── Wrong fix: cast ────────────────────────────────────────────────────────
// <strong>{(comment.author as Author).name}</strong>
// Same problem. TypeScript trusts you. If you are wrong, crash.

// ── Correct fix: narrowing ─────────────────────────────────────────────────
// From examples/taproot-blog/spa/src/components/CommentList.tsx:

interface Author { id: string; name: string; email: string; bio: string; }
interface Comment {
  id: string; postId: string; authorName: string; body: string; createdAt: string;
}

// The spa Comment type uses authorName (a string) rather than author (an object),
// so the union is not needed there. If the design had used an embedded Author:
interface CommentWithAuthor {
  id: string;
  postId: string;
  body: string;
  author: Author | null;   // nullable for anonymous submissions
  createdAt: string;
}

function CommentItem({ comment }: { comment: CommentWithAuthor }) {
  const authorLabel = comment.author === null
    ? "Anonymous"
    : comment.author.name;   // inside the else arm: type is Author, .name is safe

  return (
    <li style={{ borderTop: "1px solid var(--border)", padding: "1rem 0" }}>
      <strong>{authorLabel}</strong>
      <span className="meta"> — {comment.createdAt.slice(0, 10)}</span>
      <p>{comment.body}</p>
    </li>
  );
}
// tsc --noEmit: 0 errors.`,
      language: "tsx",
    },
  ];

  const untypedCode = `// comments.js — untyped version
// The shape contract lives only in the developer's head.

async function fetchComments(postId) {
  const res = await fetch(\`/api/posts/\${postId}/comments\`);
  return res.json();
}

function CommentItem({ comment }) {
  // comment.author could be null. No one told us.
  return (
    <li>
      <strong>{comment.author.name}</strong>
      <p>{comment.body}</p>
    </li>
  );
}`;

  const typedCode = `// CommentItem.tsx — typed version
// The shape contract is written down. Violations are caught at compile time.

interface Author { id: string; name: string; email: string; }
interface Comment {
  id: string; postId: string; body: string;
  author: Author | null;
  createdAt: string;
}

function CommentItem({ comment }: { comment: Comment }) {
  if (comment.author === null) {
    return (
      <li>
        <strong>Anonymous</strong>
        <p>{comment.body}</p>
      </li>
    );
  }
  // Here: comment.author is Author — .name is safe.
  return (
    <li>
      <strong>{comment.author.name}</strong>
      <p>{comment.body}</p>
    </li>
  );
}`;

  const playgroundCode = `// Try this: remove the null check on line 18 (the 'if' block) and watch
// the Sandpack diagnostics panel report an error on comment.author.name.
// Then restore it to see the error disappear.

// Note: Sandpack uses TypeScript in its React template.
// The type errors appear as red underlines in the editor pane.

interface Author {
  id: string;
  name: string;
}

interface Comment {
  id: string;
  body: string;
  author: Author | null;
}

function CommentItem({ comment }: { comment: Comment }) {
  // Narrowing: the if-check tells TypeScript which arm is which.
  if (comment.author === null) {
    return (
      <li style={{ borderTop: "1px solid #e5e5e5", padding: "12px 0" }}>
        <strong style={{ color: "#555" }}>Anonymous</strong>
        <p style={{ margin: "4px 0 0" }}>{comment.body}</p>
      </li>
    );
  }

  // Here: comment.author is Author. TypeScript knows .name is safe.
  return (
    <li style={{ borderTop: "1px solid #e5e5e5", padding: "12px 0" }}>
      <strong>{comment.author.name}</strong>
      <p style={{ margin: "4px 0 0" }}>{comment.body}</p>
    </li>
  );
}

const sampleComments: Comment[] = [
  { id: "1", body: "Great explanation.", author: { id: "a1", name: "Alice" } },
  { id: "2", body: "Anonymous feedback here.", author: null },
  { id: "3", body: "I had the same question.", author: { id: "a2", name: "Bob" } },
];

export default function App() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", maxWidth: 480, margin: "24px auto", padding: "0 16px" }}>
      <h2 style={{ marginBottom: 0 }}>Comments</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {sampleComments.map(c => <CommentItem key={c.id} comment={c} />)}
      </ul>
    </div>
  );
}`;

  const gotchaItems = [
    {
      title: "TypeScript types are erased at build — they do not exist at runtime",
      body: (
        <>
          The type-checker runs before the browser sees your code. The build step (Vite, esbuild,
          SWC) strips every type annotation and produces plain JavaScript. At runtime, there are no
          interfaces, no union types, no generics. <code>instanceof</code> and <code>typeof</code>{" "}
          still work the same because they are JavaScript — not TypeScript. A type guard is a
          runtime check that TypeScript also uses to narrow; it is plain JavaScript first.
        </>
      ),
    },
    {
      title: "'any' opts out of the type system — reach for 'unknown' instead",
      body: (
        <>
          <code>any</code> tells TypeScript &quot;I do not want type-checking here.&quot; Every
          property access, every function call on an <code>any</code> value is silently accepted.
          You are back to untyped JavaScript. <code>unknown</code> is safer: it accepts any value,
          but it forces you to narrow before you use it. Use <code>unknown</code> for values you
          genuinely do not know the shape of (e.g., a JSON parse result), then narrow with{" "}
          <code>typeof</code>, <code>instanceof</code>, or a type guard function.
        </>
      ),
    },
    {
      title: "Optional chaining (?.) silences an error but may not be the right fix",
      body: (
        <>
          <code>comment.author?.name</code> returns <code>undefined</code> when{" "}
          <code>comment.author</code> is <code>null</code> — and TypeScript is satisfied. But the
          UI then renders nothing where a name should appear, with no indication that something was
          missing. If you have already proved <code>comment.author</code> is not null (via
          narrowing), adding <code>?.</code> is noise that hides intent. Reserve{" "}
          <code>?.</code> for cases where absence is genuinely harmless and you consciously choose
          to render nothing.
        </>
      ),
    },
    {
      title: "'as Type' is a cast, not a check — TypeScript trusts you blindly",
      body: (
        <>
          <code>comment.author as Author</code> tells the type-checker &quot;pretend this is an{" "}
          <code>Author</code>, no questions.&quot; If <code>comment.author</code> is actually{" "}
          <code>null</code>, the runtime crashes the same way it would have without types. A cast
          cannot make a <code>null</code> into an <code>Author</code>. It only silences the
          compiler. Use casts only when you have external evidence the type-checker cannot see —
          and document why.
        </>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-3xl font-bold">Types and the Editor That Knows Them</h1>
        <RoadmapLink url="https://roadmap.sh/frontend" />
      </div>

      {/* Section 1: Hook */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            The SPA from module 4-1 ships. Two weeks later a user reports:{" "}
            <em>Uncaught TypeError: Cannot read properties of null (reading &apos;name&apos;)</em>.
            You trace the stack. A <code>Comment</code> had no <code>.author</code> — the API
            returned <code>author: null</code> for an anonymous submission. JavaScript passed{" "}
            <code>null</code> through three layers without complaint: the data fetcher, the{" "}
            <code>CommentList</code> component, and the <code>CommentItem</code> component. None of
            the three checked. None had a way to <em>know to check</em>. The crash site was{" "}
            <code>comment.author.name</code> in the render function — the farthest possible point
            from the actual cause.
          </p>
          <div className="bg-slate-900 text-slate-100 rounded p-4 font-mono text-sm mb-4 overflow-x-auto leading-relaxed">
            <span className="text-slate-400">{"// CommentItem.js — the crash"}</span>
            <br />
            <span className="text-amber-300">function</span>{" "}
            <span className="text-yellow-200">CommentItem</span>
            <span className="text-slate-300">{"({ comment }) {"}</span>
            <br />
            <span className="text-slate-300">&nbsp;&nbsp;</span>
            <span className="text-amber-300">return</span>{" "}
            <span className="text-slate-300">{"("}</span>
            <br />
            <span className="text-slate-300">&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <span className="text-blue-300">{"<strong>"}</span>
            <span className="text-slate-300">{"{"}</span>
            <span className="text-red-400">comment.author.name</span>
            <span className="text-slate-300">{"}"}</span>
            <span className="text-blue-300">{"</strong>"}</span>
            <span className="text-slate-400">{"  ← TypeError here"}</span>
            <br />
            <span className="text-slate-300">&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <span className="text-blue-300">{"<p>"}</span>
            <span className="text-slate-300">{"{"}</span>
            <span className="text-slate-300">comment.body</span>
            <span className="text-slate-300">{"}"}</span>
            <span className="text-blue-300">{"</p>"}</span>
            <br />
            <span className="text-slate-300">&nbsp;&nbsp;{")"}</span>
            <br />
            <span className="text-slate-300">{"}"}</span>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            The data fetcher did not check because it had no contract to check against. The{" "}
            <code>CommentList</code> did not check because nothing told it <code>author</code>{" "}
            could be <code>null</code>. The <code>CommentItem</code> did not check because the
            shape of <code>comment</code> was implicit — a gentleman&apos;s agreement between
            layers, never written down. What would have to be true so that this kind of mistake
            fails <em>before</em> a user ever sees it?
          </p>
        </CardContent>
      </Card>

      {/* Section 2: Mental model */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            The instinct is to think of TypeScript as &quot;JavaScript with types added to
            it&quot; — something that runs alongside your code and catches errors as it goes. That
            is wrong in a precise way. TypeScript is a separate program that reads your source
            files, checks the rules, and then discards every type annotation before the browser
            ever sees the code. The browser runs plain JavaScript. TypeScript never runs in
            production. Its job is entirely static — to read your contracts before execution, not
            to enforce them during it.
          </p>
          <blockquote className="border-l-4 border-blue-500 pl-4 italic text-slate-600 dark:text-slate-400">
            TypeScript is a type-checker, not a runtime.
          </blockquote>
        </CardContent>
      </Card>

      {/* Section 3: Step-by-step */}
      <h2 className="text-xl font-semibold mb-3">From the null-author crash to a typed component</h2>
      <StepByStepExplanation
        title="TypeScript: contracts the type-checker can read"
        description="Each step takes one concrete capability of TypeScript and shows why it exists — starting from the untyped crash and ending with a fully typed component the type-checker validates."
        steps={typesSteps}
      />

      {/* Optional: Code comparison — untyped vs typed */}
      <CodeComparison
        title="The same component: untyped vs typed"
        description="Left: the untyped version — the null-author contract lives only in the developer's head. Right: the typed version — the contract is written, violations are compile errors."
        oldCode={{
          title: "Untyped (JS)",
          code: untypedCode,
          language: "javascript",
          cons: [
            "comment.author can be null — nothing tells you.",
            "The crash happens at runtime, in front of a user.",
            "Every caller must guess the shape from reading the API docs or the network tab.",
          ],
        }}
        newCode={{
          title: "Typed (TS)",
          code: typedCode,
          language: "typescript",
          pros: [
            "author: Author | null is the written contract — visible to every layer.",
            "The editor underlines comment.author.name before you even run the code.",
            "Narrowing with if makes the fix clear and the intent explicit.",
          ],
        }}
      />

      {/* Section 4: Playground */}
      <h2 className="text-xl font-semibold mb-3">Try it yourself</h2>
      <div className="space-y-4">
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          The playground below shows the typed <code>CommentItem</code> with three comments, one of
          which has <code>author: null</code>. The <code>if</code> narrows the union so each arm
          renders correctly. The first comment in the file explains what to try.
        </p>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          Sandpack runs a TypeScript-aware language server in the browser. Remove the null-check{" "}
          <code>if</code> block and access <code>comment.author.name</code> directly — the editor
          will underline it with a type error (<em>Object is possibly null</em>) before you run
          anything. Restore the narrowing to clear it.
        </p>
        <CodeBlock
          code={playgroundCode}
          language="tsx"
          fileName="CommentItem.tsx (editable concept)"
        />
      </div>

      {/* Section 5: Challenges */}
      <h2 className="text-xl font-semibold mb-3">Challenges</h2>

      <Challenge
        title="Reading a tsc error"
        question={`You run 'tsc --noEmit' and see:

src/components/CommentItem.tsx:8:22 - error TS2531: Object is possibly 'null'.

  8   <strong>{comment.author.name}</strong>
                       ~~~~~~

comment is typed as { id: string; body: string; author: Author | null }.

Which fix is correct?`}
        options={[
          {
            id: "a",
            text: "Use a non-null assertion: comment.author!.name. This tells TypeScript the value is never null.",
          },
          {
            id: "b",
            text: "Narrow with an if-check: if (comment.author === null) return <Anonymous />; then access comment.author.name safely in the else branch.",
          },
          {
            id: "c",
            text: "Cast with 'as': (comment.author as Author).name. TypeScript will verify the cast is safe.",
          },
          {
            id: "d",
            text: "Remove the Author | null union and write author: Author. The null case can never happen in practice.",
          },
        ]}
        correctAnswerId="b"
        explanation={
          <p>
            Narrowing (<strong>b</strong>) is the correct fix. Inside the{" "}
            <code>if (comment.author === null)</code> branch, TypeScript knows the type is{" "}
            <code>null</code>; in the else branch it knows the type is <code>Author</code>, so{" "}
            <code>.name</code> is safe. The non-null assertion (<strong>a</strong>) and the cast (
            <strong>c</strong>) silence the compiler but provide no runtime protection — if{" "}
            <code>author</code> is actually <code>null</code>, the crash happens as before.
            Removing the union (<strong>d</strong>) hides the possibility from the type-checker
            but does not change what the API returns; you are back to an untyped promise with extra
            steps.
          </p>
        }
      />

      <Challenge
        title="Structural typing in practice"
        question={`You have two interfaces:

interface Author { id: string; name: string; }
interface User   { id: string; name: string; }

And a function:

function greet(a: Author): string {
  return 'Hello, ' + a.name;
}

You call it with a User value:

const user: User = { id: "u1", name: "Alice" };
greet(user);

What does TypeScript do?`}
        options={[
          {
            id: "a",
            text: "Compile error. User does not extend Author, so it is not assignable to Author.",
          },
          {
            id: "b",
            text: "Compiles without error. TypeScript checks shape, not name — User has the same properties as Author, so it is structurally compatible.",
          },
          {
            id: "c",
            text: "Runtime error. The JavaScript engine checks types at runtime and rejects a User where an Author is expected.",
          },
          {
            id: "d",
            text: "Compiles with a warning. TypeScript flags the mismatch but allows it.",
          },
        ]}
        correctAnswerId="b"
        explanation={
          <p>
            TypeScript uses <strong>structural typing</strong>: it compares the shape of types, not
            their names. <code>User</code> has <code>id: string</code> and{" "}
            <code>name: string</code> — exactly the shape <code>greet</code> needs. The call
            compiles without error or warning. This differs from Java and C#, which use nominal
            typing and would require <code>User extends Author</code> or{" "}
            <code>User implements Author</code>. Option <strong>c</strong> is impossible: types are
            erased at build time and the JavaScript runtime has no concept of TypeScript interfaces.
          </p>
        }
      />

      {/* Section 6: GotchaList */}
      <h2 className="text-xl font-semibold mb-3">Things that surprise people</h2>
      <GotchaList items={gotchaItems} />

      {/* Section 7: KeyTakeaways */}
      <KeyTakeaways
        mentalModel="TypeScript is a type-checker, not a runtime."
        points={[
          <>
            TypeScript reads your source files, checks the rules, and then discards every type
            annotation. The browser runs plain JavaScript. <em>Type erasure</em> means types cannot
            catch errors at runtime — they catch errors at compile time, before the browser sees
            anything. A cast (<code>as</code>) or a non-null assertion (<code>!</code>) cannot
            protect you at runtime; they only silence the checker.
          </>,
          <>
            Writing <code>Author | null</code> is the moment the null-author bug becomes a
            compile-time error. The union forces every caller to acknowledge that{" "}
            <code>author</code> might be absent. <em>Narrowing</em> — an <code>if</code> that
            checks for <code>null</code> — tells the type-checker which arm of the union you are
            in, so you can access properties safely in each branch.
          </>,
          <>
            TypeScript uses <em>structural typing</em>: two types are compatible when they have the
            same shape, regardless of name. This is the opposite of nominal typing (Java, C#),
            where compatibility requires explicit inheritance or interface implementation. In
            TypeScript, if a type has the right properties, it fits — no extension needed.
          </>,
          <>
            A <em>generic</em> is a type parameter — a placeholder filled in at each call site.{" "}
            <code>findById&lt;T extends &#123; id: string &#125;&gt;</code> works for{" "}
            <code>Post</code>, <code>Comment</code>, and <code>Author</code> without duplication.
            Read the constraint as &quot;T is some type that has at least these properties.&quot;
            Generics are not exotic — they are how you avoid copy-pasting the same logic for every
            type.
          </>,
          <>
            <code>tsc --noEmit</code> is the type-checking gate. Run it in CI. The build step
            (Vite, esbuild) strips types without checking them — a successful build is not proof
            that your types are correct. <code>strict: true</code> in <code>tsconfig.json</code>{" "}
            turns on the full suite of checks including null-safety. Every project should start
            with it on.
          </>,
        ]}
      />
    </div>
  );
}
