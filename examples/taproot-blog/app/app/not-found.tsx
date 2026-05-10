import Link from "next/link";

export default function NotFound() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold">Not found</h1>
      <p className="mt-2">That post does not exist. Try the <Link href="/" className="underline">home page</Link>.</p>
    </main>
  );
}
