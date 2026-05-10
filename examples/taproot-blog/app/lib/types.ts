import type { Post, User, Tag, Comment } from "@prisma/client";

export type PostWithAuthor = Post & {
  author: User;
  tags: { tag: Tag }[];
};

export type PostWithComments = PostWithAuthor & {
  comments: Comment[];
};
