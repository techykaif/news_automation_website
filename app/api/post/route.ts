/* /api/post/route.ts */

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getPostBySlug } from "@/lib/data-source"

export const runtime = "nodejs"

/**
 * Single post API endpoint
 * GET /api/post?slug=example-slug
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get("slug")

    if (!slug) {
      return NextResponse.json({ error: "Bad Request", message: "Slug parameter is required" }, { status: 400 })
    }

    const post = await getPostBySlug(slug)

    if (!post) {
      return NextResponse.json({ error: "Not Found", message: `Post with slug "${slug}" not found` }, { status: 404 })
    }

    return NextResponse.json(post, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    })
  } catch (error: any) {
    console.error("Post API error:", error)
    return NextResponse.json({ error: "Internal Server Error", message: error.message }, { status: 500 })
  }
}
