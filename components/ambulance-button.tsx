"use client"

import { Ambulance } from "lucide-react"
import { Button } from "./ui/button"

interface AmbulanceButtonProps {
  variant?: "default" | "compact" | "floating"
  label?: string
  icon?: React.ReactNode
  ambulanceNumber?: string
}

export default function AmbulanceButton({
  variant = "default",
  label = "Ambulance",
  icon = <Ambulance className="h-6 w-6" />,
  ambulanceNumber = "108", // Default ambulance number for India
}: AmbulanceButtonProps) {
  const handleCall = () => {
    window.location.href = `tel:${ambulanceNumber}`
  }

  const getButtonStyles = () => {
    switch (variant) {
      case "compact":
        return "bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full flex items-center gap-2 shadow-md"
      case "floating":
        return "bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-4 rounded-full flex items-center justify-center shadow-lg fixed bottom-6 right-6 z-50"
      default:
        return "bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full flex items-center gap-2 shadow-lg"
    }
  }

  return (
    <Button
      onClick={handleCall}
      className={getButtonStyles()}
      aria-label={`Call ambulance at ${ambulanceNumber}`}
      title={`Call ambulance at ${ambulanceNumber}`}
    >
      {icon}
      {variant !== "floating" && <span>{label}</span>}
    </Button>
  )
}
