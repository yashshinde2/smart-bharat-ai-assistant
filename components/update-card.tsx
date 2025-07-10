import type { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface UpdateCardProps {
  title: string
  icon: ReactNode
  color: string
  children: ReactNode
}

export default function UpdateCard({ title, icon, color, children }: UpdateCardProps) {
  return (
    <Card className="overflow-hidden border-2 hover:shadow-md transition-shadow">
      <CardHeader className={`py-3 ${color} text-white flex flex-row items-center gap-2`}>
        {icon}
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">{children}</CardContent>
    </Card>
  )
}
