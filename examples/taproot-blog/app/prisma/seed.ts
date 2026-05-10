import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("taproot-dev", 10);

  const alice = await prisma.user.upsert({
    where: { email: "alice@taproot.local" },
    update: {},
    create: { name: "Alice", email: "alice@taproot.local", passwordHash, bio: "Frontend platform." },
  });
  const bob = await prisma.user.upsert({
    where: { email: "bob@taproot.local" },
    update: {},
    create: { name: "Bob", email: "bob@taproot.local", passwordHash, bio: "CSS and design tokens." },
  });

  const tagDefs = ["meta", "css", "react"];
  const tags = await Promise.all(
    tagDefs.map((name) => prisma.tag.upsert({ where: { name }, update: {}, create: { name } }))
  );
  const tagBy = (name: string) => tags.find((t) => t.name === name)!;

  const seedPosts = [
    { slug: "hello-world", title: "Hello, world", excerpt: "Why we started this blog.", body: "This is the first post on Taproot. We started this blog because we wanted a place to write about the web that is not a thread on a social network.\n\nPosts here will be short, opinionated, and concrete.", coverUrl: "/cover-1.svg", readMinutes: 4, authorId: alice.id, tag: "meta", publishedAt: new Date("2026-04-01") },
    { slug: "the-cascade", title: "The cascade is the only CSS thing that matters", excerpt: "Origin, specificity, source order.", body: "If you understand origin, specificity, and source order, you understand CSS.\n\nOrigin: where did the rule come from (browser default, user, author).\n\nSpecificity: a four-tuple — inline, ID, class/attribute/pseudo-class, type/pseudo-element.\n\nSource order: later wins on ties.", coverUrl: "/cover-2.svg", readMinutes: 6, authorId: bob.id, tag: "css", publishedAt: new Date("2026-04-15") },
    { slug: "why-rsc", title: "Why server components, in 500 words", excerpt: "RSC is not magic.", body: "Some of your component tree runs on the server and never ships JavaScript. The cost: an extra hop. The benefit: zero client-side JS for that subtree.", coverUrl: "/cover-3.svg", readMinutes: 5, authorId: alice.id, tag: "react", publishedAt: new Date("2026-05-02") },
  ];

  for (const p of seedPosts) {
    await prisma.post.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug, title: p.title, excerpt: p.excerpt, body: p.body, coverUrl: p.coverUrl,
        readMinutes: p.readMinutes, authorId: p.authorId, publishedAt: p.publishedAt, draft: false,
        tags: { create: [{ tagId: tagBy(p.tag).id }] },
      },
    });
  }

  const cascadePost = await prisma.post.findUnique({ where: { slug: "the-cascade" } });
  if (cascadePost) {
    await prisma.comment.upsert({
      where: { id: "seed-c1" },
      update: {},
      create: {
        id: "seed-c1",
        postId: cascadePost.id,
        authorName: "Cara",
        body: "Specificity calculator at specificity.keegan.st saved me an afternoon.",
        approved: true,
      },
    });
  }
}

main().finally(() => prisma.$disconnect());
