import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import PostBody from "../components/PostBody";
import CommentList from "../components/CommentList";
import CommentForm from "../components/CommentForm";

export default function Post() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, error } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => api.getPost(slug!),
    enabled: !!slug,
  });
  if (isLoading) return <p className="muted-block">Loading…</p>;
  if (error || !data) return <p className="muted-block">Post not found.</p>;

  return (
    <article className="post-detail">
      <div className="cover"><img src={data.coverUrl} alt="" /></div>
      <h1>{data.title}</h1>
      <p className="meta">By {data.author.name} — {data.publishedAt.slice(0, 10)} — {data.readMinutes} min read</p>
      <PostBody body={data.body} />
      <h2 style={{ marginTop: "3rem" }}>Comments</h2>
      <CommentList postId={data.id} />
      <CommentForm postId={data.id} />
    </article>
  );
}
