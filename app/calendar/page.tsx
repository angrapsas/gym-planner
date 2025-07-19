import { CalendarView } from "@/components/calendar-view"
import { DebugPanel } from "@/components/debug-panel"
import { DataSeeder } from "@/components/data-seeder"

export default function CalendarPage() {
  return (
    <div className="min-h-screen">
      <DataSeeder />
      <DebugPanel />
      <CalendarView />
    </div>
  )
}
