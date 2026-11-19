import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Plus } from "lucide-react"

import { readProducts } from "@/lib/store"
import { money, updatedLabel } from "@/lib/products"
import { collectionMeta } from "@/lib/catalog"
import { toggleFlag, restoreSeedCatalogue } from "@/app/admin/actions"

export const dynamic = "force-dynamic"

const TABS = [
  { id: "all", label: "All picks" },
  { id: "live", label: "Published" },
  { id: "drafts", label: "Drafts" },
  { id: "featured", label: "Featured" },
] as const

const BANNERS: Record<string, string> = {
  deleted: "Pick deleted. The public site is already updated.",
  reset: "Catalogue restored from the seed data.",
  saved: "Pick saved.",
  memory: "Saved in memory only — this host has a read-only filesystem.",
}

export default async function AdminProducts({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; status?: string }>
}) {
  const { view = "all", status } = await searchParams
  const all = await readProducts()

  const list = all.filter((p) => {
    if (view === "drafts") return p.published === false
    if (view === "live") return p.published !== false
    if (view === "featured") return Boolean(p.featured)
    return true
  })

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-electric">Catalogue</p>
          <h1 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] leading-[1] tracking-[-0.04em]">
            {all.length} picks
          </h1>
          <p className="mt-3 max-w-[52ch] text-[13px] leading-relaxed text-bone/40">
            Everything here is public the moment it is published. Edits go live immediately — no
            rebuild, no deploy.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex h-11 items-center gap-2 rounded-full bg-bone px-5 text-[13px] font-medium text-ink transition-colors hover:bg-white"
        >
          <Plus className="size-4" />
          New pick
        </Link>
      </div>

      {status && BANNERS[status] && (
        <p className="mt-6 rounded-lg border border-electric/30 bg-electric/10 px-4 py-3 text-[12.5px] text-bone/80">
          {BANNERS[status]}
        </p>
      )}

      <div className="mt-7 flex flex-wrap gap-1.5">
        {TABS.map((t) => (
          <Link
            key={t.id}
            href={t.id === "all" ? "/admin/products" : `/admin/products?view=${t.id}`}
            className={
              view === t.id
                ? "rounded-full bg-bone px-4 py-2 text-[12px] text-ink"
                : "rounded-full border border-white/12 px-4 py-2 text-[12px] text-bone/50 hover:border-white/30 hover:text-bone"
            }
          >
            {t.label}
          </Link>
        ))}
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
        <div className="hidden grid-cols-[minmax(0,1fr)_120px_90px_70px_110px_150px] gap-4 border-b border-white/10 px-5 py-3 text-[10px] uppercase tracking-[0.16em] text-bone/30 lg:grid">
          <span>Pick</span>
          <span>Collection</span>
          <span>Price</span>
          <span>Score</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>

        <ul className="divide-y divide-white/8">
          {list.map((p) => (
            <li
              key={p.slug}
              className="grid gap-3 px-5 py-4 transition-colors hover:bg-white/[0.03] lg:grid-cols-[minmax(0,1fr)_120px_90px_70px_110px_150px] lg:items-center lg:gap-4"
            >
              <div className="flex min-w-0 items-center gap-3.5">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-paper">
                  <Image src={p.image} alt="" fill sizes="48px" className="object-cover" />
                </div>
                <div className="min-w-0">
                  <Link href={`/admin/products/${p.slug}`} className="block truncate text-[14px] text-bone/90 hover:text-white">
                    {p.name}
                    {p.featured && <span className="ml-2 text-electric">✦</span>}
                  </Link>
                  <p className="mt-0.5 truncate text-[11px] text-bone/35">
                    {p.maker} · updated {updatedLabel(p.updated)}
                  </p>
                </div>
              </div>

              <span className="text-[12px] text-bone/45">
                {collectionMeta(p.collection)?.title ?? p.collection}
              </span>
              <span className="text-[12.5px] tabular-nums text-bone/70">{money(p.price)}</span>
              <span className="text-[12.5px] tabular-nums text-bone/70">{p.score}</span>

              <span>
                <span
                  className={
                    p.published === false
                      ? "inline-flex rounded-full border border-white/15 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-bone/40"
                      : "inline-flex rounded-full bg-electric/15 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-electric"
                  }
                >
                  {p.published === false ? "Draft" : "Live"}
                </span>
              </span>

              <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                <Link
                  href={`/admin/products/${p.slug}`}
                  className="rounded-full border border-white/15 px-3 py-1.5 text-[11.5px] text-bone/70 transition-colors hover:border-white/35 hover:text-bone"
                >
                  Edit
                </Link>
                <form action={toggleFlag}>
                  <input type="hidden" name="slug" value={p.slug} />
                  <input type="hidden" name="field" value="published" />
                  <button
                    type="submit"
                    className="rounded-full border border-white/12 px-3 py-1.5 text-[11.5px] text-bone/45 transition-colors hover:border-white/30 hover:text-bone"
                  >
                    {p.published === false ? "Publish" : "Unpublish"}
                  </button>
                </form>
                <Link
                  href={`/products/${p.slug}`}
                  target="_blank"
                  aria-label={`Open ${p.name} on the site`}
                  className="grid size-7 place-items-center rounded-full text-bone/30 transition-colors hover:text-bone"
                >
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </div>
            </li>
          ))}
        </ul>

        {list.length === 0 && (
          <p className="px-5 py-12 text-center text-[13px] text-bone/35">
            Nothing in this view yet.
          </p>
        )}
      </div>

      <details className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] px-5 py-4">
        <summary className="cursor-pointer text-[11px] uppercase tracking-[0.16em] text-bone/35">
          Store & maintenance
        </summary>
        <div className="mt-4 grid gap-4 text-[12.5px] leading-relaxed text-bone/45">
          <p>
            The catalogue is stored in <code className="text-bone/70">.data/catalog.json</code> and
            seeded from <code className="text-bone/70">lib/products.ts</code>. Swap{" "}
            <code className="text-bone/70">lib/store.ts</code> for a database when you scale — no page
            needs to change.
          </p>
          <form action={restoreSeedCatalogue}>
            <button
              type="submit"
              className="rounded-full border border-red-400/25 px-4 py-2 text-[11.5px] text-red-300/70 transition-colors hover:border-red-400/60 hover:text-red-200"
            >
              Restore seed catalogue
            </button>
          </form>
        </div>
      </details>
    </div>
  )
}
