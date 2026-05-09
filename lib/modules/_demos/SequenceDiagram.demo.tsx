"use client";

import { SequenceDiagram } from "@/components/SequenceDiagram";

export function SequenceDiagramDemo() {
  return (
    <SequenceDiagram
      title="DNS resolution"
      description="From browser to authoritative nameserver and back"
      actors={["Browser", "Resolver", "Root", "TLD", "Authoritative"]}
      messages={[
        { from: "Browser", to: "Resolver", label: "query roadmap.sh" },
        { from: "Resolver", to: "Root", label: "ask .sh nameservers?" },
        { from: "Root", to: "Resolver", label: "see ns1.nic.sh" },
        { from: "Resolver", to: "TLD", label: "ask roadmap.sh nameservers?" },
        { from: "TLD", to: "Resolver", label: "see ns1.dnsimple.com" },
        { from: "Resolver", to: "Authoritative", label: "A record for roadmap.sh?" },
        { from: "Authoritative", to: "Resolver", label: "76.76.21.21" },
        { from: "Resolver", to: "Browser", label: "76.76.21.21", note: "cached for TTL seconds" },
      ]}
    />
  );
}
