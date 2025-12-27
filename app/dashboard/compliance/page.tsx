import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, FileWarning } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SMSNotificationButton } from "@/components/sms-notification-button"

const complianceAlerts = [
  {
    type: "GSTR-3B Filing",
    description: "Missing GSTR-3B for July 2023",
    period: "July 2023",
    severity: "Critical",
  },
  {
    type: "Vendor Filing",
    description: "Vendor GSTIN X not filed GSTR-1 for August 2023",
    period: "August 2023",
    severity: "High",
  },
  {
    type: "ITC Mismatch",
    description: "ITC mismatch detected in GSTR-2A vs Purchase Register",
    period: "September 2023",
    severity: "Medium",
  },
  {
    type: "ITC Reversal",
    description: "Input tax credit reversal required for non-payment to vendor",
    period: "Q2 FY23-24",
    severity: "High",
  },
  {
    type: "Tax Discrepancy",
    description: "Tax liability discrepancy identified for Q3",
    period: "Q3 FY23-24",
    severity: "Medium",
  },
  {
    type: "Export Docs",
    description: "Incomplete documentation for exports",
    period: "October 2023",
    severity: "Low",
  },
]

export default function CompliancePage() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">GST Compliance Dashboard</h1>
          <p className="text-slate-600 mt-1">
            Monitor your GST compliance status, track key metrics, and get real-time alerts on potential issues.
          </p>
        </div>

        {/* Compliance Score Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-blue-100 bg-gradient-to-br from-white to-blue-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Overall Compliance Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2">
                <div className="text-5xl font-bold text-blue-600">82</div>
                <div className="text-xl text-slate-500 mb-1">/ 100</div>
              </div>
              <p className="text-sm text-slate-600 mt-2">Good compliance standing</p>
            </CardContent>
          </Card>

          <Card className="border-green-100 bg-gradient-to-br from-white to-green-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Filing Frequency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2">
                <div className="text-5xl font-bold text-green-600">95</div>
                <div className="text-xl text-slate-500 mb-1">%</div>
              </div>
              <p className="text-sm text-slate-600 mt-2">On-time return submissions</p>
            </CardContent>
          </Card>

          <Card className="border-emerald-100 bg-gradient-to-br from-white to-emerald-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Vendor Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2">
                <div className="text-5xl font-bold text-emerald-600">88</div>
                <div className="text-xl text-slate-500 mb-1">%</div>
              </div>
              <p className="text-sm text-slate-600 mt-2">Based on vendor GSTR-1 filings</p>
            </CardContent>
          </Card>

          <Card className="border-yellow-100 bg-gradient-to-br from-white to-yellow-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">ITC Gap Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2">
                <div className="text-5xl font-bold text-yellow-600">2.5</div>
                <div className="text-xl text-slate-500 mb-1">%</div>
              </div>
              <p className="text-sm text-slate-600 mt-2">Mismatch between GSTR-2A & purchases</p>
            </CardContent>
          </Card>
        </div>

        {/* Compliance Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Compliance Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-slate-200">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold">Type</TableHead>
                    <TableHead className="font-semibold">Description</TableHead>
                    <TableHead className="font-semibold">Period</TableHead>
                    <TableHead className="font-semibold">Severity</TableHead>
                    <TableHead className="font-semibold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {complianceAlerts.map((alert, index) => (
                    <TableRow key={index} className="hover:bg-slate-50">
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
                            className={
                              alert.severity === "Critical" ? "border-red-300 text-red-700 hover:bg-red-50" : ""
                            }
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
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-slate-900">Strong Performance</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Your filing frequency is excellent with 95% on-time submissions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Clock className="h-6 w-6 text-yellow-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-slate-900">Action Required</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    1 critical alert requires immediate attention to maintain compliance.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <FileWarning className="h-6 w-6 text-blue-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-slate-900">Vendor Monitoring</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    88% of your vendors are compliant with their GST filing obligations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <p className="text-center text-sm text-slate-500 pt-6 border-t border-slate-200">
          © 2025 Pinnacle GST Analytical Dashboard. All rights reserved.
        </p>
      </div>
    </DashboardLayout>
  )
}
