import MainLayout from "@/components/main-layout"
import HealthAlerts from "@/components/health-alerts"
import WeatherInfo from "@/components/weather-info"
import GovernmentSchemes from "@/components/government-schemes"

export default function UpdatesPage() {
  return (
    <MainLayout>
      <div className="py-6">
        <h2 className="text-xl font-bold mb-6">नवीनतम अपडेट (Latest Updates)</h2>

        <div className="grid gap-6">
          <HealthAlerts />
          <WeatherInfo />
          <GovernmentSchemes />
        </div>
      </div>
    </MainLayout>
  )
}
