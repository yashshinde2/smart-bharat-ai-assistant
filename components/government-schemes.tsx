"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import UpdateCard from "./update-card"

const schemes = [
  {
    id: 1,
    title: "PM Kisan Samman Nidhi",
    description: "Rs. 6,000 per year for eligible farmer families. Next installment due in 15 days.",
  },
  {
    id: 2,
    title: "Ayushman Bharat",
    description: "Free healthcare up to Rs. 5 lakh per family per year. Your card is active.",
  },
  {
    id: 3,
    title: "PM Awas Yojana",
    description: "Housing subsidy for rural families. New applications open until June 30.",
  },
  {
    id: 4,
    title: "Ujjwala Yojana",
    description: "Free LPG connections for eligible women. Refill subsidy available.",
  },
  {
    id: 5,
    title: "Sukanya Samriddhi Yojana",
    description: "Savings scheme for girl child with tax benefits and high interest rates.",
  },
  {
    id: 6,
    title: "Jan Dhan Yojana",
    description: "Zero balance savings account with insurance and overdraft facilities.",
  },
  {
    id: 7,
    title: "Atal Pension Yojana",
    description: "Monthly pension of up to Rs. 5,000 after 60 years for enrolled citizens.",
  }
];


export default function GovernmentSchemes() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const nextScheme = () => {
    setCurrentIndex((prev) => (prev + 1) % schemes.length)
  }

  const prevScheme = () => {
    setCurrentIndex((prev) => (prev - 1 + schemes.length) % schemes.length)
  }

  useEffect(() => {
    if (containerRef.current) {
      const scrollAmount = currentIndex * containerRef.current.offsetWidth
      containerRef.current.scrollTo({
        left: scrollAmount,
        behavior: "smooth",
      })
    }
  }, [currentIndex])

  return (
    <UpdateCard title="Government Schemes" icon={<FileText className="h-5 w-5" />} color="bg-brand-green">
      <div className="relative">
        <div ref={containerRef} className="flex overflow-x-hidden scroll-smooth">
          {schemes.map((scheme) => (
            <div key={scheme.id} className="min-w-full flex-shrink-0 p-1">
              <div className="border rounded-lg p-3 h-full">
                <h3 className="font-medium">{scheme.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{scheme.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-4">
          <Button variant="outline" size="sm" onClick={prevScheme} className="rounded-full h-8 w-8 p-0">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous</span>
          </Button>

          <div className="flex gap-1">
            {schemes.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full ${currentIndex === index ? "bg-brand-green" : "bg-gray-300"}`}
              />
            ))}
          </div>

          <Button variant="outline" size="sm" onClick={nextScheme} className="rounded-full h-8 w-8 p-0">
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next</span>
          </Button>
        </div>
      </div>
    </UpdateCard>
  )
}
