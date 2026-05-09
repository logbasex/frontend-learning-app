"use client";

import { Card, CardContent } from "@/components/ui/card";
import { HTMLPlayground } from "@/components/CodePlayground";
import { StepByStepExplanation, Step } from "@/components/StepByStepExplanation";
import { Challenge } from "@/components/Challenge";
import { GotchaList } from "@/components/GotchaList";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { RoadmapLink } from "@/components/RoadmapLink";

export function Module_7_3_Content() {
  // Data blocks hoisted out of JSX for readability — listed in render order.
  const graphqlEndToEndSteps: Step[] = [
    {
      title: "Step 1: The schema is the contract",
      description: (
        <>
          Everything in GraphQL flows from the <strong>schema</strong> — the contract that defines
          available types, queries, mutations, and subscriptions. Both client and server agree on this
          shape before any request is made. A type is just a named set of fields; a query root lists
          the top-level things a client may ask for. Once the schema is published, a tool like GraphiQL
          can read it via introspection and give you autocomplete, validation, and inline docs —
          entirely from the type definitions.
        </>
      ),
      code: `# A minimal GraphQL schema
type User {
  id: ID!          # "!" means non-null — the field is guaranteed
  name: String!
  email: String!
  posts: [Post!]!  # A list of Post objects; neither the list nor its items are null
}

type Post {
  id: ID!
  title: String!
  body: String
  author: User!
}

# The root Query type is the entry point
type Query {
  user(id: ID!): User          # Returns a single User (or null)
  posts(limit: Int): [Post!]!  # Returns a list of Posts
}`,
    },
    {
      title: "Step 2: Queries pick fields",
      description: (
        <>
          A query is a declaration of exactly which fields the client wants. You name the entry point
          (e.g. <code>user</code>), pass any arguments, then open braces to list sub-fields. The
          server returns a JSON object whose shape mirrors that query — nothing more. If you ask for
          <code> name</code> and <code>email</code>, you get exactly those two fields. The 200 KB
          REST payload that your dashboard was ignoring 196 KB of simply does not exist.
        </>
      ),
      code: `# Request exactly what the dashboard needs — nothing else
query {
  user(id: "42") {
    name
    email
    posts {
      title
    }
  }
}

# Response mirrors the query shape exactly
{
  "data": {
    "user": {
      "name": "Ada Lovelace",
      "email": "ada@example.com",
      "posts": [
        { "title": "Notes on the Analytical Engine" }
      ]
    }
  }
}`,
    },
    {
      title: "Step 3: Variables and fragments",
      description: (
        <>
          Hard-coding values into queries creates maintenance problems and security risks. Variables
          parameterize a query: the client sends the query string once and varies the inputs.
          Fragments share field selections across queries — you define a fragment once on a type and
          spread it wherever you need those fields. Both features emerge from the same core idea: the
          query is a template, not a URL.
        </>
      ),
      code: `# Variables: parameterize without string concatenation
query GetUser($id: ID!) {
  user(id: $id) {
    name
    email
    posts {
      title
    }
  }
}
# Variables sent alongside the query document:
# { "id": "42" }

# Fragments: reuse field selections
fragment UserCard on User {
  id
  name
  email
}

query GetAuthorAndEditor($authorId: ID!, $editorId: ID!) {
  author: user(id: $authorId) { ...UserCard }
  editor: user(id: $editorId) { ...UserCard }
}`,
    },
    {
      title: "Step 4: Resolvers — fields, not endpoints",
      description: (
        <>
          The server has a <strong>resolver</strong> — a function that produces the value for a
          single field in a GraphQL query — for every field in the schema. The engine calls each
          resolver independently and assembles the results into the final response shape. This means a
          single query can transparently pull <code>user.name</code> from a user-service database and
          <code>user.posts</code> from a posts microservice — the client sees one response. The
          classic N+1 problem comes from naive resolvers that issue one database query per list item;
          server-side batching tools (DataLoader) are the standard fix.
        </>
      ),
      code: `// Server-side resolver map (JavaScript / Apollo Server)
const resolvers = {
  Query: {
    // Called when a query asks for "user(id: ...)"
    user: (_parent, { id }, { db }) => db.users.findById(id),
    posts: (_parent, { limit }, { db }) => db.posts.findAll({ limit }),
  },
  User: {
    // Called for each User returned by any query that asks for "posts"
    // Naive: issues one DB query per user — the N+1 problem
    posts: (user, _args, { db }) => db.posts.findByAuthor(user.id),
  },
  Post: {
    // The resolver for "author" on Post returns a User object.
    // That User object then has its own resolvers run if asked for.
    author: (post, _args, { db }) => db.users.findById(post.authorId),
  },
};`,
    },
    {
      title: "Step 5: Mutations and subscriptions",
      description: (
        <>
          Mutations change state and follow the same query syntax — the client picks the return
          fields just like a regular query. You describe what you want back from the mutation, and
          the server returns it. Subscriptions are real-time streams: the client sends a subscription
          document and the server pushes updates whenever the subscribed event fires. They run over a
          persistent transport — typically WebSocket or SSE — so they require infrastructure beyond a
          plain HTTP server.
        </>
      ),
      code: `# Mutation: change state, then ask for the fields you need back
mutation CreatePost($input: CreatePostInput!) {
  createPost(input: $input) {
    id
    title
    author {
      name
    }
  }
}
# Variables: { "input": { "title": "Hello world", "authorId": "42" } }

# Subscription: real-time — server pushes updates over WebSocket/SSE
subscription OnNewPost {
  postAdded {
    id
    title
    author {
      name
    }
  }
}`,
    },
    {
      title: "Step 6: Apollo Client and normalized caching",
      description: (
        <>
          <em>Apollo Client</em> — a popular GraphQL client with normalized caching by id — stores
          every object it sees under a key of <code>__typename + id</code>. When a{" "}
          <code>User</code> with <code>id: &quot;42&quot;</code> appears in a <code>me</code> query,
          a <code>user(id: &quot;42&quot;)</code> query, and inside a <code>Post.author</code> field,
          it is one cache entry. Updating that user — from any query — reflects in every component
          that referenced them, automatically. This is the payoff of caching by id rather than by
          URL: a single source of truth per entity, not one copy per request.
        </>
      ),
      code: `// Apollo Client setup (React)
import { ApolloClient, InMemoryCache, gql, useQuery } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://api.example.com/graphql',
  cache: new InMemoryCache(),   // Normalizes by __typename + id
});

// React hook — Apollo fetches, caches, and re-renders on update
const GET_USER = gql\`
  query GetUser($id: ID!) {
    user(id: $id) {
      id              # Apollo needs "id" to normalize the cache entry
      name
      email
    }
  }
\`;

function UserProfile({ userId }) {
  const { loading, error, data } = useQuery(GET_USER, {
    variables: { id: userId },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return <h1>{data.user.name}</h1>;
}`,
    },
  ];

  const playgroundHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>GraphQL Explorer</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <div class="layout">
    <div class="panel">
      <div class="panel-header">Schema</div>
      <div id="schema-panel" class="code-block"></div>
    </div>
    <div class="panel">
      <div class="panel-header">Query</div>
      <div id="query-panel" class="code-block"></div>
    </div>
    <div class="panel">
      <div class="panel-header">Response</div>
      <div id="response-panel" class="code-block"></div>
    </div>
  </div>
  <p class="hint">Click any field in the Query panel to highlight its matching response field and its schema type.</p>
  <script src="/script.js"></script>
</body>
</html>`;

  const playgroundCss = `* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: system-ui, sans-serif;
  background: #0f172a;
  color: #e2e8f0;
  padding: 12px;
  min-height: 100vh;
}
.layout {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
}
.panel {
  background: #1e293b;
  border-radius: 8px;
  overflow: hidden;
}
.panel-header {
  background: #334155;
  padding: 6px 12px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: #94a3b8;
  text-transform: uppercase;
}
.code-block {
  padding: 12px;
  font-family: monospace;
  font-size: 0.78rem;
  line-height: 1.7;
  white-space: pre;
  overflow: auto;
}
.field-line {
  display: block;
  cursor: pointer;
  border-radius: 3px;
  padding: 0 2px;
  transition: background 0.15s;
}
.field-line:hover { background: #334155; }
.field-line.active { background: #1d4ed8; color: #93c5fd; }
.plain-line { display: block; }
.type-hint {
  color: #a78bfa;
  font-size: 0.7rem;
  margin-left: 8px;
}
.hint {
  margin-top: 8px;
  font-size: 0.75rem;
  color: #64748b;
  text-align: center;
}`;

  const playgroundJs = `// Try this: click any field in the query — the response highlights the
// matching field, and the schema shows what type that field is.
// Notice that the response shape mirrors the query shape exactly. That's
// GraphQL's whole pitch: you describe the shape, the server fills it in.

var SCHEMA_LINES = [
  { text: 'type User {', field: null },
  { text: '  id: ID!', field: 'id' },
  { text: '  name: String!', field: 'name' },
  { text: '  email: String!', field: 'email' },
  { text: '  posts: [Post!]!', field: 'posts' },
  { text: '}', field: null },
  { text: '', field: null },
  { text: 'type Post {', field: null },
  { text: '  id: ID!', field: null },
  { text: '  title: String!', field: 'title' },
  { text: '}', field: null },
];

var QUERY_LINES = [
  { text: 'query GetUser($id: ID!) {', field: null },
  { text: '  user(id: $id) {', field: 'user' },
  { text: '    name', field: 'name' },
  { text: '    email', field: 'email' },
  { text: '    posts {', field: 'posts' },
  { text: '      title', field: 'title' },
  { text: '    }', field: null },
  { text: '  }', field: null },
  { text: '}', field: null },
];

var RESPONSE_LINES = [
  { text: '{', field: null },
  { text: '  "data": {', field: null },
  { text: '    "user": {', field: 'user' },
  { text: '      "name": "Ada Lovelace",', field: 'name' },
  { text: '      "email": "ada@example.com",', field: 'email' },
  { text: '      "posts": [', field: 'posts' },
  { text: '        { "title": "Notes on the Engine" }', field: 'title' },
  { text: '      ]', field: null },
  { text: '    }', field: null },
  { text: '  }', field: null },
  { text: '}', field: null },
];

var FIELD_TYPES = { user: 'User', name: 'String!', email: 'String!', posts: '[Post!]!', title: 'String!' };

function buildPanel(panelId, rows) {
  var container = document.getElementById(panelId);
  rows.forEach(function(row) {
    var span = document.createElement('span');
    span.textContent = row.text;
    if (row.field) {
      span.className = 'field-line';
      span.dataset.field = row.field;
    } else {
      span.className = 'plain-line';
    }
    container.appendChild(span);
    container.appendChild(document.createTextNode('\\n'));
  });
}

function highlight(activeField) {
  ['query-panel', 'response-panel'].forEach(function(id) {
    document.getElementById(id).querySelectorAll('.field-line').forEach(function(el) {
      el.classList.toggle('active', el.dataset.field === activeField);
    });
  });
  // Annotate matching schema line with its type
  document.getElementById('schema-panel').querySelectorAll('.type-hint').forEach(function(t) {
    t.remove();
  });
  if (activeField && FIELD_TYPES[activeField]) {
    document.getElementById('schema-panel').querySelectorAll('.field-line').forEach(function(el) {
      if (el.dataset.field === activeField) {
        var hint = document.createElement('span');
        hint.className = 'type-hint';
        hint.textContent = '<-- ' + FIELD_TYPES[activeField];
        el.appendChild(hint);
      }
    });
  }
}

buildPanel('schema-panel', SCHEMA_LINES);
buildPanel('query-panel', QUERY_LINES);
buildPanel('response-panel', RESPONSE_LINES);

['query-panel', 'response-panel', 'schema-panel'].forEach(function(id) {
  document.getElementById(id).addEventListener('click', function(e) {
    var target = e.target.closest('.field-line');
    if (target) highlight(target.dataset.field);
  });
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
              Your dashboard makes 14 REST calls on first load. Three of them return data the
              dashboard ignores; one returns 200 KB and the dashboard uses 4 fields. GraphQL exists
              because REST gives the server a fixed answer for every URL — and your client almost
              never wants exactly that fixed answer. The trade is real complexity (schema, resolvers,
              caching) for one query that returns exactly the shape you ask for.
            </p>
            <p>
              That trade is worth understanding precisely. GraphQL is not a drop-in REST replacement
              — it shifts responsibility. The server publishes a typed schema and wires up a resolver
              per field; the client authors queries instead of constructing URLs. A normalized cache
              on the client (Apollo, urql, Relay) stores every object by its id so the same entity
              seen in different queries shares one cache slot. Each piece has real cost; each piece
              solves a real problem.
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
              In REST, the URL names the resource and the server decides its shape. In GraphQL, the
              client authors a query that names every field it wants and the server resolves each
              field independently before assembling the result. There is no per-query URL to cache, so
              the client cache stores objects by their identity — <code>__typename</code> plus{" "}
              <code>id</code> — rather than by URL. That one shift (cache by id, not by URL)
              propagates through the entire model: a single update to a <code>User</code> object
              reflects in every component that referenced it, regardless of which query brought it in.
            </p>
            <blockquote className="border-l-4 border-blue-500 pl-4 italic">
              &quot;Client asks for exactly the shape it wants; server resolves field by field. Cache
              by id, not by URL — the same object can show up under many queries.&quot;
            </blockquote>
          </div>
        </CardContent>
      </Card>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 3: Step-by-step                                               */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <StepByStepExplanation
        title="GraphQL, end to end"
        description="From schema definition to normalized cache — six steps"
        steps={graphqlEndToEndSteps}
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 4: Live playground                                            */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <HTMLPlayground
        html={playgroundHtml}
        css={playgroundCss}
        js={playgroundJs}
        title="Schema, query, and response — side by side"
        description="Click a field in the query or response to see the matching entry highlighted across all three panels, and the schema type annotation appear."
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 5: Challenges                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <Challenge
        question="Your team builds an internal admin dashboard with 6 fixed views and 3 backend services. Worth GraphQL?"
        options={[
          { id: "a", text: "Yes — GraphQL is always better than REST." },
          {
            id: "b",
            text: "No — REST endpoints handle 6 fixed views fine. GraphQL pays back when the client's data needs are diverse, evolving, and over-fetching is a real cost. For 6 stable views, the schema overhead and resolver complexity isn't worth it.",
          },
          { id: "c", text: "Yes — GraphQL caches automatically." },
          { id: "d", text: "It doesn't matter." },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            GraphQL shines when many clients want different slices of the same data — public APIs,
            mobile + web sharing a backend, large internal services with diverse consumers. A small
            fixed dashboard is exactly where REST is simpler and cheaper. Six stable views map cleanly
            to six endpoints; there is no over-fetching problem worth solving, and you avoid the
            schema authoring, resolver wiring, and client-cache configuration that GraphQL requires.
          </>
        }
      />

      <Challenge
        question="Why does Apollo cache by __typename + id instead of by query URL?"
        options={[
          { id: "a", text: "URLs are too long." },
          {
            id: "b",
            text: "The same object can appear in many queries (a User shows up in `me`, in `user(id: 42)`, and inside `Post.author`). Caching by id means an update to that user reflects in every query that referenced them, automatically.",
          },
          { id: "c", text: "It's faster." },
          {
            id: "d",
            text: "It's an Apollo-specific optimization that other clients don't need.",
          },
        ]}
        correctAnswerId="b"
        explanation={
          <>
            GraphQL responses share entities across queries. Cache by URL and you would duplicate the
            same <code>User</code> object in N separate cache slots — update one and the others are
            stale. Cache by id and a single write reflects everywhere that entity was referenced. This
            is one of GraphQL&apos;s major UX wins and the reason normalized cache layers (Apollo,
            urql, Relay) all converged on the same design.
          </>
        }
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Section 6: GotchaList                                                 */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <GotchaList
        items={[
          {
            title: "N+1 query problems are easy to make and easy to ship",
            body: (
              <>
                Apollo&apos;s normalized cache helps the client side; the server side needs DataLoader
                or similar. A naive resolver that calls <code>db.users.findById(post.authorId)</code>{" "}
                for each post in a list issues one database query per post — ship it and watch your
                database fall over under load.
              </>
            ),
          },
          {
            title: "Optional fields in the schema mean optional in TypeScript codegen",
            body: (
              <>
                Null-handling won&apos;t save you if you forget to check. A field declared{" "}
                <code>String</code> (without <code>!</code>) can be <code>null</code> at runtime.
                GraphQL codegen faithfully produces a TypeScript type of <code>string | null</code>,
                but access it without a null-check and you get a runtime crash.
              </>
            ),
          },
          {
            title: "Subscriptions need a transport (WebSocket, SSE)",
            body: (
              <>
                They aren&apos;t free with HTTP, and your infrastructure may need to be reconfigured.
                Load balancers, proxies, and serverless platforms often don&apos;t support long-lived
                connections by default. Plan the transport before committing to subscriptions in
                production.
              </>
            ),
          },
          {
            title: "GraphQL plus REST gateways is increasingly common",
            body: (
              <>
                The back-end pendulum swings; many teams build a GraphQL layer over REST
                microservices. You get the client-query flexibility and normalized cache without
                rewriting every service. The tradeoff is an extra network hop and the overhead of
                maintaining the gateway schema alongside the underlying REST contracts.
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
            The <strong>schema</strong> is the contract — it defines every type, query, mutation, and
            subscription. Both client and server are bound to it; tooling (GraphiQL, codegen) derives
            from it automatically.
          </>,
          <>
            Clients declare exactly the fields they need; the server resolves each field independently
            and assembles the result. Over-fetching and under-fetching disappear from the wire.
          </>,
          <>
            <strong>Variables</strong> parameterize queries; <strong>fragments</strong> share field
            selections. Use both to keep query documents DRY and safe against injection.
          </>,
          <>
            <strong>Mutations</strong> change state using the same query syntax — you pick the return
            fields. <strong>Subscriptions</strong> stream real-time updates over a persistent
            transport (WebSocket, SSE).
          </>,
          <>
            Apollo Client caches by <code>__typename + id</code>, not by URL. One cache entry per
            entity means a single update propagates to every component that referenced it — the
            normalized cache is GraphQL&apos;s major UX win on the client.
          </>,
          <>
            GraphQL earns its complexity when clients are diverse and data needs evolve rapidly.
            For a small, fixed set of views, plain REST endpoints are simpler and cheaper.
          </>,
        ]}
        mentalModel="Client asks for exactly the shape it wants; server resolves field by field. Cache by id, not by URL — the same object can show up under many queries."
      />
    </div>
  );
}
