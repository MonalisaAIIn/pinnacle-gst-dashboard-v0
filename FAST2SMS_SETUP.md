# Fast2SMS OTP Setup Guide

## Current Configuration

Your app is currently using **Quick SMS Route** which:
- Works immediately without any verification needed
- Sends via random numeric sender ID
- Costs ₹0.25 per SMS (approximate)
- Works 24x7 on all numbers

## To Use Official OTP Route (Requires Website Verification)

Fast2SMS requires website verification to use the dedicated OTP route. Here's how to set it up:

### Option 1: Complete Website Verification (For OTP Route)
1. Go to [Fast2SMS Dashboard](https://www.fast2sms.com/dashboard)
2. Navigate to the "OTP Message" menu
3. Complete the website verification process
4. Once verified, the system will automatically use `route: "otp"` for better OTP delivery

### Option 2: Use DLT SMS API (Recommended for Production)

For production deployments with proper compliance:

#### Step 1: Register Your Sender ID
1. Go to [Fast2SMS DLT Registration](https://www.fast2sms.com/dashboard/dlt-intro)
2. Submit a 3-6 letter Sender ID (e.g., "PNCLGST" for Pinnacle GST)
3. Wait for approval from Fast2SMS

#### Step 2: Register Your OTP Message Template
1. Go to [Fast2SMS Dev API](https://www.fast2sms.com/dashboard/dev-api)
2. Create an OTP template with variable for OTP:
   \`\`\`
   Your OTP for Pinnacle GST login is {#var#}. Valid for 5 minutes. Do not share this OTP.
   \`\`\`
3. Submit for DLT approval
4. Once approved, you'll receive a 6-digit Message ID

#### Step 3: Add Environment Variables
Add these to your environment variables in the Vars section:

\`\`\`env
FAST2SMS_API_KEY=your_api_key (already configured)
FAST2SMS_SENDER_ID=PNCLGST (your approved sender ID)
FAST2SMS_MESSAGE_ID=123456 (your approved 6-digit message ID)
\`\`\`

#### Step 4: Update Code to Use DLT
Once you have DLT credentials, update the code to use the DLT route for compliance and better delivery.

## Benefits of Different Routes

### Quick Route (Current)
- ✅ Works immediately without verification
- ✅ No setup required
- ✅ Good for testing and development
- ❌ Higher cost per SMS
- ❌ Random sender ID

### OTP Route (After Website Verification)
- ✅ Optimized for OTP delivery
- ✅ Better delivery rates
- ✅ Lower cost
- ❌ Requires website verification

### DLT Route (Production)
- ✅ Lowest cost (₹0.15 - ₹0.25 per SMS)
- ✅ Custom sender ID (e.g., "PNCLGST")
- ✅ Best delivery rates
- ✅ Compliant with TRAI regulations
- ❌ Requires DLT registration and approval

## Testing

The app is currently working in Quick mode and will send OTPs successfully. No immediate action needed for testing!
