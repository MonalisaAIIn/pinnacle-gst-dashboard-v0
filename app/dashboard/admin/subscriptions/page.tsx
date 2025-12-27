import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Download, TrendingUp } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const subscriptions = [
  {
    customer: "Acme Corp",
    email: "acme@example.com",
    plan: "Enterprise",
    status: "Active",
    startDate: "2023-01-01",
    endDate: "2024-01-01",
    monthlyPrice: "$99.99",
  },
  {
    customer: "Globex Inc.",
    email: "globex@example.com",
    plan: "Pro",
    status: "Pending",
    startDate: "2023-02-15",
    endDate: "2024-02-15",
    monthlyPrice: "$49.99",
  },
  {
    customer: "Soylent Corp",
    email: "soylent@example.com",
    plan: "Basic",
    status: "Cancelled",
    startDate: "2023-03-01",
    endDate: "2023-09-01",
    monthlyPrice: "$19.99",
  },
  {
    customer: "Initech LLC",
    email: "initech@example.com",
    plan: "Pro",
    status: "Active",
    startDate: "2023-04-20",
    endDate: "2024-04-20",
    monthlyPrice: "$49.99",
  },
  {
    customer: "Umbrella Corp",
    email: "umbrella@example.com",
    plan: "Enterprise",
    status: "Suspended",
    startDate: "2023-05-10",
    endDate: "2024-05-10",
    monthlyPrice: "$99.99",
  },
  {
    customer: "Weyland-Yutani",
    email: "weyland@example.com",
    plan: "Basic",
    status: "Active",
    startDate: "2023-06-01",
    endDate: "2024-06-01",
    monthlyPrice: "$19.99",
  },
]

export default function SubscriptionsPage() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Subscription Management</h1>
          <p className="text-slate-600 mt-1">Manage all customer subscriptions, plans, and their states</p>
        </div>

        {/* Subscription Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-blue-100 bg-gradient-to-br from-white to-blue-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Total Active Subscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">6</div>
              <div className="flex items-center gap-1 mt-2 text-sm">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-green-600 font-medium">+5% last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-100 bg-gradient-to-br from-white to-green-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Monthly Recurring Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">$369.94</div>
              <div className="flex items-center gap-1 mt-2 text-sm">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-green-600 font-medium">+2.3% last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-100 bg-gradient-to-br from-white to-red-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Cancelled Subscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">1</div>
              <p className="text-sm text-slate-600 mt-2">0.8% decrease</p>
            </CardContent>
          </Card>

          <Card className="border-purple-100 bg-gradient-to-br from-white to-purple-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">New Subscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">3</div>
              <p className="text-sm text-green-600 mt-2">+3 last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Subscriptions Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>All Subscriptions</CardTitle>
                <CardDescription className="mt-1">Monitor and manage customer subscription plans</CardDescription>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input placeholder="Search subscriptions..." className="pl-10" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all-plans">
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="All Plans" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-plans">All Plans</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-slate-200">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold">Customer Name</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">Plan</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Start Date</TableHead>
                    <TableHead className="font-semibold">End Date</TableHead>
                    <TableHead className="font-semibold">Monthly Price</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions.map((subscription, index) => (
                    <TableRow key={index} className="hover:bg-slate-50">
                      <TableCell className="font-medium">{subscription.customer}</TableCell>
                      <TableCell className="text-sm text-slate-600">{subscription.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            subscription.plan === "Enterprise"
                              ? "bg-purple-100 text-purple-700"
                              : subscription.plan === "Pro"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-green-100 text-green-700"
                          }
                        >
                          {subscription.plan}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            subscription.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : subscription.status === "Pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : subscription.status === "Cancelled"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-orange-100 text-orange-700"
                          }
                        >
                          {subscription.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{subscription.startDate}</TableCell>
                      <TableCell className="text-sm">{subscription.endDate}</TableCell>
                      <TableCell className="font-medium">{subscription.monthlyPrice}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-slate-500 pt-6 border-t border-slate-200">
          © 2025 Pinnacle GST Analytical Dashboard. All rights reserved.
        </p>
      </div>
    </DashboardLayout>
  )
}
