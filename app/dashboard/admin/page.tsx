import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Download, MoreVertical, ChevronRight } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

const customers = [
  {
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    subscription: "Enterprise",
    status: "Active",
    totalSpend: "$1,250.75",
    lastActive: "2 days ago",
    joined: "Jan 15, 2023",
  },
  {
    name: "Michael Brown",
    email: "michael.brown@example.com",
    subscription: "Trial",
    status: "Trial",
    totalSpend: "$0.00",
    lastActive: "5 hours ago",
    joined: "Oct 28, 2023",
  },
  {
    name: "Fatima Khan",
    email: "fatima.khan@example.com",
    subscription: "Business",
    status: "Inactive",
    totalSpend: "$450.00",
    lastActive: "1 month ago",
    joined: "Mar 01, 2022",
  },
  {
    name: "David Lee",
    email: "david.lee@example.com",
    subscription: "Enterprise",
    status: "Active",
    totalSpend: "$3,200.50",
    lastActive: "1 hour ago",
    joined: "Aug 20, 2021",
  },
  {
    name: "Maria Garcia",
    email: "maria.garcia@example.com",
    subscription: "Individual",
    status: "Active",
    totalSpend: "$780.20",
    lastActive: "6 days ago",
    joined: "Nov 10, 2023",
  },
]

export default function AdminPage() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Customer Management</h1>
          <p className="text-slate-600 mt-1">Manage and monitor customer accounts, subscriptions, and activity</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-blue-100 bg-gradient-to-br from-white to-blue-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Total Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">1,245</div>
              <p className="text-sm text-green-600 mt-1">+12% this month</p>
            </CardContent>
          </Card>

          <Card className="border-green-100 bg-gradient-to-br from-white to-green-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Active Subscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">982</div>
              <p className="text-sm text-green-600 mt-1">+8% this month</p>
            </CardContent>
          </Card>

          <Card className="border-yellow-100 bg-gradient-to-br from-white to-yellow-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Trial Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">156</div>
              <p className="text-sm text-slate-600 mt-1">Active trials</p>
            </CardContent>
          </Card>

          <Card className="border-purple-100 bg-gradient-to-br from-white to-purple-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">MRR</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">$48.2K</div>
              <p className="text-sm text-green-600 mt-1">+15% this month</p>
            </CardContent>
          </Card>
        </div>

        {/* Customer Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>Customer List</CardTitle>
                <CardDescription className="mt-1">View and manage all customer accounts</CardDescription>
              </div>
              <div className="flex gap-2">
                <Link href="/dashboard/admin/customers">
                  <Button variant="outline" size="sm">
                    View All Customers
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
                <Link href="/dashboard/admin/subscriptions">
                  <Button variant="outline" size="sm">
                    Manage Subscriptions
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input placeholder="Search customers..." className="pl-10" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="trial">Trial</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all-dates">
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Joined" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-dates">All Dates</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="this-year">This Year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-slate-200">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold">Customer Name</TableHead>
                    <TableHead className="font-semibold">Contact</TableHead>
                    <TableHead className="font-semibold">Subscription</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Total Spend</TableHead>
                    <TableHead className="font-semibold">Last Active</TableHead>
                    <TableHead className="font-semibold">Joined</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer, index) => (
                    <TableRow key={index} className="hover:bg-slate-50">
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell className="text-sm text-slate-600">{customer.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            customer.subscription === "Enterprise"
                              ? "bg-purple-100 text-purple-700"
                              : customer.subscription === "Business"
                                ? "bg-blue-100 text-blue-700"
                                : customer.subscription === "Individual"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                          }
                        >
                          {customer.subscription}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            customer.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : customer.status === "Trial"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-slate-100 text-slate-700"
                          }
                        >
                          {customer.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{customer.totalSpend}</TableCell>
                      <TableCell className="text-sm text-slate-600">{customer.lastActive}</TableCell>
                      <TableCell className="text-sm text-slate-600">{customer.joined}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between mt-4 text-sm text-slate-600">
              <span>Page 1 of 2</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
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
