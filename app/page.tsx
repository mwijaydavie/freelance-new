import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, MoveUpRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProductCard } from "@/components/site/product-card"
import { ScoreRing } from "@/components/site/score-ring"
import { NewsletterForm } from "@/components/site/newsletter-form"
import { Reveal } from "@/components/site/reveal"
import { collections, featured, money, products } from "@/lib/products"
import { guideDate, guides } from "@/lib/guides"

const SHELL = "mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12"

const TICKER = [
  "Bought at retail",
  "No paid placements",
  "One pick per category",
  "Re-tested every season",
  "Updated Fridays",
]

const METHOD = [
  {
    n: "01",
    title: "We buy it ourselves",
    body: "Every unit is purchased at full price from a normal retailer. Nothing here arrived as a sample, and no brand gets to see a verdict before you do.",
  },
  {
    n: "02",
    title: "We live with it for a month",
    body: "A month of real use, minimum. Commutes, late nights, a dishwasher cycle, a move. We keep the packaging for the first week because the honest test is whether you miss it when it's gone.",
  },
  {
    n: "03",
    title: "We keep exactly one",
    body: "Per category we recommend a single product, plus one value alternative when it genuinely helps. The rest go back. If a newer model is better, the old pick loses its place.",
  },
]

export default function HomePage() {
  const lead = featured[0]
  const notes = guides.slice(0, 3)

  return (
    <main>
      {/* ───────────────────────── hero ───────────────────────── */}
      <section className="relative overflow-hidden border-b border-ink/10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 top-[-18%] size-[620px] rounded-full bg-electric/10 blur-[120px]"
        />
        <div className={`${SHELL} relative pb-20 pt-12 lg:pb-28 lg:pt-16`}>
          <span className="pointer-events-none absolute right-1 top-1/2 hidden -translate-y-1/2 rotate-90 text-[10px] uppercase tracking-[0.42em] text-ink/25 xl:block">
            Est. 2026 — Dar es Salaam
          </span>
          <div className="grid items-end gap-14 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="outline" className="border-ink/20 bg-transparent">
                  <span className="size-1.5 rounded-full bg-electric" />
                  Issue 04 · November 2026
                </Badge>
                <span className="text-[11px] uppercase tracking-[0.18em] text-ink/40">
                  {products.length} picks live
                </span>
              </div>

              <h1 className="mt-7 font-display text-[clamp(2.85rem,7.2vw,6.2rem)] leading-[0.9] tracking-[-0.045em]">
                Buy the one
                <br />
                that&apos;s <span className="italic text-electric">worth it.</span>
              </h1>

              <p className="mt-8 max-w-[48ch] text-[15.5px] leading-[1.75] text-ink/60">
                We buy every product at retail, live with it for a month, then keep exactly one per
                category. Audio, desk and home — nine picks, no sponsored rankings, no forty tabs of
                research.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
                <Button asChild size="lg" className="gap-3 pl-7 pr-6">
                  <Link href="/products">
                    Browse the shortlist
                    <ArrowRight />
                  </Link>
                </Button>
                <Link
                  href="/about"
                  className="link-draw text-[13.5px] text-ink/60 transition-colors hover:text-ink"
                >
                  How we test →
                </Link>
              </div>

              <dl className="mt-14 grid max-w-[460px] grid-cols-3 gap-6 border-t border-ink/12 pt-6">
                {[
                  ["09", "picks live"],
                  ["1,780", "hours tested"],
                  ["00", "paid placements"],
                ].map(([v, k]) => (
                  <div key={k}>
                    <dt className="font-display text-3xl leading-none tracking-tight">{v}</dt>
                    <dd className="mt-2 text-[11px] uppercase tracking-[0.16em] text-ink/40">{k}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* featured pick */}
            <div className="relative lg:col-span-5">
              <Reveal className="relative pb-14 sm:pb-12">
                <div className="relative aspect-[4/5] overflow-hidden bg-paper">
                  <Image
                    src={lead.image}
                    alt={`${lead.maker} ${lead.name}`}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <span className="absolute right-4 top-4 -rotate-6 rounded-full bg-electric px-4 py-2 text-[10px] font-medium uppercase tracking-[0.2em] text-white shadow-[0_10px_30px_-12px_rgba(26,127,240,0.9)]">
                    Editor&apos;s pick
                  </span>
                  <span className="absolute left-4 top-4 label text-ink/50">Fig. 01</span>
                </div>

                <Link
                  href={`/products/${lead.slug}`}
                  className="group absolute bottom-0 left-0 w-[88%] max-w-[380px] border border-ink/12 bg-bone/95 p-5 backdrop-blur transition-colors hover:bg-white sm:-left-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="label text-ink/45">{lead.maker} · {lead.bestFor}</p>
                      <h2 className="mt-2 text-[22px] leading-none tracking-[-0.03em]">{lead.name}</h2>
                    </div>
                    <ScoreRing score={lead.score} size={44} />
                  </div>
                  <p className="mt-3 line-clamp-2 text-[12.5px] leading-relaxed text-ink/55">{lead.verdict}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-3">
                    <span className="text-[14px] tabular-nums">{money(lead.price)}</span>
                    <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-electric">
                      Read the verdict
                      <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── ticker ───────────────────────── */}
      <div className="overflow-hidden border-b border-ink/10 bg-ink py-3.5 text-bone">
        <div className="flex w-max animate-marquee items-center">
          {[0, 1].map((half) => (
            <div key={half} className="flex items-center" aria-hidden={half === 1}>
              {TICKER.map((t) => (
                <span key={t} className="flex items-center gap-8 pl-8">
                  <span className="whitespace-nowrap text-[11px] uppercase tracking-[0.24em] text-bone/70">
                    {t}
                  </span>
                  <span className="text-electric">✳</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ───────────────────────── shortlist ───────────────────────── */}
      <section className={`${SHELL} py-20 lg:py-28`}>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="label text-electric">The short list</p>
            <h2 className="mt-4 font-display text-[clamp(2.2rem,4vw,3.6rem)] leading-[0.95] tracking-[-0.035em]">
              What we&apos;d buy again
            </h2>
          </div>
          <Link
            href="/products"
            className="group flex items-center gap-2 border-b border-ink/20 pb-1 text-[13px] transition-colors hover:border-electric hover:text-electric"
          >
            All {products.length} picks
            <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="mt-12 grid gap-x-7 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product, i) => (
            <Reveal key={product.slug} delay={i * 90}>
              <ProductCard product={product} index={i} priority={i === 0} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────────────────────── manifesto ───────────────────────── */}
      <section className={`${SHELL} pb-20 lg:pb-24`}>
        <div className="grid gap-6 border-y border-ink/12 py-12 lg:grid-cols-12 lg:items-center lg:py-14">
          <div className="lg:col-span-2">
            <p className="label text-electric">A note</p>
          </div>
          <div className="lg:col-span-10">
            <blockquote className="max-w-[26ch] font-display text-[clamp(1.9rem,3.6vw,3.2rem)] leading-[1.06] tracking-[-0.035em]">
              &ldquo;The best product is the one you stop thinking about.&rdquo;
            </blockquote>
            <p className="mt-5 text-[10.5px] uppercase tracking-[0.18em] text-ink/35">
              Genie, issue 04 — on the standard we hold
            </p>
          </div>
        </div>
      </section>

      {/* ───────────────────────── rooms ───────────────────────── */}
      <section className={`${SHELL} pb-20 lg:pb-28`}>
        <div className="flex items-end justify-between gap-6 border-t border-ink/12 pt-8">
          <h2 className="font-display text-[clamp(1.6rem,2.6vw,2.4rem)] tracking-[-0.03em]">
            Three rooms, one standard
          </h2>
          <Link href="/products" className="hidden text-[13px] text-ink/50 hover:text-ink sm:block">
            See everything →
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {collections.map((c, i) => (
            <Reveal key={c.id} delay={i * 90}>
              <Link href={`/collections/${c.slug}`} className="group relative block overflow-hidden bg-ink">
                <div className="relative aspect-[3/4]">
                  <Image
                    src={c.image}
                    alt={c.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent opacity-90" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-bone lg:p-7">
                    <span className="text-[10px] uppercase tracking-[0.24em] text-bone/60">{c.kicker}</span>
                    <div className="mt-2 flex items-end justify-between gap-4">
                      <h3 className="font-display text-[34px] leading-none tracking-[-0.03em]">{c.title}</h3>
                      <span className="mb-1 grid size-9 shrink-0 place-items-center rounded-full border border-bone/30 transition-all duration-500 group-hover:border-electric group-hover:bg-electric">
                        <MoveUpRight className="size-4" />
                      </span>
                    </div>
                    <p className="mt-3 max-w-[30ch] text-[13px] leading-relaxed text-bone/65">{c.blurb}</p>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────────────────────── method ───────────────────────── */}
      <section className="bg-ink text-bone">
        <div className={`${SHELL} grid gap-14 py-20 lg:grid-cols-12 lg:gap-8 lg:py-28`}>
          <div className="lg:col-span-5">
            <p className="label text-electric">The method</p>
            <h2 className="mt-4 font-display text-[clamp(2.2rem,4vw,3.6rem)] leading-[0.95] tracking-[-0.035em] text-bone">
              We buy it. We live with it.
              <br />
              <span className="italic text-bone/45">We keep one.</span>
            </h2>
            <p className="mt-6 max-w-[36ch] text-[14px] leading-[1.8] text-bone/55">
              Genie is reader-supported. When you buy through a link on this site we may earn a
              commission — it never changes what we recommend, and it never buys a place on the list.
            </p>
            <Link
              href="/about"
              className="mt-8 inline-flex items-center gap-2 border-b border-bone/25 pb-1 text-[13px] text-bone/75 transition-colors hover:border-electric hover:text-electric"
            >
              Read the full method
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>

          <div className="lg:col-span-7 lg:pl-10">
            <div className="border-t border-bone/15">
              {METHOD.map((m, i) => (
                <Reveal key={m.n} delay={i * 80} className="flex gap-6 border-b border-bone/15 py-7">
                  <span className="pt-1 font-display text-[13px] tabular-nums text-electric">{m.n}</span>
                  <div>
                    <h3 className="text-[17px] tracking-[-0.01em]">{m.title}</h3>
                    <p className="mt-2 max-w-[52ch] text-[13.5px] leading-[1.8] text-bone/55">{m.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <p className="mt-8 flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-bone/35">
              <span className="size-1.5 rounded-full bg-electric" />
              No samples · No paid rankings · No exit-scam energy
            </p>
          </div>
        </div>
      </section>

      {/* ───────────────────────── field notes ───────────────────────── */}
      <section className={`${SHELL} py-20 lg:py-28`}>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="label text-electric">Field notes</p>
            <h2 className="mt-4 font-display text-[clamp(2.2rem,4vw,3.6rem)] leading-[0.95] tracking-[-0.035em]">
              Notes from the bench
            </h2>
          </div>
          <Link href="/guides" className="group flex items-center gap-2 text-[13px] text-ink/55 hover:text-ink">
            All notes
            <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-7">
            <Link href={`/guides/${notes[0].slug}`} className="group block">
              <div className="relative aspect-[16/11] overflow-hidden bg-paper">
                <Image
                  src={notes[0].image}
                  alt={notes[0].title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover transition-transform duration-[900ms] group-hover:scale-[1.03]"
                />
                <span className="absolute left-4 top-4 rounded-full bg-bone/95 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em]">
                  {notes[0].kicker}
                </span>
              </div>
              <h3 className="mt-5 max-w-[30ch] font-display text-[clamp(1.7rem,2.6vw,2.4rem)] leading-[1.05] tracking-[-0.03em] transition-colors group-hover:text-electric">
                {notes[0].title}
              </h3>
              <p className="mt-3 max-w-[52ch] text-[14px] leading-[1.8] text-ink/55">{notes[0].excerpt}</p>
              <p className="mt-4 text-[11px] uppercase tracking-[0.16em] text-ink/35">
                {guideDate(notes[0].date)} · {notes[0].readTime} read
              </p>
            </Link>
          </Reveal>

          <div className="lg:col-span-5">
            <div className="border-t border-ink/12">
              {notes.slice(1).map((g, i) => (
                <Reveal key={g.slug} delay={i * 90}>
                  <Link
                    href={`/guides/${g.slug}`}
                    className="group flex items-start gap-5 border-b border-ink/12 py-6"
                  >
                    <div className="relative size-20 shrink-0 overflow-hidden bg-paper sm:size-24">
                      <Image src={g.image} alt={g.title} fill sizes="96px" className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-ink/40">
                        {g.kicker} · {g.readTime}
                      </p>
                      <h3 className="mt-2 max-w-[26ch] text-[18px] leading-[1.25] tracking-[-0.02em] transition-colors group-hover:text-electric">
                        {g.title}
                      </h3>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>

            <Reveal delay={160} className="mt-8 border border-ink/12 bg-white/40 p-6">
              <p className="label text-ink/40">Currently testing</p>
              <p className="mt-3 font-display text-[22px] leading-[1.2] tracking-[-0.02em]">
                Six new arrivals, one month, one survivor per room.
              </p>
              <Link
                href="/products"
                className="mt-4 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.16em] text-electric"
              >
                See what&apos;s on the bench
                <ArrowUpRight className="size-3.5" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────────────────────── subscribe ───────────────────────── */}
      <section id="subscribe" className={`${SHELL} scroll-mt-24 pb-20 lg:pb-24`}>
        <Reveal className="relative overflow-hidden border border-ink/12 bg-white/45 px-6 py-14 sm:px-12 lg:px-16 lg:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-electric/10 blur-3xl"
          />
          <div className="relative grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="label text-electric">Every Friday, 7am</p>
              <h2 className="mt-4 font-display text-[clamp(2rem,3.6vw,3.2rem)] leading-[0.98] tracking-[-0.035em]">
                One short list.
                <br />
                <span className="italic text-ink/45">Nothing else.</span>
              </h2>
              <p className="mt-4 max-w-[40ch] text-[14px] leading-[1.8] text-ink/55">
                What we tested, what we kept, what we returned — plus early access to new picks before
                they go on the site.
              </p>
            </div>
            <div className="lg:col-span-5 lg:justify-self-end">
              <NewsletterForm source="home" />
              <p className="mt-5 text-[11px] uppercase tracking-[0.16em] text-ink/35">
                12,400 readers · no affiliate links in the email
              </p>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  )
}
