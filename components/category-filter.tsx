"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import type { Category } from "@/lib/types"

interface CategoryFilterProps {
  categories: Category[]
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const pathname = usePathname()

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/"
        className={cn(
          "px-4 py-2 rounded-full text-sm font-medium transition-colors",
          pathname === "/"
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        )}
      >
        All
      </Link>
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={`/category/${category.slug}`}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-colors",
            pathname === `/category/${category.slug}`
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground",
          )}
        >
          {category.name}
          <span className="ml-1.5 text-xs opacity-70">({category.count})</span>
        </Link>
      ))}
    </div>
  )
}
