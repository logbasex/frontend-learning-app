"use client";

import PostForm from "@/components/PostForm";
import { updatePost } from "@/lib/actions/update-post";
import type { PostInput } from "@/lib/validators/post";

export default function EditClient({ id, defaults }: { id: string; defaults: Partial<PostInput> }) {
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Edit post</h1>
      <PostForm defaultValues={defaults} onSubmit={(input) => updatePost(id, input)} submitLabel="Save" />
    </>
  );
}
