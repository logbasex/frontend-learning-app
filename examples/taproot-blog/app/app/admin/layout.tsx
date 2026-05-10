import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <>
      <header className="max-w-3xl mx-auto px-6 py-4 flex justify-between items-center border-b border-[var(--border)]">
        <Link href="/admin" className="font-bold">Taproot Admin</Link>
        <nav className="text-sm flex gap-4 items-center">
          <Link href="/admin">Posts</Link>
          <Link href="/admin/comments">Comments</Link>
          <Link href="/" className="text-[var(--muted)]">View site</Link>
          <form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}>
            <button type="submit" className="text-[var(--muted)] hover:text-[var(--accent)]">Sign out</button>
          </form>
        </nav>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-6">{children}</main>
    </>
  );
}
