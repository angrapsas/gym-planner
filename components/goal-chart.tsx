"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { addDays, format, differenceInDays } from "date-fns"

interface GoalChartProps {
  currentConsistency: number
  targetConsistency: number
  targetDate: Date
}

export function GoalChart({ currentConsistency, targetConsistency, targetDate }: GoalChartProps) {
  const today = new Date()
  const daysToTarget = differenceInDays(targetDate, today)

  // Generate data points for the chart
  const data = []

  // Past data (simulated)
  const pastDays = 30
  for (let i = pastDays; i >= 1; i--) {
    const date = addDays(today, -i)
    // Simulate past consistency with a gradual increase
    const pastConsistency = Math.max(30, currentConsistency - (pastDays - i + 1) * 0.8)

    data.push({
      date: format(date, "MMM d"),
      consistency: Math.round(pastConsistency),
      type: "past",
    })
  }

  // Current point
  data.push({
    date: format(today, "MMM d"),
    consistency: currentConsistency,
    type: "current",
  })

  // Projected data
  if (daysToTarget > 0) {
    const consistencyGap = targetConsistency - currentConsistency
    const dailyIncrease = consistencyGap / daysToTarget

    for (let i = 1; i <= daysToTarget; i++) {
      const date = addDays(today, i)
      const projectedConsistency = currentConsistency + dailyIncrease * i

      data.push({
        date: format(date, "MMM d"),
        consistency: Math.round(projectedConsistency),
        type: "projected",
      })
    }
  }

  // Target line data
  const targetLine = data.map((point) => ({
    date: point.date,
    target: targetConsistency,
  }))

  // Combine data
  const chartData = data.map((point, index) => ({
    ...point,
    target: targetLine[index].target,
  }))

  return (
    <ChartContainer
      config={{
        consistency: {
          label: "Consistency %",
          color: "hsl(var(--chart-1))",
        },
        target: {
          label: "Target",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 20,
          }}
        >
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => value.slice(0, 4)}
          />
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
          <Line type="monotone" dataKey="target" strokeWidth={2} stroke="var(--color-target)" strokeDasharray="5 5" />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
