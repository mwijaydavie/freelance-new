import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Disclosure & privacy",
  description:
    "How Genie makes money, how affiliate links work on this site, and what we do with your email address.",
}

const SHELL = "mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12"

const SECTIONS = [
  {
    id: "affiliate",
    title: "Affiliate links",
    body: [
      "Some links on Genie are affiliate links. If you click one and buy something, the retailer may pay us a small commission — usually between 1% and 8% of the sale price. It costs you nothing extra, and the price you pay is the same as it would be if you had arrived without us.",
      "Every commercial link is marked with rel=\"sponsored nofollow\" in the markup. Nothing on this site is a paid placement: brands cannot buy a score, a ranking, a badge, or a place in a guide. We do not accept payment to review a product, and we do not allow brands to preview a verdict.",
    ],
  },
  {
    id: "independence",
    title: "Editorial independence",
    body: [
      "We buy every product at full retail price. We do not accept samples, seeded units, or travel from brands. When a product is loaned to us for a specific test — which happens rarely, and only for things that cannot be bought — we say so in the first paragraph of the review.",
      "Recommendations are made before we look at commission rates. Where two products are genuinely equivalent, we will link to whichever retailer offers the better price and return policy for you, not the better rate for us.",
    ],
  },
  {
    id: "prices",
    title: "Prices and availability",
    body: [
      "Prices shown are the ones we saw when the page was last updated. They change often, and the price on the retailer's page is always the one that counts. We do not guarantee availability, and we do not take payment or handle orders — checkout happens on the retailer's site.",
    ],
  },
  {
    id: "privacy",
    title: "Privacy",
    body: [
      "The only thing we ask for is an email address, and only if you want the Friday list. We store it with our email provider, we use it to send that newsletter, and we do not sell, rent, or share it. Every email has a one-click unsubscribe link.",
      "We use no advertising cookies and no third-party tracking pixels on this site. Aggregate, anonymous page analytics tell us which picks people read; they are not tied to a person.",
    ],
  },
  {
    id: "corrections",
    title: "Corrections",
    body: [
      "If we get something wrong, email hello@genie.reviews and we will correct it. Substantive corrections are noted at the top of the review with the date and what changed. We would rather be corrected than quoted.",
    ],
  },
]

export default function DisclosurePage() {
  return (
    <main>
      <section className={`${SHELL} pt-12 lg:pt-16`}>
        <p className="label text-electric">The fine print, in plain language</p>
        <h1 className="mt-6 max-w-[20ch] font-display text-[clamp(2.6rem,6vw,5rem)] leading-[0.92] tracking-[-0.045em]">
          Disclosure &amp; privacy.
        </h1>
        <p className="mt-6 max-w-[56ch] text-[15.5px] leading-[1.8] text-ink/60">
          Short version: we make money from affiliate commissions, we never sell rankings, and we keep
          your email to ourselves. The longer version is below.
        </p>
        <p className="mt-4 text-[11px] uppercase tracking-[0.14em] text-ink/35">
          Last updated 19 November 2026
        </p>
      </section>

      <section className={`${SHELL} mt-14 pb-24`}>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-24">
              <p className="text-[10px] uppercase tracking-[0.18em] text-ink/35">On this page</p>
              <ol className="mt-4 grid gap-3">
                {SECTIONS.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="text-[12.5px] text-ink/50 transition-colors hover:text-ink">
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </aside>

          <div className="lg:col-span-9">
            <div className="max-w-[68ch] divide-y divide-ink/12 border-t border-ink/12">
              {SECTIONS.map((s) => (
                <section key={s.id} id={s.id} className="scroll-mt-28 py-9">
                  <h2 className="font-display text-[clamp(1.5rem,2.4vw,2rem)] tracking-[-0.03em]">{s.title}</h2>
                  {s.body.map((p, i) => (
                    <p key={i} className="mt-4 text-[15px] leading-[1.85] text-ink/65">
                      {p}
                    </p>
                  ))}
                </section>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.14em] text-ink/35">
              <Link href="/about" className="hover:text-ink">
                The method →
              </Link>
              <a href="mailto:hello@genie.reviews" className="hover:text-ink">
                hello@genie.reviews
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
