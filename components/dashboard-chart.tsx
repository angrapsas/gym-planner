"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  {
    date: "Jun 15",
    consistency: 45,
  },
  {
    date: "Jun 22",
    consistency: 52,
  },
  {
    date: "Jun 29",
    consistency: 49,
  },
  {
    date: "Jul 6",
    consistency: 58,
  },
  {
    date: "Jul 13",
    consistency: 65,
  },
  {
    date: "Jul 20",
    consistency: 72,
  },
  {
    date: "Jul 27",
    consistency: 78,
  },
]

export function DashboardChart() {
  return (
    <ChartContainer
      config={{
        consistency: {
          label: "Consistency %",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 0,
          }}
        >
          <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={10} />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent className="border-none shadow-none bg-background p-2 rounded-md" showArrow={false} />
            }
          />
          <Line
            type="monotone"
            dataKey="consistency"
            strokeWidth={2}
            activeDot={{
              r: 6,
              style: { fill: "var(--color-consistency)", opacity: 0.8 },
            }}
            stroke="var(--color-consistency)"
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
