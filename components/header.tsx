"use client"

import Link from "next/link"
import { Zap } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { SearchDialog } from "@/components/search-dialog"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">AutoBrief</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link
              href="/categories"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Categories
            </Link>
            <Link
              href="/status"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Status
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <SearchDialog />
            <ThemeToggle />
            {/* Mobile menu button */}
            <Button variant="ghost" size="icon" className="md:hidden" asChild>
              <Link href="/categories">
                <span className="sr-only">Categories</span>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
