import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { setCommentApproval, deleteComment } from "@/lib/actions/moderate-comment";

export default async function ModerationPage() {
  const session = await auth();
  if (!session?.user) return null;

  const comments = await prisma.comment.findMany({
    orderBy: { createdAt: "desc" },
    include: { post: { select: { slug: true, title: true } } },
  });

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Comment moderation</h1>
      <ul className="divide-y divide-[var(--border)]">
        {comments.map((c) => (
          <li key={c.id} className="py-3">
            <p className="text-xs text-[var(--muted)]">on <strong>{c.post.title}</strong> — {c.createdAt.toISOString().slice(0, 16)} — {c.approved ? "approved" : "pending"}</p>
            <p className="font-semibold mt-1">{c.authorName}</p>
            <p>{c.body}</p>
            <div className="mt-2 flex gap-2">
              <form action={async () => { "use server"; await setCommentApproval(c.id, !c.approved); }}>
                <button className="text-sm border border-[var(--border)] rounded px-2 py-1">{c.approved ? "Unapprove" : "Approve"}</button>
              </form>
              <form action={async () => { "use server"; await deleteComment(c.id); }}>
                <button className="text-sm border border-red-300 text-red-700 rounded px-2 py-1">Delete</button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
