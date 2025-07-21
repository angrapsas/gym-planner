"use client"

import { useState, useEffect } from "react"
import { format, addDays, isWithinInterval } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Plus, Calendar as CalendarIcon, Trash2, Info } from "lucide-react"
import { useGymData } from "@/context/GymDataContext"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

// Sample phases data
const initialPhases = [
  {
    id: "phase-1",
    name: "Build Phase 1",
    type: "Build",
    startDate: new Date(2025, 5, 1),
    endDate: new Date(2025, 5, 30),
    color: "bg-blue-500",
  },
  {
    id: "phase-2",
    name: "Build Phase 2",
    type: "Build",
    startDate: new Date(2025, 6, 1),
    endDate: new Date(2025, 6, 20),
    color: "bg-blue-500",
  },
  {
    id: "phase-3",
    name: "Peak Phase",
    type: "Peak",
    startDate: new Date(2025, 6, 21),
    endDate: new Date(2025, 7, 10),
    color: "bg-purple-500",
  },
  {
    id: "phase-4",
    name: "Recovery",
    type: "Recovery",
    startDate: new Date(2025, 7, 11),
    endDate: new Date(2025, 7, 20),
    color: "bg-green-500",
  },
  {
    id: "phase-5",
    name: "Competition Prep",
    type: "Peak",
    startDate: new Date(2025, 7, 21),
    endDate: new Date(2025, 7, 31),
    color: "bg-purple-500",
  },
]

