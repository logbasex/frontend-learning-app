import { prisma } from "@/lib/db";
import PostCard from "@/components/PostCard";

export default async function Home() {
  const posts = await prisma.post.findMany({
    where: { draft: false },
    include: { author: true, tags: { include: { tag: true } } },
    orderBy: { publishedAt: "desc" },
  });
  return (
    <>
      <h1 className="sr-only">Recent posts</h1>
      {posts.map((p) => <PostCard key={p.id} post={p} />)}
    </>
  );
}
