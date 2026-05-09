# Style Audit Findings (Wave 8)

**Date:** 2026-05-09
**Modules audited:** 1-2, 1-3, 5-2, 7-1, 7-3 (5 random of 30)
**Quality gates:** lint PASS / tsc PASS / build PASS

---

## Per-module findings

### 1-2-http-and-https (524 lines)

- **Voice:** pass. No "we", no forbidden phrases, direct second-person throughout.
- **Structure:** pass. All 7 sections present and numbered 1–7. Optional SequenceDiagram correctly uses `{/* Optional: ... */}` with no number. First-line comment verbatim correct. Step array named `httpAnatomySteps`.
- **Hook:** Minor issue. The hook opens with an abstract claim ("Every API call you have ever made … all of it is the same three-act conversation.") rather than a concrete failure or felt tension. The spec example is "you hit X and Y happens." The second paragraph promises a deliverable which is good, but the first paragraph is a generalization rather than a grounding situation. Acceptable in context — the deliverable promise is immediate — but weaker than 1-1 or 1-3.
- **Mental model:** pass. Pull-quote verbatim matches `KeyTakeaways.mentalModel` — both read "HTTP is a stateless conversation: the client asks, the server answers, and neither side remembers anything between requests."
- **Step-by-step:** pass. 6 steps, all JSX fragment descriptions (not strings), all have `code` fields, 5–8 range met.
- **Playground:** pass. JS starts with `// Try this:` comment.
- **Challenges:** pass. 2 challenges. First tests application/judgment (picking correct HTTP method for a use case). Second tests debug judgment (4xx vs 5xx ownership).
- **GotchaList:** pass. 4 items (within 3–5). All `title:` fields are plain JS strings — no `&apos;` entities. Titles are concrete and actionable.
- **Catalog terms:** pass. `<em>` used correctly for HTTP, HTTP method, idempotent, HTTP header, HTTP status code, cookie, HTTP cache, HTTPS, TLS handshake, certificate (TLS), Certificate Authority (CA).
- **Outcomes:** pass. All 5 outcomes exercised: methods listed (Step 2), status categories explained (Step 4), raw request anatomy (Step 1–5), method judgment (Challenge 1), 4xx/5xx debug (Challenge 2).

---

### 1-3-domain-dns-hosting (544 lines)

- **Voice:** pass. No "we", direct second-person, no forbidden phrases.
- **Structure:** pass. All 7 sections present and numbered. Optional SequenceDiagram correctly labelled. First-line comment verbatim correct. Step array named `domainSetupSteps`.
- **Hook:** pass. Concrete felt tension: "You bought `myapp.com`. Now what? An hour later you are pasting nameservers, A records, CNAME, TTL into config screens, getting cryptic errors…" — this is the "you hit X and Y happens" shape the spec calls for.
- **Mental model:** Important issue. The blockquote on line 368 uses HTML entities `&rarr;` for arrows: `"Domain &rarr; DNS &rarr; IP &rarr; Server. A CDN is the same content, geographically duplicated. TTL is how long the wrong answer stays cached."` The `mentalModel` prop on line 540 uses Unicode `→` arrows: `"Domain → DNS → IP → Server. A CDN is the same content, geographically duplicated. TTL is how long the wrong answer stays cached."` The visible rendered text is identical in both cases, so the spec requirement "appears verbatim in `KeyTakeaways.mentalModel`" is met at the display level. However, the raw strings differ (`&rarr;` vs `→`), creating a maintenance hazard — an editor checking the blockquote text against the prop directly would see a mismatch.
- **Step-by-step:** pass. 6 steps, all JSX fragment descriptions, all have `code` fields.
- **Playground:** pass. JS starts with `// Try this:` comment.
- **Challenges:** pass. 2 challenges. CNAME vs A record (application, correct selection). Hosting shape for a marketing site (judgment).
- **GotchaList:** pass. 4 items, plain string titles, concrete surprises.
- **Catalog terms:** pass. `<em>` used for domain name, root, TLD, subdomain, registrar, DNS host, hosting, A record, AAAA record, CNAME record, TTL (DNS), static hosting, CDN.
- **Outcomes:** pass. All 5 outcomes exercised: domain parts (Step 1), DNS record configuration (Step 3 + Challenge 1), hosting judgment (Step 5 + Challenge 2), CDN one-sentence (Step 6), Vercel DNS sketch (Step 2 + Challenge 1).

---

### 5-2-package-managers (644 lines)

