"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowUpRight, Menu, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const NAV = [
  { label: "The shortlist", href: "/products" },
  { label: "Audio", href: "/collections/audio" },
  { label: "Desk", href: "/collections/desk" },
  { label: "Home", href: "/collections/home" },
  { label: "Field notes", href: "/guides" },
  { label: "Method", href: "/about" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    setOpen(false)
  }, [pathname])

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-bone/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between gap-6 px-5 sm:px-8 lg:h-[72px] lg:px-12">
        <Link href="/" className="group flex items-center gap-2.5" aria-label="Genie, home">
          <span className="relative grid size-7 place-items-center rounded-full bg-electric text-white transition-transform duration-500 group-hover:rotate-90">
            <svg viewBox="0 0 24 24" className="size-3.5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <path d="M12 3.5v17M3.5 12h17M6 6l12 12M18 6 6 18" />
            </svg>
          </span>
          <span className="text-[22px] font-semibold leading-none tracking-[-0.045em]">genie.</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {NAV.map((item) => {
            const active =
              item.href === "/products"
                ? pathname === "/products"
                : pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative text-[13px] text-ink/65 transition-colors hover:text-ink",
                  active && "text-ink"
                )}
              >
                {item.label}
                {active && (
                  <span className="absolute -bottom-1.5 left-0 h-px w-full bg-electric" />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <span className="mr-1 hidden text-[11px] uppercase tracking-[0.18em] text-ink/45 xl:inline">
            No paid placements
          </span>
          <Button asChild variant="default" size="sm" className="hidden sm:inline-flex">
            <Link href="/#subscribe">
              Join the list
              <ArrowUpRight />
            </Link>
          </Button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="grid size-10 place-items-center rounded-full border border-ink/15 lg:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-ink/10 bg-bone lg:hidden">
          <nav className="mx-auto grid w-full max-w-[1440px] gap-1 px-5 py-6 sm:px-8" aria-label="Mobile">
            {NAV.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-baseline justify-between border-b border-ink/10 py-3.5 text-2xl tracking-[-0.03em]"
              >
                <span className="font-display">{item.label}</span>
                <span className="text-[11px] tabular-nums text-ink/40">0{i + 1}</span>
              </Link>
            ))}
            <Link href="/#subscribe" className="mt-4 inline-flex items-center gap-2 text-sm text-electric">
              Join the Friday list <ArrowUpRight className="size-4" />
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
