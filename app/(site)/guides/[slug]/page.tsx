import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import { ProductCard } from "@/components/site/product-card"
import { NewsletterForm } from "@/components/site/newsletter-form"
import { ReadingProgress } from "@/components/site/reading-progress"
import { Reveal } from "@/components/site/reveal"
import { getGuide, guideDate, guides } from "@/lib/guides"
import { listProducts } from "@/lib/catalog"

const SHELL = "mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12"

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const guide = getGuide(slug)
  if (!guide) return { title: "Note not found" }
  return {
    title: guide.title,
    description: guide.excerpt,
    openGraph: {
      title: guide.title,
      description: guide.excerpt,
      type: "article",
      images: [{ url: guide.image }],
    },
  }
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const guide = getGuide(slug)
  if (!guide) notFound()

  const catalogue = await listProducts()
  const linked = guide.productSlugs
    .map((s) => catalogue.find((p) => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
  const more = guides.filter((g) => g.slug !== guide.slug)

  return (
    <main>
      <ReadingProgress />

      <article>
        <header className={`${SHELL} pt-10 lg:pt-14`}>
          <nav aria-label="Breadcrumb" className="text-[11px] uppercase tracking-[0.16em] text-ink/35">
            <Link href="/" className="hover:text-ink">
              Genie
            </Link>
            <span className="mx-2">/</span>
            <Link href="/guides" className="hover:text-ink">
              Field notes
            </Link>
            <span className="mx-2">/</span>
            <span className="text-ink/60">{guide.kicker}</span>
          </nav>

          <div className="mx-auto mt-8 max-w-[900px]">
            <p className="label text-electric">{guide.kicker}</p>
            <h1 className="mt-5 font-display text-[clamp(2.4rem,5.6vw,4.6rem)] leading-[0.95] tracking-[-0.045em]">
              {guide.title}
            </h1>
            <p className="mt-6 max-w-[62ch] text-[17px] leading-[1.7] text-ink/60">{guide.excerpt}</p>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-ink/10 pt-5 text-[11px] uppercase tracking-[0.14em] text-ink/35">
              <span>{guideDate(guide.date)}</span>
              <span>{guide.readTime} read</span>
              <span>Written by the Genie desk</span>
            </div>
          </div>
        </header>

        <div className={`${SHELL} mt-10`}>
          <div className="relative mx-auto aspect-[16/9] max-w-[1180px] overflow-hidden bg-paper">
            <Image
              src={guide.image}
              alt={guide.title}
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1180px"
              className="object-cover"
            />
          </div>
        </div>

        <div className={`${SHELL} mt-14 lg:mt-20`}>
          <div className="mx-auto grid max-w-[1100px] gap-10 lg:grid-cols-12 lg:gap-12">
            <aside className="hidden lg:col-span-3 lg:block">
              <div className="sticky top-24">
                <p className="text-[10px] uppercase tracking-[0.18em] text-ink/35">In this note</p>
                <ol className="mt-4 grid gap-3">
                  {guide.sections.map((s, i) => (
                    <li key={s.heading}>
                      <a
                        href={`#s-${i}`}
                        className="flex gap-2.5 text-[12.5px] leading-snug text-ink/50 transition-colors hover:text-ink"
                      >
                        <span className="tabular-nums text-ink/25">{String(i + 1).padStart(2, "0")}</span>
                        {s.heading}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </aside>

            <div className="lg:col-span-9">
              <div className="max-w-[66ch]">
                {guide.sections.map((section, i) => (
                  <Reveal key={section.heading} className="mb-12" delay={0}>
                    <section id={`s-${i}`} className="scroll-mt-28">
                      <h2 className="font-display text-[clamp(1.6rem,2.6vw,2.2rem)] leading-[1.1] tracking-[-0.03em]">
                        {section.heading}
                      </h2>
                      {section.body.map((p, j) => (
                        <p
                          key={j}
                          className="mt-5 text-[16px] leading-[1.85] text-ink/70 first:mt-4"
                        >
                          {p}
                        </p>
                      ))}
                    </section>
                  </Reveal>
                ))}

                <div className="mt-14 border-t border-ink/12 pt-6 text-[11.5px] leading-relaxed text-ink/40">
                  Written after a month with the products listed below. Some links in this note are
                  affiliate links — read our{" "}
                  <Link href="/disclosure" className="underline underline-offset-2 hover:text-ink">
                    disclosure
                  </Link>
                  .
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      {linked.length > 0 && (
        <section className={`${SHELL} mt-20`}>
          <div className="flex items-end justify-between gap-4 border-t border-ink/12 pt-8">
            <h2 className="font-display text-[clamp(1.7rem,2.8vw,2.4rem)] tracking-[-0.03em]">
              Mentioned in this note
            </h2>
            <Link href="/products" className="text-[13px] text-ink/50 hover:text-ink">
              All picks →
            </Link>
          </div>
          <div className="mt-10 grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {linked.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      <section className={`${SHELL} mt-20 pb-20`}>
        <div className="grid gap-10 border-t border-ink/12 pt-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="text-[11px] uppercase tracking-[0.18em] text-ink/35">More field notes</p>
            <div className="mt-4 divide-y divide-ink/10">
              {more.map((g) => (
                <Link key={g.slug} href={`/guides/${g.slug}`} className="group flex items-center justify-between gap-6 py-5">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-ink/35">
                      {g.kicker} · {g.readTime}
                    </p>
                    <h3 className="mt-1.5 max-w-[34ch] text-[18px] leading-snug tracking-[-0.02em] transition-colors group-hover:text-electric">
                      {g.title}
                    </h3>
                  </div>
                  <span className="font-display text-xl text-ink/20 transition-colors group-hover:text-electric">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <div className="lg:col-span-6 lg:pl-10">
            <Reveal className="border border-ink/12 bg-white/45 p-7">
              <p className="label text-electric">The Friday list</p>
              <p className="mt-3 font-display text-[26px] leading-[1.1] tracking-[-0.02em]">
                One email. One pick. Every Friday.
              </p>
              <div className="mt-5">
                <NewsletterForm source={`guide-${guide.slug}`} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  )
}
