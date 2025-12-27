"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BarChart3, LineChartIcon, AreaChartIcon, PieChartIcon } from "lucide-react"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Area,
  AreaChart,
  Pie,
  PieChart as PieChartComponent,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

type ChartType = "bar" | "line" | "area" | "pie"

interface ChartSwitcherProps {
  data: any[]
  config: Record<string, { label: string; color: string }>
  dataKeys: string[]
  xAxisKey?: string
  className?: string
  onChartClick?: (data: any) => void
}

export function ChartSwitcher({
  data,
  config = {},
  dataKeys = [],
  xAxisKey = "month",
  className = "h-80",
  onChartClick,
}: ChartSwitcherProps) {
  const [chartType, setChartType] = useState<ChartType>("line")

  const safeConfig = config || {}
  const safeDataKeys = Array.isArray(dataKeys) ? dataKeys : []
  const safeData = Array.isArray(data) ? data : []

  const pieData = safeDataKeys
    .filter((key) => key && typeof key === "string")
    .map((key) => {
      // Safely access config item
      const configItem = safeConfig[key]

      // Safely extract label with fallback chain
      let label = key
      if (configItem && typeof configItem === "object") {
        label = configItem.label || key
      }

      // Safely extract color with fallback
      let color = "#3b82f6"
      if (configItem && typeof configItem === "object") {
        color = configItem.color || "#3b82f6"
      }

      // Calculate value safely
      const value = safeData.reduce((sum, item) => {
        if (item && typeof item === "object" && typeof item[key] === "number") {
          return sum + item[key]
        }
        return sum
      }, 0)

      return {
        name: label,
        value: value,
        fill: color,
      }
    })
    .filter((item) => item && item.value > 0)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 p-1 bg-slate-100 rounded-lg w-fit">
        <Button
          variant={chartType === "bar" ? "default" : "ghost"}
          size="sm"
          onClick={() => setChartType("bar")}
          className={`gap-2 rounded-md ${chartType === "bar" ? "bg-white shadow-sm" : "hover:bg-white/50"}`}
        >
          <BarChart3 className="h-4 w-4" />
          <span className="hidden sm:inline">Bar</span>
        </Button>
        <Button
          variant={chartType === "line" ? "default" : "ghost"}
          size="sm"
          onClick={() => setChartType("line")}
          className={`gap-2 rounded-md ${chartType === "line" ? "bg-white shadow-sm" : "hover:bg-white/50"}`}
        >
          <LineChartIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Line</span>
        </Button>
        <Button
          variant={chartType === "area" ? "default" : "ghost"}
          size="sm"
          onClick={() => setChartType("area")}
          className={`gap-2 rounded-md ${chartType === "area" ? "bg-white shadow-sm" : "hover:bg-white/50"}`}
        >
          <AreaChartIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Area</span>
        </Button>
        <Button
          variant={chartType === "pie" ? "default" : "ghost"}
          size="sm"
          onClick={() => setChartType("pie")}
          className={`gap-2 rounded-md ${chartType === "pie" ? "bg-white shadow-sm" : "hover:bg-white/50"}`}
        >
          <PieChartIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Pie</span>
        </Button>
      </div>

      <ChartContainer config={safeConfig} className={`${className} min-h-[300px]`}>
        {chartType === "bar" && (
          <BarChart data={safeData} onClick={onChartClick}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
            <XAxis dataKey={xAxisKey} className="text-xs" />
            <YAxis className="text-xs" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            {safeDataKeys.map((key) => {
              const configItem = safeConfig[key]
              const color = configItem?.color || "#3b82f6"
              return <Bar key={key} dataKey={key} fill={color} radius={[6, 6, 0, 0]} />
            })}
          </BarChart>
        )}

        {chartType === "line" && (
          <LineChart data={safeData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
            <XAxis dataKey={xAxisKey} className="text-xs" />
            <YAxis className="text-xs" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            {safeDataKeys.map((key) => {
              const configItem = safeConfig[key]
              const color = configItem?.color || "#3b82f6"
              return (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={color}
                  strokeWidth={3}
                  dot={{ r: 5, strokeWidth: 2 }}
                />
              )
            })}
          </LineChart>
        )}

        {chartType === "area" && (
          <AreaChart data={safeData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
            <XAxis dataKey={xAxisKey} className="text-xs" />
            <YAxis className="text-xs" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            {safeDataKeys.map((key, index) => {
              const configItem = safeConfig[key]
              const color = configItem?.color || "#3b82f6"
              return (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={color}
                  fill={color}
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              )
            })}
          </AreaChart>
        )}

        {chartType === "pie" && Array.isArray(pieData) && pieData.length > 0 && (
          <PieChartComponent>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry: any) => {
                try {
                  // Safely extract name and percent
                  const name = entry?.name || entry?.payload?.name || "Unknown"
                  const percent = entry?.percent ?? entry?.payload?.percent ?? 0

                  // Only render if we have valid data
                  if (!name || typeof percent !== "number") {
                    return null
                  }

                  return `${name}: ${(percent * 100).toFixed(0)}%`
                } catch (error) {
                  console.error("[v0] Pie chart label error:", error)
                  return null
                }
              }}
              outerRadius={120}
              innerRadius={70}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry?.fill || "#3b82f6"} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
          </PieChartComponent>
        )}
      </ChartContainer>
    </div>
  )
}
