import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { ProductForm } from "@/components/admin/product-form"
import { listProductImages } from "@/lib/images"
import { readProducts } from "@/lib/store"

export const dynamic = "force-dynamic"

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ status?: string; error?: string }>
}) {
  const [{ slug }, { status, error }, images] = await Promise.all([
    params,
    searchParams,
    listProductImages(),
  ])

  const products = await readProducts()
  const product = products.find((p) => p.slug === slug)
  if (!product) notFound()

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-bone/35 hover:text-bone"
          >
            <ArrowLeft className="size-3.5" />
            Catalogue
          </Link>
          <h1 className="mt-4 font-display text-[clamp(2rem,4vw,3rem)] leading-[1] tracking-[-0.04em]">
            {product.name}
          </h1>
          <p className="mt-3 text-[12.5px] text-bone/40">
            /products/{product.slug} · {product.collection}
          </p>
        </div>
        <span
          className={
            product.published === false
              ? "rounded-full border border-white/15 px-3.5 py-2 text-[10px] uppercase tracking-[0.16em] text-bone/40"
              : "rounded-full bg-electric/15 px-3.5 py-2 text-[10px] uppercase tracking-[0.16em] text-electric"
          }
        >
          {product.published === false ? "Draft" : "Published"}
        </span>
      </div>

      {status && (
        <p className="mt-6 rounded-lg border border-electric/30 bg-electric/10 px-4 py-3 text-[12.5px] text-bone/80">
          {status === "memory"
            ? "Saved in memory only — connect a database before deploying."
            : "Saved. The public page is already showing these changes."}
        </p>
      )}

      <div className="mt-8">
        <ProductForm product={product} images={images} error={error} />
      </div>
    </div>
  )
}
