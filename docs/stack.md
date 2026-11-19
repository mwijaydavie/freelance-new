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

---

## 5. Media and accounts — what lives where

Short answer to "where do the pictures and videos live": **pictures live in the repo and are served
by Vercel's CDN; videos never go in the repo.** There are no user accounts at all — the only login is
the single admin password.

| What | Where it lives | Cost | Ceiling before it matters |
|---|---|---|---|
| **Product photos (now)** | `public/products/*.jpg` — 9 files, **928 KB total**, shipped in the build, served from Vercel's edge, resized + converted to WebP by `next/image` | $0 (Hobby: 100 GB bandwidth/month) | roughly 100–200 MB of images in the repo |
| **Product photos (later, many)** | Cloudflare R2 or Vercel Blob or Neon object storage (5 GB free, S3-compatible) → add the host to `images.remotePatterns` in `next.config.ts` | R2: 10 GB free, **zero egress fees** | when the repo gets heavy or non-devs upload |
| **Video** | **Never** `/public` and never Postgres: Cloudflare R2 (free egress) + `<video preload="none">`, or Cloudflare Stream / Mux for adaptive HLS, or an unlisted YouTube embed | R2 $0 → ~$0.015/GB-month; Stream ~$5 per 1,000 min stored | a 60-second 1080p clip is 15–40 MB — one month of traffic can exceed Vercel's whole bandwidth allowance |
| **User accounts** | none. Nothing on the public site requires a login | $0 | if you add wishlists/alerts, Neon's free plan bundles Better Auth up to 60k MAU — no new vendor |
| **Admin login** | one shared password (`ADMIN_PASSWORD`) → httpOnly cookie | $0 | when a second editor joins, move to Better Auth / magic links against the same Postgres |
| **Newsletter** | `/api/subscribe` → `genie_subscribers` table; exporting to an ESP (Buttondown, Resend, ConvertKit) is a CSV away | ESP free up to ~1–2k subscribers | at a few thousand subscribers |

**Why not keep images in Postgres?** It works, and it is the wrong tool: bytes go through the function
on every request (no CDN cache without extra work), backups and `pg_dump` balloon, and Neon's free
tier is 1 GB for *everything*. Object storage exists for exactly this and is free at our size.

**Why is object storage off in the Neon project, then?** Because we do not need it yet — the nine
photos fit in the repo and cost nothing to serve. Turning it on later is a checkbox, not a migration.

**House rules for media, so this stays true:**

- Product photos: 4:5, ~1600 px wide, JPEG/WebP, target **under 250 KB** each. The cards, the hero and
  the JSON-LD all assume that ratio.
- Any `<video>`: always a `poster` image, `preload="none"`, and `playsInline`. Never autoplay a file
  from the app server.
- External media must be allow-listed in `next.config.ts` → `images.remotePatterns` (a commented
  example is already there), otherwise `next/image` refuses to optimise it.

---

## 6. Accounts, functions, realtime — what we run and why

### 6.1 Who logs in

| Role | Login today | Right answer |
|---|---|---|
| Reader / buyer | **none** | never gate reading. A login wall on an affiliate site is a paywall with no revenue |
| Editor (you) | one password → httpOnly cookie, 30 days | correct for a solo operator: one field, once a month |
| Second editor / VA | same password | move to email + magic link with a `genie_users` table and roles when a second person joins |
| Customer account (orders) | n/a — we do not sell | needed only if Genie ever sells its own stock: guest checkout + optional account |

**The friction maths that decides it.** The plan in `docs/monetisation.md` assumes 10k sessions →
12% outclick → 4.5% sale. Gating the catalogue behind an account drops the first number by an order of
magnitude, and search engines — which cannot log in — stop indexing the pages that produce that
traffic. Every gate is a paid feature; reading is the product.

Accounts also import legal work (consent, deletion requests, breach duties under Tanzania's PDPA and
GDPR if you serve EU readers). No accounts, no obligations: our single admin cookie is strictly
necessary, so there is no cookie banner either.

**Trigger to add real user auth:** a second editor, or a feature that genuinely needs identity
(wishlists, price-drop alerts, a paid tier). The migration is small: a `genie_users` table in the same
Neon database, `email + magic link` (Better Auth is bundled free up to 60k MAU on Neon's free plan),
roles owner/editor, and `lib/auth.ts` becomes the only file that changes.

### 6.2 Serverless functions

We already run them — that is what Vercel is. Every dynamic route is a function invocation:

| Route | Kind | Why |
|---|---|---|
| `/`, `/products`, `/products/[slug]`, `/collections` | server function (RSC render) | reads Postgres per request, so console edits are live instantly |
| `/admin/*` | server function + server actions | auth guard, writes, revalidation |
| `/api/subscribe` | route handler (function) | validates an email, inserts a row |
| `/guides/*`, `/disclosure` | prebuilt at deploy | static, free, no invocation |

Limits on Hobby: ~2 GB memory, 300 s max, 100 GB bandwidth. A catalogue page render is ~50 ms plus one
database round-trip — nowhere near any of them.

**"Functions" as a separate product** (Neon Functions, Cloudflare Workers, AWS Lambda) becomes worth
paying attention to for *scheduled or long-running work*:

- a nightly pass that flags stale picks and untagged affiliate URLs → email you;
- affiliate-network postbacks / webhooks (Impact, Awin) → insert a commission row;
- building and sending the Friday email to `genie_subscribers`;
- image reprocessing when a photo is uploaded.

Today we need none of them, and the first two are a `vercel.json` cron (daily on Hobby) hitting a route
handler in this same repo — no new vendor, no second deploy surface. Rent a separate functions product
only when a job outgrows the 300 s limit or must run every minute.

### 6.3 Realtime

Realtime = pushing changes to browsers over a socket (Supabase Realtime, Ably, Pusher, or Postgres
`LISTEN/NOTIFY` → SSE). It is essential when **many people watch the same data mutate**: chat, live
bidding, collaborative editing, delivery tracking.

Genie has none of that. The only "live" relationship is *your edit → the public page*, and that is
already solved more cheaply: pages are `force-dynamic`, so the next request reads the new row, and
`revalidatePath()` clears the cached shells after a save. Cost: one query. Realtime would add a socket
layer, a client state cache and a per-connection bill to remove ~0 ms of staleness for readers who are
not looking at the page anyway.

**Trigger to add it:** a genuinely shared, changing surface — e.g. a live "readers are viewing" counter,
or two editors in the same form at the same time. Then start with SSE fed by `LISTEN/NOTIFY` (free,
Postgres-native) before renting a socket service.
