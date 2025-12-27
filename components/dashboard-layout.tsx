"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  LinkIcon,
  User,
  CreditCard,
  Download,
  LogOut,
  Menu,
  X,
  BarChart3,
  Receipt,
  TrendingUp,
  AlertTriangle,
  MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const navigation = [
  {
    name: "GST Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    isParent: true,
    children: [
      { name: "Overview", href: "/dashboard/overview", icon: BarChart3 },
      { name: "ITC", href: "/dashboard/itc", icon: Receipt },
      { name: "Sales", href: "/dashboard/sales", icon: TrendingUp },
      { name: "Compliance", href: "/dashboard/compliance", icon: AlertTriangle },
    ],
  },
  { name: "GST Connection", href: "/dashboard/gst-connection", icon: LinkIcon },
  { name: "SMS Settings", href: "/dashboard/sms-settings", icon: MessageSquare },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Subscription", href: "/dashboard/subscription", icon: CreditCard },
  { name: "Export & Settings", href: "/dashboard/export", icon: Download },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(pathname !== "/dashboard")

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <Image src="/images/logo.png" alt="Pinnacle" width={120} height={40} className="h-10 w-auto" />
        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 bg-white border-r border-slate-200 transform transition-all duration-200 ease-in-out lg:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          "pt-16 lg:pt-0",
          isCollapsed ? "lg:w-20" : "lg:w-64",
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-200 hidden lg:flex items-center justify-between">
            {!isCollapsed && (
              <Image
                src="/images/logo.png"
                alt="Pinnacle Consultancy Group"
                width={160}
                height={60}
                className="h-12 w-auto"
              />
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={cn("hidden lg:flex", isCollapsed && "mx-auto")}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              if (item.isParent && item.children) {
                const hasActiveChild = item.children.some(
                  (child) => pathname === child.href || pathname.startsWith(child.href + "/"),
                )
                return (
                  <div key={item.name} className="space-y-1">
                    <div
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-slate-900",
                        isCollapsed && "justify-center",
                      )}
                      title={isCollapsed ? item.name : undefined}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!isCollapsed && <span>{item.name}</span>}
                    </div>
                    {!isCollapsed &&
                      item.children.map((child) => {
                        const isActive = pathname === child.href || pathname.startsWith(child.href + "/")
                        return (
                          <Link
                            key={child.name}
                            href={child.href}
                            className={cn(
                              "flex items-center gap-3 px-4 py-2.5 ml-6 rounded-lg text-sm font-medium transition-colors",
                              isActive ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-100",
                            )}
                            onClick={() => {
                              setIsMobileMenuOpen(false)
                              setIsCollapsed(true)
                            }}
                          >
                            <child.icon className="h-4 w-4" />
                            <span>{child.name}</span>
                          </Link>
                        )
                      })}
                  </div>
                )
              }

              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    isActive ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-100",
                    isCollapsed && "justify-center",
                  )}
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    if (item.href !== "/dashboard") {
                      setIsCollapsed(true)
                    }
                  }}
                  title={isCollapsed ? item.name : undefined}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && <span className="flex-1">{item.name}</span>}
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t border-slate-200">
            <Link
              href="/auth/login"
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors",
                isCollapsed && "justify-center",
              )}
              title={isCollapsed ? "Logout" : undefined}
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span>Logout</span>}
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className={cn("transition-all duration-200", isCollapsed ? "lg:ml-20" : "lg:ml-64", "pt-16 lg:pt-0")}>
        {children}
      </main>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}
    </div>
  )
}
