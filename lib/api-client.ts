// Client-side API helper functions
const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
const USE_MOCK_DATA = false // Set to false when backend is ready

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("auth-token")
}

// Mock delay to simulate API calls
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // Use mock data for frontend preview
  if (USE_MOCK_DATA) {
    await delay(500) // Simulate network delay
    return mockApiResponse(endpoint, options) as T
  }

  const token = getAuthToken()

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }))
    throw new Error(error.error || "Request failed")
  }

  return response.json()
}

function mockApiResponse(endpoint: string, options: RequestInit) {
  const method = options.method || "GET"
  const body = options.body ? JSON.parse(options.body as string) : {}

  // Auth endpoints
  if (endpoint === "/api/auth/otp" && method === "POST") {
    return {
      success: true,
      otp: "123456",
      message: "OTP sent successfully",
    }
  }

  if (endpoint === "/api/auth/verify" && method === "POST") {
    return {
      success: true,
      token: "mock-jwt-token-" + Math.random().toString(36).substr(2, 16),
      user: {
        id: "user-123",
        email: body.email || `${body.phone}@example.com`,
        phone: body.phone,
        name: "Demo User",
        role: "user",
        plan: "professional",
      },
    }
  }

  // GSP endpoints
  if (endpoint === "/api/gsp/connect" && method === "POST") {
    if (body.action === "REQUEST_OTP") {
      return {
        success: true,
        message: "OTP sent to registered mobile",
        txn: "txn-" + Math.random().toString(36).substr(2, 9),
      }
    }
    return {
      success: true,
      message: "GSTIN connected successfully",
    }
  }

  if (endpoint.startsWith("/api/gsp/fetch-returns")) {
    return {
      success: true,
      data: {
        gstin: "27AABCU9603R1ZM",
        returnPeriod: "042024",
        data: {},
      },
    }
  }

  // Subscription endpoints
  if (endpoint === "/api/subscription") {
    if (method === "GET") {
      return {
        plan: "professional",
        status: "active",
        billingCycle: "monthly",
        nextBilling: "2024-05-01",
        amount: 2999,
      }
    }
    return {
      success: true,
      message: "Subscription updated successfully",
    }
  }

  return { success: true }
}

// Auth API
export const authApi = {
  requestOtp: async (phone: string, email?: string) => {
    const response = await fetch("/api/auth/request-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, email }),
    })

    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text()
      console.error("[v0] Non-JSON response from request-otp:", text)
      throw new Error("Server returned an invalid response")
    }

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Failed to send OTP")
    }

    return data
  },

  verifyOtp: async (phone: string, otp: string, email?: string) => {
    const response = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, otp, email }),
    })

    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text()
      console.error("[v0] Non-JSON response from verify-otp:", text)
      throw new Error("Server returned an invalid response")
    }

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Failed to verify OTP")
    }

    return data
  },
}

// GSP API
export const gspApi = {
  connectGSTIN: (gstin: string, action: "REQUEST_OTP" | "VERIFY_OTP", otp?: string, txn?: string) =>
    apiRequest<{ success: boolean; message: string; txn?: string }>("/api/gsp/connect", {
      method: "POST",
      body: JSON.stringify({ gstin, action, otp, txn }),
    }),

  fetchReturns: (gstin: string, returnPeriod: string, returnType: "gstr3b" | "gstr2b" | "gstr1") =>
    apiRequest<{ success: boolean; data: any }>(
      `/api/gsp/fetch-returns?gstin=${gstin}&return_period=${returnPeriod}&return_type=${returnType}`,
    ),
}

// Subscription API
export const subscriptionApi = {
  getSubscription: () => apiRequest<any>("/api/subscription"),

  createSubscription: (plan: string, paymentMethod: string) =>
    apiRequest<{ success: boolean; message: string }>("/api/subscription", {
      method: "POST",
      body: JSON.stringify({ plan, paymentMethod }),
    }),
}

// Export API
export const exportApi = {
  exportPDF: async (reportType: string, gstin: string, returnPeriod: string, data: any) => {
    const token = getAuthToken()
    const response = await fetch(`${API_BASE_URL}/api/export/pdf`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ reportType, gstin, returnPeriod, data }),
    })

    if (!response.ok) {
      throw new Error("Failed to generate PDF")
    }

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${reportType}-${gstin}-${returnPeriod}.pdf`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  },

  exportExcel: async (reportType: string, gstin: string, returnPeriod: string, data: any) => {
    const token = getAuthToken()
    const response = await fetch(`${API_BASE_URL}/api/export/excel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ reportType, gstin, returnPeriod, data }),
    })

    if (!response.ok) {
      throw new Error("Failed to generate Excel")
    }

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${reportType}-${gstin}-${returnPeriod}.xlsx`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  },
}

export { getAuthToken }
