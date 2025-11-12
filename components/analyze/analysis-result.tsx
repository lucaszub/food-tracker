"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, AlertCircle } from "lucide-react"

interface FoodItem {
  name: string
  portion: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

interface AnalysisResultProps {
  foods: FoodItem[]
  total: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
  confidence: number
  notes?: string
}

export function AnalysisResult({ foods, total, confidence, notes }: AnalysisResultProps) {
  const confidenceColor = confidence >= 0.8 ? "text-chart-1" : confidence >= 0.6 ? "text-warning" : "text-destructive"
  const ConfidenceIcon = confidence >= 0.7 ? CheckCircle2 : AlertCircle

  return (
    <div className="space-y-6">
      {/* Confidence Badge */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ConfidenceIcon className={`h-5 w-5 ${confidenceColor}`} />
              <div>
                <p className="font-semibold">Analyse terminée</p>
                <p className="text-sm text-muted-foreground">
                  Confiance: <span className={`font-semibold ${confidenceColor}`}>{Math.round(confidence * 100)}%</span>
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="text-sm">
              {foods.length} aliment{foods.length > 1 ? "s" : ""} détecté{foods.length > 1 ? "s" : ""}
            </Badge>
          </div>
          {notes && (
            <p className="text-sm text-muted-foreground mt-4 italic">{notes}</p>
          )}
        </CardContent>
      </Card>

      {/* Total Nutrition */}
      <Card>
        <CardHeader>
          <CardTitle>Nutrition totale</CardTitle>
          <CardDescription>Résumé nutritionnel de ce repas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-3xl font-bold">{total.calories}</div>
              <div className="text-sm text-muted-foreground mt-1">Calories</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-chart-1/10">
              <div className="text-3xl font-bold text-chart-1">{total.protein}g</div>
              <div className="text-sm text-muted-foreground mt-1">Protéines</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-chart-3/10">
              <div className="text-3xl font-bold text-chart-3">{total.carbs}g</div>
              <div className="text-sm text-muted-foreground mt-1">Glucides</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-chart-5/10">
              <div className="text-3xl font-bold text-chart-5">{total.fat}g</div>
              <div className="text-sm text-muted-foreground mt-1">Lipides</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Food List */}
      <Card>
        <CardHeader>
          <CardTitle>Détails des aliments</CardTitle>
          <CardDescription>Liste des aliments détectés avec leurs valeurs nutritionnelles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {foods.map((food, index) => (
              <div key={index}>
                {index > 0 && <Separator className="my-4" />}
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{food.name}</h4>
                      <p className="text-sm text-muted-foreground">{food.portion}</p>
                    </div>
                    <Badge variant="outline">{food.calories} kcal</Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-chart-1" />
                      <span className="text-muted-foreground">Protéines:</span>
                      <span className="font-semibold">{food.protein}g</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-chart-3" />
                      <span className="text-muted-foreground">Glucides:</span>
                      <span className="font-semibold">{food.carbs}g</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-chart-5" />
                      <span className="text-muted-foreground">Lipides:</span>
                      <span className="font-semibold">{food.fat}g</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
