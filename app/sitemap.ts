import type { MetadataRoute } from "next"

import { collections, products } from "@/lib/products"
import { guides } from "@/lib/guides"

const BASE = "https://genie.reviews"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticRoutes = ["", "/products", "/collections", "/guides", "/about", "/disclosure"].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }))

  const collectionRoutes = collections.map((c) => ({
    url: `${BASE}/collections/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  const productRoutes = products.map((p) => ({
    url: `${BASE}/products/${p.slug}`,
    lastModified: new Date(p.updated),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }))

  const guideRoutes = guides.map((g) => ({
    url: `${BASE}/guides/${g.slug}`,
    lastModified: new Date(g.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...collectionRoutes, ...productRoutes, ...guideRoutes]
}
