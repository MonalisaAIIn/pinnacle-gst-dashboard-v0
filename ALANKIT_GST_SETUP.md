# Alankit GST API - Sandbox Setup Guide

This guide explains how to configure and use the Alankit GST Sandbox API for testing GST Portal integration with full encryption support.

## Prerequisites

1. **Alankit GST Account**: Sign up at [Alankit GST Portal](https://alankitgst.com)
2. **API Subscription Key**: Obtain from your Alankit profile dashboard
3. **Valid GSTIN**: Must be registered on GST Portal with active mobile/email

## Environment Variables

Add the following to your environment variables in the **Vars** section:

\`\`\`env
# Alankit GST API - Required Headers
ALANKIT_SUBSCRIPTION_KEY=ALSND3W3T8r2g7d1h0l6
GSP_CLIENT_ID=l7xxda1af7c62c6c40449602e5a9f448f2ef
GSP_CLIENT_SECRET=5a35ac266ea44bc18fdeb4bed07529d5
GSP_USERNAME=MH_NT4.2446

# Optional: Custom base URL (defaults to sandbox)
GSP_BASE_URL=https://uatapi.alankitgst.com/taxpayerapi/v1.0
\`\`\`

**Note**: The above values are from the working sandbox test. Update them with your actual credentials.

## API Endpoints

The Alankit GST Sandbox uses the following base URL:
\`\`\`
https://uatapi.alankitgst.com/taxpayerapi/v1.0
\`\`\`

### Available Endpoints

1. **Request OTP** - `/api/gsp/request-otp`
   - Initiates GST Portal authentication with encrypted AppKey
   - Sends OTP to registered mobile and email
   - Stores temporary AppKey in Redis (5 minutes)

2. **Verify OTP** - `/api/gsp/verify-otp`
   - Verifies OTP and issues authorization token
   - Decrypts SEK (Session Encryption Key) from response
   - Stores auth token and SEK in Redis (6 hours)

3. **Check Connection** - `/api/gsp/check-connection`
   - Verifies if GSTIN has active session
   - Checks Redis for valid auth token and SEK

4. **Refresh Token** - `/api/gsp/refresh-token`
   - Extends authorization without re-authentication
   - Prevents session expiration

5. **Logout** - `/api/gsp/logout`
   - Terminates GST Portal session
   - Clears stored tokens and SEK from Redis

## Authentication Flow with Encryption

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                 Secure Authentication Flow                   │
└─────────────────────────────────────────────────────────────┘

Step 1: Request OTP
  ├─ Generate random AppKey (32 bytes)
  ├─ Encrypt AppKey with GST Public Key (RSA-2048)
  ├─ Send encrypted AppKey to Alankit API
  ├─ Store AppKey in Redis (5 min expiration)
  └─ User receives OTP via SMS/Email

Step 2: Verify OTP
  ├─ Retrieve AppKey from Redis
  ├─ Send OTP for verification
  ├─ Receive encrypted SEK in response
  ├─ Decrypt SEK using AppKey (AES-256-ECB)
  ├─ Store auth token + SEK in Redis (6 hours)
  └─ Delete temporary AppKey

Step 3: API Operations
  ├─ Retrieve auth token + SEK from Redis
  ├─ Encrypt request payload using SEK
  ├─ Send encrypted request with auth token
  ├─ Receive encrypted response
  └─ Decrypt response using SEK
\`\`\`

## Encryption Details

### RSA Encryption (AppKey)
- **Algorithm**: RSA/PKCS1
- **Key Size**: 2048 bits
- **Purpose**: Encrypt the client-generated AppKey
- **Public Key**: GST Sandbox public key (embedded in code)

### AES Encryption (Payloads)
- **Algorithm**: AES-256-ECB
- **Key Size**: 256 bits (32 bytes)
- **Purpose**: Encrypt/decrypt all API request/response payloads
- **Key Source**: SEK provided by GST Portal

## Redis Storage

### Keys and Expiration

| Key Pattern | Value | TTL | Purpose |
|------------|-------|-----|---------|
| `gst:session:{GSTIN}` | AppKey (Base64) | 5 min | Temporary storage during OTP flow |
| `gst:token:{GSTIN}` | Auth Token | 6 hours | API authentication |
| `gst:sek:{GSTIN}` | SEK (Base64) | 6 hours | Payload encryption key |

### Security Notes
- AppKey is deleted immediately after SEK is obtained
- SEK and tokens expire after 6 hours (matching GST Portal session)
- All keys are stored encrypted in Redis
- No sensitive data in localStorage or cookies

## Testing in Sandbox

### Step-by-Step Testing

1. **Navigate to GST Connection Page**
   \`\`\`
   http://localhost:3000/dashboard/gst-connection
   \`\`\`

2. **Enter Test GSTIN**
   - Use a valid 15-character GSTIN registered on GST Portal
   - Example format: `29AABCT1234F1Z5`

3. **Request OTP**
   - Click "Request OTP" button
   - System generates and encrypts AppKey
   - OTP sent to registered mobile/email

4. **Enter OTP**
   - Check your registered mobile/email for OTP
   - Enter 6-digit OTP in the form
   - Click "Verify OTP"

5. **Connection Established**
   - SEK decrypted and stored securely
   - Ready to make encrypted API calls
   - Session valid for 6 hours

### Debug Mode

For sandbox testing, you can enable debug mode to see encryption details:

\`\`\`typescript
// In lib/gst-crypto-helper.ts
const session = createGSTSession(undefined, true) // Debug enabled
\`\`\`

**⚠️ WARNING**: Never enable debug mode in production!

## API Call Examples

### Request OTP
\`\`\`bash
curl -X POST http://localhost:3000/api/gsp/request-otp \
  -H "Content-Type: application/json" \
  -d '{"gstin": "29AABCT1234F1Z5"}'
\`\`\`

### Verify OTP
\`\`\`bash
curl -X POST http://localhost:3000/api/gsp/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"gstin": "29AABCT1234F1Z5", "otp": "123456"}'
\`\`\`

### Check Connection
\`\`\`bash
curl -X POST http://localhost:3000/api/gsp/check-connection \
  -H "Content-Type: application/json" \
  -d '{"gstin": "29AABCT1234F1Z5"}'
\`\`\`

## Troubleshooting

### Common Issues

**Invalid GSTIN Format**
- Error: "Invalid GSTIN format"
- Solution: Ensure GSTIN is exactly 15 characters

**OTP Not Received**
- Error: OTP not delivered to mobile/email
- Solution: Verify GSTIN is active on GST Portal with correct contact details

**Session Expired**
- Error: "Session expired. Please request OTP again"
- Solution: AppKey expires after 5 minutes. Request new OTP

**Token Expired**
- Error: "No active session found"
- Solution: Auth token expired after 6 hours. Re-authenticate

**Decryption Failed**
- Error: "Failed to decrypt SEK"
- Solution: Check AppKey is correct and not corrupted in Redis

**Subscription Key Error**
- Error: "Unauthorized" or 401 status
- Solution: Verify `ALANKIT_SUBSCRIPTION_KEY` is set correctly in environment variables

### Debugging Steps

1. **Check Environment Variables**
   - Go to Vars section in sidebar
   - Verify `ALANKIT_SUBSCRIPTION_KEY` is present

2. **Check Redis Connection**
   - Ensure Upstash Redis is connected
   - Verify `KV_REST_API_URL` and `KV_REST_API_TOKEN` are set

3. **View Console Logs**
   - Check browser console for client errors
   - Check server logs for API errors
   - Look for `[v0]` prefixed debug messages

4. **Test Redis Storage**
   \`\`\`typescript
   // Check if data is being stored
   const appKey = await redis.get('gst:session:29AABCT1234F1Z5')
   console.log('Stored AppKey:', appKey)
   \`\`\`

## Security Best Practices

### ✅ DO

- Use HTTPS for all API communications
- Store encryption keys only in Redis with expiration
- Delete AppKey immediately after obtaining SEK
- Implement rate limiting on OTP requests
- Monitor for unusual authentication patterns
- Rotate API subscription keys regularly
- Use environment variables for sensitive config

### ❌ DON'T

- Store AppKey or SEK in localStorage
- Log encryption keys in production
- Disable SSL certificate validation
- Reuse AppKey across sessions
- Store GSTIN passwords anywhere
- Share API subscription keys
- Commit .env files to version control

## Production Migration

When ready to move to production:

### 1. Obtain Production Credentials
- Register for production API access with Alankit
- Get production subscription key
- Update environment variables

### 2. Update Configuration
\`\`\`env
# Production settings
ALANKIT_SUBSCRIPTION_KEY=production_key_here
GSP_BASE_URL=https://api.alankitgst.com/taxpayerapi/v1.0
\`\`\`

### 3. Update Public Key
- Obtain GST production public key
- Update in `lib/gst-crypto-helper.ts`
- Test encryption with production key

### 4. Testing Checklist
- [ ] Test with real GSTIN in sandbox first
- [ ] Verify OTP delivery
- [ ] Confirm token refresh works
- [ ] Test full API call cycle
- [ ] Monitor error rates
- [ ] Load test authentication flow
- [ ] Verify Redis TTL values
- [ ] Check encryption/decryption performance

### 5. Monitoring
- Set up alerts for authentication failures
- Monitor Redis key expiration
- Track API response times
- Log encryption errors
- Monitor rate limit violations

## Additional Resources

### Documentation
- [GST Crypto Implementation Guide](./GST_CRYPTO_IMPLEMENTATION.md)
- [GSTN API Documentation](https://developer.gstsystem.in/)
- [Alankit GST API Docs](https://alankitgst.com/docs)

### Code Files
- `lib/gst-crypto-helper.ts` - Encryption utilities
- `lib/alankit-gst-api.ts` - API client with crypto integration
- `lib/redis.ts` - Session storage functions
- `app/api/gsp/*` - API route handlers

## Support

### Alankit Support
- Email: support@alankitgst.com
- Phone: +91-XXX-XXX-XXXX
- Documentation: https://alankitgst.com/docs

### Technical Issues
- Check Redis connection in Upstash dashboard
- Review encryption implementation in crypto helper
- Verify environment variables are set correctly
- Test with sandbox GSTIN first

## Appendix: Sample GST Sandbox Public Key

The sandbox public key is embedded in `lib/gst-crypto-helper.ts`. For production, obtain the official key from GSTN.

\`\`\`
-----BEGIN PUBLIC KEY-----
[Public key is embedded in code]
-----END PUBLIC KEY-----
\`\`\`

**Note**: Production public key will be different. Update before going live!
