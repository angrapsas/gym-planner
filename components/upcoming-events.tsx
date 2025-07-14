import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

const events = [
  {
    id: 1,
    date: "Today, 2:00 PM",
    title: "Routine Practice",
    type: "Routine",
  },
  {
    id: 2,
    date: "Tomorrow, 10:00 AM",
    title: "Skills Session",
    type: "Skills",
  },
  {
    id: 3,
    date: "Jul 15, 3:30 PM",
    title: "Conditioning",
    type: "Conditioning",
  },
  {
    id: 4,
    date: "Jul 16, 1:00 PM",
    title: "Routine Practice",
    type: "Routine",
  },
  {
    id: 5,
    date: "Jul 18, 11:00 AM",
    title: "Recovery Session",
    type: "Recovery",
  },
]

export function UpcomingEvents() {
  return (
    <ScrollArea className="h-[220px]">
      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">{event.title}</p>
              <p className="text-sm text-muted-foreground">{event.date}</p>
            </div>
            <Badge
              variant={
                event.type === "Routine"
                  ? "default"
                  : event.type === "Skills"
                    ? "secondary"
                    : event.type === "Conditioning"
                      ? "destructive"
                      : "outline"
              }
            >
              {event.type}
            </Badge>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
