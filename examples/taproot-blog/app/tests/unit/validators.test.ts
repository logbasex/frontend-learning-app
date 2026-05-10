import { describe, it, expect } from "vitest";
import { commentSchema } from "@/lib/validators/comment";
import { postSchema } from "@/lib/validators/post";

describe("commentSchema", () => {
  it("accepts a valid comment", () => {
    expect(commentSchema.safeParse({ postId: "p1", authorName: "Alice", body: "Nice post." }).success).toBe(true);
  });
  it("rejects empty body", () => {
    expect(commentSchema.safeParse({ postId: "p1", authorName: "Alice", body: "" }).success).toBe(false);
  });
  it("rejects oversize body", () => {
    expect(commentSchema.safeParse({ postId: "p1", authorName: "Alice", body: "x".repeat(2001) }).success).toBe(false);
  });
});

describe("postSchema", () => {
  it("rejects a slug with uppercase", () => {
    const result = postSchema.safeParse({
      title: "A title",
      slug: "Has-Caps",
      excerpt: "More than ten characters.",
      body: "Body must be at least twenty characters long.",
      coverUrl: "/cover-1.svg",
      readMinutes: 4,
      tag: "css",
      publish: true,
    });
    expect(result.success).toBe(false);
  });
});
