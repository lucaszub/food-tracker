"use client"

import { BottomNav } from "@/components/ui/bottom-nav"
import { Bookmark } from "lucide-react"

export default function SavedPage() {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <header className="px-6 pt-8 pb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Favoris
        </h1>
        <p className="text-muted-foreground">
          Vos repas et recettes sauvegardés
        </p>
      </header>

      <div className="px-6">
        <div className="text-center py-12">
          <Bookmark className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Aucun favori pour le moment
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
