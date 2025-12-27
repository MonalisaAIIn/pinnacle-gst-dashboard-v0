import { Redis } from "@upstash/redis"

// Initialize Redis client
export const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

// OTP storage functions
export async function storeOtp(phone: string, otp: string): Promise<void> {
  const key = `otp:${phone}`
  // Store OTP with 5 minutes expiration
  await redis.setex(key, 300, otp)
}

export async function getOtp(phone: string): Promise<string | null> {
  const key = `otp:${phone}`
  return await redis.get<string>(key)
}

export async function deleteOtp(phone: string): Promise<void> {
  const key = `otp:${phone}`
  await redis.del(key)
}

export async function checkRateLimit(phone: string): Promise<boolean> {
  const key = `rate_limit:${phone}`
  const count = await redis.get<number>(key)

  if (count && count >= 20) {
    console.log("[v0] Rate limit check: count =", count, "- BLOCKED")
    return false // Rate limit exceeded
  }

  console.log("[v0] Rate limit check: count =", count || 0, "- ALLOWED")

  // Increment count or initialize to 1
  const newCount = await redis.incr(key)

  if (newCount === 1) {
    await redis.expire(key, 300) // 5 minutes
  }

  return true
}

// Function to reset rate limit (useful for testing)
export async function resetRateLimit(phone: string): Promise<void> {
  const key = `rate_limit:${phone}`
  await redis.del(key)
}

// GST session storage functions
export async function storeGstSession(gstin: string, appKey: string): Promise<void> {
  const key = `gst:session:${gstin}`
  // Store AppKey temporarily (5 minutes - enough time to verify OTP)
  await redis.setex(key, 300, appKey)
  console.log("[v0] Stored GST session (AppKey) for GSTIN:", gstin)
}

export async function getGstSession(gstin: string): Promise<string | null> {
  const key = `gst:session:${gstin}`
  return await redis.get<string>(key)
}

export async function storeGstAuth(gstin: string, authToken: string, sek: string): Promise<void> {
  const tokenKey = `gst:token:${gstin}`
  const sekKey = `gst:sek:${gstin}`

  // Store auth token and SEK with 6 hour expiration (GST tokens typically expire in 6 hours)
  await redis.setex(tokenKey, 21600, authToken)
  await redis.setex(sekKey, 21600, sek)

  console.log("[v0] Stored GST auth token and SEK for GSTIN:", gstin)
}

export async function getGstAuth(gstin: string): Promise<{ authToken: string | null; sek: string | null }> {
  const tokenKey = `gst:token:${gstin}`
  const sekKey = `gst:sek:${gstin}`

  const authToken = await redis.get<string>(tokenKey)
  const sek = await redis.get<string>(sekKey)

  return { authToken, sek }
}

export async function deleteGstSession(gstin: string): Promise<void> {
  const sessionKey = `gst:session:${gstin}`
  const tokenKey = `gst:token:${gstin}`
  const sekKey = `gst:sek:${gstin}`

  await redis.del(sessionKey)
  await redis.del(tokenKey)
  await redis.del(sekKey)

  console.log("[v0] Deleted GST session for GSTIN:", gstin)
}
