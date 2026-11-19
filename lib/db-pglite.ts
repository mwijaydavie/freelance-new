import fs from "node:fs"
import path from "node:path"

import type { DbRunner, Queryable } from "@/lib/db"

/**
 * Embedded Postgres (PGlite) — a real Postgres engine compiled to WASM.
 *
 * This exists for two reasons only:
 *
 *   1. `npm run db:smoke` runs the whole store against real Postgres semantics
 *      without needing a database server (or network).
 *   2. If you want to develop against SQL instead of the JSON fallback, run
 *      `PGLITE_PATH=.data/pg npm run dev` — data persists in `.data/pg`.
 *
 * Production uses `DATABASE_URL` + node-postgres (see `lib/db.ts`); PGlite is a
 * devDependency and is never loaded when DATABASE_URL is set.
 */
function resolveLocation(): string {
  const raw = process.env.PGLITE_PATH
  if (!raw) return "memory://"
  if (raw.startsWith("memory://") || raw.startsWith("idb://")) return raw

  const withoutScheme = raw.replace(/^file:\/\//, "").replace(/^file:/, "")
  const absolute = path.isAbsolute(withoutScheme)
    ? withoutScheme
    : path.join(process.cwd(), withoutScheme)

  fs.mkdirSync(absolute, { recursive: true })
  return absolute
}

export async function createPgliteRunner(): Promise<DbRunner> {
  const { PGlite } = await import("@electric-sql/pglite")

  const db = new PGlite(resolveLocation())

  const query: Queryable = async <T,>(text: string, params: unknown[] = []) => {
    const result = await db.query<T>(text, params as never)
    return result.rows
  }

  return {
    kind: "pglite",
    query,
    exec: async (text) => {
      await db.exec(text)
    },
    transaction: async (fn) =>
      db.transaction(async (tx) => {
        const txQuery: Queryable = async <T,>(text: string, params: unknown[] = []) => {
          const result = await tx.query<T>(text, params as never)
          return result.rows
        }
        return fn(txQuery)
      }),
    close: async () => {
      await db.close()
    },
  }
}
