"use client"

import { useState } from "react"
import {
  format,
  addDays,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isWithinInterval,
} from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DailyLogPanel } from "@/components/daily-log-panel"
import { CalendarSidebar } from "@/components/calendar-sidebar"
import { DragDropContext, type DropResult } from "@hello-pangea/dnd"

// Sample data for calendar events
const events = [
  { date: new Date(2025, 6, 12), type: "Routine", phase: "Peak", name: "Competition Routine" },
  { date: new Date(2025, 6, 14), type: "Skills", phase: "Peak", name: "Back Tuck" },
  { date: new Date(2025, 6, 16), type: "Conditioning", phase: "Peak", name: "Beach Abs" },
  { date: new Date(2025, 6, 18), type: "Routine", phase: "Peak", name: "Competition Routine" },
  { date: new Date(2025, 6, 20), type: "Recovery", phase: "Recovery", name: "Recovery Session" },
]

// Sample phases data
const phases = [
  {
    id: "phase-1",
    name: "Build Phase",
    type: "Build",
    startDate: new Date(2025, 6, 1),
    endDate: new Date(2025, 6, 20),
    color: "bg-blue-500",
  },
  {
    id: "phase-2",
    name: "Peak Phase",
    type: "Peak",
    startDate: new Date(2025, 6, 21),
    endDate: new Date(2025, 7, 10),
    color: "bg-purple-500",
  },
]

export function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [monthView, setMonthView] = useState<"1" | "2" | "3">("1")
  const [calendarEvents, setCalendarEvents] = useState(events)

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setIsSheetOpen(true)
  }

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) return

    // Parse the destination date from the droppableId
    const destinationDate = new Date(destination.droppableId)

    // Create new event based on dragged item
    const newEvent = {
      date: destinationDate,
      type: source.droppableId.includes("routine")
        ? "Routine"
        : source.droppableId.includes("skill")
          ? "Skills"
          : source.droppableId.includes("conditioning")
            ? "Conditioning"
            : "Routine",
      phase: "Peak", // This would be determined by the current phase
      name: draggableId, // This would be the actual name from the dragged item
    }

    setCalendarEvents([...calendarEvents, newEvent])
  }

  const renderMonth = (monthDate: Date, index: number) => {
    const firstDayOfMonth = startOfMonth(monthDate)
    const lastDayOfMonth = endOfMonth(monthDate)
    const daysInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth })

    // Add days from previous month to start the calendar on Sunday
    const startDay = firstDayOfMonth.getDay()
    const daysFromPreviousMonth = Array.from({ length: startDay }, (_, i) => addDays(firstDayOfMonth, -startDay + i))

    // Add days from next month to complete the calendar grid
    const endDay = 6 - lastDayOfMonth.getDay()
    const daysFromNextMonth = Array.from({ length: endDay }, (_, i) => addDays(lastDayOfMonth, i + 1))

    const allDays = [...daysFromPreviousMonth, ...daysInMonth, ...daysFromNextMonth]

    const getEventForDate = (date: Date) => {
      return calendarEvents.filter((event) => isSameDay(event.date, date))
    }

    const getPhaseForDate = (date: Date) => {
      return phases.find((phase) => isWithinInterval(date, { start: phase.startDate, end: phase.endDate }))
    }

    const getEventTypeColor = (type: string) => {
      switch (type) {
        case "Routine":
          return "bg-purple-500"
        case "Skills":
          return "bg-blue-500"
        case "Conditioning":
          return "bg-red-500"
        case "Recovery":
          return "bg-green-500"
        default:
          return "bg-gray-500"
      }
    }

    return (
      <Card key={index} className="flex-1">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-center">{format(monthDate, "MMMM yyyy")}</h3>
        </div>
        <CardContent className="p-0">
          <div className="grid grid-cols-7 text-center">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="py-2 font-medium text-sm border-b">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {allDays.map((day, i) => {
              const dayEvents = getEventForDate(day)
              const phase = getPhaseForDate(day)
              return (
                <div
                  key={i}
                  className={cn(
                    "border p-1 relative min-h-[80px]",
                    !isSameMonth(day, monthDate) && "text-muted-foreground bg-muted/50",
                    "hover:bg-muted cursor-pointer transition-colors",
                    phase && `border-l-4 ${phase.color.replace("bg-", "border-l-")}`,
                  )}
                  onClick={() => handleDateClick(day)}
                  data-date={day.toISOString()}
                >
                  <div className="text-right p-1 text-xs">{format(day, "d")}</div>
                  {phase && <div className="absolute top-1 left-1 text-xs text-muted-foreground">{phase.name}</div>}
                  <div className="space-y-1 mt-4">
                    {dayEvents.slice(0, 2).map((event, idx) => (
                      <div
                        key={idx}
                        className={cn("text-xs rounded p-1 text-white truncate", getEventTypeColor(event.type))}
                      >
                        {event.name}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-muted-foreground">+{dayEvents.length - 2} more</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    )
  }

  const getMonthsToDisplay = () => {
    const months = [currentMonth]
    if (monthView === "2" || monthView === "3") {
      months.push(addMonths(currentMonth, 1))
    }
    if (monthView === "3") {
      months.push(addMonths(currentMonth, 2))
    }
    return months
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex h-full">
        <CalendarSidebar />
        <div className="flex-1 p-4 md:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Training Calendar</h2>
            <div className="flex items-center space-x-4">
              <Tabs value={monthView} onValueChange={(value) => setMonthView(value as "1" | "2" | "3")}>
                <TabsList>
                  <TabsTrigger value="1">1 Month</TabsTrigger>
                  <TabsTrigger value="2">2 Months</TabsTrigger>
                  <TabsTrigger value="3">3 Months</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div
            className={cn(
              "flex gap-4",
              monthView === "1" && "justify-center",
              monthView === "2" && "grid grid-cols-2",
              monthView === "3" && "grid grid-cols-3",
            )}
          >
            {getMonthsToDisplay().map((month, index) => renderMonth(month, index))}
          </div>

          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetContent className="sm:max-w-md">
              <SheetHeader>
                <SheetTitle>{selectedDate ? format(selectedDate, "EEEE, MMMM d, yyyy") : "Select a date"}</SheetTitle>
                <SheetDescription>Log your training details for this day</SheetDescription>
              </SheetHeader>
              {selectedDate && <DailyLogPanel date={selectedDate} />}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </DragDropContext>
  )
}
