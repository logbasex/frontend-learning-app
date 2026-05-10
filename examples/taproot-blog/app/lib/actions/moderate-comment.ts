"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function setCommentApproval(id: string, approved: boolean) {
  const session = await auth();
  if (!session?.user) return { ok: false as const, error: "Not signed in" };
  await prisma.comment.update({ where: { id }, data: { approved } });
  revalidatePath("/admin/comments");
  return { ok: true as const };
}

export async function deleteComment(id: string) {
  const session = await auth();
  if (!session?.user) return { ok: false as const, error: "Not signed in" };
  await prisma.comment.delete({ where: { id } });
  revalidatePath("/admin/comments");
  return { ok: true as const };
}
