"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, CheckCircle, Clock, Dumbbell, AlertTriangle } from "lucide-react"
import { DashboardChart } from "@/components/dashboard-chart"
import { UpcomingEvents } from "@/components/upcoming-events"

export function DashboardView() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-sm">
            Current Phase: Peak
          </Badge>
          <Badge variant="outline" className="text-sm">
            Target Date: Aug 15, 2025
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Weekly Routines</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">+8% from last week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Hit Rate</CardTitle>
                <Dumbbell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78%</div>
                <p className="text-xs text-muted-foreground">+5% from last week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Skills Practiced</CardTitle>
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15</div>
                <p className="text-xs text-muted-foreground">+2 new skills this week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Days to Target</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">32</div>
                <p className="text-xs text-muted-foreground">Goal: 85% consistency</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Progress Toward Goal</CardTitle>
                <CardDescription>Target routine consistency over time</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <DashboardChart />
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Your scheduled training sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <UpcomingEvents />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 grid-cols-1">
            <Card>
              <CardHeader>
                <CardTitle>Target Routine Progress</CardTitle>
                <CardDescription>Current estimated consistency: 78%</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <span>Current Progress</span>
                      </div>
                      <span className="font-medium">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <span>Goal</span>
                      </div>
                      <span className="font-medium">85%</span>
                    </div>
                    <Progress value={85} className="h-2 bg-muted" />
                  </div>

                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Attention</AlertTitle>
                    <AlertDescription>
                      Your current progress is slightly behind schedule. Consider increasing routine practice frequency.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Content</CardTitle>
              <CardDescription>Detailed analytics will be displayed here</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Analytics content placeholder</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports Content</CardTitle>
              <CardDescription>Detailed reports will be displayed here</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Reports content placeholder</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
