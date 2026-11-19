import { Download } from "lucide-react"

import { readSubscribers } from "@/lib/store"

export const dynamic = "force-dynamic"

export default async function SubscribersPage() {
  const subscribers = await readSubscribers()

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-electric">Audience</p>
          <h1 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] leading-[1] tracking-[-0.04em]">
            The Friday list
          </h1>
          <p className="mt-3 max-w-[52ch] text-[13px] leading-relaxed text-bone/40">
            {subscribers.length} subscriber{subscribers.length === 1 ? "" : "s"}. This list is the only
            audience you own — it survives every algorithm change.
          </p>
        </div>
        <a
          href="/admin/subscribers/export"
          className="inline-flex h-11 items-center gap-2 rounded-full border border-white/15 px-5 text-[13px] text-bone/70 transition-colors hover:border-white/35 hover:text-bone"
        >
          <Download className="size-4" />
          Export CSV
        </a>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
        <div className="grid grid-cols-[minmax(0,1fr)_140px_140px] gap-4 border-b border-white/10 px-5 py-3 text-[10px] uppercase tracking-[0.16em] text-bone/30">
          <span>Email</span>
          <span className="hidden sm:block">Source</span>
          <span className="text-right">Joined</span>
        </div>

        {subscribers.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <p className="text-[13px] text-bone/40">No signups yet.</p>
            <p className="mx-auto mt-2 max-w-[40ch] text-[12px] leading-relaxed text-bone/25">
              Submit the newsletter form on the site — it posts to{" "}
              <code className="text-bone/45">/api/subscribe</code> and lands here.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-white/8">
            {subscribers.map((s) => (
              <li
                key={s.email + s.at}
                className="grid grid-cols-[minmax(0,1fr)_140px_140px] items-center gap-4 px-5 py-3.5 text-[13px]"
              >
                <span className="truncate text-bone/80">{s.email}</span>
                <span className="hidden text-[10.5px] uppercase tracking-[0.12em] text-bone/30 sm:block">
                  {s.source}
                </span>
                <span className="text-right text-[11.5px] tabular-nums text-bone/35">
                  {new Date(s.at).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mt-5 text-[11.5px] leading-relaxed text-bone/30">
        Stored in <code className="text-bone/50">.data/subscribers.json</code>. Connect your ESP
        (Buttondown, ConvertKit, Resend) inside <code className="text-bone/50">lib/store.ts</code> or{" "}
        <code className="text-bone/50">app/api/subscribe/route.ts</code> when you outgrow the file.
      </p>
    </div>
  )
}
