"use client";

import { Card, CardContent } from "@/components/ui/card";
import { StepByStepExplanation } from "@/components/StepByStepExplanation";
import { ReactPlayground } from "@/components/CodePlayground";
import { Challenge } from "@/components/Challenge";
import { GotchaList } from "@/components/GotchaList";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { RoadmapLink } from "@/components/RoadmapLink";
import { CodeComparison } from "@/components/CodeComparison";

export function Module_4_1_Content() {
  // Data blocks hoisted out of JSX for readability — listed in render order.

  const domToReactSteps = [
    {
      title: "The vanilla baseline: everything the edit-comment flow touches",
      description: (
        <p>
          Here is what &quot;add an edit button to a comment&quot; requires in vanilla JS. You need
          to find the right DOM node, hide the static <code>&lt;p&gt;</code>, create and insert a{" "}
          <code>&lt;textarea&gt;</code>, wire up Save and Cancel, on Save write the new text back
          into the DOM, update the timestamp, restore the static view. At every step, state is
          stored in a different place: the <code>comments</code> array in memory, the text currently
          in the <code>&lt;textarea&gt;</code>, and the text currently in the live{" "}
          <code>&lt;p&gt;</code>. Those three copies can drift — and they do.
        </p>
      ),
      code: `// assets/comments.js — the edit flow in vanilla
// Three places state lives. Any one of them can drift.

const comments = [
  { id: 1, author: "Bob", body: "Great first post.", ts: "2026-04-01" },
];

function renderComment(c) {
  const li = document.createElement("li");
  li.dataset.id = String(c.id);

  const bodyP = document.createElement("p");
  bodyP.className = "body";
  bodyP.textContent = c.body;          // Place 1: DOM <p> text

  const tsSpan = document.createElement("span");
  tsSpan.className = "ts";
  tsSpan.textContent = c.ts;

  const editBtn = document.createElement("button");
  editBtn.className = "js-edit";
  editBtn.textContent = "Edit";
  editBtn.addEventListener("click", () => startEdit(li, c));

  li.append(bodyP, tsSpan, editBtn);
  return li;
}

function startEdit(li, c) {
  const bodyP = li.querySelector(".body");
  bodyP.hidden = true;

  const ta = document.createElement("textarea");
  ta.value = c.body;                   // Place 2: textarea.value

  const save = document.createElement("button");
  save.textContent = "Save";
  save.addEventListener("click", () => {
    c.body = ta.value;                 // Place 3: in-memory JS object
    bodyP.textContent = ta.value;      // sync DOM <p>
    bodyP.hidden = false;
    ta.remove(); save.remove(); cancel.remove();
    // BUG: if the server updated c.body between Edit and Save,
    // all three copies silently disagree. No one knows.
  });

  const cancel = document.createElement("button");
  cancel.textContent = "Cancel";
  cancel.addEventListener("click", () => {
    bodyP.hidden = false;
    ta.remove(); save.remove(); cancel.remove();
  });

  li.insertBefore(ta, bodyP);
  li.append(save, cancel);
}`,
      language: "javascript",
    },
    {
      title: "The idea: describe the result, not the steps",
      description: (
        <p>
          The root problem is that the code describes <em>transitions</em> — hide this, show that,
          insert here, remove there. But the human mental model is simpler: &quot;a comment looks
          like X when it is not being edited, and Y when it is.&quot; What if you could just write
          that description and let the framework figure out the transitions? That is the entire
          premise of <em>React</em>. Instead of imperatively mutating nodes, you declare what the
          UI should look like for a given state, and React figures out the minimum set of DOM
          mutations to make it happen.
        </p>
      ),
      code: `// The mental shift: from "how to change it" to "what it should look like"

// Vanilla (imperative) — you describe the transition:
//   bodyP.hidden = true
//   ta = document.createElement("textarea")
//   li.insertBefore(ta, bodyP)
//   save = document.createElement("button")
//   ...

// React (declarative) — you describe the result:
//   if (isEditing) {
//     return <textarea value={text} />
//   } else {
//     return <p>{text}</p>
//   }
//
// React reads your description and works out what changed.
// You never touch the DOM directly.`,
      language: "javascript",
    },
    {
      title: "JSX is a function call, not a template",
      description: (
        <p>
          <em>JSX</em> looks like HTML inside JavaScript, but it is not. It is syntactic sugar for
          a function call. The browser cannot run JSX; the <em>build step</em> (Vite, or any bundler
          with a Babel or SWC transform) compiles it to plain JavaScript before the browser ever
          sees it. Understanding this prevents a lot of confusion: there is no template parser, no
          special string interpolation, no HTML escaping rules. JSX is JavaScript all the way down.
        </p>
      ),
      code: `// What you write (JSX):
const el = <p className="body">{comment.body}</p>;

// What the build step compiles it to:
const el = React.createElement("p", { className: "body" }, comment.body);

// React.createElement returns a plain JS object — a "description":
// { type: "p", props: { className: "body", children: "Great first post." } }
//
// This object is NOT a DOM node. It is a lightweight description of one.
// React holds a tree of these descriptions — the "virtual DOM".
// When state changes, React builds a new description tree and diffs it
// against the previous one. Only the changed nodes touch the real DOM.

// JSX rules that follow from "it's a function call":
//   - attributes use camelCase: className, onClick, htmlFor
//   - expressions go in {}: {count + 1}, {isEditing ? "Save" : "Edit"}
//   - no if/for — use ternaries and .map() instead
//   - every JSX expression is a value you can store, pass, return`,
      language: "jsx",
    },
    {
      title: "useState: state lives inside the component",
      description: (
        <p>
          A <em>component</em> is a function that returns JSX. <em>State</em> is data that, when it
          changes, should cause the component to re-render. <code>useState</code> is a{" "}
          <em>hook</em> — a function that lets you attach state to a component call.{" "}
          <code>const [isEditing, setIsEditing] = useState(false)</code> creates one piece of state.
          When you call <code>setIsEditing(true)</code>, React calls the component function again
          with <code>isEditing === true</code> and diffs the new JSX against the old. The DOM
          updates to match. There is one source of truth: the state variable. The DOM is derived
          from it, never the other way around.
        </p>
      ),
      code: `import { useState } from "react";

function Comment({ comment }) {
  // State lives here — inside the function, reset on first render.
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(comment.body);

  // The component is called again every time isEditing or text changes.
  // React calls this function; you never call it yourself.

  if (isEditing) {
    return (
      <li>
        <textarea value={text} onChange={(e) => setText(e.target.value)} />
        <button onClick={() => setIsEditing(false)}>Save</button>
        <button onClick={() => { setText(comment.body); setIsEditing(false); }}>
          Cancel
        </button>
      </li>
    );
  }

  return (
    <li>
      <p>{text}</p>
      <button onClick={() => setIsEditing(true)}>Edit</button>
    </li>
  );
}

// One source of truth: the isEditing and text state variables.
// The DOM is a consequence of that state. It cannot drift.`,
      language: "jsx",
    },
    {
      title: "useEffect: side effects belong outside the description",
      description: (
        <p>
          The JSX a component returns is a pure description: no network calls, no timers, no direct
          DOM mutations. <em>Side effects</em> — fetching data, subscribing to a WebSocket,
          focusing an input after a state change — belong in <code>useEffect</code>. The dependency
          array is the contract: React re-runs the effect when those values change. An empty array{" "}
          <code>[]</code> means &quot;run once after the first render.&quot; Omitting it entirely
          means &quot;re-run after every render&quot; — almost never what you want. Here, focusing
          the textarea when editing starts is a side effect: it reaches outside the description and
          touches the DOM directly.
        </p>
      ),
      code: `import { useState, useEffect, useRef } from "react";

function Comment({ comment }) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(comment.body);
  const textareaRef = useRef(null);

  // Side effect: focus the textarea when isEditing flips to true.
  // The dependency array [isEditing] means: "re-run when isEditing changes."
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  if (isEditing) {
    return (
      <li>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
        <button onClick={() => { setText(comment.body); setIsEditing(false); }}>
          Cancel
        </button>
      </li>
    );
  }

  return (
    <li>
      <p>{text}</p>
      <button onClick={() => setIsEditing(true)}>Edit</button>
    </li>
  );
}`,
      language: "jsx",
    },
    {
      title: "The Vite + React + TypeScript toolchain",
      description: (
        <p>
          JSX and TypeScript are not things the browser understands natively. They require a{" "}
          <em>build step</em> — a program that compiles your source into plain JavaScript the
          browser can run. Vite is that tool. <code>npm create vite@latest</code> scaffolds a
          project with everything wired up: a dev server with hot-module replacement, a production
          bundler, and TypeScript support. <em>npm</em> is the <em>package manager</em>:{" "}
          <code>npm install</code> reads <code>package.json</code> and downloads every listed
          dependency into <code>node_modules/</code>. ESLint catches bugs before they reach the
          browser; Prettier enforces consistent formatting so code review stays about logic, not
          whitespace.
        </p>
      ),
      code: `{
  "name": "taproot-blog-spa",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@tanstack/react-query": "^5.59.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router": "^7.1.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "typescript": "^5.6.0",
    "vite": "^6.0.0"
  }
}

# Bootstrap a new project:
# npm create vite@latest my-app -- --template react-ts
# cd my-app && npm install && npm run dev
#
# npm run dev    — dev server with hot reload (port 5173 by default)
# npm run build  — outputs to dist/ — these are the files you deploy
# npm run lint   — ESLint catches bugs and style issues
# tsc --noEmit   — TypeScript type-checks without emitting files`,
      language: "json",
    },
    {
      title: "The same edit-comment flow in React — the bug from module 2-1 is gone",
      description: (
        <p>
          Here is the <code>Comment</code> component from{" "}
          <code>examples/taproot-blog/spa/</code>. It holds <code>isEditing</code> and{" "}
          <code>text</code> in state. When editing, it renders a textarea; when not editing, it
          renders a paragraph. <code>onSave</code> is a callback the parent provides — the parent
          owns the authoritative comment list and decides whether to persist the change. There are
          no hidden copies of the text. There is no in-memory array to sync with the DOM. The
          state-vs-DOM divergence bug seeded in module 2-1 is not patched — the new model has
          nowhere for it to live.
        </p>
      ),
      code: `// Comment.tsx — adapted from examples/taproot-blog/spa/
import { useState, useEffect, useRef } from "react";

interface CommentData {
  id: number;
  author: string;
  body: string;
  ts: string;
}

interface Props {
  comment: CommentData;
  onSave: (id: number, newBody: string) => void;
}

export function Comment({ comment, onSave }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(comment.body);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing) textareaRef.current?.focus();
  }, [isEditing]);

  function handleSave() {
    onSave(comment.id, text);
    setIsEditing(false);
  }

  function handleCancel() {
    setText(comment.body); // reset to the prop value — one source of truth
    setIsEditing(false);
  }

  return (
    <li style={{ borderTop: "1px solid #e5e5e5", padding: "1rem 0" }}>
      <strong>{comment.author}</strong>
      <span style={{ color: "#666", fontSize: ".85rem" }}> — {comment.ts}</span>
      {isEditing ? (
        <>
          <textarea
            ref={textareaRef}
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ display: "block", width: "100%", marginTop: ".5rem" }}
          />
          <button onClick={handleSave}>Save</button>{" "}
          <button onClick={handleCancel}>Cancel</button>
        </>
      ) : (
        <>
          <p style={{ margin: ".5rem 0" }}>{text}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </>
      )}
    </li>
  );
}`,
      language: "tsx",
    },
  ];

  const vanillaEditCode = `// Vanilla DOM edit-comment — state in three places
function startEdit(li, c) {
  const bodyP = li.querySelector(".body");
  bodyP.hidden = true;                   // Place 1: live DOM node

  const ta = document.createElement("textarea");
  ta.value = c.body;                     // Place 2: textarea.value
  li.insertBefore(ta, bodyP);

  const save = document.createElement("button");
  save.textContent = "Save";
  save.addEventListener("click", () => {
    c.body = ta.value;                   // Place 3: in-memory JS object
    bodyP.textContent = ta.value;        // sync back to DOM
    bodyP.hidden = false;
    ta.remove(); save.remove(); cancel.remove();
    // If the server refreshed c.body between Edit and Save,
    // all three copies silently disagree. No one knows.
  });

  const cancel = document.createElement("button");
  cancel.textContent = "Cancel";
  cancel.addEventListener("click", () => {
    bodyP.hidden = false;
    ta.remove(); save.remove(); cancel.remove();
  });

  li.append(save, cancel);
}`;

  const reactEditCode = `// React edit-comment — one source of truth
import { useState, useEffect, useRef } from "react";

export function Comment({ comment, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(comment.body);
  const ref = useRef(null);

  useEffect(() => {
    if (isEditing) ref.current?.focus();
  }, [isEditing]);

  return (
    <li>
      {isEditing ? (
        <>
          <textarea ref={ref} value={text}
            onChange={(e) => setText(e.target.value)} />
          <button onClick={() => { onSave(comment.id, text); setIsEditing(false); }}>
            Save
          </button>
          <button onClick={() => { setText(comment.body); setIsEditing(false); }}>
            Cancel
          </button>
        </>
      ) : (
        <>
          <p>{text}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </>
      )}
    </li>
  );
}
// State lives in one place: isEditing and text.
// The DOM is derived from them. It cannot drift.`;

  const playgroundCode = `// Try this: swap useState for two separate calls (isEditing and text)
// and watch how the component still works because the function is re-called.

import { useState, useEffect, useRef } from "react";

const initialComments = [
  { id: 1, author: "Bob", body: "Great first post. Looking forward to the CSS one." },
  { id: 2, author: "Carol", body: "The bottom-up framing is exactly what I needed." },
];

function Comment({ comment, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(comment.body);
  const ref = useRef(null);

  useEffect(() => {
    if (isEditing && ref.current) ref.current.focus();
  }, [isEditing]);

  return (
    <li style={{ borderTop: "1px solid #e5e5e5", padding: "12px 0" }}>
      <strong>{comment.author}</strong>
      {isEditing ? (
        <div style={{ marginTop: 8 }}>
          <textarea
            ref={ref}
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ width: "100%", padding: "6px", fontFamily: "inherit" }}
          />
          <div style={{ marginTop: 6, display: "flex", gap: 8 }}>
            <button
              onClick={() => { onSave(comment.id, text); setIsEditing(false); }}
              style={{ padding: "4px 12px", background: "#5b21b6", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}
            >
              Save
            </button>
            <button
              onClick={() => { setText(comment.body); setIsEditing(false); }}
              style={{ padding: "4px 12px", border: "1px solid #ccc", borderRadius: 4, cursor: "pointer" }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div style={{ marginTop: 4 }}>
          <p style={{ margin: "4px 0" }}>{text}</p>
          <button
            onClick={() => setIsEditing(true)}
            style={{ fontSize: "0.8rem", padding: "2px 8px", border: "1px solid #ccc", borderRadius: 4, cursor: "pointer" }}
          >
            Edit
          </button>
        </div>
      )}
    </li>
  );
}

export default function App() {
  const [comments, setComments] = useState(initialComments);

  function handleSave(id, newBody) {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, body: newBody } : c))
    );
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", maxWidth: 540, margin: "24px auto", padding: "0 16px" }}>
      <h2 style={{ borderBottom: "1px solid #e5e5e5", paddingBottom: 8 }}>Comments</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {comments.map((c) => (
          <Comment key={c.id} comment={c} onSave={handleSave} />
        ))}
      </ul>
    </div>
  );
}`;

  const gotchaItems = [
    {
      title: "Calling setX(...) does not update x immediately — x is the old value until the next render",
      body: (
        <>
          Inside an event handler, <code>setCount(count + 1)</code> schedules a re-render; it does
          not mutate <code>count</code> right now. If you call it three times in a row, all three
          calls read the same stale <code>count</code> and the counter only goes up by 1. Use the
          updater form instead: <code>setCount((c) =&gt; c + 1)</code> — the updater receives the
          latest value, so three calls correctly increment by 3.
        </>
      ),
    },
    {
      title: "useEffect dependency arrays are not optional — leave one out and your effect reads stale values",
      body: (
        <>
          React runs an effect after every render where a listed dependency changed. If you omit a
          value your effect reads — say, a prop <code>postId</code> — the effect uses the value from
          the first render forever, regardless of what <code>postId</code> is now. The linter rule{" "}
          <code>react-hooks/exhaustive-deps</code> exists solely to catch this class of bug. Treat
          it as an error, not a warning.
        </>
      ),
    },
    {
      title: "JSX is JavaScript — if/for do not work inside it the way they do in templates",
      body: (
        <>
          JSX compiles to a function call; a function call is an expression, not a statement. You
          cannot put an <code>if</code> statement or a <code>for</code> loop inside JSX curly braces
          because those are statements, not expressions. Use the ternary operator{" "}
          (<code>condition ? a : b</code>) for conditional rendering, <code>.map()</code> for lists,
          and short-circuit <code>&amp;&amp;</code> for &quot;render only if true.&quot;
        </>
      ),
    },
    {
      title: "A component re-rendering does not mean the DOM changes — React diffs first",
      body: (
        <>
          When <code>setIsEditing(false)</code> is called, React calls the component function again
          and builds a new description tree. It then diffs that tree against the previous one. If
          the description is identical for a given subtree — same element type, same props, same
          children — React leaves the corresponding DOM nodes untouched. Re-rendering is cheap;
          real DOM mutation is the expensive part, and React minimizes it.
        </>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-3xl font-bold">The DOM Is a Footgun at Scale</h1>
        <RoadmapLink url="https://roadmap.sh/frontend" />
      </div>

      {/* Section 1: Hook */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            Back in module 2-1, you wired up a &quot;Show comments&quot; toggle with a handful of
            vanilla JS. The code worked. There was one lurking problem — the <code>commentCount</code>{" "}
            variable lived separately from the <code>data-count</code> DOM attribute — but you could
            squint past it. Modules 2-2 and 2-3 added async fetching and a backend API, and they
            preserved that bug alongside the new code. It was still manageable, barely, because the
            feature was read-only.
          </p>
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            Now: add an &quot;Edit your own comment&quot; button. When the user clicks Edit, hide
            the static <code>&lt;p&gt;</code>, show a <code>&lt;textarea&gt;</code> pre-filled with
            the current text, and wire up Save and Cancel. On Save, write the new text back to the{" "}
            <code>&lt;p&gt;</code>, update the timestamp, and call the server. On Cancel, restore
            the original text. Sounds simple. Here is what the code actually has to track:
          </p>
          <div className="bg-slate-900 text-slate-100 rounded p-4 font-mono text-sm mb-4 overflow-x-auto leading-relaxed">
            <span className="text-slate-400">{"// State is now in three places simultaneously:"}</span>
            <br />
            <span className="text-amber-300">const</span>{" "}
            <span className="text-blue-300">comments</span>{" "}
            <span className="text-slate-300">= [...]</span>
            <span className="text-slate-400">{"  // 1. the JS array in memory"}</span>
            <br />
            <span className="text-amber-300">textarea</span>
            <span className="text-slate-300">.value</span>
            <span className="text-slate-400">{"            // 2. the live DOM textarea"}</span>
            <br />
            <span className="text-amber-300">bodyP</span>
            <span className="text-slate-300">.textContent</span>
            <span className="text-slate-400">{"       // 3. the live DOM paragraph"}</span>
            <br />
            <br />
            <span className="text-slate-400">{"// On Save, you must sync all three."}</span>
            <br />
            <span className="text-slate-400">{"// If you miss one — or if the server responds"}</span>
            <br />
            <span className="text-slate-400">{"// between Edit and Save — they disagree silently."}</span>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            The bug seeded back in module 2-1 now has friends. State lives in the JS array, in the
            textarea&apos;s <code>value</code>, and in the static paragraph&apos;s{" "}
            <code>textContent</code>. Every Save handler must update all three in the right order.
            There is no single variable you can read to know what the user currently sees. You have
            written bugs you cannot reason about — not because you are careless, but because the
            model forces you to be everywhere at once. What would have to be different so that one
            source of truth governs what the user sees?
          </p>
        </CardContent>
      </Card>

      {/* Section 2: Mental model */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            The DOM mutation model asks you to think about transitions: what to hide, what to show,
            what to update and in which order. React inverts the question. Instead of describing how
            to change the UI, you describe <em>what the UI should look like for a given state</em>.
            A <em>component</em> is a function: feed it the current state, get back a description
            of the UI. React handles the transition — the actual DOM mutations — for you. The
            description is the source of truth. The DOM is derived from it.
          </p>
          <blockquote className="border-l-4 border-blue-500 pl-4 italic text-slate-600 dark:text-slate-400">
            A component is a function of state.
          </blockquote>
        </CardContent>
      </Card>

      {/* Section 3: Step-by-step */}
      <h2 className="text-xl font-semibold mb-3">From DOM mutation to a component function</h2>
      <StepByStepExplanation
        title="Deriving React from the problem it solves"
        description="Each step eliminates one source of state divergence from the vanilla edit-comment flow."
        steps={domToReactSteps}
      />

      {/* Optional: Code comparison — vanilla DOM mutation vs. React component */}
      <CodeComparison
        title="The same feature: vanilla vs React"
        description="Left: the vanilla edit-comment flow — state in three places, any of which can drift. Right: the React version — one source of truth, no manual DOM sync."
        oldCode={{
          title: "Vanilla DOM mutation",
          code: vanillaEditCode,
          language: "javascript",
          cons: [
            "State lives in three places: the JS array, the textarea, and the live DOM paragraph.",
            "Any save or cancel handler must sync all three — miss one and they silently diverge.",
            "A server update between Edit and Save leaves all three copies disagreeing with no detection.",
          ],
        }}
        newCode={{
          title: "React component",
          code: reactEditCode,
          language: "tsx",
          pros: [
            "One source of truth: the isEditing and text state variables.",
            "The DOM is derived from state; it cannot drift because React generates it every render.",
            "onSave delegates persistence to the parent, which owns the authoritative list.",
          ],
        }}
      />

      {/* Section 4: Playground */}
      <h2 className="text-xl font-semibold mb-3">Try it yourself</h2>
      <ReactPlayground
        title="Live editor — Comment component with edit/save/cancel"
        description="The comment list renders two editable comments. Try editing and saving to see the one-source-of-truth model in action. Then try the hint at the top of the file."
        code={playgroundCode}
      />

      {/* Section 5: Challenges */}
      <h2 className="text-xl font-semibold mb-3">Challenges</h2>

      <Challenge
        title="Root cause: state in three places"
        question={`A developer writes this vanilla edit-comment flow:

function startEdit(li, c) {
  const bodyP = li.querySelector(".body");
  bodyP.hidden = true;

  const ta = document.createElement("textarea");
  ta.value = c.body;
  li.insertBefore(ta, bodyP);

  const save = document.createElement("button");
  save.textContent = "Save";
  save.addEventListener("click", () => {
    c.body = ta.value;
    bodyP.textContent = ta.value;
    bodyP.hidden = false;
    ta.remove(); save.remove(); cancel.remove();
  });
}

A tester reports: "After I edit a comment and save, if I hit the back button and return, the old text is still there." What is the root cause?`}
        options={[
          {
            id: "a",
            text: "The data lives in multiple places. The save handler updates the in-memory object (c.body) and the DOM paragraph, but nothing persists this to the server or localStorage. The back-button navigation discards the DOM and rebuilds from the original source, which was never updated.",
          },
          {
            id: "b",
            text: "The textarea is inserted before the paragraph instead of after it. The save handler reads ta.value before the paragraph is updated, so the paragraph gets the old value.",
          },
          {
            id: "c",
            text: "addEventListener stacks — the save button fires twice because it was registered in a loop. The second call resets the value to the original.",
          },
          {
            id: "d",
            text: "The bodyP.hidden = false line runs before bodyP.textContent is set, so the browser paints the old text briefly, then shows the new text, creating a flicker that misleads the tester.",
          },
        ]}
        correctAnswerId="a"
        explanation={
          <p>
            The vanilla pattern stores state in multiple places: the JS object in memory, the
            textarea&apos;s <code>value</code>, and the DOM node&apos;s <code>textContent</code>.
            The save handler syncs them with each other, but it does not persist the change to a
            server or storage. The back-button navigation discards the entire DOM and re-renders
            from the original HTML (or re-fetches from the server), which still has the old text.
            This is a direct consequence of having no single authoritative source of truth. In
            React, the parent component owns the canonical list and its <code>onSave</code> callback
            is the one place that decides how persistence works — there is no DOM copy to fall out
            of sync with.
          </p>
        }
      />

      <Challenge
        title="The stale-closure counter"
        question={`A developer writes this React click handler:

function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  }

  return <button onClick={handleClick}>{count}</button>;
}

After one click, the counter shows 1 instead of 3. What is the cause, and what is the fix?`}
        options={[
          {
            id: "a",
            text: "setCount is asynchronous — React batches the three calls and only processes one. Fix: use setTimeout to spread them out.",
          },
          {
            id: "b",
            text: "count is the value from the current render. All three calls read the same stale count (e.g., 0) and schedule count + 1 = 1 three times. Fix: use the updater form — setCount((c) => c + 1) — which receives the latest queued value each time.",
          },
          {
            id: "c",
            text: "React ignores duplicate setState calls with the same value as an optimisation. Fix: use a different variable name for each call.",
          },
          {
            id: "d",
            text: "The button re-renders after the first setCount, interrupting the remaining two calls before they execute. Fix: wrap all three calls in startTransition().",
          },
        ]}
        correctAnswerId="b"
        explanation={
          <p>
            <code>count</code> is the value captured in the current render — call it{" "}
            <code>0</code>. All three <code>setCount(count + 1)</code> calls evaluate to{" "}
            <code>setCount(0 + 1)</code> and schedule the same value. React&apos;s batching
            deduplicates them: the next render sees <code>count === 1</code>. The updater form{" "}
            <code>setCount((c) =&gt; c + 1)</code> is different: React calls the updater function
            with the <em>latest queued</em> value each time, so three calls correctly produce{" "}
            <code>0 + 1 = 1</code>, <code>1 + 1 = 2</code>, <code>2 + 1 = 3</code>. Prefer the
            updater form whenever new state depends on old state.
          </p>
        }
      />

      {/* Section 6: GotchaList */}
      <h2 className="text-xl font-semibold mb-3">Things that surprise people</h2>
      <GotchaList items={gotchaItems} />

      {/* Section 7: KeyTakeaways */}
      <KeyTakeaways
        mentalModel="A component is a function of state."
        points={[
          <>
            The vanilla DOM mutation model forces state into multiple places simultaneously — the
            JS object, the live DOM node, any form inputs currently on screen. Any of those copies
            can drift from the others. React eliminates the problem by making the DOM a consequence
            of <em>state</em>: there is one source of truth, and the DOM is derived from it every
            render.
          </>,
          <>
            <em>JSX</em> is syntactic sugar for <code>React.createElement</code> calls. The browser
            never sees JSX — the <em>build step</em> (Vite) compiles it to plain JavaScript. A JSX
            expression is a plain JS object describing a UI element, not a DOM node. React&apos;s{" "}
            <em>virtual DOM</em> is the tree of those descriptions; it diffs against the previous
            tree to find the minimum set of real DOM mutations needed.
          </>,
          <>
            <em>State</em> lives inside the component function via <code>useState</code>. When you
            call <code>setX(newValue)</code>, React re-calls the component function with the new
            state and diffs the result. The update is not immediate — <code>x</code> still holds
            the old value until the next render. Use the updater form{" "}
            <code>setX((prev) =&gt; ...)</code> when new state depends on old state.
          </>,
          <>
            <em>Side effects</em> — fetching, subscribing, focusing — belong in{" "}
            <code>useEffect</code>, not in the render function body. The dependency array is the
            contract: React re-runs the effect when those values change. The{" "}
            <code>react-hooks/exhaustive-deps</code> lint rule enforces this contract; treating it
            as an error prevents the entire class of stale-closure bugs.
          </>,
          <>
            The <em>package manager</em> (<code>npm</code>) and <em>build step</em> (Vite) are not
            optional extras — they are what make JSX, TypeScript, and ES modules work in the
            browser. <code>npm create vite@latest</code> scaffolds a project with everything wired
            up. The output of <code>npm run build</code> is a <code>dist/</code> folder of plain JS
            and CSS that any static host can serve.
          </>,
        ]}
      />
    </div>
  );
}
