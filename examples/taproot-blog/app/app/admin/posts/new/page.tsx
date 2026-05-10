"use client";

import PostForm from "@/components/PostForm";
import { createPost } from "@/lib/actions/create-post";

export default function NewPostPage() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">New post</h1>
      <PostForm onSubmit={createPost} submitLabel="Create" />
    </>
  );
}
