import { type NextRequest, NextResponse } from "next/server"
import { verifyGstOtp } from "@/lib/alankit-gst-api"
import { getGstSession, storeGstAuth, deleteGstSession } from "@/lib/redis"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { gstin, otp } = body

    console.log("[v0] GSP Verify OTP endpoint called for GSTIN:", gstin)

    if (!gstin || !otp) {
      return NextResponse.json({ success: false, error: "GSTIN and OTP are required" }, { status: 400 })
    }

    const appKey = await getGstSession(gstin)

    if (!appKey) {
      return NextResponse.json({ success: false, error: "Session expired. Please request OTP again." }, { status: 400 })
    }

    const result = await verifyGstOtp(gstin, otp, appKey)

    if (result.success && result.authToken && result.sek) {
      // Store auth token and SEK in Redis
      await storeGstAuth(gstin, result.authToken, result.sek)

      // Clean up temporary session
      await deleteGstSession(gstin)

      console.log("[v0] GST auth token and SEK stored for GSTIN:", gstin)

      return NextResponse.json({
        success: true,
        message: "GSTIN verified and connected successfully",
      })
    }

    return NextResponse.json({ success: false, error: result.error || "Invalid OTP" }, { status: 400 })
  } catch (error: any) {
    console.error("[v0] GSP Verify OTP error:", error)
    return NextResponse.json({ success: false, error: error.message || "Internal server error" }, { status: 500 })
  }
}
