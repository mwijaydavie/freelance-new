"use client"

import * as React from "react"
import { ArrowRight, Check, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

type State = "idle" | "loading" | "ok" | "error"

export function NewsletterForm({
  source = "site",
  tone = "light",
  className,
  note,
}: {
  source?: string
  tone?: "light" | "dark"
  className?: string
  note?: string
}) {
  const [email, setEmail] = React.useState("")
  const [state, setState] = React.useState<State>("idle")
  const [error, setError] = React.useState("")

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setState("error")
      setError("That email doesn't look right.")
      return
    }
    setState("loading")
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source }),
      })
      if (!res.ok) throw new Error("Request failed")
      setState("ok")
    } catch {
      setState("error")
      setError("Something went wrong. Try again in a moment.")
    }
  }

  if (state === "ok") {
    return (
      <div
        className={cn(
          "flex items-center gap-3 rounded-full border px-5 py-3.5 text-sm",
          tone === "dark" ? "border-white/25 text-white" : "border-ink/20 text-ink",
          className
        )}
        role="status"
      >
        <Check className="size-4 text-electric" />
        You're on the list — Friday, 7am.
      </div>
    )
  }

  return (
    <form onSubmit={submit} className={cn("w-full max-w-md", className)} noValidate>
      <div
        className={cn(
          "flex items-center gap-2 rounded-full border p-1.5 transition-colors focus-within:border-electric",
          tone === "dark" ? "border-white/20 bg-white/5" : "border-ink/15 bg-white/60"
        )}
      >
        <label htmlFor={`nl-${source}`} className="sr-only">
          Email address
        </label>
        <input
          id={`nl-${source}`}
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (state === "error") setState("idle")
          }}
          placeholder="your@email"
          autoComplete="email"
          className={cn(
            "h-10 min-w-0 flex-1 bg-transparent px-4 text-sm outline-none",
            tone === "dark" ? "text-white placeholder:text-white/40" : "text-ink placeholder:text-ink/40"
          )}
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-full transition-transform duration-300 hover:scale-105 disabled:opacity-60",
            tone === "dark" ? "bg-bone text-ink" : "bg-ink text-bone"
          )}
          aria-label="Subscribe"
        >
          {state === "loading" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <ArrowRight className="size-4" />
          )}
        </button>
      </div>
      <p
        className={cn(
          "mt-2.5 px-4 text-[11.5px] leading-relaxed",
          state === "error"
            ? "text-red-500"
            : tone === "dark"
              ? "text-white/45"
              : "text-ink/45"
        )}
        aria-live="polite"
      >
        {state === "error" ? error : (note ?? "One email a week. Unsubscribe in a click.")}
      </p>
    </form>
  )
}
