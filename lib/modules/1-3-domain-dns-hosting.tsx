"use client";

import { Card, CardContent } from "@/components/ui/card";
import { HTMLPlayground } from "@/components/CodePlayground";
import { StepByStepExplanation, Step } from "@/components/StepByStepExplanation";
import { SequenceDiagram } from "@/components/SequenceDiagram";
import { Challenge } from "@/components/Challenge";
import { GotchaList } from "@/components/GotchaList";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { RoadmapLink } from "@/components/RoadmapLink";

export function Module_1_3_Content() {
  // Data blocks hoisted out of JSX for readability — listed in render order.
  const domainSetupSteps: Step[] = [
    {
      title: "Step 1: Anatomy of a domain name",
      description: (
        <>
          A <em>domain name</em> — a human-readable name like <code>example.com</code>, structured as
          labels separated by dots — is read right-to-left. The trailing dot you never type is the{" "}
          <em>root</em>, the absolute top of the DNS tree. Next is the <em>TLD (top-level domain)</em>{" "}
          — the right-most label of a domain (<code>.com</code>, <code>.sh</code>, <code>.org</code>).
          Then comes the registered name — <code>example</code> — which you own once you pay the
          registrar. Any labels to the left of the registered name are <em>subdomains</em>: in{" "}
          <code>app.example.com.</code> the subdomain is <code>app</code>, the registered name is{" "}
          <code>example</code>, the TLD is <code>com</code>, and the trailing dot is the root.
          Subdomains live in DNS records you control — they cost nothing extra and you can create as
          many as you need.
        </>
      ),
      code: `# Full qualified domain name (FQDN) breakdown:
#
#   app.example.com.
#   │   │       │  └── root (the implicit ".")
#   │   │       └───── TLD  (.com, .sh, .org ...)
#   │   └───────────── registered name (you own this)
#   └───────────────── subdomain (you control this via DNS records)
#
# "example.com" is the apex/root domain.
# "app.example.com" is a subdomain of it.`,
    },
    {
      title: "Step 2: Registrar vs DNS host vs server",
      description: (
        <>
          Three services that beginners routinely conflate. A <em>registrar</em> (Namecheap, Google
          Domains, Cloudflare Registrar) sells you the exclusive right to use the name for a year or
          more — it does not serve your content or even answer DNS queries by default. A{" "}
          <em>DNS host</em> runs the nameservers that answer queries about your domain; you create
          records there. A <em>hosting</em> service — a service that runs your code or files on a
          machine reachable from the internet — is where the actual content lives. These are often
          three different bills and three different control panels. Cloudflare is unusual because it
          can be all three at once, which is why beginners who start there are surprised when
          switching registrars does not move their DNS records.
        </>
      ),
      code: `# Three separate services:
#
#  Registrar    → owns the name, delegates nameservers
#  DNS host     → answers "what IP is app.example.com?"
#  Hosting      → serves the HTML/CSS/JS/APIs at that IP
#
# A typical Vercel setup:
#   Registrar:  Namecheap (bought "example.com")
#   DNS host:   Cloudflare (free, fast, DDoS protection)
#   Hosting:    Vercel (runs Next.js, assigned 76.76.21.21)
#
# When you "add a domain" on Vercel, it tells you to
# create DNS records at your DNS host — not at your registrar.`,
    },
    {
      title: "Step 3: The five common record types",
      description: (
        <>
          Every record has the shape <code>name TTL class type value</code>, but in practice you only
          fill in the name and value — the DNS host infers the rest. An <em>A record</em> — a DNS
          record that maps a name to an IPv4 address — is the most common: <code>app</code> pointing
          to <code>76.76.21.21</code>. An <em>AAAA record</em> — a DNS record that maps a name to an
          IPv6 address — is the same idea for the newer address space. A <em>CNAME record</em> — a
          DNS record that aliases one name to another name — is used when the target is itself a
          hostname, not a raw IP. An MX record specifies the mail server for the domain; without one
          your email will not route. A TXT record holds arbitrary text and is used by SPF (email
          sender policy), DKIM keys, and domain-ownership verification tokens from platforms like
          Google Search Console or GitHub.
        </>
      ),
      code: `# The five you will use regularly:
#
#  app.example.com.   300  IN  A     76.76.21.21
#  app.example.com.   300  IN  AAAA  2606:4700::6810:1500
#  www.example.com.   300  IN  CNAME app.example.com.
#  example.com.      3600  IN  MX 10 mail.example.com.
#  example.com.      3600  IN  TXT   "v=spf1 include:_spf.google.com ~all"
#
#  A      → name to IPv4
#  AAAA   → name to IPv6
#  CNAME  → name to another name (not usable at the apex)
#  MX     → which server receives email
#  TXT    → free-form text (SPF, DKIM, domain verification)`,
    },
    {
      title: "Step 4: TTL is the worst-case lock-in",
      description: (
        <>
          Every DNS record carries a <em>TTL (DNS)</em> — the number of seconds a DNS record may be
          cached before it must be re-fetched. When you change a record, every resolver that already
          cached the old value will keep serving it until its TTL expires. A TTL of 3600 means a
          wrong answer can persist for a full hour on every resolver worldwide. The fix is to lower
          the TTL to 60 or 300 seconds a day or two before a planned change, let the short TTL
          propagate, make the change, then raise it again. Lower TTL means more DNS queries and
          slightly higher latency for cold visitors, but that is a fine trade during a migration.
        </>
      ),
      code: `# TTL checklist for a planned migration:
#
#  T-48h  lower TTL to 300 s (wait for old TTL to expire)
#  T-0    make the record change
#  T+5m   test from multiple locations (dnschecker.org)
#  T+24h  raise TTL back to 3600 s
#
#  Quick check — current TTL on a record:
#  $ dig app.example.com +short
#  76.76.21.21
#  $ dig app.example.com | grep -i ttl
#  ;; ANSWER SECTION:
#  app.example.com.  42  IN  A  76.76.21.21
#                    ↑ 42 seconds left until cache expires`,
    },
    {
      title: "Step 5: Pick a hosting shape",
      description: (
        <>
          <em>Static hosting</em> — hosting that serves pre-built files unchanged with no per-request
          server logic — is the right default. Platforms like Vercel, Netlify, and Cloudflare Pages
          accept a build output directory and serve it globally via a <em>CDN (Content Delivery
          Network)</em> — a globally distributed cache that serves static assets from a node
          geographically near the user. For apps with per-request computation — authentication
          callbacks, form handlers, database reads — a serverless-function layer handles individual
          invocations without you managing a server. A VPS gives you a full Linux machine: you
          control the OS, run a Node.js server, attach a database, configure Nginx. The price of that
          control is ops burden. Choose static hosting by default, add serverless functions when you
          need per-request compute, and choose a VPS only when you genuinely need OS-level access or
          a persistent process.
        </>
      ),
      code: `# Hosting decision tree:
#
#  Is the site purely pre-built files (HTML/CSS/JS)?
#  └─ YES → Static hosting + CDN (Vercel, Netlify, Cloudflare Pages)
#           Cost: ~$0/month for most sites
#           Ops:  deploy a folder, done.
#
#  Does it need per-request logic (auth, API calls)?
#  └─ YES → Static hosting + serverless functions
#           Cost: per invocation, scales to zero
#           Ops:  write functions, platform handles scaling
#
#  Does it need a persistent process or OS-level access?
#  └─ YES → VPS (DigitalOcean, Hetzner, AWS EC2)
#           Cost: $5–20/month minimum even when idle
#           Ops:  you manage OS, updates, monitoring`,
    },
    {
      title: "Step 6: CDN — same content, many locations",
      description: (
        <>
          A CDN takes your static files — HTML, CSS, JS, images, fonts — and replicates them to edge
          nodes worldwide. When a visitor in Singapore loads your site, they receive the files from a
          node in Singapore rather than your origin server in the US. That eliminates a full
          cross-ocean round-trip from every resource request. Most static-hosting platforms give you
          this for free: your deployment is automatically distributed. For dynamic content generated
          per request, you can still use a CDN but you must set explicit <code>Cache-Control</code>{" "}
          headers to tell edge nodes whether they may cache the response and for how long. Serving
          stale content is a common bug when cache headers are not thought through — the CDN will
          happily serve a 5-year-old API response if you told it to.
        </>
      ),
      code: `# Static asset — safe to cache aggressively:
Cache-Control: public, max-age=31536000, immutable
#  (browser and CDN cache for 1 year; file names include a hash)

# HTML page — you want visitors to see fresh content:
Cache-Control: public, max-age=0, must-revalidate
#  (CDN may store it but must revalidate on every request)

# Private API response — never share between users:
Cache-Control: private, no-store
#  (CDN must not cache; each user gets their own response)`,
    },
  ];

  const playgroundHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>DNS Lookup Simulator</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <h2>DNS Lookup Simulator</h2>
  <p class="hint">Type a domain and click Lookup to simulate a <code>dig</code>-style DNS query.</p>
  <div class="input-row">
    <input id="domain-input" type="text" value="vercel.com" placeholder="e.g. vercel.com" />
    <button id="lookup-btn">Lookup</button>
  </div>
  <pre id="output" class="output">Result will appear here&hellip;</pre>
  <script src="/script.js"></script>
</body>
</html>`;

  const playgroundCss = `body {
  font-family: system-ui, sans-serif;
  max-width: 660px;
  margin: 24px auto;
  padding: 0 16px;
  color: #1e293b;
}
h2 { margin-bottom: 4px; font-size: 1.1rem; }
.hint { font-size: 0.82rem; color: #64748b; margin-bottom: 16px; }
.input-row { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.95rem;
  font-family: monospace;
}
input:focus { outline: 2px solid #3b82f6; border-color: transparent; }
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
.output {
  background: #0f172a;
  color: #e2e8f0;
  padding: 16px;
  border-radius: 8px;
  font-family: monospace;
  font-size: 0.8rem;
  min-height: 160px;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-all;
}
.comment { color: #64748b; }
.record-type { color: #38bdf8; font-weight: bold; }
.value { color: #86efac; }
.ttl { color: #fbbf24; }`;

  const playgroundJs = `// Try this: type "vercel.com", then "github.com", then "example.com" to see
// different A records and TTLs. Then change one of the records in the
// RECORDS object below and see the effect — that is the developer's view.

const RECORDS = {
  "vercel.com": {
    A:    [{ value: "76.76.21.21",    ttl: 60  }],
    AAAA: [{ value: "2606:4700::1",   ttl: 60  }],
    MX:   [{ value: "10 mail.vercel.com.", ttl: 3600 }],
    TXT:  [{ value: "v=spf1 include:_spf.google.com ~all", ttl: 3600 }],
  },
  "github.com": {
    A:    [
      { value: "140.82.113.3",  ttl: 60 },
      { value: "140.82.114.4",  ttl: 60 },
    ],
    AAAA: [],
    MX:   [{ value: "1 aspmx.l.google.com.", ttl: 3600 }],
    TXT:  [{ value: "v=spf1 ip4:192.30.252.0/22 include:_netblocks.google.com ~all", ttl: 3600 }],
  },
  "example.com": {
    A:    [{ value: "93.184.216.34", ttl: 86400 }],
    AAAA: [{ value: "2606:2800:220:1:248:1893:25c8:1946", ttl: 86400 }],
    MX:   [],
    TXT:  [{ value: "v=spf1 -all", ttl: 86400 }],
  },
};

function formatOutput(domain, records) {
  const lines = [];
  lines.push(\`; <<>> dig \${domain} ANY <<>>\`);
  lines.push(\`;\`);
  lines.push(\`;; ANSWER SECTION:\`);
  let any = false;
  for (const [type, entries] of Object.entries(records)) {
    for (const entry of entries) {
      const name = domain.padEnd(24, ' ');
      const ttl  = String(entry.ttl).padEnd(8, ' ');
      lines.push(\`\${name} \${ttl} IN  \${type.padEnd(5)} \${entry.value}\`);
      any = true;
    }
  }
  if (!any) lines.push(\`;; (no records found)\`);
  lines.push(\`\`);
  lines.push(\`;; TTL note: A records cached for \${records.A[0]?.ttl ?? '?'} s by resolvers.\`);
  lines.push(\`;; Change one TTL in RECORDS above and reload to see the effect.\`);
  return lines.join('\\n');
}

document.getElementById('lookup-btn').addEventListener('click', () => {
  const domain = document.getElementById('domain-input').value.trim().toLowerCase();
  const out = document.getElementById('output');
  const records = RECORDS[domain];
  if (records) {
    out.textContent = formatOutput(domain, records);
  } else {
    out.textContent = \`; <<>> dig \${domain} ANY <<>>\\n;\\n;; NXDOMAIN — \${domain} is not in our simulator.\\n;; Try: vercel.com, github.com, or example.com\`;
  }
});

// Run the default lookup on page load
document.getElementById('lookup-btn').click();`;

  return (
    <div className="space-y-8">

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 1: Hook                                                       */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Card>
        <CardContent className="pt-6">
          <div className="prose dark:prose-invert max-w-none">
            <p>
              You bought <code>myapp.com</code>. Now what? An hour later you are pasting{" "}
              <code>nameservers</code>, <code>A records</code>, <code>CNAME</code>, <code>TTL</code>{" "}
              into config screens, getting cryptic errors, and wondering why a simple domain name needs
              four hours of work. Every platform throws its own instruction page at you: Vercel says{" "}
              &quot;add a CNAME,&quot; Google Workspace says &quot;add a TXT,&quot; your email
              provider says &quot;add an MX,&quot; and none of them explain why these are different
              things or what the difference matters.
            </p>
            <p>
              The shape of the system is simple — six concepts — you just need them in the right order.
              By the end of this module you will know what each DNS record does, why TTL is the one
              value that bites you if you ignore it, and how to pick the right hosting shape so the
              domain you bought actually serves your site.
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
              A domain name is just a label. The DNS layer translates that label into an IP address.
              The IP address belongs to a server that runs your code or serves your files. Those are
              three distinct things — three different services, three different control panels, sometimes
              three different companies. Once you see the separation, every instruction on every
              hosting platform makes sense: they are asking you to update the DNS layer to point the
              label at their server. A CDN is the same content replicated to many servers so users hit
              a nearby copy instead of one far away. TTL is how long the old answer lingers in caches
              after you make a change.
            </p>
            <blockquote className="border-l-4 border-blue-500 pl-4 italic">
              &quot;Domain &rarr; DNS &rarr; IP &rarr; Server. A CDN is the same content, geographically
              duplicated. TTL is how long the wrong answer stays cached.&quot;
            </blockquote>
          </div>
        </CardContent>
      </Card>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 3: Step-by-step                                               */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <StepByStepExplanation
        title="From a fresh domain to a reachable site"
        description="Six concepts in the order you encounter them"
        steps={domainSetupSteps}
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 4: Live playground                                            */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <HTMLPlayground
        html={playgroundHtml}
        css={playgroundCss}
        js={playgroundJs}
        title="DNS lookup simulator"
        description="Type a domain and see its simulated DNS records. Change TTL values in the RECORDS table to feel how the cache lock-in varies."
      />

      {/* Optional: Sequence diagram (registrar → DNS → hosting) */}
      <SequenceDiagram
        title="Buying a domain to serving a page"
        description="Three services that beginners conflate"
        actors={["You", "Registrar", "DNS host", "Hosting"]}
        messages={[
          { from: "You", to: "Registrar", label: "buy myapp.com" },
          { from: "Registrar", to: "You", label: "you own the name" },
          { from: "You", to: "DNS host", label: "delegate nameservers", note: "registrar → dns host" },
          { from: "You", to: "DNS host", label: "add A record → 76.76.21.21" },
          { from: "You", to: "Hosting", label: "deploy code @ 76.76.21.21" },
          { from: "Hosting", to: "You", label: "site reachable" },
        ]}
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 5: Challenges                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Challenge
        question="You want app.example.com to point at a Vercel deployment whose URL is myapp-xyz.vercel.app. Which DNS record fits?"
        options={[
          { id: "a", text: "A app.example.com. → 76.76.21.21" },
          { id: "b", text: "CNAME app.example.com. → myapp-xyz.vercel.app." },
          { id: "c", text: "MX app.example.com. → myapp-xyz.vercel.app." },
          { id: "d", text: "TXT app.example.com. → \"vercel:verify=...\"" },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            A <code>CNAME</code> aliases one name to another, which is exactly what you need when the
            target is a domain rather than an IP that may change. An <code>A</code> record would work
            initially but breaks if Vercel changes the underlying IP, forcing you to update the record
            manually. <code>MX</code> is for routing email, not web traffic. <code>TXT</code> is
            required for some Vercel verification steps but it does not route any traffic — you need
            the <code>CNAME</code> for the actual request to reach Vercel.
          </>
        }
      />

      <Challenge
        question="You are deploying a static marketing site for a small business. Which hosting shape fits?"
        options={[
          { id: "a", text: "A self-managed VPS with Nginx and a CI deploy script." },
          { id: "b", text: "A static-hosting platform with a CDN (Vercel, Netlify, Cloudflare Pages)." },
          { id: "c", text: "A Kubernetes cluster with autoscaling." },
          { id: "d", text: "A serverless-functions platform with no static-asset support." },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            Static-hosting platforms ship the site as plain files distributed via a CDN — fastest
            delivery, lowest cost, zero ops burden. A VPS works but is overkill: you maintain the OS,
            security patches, and uptime for a problem a CDN solves for free. Kubernetes is
            industrial-grade orchestration for problems a static site does not have. Serverless
            functions are designed for per-request compute, not for serving static assets — and a
            marketing site has no per-request compute to speak of.
          </>
        }
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 6: GotchaList                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <GotchaList
        items={[
          {
            title: "TTL is the worst-case lock-in for a record change — lower it 24 hours before a planned move",
            body: (
              <>
                If you change an <code>A</code> record with a 3600-second TTL, every resolver in the
                world may serve the old IP for up to an hour. Lower the TTL to 300 seconds a day before
                the switch, wait for the current TTL to expire, then make the change. Raise it back to
                3600 once you confirm traffic is flowing correctly.
              </>
            ),
          },
          {
            title: "CNAMEs can chain but each hop is a separate DNS lookup — keep chains shallow",
            body: (
              <>
                <code>www</code> &rarr; <code>app.example.com</code> &rarr; <code>myapp.vercel.app</code>{" "}
                is two lookups instead of one. Some resolvers impose a maximum chain depth (commonly 8),
                and each hop adds latency. Keep your CNAME chains to one hop where possible; point
                directly at the final hostname the platform gives you.
              </>
            ),
          },
          {
            title: "Apex (root) records cannot CNAME — use ALIAS, ANAME, or a flat A record at example.com",
            body: (
              <>
                The DNS spec forbids a CNAME at the apex (<code>example.com.</code>) because an apex
                must also carry SOA and NS records, and a CNAME would conflict. Most modern DNS hosts
                offer a proprietary &quot;ALIAS&quot; or &quot;ANAME&quot; record type that looks up
                the CNAME target and serves its resolved IP, giving you CNAME behaviour at the apex.
                If your DNS host lacks this, use the flat IP Vercel or Cloudflare publishes for apex
                records.
              </>
            ),
          },
          {
            title: "Free-tier hosting limits often surface as cryptic 503s, not error pages — read the platform's status before debugging your code",
            body: (
              <>
                Vercel, Netlify, and Cloudflare Pages all have generous free tiers with bandwidth or
                function-invocation limits. When a limit is hit the platform typically returns a 5xx
                response with little explanation. Before spending hours debugging your application code,
                check the platform&apos;s status page and your account&apos;s usage dashboard.
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
            A domain is just a <em>name</em>; the DNS layer maps it to an IP; the IP belongs to a
            server. Three layers, three different services, three different bills.
          </>,
          <>
            The five common DNS records cover most needs: <code>A</code> (name &rarr; IPv4),{" "}
            <code>AAAA</code> (name &rarr; IPv6), <code>CNAME</code> (name &rarr; another name),{" "}
            <code>MX</code> (mail server), <code>TXT</code> (SPF, verification). Knowing which one to
            reach for is most of the job.
          </>,
          <>
            TTL governs how long the wrong answer stays cached — lower it before changes, raise it
            back after. A 3600-second TTL on migration day is a one-hour outage window you did not
            need.
          </>,
          <>
            Pick hosting by what your app needs to run: static-hosting + CDN by default, serverless
            for per-request compute, VPS only when you genuinely need OS control or a persistent
            process.
          </>,
          <>
            A CDN replicates the same content to edge nodes worldwide so visitors always hit a nearby
            copy. Static-hosting platforms give you this for free; dynamic content requires explicit{" "}
            <code>Cache-Control</code> headers to work correctly.
          </>,
        ]}
        mentalModel="Domain → DNS → IP → Server. A CDN is the same content, geographically duplicated. TTL is how long the wrong answer stays cached."
      />
    </div>
  );
}
