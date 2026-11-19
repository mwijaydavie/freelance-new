import Link from "next/link"
import { ArrowLeft, LockKeyhole } from "lucide-react"

import { login } from "@/app/admin/actions"
import { SubmitButton } from "@/components/admin/submit-button"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div className="grid min-h-svh place-items-center px-5 py-16">
      <div className="w-full max-w-[420px]">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-bone/40 transition-colors hover:text-bone"
        >
          <ArrowLeft className="size-3.5" />
          Back to the site
        </Link>

        <div className="mt-10 flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-full bg-electric text-white">
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
              <path d="M12 3.5v17M3.5 12h17M6 6l12 12M18 6 6 18" />
            </svg>
          </span>
          <span className="text-[22px] font-semibold tracking-[-0.045em]">genie.</span>
        </div>

        <p className="mt-8 text-[10px] uppercase tracking-[0.22em] text-electric">Console access</p>
        <h1 className="mt-3 font-display text-[clamp(2.2rem,5vw,3rem)] leading-[1] tracking-[-0.04em]">
          Welcome back.
        </h1>
        <p className="mt-4 max-w-[36ch] text-[13.5px] leading-relaxed text-bone/45">
          Sign in to publish picks, edit reviews and watch the list grow.
        </p>

        <form action={login} className="mt-8 grid gap-3">
          <label className="block">
            <span className="mb-1.5 block text-[10px] uppercase tracking-[0.16em] text-bone/40">
              Admin password
            </span>
            <div className="flex items-center gap-3 rounded-lg border border-white/12 bg-white/[0.04] px-3.5 focus-within:border-electric">
              <LockKeyhole className="size-4 text-bone/30" />
              <input
                name="password"
                type="password"
                required
                autoFocus
                autoComplete="current-password"
                placeholder="••••••••"
                className="h-12 w-full bg-transparent text-[14px] text-bone outline-none placeholder:text-bone/25"
              />
            </div>
          </label>

          {error && (
            <p className="rounded-lg border border-red-400/30 bg-red-400/10 px-3.5 py-2.5 text-[12.5px] text-red-200">
              Wrong password. Try again.
            </p>
          )}

          <SubmitButton className="mt-2 w-full" pendingLabel="Checking…">
            Enter the console
          </SubmitButton>
        </form>

        <p className="mt-8 rounded-lg border border-white/8 bg-white/[0.02] p-4 text-[11.5px] leading-relaxed text-bone/35">
          Set <code className="text-bone/60">ADMIN_PASSWORD</code> in{" "}
          <code className="text-bone/60">.env.local</code> before deploying. The fallback password is{" "}
          <code className="text-bone/60">genie-admin</code>.
        </p>
      </div>
    </div>
  )
}
