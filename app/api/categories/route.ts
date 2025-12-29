import { NextResponse } from "next/server"
import { getCategories } from "@/lib/google-sheets"

export const runtime = "nodejs"

/**
 * Categories API endpoint
 * GET /api/categories
 */
export async function GET() {
  try {
    const categories = await getCategories()

    return NextResponse.json(categories, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    })
  } catch (error: any) {
    console.error("Categories API error:", error)
    return NextResponse.json({ error: "Failed to fetch categories", message: error.message }, { status: 500 })
  }
}
