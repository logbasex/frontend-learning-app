"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition, useState } from "react";
import { postSchema, type PostInput } from "@/lib/validators/post";

interface Props {
  defaultValues?: Partial<PostInput>;
  onSubmit: (input: PostInput) => Promise<{ ok: false; error: string } | void>;
  submitLabel: string;
}

export default function PostForm({ defaultValues, onSubmit, submitLabel }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<PostInput>({
    resolver: zodResolver(postSchema),
    defaultValues: defaultValues ?? { publish: false, readMinutes: 5, tag: "" },
  });
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  return (
    <form
      onSubmit={handleSubmit((data) => {
        startTransition(async () => {
          const result = await onSubmit(data);
          if (result && "ok" in result && !result.ok) setServerError(result.error);
        });
      })}
      className="grid gap-4"
    >
      <Field label="Title" error={errors.title?.message}><input {...register("title")} className="border border-[var(--border)] rounded p-2 w-full" /></Field>
      <Field label="Slug" error={errors.slug?.message}><input {...register("slug")} className="border border-[var(--border)] rounded p-2 w-full" /></Field>
      <Field label="Excerpt" error={errors.excerpt?.message}><textarea {...register("excerpt")} rows={2} className="border border-[var(--border)] rounded p-2 w-full" /></Field>
      <Field label="Body (Markdown)" error={errors.body?.message}><textarea {...register("body")} rows={12} className="border border-[var(--border)] rounded p-2 w-full font-mono text-sm" /></Field>
      <Field label="Cover URL or path" error={errors.coverUrl?.message}><input {...register("coverUrl")} className="border border-[var(--border)] rounded p-2 w-full" /></Field>
      <Field label="Read minutes" error={errors.readMinutes?.message}><input type="number" {...register("readMinutes")} className="border border-[var(--border)] rounded p-2 w-full" /></Field>
      <Field label="Tag" error={errors.tag?.message}><input {...register("tag")} className="border border-[var(--border)] rounded p-2 w-full" /></Field>
      <label className="flex items-center gap-2"><input type="checkbox" {...register("publish")} /> Publish</label>
      <button type="submit" disabled={isPending} className="bg-[var(--accent)] text-white px-3 py-2 rounded disabled:opacity-50">
        {isPending ? "Saving…" : submitLabel}
      </button>
      {serverError && <p className="text-red-600 text-sm">{serverError}</p>}
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1">
      <span className="text-sm font-semibold">{label}</span>
      {children}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </label>
  );
}
