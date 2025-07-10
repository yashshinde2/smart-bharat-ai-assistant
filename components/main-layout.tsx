import type { ReactNode } from "react"
import Header from "./header"
import Navigation from "./navigation"

interface MainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 pb-20">{children}</main>
      <Navigation />
    </div>
  )
}
