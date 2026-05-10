import type { Post, Comment, Author } from "../api/types";

export const authors: Author[] = [
  { id: "a1", name: "Alice", email: "alice@taproot.local", bio: "Frontend platform." },
  { id: "a2", name: "Bob", email: "bob@taproot.local", bio: "CSS and design tokens." },
];

export const posts: Post[] = [
  {
    id: "p1", slug: "hello-world", title: "Hello, world",
    excerpt: "Why we started this blog.",
    body: "This is the first post on Taproot. We started this blog because we wanted a place to write about the web that is not a thread on a social network.\n\nPosts here will be short, opinionated, and concrete.",
    authorId: "a1", author: authors[0], tags: ["meta"],
    publishedAt: "2026-04-01T00:00:00Z", readMinutes: 4, coverUrl: "/cover-1.svg",
  },
  {
    id: "p2", slug: "the-cascade", title: "The cascade is the only CSS thing that matters",
    excerpt: "Origin, specificity, source order. That is the whole game.",
    body: "If you understand origin, specificity, and source order, you understand CSS.\n\nOrigin: where did the rule come from (browser default, user, author).\n\nSpecificity: a four-tuple — inline, ID, class/attribute/pseudo-class, type/pseudo-element.\n\nSource order: later wins on ties.",
    authorId: "a2", author: authors[1], tags: ["css"],
    publishedAt: "2026-04-15T00:00:00Z", readMinutes: 6, coverUrl: "/cover-2.svg",
  },
  {
    id: "p3", slug: "why-rsc", title: "Why server components, in 500 words",
    excerpt: "RSC is not magic. It is a deal.",
    body: "Some of your component tree runs on the server and never ships JavaScript. The cost: an extra hop. The benefit: zero client-side JS for that subtree.\n\nThis matters most for the parts of your UI that read data and render it once.",
    authorId: "a1", author: authors[0], tags: ["react"],
    publishedAt: "2026-05-02T00:00:00Z", readMinutes: 5, coverUrl: "/cover-3.svg",
  },
];

export const initialComments: Comment[] = [
  {
    id: "c1", postId: "p2", authorName: "Cara",
    body: "Specificity calculator at specificity.keegan.st saved me an afternoon last week.",
    createdAt: "2026-04-16T09:00:00Z",
  },
];
