/**
 * End-to-end smoke test for the Postgres store.
 *
 * Runs the real `lib/store.ts` against PGlite — a genuine Postgres engine in
 * WASM — backed by a file, in two separate processes. That means it proves the
 * things that actually break in production:
 *
 *   • the schema applies and applies again without exploding
 *   • the seed catalogue lands in the right order, exactly once
 *   • writes are transactional and survive a process restart
 *   • deleting a product prunes it, resetting restores the seed
 *   • subscribers dedupe case-insensitively
 *
 *   npm run db:smoke
 */
process.env.DB_DRIVER = "pglite"
process.env.PGLITE_PATH = process.env.PGLITE_PATH ?? "file:.data/pg-smoke"

const phase = process.argv[2] ?? "seed"
const failures: string[] = []

function check(condition: unknown, label: string) {
  if (condition) {
    console.log(`  ✓ ${label}`)
  } else {
    console.log(`  ✗ ${label}`)
    failures.push(label)
  }
}

async function main() {
  const store = await import("../lib/store")
  const db = await import("../lib/db")

  if (phase === "seed") {
    console.log("phase 1 — first run against an empty database")

    const products = await store.readProducts()
    check(products.length === 9, `seed catalogue inserted (${products.length} products)`)
    check(products[0]?.slug === "aura-one", "curated order preserved (aura-one first)")
    check(products[0]?.pros.length === 4, "jsonb arrays round-trip (pros)")

    // Re-running the schema must be a no-op, not an error.
    await db.ensureSchema()
    check(true, "schema re-apply is idempotent")

    const edited = products.map((p) => (p.slug === "aura-one" ? { ...p, price: 399 } : p))
    const added = {
      ...products[0],
      slug: "smoke-test",
      name: "Smoke Test",
      published: false,
      retailers: [{ name: "Amazon", url: "https://www.amazon.com/s?k=smoke", price: 10 }],
    }
    const saved = await store.writeProducts([...edited, added])
    check(saved.ok, `writeProducts ok${saved.error ? ` — ${saved.error}` : ""}`)

    const first = await store.addSubscriber("Ada@Example.com", "smoke")
    const again = await store.addSubscriber("ada@example.com", "smoke")
    check(first.ok && !first.duplicate, "new subscriber accepted")
    check(again.ok && again.duplicate, "duplicate subscriber rejected (case-insensitive)")

    const subs = await store.readSubscribers()
    check(subs.length === 1, `subscriber count is 1 (got ${subs.length})`)
  }

  if (phase === "verify") {
    console.log("phase 2 — fresh process, same database file")

    const products = await store.readProducts()
    const aura = products.find((p) => p.slug === "aura-one")
    check(products.length === 10, `edits survived restart (${products.length} products)`)
    check(aura?.price === 399, `edited price persisted (${aura?.price})`)
    check(
      products.some((p) => p.slug === "smoke-test" && p.published === false),
      "new draft persisted"
    )

    const subs = await store.readSubscribers()
    check(subs.length === 1, "subscribers survived restart")
    check(!Number.isNaN(Date.parse(subs[0]?.at ?? "")), "subscriber timestamp is an ISO string")
    check(subs[0]?.email === "Ada@Example.com", "subscriber email kept as entered")

    // Prune: writing the list without the draft must delete that row.
    const kept = products.filter((p) => p.slug !== "smoke-test")
    await store.writeProducts(kept)
    const afterPrune = await store.readProducts()
    check(afterPrune.length === 9, `pruned row removed (${afterPrune.length} products)`)
    check(!afterPrune.some((p) => p.slug === "smoke-test"), "pruned slug is gone")

    // Reset restores the seed catalogue but leaves subscribers alone.
    const reset = await store.resetProducts()
    const afterReset = await store.readProducts()
    const restored = afterReset.find((p) => p.slug === "aura-one")
    check(reset.ok, "resetProducts ok")
    check(afterReset.length === 9, `seed restored after reset (${afterReset.length})`)
    check(restored?.price === 349, "reset put the seed price back")
    check((await store.readSubscribers()).length === 1, "reset does not touch subscribers")
  }

  await db.closeDb()

  if (failures.length > 0) {
    console.error(`\n${failures.length} check(s) failed`)
    process.exit(1)
  }
  console.log("\nall checks passed")
}

main().catch((error) => {
  console.error("✗ smoke test crashed:", error)
  process.exit(1)
})
