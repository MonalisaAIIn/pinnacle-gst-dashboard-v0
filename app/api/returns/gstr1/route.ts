import { type NextRequest, NextResponse } from "next/server"
import { getGstAuth } from "@/lib/redis"
import { makeEncryptedGstApiCall } from "@/lib/alankit-gst-api"

/**
 * GET /api/returns/gstr1
 * Fetch GSTR-1 data (outward supplies)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const gstin = searchParams.get("gstin")
    const returnPeriod = searchParams.get("return_period") // Format: MMYYYY

    console.log("[v0] GSTR-1 API called:", { gstin, returnPeriod })

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

    const result = await makeEncryptedGstApiCall("/returns/gstr1", payload, authToken, sek)

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data,
      })
    }

    return NextResponse.json({ success: false, error: result.error || "Failed to fetch GSTR-1 data" }, { status: 400 })
  } catch (error: any) {
    console.error("[v0] GSTR-1 API error:", error)
    return NextResponse.json({ success: false, error: error.message || "Internal server error" }, { status: 500 })
  }
}
