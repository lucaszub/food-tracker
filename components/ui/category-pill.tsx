"use client"

import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface CategoryPillProps {
  icon: LucideIcon
  label: string
  color: "peach" | "pink" | "yellow" | "green" | "blue"
  isActive?: boolean
  onClick?: () => void
}

export function CategoryPill({
  icon: Icon,
  label,
  color,
  isActive = false,
  onClick,
}: CategoryPillProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-2 transition-transform active:scale-95",
        isActive && "scale-105"
      )}
    >
      <div
        className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center transition-all",
          `pill-${color}`,
          isActive && "ring-2 ring-primary ring-offset-2"
        )}
      >
        <Icon className="w-7 h-7 text-foreground/80" />
      </div>
      <span className={cn(
        "text-xs font-medium transition-colors",
        isActive ? "text-foreground" : "text-muted-foreground"
      )}>
        {label}
      </span>
    </button>
  )
}
