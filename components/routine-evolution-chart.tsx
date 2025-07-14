"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  {
    date: "May 20",
    skills: 3,
    consistency: 40,
  },
  {
    date: "Jun 15",
    skills: 4,
    consistency: 55,
  },
  {
    date: "Jul 10",
    skills: 5,
    consistency: 78,
  },
]

export function RoutineEvolutionChart() {
  return (
    <ChartContainer
      config={{
        skills: {
          label: "Skills Count",
          color: "hsl(var(--chart-1))",
        },
        consistency: {
          label: "Consistency %",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 20,
          }}
        >
          <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={10} />
          <YAxis
            yAxisId="left"
            orientation="left"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            domain={[0, 10]}
            label={{ value: "Skills", angle: -90, position: "insideLeft" }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
            label={{ value: "Consistency", angle: 90, position: "insideRight" }}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent className="border-none shadow-none bg-background p-2 rounded-md" showArrow={false} />
            }
          />
          <Bar yAxisId="left" dataKey="skills" fill="var(--color-skills)" radius={4} barSize={30} />
          <Bar yAxisId="right" dataKey="consistency" fill="var(--color-consistency)" radius={4} barSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
