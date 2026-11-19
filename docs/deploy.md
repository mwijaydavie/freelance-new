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

## Persistence — the part that matters on Vercel

Vercel's filesystem is **read-only** at runtime. The console writes to `.data/*.json`, which works
locally and is perfect for previews, but on Vercel the store falls back to memory (the UI tells you
when that happens).

Before launch, point `lib/store.ts` at one of:

| Option | Effort | Notes |
|---|---|---|
| **Vercel KV / Upstash Redis** | ~30 min | `get/set` JSON; good for a 9–50 product catalogue |
| **Vercel Postgres + Drizzle** | ~2 h | real tables, queries, migrations; best long-term |
| **Sanity / Contentful** | ~3 h | editor-friendly, but you already have a console |
| **SQLite + Turso** | ~1 h | SQL, edge-friendly, generous free tier |

Nothing else in the app changes: `readProducts()`, `writeProducts()`, `readSubscribers()` and
`addSubscriber()` are the only surface the pages and server actions touch.

## Pre-launch checklist

- [ ] `ADMIN_PASSWORD` set (and not `genie-admin`)
- [ ] `ADMIN_ENABLED=false` on the public project
- [ ] Console deployed separately and protected
- [ ] `metadataBase` in `app/layout.tsx` set to the real domain
- [ ] Store backed by a database, not `.data/`
- [ ] Affiliate URLs replaced with tracked links
- [ ] Newsletter endpoint pointed at your ESP
- [ ] `robots.txt` / `sitemap.xml` checked on the production domain
