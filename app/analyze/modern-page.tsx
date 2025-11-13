"use client"

import { useState } from "react"
import { BottomNav } from "@/components/ui/bottom-nav"
import { Button } from "@/components/ui/button"
import { ImageUploader } from "@/components/analyze/image-uploader"
import { Loader2, ArrowLeft, Save, Camera } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const mockAnalysisResult = {
  foods: [
    {
      name: "Saumon grillé",
      portion: "180g",
      calories: 320,
      protein: 42,
      carbs: 0,
      fat: 16,
    },
    {
      name: "Quinoa cuit",
      portion: "150g",
      calories: 180,
      protein: 6,
      carbs: 32,
      fat: 3,
    },
    {
      name: "Asperges vertes",
      portion: "120g",
      calories: 25,
      protein: 3,
      carbs: 5,
      fat: 0,
    },
  ],
  total: {
    calories: 525,
    protein: 51,
    carbs: 37,
    fat: 19,
  },
  confidence: 0.91,
  notes: "Repas équilibré avec excellente source de protéines",
}

type MealType = "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK"

const mealTypes = [
  { value: "BREAKFAST", label: "Petit-déj", emoji: "☀️" },
  { value: "LUNCH", label: "Déjeuner", emoji: "🍽️" },
  { value: "DINNER", label: "Dîner", emoji: "🌙" },
  { value: "SNACK", label: "Snack", emoji: "🍎" },
]

export default function ModernAnalyzePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<typeof mockAnalysisResult | null>(null)
  const [selectedMealType, setSelectedMealType] = useState<MealType>("LUNCH")

  const handleImageSelect = (file: File) => {
    setSelectedFile(file)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    setAnalysisResult(null)
  }

  const handleImageRemove = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setSelectedFile(null)
    setPreviewUrl("")
    setAnalysisResult(null)
  }

  const handleAnalyze = async () => {
    if (!selectedFile) return
    setIsAnalyzing(true)
    await new Promise((resolve) => setTimeout(resolve, 2500))
    setAnalysisResult(mockAnalysisResult)
    setIsAnalyzing(false)
  }

  const handleSave = async () => {
    console.log("Sauvegarde du repas:", { mealType: selectedMealType, ...analysisResult })
    alert("Repas sauvegardé avec succès! (Mock)")
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Header */}
      <header className="px-6 pt-8 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/dashboard">
            <button className="p-2 hover:bg-secondary rounded-full transition-colors">
              <ArrowLeft className="h-6 w-6" />
            </button>
          </Link>
          <h1 className="text-2xl font-bold">Analyser un repas</h1>
        </div>
      </header>

      <div className="px-6 space-y-6">
        {/* Image Upload Section */}
        <div className="bg-gradient-to-br from-primary/5 to-transparent rounded-3xl p-6">
          {!previewUrl ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Camera className="h-10 w-10 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Prenez une photo</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                Photographiez votre repas pour obtenir une analyse nutritionnelle instantanée
              </p>
              <ImageUploader
                onImageSelect={handleImageSelect}
                onImageRemove={handleImageRemove}
                previewUrl={previewUrl}
              />
            </div>
          ) : (
            <div>
              <div className="relative rounded-2xl overflow-hidden mb-4 h-64">
                <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                <button
                  onClick={handleImageRemove}
                  className="absolute top-3 right-3 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors z-10"
                >
                  <ArrowLeft className="h-5 w-5 rotate-90" />
                </button>
              </div>

              {!analysisResult && (
                <>
                  <p className="text-sm font-medium mb-3">Type de repas</p>
                  <div className="grid grid-cols-4 gap-2 mb-6">
                    {mealTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setSelectedMealType(type.value as MealType)}
                        className={`p-3 rounded-2xl text-center transition-all ${
                          selectedMealType === type.value
                            ? "bg-primary text-primary-foreground scale-105"
                            : "bg-secondary/50 hover:bg-secondary"
                        }`}
                      >
                        <div className="text-2xl mb-1">{type.emoji}</div>
                        <div className="text-xs font-medium">{type.label}</div>
                      </button>
                    ))}
                  </div>

                  <Button
                    className="w-full h-14 rounded-2xl text-base"
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Analyse en cours...
                      </>
                    ) : (
                      "Analyser le repas"
                    )}
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Analysis Loading */}
        {isAnalyzing && (
          <div className="bg-secondary/30 rounded-3xl p-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Analyse en cours...</h3>
            <p className="text-sm text-muted-foreground">
              L&apos;IA analyse votre repas
            </p>
          </div>
        )}

        {/* Analysis Results */}
        {analysisResult && (
          <div className="space-y-4">
            <div className="bg-card rounded-3xl p-6 border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-xl">Résultats</h3>
                <div className="px-3 py-1 bg-success/10 text-success rounded-full text-sm font-medium">
                  {Math.round(analysisResult.confidence * 100)}% confiance
                </div>
              </div>

              {/* Total calories card */}
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 mb-6">
                <p className="text-sm text-muted-foreground mb-1">Total</p>
                <p className="text-4xl font-bold text-primary mb-4">
                  {analysisResult.total.calories} <span className="text-xl">kcal</span>
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Protéines</p>
                    <p className="text-lg font-bold text-chart-1">{analysisResult.total.protein}g</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Glucides</p>
                    <p className="text-lg font-bold text-chart-2">{analysisResult.total.carbs}g</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Lipides</p>
                    <p className="text-lg font-bold text-chart-3">{analysisResult.total.fat}g</p>
                  </div>
                </div>
              </div>

              {/* Foods list */}
              <div className="space-y-3">
                <p className="font-semibold text-sm">Aliments détectés</p>
                {analysisResult.foods.map((food, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-secondary/30 rounded-2xl">
                    <div>
                      <p className="font-medium">{food.name}</p>
                      <p className="text-xs text-muted-foreground">{food.portion}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{food.calories} kcal</p>
                      <p className="text-xs text-muted-foreground">
                        P:{food.protein}g C:{food.carbs}g L:{food.fat}g
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <Button className="flex-1 h-14 rounded-2xl" onClick={handleSave}>
                <Save className="mr-2 h-5 w-5" />
                Sauvegarder
              </Button>
              <Button
                variant="outline"
                className="h-14 rounded-2xl px-6"
                onClick={handleImageRemove}
              >
                Nouveau
              </Button>
            </div>
          </div>
        )}

        {/* Tips */}
        {!previewUrl && (
          <div className="bg-info/10 rounded-3xl p-6 border border-info/20">
            <h3 className="font-semibold mb-3">💡 Conseils</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Photographiez d&apos;en haut pour une vue complète</li>
              <li>• Assurez une bonne luminosité</li>
              <li>• Évitez les ombres sur les aliments</li>
            </ul>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
