# Genie — monetisation strategy

The site is a distribution business with a review layer on top. Revenue follows in this order:
**tag the links → capture intent with pages → own the audience → diversify**.

## 1. Unit economics (know the number)

| Input | Conservative | Working |
|---|---|---|
| Monthly sessions | 4,000 | 10,000 |
| Outbound click rate | 8% | 12% |
| Click → sale | 3% | 4.5% |
| Average order value | $140 | $180 |
| Blended commission | 5% | 6% |
| **Monthly gross** | **$67** | **$583** |

At 10k sessions this site should clear roughly $580/month with zero sponsored content. The same
traffic with a 300-person email list and two direct brand deals is closer to $1,200–1,800. Traffic is
the raw material; **the list and the direct deals are the margin.**

## 2. First 14 days — make the links earn

1. **Networks:** Amazon Associates (volume, 1–4% on electronics) + one premium network — Impact,
   Awin or CJ (8–15% on home and audio brands). Both need a live site with original reviews; we have
   nine.
2. **Tag every retailer URL** in the admin console (`/admin/products`). Until this is done, traffic
   is worth $0.
3. **Tag by placement, not product.** Distinct tracking IDs for: hero card, buy box, comparison
   table, footer, newsletter. After 30 days the data tells you which slot to move above the fold.
4. **One product = one decision.** Price, score, who it's for, buy button — in the first screen. Keep
   the long review below it for trust and SEO.
5. **Geo:** OneLink (Amazon) or edge routing for UK/EU. Local retailer = 2–3× conversion.

## 3. Days 15–60 — pages that capture buying intent

Affiliate revenue concentrates in **comparison intent**, not brand names. People search "best
headphones for small heads", not "Aura One".

Build, in this order:

- **`/best/[category]` hubs** — "Best over-ear headphones under $400". One primary pick, two
  alternatives, a five-column table (score, price, best for, battery, buy), FAQ schema.
- **Modifier pages** — best for travel / for glasses / for small rooms / under $200. One per
  high-volume modifier, 700–1,000 words.
- **Comparison pairs** — "Aura One vs. the class leader". These convert at 2–3× a review page.
- **Collection hubs** (already live) — internally link every pick to its hub and to one guide. Aim
  for 3–5 contextual links per page.
- **Structured data** — `Product` + `Review` + `FAQPage` (Product is already implemented).
  Rich results lift CTR by 10–20% and you already have the scores to support them.

Cadence: one new page per week beats a redesign every month. Update the "last updated" date on every
touch — freshness correlates with ranking on commercial queries.

## 4. Days 60–120 — own the audience

The email list is the only asset no algorithm can take away.

- **Lead magnet:** "The Short List" — nine picks, prices, what we returned and why. Friday, 7am.
- **Welcome sequence (5 emails):** the shortlist → one full review → the method → a correction we
  published → the best-value pick. Every email carries tagged links.
- **Weekly format:** one pick, one price, one "we were sent this and returned it". 400 words.
- **At 300 engaged subscribers** you can sell a clearly-labelled sponsored slot in the email
  ($150–400 per send in a niche this tight). That is revenue independent of Google.
- **Price-drop alerts** ("tell me when this drops under $300") is the strongest retention hook in
  affiliate — start with a manual weekly check, automate later.

## 5. Months 4–6 — diversify

1. **Direct brand deals**, clearly disclosed: paid testing, sponsored comparisons, newsletter slots.
   Never sell a score. The disclosure is the product.
2. **Premium network migration:** move the top-performing brands off Amazon where the commission is
   3–4× higher.
3. **Bundles and "the full setup" pages** — AOV is the fastest lever you control.
4. **Sell the system:** the design, console and method are a product for other niche reviewers
   (template, teardown, or a paid community). Highest margin, no inventory.
5. **Video/short-form cut-downs** of each review — YouTube descriptions carry affiliate links and
   rank independently of the site.

## 6. Operating cadence

| Ritual | When | Output |
|---|---|---|
| Publish one pick or page | Weekly | Catalogue grows |
| Update the three money pages | Fortnightly | Freshness + ranking |
| Review placement tracking IDs | Monthly | Move the winning CTA up |
| Email send | Friday | List revenue |
| Prune | Quarterly | Unpublish dead picks, redirect their URLs |

## 7. Guardrails

- Never publish a score you cannot defend in a sentence.
- Every commercial link: `rel="sponsored nofollow noopener noreferrer"` and disclosed above the fold.
- One correction is worth ten perfect reviews — correct publicly, date the change.
- If a pick stops being the best, it loses its place. The list is the brand.
