import { type NextRequest, NextResponse } from "next/server"
import { getGstAuth } from "@/lib/redis"
import { makeEncryptedGstApiCall } from "@/lib/alankit-gst-api"

/**
 * GET /api/ledger/liability
 * Fetch Tax Liability for a return period
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const gstin = searchParams.get("gstin")
    const returnPeriod = searchParams.get("return_period") // Format: MMYYYY

    console.log("[v0] Liability Ledger API called:", { gstin, returnPeriod })

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
      ...(returnPeriod && { ret_period: returnPeriod }),
    }

    const result = await makeEncryptedGstApiCall("/ledgers/liabilityledger", payload, authToken, sek)

    if (result.success) {
      const ledgerData = result.data || {}

      // Calculate total liability
      const liability = {
        cgst: ledgerData.liability_cgst || 0,
        sgst: ledgerData.liability_sgst || 0,
        igst: ledgerData.liability_igst || 0,
        cess: ledgerData.liability_cess || 0,
        interest: ledgerData.interest || 0,
        lateFee: ledgerData.late_fee || 0,
        penalty: ledgerData.penalty || 0,
        total:
          (ledgerData.liability_cgst || 0) +
          (ledgerData.liability_sgst || 0) +
          (ledgerData.liability_igst || 0) +
          (ledgerData.liability_cess || 0) +
          (ledgerData.interest || 0) +
          (ledgerData.late_fee || 0) +
          (ledgerData.penalty || 0),
      }

      // Calculate paid amounts
      const paid = {
        cgst: ledgerData.paid_cgst || 0,
        sgst: ledgerData.paid_sgst || 0,
        igst: ledgerData.paid_igst || 0,
        cess: ledgerData.paid_cess || 0,
        interest: ledgerData.paid_interest || 0,
        lateFee: ledgerData.paid_late_fee || 0,
        penalty: ledgerData.paid_penalty || 0,
        total:
          (ledgerData.paid_cgst || 0) +
          (ledgerData.paid_sgst || 0) +
          (ledgerData.paid_igst || 0) +
          (ledgerData.paid_cess || 0) +
          (ledgerData.paid_interest || 0) +
          (ledgerData.paid_late_fee || 0) +
          (ledgerData.paid_penalty || 0),
      }

      // Calculate outstanding
      const outstanding = {
        cgst: liability.cgst - paid.cgst,
        sgst: liability.sgst - paid.sgst,
        igst: liability.igst - paid.igst,
        cess: liability.cess - paid.cess,
        interest: liability.interest - paid.interest,
        lateFee: liability.lateFee - paid.lateFee,
        penalty: liability.penalty - paid.penalty,
        total: liability.total - paid.total,
      }

      return NextResponse.json({
        success: true,
        data: {
          liability,
          paid,
          outstanding,
          returnPeriod,
          raw: ledgerData,
        },
      })
    }

    return NextResponse.json(
      { success: false, error: result.error || "Failed to fetch liability ledger" },
      { status: 400 },
    )
  } catch (error: any) {
    console.error("[v0] Liability Ledger API error:", error)
    return NextResponse.json({ success: false, error: error.message || "Internal server error" }, { status: 500 })
  }
}
