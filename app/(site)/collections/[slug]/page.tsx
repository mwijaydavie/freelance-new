import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowUpRight } from "lucide-react"

import { AffiliateButton } from "@/components/site/affiliate-button"
import { ProductCard } from "@/components/site/product-card"
import { ScoreRing } from "@/components/site/score-ring"
import { NewsletterForm } from "@/components/site/newsletter-form"
import { Reveal } from "@/components/site/reveal"
import { Badge } from "@/components/ui/badge"
import { listCollections, findCollection } from "@/lib/catalog"
import { money, updatedLabel } from "@/lib/products"

const SHELL = "mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const collection = await findCollection(slug)
  if (!collection) return { title: "Collection not found" }
  return {
    title: `${collection.title} picks`,
    description: collection.blurb,
    openGraph: { title: `${collection.title} — Genie`, description: collection.blurb, images: [{ url: collection.image }] },
  }
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const collection = await findCollection(slug)
  if (!collection) notFound()

  const items = collection.items
  const top = items[0]
  const others = items.slice(1)
  const allCollections = await listCollections()
  const index = allCollections.findIndex((c) => c.id === collection.id)
  const next = allCollections[(index + 1) % allCollections.length]

  return (
    <main>
      {/* hero */}
      <section className={`${SHELL} pt-10 lg:pt-14`}>
        <nav aria-label="Breadcrumb" className="text-[11px] uppercase tracking-[0.16em] text-ink/35">
          <Link href="/" className="hover:text-ink">
            Genie
          </Link>
          <span className="mx-2">/</span>
          <Link href="/collections" className="hover:text-ink">
            Collections
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink/60">{collection.title}</span>
        </nav>

        <div className="mt-8 grid gap-12 lg:grid-cols-12 lg:gap-10 lg:items-end">
          <div className="lg:col-span-7">
            <span className="text-[10px] uppercase tracking-[0.24em] text-ink/40">{collection.kicker}</span>
            <h1 className="mt-4 font-display text-[clamp(3rem,8vw,6.4rem)] leading-[0.88] tracking-[-0.05em]">
              {collection.title}
            </h1>
            <p className="mt-7 max-w-[50ch] text-[15.5px] leading-[1.8] text-ink/60">{collection.intro}</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-[11px] uppercase tracking-[0.14em] text-ink/35">
              <span>{String(items.length).padStart(2, "0")} picks</span>
              <span>{items.reduce((s, p) => s + p.testedHours, 0)} h tested</span>
              {items[0] && <span>Updated {updatedLabel(items[0].updated)}</span>}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative aspect-[4/3] overflow-hidden bg-paper">
              <Image
                src={collection.image}
                alt={collection.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <span className="absolute bottom-4 left-4 rounded-full bg-ink/80 px-3.5 py-2 text-[10px] uppercase tracking-[0.18em] text-bone backdrop-blur">
                The {collection.title.toLowerCase()} edit
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* top pick feature */}
      <section className={`${SHELL} mt-16 lg:mt-24`}>
        {!top && (
          <div className="border border-ink/12 bg-white/45 p-10 text-center">
            <p className="text-[11px] uppercase tracking-[0.18em] text-ink/40">On the bench</p>
            <p className="mt-3 font-display text-[clamp(1.5rem,2.6vw,2.2rem)] tracking-[-0.03em]">
              Nothing published in this room yet.
            </p>
            <p className="mt-2 text-[13px] text-ink/50">
              The next pick lands on Friday — add it from the admin console.
            </p>
          </div>
        )}
        {top && (
        <div className="grid gap-0 border border-ink/12 bg-white/45 lg:grid-cols-12">
          <div className="relative min-h-[320px] lg:col-span-6">
            <Image
              src={top.image}
              alt={`${top.maker} ${top.name}`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <span className="absolute left-5 top-5 -rotate-3 rounded-full bg-electric px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-white">
              Our pick
            </span>
          </div>
          <div className="p-7 sm:p-10 lg:col-span-6 lg:p-12">
            <div className="flex items-center justify-between gap-4">
              <p className="label text-ink/40">{top.maker}</p>
              <ScoreRing score={top.score} size={50} />
            </div>
            <h2 className="mt-4 font-display text-[clamp(2rem,3.6vw,3rem)] leading-[0.98] tracking-[-0.035em]">
              {top.name}
            </h2>
            <p className="mt-4 max-w-[44ch] text-[14.5px] leading-[1.8] text-ink/60">{top.verdict}</p>

            <ul className="mt-6 grid gap-2">
              {top.pros.slice(0, 3).map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-[13px] leading-snug text-ink/65">
                  <span className="mt-0.5 text-electric">+</span>
                  {p}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <AffiliateButton
                retailer={{ ...top.retailers[0], name: `Buy · ${money(top.price)}` }}
                label={`Editor's pick · ${top.maker}`}
                className="min-w-[240px]"
              />
              <Link
                href={`/products/${top.slug}`}
                className="group flex items-center gap-2 px-2 py-3 text-[12.5px] uppercase tracking-[0.14em] text-ink/50 hover:text-ink"
              >
                Full review
                <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
        )}
      </section>

      {/* the rest */}
      {others.length > 0 && (
        <section className={`${SHELL} mt-20`}>
          <div className="flex items-end justify-between gap-4 border-t border-ink/12 pt-8">
            <h2 className="font-display text-[clamp(1.8rem,3vw,2.6rem)] tracking-[-0.03em]">
              The rest of the {collection.title.toLowerCase()} list
            </h2>
            <Link href="/products" className="text-[13px] text-ink/50 hover:text-ink">
              All picks →
            </Link>
          </div>
          <div className="mt-10 grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((p, i) => (
              <Reveal key={p.slug} delay={i * 80}>
                <ProductCard product={p} index={i} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* how we picked + newsletter */}
      <section className={`${SHELL} mt-24 pb-20`}>
        <div className="grid gap-10 border-t border-ink/12 pt-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <Badge variant="outline">Same standard, every room</Badge>
            <h2 className="mt-5 max-w-[24ch] font-display text-[clamp(1.7rem,2.8vw,2.4rem)] leading-[1.05] tracking-[-0.03em]">
              Bought at retail. Used for a month. One kept.
            </h2>
            <p className="mt-4 max-w-[50ch] text-[14px] leading-[1.8] text-ink/55">
              We don&apos;t accept samples and we don&apos;t sell placements. If a product stops being
              the best in its room, it loses its place — quietly, and with a note at the top of the
              review.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.14em] text-ink/35">
              <Link href="/about" className="hover:text-ink">
                The method →
              </Link>
              <Link href="/disclosure" className="hover:text-ink">
                Affiliate disclosure →
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5">
            <NewsletterForm source={`collection-${collection.slug}`} />
            <div className="mt-10 border-t border-ink/10 pt-6">
              <p className="text-[10px] uppercase tracking-[0.18em] text-ink/35">Next collection</p>
              <Link
                href={`/collections/${next.slug}`}
                className="group mt-2 flex items-center justify-between gap-4"
              >
                <span className="font-display text-[26px] tracking-[-0.03em] transition-colors group-hover:text-electric">
                  {next.title}
                </span>
                <ArrowUpRight className="size-4 text-ink/40 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
