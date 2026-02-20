import { JWT } from "google-auth-library"
import type { NewsPost, Category } from "./types"

/**
 * FINAL_BLOGS Google Sheet schema (0-based index)
 * -----------------------------------------------
 * 0  id
 * 1  source_id
 * 2  title
 * 3  slug
 * 4  content_base
 * 5  summary_base
 * 6  category
 * 7  author
 * 8  published_at
 * 9  is_published
 * 10 is_featured
 * 11 seo_title_base
 * 12 seo_description_base
 * 13 processing_status
 * 14 ai_summary
 * 15 ai_content
 * 16 ai_seo_title
 */

/* =========================
   GLOBAL CACHE (DATASET)
   ========================= */
let cachedPosts: NewsPost[] | null = null
let cacheTimestamp = 0
const CACHE_DURATION = 60 * 1000 // 60 seconds

/* =========================
   TOKEN CACHE
   ========================= */
let cachedToken: string | null = null
let tokenExpiry = 0

/* =========================
   AUTH
   ========================= */
async function getAccessToken(): Promise<string> {
  const now = Date.now()

  if (cachedToken && tokenExpiry > now + 300000) {
    return cachedToken
  }

  const client = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  })

  const credentials = await client.authorize()
  const token = credentials.access_token

  if (!token) {
    throw new Error("Failed to obtain Google Sheets access token")
  }

  cachedToken = token
  tokenExpiry = credentials.expiry_date || now + 3600000

  return token
}

/* =========================
   FETCH SHEET DATA
   ========================= */
async function fetchSheetData(range: string): Promise<any[][]> {
  const token = await getAccessToken()
  const sheetId = process.env.GOOGLE_SHEET_ID

  if (!sheetId) {
    throw new Error("GOOGLE_SHEET_ID is missing")
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}`

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error(await res.text())
  }

  const data = await res.json()
  return data.values || []
}

/* =========================
   ROW → POST
   ========================= */
function rowToPost(row: any[]): NewsPost {
  const status = String(row[13]).toUpperCase()

  const titleBase = String(row[2] || "").trim()
  const contentBase = String(row[4] || "").trim()

  const aiTitle = String(row[16] || "").trim()
  const aiContent = String(row[15] || "").trim()

  const finalTitle =
    status === "LIVE" && aiTitle ? aiTitle : titleBase

  const finalContent =
    status === "LIVE" && aiContent ? aiContent : contentBase

  return {
    id: row[0],
    title: finalTitle,
    slug: finalTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, ""),
    content: finalContent,
    category: row[6],
    publishedAt: row[8] || new Date().toISOString(),
    author: row[7],
    isFeatured:
      row[10] === true || String(row[10]).toUpperCase() === "TRUE",
  }
}

/* =========================
   INTERNAL: BUILD FULL DATASET (CACHED)
   ========================= */
async function getAllPublishedPosts(): Promise<NewsPost[]> {
  const now = Date.now()

  if (cachedPosts && now - cacheTimestamp < CACHE_DURATION) {
    return cachedPosts
  }

  const rows = await fetchSheetData("FINAL_BLOGS!A2:Q")

  const posts = rows
    .filter(row => {
      const isPublished =
        row[9] === true || String(row[9]).toUpperCase() === "TRUE"

      const status = String(row[13]).toUpperCase()

      return isPublished && (status === "LIVE" || status === "READY")
    })
    .map(rowToPost)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() -
        new Date(a.publishedAt).getTime()
    )

  cachedPosts = posts
  cacheTimestamp = now

  return posts
}

/* =========================
   PUBLIC: PAGINATED POSTS
   ========================= */
export async function getPublishedPosts(
  page = 1,
  limit = 20
): Promise<NewsPost[]> {
  const posts = await getAllPublishedPosts()
  const start = (page - 1) * limit
  return posts.slice(start, start + limit)
}

/* =========================
   SINGLE POST
   ========================= */
export async function getPostBySlug(slug: string) {
  const posts = await getAllPublishedPosts()
  return posts.find(p => p.slug === slug) || null
}

/* =========================
   CATEGORY FILTER
   ========================= */
export async function getPostsByCategory(category: string) {
  const posts = await getAllPublishedPosts()
  return posts.filter(
    p => p.category.toLowerCase() === category.toLowerCase()
  )
}

/* =========================
   CATEGORIES
   ========================= */
export async function getCategories(): Promise<Category[]> {
  const posts = await getAllPublishedPosts()
  const map = new Map<string, number>()

  posts.forEach(p => {
    map.set(p.category, (map.get(p.category) || 0) + 1)
  })

  return Array.from(map.entries()).map(([name, count]) => ({
    name,
    slug: name.toLowerCase().replace(/\s+/g, "-"),
    count,
  }))
}

/* =========================
   FEATURED
   ========================= */
export async function getFeaturedPosts() {
  const posts = await getAllPublishedPosts()
  return posts.filter(p => p.isFeatured).slice(0, 3)
}

/* =========================
   BREAKING
   ========================= */
export async function getBreakingNews() {
  const posts = await getAllPublishedPosts()
  return posts[0] || null
}

/* =========================
   SEARCH
   ========================= */
export async function searchPosts(query: string) {
  if (!query?.trim()) return []

  const q = query.trim().toLowerCase()
  const posts = await getAllPublishedPosts()

  return posts.filter(p => {
    const title = (p.title || "").toLowerCase()
    const content = (p.content || "").toLowerCase()
    const category = (p.category || "").toLowerCase()
    const author = (p.author || "").toLowerCase()

    return (
      title.includes(q) ||
      content.includes(q) ||
      category.includes(q) ||
      author.includes(q)
    )
  })
}