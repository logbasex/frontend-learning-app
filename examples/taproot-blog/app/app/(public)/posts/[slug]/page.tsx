import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import PostBody from "@/components/PostBody";
import AuthorCard from "@/components/AuthorCard";
import type { Metadata } from "next";

interface Params { params: Promise<{ slug: string }>; }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, images: [post.coverUrl] },
  };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug, draft: false },
    include: { author: true, tags: { include: { tag: true } } },
  });
  if (!post) notFound();

  return (
    <article>
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <p className="text-sm text-[var(--muted)] mt-2 mb-6">
        By {post.author.name} — {post.publishedAt?.toISOString().slice(0, 10)} — {post.readMinutes} min read
      </p>
      <PostBody source={post.body} />
      <AuthorCard author={post.author} />
      {/* Comments island wired in Task 9 */}
    </article>
  );
}