- **Voice:** pass. No "we", direct second-person throughout.
- **Structure:** Minor issue. Section 2 comment reads `{/* Section 2: Mental model */}` — every other module in the repo (including the 1-1 exemplar) reads `{/* Section 2: Mental model first */}`. The label drift is cosmetic but inconsistent with the §4.1 convention. First-line comment verbatim correct. Step array named `packageManagerSteps`.
- **Hook:** pass. Concrete felt tension: "`node_modules` is enormous, install is slow, colleague's machine produced a different bug than yours from the same commit." Concrete problems, immediately grounded.
- **Mental model:** pass. Blockquote and `mentalModel` prop match verbatim: "package.json declares; the lockfile resolves. The lockfile is the contract — commit it. Use pnpm: same npm registry, content-addressed store, symlinks instead of copies."
- **Step-by-step:** pass. 6 steps, all JSX fragment descriptions, all have `code` fields.
- **Playground:** pass. JS starts with `// Try this:` comment.
- **Challenges:** pass. 2 challenges. Challenge 1 tests recall (lockfile purpose) — slightly on the recall end but the explanation is application-level. Challenge 2 tests judgment (peerDependencies range for a library). Both have 2–3 sentence explanations.
- **GotchaList:** pass. 4 items, plain string titles, concrete surprises covering lockfile determinism, `--frozen-lockfile`, phantom dependencies, peerDependencies semantics.
- **Catalog terms:** pass. `<em>` used for semver, lockfile, pnpm, workspace.
- **Outcomes:** pass. All 5 outcomes exercised: lockfile purpose (Step 3 + Challenge 1), reading package.json and lockfile (playground), pin/range/float judgment (Step 6 + Challenge 2), pnpm workspace (Step 5 + TerminalPlayground), npm/pnpm/yarn tradeoffs (Alternatives Card).

---

### 7-1-web-components (632 lines)

- **Voice:** pass. No "we", direct second-person, no forbidden phrases.
- **Structure:** pass. All 7 sections present and numbered 1–7 (no optional sections). First-line comment verbatim correct. Blank line between comment and first const declaration is present (minor but differs from 1-1 where there is no blank line; not a spec violation).
- **Hook:** pass. Concrete contrast: two teams ship a button; one works everywhere, the other only in React. Immediate, tangible tension. Second paragraph delivers learning-goal promise.
- **Mental model:** pass. Blockquote and `mentalModel` prop match verbatim: "Custom Elements are framework-agnostic components. Shadow DOM is real style encapsulation, not class-name conventions. Slots project content from the host into the component."
- **Step-by-step:** pass. 6 steps, all JSX fragment descriptions, all have `code` fields.
- **Playground:** pass. JS starts with `// Try this:` comment.
- **Challenges:** pass. 2 challenges. Challenge 1 is recall (lifecycle callback names). Challenge 2 is judgment (Web Components vs React for a single-stack app). Both explanations are 2–3 sentences.
- **GotchaList:** pass. 4 items, plain string titles, concrete.
- **Catalog terms:** Important issue. Module 7-1 uses `<strong>` for catalog-term first-use throughout — `<strong>Custom Element</strong>`, `<strong>Shadow DOM</strong>`, `<strong>slot</strong>` — instead of `<em>`. The spec §2.2 and the rubric both require "Catalog terms italicized on first use via real `<em>` JSX." The use of `<strong>` renders the term in bold rather than italic, which is visually distinguishable and semantically incorrect per the spec. This appears in the step descriptions (lines 19, 84, 155) and in the Hook/Mental-model prose (lines 420, 421, 446, 448, 450). This is the most significant style drift in this audit.
- **Outcomes:** pass. All 5 outcomes exercised: custom element defined (Step 1 + playground), Shadow DOM encapsulation (Step 3 + playground), template/slot composition (Step 4–5 + playground), Web Components vs React judgment (Step 6 + Challenge 2), lifecycle callbacks recalled (Step 2 + KeyTakeaways + Challenge 1).

---

### 7-3-graphql (624 lines)

- **Voice:** pass. No "we", direct second-person throughout.
- **Structure:** pass. All 7 sections present and numbered 1–7. First-line comment verbatim correct. Step array named `graphqlEndToEndSteps`.
- **Hook:** pass. Concrete tension: "Your dashboard makes 14 REST calls on first load. Three of them return data the dashboard ignores; one returns 200 KB and the dashboard uses 4 fields." Immediate, quantified problem.
- **Mental model:** pass. Blockquote and `mentalModel` prop match verbatim.
- **Step-by-step:** pass. 6 steps, all JSX fragment descriptions, all have `code` fields.
- **Playground:** pass. JS starts with `// Try this:` comment. The three-panel schema/query/response explorer is well-suited to the topic.
- **Challenges:** pass. 2 challenges. Challenge 1 tests judgment (when is GraphQL worth it). Challenge 2 tests understanding of normalized cache design. Both meet the "application or judgment" bar. Explanations are 3–4 sentences.
- **GotchaList:** pass. 4 items. Minor issue: item 4 title — "GraphQL plus REST gateways is increasingly common" — is a trend observation rather than an actionable surprise ("things that surprise people"). It describes what many teams do rather than a gotcha that produces bugs. The content in the body is informative but the title framing does not match the "actionable surprise" tone the spec describes.
- **Catalog terms:** Important issue. Module 7-3 uses `<strong>` for catalog-term first-use (`<strong>schema</strong>` on line 18, `<strong>resolver</strong>` on line 122) while `<em>Apollo Client</em>` on line 189 is correct. The inconsistency suggests the author mixed conventions. The spec requires `<em>` throughout for catalog-term first-use. This is the same pattern as 7-1.
- **Outcomes:** pass. All 5 outcomes exercised: schema/query/mutation reading (Steps 1–2), fragments and variables query (Step 3 + Challenge 1), Apollo Client fetch and cache (Step 6), REST vs GraphQL judgment (Challenge 1), id-vs-URL caching (Step 6 + Challenge 2).

