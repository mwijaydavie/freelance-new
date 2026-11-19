import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight, BookOpen, CircleAlert, Mail, Plus, Sparkles } from "lucide-react"

import { listCollections } from "@/lib/catalog"
import { readProducts, readSubscribers } from "@/lib/store"
import { money, updatedLabel } from "@/lib/products"
import { revenueMath } from "@/lib/playbook"

export const dynamic = "force-dynamic"

function Stat({
  label,
  value,
  sub,
  accent = false,
}: {
  label: string
  value: string
  sub?: string
  accent?: boolean
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-[10px] uppercase tracking-[0.18em] text-bone/40">{label}</p>
      <p
        className={
          accent
            ? "mt-3 font-display text-[34px] leading-none tracking-tight text-electric"
            : "mt-3 font-display text-[34px] leading-none tracking-tight"
        }
      >
        {value}
      </p>
      {sub && <p className="mt-2 text-[11.5px] text-bone/35">{sub}</p>}
    </div>
  )
}

export default async function AdminOverview() {
  const [products, subscribers, collections] = await Promise.all([
    readProducts(),
    readSubscribers(),
    listCollections(),
  ])

  const published = products.filter((p) => p.published !== false)
  const drafts = products.length - published.length
  const hours = published.reduce((sum, p) => sum + p.testedHours, 0)
  const avg = published.length
    ? Math.round(published.reduce((sum, p) => sum + p.score, 0) / published.length)
    : 0

  const links = products.flatMap((p) => p.retailers)
  const untagged = links.filter((r) => /amazon\.com\/s\?k=|bestbuy\.com\/site\/searchpage/.test(r.url)).length

  const recent = [...products].sort((a, b) => (a.updated < b.updated ? 1 : -1)).slice(0, 5)

  const attention = [
    drafts > 0 && {
      title: `${drafts} pick${drafts === 1 ? "" : "s"} unpublished`,
      body: "Drafts are hidden from the public site. Publish or delete them.",
      href: "/admin/products?view=drafts",
    },
    untagged > 0 && {
      title: `${untagged} buy link${untagged === 1 ? "" : "s"} still untagged`,
      body: "These point at retailer search pages and earn nothing. Replace them with tracked affiliate URLs.",
      href: "/admin/products",
    },
    subscribers.length === 0 && {
      title: "No subscribers yet",
      body: "The Friday list is your only owned audience — the footer form is already wired up.",
      href: "/admin/subscribers",
    },
  ].filter(Boolean) as { title: string; body: string; href: string }[]

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-electric">Overview</p>
          <h1 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] leading-[1] tracking-[-0.04em]">
            Good to see you.
          </h1>
          <p className="mt-3 text-[13px] text-bone/40">
            {new Date().toLocaleDateString("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}{" "}
            · issue 04
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/products/new"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-bone px-5 text-[13px] font-medium text-ink transition-colors hover:bg-white"
          >
            <Plus className="size-4" />
            New pick
          </Link>
          <Link
            href="/admin/playbook"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-white/15 px-5 text-[13px] text-bone/70 transition-colors hover:border-white/35 hover:text-bone"
          >
            <BookOpen className="size-4" />
            Playbook
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Published picks" value={String(published.length).padStart(2, "0")} sub={`${collections.length} collections`} />
        <Stat label="Drafts" value={String(drafts).padStart(2, "0")} sub="Hidden from the site" />
        <Stat label="Hours logged" value={hours.toLocaleString("en-US")} sub={`Average score ${avg}`} />
        <Stat label="Subscribers" value={String(subscribers.length).padStart(2, "0")} sub="Friday list" accent />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-12">
        <section className="lg:col-span-8">
          <div className="rounded-xl border border-white/10 bg-white/[0.02]">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
              <h2 className="text-[11px] uppercase tracking-[0.18em] text-bone/45">Recently updated</h2>
              <Link href="/admin/products" className="text-[11.5px] text-bone/40 hover:text-bone">
                All picks →
              </Link>
            </div>
            <ul className="divide-y divide-white/8">
              {recent.map((p) => (
                <li key={p.slug}>
                  <Link href={`/admin/products/${p.slug}`} className="group flex items-center gap-4 px-5 py-3.5">
                    <div className="relative size-11 shrink-0 overflow-hidden rounded-md bg-paper">
                      <Image src={p.image} alt="" fill sizes="44px" className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13.5px] text-bone/90 group-hover:text-white">{p.name}</p>
                      <p className="mt-0.5 text-[11px] text-bone/35">
                        {p.maker} · {money(p.price)} · {updatedLabel(p.updated)}
                      </p>
                    </div>
                    <span className="hidden text-[12px] tabular-nums text-bone/45 sm:block">{p.score}</span>
                    <span
                      className={
                        p.published === false
                          ? "rounded-full border border-white/15 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-bone/40"
                          : "rounded-full bg-electric/15 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-electric"
                      }
                    >
                      {p.published === false ? "Draft" : "Live"}
                    </span>
                    <ArrowUpRight className="size-4 text-bone/20 transition-colors group-hover:text-bone/60" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div className="grid gap-4 lg:col-span-4">
          <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <h2 className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-bone/45">
              <CircleAlert className="size-3.5 text-amber-300/70" />
              Needs attention
            </h2>
            <ul className="mt-4 grid gap-4">
              {attention.length === 0 && (
                <li className="text-[12.5px] leading-relaxed text-bone/35">
                  Nothing urgent. The catalogue is live and every link is tagged.
                </li>
              )}
              {attention.map((a) => (
                <li key={a.title}>
                  <Link href={a.href} className="group block">
                    <p className="text-[13px] text-bone/85 group-hover:text-white">{a.title}</p>
                    <p className="mt-1 text-[11.5px] leading-relaxed text-bone/35">{a.body}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <h2 className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-bone/45">
              <Sparkles className="size-3.5 text-electric" />
              Revenue snapshot
            </h2>
            <dl className="mt-4 grid gap-2">
              {revenueMath.map((r) => (
                <div key={r.label} className="flex items-baseline justify-between gap-4 border-b border-white/8 pb-2">
                  <dt className="text-[11.5px] text-bone/40">{r.label}</dt>
                  <dd className="text-[12.5px] tabular-nums text-bone/80">{r.value}</dd>
                </div>
              ))}
            </dl>
            <Link
              href="/admin/playbook"
              className="mt-4 inline-flex items-center gap-1.5 text-[11.5px] text-electric hover:underline"
            >
              Open the playbook <ArrowUpRight className="size-3.5" />
            </Link>
          </section>

          <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <h2 className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-bone/45">
              <Mail className="size-3.5 text-bone/40" />
              Latest subscribers
            </h2>
            {subscribers.length === 0 ? (
              <p className="mt-4 text-[12px] leading-relaxed text-bone/30">
                Signups from the footer and inline forms land here.
              </p>
            ) : (
              <ul className="mt-3 grid gap-2">
                {subscribers.slice(0, 4).map((s) => (
                  <li key={s.email} className="flex items-center justify-between gap-3 text-[12px]">
                    <span className="truncate text-bone/70">{s.email}</span>
                    <span className="shrink-0 text-[10px] uppercase tracking-[0.1em] text-bone/25">
                      {s.source}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
