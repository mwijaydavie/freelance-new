"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpen,
  ExternalLink,
  LayoutGrid,
  LogOut,
  Mail,
  Package,
  Plus,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { logout } from "@/app/admin/actions"

const ITEMS = [
  { href: "/admin", label: "Overview", icon: LayoutGrid },
  { href: "/admin/products", label: "Catalogue", icon: Package },
  { href: "/admin/products/new", label: "New pick", icon: Plus },
  { href: "/admin/subscribers", label: "Subscribers", icon: Mail },
  { href: "/admin/playbook", label: "Revenue playbook", icon: BookOpen },
]

export function AdminNav({ variant = "sidebar" }: { variant?: "sidebar" | "bar" }) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin"
    if (href === "/admin/products") return pathname === "/admin/products" || pathname.startsWith("/admin/products/") && pathname !== "/admin/products/new"
    return pathname === href || pathname.startsWith(href + "/")
  }

  if (variant === "bar") {
    return (
      <nav className="flex gap-1 overflow-x-auto pb-1" aria-label="Console">
        {ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-[12px] transition-colors",
              isActive(item.href)
                ? "border-bone/20 bg-bone text-ink"
                : "border-white/12 text-bone/60 hover:text-bone"
            )}
          >
            <item.icon className="size-3.5" />
            {item.label}
          </Link>
        ))}
      </nav>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <Link href="/admin" className="flex items-center gap-2.5">
        <span className="grid size-7 place-items-center rounded-full bg-electric text-white">
          <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
            <path d="M12 3.5v17M3.5 12h17M6 6l12 12M18 6 6 18" />
          </svg>
        </span>
        <span className="text-[19px] font-semibold tracking-[-0.045em]">genie.</span>
      </Link>
      <p className="mt-4 text-[10px] uppercase tracking-[0.22em] text-bone/35">Console</p>

      <nav className="mt-8 grid gap-1" aria-label="Console">
        {ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] transition-colors",
              isActive(item.href)
                ? "bg-white/10 text-bone"
                : "text-bone/50 hover:bg-white/5 hover:text-bone"
            )}
          >
            <item.icon className="size-4" />
            {item.label}
            {isActive(item.href) && <span className="ml-auto size-1 rounded-full bg-electric" />}
          </Link>
        ))}
      </nav>

      <div className="mt-auto grid gap-1 pt-8">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] text-bone/50 transition-colors hover:bg-white/5 hover:text-bone"
        >
          <ExternalLink className="size-4" />
          View the site
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] text-bone/50 transition-colors hover:bg-white/5 hover:text-bone"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </form>
      </div>
    </div>
  )
}
