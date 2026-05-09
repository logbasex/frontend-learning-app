"use client";

import { Card, CardContent } from "@/components/ui/card";
import { HTMLPlayground } from "@/components/CodePlayground";
import { StepByStepExplanation, Step } from "@/components/StepByStepExplanation";
import { InteractiveDiagram } from "@/components/InteractiveDiagram";
import { Challenge } from "@/components/Challenge";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { RoadmapLink } from "@/components/RoadmapLink";
import type { Node, Edge } from "@xyflow/react";

export function Module_1_1_Content() {
  // ─────────────────────────────────────────────────────────────────────────────
  // Section 2: Step-by-step — "From URL to pixels"
  // ─────────────────────────────────────────────────────────────────────────────
  const historySteps: Step[] = [
    {
      title: "Step 1: You type a URL",
      description:
        "Before you even press Enter, the browser is already at work. It autocompletes from history, " +
        "checks bookmarks, and surfaces suggestions — all from local data, no network request needed yet.\n\n" +
        "Once you press Enter, the browser parses the raw string into distinct components: scheme (the protocol), " +
        "host (the domain), pathname, query-string, and hash fragment. Understanding this structure is essential " +
        "because every subsequent step operates on exactly one of those pieces.",
      code: `# The URL the browser is about to navigate to
https://roadmap.sh/frontend

# Parsed components:
#   scheme:   https
#   host:     roadmap.sh
#   port:     443  (implied by https)
#   path:     /frontend
#   query:    (none)
#   fragment: (none)`,
    },
    {
      title: "Step 2: DNS resolution",
      description:
        "The host 'roadmap.sh' is a human-readable alias; the network speaks in IP addresses. " +
        "The browser first checks its own DNS cache, then the OS resolver cache, before forwarding the query " +
        "to a recursive resolver (your ISP or a public provider like 1.1.1.1 or 8.8.8.8).\n\n" +
        "The resolver walks the DNS tree: root nameservers delegate to the .sh TLD servers, which delegate " +
        "to roadmap.sh's authoritative nameservers, which finally return the A record with the IP address. " +
        "Results are cached at every hop based on their TTL, so most lookups short-circuit early.",
      code: `# dig roadmap.sh +short
76.76.21.21

# Full resolution trace (dig +trace):
.                        518400  IN  NS  a.root-servers.net.
sh.                      172800  IN  NS  ns1.nic.sh.
roadmap.sh.              86400   IN  NS  ns1.dnsimple.com.
roadmap.sh.              60      IN  A   76.76.21.21`,
    },
    {
      title: "Step 3: TCP handshake",
      description:
        "With an IP address in hand, the browser opens a TCP connection to port 443 on that server. " +
        "TCP is connection-oriented: before any data flows, both sides complete a three-way handshake — " +
        "SYN, SYN-ACK, ACK — costing exactly one full round-trip time (RTT).\n\n" +
        "This handshake guarantees that both sides are reachable and that subsequent segments will be " +
        "delivered in order and without loss. This is why physical distance to servers matters so much: " +
        "a CDN edge node 10ms away is far cheaper than a datacenter 150ms away, just for the TCP RTT alone.",
      code: `# Three-way TCP handshake

Client                          Server
  |                               |
  |──── SYN (seq=x) ─────────────►|   "I want to connect"
  |                               |
  |◄─── SYN-ACK (seq=y, ack=x+1)─|   "OK, I am ready"
  |                               |
  |──── ACK (ack=y+1) ───────────►|   "Acknowledged"
  |                               |
  |   <<< connection established >>>  |`,
    },
    {
      title: "Step 4: TLS handshake (HTTPS only)",
      description:
        "On top of the TCP connection, TLS negotiates an encrypted channel before a single HTTP byte is sent. " +
        "The client announces which cipher suites it supports (ClientHello); the server picks one and sends " +
        "its certificate chain (ServerHello + Certificate + CertificateVerify + Finished).\n\n" +
        "In TLS 1.3 the key exchange and cipher negotiation are folded into a single round-trip, so the " +
        "overhead is just one extra RTT on top of TCP. After the handshake, all HTTP traffic is encrypted " +
        "with a symmetric session key that only these two endpoints know — derived via elliptic-curve Diffie-Hellman.",
      code: `# TLS 1.3 handshake — openssl s_client sketch

$ openssl s_client -connect roadmap.sh:443

Protocol  : TLSv1.3
Cipher    : TLS_AES_256_GCM_SHA384
Server Temp Key: X25519, 253 bits

# Certificate chain:
#   0 s:CN = roadmap.sh
#     i:C = US, O = Let's Encrypt, CN = R11
#   1 s:CN = R11
#     i:C = US, O = Internet Security Research Group, CN = ISRG Root X1`,
    },
    {
      title: "Step 5: HTTP request",
      description:
        "With an encrypted TCP connection established, the browser sends an HTTP request. " +
        "The request line names the method (GET, POST, PUT, DELETE...), the path, and the HTTP version. " +
        "Headers carry metadata: the hostname (required in HTTP/1.1), accepted content types, cookies, " +
        "caching tokens (ETag, If-None-Match), and more.\n\n" +
        "HTTP/2 and HTTP/3 use binary framing and request multiplexing to eliminate head-of-line blocking, " +
        "but the semantics — methods, headers, status codes — remain identical to HTTP/1.1.",
      code: `GET /frontend HTTP/1.1
Host: roadmap.sh
Accept: text/html,application/xhtml+xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Connection: keep-alive
If-None-Match: "abc123"
Cache-Control: max-age=0`,
    },
    {
      title: "Step 6: Server response and render",
      description:
        "The server processes the request and returns a response: a status line (e.g. 200 OK), " +
        "response headers (Content-Type, Cache-Control, ETag, Set-Cookie...), and a body. " +
        "The browser starts parsing the HTML as bytes arrive — it does not wait for the full document.\n\n" +
        "Each external resource (CSS, JS, fonts, images) discovered while parsing triggers a new " +
        "DNS/TCP/TLS/HTTP cycle (though connections are reused via Keep-Alive and DNS is cached). " +
        "Once the render tree is assembled from the DOM and CSSOM, the browser lays out and paints pixels — " +
        "your 200ms is complete.",
      code: `HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Content-Encoding: gzip
Cache-Control: public, max-age=3600
ETag: "xyz789"
Vary: Accept-Encoding

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Frontend Developer Roadmap</title>
    <link rel="stylesheet" href="/styles/main.css">
  </head>
  <body>
    <h1>Frontend Developer</h1>
    <script src="/js/app.js" defer></script>
  </body>
</html>`,
    },
  ];

  // ─────────────────────────────────────────────────────────────────────────────
  // Section 3: HTMLPlayground — Watch a real HTTP exchange
  // ─────────────────────────────────────────────────────────────────────────────
  const playgroundHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>HTTP Demo</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <h2>Live HTTP requests via <code>fetch()</code></h2>
  <p class="hint">Open DevTools &rarr; Network tab, then click a button below.</p>
  <div class="btn-row">
    <button id="btn-ip">Get IP</button>
    <button id="btn-headers">Show headers</button>
    <button id="btn-json">Get JSON</button>
  </div>
  <pre id="output" class="output">Response will appear here&hellip;</pre>
  <script src="/script.js"></script>
</body>
</html>`;

  const playgroundCss = `body {
  font-family: system-ui, sans-serif;
  max-width: 640px;
  margin: 24px auto;
  padding: 0 16px;
  color: #1e293b;
}
h2 { margin-bottom: 4px; font-size: 1.1rem; }
.hint { font-size: 0.82rem; color: #64748b; margin-bottom: 16px; }
.btn-row { display: flex; gap: 8px; margin-bottom: 16px; }
button {
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
}
button:hover { background: #2563eb; }
button:disabled { background: #94a3b8; cursor: not-allowed; }
.output {
  background: #0f172a;
  color: #e2e8f0;
  padding: 16px;
  border-radius: 8px;
  font-family: monospace;
  font-size: 0.8rem;
  min-height: 120px;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-all;
}`;

  const playgroundJs = `async function fetchEndpoint(url) {
  const out = document.getElementById('output');
  out.textContent = 'Fetching ' + url + ' ...';

  try {
    const res = await fetch(url);
    const status = 'HTTP ' + res.status + ' ' + res.statusText;
    const data = await res.json();
    out.textContent = status + '\\n\\n' + JSON.stringify(data, null, 2);
  } catch (err) {
    out.textContent = 'Error: ' + (err instanceof Error ? err.message : String(err)) +
      '\\n(Check your network connection and try again.)';
  }
}

document.getElementById('btn-ip').addEventListener('click', () => {
  fetchEndpoint('https://httpbin.org/ip');
});

document.getElementById('btn-headers').addEventListener('click', () => {
  fetchEndpoint('https://httpbin.org/headers');
});

document.getElementById('btn-json').addEventListener('click', () => {
  fetchEndpoint('https://httpbin.org/get');
});`;

  // ─────────────────────────────────────────────────────────────────────────────
  // Section 4: DNS resolution diagram — 9-node left-to-right flow
  // ─────────────────────────────────────────────────────────────────────────────
  const dnsNodes: Node[] = [
    {
      id: "browser",
      type: "input",
      data: { label: "Browser" },
      position: { x: 50, y: 100 },
      style: {
        background: "#3b82f6",
        color: "white",
        padding: "10px 14px",
        borderRadius: "8px",
        fontWeight: "bold",
        fontSize: "12px",
      },
    },
    {
      id: "os-resolver",
      data: { label: "OS Resolver" },
      position: { x: 200, y: 100 },
      style: {
        background: "#8b5cf6",
        color: "white",
        padding: "10px 14px",
        borderRadius: "8px",
        fontSize: "12px",
      },
    },
    {
      id: "recursive-resolver",
      data: { label: "Recursive Resolver" },
      position: { x: 360, y: 100 },
      style: {
        background: "#8b5cf6",
        color: "white",
        padding: "10px 14px",
        borderRadius: "8px",
        fontSize: "12px",
      },
    },
    {
      id: "root-ns",
      data: { label: "Root Nameserver" },
      position: { x: 540, y: 100 },
      style: {
        background: "#f59e0b",
        color: "white",
        padding: "10px 14px",
        borderRadius: "8px",
        fontSize: "12px",
      },
    },
    {
      id: "tld-ns",
      data: { label: "TLD Nameserver (.sh)" },
      position: { x: 720, y: 100 },
      style: {
        background: "#f59e0b",
        color: "white",
        padding: "10px 14px",
        borderRadius: "8px",
        fontSize: "12px",
      },
    },
    {
      id: "auth-ns",
      data: { label: "Authoritative (roadmap.sh)" },
      position: { x: 900, y: 100 },
      style: {
        background: "#f59e0b",
        color: "white",
        padding: "10px 14px",
        borderRadius: "8px",
        fontSize: "12px",
      },
    },
    {
      id: "recursive-return",
      data: { label: "Recursive Resolver" },
      position: { x: 1080, y: 100 },
      style: {
        background: "#8b5cf6",
        color: "white",
        padding: "10px 14px",
        borderRadius: "8px",
        fontSize: "12px",
      },
    },
    {
      id: "browser-return",
      data: { label: "Browser" },
      position: { x: 1240, y: 100 },
      style: {
        background: "#3b82f6",
        color: "white",
        padding: "10px 14px",
        borderRadius: "8px",
        fontWeight: "bold",
        fontSize: "12px",
      },
    },
    {
      id: "web-server",
      type: "output",
      data: { label: "Web Server" },
      position: { x: 1420, y: 100 },
      style: {
        background: "#3b82f6",
        color: "white",
        padding: "10px 14px",
        borderRadius: "8px",
        fontWeight: "bold",
        fontSize: "12px",
      },
    },
  ];

  const dnsEdges: Edge[] = [
    {
      id: "e1",
      source: "browser",
      target: "os-resolver",
      animated: true,
      label: "1. query",
    },
    {
      id: "e2",
      source: "os-resolver",
      target: "recursive-resolver",
      animated: true,
      label: "2. forward",
    },
    {
      id: "e3",
      source: "recursive-resolver",
      target: "root-ns",
      animated: true,
      label: "3. ask root",
    },
    {
      id: "e4",
      source: "root-ns",
      target: "tld-ns",
      animated: true,
      label: "4. refer .sh",
    },
    {
      id: "e5",
      source: "tld-ns",
      target: "auth-ns",
      animated: true,
      label: "5. refer auth",
    },
    {
      id: "e6",
      source: "auth-ns",
      target: "recursive-return",
      animated: true,
      label: "6. A record",
    },
    {
      id: "e7",
      source: "recursive-return",
      target: "browser-return",
      animated: true,
      label: "7. IP address",
    },
    {
      id: "e8",
      source: "browser-return",
      target: "web-server",
      animated: true,
      label: "8. connect",
    },
  ];

  // ─────────────────────────────────────────────────────────────────────────────
  // Section 6: Key takeaways
  // ─────────────────────────────────────────────────────────────────────────────
  const takeawayPoints = [
    <>DNS is the phonebook of the internet: it translates human-readable names like <code>roadmap.sh</code> into IP addresses the network can route to.</>,
    <>TCP guarantees ordered, reliable delivery via a three-way handshake — every connection costs at least one round-trip before data flows.</>,
    <>TLS sits between TCP and HTTP: it both encrypts the payload and verifies the server&apos;s identity via a CA-signed certificate, adding one extra RTT.</>,
    <>HTTP is the application-layer &quot;letter&quot; — methods, headers, and bodies — and its semantics are the same whether you are using HTTP/1.1, HTTP/2, or HTTP/3.</>,
    <>Knowing which layer is misbehaving turns a vague &quot;it&apos;s broken&quot; into a specific, fixable diagnosis: DNS timeout, TLS certificate expired, or HTTP 502.</>,
  ];

  const mentalModel =
    "The internet is a layered postal service: DNS finds the address, TCP delivers reliably, HTTPS seals the envelope, HTTP is the letter inside.";

  // ─────────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8">
      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* Section 1: Problem statement                                            */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      <Card>
        <CardContent className="pt-6">
          <div className="prose dark:prose-invert max-w-none">
            <h2>🌍 The Problem: 200ms of magic</h2>

            <p>
              You type <code>roadmap.sh</code>, hit Enter, and the page appears. Looks instant. It
              isn&apos;t.
            </p>

            <p>
              In those 200 milliseconds your browser performed a <strong>DNS lookup</strong> to
              translate <code>roadmap.sh</code> into an IP address, a <strong>TCP handshake</strong>{" "}
              to establish a reliable connection, a <strong>TLS handshake</strong> to negotiate
              encryption and verify the server&apos;s identity, an <strong>HTTP request</strong> to
              ask for the page, a <strong>server response</strong> carrying the HTML bytes, and
              finally a <strong>render pipeline</strong> to turn those bytes into the visual you see.
            </p>

            <p>
              Why do all these layers exist? Because each one solves a real, distinct problem. DNS
              solves human memory — no one wants to type <code>76.76.21.21</code> in their address
              bar. TCP solves unreliable wires — packets get dropped, duplicated, and reordered on
              real networks. TLS solves snooping — without it, any router between you and the server
              could read or modify your traffic. HTTP solves &quot;what do you want?&quot; — it gives
              clients a uniform language to request specific resources from any server.
            </p>

            <p>
              This module is a guided tour of those layers, in the exact order they fire. By the end
              you will be able to look at any network failure and name which layer is responsible —
              which is the first and most important step to fixing it.
            </p>
          </div>
          <div className="mt-4">
            <RoadmapLink url="https://roadmap.sh/frontend" />
          </div>
        </CardContent>
      </Card>

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* Section 2: Step-by-step                                                 */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      <StepByStepExplanation
        title="From URL to pixels"
        description="The six layers between your keystroke and the rendered page"
        steps={historySteps}
      />

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* Section 3: HTMLPlayground                                               */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      <HTMLPlayground
        html={playgroundHtml}
        css={playgroundCss}
        js={playgroundJs}
        title="Watch a real HTTP exchange"
        description="Open DevTools → Network and click the buttons. Each button is one HTTP request."
      />

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* Section 4: DNS diagram                                                  */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      <InteractiveDiagram
        title="DNS resolution flow"
        description="How a name turns into an IP, hop by hop"
        initialNodes={dnsNodes}
        initialEdges={dnsEdges}
        height={260}
        interactive={false}
      />

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* Section 5: Challenges                                                   */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      <Challenge
        question="What is DNS' job in one sentence?"
        options={[
          { id: "a", text: "Encrypt traffic between client and server." },
          { id: "b", text: "Translate human-readable names into IP addresses." },
          { id: "c", text: "Reliably deliver TCP packets in order." },
          { id: "d", text: "Compress HTTP responses." },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            <p>
              DNS (Domain Name System) is purely a name-to-IP lookup service — you give it a
              hostname like <code>roadmap.sh</code> and it returns an IP address like{" "}
              <code>76.76.21.21</code>. It has nothing to do with encryption (that is TLS), reliable
              delivery of packets (that is TCP), or compressing HTTP bodies (that is
              Content-Encoding). DNS can itself be transported over encrypted channels
              (DNS-over-HTTPS, DNS-over-TLS) to hide which names you are looking up, but its core
              job remains the same: translate human-friendly names into machine-routable addresses.
            </p>
          </>
        }
      />

      <Challenge
        question="Why does HTTPS need a TLS handshake?"
        options={[
          { id: "a", text: "To resolve the server's hostname." },
          { id: "b", text: "To negotiate which HTTP version to use." },
          { id: "c", text: "To agree on encryption keys and verify the server's identity." },
          { id: "d", text: "To skip the TCP handshake." },
        ]}
        correctAnswerId="c"
        explanation={
          <>
            <p>
              TLS sits between TCP and HTTP in the network stack. The handshake serves two critical
              purposes simultaneously: <strong>key agreement</strong> — using asymmetric
              cryptography (typically elliptic-curve Diffie-Hellman), both sides independently
              derive the same symmetric session key without ever transmitting the key itself — and{" "}
              <strong>identity verification</strong> — the server presents a certificate signed by a
              trusted Certificate Authority (CA), proving it genuinely owns the domain. Without
              both, a network-adjacent attacker could read every byte you send or silently replace
              the page you receive. Note that TLS sits on top of TCP and below HTTP, so the TCP
              handshake still happens first; TLS cannot skip it.
            </p>
          </>
        }
      />

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* Section 6: Key takeaways                                                */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      <KeyTakeaways
        points={takeawayPoints}
        mentalModel={mentalModel}
      />
    </div>
  );
}
