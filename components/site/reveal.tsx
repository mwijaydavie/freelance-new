"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type RevealProps = React.ComponentProps<"div"> & {
  delay?: number
}

/**
 * Lightweight scroll reveal. Adds `.is-in` once the element is near the
 * viewport; CSS in globals.css does the rest and respects reduced motion.
 */
export function Reveal({ delay = 0, className, children, style, ...props }: RevealProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [shown, setShown] = React.useState(false)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === "undefined") {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={cn("reveal", shown && "is-in", className)}
      style={{ ...style, "--reveal-delay": `${delay}ms` } as React.CSSProperties}
      {...props}
    >
      {children}
    </div>
  )
}
