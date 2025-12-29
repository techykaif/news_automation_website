import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { NewsCard } from "@/components/news-card"
import { CategoryFilter } from "@/components/category-filter"
import { getPostsByCategory, getCategories } from "@/lib/google-sheets"

export const revalidate = 60

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const categoryName = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())

  return {
    title: `${categoryName} News | AutoBrief`,
    description: `Latest ${categoryName.toLowerCase()} news and articles from AutoBrief.`,
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params
  const [posts, categories] = await Promise.all([getPostsByCategory(slug), getCategories()])

  const categoryName = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())

  // Only show 404 if no posts AND category doesn't exist
  if (posts.length === 0 && !categories.find((c) => c.slug === slug)) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">


      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{categoryName}</h1>
          <p className="text-muted-foreground">
            {posts.length} article{posts.length !== 1 ? "s" : ""} in this category
          </p>
        </div>

        {categories.length > 0 && (
          <div className="mb-8">
            <CategoryFilter categories={categories} />
          </div>
        )}

        {posts.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">No articles in this category yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <NewsCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
