"use client";

import { GotchaList } from "@/components/GotchaList";

export function GotchaListDemo() {
  return (
    <GotchaList
      items={[
        {
          title: "DNS caches are layered",
          body: <>Your browser, OS, router, and ISP each cache DNS responses. A &quot;wrong&quot; result can be cached for the full TTL at any layer — flush them in order.</>,
        },
        {
          title: "TCP handshake costs an RTT before any data flows",
          body: <>Connection reuse (HTTP keep-alive, HTTP/2 multiplexing) exists because that one round-trip per request adds up.</>,
        },
        {
          title: "TLS doesn&apos;t skip TCP",
          body: <>TLS sits on top of TCP. The handshake order is always TCP first, then TLS, then HTTP.</>,
        },
      ]}
    />
  );
}
