"use client"

import { useFormStatus } from "react-dom"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

export function SubmitButton({
  children,
  className,
  pendingLabel = "Saving…",
}: {
  children: React.ReactNode
  className?: string
  pendingLabel?: string
}) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-full bg-bone px-6 text-[13px] font-medium text-ink transition-all hover:bg-white disabled:opacity-60",
        className
      )}
    >
      {pending && <Loader2 className="size-4 animate-spin" />}
      {pending ? pendingLabel : children}
    </button>
  )
}
