"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Info, Clock } from "lucide-react"
import { ChartSwitcher } from "@/components/chart-switcher"
import { useRouter } from "next/navigation"

const salesPurchaseData = [
  { month: "Jan", income: 4350000, expense: 2900000 },
  { month: "Feb", income: 4700000, expense: 3100000 },
  { month: "Mar", income: 5200000, expense: 3500000 },
  { month: "Apr", income: 4900000, expense: 3300000 },
  { month: "May", income: 5500000, expense: 3700000 },
  { month: "Jun", income: 5800000, expense: 3900000 },
]

const taxLiabilityData = [
  { month: "Jan", taxLiability: 152000, itcClaimed: 166500 },
  { month: "Feb", taxLiability: 160000, itcClaimed: 175000 },
  { month: "Mar", taxLiability: 170000, itcClaimed: 181000 },
  { month: "Apr", taxLiability: 175000, itcClaimed: 190000 },
  { month: "May", taxLiability: 185000, itcClaimed: 195500 },
  { month: "Jun", taxLiability: 190000, itcClaimed: 210000 },
]

const monthlyFilingStatus = [
  { month: "Jan 2024", gstr1: "Filed", gstr3b: "Filed", status: "completed" },
  { month: "Feb 2024", gstr1: "Filed", gstr3b: "Filed", status: "completed" },
  { month: "Mar 2024", gstr1: "Filed", gstr3b: "Filed", status: "completed" },
  { month: "Apr 2024", gstr1: "Filed", gstr3b: "Filed", status: "completed" },
  { month: "May 2024", gstr1: "Due", gstr3b: "Filed", status: "pending" },
  { month: "Jun 2024", gstr1: "Due", gstr3b: "Due", status: "pending" },
]

const notices = [
  { type: "error", message: "Input Tax Credit mismatch detected for Vendor X, Action Required.", time: "2 hours ago" },
  { type: "warning", message: "Upcoming GSTR-3B filing deadline on Jul 20, 2024.", time: "1 day ago" },
  { type: "info", message: "New update available for GST compliance guidelines.", time: "3 days ago" },
  { type: "warning", message: "Potential overpayment of tax identified in Q1 report.", time: "1 week ago" },
  { type: "success", message: "GSTIN linked successfully with new company profile.", time: "2 weeks ago" },
]

