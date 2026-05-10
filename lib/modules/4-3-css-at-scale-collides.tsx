"use client";

import { Card, CardContent } from "@/components/ui/card";
import { StepByStepExplanation } from "@/components/StepByStepExplanation";
import { ReactPlayground } from "@/components/CodePlayground";
import { Challenge } from "@/components/Challenge";
import { GotchaList } from "@/components/GotchaList";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { RoadmapLink } from "@/components/RoadmapLink";
import { CodeComparison } from "@/components/CodeComparison";

export function Module_4_3_Content() {
  // Data blocks hoisted out of JSX for readability — listed in render order.

  const cssAtScaleSteps = [
    {
      title: "The diagnosis: every component's CSS lives in the same global stylesheet",
      description: (
        <p>
          Recall from module 1-3 that the cascade resolves conflicts by <em>specificity</em> first,
          then source order when specificity is equal. That rule is correct. The problem is what
          happens when you apply it at multi-component scale. When Vite (or any bundler) processes
          your app, it collects every imported CSS file into one global stylesheet that the browser
          sees. <code>CommentForm.css</code> and <code>PostForm.css</code> both live in that single
          namespace. There is no boundary between them. A <code>.button</code> rule written for one
          component is also a <code>.button</code> rule for every other component on the page. The
          cascade was correct; the <em>application</em> of it across components is what is failing.
        </p>
      ),
      code: `/* CommentForm.css — intended only for CommentForm */
.button {
  background: var(--accent);   /* purple */
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

/* PostForm.css — intended only for PostForm */
.button {
  background: var(--muted);    /* gray — post actions are less prominent */
  color: var(--foreground);
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

/* In the browser, both rules are in the same stylesheet.
   Specificity: 0-1-0 each. Source order decides.
   PostForm.css was imported last → its .button rule wins everywhere.
   CommentForm's submit button is now gray. So is the Reply button
   in CommentList, which also uses class="button". */`,
      language: "css",
    },
    {
      title: "The first answer: BEM (Block__Element--Modifier)",
      description: (
        <p>
          The first systematic response to this problem was <em>BEM</em> — Block, Element,
          Modifier. The idea is simple: prefix every class name with the block it belongs to, so
          collisions become impossible. <code>.button</code> is ambiguous; there are many buttons.
          <code>.comment-form__button--primary</code> is unambiguous; there is only one comment form
          primary button. Long names, but they do not collide because each is scoped by its block.
          BEM is a <em>naming convention</em> enforced by humans, not tooling. It works when the
          whole team follows it. It breaks when someone forgets the prefix or abbreviates it.
          Position it as a real and valid answer — the dominant answer for a decade — but one that
          requires discipline that tooling can remove.
        </p>
      ),
      code: `/* BEM-style — no collisions because each class encodes its context */

/* CommentForm.css */
.comment-form__button--primary {
  background: var(--accent);   /* purple */
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

/* PostForm.css */
.post-form__button--secondary {
  background: var(--muted);    /* gray */
  color: var(--foreground);
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

/* JSX — verbose, but unambiguous */
<button className="comment-form__button--primary">Submit</button>
<button className="post-form__button--secondary">Publish post</button>

/* Works. No cascade conflict. But:
   - You have to remember the full name every time.
   - Renaming a component means renaming every class in its stylesheet.
   - Nothing enforces the convention — a single typo silently falls through. */`,
      language: "css",
    },
    {
      title: "CSS Modules: let the build step scope the names",
      description: (
        <p>
          <em>CSS Modules</em> take BEM&apos;s insight — unique names prevent collisions — and hand
          the naming to the build step instead of to the developer. You write <code>.button</code>{" "}
          as you normally would inside a file named <code>CommentForm.module.css</code>. The build
          step rewrites that class to something like{" "}
          <code>.CommentForm__button__7d4f2</code> — guaranteed unique per file. You reference it
          through a JavaScript import: <code>import styles from &apos;./CommentForm.module.css&apos;</code>,
          then <code>className=&#123;styles.button&#125;</code>. The generated HTML has the long
          hashed name; your source has the readable short name. The same idea appears in Vue as{" "}
          <code>&lt;style scoped&gt;</code> and in Svelte as scoped styles by default — different
          syntax, same mechanism. The collision is gone; the developer never writes a long name.
        </p>
      ),
      code: `/* CommentForm.module.css — you write this */
.button {
  background: var(--accent);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

/* Build step transforms it to something like: */
/* .CommentForm__button__7d4f2 { ... } */

/* CommentForm.tsx */
import styles from './CommentForm.module.css';

export function CommentForm() {
  return (
    <form>
      <textarea name="body" />
      {/* className is the hashed name; you write styles.button */}
      <button type="submit" className={styles.button}>
        Submit
      </button>
    </form>
  );
}

/* PostForm.tsx — its own .button is hashed separately */
import styles from './PostForm.module.css';

export function PostForm() {
  return (
    <form>
      <input name="title" />
      <button type="submit" className={styles.button}>
        Publish post
      </button>
    </form>
  );
}

/* The two .button rules never collide — they become two different class names.
   Reading CommentForm.module.css tells you exactly what CommentForm's button looks like. */`,
      language: "tsx",
    },
    {
      title: "Tailwind: name the appearance, not the concept",
      description: (
        <p>
          Tailwind takes a different cut. Instead of naming the <em>concept</em> (
          <code>.button</code>, <code>.card</code>, <code>.comment-form__button--primary</code>),
          you name the <em>appearance</em>. Each class does exactly one thing:{" "}
          <code>bg-violet-600</code> sets background color, <code>px-4</code> sets horizontal
          padding, <code>rounded</code> adds border-radius. These are called <em>utility classes</em>{" "}
          and the approach is called <em>atomic CSS</em>. Because each utility means exactly one
          thing, there is nothing to collide: two components can both use <code>px-4</code> and the
          rule is the same rule. Reading the <code>className</code> attribute tells you what the
          element looks like without opening a stylesheet. There is no stylesheet to open.
        </p>
      ),
      code: `// Before: class-based styling — requires a stylesheet and a naming decision
export function CommentForm() {
  return (
    <form>
      <textarea name="body" className="comment-body-field" />
      <button type="submit" className="button button--primary">
        Submit
      </button>
    </form>
  );
}

// After: Tailwind utilities — appearance lives in the JSX
export function CommentForm() {
  return (
    <form className="flex flex-col gap-3">
      <textarea
        name="body"
        className="w-full rounded border border-slate-300 p-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-violet-500"
        rows={4}
      />
      <button
        type="submit"
        className="self-end rounded bg-violet-600 px-4 py-2 text-sm
                   font-medium text-white hover:bg-violet-700
                   focus:outline-none focus:ring-2 focus:ring-violet-500
                   disabled:cursor-not-allowed disabled:opacity-50"
      >
        Submit
      </button>
    </form>
  );
}

// PostForm's button is independently gray — its className says so directly.
// No cascade conflict possible: bg-slate-200 and bg-violet-600 are different classes.
// Reading either component's JSX tells you exactly what it looks like.`,
      language: "tsx",
    },
    {
      title: "The trade: atomic vs semantic",
      description: (
        <p>
          Choosing between <em>atomic CSS</em> (Tailwind) and <em>semantic CSS</em> (BEM, CSS
          Modules) is a real trade, not a one-sided win. Atomic CSS wins on co-location — the
          appearance is in the same file as the logic, no context-switching to a stylesheet — and on
          predictability — every utility means exactly one thing, and there are no shared rules that
          can collide. Semantic CSS wins when you have a genuinely shared concept: a{" "}
          <em>design system</em> primitive like a <code>Button</code> component that must look
          identical across 50 features. When the concept is durable, naming it is appropriate. The
          real question is: do you have <em>durable component-level concepts</em> (semantic wins) or
          a <em>combinatorial design space</em> where components compose independent appearances
          (atomic wins)? Most product apps live in the second world. Design system libraries live in
          the first. Pick based on context, not familiarity.
        </p>
      ),
      code: `// Semantic CSS wins: a design-system Button that must be identical everywhere
// The concept "Button" is durable — it has a canonical appearance.
// Writing .button in a shared stylesheet or component file is correct here.

// button.module.css (in a design system library)
// .button { ... /* the ONE Button style, owned by the design system */ }

// ── vs ──

// Atomic CSS wins: a product-app feature where the button appearance varies
// PostForm's publish button is gray; CommentForm's submit is violet; Reply is small.
// These are not the "same button" — they share no concept worth naming.

// The trade in practice:
//   Tailwind advantage: no naming, no stylesheet, no cascade, fast iteration
//   Tailwind cost:      long className strings; repeated utility lists across components
//                       (mitigated by component extraction, not @apply)

//   CSS Modules advantage: readable semantic names; natural for design system primitives
//   CSS Modules cost:      two files per component; naming discipline still required

// Neither is obviously better. Pick based on what your project actually is.`,
      language: "tsx",
    },
    {
      title: "The toolchain: installing and configuring Tailwind",
      description: (
        <p>
          Tailwind works through a PostCSS plugin that scans your source files for class names and
          generates a stylesheet containing only the utilities you actually used. This means the
          production CSS is small even though Tailwind has thousands of utilities defined. The
          configuration lives in <code>tailwind.config.ts</code>. The <code>content</code> array
          tells Tailwind which files to scan; any class name not found in those files is excluded
          from the output. The learning app you are reading this in uses Tailwind — the config at
          the repo root is a real-world example. The reference SPA (
          <code>examples/taproot-blog/spa/</code>) does not yet use Tailwind, but migrating it is
          straightforward: the &quot;before&quot; is what you saw in module 4-1&apos;s inline
          styles; the &quot;after&quot; is the Tailwind-utility component in step 7.
        </p>
      ),
      code: `# Install Tailwind and its PostCSS companion
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p   # creates tailwind.config.js and postcss.config.js

# ── tailwind.config.ts (the learning app's real config as reference) ──────────
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // design tokens go here — then you write bg-brand-600 not bg-[#5b21b6]
      },
    },
  },
};

export default config;

# ── globals.css — the three Tailwind directives ──────────────────────────────
# @tailwind base;        ← normalize / reset
# @tailwind components;  ← (empty by default; @apply lives here if you use it)
# @tailwind utilities;   ← the generated utility classes

# Build: Tailwind scans content paths for class names like "bg-violet-600",
# generates the matching CSS rules, and discards everything else.
# Production bundle: only the classes your app actually uses.`,
      language: "bash",
    },
    {
      title: "The destination: CommentForm rebuilt with Tailwind utilities",
      description: (
        <p>
          Here is the full <code>CommentForm</code> rewritten with Tailwind utilities. There is no
          separate stylesheet. There is no naming decision. The collision that opened this module —
          two components both styling <code>.button</code> — cannot happen because there is no{" "}
          <code>.button</code>. The appearance of each element is declared where the element is
          used. Color, spacing, border, shadow, focus ring, disabled state, hover, and active states
          are all readable at a glance from the <code>className</code> prop. If PostForm needs a
          gray button, its JSX says <code>bg-slate-200</code>; CommentForm&apos;s JSX says{" "}
          <code>bg-violet-600</code>. No cascade. No source-order sensitivity. No shared namespace.
        </p>
      ),
      code: `// CommentForm.tsx — Tailwind-rebuilt
// No CommentForm.css. No naming. No cascade collision.

interface Props {
  onSubmit: (body: string) => void;
  disabled?: boolean;
}

export function CommentForm({ onSubmit, disabled = false }: Props) {
  const [body, setBody] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (body.trim() === "") return;
    onSubmit(body.trim());
    setBody("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-lg border border-slate-200
                 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900"
    >
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
        Leave a comment
      </label>

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={4}
        placeholder="Share your thoughts..."
        className="w-full resize-none rounded border border-slate-300 bg-white
                   p-2 text-sm text-slate-900 placeholder:text-slate-400
                   focus:outline-none focus:ring-2 focus:ring-violet-500
                   dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
      />

      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">
          {body.length} / 500 characters
        </span>

        <button
          type="submit"
          disabled={disabled || body.trim() === ""}
          className="rounded bg-violet-600 px-4 py-2 text-sm font-medium
                     text-white transition-colors
                     hover:bg-violet-700 active:bg-violet-800
                     focus:outline-none focus:ring-2 focus:ring-violet-500
                     disabled:cursor-not-allowed disabled:opacity-50"
        >
          {disabled ? "Submitting..." : "Submit comment"}
        </button>
      </div>
    </form>
  );
}

// PostForm's publish button (in PostForm.tsx, independently):
// <button className="rounded bg-slate-200 px-4 py-2 text-sm text-slate-700
//                    hover:bg-slate-300 focus:ring-slate-400">
//   Publish post
// </button>
//
// Two buttons. Two className strings. Zero collision risk.`,
      language: "tsx",
    },
  ];

  const collidingCode = `/* Two stylesheets, one namespace — order decides who wins */

/* ── CommentForm.css ─────────────────────────────── */
.button {
  background: var(--accent);   /* intended: purple */
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

/* ── PostForm.css ────────────────────────────────── */
/* imported after CommentForm.css in main.tsx */
.button {
  background: var(--muted);   /* intended: gray */
  color: var(--foreground);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

/* In the browser:
   Both rules have specificity 0-1-0.
   PostForm.css was imported last → its .button wins.
   CommentForm's submit button is now gray.
   CommentList's Reply button is also gray.
   Reading CommentForm.css tells you nothing
   about what CommentForm's button actually looks like. */`;

  const tailwindCode = `// Tailwind utilities — each className is self-contained

// CommentForm.tsx
export function CommentForm() {
  return (
    <form className="flex flex-col gap-3 p-4">
      <textarea className="w-full rounded border border-slate-300 p-2" rows={4} />
      {/* This button is unambiguously violet — the className says so */}
      <button
        type="submit"
        className="self-end rounded bg-violet-600 px-4 py-2 text-sm
                   font-medium text-white hover:bg-violet-700
                   disabled:opacity-50"
      >
        Submit comment
      </button>
    </form>
  );
}

// PostForm.tsx — completely independent
export function PostForm() {
  return (
    <form className="flex flex-col gap-3 p-4">
      <input className="w-full rounded border border-slate-300 p-2" />
      {/* This button is unambiguously gray — the className says so */}
      <button
        type="submit"
        className="self-end rounded bg-slate-200 px-4 py-2 text-sm
                   font-medium text-slate-700 hover:bg-slate-300"
      >
        Publish post
      </button>
    </form>
  );
}

/* No shared namespace. No import order sensitivity.
   Reading either component's JSX tells you what it looks like. */`;

  const playgroundCode = `// Try this: swap a Tailwind class for a longer named one (e.g. change
// "bg-violet-600" to "bg-[#5b21b6]") and notice how the collision risk
// doesn't return — utilities only collide if they are literally identical.
// Then try adding "hover:bg-violet-700" to the CommentForm button
// and "hover:bg-slate-300" to the PostForm button independently.

import { useState } from "react";

function CommentForm({ onSubmit }) {
  const [body, setBody] = useState("");
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit(body); setBody(""); }}
      style={{ display: "flex", flexDirection: "column", gap: 12, padding: 16,
               border: "1px solid #e2e8f0", borderRadius: 8, background: "white" }}
    >
      <label style={{ fontSize: 14, fontWeight: 500, color: "#475569" }}>
        Leave a comment
      </label>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        placeholder="Share your thoughts..."
        style={{ width: "100%", padding: 8, borderRadius: 4,
                 border: "1px solid #cbd5e1", fontSize: 14, resize: "none",
                 fontFamily: "inherit", boxSizing: "border-box" }}
      />
      {/* Tailwind equivalent: bg-violet-600 text-white px-4 py-2 rounded */}
      <button
        type="submit"
        disabled={body.trim() === ""}
        style={{ alignSelf: "flex-end", background: "#7c3aed", color: "white",
                 border: "none", borderRadius: 4, padding: "8px 16px",
                 fontSize: 14, fontWeight: 500, cursor: "pointer",
                 opacity: body.trim() === "" ? 0.5 : 1 }}
      >
        Submit comment
      </button>
    </form>
  );
}

function PostForm({ onSubmit }) {
  const [title, setTitle] = useState("");
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit(title); setTitle(""); }}
      style={{ display: "flex", flexDirection: "column", gap: 12, padding: 16,
               border: "1px solid #e2e8f0", borderRadius: 8, background: "white" }}
    >
      <label style={{ fontSize: 14, fontWeight: 500, color: "#475569" }}>
        New post title
      </label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What's on your mind?"
        style={{ width: "100%", padding: 8, borderRadius: 4,
                 border: "1px solid #cbd5e1", fontSize: 14,
                 fontFamily: "inherit", boxSizing: "border-box" }}
      />
      {/* Tailwind equivalent: bg-slate-200 text-slate-700 px-4 py-2 rounded */}
      <button
        type="submit"
        disabled={title.trim() === ""}
        style={{ alignSelf: "flex-end", background: "#e2e8f0", color: "#374151",
                 border: "none", borderRadius: 4, padding: "8px 16px",
                 fontSize: 14, fontWeight: 500, cursor: "pointer",
                 opacity: title.trim() === "" ? 0.5 : 1 }}
      >
        Publish post
      </button>
    </form>
  );
}

export default function App() {
  const [log, setLog] = useState([]);
  const addLog = (msg) => setLog((prev) => [msg, ...prev].slice(0, 5));

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", maxWidth: 480,
                  margin: "24px auto", padding: "0 16px", display: "flex",
                  flexDirection: "column", gap: 16 }}>
      <h2 style={{ margin: 0, fontSize: 18, color: "#1e293b" }}>
        Two forms, two buttons — independently styled
      </h2>
      <CommentForm onSubmit={(b) => addLog("Comment: " + b)} />
      <PostForm onSubmit={(t) => addLog("Post: " + t)} />
      {log.length > 0 && (
        <div style={{ fontSize: 13, color: "#64748b" }}>
          <strong>Activity:</strong>
          <ul style={{ margin: "4px 0 0", paddingLeft: 16 }}>
            {log.map((l, i) => <li key={i}>{l}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}`;

  const gotchaItems = [
    {
      title: "@apply brings utilities into a class — useful sometimes, anti-pattern often",
      body: (
        <>
          <code>@apply bg-violet-600 text-white px-4 py-2 rounded</code> in a CSS file lets you
          name a set of utilities as a class. It sounds convenient, but it reintroduces the naming
          problem Tailwind was designed to avoid. If you are applying many utilities together, that
          set of utilities almost certainly belongs on a <em>component</em>, not on a class. Extract
          a <code>{"<Button />"}</code> component instead. Reserve <code>@apply</code> for the rare
          case where you need a Tailwind utility inside a context you cannot add a className to
          (e.g., a third-party component or a CSS selector you cannot control from JSX).
        </>
      ),
    },
    {
      title: "Tailwind purges unused utilities at build — dynamic class names are invisible to it",
      body: (
        <>
          Tailwind scans your source files for class names as plain text strings. If you build a
          class name at runtime — <code>{"`bg-${color}-500`"}</code> — Tailwind cannot see it
          during the build scan, so it will not generate the rule, and the class will do nothing in
          production. The fix is to write the full class name in your source:{" "}
          <code>color === &apos;violet&apos; ? &apos;bg-violet-500&apos; : &apos;bg-slate-500&apos;</code>.
          Full strings are always safe; concatenated fragments are not.
        </>
      ),
    },
    {
      title: "Custom design tokens belong in tailwind.config — not in arbitrary values",
      body: (
        <>
          Tailwind supports <em>arbitrary values</em> like <code>bg-[#5b21b6]</code> and{" "}
          <code>text-[1.375rem]</code>. They are useful for one-off overrides, but reaching for
          them regularly means your brand colors and spacing scale are scattered across hundreds of
          JSX files. Define <em>design tokens</em> in the <code>theme.extend</code> section of{" "}
          <code>tailwind.config.ts</code> — <code>colors.brand.primary</code>,{" "}
          <code>spacing.page</code> — and use the named class (<code>bg-brand-primary</code>). When
          the brand color changes, you update one line in the config, not 300 JSX files.
        </>
      ),
    },
    {
      title: "CSS Modules do not scope :global() selectors or classes you set via external code",
      body: (
        <>
          CSS Modules hash the class names you write in the <code>.module.css</code> file. But{" "}
          <code>:global(.some-class)</code> inside a Module file opts out of hashing — that selector
          applies globally, just like a plain CSS rule. This is intentional: it lets you target
          third-party library classes that you cannot control. Mixing CSS Modules for your own
          classes with a global reset or base stylesheet is normal and expected. Just know that the
          scope boundary is the hashing, not the file — anything in <code>:global()</code> is shared
          with the world.
        </>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-3xl font-bold">CSS at Scale Collides</h1>
        <RoadmapLink url="https://roadmap.sh/frontend" />
      </div>

      {/* Section 1: Hook */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            The SPA from modules 4-1 and 4-2 gets a new feature: <code>PostForm</code>, where
            authors draft new posts. PostForm needs a submit button. Its designer specifies gray —
            post-creation is a deliberate action, not a quick reply, so it should feel muted.
            CommentForm&apos;s submit button is violet. You write{" "}
            <code>PostForm.css</code> with <code>.button &#123; background: var(--muted) &#125;</code>{" "}
            and import it. The app loads. Everything looks fine in PostForm.
          </p>
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            Two hours later your teammate reports a bug: the Submit button in{" "}
            <code>CommentForm</code> is gray. So is the Reply button in <code>CommentList</code>.
            You open <code>CommentForm.css</code>. It still says{" "}
            <code>.button &#123; background: var(--accent) &#125;</code>. The CSS is correct. The
            browser disagrees.
          </p>
          <div className="bg-slate-900 text-slate-100 rounded p-4 font-mono text-sm mb-4 overflow-x-auto leading-relaxed">
            <span className="text-slate-400">{"/* main.tsx — import order decides who wins */"}</span>
            <br />
            <span className="text-amber-300">import</span>{" "}
            <span className="text-green-300">&apos;./CommentForm.css&apos;</span>
            <span className="text-slate-400">{"  // .button → violet"}</span>
            <br />
            <span className="text-amber-300">import</span>{" "}
            <span className="text-green-300">&apos;./PostForm.css&apos;</span>
            <span className="text-slate-400">{"    // .button → gray  ← wins"}</span>
            <br />
            <br />
            <span className="text-slate-400">
              {"/* Specificity: 0-1-0 each. Source order resolves it."}
            </span>
            <br />
            <span className="text-slate-400">
              {"   PostForm.css was imported last. Its .button rule wins globally."}
            </span>
            <br />
            <span className="text-slate-400">
              {"   CommentForm.css told you nothing useful. */"}
            </span>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            The cascade rule from module 1-3 is operating exactly as specified. Both{" "}
            <code>.button</code> rules have the same specificity: one class selector, 0-1-0.
            Source order resolves the tie, and PostForm&apos;s import came last. Nothing is broken.
            The CSS is working correctly. The problem is that &quot;working correctly&quot; means a
            class name you wrote in one component file silently governs every element in the app
            that shares that name. Reading <code>CommentForm.css</code> no longer tells you what
            CommentForm&apos;s button looks like. What would have to change so that each
            component&apos;s styles only apply to that component?
          </p>
        </CardContent>
      </Card>

      {/* Section 2: Mental model */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            There are two ways to stop the collision. The first is to give each concept a name that
            is globally unique — BEM, CSS Modules, scoped styles. This is <em>semantic CSS</em>:
            the class name represents a concept (<code>.button</code>,{" "}
            <code>.comment-form__button--primary</code>), and the concept scales as long as the
            name does. The second is to stop naming concepts and start naming appearances:{" "}
            <code>bg-violet-600</code>, <code>px-4</code>, <code>rounded</code>. This is{" "}
            <em>atomic CSS</em>. Each utility means exactly one thing and can only collide with
            itself. Both approaches work. The trade is real.
          </p>
          <blockquote className="border-l-4 border-blue-500 pl-4 italic text-slate-600 dark:text-slate-400">
            Atomic CSS scales utility; semantic CSS scales meaning.
          </blockquote>
        </CardContent>
      </Card>

      {/* Section 3: Step-by-step */}
      <h2 className="text-xl font-semibold mb-3">From collision to scoped styles</h2>
      <StepByStepExplanation
        title="Why CSS breaks at component scale — and three ways to fix it"
        description="Each step traces the collision to its root and then examines one response: BEM (human convention), CSS Modules (build-step scoping), and Tailwind (no shared namespace at all)."
        steps={cssAtScaleSteps}
      />

      {/* Optional: Code comparison — colliding stylesheets vs Tailwind utilities */}
      <CodeComparison
        title="The same two buttons: colliding CSS vs Tailwind utilities"
        description="Left: two .button rules in separate files — source order decides who wins, and reading either file tells you nothing. Right: Tailwind utilities — each button&apos;s appearance is in its own JSX, with nothing to collide."
        oldCode={{
          title: "Global class names (collide)",
          code: collidingCode,
          language: "css",
          cons: [
            ".button in CommentForm.css and PostForm.css share the same global namespace.",
            "Import order — not intent — decides which color wins.",
            "Reading one component's stylesheet no longer tells you what that component looks like.",
          ],
        }}
        newCode={{
          title: "Tailwind utilities (no collision)",
          code: tailwindCode,
          language: "tsx",
          pros: [
            "Each button's appearance is declared where the button is used.",
            "bg-violet-600 and bg-slate-200 are different classes — no conflict possible.",
            "No shared namespace. No import order sensitivity. No separate stylesheet.",
          ],
        }}
      />

      {/* Section 4: Playground */}
      <h2 className="text-xl font-semibold mb-3">Try it yourself</h2>
      <ReactPlayground
        title="Live editor — two forms, independently styled"
        description="CommentForm and PostForm each have a submit button styled independently. Try the hint at the top of the file, then experiment with changing one button's style without affecting the other."
        code={playgroundCode}
      />

      {/* Section 5: Challenges */}
      <h2 className="text-xl font-semibold mb-3">Challenges</h2>

      <Challenge
        title="Cascade collision: why does one button win?"
        question={`A project has two CSS files:

/* components/CommentForm.css */
.button {
  background: purple;
  color: white;
}

/* components/PostForm.css */
.button {
  background: gray;
  color: black;
}

Both files are imported in main.tsx in that order (CommentForm first, PostForm second).
A <button className="button"> appears in CommentForm. What color is its background, and why?`}
        options={[
          {
            id: "a",
            text: "Purple. CommentForm.css was imported first, so its rules take precedence over later imports.",
          },
          {
            id: "b",
            text: "Gray. Both rules have the same specificity (0-1-0), so source order resolves the tie — PostForm.css was imported last and its .button rule wins globally, including in CommentForm.",
          },
          {
            id: "c",
            text: "Purple. The browser matches rules to the component they were imported with, so CommentForm.css only applies inside CommentForm.",
          },
          {
            id: "d",
            text: "It depends on the browser. Different engines resolve CSS ties differently.",
          },
        ]}
        correctAnswerId="b"
        explanation={
          <p>
            Both <code>.button</code> rules have specificity 0-1-0: one class selector, nothing
            else. When specificity is equal, the cascade falls back to source order — the rule that
            appears later in the stylesheet wins. When a bundler concatenates imports, the last
            import wins. <code>PostForm.css</code> was imported after <code>CommentForm.css</code>,
            so its <code>.button</code> rule applies to every element with <code>class=&quot;button&quot;</code>{" "}
            on the page, including CommentForm&apos;s button. The browser has no concept of
            which file a rule came from or which component it was &quot;meant for&quot; — there is
            only one global stylesheet, and the cascade resolves it mechanically.
          </p>
        }
      />

      <Challenge
        title="Styling approach: design system library vs product app"
        question={`A team is building an open-source UI component library — Button, Card, Modal, Input — that will be imported and used by dozens of separate product applications. Each component must look identical no matter which app imports it.

Which styling approach is most appropriate for this library?`}
        options={[
          {
            id: "a",
            text: "Tailwind utilities in the library JSX. Each consuming app will already have Tailwind, and utilities are portable.",
          },
          {
            id: "b",
            text: "CSS Modules (or equivalent scoped styles). The library owns durable component concepts — Button, Card — that need canonical, encapsulated appearances. Scoped styles prevent leakage into the consumer's stylesheet and keep the library self-contained.",
          },
          {
            id: "c",
            text: "Global class names like .button and .card. Any naming conflicts with the consumer's app are the consumer's responsibility to resolve.",
          },
          {
            id: "d",
            text: "Inline styles on every element. Inline styles have the highest specificity and cannot be overridden by the consumer's stylesheet.",
          },
        ]}
        correctAnswerId="b"
        explanation={
          <p>
            A UI component library is exactly the context where semantic, scoped styles win. The
            library owns durable concepts — &quot;Button&quot; has a canonical appearance that must
            survive being imported into any consumer app. CSS Modules (or equivalent scoped styles
            in Vue or Svelte) encapsulate the library&apos;s class names so they cannot collide with
            the consumer&apos;s stylesheets. Option <strong>a</strong> (Tailwind in the library) is
            problematic: it requires the consumer to also use Tailwind and the same config, and
            Tailwind utilities in a library are difficult to override with the consumer&apos;s design
            tokens. Option <strong>c</strong> (global class names) recreates the collision problem
            at a larger scale — the consumer&apos;s <code>.button</code> will fight the library&apos;s.
            Option <strong>d</strong> (inline styles) makes the components impossible to theme
            because inline styles cannot be overridden by any external stylesheet.
          </p>
        }
      />

      {/* Section 6: GotchaList */}
      <h2 className="text-xl font-semibold mb-3">Things that surprise people</h2>
      <GotchaList items={gotchaItems} />

      {/* Section 7: KeyTakeaways */}
      <KeyTakeaways
        mentalModel="Atomic CSS scales utility; semantic CSS scales meaning."
        points={[
          <>
            CSS files imported by different components all land in one global stylesheet. A{" "}
            <code>.button</code> rule in <code>CommentForm.css</code> applies to every element
            with <code>class=&quot;button&quot;</code> on the page — import order, not authorial
            intent, decides which rule wins. The cascade is operating correctly; the problem is
            applying it at multi-component scale without any scoping mechanism.
          </>,
          <>
            <em>BEM</em> (Block__Element--Modifier) prevents collisions through human naming
            discipline. <em>CSS Modules</em> prevent collisions through build-step name hashing —
            you write <code>.button</code>, the build produces{" "}
            <code>.CommentForm__button__7d4f2</code>. Both are legitimate answers. CSS Modules
            require less discipline and are safer in large teams. Vue&apos;s{" "}
            <code>&lt;style scoped&gt;</code> and Svelte&apos;s scoped styles are the same idea
            in different frameworks.
          </>,
          <>
            <em>Tailwind</em> sidesteps the collision problem by eliminating the shared namespace
            entirely. Instead of naming a concept (<code>.button</code>), you name the appearance
            directly: <code>bg-violet-600 px-4 py-2 rounded text-white</code>. Each{" "}
            <em>utility class</em> means exactly one thing and can only collide with itself. The
            build step scans your source for class names and generates only the CSS rules your app
            actually uses.
          </>,
          <>
            The trade between <em>atomic CSS</em> and semantic CSS is real. Atomic (Tailwind) wins
            on co-location and predictability; semantic (BEM, CSS Modules) wins when you have
            durable component-level concepts — especially in design system libraries. Pick based on
            whether your project has a combinatorial design space (atomic wins) or canonical shared
            concepts (semantic wins). Most product apps are the former; UI component libraries are
            the latter.
          </>,
          <>
            Two Tailwind gotchas to internalize: (1) dynamic class names built by string
            concatenation (<code>{"`bg-${color}-500`"}</code>) are invisible to the build scanner
            and missing in production — always write full class name strings; (2) custom{" "}
            <em>design tokens</em> belong in <code>tailwind.config.ts</code> as named colors and
            spacing values, not scattered as arbitrary values (<code>bg-[#5b21b6]</code>) across
            hundreds of JSX files.
          </>,
        ]}
      />
    </div>
  );
}
