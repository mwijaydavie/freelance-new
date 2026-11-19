# Deploying Genie (public site + console)

The console lives in the same Next.js app as the site, under `/admin`. That is deliberate — one
codebase, one design system, one deployment pipeline — but you can still **ship it separately** so
the public deployment has no admin surface at all.

Three options, cheapest first.

---

## Option A — one deployment (simplest)

```bash
npx vercel --prod
```

- Set `ADMIN_PASSWORD` in Vercel → Project → Settings → Environment Variables.
- Leave `ADMIN_ENABLED` unset (defaults to enabled).
- `/admin` is password-gated, `noindex`, disallowed in `robots.txt`, and never linked from the site.

Good enough for a solo operator. The only exposure is the login page itself.

---

## Option B — same repo, two Vercel projects (recommended)

The public site gets no console at all; the console lives on its own hostname.

### 1. Import the repo twice

Vercel → **Add New → Project** → pick the same repository, twice:

| | **genie** (public) | **genie-console** |
|---|---|---|
| Domain | `genie.reviews` | `console.genie.reviews` |
| `ADMIN_ENABLED` | `false` | `true` |
| `ADMIN_PASSWORD` | — (not needed) | strong password |
| Root directory | repo root | repo root |
| Framework | Next.js | Next.js |

### 2. How the switch works

`app/admin/layout.tsx` calls `isAdminEnabled()` (`lib/auth.ts`). When `ADMIN_ENABLED="false"`, every
`/admin*` request — login page included — renders the 404 page. Nothing to brute-force, nothing to
fingerprint, and the console code is never reachable on the public host.

### 3. Lock the console hostname further (optional but smart)

- Vercel → **Deployment Protection** → *Password Protection* or *Vercel Authentication* on the console
  project. Two locks: Vercel's, then `ADMIN_PASSWORD`.
- Deny indexing on the console project too (already handled by `app/admin/layout.tsx` metadata).
- Optionally point a custom domain you never share, e.g. `ops.genie.reviews`.

### 4. Same database for both

Both projects must point at the same persistence layer (see below), otherwise the console edits a
different catalogue than the site reads.

---

## Option C — true split (monorepo)

Only worth it when a second person owns the console, or you need a different runtime.

```
apps/
  site/     ← public Next app, reads the DB
  admin/    ← console Next app, writes the DB
packages/
  catalog/  ← types, store client, shared components
```

Trade-offs: two builds, shared package wiring (Turborepo / pnpm workspaces), duplicated Tailwind
tokens, and every shared component becomes a versioned package. The current route-group approach
gives 90% of the isolation with none of that, which is why it is the default here.

---

## Persistence — connect Postgres (do this before launch)

Vercel's filesystem is **read-only** at runtime, so `.data/*.json` only works on your machine. The
store already speaks Postgres; you are one environment variable away from a real database.

```
lib/store.ts      facade — picks the backend, keeps the JSON fallback
  ├── lib/store-sql.ts   all SQL (products + subscribers)
  └── lib/db.ts          driver: node-postgres when DATABASE_URL is set
        └── lib/db-pglite.ts   embedded Postgres, local dev + tests only
```

### 1. Create the database

Vercel dashboard → your project → **Storage** → **Create Database** → **Neon (Postgres)**. Pick the
region closest to your readers (`iad1` matches the default Vercel functions region).

Any Postgres works: Neon direct, Supabase (use the **pooler** host, port `6543`), Railway, RDS, or a
VPS. The app only needs a connection string.

### 2. Add the environment variable

Vercel → Project → **Settings → Environment Variables**:

| Key | Value | Environments |
|---|---|---|
| `DATABASE_URL` | `postgres://user:pass@host/db?sslmode=require` | Production, Preview (and Development for local) |

The code also reads `POSTGRES_URL` and `POSTGRES_PRISMA_URL`, so a Vercel **Storage → Postgres/Neon**
integration that injects those names works without adding anything by hand — just redeploy.

Use the **pooled** connection string for serverless (Neon: host ends in `-pooler`). Direct
connections run out of slots once you have a few warm lambdas.

Optional: `DATABASE_POOL_MAX` (default `3`) — connections per lambda instance.

### 3. Redeploy

That's it. The first request runs `lib/db-schema.ts` (tables + indexes), records `genie_schema.v1`,
and seeds the starting catalogue from `lib/products.ts` exactly once. No migration step to forget.

Want it explicit, in CI or by hand?

```bash
DATABASE_URL="postgres://…" npm run db:migrate   # apply (idempotent)
npm run db:print                                 # print the SQL instead
```

### 4. Verify it is real

- The console header shows a green **Postgres** chip (amber **No database** means it is not wired).
- Edit a pick, then hit *Deploy* → your edit is still there after a cold start.
- Locally, `npm run db:smoke` runs the full store — schema, seeding, writes, prune, reset,
  subscriber dedupe — against a genuine Postgres engine (PGlite/WASM) in two separate processes.
  No server or network required.

### What is in the database

| Table | Holds |
|---|---|
| `genie_products` | one row per pick: scalars as columns, `pros/cons/specs/scores/retailers` as `jsonb`, curated order in `sort_order` |
| `genie_subscribers` | one row per email (unique on `lower(email)`), plus `source` and `created_at` |
| `genie_meta` | first-run markers (e.g. the seed claim) |
| `genie_schema` | applied schema version — bump `SCHEMA_VERSION` when you add a migration |

Saving a pick rewrites the catalogue inside one transaction: upsert every row, then prune anything
that is no longer in the list. Two operators saving at once cannot interleave into a half-written
catalogue.

### Operating notes

- **Backups:** Neon/Supabase keep point-in-time history on paid tiers; on free tiers take a manual
  `pg_dump` before any bulk edit.
- **Two deployments, one database:** the public project and the console project use the *same*
  `DATABASE_URL` — that is what makes a console save appear on the site instantly.
- **No database at all:** the site still builds and runs (JSON files locally, memory on Vercel) and
  the console says so in amber. Good for a preview, not for launch.
- **Local SQL without installing Postgres:** `PGLITE_PATH=.data/pg npm run dev` uses the embedded
  engine and persists to `.data/pg`.

### If you would rather use something else

`readProducts()`, `writeProducts()`, `resetProducts()`, `readSubscribers()` and `addSubscriber()` are
the only surface the pages and server actions touch — about 40 lines in `lib/store.ts`. Anything with
a Node client (Prisma, Drizzle, Sanity, Turso, KV) drops in there; the SQL version in
`lib/store-sql.ts` is a working reference for the shapes.

## Pre-launch checklist

- [ ] `ADMIN_PASSWORD` set (and not `genie-admin`)
- [ ] `ADMIN_ENABLED=false` on the public project
- [ ] Console deployed separately and protected
- [ ] `metadataBase` in `app/layout.tsx` set to the real domain
- [ ] `DATABASE_URL` set — console shows a green Postgres chip, not amber
- [ ] Affiliate URLs replaced with tracked links
- [ ] Newsletter endpoint pointed at your ESP
- [ ] `robots.txt` / `sitemap.xml` checked on the production domain
