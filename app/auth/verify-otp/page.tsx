"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(30)
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const router = useRouter()
  const { verifyOtp, login } = useAuth()

  useEffect(() => {
    const storedPhone = sessionStorage.getItem("auth-phone")
    const storedEmail = sessionStorage.getItem("auth-email")

    if (!storedPhone) {
      router.push("/auth/login")
      return
    }

    setPhone(storedPhone)
    if (storedEmail) setEmail(storedEmail)
  }, [router])

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await verifyOtp(phone, otp, email || undefined)
      toast.success("Login successful!")
      // Router push is handled in useAuth hook
    } catch (error: any) {
      toast.error(error.message || "Invalid OTP. Please try again.")
      setOtp("")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    try {
      const result = await login(phone, email || undefined)

      if (result.success) {
        toast.success("OTP resent successfully!")
        setResendTimer(30)
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to resend OTP")
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
            <CardTitle className="text-2xl font-bold text-slate-900">Verify Your OTP</CardTitle>
            <CardDescription className="text-slate-600">
              A 6-digit verification code has been sent to {phone}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-slate-700 font-medium">
                  Enter OTP
                </Label>
                <div className="flex justify-center">
                  <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="h-14 w-12 text-xl border-slate-300" />
                      <InputOTPSlot index={1} className="h-14 w-12 text-xl border-slate-300" />
                      <InputOTPSlot index={2} className="h-14 w-12 text-xl border-slate-300" />
                      <InputOTPSlot index={3} className="h-14 w-12 text-xl border-slate-300" />
                      <InputOTPSlot index={4} className="h-14 w-12 text-xl border-slate-300" />
                      <InputOTPSlot index={5} className="h-14 w-12 text-xl border-slate-300" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resendTimer > 0}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:text-slate-400 disabled:cursor-not-allowed"
                >
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="mt-8 text-center text-sm text-slate-500">
          © 2025 Pinnacle GST Analytical Dashboard. All rights reserved.
        </p>
      </div>
    </div>
  )
}
