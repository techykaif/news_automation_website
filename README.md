# AutoBrief — News Automation Website

AutoBrief is a Next.js + TypeScript news aggregation site that reads content from a Google Sheet and serves both a website and simple JSON APIs. The project includes a simple "AI gating" rule where AI-generated fields from the sheet are used only when a post's processing status is `LIVE`.

This README covers:
- Getting started (install & run)
- Google Sheets + Service Account setup (required env vars)
- API reference with examples
- Data model and Google Sheets schema
- Project structure and development notes
- Troubleshooting and deployment tips

---

## Quick Start

1. Clone the repo
   ```bash
   git clone https://github.com/techykaif/news_automation_website.git
   cd news_automation_website
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   # pnpm install
   ```

3. Create a `.env.local` file (see next section for required variables).

4. Run the dev server
   ```bash
   npm run dev
   ```
   The app runs at http://localhost:3000 by default.

5. Build & start (production)
   ```bash
   npm run build
   npm run start
   ```

6. Lint
   ```bash
   npm run lint
   ```

---

## Environment Variables (Google Sheets)

This app reads news content from a Google Sheet. You must create a Google Cloud service account with the `https://www.googleapis.com/auth/spreadsheets.readonly` scope and give it read access to the target sheet.

Required environment variables (set in `.env.local`):
```
GOOGLE_SERVICE_ACCOUNT_EMAIL=service-account@example.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkq...
-----END PRIVATE KEY-----
"
GOOGLE_SHEET_ID=1aBcD...yourSheetId...XYZ
```

Notes:
- The code replaces `\
` with `
`, so when pasting the key into `.env.local` you can either keep real newlines or escape them as `\
`. Common approach:
  - If you paste the JSON private key value directly, ensure newlines appear as `
` escape sequences OR configure your environment to preserve newlines (some hosts expect escaped newlines).
- Share the Google Sheet with the service account email (give Viewer permissions).
- Ensure the service account has the Sheets API enabled in the Google Cloud project.

Troubleshooting common auth errors are covered later.

---

## API Reference

All endpoints are server-side routes under `/api/*`. The APIs return JSON and set cache headers in many responses.

Base URL (local):
```
http://localhost:3000
```

1. GET /api/news
- Description: Get all published posts, optionally filter by category and/or limit results.
- Query params:
  - `category` (optional) — filter by category slug/name
  - `limit` (optional) — integer limit of results
- Examples:
  ```bash
  # all news
  curl http://localhost:3000/api/news

  # limit results
  curl "http://localhost:3000/api/news?limit=5"

  # filter by category
  curl "http://localhost:3000/api/news?category=technology"
  ```

2. GET /api/post
- Description: Get a single post by slug.
- Query params:
  - `slug` (required)
- Examples:
  ```bash
  curl "http://localhost:3000/api/post?slug=example-slug"
  ```

3. GET /api/categories
- Description: Returns aggregated categories and counts.
- Example:
  ```bash
  curl http://localhost:3000/api/categories
  ```

4. GET /api/search
- Description: Search published posts by query string.
- Query params:
  - `q` (required) — search query
  - `limit` (optional) — integer limit of results
- Example:
  ```bash
  curl "http://localhost:3000/api/search?q=electric%20vehicle&limit=10"
  ```

5. GET /api/health
- Description: Health check endpoint returning status, timestamp, and version.
- Example:
  ```bash
  curl http://localhost:3000/api/health
  ```

Example response shape (NewsPost):
```json
{
  "id": "123",
  "title": "Final Title",
  "slug": "final-title",
  "content": "Full article content or AI-generated content",
  "category": "Technology",
  "publishedAt": "2025-01-01T12:00:00.000Z",
  "author": "Author Name",
  "isFeatured": true
}
```

The type definitions are in `lib/types.ts` (NewsPost, Category, HealthResponse).

---

## Google Sheets Schema & Data Flow

The code expects a sheet named `FINAL_BLOGS` with columns starting from A (0-based indices documented in code). The mapping in `lib/google-sheets.ts`:

Index → Column meaning
- 0: id
- 1: source_id
- 2: title
- 3: slug
- 4: content_base
- 5: summary_base
- 6: category
- 7: author
- 8: published_at
- 9: is_published
- 10: is_featured
- 11: seo_title_base
- 12: seo_description_base
- 13: processing_status
- 14: ai_summary
- 15: ai_content
- 16: ai_seo_title

Important behaviors implemented in `lib/google-sheets.ts`:
- Token caching for Google access token (cachedToken + tokenExpiry).
- fetchSheetData uses the Sheets REST API with read-only scope.
- rowToPost enforces an "AI gate":
  - If `processing_status` (column 13) is `"LIVE"` and AI fields exist (e.g., ai_content at index 15), the final title/content prefer AI-generated values.
  - Otherwise uses base title/content from columns 2 and 4.
