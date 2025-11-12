"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera } from "lucide-react"
import { cn } from "@/lib/utils"

interface MealCardProps {
  mealType: "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK"
  timestamp: Date
  imageUrl?: string
  foods: Array<{
    name: string
    portion: string
    calories: number
    protein: number
    carbs: number
    fat: number
  }>
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
}

const mealTypeLabels = {
  BREAKFAST: { label: "Petit-déjeuner", emoji: "☀️", color: "bg-amber-500/10 text-amber-700 dark:text-amber-400" },
  LUNCH: { label: "Déjeuner", emoji: "🍽️", color: "bg-blue-500/10 text-blue-700 dark:text-blue-400" },
  DINNER: { label: "Dîner", emoji: "🌙", color: "bg-purple-500/10 text-purple-700 dark:text-purple-400" },
  SNACK: { label: "Collation", emoji: "🍎", color: "bg-green-500/10 text-green-700 dark:text-green-400" },
}

export function MealCard({ mealType, timestamp, foods, totalCalories, totalProtein, totalCarbs, totalFat }: MealCardProps) {
  const mealInfo = mealTypeLabels[mealType]
  const timeString = timestamp.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="flex gap-4 p-4">
          {/* Image placeholder */}
          <div className="flex-shrink-0 w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
            <Camera className="h-8 w-8 text-muted-foreground" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className={cn("font-medium", mealInfo.color)}>
                {mealInfo.emoji} {mealInfo.label}
              </Badge>
              <span className="text-xs text-muted-foreground">{timeString}</span>
            </div>

            <div className="space-y-1 mb-3">
              {foods.slice(0, 2).map((food, index) => (
                <p key={index} className="text-sm text-muted-foreground truncate">
                  {food.name} ({food.portion})
                </p>
              ))}
              {foods.length > 2 && (
                <p className="text-xs text-muted-foreground italic">
                  +{foods.length - 2} autre{foods.length - 2 > 1 ? "s" : ""} aliment{foods.length - 2 > 1 ? "s" : ""}
                </p>
              )}
            </div>

            {/* Nutrition summary */}
            <div className="flex flex-wrap gap-3 text-xs">
              <div className="flex items-center gap-1">
                <span className="font-semibold text-foreground">{totalCalories}</span>
                <span className="text-muted-foreground">kcal</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-chart-1">{totalProtein}g</span>
                <span className="text-muted-foreground">protéines</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-chart-3">{totalCarbs}g</span>
                <span className="text-muted-foreground">glucides</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-chart-5">{totalFat}g</span>
                <span className="text-muted-foreground">lipides</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
