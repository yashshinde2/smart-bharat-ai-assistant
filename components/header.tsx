import Image from "next/image"
import GoogleTranslateButton from "./GoogleTranslateButton"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="relative w-10 h-10">
            <Image
              src="/placeholder.svg"
              alt="Smart Bharat Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
          </div>
          <div>
            <h1 className="text-lg font-bold text-brand-orange">Smart Bharat</h1>
            <p className="text-xs text-muted-foreground">AI-Powered Rural Assistant</p>
          </div>
        </div>
        <GoogleTranslateButton />
      </div>
    </header>
  )
}
