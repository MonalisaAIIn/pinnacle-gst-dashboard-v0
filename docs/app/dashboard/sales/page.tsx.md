# Sales Overview Page (`app/dashboard/sales/page.tsx`)

This file implements the **Sales Overview** page within the dashboard. It uses a layout wrapper, UI primitives, charting logic, and a data table to present key sales metrics, trends, and detailed transactions.

## 🏗️ Layout & Structure
- Wrapped in `<DashboardLayout>` for consistent sidebar navigation and header .  
- Top-level container with padding and vertical spacing (`p-6 space-y-6`).  
- Four main sections:  
  1. Header & Controls  
  2. KPI Cards  
  3. Monthly Sales Trend  
  4. Detailed Sales Transactions  

```tsx
export default function SalesPage() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Sections go here */}
      </div>
    </DashboardLayout>
  )
}
```

## 📝 1. Header & Controls

A flex container aligns the **page title**, **description**, and **actions**:

- **Title**: “Sales Overview” (3xl, bold).  
- **Subtitle**: Brief description in muted text.  
- **Controls**:
  - `<Select>` for time range (`monthly`, `quarterly`, `yearly`).
  - `<Button variant="outline">` with download icon for data export.  

```tsx
<div className="flex items-center justify-between">
  <div>
    <h1 className="text-3xl font-bold">Sales Overview</h1>
    <p className="text-slate-600 mt-1">Detailed visualization…</p>
  </div>
  <div className="flex items-center gap-4">
    <Select defaultValue="monthly">…</Select>
    <Button variant="outline">
      <Download className="h-4 w-4 mr-2" /> Export Data
    </Button>
  </div>
</div>
```

## 📊 2. KPI Cards

Displays four summary cards in a responsive grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`):

| KPI               | Value      | Trend                         | Icon           |
|-------------------|------------|-------------------------------|----------------|
| **Total Sales**   | ₹2,35,450  | +12.5% vs. last month (green) | <TrendingUp /> |
| **B2B Sales**     | ₹1,55,000  | +25% vs. last month (green)   | <TrendingUp /> |
| **B2C Sales**     | ₹82,120    | -3.2% vs. last month (red)    | <TrendingDown /> |
| **Export Sales**  | ₹75,890    | +8.1% vs. last month (green)  | <TrendingUp /> |

Each `<Card>` uses a subtle gradient background and border to distinguish it.

```tsx
<Card className="bg-gradient-to-br from-white to-blue-50">
  <CardHeader><CardTitle>Total Sales</CardTitle></CardHeader>
  <CardContent>
    <div className="text-3xl font-bold">₹2,35,450</div>
    <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
      <TrendingUp className="h-4 w-4" />
      <span className="font-medium">+12.5% vs. last month</span>
    </div>
  </CardContent>
</Card>
```

## 📈 3. Monthly Sales Trend

Utilizes the reusable `<ChartSwitcher>` component to render interactive **line**, **area**, or **pie** charts. It accepts:

- `data`: array of `{ month, sales }`.  
- `config`: mapping of data keys to labels/colors.  
- `dataKeys` & `xAxisKey` to drive the chart.  

```tsx
<Card>
  <CardHeader><CardTitle>Monthly Sales Trend</CardTitle></CardHeader>
  <CardContent>
    <ChartSwitcher
      data={monthlySalesData}
      config={{ sales: { label: "Total Sales", color: "#3b82f6" } }}
      dataKeys={["sales"]}
      xAxisKey="month"
    />
  </CardContent>
</Card>
```

ChartSwitcher dynamically renders charts based on user selection (line/area/pie) using Recharts under the hood .

## 📋 4. Detailed Sales Transactions

Renders a paginated table of recent invoices:

- **Columns**: Invoice No., Date, Customer, Type, Taxable Value, GST Amount, Total Value.  
- **Type Badge**: Color-coded per “B2B”, “B2C”, or “Export”.  
- **Hover** state highlights rows.  
- **Pagination**: “Previous”/“Next” buttons with disabled state.  

```tsx
<Table>
  <TableHeader>
    <TableRow className="bg-slate-50">
      <TableHead>Invoice No.</TableHead>
      <!-- ...other headers... -->
      <TableHead>Total Value</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {transactions.map((tx, idx) => (
      <TableRow key={idx} className="hover:bg-slate-50">
        <TableCell className="font-medium">{tx.invoiceNo}</TableCell>
        <!-- ...other cells... -->
        <TableCell className="font-semibold">{tx.totalValue}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
<div className="flex items-center justify-between mt-4 text-sm text-slate-600">
  <span>Showing 1-5 of 15 records</span>
  <div className="flex gap-2">
    <Button variant="outline" size="sm" disabled>Previous</Button>
    <Button variant="outline" size="sm">Next</Button>
  </div>
</div>
```

## 🔗 Dependencies & Relations

- **Layout**: `<DashboardLayout>` provides sidebar and header logic .  
- **UI Primitives**: `Card`, `Table`, `Select`, `Button` from the design system.  
- **Icons**: `TrendingUp`, `TrendingDown`, `Download` from Lucide React.  
- **Charting**: `<ChartSwitcher>` encapsulates Recharts logic for multiple chart types .

---

<p className="text-center text-sm text-slate-500 pt-6 border-t border-slate-200">
  © 2025 Pinnacle GST Analytical Dashboard. All rights reserved.
</p>