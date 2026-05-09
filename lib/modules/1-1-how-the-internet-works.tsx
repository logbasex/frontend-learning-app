"use client";

import { Card, CardContent } from "@/components/ui/card";
import { HTMLPlayground } from "@/components/CodePlayground";
import { StepByStepExplanation, Step } from "@/components/StepByStepExplanation";
import { SequenceDiagram } from "@/components/SequenceDiagram";
import { Challenge } from "@/components/Challenge";
import { GotchaList } from "@/components/GotchaList";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { RoadmapLink } from "@/components/RoadmapLink";

export function Module_1_1_Content() {
  // Data blocks hoisted out of JSX for readability — listed in render order.
  const urlToPixelsSteps: Step[] = [
    {
      title: "Step 1: You type a URL",
      description: (
        <>
          Before you even press Enter the browser parses the raw string you typed into distinct
          components: scheme, host, port, path, query string, and fragment. The scheme tells the
          browser which protocol to use — <code>https</code> means port 443 and TLS required. The
          host is the human-readable name the network does not yet understand — that is DNS&apos;s
          job next. The path, query, and fragment travel inside the HTTP request once the connection
          is open.
        </>
      ),
      code: `# URL: https://roadmap.sh/frontend?tab=links#projects
#
# Parsed components:
#   scheme:   https          (protocol + implies port 443)
#   host:     roadmap.sh     (will be resolved to an IP by DNS)
#   port:     443            (implied by https)
#   path:     /frontend      (sent to the server in the HTTP request)
#   query:    tab=links      (also sent in the request line)
#   fragment: projects       (never sent — handled by the browser only)`,
    },
    {
      title: "Step 2: DNS resolution",
      description: (
        <>
          The host <code>roadmap.sh</code> is a human-readable alias; the network speaks only in IP
          addresses. <em>DNS</em> — a directory that maps human-readable names to IP addresses —
          walks a tree of servers to find the answer: root nameservers delegate to the{" "}
          <code>.sh</code> TLD, which delegates to roadmap.sh&apos;s authoritative nameservers,
          which return the A record. Results are cached at every hop for as long as the TTL allows,
          so most real-world lookups are answered in milliseconds by your ISP&apos;s recursive
          resolver. The <code>dig +trace</code> output shows every delegation step, letting you
          pinpoint exactly which level failed if a site won&apos;t load.
        </>
      ),
      code: `# Quick answer
$ dig roadmap.sh +short
76.76.21.21

# Full delegation trace
$ dig roadmap.sh +trace
.                   518400 IN NS a.root-servers.net.
sh.                 172800 IN NS ns1.nic.sh.
roadmap.sh.          86400 IN NS ns1.dnsimple.com.
roadmap.sh.             60 IN A  76.76.21.21
# ↑ A record: maps the name to an IPv4 address`,
    },
    {
      title: "Step 3: TCP handshake",
      description: (
        <>
          <em>TCP</em> — a reliable, ordered, connection-oriented transport protocol — requires both
          sides to agree before any data flows. The three-way handshake (SYN, SYN-ACK, ACK) costs
          exactly one round-trip time (RTT). That RTT is why physical distance to the server
          matters: a CDN edge 10 ms away is far cheaper for the first byte than a datacenter 150 ms
          away. HTTP keep-alive and HTTP/2 multiplexing exist precisely to avoid repeating this
          handshake for every resource.
        </>
      ),
      code: `# TCP three-way handshake
Client                          Server
  |                               |
  |──── SYN (seq=x) ─────────────►|   "I want to connect"
  |◄─── SYN-ACK (seq=y, ack=x+1) ─|   "OK, I am ready"
  |──── ACK (ack=y+1) ───────────►|   "Acknowledged"
  |                               |
  |  <<< connection established >>>   |
  |  (costs 1 RTT before any byte)    |`,
    },
    {
      title: "Step 4: TLS handshake (HTTPS only)",
      description: (
        <>
          <em>TLS</em> — a protocol layered on top of TCP that encrypts the channel and verifies the
          server&apos;s identity — adds one more RTT on top of TCP. The client sends a ClientHello
          listing supported cipher suites; the server replies with a certificate signed by a trusted
          Certificate Authority. In TLS 1.3 the key exchange is folded into that same round-trip,
          so the total cost is TCP RTT + TLS RTT before any HTTP byte flows. All traffic is then
          encrypted with a symmetric session key derived via elliptic-curve Diffie-Hellman —
          never transmitted directly.
        </>
      ),
      code: `$ openssl s_client -connect roadmap.sh:443 2>&1 | head -20

Protocol  : TLSv1.3
Cipher    : TLS_AES_256_GCM_SHA384
Server Temp Key: X25519, 253 bits

# Certificate chain:
#  0 s:CN = roadmap.sh
#    i:C = US, O = Let's Encrypt, CN = R11
#  1 s:CN = R11
#    i:C = US, O = Internet Security Research Group, CN = ISRG Root X1
#
# The CA (Let's Encrypt) signed the cert — your browser trusts it
# because ISRG Root X1 is in your OS/browser trust store.`,
    },
    {
      title: "Step 5: HTTP request",
      description: (
        <>
          <em>HTTP</em> — the application-layer protocol for client-server requests and responses on
          the web — uses a simple structure: a request line naming the method and path, then
          headers, then an optional body. The <code>Host</code> header is required in HTTP/1.1 so a
          single IP can serve many domains (virtual hosting). HTTP/2 and HTTP/3 use binary framing
          and multiplexing under the hood, but the semantics — methods, headers, status codes — are
          identical to HTTP/1.1, so what you read below applies to all three.
        </>
      ),
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
      description: (
        <>
          The server returns a status line (<code>200 OK</code>), response headers, and a body. The
          browser starts parsing HTML as bytes arrive — it does not wait for the complete document.
          Each external resource (CSS, JS, fonts, images) discovered while parsing triggers its own
          DNS/TCP/TLS/HTTP cycle, though connections are reused via keep-alive and DNS results are
          cached. Once the render tree is assembled from the DOM and CSSOM, the browser lays out
          geometry and paints pixels — your 200 ms are complete.
        </>
      ),
      code: `HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Content-Encoding: gzip
Cache-Control: public, max-age=3600
ETag: "xyz789"

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
    <button id="btn-get">GET /get</button>
    <button id="btn-headers">GET /headers</button>
    <button id="btn-ip">GET /ip</button>
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
.btn-row { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
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

  const playgroundJs = `// Try this: open DevTools → Network, click a button, then change the URL to
// httpbin.org/status/418 and watch the response come back as 418 I'm a teapot.

async function fetchEndpoint(url) {
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

document.getElementById('btn-get').addEventListener('click', () => {
  fetchEndpoint('https://httpbin.org/get');
});

document.getElementById('btn-headers').addEventListener('click', () => {
  fetchEndpoint('https://httpbin.org/headers');
});

document.getElementById('btn-ip').addEventListener('click', () => {
  fetchEndpoint('https://httpbin.org/ip');
});`;

  return (
    <div className="space-y-8">

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 1: Hook                                                       */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Card>
        <CardContent className="pt-6">
          <div className="prose dark:prose-invert max-w-none">
            <p>
              You type <code>roadmap.sh</code>, hit Enter, and the page appears. Looks instant. It
              isn&apos;t.
            </p>
            <p>
              In those 200 milliseconds your browser ran a <strong>DNS lookup</strong> to translate
              the hostname into an IP address, a <strong>TCP handshake</strong> to open a reliable
              connection, a <strong>TLS handshake</strong> to negotiate encryption and verify the
              server&apos;s identity, an <strong>HTTP request</strong> to ask for the page, and a
              <strong> render pipeline</strong> to turn the bytes into the visual you see. Each
              layer exists because the one below it couldn&apos;t do the job alone. This module is
              the layered map of those 200 milliseconds — by the end, when a site won&apos;t load,
              you&apos;ll know which layer to interrogate first.
            </p>
          </div>
          <div className="mt-4">
            <RoadmapLink url="https://roadmap.sh/frontend" />
          </div>
        </CardContent>
      </Card>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 2: Mental model first                                         */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Card>
        <CardContent className="pt-6">
          <div className="prose dark:prose-invert max-w-none">
            <p>
              Think of the internet as a layered postal service. Each layer solves one real,
              distinct problem, and they compose: DNS is the address book that looks up where to
              deliver; TCP is the courier that guarantees the parcel arrives intact and in order;
              HTTPS is the tamper-evident envelope that prevents anyone else from reading or
              altering the contents; and HTTP is the letter itself — the actual question you asked
              and the answer you received. When one layer misbehaves, the others cannot compensate.
              A DNS failure means no IP, so no TCP connection, so no page. Keeping those four layers
              distinct in your head is the single most useful mental model for debugging network
              problems.
            </p>
            <blockquote className="border-l-4 border-blue-500 pl-4 italic">
              &quot;The internet is a layered postal service: DNS finds the address, TCP delivers
              reliably, HTTPS seals the envelope, HTTP is the letter inside.&quot;
            </blockquote>
          </div>
        </CardContent>
      </Card>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 3: Step-by-step                                               */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <StepByStepExplanation
        title="From URL to pixels"
        description="The six layers between your keystroke and the rendered page"
        steps={urlToPixelsSteps}
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 4: Live playground                                            */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <HTMLPlayground
        html={playgroundHtml}
        css={playgroundCss}
        js={playgroundJs}
        title="Watch a real HTTP exchange"
        description="Open DevTools → Network and click the buttons. Each click is one real HTTP request over DNS + TCP + TLS."
      />

      {/* Optional: Sequence diagram (DNS resolution) */}
      <SequenceDiagram
        title="DNS resolution"
        description="From browser to authoritative nameserver and back"
        actors={["Browser", "Resolver", "Root", "TLD", "Authoritative", "Server"]}
        messages={[
          { from: "Browser", to: "Resolver", label: "query roadmap.sh" },
          { from: "Resolver", to: "Root", label: "ask .sh nameservers?" },
          { from: "Root", to: "Resolver", label: "see ns1.nic.sh" },
          { from: "Resolver", to: "TLD", label: "ask roadmap.sh nameservers?" },
          { from: "TLD", to: "Resolver", label: "see ns1.dnsimple.com" },
          { from: "Resolver", to: "Authoritative", label: "A record for roadmap.sh?" },
          { from: "Authoritative", to: "Resolver", label: "76.76.21.21", note: "cached for TTL seconds" },
          { from: "Resolver", to: "Browser", label: "76.76.21.21" },
          { from: "Browser", to: "Server", label: "TCP+TLS+HTTP →" },
        ]}
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 5: Challenges                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Challenge
        question="What is DNS's job in one sentence?"
        options={[
          { id: "a", text: "Encrypt traffic between client and server." },
          { id: "b", text: "Translate human-readable names into IP addresses." },
          { id: "c", text: "Reliably deliver TCP packets in order." },
          { id: "d", text: "Compress HTTP responses to reduce bandwidth." },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            DNS (Domain Name System) is purely a name-to-IP lookup service — you give it a hostname
            like <code>roadmap.sh</code> and it returns an IP address like <code>76.76.21.21</code>.
            It has nothing to do with encryption (that is TLS), ordering packets (that is TCP), or
            compressing responses (that is <code>Content-Encoding</code>). The A record maps a name
            to an IPv4 address; the AAAA record maps it to an IPv6 address — choosing between them is
            the only &quot;decision&quot; DNS makes.
          </>
        }
      />

      <Challenge
        question="Why does HTTPS need a TLS handshake before any HTTP byte is sent?"
        options={[
          { id: "a", text: "To resolve the server's hostname to an IP address." },
          { id: "b", text: "To negotiate which HTTP version (1.1, 2, or 3) to use." },
          { id: "c", text: "To agree on encryption keys and verify the server's identity." },
          { id: "d", text: "To replace the TCP handshake with a faster alternative." },
        ]}
        correctAnswerId="c"
        explanation={
          <>
            TLS sits between TCP and HTTP. The handshake does two things at once:
            <strong> key agreement</strong> — both sides derive the same symmetric session key
            without ever transmitting it — and <strong>identity verification</strong>: the
            server&apos;s certificate, signed by a trusted Certificate Authority, proves it
            genuinely owns the domain. TLS cannot skip the TCP handshake; it sits on top of it.
          </>
        }
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 6: GotchaList                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <GotchaList
        items={[
          {
            title: "DNS caches are layered",
            body: (
              <>
                Your browser, your OS, your home router, and your ISP each cache DNS responses. A
                &quot;wrong&quot; result can be cached at any layer for the full TTL — when you change
                a record, flush them all and wait, or test from a different network.
              </>
            ),
          },
          {
            title: "TCP handshake costs an RTT before any byte of data flows",
            body: (
              <>
                That&apos;s why HTTP keep-alive and HTTP/2 multiplexing exist: avoiding repeated
                handshakes is one of the cheapest performance wins on the web. A connection reused for
                ten resources pays the TCP RTT once; ten new connections pay it ten times.
              </>
            ),
          },
          {
            title: "TLS doesn't skip TCP",
            body: (
              <>
                TLS sits on top of TCP. The order is always TCP first, then TLS, then HTTP — there is
                no &quot;HTTPS handshake&quot; that bypasses the TCP one. HTTP/3 replaces TCP with
                QUIC (UDP-based), which folds the transport and TLS handshakes together — but that is
                a special case, not the norm you will debug.
              </>
            ),
          },
          {
            title: "HTTPS isn't end-to-end secrecy past the load balancer",
            body: (
              <>
                The TLS connection terminates at whatever first server you hit — usually a load
                balancer or CDN edge. From there, traffic to your application server depends on the
                operator&apos;s internal-network design. HTTPS doesn&apos;t guarantee anything past
                that point; end-to-end security is the operator&apos;s responsibility beyond the edge.
              </>
            ),
          },
        ]}
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 7: KeyTakeaways                                               */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <KeyTakeaways
        points={[
          <>
            DNS is a phonebook: it translates human-readable names like <code>roadmap.sh</code> into
            IP addresses the network can route. The A record maps to IPv4; the AAAA record maps to
            IPv6.
          </>,
          <>
            TCP guarantees ordered, reliable delivery via a three-way handshake (SYN, SYN-ACK, ACK)
            — every connection costs at least one round-trip before any data flows.
          </>,
          <>
            TLS sits between TCP and HTTP: it both encrypts the payload and verifies the server&apos;s
            identity via a CA-signed certificate, adding one extra RTT on top of the TCP RTT.
          </>,
          <>
            HTTP is the application-layer letter — methods, headers, and bodies — and the same
            semantics work over HTTP/1.1, HTTP/2, and HTTP/3.
          </>,
          <>
            Knowing which layer is misbehaving turns &quot;it&apos;s broken&quot; into a specific,
            fixable diagnosis: DNS timeout, TCP connection refused, TLS certificate error, or HTTP 502.
          </>,
        ]}
        mentalModel="The internet is a layered postal service: DNS finds the address, TCP delivers reliably, HTTPS seals the envelope, HTTP is the letter inside."
      />
    </div>
  );
}
