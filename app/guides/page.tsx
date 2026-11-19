import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { NewsletterForm } from "@/components/site/newsletter-form"
import { Reveal } from "@/components/site/reveal"
import { guideDate, guides } from "@/lib/guides"

export const metadata: Metadata = {
  title: "Field notes",
  description:
    "Long-form notes from the bench: what we tested, what surprised us, and the small decisions that make a room better.",
}

const SHELL = "mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12"

export default function GuidesPage() {
  const [lead, ...rest] = guides

  return (
    <main>
      <section className={`${SHELL} pb-12 pt-12 lg:pt-16`}>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="label text-electric">Field notes</p>
            <h1 className="mt-6 font-display text-[clamp(2.8rem,6.4vw,5.4rem)] leading-[0.9] tracking-[-0.045em]">
              Notes from
              <br />
              <span className="italic">the bench.</span>
            </h1>
          </div>
          <p className="max-w-[42ch] text-[14.5px] leading-[1.8] text-ink/55 lg:col-span-4 lg:justify-self-end">
            Fewer, longer pieces. How we test, what we got wrong, and the decisions behind each pick —
            written after the month, not before it.
          </p>
        </div>
      </section>

      <section className={`${SHELL} pb-16`}>
        <Reveal>
          <Link href={`/guides/${lead.slug}`} className="group grid gap-8 border-t border-ink/12 pt-8 lg:grid-cols-12 lg:gap-10">
            <div className="relative aspect-[16/11] overflow-hidden bg-paper lg:col-span-7">
              <Image
                src={lead.image}
                alt={lead.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover transition-transform duration-[900ms] group-hover:scale-[1.03]"
              />
              <span className="absolute left-4 top-4 rounded-full bg-bone/95 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] backdrop-blur">
                {lead.kicker}
              </span>
            </div>
            <div className="flex flex-col justify-center lg:col-span-5">
              <p className="text-[11px] uppercase tracking-[0.16em] text-ink/35">
                {guideDate(lead.date)} · {lead.readTime} read
              </p>
              <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.2rem)] leading-[0.98] tracking-[-0.035em] transition-colors group-hover:text-electric">
                {lead.title}
              </h2>
              <p className="mt-4 max-w-[42ch] text-[14.5px] leading-[1.8] text-ink/55">{lead.excerpt}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.16em] text-electric">
                Read the note
                <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        </Reveal>
      </section>

      <section className={`${SHELL} pb-20`}>
        <div className="divide-y divide-ink/12 border-y border-ink/12">
          {rest.map((g, i) => (
            <Reveal key={g.slug} delay={i * 80}>
              <Link
                href={`/guides/${g.slug}`}
                className="group grid items-center gap-6 py-8 sm:grid-cols-12"
              >
                <span className="hidden font-display text-[13px] tabular-nums text-ink/30 sm:col-span-1 sm:block">
                  0{i + 2}
                </span>
                <div className="relative aspect-[16/9] overflow-hidden bg-paper sm:col-span-4 sm:aspect-[4/3]">
                  <Image
                    src={g.image}
                    alt={g.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="sm:col-span-6">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-ink/35">
                    {g.kicker} · {guideDate(g.date)} · {g.readTime}
                  </p>
                  <h2 className="mt-2 font-display text-[clamp(1.6rem,2.6vw,2.2rem)] leading-[1.05] tracking-[-0.03em] transition-colors group-hover:text-electric">
                    {g.title}
                  </h2>
                  <p className="mt-2 max-w-[52ch] text-[13.5px] leading-[1.75] text-ink/50">{g.excerpt}</p>
                </div>
                <div className="hidden justify-end sm:col-span-1 sm:flex">
                  <span className="grid size-10 place-items-center rounded-full border border-ink/15 transition-all duration-500 group-hover:border-electric group-hover:bg-electric group-hover:text-white">
                    <ArrowUpRight className="size-4" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className={`${SHELL} pb-20`}>
        <div className="grid gap-8 border border-ink/12 bg-white/45 px-6 py-10 sm:px-10 lg:grid-cols-12 lg:items-center lg:px-12">
          <div className="lg:col-span-7">
            <p className="label text-electric">The Friday list</p>
            <h2 className="mt-3 font-display text-[clamp(1.8rem,3vw,2.6rem)] leading-[1.02] tracking-[-0.03em]">
              Notes, before they&apos;re published.
            </h2>
          </div>
          <div className="lg:col-span-5 lg:justify-self-end">
            <NewsletterForm source="guides" />
          </div>
        </div>
      </section>
    </main>
  )
}
