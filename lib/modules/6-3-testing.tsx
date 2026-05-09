"use client";

import { Card, CardContent } from "@/components/ui/card";
import { HTMLPlayground } from "@/components/CodePlayground";
import { StepByStepExplanation, Step } from "@/components/StepByStepExplanation";
import { CodeComparison } from "@/components/CodeComparison";
import { TerminalPlayground } from "@/components/TerminalPlayground";
import { Challenge } from "@/components/Challenge";
import { GotchaList } from "@/components/GotchaList";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { RoadmapLink } from "@/components/RoadmapLink";

export function Module_6_3_Content() {
  // Data blocks hoisted out of JSX for readability — listed in render order.
  const testLevelSteps: Step[] = [
    {
      title: "Step 1: The pyramid",
      description: (
        <>
          The <em>test pyramid</em> is a shape that tells you how many tests to write at each level.
          At the bottom: many fast unit tests — they run in milliseconds, have zero network calls,
          and give pinpoint feedback. In the middle: fewer integration tests — they spin up a real
          DOM but no browser. At the top: fewest E2E tests — a real browser, real HTTP, real
          everything. Each level catches what the level below cannot. The pyramid&apos;s shape
          is not a style choice; it is the cheapest allocation of confidence.
        </>
      ),
      code: `# The test pyramid — shape encodes cost/confidence tradeoff
#
#          ┌──────┐
#          │  E2E │   fewest — slowest, most brittle, highest confidence
#          ├──────┴──────┐
#          │ Integration │  fewer — medium speed, catches seam bugs
#          ├─────────────┴──────────────┐
#          │       Unit tests           │  most — ~1 ms each, deterministic
#          └────────────────────────────┘
#
# Inverting the pyramid → "ice-cream cone anti-pattern":
# CI takes hours, flakes constantly, and feedback is late.`,
    },
    {
      title: "Step 2: Vitest unit tests",
      description: (
        <>
          <em>Vitest</em> — a Vite-native unit/component test runner with Jest-compatible API —
          is the right tool for testing pure functions and isolated modules. Its cold start is
          roughly 10× faster than Jest&apos;s because it reuses the same Vite pipeline your app
          already uses. The API is familiar: <code>describe</code>, <code>it</code>,{" "}
          <code>expect</code>. Pure functions — functions with no side effects whose output
          depends only on their input — are ideal unit-test targets: they are fast, deterministic,
          and trivially isolated.
        </>
      ),
      code: `// auth.test.ts — unit test for a pure function
import { describe, it, expect } from "vitest";
import { validateCredentials } from "./auth";

describe("validateCredentials", () => {
  it("returns true for a matching username/password pair", () => {
    expect(validateCredentials("ada", "secret")).toBe(true);
  });

  it("returns false for a wrong password", () => {
    expect(validateCredentials("ada", "wrong")).toBe(false);
  });

  it("returns false for an empty username", () => {
    expect(validateCredentials("", "secret")).toBe(false);
  });
});
// Run: pnpm vitest run  →  3 tests, ~10 ms`,
    },
    {
      title: "Step 3: Component tests with Testing Library",
      description: (
        <>
          A component test renders the component in a simulated DOM (jsdom), interacts with it the
          way a user would, and asserts on what the user can observe — text, roles, labels. The key
          rule: query by what the user sees, not by internal details. Use{" "}
          <code>getByRole</code> and <code>getByLabelText</code> rather than{" "}
          <code>getByTestId</code> or direct state inspection. A test that passes after you rename an
          internal state variable but fails after you rename a visible button is the correct
          sensitivity.
        </>
      ),
      code: `// LoginForm.test.tsx — component test
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "./LoginForm";

it("submits valid credentials", async () => {
  const onSubmit = vi.fn();
  render(<LoginForm onSubmit={onSubmit} />);

  // Query by what the user sees — label text, not test IDs
  await userEvent.type(screen.getByLabelText(/username/i), "ada");
  await userEvent.type(screen.getByLabelText(/password/i), "secret");
  await userEvent.click(screen.getByRole("button", { name: /log in/i }));

  // Assert on observable behavior
  expect(onSubmit).toHaveBeenCalledWith({ user: "ada", pass: "secret" });
});
// Does NOT test: component state, render count, internal function names`,
    },
    {
      title: "Step 4: Playwright E2E",
      description: (
        <>
          <em>Playwright</em> — an end-to-end browser-automation test framework — drives a real
          browser (Chromium, Firefox, or WebKit) against a running server. It is the only level that
          catches cross-route bugs — a redirect that breaks only after a real login, a cookie that
          is not set in the right domain. The cost is real: one Playwright test takes 3–10 seconds
          where a unit test takes 1 ms. That is a 3000–10 000× slowdown. Budget E2E for critical user
          journeys only — login, checkout, the path that makes you money.
        </>
      ),
      code: `// login.spec.ts — Playwright E2E
import { test, expect } from "@playwright/test";

test("user can log in and reach the dashboard", async ({ page }) => {
  await page.goto("http://localhost:3000/login");

  // Playwright uses the same user-visible queries as Testing Library
  await page.getByLabel("Username").fill("ada");
  await page.getByLabel("Password").fill("correct-password");
  await page.getByRole("button", { name: "Log in" }).click();

  // Auto-waits — no sleep needed; retries until URL matches or timeout
  await expect(page).toHaveURL(/dashboard/);
  await expect(page.getByRole("heading", { name: /welcome/i })).toBeVisible();
});`,
    },
    {
      title: "Step 5: When to use which",
      description: (
        <>
          The decision rule fits in a decision tree. Does the thing you&apos;re testing have external
          dependencies (DOM, network, browser APIs)? No: unit test. Does it need a rendered
          component but no real server? Component (integration) test. Does it cross a route boundary,
          involve real HTTP cookies, or simulate a multi-page user journey? E2E. The expensive
          mistake is defaulting to E2E because it &quot;tests more.&quot; Testing more is not the
          goal; catching bugs cheapest is.
        </>
      ),
      code: `# Decision tree
#
# Pure logic (regex, math, data transform)?
#   → Unit test (Vitest, ~1 ms)
#
# Component renders correctly / handles events?
#   → Component test (Vitest + Testing Library, ~100 ms)
#
# Multi-route flow (login → dashboard → logout)?
#   → E2E (Playwright, ~5 s)
#
# Real-world examples:
#   validateEmail(str)          → unit
#   <SearchInput> shows results → component
#   User completes checkout     → E2E
#
# Don't E2E what a unit test catches.
# Don't unit test what needs a DOM.`,
    },
    {
      title: "Step 6: Fighting flakiness",
      description: (
        <>
          A flaky test is a test that fails intermittently without a code change. Flaky tests are
          bugs in the test suite — they erode trust in the entire suite because engineers learn to
          ignore red CI. The most common cause in Playwright: waiting for a UI element with a
          fixed <code>waitForTimeout</code> (sleep) when the element could appear faster or slower
          depending on load. Playwright assertions auto-retry until the condition is met or the
          timeout fires; replace every <code>sleep</code> with an assertion that describes what you
          are actually waiting for.
        </>
      ),
      code: `// FLAKY — sleep is a guess; fails on slow CI, wastes time on fast CI
await page.waitForTimeout(2000);
const heading = page.getByRole("heading", { name: /dashboard/i });
expect(await heading.isVisible()).toBe(true);

// FIXED — Playwright retries the assertion automatically
await expect(
  page.getByRole("heading", { name: /dashboard/i })
).toBeVisible({ timeout: 5000 });

// For time-sensitive UI (animations, countdowns):
// → use page.clock.install() to pin the system clock
// → control ticks deterministically: await page.clock.tick(3000)`,
    },
  ];

  const comparisonUnitCode = `// Unit (Vitest) — pure function
import { describe, it, expect } from "vitest";
import { validateCredentials } from "./auth";

describe("validateCredentials", () => {
  it("returns true for matching pair", () => {
    expect(validateCredentials("ada", "secret")).toBe(true);
  });
  it("returns false for wrong password", () => {
    expect(validateCredentials("ada", "wrong")).toBe(false);
  });
});`;

  const comparisonComponentCode = `// Component (Vitest + Testing Library)
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "./LoginForm";

it("submits valid credentials", async () => {
  const onSubmit = vi.fn();
  render(<LoginForm onSubmit={onSubmit} />);
  await userEvent.type(screen.getByLabelText(/username/i), "ada");
  await userEvent.type(screen.getByLabelText(/password/i), "secret");
  await userEvent.click(screen.getByRole("button", { name: /log in/i }));
  expect(onSubmit).toHaveBeenCalledWith({ user: "ada", pass: "secret" });
});`;

  const terminalLines = [
    {
      command: "pnpm vitest run",
      output:
        "✓ src/auth.test.ts (2 tests)\n✓ src/LoginForm.test.tsx (4 tests)\n\nTest Files  2 passed (2)\n     Tests  6 passed (6)\n  Duration  812ms",
    },
    {
      command: "pnpm playwright test",
      output:
        "Running 3 tests using 3 workers\n  ✓ login.spec.ts:5:1 › successful login (4.2s)\n  ✓ login.spec.ts:18:1 › wrong password (3.8s)\n  ✓ login.spec.ts:31:1 › logout (4.5s)\n3 passed (12.5s)",
    },
  ];

  const playgroundHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Test Pyramid</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <div id="pyramid">
    <div class="tier tier-e2e" data-level="e2e">
      <span class="tier-label">E2E</span>
    </div>
    <div class="tier tier-integration" data-level="integration">
      <span class="tier-label">Integration</span>
    </div>
    <div class="tier tier-unit" data-level="unit">
      <span class="tier-label">Unit</span>
    </div>
  </div>
  <div id="info" class="info-box">
    <p id="info-text">Click a tier to learn about it.</p>
  </div>
  <script src="/script.js"></script>
</body>
</html>`;

  const playgroundCss = `* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: system-ui, sans-serif;
  background: #f8fafc;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 16px;
  color: #1e293b;
}
#pyramid {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  margin-bottom: 24px;
}
.tier {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.15s;
  font-weight: 600;
  font-size: 0.9rem;
  color: white;
  user-select: none;
}
.tier:hover { opacity: 0.85; transform: scaleX(1.03); }
.tier.active { outline: 3px solid #1e293b; }
.tier-e2e        { width: 160px;  height: 52px; background: #ef4444; }
.tier-integration{ width: 260px;  height: 52px; background: #f97316; }
.tier-unit       { width: 380px;  height: 60px; background: #22c55e; }
.info-box {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px 20px;
  max-width: 440px;
  width: 100%;
  line-height: 1.6;
  font-size: 0.9rem;
  min-height: 80px;
}`;

  const playgroundJs = `// Try this: click each tier of the pyramid below to see the trade-offs.
// Notice the bottom is wide (many fast unit tests) and the top is narrow
// (few slow E2E tests). Inverting that — many E2E, few unit — is the
// ice-cream-cone anti-pattern; CI takes hours and flakes constantly.

const INFO = {
  unit: {
    label: "Unit tests",
    text: "Fastest: ~1 ms each. Isolated — no DOM, no network. Perfect for pure functions, data transforms, regex, business logic. Fails pinpoint: when a unit test fails you know exactly which function is broken. Write many. Run them on every save."
  },
  integration: {
    label: "Integration / component tests",
    text: "Medium speed: ~100 ms each. Render a real component in a simulated DOM (jsdom). Interact via user-visible roles and labels. Catch the \\"each unit works but together they break\\" class of bug. Write fewer than unit tests; focus on component behavior and seams between modules."
  },
  e2e: {
    label: "E2E tests (Playwright)",
    text: "Slowest: ~4–10 s each. Real browser, real HTTP, real cookies. The only level that catches cross-route bugs — redirects, real session state, multi-page flows. Budget for critical user journeys only: login, checkout, the path that makes you money. Keep the count small."
  }
};

document.querySelectorAll(".tier").forEach(function(el) {
  el.addEventListener("click", function() {
    var level = el.dataset.level;
    document.querySelectorAll(".tier").forEach(function(t) {
      t.classList.remove("active");
    });
    el.classList.add("active");
    var data = INFO[level];
    document.getElementById("info-text").textContent =
      data.label + ": " + data.text;
  });
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
              Tests are insurance you only collect on if they actually catch the bug. Hundreds of
              unit tests covering 90% of lines won&apos;t help if none of them exercise the path
              that breaks in production. The shape of a good test suite — many fast unit tests,
              fewer integration tests, fewest E2E tests — is the <em>test pyramid</em>; the price is
              paying attention to <em>which</em> level catches <em>which</em> bug.
            </p>
            <p>
              A test suite that is all E2E tests catches real bugs but takes an hour to run and
              fails intermittently for reasons unrelated to your code. A test suite that is all unit
              tests runs in seconds but misses the class of bug where each unit works in isolation
              and breaks only when wired together. The pyramid tells you how to allocate effort so
              you get the fastest possible feedback on the highest-probability bugs.
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
              Every decision in a test suite flows from one insight: a test&apos;s value is
              proportional to how cheaply it catches a real bug, not to how many lines of code it
              touches. Unit tests are cheap — fast, deterministic, isolated. E2E tests are expensive
              — slow, potentially flaky, requiring a running server. The pyramid shape follows
              directly: maximize the cheap ones, minimize the expensive ones, and always test what
              the user observes, not what the internals do.
            </p>
            <blockquote className="border-l-4 border-blue-500 pl-4 italic">
              &quot;Test the behavior, not the implementation. Many cheap unit tests, fewer
              integration tests, fewest E2E tests. Flaky tests are bugs.&quot;
            </blockquote>
          </div>
        </CardContent>
      </Card>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 3: Step-by-step                                               */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <StepByStepExplanation
        title="Three test levels, one suite"
        description="How the pyramid allocates effort — and what each level is for."
        steps={testLevelSteps}
      />

      {/* Optional: CodeComparison (unit vs component test) */}
      <CodeComparison
        title="Same behavior, three test levels"
        description="A login flow tested at unit level and at component level — same behavior, different cost."
        oldCode={{
          title: "Unit (Vitest)",
          code: comparisonUnitCode,
          language: "typescript",
        }}
        newCode={{
          title: "Component (Vitest + Testing Library)",
          code: comparisonComponentCode,
          language: "typescript",
        }}
      />

      {/* Optional: TerminalPlayground (Vitest + Playwright) */}
      <TerminalPlayground
        title="Vitest + Playwright run"
        description="What a green CI looks like — unit suite finishes in under a second, E2E takes a dozen."
        lines={terminalLines}
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 4: Playground                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <HTMLPlayground
        html={playgroundHtml}
        css={playgroundCss}
        js={playgroundJs}
        title="The test pyramid — click each tier"
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 5: Challenges                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Challenge
        question="You have a regex that strips trailing whitespace from a string. Where does it belong?"
        options={[
          {
            id: "a",
            text: "A unit test — pure function, deterministic input/output.",
          },
          {
            id: "b",
            text: "A component test — render it against a <textarea> and assert.",
          },
          {
            id: "c",
            text: "An E2E test — verify it works on a deployed page.",
          },
          {
            id: "d",
            text: "All three — you can never be too safe.",
          },
        ]}
        correctAnswerId="a"
        explanation={
          <>
            Pure functions are ideal unit-test targets — fast, deterministic, isolated. Component
            (b) and E2E (c) tests would also exercise the regex but at much higher cost and with
            much slower feedback. Testing the same thing at three levels (d) is the duplication that
            turns a fast suite into a slow one.
          </>
        }
      />

      <Challenge
        question="Your Playwright test fails intermittently with 'expected element to be visible'. Adding await page.waitForTimeout(2000) makes it pass. What is the best fix?"
        options={[
          {
            id: "a",
            text: "Keep the timeout — it works.",
          },
          {
            id: "b",
            text: "Replace with await expect(locator).toBeVisible({ timeout: 5000 }) — Playwright auto-waits and retries until the assertion passes or the timeout fires.",
          },
          {
            id: "c",
            text: "Run the test fewer times so it fails less often.",
          },
          {
            id: "d",
            text: "Disable the test until someone investigates.",
          },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            Playwright assertions auto-retry until the condition is met or the timeout fires —
            that&apos;s exactly the right pattern for &quot;I&apos;m waiting for the UI to
            settle.&quot; Hard timeouts (a) make every run as slow as the worst case and still
            flake at the edge. Disabling the test (d) hides the real bug.
          </>
        }
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 6: Gotchas                                                    */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <GotchaList
        items={[
          {
            title:
              "Mocking the unit you’re testing means you’re testing the mock — mock at the boundary (network, time), not the unit",
            body: (
              <>
                If your <code>validateCredentials</code> test mocks <code>validateCredentials</code>{" "}
                itself, the test proves nothing. Mock at the edges: replace <code>fetch</code> with
                a fake response, replace <code>Date.now</code> with a pinned timestamp. Leave the
                unit itself real.
              </>
            ),
          },
          {
            title:
              "getByTestId is a code smell unless the user genuinely can’t see the element — prefer role/label/text queries that match what the user perceives",
            body: (
              <>
                <code>data-testid</code> attributes are invisible to users. A test that only works
                via <code>getByTestId</code> will survive any UX change — making it less likely to
                catch regressions that real users notice. Reach for <code>getByRole</code>,{" "}
                <code>getByLabelText</code>, or <code>getByText</code> first.
              </>
            ),
          },
          {
            title:
              "Flaky tests are bugs — find and fix the race condition; never paper over it with sleep",
            body: (
              <>
                A test that fails one in ten runs is not a quirk — it is a race condition waiting to
                bite you in production at 2 AM. Use Playwright&apos;s built-in auto-waiting
                assertions or Vitest&apos;s <code>waitFor</code> to replace every fixed{" "}
                <code>sleep</code>. If the timing is genuinely non-deterministic, control it with a
                fake clock.
              </>
            ),
          },
          {
            title:
              "it.only and describe.only ship to CI more often than anyone admits — add a lint rule and a pre-commit grep to catch them",
            body: (
              <>
                <code>it.only</code> and <code>describe.only</code> make the whole test run
                silently skip every other test. CI turns green, you ship, and you have no idea that
                800 tests are no longer running. Add the <code>vitest/no-only-tests</code> ESLint
                rule and a pre-commit <code>grep -r &quot;\.only&quot;</code> to catch them before
                they land.
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
            The <em>test pyramid</em> says: many fast unit tests, fewer integration tests, fewest
            E2E tests. Each level catches what the level below misses; the shape minimizes the cost
            of confidence.
          </>,
          <>
            <em>Vitest</em> is Vite-native and Jest-compatible — the right tool for unit and
            component tests. Cold starts are 10&times; faster than Jest because the same Vite
            pipeline handles both app and test.
          </>,
          <>
            Test behavior, not implementation. Query by role, label, and visible text. A test that
            survives a full internal rewrite — but fails when visible text changes — has the correct
            sensitivity.
          </>,
          <>
            <em>Playwright</em> auto-waits: replace every <code>waitForTimeout</code> (sleep) with
            an assertion like <code>expect(locator).toBeVisible()</code>. Playwright retries until
            the assertion passes or the timeout fires.
          </>,
          <>
            Flaky tests are bugs. A test that fails one in ten runs destroys trust in the whole
            suite. Find the race condition, fix it with auto-waiting assertions or a deterministic
            clock, and never paper over it with <code>sleep</code>.
          </>,
          <>
            <code>it.only</code> silently skips every other test in CI. Add a lint rule and a
            pre-commit grep so it never lands on <code>main</code>.
          </>,
        ]}
        mentalModel="Test the behavior, not the implementation. Many cheap unit tests, fewer integration tests, fewest E2E tests. Flaky tests are bugs."
      />
    </div>
  );
}
