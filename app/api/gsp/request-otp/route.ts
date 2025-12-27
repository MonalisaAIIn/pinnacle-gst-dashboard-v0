import { type NextRequest, NextResponse } from "next/server"
import { requestGstOtp } from "@/lib/alankit-gst-api"
import { storeGstSession } from "@/lib/redis"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { gstin } = body

    console.log("[v0] GSP Request OTP endpoint called for GSTIN:", gstin)

    if (!gstin || gstin.length !== 15) {
      return NextResponse.json({ success: false, error: "Invalid GSTIN format" }, { status: 400 })
    }

    const result = await requestGstOtp(gstin)

    if (result.success && result.appKey) {
      // Store AppKey temporarily in Redis (needed for OTP verification)
      await storeGstSession(gstin, result.appKey)

      return NextResponse.json({
        success: true,
        message: "OTP sent to registered mobile and email",
      })
    }

    return NextResponse.json({ success: false, error: result.error || "Failed to send OTP" }, { status: 400 })
  } catch (error: any) {
    console.error("[v0] GSP Request OTP error:", error)
    return NextResponse.json({ success: false, error: error.message || "Internal server error" }, { status: 500 })
  }
}
