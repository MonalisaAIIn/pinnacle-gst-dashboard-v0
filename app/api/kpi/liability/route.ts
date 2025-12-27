import { type NextRequest, NextResponse } from "next/server"
import { getGstAuth } from "@/lib/redis"
import { makeEncryptedGstApiCall } from "@/lib/alankit-gst-api"
import { calculateLiability } from "@/lib/kpi-calculator"

/**
 * GET /api/kpi/liability
 * Tax liability and outstanding dues KPIs
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const gstin = searchParams.get("gstin")
    const returnPeriod = searchParams.get("return_period") // Format: MMYYYY

    console.log("[v0] Liability KPI API called:", { gstin, returnPeriod })

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

    // Fetch liability ledger
    const liabilityResult = await makeEncryptedGstApiCall(
      "/ledgers/liabilityledger",
      { gstin, ret_period: returnPeriod },
      authToken,
      sek,
    )

    if (!liabilityResult.success) {
      return NextResponse.json({ success: false, error: "Failed to fetch liability data" }, { status: 400 })
    }

    const liabilityKPI = calculateLiability(liabilityResult.data || {})

    return NextResponse.json({
      success: true,
      data: {
        period: returnPeriod,
        liability: liabilityKPI.liability,
        paid: liabilityKPI.paid,
        outstanding: liabilityKPI.outstanding,
        additionalDues: {
          interest: liabilityKPI.interest,
          lateFee: liabilityKPI.lateFee,
          penalty: liabilityKPI.penalty,
        },
        totalOutstanding: liabilityKPI.totalOutstanding,
        status: liabilityKPI.totalOutstanding > 0 ? "Payment Due" : "Cleared",
      },
    })
  } catch (error: any) {
    console.error("[v0] Liability KPI API error:", error)
    return NextResponse.json({ success: false, error: error.message || "Internal server error" }, { status: 500 })
  }
}
