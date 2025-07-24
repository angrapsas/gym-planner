"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { GripVertical, Plus, Save, Star, Trash2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useGymData } from "@/context/GymDataContext"
import { supabase } from "@/lib/supabase"

// Sample routines data
const initialRoutines = [
  {
    id: "routine-1",
    name: "Competition Routine",
    isTarget: true,
    skills: [
      { id: "skill-1", name: "Round-off", readiness: "Consistent" },
      { id: "skill-2", name: "Back Handspring", readiness: "Consistent" },
      { id: "skill-3", name: "Back Tuck", readiness: "Learning" },
      { id: "skill-4", name: "Front Handspring", readiness: "Consistent" },
      { id: "skill-5", name: "Front Walkover", readiness: "Consistent" },
    ],
  },
  {
    id: "routine-2",
    name: "Practice Routine",
    isTarget: false,
    skills: [
      { id: "skill-6", name: "Cartwheel", readiness: "Consistent" },
      { id: "skill-7", name: "Round-off", readiness: "Consistent" },
      { id: "skill-8", name: "Back Walkover", readiness: "Learning" },
    ],
  },
  {
    id: "routine-3",
    name: "Warm-up Routine",
    isTarget: false,
    skills: [
      { id: "skill-9", name: "Front Walkover", readiness: "Consistent" },
      { id: "skill-10", name: "Cartwheel", readiness: "Consistent" },
    ],
  },
]

// Sample available skills
const availableSkills = [
  { id: "avail-1", name: "Round-off", readiness: "Consistent" },
  { id: "avail-2", name: "Back Handspring", readiness: "Consistent" },
  { id: "avail-3", name: "Back Tuck", readiness: "Learning" },
  { id: "avail-4", name: "Front Handspring", readiness: "Consistent" },
  { id: "avail-5", name: "Front Walkover", readiness: "Consistent" },
  { id: "avail-6", name: "Cartwheel", readiness: "Consistent" },
  { id: "avail-7", name: "Back Walkover", readiness: "Learning" },
  { id: "avail-8", name: "Aerial", readiness: "Not Started" },
  { id: "avail-9", name: "Layout", readiness: "Not Started" },
  { id: "avail-10", name: "Full Twist", readiness: "Not Started" },
]

