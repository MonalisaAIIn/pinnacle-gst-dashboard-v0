# Pinnacle GST Analytical Dashboard

A comprehensive GST compliance and analytics platform built for Chartered Accountants, Businesses, and Individuals.

## Features

- **OTP-Based Authentication** - Secure phone/email based login system
- **GSTIN Integration** - Connect and sync GST accounts via GSP APIs
- **Dashboard Analytics** - Real-time insights on sales, purchases, and tax liabilities
- **ITC Management** - Track Input Tax Credit with vendor-wise ledgers
- **Compliance Tracking** - Monitor filing status, alerts, and notices
- **Multi-User Roles** - Support for Individual, Business, and CA accounts
- **Subscription Plans** - Freemium model with premium features
- **Export Reports** - Generate PDF and Excel reports

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL
- **Caching**: Redis
- **Authentication**: JWT with OTP verification
- **External APIs**: GSP (GSTN Gateway Service Provider)

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- Redis 6+

### Installation

1. Clone the repository
\`\`\`bash
git clone <repository-url>
cd pinnacle-gst-dashboard
\`\`\`

2. Install dependencies
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables
\`\`\`bash
cp .env.example .env
\`\`\`

Update the `.env` file with your configuration:
- Database credentials
- Redis URL
- JWT secrets
- GSP API credentials

4. Set up the database
\`\`\`bash
# Run the SQL scripts in order
psql -U username -d database_name -f scripts/001-create-tables.sql
psql -U username -d database_name -f scripts/002-seed-data.sql
\`\`\`

5. Run the development server
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

\`\`\`
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/              # Authentication endpoints
│   │   ├── gsp/               # GSP integration endpoints
│   │   ├── export/            # Report export endpoints
│   │   └── subscription/      # Subscription management
│   ├── auth/                  # Auth pages (login, verify)
│   ├── dashboard/             # Dashboard pages
│   └── providers.tsx          # App providers
├── components/                # Reusable components
│   ├── ui/                    # shadcn/ui components
│   └── dashboard-*.tsx        # Dashboard-specific components
├── hooks/                     # Custom React hooks
│   └── use-auth.tsx          # Authentication hook
├── lib/                       # Utility libraries
│   ├── db.ts                 # PostgreSQL client
│   ├── redis.ts              # Redis client
│   ├── gsp-client.ts         # GSP API wrapper
│   ├── auth.ts               # NextAuth config
│   └── api-client.ts         # Frontend API client
├── scripts/                   # Database scripts
│   ├── 001-create-tables.sql
│   └── 002-seed-data.sql
└── types/                     # TypeScript types
\`\`\`

## API Documentation

### Authentication

**POST** `/api/auth/otp` - Request OTP
\`\`\`json
{
  "phone": "+919999999999",
  "email": "user@example.com" // optional
}
\`\`\`

**POST** `/api/auth/verify` - Verify OTP
\`\`\`json
{
  "phone": "+919999999999",
  "otp": "123456",
  "email": "user@example.com" // optional
}
\`\`\`

### GSP Integration

**POST** `/api/gsp/connect` - Connect GSTIN
\`\`\`json
{
  "gstin": "27AAPFU0939F1ZV",
  "action": "REQUEST_OTP" | "VERIFY_OTP",
  "otp": "123456", // for VERIFY_OTP
  "txn": "transaction_id" // for VERIFY_OTP
}
\`\`\`

**GET** `/api/gsp/fetch-returns` - Fetch GST returns
\`\`\`
Query params: gstin, return_period (MMYYYY), return_type (gstr3b|gstr2b|gstr1)
\`\`\`

### Subscription

**GET** `/api/subscription` - Get user subscription
**POST** `/api/subscription` - Create/upgrade subscription

### Export

**POST** `/api/export/pdf` - Export PDF report
**POST** `/api/export/excel` - Export Excel report

## Environment Variables

See `.env.example` for all required environment variables.

## Database Schema

The application uses PostgreSQL with the following main tables:
- `users` - User accounts
- `gstins` - Connected GST numbers
- `subscriptions` - User subscription plans
- `invoices` - Sales/purchase transactions
- `itc_ledgers` - ITC tracking
- `compliance_alerts` - Compliance notifications
- `filing_status` - Return filing status

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Database Setup

Use a managed PostgreSQL service:
- AWS RDS
- Supabase
- Neon
- Railway

### Redis Setup

Use a managed Redis service:
- AWS ElastiCache
- Upstash
- Redis Cloud

## Contributing

Contributions are welcome! Please follow the standard fork-and-pull request workflow.

## License

© 2025 Pinnacle Consultancy Group. All rights reserved.
