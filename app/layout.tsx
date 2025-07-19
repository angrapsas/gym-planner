import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { GymDataProvider } from "@/context/GymDataContext";

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Gymnastics Training Planner",
  description: "Track your gymnastics training progress and reach your goals",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <SidebarProvider>
            <GymDataProvider>
              <div className="flex h-screen overflow-hidden">
                <AppSidebar />
                <main className="flex-1 overflow-auto relative">
                  {/* Fixed sidebar toggle button */}
                  <div className="fixed top-4 left-4 z-50 md:hidden">
                    <SidebarTrigger />
                  </div>
                  <div className="hidden md:block fixed top-4 left-4 z-50">
                    <SidebarTrigger />
                  </div>
                  {children}
                </main>
              </div>
            </GymDataProvider>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
