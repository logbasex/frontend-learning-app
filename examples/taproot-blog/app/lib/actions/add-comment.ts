"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { commentSchema } from "@/lib/validators/comment";

export async function addComment(input: unknown) {
  const parsed = commentSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Invalid input" };
  const { postId, authorName, body } = parsed.data;

  const comment = await prisma.comment.create({
    data: { postId, authorName, body, approved: true },
  });

  const post = await prisma.post.findUnique({ where: { id: postId }, select: { slug: true } });
  if (post) revalidatePath(`/posts/${post.slug}`);

  return { ok: true as const, comment };
}
