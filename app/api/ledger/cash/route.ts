import { type NextRequest, NextResponse } from "next/server"
import { getGstAuth } from "@/lib/redis"
import { makeEncryptedGstApiCall } from "@/lib/alankit-gst-api"

/**
 * GET /api/ledger/cash
 * Fetch Electronic Cash Ledger balance and transactions
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const gstin = searchParams.get("gstin")
    const fromDate = searchParams.get("from_date") // Format: DD-MM-YYYY
    const toDate = searchParams.get("to_date") // Format: DD-MM-YYYY

    console.log("[v0] Cash Ledger API called:", { gstin, fromDate, toDate })

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

    const result = await makeEncryptedGstApiCall("/ledgers/cashledger", payload, authToken, sek)

    if (result.success) {
      // Extract balance and transactions
      const ledgerData = result.data || {}
      const balance = {
        cgst: ledgerData.bal_cgst || 0,
        sgst: ledgerData.bal_sgst || 0,
        igst: ledgerData.bal_igst || 0,
        cess: ledgerData.bal_cess || 0,
        total:
          (ledgerData.bal_cgst || 0) +
          (ledgerData.bal_sgst || 0) +
          (ledgerData.bal_igst || 0) +
          (ledgerData.bal_cess || 0),
      }

      return NextResponse.json({
        success: true,
        data: {
          balance,
          transactions: ledgerData.transactions || [],
          raw: ledgerData,
        },
      })
    }

    return NextResponse.json({ success: false, error: result.error || "Failed to fetch cash ledger" }, { status: 400 })
  } catch (error: any) {
    console.error("[v0] Cash Ledger API error:", error)
    return NextResponse.json({ success: false, error: error.message || "Internal server error" }, { status: 500 })
  }
}
