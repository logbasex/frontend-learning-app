"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { postSchema } from "@/lib/validators/post";

export async function updatePost(id: string, input: unknown) {
  const session = await auth();
  if (!session?.user?.email) return { ok: false as const, error: "Not signed in" };
  const author = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!author) return { ok: false as const, error: "Author not found" };

  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing || existing.authorId !== author.id) return { ok: false as const, error: "Not your post" };

  const parsed = postSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: parsed.error.errors[0]?.message ?? "Invalid input" };

  await prisma.post.update({
    where: { id },
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      excerpt: parsed.data.excerpt,
      body: parsed.data.body,
      coverUrl: parsed.data.coverUrl,
      readMinutes: parsed.data.readMinutes,
      draft: !parsed.data.publish,
      publishedAt: parsed.data.publish ? existing.publishedAt ?? new Date() : null,
    },
  });

  revalidatePath("/");
  revalidatePath(`/posts/${parsed.data.slug}`);
  revalidatePath("/admin");
  redirect("/admin");
}
