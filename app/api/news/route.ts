/* api/news/route.ts */

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getPublishedPosts, getPostsByCategory } from "@/lib/data-source"

export const runtime = "nodejs"

/**
 * News API endpoint
 * GET /api/news - Get all posts
 * GET /api/news?category=tech - Filter by category
 * GET /api/news?limit=10 - Limit results
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const limit = searchParams.get("limit")

    let posts = category ? await getPostsByCategory(category) : await getPublishedPosts()

    if (limit) {
      const n = Number.parseInt(limit, 10)
      if (!isNaN(n) && n > 0) {
        posts = posts.slice(0, n)
      }
    }

    return NextResponse.json(posts, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
    })
  } catch (error: any) {
    console.error("News API error:", error)
    return NextResponse.json({ error: "Failed to fetch news", message: error.message }, { status: 500 })
  }
}
