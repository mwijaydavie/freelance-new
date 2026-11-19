import { cn } from "@/lib/utils"

export function ScoreRing({
  score,
  size = 46,
  className,
  tone = "light",
}: {
  score: number
  size?: number
  className?: string
  tone?: "light" | "dark"
}) {
  const r = (size - 6) / 2
  const c = 2 * Math.PI * r
  return (
    <span
      className={cn("relative inline-grid place-items-center", className)}
      style={{ width: size, height: size }}
      aria-label={`Genie score ${score} out of 100`}
    >
      <svg viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 -rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth="2"
          className={tone === "dark" ? "stroke-white/25" : "stroke-ink/12"}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={`${(score / 100) * c} ${c}`}
          className={tone === "dark" ? "stroke-electric" : "stroke-electric"}
        />
      </svg>
      <span
        className={cn(
          "text-[13px] font-medium tabular-nums tracking-tight",
          tone === "dark" ? "text-white" : "text-ink"
        )}
      >
        {score}
      </span>
    </span>
  )
}
