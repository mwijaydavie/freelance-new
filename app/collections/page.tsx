import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { MoveUpRight } from "lucide-react"

import { collections, productsIn } from "@/lib/products"

export const metadata: Metadata = {
  title: "Collections",
  description: "Three rooms, one standard: audio, desk and home — every Genie pick, tested in place.",
}

const SHELL = "mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12"

export default function CollectionsPage() {
  return (
    <main>
      <section className={`${SHELL} pb-10 pt-12 lg:pt-16`}>
        <p className="label text-electric">Collections</p>
        <h1 className="mt-6 max-w-[18ch] font-display text-[clamp(2.8rem,6.4vw,5.4rem)] leading-[0.92] tracking-[-0.045em]">
          Three rooms, one standard.
        </h1>
        <p className="mt-6 max-w-[54ch] text-[15px] leading-[1.8] text-ink/60">
          We only publish in rooms we actually live in. Every collection gets the same treatment: buy
          it, use it for a month, keep one.
        </p>
      </section>

      <section className={`${SHELL} pb-20`}>
        <div className="divide-y divide-ink/12 border-y border-ink/12">
          {collections.map((c) => {
            const items = productsIn(c.id)
            return (
              <Link
                key={c.id}
                href={`/collections/${c.slug}`}
                className="group grid items-center gap-6 py-8 md:grid-cols-12 md:gap-10"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-paper md:col-span-4 md:aspect-[4/3]">
                  <Image
                    src={c.image}
                    alt={c.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  />
                </div>
                <div className="md:col-span-7">
                  <span className="text-[10px] uppercase tracking-[0.24em] text-ink/40">{c.kicker}</span>
                  <h2 className="mt-2 font-display text-[clamp(2rem,4vw,3.4rem)] leading-none tracking-[-0.035em] transition-colors group-hover:text-electric">
                    {c.title}
                  </h2>
                  <p className="mt-3 max-w-[48ch] text-[14px] leading-[1.75] text-ink/55">{c.blurb}</p>
                  <p className="mt-4 text-[11px] uppercase tracking-[0.16em] text-ink/35">
                    {String(items.length).padStart(2, "0")} picks · from ${Math.min(...items.map((i) => i.price))}
                  </p>
                </div>
                <div className="hidden md:col-span-1 md:flex md:justify-end">
                  <span className="grid size-11 place-items-center rounded-full border border-ink/15 transition-all duration-500 group-hover:border-electric group-hover:bg-electric group-hover:text-white">
                    <MoveUpRight className="size-4" />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </main>
  )
}
