import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { isAdminEnabled } from "@/lib/auth"

export const metadata: Metadata = {
  title: "Console",
  robots: { index: false, follow: false },
}

export const dynamic = "force-dynamic"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // On the public deployment the console should not exist at all.
  if (!isAdminEnabled()) notFound()

  return <div className="min-h-svh bg-ink text-bone selection:bg-electric">{children}</div>
}
