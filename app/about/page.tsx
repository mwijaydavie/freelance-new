import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { NewsletterForm } from "@/components/site/newsletter-form"
import { Reveal } from "@/components/site/reveal"

export const metadata: Metadata = {
  title: "The method",
  description:
    "How Genie works: we buy everything at retail, live with it for a month, and keep one pick per category. Reader-supported, never brand-funded.",
}

const SHELL = "mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12"

const STEPS = [
  {
    n: "01",
    title: "We buy it at retail",
    body: "No press samples, no seeding programmes, no briefings where a brand walks us through the talking points. If we can't buy it like you would, it doesn't get reviewed.",
  },
  {
    n: "02",
    title: "We live with it for a month",
    body: "Minimum thirty days of ordinary use: commutes, calls, washing up, a weekend away. We keep the box for the first week so returning it stays honest.",
  },
  {
    n: "03",
    title: "We score five things",
    body: "Sound or function, comfort or feel, build, the control scheme, and value at the actual street price. The score is a conversation, not arithmetic — but the argument has to be written down.",
  },
  {
    n: "04",
    title: "We keep exactly one",
    body: "One pick per category, plus a value alternative only when it genuinely helps. If something better arrives, the old pick loses its place and the change is noted at the top.",
  },
]

const NEVER = [
  "Sell a ranking position",
  "Accept a sample for review",
  "Publish a score we haven't argued about",
  "Use 'best' when we mean 'sponsored'",
  "Keep a pick live after we've stopped using it",
]

export default function AboutPage() {
  return (
    <main>
      <section className={`${SHELL} pt-12 lg:pt-16`}>
        <p className="label text-electric">The method</p>
        <h1 className="mt-6 max-w-[20ch] font-display text-[clamp(2.8rem,7vw,5.8rem)] leading-[0.9] tracking-[-0.045em]">
          Fewer picks, held to a <span className="italic text-electric">higher standard.</span>
        </h1>
        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <p className="max-w-[44ch] text-[16px] leading-[1.8] text-ink/65">
              Genie exists because product research became a second job. Every list online is longer
              than the last, half of it is sponsored, and none of it tells you what to do. We do the
              opposite: one recommendation per room, with the reasoning left in the open.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/products">See the shortlist</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/disclosure">How we make money</Link>
              </Button>
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="relative aspect-[16/10] overflow-hidden bg-paper">
              <Image
                src="/products/monolith-keyboard.jpg"
                alt="The Genie desk in testing"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover"
              />
              <span className="absolute bottom-4 left-4 rounded-full bg-bone/95 px-3.5 py-2 text-[10px] uppercase tracking-[0.18em] backdrop-blur">
                The bench · Dar es Salaam
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className={`${SHELL} mt-20`}>
        <div className="grid gap-x-8 gap-y-10 border-t border-ink/12 pt-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["1,780", "hours of testing logged"],
            ["09", "picks currently live"],
            ["31", "products returned"],
            ["00", "paid placements, ever"],
          ].map(([v, k], i) => (
            <Reveal key={k} delay={i * 60}>
              <p className="font-display text-[clamp(2.4rem,4vw,3.4rem)] leading-none tabular-nums tracking-tight">{v}</p>
              <p className="mt-3 text-[11px] uppercase leading-relaxed tracking-[0.16em] text-ink/40">{k}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className={`${SHELL} mt-20 lg:mt-28`}>
        <h2 className="max-w-[24ch] font-display text-[clamp(2rem,3.6vw,3.2rem)] leading-[1] tracking-[-0.035em]">
          Four steps, every product, no exceptions.
        </h2>
        <div className="mt-12 divide-y divide-ink/12 border-y border-ink/12">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 70} className="grid gap-4 py-8 sm:grid-cols-12 sm:gap-8">
              <span className="font-display text-[13px] tabular-nums text-electric sm:col-span-1">{s.n}</span>
              <h3 className="text-[20px] leading-tight tracking-[-0.02em] sm:col-span-4">{s.title}</h3>
              <p className="max-w-[54ch] text-[14px] leading-[1.8] text-ink/55 sm:col-span-7">{s.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mt-24 bg-ink text-bone">
        <div className={`${SHELL} grid gap-12 py-20 lg:grid-cols-12 lg:py-24`}>
          <div className="lg:col-span-5">
            <p className="label text-electric">What we never do</p>
            <h2 className="mt-4 max-w-[16ch] font-display text-[clamp(2rem,3.6vw,3rem)] leading-[1] tracking-[-0.035em]">
              The lines we don&apos;t cross.
            </h2>
            <p className="mt-5 max-w-[34ch] text-[14px] leading-[1.8] text-bone/50">
              Reader-supported means you are the customer. Brands are not, and it shows in what we
              publish.
            </p>
          </div>
          <div className="lg:col-span-7">
            <ul className="border-t border-bone/15">
              {NEVER.map((n, i) => (
                <li key={n} className="flex items-center justify-between gap-6 border-b border-bone/15 py-5">
                  <span className="text-[15px] text-bone/80">{n}</span>
                  <span className="font-display text-[12px] tabular-nums text-bone/25">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className={`${SHELL} py-20`}>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h2 className="font-display text-[clamp(1.8rem,3vw,2.6rem)] leading-[1.05] tracking-[-0.03em]">
              Questions, corrections, or a product we should test?
            </h2>
            <p className="mt-4 max-w-[42ch] text-[14px] leading-[1.8] text-ink/55">
              We answer every email that isn&apos;t a press release. If we got something wrong, we
              correct it in public and note the change at the top of the review.
            </p>
            <a
              href="mailto:hello@genie.reviews"
              className="mt-6 inline-flex items-center gap-2 border-b border-ink/25 pb-1 text-[13px] hover:border-electric hover:text-electric"
            >
              hello@genie.reviews
            </a>
          </div>
          <div className="lg:col-span-6 lg:justify-self-end">
            <NewsletterForm source="about" />
            <p className="mt-6 text-[11px] uppercase leading-relaxed tracking-[0.14em] text-ink/35">
              Read the{" "}
              <Link href="/disclosure" className="underline underline-offset-2 hover:text-ink">
                affiliate disclosure
              </Link>{" "}
              ·{" "}
              <Link href="/guides" className="underline underline-offset-2 hover:text-ink">
                field notes
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
