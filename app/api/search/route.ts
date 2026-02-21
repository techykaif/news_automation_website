/* /api/search/route.ts */

import { type NextRequest, NextResponse } from "next/server"
import { searchPosts } from "@/lib/data-source"

export const runtime = "nodejs"

/**
 * Search API endpoint
 * GET /api/search?q=query
 * GET /api/search?q=query&limit=10
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q")
    const limit = searchParams.get("limit")

    if (!query || query.trim() === "") {
      return NextResponse.json([])
    }

    let results = await searchPosts(query.trim())

    if (limit) {
      const limitNum = Number.parseInt(limit, 10)
      if (!isNaN(limitNum) && limitNum > 0) {
        results = results.slice(0, limitNum)
      }
    }

    return NextResponse.json(results, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
    })
  } catch (error: any) {
    console.error("Search API error:", error)
    return NextResponse.json({ error: "Search failed", message: error.message }, { status: 500 })
  }
}
