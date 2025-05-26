"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Wallet, Truck, ChevronRight } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { apiRequest } from "@/lib/api"

interface PaymentMethodUserData {
  id: string
  name: string
  description?: string
  processingFee?: number
  paymentMethod: string
  // Additional fields based on type
  accountName?: string
  accountNumber?: string
  bankName?: string
  virtualAccountNumber?: string
  phoneNumber?: string
  instructions?: string
}

interface PaymentMethodUserListProps {
  searchTerm?: string
  paymentType?: string
}

export default function PaymentMethodUserList({ searchTerm = "", paymentType = "" }: PaymentMethodUserListProps) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodUserData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchActivePaymentMethods()
  }, [])

  const fetchActivePaymentMethods = async () => {
    try {
      setLoading(true)
      const response = await apiRequest<PaymentMethodUserData[]>("/payment-methods/active")
      setPaymentMethods(response.data)
    } catch (error: any) {
      console.error("Error fetching active payment methods:", error)
      toast.error("Gagal mengambil data metode pembayaran", {
        description: error.message || "Terjadi kesalahan saat mengambil data",
      })
    } finally {
      setLoading(false)
    }
  }

  // Filter payment methods based on search term and payment type
  const filteredPaymentMethods = paymentMethods.filter(
    (method) =>
      (searchTerm === "" ||
        method.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        method.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (paymentType === "" || paymentType === "all" || method.paymentMethod === paymentType),
  )

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case "BANK_TRANSFER":
        return <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
      case "E_WALLET":
        return <Wallet className="h-6 w-6 text-orange-600 dark:text-orange-400" />
      case "COD":
        return <Truck className="h-6 w-6 text-green-600 dark:text-green-400" />
      default:
        return <CreditCard className="h-6 w-6" />
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Memuat data...</p>
      </div>
    )
  }

  if (filteredPaymentMethods.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Tidak ada metode pembayaran yang ditemukan.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredPaymentMethods.map((method) => (
        <Link key={method.id} href={`/dashboard/payment-methods/active/${method.id}`}>
          <Card className="h-full cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex flex-col h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getPaymentMethodIcon(method.paymentMethod)}
                  <div>
                    <h3 className="font-medium">{method.name}</h3>
                    <Badge
                      variant="outline"
                      className={`mt-1 ${
                        method.paymentMethod === "BANK_TRANSFER"
                          ? "text-blue-600 border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800"
                          : method.paymentMethod === "E_WALLET"
                            ? "text-orange-600 border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800"
                            : "text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800"
                      }`}
                    >
                      {method.paymentMethod === "BANK_TRANSFER"
                        ? "Transfer Bank"
                        : method.paymentMethod === "E_WALLET"
                          ? "E-Wallet"
                          : "Bayar di Tempat"}
                    </Badge>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 flex-grow">{method.description}</p>
              <div className="mt-3 text-sm">
                {(method.processingFee || 0) <= 0 ? (
                  <span className="text-green-600 dark:text-green-400">Tanpa biaya layanan</span>
                ) : (
                  <span className="text-amber-600 dark:text-amber-400">
                    Biaya layanan: {method.processingFee?.toString()}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
