import { type NextRequest, NextResponse } from "next/server"
import { getGstAuth } from "@/lib/redis"
import { makeEncryptedGstApiCall } from "@/lib/alankit-gst-api"
import { calculateDashboardKPIs, type DashboardKPIs } from "@/lib/kpi-calculator"

/**
 * GET /api/kpi/overview
 * Aggregate KPIs for dashboard overview
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const gstin = searchParams.get("gstin")
    const returnPeriod = searchParams.get("return_period") // Format: MMYYYY

    console.log("[v0] KPI Overview API called:", { gstin, returnPeriod })

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

    // Fetch all required data in parallel
    const [gstr1Result, gstr2bResult, gstr3bResult, cashResult, creditResult, liabilityResult, statusResult] =
      await Promise.allSettled([
        makeEncryptedGstApiCall("/returns/gstr1", { gstin, ret_period: returnPeriod }, authToken, sek),
        makeEncryptedGstApiCall("/returns/gstr2b", { gstin, ret_period: returnPeriod }, authToken, sek),
        makeEncryptedGstApiCall("/returns/gstr3b", { gstin, ret_period: returnPeriod }, authToken, sek),
        makeEncryptedGstApiCall("/ledgers/cashledger", { gstin }, authToken, sek),
        makeEncryptedGstApiCall("/ledgers/creditledger", { gstin }, authToken, sek),
        makeEncryptedGstApiCall("/ledgers/liabilityledger", { gstin, ret_period: returnPeriod }, authToken, sek),
        makeEncryptedGstApiCall("/returns/trackstatus", { gstin }, authToken, sek),
      ])

    // Extract data with fallbacks
    const gstr1Data =
      gstr1Result.status === "fulfilled" && gstr1Result.value.success ? gstr1Result.value.data || {} : {}
    const gstr2bData =
      gstr2bResult.status === "fulfilled" && gstr2bResult.value.success ? gstr2bResult.value.data || {} : {}
    const gstr3bData =
      gstr3bResult.status === "fulfilled" && gstr3bResult.value.success ? gstr3bResult.value.data || {} : {}
    const cashLedger = cashResult.status === "fulfilled" && cashResult.value.success ? cashResult.value.data || {} : {}
    const creditLedger =
      creditResult.status === "fulfilled" && creditResult.value.success ? creditResult.value.data || {} : {}
    const liabilityLedger =
      liabilityResult.status === "fulfilled" && liabilityResult.value.success ? liabilityResult.value.data || {} : {}
    const returnStatuses =
      statusResult.status === "fulfilled" && statusResult.value.success ? statusResult.value.data || [] : []

    // Calculate KPIs
    const kpis: DashboardKPIs = calculateDashboardKPIs(
      gstr1Data,
      gstr2bData,
      gstr3bData,
      cashLedger,
      creditLedger,
      liabilityLedger,
      Array.isArray(returnStatuses) ? returnStatuses : [],
    )

    return NextResponse.json({
      success: true,
      data: kpis,
      period: returnPeriod,
      gstin,
    })
  } catch (error: any) {
    console.error("[v0] KPI Overview API error:", error)
    return NextResponse.json({ success: false, error: error.message || "Internal server error" }, { status: 500 })
  }
}
