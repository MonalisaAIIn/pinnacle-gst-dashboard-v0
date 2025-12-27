import { type NextRequest, NextResponse } from "next/server"
import { getGstAuth } from "@/lib/redis"
import { makeEncryptedGstApiCall } from "@/lib/alankit-gst-api"

/**
 * GET /api/returns/gstr2a
 * Fetch GSTR-2A data (auto-populated inward supplies)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const gstin = searchParams.get("gstin")
    const returnPeriod = searchParams.get("return_period") // Format: MMYYYY

    console.log("[v0] GSTR-2A API called:", { gstin, returnPeriod })

    if (!gstin || !returnPeriod) {
      return NextResponse.json({ success: false, error: "GSTIN and return_period are required" }, { status: 400 })
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
      ret_period: returnPeriod,
    }

    const result = await makeEncryptedGstApiCall("/returns/gstr2a", payload, authToken, sek)

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data,
      })
    }

    return NextResponse.json({ success: false, error: result.error || "Failed to fetch GSTR-2A data" }, { status: 400 })
  } catch (error: any) {
    console.error("[v0] GSTR-2A API error:", error)
    return NextResponse.json({ success: false, error: error.message || "Internal server error" }, { status: 500 })
  }
}
