import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full min-w-0 rounded-full border border-ink/15 bg-white/60 px-5 py-2 text-sm text-ink shadow-none transition-colors outline-none",
        "placeholder:text-ink/40 focus-visible:border-ink focus-visible:bg-white",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