export function RoutineBuilder() {
  const { routines = [], setRoutines } = useGymData();
  const [activeRoutine, setActiveRoutine] = useState(routines[0]?.id || "");
  const [newRoutineName, setNewRoutineName] = useState("");
  const [newSkillName, setNewSkillName] = useState("");
  const [newRoutineDate, setNewRoutineDate] = useState("");
  const [loading, setLoading] = useState(false);




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

  const handleDragEnd = (result: DropResult) => {
    const { destination, source } = result

    if (!destination) return

    const currentRoutine = routines.find((r) => r.id === activeRoutine)
    if (!currentRoutine) return

    const newSkills = Array.from(currentRoutine.skills ?? [])
    const [removed] = newSkills.splice(source.index, 1)
    newSkills.splice(destination.index, 0, removed)

    setRoutines(routines.map((routine) => (routine.id === activeRoutine ? { ...routine, skills: newSkills } : routine)))
  }

  const addNewRoutine = async () => {
    if (!newRoutineName.trim()) return

    try {
      const routineData: any = {
        name: newRoutineName,
        skills: [],
        created_at: new Date().toISOString()
      };
      
      if (newRoutineDate) {
        routineData.date = newRoutineDate;
      }
      
      const { data, error } = await supabase
        .from("routines")
        .insert(routineData)
        .select()
        .single()

      if (error) {
        console.error("Error adding routine:", error)
        return
      }

      const newRoutine = {
        id: data.id,
        name: data.name,
        skills: data.skills || [],
        isTarget: false,
      }

      setRoutines([...routines, newRoutine])
      setNewRoutineName("")
      setNewRoutineDate("")
      setActiveRoutine(newRoutine.id)
    } catch (error) {
      console.error("Error adding routine:", error)
    }
  }

  async function removeRoutine(id: string) {
    setLoading(true);
    const { error } = await supabase.from("routines").delete().eq("id", id);
    if (error) {
      console.error(error);
    } else {
      setRoutines((prev) => prev.filter((r) => r.id !== id));
    }
    setLoading(false);
  }

  const addNewSkill = async () => {
    if (!newSkillName.trim()) return

    try {
      const currentRoutine = routines.find((r) => r.id === activeRoutine)
      if (!currentRoutine) return

      const newSkill = {
        id: `skill-${Date.now()}`,
        name: newSkillName,
        readiness: "Not Started",
      }

      const updatedSkills = [...(currentRoutine.skills ?? []), newSkill]

      const { error } = await supabase
        .from("routines")
        .update({ skills: updatedSkills })
        .eq("id", activeRoutine)

      if (error) {
        console.error("Error updating routine skills:", error)
        return
      }

      setRoutines(
        routines.map((routine) =>
          routine.id === activeRoutine ? { ...routine, skills: updatedSkills } : routine,
        ),
      )

      setNewSkillName("")
    } catch (error) {
      console.error("Error adding skill:", error)
    }
  }

  const removeSkill = (skillId: string) => {
    setRoutines(
      routines.map((routine) =>
        routine.id === activeRoutine
          ? { ...routine, skills: (routine.skills ?? []).filter((skill) => skill.id !== skillId) }
          : routine,
      ),
    )
  }

  const setTargetRoutine = (routineId: string) => {
    setRoutines(
      routines.map((routine) => ({
        ...routine,
        isTarget: routine.id === routineId,
      })),
    )
  }

  const currentRoutine = routines.find((r) => r.id === activeRoutine);

  return (
    <div className="p-4 md:p-8 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Routine Builder</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Routines</CardTitle>
            <CardDescription>Create and manage your routines</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {routines.map((routine) => (
                  <Card key={routine.id} className={`cursor-pointer ${activeRoutine === routine.id ? "bg-muted" : "hover:bg-muted/50"}`}>
                    <CardHeader className="flex flex-row items-center justify-between p-2">
                      <div className="flex items-center space-x-2" onClick={() => setActiveRoutine(routine.id)}>
                        {routine.isTarget && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                        <span>{routine.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{routine.skills?.length ?? 0} skills</Badge>
                        <Button variant="ghost" size="icon" onClick={() => removeRoutine(routine.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="flex w-full space-x-2">
              <Input
                placeholder="New routine name"
                value={newRoutineName}
                onChange={(e) => setNewRoutineName(e.target.value)}
              />
              <Button size="sm" onClick={addNewRoutine}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex w-full space-x-2">
              <Input
                type="date"
                placeholder="Schedule date (optional)"
                value={newRoutineDate}
                onChange={(e) => setNewRoutineDate(e.target.value)}
              />
            </div>
          </CardFooter>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{currentRoutine?.name || "Select a Routine"}</CardTitle>
                <CardDescription>Drag and drop to reorder skills</CardDescription>
              </div>
              {currentRoutine && (
                <div className="flex space-x-2">
                  <Button
                    variant={currentRoutine.isTarget ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTargetRoutine(currentRoutine.id)}
                  >
                    <Star className={`h-4 w-4 mr-1 ${currentRoutine.isTarget ? "fill-white" : ""}`} />
                    {currentRoutine.isTarget ? "Target Routine" : "Set as Target"}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {currentRoutine ? (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="skills">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2 min-h-[300px]">
                      {(currentRoutine.skills ?? []).map((skill, index) => (
                        <Draggable key={skill.id} draggableId={skill.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="flex items-center justify-between p-3 bg-muted rounded-md"
                            >
                              <div className="flex items-center space-x-3">
                                <div {...provided.dragHandleProps}>
                                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <span>{skill.name}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge className={`${getReadinessColor(skill.readiness)} text-white`}>
                                  {skill.readiness}
                                </Badge>
                                <Button variant="ghost" size="icon" onClick={() => removeSkill(skill.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                Select a routine to edit
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            {currentRoutine && (
              <div className="flex w-full space-x-2">
                <Input
                  placeholder="Add a skill"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                />
                <Button size="sm" onClick={addNewSkill}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
