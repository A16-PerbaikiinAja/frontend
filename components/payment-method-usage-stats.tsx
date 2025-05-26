"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, TrendingUp, Users, CreditCard } from "lucide-react"
import { toast } from "sonner"
import { apiRequest } from "@/lib/api"

interface PaymentMethodUsage {
  id: string
  name: string
  methodType: string
  instructions?: string | null
  orderCount: number
}

export default function PaymentMethodUsageStats() {
  const [usageData, setUsageData] = useState<PaymentMethodUsage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsageData()
  }, [])

  const fetchUsageData = async () => {
    try {
      setLoading(true)
      const response = await apiRequest<PaymentMethodUsage[]>("/payment-methods/admin/details-with-counts")
      setUsageData(response.data)
    } catch (error: any) {
      console.error("Error fetching usage data:", error)
      toast.error("Gagal mengambil data statistik penggunaan", {
        description: error.message || "Terjadi kesalahan saat mengambil data",
      })
    } finally {
      setLoading(false)
    }
  }

  const getMethodTypeIcon = (type: string) => {
    switch (type) {
      case "BANK_TRANSFER":
        return <CreditCard className="h-5 w-5 text-blue-600" />
      case "E_WALLET":
        return <Users className="h-5 w-5 text-orange-600" />
      case "COD":
        return <TrendingUp className="h-5 w-5 text-green-600" />
      default:
        return <BarChart3 className="h-5 w-5" />
    }
  }

  const getMethodTypeBadge = (type: string) => {
    switch (type) {
      case "BANK_TRANSFER":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300">
            Transfer Bank
          </Badge>
        )
      case "E_WALLET":
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 dark:bg-orange-900 dark:text-orange-300">
            E-Wallet
          </Badge>
        )
      case "COD":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300">
            Bayar di Tempat
          </Badge>
        )
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const totalOrders = usageData.reduce((sum, item) => sum + item.orderCount, 0)
  const maxOrders = Math.max(...usageData.map((item) => item.orderCount))
  const mostUsedMethod = usageData.find((item) => item.orderCount === maxOrders)

  // Group by method type for summary
  const summaryByType = usageData.reduce(
    (acc, item) => {
      const type = item.methodType
      if (!acc[type]) {
        acc[type] = { count: 0, orders: 0 }
      }
      acc[type].count += 1
      acc[type].orders += item.orderCount
      return acc
    },
    {} as Record<string, { count: number; orders: number }>,
  )

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Pesanan</p>
                <p className="text-2xl font-bold">{totalOrders}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Metode Tersedia</p>
                <p className="text-2xl font-bold">{usageData.length}</p>
              </div>
              <CreditCard className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Paling Populer</p>
                <p className="text-lg font-bold truncate">{mostUsedMethod?.name || "N/A"}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rata-rata per Metode</p>
                <p className="text-2xl font-bold">
                  {usageData.length > 0 ? Math.round(totalOrders / usageData.length) : 0}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Method Type Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(summaryByType).map(([type, data]) => (
          <Card key={type}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                {getMethodTypeIcon(type)}
                {type === "BANK_TRANSFER" ? "Transfer Bank" : type === "E_WALLET" ? "E-Wallet" : "Bayar di Tempat"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Jumlah Metode:</span>
                  <span className="font-medium">{data.count}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Pesanan:</span>
                  <span className="font-medium">{data.orders}</span>
                </div>
                <Progress value={totalOrders > 0 ? (data.orders / totalOrders) * 100 : 0} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {totalOrders > 0 ? ((data.orders / totalOrders) * 100).toFixed(1) : 0}% dari total pesanan
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Usage List */}
      <Card>
        <CardHeader>
          <CardTitle>Detail Penggunaan per Metode</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {usageData
              .sort((a, b) => b.orderCount - a.orderCount)
              .map((method) => (
                <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4 flex-1">
                    {getMethodTypeIcon(method.methodType)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{method.name}</h3>
                        {getMethodTypeBadge(method.methodType)}
                      </div>
                      {method.instructions && <p className="text-sm text-muted-foreground">{method.instructions}</p>}
                      <div className="mt-2">
                        <Progress value={maxOrders > 0 ? (method.orderCount / maxOrders) * 100 : 0} className="h-2" />
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{method.orderCount}</p>
                    <p className="text-sm text-muted-foreground">pesanan</p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
