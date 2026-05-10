import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StepByStepExplanation } from "@/components/StepByStepExplanation";

describe("StepByStepExplanation", () => {
  it("renders the title and the first step's title", () => {
    render(
      <StepByStepExplanation
        title="HTTP request lifecycle"
        steps={[
          { title: "Resolve DNS", description: "Find the IP." },
          { title: "Open TCP", description: "Three-way handshake." },
        ]}
      />
    );

    expect(screen.getByText("HTTP request lifecycle")).toBeInTheDocument();
    expect(screen.getByText("Resolve DNS")).toBeInTheDocument();
  });

  it("renders step code through CodeBlock (with copy button) when a step has code", () => {
    render(
      <StepByStepExplanation
        title="HTTP request lifecycle"
        steps={[
          {
            title: "Resolve DNS",
            description: "Find the IP.",
            code: `dig example.com`,
            language: "bash",
          },
        ]}
      />
    );

    expect(
      screen.getByRole("button", { name: /copy code/i })
    ).toBeInTheDocument();
    expect(screen.getByText("bash")).toBeInTheDocument();
  });

  it("does not render a code surface when a step has no code", () => {
    render(
      <StepByStepExplanation
        title="Concept walkthrough"
        steps={[{ title: "Just prose", description: "No code here." }]}
      />
    );

    expect(
      screen.queryByRole("button", { name: /copy code/i })
    ).not.toBeInTheDocument();
  });
});
