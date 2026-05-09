"use client";
import { ScaffoldModule } from "./_template";
import { CodeBlock } from "@/components/CodeBlock";

export function Module_1_3_Content() {
  return (
    <ScaffoldModule
      emoji="🏷️"
      problemTitle="I bought a domain. Now what?"
      problem={
        <>
          <p>
            You register <code>myapp.dev</code> on a domain registrar and
            suddenly stare at a control panel full of cryptic fields. A domain
            name is just a human-readable alias; computers need a numeric IP
            address to route traffic. The <strong>Domain Name System (DNS)</strong>{" "}
            is the global phone book that translates one into the other, and
            every record type in that book serves a specific purpose.
          </p>
          <p>
            An <strong>A record</strong> maps your domain to an IPv4 address
            (e.g. <code>203.0.113.42</code>). An <strong>AAAA record</strong>{" "}
            does the same for IPv6. A <strong>CNAME</strong> (canonical name)
            is an alias that points one hostname to another hostname instead of
            a raw IP &mdash; useful when your CDN or hosting provider rotates
            IPs without warning you. <strong>MX records</strong> tell the
            internet which server should receive email for your domain.{" "}
            <strong>TXT records</strong> hold arbitrary text, most often used
            to prove domain ownership to Google, GitHub, or a certificate
            authority.
          </p>
          <p>
            DNS changes do not take effect instantly. Each record has a{" "}
            <strong>TTL (Time To Live)</strong> measured in seconds, which
            controls how long resolvers around the world cache the answer.
            Lower TTLs give you faster propagation during a migration; higher
            TTLs reduce latency in steady state.
          </p>
          <p>
            Once DNS is sorted, you need somewhere to deploy your code.{" "}
            <strong>Static hosting</strong> platforms (Vercel, Netlify,
            Cloudflare Pages) serve pre-built HTML/CSS/JS from a global CDN
            with zero server management &mdash; ideal for Next.js, Astro, or
            any site with no server-side secrets. A{" "}
            <strong>VPS (Virtual Private Server)</strong> like DigitalOcean
            Droplets or Hetzner gives you a full Linux machine where you can
            run Node.js, databases, or Docker containers. Managed{" "}
            <strong>serverless</strong> platforms (AWS Lambda, Vercel Functions,
            Cloudflare Workers) execute individual functions on demand and scale
            to zero when idle.
          </p>
          <p>
            The right choice depends on your traffic pattern, operational
            maturity, and budget. A marketing site ships fastest on static
            hosting; a realtime auction backend might need a persistent VPS.
            Understanding DNS lets you point any of these at your domain in
            under five minutes.
          </p>
        </>
      }
      body={
        <CodeBlock
          language="bash"
          fileName="dns-lookup.sh"
          code={`# Quick A record lookup
$ dig roadmap.sh +short
172.67.136.31
104.21.52.100

# All DNS records for the domain
$ dig roadmap.sh ANY +noall +answer
roadmap.sh.    300   IN  A      172.67.136.31
roadmap.sh.    300   IN  A      104.21.52.100
roadmap.sh.    300   IN  AAAA   2606:4700:3037::ac43:881f
roadmap.sh.    300   IN  MX  10 mail.roadmap.sh.
roadmap.sh.   3600   IN  TXT    "v=spf1 include:_spf.google.com ~all"`}
        />
      }
      challenge={{
        question: "You want to point blog.myapp.dev at a CDN that may change its IP addresses at any time. Which DNS record type should you use?",
        options: [
          { id: "a", text: "A record pointing to the CDN's current IP" },
          { id: "b", text: "CNAME record pointing to the CDN's hostname" },
          { id: "c", text: "MX record pointing to the CDN hostname" },
          { id: "d", text: "TXT record with the CDN's hostname" },
        ],
        correctAnswerId: "b",
        explanation: (
          <>
            A <strong>CNAME</strong> maps your subdomain to the CDN&apos;s own
            hostname, so when the CDN updates its IP the change propagates
            automatically without you touching your DNS panel. An A record
            would break as soon as the CDN rotates its IPs. MX and TXT records
            serve email and verification purposes respectively, not traffic
            routing.
          </>
        ),
      }}
      takeaways={[
        <>DNS translates human-friendly domain names into IP addresses using a hierarchy of A, AAAA, CNAME, MX, and TXT records.</>,
        <>TTL controls how long resolvers cache your DNS answers &mdash; lower TTL speeds up migrations, higher TTL improves performance.</>,
        <>Static hosting (Vercel/Netlify), VPS (DigitalOcean), and serverless (AWS Lambda) are three tiers with different cost, control, and complexity tradeoffs.</>,
      ]}
      mentalModel="DNS is a phone book: your domain is the name, the IP address is the number, and the record type tells callers what kind of line they&apos;re reaching."
      roadmapUrl="https://roadmap.sh/frontend"
    />
  );
}
