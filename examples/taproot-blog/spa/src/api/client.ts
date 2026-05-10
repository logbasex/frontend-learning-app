import type { Post, Comment } from "./types";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

export const api = {
  listPosts: () => get<Post[]>("/api/posts"),
  getPost: (slug: string) => get<Post>(`/api/posts/${slug}`),
  postsByTag: (tag: string) => get<Post[]>(`/api/posts?tag=${encodeURIComponent(tag)}`),
  listComments: (postId: string) => get<Comment[]>(`/api/posts/${postId}/comments`),
  addComment: (postId: string, body: { authorName: string; body: string }) =>
    post<Comment>(`/api/posts/${postId}/comments`, body),
};