export function DashboardOverview() {
  const router = useRouter()

  const handleChartClick = (data: any) => {
    if (data && data.activeLabel) {
      const month = data.activeLabel
      router.push(`/dashboard/sales?month=${month}`)
    }
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Overview</h1>
        <p className="text-slate-600 mt-1 text-sm md:text-base">
          Comprehensive overview of your GST compliance and analytics
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="gradient-pink text-white p-4 md:p-6">
            <CardTitle className="text-xs md:text-sm font-medium text-white/90 mb-2 md:mb-3">
              Outward Tax Liability
            </CardTitle>
            <div className="text-2xl md:text-3xl font-bold">₹18,50,200</div>
            <div className="flex items-center gap-1 mt-2 md:mt-3 text-xs md:text-sm bg-white/20 rounded-full px-2 md:px-3 py-1 w-fit">
              <TrendingUp className="h-3 w-3 md:h-4 md:w-4" />
              <span className="font-medium">+8.2% MOM</span>
            </div>
          </div>
        </Card>

        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="gradient-purple text-white p-4 md:p-6">
            <CardTitle className="text-xs md:text-sm font-medium text-white/90 mb-2 md:mb-3">ITC Claimed</CardTitle>
            <div className="text-2xl md:text-3xl font-bold">₹15,20,150</div>
            <div className="flex items-center gap-1 mt-2 md:mt-3 text-xs md:text-sm bg-white/20 rounded-full px-2 md:px-3 py-1 w-fit">
              <TrendingUp className="h-3 w-3 md:h-4 md:w-4" />
              <span className="font-medium">+5.1% MOM</span>
            </div>
          </div>
        </Card>

        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="gradient-blue text-white p-4 md:p-6">
            <CardTitle className="text-xs md:text-sm font-medium text-white/90 mb-2 md:mb-3">Net Tax Payable</CardTitle>
            <div className="text-2xl md:text-3xl font-bold">₹3,30,050</div>
            <div className="flex items-center gap-1 mt-2 md:mt-3 text-xs md:text-sm bg-white/20 rounded-full px-2 md:px-3 py-1 w-fit">
              <TrendingDown className="h-3 w-3 md:h-4 md:w-4" />
              <span className="font-medium">-12.3% MOM</span>
            </div>
          </div>
        </Card>

        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="gradient-orange text-white p-4 md:p-6">
            <CardTitle className="text-xs md:text-sm font-medium text-white/90 mb-2 md:mb-3">
              Cash vs Credit Utilization
            </CardTitle>
            <div className="text-2xl md:text-3xl font-bold">70%/30%</div>
            <div className="flex items-center gap-1 mt-2 md:mt-3 text-xs md:text-sm bg-white/20 rounded-full px-2 md:px-3 py-1 w-fit">
              <TrendingUp className="h-3 w-3 md:h-4 md:w-4" />
              <span className="font-medium">+2.5% MOM</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader className="border-b border-slate-100 p-4 md:p-6">
          <CardTitle className="text-base md:text-lg">Monthly Filing Status</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 md:pt-6 p-4 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4">
            {monthlyFilingStatus.map((item, index) => (
              <Card
                key={index}
                className={cn(
                  "border-2 transition-all hover:shadow-md",
                  item.status === "completed"
                    ? "border-emerald-200 bg-emerald-50/50"
                    : "border-amber-200 bg-amber-50/50",
                )}
              >
                <CardContent className="p-3 md:p-4">
                  <div className="font-semibold text-slate-900 mb-2 md:mb-3 text-sm md:text-base">{item.month}</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs md:text-sm">
                      <span className="text-slate-600">GSTR-1</span>
                      <Badge
                        variant={item.gstr1 === "Filed" ? "default" : "secondary"}
                        className={cn(
                          "text-xs",
                          item.gstr1 === "Filed"
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0"
                            : "bg-amber-100 text-amber-700 hover:bg-amber-100 border-0",
                        )}
                      >
                        {item.gstr1}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs md:text-sm">
                      <span className="text-slate-600">GSTR-3B</span>
                      <Badge
                        variant={item.gstr3b === "Filed" ? "default" : "secondary"}
                        className={cn(
                          "text-xs",
                          item.gstr3b === "Filed"
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0"
                            : "bg-amber-100 text-amber-700 hover:bg-amber-100 border-0",
                        )}
                      >
                        {item.gstr3b}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        <Card className="border-0 shadow-md">
          <CardHeader className="border-b border-slate-100 p-4 md:p-6">
            <CardTitle className="text-base md:text-lg">Monthly Sales & Purchase Trends</CardTitle>
            <p className="text-xs md:text-sm text-slate-500 mt-1">Click on any bar to view detailed transactions</p>
          </CardHeader>
          <CardContent className="pt-4 md:pt-6 p-4 md:p-6">
            <ChartSwitcher
              data={salesPurchaseData}
              config={{
                income: { label: "Income", color: "#06b6d4" },
                expense: { label: "Expense", color: "#ec4899" },
              }}
              dataKeys={["income", "expense"]}
              xAxisKey="month"
              onChartClick={handleChartClick}
              className="h-64 md:h-80"
            />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader className="border-b border-slate-100 p-4 md:p-6">
            <CardTitle className="text-base md:text-lg">Tax Liability & ITC Over Time</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 md:pt-6 p-4 md:p-6">
            <ChartSwitcher
              data={taxLiabilityData}
              config={{
                taxLiability: { label: "Tax Liability", color: "#8b5cf6" },
                itcClaimed: { label: "ITC Claimed", color: "#f97316" },
              }}
              dataKeys={["taxLiability", "itcClaimed"]}
              xAxisKey="month"
              className="h-64 md:h-80"
            />
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader className="border-b border-slate-100 p-4 md:p-6">
          <CardTitle className="text-base md:text-lg">Recent Notices & Alerts</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 md:pt-6 p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {notices.map((notice, index) => (
              <div
                key={index}
                className="flex gap-3 p-3 md:p-4 bg-slate-50 rounded-xl border border-slate-100 hover:shadow-sm transition-shadow"
              >
                <div className="flex-shrink-0 mt-0.5">
                  {notice.type === "error" && (
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-red-100 flex items-center justify-center">
                      <AlertCircle className="h-3.5 w-3.5 md:h-4 md:w-4 text-red-600" />
                    </div>
                  )}
                  {notice.type === "warning" && (
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-amber-100 flex items-center justify-center">
                      <Clock className="h-3.5 w-3.5 md:h-4 md:w-4 text-amber-600" />
                    </div>
                  )}
                  {notice.type === "info" && (
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Info className="h-3.5 w-3.5 md:h-4 md:w-4 text-blue-600" />
                    </div>
                  )}
                  {notice.type === "success" && (
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                      <CheckCircle className="h-3.5 w-3.5 md:h-4 md:w-4 text-emerald-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm text-slate-900 leading-relaxed">{notice.message}</p>
                  <p className="text-xs text-slate-500 mt-1.5">{notice.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
