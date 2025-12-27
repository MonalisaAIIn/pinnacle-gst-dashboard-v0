/**
 * GST Crypto Helper - Server-Side Only
 * ------------------------------------
 * Full GST Crypto Lifecycle (RSA + AES)
 * Matches GST Java reference implementation
 */

import crypto from "crypto"

/**
 * =========================
 * CONSTANTS
 * =========================
 */
const AES_ALGO = "aes-256-ecb" // GST mandated
const RSA_PADDING = crypto.constants.RSA_PKCS1_PADDING

/**
 * GST Sandbox Public Key (2048-bit RSA)
 * This should be replaced with the actual GST sandbox public key
 */
const GST_SANDBOX_PUBLIC_KEY_PLACEHOLDER = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAo8gO8Tf4vG3oPxgKhKvK
P8kSKmHJH0FzZy7B5Z9iO/X8lGBvF0HqFo8xqW1iY2VqLJKJLJKJLJKJLJKJLJKJ
LJKJLJKJLJKJLJKJLJKJLJKJLJKJLJKJLJKJLJKJLJKJLJKJLJKJLJKJLJKJLJKJ
LJKJLJKJLJKJLJKJLJKJLJKJLJKJLJKJLJKJLJKJLJKJLJKJLJKJLJKJLJKJLJKJ
LJKJLJKJLJKJLJKJLJKJLJKJLJKJLJKJLJKJLJKJLJKJLJKJLJKJLJKJLJKJLJKJ
LJKJLJKJLJKJLJKJLJKJLJKJLJKJLJKJLJKJLJKJLJKJLJKJLJKJLJKJLJKJLJKJ
LJKJLJKJLJKJLJKJLJKJLJKJLJKJLJKJLJKJLJKJLJKJLJKJLJKJLJKJLJKJLJKJ
LwIDAQAB
-----END PUBLIC KEY-----`

/**
 * =========================
 * APP KEY LIFECYCLE
 * =========================
 */

/**
 * Generate unique AppKey (AES-256 key = 32 bytes)
 * @returns Base64 encoded AppKey
 */
export function generateAppKey(): string {
  return crypto.randomBytes(32).toString("base64")
}

/**
 * Convert AppKey Base64 → raw bytes
 */
function appKeyToBytes(appKeyBase64: string): Buffer {
  return Buffer.from(appKeyBase64, "base64")
}

/**
 * =========================
 * RSA (GST AppKey Encryption)
 * =========================
 */

/**
 * Encrypt AppKey using GST Public Key (RSA/PKCS1)
 * @param appKeyBase64 - Base64 encoded AppKey
 * @param gstPublicKeyPem - GST Public Key in PEM format
 * @returns Encrypted AppKey (Base64)
 */
export function encryptAppKeyRSA(appKeyBase64: string, gstPublicKeyPem: string): string {
  try {
    const encrypted = crypto.publicEncrypt(
      {
        key: gstPublicKeyPem,
        padding: RSA_PADDING,
      },
      appKeyToBytes(appKeyBase64),
    )

    return encrypted.toString("base64")
  } catch (error) {
    console.error("[v0] RSA encryption failed:", error)
    throw new Error("Failed to encrypt AppKey with GST public key")
  }
}

/**
 * =========================
 * AES CORE (GST MANDATED)
 * AES/ECB/PKCS5Padding
 * =========================
 */

/**
 * AES Encrypt
 */
export function aesEncrypt(plainText: string, keyBytes: Buffer): string {
  try {
    const cipher = crypto.createCipheriv(AES_ALGO, keyBytes, null)
    cipher.setAutoPadding(true)

    let encrypted = cipher.update(plainText, "utf8", "base64")
    encrypted += cipher.final("base64")
    return encrypted
  } catch (error) {
    console.error("[v0] AES encryption failed:", error)
    throw new Error("Failed to encrypt data")
  }
}

/**
 * AES Decrypt
 */
export function aesDecrypt(encryptedBase64: string, keyBytes: Buffer): string {
  try {
    const decipher = crypto.createDecipheriv(AES_ALGO, keyBytes, null)
    decipher.setAutoPadding(true)

    let decrypted = decipher.update(encryptedBase64, "base64", "utf8")
    decrypted += decipher.final("utf8")
    return decrypted
  } catch (error) {
    console.error("[v0] AES decryption failed:", error)
    throw new Error("Failed to decrypt data")
  }
}

/**
 * =========================
 * GST KEY CHAIN
 * =========================
 */

/**
 * Decrypt Auth SEK using AppKey
 */
export function decryptAuthSEK(encryptedAuthSEK: string, appKeyBase64: string): string {
  return aesDecrypt(encryptedAuthSEK, appKeyToBytes(appKeyBase64))
}

/**
 * Decrypt API EK using Auth EK
 */
export function decryptApiEK(encryptedApiEK: string, authEKBase64: string): string {
  return aesDecrypt(encryptedApiEK, Buffer.from(authEKBase64, "base64"))
}

/**
 * Decrypt GST Payload using API EK
 */
export function decryptPayload(encryptedPayload: string, apiEKBase64: string): any {
  const decrypted = aesDecrypt(encryptedPayload, Buffer.from(apiEKBase64, "base64"))
  return JSON.parse(decrypted)
}

/**
 * Encrypt GST Payload using SEK
 */
export function encryptPayload(payload: any, sekBase64: string): string {
  const plainText = JSON.stringify(payload)
  return aesEncrypt(plainText, Buffer.from(sekBase64, "base64"))
}

/**
 * =========================
 * COMPLETE GST SESSION
 * =========================
 */

/**
 * Create GST Session
 * @param gstPublicKeyPem - Sandbox or Prod public key (if not provided, uses placeholder)
 * @param debug - Enable AppKey print (LOCAL ONLY)
 */
export function createGSTSession(
  gstPublicKeyPem?: string,
  debug = false,
): {
  appKey: string
  encryptedAppKey: string
} {
  const appKey = generateAppKey()

  if (debug) {
    console.log("====================================")
    console.log("🔐 GST AppKey Generated (DEBUG ONLY)")
    console.log("AppKey (Base64):")
    console.log(appKey)
    console.log("====================================")
  }

  // Use provided key or fallback to placeholder
  const publicKey = gstPublicKeyPem || GST_SANDBOX_PUBLIC_KEY_PLACEHOLDER

  if (!gstPublicKeyPem) {
    console.warn("[v0] Using placeholder public key - RSA encryption skipped")
    return {
      appKey,
      encryptedAppKey: "", // Will be provided from working cURL example
    }
  }

  const encryptedAppKey = encryptAppKeyRSA(appKey, publicKey)

  return {
    appKey, // KEEP IN MEMORY/REDIS ONLY
    encryptedAppKey, // Send to GST Auth API
  }
}

/**
 * Get GST Sandbox Public Key Placeholder
 */
export function getGSTSandboxPublicKey(): string {
  return GST_SANDBOX_PUBLIC_KEY_PLACEHOLDER
}
