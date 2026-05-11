# First-Principles Curriculum — Learning Outcomes

**Date:** 2026-05-10
**Status:** Active
**Supersedes:** docs/superpowers/specs/2026-05-09-learning-outcomes.md

## Acceptance contract

A module is "done" when every Bloom-verb outcome below is exercised somewhere in the module — in a Challenge, a Playground exercise, or the module's prose. The 7 mandatory Tier-A sections (Hook, Mental model, Step-by-step, Playground, Challenges, GotchaList, KeyTakeaways) are necessary but not sufficient; outcomes are the *test* the module has to pass.

## Modules

### Stage I — A document, made visible

#### 1-1 the-smallest-useful-thing
**Title:** The Smallest Useful Thing on the Web

**Driving failure:** A .txt blog post opens fine on your laptop. Open it on a phone — fonts collapse, links don't work, no headings.

**Outcomes:**
- *Recognize* what a browser is and is not.
- *Write* a working HTML document by hand.
- *Explain* why structure has to travel with the words.

---

#### 1-2 meaning-before-appearance
**Title:** Meaning Before Appearance

**Driving failure:** A screen reader reads your homepage as "link, link, link, text, text, text" — no sense of what is navigation, article, or aside.

**Outcomes:**
- *Pick* the right semantic element for the job.
- *Build* a document outline a screen reader can follow.
- *Wire* a form's labels and inputs accessibly.

---

#### 1-3 the-same-document-two-lives
**Title:** The Same Document, Two Lives

**Driving failure:** Inline styles work for one paragraph. Apply them to twenty posts and your HTML doubles in size; the same CSS is repeated everywhere; changing the brand color means 200 edits.

**Outcomes:**
- *Compute* specificity by hand and predict cascade winners.
- *Reason* about the box model (content-box vs border-box).
- *Build* a responsive two-column layout with Flexbox and Grid.

---

### Stage II — A document, made alive

#### 2-1 when-the-page-has-to-react
**Title:** When the Page Has to React

**Driving failure:** A "show comments" button needs to toggle a section. HTML provides no syntax for that. CSS :checked hacks fail the moment a third state appears.

**Outcomes:**
- *Distinguish* primitives, references, and how scope binds them.
- *Query* and mutate the DOM efficiently.
- *Use* event delegation for dynamic content.

---

#### 2-2 things-take-time
**Title:** Things Take Time

**Driving failure:** Synchronous code freezes the page while comments load. Users click again, again, again — nothing happens until the call returns.

**Outcomes:**
- *Convert* callbacks into Promises and Promises into async/await.
- *Sketch* the event loop with macrotasks and microtasks.
- *Handle* errors in async chains.

---

#### 2-3 talking-to-another-machine
**Title:** Talking to Another Machine

**Driving failure:** fetch('https://other-origin/comments') returns nothing useful. The console says "CORS blocked". Why? What header would unblock it?

**Outcomes:**
- *Read* an HTTP request/response by hand.
- *Pick* the right method and status code for an operation.
- *Diagnose* and fix a CORS-blocked request.

---

### Stage III — A page that lives on the internet

#### 3-1 the-journey-of-a-url
**Title:** The Journey of a URL

**Driving failure:** Your blog opens on your laptop because your laptop has the file. A friend in Brazil types your domain — what has to be true for them to see what you see?

**Outcomes:**
- *Trace* what happens between typing a URL and seeing pixels.
- *Distinguish* DNS, IP, TCP, TLS, and HTTP layers.
- *Walk* through the critical rendering path (parse → DOM → CSSOM → render → layout → paint).

---

#### 3-2 ship-it-and-version-it
**Title:** Ship It and Version It

**Driving failure:** You accidentally rewrote assets/site.css. There's no Ctrl+Z that survives lunch. Your friend asks for the URL — your laptop is the only place it exists.

**Outcomes:**
- *Work* in feature branches and resolve a merge conflict without panic.
- *Deploy* a static site to a hosting provider.
- *Read* git log like a story.

---

### Stage IV — The walls of vanilla

#### 4-1 the-dom-is-a-footgun-at-scale
**Title:** The DOM Is a Footgun at Scale

**Driving failure:** Adding "edit your own comment" to the vanilla blog means: find the right node, replace its contents, swap classes, restore on cancel. State lives in three places. Bugs follow.

**Outcomes:**
- *Recognize* the state-vs-DOM divergence bug class.
- *Write* a React component with hooks (useState, useEffect).
- *Set up* a Vite + React project and read its build output.

---

#### 4-2 types-and-the-editor-that-knows-them
**Title:** Types and the Editor That Knows Them

**Driving failure:** A user reports "undefined is not a function". The bug: a Comment had no .author because the API returned null. JS happily passed it through three layers before exploding.

**Outcomes:**
- *Add* types to a JS file incrementally.
- *Use* unions, generics, and narrowing.
- *Read* and fix a tsc error.

---

#### 4-3 css-at-scale-collides
**Title:** CSS at Scale Collides

**Driving failure:** &lt;CommentForm&gt; and &lt;PostForm&gt; both style .button. CommentForm's button is now blue everywhere — including in PostForm, where it should be gray.

**Outcomes:**
- *Diagnose* a specificity collision.
- *Restyle* a real component with Tailwind utilities.
- *Recognize* when not to add a styling library.

---

### Stage V — A real modern frontend app

#### 5-1 routes-layouts-and-where-should-this-render
**Title:** Routes, Layouts, and Where Should This Render

**Driving failure:** Search "taproot-blog" on Google — your blog isn't there. View source on the SPA — the body is empty until JS runs. The first paint is a blank screen on slow phones.

**Outcomes:**
- *Pick* CSR / SSR / SSG / ISR / RSC for a route on purpose.
- *Reason* about hydration cost and what it actually costs.
- *Set up* Next.js App Router with nested layouts.

---

#### 5-2 data-state-and-who-owns-the-truth
**Title:** Data, State, and Who Owns the Truth

**Driving failure:** User filters by tag → URL changes → server returns filtered posts → client cache thinks the old set is still valid → user sees the wrong list. Three sources of truth, all confident.

**Outcomes:**
- *Distinguish* URL state, server state, and client state.
- *Use* server actions and cache invalidation in Next.js.
- *Pick* a data-fetching strategy for a given feature.

---

#### 5-3 identity-and-trust
**Title:** Identity and Trust

**Driving failure:** You add a "Delete" button visible only to authors. A curious user opens DevTools, removes the hidden class, clicks delete. The post is gone. The frontend was the security boundary. It shouldn't have been.

**Outcomes:**
- *Distinguish* authentication from authorization.
- *Set up* session-based auth with NextAuth.
- *Identify* and fix a CSRF and an XSS vulnerability.

---

### Stage VI — The field, from here

#### 6-1 the-field-from-here
**Title:** The Field, From Here

**Driving failure:** *(closing module — no driving failure; nothing is being derived)*

**Outcomes:**
- *Position* a new frontend tool against the foundation you have.
- *Reason* about a tool's costs as well as its benefits.
- *Recognize* when not to reach for a new tool.
