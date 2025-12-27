"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { MessageSquare, Bell, Clock, Shield, Send } from "lucide-react"

export default function SMSSettingsPage() {
  const [phoneNumber, setPhoneNumber] = useState("9999999999")
  const [customMessage, setCustomMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const { toast } = useToast()

  const [notifications, setNotifications] = useState({
    compliance: true,
    filing: true,
    itcMismatch: true,
    vendorAlerts: false,
  })

  const handleSendTestSMS = async () => {
    setIsSending(true)

    try {
      const response = await fetch("/api/sms/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber,
          type: "custom",
          message: customMessage || "This is a test SMS from Pinnacle GST Dashboard.",
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "SMS Sent Successfully",
          description: "Test SMS has been delivered to your phone.",
        })
        setCustomMessage("")
      } else {
        toast({
          title: "Failed to Send SMS",
          description: data.message || "Please check your API configuration.",
          variant: "destructive",
        })
      }
    } catch (error) {
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
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">SMS Settings</h1>
          <p className="text-slate-600 mt-1">
            Configure your Fast2SMS integration and manage SMS notification preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SMS Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                SMS Configuration
              </CardTitle>
              <CardDescription>Set up your Fast2SMS API and phone number</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Primary Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter 10-digit mobile number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  maxLength={10}
                />
                <p className="text-sm text-slate-500">This number will receive all SMS notifications</p>
              </div>

              <div className="space-y-2">
                <Label>API Status</Label>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200">
                  <div className="h-2 w-2 rounded-full bg-green-600" />
                  <span className="text-sm font-medium text-green-700">Fast2SMS Connected</span>
                </div>
                <p className="text-sm text-slate-500">
                  API Key configured via environment variable:{" "}
                  <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">FAST2SMS_API_KEY</code>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Test SMS */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5 text-indigo-600" />
                Send Test SMS
              </CardTitle>
              <CardDescription>Test your SMS integration with a custom message</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="message">Custom Message</Label>
                <Textarea
                  id="message"
                  placeholder="Enter your test message (optional)"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={4}
                  maxLength={160}
                />
                <p className="text-sm text-slate-500">{customMessage.length} / 160 characters</p>
              </div>

              <Button onClick={handleSendTestSMS} disabled={isSending} className="w-full">
                {isSending ? "Sending..." : "Send Test SMS"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-orange-600" />
              Notification Preferences
            </CardTitle>
            <CardDescription>Choose which events trigger SMS notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:bg-slate-50">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Compliance Alerts</Label>
                  <p className="text-sm text-slate-500">Critical GST compliance issues and violations</p>
                </div>
                <Switch
                  checked={notifications.compliance}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, compliance: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:bg-slate-50">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Filing Reminders</Label>
                  <p className="text-sm text-slate-500">Upcoming return filing deadlines and due dates</p>
                </div>
                <Switch
                  checked={notifications.filing}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, filing: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:bg-slate-50">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">ITC Mismatch Alerts</Label>
                  <p className="text-sm text-slate-500">Input tax credit discrepancies detected</p>
                </div>
                <Switch
                  checked={notifications.itcMismatch}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, itcMismatch: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:bg-slate-50">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Vendor Alerts</Label>
                  <p className="text-sm text-slate-500">Vendor non-compliance and filing issues</p>
                </div>
                <Switch
                  checked={notifications.vendorAlerts}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, vendorAlerts: checked })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SMS Templates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-600" />
              Available SMS Templates
            </CardTitle>
            <CardDescription>Pre-configured message templates for common scenarios</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                <h4 className="font-medium text-sm mb-2">Compliance Alert</h4>
                <p className="text-xs text-slate-600 font-mono">
                  "GST Alert: [TYPE] for [PERIOD]. Please take immediate action. - Pinnacle GST"
                </p>
              </div>

              <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                <h4 className="font-medium text-sm mb-2">Filing Reminder</h4>
                <p className="text-xs text-slate-600 font-mono">
                  "Reminder: [RETURN] filing due on [DATE]. Complete your filing to avoid penalties. - Pinnacle GST"
                </p>
              </div>

              <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                <h4 className="font-medium text-sm mb-2">ITC Mismatch</h4>
                <p className="text-xs text-slate-600 font-mono">
                  "ITC Mismatch Alert: ₹[AMOUNT] discrepancy detected for [PERIOD]. Review your GSTR-2A. - Pinnacle GST"
                </p>
              </div>

              <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                <h4 className="font-medium text-sm mb-2">OTP Verification</h4>
                <p className="text-xs text-slate-600 font-mono">
                  "Your Pinnacle GST verification OTP is: [OTP]. Valid for 10 minutes. Do not share this OTP."
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Note */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-slate-900">Security Best Practices</h4>
                <p className="text-sm text-slate-600 mt-1">
                  Your Fast2SMS API key is securely stored in environment variables and never exposed to the client. All
                  SMS messages are sent from server-side API routes. Never share your OTP or sensitive information via
                  SMS.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
