"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { FileSpreadsheet, FileText, Download, CheckCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ExportPage() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)

  const handleExport = (type: string) => {
    console.log(`Exporting ${type}`)
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Export & Settings</h1>
          <p className="text-slate-600 mt-1">Manage your data exports and personalize your application settings</p>
        </div>

        {/* Export Data Section */}
        <Card>
          <CardHeader>
            <CardTitle>Export Data</CardTitle>
            <CardDescription>Download your GST data in various formats</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date Range (optional)</Label>
                <Select defaultValue="last-30">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-30">Last 30 days</SelectItem>
                    <SelectItem value="last-90">Last 90 days</SelectItem>
                    <SelectItem value="this-year">This Year</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>File Format</Label>
                <Select defaultValue="excel">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-blue-100 bg-blue-50/50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <FileSpreadsheet className="h-8 w-8 text-blue-600 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900">Export to Excel</h4>
                      <p className="text-sm text-slate-600 mt-1">Download comprehensive data in Excel format</p>
                      <Button
                        size="sm"
                        className="mt-3 bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleExport("excel")}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export Excel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-100 bg-red-50/50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <FileText className="h-8 w-8 text-red-600 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900">Export to PDF</h4>
                      <p className="text-sm text-slate-600 mt-1">Generate formatted PDF reports</p>
                      <Button
                        size="sm"
                        className="mt-3 bg-red-600 hover:bg-red-700"
                        onClick={() => handleExport("pdf")}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export PDF
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-100 bg-green-50/50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <FileSpreadsheet className="h-8 w-8 text-green-600 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900">Export Transactions (CSV)</h4>
                      <p className="text-sm text-slate-600 mt-1">Download transaction data in CSV</p>
                      <Button
                        size="sm"
                        className="mt-3 bg-green-600 hover:bg-green-700"
                        onClick={() => handleExport("csv")}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-100 bg-purple-50/50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <FileText className="h-8 w-8 text-purple-600 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900">Export Summary Report</h4>
                      <p className="text-sm text-slate-600 mt-1">Get executive summary in PDF</p>
                      <Button
                        size="sm"
                        className="mt-3 bg-purple-600 hover:bg-purple-700"
                        onClick={() => handleExport("summary")}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export Summary
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
              Initiate Export
            </Button>
          </CardContent>
        </Card>

        {/* User Settings */}
        <Card>
          <CardHeader>
            <CardTitle>User Settings</CardTitle>
            <CardDescription>Update your profile, notification preferences, and GSTIN status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Profile Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" defaultValue="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue="john.doe@example.com" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">Email Notifications</p>
                    <p className="text-sm text-slate-600">Receive updates and alerts via email</p>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">SMS Notifications</p>
                    <p className="text-sm text-slate-600">Get critical alerts directly to your phone</p>
                  </div>
                  <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">GSTIN Connection Status</h3>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-slate-900">Current Status</p>
                      <Badge className="bg-green-100 text-green-700">Connected</Badge>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">Your GSTIN data is securely connected</p>
                    <Button variant="outline" size="sm" className="mt-3 bg-white">
                      Re-verify GSTIN
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700">Save Settings</Button>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-slate-500 pt-6 border-t border-slate-200">
          © 2025 Pinnacle GST Analytical Dashboard. All rights reserved.
        </p>
      </div>
    </DashboardLayout>
  )
}
