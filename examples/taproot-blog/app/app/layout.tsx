import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Taproot", template: "%s — Taproot" },
  description: "A small blog about the web by Alice and Bob.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
