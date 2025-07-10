import MainLayout from "@/components/main-layout"
import HealthCalendar from "@/components/health-calendar"

export default function HealthCalendarPage() {
  return (
    <MainLayout>
      <div className="py-6">
        <h2 className="text-xl font-bold mb-6">स्वास्थ्य कैलेंडर (Health Calendar)</h2>
        <HealthCalendar />
      </div>
    </MainLayout>
  )
}
