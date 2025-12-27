"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, CreditCard, Users, Building2 } from "lucide-react"
import { useState } from "react"

const plans = [
  {
    name: "Individual",
    price: "₹999",
    description: "Perfect for small businesses",
    icon: Users,
    features: ["Up to 1 GSTIN", "Monthly Analytics Reports", "Email Support", "Basic Data Export", "Mobile App Access"],
    userType: "individual",
  },
  {
    name: "CA Professional",
    price: "₹4,999",
    description: "Perfect for Chartered Accountants",
    icon: Building2,
    features: [
      "Unlimited GSTINs",
      "Real-time Analytics Dashboard",
      "24/7 Priority Support",
      "Advanced Data Export",
      "Multi-client Management",
      "API Access",
      "Custom Reports",
      "Dedicated Account Manager",
    ],
    userType: "ca",
    popular: true,
  },
]

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const handleSubscribe = (planName: string, price: string) => {
    setSelectedPlan(planName)
    // Mock Razorpay integration - in production, this would call the payment gateway
    alert(`Redirecting to Razorpay for ${planName} plan (${price}/month)`)
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Subscription Management</h1>
          <p className="text-slate-600 mt-1">Choose the perfect plan for your needs</p>
        </div>

        {/* Current Subscription */}
        <Card className="border-blue-200 bg-gradient-to-br from-white to-blue-50 border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-bold text-slate-900">Individual Plan</h3>
                  <Badge className="bg-green-100 text-green-700">Active</Badge>
                </div>
                <p className="text-slate-600 mt-1">
                  <span className="text-2xl font-bold text-slate-900">₹999</span>/month
                </p>
                <p className="text-sm text-slate-600 mt-2">Next billing on February 15, 2025</p>
              </div>
              <Button variant="outline" className="bg-white">
                Manage Subscription
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Plans */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Choose Your Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map((plan) => {
              const Icon = plan.icon
              return (
                <Card
                  key={plan.name}
                  className={`relative transition-all hover:shadow-xl ${
                    plan.popular ? "border-blue-500 border-2 shadow-lg" : "border-slate-200"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-600 text-white px-4 py-1">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                      <span className="text-slate-600">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="h-5 w-5 flex-shrink-0 text-green-600 mt-0.5" />
                          <span className="text-sm text-slate-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full ${plan.popular ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                      variant={plan.popular ? "default" : "outline"}
                      onClick={() => handleSubscribe(plan.name, plan.price)}
                    >
                      Subscribe Now
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Payment Info */}
        <Card className="border-0 shadow-md">
          <CardHeader className="border-b border-slate-100">
            <CardTitle>Payment Information</CardTitle>
            <CardDescription>Secure payments powered by Razorpay</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-slate-200">
                  <CreditCard className="h-6 w-6 text-slate-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Payment Method</p>
                  <p className="text-sm text-slate-600">Visa ending in 5678</p>
                </div>
              </div>
              <Button variant="outline">Update</Button>
            </div>

            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex gap-3">
                <div className="text-sm text-slate-700">
                  <p className="font-medium text-slate-900">Secure Payment Gateway</p>
                  <p className="mt-1">
                    All payments are processed securely through Razorpay. We support UPI, Credit/Debit Cards, Net
                    Banking, and Wallets.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
