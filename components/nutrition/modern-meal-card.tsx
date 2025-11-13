"use client"

import { Clock, Flame, Star } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface ModernMealCardProps {
  title: string
  imageUrl?: string
  calories: number
  prepTime?: number
  rating?: number
  isTrending?: boolean
  onClick?: () => void
  className?: string
}

export function ModernMealCard({
  title,
  imageUrl,
  calories,
  prepTime,
  rating,
  isTrending = false,
  onClick,
  className,
}: ModernMealCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative overflow-hidden rounded-3xl cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]",
        className
      )}
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/5">
        {imageUrl ? (
          <Image src={imageUrl} alt={title} fill className="object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Flame className="h-16 w-16 text-primary/30" />
          </div>
        )}

        {/* Trending badge */}
        {isTrending && (
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground border-none px-3 py-1">
            Trending
          </Badge>
        )}
      </div>

      {/* Content overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4">
        <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>

        <div className="flex items-center gap-3 text-white/90 text-sm">
          {prepTime && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{prepTime} mins</span>
            </div>
          )}

          <div className="flex items-center gap-1">
            <Flame className="h-4 w-4" />
            <span>{calories} cal</span>
          </div>

          {rating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
