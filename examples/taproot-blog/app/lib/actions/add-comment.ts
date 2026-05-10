"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { commentSchema } from "@/lib/validators/comment";

export async function addComment(input: unknown) {
  const parsed = commentSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Invalid input" };
  const { postId, authorName, body } = parsed.data;

  // Confirm the post exists and is published before accepting a comment.
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { slug: true, draft: true },
  });
  if (!post || post.draft) return { ok: false as const, error: "Post not found" };

  // New comments enter the moderation queue (approved: false by schema default).
  // The admin moderation page surfaces them for an author to approve, unapprove, or delete.
  const comment = await prisma.comment.create({
    data: { postId, authorName, body },
  });

  revalidatePath(`/posts/${post.slug}`);

  return { ok: true as const, comment };
}
