"use client"

import PushpinTearFooter from "@/components/ui/pushpin-tear-footer"

/**
 * Usage example for the Pushpin Tear Footer (not used by a route).
 *
 * In this project the live footer is configured once in
 * `components/site/site-footer.tsx` and rendered from `app/layout.tsx`.
 * Drop this component into a page to preview a different brand treatment.
 */
export default function DemoPushpinFooter() {
  return (
    <div className="w-full bg-[#f4f2ed]">
      <PushpinTearFooter
        brand="studio."
        name="the practice"
        logoHref="/"
        sheet="#0b0c0e"
        paper="#f4f2ed"
        paperInk="#0b0c0e"
        seed={23}
        email="hello@example.com"
        newsletter={{ label: "notes, once a month", placeholder: "your@email" }}
        status={{ label: "taking on two projects" }}
        mark="run 0412"
        timeZone="Africa/Dar_es_Salaam"
        timeLabel="EAT"
        socials={[
          { icon: "ig", label: "Instagram", href: "https://www.instagram.com/" },
          { icon: "x", label: "X", href: "https://x.com/" },
        ]}
        columns={[
          {
            title: "work",
            links: [
              { label: "Projects", href: "/products" },
              { label: "Studio", href: "/about" },
              { label: "Notes", href: "/guides" },
            ],
            cta: { label: "see.", href: "/products" },
          },
          {
            title: "contact",
            links: [
              { label: "Email", href: "mailto:hello@example.com" },
              { label: "Instagram", href: "https://www.instagram.com/" },
              { label: "Disclosure", href: "/disclosure" },
            ],
            cta: { label: "talk.", href: "mailto:hello@example.com" },
          },
        ]}
        sideLinks={[
          { icon: "globe", label: "studio", href: "/about" },
          { icon: "doc", label: "terms", href: "/disclosure" },
        ]}
        chat={{ label: "say hi" }}
        copyright="© 2026 Studio"
        credit="designed & built by hand"
        handle={{ label: "@studio", href: "https://www.instagram.com/" }}
      />
    </div>
  )
}
