import { SCHEMA_SQL, SCHEMA_VERSION } from "@/lib/db-schema"

/**
 * Database plumbing.
 *
 * The app talks to Postgres through a tiny runner interface so the store stays
 * readable and the driver stays swappable:
 *
 *   DATABASE_URL set        → Postgres (Neon, Vercel Postgres, Supabase, RDS…)
 *   DB_DRIVER=pglite        → embedded Postgres for local dev + tests only
 *   neither                 → no database; `lib/store.ts` falls back to JSON
 *
 * Schema creation is automatic: the first query on a fresh instance runs
 * `SCHEMA_SQL`, records a version row, and then never looks again. That keeps
 * deploys frictionless — set DATABASE_URL, done — while still allowing
 * `npm run db:migrate` for CI or a manual apply.
 */

export type Queryable = <T = Record<string, unknown>>(
  text: string,
  params?: unknown[]
) => Promise<T[]>

export type DbKind = "postgres" | "pglite"

export type DbRunner = {
  kind: DbKind
  query: Queryable
  /** Multi-statement SQL with no parameters (DDL). */
  exec: (text: string) => Promise<void>
  transaction: <T>(fn: (query: Queryable) => Promise<T>) => Promise<T>
  close: () => Promise<void>
}

/**
 * The connection string, from whichever variable the platform gave us.
 * `DATABASE_URL` is ours; the `POSTGRES_*` names are what Vercel's Postgres /
 * Neon integration injects, so connecting a database there needs no code edit.
 */
export function connectionString(): string | undefined {
  return (
    process.env.DATABASE_URL ??
    process.env.POSTGRES_URL ??
    process.env.POSTGRES_PRISMA_URL ??
    undefined
  )
}

export function dbDriver(): DbKind | "none" {
  if (connectionString()) return "postgres"
  if (process.env.DB_DRIVER === "pglite" || process.env.PGLITE_PATH) return "pglite"
  return "none"
}

const globalForDb = globalThis as unknown as {
  __genieDb?: Promise<DbRunner | null>
  __genieSchema?: Promise<void>
}

function sslFor(connectionString: string) {
  // Local Postgres and PGlite speak plain TCP; hosted providers need TLS.
  const isLocal = /@(localhost|127\.0\.0\.1|\[::1\])[:/]/.test(connectionString)
  if (isLocal) return undefined
  return { rejectUnauthorized: false }
}

async function createPostgresRunner(connectionString: string): Promise<DbRunner> {
  const { Pool } = await import("pg")

  const pool = new Pool({
    connectionString,
    max: Number(process.env.DATABASE_POOL_MAX ?? 3),
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000,
    ssl: sslFor(connectionString),
  })
  // A dead idle socket must never crash the serverless function.
  pool.on("error", (error) => {
    console.error("[db] idle client error", error)
  })

  const query: Queryable = async <T,>(text: string, params: unknown[] = []) => {
    const result = await pool.query(text, params)
    return result.rows as T[]
  }

  return {
    kind: "postgres",
    query,
    exec: async (text) => {
      await pool.query(text)
    },
    transaction: async (fn) => {
      const client = await pool.connect()
      try {
        await client.query("begin")
        const txQuery: Queryable = async <T,>(text: string, params: unknown[] = []) => {
          const result = await client.query(text, params)
          return result.rows as T[]
        }
        const value = await fn(txQuery)
        await client.query("commit")
        return value
      } catch (error) {
        await client.query("rollback").catch(() => {})
        throw error
      } finally {
        client.release()
      }
    },
    close: async () => {
      await pool.end()
    },
  }
}

async function createRunner(): Promise<DbRunner | null> {
  const driver = dbDriver()

  if (driver === "postgres") {
    return createPostgresRunner(connectionString() as string)
  }

  if (driver === "pglite") {
    const { createPgliteRunner } = await import("@/lib/db-pglite")
    return createPgliteRunner()
  }

  return null
}

/** The runner for this process, or null when no database is configured. */
export async function getDb(): Promise<DbRunner | null> {
  if (!globalForDb.__genieDb) {
    globalForDb.__genieDb = createRunner().catch((error) => {
      // Reset so the next request can retry instead of caching the failure.
      globalForDb.__genieDb = undefined
      throw error
    })
  }
  return globalForDb.__genieDb
}

/** The runner, asserted. Throws when no database is configured. */
export async function requireDb(): Promise<DbRunner> {
  const runner = await getDb()
  if (!runner) throw new Error("No database configured. Set DATABASE_URL.")
  return runner
}

const NEEDS_MIGRATION = new Set(["42P01", "3F000"]) // undefined_table, invalid_schema

/**
 * Apply the schema if this database has never seen it. Memoised per process so
 * a warm instance pays the check once at most.
 */
export async function ensureSchema(): Promise<void> {
  if (!globalForDb.__genieSchema) {
    globalForDb.__genieSchema = (async () => {
      const runner = await requireDb()

      try {
        const rows = await runner.query<{ version: number }>(
          "select version from genie_schema where version >= $1 limit 1",
          [SCHEMA_VERSION]
        )
        if (rows.length > 0) return
      } catch (error) {
        const code = (error as { code?: string }).code
        if (!code || !NEEDS_MIGRATION.has(code)) throw error
      }

      try {
        await runner.exec(SCHEMA_SQL)
      } catch (error) {
        // Two cold instances can race here; whoever loses sees "already exists".
        const code = (error as { code?: string }).code
        const benign = code === "42P07" || code === "42710" || code === "23505"
        if (!benign) throw error
      }

      await runner.query(
        "insert into genie_schema (version) values ($1) on conflict (version) do nothing",
        [SCHEMA_VERSION]
      )
    })().catch((error) => {
      globalForDb.__genieSchema = undefined
      throw error
    })
  }

  return globalForDb.__genieSchema
}

/** Close the connection pool. Used by scripts so Node can exit. */
export async function closeDb(): Promise<void> {
  const existing = globalForDb.__genieDb
  globalForDb.__genieDb = undefined
  globalForDb.__genieSchema = undefined
  const runner = await existing?.catch(() => null)
  await runner?.close()
}

/** Manual entry point used by `npm run db:migrate`. */
export async function migrate(): Promise<{ driver: DbKind; version: number }> {
  const runner = await requireDb()
  await runner.exec(SCHEMA_SQL)
  await runner.query(
    "insert into genie_schema (version) values ($1) on conflict (version) do nothing",
    [SCHEMA_VERSION]
  )
  return { driver: runner.kind, version: SCHEMA_VERSION }
}
