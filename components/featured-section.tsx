import Link from "next/link"
import { Clock, User, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { NewsPost } from "@/lib/types"

interface FeaturedSectionProps {
  posts: NewsPost[]
}

export function FeaturedSection({ posts }: FeaturedSectionProps) {
  if (posts.length === 0) return null

  const [mainPost, ...sidePosts] = posts

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })

  return (
    <section className="border-b border-border pb-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Main featured article */}
        <article className="lg:col-span-3 group">
          <Link href={`/news/${mainPost.slug}`} className="block">
            <div className="flex items-center gap-3 mb-3">
              <Badge className="bg-primary text-primary-foreground">Featured</Badge>
              <Badge variant="outline">{mainPost.category}</Badge>
              <time dateTime={mainPost.publishedAt} className="text-sm text-muted-foreground">
                {formatDate(mainPost.publishedAt)}
              </time>
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground group-hover:text-primary transition-colors leading-tight text-balance mb-4">
              {mainPost.title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4 line-clamp-3">
              {mainPost.content.substring(0, 250)}...
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {mainPost.author && (
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  {mainPost.author}
                </span>
              )}
              {mainPost.readingTime && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {mainPost.readingTime} min read
                </span>
              )}
              <span className="flex items-center gap-1 text-primary font-medium group-hover:gap-2 transition-all">
                Read more <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        </article>

        {/* Side featured articles */}
        <div className="lg:col-span-2 flex flex-col gap-6 lg:border-l lg:border-border lg:pl-8">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Also Featured</h2>
          {sidePosts.slice(0, 3).map((post) => (
            <article key={post.id} className="group pb-6 border-b border-border last:border-0 last:pb-0">
              <Link href={`/news/${post.slug}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {post.category}
                  </Badge>
                  <time dateTime={post.publishedAt} className="text-xs text-muted-foreground">
                    {formatDate(post.publishedAt)}
                  </time>
                </div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors leading-snug mb-2">
                  {post.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {post.author && <span>{post.author}</span>}
                  {post.readingTime && <span>{post.readingTime} min read</span>}
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
