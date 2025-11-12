"use client"

import { cn } from "@/lib/utils"

interface MacroRingProps {
  label: string
  current: number
  target: number
  unit?: string
  color?: string
  size?: "sm" | "md" | "lg"
}

export function MacroRing({
  label,
  current,
  target,
  unit = "g",
  color = "primary",
  size = "md",
}: MacroRingProps) {
  const percentage = Math.min((current / target) * 100, 100)
  const circumference = 2 * Math.PI * 45

  const sizeClasses = {
    sm: { container: "h-24 w-24", svg: 100, radius: 45, strokeWidth: 8, text: "text-lg", label: "text-xs" },
    md: { container: "h-32 w-32", svg: 140, radius: 45, strokeWidth: 10, text: "text-2xl", label: "text-sm" },
    lg: { container: "h-40 w-40", svg: 180, radius: 45, strokeWidth: 12, text: "text-3xl", label: "text-base" },
  }

  const config = sizeClasses[size]

  const colorClasses: Record<string, string> = {
    primary: "stroke-chart-1",
    protein: "stroke-chart-1",
    carbs: "stroke-chart-3",
    fat: "stroke-chart-5",
  }

  return (
    <div className={cn("relative flex items-center justify-center", config.container)}>
      <svg className="absolute transform -rotate-90" width={config.svg} height={config.svg}>
        {/* Background circle */}
        <circle
          cx={config.svg / 2}
          cy={config.svg / 2}
          r={config.radius}
          className="stroke-muted"
          strokeWidth={config.strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={config.svg / 2}
          cy={config.svg / 2}
          r={config.radius}
          className={cn(colorClasses[color] || colorClasses.primary, "transition-all duration-500")}
          strokeWidth={config.strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (percentage / 100) * circumference}
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <div className="flex flex-col items-center text-center">
        <div className={cn("font-bold", config.text)}>
          {current}
          <span className="text-muted-foreground text-sm font-normal">/{target}</span>
        </div>
        <div className={cn("text-muted-foreground font-medium", config.label)}>
          {label}
        </div>
      </div>
    </div>
  )
}
