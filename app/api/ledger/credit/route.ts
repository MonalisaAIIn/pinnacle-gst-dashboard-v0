import { type NextRequest, NextResponse } from "next/server"
import { getGstAuth } from "@/lib/redis"
import { makeEncryptedGstApiCall } from "@/lib/alankit-gst-api"

/**
 * GET /api/ledger/credit
 * Fetch Electronic Credit Ledger (ITC) balance
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const gstin = searchParams.get("gstin")
    const fromDate = searchParams.get("from_date") // Format: DD-MM-YYYY
    const toDate = searchParams.get("to_date") // Format: DD-MM-YYYY

    console.log("[v0] Credit Ledger API called:", { gstin, fromDate, toDate })

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
      ...(fromDate && { from_date: fromDate }),
      ...(toDate && { to_date: toDate }),
    }

    const result = await makeEncryptedGstApiCall("/ledgers/creditledger", payload, authToken, sek)

    if (result.success) {
      const ledgerData = result.data || {}

      // Extract ITC balance
      const itcBalance = {
        cgst: ledgerData.bal_cgst_itc || 0,
        sgst: ledgerData.bal_sgst_itc || 0,
        igst: ledgerData.bal_igst_itc || 0,
        cess: ledgerData.bal_cess_itc || 0,
        total:
          (ledgerData.bal_cgst_itc || 0) +
          (ledgerData.bal_sgst_itc || 0) +
          (ledgerData.bal_igst_itc || 0) +
          (ledgerData.bal_cess_itc || 0),
      }

      return NextResponse.json({
        success: true,
        data: {
          itcBalance,
          transactions: ledgerData.transactions || [],
          raw: ledgerData,
        },
      })
    }

    return NextResponse.json(
      { success: false, error: result.error || "Failed to fetch credit ledger" },
      { status: 400 },
    )
  } catch (error: any) {
    console.error("[v0] Credit Ledger API error:", error)
    return NextResponse.json({ success: false, error: error.message || "Internal server error" }, { status: 500 })
  }
}
