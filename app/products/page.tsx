import type { Metadata } from "next"
import Link from "next/link"

import { Catalog } from "@/components/site/catalog"
import { NewsletterForm } from "@/components/site/newsletter-form"
import { products } from "@/lib/products"

export const metadata: Metadata = {
  title: "The shortlist",
  description:
    "Every Genie pick in one place — audio, desk and home. Bought at retail, tested for at least a month, and re-checked every season.",
}

const SHELL = "mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12"

export default function ProductsPage() {
  const hours = products.reduce((sum, p) => sum + p.testedHours, 0)

  return (
    <main>
      <section className={`${SHELL} pb-12 pt-12 lg:pt-16`}>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <nav aria-label="Breadcrumb" className="text-[11px] uppercase tracking-[0.16em] text-ink/35">
              <Link href="/" className="hover:text-ink">
                Genie
              </Link>
              <span className="mx-2">/</span>
              <span className="text-ink/60">The shortlist</span>
            </nav>
            <h1 className="mt-6 font-display text-[clamp(2.8rem,6.4vw,5.4rem)] leading-[0.92] tracking-[-0.045em]">
              Everything we&apos;d
              <br />
              buy with <span className="italic text-electric">our own money.</span>
            </h1>
            <p className="mt-6 max-w-[52ch] text-[15px] leading-[1.8] text-ink/60">
              {products.length} products across three rooms. Each one was bought at full price, used
              for at least a month, and scored on the things that survive the honeymoon — comfort,
              build, and whether we still reached for it in week five.
            </p>
          </div>

          <div className="lg:col-span-4 lg:justify-self-end">
            <dl className="grid grid-cols-3 gap-6 border-t border-ink/12 pt-5 lg:w-[340px]">
              {[
                [String(products.length).padStart(2, "0"), "picks"],
                [String(hours).padStart(3, "0"), "hours tested"],
                ["00", "paid slots"],
              ].map(([v, k]) => (
                <div key={k}>
                  <dt className="font-display text-2xl leading-none tabular-nums">{v}</dt>
                  <dd className="mt-2 text-[10px] uppercase tracking-[0.16em] text-ink/40">{k}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className={`${SHELL} pb-20`}>
        <Catalog products={products} />
      </section>

      <section className={`${SHELL} pb-20 lg:pb-24`}>
        <div className="grid gap-8 border border-ink/12 bg-white/45 px-6 py-10 sm:px-10 lg:grid-cols-12 lg:items-center lg:px-12">
          <div className="lg:col-span-7">
            <p className="label text-electric">The Friday list</p>
            <h2 className="mt-3 font-display text-[clamp(1.8rem,3vw,2.6rem)] leading-[1.02] tracking-[-0.03em]">
              New picks land here first.
            </h2>
            <p className="mt-3 max-w-[46ch] text-[13.5px] leading-relaxed text-ink/55">
              One email a week: what we tested, what we kept, what went back in the box.
            </p>
          </div>
          <div className="lg:col-span-5 lg:justify-self-end">
            <NewsletterForm source="catalog" />
          </div>
        </div>
      </section>
    </main>
  )
}
