import { ArrowUpRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { money, type Retailer } from "@/lib/products"

/**
 * Outbound affiliate link. Every commercial link on the site is marked
 * rel="sponsored nofollow" and target="_blank" — swap the URLs in
 * lib/products.ts for your own tracked links.
 */
export function AffiliateButton({
  retailer,
  className,
  label,
  variant = "solid",
}: {
  retailer: Retailer
  className?: string
  label?: string
  variant?: "solid" | "outline" | "paper"
}) {
  return (
    <a
      href={retailer.url}
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
      className={cn(
        "group flex items-center justify-between gap-4 rounded-full px-6 py-4 transition-all duration-300",
        variant === "solid" &&
          "bg-ink text-bone hover:bg-electric hover:shadow-[0_18px_40px_-20px_rgba(26,127,240,0.9)]",
        variant === "outline" &&
          "border border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-bone",
        variant === "paper" && "bg-bone text-ink hover:bg-white",
        className
      )}
    >
      <span className="flex flex-col items-start gap-0.5 leading-tight">
        <span className="text-[10px] uppercase tracking-[0.2em] opacity-55">
          {label ?? `Buy at ${retailer.name}`}
        </span>
        <span className="text-[15px] font-medium">{retailer.name}</span>
      </span>
      <span className="flex items-center gap-3">
        <span className="text-[15px] tabular-nums">{money(retailer.price)}</span>
        <span className="grid size-8 place-items-center rounded-full border border-current/25 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
          <ArrowUpRight className="size-4" />
        </span>
      </span>
    </a>
  )
}
