import type { Metadata, Viewport } from "next"

import "./globals.css"

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
      <body className="min-h-svh bg-bone antialiased">{children}</body>
    </html>
  )
}
