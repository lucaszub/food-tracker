"use client"

import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface NutritionProgressProps {
  label: string
  current: number
  target: number
  unit: string
  color?: "default" | "protein" | "carbs" | "fat"
  showPercentage?: boolean
}

export function NutritionProgress({
  label,
  current,
  target,
  unit,
  color = "default",
  showPercentage = true,
}: NutritionProgressProps) {
  const percentage = Math.min((current / target) * 100, 100)
  const remaining = Math.max(target - current, 0)

  const colorClasses: Record<string, string> = {
    default: "[&>div]:bg-primary",
    protein: "[&>div]:bg-chart-1",
    carbs: "[&>div]:bg-chart-3",
    fat: "[&>div]:bg-chart-5",
  }

  const getStatusColor = () => {
    if (percentage >= 90 && percentage <= 110) return "text-chart-1"
    if (percentage > 110) return "text-destructive"
    return "text-muted-foreground"
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <div className="flex items-center gap-2">
          <span className={cn("font-semibold", getStatusColor())}>
            {current} / {target} {unit}
          </span>
          {showPercentage && (
            <span className="text-muted-foreground">
              ({Math.round(percentage)}%)
            </span>
          )}
        </div>
      </div>
      <Progress
        value={percentage}
        className={cn("h-2", colorClasses[color])}
      />
      {remaining > 0 && (
        <p className="text-xs text-muted-foreground">
          Il reste {remaining} {unit} pour atteindre votre objectif
        </p>
      )}
    </div>
  )
}
