import { createGSTSession, decryptAuthSEK, encryptPayload, aesDecrypt } from "./gst-crypto-helper"

const ALANKIT_API_BASE = process.env.GSP_BASE_URL || "https://uatapi.alankitgst.com/taxpayerapi/v1.0"
const SUBSCRIPTION_KEY = process.env.ALANKIT_SUBSCRIPTION_KEY || ""
const CLIENT_ID = process.env.GSP_CLIENT_ID || ""
const CLIENT_SECRET = process.env.GSP_CLIENT_SECRET || ""
const GSP_USERNAME = process.env.GSP_USERNAME || ""

interface AlankitApiResponse {
  status_cd: string
  error?: {
    message: string
    error_cd: string
  }
  data?: any
}

interface GSTSession {
  appKey: string
  sek?: string
  authToken?: string
}

/**
 * Make authenticated request to Alankit GST API
 */
async function alankitApiRequest(
  endpoint: string,
  method: "GET" | "POST" = "GET",
  body?: any,
  headers?: Record<string, string>,
  gstin?: string,
): Promise<AlankitApiResponse> {
  const txn = `LAPN${Date.now().toString().slice(-12)}`

  const requestHeaders: HeadersInit = {
    "Content-Type": "application/json",
    "Ocp-Apim-Subscription-Key": SUBSCRIPTION_KEY,
    clientid: CLIENT_ID,
    "client-secret": CLIENT_SECRET,
    username: gstin || GSP_USERNAME,
    "state-cd": "27",
    "ip-usr": "38.254.185.155",
    txn: txn,
    ...headers,
  }

  const url = `${ALANKIT_API_BASE}${endpoint}`

  console.log("[v0] Alankit API Request:", { url, method, body })

  try {
    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      ...(body && { body: JSON.stringify(body) }),
    })

    const data = await response.json()

    console.log("[v0] Alankit API Response:", { status: response.status, data })

    if (!response.ok && response.status !== 200) {
      throw new Error(data.error?.message || "Alankit API request failed")
    }

    return data
  } catch (error) {
    console.error("[v0] Alankit API Error:", error)
    throw error
  }
}

/**
 * Step 1: Request OTP for GST Portal Authentication (with encryption)
 */
export async function requestGstOtp(gstin: string): Promise<{ success: boolean; appKey?: string; error?: string }> {
  try {
    console.log("[v0] Requesting GST OTP for GSTIN:", gstin)

    const session = createGSTSession(undefined, true) // Debug mode enabled for sandbox

    console.log("[v0] Generated AppKey (keep secure):", session.appKey)
    console.log("[v0] Encrypted AppKey:", session.encryptedAppKey)

    const response = await alankitApiRequest(
      "/authenticate",
      "POST",
      {
        action: "OTPREQUEST",
        app_key: session.encryptedAppKey,
        username: gstin,
      },
      {},
      gstin,
    )

    if (response.status_cd === "1") {
      return {
        success: true,
        appKey: session.appKey,
      }
    }

    return {
      success: false,
      error: response.error?.message || "Failed to request OTP",
    }
  } catch (error: any) {
    console.error("[v0] Request GST OTP error:", error)
    return {
      success: false,
      error: error.message || "Failed to request OTP",
    }
  }
}

/**
 * Step 2: Verify OTP and get authorization token (with decryption)
 */
export async function verifyGstOtp(
  gstin: string,
  otp: string,
  appKey: string,
): Promise<{ success: boolean; authToken?: string; sek?: string; error?: string }> {
  try {
    console.log("[v0] Verifying GST OTP for GSTIN:", gstin)

    const response = await alankitApiRequest(
      "/authenticate",
      "POST",
      {
        action: "AUTHTOKEN",
        username: gstin,
        otp: otp,
      },
      {},
      gstin,
    )

    if (response.status_cd === "1" && response.data) {
      const encryptedSEK = response.data.sek
      const authToken = response.data.auth_token

      console.log("[v0] Encrypted SEK received:", encryptedSEK)

      const sek = decryptAuthSEK(encryptedSEK, appKey)

      console.log("[v0] Decrypted SEK:", sek)

      return {
        success: true,
        authToken,
        sek,
      }
    }

    return {
      success: false,
      error: response.error?.message || "Invalid OTP",
    }
  } catch (error: any) {
    console.error("[v0] Verify GST OTP error:", error)
    return {
      success: false,
      error: error.message || "Failed to verify OTP",
    }
  }
}

