"use client";

import { useOptimistic, useTransition, useState } from "react";
import { addComment } from "@/lib/actions/add-comment";

interface OptimisticComment {
  id: string;
  authorName: string;
  body: string;
}

export default function CommentForm({ postId }: { postId: string }) {
  const [authorName, setAuthorName] = useState("");
  const [body, setBody] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [optimistic, addOptimistic] = useOptimistic<OptimisticComment[], OptimisticComment>(
    [],
    (state, next) => [...state, next]
  );

  return (
    <>
      {optimistic.length > 0 && (
        <ul className="mt-4 space-y-4">
          {optimistic.map((c) => (
            <li key={c.id} className="border-t border-[var(--border)] pt-4 opacity-70">
              <p className="font-semibold">{c.authorName} <span className="text-xs">(posting…)</span></p>
              <p className="mt-1">{c.body}</p>
            </li>
          ))}
        </ul>
      )}
      <form
        action={(formData) => {
          const an = String(formData.get("authorName") ?? "");
          const b = String(formData.get("body") ?? "");
          if (!an.trim() || !b.trim()) return;
          startTransition(async () => {
            addOptimistic({ id: `tmp-${Date.now()}`, authorName: an, body: b });
            const res = await addComment({ postId, authorName: an, body: b });
            if (!res.ok) { setErrorMsg(res.error); return; }
            setAuthorName("");
            setBody("");
            setErrorMsg(null);
          });
        }}
        className="mt-6 grid gap-2 max-w-md"
      >
        <label className="grid gap-1">
          <span className="text-sm">Name</span>
          <input name="authorName" required value={authorName} onChange={(e) => setAuthorName(e.target.value)} className="border border-[var(--border)] rounded p-2" />
        </label>
        <label className="grid gap-1">
          <span className="text-sm">Comment</span>
          <textarea name="body" required rows={4} value={body} onChange={(e) => setBody(e.target.value)} className="border border-[var(--border)] rounded p-2" />
        </label>
        <button type="submit" disabled={isPending} className="bg-[var(--accent)] text-white px-3 py-2 rounded disabled:opacity-50">
          {isPending ? "Posting…" : "Post comment"}
        </button>
        {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}
      </form>
    </>
  );
}
