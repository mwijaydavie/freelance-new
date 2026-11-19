/**
 * Apply the schema to the database in DATABASE_URL.
 *
 *   npm run db:migrate    apply (idempotent — safe to run on every deploy)
 *   npm run db:print      print the SQL, e.g. to paste into the Neon SQL editor
 *
 * The app also does this itself on the first request, so this is mostly for CI
 * pipelines and for people who like to see exactly what ran.
 */
import { closeDb, migrate } from "../lib/db"
import { SCHEMA_SQL } from "../lib/db-schema"

async function main() {
  if (process.argv.includes("--print")) {
    console.log(SCHEMA_SQL.trim())
    return
  }

  const result = await migrate()
  console.log(`✓ genie schema v${result.version} applied — driver: ${result.driver}`)
  await closeDb()
}

main().catch(async (error) => {
  console.error("✗ migration failed:", (error as Error).message)
  console.error("  Is DATABASE_URL set to a reachable Postgres connection string?")
  await closeDb()
  process.exit(1)
})
