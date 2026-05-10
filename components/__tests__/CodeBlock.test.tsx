import { afterEach, describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CodeBlock } from "@/components/CodeBlock";

function mockClipboard(writeText: ReturnType<typeof vi.fn>) {
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText },
    configurable: true,
    writable: true,
  });
}

describe("CodeBlock", () => {
  afterEach(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: undefined,
      configurable: true,
      writable: true,
    });
  });

  it("renders the code text", () => {
    render(<CodeBlock code={`const x = 1;`} language="javascript" />);
    expect(screen.getByText(/const/)).toBeInTheDocument();
  });

  it("renders the language badge when language is provided", () => {
    render(<CodeBlock code={`const x = 1;`} language="javascript" />);
    expect(screen.getByText("javascript")).toBeInTheDocument();
  });

  it("renders a Copy button with an accessible label", () => {
    render(<CodeBlock code={`const x = 1;`} language="javascript" />);
    expect(
      screen.getByRole("button", { name: /copy code/i })
    ).toBeInTheDocument();
  });

  it("copies the raw (untrimmed) code to the clipboard on click", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    mockClipboard(writeText);

    render(<CodeBlock code={`  const x = 1;\n`} language="javascript" />);
    await user.click(screen.getByRole("button", { name: /copy code/i }));

    expect(writeText).toHaveBeenCalledWith(`  const x = 1;\n`);
  });

  it("toggles the button label to 'Copied' after a successful copy", async () => {
    const user = userEvent.setup();
    mockClipboard(vi.fn().mockResolvedValue(undefined));

    render(<CodeBlock code={`const x = 1;`} language="javascript" />);
    await user.click(screen.getByRole("button", { name: /copy code/i }));

    expect(
      await screen.findByRole("button", { name: /copied/i })
    ).toBeInTheDocument();
  });
});
