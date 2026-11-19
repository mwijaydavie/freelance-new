# Genie — the short list

A premium, multi-page affiliate site plus a working admin console. Built on Next.js App Router,
TypeScript, Tailwind CSS v4, GSAP + Lenis motion, and a shadcn/ui-compatible component structure.

Every public page closes with the **Pushpin Tear Footer** — a poster that assembles, drops a pushpin
and rips itself from the pin outwards.

---

## Stack

| | |
|---|---|
| Framework | Next.js 15 (App Router, React 19) |
| Language | TypeScript, `strict` |
| Styling | Tailwind CSS v4 (`@theme` tokens in `app/globals.css`) |
| Components | shadcn/ui structure (`components/ui`, `components.json`, `cn()`) |
| Motion | GSAP + ScrollTrigger, Lenis smooth scroll |
| Icons | `lucide-react` |
| Data | Postgres (Neon / Supabase / any URL) with an automatic schema, JSON fallback for local dev |

## Getting started

```bash
npm install
cp .env.example .env.local     # set ADMIN_PASSWORD
npm run dev                    # http://localhost:3000  ·  console at /admin
npm run build && npm start     # production
```

Default admin password when `ADMIN_PASSWORD` is unset: **`genie-admin`** (change it).

---

## Routes

### Public (`app/(site)`)

| Route | Purpose |
|---|---|
| `/` | Hero, ticker, shortlist, manifesto, collections, method band, field notes, subscribe |
| `/products` | Catalogue with collection filters + sorting |
| `/products/[slug]` | Review: score bars, pros/cons, specs, sticky buy box, JSON-LD, alternatives |
| `/collections`, `/collections/[slug]` | Category landing pages with a featured pick |
| `/guides`, `/guides/[slug]` | Long-form notes with reading progress + TOC |
| `/about`, `/disclosure` | Method, affiliate disclosure + privacy |
| `/sitemap.xml`, `/robots.txt` | SEO (admin and API excluded) |

### Admin (`app/admin`)

| Route | Purpose |
|---|---|
| `/admin/login` | Password gate (`ADMIN_PASSWORD`) |
| `/admin` | Overview: published/drafts, hours, subscribers, needs-attention list, revenue snapshot |
| `/admin/products` | Catalogue table, filter by live/draft/featured, publish & unpublish |
| `/admin/products/new` | Full editor with image picker and live thumbnail |
| `/admin/products/[slug]` | Edit, delete, view live page |
| `/admin/subscribers` | Friday-list signups + CSV export |
| `/admin/playbook` | The revenue playbook, rendered from `lib/playbook.ts` |

`/admin` is disabled entirely when `ADMIN_ENABLED="false"` — see [deploying separately](docs/deploy.md).

All admin routes are `noindex`, guarded server-side by an httpOnly HMAC cookie, and never rendered
inside the marketing chrome.

---

## Admin console

- **Auth:** single shared password (`ADMIN_PASSWORD`), exchanged for an httpOnly cookie.
  Swap for Auth.js/Clerk before handing it to a team — `lib/auth.ts` is the only file that changes.
- **Data:** Postgres when `DATABASE_URL` is set — tables, indexes and the seed catalogue are created
  on the first request, so there is no migration step to forget. Without a database it falls back to
  `.data/*.json` (gitignored) and then to memory. Everything goes through `lib/store.ts`.
- **No rebuild needed:** catalogue pages are dynamic and read the store per request, so a save in the
  console is live on the site immediately.
- **Storage state is visible:** the console header shows a green **Postgres** chip when writes are
  durable, amber **No database** when they are not — plus a banner on the overview page.
- **Fields:** name, maker, slug, collection, price, score, badge, image, tested hours, updated date,
  verdict, best-for, full review, pros/cons (one per line), specs and score bars
  (`label | value`), retailer links (`retailer | affiliate URL | price | note`), published/featured.

---

## Motion (GSAP + Lenis)

- `components/site/smooth-scroll.tsx` — Lenis driven by the GSAP ticker, kept in sync with
  ScrollTrigger, disabled under `prefers-reduced-motion`.
- `components/site/motion-layer.tsx` — one effect per route, driven by data attributes:
  `data-anim="line"` (masked hero line), `data-anim="hero"` (supporting copy), `data-anim="card"`
  (hero card), `data-anim="fade"` (scroll-in), `data-parallax="6"` (image drift).
