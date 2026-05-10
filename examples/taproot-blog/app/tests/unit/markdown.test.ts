import { describe, it, expect } from "vitest";
import { renderMarkdown } from "@/lib/markdown";

describe("renderMarkdown", () => {
  it("renders a paragraph", async () => {
    const html = await renderMarkdown("Hello, world.");
    expect(html.trim()).toContain("<p>Hello, world.</p>");
  });

  it("renders headings", async () => {
    const html = await renderMarkdown("# Heading\n\nBody");
    expect(html).toContain("<h1>Heading</h1>");
  });

  it("renders inline code", async () => {
    const html = await renderMarkdown("Use `useEffect` carefully.");
    expect(html).toContain("<code>useEffect</code>");
  });

  it("strips dangerous HTML", async () => {
    const html = await renderMarkdown("Hi <script>alert(1)</script> there.");
    expect(html).not.toContain("<script");
  });
});
