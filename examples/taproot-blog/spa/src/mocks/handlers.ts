import { http, HttpResponse } from "msw";
import { posts, initialComments } from "./seed";
import type { Comment } from "../api/types";

const comments: Comment[] = [...initialComments];

export const handlers = [
  http.get("/api/posts", ({ request }) => {
    const url = new URL(request.url);
    const tag = url.searchParams.get("tag");
    const out = tag ? posts.filter((p) => p.tags.includes(tag)) : posts;
    return HttpResponse.json(out);
  }),
  http.get("/api/posts/:slug", ({ params }) => {
    const post = posts.find((p) => p.slug === params.slug);
    if (!post) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(post);
  }),
  http.get("/api/posts/:postId/comments", ({ params }) =>
    HttpResponse.json(comments.filter((c) => c.postId === params.postId))
  ),
  http.post<{ postId: string }, { authorName: string; body: string }>(
    "/api/posts/:postId/comments",
    async ({ params, request }) => {
      const data = await request.json();
      const newComment: Comment = {
        id: `c${comments.length + 1}`,
        postId: params.postId,
        authorName: data.authorName,
        body: data.body,
        createdAt: new Date().toISOString(),
      };
      comments.push(newComment);
      await new Promise((r) => setTimeout(r, 250));
      return HttpResponse.json(newComment);
    }
  ),
];
