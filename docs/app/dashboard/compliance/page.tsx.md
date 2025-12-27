# GST Compliance Dashboard Page

## Overview  
This **CompliancePage** component renders the GST compliance dashboard under `/dashboard/compliance`. It leverages a common layout wrapper, displays key compliance metrics, lists active alerts, and offers actionable insights. The page also integrates SMS notifications for real-time alerting. 

## Dependencies  
This file imports UI components and helpers from the design system as well as custom notification logic.

| Module                               | Source                                           | Purpose                             |
|--------------------------------------|--------------------------------------------------|-------------------------------------|
| DashboardLayout                      | `@/components/dashboard-layout`                  | Wraps page content with sidebar/header layout |
| Card, CardHeader, CardContent, CardTitle | `@/components/ui/card`                       | Encapsulate content in styled cards |
| Badge                                | `@/components/ui/badge`                          | Highlight status/severity           |
| Button                               | `@/components/ui/button`                         | Action triggers                     |
| Table, TableHeader, TableRow, TableHead, TableBody, TableCell | `@/components/ui/table`   | Display tabular alert data         |
| CheckCircle, Clock, FileWarning      | `lucide-react`                                   | SVG icons for insights              |
| SMSNotificationButton                | `@/components/sms-notification-button`           | Sends SMS notifications  |

```tsx
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, FileWarning } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SMSNotificationButton } from "@/components/sms-notification-button"
```  

## Data Model  
The page defines a static array of alerts:

| Field       | Type    | Description                               |
|-------------|---------|-------------------------------------------|
| `type`      | string  | Alert category (e.g., “GSTR-3B Filing”)   |
| `description` | string | Brief summary of the issue               |
| `period`    | string  | Reporting period (e.g., “July 2023”)      |
| `severity`  | string  | One of **Critical**, **High**, **Medium**, **Low** |

```ts
const complianceAlerts = [
  {
    type: "GSTR-3B Filing",
    description: "Missing GSTR-3B for July 2023",
    period: "July 2023",
    severity: "Critical",
  },
  // … more alerts …
]
``` 

## Layout Structure  
- **Header**: Title and subtitle  
- **Metrics Cards**: Four key scores in a responsive grid  
- **Alerts Table**: Paginated list of compliance issues  
- **Insights Cards**: Quick summary of performance, action items, vendor monitoring  
- **Footer**: © 2025 Pinnacle GST Analytical Dashboard

## Compliance Score Cards  
Displays overall compliance metrics in colored cards.

| Metric                | Value       | Unit | Color Theme    |
|-----------------------|-------------|------|----------------|
| Overall Compliance Score | **82**     | /100 | Blue (`from-white to-blue-50`) |
| Filing Frequency      | **95**      | %    | Green (`from-white to-green-50`) |
| Vendor Compliance     | **88**      | %    | Emerald (`from-white to-emerald-50`) |
| ITC Gap Score         | **2.5**     | %    | Yellow (`from-white to-yellow-50`) |

## Compliance Alerts ⚠️  
A table lists each alert with dynamic styling based on severity.

| Type              | Description                                  | Period        | Severity     | Action        |
|-------------------|----------------------------------------------|---------------|--------------|---------------|
| GSTR-3B Filing    | Missing GSTR-3B for July 2023                | July 2023     | ![#f87171](https://via.placeholder.com/10/f87171?text=+) Critical | **Resolve Now** / SMS |
| Vendor Filing     | Vendor GSTIN X not filed GSTR-1 for August…  | August 2023   | ![#fb923c](https://via.placeholder.com/10/fb923c?text=+) High     | View Details / SMS |
| ITC Mismatch      | ITC mismatch detected in GSTR-2A vs…         | September 2023| ![#fde047](https://via.placeholder.com/10/fde047?text=+) Medium   | View Details / SMS |
| ITC Reversal      | Input tax credit reversal required…          | Q2 FY23-24    | ![#fb923c](https://via.placeholder.com/10/fb923c?text=+) High     | View Details / SMS |
| Tax Discrepancy   | Tax liability discrepancy identified for Q3  | Q3 FY23-24    | ![#fde047](https://via.placeholder.com/10/fde047?text=+) Medium   | View Details / SMS |
| Export Docs       | Incomplete documentation for exports         | October 2023  | ![#bfdbfe](https://via.placeholder.com/10/bfdbfe?text=+) Low     | View Details / SMS |

```tsx
{complianceAlerts.map((alert, idx) => (
  <TableRow key={idx} className="hover:bg-slate-50">
    <TableCell className="font-medium">{alert.type}</TableCell>
    <TableCell className="max-w-md">{alert.description}</TableCell>
    <TableCell>{alert.period}</TableCell>
    <TableCell>
      <Badge
        variant="secondary"
        className={
          alert.severity === "Critical"
            ? "bg-red-100 text-red-700"
            : alert.severity === "High"
            ? "bg-orange-100 text-orange-700"
            : alert.severity === "Medium"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-blue-100 text-blue-700"
        }
      >
        {alert.severity}
      </Badge>
    </TableCell>
    <TableCell>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className={alert.severity === "Critical" ? "border-red-300 text-red-700 hover:bg-red-50" : ""}
        >
          {alert.severity === "Critical" ? "Resolve Now" : "View Details"}
        </Button>
        <SMSNotificationButton
          alertType={alert.type}
          description={alert.description}
          period={alert.period}
          severity={alert.severity}
        />
      </div>
    </TableCell>
  </TableRow>
))}
```  
*Severity-driven badge and button logic.* 

## SMS Notifications 📱  
The **SMSNotificationButton** component triggers an API call to send compliance alerts via SMS. It shows a loading spinner and uses toast notifications for success or error feedback. 

## Compliance Insights 💡  
Three insight cards summarize overall health:

- **Strong Performance** (green) with a check icon  
- **Action Required** (yellow) with a clock icon  
- **Vendor Monitoring** (blue) with a warning icon  

## Footer  
A centered footer displays copyright.

```tsx
<p className="text-center text-sm text-slate-500 pt-6 border-t border-slate-200">
  © 2025 Pinnacle GST Analytical Dashboard. All rights reserved.
</p>
```

---

*This documentation covers the structure, data flow, and UI patterns of the **CompliancePage** component.*