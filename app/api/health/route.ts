import { NextResponse } from "next/server"
import type { HealthResponse } from "@/lib/types"

export async function GET() {
  try {
    return NextResponse.json(
      {
        status: "OK",
        timestamp: new Date().toISOString(),
        version: "1.0.0",
      },
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      }
    )
  } catch (error) {
    return NextResponse.json(
      {
        status: "DOWN",
        timestamp: new Date().toISOString(),
        version: "1.0.0",
      },
      { status: 500 }
    )
  }
}
