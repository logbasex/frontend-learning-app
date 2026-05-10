import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "../api/client";

export default function CommentForm({ postId }: { postId: string }) {
  const qc = useQueryClient();
  const [authorName, setAuthorName] = useState("");
  const [body, setBody] = useState("");

  const m = useMutation({
    mutationFn: () => api.addComment(postId, { authorName, body }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["comments", postId] });
      setBody("");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (authorName.trim() && body.trim()) m.mutate();
      }}
      style={{ display: "grid", gap: ".5rem", marginTop: "1rem" }}
    >
      <label>
        Name<br />
        <input required value={authorName} onChange={(e) => setAuthorName(e.target.value)}
          style={{ width: "100%", padding: ".5rem", border: "1px solid var(--border)", borderRadius: ".25rem" }} />
      </label>
      <label>
        Comment<br />
        <textarea required rows={4} value={body} onChange={(e) => setBody(e.target.value)}
          style={{ width: "100%", padding: ".5rem", border: "1px solid var(--border)", borderRadius: ".25rem" }} />
      </label>
      <button type="submit" disabled={m.isPending}
        style={{ background: "var(--accent)", color: "white", padding: ".5rem 1rem", border: 0, borderRadius: ".25rem", cursor: "pointer" }}>
        {m.isPending ? "Posting…" : "Post comment"}
      </button>
      {m.isError && <p style={{ color: "crimson" }}>Could not post — try again.</p>}
    </form>
  );
}
