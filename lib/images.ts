import fs from "node:fs/promises"
import path from "node:path"

/** Product images available to the admin picker. */
export async function listProductImages(): Promise<string[]> {
  try {
    const dir = path.join(process.cwd(), "public", "products")
    const files = await fs.readdir(dir)
    return files
      .filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f))
      .sort()
      .map((f) => `/products/${f}`)
  } catch {
    return []
  }
}
