import {
  collections as seedCollections,
  type Collection,
  type CollectionId,
  type Product,
} from "@/lib/products"
import { readProducts } from "@/lib/store"

/** Public reads. Admin edits show up immediately because these pages are dynamic. */

export async function listProducts(): Promise<Product[]> {
  const all = await readProducts()
  return all.filter((p) => p.published !== false)
}

export async function listAllProducts(): Promise<Product[]> {
  return readProducts()
}

export async function findProduct(slug: string): Promise<Product | undefined> {
  const all = await listProducts()
  return all.find((p) => p.slug === slug)
}

export async function featuredProducts(limit = 3): Promise<Product[]> {
  const all = await listProducts()
  const flagged = all.filter((p) => p.featured)
  return (flagged.length ? flagged : all).slice(0, limit)
}

export type CollectionWithItems = Collection & { items: Product[] }

export async function listCollections(): Promise<CollectionWithItems[]> {
  const all = await listProducts()
  return seedCollections.map((c) => ({
    ...c,
    productSlugs: all.filter((p) => p.collection === c.id).map((p) => p.slug),
    items: all.filter((p) => p.collection === c.id),
  }))
}

export async function findCollection(slug: string): Promise<CollectionWithItems | undefined> {
  const all = await listCollections()
  return all.find((c) => c.slug === slug || c.id === slug)
}

export function collectionMeta(id: CollectionId) {
  return seedCollections.find((c) => c.id === id)!
}

export { collectionOptions } from "@/lib/products"
