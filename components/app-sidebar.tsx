"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { BarChart3, Calendar, Dumbbell, Goal, Home, ListTodo, Timer, Zap } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"

export function AppSidebar() {
  const pathname = usePathname()

  const routes = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/",
    },
    {
      title: "Calendar",
      icon: Calendar,
      href: "/calendar",
    },
    {
      title: "Routines",
      icon: ListTodo,
      href: "/routines",
    },
    {
      title: "Conditioning",
      icon: Dumbbell,
      href: "/conditioning",
    },
    {
      title: "Skills",
      icon: Zap,
      href: "/skills",
    },
    {
      title: "Phases",
      icon: Timer,
      href: "/phases",
    },
    {
      title: "Goals",
      icon: Goal,
      href: "/goals",
    },
    {
      title: "Analytics",
      icon: BarChart3,
      href: "/analytics",
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader className="h-14 flex items-center px-4 border-b">
        <h1 className="text-xl font-bold">Gym Planner</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {routes.map((route) => (
            <SidebarMenuItem key={route.href}>
              <SidebarMenuButton asChild isActive={pathname === route.href} tooltip={route.title}>
                <Link href={route.href}>
                  <route.icon className="h-5 w-5" />
                  <span>{route.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="flex justify-end">
          <ModeToggle />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
