import { NextRequest, NextResponse } from "next/server"
import { getPublishedPosts } from "@/lib/data-source"

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const page = Number(searchParams.get("page") || 1)
  const limit = Number(searchParams.get("limit") || 18)

  const posts = await getPublishedPosts(page, limit)

  return NextResponse.json(posts)
}