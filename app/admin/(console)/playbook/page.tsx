import Link from "next/link"
import { ArrowUpRight, CircleDollarSign, Target } from "lucide-react"

import { playbook, revenueMath } from "@/lib/playbook"

export const dynamic = "force-dynamic"

export default function PlaybookPage() {
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-electric">Revenue playbook</p>
          <h1 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] leading-[1] tracking-[-0.04em]">
            How this site makes money.
          </h1>
          <p className="mt-3 max-w-[56ch] text-[13px] leading-relaxed text-bone/40">
            Affiliate revenue is a distribution problem disguised as a content problem. The order
            below matters: tag the links first, then build pages that capture intent, then own the
            email list.
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-bone/40">
            <CircleDollarSign className="size-3.5 text-electric" />
            At 10k sessions / month
          </p>
          <p className="mt-2 font-display text-[36px] leading-none tracking-tight">$583</p>
          <p className="mt-1 text-[11px] text-bone/30">gross commission, blended 6%</p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {revenueMath.map((r) => (
          <div key={r.label} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <p className="text-[9.5px] uppercase leading-relaxed tracking-[0.14em] text-bone/35">{r.label}</p>
            <p className="mt-2 font-display text-[20px] leading-none tabular-nums">{r.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-4">
        {playbook.map((phase, i) => (
          <section key={phase.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-electric">{phase.window}</p>
                <h2 className="mt-2 font-display text-[clamp(1.4rem,2.4vw,1.9rem)] leading-tight tracking-[-0.03em]">
                  {phase.title}
                </h2>
              </div>
              <span className="font-display text-[13px] tabular-nums text-bone/20">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>

            <div className="mt-4 grid gap-3 rounded-lg border border-white/8 bg-white/[0.02] p-4 sm:grid-cols-2">
              <div>
                <p className="flex items-center gap-1.5 text-[9.5px] uppercase tracking-[0.16em] text-bone/30">
                  <Target className="size-3" /> Goal
                </p>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-bone/65">{phase.goal}</p>
              </div>
              <div>
                <p className="flex items-center gap-1.5 text-[9.5px] uppercase tracking-[0.16em] text-bone/30">
                  <ArrowUpRight className="size-3" /> Success looks like
                </p>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-bone/65">{phase.kpi}</p>
              </div>
            </div>

            <ul className="mt-4 grid gap-3">
              {phase.moves.map((move) => (
                <li key={move.title} className="flex gap-3 border-t border-white/8 pt-3.5">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-electric/70" />
                  <div>
                    <p className="text-[13.5px] text-bone/85">{move.title}</p>
                    <p className="mt-1 max-w-[72ch] text-[12.5px] leading-relaxed text-bone/40">{move.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section className="mt-8 rounded-xl border border-electric/25 bg-electric/[0.06] p-6">
        <h2 className="font-display text-[clamp(1.4rem,2.4vw,2rem)] leading-tight tracking-[-0.03em]">
          The one thing to do today
        </h2>
        <p className="mt-2 max-w-[62ch] text-[13px] leading-relaxed text-bone/55">
          Replace the nine placeholder retailer URLs with tracked affiliate links. Everything else on
          this page is worth nothing until that is done.
        </p>
        <Link
          href="/admin/products"
          className="mt-4 inline-flex h-10 items-center gap-2 rounded-full bg-bone px-5 text-[12.5px] font-medium text-ink hover:bg-white"
        >
          Fix the links
          <ArrowUpRight className="size-3.5" />
        </Link>
      </section>
    </div>
  )
}
