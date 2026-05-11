"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Challenge } from "@/components/Challenge";
import { GotchaList } from "@/components/GotchaList";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { RoadmapLink } from "@/components/RoadmapLink";
import { InteractiveDiagram } from "@/components/InteractiveDiagram";
import type { Node, Edge } from "@xyflow/react";
import { type ReactNode } from "react";

export function Module_6_1_Content() {
  // Data blocks hoisted out of JSX for readability — listed in render order.

  const fieldMapNodes: Node[] = [
    // Spine anchors — the modules the learner already owns
    {
      id: "spine-2-3",
      type: "input",
      data: { label: "2-3: HTTP" },
      position: { x: 60, y: 80 },
      style: {
        background: "#3b82f6",
        color: "white",
        padding: "8px 14px",
        borderRadius: "8px",
        fontWeight: "bold",
        fontSize: "13px",
      },
    },
    {
      id: "spine-3-1",
      type: "input",
      data: { label: "3-1: URL journey" },
      position: { x: 60, y: 240 },
      style: {
        background: "#3b82f6",
        color: "white",
        padding: "8px 14px",
        borderRadius: "8px",
        fontWeight: "bold",
        fontSize: "13px",
      },
    },
    {
      id: "spine-4-1",
      type: "input",
      data: { label: "4-1: React + Vite" },
      position: { x: 60, y: 420 },
      style: {
        background: "#3b82f6",
        color: "white",
        padding: "8px 14px",
        borderRadius: "8px",
        fontWeight: "bold",
        fontSize: "13px",
      },
    },
    {
      id: "spine-4-3",
      type: "input",
      data: { label: "4-3: Tailwind" },
      position: { x: 60, y: 580 },
      style: {
        background: "#3b82f6",
        color: "white",
        padding: "8px 14px",
        borderRadius: "8px",
        fontWeight: "bold",
        fontSize: "13px",
      },
    },
    {
      id: "spine-1-2",
      type: "input",
      data: { label: "1-2: Semantics" },
      position: { x: 60, y: 680 },
      style: {
        background: "#3b82f6",
        color: "white",
        padding: "8px 14px",
        borderRadius: "8px",
        fontWeight: "bold",
        fontSize: "13px",
      },
    },
    {
      id: "spine-5-1",
      type: "input",
      data: { label: "5-1: Next.js SSR" },
      position: { x: 60, y: 760 },
      style: {
        background: "#3b82f6",
        color: "white",
        padding: "8px 14px",
        borderRadius: "8px",
        fontWeight: "bold",
        fontSize: "13px",
      },
    },

    // Topic nodes — non-spine topics positioned against their anchors
    {
      id: "topic-graphql",
      data: { label: "GraphQL" },
      position: { x: 380, y: 40 },
      style: {
        background: "#8b5cf6",
        color: "white",
        padding: "8px 14px",
        borderRadius: "8px",
        fontSize: "13px",
      },
    },
    {
      id: "topic-pwa",
      data: { label: "PWAs + Service Workers" },
      position: { x: 380, y: 180 },
      style: {
        background: "#10b981",
        color: "white",
        padding: "8px 14px",
        borderRadius: "8px",
        fontSize: "13px",
      },
    },
    {
      id: "topic-mobile",
      data: { label: "React Native / Flutter / Ionic" },
      position: { x: 380, y: 320 },
      style: {
        background: "#f59e0b",
        color: "white",
        padding: "8px 14px",
        borderRadius: "8px",
        fontSize: "13px",
      },
    },
    {
      id: "topic-desktop",
      data: { label: "Electron / Tauri" },
      position: { x: 380, y: 430 },
      style: {
        background: "#f59e0b",
        color: "white",
        padding: "8px 14px",
        borderRadius: "8px",
        fontSize: "13px",
      },
    },
    {
      id: "topic-bundlers",
      data: { label: "Webpack / esbuild / Rollup / Parcel" },
      position: { x: 380, y: 520 },
      style: {
        background: "#ef4444",
        color: "white",
        padding: "8px 14px",
        borderRadius: "8px",
        fontSize: "13px",
      },
    },
    {
      id: "topic-frameworks",
      data: { label: "Vue / Svelte / Solid / Angular" },
      position: { x: 380, y: 610 },
      style: {
        background: "#ef4444",
        color: "white",
        padding: "8px 14px",
        borderRadius: "8px",
        fontSize: "13px",
      },
    },
    {
      id: "topic-webcomponents",
      data: { label: "Web Components" },
      position: { x: 680, y: 430 },
      style: {
        background: "#6366f1",
        color: "white",
        padding: "8px 14px",
        borderRadius: "8px",
        fontSize: "13px",
      },
    },
    {
      id: "topic-testing",
      data: { label: "Testing (Vitest / Jest / Playwright)" },
      position: { x: 680, y: 530 },
      style: {
        background: "#0ea5e9",
        color: "white",
        padding: "8px 14px",
        borderRadius: "8px",
        fontSize: "13px",
      },
    },
    {
      id: "topic-perf",
      data: { label: "Performance (PRPL / RAIL / CWV)" },
      position: { x: 680, y: 640 },
      style: {
        background: "#0ea5e9",
        color: "white",
        padding: "8px 14px",
        borderRadius: "8px",
        fontSize: "13px",
      },
    },
    {
      id: "topic-a11y",
      data: { label: "Accessibility audits (axe / Lighthouse)" },
      position: { x: 680, y: 740 },
      style: {
        background: "#14b8a6",
        color: "white",
        padding: "8px 14px",
        borderRadius: "8px",
        fontSize: "13px",
      },
    },
    {
      id: "topic-css",
      data: { label: "Sass / PostCSS / CSS-in-JS" },
      position: { x: 380, y: 700 },
      style: {
        background: "#ec4899",
        color: "white",
        padding: "8px 14px",
        borderRadius: "8px",
        fontSize: "13px",
      },
    },
  ];

  const fieldMapEdges: Edge[] = [
    { id: "e-graphql", source: "spine-2-3", target: "topic-graphql", label: "extends" },
    { id: "e-pwa", source: "spine-3-1", target: "topic-pwa", label: "extends" },
    { id: "e-mobile-4-1", source: "spine-4-1", target: "topic-mobile", label: "extends" },
    { id: "e-mobile-3-1", source: "spine-3-1", target: "topic-mobile", label: "extends" },
    { id: "e-desktop-4-1", source: "spine-4-1", target: "topic-desktop", label: "extends" },
    { id: "e-desktop-3-1", source: "spine-3-1", target: "topic-desktop" },
    { id: "e-bundlers", source: "spine-4-1", target: "topic-bundlers", label: "alt to" },
    { id: "e-frameworks", source: "spine-4-1", target: "topic-frameworks", label: "alt to" },
    { id: "e-webcomponents", source: "spine-4-1", target: "topic-webcomponents", label: "alt to" },
    { id: "e-testing-4-1", source: "spine-4-1", target: "topic-testing", label: "extends" },
    { id: "e-perf-3-1", source: "spine-3-1", target: "topic-perf", label: "extends" },
    { id: "e-perf-5-1", source: "spine-5-1", target: "topic-perf", label: "extends" },
    { id: "e-a11y", source: "spine-1-2", target: "topic-a11y", label: "extends" },
    { id: "e-css", source: "spine-4-3", target: "topic-css", label: "predates" },
  ];

  interface PositionedTopic {
    id: string;
    name: string;
    anchorLabel: string;
    problem: ReactNode;
    change: ReactNode;
    cost: ReactNode;
  }

  const positionedTopics: PositionedTopic[] = [
    {
      id: "graphql",
      name: "GraphQL",
      anchorLabel: "2-3 (HTTP / REST)",
      problem: (
        <>
          REST endpoints return fixed shapes. A mobile screen needs the post title and author avatar
          but gets the full post body, all tags, all comments, and three nested author objects. A
          dashboard widget needs data from five endpoints and makes five round trips. This is
          over-fetching and under-fetching — the client cannot control what the server returns.
        </>
      ),
      change: (
        <>
          GraphQL inverts the control: the client sends a typed query describing exactly the fields
          it needs, and the server returns exactly that shape in a single round trip. One endpoint.
          One request. The <em>schema</em> is a contract both sides share, which means the client
          can catch type mismatches at build time before they reach production.
        </>
      ),
      cost: (
        <>
          The schema is a contract that both sides must maintain. Schema migrations require
          coordination. HTTP-level caching by URL (a major REST strength) no longer works —
          GraphQL queries are POST requests with unique bodies, so you need a client-side
          normalized cache (Apollo, Relay) instead. The tooling surface area is larger than REST
          for small APIs. Reach for GraphQL when you have many consumers asking for different
          shapes of the same data; REST is simpler when your clients and data shapes are stable.
        </>
      ),
    },
    {
      id: "web-components",
      name: "Web Components",
      anchorLabel: "4-1 (React / component model)",
      problem: (
        <>
          A design-system team builds a date picker in React. The iOS team uses Vue. The docs site
          uses plain HTML. Every framework needs its own wrapper. The platform has no standard
          component model, so each framework ships its own — and none of them compose across
          framework boundaries.
        </>
      ),
      change: (
        <>
          Web Components are the browser&apos;s built-in component model: <em>Custom Elements</em>{" "}
          define a new HTML tag, <em>Shadow DOM</em> encapsulates styles and markup, and the HTML
          Template element provides inert markup that can be cloned. A{" "}
          <code>&lt;my-date-picker&gt;</code> custom element works in React, Vue, Svelte, or a plain
          HTML page — with no adapter layer.
        </>
      ),
      cost: (
        <>
          Custom Elements are more verbose than React components for application-scale work. You
          lose React&apos;s batched reconciler, hooks ecosystem, server-rendering story, and
          dev-tooling. Shadow DOM makes global CSS intentionally hard to pierce — sometimes too
          hard. Web Components shine for design-system primitives (a button, an input, a tooltip)
          that need to cross framework boundaries; they are painful for building full applications.
        </>
      ),
    },
    {
      id: "pwa",
      name: "PWAs and Service Workers",
      anchorLabel: "3-1 (URL journey / network layer)",
      problem: (
        <>
          A web app requires a network connection for every interaction. A field inspector on a slow
          train cannot use it. Users on a poor mobile connection get blank screens waiting for assets
          the browser already loaded last week. Native apps cache assets locally and work offline —
          web apps historically could not.
        </>
      ),
      change: (
        <>
          A <em>service worker</em> is a JavaScript file the browser registers as a proxy between
          the page and the network. Every fetch from the page passes through the service worker
          first. It can intercept requests, serve cached responses, queue mutations to replay when
          connectivity returns, and push notifications to the user even when the tab is closed. A{" "}
          <em>Progressive Web App</em> is a web app that registers a service worker, provides a web
          manifest (icon, theme color, display mode), and loads over HTTPS — the minimum to qualify
          for install-to-home-screen on Android and some iOS versions.
        </>
      ),
      cost: (
        <>
          Cache invalidation is the hard part of computer science, and service workers make it very
          easy to cache aggressively and very hard to invalidate correctly. A stale service worker
          can serve users an outdated version of your app for days after you deploy a fix. The
          update lifecycle (install, activate, claim) has several states where old and new workers
          coexist. PWA install prompts are inconsistent across browsers and platforms. Reach for
          service workers when offline capability or performance on flaky connections is a genuine
          user need, not a checklist item.
        </>
      ),
    },
    {
      id: "mobile",
      name: "React Native, Flutter, and Ionic",
      anchorLabel: "4-1 (React) and 3-1 (delivery model)",
      problem: (
        <>
          Users expect native-feeling apps on iOS and Android: gesture physics, native navigation
          patterns, access to camera and biometric APIs, no browser chrome. A web app in a browser
          tab does not meet this expectation. Writing the same product three times (web, iOS,
          Android) is expensive.
        </>
      ),
      change: (
        <>
          React Native renders native iOS and Android UI components, not a web view. Your JavaScript
          component tree is bridged to native views — a React <code>Text</code> becomes a UILabel on
          iOS and a TextView on Android. You share the application logic and component model you
          learned in module 4-1. Flutter takes a different path: it ships its own renderer (Skia /
          Impeller) and draws every pixel itself, bypassing native UI components entirely, giving
          pixel-perfect consistency across platforms at the cost of native look-and-feel. Ionic is
          the oldest approach: your app is a React (or Angular or Vue) web app running inside a
          full-screen WebView, with a bridge to native APIs via Capacitor or Cordova.
        </>
      ),
      cost: (
        <>
          Each target is its own platform with its own bugs, its own toolchain, and its own App
          Store review cycle. React Native has improved its bridge (the new architecture removes
          the JS-to-native bridge latency) but debugging across JS and native layers requires
          understanding both environments. Flutter requires learning Dart. Ionic&apos;s WebView
          performance has improved but still lags behind truly native rendering for animation-heavy
          UIs. Evaluate against your team&apos;s existing knowledge: a React-fluent team will be
          productive in React Native far faster than in Flutter.
        </>
      ),
    },
    {
      id: "desktop",
      name: "Electron and Tauri",
      anchorLabel: "3-1 and 4-1 (web delivery and React)",
      problem: (
        <>
          A desktop app needs deep OS integration: file system access, native menus, system tray,
          offline-first storage, access to hardware. A web app cannot do these things without
          explicit permissions and is constrained by browser security sandboxes. Writing a separate
          native app means abandoning the web stack entirely.
        </>
      ),
      change: (
        <>
          Electron bundles a full Chromium browser engine plus a Node.js runtime into a single
          executable. Your app is a web page with unrestricted file system and OS access. VS Code,
          Slack, and Figma are Electron apps. Tauri replaces Chromium with the OS&apos;s own
          WebView (WKWebView on macOS, WebView2 on Windows, WebKitGTK on Linux) and replaces Node
          with a Rust core process. The result is dramatically smaller binaries (a Tauri app can be
          under 10 MB; an Electron app is typically 100-200 MB) with better memory usage, but the
          Rust core requires Rust knowledge for any native extension.
        </>
      ),
      cost: (
        <>
          Electron ships an entire browser with every copy of your app. The binary size and RAM
          footprint are the perennial complaints. Auto-update, code signing, and notarization add
          CI complexity. Tauri&apos;s smaller size comes at the cost of WebView inconsistency
          across platforms (each OS ships a different WebView version) and the Rust barrier for
          native code. Both require desktop-specific UI patterns (window management, keyboard
          shortcuts, drag-and-drop) that web developers typically re-learn.
        </>
      ),
    },
    {
      id: "bundlers",
      name: "Alternative Bundlers: Webpack, esbuild, Rollup, Parcel",
      anchorLabel: "4-1 (Vite is the default)",
      problem: (
        <>
          Vite solves the same problem every bundler solves: turn a graph of module files into one
          or more optimized output files the browser can load efficiently, with transformations
          (TypeScript, JSX, CSS modules) applied along the way. But Vite is not the only answer to
          this problem.
        </>
      ),
      change: (
        <>
          Webpack predates native ESM and has the largest ecosystem of loaders and plugins — legacy
          projects and enterprise stacks lean on it heavily. esbuild is written in Go, extremely
          fast (10-100x faster than Webpack), and is what Vite uses internally for pre-bundling
          dependencies; it is less full-featured for complex transforms. Rollup pioneered
          tree-shaking as a first-class feature and is the best choice for library authors
          publishing npm packages (Vite uses Rollup for production builds). Parcel aims for zero
          configuration with automatic type inference. Bun ships its own bundler and runtime,
          targeting complete replacement of the Node + npm + esbuild stack.
        </>
      ),
      cost: (
        <>
          You rarely pick your own bundler on a new app-scale project; the framework (Next.js,
          Remix, SvelteKit) picks it for you and abstracts it. The cost of switching bundlers
          mid-project is high: loaders, plugins, and configuration idioms do not transfer. Know
          the landscape so you can read the error messages, not so you can agonize over the choice.
          Vite is the sensible default for new work in 2026; Webpack is the sensible default when
          joining an existing project built on it.
        </>
      ),
    },
    {
      id: "frameworks",
      name: "Alternative Frameworks: Vue, Svelte, Solid, Angular",
      anchorLabel: "4-1 (React / reactivity model)",
      problem: (
        <>
          React solves state-vs-DOM divergence. So do Vue, Svelte, Solid, and Angular — but each
          with a different <em>reactivity model</em>. The problem is the same; the answers differ
          in performance trade-offs, ergonomics, and philosophy.
        </>
      ),
      change: (
        <>
          Vue uses a signals-based reactivity system with optional templates: state changes propagate
          automatically to the template via a dependency graph. Svelte compiles your component to
          vanilla JavaScript at build time — there is no runtime virtual DOM; the compiler emits
          direct DOM mutations. Solid uses fine-grained reactivity (like Vue signals) but with a JSX
          surface that looks like React — components run once and reactive primitives update the DOM
          surgically without re-running the component function. Angular is a full application
          framework (opinionated router, DI container, reactive forms, RxJS integration) — the whole
          stack, not just the view layer.
        </>
      ),
      cost: (
        <>
          The team beats the framework. A strong team writes good code in any of these; a weak team
          writes bad code in the best of them. React has the largest ecosystem, the most job
          postings, and the most open-source components. Svelte has the most pleasant developer
          experience for simple cases but the smallest ecosystem. Angular is prevalent in enterprise
          shops where its DI model maps naturally to existing Java-style mental models. Pick what
          your team can hire for and maintain for three years.
        </>
      ),
    },
    {
      id: "testing",
      name: "The Testing Pyramid: Vitest, Jest, Playwright, Cypress",
      anchorLabel: "4-1 and 5-3 (app-scale code)",
      problem: (
        <>
          A refactor breaks a feature. You find out from a user in production. Manual testing does
          not scale — you cannot click through every user flow every time you change a function. You
          need automated regression catching at three levels: the function, the component, and the
          full user flow.
        </>
      ),
      change: (
        <>
          The <em>testing pyramid</em> names three levels. Unit tests run in isolation: one function,
          no network, no DOM. Vitest is the modern choice (runs in the same Vite environment as your
          app, fast, ESM-native); Jest is the older incumbent (Node-based, majority of existing test
          suites). Integration tests render a component into a lightweight DOM and exercise user
          interactions (React Testing Library is the standard API). End-to-end tests control a real
          browser against a running server: Playwright (Microsoft, newer, multi-browser) and Cypress
          (older, friendlier for beginners) are the main choices. Each level catches different bug
          classes: unit tests catch logic errors in isolation; integration tests catch wiring errors
          between components; E2E tests catch the class of bug that only appears when everything
          runs together.
        </>
      ),
      cost: (
        <>
          A flaky test is a bug, not noise — ignore it and you have lost the value of the test. E2E
          tests are the most valuable and the most expensive to keep reliable: timing, network, and
          state resets all require careful engineering. A test suite that is 90% green but has 20
          flaky E2E tests is worse than no E2E tests — it creates a false safety signal. Start with
          unit and integration tests; add E2E coverage for critical paths only (signup, checkout,
          login). Measure test value by the bugs they catch, not by coverage percentages.
        </>
      ),
    },
    {
      id: "performance",
      name: "Performance: PRPL, RAIL, Lighthouse, Core Web Vitals",
      anchorLabel: "3-1 (URL journey) and 5-1 (Next.js)",
      problem: (
        <>
          Your app works. Is it fast? How fast is fast enough? Without a measurement framework,
          performance work is guesswork — you optimize the wrong thing, ship it, and wonder why
          users still complain. You need both a vocabulary of metrics and a discipline of
          measurement.
        </>
      ),
      change: (
        <>
          <em>RAIL</em> is a user-centric performance model: Response (interactions should respond in
          under 100 ms), Animation (frames should take under 16 ms at 60 fps), Idle (use idle time
          to pre-load), Load (interactive in under 5 seconds on a mid-tier phone).{" "}
          <em>PRPL</em> is a delivery pattern: Push critical resources, Render the initial route,
          Pre-cache remaining routes, Lazy-load on demand. <em>Core Web Vitals</em> are the three
          metrics Google uses in its ranking signal: LCP (Largest Contentful Paint), INP
          (Interaction to Next Paint), and CLS (Cumulative Layout Shift). <em>Lighthouse</em> is the
          browser-built-in audit tool that measures all of these and identifies the biggest
          improvements.
        </>
      ),
      cost: (
        <>
          Lab data (Lighthouse running on your machine) is easy to get and fakes the metrics — your
          fast laptop and fast connection produce scores that do not reflect real users. Real-user
          monitoring is hard to set up and requires a meaningful traffic sample. CLS is deceptively
          easy to break with late-loading images that have no reserved dimensions. INP replaced FID
          in March 2024 and is harder to measure because it reflects the worst interaction in a page
          visit, not the first. Treat Lighthouse scores as a floor, not a ceiling: a 95 score does
          not mean your app is fast for users in Thailand on a mid-tier phone.
        </>
      ),
    },
    {
      id: "a11y",
      name: "Accessibility Audits: axe, Lighthouse a11y, screen readers",
      anchorLabel: "1-2 (semantic HTML / meaning)",
      problem: (
        <>
          Module 1-2 introduced semantic HTML as the foundation of accessibility. Semantic HTML is
          necessary but not sufficient — you can write a button and give it no keyboard focus style,
          make it invisible to screen readers, or nest it in a way that breaks the reading order.
          You need automated checks to catch the regressions you introduce as the app grows.
        </>
      ),
      change: (
        <>
          The <em>axe</em> library (from Deque Systems) is the most widely used automated
          accessibility checker. The Lighthouse a11y panel runs a subset of the same checks. These
          tools run a battery of WCAG criterion checks against the DOM and report violations with
          specific ARIA rules, element selectors, and remediation guidance. Browser extensions
          (axe DevTools, the Chrome a11y tree panel) let you inspect the accessibility tree the
          browser builds from your DOM — the same tree a screen reader navigates. A full manual test
          requires a real screen reader: NVDA + Chrome on Windows and VoiceOver + Safari on macOS
          are the two coverage pairs that matter most.
        </>
      ),
      cost: (
        <>
          Automated tools catch roughly 30-60% of accessibility issues. The rest require human
          judgment: color contrast in context, logical reading order, interaction patterns that are
          technically valid but practically unusable with a keyboard. A 100% axe score does not
          mean your app is accessible; it means you have eliminated the mechanical failures. Budget
          time for manual screen-reader testing on every significant feature. The cost of
          retro-fitting accessibility is roughly ten times the cost of building it in from the start.
        </>
      ),
    },
    {
      id: "css-preprocessors",
      name: "CSS Preprocessors and Styling Alternatives: Sass, PostCSS, CSS-in-JS, vanilla-extract",
      anchorLabel: "4-3 (Tailwind / styling at scale)",
      problem: (
        <>
          Module 4-3 showed why global CSS collides at scale and introduced Tailwind as the
          utility-first answer. But there is a landscape of other answers — some predating Tailwind,
          some reacting to Tailwind&apos;s own trade-offs.
        </>
      ),
      change: (
        <>
          Sass (and its modern syntax SCSS) added variables, nesting, mixins, and functions to CSS
          before native CSS supported any of them. Most of these features are now in native CSS
          (custom properties, native nesting, <code>calc()</code>), so the remaining reason to reach
          for Sass is transformation pipelines and legacy codebases. PostCSS is not a preprocessor
          but a transformer: it processes CSS through a plugin pipeline. Autoprefixer (which adds
          <code>-webkit-</code> vendor prefixes automatically) is a PostCSS plugin. CSS-in-JS
          libraries (styled-components, Emotion) colocate styles with components and generate unique
          class names at runtime, solving the global collision problem without Tailwind. The cost:
          a runtime overhead for style injection, and poor experience with React Server Components.{" "}
          <em>vanilla-extract</em> is a zero-runtime CSS-in-JS alternative — styles are generated
          at build time as plain CSS files, so there is no runtime overhead and RSC compatibility
          is full.
        </>
      ),
      cost: (
        <>
          Every preprocessor and CSS-in-JS library is an additional build step and an additional
          dialect your team must learn. Native CSS has closed most of the gap that motivated
          preprocessors. Tailwind has made utility-first a mainstream default. New projects in 2026
          rarely need Sass unless they are maintaining a legacy design system. The choice of CSS
          tooling is almost always inherited, not chosen — know the trade-offs so you can migrate
          deliberately rather than accidentally.
        </>
      ),
    },
  ];

  const gotchaItems = [
    {
      title: "Popularity is not fitness",
      body: (
        <>
          npm download counts and GitHub stars tell you what other people picked for their context,
          not what is right for yours. A library with 10 million weekly downloads might be depended
          on by three packages that themselves have 3 million users — the number compounds upstream.
          Evaluate tools against your actual requirements, your team&apos;s existing knowledge, and
          the maintenance track record of the project. A boring tool your team understands is better
          than a popular tool your team does not.
        </>
      ),
    },
    {
      title: "Bundle size is one cost; there are others",
      body: (
        <>
          Build complexity, debuggability, and team learning time are also costs, and they are
          harder to measure than bundle size. A tool that adds 5 kB to your bundle but makes every
          developer 20% more productive is probably worth it. A tool that saves 10 kB but requires a
          senior engineer to debug every time the build breaks is probably not. When evaluating a new
          tool, ask: what happens when this breaks in production? Can I read the source? Is the error
          message going to point me at the real problem?
        </>
      ),
    },
    {
      title: "Every abstraction has a leak",
      body: (
        <>
          At some point you will debug through an abstraction, not around it. When Auth.js produces
          a cryptic session error, you will need to read Auth.js source code. When Tailwind generates
          an unexpected class, you will need to understand its JIT engine. When a React Native
          gesture is subtly wrong on one device, you will need to understand the native gesture
          recognizer underneath the bridge. Pick abstractions with readable source, active
          maintainers, and a community that documents their internals. An abstraction you cannot
          debug is a liability.
        </>
      ),
    },
    {
      title: "Hype cycles are short; production lifecycles are long",
      body: (
        <>
          The tool that dominates social media in Q1 may have a breaking redesign in Q3 and be
          abandoned by Q1 next year. Production codebases run for three to five years. When you
          pick a tool today you are also picking who will maintain it in three years, what its
          migration story looks like when the next version breaks your API, and whether you can
          hire engineers who know it. React has been &quot;about to be replaced&quot; for eight
          years. It has not been replaced. Boring, stable, widely-deployed tools have a survival
          advantage that new tools have not yet earned.
        </>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-3xl font-bold">The Field, From Here</h1>
        <RoadmapLink url="https://roadmap.sh/frontend" />
      </div>

      {/* 1. Hook */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            This module is different from every other module in the curriculum, and it says so
            explicitly. Modules 1-1 through 5-3 each started with a failure. A .txt file that broke
            on a phone. A show-comments button that HTML could not provide. A state bug that
            hand-written DOM manipulation made inevitable. A delete button that any visitor could
            unhide in DevTools. Each module derived something new from the previous
            module&apos;s unsolved problem. You now have HTML, CSS, JavaScript, the DOM, async,
            HTTP and CORS, the full URL-to-pixels rendering pipeline, Git and deployment, React
            with Vite and TypeScript and Tailwind, Next.js with SSR and SSG and React Server
            Components, server actions and three flavors of state, and full authentication with
            server-side authorization. There is no new failure to fix here. There is a foundation
            to use.
          </p>
          <p className="text-slate-700 dark:text-slate-300">
            The frontend ecosystem is large. You hear about GraphQL, Web Components, PWAs, React
            Native, Flutter, Electron, Tauri, Webpack, esbuild, Rollup, Vue, Svelte, Solid, Angular,
            Vitest, Jest, Playwright, Cypress, PRPL, RAIL, Lighthouse, Core Web Vitals,
            accessibility audits, Sass, PostCSS, CSS-in-JS, vanilla-extract. Every one of those is
            an answer to a problem. The foundation you have makes each of them cheap to evaluate,
            because you can ask the right question: what problem does this solve, and does my
            situation have that problem? For each topic below you will get three things: what problem
            it solves, what it changes about a spine module you already understand, and what it costs.
          </p>
        </CardContent>
      </Card>

      {/* 2. Mental model */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            The temptation when encountering a new tool is to ask &quot;should I use this?&quot;
            That question has no answer without context. The right first question is &quot;what
            problem was this built to solve?&quot; If you understand the problem, you can evaluate
            whether your situation has that problem, and only then decide whether the tool&apos;s
            trade-offs are worth accepting. A tool adopted without understanding its problem is a
            liability: you do not know when to reach for it, when to stop using it, or how to debug
            it when the abstraction leaks. The spine curriculum was built from this principle —
            every module started with a problem, not a tool.
          </p>
          <blockquote className="border-l-4 border-blue-500 pl-4 italic text-slate-600 dark:text-slate-400">
            Every tool is an answer to a problem; understand the problem first.
          </blockquote>
        </CardContent>
      </Card>

      {/* Required for closing module: replaces Step-by-step */}
      <h2 className="text-xl font-semibold mb-3">The field map</h2>
      <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
        Blue nodes are spine modules you already own. Colored nodes are non-spine topics
        positioned against them. Each edge reads &quot;extends&quot; (adds to the anchor),
        &quot;alt to&quot; (solves the same problem differently), or &quot;predates&quot;
        (existed before the anchor and has been partially superseded). Drag nodes to
        rearrange; use the scroll wheel to zoom.
      </p>
      <InteractiveDiagram
        initialNodes={fieldMapNodes}
        initialEdges={fieldMapEdges}
        title="The full frontend field, anchored to your foundation"
        description="Eleven non-spine topics attached to the spine modules they extend or replace. Each topic is detailed in the cards below."
        height={880}
        interactive={true}
      />

      <div className="space-y-6 mt-8">
        {positionedTopics.map((topic) => (
          <Card key={topic.id} className="border-slate-200 dark:border-slate-700">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-1">{topic.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Anchored to: {topic.anchorLabel}
              </p>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    What problem this solves
                  </p>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{topic.problem}</div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    What it changes about the anchor module
                  </p>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{topic.change}</div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    What it costs / when to reach for it
                  </p>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{topic.cost}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 5. Challenges */}
      <h2 className="text-xl font-semibold mb-3">Challenges</h2>

      <Challenge
        title="Pick the most relevant tools"
        question="A startup is building a single app that runs on iOS and Android. It has a React frontend team. The app needs to fetch data from a backend that serves many different client shapes. Which two technologies from this module are most directly relevant to their situation?"
        options={[
          {
            id: "a",
            text: "Electron and Tauri — they need a desktop app and Electron is the standard answer.",
          },
          {
            id: "b",
            text: "React Native and GraphQL — React Native gives their React team a path to native iOS and Android; GraphQL solves the over/under-fetching problem when one backend serves many client shapes.",
          },
          {
            id: "c",
            text: "Sass and PostCSS — styling at scale is always the hardest problem for a mobile app.",
          },
          {
            id: "d",
            text: "Vue and Svelte — alternative frameworks with better mobile performance than React.",
          },
        ]}
        correctAnswerId="b"
        explanation={
          <p>
            Option b is correct. React Native lets the React team write native iOS and Android apps
            using their existing React knowledge. GraphQL addresses the stated problem — one backend,
            many different client shapes asking for different data — by letting each client specify
            exactly what it needs in a single query. Electron and Tauri (option a) target desktop
            apps, not mobile. Sass and PostCSS (option c) solve styling problems, not architecture
            or platform problems. Vue and Svelte (option d) are alternative web frameworks, not
            mobile frameworks, and they do not have a meaningful performance advantage for this use case.
          </p>
        }
      />

      <Challenge
        title="Position an unnamed tool"
        question={'A developer says: "I want to add Bun to my Vite project to speed up npm install." Where does Bun fit in the stack you know? Which module does it anchor to, and does it replace Vite, npm, or Node?'}
        options={[
          {
            id: "a",
            text: "Bun replaces Vite — it is a faster bundler that produces smaller output files than Vite does.",
          },
          {
            id: "b",
            text: "Bun replaces Node and npm — it is an all-in-one JavaScript runtime and package manager. Adding it to a Vite project means replacing npm install with bun install, which is faster. Vite itself keeps running on top of Bun the same way it runs on Node.",
          },
          {
            id: "c",
            text: "Bun replaces TypeScript — it compiles TypeScript natively without tsc, which is the main reason people adopt it.",
          },
          {
            id: "d",
            text: "Bun replaces the browser — it is a server-side rendering engine that removes the need for a client.",
          },
        ]}
        correctAnswerId="b"
        explanation={
          <p>
            Option b correctly positions Bun. Bun is a JavaScript runtime (like Node) and package
            manager (like npm) in one binary. When a developer says &quot;speed up npm install,&quot;
            they mean replacing npm as the package manager —{" "}
            <code>bun install</code> is significantly faster than <code>npm install</code> because
            Bun uses a faster resolution algorithm and binary lockfile format. Vite is a bundler and
            dev server; it keeps running on top of Bun the same way it runs on top of Node. Bun does
            execute TypeScript natively (option c is partially true) but that is not what the
            developer is asking about. Options a and d are incorrect: Bun does not replace Vite or
            the browser. This is the positioning skill in practice: Bun was not named in the spine,
            but you can place it correctly using the foundation you have.
          </p>
        }
      />

      <Challenge
        title="Pick the right family of tools"
        question={'A product team gets a feature request: "Our app needs to work offline for editors traveling on planes — they should be able to draft posts and have them sync when they land." Which family of tools addresses this, and which spine module does it extend?'}
        options={[
          {
            id: "a",
            text: "GraphQL with an offline-first cache (Apollo Client) — it extends module 2-3 (HTTP) because the problem is about data fetching.",
          },
          {
            id: "b",
            text: "Service workers and the PWA pattern — they extend module 3-1 (the URL journey) because a service worker is a proxy between the page and the network that can serve cached responses and queue mutations for replay when connectivity returns.",
          },
          {
            id: "c",
            text: "Electron or Tauri — they extend modules 3-1 and 4-1 because desktop apps have native file system access and do not require a network connection.",
          },
          {
            id: "d",
            text: "React Native — it extends module 4-1 because native mobile apps store data locally on the device.",
          },
        ]}
        correctAnswerId="b"
        explanation={
          <p>
            Option b is correct. Service workers intercept network requests and can serve cached
            responses when the network is unavailable. Background sync allows queued mutations
            (drafts written on a plane) to be replayed automatically when connectivity returns. This
            is precisely the PWA pattern described in the service workers field entry. Option a
            (GraphQL offline caching) can help with read-side caching but does not address write-side
            queueing for mutation replay. Option c (Electron/Tauri) would work for a desktop app but
            the question describes a web app used in a browser, and rewriting it as a desktop app is
            a larger engineering investment than adding a service worker. Option d (React Native) is
            for mobile apps, not web apps. The key to this challenge is recognizing that the problem
            — working offline in a browser — maps to the service worker / PWA toolset, not to a
            different delivery model.
          </p>
        }
      />

      {/* 6. GotchaList */}
      <h2 className="text-xl font-semibold mb-3">Things that surprise people</h2>
      <GotchaList items={gotchaItems} />

      {/* 7. KeyTakeaways */}
      <KeyTakeaways
        mentalModel="Every tool is an answer to a problem; understand the problem first."
        points={[
          <>
            The frontend ecosystem is large but not arbitrary. Every major tool — GraphQL, service
            workers, React Native, Electron, alternative frameworks, testing libraries, performance
            frameworks — solves a specific problem that appeared at a specific point in the history
            of the web. When you encounter a tool you do not know, find the problem it was built to
            solve before you evaluate whether to use it.
          </>,
          <>
            The spine curriculum (modules 1-1 through 5-3) is a foundation, not a ceiling. Each of
            the eleven topics in this module anchors to a spine module: <em>GraphQL</em> extends
            2-3, <em>PWAs</em> extend 3-1, <em>React Native</em> extends 4-1, alternative
            frameworks extend 4-1 with different reactivity models, and so on. Understanding the
            anchor makes the extension comprehensible without rederiving it from scratch.
          </>,
          <>
            Every tool has costs, not just benefits. The cost half of the evaluation is at least as
            important as the benefit half. GraphQL&apos;s cost is schema maintenance and cache
            complexity. Electron&apos;s cost is binary size and RAM. A flaky E2E test suite&apos;s
            cost is a false safety signal. A service worker&apos;s cost is cache invalidation bugs.
            A tool you adopt without understanding its costs will surprise you in production.
          </>,
          <>
            The meta-skill is positioning, not memorization. You cannot memorize the entire frontend
            ecosystem. You can develop a reflex: when you encounter a new tool, ask what problem it
            solves, what spine module it extends or replaces, and what it costs. That reflex is what
            the Bun challenge tested: Bun was not named in the spine, but the foundation was enough
            to place it correctly.
          </>,
          <>
            Boring, stable, widely-deployed tools have a survival advantage. React has been
            &quot;about to be replaced&quot; for years. It has not been replaced. The tools with the
            largest ecosystems, the most mature error messages, and the most hiring pools are not
            glamorous, but they are the ones you will spend most of your career maintaining. Hype
            cycles are short; production lifecycles are long.
          </>,
        ]}
      />
    </div>
  );
}
