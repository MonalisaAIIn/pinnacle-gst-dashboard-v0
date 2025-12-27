import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Eye, FileText } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const itcMetrics = [
  {
    title: "ITC Available",
    value: "₹2,345,678",
    description: "Total eligible ITC for the period",
    color: "from-blue-50 to-blue-100",
  },
  {
    title: "ITC Claimed",
    value: "₹2,100,500",
    description: "ITC successfully claimed till date",
    color: "from-green-50 to-green-100",
  },
  {
    title: "ITC Mismatch",
    value: "₹245,178",
    description: "Difference between GSTR-2A and GSTR-3B",
    color: "from-yellow-50 to-yellow-100",
  },
  {
    title: "Ineligible ITC",
    value: "₹50,000",
    description: "ITC not allowed as per GST law",
    color: "from-red-50 to-red-100",
  },
  {
    title: "Missing Invoices",
    value: "23",
    description: "Invoices not yet reflected in GSTR-2A",
    color: "from-orange-50 to-orange-100",
  },
]

const vendorLedger = [
  {
    vendor: "Global Suppliers Ltd.",
    gstin: "27AABCZ1234N1Z2",
    totalItc: "₹ 500,000",
    eligibleItc: "₹ 490,000",
    ineligibleItc: "₹10,000",
  },
  {
    vendor: "Tech Solutions Pvt. Ltd.",
    gstin: "27ZYXWJ5678Q1Z5",
    totalItc: "₹ 320,000",
    eligibleItc: "₹ 320,000",
    ineligibleItc: "₹0",
  },
  {
    vendor: "Office Supplies Inc.",
    gstin: "27PQRST6789R1Z1",
    totalItc: "₹ 150,000",
    eligibleItc: "₹145,000",
    ineligibleItc: "₹ 5,000",
  },
  {
    vendor: "Marketing Innovations",
    gstin: "27LMNOC1122S1Z3",
    totalItc: "₹80,000",
    eligibleItc: "₹75,000",
    ineligibleItc: "₹ 5,000",
  },
  {
    vendor: "Logistics Co.",
    gstin: "27DEFGH3344T1Z7",
    totalItc: "₹120,000",
    eligibleItc: "₹120,000",
    ineligibleItc: "₹0",
  },
]

const missingInvoices = [
  {
    invoiceNumber: "INV0012345",
    vendorGstin: "27ABCDA1234A1Z1",
    invoiceDate: "2023-10-15",
    itcAmount: "₹12,500",
    status: "Missing",
  },
  {
    invoiceNumber: "INV0012346",
    vendorGstin: "27ABCDA1234A1Z1",
    invoiceDate: "2023-10-18",
    itcAmount: "₹ 8,900",
    status: "Pending Verification",
  },
  {
    invoiceNumber: "INV0012347",
    vendorGstin: "27BCDEF5678B1Z2",
    invoiceDate: "2023-11-01",
    itcAmount: "₹25,000",
    status: "Missing",
  },
  {
    invoiceNumber: "INV0012348",
    vendorGstin: "27CDEFG9012C1Z3",
    invoiceDate: "2023-11-05",
    itcAmount: "₹5,200",
    status: "Resolved",
  },
  {
    invoiceNumber: "INV0012349",
    vendorGstin: "27FGHIJ3456D1Z4",
    invoiceDate: "2023-11-10",
    itcAmount: "₹18,750",
    status: "Missing",
  },
]

export default function ITCPage() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Input Tax Credit Analytics</h1>
          <p className="text-slate-600 mt-1">
            Comprehensive overview and detailed breakdown of your Input Tax Credit. Monitor availability, claims, and
            mismatches to ensure compliance and optimization.
          </p>
        </div>

        {/* ITC Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {itcMetrics.map((metric) => (
            <Card key={metric.title} className={`border-slate-200 bg-gradient-to-br ${metric.color}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-700">{metric.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{metric.value}</div>
                <p className="text-xs text-slate-600 mt-1">{metric.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Vendor-wise ITC Ledger */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Vendor-wise ITC Ledger</CardTitle>
                <CardDescription className="mt-1">Detailed breakdown of ITC by vendor</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  CSV
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Excel
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-slate-200">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold">Vendor Name</TableHead>
                    <TableHead className="font-semibold">GSTIN</TableHead>
                    <TableHead className="font-semibold">Total ITC</TableHead>
                    <TableHead className="font-semibold">Eligible ITC</TableHead>
                    <TableHead className="font-semibold">Ineligible ITC</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendorLedger.map((vendor, index) => (
                    <TableRow key={index} className="hover:bg-slate-50">
                      <TableCell className="font-medium">{vendor.vendor}</TableCell>
                      <TableCell className="font-mono text-sm">{vendor.gstin}</TableCell>
                      <TableCell>{vendor.totalItc}</TableCell>
                      <TableCell className="text-green-700">{vendor.eligibleItc}</TableCell>
                      <TableCell className="text-red-700">{vendor.ineligibleItc}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Missing Invoices */}
        <Card>
          <CardHeader>
            <CardTitle>Missing Invoices</CardTitle>
            <CardDescription className="mt-1">Invoices not reflected in GSTR-2A</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-slate-200">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold">Invoice Number</TableHead>
                    <TableHead className="font-semibold">Vendor GSTIN</TableHead>
                    <TableHead className="font-semibold">Invoice Date</TableHead>
                    <TableHead className="font-semibold">ITC Amount</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {missingInvoices.map((invoice, index) => (
                    <TableRow key={index} className="hover:bg-slate-50">
                      <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                      <TableCell className="font-mono text-sm">{invoice.vendorGstin}</TableCell>
                      <TableCell>{invoice.invoiceDate}</TableCell>
                      <TableCell>{invoice.itcAmount}</TableCell>
                      <TableCell>
                        <Badge
                          variant={invoice.status === "Resolved" ? "default" : "secondary"}
                          className={
                            invoice.status === "Missing"
                              ? "bg-red-100 text-red-700"
                              : invoice.status === "Resolved"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                          }
                        >
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4" />
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