- `app/(site)/template.tsx` — route transition (the App Router equivalent of Barba.js; Barba itself
  hijacks the document and is not compatible with client-side routing in Next).
- Reduced motion: Lenis is not initialised, no element is hidden by CSS, and the `<noscript>` style
  keeps every reveal visible.

---

## Content & data

**Products** live in `lib/products.ts` as the seed, then in the console. Each product generates its
review page, collection listing and sitemap entry.

**Affiliate links** are per product (`retailers[]`). Replace the placeholder search URLs with tracked
links; `components/site/affiliate-button.tsx` already ships
`rel="sponsored nofollow noopener noreferrer"`.

**Newsletter** posts to `/api/subscribe` → `addSubscriber()` in `lib/store.ts` → `genie_subscribers`,
deduped case-insensitively. Swap or mirror it to your ESP there.

**Database** is Postgres. `DATABASE_URL` in, done: `lib/db-schema.ts` creates `genie_products`,
`genie_subscribers`, `genie_meta` and `genie_schema` on the first request, and seeds the catalogue
once. `npm run db:migrate` applies it explicitly, `npm run db:print` prints the SQL, and
`npm run db:smoke` proves the whole store against a real Postgres engine (PGlite/WASM) with no
server needed. Recipe: [`docs/deploy.md`](docs/deploy.md#persistence--connect-postgres-do-this-before-launch).

**Images** are AI-generated placeholders in `public/products/` (4:5). Swap for real photography.

**Revenue strategy** is written up in [`docs/monetisation.md`](docs/monetisation.md) and mirrored in
the console at `/admin/playbook`.

---

## Why `components/ui` matters

`components.json` maps `aliases.ui` to `@/components/ui`, which the shadcn CLI reads. Keeping
primitives there means `npx shadcn@latest add <component>` can resolve, diff and update them, and
imports stay consistent. Update `aliases.ui` if you ever move the folder.

## Project layout

```
app/
  layout.tsx                 html/body + metadata (no chrome)
  (site)/                    marketing route group
    layout.tsx               announcement, header, footer, Lenis + motion layer
    template.tsx             route transitions
    page.tsx, products/, collections/, guides/, about/, disclosure/
  admin/                     console (own layout, no marketing chrome)
    login/, (console)/, actions.ts, subscribers/export/route.ts
  api/subscribe/route.ts     newsletter capture
  sitemap.ts, robots.ts
components/
  ui/                        shadcn primitives + pushpin-tear-footer.tsx
  site/                      header, footer, cards, catalog, motion, newsletter…
  admin/                     nav, product form, submit/delete buttons
lib/
  products.ts                types, seed catalogue, helpers
  catalog.ts                 store-backed reads for public pages
  store.ts                   store facade: Postgres → JSON → memory
  store-sql.ts               the actual SQL (products, subscribers)
  db.ts / db-schema.ts       driver + schema (auto-applied on first request)
  db-pglite.ts               embedded Postgres for local dev and tests
  auth.ts                    admin session
  playbook.ts                revenue playbook content
  guides.ts                  editorial
docs/monetisation.md         the strategy, in full
docs/deploy.md               deploy + Postgres setup
docs/stack.md                database/hosting decisions and costs
```

## Deploy — and shipping the console separately

One codebase, but the console can be its own deployment. `ADMIN_ENABLED="false"` makes every
`/admin*` request (login included) render the 404 page, so the public host has no admin surface:

| | public project | console project |
|---|---|---|
| Domain | `genie.reviews` | `console.genie.reviews` |
| `ADMIN_ENABLED` | `false` | `true` |
| `ADMIN_PASSWORD` | — | strong password |

Import the same repo twice in Vercel, set those two env vars, and (optionally) add Vercel Deployment
Protection to the console project. Full recipe, plus a true monorepo split and the persistence
recipe, and the Postgres setup: [`docs/deploy.md`](docs/deploy.md). Why Neon + Vercel (and what
would make us move to Cloudflare): [`docs/stack.md`](docs/stack.md).

```bash
npx vercel        # preview
npx vercel --prod # production
```

On Vercel the filesystem is read-only, so the JSON fallback degrades to memory: set `DATABASE_URL`
(Vercel → Storage → Neon/Postgres) before launch, otherwise the console will tell you it is not
saving. Update `metadataBase` (`app/layout.tsx`) too.
