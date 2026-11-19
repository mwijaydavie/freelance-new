import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Check, Minus, ShieldCheck, Sparkle } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { AffiliateButton } from "@/components/site/affiliate-button"
import { ProductCard } from "@/components/site/product-card"
import { ScoreRing } from "@/components/site/score-ring"
import { NewsletterForm } from "@/components/site/newsletter-form"
import { Reveal } from "@/components/site/reveal"
import {
  getCollection,
  getProduct,
  money,
  products,
  productsIn,
  updatedLabel,
} from "@/lib/products"
import { guides } from "@/lib/guides"

const SHELL = "mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12"

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) return { title: "Pick not found" }
  return {
    title: `${product.name} review`,
    description: `${product.verdict} Genie score ${product.score}/100 — tested for ${product.testedHours} hours.`,
    openGraph: {
      title: `${product.maker} ${product.name} — Genie review`,
      description: product.verdict,
      images: [{ url: product.image }],
    },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) notFound()

  const collection = getCollection(product.collection)
  const siblings = productsIn(product.collection).filter((p) => p.slug !== product.slug)
  const notes = guides.filter((g) => g.productSlugs.includes(product.slug))

  return (
    <main>
      {/* ── masthead ── */}
      <section className={`${SHELL} pt-10 lg:pt-14`}>
        <nav aria-label="Breadcrumb" className="text-[11px] uppercase tracking-[0.16em] text-ink/35">
          <Link href="/" className="hover:text-ink">
            Genie
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/collections/${collection.slug}`} className="hover:text-ink">
            {collection.title}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink/60">{product.name}</span>
        </nav>

        <div className="mt-7 flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="label text-electric">
              {product.maker} · {collection.title}
            </p>
            <h1 className="mt-3 font-display text-[clamp(2.6rem,6vw,5rem)] leading-[0.94] tracking-[-0.045em]">
              {product.name}
            </h1>
            <p className="mt-4 max-w-[54ch] text-[16px] leading-[1.65] text-ink/60">{product.verdict}</p>
          </div>

          <div className="flex items-center gap-5">
            {product.badge && <Badge variant="electric" className="hidden sm:inline-flex">{product.badge}</Badge>}
            <div className="flex items-center gap-3 border-l border-ink/12 pl-5">
              <ScoreRing score={product.score} size={54} />
              <div className="text-[11px] uppercase leading-tight tracking-[0.14em] text-ink/40">
                Genie
                <br />
                score
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── hero ── */}
      <section className={`${SHELL} mt-10`}>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <div className="relative aspect-[5/4] overflow-hidden bg-paper">
              <Image
                src={product.image}
                alt={`${product.maker} ${product.name}`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover"
              />
              <span className="absolute left-4 top-4 rounded-full bg-bone/95 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] backdrop-blur">
                Tested {product.testedHours} h
              </span>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[11px] uppercase tracking-[0.14em] text-ink/35">
              <span>
                Bought at retail · {money(product.retailers[0].price)} · updated{" "}
                {updatedLabel(product.updated)}
              </span>
              <span>Photos: Genie studio</span>
            </div>

            {/* score breakdown */}
            <div className="mt-10 border-t border-ink/12 pt-8">
              <h2 className="text-[11px] uppercase tracking-[0.18em] text-ink/40">How it scored</h2>
              <div className="mt-6 grid gap-x-12 gap-y-4 sm:grid-cols-2">
                {product.scores.map((s) => (
                  <div key={s.label} className="flex items-center gap-4">
                    <span className="w-24 shrink-0 text-[12.5px] text-ink/60">{s.label}</span>
                    <span className="h-px flex-1 bg-ink/10">
                      <span className="block h-px bg-electric" style={{ width: `${s.value}%` }} />
                    </span>
                    <span className="w-7 text-right text-[12px] tabular-nums text-ink/45">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* buy column */}
          <aside className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <div className="border border-ink/12 bg-white/55 p-6 sm:p-7">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-ink/40">Best price</p>
                    <p className="mt-1 font-display text-[42px] leading-none tabular-nums tracking-[-0.03em]">
                      {money(product.price)}
                    </p>
                  </div>
                  <span className="flex items-center gap-1.5 rounded-full bg-electric/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] text-electric">
                    <Sparkle className="size-3" />
                    {product.badge ?? "Shortlisted"}
                  </span>
                </div>

                <div className="mt-6 grid gap-2.5">
                  {product.retailers.map((r, i) => (
                    <AffiliateButton
                      key={r.name}
                      retailer={r}
                      variant={i === 0 ? "solid" : "outline"}
                    />
                  ))}
                </div>

                <p className="mt-5 flex items-start gap-2 text-[11.5px] leading-relaxed text-ink/45">
                  <ShieldCheck className="mt-px size-4 shrink-0 text-ink/30" />
                  We may earn a commission if you buy through these links. It never changes the score,
                  the ranking, or what we say.
                </p>

                <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-ink/10 pt-5 text-[12px]">
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.14em] text-ink/35">Best for</dt>
                    <dd className="mt-1 leading-snug text-ink/75">{product.bestFor}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.14em] text-ink/35">In testing</dt>
                    <dd className="mt-1 leading-snug text-ink/75">{product.testedHours} hours, 1 month</dd>
                  </div>
                </dl>
              </div>

              <div className="mt-4 flex items-center gap-2 px-1 text-[11px] uppercase tracking-[0.14em] text-ink/35">
                <Check className="size-3.5 text-electric" />
                Independently bought · no brand input
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ── verdict ── */}
      <section className={`${SHELL} mt-20 lg:mt-28`}>
        <div className="grid gap-10 border-t border-ink/12 pt-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <h2 className="font-display text-[clamp(1.9rem,3vw,2.6rem)] leading-[1.02] tracking-[-0.03em]">
              The verdict
            </h2>
            <p className="mt-3 text-[12px] uppercase tracking-[0.14em] text-ink/35">
              {product.maker} · {product.name}
            </p>
          </div>
          <div className="lg:col-span-8">
            <p className="max-w-[62ch] text-[17px] leading-[1.75] text-ink/75 first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:font-display first-letter:text-[54px] first-letter:leading-[0.8]">
              {product.summary}
            </p>

            <div className="mt-12 grid gap-10 sm:grid-cols-2">
              <div>
                <h3 className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ink/40">
                  <span className="grid size-5 place-items-center rounded-full bg-electric/10 text-electric">
                    <Check className="size-3" />
                  </span>
                  What we liked
                </h3>
                <ul className="mt-5 grid gap-3">
                  {product.pros.map((pro) => (
                    <li key={pro} className="flex gap-3 border-b border-ink/8 pb-3 text-[14px] leading-snug text-ink/70">
                      <span className="text-electric">+</span>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ink/40">
                  <span className="grid size-5 place-items-center rounded-full bg-ink/5 text-ink/50">
                    <Minus className="size-3" />
                  </span>
                  What to know
                </h3>
                <ul className="mt-5 grid gap-3">
                  {product.cons.map((con) => (
                    <li key={con} className="flex gap-3 border-b border-ink/8 pb-3 text-[14px] leading-snug text-ink/55">
                      <span className="text-ink/30">–</span>
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── specs ── */}
      <section className={`${SHELL} mt-16`}>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <h2 className="text-[11px] uppercase tracking-[0.18em] text-ink/40">The spec sheet</h2>
            <p className="mt-3 max-w-[30ch] text-[13px] leading-relaxed text-ink/45">
              Only the numbers that changed how we used it. Full manufacturer specs are rarely the
              interesting part.
            </p>
          </div>
          <div className="lg:col-span-8">
            <dl className="grid sm:grid-cols-2">
              {product.specs.map((s) => (
                <div
                  key={s.label}
                  className="flex items-baseline justify-between gap-6 border-b border-ink/10 py-4"
                >
                  <dt className="text-[11px] uppercase tracking-[0.14em] text-ink/40">{s.label}</dt>
                  <dd className="text-right text-[14px] text-ink/80">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ── alternatives ── */}
      {siblings.length > 0 && (
        <section className={`${SHELL} mt-24`}>
          <div className="flex flex-wrap items-end justify-between gap-4 border-t border-ink/12 pt-8">
            <div>
              <p className="label text-electric">Also in {collection.title.toLowerCase()}</p>
              <h2 className="mt-3 font-display text-[clamp(1.8rem,3vw,2.6rem)] tracking-[-0.03em]">
                If {product.name} isn&apos;t it
              </h2>
            </div>
            <Link
              href={`/collections/${collection.slug}`}
              className="text-[13px] text-ink/50 transition-colors hover:text-ink"
            >
              All {collection.title.toLowerCase()} picks →
            </Link>
          </div>
          <div className="mt-10 grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {siblings.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* ── notes + newsletter ── */}
      <section className={`${SHELL} mt-24 pb-20`}>
        <div className="grid gap-10 border-t border-ink/12 pt-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <h2 className="text-[11px] uppercase tracking-[0.18em] text-ink/40">Read next</h2>
            <div className="mt-5 divide-y divide-ink/10">
              {(notes.length ? notes : guides.slice(0, 2)).map((g) => (
                <Link key={g.slug} href={`/guides/${g.slug}`} className="group flex items-center gap-5 py-5">
                  <div className="relative size-16 shrink-0 overflow-hidden bg-paper">
                    <Image src={g.image} alt={g.title} fill sizes="64px" className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-ink/35">
                      {g.kicker} · {g.readTime}
                    </p>
                    <h3 className="mt-1.5 text-[17px] leading-snug tracking-[-0.02em] transition-colors group-hover:text-electric">
                      {g.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
            <Link
              href="/products"
              className="mt-8 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.16em] text-ink/50 hover:text-ink"
            >
              <ArrowLeft className="size-3.5" />
              Back to the shortlist
            </Link>
          </div>

          <div className="lg:col-span-5">
            <Reveal className="border border-ink/12 bg-white/45 p-7">
              <p className="label text-electric">The Friday list</p>
              <p className="mt-3 font-display text-[26px] leading-[1.1] tracking-[-0.02em]">
                One pick, one email, every Friday.
              </p>
              <div className="mt-5">
                <NewsletterForm source={`product-${product.slug}`} note="No affiliate links in the email." />
              </div>
            </Reveal>
          </div>
        </div>

        <p className="mt-14 border-t border-ink/10 pt-5 text-[11px] leading-relaxed text-ink/35">
          {product.name} was purchased at retail for this review. Links to retailers are affiliate
          links — see our{" "}
          <Link href="/disclosure" className="underline underline-offset-2 hover:text-ink">
            disclosure
          </Link>
          . Prices and availability were accurate on {updatedLabel(product.updated)} and can change.
        </p>
      </section>
    </main>
  )
}
