import type { CollectionId, Product } from "@/lib/products"
import { products as seedProducts } from "@/lib/products"
import { ensureSchema, requireDb } from "@/lib/db"

/**
 * Postgres implementation of the store. `lib/store.ts` calls into this only
 * when a database is configured, and keeps the JSON/file fallback for local
 * work without one.
 *
 * Design choices worth knowing:
 *  - Scalar fields are real columns (so you can query, sort, index them).
 *  - The list-ish fields (pros, cons, specs, scores, retailers) are `jsonb` —
 *    they are only ever read whole, and this keeps the editor simple.
 *  - The catalogue keeps its curated order in `sort_order`; `writeProducts`
 *    rewrites the whole list in one transaction (upsert + prune).
 */

const SELECT_COLUMNS = `
  slug,
  published,
  featured,
  name,
  maker,
  collection,
  price,
  score,
  badge,
  verdict,
  best_for,
  summary,
  image,
  tested_hours,
  to_char(updated, 'YYYY-MM-DD') as updated,
  pros,
  cons,
  specs,
  scores,
  retailers
`

const UPSERT_PRODUCT = `
insert into genie_products (
  slug, published, featured, name, maker, collection, price, score, badge,
  verdict, best_for, summary, image, tested_hours, updated,
  pros, cons, specs, scores, retailers, sort_order
) values (
  $1, $2, $3, $4, $5, $6, $7, $8, $9,
  $10, $11, $12, $13, $14, $15,
  $16::jsonb, $17::jsonb, $18::jsonb, $19::jsonb, $20::jsonb, $21
)
on conflict (slug) do update set
  published = excluded.published,
  featured = excluded.featured,
  name = excluded.name,
  maker = excluded.maker,
  collection = excluded.collection,
  price = excluded.price,
  score = excluded.score,
  badge = excluded.badge,
  verdict = excluded.verdict,
  best_for = excluded.best_for,
  summary = excluded.summary,
  image = excluded.image,
  tested_hours = excluded.tested_hours,
  updated = excluded.updated,
  pros = excluded.pros,
  cons = excluded.cons,
  specs = excluded.specs,
  scores = excluded.scores,
  retailers = excluded.retailers,
  sort_order = excluded.sort_order,
  updated_at = now()
`

type ProductRow = {
  slug: string
  published: boolean
  featured: boolean
  name: string
  maker: string
  collection: string
  price: string | number
  score: number
  badge: string | null
  verdict: string
  best_for: string
  summary: string
  image: string
  tested_hours: number
  updated: string | null
  pros: unknown
  cons: unknown
  specs: unknown
  scores: unknown
  retailers: unknown
}

const list = <T>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : [])

function toProduct(row: ProductRow): Product {
  return {
    slug: row.slug,
    published: row.published,
    featured: row.featured,
    name: row.name,
    maker: row.maker,
    collection: row.collection as CollectionId,
    price: Number(row.price),
    score: Number(row.score),
    ...(row.badge ? { badge: row.badge as Product["badge"] } : {}),
    verdict: row.verdict,
    bestFor: row.best_for,
    summary: row.summary,
    image: row.image,
    testedHours: Number(row.tested_hours),
    updated: row.updated ?? new Date().toISOString().slice(0, 10),
    pros: list<string>(row.pros),
    cons: list<string>(row.cons),
    specs: list<Product["specs"][number]>(row.specs),
    scores: list<Product["scores"][number]>(row.scores),
    retailers: list<Product["retailers"][number]>(row.retailers),
  }
}

function toParams(product: Product, index: number): unknown[] {
  const date = /^\d{4}-\d{2}-\d{2}$/.test(product.updated ?? "") ? product.updated : null

  return [
    product.slug,
    product.published !== false,
    Boolean(product.featured),
    product.name,
    product.maker,
    product.collection,
    Number(product.price ?? 0),
    Math.round(Number(product.score ?? 0)),
    product.badge ?? null,
    product.verdict ?? "",
    product.bestFor ?? "",
    product.summary ?? "",
    product.image ?? "",
    Math.round(Number(product.testedHours ?? 0)),
    date,
    JSON.stringify(list(product.pros)),
    JSON.stringify(list(product.cons)),
    JSON.stringify(list(product.specs)),
    JSON.stringify(list(product.scores)),
    JSON.stringify(list(product.retailers)),
    index,
  ]
}

