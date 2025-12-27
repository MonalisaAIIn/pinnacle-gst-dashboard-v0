"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { authApi } from "@/lib/api-client"

interface User {
  id: string
  email: string
  phone: string
  name: string
  role: string
  plan: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (phone: string, email?: string) => Promise<{ success: boolean }>
  verifyOtp: (phone: string, otp: string, email?: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for existing auth token
    let token: string | null = null
    let userData: string | null = null

    if (typeof window !== "undefined") {
      token = localStorage.getItem("auth-token")
      userData = localStorage.getItem("user-data")
    }

    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error("[v0] Failed to parse user data:", error)
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth-token")
          localStorage.removeItem("user-data")
        }
      }
    }

    setLoading(false)
  }, [])

  const login = async (phone: string, email?: string) => {
    try {
      const response = await authApi.requestOtp(phone, email)
      return { success: true }
    } catch (error) {
      console.error("[v0] Login error:", error)
      throw error
    }
  }

  const verifyOtp = async (phone: string, otp: string, email?: string) => {
    try {
      const response = await authApi.verifyOtp(phone, otp, email)

      if (response.success && response.token) {
        if (typeof window !== "undefined") {
          localStorage.setItem("auth-token", response.token)
          localStorage.setItem("user-data", JSON.stringify(response.user))
        }
        setUser(response.user)
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("[v0] OTP verification error:", error)
      throw error
    }
  }

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth-token")
      localStorage.removeItem("user-data")
    }
    setUser(null)
    router.push("/auth/login")
  }

  return <AuthContext.Provider value={{ user, loading, login, verifyOtp, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
