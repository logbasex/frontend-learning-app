import Link from "next/link";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="max-w-2xl mx-auto px-6 py-6 flex justify-between items-center border-b border-[var(--border)]">
        <Link href="/" className="font-bold text-xl">Taproot</Link>
        <nav className="text-sm">
          <Link href="/about" className="text-[var(--muted)] hover:text-[var(--accent)] mr-3">About</Link>
          <Link href="/login" className="text-[var(--muted)] hover:text-[var(--accent)]">Sign in</Link>
        </nav>
      </header>
      <main className="max-w-2xl mx-auto px-6 py-8">{children}</main>
      <footer className="max-w-2xl mx-auto px-6 py-6 border-t border-[var(--border)] text-sm text-[var(--muted)]">
        Taproot — a small blog by Alice and Bob.
      </footer>
    </>
  );
}
