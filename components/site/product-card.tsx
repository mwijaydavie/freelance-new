import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { money, type Product } from "@/lib/products"
import { ScoreRing } from "@/components/site/score-ring"

export function ProductCard({
  product,
  index,
  className,
  priority = false,
}: {
  product: Product
  index?: number
  className?: string
  priority?: boolean
}) {
  return (
    <article className={cn("group relative", className)}>
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-paper">
          <Image
            src={product.image}
            alt={`${product.maker} ${product.name}`}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035]"
          />

          {product.badge && (
            <span className="absolute left-3 top-3 rounded-full bg-bone/95 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-ink backdrop-blur">
              {product.badge}
            </span>
          )}

          <span className="absolute right-3 top-3 grid place-items-center rounded-full bg-ink/85 backdrop-blur">
            <ScoreRing score={product.score} size={48} tone="dark" className="m-0.5" />
          </span>

          <span className="pointer-events-none absolute bottom-3 right-3 flex translate-y-2 items-center gap-1.5 rounded-full bg-electric px-3.5 py-2 text-[11px] font-medium uppercase tracking-[0.16em] text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            Read the verdict
            <ArrowUpRight className="size-3.5" />
          </span>
        </div>

        <div className="flex items-start justify-between gap-4 pt-4">
          <div className="min-w-0">
            <p className="label text-ink/45">
              {index !== undefined ? `${String(index + 1).padStart(2, "0")} · ` : ""}
              {product.maker}
            </p>
            <h3 className="mt-1.5 text-[19px] leading-tight tracking-[-0.02em]">{product.name}</h3>
          </div>
          <p className="shrink-0 pt-0.5 text-[15px] tabular-nums text-ink/70">{money(product.price)}</p>
        </div>

        <p className="mt-2 line-clamp-2 max-w-[38ch] text-[13.5px] leading-relaxed text-ink/50">
          {product.verdict}
        </p>
      </Link>
    </article>
  )
}
