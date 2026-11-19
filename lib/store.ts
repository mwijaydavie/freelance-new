import fs from "node:fs/promises"
import path from "node:path"

import { products as seedProducts, type Product } from "@/lib/products"
import { dbDriver } from "@/lib/db"
import {
  sqlAddSubscriber,
  sqlReadProducts,
  sqlReadSubscribers,
  sqlResetProducts,
  sqlWriteProducts,
  type StoredSubscriber,
} from "@/lib/store-sql"

/**
 * The one place the app reads and writes catalogue + subscriber data.
 *
 * Three backends, picked automatically:
 *
 *   1. Postgres — when `DATABASE_URL` is set. This is production. Schema and
 *      the starting catalogue are created on the first request, so deploying
 *      is: add DATABASE_URL, redeploy, done.
 *   2. JSON files in `.data/` — when there is no database and the filesystem
 *      is writable. Good enough for local work with no setup.
 *   3. In-memory — read-only hosts (like Vercel without a database): writes
 *      appear to work for the life of the instance and then vanish, and the
 *      admin says so.
 *
 * Nothing else in the app touches SQL or the filesystem, so this is still the
 * only file to change if you move to another store.
 */

const DIR = path.join(process.cwd(), ".data")
const CATALOG = path.join(DIR, "catalog.json")
const SUBSCRIBERS = path.join(DIR, "subscribers.json")

type CatalogFile = { products: Product[]; updatedAt: string }
type SubscriberFile = StoredSubscriber[]

let memoryProducts: Product[] | null = null
let memorySubscribers: StoredSubscriber[] | null = null
let fileWriteFailed = false

/* ── backend ──────────────────────────────────────────────────────────────── */

export type StoreBackend = "postgres" | "pglite" | "file" | "memory"

export function databaseConfigured(): boolean {
  return dbDriver() !== "none"
}

/** Which store is serving this request. Used by the admin UI. */
export function storeBackend(): StoreBackend {
  const driver = dbDriver()
  if (driver !== "none") return driver
  return fileWriteFailed ? "memory" : "file"
}

/** True when writes actually survive the request. */
export function storeIsDurable(): boolean {
  return databaseConfigured()
}

export const storeLabel: Record<StoreBackend, string> = {
  postgres: "Postgres",
  pglite: "Postgres (local WASM)",
  file: "Local JSON file",
  memory: "Memory only",
}

/* ── filesystem fallback ──────────────────────────────────────────────────── */

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

/* ── products ─────────────────────────────────────────────────────────────── */

export async function readProducts(): Promise<Product[]> {
  if (databaseConfigured()) {
    try {
      return await sqlReadProducts()
    } catch (error) {
      // A database hiccup must never white-screen the public site: log loudly
      // and serve the seed catalogue until the connection recovers.
      console.error("[store] database read failed, serving seed catalogue", error)
      return memoryProducts ?? seedProducts
    }
  }

  if (memoryProducts) return memoryProducts

  const file = await readJson<CatalogFile>(CATALOG)
  if (file && Array.isArray(file.products)) return file.products
  return seedProducts
}

export type SaveResult = { ok: boolean; error?: string }

export async function writeProducts(products: Product[]): Promise<SaveResult> {
  if (databaseConfigured()) {
    try {
      await sqlWriteProducts(products)
      memoryProducts = products
      return { ok: true }
    } catch (error) {
      console.error("[store] database write failed", error)
      return {
        ok: false,
        error: `Could not save to the database: ${(error as Error).message}`,
      }
    }
  }

  memoryProducts = products
  try {
    await writeJson(CATALOG, { products, updatedAt: new Date().toISOString() } satisfies CatalogFile)
    fileWriteFailed = false
    return { ok: true }
  } catch {
    fileWriteFailed = true
    return {
      ok: false,
      error: "Saved in memory only — this host has a read-only filesystem. Connect a database.",
    }
  }
}

export async function resetProducts(): Promise<SaveResult> {
  if (databaseConfigured()) {
    try {
      await sqlResetProducts()
      memoryProducts = null
      return { ok: true }
    } catch (error) {
      console.error("[store] database reset failed", error)
      return { ok: false, error: `Could not restore the catalogue: ${(error as Error).message}` }
    }
  }

  memoryProducts = null
  try {
    await fs.rm(CATALOG, { force: true })
    return { ok: true }
  } catch {
    return { ok: false, error: "Could not reset the catalogue on this host." }
  }
}

/* ── subscribers ──────────────────────────────────────────────────────────── */

export async function readSubscribers(): Promise<StoredSubscriber[]> {
  if (databaseConfigured()) {
    try {
      return await sqlReadSubscribers()
    } catch (error) {
      console.error("[store] database read failed, serving cached subscribers", error)
      return memorySubscribers ?? []
    }
  }

  if (memorySubscribers) return memorySubscribers
  return (await readJson<SubscriberFile>(SUBSCRIBERS)) ?? []
}

export async function addSubscriber(email: string, source: string) {
  if (databaseConfigured()) {
    try {
      const { duplicate } = await sqlAddSubscriber(email, source)
      return { ok: true, duplicate }
    } catch (error) {
      console.error("[store] database write failed for subscriber", error)
      return { ok: false, duplicate: false, error: "Could not save that email" }
    }
  }

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
    fileWriteFailed = true
    return { ok: true, duplicate: false, memoryOnly: true }
  }
}