/** Insert/update a whole list inside an existing transaction. */
async function upsertAll(
  query: (text: string, params?: unknown[]) => Promise<unknown[]>,
  products: Product[]
) {
  for (const [index, product] of products.entries()) {
    await query(UPSERT_PRODUCT, toParams(product, index))
  }
}

async function seedCatalogue(): Promise<void> {
  const db = await requireDb()

  // Atomic claim: only the process that inserts this key seeds the table, so
  // two cold instances cannot double-insert the starting catalogue.
  const claimed = await db.query<{ key: string }>(
    `insert into genie_meta (key, value) values ('catalogue_seeded_at', $1)
     on conflict (key) do nothing
     returning key`,
    [new Date().toISOString()]
  )
  if (claimed.length === 0) return

  await db.transaction(async (query) => {
    await upsertAll(query, seedProducts)
  })
}

const globalForStore = globalThis as unknown as { __genieStoreReady?: Promise<void> }

/** Schema + first-run seed, once per process. */
function ready(): Promise<void> {
  if (!globalForStore.__genieStoreReady) {
    globalForStore.__genieStoreReady = (async () => {
      await ensureSchema()
      await seedCatalogue()
    })().catch((error) => {
      globalForStore.__genieStoreReady = undefined
      throw error
    })
  }
  return globalForStore.__genieStoreReady
}

/* ── products ─────────────────────────────────────────────────────────────── */

export async function sqlReadProducts(): Promise<Product[]> {
  await ready()
  const db = await requireDb()
  const rows = await db.query<ProductRow>(
    `select ${SELECT_COLUMNS} from genie_products order by sort_order asc, slug asc`
  )
  return rows.map(toProduct)
}

export async function sqlWriteProducts(products: Product[]): Promise<void> {
  await ready()
  const db = await requireDb()

  await db.transaction(async (query) => {
    await upsertAll(query, products)
    await query(
      `delete from genie_products where not (slug = any($1::text[]))`,
      [products.map((p) => p.slug)]
    )
  })
}

export async function sqlResetProducts(): Promise<void> {
  const db = await requireDb()
  await ensureSchema()

  await db.transaction(async (query) => {
    await query(`delete from genie_products`)
    await query(`delete from genie_meta where key = 'catalogue_seeded_at'`)
    await upsertAll(query, seedProducts)
    await query(
      `insert into genie_meta (key, value) values ('catalogue_seeded_at', $1)
       on conflict (key) do update set value = excluded.value, updated_at = now()`,
      [new Date().toISOString()]
    )
  })

  // Keep the in-memory cache used by the fallback path honest.
  globalForStore.__genieStoreReady = Promise.resolve()
}

/* ── subscribers ──────────────────────────────────────────────────────────── */

export type StoredSubscriber = { email: string; source: string; at: string }

export async function sqlReadSubscribers(): Promise<StoredSubscriber[]> {
  await ready()
  const db = await requireDb()
  const rows = await db.query<{ email: string; source: string; created_at: Date }>(
    `select email, source, created_at from genie_subscribers order by created_at desc limit 20000`
  )
  return rows.map((row) => ({
    email: row.email,
    source: row.source,
    at: new Date(row.created_at).toISOString(),
  }))
}

export async function sqlAddSubscriber(
  email: string,
  source: string
): Promise<{ duplicate: boolean }> {
  await ready()
  const db = await requireDb()
  const inserted = await db.query<{ id: string }>(
    `insert into genie_subscribers (email, source) values ($1, $2)
     on conflict (lower(email)) do nothing
     returning id`,
    [email, source]
  )
  return { duplicate: inserted.length === 0 }
}
