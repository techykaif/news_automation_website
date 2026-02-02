import "dotenv/config"
import Parser from "rss-parser"
import { getWriteAccessToken } from "../googleSheets"

const parser = new Parser()
const SHEET_ID = process.env.GOOGLE_SHEET_ID!

/* =========================
   ID HELPERS
   ========================= */

function getTodayPrefix() {
  return new Date().toISOString().slice(0, 10).replace(/-/g, "")
}

function generateNextId(lastId?: string) {
  const today = getTodayPrefix()

  if (!lastId || !lastId.startsWith(today)) {
    return `${today}-001`
  }

  const lastSerial = parseInt(lastId.split("-")[1], 10)
  return `${today}-${String(lastSerial + 1).padStart(3, "0")}`
}

/* =========================
   SHEETS
   ========================= */

async function fetchSheet(range: string): Promise<any[][]> {
  const token = await getWriteAccessToken()

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(range)}`,
    { headers: { Authorization: `Bearer ${token}` } }
  )

  if (!res.ok) throw new Error(await res.text())
  const data = await res.json()
  return data.values || []
}

async function appendRows(rows: any[][]) {
  // 🛡 FINAL SAFETY FILTER (never insert broken rows)
  const cleanRows = rows.filter(
    r =>
      typeof r[2] === "string" &&
      r[2].trim().length >= 5 && // title
      typeof r[3] === "string" &&
      r[3].startsWith("http") // url
  )

  if (!cleanRows.length) {
    console.log("⚠️ No valid rows to insert")
    return
  }

  const token = await getWriteAccessToken()

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/RAW_NEWS!A:H:append?valueInputOption=USER_ENTERED`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values: cleanRows }),
    }
  )

  console.log("🟢 Rows inserted:", cleanRows.length, "| Status:", res.status)
}

/* =========================
   MAIN
   ========================= */

export async function runRssScraper() {
  console.log("🚀 RSS scraper started")

  const sources = await fetchSheet("SOURCES!A2:E")
  const existingUrls = new Set(
    (await fetchSheet("RAW_NEWS!D2:D")).flat().map(v => String(v).trim())
  )

  const idRows = await fetchSheet("RAW_NEWS!A2:A")
  let lastId =
    idRows.length > 0
      ? String(idRows[idRows.length - 1][0]).trim()
      : undefined

  const rowsToInsert: any[][] = []

  for (const row of sources) {
    const [_, sourceName, rssUrl, category, enabled] = row.map(v =>
      String(v || "").trim()
    )

    if (enabled.toUpperCase() !== "TRUE") continue

    try {
      const feed = await parser.parseURL(rssUrl)

      for (const item of feed.items.slice(0, 5)) {
        const title =
          typeof item.title === "string"
            ? item.title.trim()
            : ""

        const link =
          typeof item.link === "string"
            ? item.link.trim()
            : ""

        const content =
          typeof item.contentSnippet === "string"
            ? item.contentSnippet.trim()
            : ""

        // 🚫 HARD RULES (URL-only items die here)
        if (title.length < 5) continue
        if (!link.startsWith("http")) continue
        if (existingUrls.has(link)) continue

        const newId = generateNextId(lastId)
        lastId = newId

        rowsToInsert.push([
          newId,
          sourceName,
          title,
          link,
          content,
          category,
          new Date().toISOString(),
          "NEW",
        ])

        existingUrls.add(link)
      }
    } catch (err) {
      console.error(`❌ Failed RSS: ${sourceName}`, err)
    }
  }

  await appendRows(rowsToInsert)
  console.log("🏁 RSS scraper finished")
}

runRssScraper()
