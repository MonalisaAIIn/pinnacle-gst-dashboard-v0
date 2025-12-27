import { type NextRequest, NextResponse } from "next/server"
import { getGstAuth } from "@/lib/redis"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { gstin } = body

    console.log("[v0] Checking GST connection for GSTIN:", gstin)

    if (!gstin) {
      return NextResponse.json({ success: false, error: "GSTIN is required" }, { status: 400 })
    }

    const { authToken, sek } = await getGstAuth(gstin)

    if (authToken && sek) {
      return NextResponse.json({
        success: true,
        connected: true,
        message: "GSTIN is connected",
      })
    }

    return NextResponse.json({
      success: true,
      connected: false,
      message: "GSTIN is not connected",
    })
  } catch (error: any) {
    console.error("[v0] Check GST connection error:", error)
    return NextResponse.json({ success: false, error: error.message || "Internal server error" }, { status: 500 })
  }
}
