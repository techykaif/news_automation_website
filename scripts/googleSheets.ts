import { JWT } from "google-auth-library"

let cachedToken: string | null = null
let tokenExpiry = 0

export async function getWriteAccessToken(): Promise<string> {
  const now = Date.now()

  if (cachedToken && tokenExpiry > now + 300000) {
    return cachedToken
  }

  const client = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  })

  const credentials = await client.authorize()
  if (!credentials.access_token) {
    throw new Error("Failed to get Sheets access token")
  }

  cachedToken = credentials.access_token
  tokenExpiry = credentials.expiry_date || now + 3600000

  return cachedToken
}
