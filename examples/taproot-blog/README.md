# Taproot Blog

A two-author blog implemented at three levels in one repo. Reference app for the Phase 8 capstone modules of the Frontend Learning App.

## Levels

| Folder | Stack | What it teaches |
|---|---|---|
| `static/` | Hand-written HTML + CSS, no build | Baseline: HTML/CSS/anchors, full-page reload, no build step |
| `spa/` | Vite + React + Router + TanStack Query + MSW | Build pipeline, SPA routing, client-side fetching from a mock API |
| `app/` | Next.js 15 + Prisma + NextAuth + RSC + server actions | Production target: public + authenticated, SEO + interactive |

The same visual design across all three. Comments and admin only exist in `spa/` (in browser memory) and `app/` (real persistence).

## Run each level

### Level 1 — Static

```sh
cd static && python3 -m http.server 8000
# open http://localhost:8000
```

### Level 2 — SPA

```sh
cd spa
npm install
npm run dev
# open http://localhost:5173
```

Comments persist only in browser memory (MSW mocks the API). That is the lesson, not a bug.

### Level 3 — Full-stack

Requires a local Postgres. Easiest path:

```sh
docker run --name taproot-pg -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16
```

Then:

```sh
cd app
npm install
cp .env.example .env
# (edit .env to set AUTH_SECRET — `openssl rand -base64 32`)
npm run db:setup
npm run dev
# open http://localhost:3000
```

Sign in with one of the seeded authors:
- email: `alice@taproot.local`, password: `taproot-dev`
- email: `bob@taproot.local`, password: `taproot-dev`

## Why three levels?

Each level shows what the next is *adding*. The capstone modules walk the same blog through three lenses: build pipeline, request lifecycle, architecture.
