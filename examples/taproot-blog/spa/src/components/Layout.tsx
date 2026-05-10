import { Link } from "react-router";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <header>
        <Link to="/" className="brand">Taproot (SPA)</Link>
        <nav><Link to="/about">About</Link></nav>
      </header>
      <main>{children}</main>
      <footer>
        <p>Taproot — a small blog by Alice and Bob. SPA edition. Comments live in browser memory only.</p>
      </footer>
    </>
  );
}
