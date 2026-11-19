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
| Content | Local typed catalogue + JSON store, no CMS required |

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

All admin routes are `noindex`, guarded server-side by an httpOnly HMAC cookie, and never rendered
inside the marketing chrome.

---

## Admin console

- **Auth:** single shared password (`ADMIN_PASSWORD`), exchanged for an httpOnly cookie.
  Swap for Auth.js/Clerk before handing it to a team — `lib/auth.ts` is the only file that changes.
- **Data:** `.data/catalog.json` and `.data/subscribers.json` (gitignored). Seeded from
  `lib/products.ts` on first write. All access goes through `lib/store.ts`, so replacing it with
  Prisma / Drizzle / Sanity / Vercel KV touches one file.
- **No rebuild needed:** catalogue pages are dynamic and read the store per request, so a save in the
  console is live on the site immediately.
- **Read-only hosting:** on a read-only filesystem writes fall back to memory and the console tells
  you. Connect a database (or Vercel Blob/KV) for production persistence.
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

**Newsletter** posts to `/api/subscribe` → `addSubscriber()` in `lib/store.ts`; swap for your ESP
there.

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
  store.ts                   JSON store (swap for a DB)
  auth.ts                    admin session
  playbook.ts                revenue playbook content
  guides.ts                  editorial
docs/monetisation.md         the strategy, in full
```

## Deploy

```bash
npx vercel        # preview
npx vercel --prod # production
```

Set `ADMIN_PASSWORD` and update `metadataBase` (`app/layout.tsx`) to the real domain. For persistent
admin edits on Vercel, point `lib/store.ts` at a database (the filesystem is read-only there).
