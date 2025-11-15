"use client"

import { useState } from "react"
import { Nav } from "@/components/nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUploader } from "@/components/analyze/image-uploader"
import { AnalysisResult } from "@/components/analyze/analysis-result"
import { Loader2, ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Types pour l'analyse de repas
type FoodItem = {
  name: string
  portion: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

type AnalysisResultType = {
  foods: FoodItem[]
  total: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
  confidence: number
  notes: string
}

// Type pour la réponse de l'API d'analyse
type ApiFoodItem = {
  name: string
  quantity: number
  unit: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

type MealType = "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK"

export default function AnalyzePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResultType | null>(null)
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

    try {
      // Convertir l'image en base64
      const reader = new FileReader()
      const base64Image = await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(selectedFile)
      })

      // Appeler l'API d'analyse
      const response = await fetch("/api/analyze-meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Image }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'analyse")
      }

      // Adapter le format de l'API au format attendu par le composant
      const formattedResult = {
        foods: data.analysis.foods.map((food: ApiFoodItem) => ({
          name: food.name,
          portion: `${food.quantity}${food.unit}`,
          calories: food.calories,
          protein: food.protein,
          carbs: food.carbs,
          fat: food.fat,
        })),
        total: data.analysis.total,
        confidence: data.analysis.confidence,
        notes: data.analysis.notes,
      }

      setAnalysisResult(formattedResult)
    } catch (error) {
      console.error("Erreur lors de l'analyse:", error)
      alert(error instanceof Error ? error.message : "Erreur lors de l'analyse")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSave = async () => {
    // En production, sauvegarder le repas dans la base de données
    console.log("Sauvegarde du repas:", { mealType: selectedMealType, ...analysisResult })
    alert("Repas sauvegardé avec succès! (Mock)")
  }

  const mealTypes = [
    { value: "BREAKFAST", label: "Petit-déjeuner", emoji: "☀️" },
    { value: "LUNCH", label: "Déjeuner", emoji: "🍽️" },
    { value: "DINNER", label: "Dîner", emoji: "🌙" },
    { value: "SNACK", label: "Collation", emoji: "🍎" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Nav />

      <main className="container py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Analyser un repas</h1>
            <p className="text-muted-foreground">Prenez ou uploadez une photo pour obtenir une analyse nutritionnelle</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Image Upload */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Photo du repas</CardTitle>
                <CardDescription>Ajoutez une image claire de votre repas pour une meilleure précision</CardDescription>
              </CardHeader>
              <CardContent>
                <ImageUploader
                  onImageSelect={handleImageSelect}
                  onImageRemove={handleImageRemove}
                  previewUrl={previewUrl}
                />
              </CardContent>
            </Card>

            {/* Meal Type Selection */}
            {previewUrl && !analysisResult && (
              <Card>
                <CardHeader>
                  <CardTitle>Type de repas</CardTitle>
                  <CardDescription>Sélectionnez le type de repas pour un meilleur suivi</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={selectedMealType} onValueChange={(v) => setSelectedMealType(v as MealType)}>
                    <TabsList className="grid w-full grid-cols-4">
                      {mealTypes.map((type) => (
                        <TabsTrigger key={type.value} value={type.value} className="text-xs">
                          <span className="mr-1">{type.emoji}</span>
                          <span className="hidden sm:inline">{type.label}</span>
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>

                  <Button
                    className="w-full mt-4"
                    size="lg"
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
                </CardContent>
              </Card>
            )}

            {/* Tips Card */}
            {!previewUrl && (
              <Card className="border-info/20 bg-info/5">
                <CardHeader>
                  <CardTitle className="text-base">Conseils pour une meilleure analyse</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      Photographiez le repas d&apos;en haut pour une vue complète
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      Assurez-vous que l&apos;image est bien éclairée
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      Évitez les ombres ou reflets sur les aliments
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      Incluez des objets de référence pour estimer les portions
                    </li>
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Analysis Results */}
          <div>
            {isAnalyzing && (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center py-12">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Analyse en cours...</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    L&apos;IA analyse votre repas pour identifier les aliments et calculer les valeurs nutritionnelles
                  </p>
                </CardContent>
              </Card>
            )}

            {analysisResult && (
              <div className="space-y-4">
                <AnalysisResult {...analysisResult} />

                {/* Save Button */}
                <div className="flex gap-3">
                  <Button className="flex-1" size="lg" onClick={handleSave}>
                    <Save className="mr-2 h-5 w-5" />
                    Sauvegarder ce repas
                  </Button>
                  <Button variant="outline" size="lg" onClick={handleImageRemove}>
                    Nouvelle analyse
                  </Button>
                </div>
              </div>
            )}

            {!previewUrl && !isAnalyzing && !analysisResult && (
              <Card className="h-full border-dashed">
                <CardContent className="flex flex-col items-center justify-center h-full py-12 text-center">
                  <div className="rounded-full bg-muted p-6 mb-4">
                    <svg
                      className="h-12 w-12 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Aucune analyse en cours</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Ajoutez une photo de votre repas pour commencer l&apos;analyse nutritionnelle
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
