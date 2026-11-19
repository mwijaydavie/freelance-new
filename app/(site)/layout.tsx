import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"
import { SmoothScroll } from "@/components/site/smooth-scroll"
import { MotionLayer } from "@/components/site/motion-layer"

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroll>
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
      <SiteHeader />
      <div id="main">{children}</div>
      <SiteFooter />
      <noscript>
        <style>{`.reveal,[data-anim]{opacity:1!important;transform:none!important}`}</style>
      </noscript>
      <MotionLayer />
    </SmoothScroll>
  )
}
