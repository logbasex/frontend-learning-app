import { z } from "zod";

export const postSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z.string().min(3).max(120).regex(/^[a-z0-9-]+$/, "lowercase letters, numbers, and dashes only"),
  excerpt: z.string().min(10).max(280),
  body: z.string().min(20),
  coverUrl: z.string().url().or(z.string().startsWith("/")),
  readMinutes: z.coerce.number().int().min(1).max(60),
  tag: z.string().min(1).max(40),
  publish: z.coerce.boolean(),
});

export type PostInput = z.infer<typeof postSchema>;
