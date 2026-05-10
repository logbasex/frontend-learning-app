import type { User } from "@prisma/client";

export default function AuthorCard({ author }: { author: User }) {
  return (
    <aside className="border border-[var(--border)] rounded-lg p-4 mt-8">
      <p className="font-semibold">{author.name}</p>
      {author.bio && <p className="text-sm text-[var(--muted)] mt-1">{author.bio}</p>}
    </aside>
  );
}
