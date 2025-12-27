import { type NextRequest, NextResponse } from "next/server"
import { getGstAuth } from "@/lib/redis"
import { makeEncryptedGstApiCall } from "@/lib/alankit-gst-api"
import {
  calculateITCAvailable,
  calculateITCClaimed,
  calculateITCMismatch,
  generateITCTrend,
} from "@/lib/kpi-calculator"

/**
 * GET /api/kpi/itc
 * ITC KPIs with mismatch analysis
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const gstin = searchParams.get("gstin")
    const returnPeriod = searchParams.get("return_period") // Format: MMYYYY
    const includeTrend = searchParams.get("include_trend") === "true"
    const trendPeriods = searchParams.get("trend_periods")?.split(",") || []

    console.log("[v0] ITC KPI API called:", { gstin, returnPeriod, includeTrend })

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

    // Fetch GSTR-2B and GSTR-3B in parallel
    const [gstr2bResult, gstr3bResult] = await Promise.allSettled([
      makeEncryptedGstApiCall("/returns/gstr2b", { gstin, ret_period: returnPeriod }, authToken, sek),
      makeEncryptedGstApiCall("/returns/gstr3b", { gstin, ret_period: returnPeriod }, authToken, sek),
    ])

    const gstr2bData =
      gstr2bResult.status === "fulfilled" && gstr2bResult.value.success ? gstr2bResult.value.data || {} : {}
    const gstr3bData =
      gstr3bResult.status === "fulfilled" && gstr3bResult.value.success ? gstr3bResult.value.data || {} : {}

    const itcAvailable = calculateITCAvailable(gstr2bData)
    const itcClaimed = calculateITCClaimed(gstr3bData)
    const itcMismatch = calculateITCMismatch(gstr2bData, gstr3bData)

    const response: any = {
      success: true,
      data: {
        period: returnPeriod,
        available: itcAvailable,
        claimed: itcClaimed,
        mismatch: {
          amount: itcMismatch,
          percentage: itcMismatch.percentageDiff,
          status: Math.abs(itcMismatch.percentageDiff) > 5 ? "Alert" : "Normal",
        },
      },
    }

    // Include trend if requested
    if (includeTrend && trendPeriods.length > 0) {
      const trendData: Record<string, any> = {}

      for (const period of trendPeriods) {
        const result = await makeEncryptedGstApiCall("/returns/gstr2b", { gstin, ret_period: period }, authToken, sek)
        if (result.success) {
          trendData[period] = result.data || {}
        }
      }

      response.data.trend = generateITCTrend(trendData)
    }

    return NextResponse.json(response)
  } catch (error: any) {
    console.error("[v0] ITC KPI API error:", error)
    return NextResponse.json({ success: false, error: error.message || "Internal server error" }, { status: 500 })
  }
}
