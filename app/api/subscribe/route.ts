import { NextResponse } from "next/server"

import { addSubscriber } from "@/lib/store"

/**
 * Newsletter capture endpoint.
 *
 * Demo behaviour: validates the address and logs it. Swap the body of this
 * handler for your ESP (Buttondown, ConvertKit, Mailchimp, Resend audiences…)
 * — the forms on the site and in the footer already POST here.
 */
export async function POST(request: Request) {
  let email = ""
  let source = "site"

  try {
    const body = (await request.json()) as { email?: unknown; source?: unknown }
    email = typeof body.email === "string" ? body.email.trim() : ""
    source = typeof body.source === "string" ? body.source : "site"
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Enter a valid email" }, { status: 422 })
  }

  // Persist locally so the admin console has something real to show.
  // Replace or extend this with your ESP (Buttondown, ConvertKit, Resend…).
  const saved = await addSubscriber(email, source)
  if (!saved.ok) {
    return NextResponse.json({ ok: false, error: "Could not save that email" }, { status: 500 })
  }

  return NextResponse.json({ ok: true, duplicate: Boolean("duplicate" in saved && saved.duplicate) })
}
