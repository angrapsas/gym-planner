"use client";
import { useEffect, useState } from "react";
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
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DailyLogPanel } from "@/components/daily-log-panel";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { supabase } from "@/lib/supabase";

export function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [monthView, setMonthView] = useState<"1" | "2" | "3">("1");

  // Live data from Supabase
  const [routines, setRoutines] = useState<any[]>([]);
  const [phases, setPhases] = useState<any[]>([]);
  const [conditioning, setConditioning] = useState<any[]>([]);

  // Fetch data from Supabase
  useEffect(() => {
    async function fetchData() {
      try {
        console.log("Starting to fetch data from Supabase...");
        
        const { data: routinesData, error: routinesError } = await supabase.from("routines").select("*");
        if (routinesError) {
          console.error("Error fetching routines:", routinesError);
        }
        setRoutines(routinesData || []);

        const { data: phasesData, error: phasesError } = await supabase.from("phases").select("*");
        if (phasesError) {
          console.error("Error fetching phases:", phasesError);
        }
        setPhases(phasesData || []);

        const { data: conditioningData, error: conditioningError } = await supabase.from("conditioning").select("*");
        if (conditioningError) {
          console.error("Error fetching conditioning:", conditioningError);
        }
        setConditioning(conditioningData || []);
        
        // Debug log:
        console.log("Routines:", routinesData);
        console.log("Phases:", phasesData);
        console.log("Conditioning:", conditioningData);
        console.log("Fetch completed successfully");
      } catch (error) {
        console.error("Error in fetchData:", error);
      }
    }
    fetchData();
  }, []);

  // Combine all events for the calendar
  const calendarEvents = [
    ...routines
      .filter(r => r.date)
      .map(r => ({
        date: new Date(r.date + 'T00:00:00'), // Force local timezone
        type: "Routine",
        name: r.name,
        skills: r.skills || [],
      })),
    ...conditioning
      .filter(c => c.date)
      .map(c => ({
        date: new Date(c.date + 'T00:00:00'), // Force local timezone
        type: "Conditioning",
        name: c.name,
        exercises: c.exercises || [],
      })),
    // Add more as needed (e.g., skills, recovery, etc.)
  ];

  // Debug: Log the processed events
  console.log("Raw routines:", routines);
  console.log("Raw conditioning:", conditioning);
  console.log("Processed calendar events:", calendarEvents);
  console.log("Events with dates:", calendarEvents.filter(e => e.date));

  // Drag-and-drop handler (optional, can be removed if not needed)
  const handleDragEnd = (result: DropResult) => {
    // You can implement drag-to-schedule logic here if you want
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsSheetOpen(true);
  };

  const renderMonth = (monthDate: Date, index: number) => {
    const firstDayOfMonth = startOfMonth(monthDate);
    const lastDayOfMonth = endOfMonth(monthDate);
    const daysInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });

    // Add days from previous month to start the calendar on Sunday
    const startDay = firstDayOfMonth.getDay();
    const daysFromPreviousMonth = Array.from({ length: startDay }, (_, i) => addDays(firstDayOfMonth, -startDay + i));

    // Add days from next month to complete the calendar grid
    const endDay = 6 - lastDayOfMonth.getDay();
    const daysFromNextMonth = Array.from({ length: endDay }, (_, i) => addDays(lastDayOfMonth, i + 1));

    const allDays = [...daysFromPreviousMonth, ...daysInMonth, ...daysFromNextMonth];

    const getEventForDate = (date: Date) => {
      const events = calendarEvents.filter((event) => isSameDay(event.date, date));
      // Debug: Log events for specific dates (only for today and a few other dates to avoid spam)
      if (isSameDay(date, new Date()) || date.getDate() <= 5) {
        console.log(`Events for ${format(date, 'yyyy-MM-dd')}:`, events);
      }
      return events;
    };

    const getPhaseForDate = (date: Date) => {
      return phases.find((phase) =>
        isWithinInterval(date, { 
          start: new Date(phase.start_date + 'T00:00:00'), 
          end: new Date(phase.end_date + 'T00:00:00') 
        })
      );
    };

    const getEventTypeColor = (type: string) => {
      switch (type) {
        case "Routine":
          return "bg-purple-500";
        case "Skills":
          return "bg-blue-500";
        case "Conditioning":
          return "bg-red-500";
        case "Recovery":
          return "bg-green-500";
        default:
          return "bg-gray-500";
      }
    };

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
              const dayEvents = getEventForDate(day);
              const phase = getPhaseForDate(day);
              
              // Determine if this is the first or last day of the phase for rounded corners
              const isFirstDay = phase ? isSameDay(day, new Date(phase.start_date + 'T00:00:00')) : false;
              const isLastDay = phase ? isSameDay(day, new Date(phase.end_date + 'T00:00:00')) : false;

              return (
                <div
                  key={i}
                  className={cn(
                    "border p-1 relative min-h-[80px]",
                    !isSameMonth(day, monthDate) && "text-muted-foreground bg-muted/50",
                    "hover:bg-muted cursor-pointer transition-colors",
                  )}
                  onClick={() => handleDateClick(day)}
                  data-date={day.toISOString()}
                >
                  <div className="text-right p-1 text-xs">{format(day, "d")}</div>
                  
                  {/* Phase Bar */}
                  {phase && (
                    <div 
                      className={cn(
                        "absolute top-6 left-0 right-0 h-4 text-white text-xs font-medium flex items-center px-1",
                        phase.color || "bg-blue-500",
                        isFirstDay && "rounded-l-sm",
                        isLastDay && "rounded-r-sm",
                        !isFirstDay && "ml-0",
                        !isLastDay && "mr-0"
                      )}
                      style={{
                        // Ensure the bar extends to the edges for seamless connection
                        marginLeft: isFirstDay ? 0 : -1,
                        marginRight: isLastDay ? 0 : -1,
                        zIndex: 10
                      }}
                    >
                      {/* Only show phase name on the first day to avoid repetition */}
                      {isFirstDay && (
                        <span className="truncate">{phase.name}</span>
                      )}
                    </div>
                  )}
                  
                  <div className="space-y-1 mt-12">
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
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  const getMonthsToDisplay = () => {
    const months = [currentMonth];
    if (monthView === "2" || monthView === "3") {
      months.push(addMonths(currentMonth, 1));
    }
    if (monthView === "3") {
      months.push(addMonths(currentMonth, 2));
    }
    return months;
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex h-full">
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
  );
}
