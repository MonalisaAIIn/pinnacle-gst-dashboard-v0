"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Bell, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SMSNotificationButtonProps {
  alertType: string
  description: string
  period: string
  severity: string
}

export function SMSNotificationButton({ alertType, description, period, severity }: SMSNotificationButtonProps) {
  const [isSending, setIsSending] = useState(false)
  const { toast } = useToast()

  const handleSendSMS = async () => {
    setIsSending(true)

    try {
      const response = await fetch("/api/sms/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: "9999999999", // Replace with actual user phone from session/profile
          type: "compliance",
          metadata: {
            alertType,
            period,
          },
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "SMS Sent",
          description: "Compliance alert notification has been sent successfully.",
        })
      } else {
        toast({
          title: "Failed to Send",
          description: data.message || "Could not send SMS notification.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] SMS send error:", error)
      toast({
        title: "Error",
        description: "An error occurred while sending SMS.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleSendSMS} disabled={isSending} className="gap-2 bg-transparent">
      {isSending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Sending...
        </>
      ) : (
        <>
          <Bell className="h-4 w-4" />
          Send SMS Alert
        </>
      )}
    </Button>
  )
}
