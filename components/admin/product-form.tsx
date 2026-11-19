"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowUpRight, ImageIcon } from "lucide-react"

import { saveProduct } from "@/app/admin/actions"
import { SubmitButton } from "@/components/admin/submit-button"
import { DeleteButton } from "@/components/admin/delete-button"
import { collectionOptions, type Product } from "@/lib/products"
import { cn } from "@/lib/utils"

const BADGES = ["", "editor's pick", "best value", "quiet luxury"] as const

const field =
  "w-full rounded-lg border border-white/12 bg-white/[0.04] px-3.5 py-2.5 text-[13.5px] text-bone outline-none transition-colors placeholder:text-bone/25 focus:border-electric focus:bg-white/[0.06]"
const labelCls = "mb-1.5 block text-[10px] uppercase tracking-[0.16em] text-bone/40"

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  type = "text",
  hint,
  required,
  className,
  list,
}: {
  label: string
  name: string
  defaultValue?: string | number
  placeholder?: string
  type?: string
  hint?: string
  required?: boolean
  className?: string
  list?: string
}) {
  return (
    <label className={cn("block", className)}>
      <span className={labelCls}>{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        list={list}
        className={field}
      />
      {hint && <span className="mt-1.5 block text-[11px] text-bone/30">{hint}</span>}
    </label>
  )
}

function Area({
  label,
  name,
  defaultValue,
  placeholder,
  rows = 4,
  hint,
  className,
}: {
  label: string
  name: string
  defaultValue?: string
  placeholder?: string
  rows?: number
  hint?: string
  className?: string
}) {
  return (
    <label className={cn("block", className)}>
      <span className={labelCls}>{label}</span>
      <textarea
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={cn(field, "resize-y leading-relaxed")}
      />
      {hint && <span className="mt-1.5 block text-[11px] text-bone/30">{hint}</span>}
    </label>
  )
}

function Panel({
  title,
  caption,
  children,
  className,
}: {
  title: string
  caption?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn("border-t border-white/10 pt-7", className)}>
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-[11px] uppercase tracking-[0.18em] text-bone/45">{title}</h2>
        {caption && <p className="text-[11px] text-bone/25">{caption}</p>}
      </div>
      {children}
    </section>
  )
}

