// Fast2SMS API integration service

interface SMSResponse {
  success: boolean
  message: string
  requestId?: string
}

interface SendSMSParams {
  message: string
  numbers: string | string[]
  route?: "dlt" | "q" | "v3"
  senderId?: string
}

export class Fast2SMS {
  private apiKey: string
  private baseUrl = "https://www.fast2sms.com/dev/bulkV2"

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.FAST2SMS_API_KEY || ""
    if (!this.apiKey) {
      console.warn("[v0] Fast2SMS API key not configured")
    }
  }

  async sendSMS({ message, numbers, route = "q", senderId }: SendSMSParams): Promise<SMSResponse> {
    if (!this.apiKey) {
      console.error("[v0] Fast2SMS API key is missing")
      return { success: false, message: "API key not configured" }
    }

    try {
      const numbersArray = Array.isArray(numbers) ? numbers : [numbers]
      const numbersString = numbersArray.join(",")

      const params = new URLSearchParams({
        authorization: this.apiKey,
        message,
        route,
        numbers: numbersString,
        ...(senderId && { sender_id: senderId }),
      })

      const response = await fetch(`${this.baseUrl}?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (!response.ok) {
        console.error("[v0] Fast2SMS API error:", data)
        return { success: false, message: data.message || "Failed to send SMS" }
      }

      return {
        success: true,
        message: "SMS sent successfully",
        requestId: data.request_id,
      }
    } catch (error) {
      console.error("[v0] Fast2SMS error:", error)
      return { success: false, message: "Failed to send SMS" }
    }
  }

  // Predefined GST compliance templates
  async sendComplianceAlert(phoneNumber: string, alertType: string, period: string): Promise<SMSResponse> {
    const message = `GST Alert: ${alertType} for ${period}. Please take immediate action. - Pinnacle GST`
    return this.sendSMS({ message, numbers: phoneNumber })
  }

  async sendFilingReminder(phoneNumber: string, returnType: string, dueDate: string): Promise<SMSResponse> {
    const message = `Reminder: ${returnType} filing due on ${dueDate}. Complete your filing to avoid penalties. - Pinnacle GST`
    return this.sendSMS({ message, numbers: phoneNumber })
  }

  async sendITCMismatchAlert(phoneNumber: string, amount: string, period: string): Promise<SMSResponse> {
    const message = `ITC Mismatch Alert: ₹${amount} discrepancy detected for ${period}. Review your GSTR-2A. - Pinnacle GST`
    return this.sendSMS({ message, numbers: phoneNumber })
  }

  async sendOTP(phoneNumber: string, otp: string): Promise<SMSResponse> {
    const message = `Your Pinnacle GST verification OTP is: ${otp}. Valid for 10 minutes. Do not share this OTP.`
    return this.sendSMS({ message, numbers: phoneNumber })
  }

  async sendCustomMessage(phoneNumber: string | string[], message: string): Promise<SMSResponse> {
    return this.sendSMS({ message, numbers: phoneNumber })
  }
}

// Singleton instance
export const fast2sms = new Fast2SMS()
