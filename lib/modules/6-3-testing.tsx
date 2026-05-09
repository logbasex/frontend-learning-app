"use client";

import { ScaffoldModule } from "./_template";
import { CodeBlock } from "@/components/CodeBlock";

const testingCode = `// three-levels.test.ts
// Demonstrates the same login behavior tested at three levels of the pyramid.

// ─────────────────────────────────────────────
// LEVEL 1 — Unit test (Vitest, no DOM, <1 ms)
//   Scope: a single pure function
// ─────────────────────────────────────────────
import { describe, it, expect } from "vitest";

function validateEmail(email: string): boolean {
  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
}

describe("validateEmail (unit)", () => {
  it("accepts a valid address", () => {
    expect(validateEmail("user@example.com")).toBe(true);
  });
  it("rejects missing @", () => {
    expect(validateEmail("userexample.com")).toBe(false);
  });
});

// ─────────────────────────────────────────────
// LEVEL 2 — Component / integration test
//   Scope: <LoginForm> renders, user types, form submits
//   Tools: Vitest + @testing-library/react (jsdom)
// ─────────────────────────────────────────────
import { render, screen, fireEvent } from "@testing-library/react";
import { LoginForm } from "./LoginForm"; // the real component

describe("LoginForm (integration)", () => {
  it("calls onSubmit with email and password when form is valid", async () => {
    const onSubmit = vi.fn();
    render(<LoginForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "secret" },
    });
    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "secret",
    });
  });
});

// ─────────────────────────────────────────────
// LEVEL 3 — E2E test (Playwright, real browser)
//   Scope: full user journey, real HTTP, real redirect
// ─────────────────────────────────────────────
import { test } from "@playwright/test";

test("user can log in and reaches dashboard", async ({ page }) => {
  await page.goto("http://localhost:3000/login");

  await page.getByLabel("Email").fill("user@example.com");
  await page.getByLabel("Password").fill("correct-password");
  await page.getByRole("button", { name: "Log in" }).click();

  // Assert the user landed on the dashboard
  await page.waitForURL("**/dashboard");
});`;

export function Module_6_3_Content() {
  return (
    <ScaffoldModule
      emoji="🧪"
      problemTitle="The pyramid: many cheap, few expensive"
      problem={
        <>
          <p>
            <strong>Unit tests</strong> run in milliseconds, have narrow scope
            (one pure function or one tiny module), and give pinpoint feedback
            when they fail. Write many of them. They are the cheapest form of
            confidence you can buy and the fastest to run in CI. The trade-off
            is that they don&apos;t prove the pieces work <em>together</em>.
          </p>
          <p>
            <strong>Integration tests</strong> check several units working
            together — a React component plus its data hook, or an API handler
            plus its database query. They are slower and occasionally flaky,
            but they catch the &quot;each unit works alone but together they
            break&quot; class of bug that unit tests miss. Write fewer of them,
            focused on the seams between modules.{" "}
            <strong>E2E tests</strong> drive a real browser (Playwright,
            Cypress) against a running server. They are the slowest and most
            brittle, but they are the only tests that prove the real user
            journey works end-to-end.
          </p>
          <p>
            The most important principle across all three levels: test{" "}
            <strong>behavior, not implementation</strong>. A test that asserts
            on a private function name or internal state will break every time
            you refactor, even if the user-observable behavior is unchanged.
            That is a false negative — it wastes time and erodes trust in the
            test suite. Write tests that would still pass after a complete
            internal rewrite, as long as the observable output is the same.
          </p>
        </>
      }
      body={
        <CodeBlock
          language="typescript"
          fileName="three-levels.test.ts"
          code={testingCode}
        />
      }
      challenge={{
        question: "Why is it better to test behavior rather than implementation?",
        options: [
          {
            id: "a",
            text: "Behavior tests run faster because they skip internal function calls.",
          },
          {
            id: "b",
            text: "Behavior tests survive refactors — when you rewrite the internals, the test still passes if the user-observable result is unchanged.",
          },
          {
            id: "c",
            text: "Implementation tests are not supported by modern testing frameworks.",
          },
          {
            id: "d",
            text: "Behavior tests require no mocking, which makes them simpler to write.",
          },
        ],
        correctAnswerId: "b",
        explanation: (
          <>
            Implementation tests couple your test to the internal structure of
            the code. When you rename a private method, extract a helper, or
            change a state shape without altering the public behavior, those
            tests fail — even though nothing broke for the user. This is a
            false negative that slows development and makes the suite feel
            untrustworthy. Behavior tests stay green through refactors,
            making them a safety net rather than a maintenance burden.
          </>
        ),
      }}
      takeaways={[
        <>
          Test pyramid: many cheap unit tests, fewer integration tests, very
          few slow E2E tests. Balance shifts with risk — critical user paths
          deserve E2E coverage.
        </>,
        <>
          Test behavior, not implementation. Ask: &quot;would this test still pass
          if I rewrote the internals?&quot; If no, the test is too coupled.
        </>,
        <>
          Flaky tests are bugs in the test suite, not acceptable noise. A
          test that sometimes fails for no reason destroys trust in the whole
          suite — fix or delete it.
        </>,
      ]}
      mentalModel="Test pyramid: many cheap, few expensive. Test behavior, not implementation. Flaky tests are bugs, not 'just retry'."
      roadmapUrl="https://roadmap.sh/frontend"
    />
  );
}
