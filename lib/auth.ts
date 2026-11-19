import { createHmac, timingSafeEqual } from "node:crypto"

import { cookies } from "next/headers"

export const ADMIN_COOKIE = "genie_admin"

/**
 * Demo-grade admin auth: a single shared password, exchanged for an HMAC token
 * stored in an httpOnly cookie. Good enough to keep the console off the open
 * web — swap for Auth.js / Clerk / a real user table before you hand this to a
 * team.
 *
 * Set ADMIN_PASSWORD in .env.local. The fallback exists so the preview works
 * out of the box; change it before deploying.
 */
export function adminPassword() {
  return process.env.ADMIN_PASSWORD || "genie-admin"
}

export function tokenFor(password: string) {
  return createHmac("sha256", "genie:admin:v1").update(password).digest("hex")
}

function safeEqual(a: string, b: string) {
  const x = Buffer.from(a)
  const y = Buffer.from(b)
  if (x.length !== y.length) return false
  return timingSafeEqual(x, y)
}

export function verifyPassword(input: string) {
  return safeEqual(input, adminPassword())
}

export async function isAdmin() {
  const jar = await cookies()
  const token = jar.get(ADMIN_COOKIE)?.value
  if (!token) return false
  return safeEqual(token, tokenFor(adminPassword()))
}
