"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

// Sample routines data (this would come from the routines tab)
const availableRoutines = [
  { id: "routine-1", name: "Competition Routine", type: "Routine" },
  { id: "routine-2", name: "Practice Routine", type: "Routine" },
  { id: "routine-3", name: "Warm-up Routine", type: "Routine" },
]

// Sample conditioning data (this would come from the conditioning tab)
const availableConditioning = [
  { id: "cond-1", name: "Beach Abs", type: "Conditioning" },
  { id: "cond-2", name: "Upper Body", type: "Conditioning" },
  { id: "cond-3", name: "Lower Body", type: "Conditioning" },
  { id: "cond-4", name: "Cardio", type: "Conditioning" },
  { id: "cond-5", name: "Flexibility", type: "Conditioning" },
]

interface DailyLogPanelProps {
  date: Date
}

export function DailyLogPanel({ date }: DailyLogPanelProps) {
  const [selectedRoutines, setSelectedRoutines] = useState<string[]>([])
  const [selectedConditioning, setSelectedConditioning] = useState<string[]>([])
  const [notes, setNotes] = useState("")

  const handleRoutineToggle = (routineId: string) => {
    if (selectedRoutines.includes(routineId)) {
      setSelectedRoutines(selectedRoutines.filter((id) => id !== routineId))
    } else {
      setSelectedRoutines([...selectedRoutines, routineId])
    }
  }

  const handleConditioningToggle = (conditioningId: string) => {
    if (selectedConditioning.includes(conditioningId)) {
      setSelectedConditioning(selectedConditioning.filter((id) => id !== conditioningId))
    } else {
      setSelectedConditioning([...selectedConditioning, conditioningId])
    }
  }

  const handleSave = () => {
    // In a real app, this would save to a database
    console.log({
      date,
      selectedRoutines,
      selectedConditioning,
      notes,
    })
    alert("Day schedule saved!")
  }

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label>Routines</Label>
        <Card>
          <CardHeader className="py-2 px-4">
            <CardTitle className="text-sm font-medium">Select Routines: {selectedRoutines.length}</CardTitle>
          </CardHeader>
          <CardContent className="px-4 py-2">
            <ScrollArea className="h-[120px]">
              <div className="space-y-2">
                {availableRoutines.map((routine) => (
                  <div key={routine.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`routine-${routine.id}`}
                      checked={selectedRoutines.includes(routine.id)}
                      onCheckedChange={() => handleRoutineToggle(routine.id)}
                    />
                    <Label htmlFor={`routine-${routine.id}`} className="text-sm font-normal cursor-pointer">
                      {routine.name}
                    </Label>
                    <Badge variant="outline" className="ml-auto text-xs">
                      {routine.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2">
        <Label>Conditioning</Label>
        <Card>
          <CardHeader className="py-2 px-4">
            <CardTitle className="text-sm font-medium">Select Conditioning: {selectedConditioning.length}</CardTitle>
          </CardHeader>
          <CardContent className="px-4 py-2">
            <ScrollArea className="h-[120px]">
              <div className="space-y-2">
                {availableConditioning.map((conditioning) => (
                  <div key={conditioning.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`conditioning-${conditioning.id}`}
                      checked={selectedConditioning.includes(conditioning.id)}
                      onCheckedChange={() => handleConditioningToggle(conditioning.id)}
                    />
                    <Label htmlFor={`conditioning-${conditioning.id}`} className="text-sm font-normal cursor-pointer">
                      {conditioning.name}
                    </Label>
                    <Badge variant="outline" className="ml-auto text-xs">
                      {conditioning.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Add any notes about this day's training..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={handleSave}>Save Day Schedule</Button>
      </div>
    </div>
  )
}
