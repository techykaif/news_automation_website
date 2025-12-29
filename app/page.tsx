
import { NewsCard } from "@/components/news-card"
import { FeaturedSection } from "@/components/featured-section"
import { CategoryFilter } from "@/components/category-filter"
import { getPublishedPosts, getCategories, getFeaturedPosts } from "@/lib/google-sheets"

export const revalidate = 60 // Revalidate every 60 seconds

export default async function HomePage() {
  const [posts, categories, featuredPosts] = await Promise.all([
    getPublishedPosts(),
    getCategories(),
    getFeaturedPosts(),
  ])

  // Get non-featured posts for the grid
  const featuredSlugs = new Set(featuredPosts.map((p) => p.slug))
  const regularPosts = posts.filter((p) => !featuredSlugs.has(p.slug))

  return (
    <div className="min-h-screen flex flex-col bg-background">


      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Featured Section */}
          {featuredPosts.length > 0 && (
            <div className="mb-10">
              <FeaturedSection posts={featuredPosts} />
            </div>
          )}

          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="mb-8">
              <CategoryFilter categories={categories} />
            </div>
          )}

          {/* Latest News Grid */}
          <section>
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full" />
              Latest News
            </h2>

            {posts.length === 0 ? (
              <p className="text-muted-foreground text-center py-12">No news articles available at the moment.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularPosts.map((post) => (
                  <NewsCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