/**
 * Step 3: Refresh authorization token
 */
export async function refreshGstToken(
  authToken: string,
): Promise<{ success: boolean; newAuthToken?: string; error?: string }> {
  try {
    console.log("[v0] Refreshing GST auth token")

    const response = await alankitApiRequest(
      "/authenticate",
      "POST",
      { action: "REFRESHTOKEN" },
      { Authorization: `Bearer ${authToken}` },
    )

    if (response.status_cd === "1") {
      return {
        success: true,
        newAuthToken: response.data?.auth_token,
      }
    }

    return {
      success: false,
      error: response.error?.message || "Failed to refresh token",
    }
  } catch (error: any) {
    console.error("[v0] Refresh GST token error:", error)
    return {
      success: false,
      error: error.message || "Failed to refresh token",
    }
  }
}

/**
 * Step 4: Request EVC OTP for filing
 */
export async function requestEvcOtp(gstin: string, authToken: string): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("[v0] Requesting EVC OTP for GSTIN:", gstin)

    const response = await alankitApiRequest(
      "/authenticate",
      "POST",
      {
        action: "EVCOTP",
        username: gstin,
      },
      { Authorization: `Bearer ${authToken}` },
    )

    if (response.status_cd === "1") {
      return { success: true }
    }

    return {
      success: false,
      error: response.error?.message || "Failed to request EVC OTP",
    }
  } catch (error: any) {
    console.error("[v0] Request EVC OTP error:", error)
    return {
      success: false,
      error: error.message || "Failed to request EVC OTP",
    }
  }
}

/**
 * Step 5: Logout from GST Portal
 */
export async function logoutGst(gstin: string, authToken: string): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("[v0] Logging out from GST Portal for GSTIN:", gstin)

    const response = await alankitApiRequest(
      "/authenticate",
      "POST",
      {
        action: "LOGOUT",
        username: gstin,
      },
      { Authorization: `Bearer ${authToken}` },
    )

    if (response.status_cd === "1") {
      return { success: true }
    }

    return {
      success: false,
      error: response.error?.message || "Failed to logout",
    }
  } catch (error: any) {
    console.error("[v0] Logout GST error:", error)
    return {
      success: false,
      error: error.message || "Failed to logout",
    }
  }
}

/**
 * Make encrypted API call to GST Portal
 */
export async function makeEncryptedGstApiCall(
  endpoint: string,
  payload: any,
  authToken: string,
  sek: string,
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    console.log("[v0] Making encrypted GST API call to:", endpoint)

    const encryptedPayload = encryptPayload(payload, sek)

    console.log("[v0] Encrypted payload:", encryptedPayload)

    const response = await alankitApiRequest(
      endpoint,
      "POST",
      { data: encryptedPayload },
      { Authorization: `Bearer ${authToken}` },
    )

    if (response.status_cd === "1" && response.data) {
      if (typeof response.data === "string") {
        const decryptedData = aesDecrypt(response.data, Buffer.from(sek, "base64"))
        return {
          success: true,
          data: JSON.parse(decryptedData),
        }
      }

      return {
        success: true,
        data: response.data,
      }
    }

    return {
      success: false,
      error: response.error?.message || "API call failed",
    }
  } catch (error: any) {
    console.error("[v0] Encrypted GST API call error:", error)
    return {
      success: false,
      error: error.message || "Failed to make encrypted API call",
    }
  }
}

// Additional utility functions or updates can be added here if needed
