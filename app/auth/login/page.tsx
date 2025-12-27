"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"
import { AlertCircle } from "lucide-react"

export default function LoginPage() {
  const [phone, setPhone] = useState("+91 ")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isRateLimited, setIsRateLimited] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setIsRateLimited(false)

    try {
      const result = await login(phone, email || undefined)

      if (result.success) {
        toast.success("OTP sent successfully!")

        // Store phone/email for verification page
        sessionStorage.setItem("auth-phone", phone)
        if (email) sessionStorage.setItem("auth-email", email)

        router.push("/auth/verify-otp")
      }
    } catch (error: any) {
      if (error.message?.includes("Too many OTP requests")) {
        setIsRateLimited(true)
      }
      toast.error(error.message || "Failed to send OTP")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetRateLimit = async () => {
    setIsResetting(true)
    try {
      const response = await fetch("/api/auth/reset-rate-limit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      })

      const data = await response.json()

      if (data.success) {
        setIsRateLimited(false)
        toast.success("Rate limit reset! You can now request OTP again.")
      } else {
        toast.error(data.error || "Failed to reset rate limit")
      }
    } catch (error) {
      toast.error("Failed to reset rate limit")
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Image
            src="/images/logo.png"
            alt="Pinnacle Consultancy Group"
            width={200}
            height={80}
            className="h-20 w-auto"
          />
        </div>

        <Card className="border-blue-100 shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-slate-900">Sign in to your account</CardTitle>
            <CardDescription className="text-slate-600">
              Enter your phone number below to receive a One-Time Password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isRateLimited && (
              <Alert className="mb-4 border-orange-200 bg-orange-50">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  You've reached the maximum number of OTP requests. Please wait 10 minutes or reset the limit below.
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-700 font-medium">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 9999999999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">
                  Email (Optional)
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send OTP"}
              </Button>

              {isRateLimited && (
                <Button
                  type="button"
                  onClick={handleResetRateLimit}
                  variant="outline"
                  className="w-full h-12 border-orange-300 text-orange-700 hover:bg-orange-50 bg-transparent"
                  disabled={isResetting}
                >
                  {isResetting ? "Resetting..." : "Reset Rate Limit (Testing)"}
                </Button>
              )}
            </form>

            <div className="mt-6 flex items-center justify-between text-sm">
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                Help
              </a>
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                Privacy Policy
              </a>
            </div>
          </CardContent>
        </Card>

        <p className="mt-8 text-center text-sm text-slate-500">
          © 2025 Pinnacle GST Analytical Dashboard. All rights reserved.
        </p>
      </div>
    </div>
  )
}
