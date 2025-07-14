"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"

// Sample skills data
const allSkills = [
  "Front Handspring",
  "Back Handspring",
  "Round-off",
  "Cartwheel",
  "Back Walkover",
  "Front Walkover",
  "Aerial",
  "Back Tuck",
  "Front Tuck",
  "Layout",
  "Full Twist",
  "Double Full",
]

interface DailyLogPanelProps {
  date: Date
}

export function DailyLogPanel({ date }: DailyLogPanelProps) {
  const [practiceType, setPracticeType] = useState("Routine")
  const [skillsCount, setSkillsCount] = useState("10")
  const [sequencesCount, setSequencesCount] = useState("5")
  const [routinesCount, setRoutinesCount] = useState("8")
  const [hitRate, setHitRate] = useState(75)
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [notes, setNotes] = useState("")

  const handleSkillToggle = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill))
    } else {
      setSelectedSkills([...selectedSkills, skill])
    }
  }

  const handleSave = () => {
    // In a real app, this would save to a database
    console.log({
      date,
      practiceType,
      skillsCount,
      sequencesCount,
      routinesCount,
      hitRate,
      selectedSkills,
      notes,
    })
    alert("Training log saved!")
  }

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="practice-type">Practice Type</Label>
        <Select value={practiceType} onValueChange={setPracticeType}>
          <SelectTrigger id="practice-type">
            <SelectValue placeholder="Select practice type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Routine">Routine</SelectItem>
            <SelectItem value="Skills">Skills</SelectItem>
            <SelectItem value="Conditioning">Conditioning</SelectItem>
            <SelectItem value="Recovery">Recovery</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="skills-count">Skills Practiced</Label>
          <Input id="skills-count" type="number" value={skillsCount} onChange={(e) => setSkillsCount(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sequences-count">Sequences Practiced</Label>
          <Input
            id="sequences-count"
            type="number"
            value={sequencesCount}
            onChange={(e) => setSequencesCount(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="routines-count">Routines Attempted</Label>
          <Input
            id="routines-count"
            type="number"
            value={routinesCount}
            onChange={(e) => setRoutinesCount(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hit-rate">Hit Rate (%)</Label>
          <div className="pt-2">
            <Slider
              id="hit-rate"
              min={0}
              max={100}
              step={1}
              value={[hitRate]}
              onValueChange={(value) => setHitRate(value[0])}
            />
            <div className="text-right text-sm mt-1">{hitRate}%</div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Skills Worked On</Label>
        <Card>
          <CardHeader className="py-2 px-4">
            <CardTitle className="text-sm font-medium">Selected Skills: {selectedSkills.length}</CardTitle>
          </CardHeader>
          <CardContent className="px-4 py-2">
            <ScrollArea className="h-[120px]">
              <div className="space-y-2">
                {allSkills.map((skill) => (
                  <div key={skill} className="flex items-center space-x-2">
                    <Checkbox
                      id={`skill-${skill}`}
                      checked={selectedSkills.includes(skill)}
                      onCheckedChange={() => handleSkillToggle(skill)}
                    />
                    <Label htmlFor={`skill-${skill}`} className="text-sm font-normal cursor-pointer">
                      {skill}
                    </Label>
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
          placeholder="Add any notes about today's training..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={handleSave}>Save Training Log</Button>
      </div>
    </div>
  )
}
