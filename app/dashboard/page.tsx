"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Nav } from "@/components/nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MacroRing } from "@/components/nutrition/macro-ring"
import { NutritionProgress } from "@/components/nutrition/nutrition-progress"
import { MealCard } from "@/components/nutrition/meal-card"
import { mockRecommendations } from "@/lib/mock-data"
import { Target, TrendingUp, AlertCircle, Flame, Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

type UserData = {
  user: {
    id: string
    name: string | null
    email: string
    weight: number | null
    height: number | null
    bmi: number | null
    bmr: number | null
    tdee: number | null
    idealWeight: number | null
    bodyFatPercent: number | null
    dailyCalories: number | null
    dailyProtein: number | null
    dailyCarbs: number | null
    dailyFat: number | null
  }
  todayMeals: any[]
  todayTotals: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch("/api/user/profile")
        if (response.ok) {
          const data = await response.json()
          setUserData(data)
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (session) {
      fetchUserData()
    }
  }, [session])

  if (isLoading || !userData) {
    return (
      <div className="min-h-screen bg-background">
        <Nav />
        <main className="container py-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Chargement de vos données...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  const { user, todayMeals, todayTotals } = userData
  const remainingCalories = (user.dailyCalories || 0) - todayTotals.calories

  // Generate dynamic recommendations
  const caloriePercent = user.dailyCalories ? (todayTotals.calories / user.dailyCalories) * 100 : 0
  const proteinPercent = user.dailyProtein ? (todayTotals.protein / user.dailyProtein) * 100 : 0

  const recommendations = [
    {
      id: "rec_1",
      type: caloriePercent > 90 ? "success" : "info" as const,
      title: `Objectif calorique atteint à ${Math.round(caloriePercent)}%`,
      message: remainingCalories > 0
        ? `Il vous reste environ ${remainingCalories} calories à consommer aujourd'hui.`
        : "Objectif atteint! Pensez à maintenir l'équilibre.",
      icon: "target",
    },
    {
      id: "rec_2",
      type: proteinPercent < 60 ? "warning" : "success" as const,
      title: proteinPercent < 60 ? "Attention aux protéines" : "Bon apport protéique",
      message:
        proteinPercent < 60
          ? `Vous êtes à ${Math.round(proteinPercent)}% de votre objectif protéique.`
          : `Excellent! Vous êtes à ${Math.round(proteinPercent)}% de vos protéines.`,
      icon: "alert-circle",
    },
    {
      id: "rec_3",
      type: "info" as const,
      title: "Continuez comme ça!",
      message: "Votre suivi nutritionnel est régulier. Gardez le cap!",
      icon: "trend-up",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Nav />

      <main className="container py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Bonjour, {user.name?.split(" ")[0] || "là"}! 👋</h1>
          <p className="text-muted-foreground">
            Voici votre progression nutritionnelle du{" "}
            {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>

        {/* Calorie Summary Card */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <MacroRing
                    label="Calories"
                    current={todayTotals.calories}
                    target={user.dailyCalories || 2000}
                    unit="kcal"
                    size="lg"
                  />
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Objectif journalier</p>
                    <p className="text-2xl font-bold">{user.dailyCalories || 2000} kcal</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-chart-3" />
                    <p className="text-sm">
                      {remainingCalories > 0 ? (
                        <span>
                          <span className="font-semibold text-chart-1">{remainingCalories} kcal</span> restantes
                        </span>
                      ) : (
                        <span className="text-destructive font-semibold">Objectif atteint</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="text-center">
                  <MacroRing
                    label="Protéines"
                    current={Math.round(todayTotals.protein)}
                    target={user.dailyProtein || 150}
                    unit="g"
                    color="protein"
                    size="sm"
                  />
                </div>
                <div className="text-center">
                  <MacroRing
                    label="Glucides"
                    current={Math.round(todayTotals.carbs)}
                    target={user.dailyCarbs || 200}
                    unit="g"
                    color="carbs"
                    size="sm"
                  />
                </div>
                <div className="text-center">
                  <MacroRing
                    label="Lipides"
                    current={Math.round(todayTotals.fat)}
                    target={user.dailyFat || 70}
                    unit="g"
                    color="fat"
                    size="sm"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <div className="grid md:grid-cols-3 gap-4">
          {recommendations.map((rec) => {
            const icons = {
              target: Target,
              "trend-up": TrendingUp,
              "alert-circle": AlertCircle,
            }
            const Icon = icons[rec.icon as keyof typeof icons]

            const colorClasses = {
              info: "border-info/20 bg-info/5",
              success: "border-chart-1/20 bg-chart-1/5",
              warning: "border-warning/20 bg-warning/5",
            }

            return (
              <Card key={rec.id} className={colorClasses[rec.type]}>
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-background/50">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-sm font-semibold">{rec.title}</CardTitle>
                      <CardDescription className="text-xs mt-1">{rec.message}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            )
          })}
        </div>

        {/* Macronutrients Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Détail des macronutriments</CardTitle>
            <CardDescription>Votre progression vers vos objectifs quotidiens</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <NutritionProgress
              label="Protéines"
              current={Math.round(todayTotals.protein)}
              target={user.dailyProtein || 150}
              unit="g"
              color="protein"
            />
            <NutritionProgress
              label="Glucides"
              current={Math.round(todayTotals.carbs)}
              target={user.dailyCarbs || 200}
              unit="g"
              color="carbs"
            />
            <NutritionProgress
              label="Lipides"
              current={Math.round(todayTotals.fat)}
              target={user.dailyFat || 70}
              unit="g"
              color="fat"
            />
          </CardContent>
        </Card>

        {/* Today's Meals */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">Repas d'aujourd'hui</h2>
              <p className="text-sm text-muted-foreground">
                {todayMeals.length > 0 ? `${todayMeals.length} repas enregistrés` : "Aucun repas enregistré"}
              </p>
            </div>
            <Link href="/analyze">
              <Button>
                <span className="mr-2">+</span>
                Analyser un repas
              </Button>
            </Link>
          </div>

          {todayMeals.length > 0 ? (
            <div className="grid gap-4">
              {todayMeals.map((meal) => (
                <MealCard key={meal.id} {...meal} />
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground mb-4">Aucun repas enregistré aujourd'hui</p>
                <Link href="/analyze">
                  <Button>Analyser votre premier repas</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>IMC (Indice de Masse Corporelle)</CardDescription>
              <CardTitle className="text-3xl">{user.bmi?.toFixed(1) || "N/A"}</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary" className="bg-chart-1/10 text-chart-1">
                {user.bmi && user.bmi >= 18.5 && user.bmi < 25 ? "Normal" : "Calculé"}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Poids actuel / Objectif</CardDescription>
              <CardTitle className="text-3xl">
                {user.weight || "N/A"}kg
                {user.idealWeight && (
                  <span className="text-base text-muted-foreground font-normal"> / {user.idealWeight.toFixed(1)}kg</span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user.weight && user.idealWeight && user.weight > user.idealWeight && (
                <p className="text-sm text-muted-foreground">
                  {(user.weight - user.idealWeight).toFixed(1)}kg à perdre
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Masse grasse estimée</CardDescription>
              <CardTitle className="text-3xl">{user.bodyFatPercent?.toFixed(1) || "N/A"}%</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Basé sur IMC et âge</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
