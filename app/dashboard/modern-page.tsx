"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BottomNav } from "@/components/ui/bottom-nav"
import { SearchBar } from "@/components/ui/search-bar"
import { CategoryPill } from "@/components/ui/category-pill"
import { ModernMealCard } from "@/components/nutrition/modern-meal-card"
import { Utensils, Apple, Pizza, Leaf, Fish, Flame, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

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
  todayMeals: Array<{
    id: string
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
  }>
  todayTotals: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
}

const categories = [
  { icon: Utensils, label: "Tous", color: "peach" as const, id: "all" },
  { icon: Apple, label: "Fruits", color: "pink" as const, id: "fruits" },
  { icon: Pizza, label: "Plats", color: "yellow" as const, id: "meals" },
  { icon: Leaf, label: "Vegan", color: "green" as const, id: "vegan" },
  { icon: Fish, label: "Protéines", color: "blue" as const, id: "protein" },
]

export default function ModernDashboardPage() {
  const { data: session } = useSession()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  const { user, todayMeals, todayTotals } = userData
  const firstName = user.name?.split(" ")[0] || "Chef"

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Header */}
      <header className="px-6 pt-8 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">
              Hey, {firstName}!
            </h1>
            <p className="text-muted-foreground">
              What are you cooking today?
            </p>
          </div>
          <Link href="/profile">
            <Avatar className="h-12 w-12 ring-2 ring-primary/20">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {firstName[0]}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>

        {/* Search Bar */}
        <SearchBar placeholder="Search recipes..." />
      </header>

      {/* Categories */}
      <div className="px-6 mb-8">
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <CategoryPill
              key={category.id}
              icon={category.icon}
              label={category.label}
              color={category.color}
              isActive={selectedCategory === category.id}
              onClick={() => setSelectedCategory(category.id)}
            />
          ))}
        </div>
      </div>

      {/* Featured Section */}
      <div className="px-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">
            Vos repas aujourd&apos;hui
          </h2>
          <Link href="/history" className="text-sm font-medium text-primary hover:underline">
            Voir tout
          </Link>
        </div>

        {todayMeals.length > 0 ? (
          <div className="space-y-4">
            {/* Featured meal (premier repas en grand) */}
            {todayMeals[0] && (
              <ModernMealCard
                title={todayMeals[0].foods.map(f => f.name).join(", ").substring(0, 50)}
                calories={todayMeals[0].totalCalories}
                prepTime={25}
                rating={4.8}
                isTrending={todayMeals[0].totalCalories > 500}
                imageUrl={todayMeals[0].imageUrl}
              />
            )}

            {/* Grid de repas suivants */}
            {todayMeals.length > 1 && (
              <div className="grid grid-cols-2 gap-4">
                {todayMeals.slice(1, 3).map((meal) => (
                  <div key={meal.id} className="space-y-2">
                    <div className="relative h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
                      {meal.imageUrl ? (
                        <Image src={meal.imageUrl} alt="Meal" fill className="object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Flame className="h-8 w-8 text-primary/30" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm truncate">
                        {meal.foods[0]?.name || "Repas"}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Flame className="h-3 w-3" />
                        <span>{meal.totalCalories} cal</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 px-6 bg-secondary/30 rounded-3xl">
            <Utensils className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground mb-4">
              Aucun repas enregistré aujourd&apos;hui
            </p>
            <Link
              href="/analyze"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
            >
              Analyser un repas
            </Link>
          </div>
        )}
      </div>

      {/* Daily Stats Card */}
      <div className="px-6 mb-8">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/20 rounded-2xl">
              <Flame className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Progression du jour</h3>
              <p className="text-sm text-muted-foreground">
                {todayTotals.calories} / {user.dailyCalories || 2000} kcal
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-background/50 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{
                width: `${Math.min(100, (todayTotals.calories / (user.dailyCalories || 2000)) * 100)}%`,
              }}
            />
          </div>

          {/* Macros grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-chart-1">{Math.round(todayTotals.protein)}g</p>
              <p className="text-xs text-muted-foreground">Protéines</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-chart-2">{Math.round(todayTotals.carbs)}g</p>
              <p className="text-xs text-muted-foreground">Glucides</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-chart-3">{Math.round(todayTotals.fat)}g</p>
              <p className="text-xs text-muted-foreground">Lipides</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
