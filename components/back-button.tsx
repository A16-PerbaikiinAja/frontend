"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface BackButtonProps {
  fallbackHref?: string
  className?: string
}

export default function BackButton({ fallbackHref = "/payment-methods", className = "" }: BackButtonProps) {
  const router = useRouter()

  const handleBack = () => {
    // Try to go back in history first
    if (window.history.length > 1) {
      router.back()
    } else {
      // If no history, go to fallback URL
      router.push(fallbackHref)
    }
  }

  return (
    <Button variant="outline" size="icon" className={className} onClick={handleBack}>
      <ArrowLeft className="h-4 w-4" />
    </Button>
  )
}
