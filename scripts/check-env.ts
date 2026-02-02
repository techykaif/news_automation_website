import "dotenv/config"

console.log("GOOGLE_PRIVATE_KEY exists:", !!process.env.GOOGLE_PRIVATE_KEY)
console.log("SERVICE_ACCOUNT_EMAIL exists:", !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL)
console.log("SHEET_ID exists:", !!process.env.GOOGLE_SHEET_ID)
