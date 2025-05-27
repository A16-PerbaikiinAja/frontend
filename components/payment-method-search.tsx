"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function PaymentMethodSearch({ onSearch }: { onSearch?: (term: string) => void }) {
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(searchTerm)
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Cari metode pembayaran berdasarkan nama atau ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
            Cari
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
