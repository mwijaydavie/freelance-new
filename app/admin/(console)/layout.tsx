import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowUpRight, Database } from "lucide-react"

import { AdminNav } from "@/components/admin/admin-nav"
import { isAdmin } from "@/lib/auth"
import { storeBackend, storeIsDurable, storeLabel } from "@/lib/store"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

export default async function ConsoleLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdmin())) redirect("/admin/login")

  const backend = storeBackend()
  const durable = storeIsDurable()

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-[1560px]">
      <aside className="sticky top-0 hidden h-svh w-[248px] shrink-0 border-r border-white/10 p-6 lg:block">
        <AdminNav />
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-ink/85 px-5 py-3 backdrop-blur-xl sm:px-8 lg:px-10">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 lg:hidden">
              <span className="grid size-7 place-items-center rounded-full bg-electric text-white">
                <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
                  <path d="M12 3.5v17M3.5 12h17M6 6l12 12M18 6 6 18" />
                </svg>
              </span>
              <span className="text-[17px] font-semibold tracking-[-0.04em]">genie.</span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-bone/30">console</span>
            </div>

            <p className="hidden text-[10px] uppercase tracking-[0.2em] text-bone/35 lg:block">
              Reader-supported · independent
            </p>

            <div className="flex items-center gap-2">
              <span
                title={
                  durable
                    ? "Every edit is written to the database."
                    : "No database connected — edits disappear on the next cold start."
                }
                className={cn(
                  "hidden items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] sm:inline-flex",
                  durable
                    ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-200"
                    : "border-amber-400/30 bg-amber-400/10 text-amber-200"
                )}
              >
                <Database className="size-3" />
                {durable ? storeLabel[backend] : "No database"}
              </span>

              <Link
                href="/"
                target="_blank"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-2 text-[11.5px] text-bone/60 transition-colors hover:border-white/35 hover:text-bone"
              >
                View site
                <ArrowUpRight className="size-3.5" />
              </Link>
            </div>
          </div>

          <div className="mt-3 lg:hidden">
            <AdminNav variant="bar" />
          </div>
        </header>

        <main className="px-5 py-8 sm:px-8 lg:px-10 lg:py-12">{children}</main>
      </div>
    </div>
  )
}
