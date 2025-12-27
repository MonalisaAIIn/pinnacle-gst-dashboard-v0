import { type NextRequest, NextResponse } from "next/server"
import { getOtp, deleteOtp } from "@/lib/redis"
import { SignJWT } from "jose"

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || "your-secret-key-change-in-production"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Verify OTP endpoint called")

    const body = await request.json()
    const { phone, otp, email } = body

    console.log("[v0] Verify request:", { phone, otp, email })

    if (!phone || !otp) {
      return NextResponse.json({ success: false, error: "Phone number and OTP are required" }, { status: 400 })
    }

    // Get stored OTP from Redis
    console.log("[v0] Fetching OTP from Redis for", phone)
    const storedOtp = await getOtp(phone)
    console.log("[v0] Stored OTP:", storedOtp)

    if (!storedOtp) {
      console.log("[v0] OTP not found or expired")
      return NextResponse.json({ success: false, error: "OTP has expired or is invalid" }, { status: 400 })
    }

    const storedOtpStr = String(storedOtp).trim()
    const inputOtpStr = String(otp).trim()

    console.log("[v0] Comparing OTPs - Stored:", JSON.stringify(storedOtpStr), "Input:", JSON.stringify(inputOtpStr))
    console.log("[v0] Type check - Stored type:", typeof storedOtp, "Input type:", typeof otp)
    console.log("[v0] Length check - Stored length:", storedOtpStr.length, "Input length:", inputOtpStr.length)

    // Verify OTP with strict string comparison
    if (storedOtpStr !== inputOtpStr) {
      console.log("[v0] OTP mismatch. Expected:", storedOtpStr, "Got:", inputOtpStr)
      return NextResponse.json({ success: false, error: "Invalid OTP. Please try again." }, { status: 400 })
    }

    console.log("[v0] OTP verified successfully")

    // Delete OTP after successful verification
    await deleteOtp(phone)

    // Create user object
    const user = {
      id: `user-${Date.now()}`,
      phone,
      email: email || `${phone}@pinnaclegst.com`,
      name: "User",
      role: "user",
      plan: "professional",
    }

    const secret = new TextEncoder().encode(JWT_SECRET)
    const token = await new SignJWT({ userId: user.id, phone: user.phone })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .setIssuedAt()
      .sign(secret)

    console.log("[v0] User authenticated successfully:", user.id)

    return NextResponse.json({
      success: true,
      token,
      user,
      message: "OTP verified successfully",
    })
  } catch (error) {
    console.error("[v0] Verify OTP error:", error)
    return NextResponse.json({ success: false, error: "Failed to verify OTP. Please try again." }, { status: 500 })
  }
}
