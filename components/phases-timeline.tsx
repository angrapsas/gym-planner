"use client"

import { useState } from "react"
import { format, addDays, isWithinInterval } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Calendar, Edit, Trash2, Info } from "lucide-react"
import { useGymData } from "@/context/GymDataContext"
import { supabase } from "@/lib/supabase"

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
  const [isCreatingPhase, setIsCreatingPhase] = useState(false)
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null)

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

  const addNewPhase = async () => {
    if (!newPhaseName.trim() || !selectedStartDate) return

    const endDate = addDays(selectedStartDate, 14) // Default 2-week phase

    try {
      const { data, error } = await supabase
        .from("phases")
        .insert({
          name: newPhaseName,
          phase_type: newPhaseType,
          start_date: selectedStartDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          color: getPhaseTypeColor(newPhaseType),
        })
        .select()
        .single()

      if (error) {
        console.error("Error adding phase:", error)
        return
      }

      const newPhase = {
        id: data.id,
        name: data.name,
        type: data.phase_type,
        startDate: new Date(data.start_date),
        endDate: new Date(data.end_date),
        color: data.color,
      }

      setPhases([...phases, newPhase])
      setNewPhaseName("")
      setNewPhaseType("Build")
      setSelectedStartDate(null)
      setIsCreatingPhase(false)
    } catch (error) {
      console.error("Error adding phase:", error)
    }
  }

  const deletePhase = (phaseId: string) => {
    setPhases(phases.filter((phase) => phase.id !== phaseId))
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
          Create phases here, then use the Calendar view to drag phase blocks across date ranges by clicking start and
          end dates.
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
                              <Calendar className="h-4 w-4 text-muted-foreground" />
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
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
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
            Create phase templates here. Use the Calendar view to drag and stretch phases across specific date ranges.
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
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => {
              if (newPhaseName.trim()) {
                setSelectedStartDate(new Date())
                addNewPhase()
              }
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Phase Template
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
