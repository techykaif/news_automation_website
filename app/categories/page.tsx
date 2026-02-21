/* /categories/page.tsx */

import Link from "next/link"
import type { Metadata } from "next"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Folder } from "lucide-react"
import { getCategories } from "@/lib/data-source"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Categories | AutoBrief",
  description: "Browse all news categories on AutoBrief.",
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="min-h-screen flex flex-col bg-background">

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Categories</h1>
          <p className="text-muted-foreground">Browse news by category</p>
        </div>

        {categories.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">No categories available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link key={category.slug} href={`/category/${category.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow hover:border-primary">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                      <Folder className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {category.count} article{category.count !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
