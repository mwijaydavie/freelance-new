import fs from "node:fs/promises"
import path from "node:path"

import { products as seedProducts, type Product } from "@/lib/products"

/**
 * Tiny JSON store for the admin console.
 *
 * Data lives in `.data/` (gitignored) and is created from the seed catalogue on
 * first write. It is intentionally boring: swap `readProducts` / `writeProducts`
 * for Prisma, Drizzle, Sanity or a KV store when you go to production — nothing
 * else in the app touches the filesystem.
 *
 * On read-only hosting (e.g. Vercel's serverless filesystem) writes fail; we
 * fall back to an in-memory catalogue for the life of the instance and surface
 * the error to the admin UI.
 */

const DIR = path.join(process.cwd(), ".data")
const CATALOG = path.join(DIR, "catalog.json")
const SUBSCRIBERS = path.join(DIR, "subscribers.json")

type CatalogFile = { products: Product[]; updatedAt: string }
type SubscriberFile = { email: string; source: string; at: string }[]

let memoryProducts: Product[] | null = null
let memorySubscribers: { email: string; source: string; at: string }[] | null = null

async function readJson<T>(file: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(file, "utf8")
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

async function writeJson(file: string, value: unknown): Promise<void> {
  await fs.mkdir(DIR, { recursive: true })
  await fs.writeFile(file, JSON.stringify(value, null, 2), "utf8")
}

export async function readProducts(): Promise<Product[]> {
  if (memoryProducts) return memoryProducts
  const file = await readJson<CatalogFile>(CATALOG)
  if (file && Array.isArray(file.products)) return file.products
  return seedProducts
}

export type SaveResult = { ok: boolean; error?: string }

export async function writeProducts(products: Product[]): Promise<SaveResult> {
  memoryProducts = products
  try {
    await writeJson(CATALOG, { products, updatedAt: new Date().toISOString() } satisfies CatalogFile)
    return { ok: true }
  } catch {
    return {
      ok: false,
      error:
        "Saved in memory only — this host has a read-only filesystem. Connect a database before launch.",
    }
  }
}

export async function resetProducts(): Promise<SaveResult> {
  memoryProducts = null
  try {
    await fs.rm(CATALOG, { force: true })
    return { ok: true }
  } catch {
    return { ok: false, error: "Could not reset the catalogue on this host." }
  }
}

/* ── subscribers ─────────────────────────────────────────────────────────── */

export async function readSubscribers() {
  if (memorySubscribers) return memorySubscribers
  return (await readJson<SubscriberFile>(SUBSCRIBERS)) ?? []
}

export async function addSubscriber(email: string, source: string) {
  const list = await readSubscribers()
  const key = email.toLowerCase()
  if (list.some((s) => s.email.toLowerCase() === key)) {
    return { ok: true, duplicate: true }
  }
  const next = [{ email, source, at: new Date().toISOString() }, ...list]
  memorySubscribers = next
  try {
    await writeJson(SUBSCRIBERS, next)
    return { ok: true, duplicate: false }
  } catch {
    return { ok: true, duplicate: false, memoryOnly: true }
  }
}
