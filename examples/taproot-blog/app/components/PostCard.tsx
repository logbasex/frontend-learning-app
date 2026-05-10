import Link from "next/link";
import Image from "next/image";
import type { PostWithAuthor } from "@/lib/types";

export default function PostCard({ post }: { post: PostWithAuthor }) {
  const tags = post.tags.map((t) => t.tag.name);
  return (
    <article className="border-b border-[var(--border)] py-6">
      <Link href={`/posts/${post.slug}`}>
        <Image
          src={post.coverUrl}
          alt={`Cover for ${post.title}`}
          width={720}
          height={405}
          className="rounded-lg w-full aspect-video object-cover"
        />
      </Link>
      <h2 className="text-xl font-semibold mt-3">
        <Link href={`/posts/${post.slug}`} className="hover:underline">{post.title}</Link>
      </h2>
      <p className="text-sm text-[var(--muted)] mt-1">
        By {post.author.name} — {post.publishedAt?.toISOString().slice(0, 10) ?? "Draft"} — {post.readMinutes} min read
      </p>
      <p className="mt-2">{post.excerpt}</p>
      <div className="mt-3">
        {tags.map((t) => (
          <Link key={t} href={`/tag/${t}`} className="inline-block bg-[var(--border)] px-3 py-0.5 rounded-full text-sm mr-1 hover:bg-[var(--accent)] hover:text-white">
            {t}
          </Link>
        ))}
      </div>
    </article>
  );
}
