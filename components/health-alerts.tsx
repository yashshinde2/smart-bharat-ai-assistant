"use client"

import { useEffect, useState } from "react"
import { Heart, AlertTriangle, Pill, Sun, Stethoscope, Loader2, Droplets } from "lucide-react"
import UpdateCard from "./update-card"

interface HealthAlert {
  id: string | number
  type: string
  title: string
  description: string
  icon: string
  color: string
}

const IconMap = {
  'alert-triangle': AlertTriangle,
  'pill': Pill,
  'sun': Sun,
  'stethoscope': Stethoscope,
  'droplets': Droplets,
  'info': AlertTriangle
}

export default function HealthAlerts() {
  const [alerts, setAlerts] = useState<HealthAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch('/api/health-alerts')
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch health alerts')
        }

        setAlerts(data.alerts)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load health alerts')
      } finally {
        setLoading(false)
      }
    }

    fetchAlerts()

    // Refresh data every 5 minutes
    const interval = setInterval(fetchAlerts, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-500">
        <AlertTriangle className="h-6 w-6 mx-auto mb-2" />
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <UpdateCard title="Health & Environment Alerts" icon={<Heart className="h-5 w-5" />} color="bg-red-500">
        <div className="space-y-3">
          {alerts.map(alert => {
            const IconComponent = IconMap[alert.icon as keyof typeof IconMap]
            return (
              <div key={alert.id} className="flex items-start gap-2">
                {IconComponent && (
                  <IconComponent className={`h-5 w-5 text-${alert.color} flex-shrink-0 mt-0.5`} />
                )}
                <div>
                  <h3 className="font-medium">{alert.title}</h3>
                  <p className="text-sm text-gray-600">
                    {alert.description}
                  </p>
                </div>
              </div>
            )
          })}
          {alerts.length === 0 && (
            <div className="text-center text-gray-500">
              No active alerts at this time
            </div>
          )}
        </div>
      </UpdateCard>
    </div>
  )
}
