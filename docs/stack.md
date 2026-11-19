# Stack decisions — database & hosting

Short version: **Neon (Postgres, free) + Vercel Hobby.** Nothing here needs a keep-alive ping, a
cron job, or a paid plan to stay up. This file records *why*, and what would make us switch.

Measured facts are from the providers' free-tier pages checked **November 2026**; the numbers move,
the shape of the decision does not.

---

## 1. Database

| | **Neon** ✅ chosen | Supabase | Firebase (Firestore) |
|---|---|---|---|
| Engine | Postgres 17 | Postgres | NoSQL document store |
| Free storage | 1 GB per project (20 GB per account, up to 100 projects) | 500 MB per project, 2 active projects | 1 GiB (Spark) |
| Free compute | 100 CU-hours/month per project, autoscales to 2 CU | Shared CPU, 500 MB RAM | 50k reads / 20k writes per day |
| **When idle** | compute **scales to zero after 5 min**, **wakes automatically** in a few hundred ms | project **pauses after 1 week** of inactivity → **manual resume from the dashboard** | stays available |
| Keep-alive needed | **no** | yes, if you care about quiet weeks | no |
| Branching / previews | 10 branches per project — a branch per preview deploy | not on free | n/a |
| Pooled connections | up to 10k | 200 | n/a |
| First paid tier | Launch — usage-based ($0.106/CU-hour, $0.35/GB-month), $0 typical for a small site | Pro — $25/month flat | Blaze — pay per operation |
| Fit for Genie | exact | good, but more than we need | wrong data model |

**Why Neon.** It is plain Postgres (the store already speaks it), the free plan is bigger than we will
use for years, and idling costs nothing but half a second on the next query — no dashboard visit, no
lost data, no cron. The "pausing" pain people complain about is Supabase's 7-day inactivity pause and
Turso's 10-day archival; Neon only sleeps the compute.

**Why not Supabase.** Fine product, but we would be paying for Auth, Realtime, Storage and Edge
Functions we do not use, and the free tier's one-week pause is exactly the friction to avoid. It
becomes interesting the day we want a real user table + magic links, because we would get auth and
Postgres in one bill.

**Why not Firebase.** Firestore is NoSQL: no SQL, no joins, queries are shaped around collections and
composite indexes. `lib/store-sql.ts` is ~250 lines of working SQL and `lib/db-schema.ts` is a real
schema — moving would mean rewriting the store, losing `psql`/`pg_dump`, and locking the data into a
proprietary format. Firebase's free Spark plan also caps *reads per day*, which is the one quota a
marketing site can actually hit.

**Cold start, honestly:** after ~5 idle minutes the first request waits roughly 300–600 ms while Neon
wakes the compute. Subsequent requests are normal. If that ever matters (it should not for a review
site), the fix is a paid Neon plan with scale-to-zero off — not a ping loop.

---

## 2. Hosting

| | **Vercel Hobby** ✅ current | Cloudflare Workers / Pages |
|---|---|---|
| Next.js | native, zero config | `@opennextjs/cloudflare` (or vinext beta) — extra build, extra config |
| Node APIs | full Node runtime | Workers runtime; `node:crypto`, `pg` over TCP, etc. need care |
| Postgres | `pg` over TCP — works as is | **no raw TCP**: needs Hyperdrive or `@neondatabase/serverless` |
| Memory / limits | ~2 GB, 300 s function limit | 128 MB per isolate |
| Bandwidth | 100 GB/month free, then $0.15/GB | static free & unlimited, no Workers egress |
| Price | $0 on Hobby | $0 on Free, $5/month Workers Paid |
| Preview deploys | every branch | Workers Builds previews (different flow) |

**Verdict: stay on Vercel.** The site is dynamic Next (server components, server actions, ISR,
route handlers) and the store talks to Postgres over TCP. Cloudflare can run it, but only after an
OpenNext adapter, a driver swap (Hyperdrive or Neon's HTTP driver) and a re-test of every route — real
work, for a saving of **$0**, since Hobby is free and we are nowhere near 100 GB of bandwidth.

**When moving would make sense:** bandwidth bills (image-heavy traffic at scale), or wanting
Cloudflare's DDoS/WAF in front of everything. The port path is known: Hyperdrive (or
`@neondatabase/serverless`) for the store, OpenNext for the app, Cloudflare Images for `next/image`.
`lib/store.ts` is still the only file that would change on the data side.

**What not to do:** run both. Two deployments, two domains, one database is how a catalogue ends up
half-updated.

---

## 3. Cost at our actual scale

The whole catalogue is ~9 products; a product row is a couple of kilobytes. Even at 500 products and
20k subscribers we are well under **50 MB** — 5% of Neon's free 1 GB — and compute only runs while
someone is browsing. Realistically: **$0/month** for hosting + database until traffic grows enough
that earning money is the bigger problem, at which point Neon Launch's usage-based bill (~$0–19/month)
is cheaper than Supabase Pro's flat $25.

Next money that is actually worth spending, in order: a real domain (~$12/year), email tool for the
Friday list (free up to a few thousand subscribers), then more hosting only if bandwidth demands it.

---

## 4. Checklist for connecting Neon

1. Neon → **New Project** → region **AWS US East 1 (N. Virginia)** (matches Vercel's `iad1`
   functions) → Postgres toggle on, everything else off → **Create project**.
2. Neon → **Connect** → copy the **pooled** connection string (host ends in `-pooler`,
   `?sslmode=require`).
3. Vercel → project `freelance-new` → **Settings → Environment Variables** → add `DATABASE_URL` for
   Production **and** Preview → **Redeploy**.
   (Or Neon → **Integrations → Vercel** → pick the project; it injects the env vars itself. The code
   reads `POSTGRES_URL` too.)
4. Open `/admin` — the header chip must read green **Postgres**. Amber **No database** means the
   deployment did not get the variable.

See [deploy.md](deploy.md#persistence--connect-postgres-do-this-before-launch) for the operational
details (backups, two-deployment setup, pool size).
