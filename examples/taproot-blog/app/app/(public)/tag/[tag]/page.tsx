import { prisma } from "@/lib/db";
import PostCard from "@/components/PostCard";

interface Params { params: Promise<{ tag: string }>; }

export default async function TagPage({ params }: Params) {
  const { tag } = await params;
  const posts = await prisma.post.findMany({
    where: { draft: false, tags: { some: { tag: { name: tag } } } },
    include: { author: true, tags: { include: { tag: true } } },
    orderBy: { publishedAt: "desc" },
  });
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Posts tagged <em>{tag}</em></h1>
      {posts.length === 0 ? <p className="text-[var(--muted)]">No posts.</p> : posts.map((p) => <PostCard key={p.id} post={p} />)}
    </>
  );
}
