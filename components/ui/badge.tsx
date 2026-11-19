import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase leading-none tracking-[0.18em] transition-colors [&_svg]:size-3",
  {
    variants: {
      variant: {
        default: "border-transparent bg-ink text-bone",
        electric: "border-transparent bg-electric text-white",
        outline: "border-ink/20 bg-transparent text-ink/70",
        paper: "border-transparent bg-bone/15 text-bone backdrop-blur",
        soft: "border-transparent bg-ink/5 text-ink/70",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
