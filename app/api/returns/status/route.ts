import { type NextRequest, NextResponse } from "next/server"
import { getGstAuth } from "@/lib/redis"
import { makeEncryptedGstApiCall } from "@/lib/alankit-gst-api"

/**
 * GET /api/returns/status
 * Fetch filing status for all return types
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const gstin = searchParams.get("gstin")
    const returnPeriod = searchParams.get("return_period") // Format: MMYYYY

    console.log("[v0] Returns status API called:", { gstin, returnPeriod })

    if (!gstin) {
      return NextResponse.json({ success: false, error: "GSTIN is required" }, { status: 400 })
    }

    // Get auth token and SEK from Redis
    const { authToken, sek } = await getGstAuth(gstin)

    if (!authToken || !sek) {
      return NextResponse.json(
        { success: false, error: "GSTIN not connected. Please authenticate first." },
        { status: 401 },
      )
    }

    // Call GST API to get return status
    const payload = {
      gstin: gstin,
      ...(returnPeriod && { ret_period: returnPeriod }),
    }

    const result = await makeEncryptedGstApiCall("/returns/trackstatus", payload, authToken, sek)

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data,
      })
    }

    return NextResponse.json(
      { success: false, error: result.error || "Failed to fetch return status" },
      { status: 400 },
    )
  } catch (error: any) {
    console.error("[v0] Returns status API error:", error)
    return NextResponse.json({ success: false, error: error.message || "Internal server error" }, { status: 500 })
  }
}
