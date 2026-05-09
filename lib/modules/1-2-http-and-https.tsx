"use client";
import { ScaffoldModule } from "./_template";
import { CodeBlock } from "@/components/CodeBlock";

export function Module_1_2_Content() {
  return (
    <ScaffoldModule
      emoji="📨"
      problemTitle="HTTP is a stateless conversation"
      problem={
        <>
          <p>
            Every time your browser fetches a page or your app calls an API, the
            same three-act drama plays out: the client sends a <strong>request</strong>,
            the server returns a <strong>status code</strong> plus a{" "}
            <strong>response body</strong>, and then the connection forgets you
            ever existed. There is no session, no memory between calls &mdash;
            each request stands completely alone.
          </p>
          <p>
            The <strong>HTTP method</strong> carried in that request tells the
            server what you want to do. <code>GET</code> reads without side
            effects, <code>POST</code> creates a new resource, <code>PUT</code>{" "}
            replaces an existing resource wholesale, <code>PATCH</code> updates
            only selected fields, and <code>DELETE</code> removes it. Browsers
            can only natively issue <code>GET</code> and <code>POST</code> from
            HTML forms; everything else requires JavaScript or a dedicated
            client.
          </p>
          <p>
            <strong>Status codes</strong> group by hundreds so you can interpret
            them at a glance: <em>1xx</em> informational, <em>2xx</em> success,{" "}
            <em>3xx</em> redirection, <em>4xx</em> the client made a mistake,{" "}
            <em>5xx</em> the server failed. A <code>200 OK</code> means the
            resource was found and returned; <code>201 Created</code> means a
            new resource was made; <code>404 Not Found</code> means the server
            has no idea what you asked for; <code>500 Internal Server Error</code>{" "}
            means the server crashed trying to help you.
          </p>
          <p>
            <strong>HTTPS</strong> is not a different protocol &mdash; it is
            plain HTTP wrapped in a TLS (Transport Layer Security) handshake.
            Before a single byte of your request is sent, the client and server
            negotiate encryption keys so that any eavesdropper sees only
            ciphertext. This is why HTTPS is mandatory for login forms, payment
            pages, and any API endpoint that handles sensitive data.
          </p>
          <p>
            Understanding the raw text of an HTTP exchange demystifies every
            networking concept that builds on top of it: REST APIs, cookies,
            caching headers, CORS preflight requests, and WebSockets all start
            from this same foundation.
          </p>
        </>
      }
      body={
        <CodeBlock
          language="http"
          fileName="raw-exchange.http"
          code={`GET /api/users/42 HTTP/1.1
Host: api.example.com
Accept: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...

--- response ---

HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: max-age=60
X-Request-Id: a3f9c2d1

{
  "id": 42,
  "name": "Ada Lovelace",
  "email": "ada@example.com"
}`}
        />
      }
      challenge={{
        question: "Which HTTP status code means the server successfully created a new resource?",
        options: [
          { id: "a", text: "200 OK" },
          { id: "b", text: "201 Created" },
          { id: "c", text: "204 No Content" },
          { id: "d", text: "301 Moved Permanently" },
        ],
        correctAnswerId: "b",
        explanation: (
          <>
            <code>201 Created</code> is the correct response after a successful{" "}
            <code>POST</code> that produced a new resource; the server typically
            also returns a <code>Location</code> header pointing to it.{" "}
            <code>200 OK</code> means the request succeeded and a body was
            returned, but it does not imply creation. <code>204 No Content</code>{" "}
            means success with an empty response body, often used for{" "}
            <code>DELETE</code> or <code>PUT</code>.
          </>
        ),
      }}
      takeaways={[
        <>HTTP is stateless: every request is independent and carries all the context the server needs.</>,
        <>Methods encode intent (GET reads, POST creates, PUT replaces, PATCH tweaks, DELETE removes) and status codes group by hundreds.</>,
        <>HTTPS is HTTP inside a TLS envelope &mdash; same protocol, encrypted transport, mandatory for sensitive data.</>,
      ]}
      mentalModel="HTTP is a postcard &mdash; short, stamped, and stateless. HTTPS just puts the postcard in a sealed envelope."
      roadmapUrl="https://roadmap.sh/frontend"
    />
  );
}
