"use client";

import { ScaffoldModule } from "./_template";
import { CodeBlock } from "@/components/CodeBlock";

const queryCode = `# The client authors the query — the server returns exactly this shape.
# Variables are typed and validated against the schema at parse time.

query AuthorWithBooks($id: ID!) {
  author(id: $id) {
    name
    bio
    books(limit: 5) {
      title
      publishedYear
      genre
    }
  }
}`;

const responseJson = `{
  "data": {
    "author": {
      "name": "Martin Fowler",
      "bio": "Software engineer, author, and speaker on software design.",
      "books": [
        { "title": "Refactoring",              "publishedYear": 1999, "genre": "Software Engineering" },
        { "title": "Patterns of Enterprise Application Architecture",
                                               "publishedYear": 2002, "genre": "Software Engineering" },
        { "title": "Domain-Specific Languages", "publishedYear": 2010, "genre": "Software Engineering" },
        { "title": "NoSQL Distilled",           "publishedYear": 2012, "genre": "Databases" },
        { "title": "Refactoring (2nd ed)",      "publishedYear": 2018, "genre": "Software Engineering" }
      ]
    }
  }
}`;

export function Module_7_3_Content() {
  return (
    <ScaffoldModule
      emoji="🔍"
      problemTitle="One query, exactly the data you need"
      problem={
        <>
          <p>
            REST endpoints return whatever shape the server decided. If{" "}
            <code>GET /authors/42</code> returns a 30-field object but your UI
            only needs <code>name</code> and <code>books</code>, you are
            over-fetching. If the books list requires a second request to{" "}
            <code>GET /authors/42/books</code>, you are under-fetching. GraphQL
            solves both problems by letting the{" "}
            <strong>client write the query</strong> — the server returns exactly
            that shape, nothing more, nothing less.
          </p>
          <p>
            The server publishes a <strong>schema</strong> — a typed graph of
            every available type, field, query, and mutation. Clients pick the
            fields they want; the resolver layer stitches data from databases,
            microservices, or caches and returns a single JSON response. Schema
            introspection powers developer tooling like GraphiQL and VS Code
            auto-complete. The two dominant client libraries are{" "}
            <strong>Apollo Client</strong> (flexible, large ecosystem, good for
            most apps) and <strong>Relay</strong> (stricter conventions,
            compiler-driven, optimised for large Facebook-scale apps).
          </p>
          <p>
            Caching in GraphQL works differently from REST. Because every
            request hits the same <code>/graphql</code> endpoint, HTTP caching
            by URL does not apply. Instead, Apollo and Relay cache{" "}
            <strong>by object identity</strong> — each object is stored under
            its <code>id</code>, and any query that returns the same object
            automatically gets a cache hit regardless of which fields were
            requested. This normalised cache prevents stale data and reduces
            duplicate network requests across components.
          </p>
        </>
      }
      body={
        <>
          <CodeBlock
            language="graphql"
            fileName="get-author-with-books.graphql"
            code={queryCode}
          />
          <div className="mt-4">
            <CodeBlock
              language="json"
              fileName="response.json"
              code={responseJson}
            />
          </div>
        </>
      }
      challenge={{
        question: "Why does GraphQL eliminate over-fetching?",
        options: [
          {
            id: "a",
            text: "GraphQL compresses responses automatically, so they're always smaller than REST.",
          },
          {
            id: "b",
            text: "The server caches every query by URL so repeated requests never hit the database.",
          },
          {
            id: "c",
            text: "The client specifies exactly which fields it wants — the server returns only those fields, instead of a fixed REST resource shape.",
          },
          {
            id: "d",
            text: "GraphQL uses WebSockets so data is streamed incrementally instead of sent all at once.",
          },
        ],
        correctAnswerId: "c",
        explanation: (
          <>
            In REST, the server controls the response shape — you get all fields
            regardless of what you need. GraphQL inverts this: the client writes
            a query listing exactly the fields it wants, and the server&apos;s
            resolver returns only those fields. If you ask for{" "}
            <code>name</code> and <code>books.title</code>, that is all you
            get. No unused payload bytes, no extra round-trips for nested
            resources.
          </>
        ),
      }}
      takeaways={[
        <>
          GraphQL uses a <strong>typed schema</strong> as a contract between
          client and server. Queries, mutations, and subscriptions are all
          validated against it at parse time.
        </>,
        <>
          Clients declare <em>exactly</em> the fields they need — no
          over-fetching (too much data) or under-fetching (needing a second
          request for related data).
        </>,
        <>
          Apollo and Relay cache by <strong>object identity</strong> (
          <code>id</code> field), not by URL — enabling a normalised,
          cross-component cache that REST cannot replicate without bespoke logic.
        </>,
      ]}
      mentalModel="Schema-first design. Client asks; server fulfills exactly. Caching by id, not by URL."
      roadmapUrl="https://roadmap.sh/frontend"
    />
  );
}
