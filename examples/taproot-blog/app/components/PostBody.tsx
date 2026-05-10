import { renderMarkdown } from "@/lib/markdown";

// renderMarkdown runs the source through remark → remark-rehype → rehype-sanitize
// → rehype-stringify, so the resulting HTML has no <script> tags or other unsafe
// nodes. dangerouslySetInnerHTML is safe here because the input has been stripped
// to a known-good subset before this component sees it.
export default async function PostBody({ source }: { source: string }) {
  const html = await renderMarkdown(source);
  return <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />;
}
