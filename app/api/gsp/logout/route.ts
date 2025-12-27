import { type NextRequest, NextResponse } from "next/server"
import { logoutGst } from "@/lib/alankit-gst-api"
import { getGstAuth, deleteGstSession } from "@/lib/redis"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { gstin } = body

    console.log("[v0] GSP Logout endpoint called for GSTIN:", gstin)

    if (!gstin) {
      return NextResponse.json({ success: false, error: "GSTIN is required" }, { status: 400 })
    }

    const { authToken } = await getGstAuth(gstin)

    if (authToken) {
      // Logout from Alankit GST API
      await logoutGst(gstin, authToken)

      await deleteGstSession(gstin)

      console.log("[v0] GST session terminated for GSTIN:", gstin)
    }

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    })
  } catch (error: any) {
    console.error("[v0] GSP Logout error:", error)
    return NextResponse.json({ success: false, error: error.message || "Internal server error" }, { status: 500 })
  }
}