export function PhasesTimeline() {
  const { phases: contextPhases, setPhases } = useGymData();
  
  // Convert context phases to the format expected by this component
  const phases = contextPhases.map(phase => ({
    ...phase,
    startDate: phase.startDate instanceof Date ? phase.startDate : new Date(phase.startDate),
    endDate: phase.endDate instanceof Date ? phase.endDate : new Date(phase.endDate),
  }));
  
  const [newPhaseName, setNewPhaseName] = useState("")
  const [newPhaseType, setNewPhaseType] = useState("Build")
  const [newStartDate, setNewStartDate] = useState<Date | null>(null)
  const [newEndDate, setNewEndDate] = useState<Date | null>(null)
  const [routines, setRoutines] = useState<any[]>([]);
  // Routine assignment state
  const [routineAssignments, setRoutineAssignments] = useState<{
    [routineId: string]: string[]; // days of week
  }>({});
  const [selectedRoutines, setSelectedRoutines] = useState<string[]>([]);
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    async function fetchRoutines() {
      const { data, error } = await supabase.from("routines").select("*");
      if (!error) setRoutines(data || []);
    }
    fetchRoutines();
  }, []);

  const getPhaseTypeColor = (type: string) => {
    switch (type) {
      case "Build":
        return "bg-blue-500"
      case "Peak":
        return "bg-purple-500"
      case "Taper":
        return "bg-orange-500"
      case "Recovery":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  // Enhanced phase creation logic
  const addNewPhase = async () => {
    if (!newPhaseName.trim() || !newStartDate || !newEndDate) return;
    try {
      // 1. Insert phase
      const { data: phaseData, error: phaseError } = await supabase
        .from("phases")
        .insert({
          name: newPhaseName,
          phase_type: newPhaseType,
          start_date: newStartDate.toISOString().split("T")[0],
          end_date: newEndDate.toISOString().split("T")[0],
          color: getPhaseTypeColor(newPhaseType),
        })
        .select()
        .single();
      if (phaseError) {
        console.error("Error adding phase:", phaseError);
        return;
      }
      // 2. Insert phase_routines for each selected routine
      for (const routineId of selectedRoutines) {
        const days = routineAssignments[routineId] || [];
        if (days.length > 0) {
          const { error: prError } = await supabase
            .from("phase_routines")
            .insert({
              phase_id: phaseData.id,
              routine_id: routineId,
              days_of_week: days,
            });
          if (prError) {
            console.error("Error adding phase_routine:", prError);
          }
        }
      }
      // 3. Reset state
      setPhases([...phases, {
        ...phaseData,
        startDate: new Date(phaseData.start_date),
        endDate: new Date(phaseData.end_date),
      }]);
      setNewPhaseName("");
      setNewPhaseType("Build");
      setNewStartDate(null);
      setNewEndDate(null);
      setRoutineAssignments({});
      setSelectedRoutines([]);
    } catch (error) {
      console.error("Error adding phase:", error);
    }
  };

  const deletePhase = async (phaseId: string) => {
    try {
      const { error } = await supabase
        .from("phases")
        .delete()
        .eq("id", phaseId)

      if (error) {
        console.error("Error deleting phase:", error)
        return
      }

      setPhases(phases.filter((phase) => phase.id !== phaseId))
    } catch (error) {
      console.error("Error deleting phase:", error)
    }
  }

  const today = new Date()
  const currentPhase = phases.find((phase) => isWithinInterval(today, { start: phase.startDate, end: phase.endDate }))

  return (
    <div className="p-4 md:p-8 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Training Phases</h2>
        {currentPhase && (
          <Badge className={`${currentPhase.color} text-white px-3 py-1`}>Current Phase: {currentPhase.name}</Badge>
        )}
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Create phases here with specific start and end dates. Phases will appear as colored bars in the Calendar view.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Phases Timeline</CardTitle>
          <CardDescription>Plan and visualize your training phases</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-0 top-6 bottom-0 w-0.5 bg-muted" />

              {/* Phases */}
              <div className="space-y-8 relative">
                {phases
                  .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
                  .map((phase) => (
                    <div key={phase.id} className="ml-6 relative">
                      {/* Timeline dot */}
                      <div className={`absolute -left-9 top-3 w-3 h-3 rounded-full ${phase.color}`} />

                      <Card>
                        <CardHeader className={`${phase.color} text-white rounded-t-lg py-2 px-4`}>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{phase.name}</CardTitle>
                            <Badge variant="outline" className="text-white border-white">
                              {phase.type}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="py-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {format(phase.startDate, "MMM d, yyyy")} - {format(phase.endDate, "MMM d, yyyy")}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {Math.ceil(
                                  (phase.endDate.getTime() - phase.startDate.getTime()) / (1000 * 60 * 60 * 24),
                                )}{" "}
                                days
                              </Badge>
                            </div>
                            <div className="flex space-x-1">
                              <Button variant="ghost" size="icon" onClick={() => deletePhase(phase.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Create New Phase</CardTitle>
          <CardDescription>
            Create a new training phase with specific start and end dates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phase-name">Phase Name</Label>
                <Input
                  id="phase-name"
                  placeholder="Enter phase name"
                  value={newPhaseName}
                  onChange={(e) => setNewPhaseName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phase-type">Phase Type</Label>
                <Select value={newPhaseType} onValueChange={setNewPhaseType}>
                  <SelectTrigger id="phase-type">
                    <SelectValue placeholder="Select phase type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Build">Build</SelectItem>
                    <SelectItem value="Peak">Peak</SelectItem>
                    <SelectItem value="Taper">Taper</SelectItem>
                    <SelectItem value="Recovery">Recovery</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "justify-start text-left font-normal",
                        !newStartDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newStartDate ? format(newStartDate, "PPP") : <span>Pick start date</span>}
                      {newStartDate && <span className="ml-2 text-xs text-green-600">✓</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newStartDate || undefined}
                      onSelect={(date) => setNewStartDate(date || null)}
                      initialFocus
                      disabled={(date) => date < new Date("1900-01-01")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "justify-start text-left font-normal",
                        !newEndDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newEndDate ? format(newEndDate, "PPP") : <span>Pick end date</span>}
                      {newEndDate && <span className="ml-2 text-xs text-green-600">✓</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newEndDate || undefined}
                      onSelect={(date) => setNewEndDate(date || null)}
                      initialFocus
                      disabled={(date) => date < new Date("1900-01-01")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            {/* Assign Routines Section */}
            <div className="space-y-2">
              <Label>Assign Routines</Label>
              <ScrollArea className="h-48 border rounded-md p-2">
                {routines.length === 0 && <div className="text-sm text-muted-foreground">No routines found.</div>}
                {routines.map((routine) => (
                  <div key={routine.id} className="mb-2">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`routine-${routine.id}`}
                        checked={selectedRoutines.includes(routine.id)}
                        onCheckedChange={(checked) => {
                          setSelectedRoutines((prev) =>
                            checked
                              ? [...prev, routine.id]
                              : prev.filter((id) => id !== routine.id)
                          );
                          if (!checked) {
                            setRoutineAssignments((prev) => {
                              const copy = { ...prev };
                              delete copy[routine.id];
                              return copy;
                            });
                          }
                        }}
                      />
                      <Label htmlFor={`routine-${routine.id}`}>{routine.name}</Label>
                    </div>
                    {selectedRoutines.includes(routine.id) && (
                      <div className="flex flex-wrap gap-2 ml-6 mt-1">
                        {daysOfWeek.map((day) => (
                          <div key={day} className="flex items-center gap-1">
                            <Checkbox
                              id={`routine-${routine.id}-day-${day}`}
                              checked={routineAssignments[routine.id]?.includes(day) || false}
                              onCheckedChange={(checked) => {
                                setRoutineAssignments((prev) => {
                                  const prevDays = prev[routine.id] || [];
                                  return {
                                    ...prev,
                                    [routine.id]: checked
                                      ? [...prevDays, day]
                                      : prevDays.filter((d) => d !== day),
                                  };
                                });
                              }}
                            />
                            <Label htmlFor={`routine-${routine.id}-day-${day}`}>{day.slice(0, 3)}</Label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </ScrollArea>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={addNewPhase}
            disabled={!newPhaseName.trim() || !newStartDate || !newEndDate}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Phase
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
