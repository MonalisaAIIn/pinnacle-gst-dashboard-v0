import { type NextRequest, NextResponse } from "next/server"

/**
 * GET /api/public/gstin/verify
 * Verify GSTIN validity (Public API - no authentication required)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const gstin = searchParams.get("gstin")

    console.log("[v0] GSTIN Verification API called:", { gstin })

    if (!gstin || gstin.length !== 15) {
      return NextResponse.json({ success: false, error: "Valid 15-character GSTIN is required" }, { status: 400 })
    }

    // Call GST Public API (no encryption needed)
    const ALANKIT_API_BASE = process.env.GSP_BASE_URL || "https://uatapi.alankitgst.com/taxpayerapi/v1.0"
    const SUBSCRIPTION_KEY = process.env.ALANKIT_SUBSCRIPTION_KEY || ""

    const response = await fetch(`${ALANKIT_API_BASE}/search?gstin=${gstin}`, {
      headers: {
        "Ocp-Apim-Subscription-Key": SUBSCRIPTION_KEY,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to verify GSTIN")
    }

    const data = await response.json()

    if (data.status_cd === "1" && data.data) {
      const gstinData = data.data

      return NextResponse.json({
        success: true,
        data: {
          gstin: gstinData.gstin,
          legalName: gstinData.lgnm || gstinData.legal_name,
          tradeName: gstinData.tradeNam || gstinData.trade_name,
          registrationDate: gstinData.rgdt || gstinData.registration_date,
          constitutionOfBusiness: gstinData.ctb || gstinData.constitution,
          taxpayerType: gstinData.dty || gstinData.taxpayer_type,
          status: gstinData.sts || gstinData.status,
          lastUpdated: gstinData.lstupdt || gstinData.last_updated,
          stateCode: gstin.substring(0, 2),
          panNumber: gstin.substring(2, 12),
          entityCode: gstin.substring(12, 13),
          checksum: gstin.substring(14, 15),
        },
      })
    }

    return NextResponse.json(
      { success: false, error: data.error?.message || "GSTIN not found or invalid" },
      { status: 404 },
    )
  } catch (error: any) {
    console.error("[v0] GSTIN Verification API error:", error)
    return NextResponse.json({ success: false, error: error.message || "Internal server error" }, { status: 500 })
  }
}