---

## Cross-module patterns

### Voice consistency

All five modules read like one author. Second-person "you" is consistent throughout. Hook openings vary in quality (1-3 is the strongest; 1-2 the weakest) but none violate the rule. Pull-quotes follow the same `<blockquote className="border-l-4 border-blue-500 pl-4 italic">` pattern uniformly. The em-dash style (`—`) and Oxford-comma usage are consistent.

### Density

All five modules are in the 500–650 line range. None exceed the 1500-line escalation threshold. 5-2 is the densest at 644 lines, justified by the Alternatives Card appended after KeyTakeaways plus a TerminalPlayground — both warranted by the topic.

### Recurring drift

Two patterns appear in multiple modules:

1. **`<strong>` used instead of `<em>` for catalog-term first-use (7-1, 7-3).** Both Phase 7 modules use `<strong>` for defining catalog terms inline in step descriptions. The Phase 1 and Phase 5 modules correctly use `<em>`. This is a Wave 7 authoring drift — whoever authored 7-1 and 7-3 adopted `<strong>` for inline definitions, possibly interpreting "callout" as bold rather than italic.

2. **Section 2 comment label variance (5-2).** The section comment reads `{/* Section 2: Mental model */}` instead of `{/* Section 2: Mental model first */}`. Not a functional problem but the inconsistency means a future search for the canonical label finds a mismatch.

3. **`&rarr;` vs `→` split in blockquote vs prop (1-3).** The blockquote uses HTML-entity arrows while the `mentalModel` prop uses Unicode arrows. Visually identical at render time; raw-string mismatch creates a maintenance hazard.

---

## Recommended fixes

1. **`lib/modules/7-1-web-components.tsx` lines 19, 84, 155 — `<strong>` → `<em>` for catalog-term first-use in step descriptions.** Replace `<strong>Custom Element</strong>`, `<strong>Shadow DOM</strong>`, and `<strong>slot</strong>` with `<em>Custom Element</em>`, `<em>Shadow DOM</em>`, `<em>slot</em>` in the step `description` JSX (the Hook/MentalModel sections also use `<strong>` for these terms — lines 420, 421, 423–425, 446, 448, 450 — but those are prose emphasis and are borderline acceptable; the step descriptions are the first-use location the spec targets). **Severity: Important.**

2. **`lib/modules/7-3-graphql.tsx` lines 18, 122 — `<strong>` → `<em>` for catalog-term first-use in step descriptions.** Replace `<strong>schema</strong>` (line 18) and `<strong>resolver</strong>` (line 122) with `<em>schema</em>` and `<em>resolver</em>`. Line 189 `<em>Apollo Client</em>` is already correct. **Severity: Important.**

3. **`lib/modules/1-3-domain-dns-hosting.tsx` line 368–369 — normalize blockquote arrows to Unicode.** Change `&rarr;` (three occurrences in the blockquote) to `→` to match the `mentalModel` prop verbatim. **Severity: Minor.**

4. **`lib/modules/5-2-package-managers.tsx` line 416 — normalize section comment label.** Change `{/* Section 2: Mental model */}` to `{/* Section 2: Mental model first */}` to match the §4.1 convention. **Severity: Minor.**

5. **`lib/modules/7-3-graphql.tsx` GotchaList item 4 — retitle for actionable-surprise framing (escalation, not inline fix).** "GraphQL plus REST gateways is increasingly common" reads as a trend note rather than a gotcha. A retitle like "A GraphQL layer over REST microservices adds an extra hop and two schema maintenance surfaces" would be more actionable. This is a content edit (3+ line change), escalated rather than fixed here. **Severity: Minor — follow-up wave.**

6. **`lib/modules/1-2-http-and-https.tsx` Hook — consider sharpening the opening (escalation, not inline fix).** "Every API call you have ever made … all of it is the same three-act conversation" is a pattern/truism opener rather than a concrete failure. Consider grounding it in a specific observable moment ("You submit a login form and nothing happens — no error, no redirect, just silence"). This is a content rewrite, escalated rather than fixed here. **Severity: Minor — follow-up wave.**

---

## Assessment

**Needs work** — two inline fixes are blockers for full spec compliance (issues 1 and 2 above: `<strong>` instead of `<em>` in 7-1 and 7-3). Issues 3 and 4 are minor maintenance hazards fixed inline. Issues 5 and 6 are follow-up content edits that do not break any rubric gate but should be addressed in the next pass.

After applying the inline fixes, all 5 modules meet the Wave 8 rubric: all 7 sections present and in order, no HTML entities in JS object literals, no forbidden phrases, no emojis, no Vietnamese, quality gates green.
