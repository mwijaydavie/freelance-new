import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { ProductForm } from "@/components/admin/product-form"
import { listProductImages } from "@/lib/images"

export const dynamic = "force-dynamic"

export default async function NewProductPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const [{ error }, images] = await Promise.all([searchParams, listProductImages()])

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
            New pick
          </h1>
          <p className="mt-3 max-w-[52ch] text-[13px] leading-relaxed text-bone/40">
            Only publish what you have actually lived with. The score, the verdict and the cons are
            what make the page worth reading.
          </p>
        </div>
        <span className="rounded-full border border-white/12 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-bone/35">
          Draft by default
        </span>
      </div>

      <div className="mt-8">
        <ProductForm images={images} error={error} />
      </div>
    </div>
  )
}
