# Pinnacle GST Dashboard - Local Testing with Cloud Services

## Overview

This guide helps you run the GST Dashboard **locally on your machine** while connecting to **cloud-based databases and services**. You don't need to install PostgreSQL or Redis locally.

## Quick Start

### 1. Install Node.js Dependencies

\`\`\`bash
npm install
# or
yarn install
\`\`\`

### 2. Set Up Cloud Services

You need to create accounts and get credentials from these cloud providers:

#### Required Services:

**A. Cloud PostgreSQL Database** (Choose one):
- **Neon** (Recommended): https://neon.tech - Free tier available
- **Supabase**: https://supabase.com - Free tier available
- **Railway**: https://railway.app - PostgreSQL addon
- **PlanetScale**: https://planetscale.com - MySQL alternative

**B. Cloud Redis** (Choose one):
- **Upstash Redis** (Recommended): https://upstash.com - Free tier available
- **Redis Cloud**: https://redis.com - Free tier available
- **Railway**: https://railway.app - Redis addon

**C. GSP Provider Credentials**:
- Contact your GSP provider (Adaequare, IRIS, etc.) to get:
  - API Key
  - Username
  - Client ID
  - Client Secret

### 3. Create Database Tables

After getting your database URL, you need to create the tables:

#### Option 1: Using Neon or Supabase Dashboard
1. Go to your database dashboard
2. Open SQL Editor
3. Copy contents of `database/schema.sql`
4. Execute the SQL

#### Option 2: Using psql command (if you have PostgreSQL client)
\`\`\`bash
psql "your-database-url-here" -f database/schema.sql
\`\`\`

#### Option 3: Automatic (on first run)
The app will attempt to create tables automatically on first API call.

### 4. Configure Environment Variables

1. Copy the environment template:
\`\`\`bash
cp .env.local .env.local
\`\`\`

2. Open `.env.local` and fill in your cloud credentials:

**Minimum Required Configuration:**

\`\`\`env
# Database (from Neon/Supabase)
DATABASE_URL=postgresql://user:password@host.region.provider.com:5432/database?sslmode=require

# Redis (from Upstash)
REDIS_URL=redis://default:password@host.upstash.io:6379

# JWT Secrets (generate these)
JWT_SECRET=your-random-32-character-secret
NEXTAUTH_SECRET=your-another-random-32-character-secret

# GSP API (from your GSP provider)
GSP_API_KEY=your-gsp-api-key
GSP_USERNAME=your-gsp-username
GSP_CLIENT_ID=your-gsp-client-id
GSP_CLIENT_SECRET=your-gsp-client-secret
\`\`\`

**Generate JWT Secrets:**
\`\`\`bash
# Run this twice to get two different secrets
openssl rand -base64 32
\`\`\`

Or use: https://generate-secret.vercel.app/32

### 5. Run the Application

\`\`\`bash
npm run dev
\`\`\`

Open http://localhost:3000 in your browser.

## Detailed Service Setup

### Setting up Neon PostgreSQL (Recommended)

1. Go to https://neon.tech and sign up
2. Create a new project
3. Copy the connection string from dashboard
4. Format: `postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`
5. Paste into `DATABASE_URL` in `.env.local`

### Setting up Upstash Redis (Recommended)

1. Go to https://console.upstash.com and sign up
2. Create a new Redis database
3. Copy the connection URL
4. Format: `redis://default:password@region-12345.upstash.io:6379`
5. Paste into `REDIS_URL` in `.env.local`

### Setting up Razorpay (For Payments)

1. Go to https://dashboard.razorpay.com and sign up
2. Get API keys from Settings > API Keys
3. Use test mode keys for local development
4. Add to `.env.local`:
\`\`\`env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your-secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
\`\`\`

### Setting up Email (Optional)

**Using Gmail:**
1. Enable 2-factor authentication on your Google account
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Add to `.env.local`:
\`\`\`env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-16-char-app-password
\`\`\`

## Testing the Application

### 1. Test Database Connection

The app will automatically test database connection on startup. Check terminal for:
\`\`\`
✓ Database connected successfully
✓ Redis connected successfully
\`\`\`

### 2. Test Authentication Flow

1. Go to http://localhost:3000
2. Click "Login with Mobile/Email"
3. Enter mobile number or email
4. Check terminal for OTP (if email/SMS not configured)
5. Enter OTP and login

### 3. Test GSP Integration

1. Navigate to "GST Connection" page
2. Enter your GSTIN username
3. Complete OTP verification
4. View synced GST data in dashboard

### 4. Test Exports

1. Go to any data page (Sales, ITC, etc.)
2. Click "Export" button
3. Choose format (PDF/Excel)
4. File will download or save to cloud storage

## Troubleshooting

### Database Connection Failed
\`\`\`
Error: connect ETIMEDOUT
\`\`\`
**Solutions:**
- Verify `DATABASE_URL` is correct
- Check if `?sslmode=require` is added
- Ensure IP allowlist includes 0.0.0.0/0 (for development)
- Test connection using: `psql "your-database-url"`

### Redis Connection Failed
\`\`\`
Error: ECONNREFUSED
\`\`\`
**Solutions:**
- Verify `REDIS_URL` format is correct
- Test using: `redis-cli -u "your-redis-url" PING`
- Check Upstash dashboard for connection details

### GSP API Errors
\`\`\`
Error: Invalid GSP credentials
\`\`\`
**Solutions:**
- Verify all GSP credentials are correct
- Ensure using sandbox URL for testing
- Contact GSP provider to verify account status

### JWT Token Invalid
\`\`\`
Error: jwt malformed
\`\`\`
**Solutions:**
- Ensure `JWT_SECRET` is at least 32 characters
- Don't use spaces or special characters in secrets
- Regenerate secrets if unsure

## Production Deployment

When ready to deploy:

1. **Push to GitHub**
2. **Deploy to Vercel**:
   - Import repository
   - Add all environment variables
   - Deploy

3. **Update environment variables** for production:
   - Use production database
   - Use production Redis
   - Update `GSP_BASE_URL` to production endpoint
   - Use production Razorpay keys
   - Update `NEXTAUTH_URL` to your domain

## Architecture

\`\`\`
Your Local Machine          Cloud Services
┌─────────────────┐        ┌──────────────────┐
│                 │        │                  │
│  Next.js App    │────────│  Neon Database   │
│  (localhost)    │        │  (PostgreSQL)    │
│                 │        │                  │
│                 │────────│  Upstash Redis   │
│                 │        │                  │
│                 │────────│  GSP API         │
│                 │        │  (GSTN Gateway)  │
│                 │        │                  │
└─────────────────┘        └──────────────────┘
\`\`\`

## Support

For issues or questions:
- Check logs in terminal
- Review `.env.local` configuration
- Verify cloud service dashboards
- Email: support@pinnaclegroup.com

## Next Steps

After local testing is successful:
1. Review and test all features
2. Make necessary frontend/backend changes
3. Deploy to Vercel for production
4. Configure custom domain
5. Set up monitoring and alerts
