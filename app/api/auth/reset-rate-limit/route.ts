import { type NextRequest, NextResponse } from "next/server"
import { resetRateLimit } from "@/lib/redis"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone } = body

    if (!phone) {
      return NextResponse.json({ success: false, error: "Phone number is required" }, { status: 400 })
    }

    await resetRateLimit(phone)

    return NextResponse.json({
      success: true,
      message: "Rate limit reset successfully",
    })
  } catch (error) {
    console.error("[v0] Reset rate limit error:", error)
    return NextResponse.json({ success: false, error: "Failed to reset rate limit" }, { status: 500 })
  }
}