- getPublishedPosts filters rows where `is_published` (index 9) is truthy AND `processing_status` is `"LIVE"`; also accepts `READY` posts as a fallback when `is_published` is set.
- Slugs are derived from the finalTitle (lowercased and sanitized).
- getFeaturedPosts returns up to 3 posts flagged as isFeatured.
- searchPosts performs a case-insensitive substring search across title, content, category, and author.

If you modify the sheet structure, update the mapping here accordingly.

---

## Project Structure (high level)

- app/
  - page.tsx — homepage (fetches posts, categories, featured)
  - api/
    - news/route.ts
    - post/route.ts
    - categories/route.ts
    - search/route.ts
    - health/route.ts
  - layout.tsx — root layout, theme provider, header/footer
  - globals.css — Tailwind CSS entry + theme variables
- components/ — UI components used by pages (Card, Header, Footer, NewsCard, etc.)
- lib/
  - google-sheets.ts — core integration with Google Sheets
  - types.ts — central TS types
  - utils.ts — small helpers
- hooks/ — UI hooks
- public/ — static assets and placeholder images

Notes:
- The app uses Next.js App Router (app directory).
- `app/page.tsx` exports `revalidate = 60` for ISR (revalidate every 60 seconds).
- API routes set cache-control headers (s-maxage/stale-while-revalidate in many endpoints).

---

## Development Notes

- Next.js: v16 (app router)
- React: v19
- TypeScript: configured in tsconfig.json with path alias `@/* -> ./*`
  - Your IDE should support TypeScript path mapping; in VSCode, add the `jsconfig.json` or use the recommended settings to resolve imports.
- TailwindCSS: configured via `globals.css` (Tailwind v4 plugin entries appear in package.json)
- Images: `next.config.mjs` sets `images.unoptimized = true` — images are served as-is
- TypeScript build: `next.config.mjs` sets `typescript.ignoreBuildErrors = true` (be cautious — this allows builds to succeed even when TS errors exist)

Helpful dev commands:
- Start dev server: `npm run dev`
- Build: `npm run build`
- Start production server after build: `npm run start`
- Lint: `npm run lint`

---

## Troubleshooting

1. 401 / 403 when fetching Sheets
   - Ensure `GOOGLE_SERVICE_ACCOUNT_EMAIL` matches the service account and the Google Sheet is shared with that email (Viewer).
   - Ensure the Sheets API is enabled in the service account's GCP project.
   - Confirm the private key is correct and newline escapes are handled properly (replace `\
` with `
` if needed).

2. "GOOGLE_SHEET_ID is missing"
   - Set `GOOGLE_SHEET_ID` in your environment; this is the long id from the sheet URL:
     - Example: `https://docs.google.com/spreadsheets/d/<GOOGLE_SHEET_ID>/edit#gid=0`

3. Empty results
   - Confirm sheet rows exist under `FINAL_BLOGS!A2:Q`.
   - Check `is_published` and `processing_status` values (`TRUE`, `LIVE`, `READY`) for expected rows.

4. Slug generation unusual characters
   - Slugs are generated from final title (lowercased, non-alphanumeric replaced with `-`). If you prefer a custom slug, populate column index 3 (slug) in the sheet and adapt rowToPost to use it.

---

## Suggested Improvements & Next Steps

- Add unit/integration tests for lib/google-sheets and API routes.
- Add CI (GitHub Actions) to run lint and tests on push.
- Dockerfile for containerized builds (useful for non-Vercel deployments).
- Add pagination & sorting to /api/news.
- Add auth for dashboard pages that manage the sheet (or a backend that writes back to Sheets).
- Move sensitive configuration to a secrets management solution in production (e.g., Vercel Environment Variables, AWS Secrets Manager).

---

## Deployment

Recommended: Vercel (native for Next.js).
- Make sure to set environment variables in the Vercel project settings.
- Remember to share the Google Sheet with the service account email (same as in `.env`).
- If you deploy to other platforms, ensure network access and env variables are set, and the Sheets API is reachable.

Cache & CDN:
- API routes use s-maxage and stale-while-revalidate; tune values based on how fresh your data must be.

---

## Where to Look Next (entry points for contributors)

- lib/google-sheets.ts — Google Sheets integration & data transformations
- lib/types.ts — canonical data types for API and UI
- app/api/* — API surface (news, post, categories, search, health)
- app/page.tsx and components/* — UI and layout

---

If you'd like, I can:
- Add example unit tests for the Google Sheets functions.
- Create a sample `.github/workflows/ci.yml` for linting and tests.
- Generate a Dockerfile and docker-compose for local testing.

Happy to expand any section or add code examples for contributors or maintainers.