"use client";
import { ScaffoldModule } from "./_template";
import { CodeBlock } from "@/components/CodeBlock";

export function Module_3_4_Content() {
  return (
    <ScaffoldModule
      emoji="✍️"
      problemTitle="Tailwind, CSS Modules, CSS-in-JS — pick on purpose"
      problem={
        <>
          <p>
            Every CSS methodology solves the same core tension: CSS is global by default, but
            components want to be isolated. The stylesheet you write for a button in{" "}
            <code>checkout.css</code> can silently clobber the button in{" "}
            <code>header.css</code> with no error message. The four main schools of thought each
            resolve this in a different way.
          </p>
          <p>
            <strong>Vanilla CSS classes</strong> rely on discipline and naming conventions (BEM,
            SMACSS). Styles live in separate files, the cascade is explicit, and there is zero
            runtime cost. The downside is that nothing enforces the naming — a large team drifts
            toward specificity wars and dead code that no one dares delete.
          </p>
          <p>
            <strong>CSS Modules</strong> (supported natively by Vite, Next.js, and Create React
            App) scope class names to the component file at build time. You write{" "}
            <code>styles.button</code> in your TSX and the bundler emits a unique hash
            like <code>button_abc123</code>. Zero runtime cost, real isolation, but you lose
            global utility classes and co-location of styles with logic is only partial.
          </p>
          <p>
            <strong>Tailwind CSS</strong> is atomic/utility CSS: every class does exactly one
            thing (<code>text-sm</code>, <code>flex</code>, <code>p-4</code>). Styles are
            co-located with the JSX, there is no naming to invent, and the final CSS bundle only
            includes classes you actually use. The trade-off is verbose JSX and a learning curve
            for the utility vocabulary. It scales well because there is no cascade to fight.
          </p>
          <p>
            <strong>CSS-in-JS</strong> (styled-components, Emotion) co-locates styles as
            JavaScript template literals. Runtime CSS-in-JS generates and injects{" "}
            <code>&lt;style&gt;</code> tags at render time — convenient but adds JavaScript bundle
            weight and can block the critical rendering path on slow devices. Zero-runtime
            alternatives (Linaria, vanilla-extract, Panda CSS) extract to static CSS at build
            time, giving you co-location without the runtime cost.
          </p>
        </>
      }
      body={
        <CodeBlock
          language="tsx"
          fileName="Button.tsx — three styling approaches side by side"
          code={`// ─────────────────────────────────────────────────────────
// Approach 1: Vanilla CSS class
// Styles live in Button.css; class names are global strings.
// ─────────────────────────────────────────────────────────
import "./Button.css";

export function ButtonVanilla({ label }: { label: string }) {
  return (
    // Class name is a plain string — no scoping, no guarantees.
    <button className="btn btn--primary">
      {label}
    </button>
  );
}

// Button.css (separate file)
// .btn            { padding: .5rem 1.25rem; border-radius: 6px; cursor: pointer; }
// .btn--primary   { background: #6366f1; color: white; border: none; }
// .btn--primary:hover { background: #4f46e5; }


// ─────────────────────────────────────────────────────────
// Approach 2: Tailwind CSS utilities
// Every utility class does one thing. No separate CSS file.
// The bundler tree-shakes unused utilities — tiny output.
// ─────────────────────────────────────────────────────────
export function ButtonTailwind({ label }: { label: string }) {
  return (
    // All styles declared inline as utility classes.
    <button className="px-5 py-2 rounded-md bg-indigo-500 text-white
                       hover:bg-indigo-600 transition-colors cursor-pointer
                       font-medium text-sm">
      {label}
    </button>
  );
}


// ─────────────────────────────────────────────────────────
// Approach 3: styled-components (runtime CSS-in-JS)
// Styles are a JS template literal — full co-location.
// A <style> tag is injected at runtime: easy but has cost.
// ─────────────────────────────────────────────────────────
import styled from "styled-components";

// StyledButton is a real React component with scoped styles.
const StyledButton = styled.button\`
  padding: 0.5rem 1.25rem;
  border-radius: 6px;
  background: #6366f1;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;

  &:hover {
    background: #4f46e5;
  }
\`;

export function ButtonStyled({ label }: { label: string }) {
  return <StyledButton>{label}</StyledButton>;
}`}
        />
      }
      challenge={{
        question:
          "Which CSS-in-JS approach avoids adding runtime overhead to the browser?",
        options: [
          { id: "a", text: "styled-components with server-side rendering" },
          { id: "b", text: "Emotion's css() helper" },
          { id: "c", text: "Zero-runtime libraries like vanilla-extract or Linaria" },
          { id: "d", text: "Inline style attributes on JSX elements" },
        ],
        correctAnswerId: "c",
        explanation: (
          <>
            Zero-runtime CSS-in-JS libraries (vanilla-extract, Linaria, Panda CSS) extract styles
            to plain <code>.css</code> files at build time. The browser receives static CSS with
            no JavaScript needed to generate or inject it. Runtime libraries like
            styled-components and Emotion generate and insert <code>&lt;style&gt;</code> tags
            during rendering, which adds JavaScript weight and can delay painting on slow devices.
          </>
        ),
      }}
      takeaways={[
        <>Choose a CSS approach based on co-location needs and team scale: vanilla CSS for simplicity, CSS Modules for scoped isolation, Tailwind for utility-first scale, CSS-in-JS for maximum co-location.</>,
        <>Runtime CSS-in-JS (styled-components, Emotion) injects styles via JavaScript — convenient but adds bundle weight; zero-runtime alternatives (vanilla-extract, Linaria) give the same DX at build time.</>,
        <>Tailwind&apos;s utility classes scale well precisely because there is no cascade to manage — every class is self-contained and the final bundle only includes classes you actually used.</>,
      ]}
      mentalModel="Pick your CSS tool by asking: where do styles need to live (file vs. component) and what can you afford at runtime?"
      roadmapUrl="https://roadmap.sh/frontend"
    />
  );
}
