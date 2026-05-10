import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";

export default function CommentList({ postId }: { postId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => api.listComments(postId),
  });

  if (isLoading) return <p className="muted-block">Loading comments…</p>;
  if (error) return <p className="muted-block">Could not load comments.</p>;
  if (!data || data.length === 0) return <p className="muted-block">No comments yet. Be the first.</p>;

  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {data.map((c) => (
        <li key={c.id} style={{ borderTop: "1px solid var(--border)", padding: "1rem 0" }}>
          <strong>{c.authorName}</strong>
          <span className="meta"> — {c.createdAt.slice(0, 10)}</span>
          <p>{c.body}</p>
        </li>
      ))}
    </ul>
  );
}
