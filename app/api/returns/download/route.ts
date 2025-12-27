import { type NextRequest, NextResponse } from "next/server"
import { getGstAuth } from "@/lib/redis"
import { makeEncryptedGstApiCall } from "@/lib/alankit-gst-api"

/**
 * GET /api/returns/download
 * Download filed return JSON
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const gstin = searchParams.get("gstin")
    const returnPeriod = searchParams.get("return_period") // Format: MMYYYY
    const returnType = searchParams.get("return_type") // GSTR1, GSTR3B, etc.

    console.log("[v0] Returns download API called:", { gstin, returnPeriod, returnType })

    if (!gstin || !returnPeriod || !returnType) {
      return NextResponse.json(
        { success: false, error: "GSTIN, return_period, and return_type are required" },
        { status: 400 },
      )
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
      rtn_typ: returnType.toUpperCase(),
    }

    const result = await makeEncryptedGstApiCall("/returns/file", payload, authToken, sek)

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data,
      })
    }

    return NextResponse.json({ success: false, error: result.error || "Failed to download return" }, { status: 400 })
  } catch (error: any) {
    console.error("[v0] Returns download API error:", error)
    return NextResponse.json({ success: false, error: error.message || "Internal server error" }, { status: 500 })
  }
}
