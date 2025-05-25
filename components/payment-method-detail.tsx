"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, Trash, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { apiRequest } from "@/lib/api"

interface PaymentMethodDetailData {
  id: string
  name: string
  description?: string
  processingFee?: number
  paymentMethod: string
  createdBy?: string
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
  // Additional fields based on type
  accountName?: string
  accountNumber?: string
  bankName?: string
  virtualAccountNumber?: string
  phoneNumber?: string
  instructions?: string
}

interface PaymentMethodDetailProps {
  id: string
  isAdmin?: boolean
}

export default function PaymentMethodDetail({ id, isAdmin = true }: PaymentMethodDetailProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodDetailData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPaymentMethod()
  }, [id, isAdmin])

  const fetchPaymentMethod = async () => {
    try {
      setLoading(true)
      const endpoint = isAdmin ? `/dashboard/payment-methods/admin/${id}` : `/dashboard/payment-methods/active/${id}`

      const response = await apiRequest<PaymentMethodDetailData>(endpoint)
      setPaymentMethod(response.data)
    } catch (error: any) {
      console.error("Error fetching payment method:", error)
      toast.error("Gagal mengambil detail metode pembayaran", {
        description: error.message || "Terjadi kesalahan saat mengambil data",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!paymentMethod) return

    try {
      await apiRequest(`/payment-methods/admin/${id}/delete`, {
        method: "DELETE",
      })

      setPaymentMethod({ ...paymentMethod, deletedAt: new Date().toISOString() })

      toast.success("Metode pembayaran berhasil dihapus", {
        description: "Metode pembayaran telah dinonaktifkan",
      })
    } catch (error: any) {
      console.error("Error deleting payment method:", error)
      toast.error("Gagal menghapus metode pembayaran", {
        description: error.message || "Terjadi kesalahan saat menghapus metode pembayaran",
      })
    }
  }

  const handleReactivate = async () => {
    if (!paymentMethod) return

    try {
      await apiRequest(`/payment-methods/admin/${id}/activate`, {
        method: "PATCH",
      })

      setPaymentMethod({ ...paymentMethod, deletedAt: null })

      toast.success("Metode pembayaran berhasil diaktifkan kembali", {
        description: "Metode pembayaran telah diaktifkan kembali",
      })
    } catch (error: any) {
      console.error("Error reactivating payment method:", error)
      toast.error("Gagal mengaktifkan metode pembayaran", {
        description: error.message || "Terjadi kesalahan saat mengaktifkan metode pembayaran",
      })
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-muted-foreground">Memuat data...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!paymentMethod) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-muted-foreground">Data tidak ditemukan.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Render different content based on payment method type
  const renderPaymentMethodDetails = () => {
    switch (paymentMethod.paymentMethod) {
      case "BANK_TRANSFER":
        return (
          <div className="mt-6">
            <h3 className="font-semibold mb-4">Detail Akun</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethod.accountName && (
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-1">Nama Pemilik Akun</h4>
                  <p className="font-medium">{paymentMethod.accountName}</p>
                </div>
              )}
              {paymentMethod.accountNumber && (
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-1">Nomor Rekening</h4>
                  <p className="font-medium">{paymentMethod.accountNumber}</p>
                </div>
              )}
              {paymentMethod.bankName && (
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-1">Nama Bank</h4>
                  <p className="font-medium">{paymentMethod.bankName}</p>
                </div>
              )}
            </div>
          </div>
        )
      case "E_WALLET":
        return (
          <div className="mt-6">
            <h3 className="font-semibold mb-4">Detail Akun</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethod.accountName && (
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-1">Nama Pemilik Akun</h4>
                  <p className="font-medium">{paymentMethod.accountName}</p>
                </div>
              )}
              {paymentMethod.virtualAccountNumber && (
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-1">Nomor Virtual Account</h4>
                  <p className="font-medium">{paymentMethod.virtualAccountNumber}</p>
                </div>
              )}
              {paymentMethod.instructions && (
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg col-span-1 md:col-span-2">
                  <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-1">Instruksi</h4>
                  <p className="font-medium">{paymentMethod.instructions}</p>
                </div>
              )}
            </div>
          </div>
        )
      case "COD":
        return (
          <div className="mt-6">
            <h3 className="font-semibold mb-4">Detail</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethod.phoneNumber && (
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-1">Nomor Telepon</h4>
                  <p className="font-medium">{paymentMethod.phoneNumber}</p>
                </div>
              )}
              {paymentMethod.instructions && (
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg col-span-1 md:col-span-2">
                  <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-1">Instruksi</h4>
                  <p className="font-medium">{paymentMethod.instructions}</p>
                </div>
              )}
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <>
      {isAdmin && (
        <div className="flex justify-end gap-2 mb-4">
          {paymentMethod.deletedAt === null ? (
            <>
              <Link href={`/dashboard/payment-methods/admin/${id}/edit`}>
                <Button
                  variant="outline"
                  className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-900/20"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </Link>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-50 dark:text-red-400 dark:border-red-400 dark:hover:bg-red-900/20"
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Hapus
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
                    <AlertDialogDescription>
                      Apakah Anda yakin ingin menghapus metode pembayaran "{paymentMethod.name}"? Metode pembayaran ini
                      akan dinonaktifkan.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
                      Hapus
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="text-green-600 border-green-600 hover:bg-green-50 dark:text-green-400 dark:border-green-400 dark:hover:bg-green-900/20"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Aktifkan Kembali
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Konfirmasi Aktivasi</AlertDialogTitle>
                  <AlertDialogDescription>
                    Apakah Anda yakin ingin mengaktifkan kembali metode pembayaran "{paymentMethod.name}"?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction onClick={handleReactivate} className="bg-green-600 hover:bg-green-700 text-white">
                    Aktifkan
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      )}

      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">{paymentMethod.name}</h2>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                <Badge
                  className={
                    paymentMethod.paymentMethod === "BANK_TRANSFER"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                      : paymentMethod.paymentMethod === "E_WALLET"
                        ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                        : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  }
                >
                  {paymentMethod.paymentMethod === "BANK_TRANSFER"
                    ? "Transfer Bank"
                    : paymentMethod.paymentMethod === "E_WALLET"
                      ? "E-Wallet"
                      : "Bayar di Tempat"}
                </Badge>
              </div>
            </div>
            {isAdmin && (
              <Badge
                className={`${paymentMethod.deletedAt === null ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"}`}
              >
                {paymentMethod.deletedAt === null ? "Aktif" : "Tidak Aktif"}
              </Badge>
            )}
          </div>

          {paymentMethod.description && (
            <div className="mt-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Deskripsi</h3>
              <p className="text-gray-700 dark:text-gray-300">{paymentMethod.description}</p>
            </div>
          )}

          <div className="mt-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Biaya Layanan</h3>
            <p className="text-gray-700 dark:text-gray-300">
              {(paymentMethod.processingFee || 0) <= 0
                ? "Tanpa biaya layanan"
                : paymentMethod.processingFee?.toString()}
            </p>
          </div>

          {renderPaymentMethodDetails()}

          {isAdmin && paymentMethod.createdAt && (
            <div className="mt-6 border-t pt-6 dark:border-gray-700">
              <h3 className="font-semibold mb-4">Informasi Tambahan</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-1">Tanggal Dibuat</h4>
                  <p className="font-medium">{new Date(paymentMethod.createdAt).toLocaleString("id-ID")}</p>
                </div>
                {paymentMethod.updatedAt && (
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-1">Terakhir Diperbarui</h4>
                    <p className="font-medium">{new Date(paymentMethod.updatedAt).toLocaleString("id-ID")}</p>
                  </div>
                )}
                {paymentMethod.deletedAt && (
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-1">Tanggal Dihapus</h4>
                    <p className="font-medium">{new Date(paymentMethod.deletedAt).toLocaleString("id-ID")}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-center">
            <Link
              href={isAdmin ? "/dashboard/payment-methods/admin" : "/dashboard/payment-methods/active"}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
            >
              Kembali ke Daftar
            </Link>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
