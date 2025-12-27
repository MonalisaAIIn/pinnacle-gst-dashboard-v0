"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building, UserIcon, Briefcase } from "lucide-react"

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Profile</h1>
          <p className="text-slate-600 mt-1">Manage your account settings and preferences</p>
        </div>

        {/* Profile Header */}
        <Card className="border-0 shadow-md">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder.svg?height=96&width=96" />
                <AvatarFallback className="text-2xl bg-blue-100 text-blue-700">RC</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-slate-900">Rahul Chatterjee</h2>
                  <Badge className="bg-blue-100 text-blue-700">Individual User</Badge>
                </div>
                <p className="text-slate-600 mt-1">rahul.chatterjee@example.com</p>
                <p className="text-sm text-slate-500 mt-2">Member since January 2024</p>
              </div>
              <Button variant="outline">Change Photo</Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card className="border-0 shadow-md">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" defaultValue="Rahul Chatterjee" className="h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue="rahul.chatterjee@example.com" className="h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" defaultValue="+91 98765 43210" className="h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userType">Account Type</Label>
                <Select defaultValue="individual">
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual User</SelectItem>
                    <SelectItem value="ca">Chartered Accountant (CA)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Save Changes</Button>
            </CardContent>
          </Card>

          {/* Business Information */}
          <Card className="border-0 shadow-md">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Business Information
              </CardTitle>
              <CardDescription>Manage your business details</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input id="businessName" defaultValue="Chatterjee Enterprises" className="h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gstin">GSTIN</Label>
                <Input id="gstin" defaultValue="29AABCT1234F1Z5" className="h-11" maxLength={15} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pan">PAN Number</Label>
                <Input id="pan" defaultValue="AABCT1234F" className="h-11" maxLength={10} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Business Address</Label>
                <Input id="address" defaultValue="123 MG Road, Bangalore, Karnataka" className="h-11" />
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Update Business Info</Button>
            </CardContent>
          </Card>
        </div>

        {/* Connected GSTINs */}
        <Card className="border-0 shadow-md">
          <CardHeader className="border-b border-slate-100">
            <CardTitle>Connected GSTINs</CardTitle>
            <CardDescription>Manage your linked GST accounts</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">29AABCT1234F1Z5</p>
                    <p className="text-sm text-slate-600">Chatterjee Enterprises</p>
                    <p className="text-xs text-slate-500 mt-1">Connected on Jan 15, 2024</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-green-100 text-green-700">Active</Badge>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
              </div>

              <Button variant="outline" className="w-full border-dashed border-2 bg-transparent">
                + Add Another GSTIN
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Security */}
        <Card className="border-0 shadow-md">
          <CardHeader className="border-b border-slate-100">
            <CardTitle>Account Security</CardTitle>
            <CardDescription>Manage your password and security settings</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <p className="font-medium text-slate-900">Password</p>
                <p className="text-sm text-slate-600">Last changed 2 months ago</p>
              </div>
              <Button variant="outline">Change Password</Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <p className="font-medium text-slate-900">Two-Factor Authentication</p>
                <p className="text-sm text-slate-600">Add an extra layer of security</p>
              </div>
              <Button variant="outline">Enable 2FA</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
