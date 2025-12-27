import { NextResponse } from "next/server"
import { fast2sms } from "@/lib/fast2sms"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { phoneNumber, message, type, metadata } = body

    if (!phoneNumber) {
      return NextResponse.json({ success: false, message: "Phone number is required" }, { status: 400 })
    }

    let result

    switch (type) {
      case "compliance":
        result = await fast2sms.sendComplianceAlert(phoneNumber, metadata.alertType, metadata.period)
        break
      case "filing":
        result = await fast2sms.sendFilingReminder(phoneNumber, metadata.returnType, metadata.dueDate)
        break
      case "itc":
        result = await fast2sms.sendITCMismatchAlert(phoneNumber, metadata.amount, metadata.period)
        break
      case "otp":
        result = await fast2sms.sendOTP(phoneNumber, metadata.otp)
        break
      case "custom":
        result = await fast2sms.sendCustomMessage(phoneNumber, message)
        break
      default:
        return NextResponse.json({ success: false, message: "Invalid SMS type" }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] SMS API error:", error)
    return NextResponse.json({ success: false, message: "Failed to send SMS" }, { status: 500 })
  }
}
