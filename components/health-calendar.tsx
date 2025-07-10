"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb } from "lucide-react"

export default function HealthCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  // Example health events
  const healthEvents = [
    { date: new Date(2025, 3, 18), title: "Vaccination Camp" },
    { date: new Date(2025, 3, 20), title: "Health Checkup" },
    { date: new Date(2025, 3, 25), title: "Eye Camp" },
  ]

  // Function to highlight dates with events
  const isDayWithEvent = (day: Date) => {
    return healthEvents.some(
      (event) =>
        event.date.getDate() === day.getDate() &&
        event.date.getMonth() === day.getMonth() &&
        event.date.getFullYear() === day.getFullYear()
    )
  }

  return (
    <Card>
      <CardHeader className="bg-brand-yellow text-white py-3">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Health Calendar
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          modifiers={{
            event: (date) => isDayWithEvent(date),
          }}
          modifiersClassNames={{
            event: "bg-brand-yellow/20 font-bold text-brand-orange",
          }}
        />

        <div className="mt-4 bg-gray-50 p-3 rounded-lg">
          <h3 className="font-medium flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-brand-yellow" />
            Today's Health Tip
          </h3>
          <p className="text-sm mt-1">
            Stay hydrated! Drink at least 8 glasses of water daily, especially during hot weather.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
