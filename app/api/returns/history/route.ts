import { type NextRequest, NextResponse } from "next/server"
import { getGstAuth } from "@/lib/redis"
import { makeEncryptedGstApiCall } from "@/lib/alankit-gst-api"

/**
 * GET /api/returns/history
 * Fetch filing history for a GSTIN
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const gstin = searchParams.get("gstin")
    const fromPeriod = searchParams.get("from_period") // Format: MMYYYY
    const toPeriod = searchParams.get("to_period") // Format: MMYYYY

    console.log("[v0] Returns history API called:", { gstin, fromPeriod, toPeriod })

    if (!gstin) {
      return NextResponse.json({ success: false, error: "GSTIN is required" }, { status: 400 })
    }

    const { authToken, sek } = await getGstAuth(gstin)

    if (!authToken || !sek) {
      return NextResponse.json(
        { success: false, error: "GSTIN not connected. Please authenticate first." },
        { status: 401 },
      )
    }

    const payload = {
      gstin: gstin,
      ...(fromPeriod && { fy: fromPeriod }),
      ...(toPeriod && { to_period: toPeriod }),
    }

    const result = await makeEncryptedGstApiCall("/returns/filinghistory", payload, authToken, sek)

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data,
      })
    }

    return NextResponse.json(
      { success: false, error: result.error || "Failed to fetch filing history" },
      { status: 400 },
    )
  } catch (error: any) {
    console.error("[v0] Returns history API error:", error)
    return NextResponse.json({ success: false, error: error.message || "Internal server error" }, { status: 500 })
  }
}
