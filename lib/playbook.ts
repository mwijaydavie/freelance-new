/**
 * The revenue playbook shown inside the admin console.
 * Edit freely — it is plain content, no logic.
 */

export type PlaybookPhase = {
  id: string
  window: string
  title: string
  goal: string
  kpi: string
  moves: { title: string; body: string; done?: boolean }[]
}

export const playbook: PlaybookPhase[] = [
  {
    id: "week-1",
    window: "Week 1",
    title: "Get paid for the traffic you already have",
    goal: "Every outbound link must earn. No untagged clicks, no dead ends.",
    kpi: "100% of buy links tagged · first commission within 14 days",
    moves: [
      {
        title: "Join two networks, not five",
        body: "Amazon Associates for volume + one premium network (Impact, Awin or CJ) for the brands that pay 8–15%. Approvals need a live site with original reviews — the site already qualifies.",
      },
      {
        title: "Replace every placeholder URL",
        body: "The nine picks currently link to search pages. Swap each retailer entry for a tracked link. OneLink/geo-routing if you expect traffic outside the US.",
      },
      {
        title: "Tag by placement, not by product",
        body: "Use distinct tracking IDs per placement — hero card, buy box, comparison table, newsletter. In 30 days you will know which slot actually converts, and that decides the whole layout.",
      },
      {
        title: "Fix the money pages' intent",
        body: "One product page = one decision. Above the fold: price, score, who it is for, and a buy button. Everything else is support. We already follow this; keep it when you add picks.",
      },
    ],
  },
  {
    id: "week-2-4",
    window: "Weeks 2–4",
    title: "Build the high-intent pages search actually pays for",
    goal: "Move from 9 product pages to a hub with comparison and 'best for' pages.",
    kpi: "12 indexable pages · 3 keyword clusters · first organic clicks",
    moves: [
      {
        title: "Publish 'best X for Y' pages",
        body: "Buyers search 'best headphones for small heads', not 'Aura One'. Each comparison page targets one modifier, links to 2–3 picks, and ends with a table. This is where affiliate revenue concentrates.",
      },
      {
        title: "Add the comparison table",
        body: "Score, price, best-for, battery/lifespan, buy link — five columns max. It gets featured-snippet traffic and converts better than prose.",
      },
      {
        title: "Add FAQ schema",
        body: "Three real questions per page, marked up. Cheap, and it wins the 'people also ask' box that sits above the affiliate results.",
      },
      {
        title: "Internal-link every pick to its collection and one guide",
        body: "Aim for 3–5 contextual links per page. This is how a 9-page site behaves like a 30-page site for crawl depth and session time.",
      },
    ],
  },
  {
    id: "month-2",
    window: "Month 2",
    title: "Own the email list — the only asset you control",
    goal: "Convert readers to subscribers, then monetise the list directly.",
    kpi: "300 subscribers · 45% open rate · £0.80–£1.50 per subscriber per month",
    moves: [
      {
        title: "One lead magnet, one promise",
        body: "'The Short List' — the nine picks, the prices, what we returned and why. Delivered Friday. The footer and every page already capture this; keep the copy identical everywhere.",
      },
      {
        title: "Automate the pick-of-the-week sequence",
        body: "Five emails: the shortlist, one review, one method note, one 'we were wrong' correction, one best-value pick. Each carries tracked affiliate links.",
      },
      {
        title: "Sell the list before you grow it",
        body: "At 300 engaged subscribers you can charge for a sponsored slot in the Friday email (clearly labelled). That is the first revenue that does not depend on Google.",
      },
    ],
  },
  {
    id: "month-3-6",
    window: "Months 3–6",
    title: "Layer revenue that compounds",
    goal: "Reduce dependence on a single retailer and a single algorithm.",
    kpi: "3 revenue lines · 30% non-Amazon income · 6k monthly sessions",
    moves: [
      {
        title: "Direct brand deals (disclosed)",
        body: "Once you have traffic, brands pay for testing and for a clearly-marked 'sponsored comparison'. Keep editorial scores out of it — the disclosure is the product.",
      },
      {
        title: "Price-drop alerts",
        body: "The strongest affiliate retention tool: 'tell me when the Aura One drops below $300'. Affiliate networks can supply price feeds. Start with a manual weekly check.",
      },
      {
        title: "Geo-split the links",
        body: "US/UK/EU traffic should hit local retailers with local currency. OneLink does this automatically; otherwise route by IP at the edge.",
      },
      {
        title: "Sell the system",
        body: "The site design, console and method are themselves a product — a template or a paid teardown for other niche reviewers. Highest margin, zero inventory.",
      },
    ],
  },
]

export const revenueMath = [
  { label: "Monthly sessions", value: "10,000" },
  { label: "Outbound click rate", value: "12%" },
  { label: "Conversion to sale", value: "4.5%" },
  { label: "Average order value", value: "$180" },
  { label: "Blended commission", value: "6%" },
  { label: "Monthly gross", value: "$583" },
]
