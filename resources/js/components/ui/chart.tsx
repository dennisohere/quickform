"use client"

import * as React from "react"
import { 
  Bar, 
  BarChart, 
  Line, 
  LineChart, 
  Area,
  AreaChart,
  Pie, 
  PieChart, 
  Cell,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip
} from "recharts"
import { cn } from "@/lib/utils"

// Re-export Recharts components for direct use
export {
  Bar,
  BarChart,
  Line,
  LineChart,
  Area,
  AreaChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
}

// Chart configuration type
export interface ChartConfig {
  [key: string]: {
    label: string
    color: string
  }
}

// Chart container component
export function ChartContainer({
  children,
  config,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  config: ChartConfig
  children: React.ReactElement
}) {
  return (
    <div className={cn("w-full", className)} {...props}>
      <ResponsiveContainer width="100%" height={350}>
        {children}
      </ResponsiveContainer>
    </div>
  )
}

// Chart tooltip content component
export function ChartTooltipContent({
  active,
  payload,
  label,
  config,
  indicator = "line",
  hideLabel = false,
  hideIndicator = false,
  className,
  ...props
}: {
  active?: boolean
  payload?: any[]
  label?: string
  config: ChartConfig
  indicator?: "line" | "dot" | "dashed"
  hideLabel?: boolean
  hideIndicator?: boolean
  className?: string
}) {
  if (!active || !payload || !payload.length) {
    return null
  }

  const tooltipLabel = hideLabel ? null : (
    <div className="font-medium">{label}</div>
  )

  const nestLabel = payload.length === 1 && indicator !== "dot"

  return (
    <div
      className={cn(
        "border-border/50 bg-background grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl transition-all ease-in-out hover:-translate-y-0.5",
        className
      )}
      {...props}
    >
      {!nestLabel ? tooltipLabel : null}
      <div className="grid gap-1.5">
        {payload.map((item, index) => {
          const indicatorColor = item.fill || item.stroke

          return (
            <div
              key={index}
              className={cn(
                "[&>svg]:text-muted-foreground flex w-full items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5",
                indicator === "dot" && "items-center"
              )}
            >
              <>
                {!hideIndicator && (
                  <div
                    className={cn(
                      "shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]",
                      {
                        "h-2.5 w-2.5": indicator === "dot",
                        "w-1": indicator === "line",
                        "w-0 border-[1.5px] border-dashed bg-transparent":
                          indicator === "dashed",
                        "my-0.5": nestLabel && indicator === "dashed",
                      }
                    )}
                    style={
                      {
                        "--color-bg": indicatorColor,
                        "--color-border": indicatorColor,
                      } as React.CSSProperties
                    }
                  />
                )}
                <div
                  className={cn(
                    "flex flex-1 justify-between leading-none",
                    nestLabel ? "items-end" : "items-center"
                  )}
                >
                  <div className="grid gap-1.5">
                    {nestLabel ? tooltipLabel : null}
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="text-foreground font-mono font-medium tabular-nums">
                    {item.value.toLocaleString()}
                  </span>
                </div>
              </>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Chart tooltip component (for backward compatibility)
export function ChartTooltip({ 
  active, 
  payload, 
  label, 
  valueFormatter = (value: number) => value.toString() 
}: {
  active?: boolean
  payload?: any[]
  label?: string
  valueFormatter?: (value: number) => string
}) {
  if (!active || !payload || !payload.length) {
    return null
  }

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <div className="flex flex-col">
        <span className="text-[0.70rem] uppercase text-muted-foreground">
          {label}
        </span>
        <span className="font-bold text-muted-foreground">
          {valueFormatter(payload[0].value)}
        </span>
      </div>
    </div>
  )
}

// Chart legend component
export function ChartLegend({ 
  categories, 
  colors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ] 
}: {
  categories: string[]
  colors?: string[]
}) {
  return (
    <div className="flex flex-wrap justify-center gap-6 pt-6">
      {categories.map((category, idx) => (
        <div key={category} className="flex items-center gap-2">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: colors[idx % colors.length] }}
          />
          <span className="text-sm text-muted-foreground">{category}</span>
        </div>
      ))}
    </div>
  )
} 