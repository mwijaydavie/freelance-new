"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

type Ctx = ReturnType<typeof gsap.context> | null

/**
 * One mount per page, driven by data attributes so the server components stay
 * plain markup:
 *
 *   data-anim="line"    masked hero line — rises into place on load
 *   data-anim="fade"    fades up when it enters the viewport
 *   data-anim="card"    hero card: settles in with a slight rotation
 *   data-parallax="8"   image drifts ±8% while its container scrolls
 *
 * Everything is a no-op with `prefers-reduced-motion`, and content is never
 * hidden by CSS — only by GSAP at animation time.
 */
export function MotionLayer() {
  const pathname = usePathname()

  React.useEffect(() => {
    if (typeof window === "undefined") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    gsap.registerPlugin(ScrollTrigger)

    let ctx: Ctx = null

    const build = () => {
      ctx?.revert()
      ctx = gsap.context(() => {
        /* hero lines */
        const lines = gsap.utils.toArray<HTMLElement>('[data-anim="line"]')
        if (lines.length) {
          gsap.from(lines, {
            yPercent: 118,
            autoAlpha: 0,
            duration: 1.15,
            ease: "power4.out",
            stagger: 0.085,
            delay: 0.12,
          })
        }

        /* hero supporting copy */
        const heroFades = gsap.utils.toArray<HTMLElement>('[data-anim="hero"]')
        if (heroFades.length) {
          gsap.from(heroFades, {
            y: 22,
            autoAlpha: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.08,
            delay: 0.45,
          })
        }

        /* hero card */
        const cards = gsap.utils.toArray<HTMLElement>('[data-anim="card"]')
        if (cards.length) {
          gsap.from(cards, {
            y: 46,
            autoAlpha: 0,
            rotate: 2.5,
            duration: 1.25,
            ease: "power4.out",
            delay: 0.35,
          })
        }

        /* scroll-triggered fades */
        gsap.utils.toArray<HTMLElement>('[data-anim="fade"]').forEach((el) => {
          gsap.from(el, {
            y: 26,
            autoAlpha: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          })
        })

        /* image parallax */
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          const depth = Math.min(14, Math.max(2, Number(el.dataset.parallax) || 7))
          gsap.fromTo(
            el,
            { yPercent: -depth },
            {
              yPercent: depth,
              ease: "none",
              scrollTrigger: {
                trigger: el.closest("[data-parallax-scope]") ?? el.parentElement ?? el,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.6,
              },
            }
          )
        })
      })
      ScrollTrigger.refresh()
    }

    // wait a frame so fonts/layout have settled before measuring
    const raf = requestAnimationFrame(build)
    const safety = window.setTimeout(() => ScrollTrigger.refresh(), 1200)
    const onResize = () => ScrollTrigger.refresh()
    window.addEventListener("resize", onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(safety)
      window.removeEventListener("resize", onResize)
      ctx?.revert()
    }
  }, [pathname])

  return null
}
