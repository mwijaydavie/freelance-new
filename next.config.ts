import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /**
   * Keep the database drivers out of the bundler.
   * `pg` behaves better as a real Node module, and `@electric-sql/pglite`
   * (local/dev only) ships WASM that must not be inlined.
   */
  serverExternalPackages: ["pg", "@electric-sql/pglite"],

  /**
   * Product photos currently live in `public/products/` and need nothing here.
   * When you move media to object storage (R2 / Blob / Neon storage), allow-list
   * the host so `next/image` can optimise it — see docs/stack.md §5:
   *
   *   images: {
   *     remotePatterns: [{ protocol: "https", hostname: "media.genie.reviews" }],
   *   },
   */
}

export default nextConfig
