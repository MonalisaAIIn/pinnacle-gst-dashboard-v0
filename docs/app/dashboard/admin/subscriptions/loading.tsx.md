# Pinnacle GST Analytical Dashboard

A comprehensive **GST compliance and analytics platform** built with Next.js, TypeScript, and Tailwind CSS. It offers OTP-based authentication, GSP integration, rich dashboards, subscription management, and data export features for Individuals, Businesses, CAs, and Admins.

---

## Project Structure 📁

The repository follows the Next.js App Router convention and a modular design. Key folders and files:

| Path                                         | Purpose                                                    |
|----------------------------------------------|------------------------------------------------------------|
| `app/layout.tsx`                             | Root layout: fonts, metadata, global providers.            |
| `app/page.tsx`                               | Home route: redirects to login.                            |
| `app/providers.tsx`                          | Wraps app with authentication context.                     |
| `app/auth/*`                                 | OTP-based login and verification pages.                    |
| `app/dashboard/*`                            | Authenticated user dashboards and settings.                |
| `app/dashboard/admin/*`                      | Admin area: dashboards, customer & subscription management.|
| `app/admin/*`                                | Global admin pages (alternate entry point).                |
| `hooks/use-auth.tsx`                         | Authentication context & hooks.                            |
| `hooks/use-toast.ts`                         | Custom toast notification management.                      |
| `lib/api-client.ts`                          | Client‐side API helper with mock data option.              |
| `lib/alankit-gst-api.ts`                     | Encrypted GSP (GSTN) API integration.                      |
| `scripts/001-create-tables.sql`              | Database schema definitions.                               |
| `scripts/002-seed-data.sql`                  | Demo data seeding.                                         |
| `components.json`                            | Shadcn/ui configuration.                                   |
| `postcss.config.mjs`                         | PostCSS plugin settings.                                   |

_See detailed structure in README._ 

---

## Routing & Layout

All pages use a shared `DashboardLayout` component (from `@/components/dashboard-layout`) to ensure consistent navigation, header, and sidebar across the app. 

- **RootLayout** (`app/layout.tsx`):  
  Sets up global fonts, `<Providers>`, `<Toaster>` for toasts, and Vercel Analytics.  
- **Providers** (`app/providers.tsx`):  
  Wraps children with `<AuthProvider>` to expose `useAuth()` throughout the app.

```tsx
// app/providers.tsx
"use client"
import { AuthProvider } from "@/hooks/use-auth"

export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}
```

---

## Authentication

### Auth Hook (`hooks/use-auth.tsx`)

Manages user state, OTP-based login (`login`), OTP verification (`verifyOtp`), and `logout`. Persists token and user data in `localStorage` and redirects on successful login.

- **Context**: `AuthContext` with `{ user, loading, login, verifyOtp, logout }`.
- **Login**: requests OTP via `/api/auth/otp`.
- **Verify**: sends OTP to `/api/auth/verify`, stores JWT and user.
- **Logout**: clears storage and redirects to `/auth/login`.

---

## Dashboard & Profile

All authenticated users land on `/dashboard`, which redirects to `/dashboard/overview`. Pages include:

- **Overview** (`app/dashboard/overview/page.tsx`): Embeds a `<DashboardOverview />` component.
- **Profile** (`app/dashboard/profile/page.tsx`): Allows users to view and edit personal details.
- **Export & Settings** (`app/dashboard/export/page.tsx`): CSV/PDF export options and notification preferences.
- **GSTIN Connection** (`app/dashboard/gst-connection/page.tsx`): Connect and verify GSTIN via GSP APIs.

Each page uses `Card`, `Button`, `Input`, `Badge`, and icon components from Shadcn UI and Lucide.

---

## Admin Section

### Admin Dashboard (`/dashboard/admin`)

**File:** `app/dashboard/admin/page.tsx`  
**Purpose:** Overview of platform statistics and quick actions for Admins.

- **Stats Grid**: Displays metrics like total customers, active subscriptions, revenue, and churn.
- **Quick Actions**: Buttons linking to customer management, subscription management, and analytics.
- **Recent Customers**: Table listing latest sign-ups with search and pagination.

```tsx
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableBody } from "@/components/ui/table"
// ...

export default function AdminDashboardPage() {
  return (
    <DashboardLayout>
      {/* Stats and quick actions */}
    </DashboardLayout>
  )
}
```
<!-- Cite actual code as needed. -->

#### Admin-Level Loading Fallback

```tsx
// app/dashboard/admin/loading.tsx
export default function Loading() {
  return null;
}
```
_No specific UI; parent route handles loading._ 

---

## Subscription Management

### Subscriptions Page (`/dashboard/admin/subscriptions`)

**File:** `app/dashboard/admin/subscriptions/page.tsx`  
**Purpose:** View and manage all customer subscriptions.

- **Subscription Metrics**: Cards showing active, cancelled, new subscriptions, MRR, etc.
- **Filters & Search**: `Input` for keyword search; `Select` components for status and plan.
- **Data Table**: Paginated table listing customer, plan, status, dates, pricing, with actions.

```tsx
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Download, TrendingUp } from "lucide-react"
import { Table, TableBody, TableCell } from "@/components/ui/table"
// ...

export default function SubscriptionsPage() {
  return (
    <DashboardLayout>
      {/* Metrics, filters, table */}
    </DashboardLayout>
  )
}
```  


#### Loading UI 🎡

```tsx
// app/dashboard/admin/subscriptions/loading.tsx
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full
                     border-4 border-solid border-blue-600
                     border-r-transparent align-[-0.125em]
                     motion-reduce:animate-[spin_1.5s_linear_infinite]"
        />
        <p className="mt-4 text-sm text-slate-600">
          Loading subscriptions...
        </p>
      </div>
    </div>
  )
}
```  
Custom spinner and message while data loads. 

---

## Standalone Admin Area

Some organizations expose a separate `/admin` route:

```tsx
// app/admin/loading.tsx
export default function Loading() {
  return null;
}

// app/admin/page.tsx
"use client"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
// ...
export default function GlobalAdminPage() { /* ... */ }
```

This area mirrors dashboard admin features outside the `/dashboard` layout. 

---

## API Client & GSP Integration

### Client-Side API Helper (`lib/api-client.ts`)

- **`apiRequest<T>(endpoint, options)`**: wraps `fetch` with JSON headers, auth token, and error handling.
- **Mock Mode**: `USE_MOCK_DATA` flag to simulate backend responses for OTP, verification, GSP, and subscriptions.
- **Local Token Storage**: retrieves JWT from `localStorage`.

### Encrypted GSP API Wrapper (`lib/alankit-gst-api.ts`)

Handles **RSA/AES** encryption for secure communication with GST Suvidha Provider (e.g., Alankit):

- `alankitApiRequest()`: attaches subscription key and client credentials.
- `makeEncryptedGstApiCall()`: encrypts payload with session encryption key (SEK) and decrypts responses.

---

## Database Scripts

### 001-create-tables.sql

Defines main tables:

- `users`, `gstins`, `subscriptions`, `invoices`, `itc_ledgers`, `compliance_alerts`, `filing_status`, etc.

### 002-seed-data.sql

Inserts demo users, GSTINs, invoices for testing and development.

---

## Styling & Configuration

- **Shadcn UI**: configured via `components.json`.
- **Tailwind CSS**: global styles in `app/globals.css`; PostCSS config in `postcss.config.mjs`.

--- 

This documentation covers the major files, their responsibilities, and code patterns across the application. It highlights the **loading** spinner component in the subscriptions route, the structure of the **App Router**, authentication via **OTP**, and integration with external **GSP APIs**.