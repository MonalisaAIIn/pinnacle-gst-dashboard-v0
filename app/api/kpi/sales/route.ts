import { type NextRequest, NextResponse } from "next/server"
import { getGstAuth } from "@/lib/redis"
import { makeEncryptedGstApiCall } from "@/lib/alankit-gst-api"
import { calculateTotalSales, generateSalesTrend } from "@/lib/kpi-calculator"

/**
 * GET /api/kpi/sales
 * Sales KPIs with period trends
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const gstin = searchParams.get("gstin")
    const returnPeriod = searchParams.get("return_period") // Format: MMYYYY
    const includeTrend = searchParams.get("include_trend") === "true"
    const trendPeriods = searchParams.get("trend_periods")?.split(",") || []

    console.log("[v0] Sales KPI API called:", { gstin, returnPeriod, includeTrend })

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

    // Fetch GSTR-1 for current period
    const gstr1Result = await makeEncryptedGstApiCall(
      "/returns/gstr1",
      { gstin, ret_period: returnPeriod },
      authToken,
      sek,
    )

    if (!gstr1Result.success) {
      return NextResponse.json({ success: false, error: "Failed to fetch GSTR-1 data" }, { status: 400 })
    }

    const salesKPI = calculateTotalSales(gstr1Result.data || {})

    const response: any = {
      success: true,
      data: {
        period: returnPeriod,
        totalSales: salesKPI.totalSales,
        b2bSales: salesKPI.b2bSales,
        b2cSales: salesKPI.b2cSales,
        exportSales: salesKPI.exportSales,
        gstCollected: salesKPI.gstCollected,
      },
    }

    // Include trend if requested
    if (includeTrend && trendPeriods.length > 0) {
      const trendData: Record<string, any> = {}

      for (const period of trendPeriods) {
        const result = await makeEncryptedGstApiCall("/returns/gstr1", { gstin, ret_period: period }, authToken, sek)
        if (result.success) {
          trendData[period] = result.data || {}
        }
      }

      response.data.trend = generateSalesTrend(trendData)
    }

    return NextResponse.json(response)
  } catch (error: any) {
    console.error("[v0] Sales KPI API error:", error)
    return NextResponse.json({ success: false, error: error.message || "Internal server error" }, { status: 500 })
  }
}
