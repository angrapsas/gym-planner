"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Filter } from "lucide-react"

// Sample skills data
const initialSkills = [
  {
    id: "skill-1",
    name: "Round-off",
    readiness: "Consistent",
    lastPracticed: new Date(2025, 6, 10),
    routines: ["Competition Routine", "Practice Routine"],
  },
  {
    id: "skill-2",
    name: "Back Handspring",
    readiness: "Consistent",
    lastPracticed: new Date(2025, 6, 10),
    routines: ["Competition Routine"],
  },
  {
    id: "skill-3",
    name: "Back Tuck",
    readiness: "Learning",
    lastPracticed: new Date(2025, 6, 8),
    routines: ["Competition Routine"],
  },
  {
    id: "skill-4",
    name: "Front Handspring",
    readiness: "Consistent",
    lastPracticed: new Date(2025, 6, 5),
    routines: ["Competition Routine"],
  },
  {
    id: "skill-5",
    name: "Front Walkover",
    readiness: "Consistent",
    lastPracticed: new Date(2025, 6, 10),
    routines: ["Competition Routine", "Warm-up Routine"],
  },
  {
    id: "skill-6",
    name: "Cartwheel",
    readiness: "Consistent",
    lastPracticed: new Date(2025, 6, 9),
    routines: ["Practice Routine", "Warm-up Routine"],
  },
  {
    id: "skill-7",
    name: "Back Walkover",
    readiness: "Learning",
    lastPracticed: new Date(2025, 6, 7),
    routines: ["Practice Routine"],
  },
  {
    id: "skill-8",
    name: "Aerial",
    readiness: "Not Started",
    lastPracticed: null,
    routines: [],
  },
  {
    id: "skill-9",
    name: "Layout",
    readiness: "Not Started",
    lastPracticed: null,
    routines: [],
  },
  {
    id: "skill-10",
    name: "Full Twist",
    readiness: "Not Started",
    lastPracticed: null,
    routines: [],
  },
]

export function SkillTracker() {
  const [skills, setSkills] = useState(initialSkills)
  const [searchQuery, setSearchQuery] = useState("")
  const [readinessFilter, setReadinessFilter] = useState("All")
  const [newSkillName, setNewSkillName] = useState("")

  const getReadinessColor = (readiness: string) => {
    switch (readiness) {
      case "Consistent":
        return "bg-green-500"
      case "Learning":
        return "bg-yellow-500"
      case "Not Started":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const filteredSkills = skills.filter((skill) => {
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesReadiness = readinessFilter === "All" || skill.readiness === readinessFilter
    return matchesSearch && matchesReadiness
  })

  const addNewSkill = () => {
    if (!newSkillName.trim()) return

    const newSkill = {
      id: `skill-${Date.now()}`,
      name: newSkillName,
      readiness: "Not Started",
      lastPracticed: null,
      routines: [],
    }

    setSkills([...skills, newSkill])
    setNewSkillName("")
  }

  const updateSkillReadiness = (skillId: string, newReadiness: string) => {
    setSkills(skills.map((skill) => (skill.id === skillId ? { ...skill, readiness: newReadiness } : skill)))
  }

  return (
    <div className="p-4 md:p-8 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Skill Tracker</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Skills Progress</CardTitle>
          <CardDescription>Track your progress on individual skills</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search skills..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={readinessFilter} onValueChange={setReadinessFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by readiness" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Levels</SelectItem>
                    <SelectItem value="Consistent">Consistent</SelectItem>
                    <SelectItem value="Learning">Learning</SelectItem>
                    <SelectItem value="Not Started">Not Started</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex space-x-2">
                  <Input
                    placeholder="New skill name"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                  />
                  <Button size="sm" onClick={addNewSkill}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Skill Name</TableHead>
                    <TableHead>Readiness Level</TableHead>
                    <TableHead>Last Practiced</TableHead>
                    <TableHead>Routines</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSkills.map((skill) => (
                    <TableRow key={skill.id}>
                      <TableCell className="font-medium">{skill.name}</TableCell>
                      <TableCell>
                        <Badge className={`${getReadinessColor(skill.readiness)} text-white`}>{skill.readiness}</Badge>
                      </TableCell>
                      <TableCell>
                        {skill.lastPracticed ? format(skill.lastPracticed, "MMM d, yyyy") : "Never"}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {skill.routines.map((routine, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {routine}
                            </Badge>
                          ))}
                          {skill.routines.length === 0 && <span className="text-muted-foreground text-sm">None</span>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={skill.readiness}
                          onValueChange={(value) => updateSkillReadiness(skill.id, value)}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Not Started">Not Started</SelectItem>
                            <SelectItem value="Learning">Learning</SelectItem>
                            <SelectItem value="Consistent">Consistent</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredSkills.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        No skills found. Try adjusting your filters or add a new skill.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
