export interface Author { id: string; name: string; email: string; bio: string; }
export interface Post {
  id: string; slug: string; title: string; excerpt: string; body: string;
  authorId: string; author: Author; tags: string[];
  publishedAt: string; readMinutes: number; coverUrl: string;
}
export interface Comment {
  id: string; postId: string; authorName: string; body: string; createdAt: string;
}
