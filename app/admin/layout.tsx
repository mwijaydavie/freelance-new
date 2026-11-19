import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Console",
  robots: { index: false, follow: false },
}

export const dynamic = "force-dynamic"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-svh bg-ink text-bone selection:bg-electric">{children}</div>
}
