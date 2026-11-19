"use client"

import * as React from "react"

/** Thin electric progress bar pinned under the sticky header on article pages. */
export function ReadingProgress() {
  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const doc = document.documentElement
        const max = doc.scrollHeight - window.innerHeight
        setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0)
      })
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  return (
    <div className="sticky top-16 z-40 h-px w-full bg-transparent lg:top-[72px]" aria-hidden="true">
      <div
        className="h-px origin-left bg-electric transition-[width] duration-150 ease-out"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  )
}
