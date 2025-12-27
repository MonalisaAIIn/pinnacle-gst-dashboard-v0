import { type NextRequest, NextResponse } from "next/server"
import { refreshGstToken } from "@/lib/alankit-gst-api"
import { getGstAuth, storeGstAuth } from "@/lib/redis"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { gstin } = body

    console.log("[v0] GSP Refresh Token endpoint called for GSTIN:", gstin)

    if (!gstin) {
      return NextResponse.json({ success: false, error: "GSTIN is required" }, { status: 400 })
    }

    const { authToken, sek } = await getGstAuth(gstin)

    if (!authToken) {
      return NextResponse.json(
        { success: false, error: "No active session found. Please login again." },
        { status: 401 },
      )
    }

    // Refresh token with Alankit GST API
    const result = await refreshGstToken(authToken)

    if (result.success && result.newAuthToken) {
      if (sek) {
        await storeGstAuth(gstin, result.newAuthToken, sek)
      }

      console.log("[v0] GST auth token refreshed for GSTIN:", gstin)

      return NextResponse.json({
        success: true,
        message: "Token refreshed successfully",
      })
    }

    return NextResponse.json({ success: false, error: result.error || "Failed to refresh token" }, { status: 400 })
  } catch (error: any) {
    console.error("[v0] GSP Refresh Token error:", error)
    return NextResponse.json({ success: false, error: error.message || "Internal server error" }, { status: 500 })
  }
}
