"use client"

import * as React from "react"
import Lenis from "lenis"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

let instance: Lenis | null = null

/** Access the shared Lenis instance (e.g. to scrollTo from a menu link). */
export function getLenis() {
  return instance
}

/**
 * Lenis smooth scrolling, driven by the GSAP ticker and kept in sync with
 * ScrollTrigger. Disabled for `prefers-reduced-motion`, where the document
 * falls back to native scrolling and every animation layer bails out.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    if (typeof window === "undefined") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    gsap.registerPlugin(ScrollTrigger)

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    })
    instance = lenis

    const onScroll = () => ScrollTrigger.update()
    lenis.on("scroll", onScroll)

    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    // expose a hook for in-page anchors / "back to top" style handlers
    ;(window as unknown as { __genieLenis?: Lenis }).__genieLenis = lenis

    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 250)

    return () => {
      window.clearTimeout(refresh)
      gsap.ticker.remove(tick)
      lenis.off("scroll", onScroll)
      lenis.destroy()
      instance = null
      delete (window as unknown as { __genieLenis?: Lenis }).__genieLenis
    }
  }, [])

  return <>{children}</>
}
