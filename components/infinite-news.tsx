"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { NewsCard } from "./news-card"
import type { NewsPost } from "@/lib/types"

interface InfiniteNewsProps {
  initialPosts: NewsPost[]
}

export function InfiniteNews({ initialPosts }: InfiniteNewsProps) {
  const [posts, setPosts] = useState<NewsPost[]>(initialPosts)
  const [page, setPage] = useState<number>(2)
  const [loading, setLoading] = useState<boolean>(false)
  const [hasMore, setHasMore] = useState<boolean>(true)

  const observerRef = useRef<IntersectionObserver | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)

    try {
      const res = await fetch(`/api/posts?page=${page}&limit=18`)
      const data: NewsPost[] = await res.json()

      if (data.length === 0) {
        setHasMore(false)
      } else {
        setPosts((prev) => [...prev, ...data])
        setPage((prev) => prev + 1)
      }
    } catch (err) {
      console.error("Load more error:", err)
    }

    setLoading(false)
  }, [page, loading, hasMore])

  useEffect(() => {
    if (!sentinelRef.current) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore()
        }
      },
      { rootMargin: "200px" }
    )

    observerRef.current.observe(sentinelRef.current)

    return () => observerRef.current?.disconnect()
  }, [loadMore])

  return (
    <>
      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <div
            key={post.id}
            className="animate-fadeIn"
            style={{ animationDelay: `${index * 40}ms` }}
          >
            <NewsCard post={post} />
          </div>
        ))}
      </div>

      {/* Skeleton Loader */}
      {hasMore && (
        <div ref={sentinelRef} className="mt-10">
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-48 rounded-lg bg-muted animate-pulse"
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* End Message */}
      {!hasMore && (
        <div className="text-center text-muted-foreground mt-10 text-sm">
          You’ve reached the end 🎉
        </div>
      )}
    </>
  )
}