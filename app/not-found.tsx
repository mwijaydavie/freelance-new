import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70svh] w-full max-w-[1440px] flex-col justify-center px-5 py-24 sm:px-8 lg:px-12">
      <p className="label text-electric">404 — nothing on the bench</p>
      <h1 className="mt-6 max-w-[18ch] font-display text-[clamp(2.8rem,7vw,5.6rem)] leading-[0.9] tracking-[-0.045em]">
        This pick has <span className="italic text-electric">gone back.</span>
      </h1>
      <p className="mt-6 max-w-[46ch] text-[15px] leading-[1.8] text-ink/55">
        The page you were looking for isn&apos;t here — it may have been returned, renamed, or never
        survived testing. The shortlist is a good place to start again.
      </p>
      <div className="mt-9 flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/products">The shortlist</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Back home</Link>
        </Button>
      </div>
    </main>
  )
}
