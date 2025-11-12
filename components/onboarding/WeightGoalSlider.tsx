"use client"

import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { analyzeWeightGoal, getSafetyColor, getSafetyIcon, type WeightGoalAnalysis } from "@/lib/nutrition/weight-goal-safety"
import { type Sex } from "@/lib/nutrition/calculations"

interface WeightGoalSliderProps {
  currentWeight: number
  height: number
  sex: Sex
  onTargetWeightChange: (weight: number, analysis: WeightGoalAnalysis) => void
}

export function WeightGoalSlider({
  currentWeight,
  height,
  sex,
  onTargetWeightChange,
}: WeightGoalSliderProps) {
  // Calculer les limites du slider (±30kg du poids actuel, mais min 40kg et max 200kg)
  const minWeight = Math.max(40, Math.round(currentWeight - 30))
  const maxWeight = Math.min(200, Math.round(currentWeight + 30))

  const [targetWeight, setTargetWeight] = useState(currentWeight)
  const [analysis, setAnalysis] = useState<WeightGoalAnalysis | null>(null)

  // Analyser l'objectif à chaque changement
  useEffect(() => {
    const newAnalysis = analyzeWeightGoal(currentWeight, targetWeight, height, sex)
    setAnalysis(newAnalysis)
    onTargetWeightChange(targetWeight, newAnalysis)
  }, [targetWeight, currentWeight, height, sex, onTargetWeightChange])

  const handleSliderChange = (value: number[]) => {
    setTargetWeight(value[0])
  }

  if (!analysis) return null

  const isWeightLoss = analysis.weightChange < 0
  const isWeightGain = analysis.weightChange > 0
  const isMaintain = analysis.weightChange === 0

  return (
    <div className="space-y-6">
      {/* Informations actuelles */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Poids actuel</div>
          <div className="text-2xl font-bold">{currentWeight} kg</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Poids idéal (Lorentz)</div>
          <div className="text-2xl font-bold">{analysis.idealWeight} kg</div>
        </Card>
      </div>

      {/* Slider */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Quel poids souhaitez-vous atteindre?</label>
            <Badge variant={getSafetyColor(analysis.safety)}>
              {getSafetyIcon(analysis.safety)} {targetWeight} kg
            </Badge>
          </div>

          <Slider
            value={[targetWeight]}
            onValueChange={handleSliderChange}
            min={minWeight}
            max={maxWeight}
            step={0.5}
            className="py-4"
          />

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{minWeight} kg</span>
            <span>{maxWeight} kg</span>
          </div>
        </div>

        {/* Indicateur visuel de changement */}
        <div className="flex items-center justify-center gap-2 text-sm">
          {isWeightLoss && (
            <>
              <span className="text-muted-foreground">Perte de</span>
              <span className="font-bold text-destructive">
                {Math.abs(analysis.weightChange)} kg
              </span>
            </>
          )}
          {isWeightGain && (
            <>
              <span className="text-muted-foreground">Gain de</span>
              <span className="font-bold text-chart-1">
                {Math.abs(analysis.weightChange)} kg
              </span>
            </>
          )}
          {isMaintain && (
            <span className="font-medium text-muted-foreground">Maintien du poids actuel</span>
          )}
        </div>
      </div>

      {/* Analyse de l'objectif */}
      {!isMaintain && (
        <Card className={`p-5 ${
          analysis.safety === 'safe' ? 'border-chart-1 bg-chart-1/5' :
          analysis.safety === 'moderate' ? 'border-yellow-500 bg-yellow-500/5' :
          'border-destructive bg-destructive/5'
        }`}>
          <div className="space-y-4">
            {/* Message principal */}
            <div className="flex items-start gap-3">
              <span className="text-2xl">{getSafetyIcon(analysis.safety)}</span>
              <div className="flex-1">
                <h4 className="font-semibold text-lg">{analysis.mainMessage}</h4>
              </div>
            </div>

            {/* Détails */}
            {analysis.detailedMessages.length > 0 && (
              <div className="space-y-1 text-sm">
                {analysis.detailedMessages.map((msg, i) => (
                  <div key={i}>{msg}</div>
                ))}
              </div>
            )}

            {/* Durée estimée */}
            {analysis.estimatedWeeks > 0 && (
              <div className="pt-3 border-t">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Rythme recommandé</div>
                    <div className="font-semibold">
                      {isWeightLoss ? '-' : '+'}{analysis.recommendedWeeklyRate} kg/semaine
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Durée estimée</div>
                    <div className="font-semibold">
                      {analysis.estimatedWeeks} semaines
                      {analysis.estimatedMonths >= 1 && (
                        <span className="text-muted-foreground"> ({analysis.estimatedMonths} mois)</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recommandations */}
            {analysis.recommendations.length > 0 && (
              <div className="pt-3 border-t space-y-2">
                <div className="text-sm font-medium">💡 Recommandations:</div>
                <ul className="text-sm space-y-1 list-disc list-inside marker:text-chart-1">
                  {analysis.recommendations.map((rec, i) => (
                    <li key={i} className="text-muted-foreground">{rec}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Avertissements */}
            {analysis.warnings.length > 0 && (
              <Alert variant="destructive">
                <AlertDescription className="space-y-2">
                  {analysis.warnings.map((warning, i) => (
                    <div key={i} className="text-sm">{warning}</div>
                  ))}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </Card>
      )}

      {/* Informations supplémentaires pour le maintien */}
      {isMaintain && (
        <Card className="p-5 border-chart-1 bg-chart-1/5">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✅</span>
            <div className="flex-1 space-y-2">
              <h4 className="font-semibold text-lg">Maintien du poids actuel</h4>
              <p className="text-sm text-muted-foreground">
                Vous avez choisi de maintenir votre poids. L&apos;application vous aidera à suivre
                votre équilibre nutritionnel et à maintenir des habitudes alimentaires saines.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Indicateurs de sécurité IMC */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className={`p-3 rounded-lg border ${
          analysis.currentBMI >= 18.5 && analysis.currentBMI <= 24.9
            ? 'bg-chart-1/10 border-chart-1'
            : 'bg-muted'
        }`}>
          <div className="text-muted-foreground">IMC actuel</div>
          <div className="font-semibold">{analysis.currentBMI}</div>
        </div>
        <div className={`p-3 rounded-lg border ${
          analysis.targetBMI >= 18.5 && analysis.targetBMI <= 24.9
            ? 'bg-chart-1/10 border-chart-1'
            : analysis.targetBMI < 18.5 || analysis.targetBMI > 30
            ? 'bg-destructive/10 border-destructive'
            : 'bg-yellow-500/10 border-yellow-500'
        }`}>
          <div className="text-muted-foreground">IMC cible</div>
          <div className="font-semibold">{analysis.targetBMI}</div>
        </div>
      </div>
    </div>
  )
}
