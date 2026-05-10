import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import EditClient from "./edit-client";

interface Params { params: Promise<{ id: string }> }

export default async function EditPostPage({ params }: Params) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.email) notFound();
  const author = await prisma.user.findUnique({ where: { email: session.user.email } });
  const post = await prisma.post.findUnique({
    where: { id },
    include: { tags: { include: { tag: true } } },
  });
  if (!post || !author || post.authorId !== author.id) notFound();

  return <EditClient id={post.id} defaults={{
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    body: post.body,
    coverUrl: post.coverUrl,
    readMinutes: post.readMinutes,
    tag: post.tags[0]?.tag.name ?? "",
    publish: !post.draft,
  }} />;
}
