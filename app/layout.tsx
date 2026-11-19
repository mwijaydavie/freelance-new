import type { Metadata, Viewport } from "next"

import "./globals.css"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"

export const metadata: Metadata = {
  metadataBase: new URL("https://genie.reviews"),
  title: {
    default: "Genie — the short list",
    template: "%s · Genie",
  },
  description:
    "Genie buys every product at retail, lives with it for a month, and recommends exactly one. Independent, reader-supported picks for audio, desk and home.",
  keywords: ["product reviews", "buying guide", "independent reviews", "audio", "desk setup", "home"],
  openGraph: {
    title: "Genie — the short list",
    description:
      "Independent, reader-supported product picks. Bought at retail, tested for a month, one recommendation per category.",
    type: "website",
    siteName: "Genie",
  },
  twitter: {
    card: "summary_large_image",
    title: "Genie — the short list",
    description: "Independent product picks. Bought at retail, tested for a month, one recommendation per category.",
  },
}

export const viewport: Viewport = {
  themeColor: "#f4f2ed",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-svh bg-bone antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:text-bone"
        >
          Skip to content
        </a>
        <div className="border-b border-white/10 bg-ink text-bone">
          <div className="mx-auto flex h-9 w-full max-w-[1440px] items-center justify-center gap-3 px-5 sm:px-8 lg:px-12">
            <span className="hidden size-1 rounded-full bg-electric sm:block" />
            <p className="text-[10.5px] uppercase tracking-[0.2em] text-bone/60">
              Issue 04 is live — the desk edit, three picks
            </p>
            <a
              href="/guides/the-desk-reset"
              className="text-[10.5px] uppercase tracking-[0.2em] text-bone/90 underline decoration-bone/30 underline-offset-4 transition-colors hover:text-electric"
            >
              Read the notes
            </a>
          </div>
        </div>
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <SiteHeader />
        <div id="main">{children}</div>
        <SiteFooter />
      </body>
    </html>
  )
}
