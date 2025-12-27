import { type NextRequest, NextResponse } from "next/server"
import { generateOtp, sendOtpSMS } from "@/lib/fast2sms-service"
import { storeOtp, checkRateLimit } from "@/lib/redis"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Request OTP endpoint called")

    const body = await request.json()
    const { phone, email } = body

    console.log("[v0] Request body:", { phone, email })

    if (!phone) {
      return NextResponse.json({ success: false, error: "Phone number is required" }, { status: 400 })
    }

    // Check rate limiting
    console.log("[v0] Checking rate limit for", phone)
    const canProceed = await checkRateLimit(phone)
    if (!canProceed) {
      console.log("[v0] Rate limit exceeded for", phone)
      return NextResponse.json(
        { success: false, error: "Too many OTP requests. Please try again after 1 hour." },
        { status: 429 },
      )
    }

    // Generate OTP
    const otp = generateOtp()
    console.log("[v0] Generated OTP for", phone, ":", otp)

    // Store OTP in Redis
    console.log("[v0] Storing OTP in Redis")
    await storeOtp(phone, otp)

    // Send OTP via Fast2SMS
    try {
      console.log("[v0] Attempting to send SMS")
      await sendOtpSMS(phone, otp)
      console.log("[v0] SMS sent successfully")
    } catch (error) {
      console.error("[v0] Failed to send SMS:", error)
      // Continue even if SMS fails - OTP is stored
    }

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully to your mobile number",
    })
  } catch (error) {
    console.error("[v0] Request OTP error:", error)
    return NextResponse.json({ success: false, error: "Failed to send OTP. Please try again." }, { status: 500 })
  }
}
