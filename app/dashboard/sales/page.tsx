import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Download } from "lucide-react"
import { ChartSwitcher } from "@/components/chart-switcher"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const monthlySalesData = [
  { month: "Jan", sales: 310000 },
  { month: "Feb", sales: 340000 },
  { month: "Mar", sales: 380000 },
  { month: "Apr", sales: 360000 },
  { month: "May", sales: 410000 },
  { month: "Jun", sales: 450000 },
  { month: "Jul", sales: 430000 },
  { month: "Aug", sales: 460000 },
  { month: "Sep", sales: 395000 },
  { month: "Oct", sales: 420000 },
  { month: "Nov", sales: 455000 },
  { month: "Dec", sales: 480000 },
]

const transactions = [
  {
    invoiceNo: "INV-2023-001",
    date: "2023-11-28",
    customer: "Global Solutions Ltd.",
    type: "B2B",
    taxableValue: "₹45,000",
    gstAmount: "₹8,100",
    totalValue: "₹53,100",
  },
  {
    invoiceNo: "INV-2023-002",
    date: "2023-11-28",
    customer: "Ramesh Sharma",
    type: "B2C",
    taxableValue: "₹1,200",
    gstAmount: "₹216",
    totalValue: "₹1,416",
  },
  {
    invoiceNo: "INV-2023-003",
    date: "2023-11-27",
    customer: "Export Traders Inc.",
    type: "Export",
    taxableValue: "₹75,000",
    gstAmount: "₹0",
    totalValue: "₹75,000",
  },
  {
    invoiceNo: "INV-2023-004",
    date: "2023-11-27",
    customer: "Tech Innovations Pvt. Ltd.",
    type: "B2B",
    taxableValue: "₹28,000",
    gstAmount: "₹5,040",
    totalValue: "₹33,040",
  },
  {
    invoiceNo: "INV-2023-005",
    date: "2023-11-26",
    customer: "Priya Singh",
    type: "B2C",
    taxableValue: "₹3,500",
    gstAmount: "₹630",
    totalValue: "₹4,130",
  },
]

export default function SalesPage() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Sales Overview</h1>
            <p className="text-slate-600 mt-1">Detailed visualization and breakdown of your sales data.</p>
          </div>
          <div className="flex items-center gap-4">
            <Select defaultValue="monthly">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-blue-100 bg-gradient-to-br from-white to-blue-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">₹2,35,450</div>
              <div className="flex items-center gap-1 mt-2 text-sm">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-green-600 font-medium">+12.5% vs. last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-100 bg-gradient-to-br from-white to-blue-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">B2B Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">₹1,55,000</div>
              <div className="flex items-center gap-1 mt-2 text-sm">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-green-600 font-medium">+25% vs. last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-100 bg-gradient-to-br from-white to-blue-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">B2C Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">₹82,120</div>
              <div className="flex items-center gap-1 mt-2 text-sm">
                <TrendingDown className="h-4 w-4 text-red-600" />
                <span className="text-red-600 font-medium">-3.2% vs. last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-100 bg-gradient-to-br from-white to-blue-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Export Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">₹75,890</div>
              <div className="flex items-center gap-1 mt-2 text-sm">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-green-600 font-medium">+8.1% vs. last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Sales Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartSwitcher
              data={monthlySalesData}
              config={{
                sales: { label: "Total Sales", color: "#3b82f6" },
              }}
              dataKeys={["sales"]}
              xAxisKey="month"
            />
          </CardContent>
        </Card>

        {/* Detailed Sales Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Sales Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-slate-200">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold">Invoice No.</TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">Customer</TableHead>
                    <TableHead className="font-semibold">Type</TableHead>
                    <TableHead className="font-semibold">Taxable Value</TableHead>
                    <TableHead className="font-semibold">GST Amount</TableHead>
                    <TableHead className="font-semibold">Total Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction, index) => (
                    <TableRow key={index} className="hover:bg-slate-50">
                      <TableCell className="font-medium">{transaction.invoiceNo}</TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>{transaction.customer}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            transaction.type === "B2B"
                              ? "bg-blue-100 text-blue-700"
                              : transaction.type === "B2C"
                                ? "bg-green-100 text-green-700"
                                : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {transaction.type}
                        </span>
                      </TableCell>
                      <TableCell>{transaction.taxableValue}</TableCell>
                      <TableCell>{transaction.gstAmount}</TableCell>
                      <TableCell className="font-semibold">{transaction.totalValue}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between mt-4 text-sm text-slate-600">
              <span>Showing 1-5 of 15 records</span>
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
