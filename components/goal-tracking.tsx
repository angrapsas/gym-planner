"use client"

import { useState } from "react"
import { format, differenceInDays } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/date-picker"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { GoalChart } from "@/components/goal-chart"
import { RoutineEvolutionChart } from "@/components/routine-evolution-chart"
import { Calendar, Goal, Save, Target } from "lucide-react"

export function GoalTracking() {
  const [targetDate, setTargetDate] = useState<Date>(new Date(2025, 7, 15))
  const [targetConsistency, setTargetConsistency] = useState(85)
  const [currentConsistency, setCurrentConsistency] = useState(78)

  const daysRemaining = differenceInDays(targetDate, new Date())
  const progressPercentage = (currentConsistency / targetConsistency) * 100
  const isOnTrack = currentConsistency >= targetConsistency * 0.9

  return (
    <div className="p-4 md:p-8 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Goal Tracking</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Target Routine Goal</CardTitle>
            <CardDescription>Set and track your consistency goals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="target-date">Target Date</Label>
                <Badge variant="outline" className="text-sm">
                  {daysRemaining} days remaining
                </Badge>
              </div>
              <DatePicker id="target-date" date={targetDate} setDate={setTargetDate} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="target-consistency">Target Consistency (%)</Label>
                <span className="text-sm">{targetConsistency}%</span>
              </div>
              <Slider
                id="target-consistency"
                min={50}
                max={100}
                step={1}
                value={[targetConsistency]}
                onValueChange={(value) => setTargetConsistency(value[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="current-consistency">Current Consistency (%)</Label>
                <span className="text-sm">{currentConsistency}%</span>
              </div>
              <Slider
                id="current-consistency"
                min={0}
                max={100}
                step={1}
                value={[currentConsistency]}
                onValueChange={(value) => setCurrentConsistency(value[0])}
              />
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-sm">
                <span>Progress Toward Goal</span>
                <span>{Math.min(100, Math.round(progressPercentage))}%</span>
              </div>
              <Progress value={Math.min(100, progressPercentage)} className="h-2" />
            </div>

            {!isOnTrack && (
              <Alert variant="destructive" className="mt-4">
                <Target className="h-4 w-4" />
                <AlertTitle>Off Track</AlertTitle>
                <AlertDescription>
                  You're currently behind your target consistency goal. Consider increasing practice frequency or
                  adjusting your routine.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end pt-2">
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Goal
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Goal Timeline</CardTitle>
            <CardDescription>Visualize your progress toward your goal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Target Date:</span>
                  <span>{format(targetDate, "MMMM d, yyyy")}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Goal className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Goal:</span>
                  <span>{targetConsistency}% consistency</span>
                </div>
              </div>

              <div className="h-[300px]">
                <GoalChart
                  currentConsistency={currentConsistency}
                  targetConsistency={targetConsistency}
                  targetDate={targetDate}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Target Routine Evolution</CardTitle>
          <CardDescription>Track how your target routine has changed over time</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="timeline">
            <TabsList className="mb-4">
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="versions">Versions</TabsTrigger>
            </TabsList>
            <TabsContent value="timeline">
              <div className="h-[300px]">
                <RoutineEvolutionChart />
              </div>
            </TabsContent>
            <TabsContent value="versions">
              <div className="space-y-4">
                <div className="rounded-md border">
                  <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center space-x-2">
                      <Badge>Current</Badge>
                      <span className="font-medium">Version 3</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Updated July 10, 2025</div>
                  </div>
                  <div className="p-4">
                    <ul className="space-y-2">
                      <li className="flex items-center space-x-2">
                        <span className="text-green-500">●</span>
                        <span>Round-off</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="text-green-500">●</span>
                        <span>Back Handspring</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="text-yellow-500">●</span>
                        <span>Back Tuck</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="text-green-500">●</span>
                        <span>Front Handspring</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="text-green-500">●</span>
                        <span>Front Walkover</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="rounded-md border">
                  <div className="flex items-center justify-between p-4 border-b">
                    <div>
                      <span className="font-medium">Version 2</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Updated June 15, 2025</div>
                  </div>
                  <div className="p-4">
                    <ul className="space-y-2">
                      <li className="flex items-center space-x-2">
                        <span className="text-green-500">●</span>
                        <span>Round-off</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="text-green-500">●</span>
                        <span>Back Handspring</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="text-red-500">●</span>
                        <span>Back Tuck</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="text-green-500">●</span>
                        <span>Cartwheel</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="rounded-md border">
                  <div className="flex items-center justify-between p-4 border-b">
                    <div>
                      <span className="font-medium">Version 1</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Created May 20, 2025</div>
                  </div>
                  <div className="p-4">
                    <ul className="space-y-2">
                      <li className="flex items-center space-x-2">
                        <span className="text-green-500">●</span>
                        <span>Round-off</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="text-yellow-500">●</span>
                        <span>Back Handspring</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="text-green-500">●</span>
                        <span>Cartwheel</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