export function ProductForm({
  product,
  images,
  error,
}: {
  product?: Product
  images: string[]
  error?: string
}) {
  const [image, setImage] = React.useState(product?.image ?? images[0] ?? "/products/aura-one.jpg")
  const [name, setName] = React.useState(product?.name ?? "")

  const specs = (product?.specs ?? []).map((s) => `${s.label} | ${s.value}`).join("\n")
  const scores = (product?.scores ?? []).map((s) => `${s.label} | ${s.value}`).join("\n")
  const retailers = (product?.retailers ?? [])
    .map((r) => `${r.name} | ${r.url} | ${r.price}${r.note ? ` | ${r.note}` : ""}`)
    .join("\n")

  return (
    <form action={saveProduct} className="pb-24">
      {product && <input type="hidden" name="originalSlug" value={product.slug} />}

      {error && (
        <p className="mb-6 rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-[13px] text-red-200">
          {error === "slug" ? "That URL slug is already in use." : "Name and slug are required."}
        </p>
      )}

      <div className="grid gap-8 lg:grid-cols-12">
        {/* main column */}
        <div className="lg:col-span-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Product name"
              name="name"
              required
              defaultValue={product?.name}
              placeholder="Aura One"
              className="sm:col-span-2"
            />
            <Field label="Maker / brand" name="maker" defaultValue={product?.maker} placeholder="Norr Audio" />
            <Field
              label="URL slug"
              name="slug"
              defaultValue={product?.slug}
              placeholder={name ? name.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "aura-one"}
              hint="Leave blank to generate from the name."
            />
            <label className="block">
              <span className={labelCls}>Collection</span>
              <select name="collection" defaultValue={product?.collection ?? "audio"} className={field}>
                {collectionOptions.map((c) => (
                  <option key={c.id} value={c.id} className="bg-ink">
                    {c.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className={labelCls}>Badge</span>
              <select name="badge" defaultValue={product?.badge ?? ""} className={field}>
                {BADGES.map((b) => (
                  <option key={b || "none"} value={b} className="bg-ink">
                    {b || "No badge"}
                  </option>
                ))}
              </select>
            </label>
            <Field label="Price (USD)" name="price" type="number" defaultValue={product?.price} placeholder="349" />
            <Field label="Genie score (0–100)" name="score" type="number" defaultValue={product?.score} placeholder="94" />
            <Field
              label="Hours tested"
              name="testedHours"
              type="number"
              defaultValue={product?.testedHours}
              placeholder="128"
            />
            <Field label="Last updated" name="updated" type="date" defaultValue={product?.updated} />
          </div>

          <Panel title="The verdict" caption="One line sells the pick; the paragraph earns the trust." className="mt-9">
            <div className="grid gap-5">
              <Field
                label="Verdict (one line)"
                name="verdict"
                defaultValue={product?.verdict}
                placeholder="The first over-ear in years that gets tuning, comfort and price in the same room."
              />
              <Field
                label="Best for"
                name="bestFor"
                defaultValue={product?.bestFor}
                placeholder="Working through a noisy day"
              />
              <Area
                label="Full review"
                name="summary"
                rows={6}
                defaultValue={product?.summary}
                placeholder="Two weeks of testing, one conclusion…"
                hint="Plain paragraphs. This is what search engines and buyers read first."
              />
            </div>
          </Panel>

          <Panel title="Pros & cons" caption="One per line." className="mt-9">
            <div className="grid gap-5 sm:grid-cols-2">
              <Area
                label="What we liked"
                name="pros"
                rows={5}
                defaultValue={product?.pros.join("\n")}
                placeholder={"Tuning that flatters almost every genre\nSix hours without ear fatigue"}
              />
              <Area
                label="What to know"
                name="cons"
                rows={5}
                defaultValue={product?.cons.join("\n")}
                placeholder={"ANC trails the class leader\nCase is bigger than it needs to be"}
              />
            </div>
          </Panel>

          <Panel title="Specs & scores" caption="Format: label | value" className="mt-9">
            <div className="grid gap-5 sm:grid-cols-2">
              <Area
                label="Specs"
                name="specs"
                rows={5}
                defaultValue={specs}
                placeholder={"Battery | 38 h (ANC on)\nWeight | 268 g"}
              />
              <Area
                label="Score breakdown"
                name="scores"
                rows={5}
                defaultValue={scores}
                placeholder={"Sound | 95\nComfort | 94\nValue | 92"}
                hint="One row per score bar (0–100)."
              />
            </div>
          </Panel>

          <Panel title="Where to buy" caption="Format: retailer | affiliate URL | price | note" className="mt-9">
            <Area
              label="Retailer links"
              name="retailers"
              rows={4}
              defaultValue={retailers}
              placeholder={`Amazon | https://amzn.to/your-tag | 349 | Ships in 2 days\nBrand direct | https://brand.example | 349`}
              hint={'These render with rel="sponsored nofollow". Use your tracked links.'}
            />
          </Panel>
        </div>

        {/* side column */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-24">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <span className={labelCls}>Image</span>
              <div className="relative mb-3 aspect-[4/5] overflow-hidden rounded-lg bg-paper">
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={image} alt="Selected product" className="size-full object-cover" />
                ) : (
                  <span className="grid size-full place-items-center text-ink/30">
                    <ImageIcon className="size-8" />
                  </span>
                )}
              </div>
              <input
                name="image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                list="product-images"
                className={field}
                placeholder="/products/aura-one.jpg"
              />
              <datalist id="product-images">
                {images.map((src) => (
                  <option key={src} value={src} />
                ))}
              </datalist>
              <p className="mt-2 text-[11px] leading-relaxed text-bone/30">
                Pick an existing file in <code className="text-bone/50">public/products</code> or paste any URL.
              </p>
            </div>

            <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <span className={labelCls}>Publishing</span>
              <label className="flex items-center justify-between gap-3 border-b border-white/8 py-2.5 text-[13px]">
                <span className="text-bone/70">Published on site</span>
                <input
                  type="checkbox"
                  name="published"
                  defaultChecked={product ? product.published !== false : true}
                  className="size-4 accent-[#1a7ff0]"
                />
              </label>
              <label className="flex items-center justify-between gap-3 py-2.5 text-[13px]">
                <span className="text-bone/70">Featured on home</span>
                <input
                  type="checkbox"
                  name="featured"
                  defaultChecked={Boolean(product?.featured)}
                  className="size-4 accent-[#1a7ff0]"
                />
              </label>
              <p className="mt-2 text-[11px] leading-relaxed text-bone/30">
                Featured picks fill the home page shortlist. Three is the sweet spot.
              </p>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <SubmitButton>{product ? "Save changes" : "Create pick"}</SubmitButton>
              <Link
                href="/admin/products"
                className="inline-flex h-11 items-center rounded-full border border-white/15 px-5 text-[13px] text-bone/60 transition-colors hover:border-white/35 hover:text-bone"
              >
                Cancel
              </Link>
            </div>

            {product && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Link
                  href={`/products/${product.slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 text-[12px] text-bone/40 hover:text-bone"
                >
                  View live page <ArrowUpRight className="size-3.5" />
                </Link>
                <span className="text-bone/15">·</span>
                <DeleteButton slug={product.slug} name={product.name} />
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  )
}
