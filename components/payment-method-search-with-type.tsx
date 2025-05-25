"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function PaymentMethodSearchWithType({
  onSearch,
}: {
  onSearch?: (term: string, type: string) => void
}) {
  const [searchTerm, setSearchTerm] = useState("")
  const [paymentType, setPaymentType] = useState("all")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(searchTerm, paymentType)
    }
  }

  const handleTypeChange = (value: string) => {
    setPaymentType(value)
    if (onSearch) {
      onSearch(searchTerm, value)
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Cari metode pembayaran berdasarkan nama..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <div className="w-full md:w-64">
            <Select value={paymentType} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Semua tipe pembayaran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua tipe pembayaran</SelectItem>
                <SelectItem value="BANK_TRANSFER">Transfer Bank</SelectItem>
                <SelectItem value="E_WALLET">E-Wallet</SelectItem>
                <SelectItem value="COD">Bayar di Tempat (COD)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
            Cari
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
