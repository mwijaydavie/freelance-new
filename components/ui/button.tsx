"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-electric/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bone",
  {
    variants: {
      variant: {
        default:
          "bg-ink text-bone hover:bg-electric hover:text-white active:scale-[0.98]",
        electric:
          "bg-electric text-white hover:bg-electric-deep active:scale-[0.98] shadow-[0_10px_30px_-12px_rgba(26,127,240,0.7)]",
        outline:
          "border border-ink/20 bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-bone active:scale-[0.98]",
        ghost: "text-ink hover:bg-ink/5",
        paper: "bg-bone text-ink hover:bg-white active:scale-[0.98]",
        link: "text-ink underline-offset-4 hover:underline p-0 h-auto rounded-none",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 px-4 text-[13px]",
        lg: "h-13 px-8 text-[15px]",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
