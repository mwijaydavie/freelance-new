"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { collections, type CollectionId, type Product } from "@/lib/products"
import { ProductCard } from "@/components/site/product-card"
import { Reveal } from "@/components/site/reveal"

type Filter = "all" | CollectionId
type Sort = "curated" | "score" | "price-asc" | "price-desc"

const SORTS: { id: Sort; label: string }[] = [
  { id: "curated", label: "Our order" },
  { id: "score", label: "Highest score" },
  { id: "price-asc", label: "Price ↑" },
  { id: "price-desc", label: "Price ↓" },
]

export function Catalog({ products }: { products: Product[] }) {
  const [filter, setFilter] = React.useState<Filter>("all")
  const [sort, setSort] = React.useState<Sort>("curated")

  const list = React.useMemo(() => {
    const filtered = filter === "all" ? products : products.filter((p) => p.collection === filter)
    const out = [...filtered]
    if (sort === "score") out.sort((a, b) => b.score - a.score)
    if (sort === "price-asc") out.sort((a, b) => a.price - b.price)
    if (sort === "price-desc") out.sort((a, b) => b.price - a.price)
    return out
  }, [products, filter, sort])

  return (
    <div>
      <div className="sticky top-16 z-30 -mx-5 mb-10 border-y border-ink/10 bg-bone/90 px-5 py-3 backdrop-blur-xl sm:-mx-8 sm:px-8 lg:top-[72px] lg:-mx-12 lg:px-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {([{ id: "all", title: "Everything" }, ...collections] as { id: Filter; title: string }[]).map(
              (c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setFilter(c.id)}
                  aria-pressed={filter === c.id}
                  className={cn(
                    "rounded-full border px-4 py-2 text-[12px] transition-all duration-300",
                    filter === c.id
                      ? "border-ink bg-ink text-bone"
                      : "border-ink/15 text-ink/60 hover:border-ink/40 hover:text-ink"
                  )}
                >
                  {c.title}
                </button>
              )
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-[11px] uppercase tracking-[0.16em] text-ink/35 sm:inline">
              {String(list.length).padStart(2, "0")} picks
            </span>
            <div className="flex items-center gap-1 rounded-full border border-ink/15 p-1">
              {SORTS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSort(s.id)}
                  aria-pressed={sort === s.id}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-[11.5px] transition-colors",
                    sort === s.id ? "bg-ink/5 text-ink" : "text-ink/45 hover:text-ink"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-x-7 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 3) * 70}>
            <ProductCard product={p} index={filter === "all" ? undefined : i} priority={i < 3} />
          </Reveal>
        ))}
      </div>

      {list.length === 0 && (
        <p className="py-20 text-center text-sm text-ink/45">
          Nothing here yet — the next round of testing starts Friday.
        </p>
      )}
    </div>
  )
}
