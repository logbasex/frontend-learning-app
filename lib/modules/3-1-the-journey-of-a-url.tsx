"use client";

import { Card, CardContent } from "@/components/ui/card";
import { StepByStepExplanation } from "@/components/StepByStepExplanation";
import { Challenge } from "@/components/Challenge";
import { GotchaList } from "@/components/GotchaList";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { RoadmapLink } from "@/components/RoadmapLink";
import { SequenceDiagram } from "@/components/SequenceDiagram";
import { LayeredFlow } from "@/components/LayeredFlow";
import { InteractiveDiagram } from "@/components/InteractiveDiagram";
import { type Node, type Edge } from "@xyflow/react";

export function Module_3_1_Content() {
  // Data blocks hoisted out of JSX for readability — listed in render order.

  const urlToPixelsSteps = [
    {
      title: "URL parsing — the browser reads the address before touching the network",
      description: (
        <p>
          Before any packet leaves the machine, the browser parses the URL into its parts:{" "}
          <em>scheme</em> (<code>https</code>), <em>host</em> (<code>taproot-blog.dev</code>),{" "}
          <em>port</em> (implied 443 for HTTPS), <em>path</em> (
          <code>/posts/hello-world.html</code>), <em>query string</em> (the{" "}
          <code>?key=value</code> pairs after the path), and <em>fragment</em> (the{" "}
          <code>#section</code> after the query). The fragment is the only part that never leaves
          the browser — it is a client-side bookmark and the server never sees it. The scheme
          tells the browser which protocol to use. If it is <code>https</code>, port 443 is the
          default; if it is <code>http</code>, port 80 is the default. Parsing the URL is step
          zero — everything that follows depends on knowing the host.
        </p>
      ),
      code: `// URL: https://taproot-blog.dev/posts/hello-world.html?ref=roadmap#comments
//
// scheme   : https
// host     : taproot-blog.dev
// port     : 443  (implied by https — not in the URL string)
// path     : /posts/hello-world.html
// query    : ref=roadmap
// fragment : comments   <- stays in the browser; server never sees it
//
// The browser needs the host to continue.
// Without it, there is nowhere to connect to.`,
      language: "javascript",
    },
    {
      title: "DNS — turning a name into a number the network understands",
      description: (
        <p>
          The network does not know <code>taproot-blog.dev</code>. It only understands{" "}
          <em>IP</em> addresses — numbers like <code>93.184.216.34</code>. <em>DNS</em> (Domain
          Name System) is the distributed database that translates names into numbers. The browser
          asks a resolver (usually the one your ISP or router provides). The resolver walks the
          DNS tree: it asks a root nameserver which nameserver is responsible for <code>.dev</code>,
          asks the <code>.dev</code> TLD nameserver which nameserver is authoritative for{" "}
          <code>taproot-blog.dev</code>, then asks that authoritative nameserver for the{" "}
          <em>A record</em> (IPv4) or <em>AAAA record</em> (IPv6). Every answer carries a{" "}
          <em>TTL</em> (time-to-live) — a number of seconds the resolver may cache the answer. A
          cache hit skips the whole tree walk; a cache miss adds 20–100 ms to every cold first
          visit.
        </p>
      ),
      code: `# dig +trace style output — what the resolver does on a cold miss
#
# Step 1: ask a root nameserver who handles .dev
;; ANSWER for . -> com. TLD
ns1.google.com   ->   .dev nameserver: ns-tld1.charlestonroadregistry.com
#
# Step 2: ask the .dev TLD nameserver who handles taproot-blog.dev
ns-tld1.charlestonroadregistry.com  ->
     taproot-blog.dev NS  ns1.hosting-provider.net
#
# Step 3: ask the authoritative nameserver for the A record
ns1.hosting-provider.net  ->
     taproot-blog.dev  A  93.184.216.34
     TTL: 300 seconds  (cache this answer for 5 minutes)
#
# Result: the IP address 93.184.216.34 is now known.
# Second visit within 5 minutes: all steps skipped, answer from cache.`,
      language: "bash",
    },
    {
      title: "TCP — opening a reliable channel",
      description: (
        <p>
          With an <em>IP</em> address, the browser asks the operating system to open a{" "}
          <em>TCP</em> (Transmission Control Protocol) connection to <code>93.184.216.34</code> on
          port 443. TCP guarantees delivery and ordering — packets that arrive out of order are
          reassembled; lost packets are retransmitted. Establishing a TCP connection takes one{" "}
          <em>round-trip time</em> (RTT): the browser sends a <em>SYN</em> packet, the server
          replies with <em>SYN-ACK</em>, the browser confirms with <em>ACK</em>. For a server 50 ms
          away, that is 50 ms before a single byte of application data is exchanged. This cost is
          why technologies like <em>CDNs</em> (content delivery networks) exist — they move a
          server geographically closer to the user to shrink the RTT — and why HTTP/2 reuses one
          TCP connection for many requests instead of opening a new one for each resource.
        </p>
      ),
      code: `// TCP three-way handshake — one round-trip time (RTT)
//
// Browser                          Server
//   |                                |
//   |---------- SYN ---------------->|   "I want to connect"
//   |<--------- SYN-ACK -------------|   "OK, I hear you"
//   |---------- ACK ---------------->|   "Good, connection open"
//   |                                |
//   // Connection is now established.
//   // Only NOW can the browser start the TLS handshake.
//
// RTT example: server 50 ms away
//   t=0ms   SYN sent
//   t=50ms  SYN-ACK received
//   t=50ms  ACK sent (nearly instant)
//   -> TCP open at ~50ms
//
// Without keep-alive or HTTP/2, every new resource repeats this.`,
      language: "javascript",
    },
    {
      title: "TLS — encrypting and authenticating the channel",
      description: (
        <p>
          Port 443 means <em>TLS</em> (Transport Layer Security). After the TCP handshake, the
          browser and server perform a <em>TLS handshake</em> to establish an encrypted,
          authenticated channel. The browser sends a <em>ClientHello</em> — the TLS version it
          supports and a list of cipher suites. The server replies with a <em>ServerHello</em> —
          choosing a cipher — and sends its <em>certificate</em> (a document signed by a trusted
          Certificate Authority proving the server really is <code>taproot-blog.dev</code>). The
          two sides derive a shared secret without ever transmitting it directly (using
          Diffie-Hellman key exchange), then confirm they agree. Modern TLS 1.3 does all of this in
          one round-trip. After the handshake, every byte of <em>HTTP</em> sent over this
          connection is encrypted — eavesdroppers see ciphertext, not your blog post. That is what
          HTTPS means: HTTP over TLS.
        </p>
      ),
      code: `// TLS 1.3 handshake (simplified)
//
// Browser                          Server
//   |                                |
//   |--- ClientHello  -------------->|   TLS version, cipher list, key share
//   |<-- ServerHello  ---------------|   chosen cipher, key share, certificate
//   |<-- Certificate ----------------|   "I am taproot-blog.dev; here is my cert"
//   |    (signed by a CA the browser trusts — e.g. Let's Encrypt)
//   |                                |
//   |--- Finished  ----------------->|   "I verified the cert; channel is ready"
//   |<-- Finished  ------------------|
//   |                                |
//   // Encrypted channel established in ~1 RTT (TLS 1.3)
//   // TLS 1.2 took 2 RTTs — that is why upgrading matters.
//
// What TLS guarantees:
//   Confidentiality  — content encrypted; nobody can read it in transit
//   Integrity        — tampering is detected (MAC on every record)
//   Authentication   — the certificate proves who the server is`,
      language: "javascript",
    },
    {
      title: "HTTP — asking for the page",
      description: (
        <p>
          With an encrypted TCP connection ready, the browser sends an{" "}
          <em>HTTP</em> request <em>through</em> the TLS channel. The request has a start line
          (method, path, version), headers (including the required <code>Host</code> header — one
          TCP connection can serve many domains), and optionally a body. The server receives the
          request, locates the resource, and sends back an HTTP response: a status line, headers,
          and the body — bytes of HTML. This is exactly what module 2-3 described. The difference
          now is that those bytes are not read from <code>/assets/comments.json</code> on the same
          machine — they traveled across the internet, encrypted, from a server that could be
          anywhere in the world.
        </p>
      ),
      code: `// HTTP/1.1 request (sent inside the TLS-encrypted TCP connection)
GET /posts/hello-world.html HTTP/1.1
Host: taproot-blog.dev
Accept: text/html,application/xhtml+xml
Accept-Language: en-US,en;q=0.9
Connection: keep-alive

// (blank line signals end of headers — no body for GET)

// --- server responds ---

HTTP/1.1 200 OK
Content-Type: text/html; charset=UTF-8
Content-Length: 4821
Cache-Control: public, max-age=3600

<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Hello World — Taproot Blog</title>
    ...  (the HTML bytes the browser will now parse)`,
      language: "http",
    },
    {
      title: "Browser parser — bytes become a tree",
      description: (
        <p>
          The bytes arrive. The browser feeds them to the HTML parser, which builds the{" "}
          <em>DOM</em> (Document Object Model) — a tree of objects, one node per HTML element.
          Parsing is incremental: the browser does not wait for the full document before starting.
          As the parser works, it discovers external resources: a{" "}
          <code>&lt;link rel=&quot;stylesheet&quot;&gt;</code> triggers a CSS fetch, which{" "}
          <em>blocks rendering</em> (not parsing — the parser continues reading HTML). A{" "}
          <code>&lt;script src=&quot;...&quot;&gt;</code> without <code>defer</code> or{" "}
          <code>async</code> <em>blocks parsing entirely</em> — the browser stops building the DOM
          until the script has downloaded and executed, because a synchronous inline script can
          modify the HTML stream. This is why the conventional advice is to put scripts at the
          bottom of <code>&lt;body&gt;</code> or to use <code>defer</code>: both let the parser
          finish building the DOM before the script runs. CSS is parsed in parallel into the{" "}
          <em>CSSOM</em> (CSS Object Model) — a parallel tree of style rules.
        </p>
      ),
      code: `// Simplified HTML — annotated with parser behavior
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="/styles.css">
  <!--
    CSS fetch starts here.
    Parser continues reading HTML.
    Rendering is BLOCKED until styles.css arrives and is parsed into CSSOM.
  -->

  <script src="/analytics.js"></script>
  <!--
    Script fetch starts here.
    Parser is BLOCKED — stops building the DOM until analytics.js
    has downloaded AND executed. (No defer/async here.)
    This is the "script blocks parser" gotcha.
  -->

  <script src="/app.js" defer></script>
  <!--
    defer: script downloads in parallel but runs AFTER DOM is ready.
    Parser continues — no blocking.
  -->
</head>
<body>
  <!-- DOM nodes are built here while CSS and deferred scripts load -->
  <h1>Hello World</h1>
  ...
</body>
</html>`,
      language: "html",
    },
    {
      title: "Rendering pipeline — DOM + CSSOM become pixels",
      description: (
        <p>
          Once the browser has the <em>DOM</em> and the <em>CSSOM</em>, it combines them into the{" "}
          <em>render tree</em> — only the visible nodes (elements with{" "}
          <code>display: none</code> are excluded). The render tree then goes through{" "}
          <em>layout</em> (also called reflow): the browser calculates the exact position and size
          of every box on screen. Then <em>paint</em>: it fills in pixels — colors, borders,
          shadows. Finally <em>composite</em>: it stacks the layers together in the correct order.
          The <em>First Contentful Paint</em> (FCP) is the moment the user sees the first
          non-empty content. The <em>Largest Contentful Paint</em> (LCP) is when the{" "}
          <em>main</em> content — the article headline, the hero image — appears. LCP is the Core
          Web Vital that tells you whether the user saw what they came for within a reasonable time.
          Anything that delays either the DOM or the CSSOM delays all of this.
        </p>
      ),
      code: `// Annotated timing trace — one URL to first paint
//
t=0ms     URL typed
t=2ms     URL parsed (scheme: https, host: taproot-blog.dev, path: /posts/...)
t=20ms    DNS resolved (cache hit — 5-min TTL still valid)
t=70ms    TCP handshake complete (server ~50ms away, 1 RTT)
t=120ms   TLS handshake complete (~1 RTT, TLS 1.3)
t=150ms   HTTP GET /posts/hello-world.html sent
t=180ms   First byte of response arrives (server processing + network)
t=200ms   HTML parsed enough to start discovering resources
t=210ms   CSS fetch started (parser found link[rel=stylesheet])
t=250ms   CSS parsed -> CSSOM ready
t=260ms   Render tree built (DOM + CSSOM combined)
t=275ms   Layout complete (every box positioned)
t=290ms   Paint complete (pixels filled)
t=300ms   Composite -> First Contentful Paint  <- user sees something
t=400ms   Hero image decoded -> Largest Contentful Paint  <- user sees the article
//
// Cold DNS miss adds ~80ms to t=20ms.
// Script without defer between t=200ms and t=250ms blocks the DOM build.
// Slow CSS blocks everything from t=250ms onward.`,
      language: "javascript",
    },
  ];

  const sequenceActors = ["Browser", "DNS Resolver", "Server"];
  const sequenceMessages = [
    { from: "Browser", to: "DNS Resolver", label: "Who is taproot-blog.dev?", note: "DNS query" },
    { from: "DNS Resolver", to: "Browser", label: "93.184.216.34 (TTL 300s)", note: "DNS response" },
    { from: "Browser", to: "Server", label: "SYN", note: "TCP step 1" },
    { from: "Server", to: "Browser", label: "SYN-ACK", note: "TCP step 2" },
    { from: "Browser", to: "Server", label: "ACK", note: "TCP step 3" },
    { from: "Browser", to: "Server", label: "ClientHello (TLS)", note: "TLS step 1" },
    { from: "Server", to: "Browser", label: "ServerHello + Certificate", note: "TLS step 2" },
    { from: "Browser", to: "Server", label: "Finished (key confirmed)", note: "TLS step 3" },
    { from: "Browser", to: "Server", label: "GET /posts/hello-world.html", note: "HTTP request" },
    { from: "Server", to: "Browser", label: "200 OK + HTML body", note: "HTTP response" },
  ];

  const renderingPipelineStages = [
    { label: "HTML bytes", detail: "Raw response body", color: "blue" as const },
    { label: "DOM", detail: "Parse HTML", color: "violet" as const },
    { label: "CSSOM", detail: "Parse CSS", color: "violet" as const },
    { label: "Render tree", detail: "DOM + CSSOM", color: "emerald" as const },
    { label: "Layout", detail: "Position boxes", color: "amber" as const },
    { label: "Paint", detail: "Fill pixels", color: "rose" as const },
    { label: "Composite", detail: "Stack layers", color: "slate" as const },
  ];

  const journeyNodes: Node[] = [
    {
      id: "url",
      type: "input",
      data: { label: "Type URL" },
      position: { x: 50, y: 200 },
      style: { background: "#3b82f6", color: "white", padding: "10px 16px", borderRadius: "8px", fontWeight: "bold" },
    },
    {
      id: "parse",
      data: { label: "Parse URL" },
      position: { x: 220, y: 200 },
      style: { background: "#6366f1", color: "white", padding: "10px 16px", borderRadius: "8px" },
    },
    {
      id: "dns",
      data: { label: "DNS lookup" },
      position: { x: 390, y: 120 },
      style: { background: "#8b5cf6", color: "white", padding: "10px 16px", borderRadius: "8px" },
    },
    {
      id: "tcp",
      data: { label: "TCP handshake" },
      position: { x: 560, y: 120 },
      style: { background: "#ec4899", color: "white", padding: "10px 16px", borderRadius: "8px" },
    },
    {
      id: "tls",
      data: { label: "TLS handshake" },
      position: { x: 730, y: 120 },
      style: { background: "#f59e0b", color: "white", padding: "10px 16px", borderRadius: "8px" },
    },
    {
      id: "http",
      data: { label: "HTTP GET" },
      position: { x: 900, y: 200 },
      style: { background: "#10b981", color: "white", padding: "10px 16px", borderRadius: "8px" },
    },
    {
      id: "parse-html",
      data: { label: "Parse HTML (DOM)" },
      position: { x: 730, y: 300 },
      style: { background: "#14b8a6", color: "white", padding: "10px 16px", borderRadius: "8px" },
    },
    {
      id: "parse-css",
      data: { label: "Parse CSS (CSSOM)" },
      position: { x: 900, y: 340 },
      style: { background: "#14b8a6", color: "white", padding: "10px 16px", borderRadius: "8px" },
    },
    {
      id: "render",
      data: { label: "Render tree" },
      position: { x: 560, y: 380 },
      style: { background: "#f59e0b", color: "white", padding: "10px 16px", borderRadius: "8px" },
    },
    {
      id: "layout",
      data: { label: "Layout" },
      position: { x: 390, y: 380 },
      style: { background: "#ef4444", color: "white", padding: "10px 16px", borderRadius: "8px" },
    },
    {
      id: "paint",
      type: "output",
      data: { label: "Paint + Pixels" },
      position: { x: 220, y: 380 },
      style: { background: "#06b6d4", color: "white", padding: "10px 16px", borderRadius: "8px", fontWeight: "bold" },
    },
  ];

  const journeyEdges: Edge[] = [
    { id: "e1", source: "url", target: "parse", animated: true },
    { id: "e2", source: "parse", target: "dns", label: "host" },
    { id: "e3", source: "dns", target: "tcp", label: "IP addr", animated: true },
    { id: "e4", source: "tcp", target: "tls", animated: true },
    { id: "e5", source: "tls", target: "http", animated: true },
    { id: "e6", source: "http", target: "parse-html", label: "HTML bytes" },
    { id: "e7", source: "http", target: "parse-css", label: "CSS bytes" },
    { id: "e8", source: "parse-html", target: "render", label: "DOM" },
    { id: "e9", source: "parse-css", target: "render", label: "CSSOM" },
    { id: "e10", source: "render", target: "layout" },
    { id: "e11", source: "layout", target: "paint", animated: true },
  ];

  const gotchaItems = [
    {
      title: "DNS caching at every hop means the first visit is slow and the second is fast",
      body: (
        <>
          The DNS tree walk (root &rarr; TLD &rarr; authoritative) adds 50&ndash;100 ms on a cold
          miss. On a warm cache hit it adds nothing. Your own experience of a site feels fast
          because you have probably visited before and the TTL has not expired. Your perception of
          speed is biased by your own cache — which is why you need tools like Lighthouse or
          WebPageTest run from a cold state to understand what first-time visitors actually
          experience.
        </>
      ),
    },
    {
      title: "HTTPS is not just encryption — it also authenticates the server",
      body: (
        <>
          Encryption without authentication is useless: a man-in-the-middle could encrypt your
          traffic with their own key and read everything. The TLS certificate is what prevents
          this — it proves the server you connected to is actually <code>taproot-blog.dev</code>{" "}
          and not an impostor sitting between you and the real server. Modern browsers refuse to
          show a green padlock without a valid certificate precisely because without it,
          confidentiality alone is not meaningful.
        </>
      ),
    },
    {
      title: "A script without defer or async blocks the HTML parser, not just rendering",
      body: (
        <>
          A <code>&lt;link rel=&apos;stylesheet&apos;&gt;</code> blocks <em>rendering</em> but the
          HTML parser keeps running. A <code>&lt;script src=&apos;...&apos;&gt;</code> without{" "}
          <code>defer</code> or <code>async</code> blocks <em>the parser itself</em> — the DOM
          stops being built until the script downloads and executes. The distinction matters
          because blocking the parser delays the browser from discovering other resources further
          down the page. A stylesheet placed in <code>&lt;head&gt;</code> is intentional (prevents
          flash of unstyled content). A script placed in <code>&lt;head&gt;</code> without{" "}
          <code>defer</code> is almost always a mistake.
        </>
      ),
    },
    {
      title: "First Contentful Paint and Largest Contentful Paint measure different things",
      body: (
        <>
          <em>FCP</em> measures when the first non-empty content appears — could be a loading
          spinner or a navigation bar. <em>LCP</em> measures when the largest content element in
          the viewport appears — the thing the user actually came for. You can improve FCP by
          showing something early while LCP requires the actual content to arrive fast. Optimizing
          FCP alone does not improve LCP; over-optimizing FCP (a heavy splash screen) can even hurt
          LCP by consuming bandwidth that should go to the main content.
        </>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-3xl font-bold">The Journey of a URL</h1>
        <RoadmapLink url="https://roadmap.sh/frontend" />
      </div>

      {/* 1. Hook */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            You open the blog on your laptop and it works. The file is right there on your hard
            drive — the browser reads it, parses it, renders it. So you share the URL with a
            friend in Brazil. They type <code>taproot.local</code> into their browser. Nothing
            appears. Not a slow load — nothing. The server cannot be found. Of course not: your
            laptop is not their laptop. The file lives on your machine, and the network has no idea
            how to route &quot;taproot.local&quot; to your living room. So the question becomes
            harder: how does it <em>ever</em> work? How does your friend in Brazil type{" "}
            <code>taproot-blog.dev</code> into their browser and see exactly the same article that
            you see when you open the same URL on your laptop?
          </p>
          <p className="text-slate-700 dark:text-slate-300">
            This module is different from the others. There is no new file to add to the reference
            app at the end of it. Instead, it makes visible something that has been quietly
            underneath every module you have built so far. Every time the browser loaded a page,
            every time a <code>fetch</code> call went out, this machinery was already running. The
            lesson is the trace itself — from the moment a URL is typed to the moment the user sees
            pixels — and the diagrams carry the load.
          </p>
        </CardContent>
      </Card>

      {/* 2. Mental model */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            Every step in the journey corresponds to a layer in a stack. Layers are distinct but
            each one depends on the one below it: you cannot send an HTTP request without a TLS
            channel, you cannot open a TLS channel without a TCP connection, you cannot open a TCP
            connection without an IP address, and you cannot get an IP address without a DNS lookup.
            Strip away the acronyms and the structure is familiar.
          </p>
          <blockquote className="border-l-4 border-blue-500 pl-4 italic text-slate-600 dark:text-slate-400">
            The internet is a layered postal system.
          </blockquote>
        </CardContent>
      </Card>

      {/* 3. Step-by-step */}
      <h2 className="text-xl font-semibold mb-3">From typed URL to painted pixels</h2>
      <StepByStepExplanation
        title="Tracing one request end-to-end"
        description="Each step answers one sub-question of: what has to be true for someone far away to see what you see?"
        steps={urlToPixelsSteps}
      />

      {/* Optional: sequence diagram (DNS resolution + TCP/TLS handshakes + HTTP exchange) */}
      <SequenceDiagram
        title="DNS, TCP, TLS, and HTTP — the full exchange"
        description="Every named round-trip between browser, DNS resolver, and server before the first HTML byte arrives."
        actors={sequenceActors}
        messages={sequenceMessages}
      />

      {/* Optional: rendering pipeline layered flow */}
      <LayeredFlow
        title="The critical rendering path"
        description="From raw bytes to pixels — each stage must complete before the next can begin."
        stages={renderingPipelineStages}
        direction="horizontal"
      />

      {/* 4. Playground (interactive trace diagram in lieu of a code playground) */}
      <h2 className="text-xl font-semibold mb-3">Interactive trace</h2>
      <InteractiveDiagram
        initialNodes={journeyNodes}
        initialEdges={journeyEdges}
        title="URL to pixels — full journey map"
        description="Drag nodes to explore the flow. Every arrow represents a dependency: the node at the tail must complete before the node at the head can begin."
        height={500}
        interactive={true}
      />

      {/* 5. Challenges */}
      <h2 className="text-xl font-semibold mb-3">Challenges</h2>

      <Challenge
        title="Where does latency matter most for the first byte?"
        question={`A user visits taproot-blog.dev for the very first time from a country far from the server. The trace shows: DNS resolved in 90ms, TCP handshake took 110ms, TLS handshake took 110ms, the server processed the request in 10ms. Which part of the trace dominated the time to first byte — and why does the answer surprise most people?`}
        options={[
          {
            id: "a",
            text: "The server processing time. The 10ms figure seems small but server-side rendering adds up quickly on complex pages.",
          },
          {
            id: "b",
            text: "DNS lookup. Because domain names must be resolved before anything else, DNS is almost always the bottleneck on first visits.",
          },
          {
            id: "c",
            text: "The TCP and TLS handshakes together. Each is a round-trip imposed by the protocol stack, and on a geographically distant server they dwarf both DNS and server processing time.",
          },
          {
            id: "d",
            text: "The browser's URL parsing. Parsing is done in the browser's C++ engine and adds significant overhead before any network request begins.",
          },
        ]}
        correctAnswerId="c"
        explanation={
          <p>
            Most developers blame the server. But server processing here is only 10 ms. The TCP
            handshake (one RTT) and TLS handshake (one more RTT for TLS 1.3, two for TLS 1.2)
            together account for 220 ms — more than double the DNS time and twenty times the server
            time. Both are imposed by the protocol stack regardless of how fast the server is.
            This is why <strong>CDNs</strong> (which terminate TCP and TLS at a geographically
            close edge node) improve time-to-first-byte even when the origin server&apos;s response
            time is unchanged, and why <strong>HTTP/2 connection reuse</strong> matters: reusing an
            already open connection skips these handshakes entirely.
          </p>
        }
      />

      <Challenge
        title="A script in head without defer — what happens?"
        question={`A developer places this in the <head> of the blog's HTML:\n\n<script src="/analytics.js"></script>\n\n(No defer or async attribute.) What happens when the browser's HTML parser reaches this tag?`}
        options={[
          {
            id: "a",
            text: "The parser continues building the DOM in parallel while the script downloads, then executes the script once the DOM is complete.",
          },
          {
            id: "b",
            text: "The parser pauses entirely. It waits for analytics.js to download and execute before it reads another byte of HTML. The <body> is not parsed until the script is done.",
          },
          {
            id: "c",
            text: "The script is ignored because it is in <head> — scripts must be in <body> to execute.",
          },
          {
            id: "d",
            text: "Rendering is blocked but parsing continues. The DOM is built normally; only the screen stays blank until the script runs.",
          },
        ]}
        correctAnswerId="b"
        explanation={
          <p>
            A <code>&lt;script&gt;</code> without <code>defer</code> or <code>async</code>{" "}
            <strong>blocks the parser</strong>. The browser stops reading HTML, fetches the script,
            executes it, then resumes. This is because a synchronous inline script can modify the
            HTML stream — so the parser cannot safely continue until the script is done. The{" "}
            <code>defer</code> attribute changes this: the script downloads in parallel but
            execution is deferred until the DOM is fully parsed, so the parser is never blocked.
            Placing scripts at the bottom of <code>&lt;body&gt;</code> achieves a similar result
            because the DOM is already complete by the time the parser reaches them. The practical
            effect of a blocking script in <code>&lt;head&gt;</code>: everything below — including
            the article text — is invisible until the script finishes.
          </p>
        }
      />

      {/* 6. GotchaList */}
      <h2 className="text-xl font-semibold mb-3">Things that surprise people</h2>
      <GotchaList items={gotchaItems} />

      {/* 7. KeyTakeaways */}
      <KeyTakeaways
        mentalModel="The internet is a layered postal system."
        points={[
          <>
            A URL has six parts: scheme, host, port, path, query, fragment. The fragment never
            leaves the browser. The host is what the rest of the journey depends on.
          </>,
          <>
            <em>DNS</em> translates a human-readable host name into an <em>IP</em> address by
            walking a distributed tree: root &rarr; TLD &rarr; authoritative nameserver &rarr; A
            record. Every answer is cached with a TTL. Cold first visits pay the full tree walk;
            warm visits skip it entirely.
          </>,
          <>
            <em>TCP</em> establishes a reliable channel in one round-trip (SYN &rarr; SYN-ACK
            &rarr; ACK). <em>TLS</em> then encrypts and authenticates that channel — it proves the
            server is who it claims to be, not just that the channel is private. Together they can
            cost 200+ ms on a distant server. CDNs and connection reuse exist precisely to
            amortize this cost.
          </>,
          <>
            <em>HTTP</em> runs over the TLS-encrypted TCP connection. A GET request arrives as
            plaintext bytes inside that encrypted envelope. The server responds with HTML bytes.
            Everything in module 2-3 (methods, status codes, <code>fetch</code>) happens here.
          </>,
          <>
            The browser parses HTML into the <em>DOM</em> and CSS into the <em>CSSOM</em>{" "}
            incrementally. A <code>&lt;script&gt;</code> without <code>defer</code>/
            <code>async</code> blocks the parser. A stylesheet blocks <em>rendering</em>. The{" "}
            <em>render tree</em> combines both; <em>layout</em> positions boxes; <em>paint</em>{" "}
            fills pixels; <em>composite</em> stacks layers. <em>First Contentful Paint</em> and{" "}
            <em>Largest Contentful Paint</em> measure distinct moments in this pipeline.
          </>,
        ]}
      />
    </div>
  );
}
