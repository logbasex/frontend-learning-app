import { Link } from "react-router";
import type { Post } from "../api/types";

export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="post-card">
      <Link to={`/posts/${post.slug}`}>
        <div className="cover"><img src={post.coverUrl} alt={`Cover for ${post.title}`} /></div>
      </Link>
      <h2><Link to={`/posts/${post.slug}`}>{post.title}</Link></h2>
      <p className="meta">By {post.author.name} — {post.publishedAt.slice(0, 10)} — {post.readMinutes} min read</p>
      <p className="excerpt">{post.excerpt}</p>
      <div className="tags">
        {post.tags.map((t) => <Link key={t} className="tag" to={`/tag/${t}`}>{t}</Link>)}
      </div>
    </article>
  );
}
