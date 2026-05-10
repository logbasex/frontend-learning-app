import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export default async function AdminHome() {
  const session = await auth();
  if (!session?.user?.email) return null;
  const author = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!author) return <p>Author not found.</p>;

  const posts = await prisma.post.findMany({
    where: { authorId: author.id },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your posts</h1>
        <Link href="/admin/posts/new" className="bg-[var(--accent)] text-white px-3 py-2 rounded">New post</Link>
      </div>
      <ul className="divide-y divide-[var(--border)]">
        {posts.map((p) => (
          <li key={p.id} className="py-3 flex justify-between items-center">
            <div>
              <Link href={`/admin/posts/${p.id}/edit`} className="font-semibold hover:underline">{p.title}</Link>
              <p className="text-xs text-[var(--muted)]">{p.draft ? "Draft" : `Published ${p.publishedAt?.toISOString().slice(0, 10)}`}</p>
            </div>
            <Link href={`/posts/${p.slug}`} className="text-sm text-[var(--muted)] hover:text-[var(--accent)]">View</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
