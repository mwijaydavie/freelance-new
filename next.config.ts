import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /**
   * Keep the database drivers out of the bundler.
   * `pg` behaves better as a real Node module, and `@electric-sql/pglite`
   * (local/dev only) ships WASM that must not be inlined.
   */
  serverExternalPackages: ["pg", "@electric-sql/pglite"],
}

export default nextConfig
