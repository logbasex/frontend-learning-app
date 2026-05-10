import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CodeBlock } from "@/components/CodeBlock";

describe("CodeBlock", () => {
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
    Object.assign(navigator, { clipboard: { writeText } });

    const user = userEvent.setup();
    render(
      <CodeBlock code={`  const x = 1;\n`} language="javascript" />
    );
    await user.click(screen.getByRole("button", { name: /copy code/i }));

    expect(writeText).toHaveBeenCalledWith(`  const x = 1;\n`);
  });

  it("toggles the button label to 'Copied' after a successful copy", async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });

    const user = userEvent.setup();
    render(<CodeBlock code={`const x = 1;`} language="javascript" />);
    await user.click(screen.getByRole("button", { name: /copy code/i }));

    expect(
      await screen.findByRole("button", { name: /copied/i })
    ).toBeInTheDocument();
  });
});
