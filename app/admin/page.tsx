"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, CreditCard, TrendingUp, Activity, Search, MoreVertical, ArrowLeft } from "lucide-react"

const stats = [
  { title: "Total Customers", value: "1,234", change: "+12.5%", icon: Users, color: "bg-blue-500" },
  { title: "Active Subscriptions", value: "987", change: "+8.2%", icon: CreditCard, color: "bg-green-500" },
  { title: "Monthly Revenue", value: "₹4,56,789", change: "+15.3%", icon: TrendingUp, color: "bg-purple-500" },
  { title: "Churn Rate", value: "2.1%", change: "-0.5%", icon: Activity, color: "bg-orange-500" },
]

const customers = [
  {
    id: 1,
    name: "Rahul Chatterjee",
    email: "rahul.c@example.com",
    type: "Individual",
    gstin: "29AABCT1234F1Z5",
    plan: "Individual",
    status: "Active",
    joined: "Jan 15, 2024",
  },
  {
    id: 2,
    name: "Priya Sharma",
    email: "priya.s@caservices.com",
    type: "CA",
    gstin: "5 GSTINs",
    plan: "CA Professional",
    status: "Active",
    joined: "Dec 20, 2023",
  },
  {
    id: 3,
    name: "Amit Patel",
    email: "amit.p@example.com",
    type: "Individual",
    gstin: "24AAFCP2345G1Z1",
    plan: "Individual",
    status: "Active",
    joined: "Jan 10, 2024",
  },
]

export default function AdminPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
              <p className="text-slate-600 mt-1">Manage customers, subscriptions, and analytics</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title} className="border-0 shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 font-medium">{stat.title}</p>
                      <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                      <p className="text-sm text-green-600 font-medium mt-2">{stat.change} from last month</p>
                    </div>
                    <div className={`${stat.color} w-14 h-14 rounded-lg flex items-center justify-center`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button className="h-auto py-4 bg-blue-600 hover:bg-blue-700" asChild>
            <Link href="/admin/customers">
              <Users className="h-5 w-5 mr-2" />
              Manage Customers
            </Link>
          </Button>
          <Button className="h-auto py-4 bg-purple-600 hover:bg-purple-700" asChild>
            <Link href="/admin/subscriptions">
              <CreditCard className="h-5 w-5 mr-2" />
              View Subscriptions
            </Link>
          </Button>
          <Button className="h-auto py-4 bg-green-600 hover:bg-green-700" asChild>
            <Link href="/admin/analytics">
              <TrendingUp className="h-5 w-5 mr-2" />
              Analytics Reports
            </Link>
          </Button>
        </div>

        {/* Recent Customers */}
        <Card className="border-0 shadow-md">
          <CardHeader className="border-b border-slate-100">
            <div className="flex items-center justify-between">
              <CardTitle>Recent Customers</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>GSTIN</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-900">{customer.name}</p>
                        <p className="text-sm text-slate-500">{customer.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{customer.type}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{customer.gstin}</TableCell>
                    <TableCell>{customer.plan}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-700">{customer.status}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">{customer.joined}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
