# app/dashboard/admin/page.tsx

## Overview
The **AdminPage** component renders the **Customer Management** section of the dashboard. It is wrapped in the shared `DashboardLayout` and leverages a suite of UI primitives for cards, tables, and form controls. This page provides administrators with quick metrics, a searchable/filterable customer table, export functionality, and pagination .

---

## 📦 Imports
| Module Source                                    | Imported Items                                                                                       | Purpose                                                     |
|--------------------------------------------------|------------------------------------------------------------------------------------------------------|-------------------------------------------------------------|
| `@/components/dashboard-layout`                  | `DashboardLayout`                                                                                    | Layout shell with navigation sidebar                        |
| `@/components/ui/card`                           | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`                                   | Card containers for grouping content                        |
| `@/components/ui/button`                         | `Button`                                                                                             | Stylized button element                                      |
| `@/components/ui/input`                          | `Input`                                                                                              | Text input for search                                        |
| `@/components/ui/badge`                          | `Badge`                                                                                              | Status and subscription labels                               |
| `lucide-react`                                   | `Search`, `Download`, `MoreVertical`, `ChevronRight`                                                 | Icons for actions and indicators                             |
| `@/components/ui/table`                          | `Table`, `TableHeader`, `TableHead`, `TableBody`, `TableRow`, `TableCell`                            | Accessible data table components                             |
| `@/components/ui/select`                         | `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`                             | Dropdown filters                                             |
| `next/link`                                      | `Link`                                                                                               | Client-side navigation                                       |  


---

## 💡 Component Structure
- **`<DashboardLayout>`**  
  Wraps the page in global navigation, header, and styling.

  - **Container** (`<div className="p-6 space-y-6">`)  
    Vertical stack with padding.

    1. **Page Header**  
       - Title: *Customer Management*  
       - Subtitle: *Manage and monitor customer accounts, subscriptions, and activity*

    2. **Quick Stats** (4-column grid on md+)  
       Four overview cards showing key metrics.

    3. **Customer List Card**  
       - **CardHeader**  
         - Title & description  
         - Action buttons to navigate to full **Customers** or **Subscriptions** pages  
       - **Filters Row**  
         Search input, **Status** & **Joined** dropdowns, **Export** button  
       - **Table**  
         Column headers and rows mapped from a static `customers` array  
       - **Pagination Controls**  
         *Previous* / *Next* buttons with page indicator  

    4. **Footer**  
       © 2025 Pinnacle GST Analytical Dashboard.  

---

## 📊 Quick Stats Overview
| Metric                | Value    | Trend                 |
|-----------------------|----------|-----------------------|
| 🧑‍🤝‍🧑 Total Customers    | 1,245    | +12% this month        |
| 📈 Active Subscriptions | 982      | +8% this month         |
| ⏳ Trial Users         | 156      | Active trials          |
| 💵 MRR                 | $48.2K   | +15% this month        |

Each stat uses a styled `<Card>` with a gradient background and trend indicator .

---

## 🧩 Static Customer Data
A hardcoded array drives the table rows. Example snippet:

```js
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
  // …other customers
]
```
This array feeds the `<TableBody>` via `customers.map(...)` .

---

## 🔍 Filters & Actions
```jsx
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
    <Download className="h-4 w-4 mr-2" /> Export
  </Button>
</div>
```
This layout adapts from a single column on mobile to a multi-column row on larger screens .

---

## 📋 Customer Table
```jsx
<Table>
  <TableHeader>
    <TableRow className="bg-slate-50">
      <TableHead>Customer Name</TableHead>
      <TableHead>Contact</TableHead>
      <TableHead>Subscription</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Total Spend</TableHead>
      <TableHead>Last Active</TableHead>
      <TableHead>Joined</TableHead>
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>

  <TableBody>
    {customers.map((customer, i) => (
      <TableRow key={i} className="hover:bg-slate-50">
        <TableCell className="font-medium">{customer.name}</TableCell>
        <TableCell className="text-sm text-slate-600">{customer.email}</TableCell>
        {/* Subscription Badge */}
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
        {/* Status Badge */}
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
```
Rows highlight on hover and use `<Badge>` variants for visual emphasis .

---

## ⏭️ Pagination
```jsx
<div className="flex items-center justify-between mt-4 text-sm text-slate-600">
  <span>Page 1 of 2</span>
  <div className="flex gap-2">
    <Button variant="outline" size="sm" disabled>Previous</Button>
    <Button variant="outline" size="sm">Next</Button>
  </div>
</div>
```
Simple controls to navigate pages; can be wired to dynamic state or server-side pagination .

---

## ⚙️ Styling & Responsiveness
- **Tailwind CSS** for utility-first styling (`p-6`, `grid`, `md:grid-cols-4`, etc.).  
- **Responsive layouts**: grids and flex wrap adapt to mobile vs. desktop.  
- **Theming**: color classes and variant props centralize consistency.

---

## 🔗 Extensibility
To integrate real data and interactivity:
- Replace the static `customers` array with `useEffect` or server-side data fetch.
- Wire **Search**, **Select**, and **Pagination** to filter and query parameters.
- Implement export logic in the **Export** button handler (CSV, XLSX, PDF).

---

## 🎯 Summary
The `AdminPage` provides a comprehensive, responsive UI for managing customers, combining:
- **DashboardLayout** for consistent framing  
- **Quick Stats** for at-a-glance metrics  
- **Search & Filters** for easy data slicing  
- **Data Table** with rich badges and actions  
- **Pagination & Export** for data management  

All built with reusable UI components for maintainability and rapid iteration.