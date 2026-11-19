"use client"

import * as React from "react"
import gsap from "gsap"

/**
 * Route transition — the App Router equivalent of a Barba-style page
 * transition. `template` remounts on every navigation, so each new page
 * fades up from the bottom of the fold.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (typeof window === "undefined") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (!ref.current) return

    const tween = gsap.fromTo(
      ref.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.65, ease: "power2.out", clearProps: "opacity,transform" }
    )

    return () => {
      tween.kill()
    }
  }, [])

  return <div ref={ref}>{children}</div>
}
