import { type NextRequest, NextResponse } from "next/server"
import { getGstAuth } from "@/lib/redis"
import { makeEncryptedGstApiCall } from "@/lib/alankit-gst-api"
import { calculateReturnsStatus } from "@/lib/kpi-calculator"

/**
 * GET /api/kpi/compliance
 * Compliance KPIs - filing status and history
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const gstin = searchParams.get("gstin")

    console.log("[v0] Compliance KPI API called:", { gstin })

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

    // Fetch return status and filing history
    const [statusResult, historyResult] = await Promise.allSettled([
      makeEncryptedGstApiCall("/returns/trackstatus", { gstin }, authToken, sek),
      makeEncryptedGstApiCall("/returns/filinghistory", { gstin }, authToken, sek),
    ])

    const returnStatuses =
      statusResult.status === "fulfilled" && statusResult.value.success ? statusResult.value.data || [] : []
    const filingHistory =
      historyResult.status === "fulfilled" && historyResult.value.success ? historyResult.value.data || [] : []

    const complianceStatus = calculateReturnsStatus(Array.isArray(returnStatuses) ? returnStatuses : [])

    return NextResponse.json({
      success: true,
      data: {
        returns: {
          filed: complianceStatus.filed,
          pending: complianceStatus.pending,
          notDue: complianceStatus.notDue,
          total: complianceStatus.total,
          filingRate: complianceStatus.filingRate,
        },
        history: Array.isArray(filingHistory) ? filingHistory : [],
        complianceStatus:
          complianceStatus.filingRate >= 90
            ? "Good"
            : complianceStatus.filingRate >= 70
              ? "Average"
              : "Needs Attention",
      },
    })
  } catch (error: any) {
    console.error("[v0] Compliance KPI API error:", error)
    return NextResponse.json({ success: false, error: error.message || "Internal server error" }, { status: 500 })
  }
}
