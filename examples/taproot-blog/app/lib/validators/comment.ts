import { z } from "zod";

export const commentSchema = z.object({
  postId: z.string().min(1),
  authorName: z.string().min(1).max(80),
  body: z.string().min(1).max(2000),
});

export type CommentInput = z.infer<typeof commentSchema>;
