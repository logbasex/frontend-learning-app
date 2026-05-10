import { prisma } from "@/lib/db";

export default async function CommentList({ postId }: { postId: string }) {
  const comments = await prisma.comment.findMany({
    where: { postId, approved: true },
    orderBy: { createdAt: "asc" },
  });

  if (comments.length === 0) return <p className="text-[var(--muted)] mt-4">No comments yet. Be the first.</p>;

  return (
    <ul className="mt-4 space-y-4">
      {comments.map((c) => (
        <li key={c.id} className="border-t border-[var(--border)] pt-4">
          <p className="font-semibold">{c.authorName}<span className="text-sm text-[var(--muted)] font-normal"> — {c.createdAt.toISOString().slice(0, 10)}</span></p>
          <p className="mt-1">{c.body}</p>
        </li>
      ))}
    </ul>
  );
}
