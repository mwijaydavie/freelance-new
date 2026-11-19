# Genie — the short list

A premium, multi-page affiliate site: an editorial product-discovery brand ("Genie") built on
Next.js App Router, TypeScript, Tailwind CSS v4 and a shadcn/ui-compatible component structure.
Every page closes with the **Pushpin Tear Footer** — a poster-style footer that assembles, drops a
pushpin and rips itself from the pin outwards.

---

## Stack

| | |
|---|---|
| Framework | Next.js 15 (App Router, React 19) |
| Language | TypeScript, `strict` |
| Styling | Tailwind CSS v4 (`@theme` tokens in `app/globals.css`) |
| Components | shadcn/ui structure (`components/ui`, `components.json`, `cn()` helper) |
| Icons | `lucide-react` |
| Data | Local typed catalogue (`lib/products.ts`, `lib/guides.ts`) — no CMS required |

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

## Project layout

```
app/
  layout.tsx                 announcement strip + header + <SiteFooter/> + fonts/metadata
  page.tsx                   home: hero, ticker, shortlist, manifesto, collections, method, notes, subscribe
  products/page.tsx          full catalogue with live filtering + sorting
  products/[slug]/page.tsx   review page: verdict, score bars, pros/cons, specs, buy box, alternatives
  collections/page.tsx       the three rooms
  collections/[slug]/page.tsx  category landing page (feature pick + rest of list)
  guides/page.tsx            field notes index
  guides/[slug]/page.tsx     long-form article + reading progress + mentioned products
  about/page.tsx             the method / editorial standards
  disclosure/page.tsx        affiliate disclosure + privacy
  api/subscribe/route.ts     newsletter capture endpoint
  sitemap.ts / robots.ts     SEO
components/
  ui/                        shadcn/ui primitives + pushpin-tear-footer.tsx
  site/                      header, footer wrapper, product cards, catalog, newsletter, reveal…
lib/
  products.ts                products, collections, scoring, money helpers
  guides.ts                  editorial content
  utils.ts                   cn()
```

### Why `components/ui` matters

`components.json` maps the `ui` alias to `@/components/ui`, which is what the shadcn CLI reads when you
run `npx shadcn@latest add <component>`. Keeping generated primitives in that folder means:

- the CLI can find, diff and update them instead of scattering duplicates;
- imports stay consistent (`@/components/ui/button`);
- the registry's dependency graph (e.g. `@radix-ui/react-slot`) resolves correctly.

If you ever restructure, update `aliases.ui` in `components.json` at the same time.

## The footer

- Component: `components/ui/pushpin-tear-footer.tsx` (drop-in, zero dependencies)
- Configured once for the brand: `components/site/site-footer.tsx`
- Rendered globally from `app/layout.tsx`

It is fully prop-driven: `brand`, `name`, `logo`, `socials`, `email`, `newsletter`, `status`, `mark`,
`timeZone`, `columns`, `chat`, `sideLinks`, `copyright`, `credit`, `handle`, plus the palette
(`sheet`, `paper`, `sheetInk`, `paperInk`), `seed`, `height`, `fontSans` and callbacks
(`onSubscribe`, `onRepin`).

In this build: electric-blue sheet (`#1a7ff0`) on bone paper, live **EAT** clock for Dar es Salaam,
seed `11`, and a `clamp(640px, 94svh, 1040px)` height so it stays a statement on laptops and doesn't
become a two-screen wall on large monitors. Click the pin to re-tear a new edge; the tear also reacts
to the pointer. Reduced-motion users get the finished poster with no animation.

`components/ui/pushpin-tear-footer.demo.tsx` is an unused usage example for a second brand treatment.

## Editing content

**Products** — add an object to `products` in `lib/products.ts` and a slug to the relevant
`collections[].productSlugs`. Every route (`/products/[slug]`, collection pages, sitemap) is generated
from this file. Images live in `public/products/`.

**Notes** — add to `guides` in `lib/guides.ts`; `productSlugs` drives the "mentioned in this note"
section.

**Affiliate links** — each product carries a `retailers` array. Replace the placeholder URLs
(currently Amazon/Best Buy search URLs) with your tracked links. `components/site/affiliate-button.tsx`
already ships `rel="sponsored nofollow noopener noreferrer"` and `target="_blank"`; keep that so the
disclosure is accurate.

**Newsletter** — both the footer and every inline form POST to `/api/subscribe`
(`app/api/subscribe/route.ts`). It validates and logs today; replace the handler body with your ESP
(Buttondown, ConvertKit, Resend audiences, Mailchimp…).

**Images** — the nine product photographs are AI-generated placeholders on a consistent warm-white
sweep. Swap them for real product photography at the same aspect ratio (cards use `4/5`).

## Design system

Tokens live in `app/globals.css` (`@theme`):

- `ink` `#0b0c0e`, `bone` `#f4f2ed`, `paper` `#f3f1ec`, `electric` `#1a7ff0`
- `font-display` — editorial serif stack; `font-sans` — system UI stack (no network font fetch)
- utilities: `label` (uppercase micro-type), `link-draw` (underline that draws in), `.reveal` (scroll-in, reduced-motion aware)

## Deploy

Any Node host works; Vercel is the shortest path:

```bash
npx vercel        # preview
npx vercel --prod # production
```

Set `metadataBase` in `app/layout.tsx` to your real domain before launch so Open Graph URLs resolve.
