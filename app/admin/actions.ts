"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { ADMIN_COOKIE, adminPassword, tokenFor, verifyPassword } from "@/lib/auth"
import type { Product, CollectionId } from "@/lib/products"
import { readProducts, writeProducts } from "@/lib/store"

/* ── auth ─────────────────────────────────────────────────────────────────── */

export async function login(formData: FormData) {
  const password = String(formData.get("password") ?? "")
  if (!verifyPassword(password)) {
    redirect("/admin/login?error=1")
  }
  const jar = await cookies()
  jar.set(ADMIN_COOKIE, tokenFor(adminPassword()), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    secure: process.env.NODE_ENV === "production",
  })
  redirect("/admin")
}

export async function logout() {
  const jar = await cookies()
  jar.delete(ADMIN_COOKIE)
  redirect("/admin/login")
}

/* ── helpers ──────────────────────────────────────────────────────────────── */

const lines = (value: FormDataEntryValue | null) =>
  String(value ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)

const num = (value: FormDataEntryValue | null, fallback = 0) => {
  const n = Number(String(value ?? "").replace(/[^0-9.-]/g, ""))
  return Number.isFinite(n) ? n : fallback
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

function pairs(value: FormDataEntryValue | null, fallback: string) {
  return lines(value).map((l) => {
    const [a, b] = l.split("|").map((x) => x.trim())
    return { label: a || fallback, value: b ?? "" }
  })
}

/* ── products ─────────────────────────────────────────────────────────────── */

export async function saveProduct(formData: FormData) {
  const catalogue = await readProducts()
  const originalSlug = String(formData.get("originalSlug") ?? "")
  const name = String(formData.get("name") ?? "").trim()
  const slug = slugify(String(formData.get("slug") ?? "") || name)

  if (!name || !slug) {
    redirect("/admin/products?error=missing")
  }
  if (catalogue.some((p) => p.slug === slug && p.slug !== originalSlug)) {
    redirect(`/admin/products/new?error=slug&slug=${slug}`)
  }

  const specs = pairs(formData.get("specs"), "Spec")
  const scores = pairs(formData.get("scores"), "Score").map((s) => ({
    label: s.label,
    value: Math.max(0, Math.min(100, num(s.value, 80))),
  }))
  const retailers = lines(formData.get("retailers")).map((l) => {
    const [retailerName, url, price, note] = l.split("|").map((x) => x.trim())
    return {
      name: retailerName || "Retailer",
      url: url || "https://example.com",
      price: num(price, num(formData.get("price"), 0)),
      ...(note ? { note } : {}),
    }
  })

  const badge = String(formData.get("badge") ?? "")
  const product: Product = {
    slug,
    name,
    maker: String(formData.get("maker") ?? "").trim() || "Independent",
    collection: (String(formData.get("collection") ?? "audio") as CollectionId) ?? "audio",
    price: num(formData.get("price"), 0),
    score: Math.max(0, Math.min(100, num(formData.get("score"), 80))),
    ...(badge ? { badge: badge as Product["badge"] } : {}),
    verdict: String(formData.get("verdict") ?? "").trim(),
    bestFor: String(formData.get("bestFor") ?? "").trim(),
    summary: String(formData.get("summary") ?? "").trim(),
    image: String(formData.get("image") ?? "").trim() || "/products/aura-one.jpg",
    testedHours: num(formData.get("testedHours"), 0),
    updated: String(formData.get("updated") ?? "").slice(0, 10) || new Date().toISOString().slice(0, 10),
    pros: lines(formData.get("pros")),
    cons: lines(formData.get("cons")),
    specs,
    scores: scores.length ? scores : [{ label: "Overall", value: 80 }],
    retailers: retailers.length
      ? retailers
      : [{ name: "Amazon", url: "https://www.amazon.com/s?k=" + encodeURIComponent(name), price: num(formData.get("price"), 0) }],
    published: formData.get("published") === "on",
    featured: formData.get("featured") === "on",
  }

  const next = originalSlug
    ? catalogue.map((p) => (p.slug === originalSlug ? product : p))
    : [product, ...catalogue]

  const result = await writeProducts(next)
  revalidatePath("/", "layout")
  const flag = result.ok ? "saved" : "memory"
  redirect(`/admin/products/${product.slug}?status=${flag}`)
}

export async function deleteProduct(formData: FormData) {
  const slug = String(formData.get("slug") ?? "")
  const catalogue = await readProducts()
  await writeProducts(catalogue.filter((p) => p.slug !== slug))
  revalidatePath("/", "layout")
  redirect("/admin/products?status=deleted")
}

export async function toggleFlag(formData: FormData) {
  const slug = String(formData.get("slug") ?? "")
  const field = String(formData.get("field") ?? "")
  if (field !== "published" && field !== "featured") return
  const catalogue = await readProducts()
  await writeProducts(
    catalogue.map((p) =>
      p.slug === slug
        ? { ...p, [field]: field === "published" ? p.published === false : !p.featured }
        : p
    )
  )
  revalidatePath("/", "layout")
  redirect("/admin/products")
}

export async function restoreSeedCatalogue() {
  const { resetProducts } = await import("@/lib/store")
  await resetProducts()
  revalidatePath("/", "layout")
  redirect("/admin/products?status=reset")
}
