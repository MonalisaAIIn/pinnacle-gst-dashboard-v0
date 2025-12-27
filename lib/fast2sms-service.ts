// Fast2SMS service for sending OTPs
interface Fast2SMSResponse {
  return: boolean
  request_id: string
  message: string[]
}

export async function sendOtpSMS(phone: string, otp: string): Promise<boolean> {
  const apiKey = process.env.FAST2SMS_API_KEY

  if (!apiKey) {
    console.error("[v0] Fast2SMS API key not configured")
    throw new Error("SMS service not configured")
  }

  const cleanPhone = phone.replace(/^\+91/, "").replace(/\s/g, "")

  try {
    console.log("[v0] Sending OTP to:", cleanPhone, "using Fast2SMS")

    const message = `Your OTP for Pinnacle GST login is ${otp}. Valid for 5 minutes. Do not share this code.`

    // Build query parameters for GET request
    const params = new URLSearchParams({
      authorization: apiKey,
      message: message,
      route: "q", // Quick route - works without website verification
      numbers: cleanPhone,
    })

    const url = `https://www.fast2sms.com/dev/bulkV2?${params.toString()}`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "cache-control": "no-cache",
      },
    })

    const rawText = await response.text()
    console.log("[v0] Fast2SMS raw response:", rawText)

    // Check if response is ok
    if (!response.ok) {
      console.error("[v0] Fast2SMS API error:", response.status, rawText)
      throw new Error(`Fast2SMS API returned ${response.status}`)
    }

    // Try to parse as JSON
    let data: Fast2SMSResponse
    try {
      data = JSON.parse(rawText)
    } catch (parseError) {
      console.error("[v0] Failed to parse Fast2SMS response as JSON:", rawText)
      throw new Error("Invalid response from SMS service")
    }

    if (data.return) {
      console.log("[v0] OTP sent successfully via Fast2SMS:", data.request_id)
      return true
    } else {
      console.error("[v0] Fast2SMS error:", data.message)
      return false
    }
  } catch (error) {
    console.error("[v0] Failed to send OTP via Fast2SMS:", error)
    throw new Error("Failed to send OTP")
  }
}

export function generateOtp(): string {
  // Generate 6-digit OTP
  return Math.floor(100000 + Math.random() * 900000).toString()
}
