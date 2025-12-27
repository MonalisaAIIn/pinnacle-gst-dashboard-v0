"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, LinkIcon, AlertCircle, Lock } from "lucide-react"

export default function GSTConnectionPage() {
  const [step, setStep] = useState<"gstin" | "otp" | "connected">("gstin")
  const [gstin, setGstin] = useState("")
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isCheckingConnection, setIsCheckingConnection] = useState(false)

  useEffect(() => {
    const checkExistingConnection = async () => {
      const savedGstin = localStorage.getItem("connected_gstin")
      if (savedGstin) {
        setIsCheckingConnection(true)
        try {
          const response = await fetch("/api/gsp/check-connection", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ gstin: savedGstin }),
          })

          const data = await response.json()
          if (data.success && data.connected) {
            setGstin(savedGstin)
            setStep("connected")
          } else {
            localStorage.removeItem("connected_gstin")
          }
        } catch (err) {
          console.error("Failed to check connection:", err)
          localStorage.removeItem("connected_gstin")
        } finally {
          setIsCheckingConnection(false)
        }
      }
    }

    checkExistingConnection()
  }, [])

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/gsp/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gstin }),
      })

      const data = await response.json()

      if (data.success) {
        setStep("otp")
      } else {
        setError(data.error || "Failed to send OTP")
      }
    } catch (err: any) {
      setError(err.message || "Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/gsp/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gstin, otp }),
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem("connected_gstin", gstin)
        setStep("connected")
      } else {
        setError(data.error || "Invalid OTP")
      }
    } catch (err: any) {
      setError(err.message || "Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      await fetch("/api/gsp/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gstin }),
      })

      localStorage.removeItem("connected_gstin")
      setStep("gstin")
      setGstin("")
      setOtp("")
    } catch (err) {
      console.error("Disconnect error:", err)
    }
  }

  if (isCheckingConnection) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-slate-600">Checking GST connection...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">GST Connection</h1>
          <p className="text-slate-600 mt-1">Connect your GSTIN to GST Portal via Alankit GST Sandbox API</p>
        </div>

        {step === "gstin" && (
          <Card className="max-w-2xl mx-auto border-blue-100">
            <CardHeader>
              <CardTitle>Connect Your GSTIN</CardTitle>
              <CardDescription>
                Enter your GSTIN to receive an OTP on your registered mobile number and email for authentication.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRequestOtp} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-red-800">{error}</div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="gstin" className="text-slate-700 font-medium">
                    GSTIN Number
                  </Label>
                  <Input
                    id="gstin"
                    type="text"
                    placeholder="e.g., 29AABCT1234F1Z5"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value.toUpperCase())}
                    className="h-12 border-slate-300"
                    maxLength={15}
                    required
                  />
                  <p className="text-sm text-slate-500">15-character GSTIN registered on GST Portal</p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  disabled={isLoading || gstin.length !== 15}
                >
                  {isLoading ? "Requesting OTP..." : "Request OTP"}
                </Button>
              </form>

              <div className="mt-6 space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex gap-3">
                    <LinkIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-slate-700">
                      <p className="font-medium text-slate-900">Alankit GST Sandbox</p>
                      <p className="mt-1">
                        Testing environment for GST Portal integration. OTP will be sent to your registered credentials.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex gap-3">
                    <Lock className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-slate-700">
                      <p className="font-medium text-slate-900">Secure Encryption</p>
                      <p className="mt-1">
                        All communication uses RSA + AES-256 encryption as mandated by GST Portal. Your credentials are
                        encrypted and never stored in plain text.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "otp" && (
          <Card className="max-w-2xl mx-auto border-blue-100">
            <CardHeader>
              <CardTitle>Verify OTP</CardTitle>
              <CardDescription>
                Enter the OTP sent to your registered mobile number and email for GSTIN: {gstin}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-red-800">{error}</div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-slate-700 font-medium">
                    OTP
                  </Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="h-12 border-slate-300 text-center text-2xl tracking-widest"
                    maxLength={6}
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-12 bg-transparent"
                    onClick={() => {
                      setStep("gstin")
                      setOtp("")
                      setError("")
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                    disabled={isLoading || otp.length !== 6}
                  >
                    {isLoading ? "Verifying..." : "Verify OTP"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {step === "connected" && (
          <Card className="max-w-2xl mx-auto border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Successfully Connected!</h3>
                  <p className="text-slate-600 mt-2">
                    Your GSTIN is now authenticated with GST Portal via Alankit API.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <p className="text-sm text-slate-600">GSTIN</p>
                      <p className="font-semibold text-slate-900 mt-1">{gstin}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Connected</Badge>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">API Environment</span>
                      <span className="font-medium text-blue-700">Alankit Sandbox</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-slate-600">Session Status</span>
                      <span className="font-medium text-green-700">Active (6 hours)</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" className="flex-1 bg-white" onClick={handleDisconnect}>
                    Disconnect
                  </Button>
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700" asChild>
                    <a href="/dashboard/overview">View Dashboard</a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
