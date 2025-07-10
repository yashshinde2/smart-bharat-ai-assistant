"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Bell, AlertCircle, Settings } from "lucide-react"

export default function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Updates", href: "/updates", icon: Bell },
    { name: "Emergency", href: "/emergency", icon: AlertCircle },
    { name: "Settings", href: "/settings", icon: Settings },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-around items-center py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                  isActive ? "text-brand-orange" : "text-gray-500 hover:text-brand-orange"
                }`}
              >
                <Icon className={`h-6 w-6 ${isActive ? "text-brand-orange" : ""}`} />
                <span className="text-xs mt-1">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
