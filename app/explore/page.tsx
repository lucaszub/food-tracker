"use client"

import { BottomNav } from "@/components/ui/bottom-nav"
import { SearchBar } from "@/components/ui/search-bar"
import { CategoryPill } from "@/components/ui/category-pill"
import { Utensils, Apple, Pizza, Leaf, Fish } from "lucide-react"

const categories = [
  { icon: Utensils, label: "Tous", color: "peach" as const, id: "all" },
  { icon: Apple, label: "Fruits", color: "pink" as const, id: "fruits" },
  { icon: Pizza, label: "Plats", color: "yellow" as const, id: "meals" },
  { icon: Leaf, label: "Vegan", color: "green" as const, id: "vegan" },
  { icon: Fish, label: "Protéines", color: "blue" as const, id: "protein" },
]

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <header className="px-6 pt-8 pb-6">
        <h1 className="text-3xl font-bold text-foreground mb-6">
          Explorer
        </h1>
        <SearchBar placeholder="Rechercher des recettes..." />
      </header>

      <div className="px-6 mb-8">
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <CategoryPill
              key={category.id}
              icon={category.icon}
              label={category.label}
              color={category.color}
            />
          ))}
        </div>
      </div>

      <div className="px-6">
        <div className="text-center py-12 text-muted-foreground">
          Fonctionnalité en cours de développement
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
