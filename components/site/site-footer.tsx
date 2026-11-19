"use client"

import * as React from "react"

import PushpinTearFooter from "@/components/ui/pushpin-tear-footer"

const EMAIL = "hello@genie.reviews"

export function SiteFooter() {
  const onSubscribe = React.useCallback((email: string) => {
    void fetch("/api/subscribe", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, source: "footer" }),
    }).catch(() => {})
  }, [])

  return (
    <PushpinTearFooter
      brand="genie."
      name="the short list"
      logo={<span style={{ fontSize: "1.7em", fontWeight: 600, letterSpacing: "-0.05em", lineHeight: 1 }}>genie.</span>}
      logoHref="/"
      email={EMAIL}
      socials={[
        { icon: "ig", label: "Instagram", href: "https://www.instagram.com/" },
        { icon: "x", label: "X", href: "https://x.com/" },
      ]}
      newsletter={{ label: "one short list, every friday", placeholder: "your@email" }}
      status={{ label: "testing 6 new arrivals", href: "/products" }}
      mark="issue 04 / 2026"
      timeZone="Africa/Dar_es_Salaam"
      timeLabel="EAT"
      columns={[
        {
          title: "explore",
          links: [
            { label: "Audio", href: "/collections/audio" },
            { label: "Desk", href: "/collections/desk" },
            { label: "Home", href: "/collections/home" },
          ],
          cta: { label: "shop.", href: "/products" },
        },
        {
          title: "reading",
          links: [
            { label: "Field notes", href: "/guides" },
            { label: "The method", href: "/about" },
            { label: "Disclosure", href: "/disclosure" },
          ],
          cta: { label: "talk.", href: `mailto:${EMAIL}` },
        },
      ]}
      chat={{ label: "say hi", href: `mailto:${EMAIL}` }}
      sideLinks={[
        { icon: "shield", label: "disclosure", href: "/disclosure" },
        { icon: "doc", label: "method", href: "/about" },
      ]}
      copyright="© 2026 Genie Media"
      credit="reader-supported · independent"
      handle={{ label: "@genie.picks", href: "https://www.instagram.com/" }}
      sheet="#1a7ff0"
      paper="#f4f2ed"
      sheetInk="#ffffff"
      paperInk="#0b0c0e"
      seed={11}
      height="clamp(640px, 94svh, 1040px)"
      fontSans='system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      onSubscribe={onSubscribe}
    />
  )
}
