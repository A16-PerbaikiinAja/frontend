"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm, Controller, SubmitHandler } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { apiRequest } from "@/lib/api"

interface PaymentMethodFormData {
  id: string
  name: string
  description?: string
  processingFee?: number
  paymentMethod: string
  createdBy: string
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
  accountName?: string
  accountNumber?: string
  bankName?: string
  virtualAccountNumber?: string
  phoneNumber?: string
  instructions?: string
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Nama metode pembayaran harus minimal 2 karakter.",
  }),
  paymentMethod: z.string({
    required_error: "Pilih tipe metode pembayaran.",
  }),
  description: z.string().optional(),
  processingFee: z.coerce.number().min(0).optional(),
  accountName: z.string().optional(),
  accountNumber: z.string().optional(),
  bankName: z.string().optional(),
  virtualAccountNumber: z.string().optional(),
  phoneNumber: z.string().optional(),
  instructions: z.string().optional(),
  isActive: z.boolean().default(true),
})

type FormValues = z.infer<typeof formSchema>

interface PaymentMethodFormProps {
  id?: string
  isEditing?: boolean
}

export default function PaymentMethodForm({
  id,
  isEditing = false,
}: PaymentMethodFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [paymentMethodType, setPaymentMethodType] = useState<string>("BANK_TRANSFER")

  const form = useForm<FormValues>({
    defaultValues: {
      name: "",
      paymentMethod: "BANK_TRANSFER",
      description: "",
      processingFee: 0,
      accountName: "",
      accountNumber: "",
      bankName: "",
      virtualAccountNumber: "",
      phoneNumber: "",
      instructions: "",
      isActive: true,
    },
  })

  useEffect(() => {
    if (isEditing && id) {
      const fetchPaymentMethod = async () => {
        try {
          setLoading(true)
          const response = await apiRequest<PaymentMethodFormData>(`/payment-methods/admin/${id}`)
          const method = response.data

          setPaymentMethodType(method.paymentMethod)
          form.reset({
            name: method.name,
            paymentMethod: method.paymentMethod,
            description: method.description || "",
            processingFee: method.processingFee || 0,
            accountName: method.accountName || "",
            accountNumber: method.accountNumber || "",
            bankName: method.bankName || "",
            virtualAccountNumber: method.virtualAccountNumber || "",
            phoneNumber: method.phoneNumber || "",
            instructions: method.instructions || "",
            isActive: method.deletedAt === null,
          })
        } catch (error: any) {
          toast.error("Gagal mengambil data metode pembayaran", {
            description: error.message || "Terjadi kesalahan saat mengambil data",
          })
        } finally {
          setLoading(false)
        }
      }
      fetchPaymentMethod()
    }
  }, [form, id, isEditing])

  function toSnakeCase(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(toSnakeCase)
    } else if (obj !== null && typeof obj === "object") {
      return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [
          key.replace(/([A-Z])/g, "_$1").toLowerCase(),
          toSnakeCase(value),
        ])
      )
    }
    return obj
  }

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    setLoading(true)
    try {
      const paymentData: any = {
        name: values.name,
        paymentMethod: values.paymentMethod,
        description: values.description,
        processingFee: values.processingFee,
      }

      if (values.paymentMethod === "BANK_TRANSFER") {
        paymentData.accountName = values.accountName
        paymentData.accountNumber = values.accountNumber
        paymentData.bankName = values.bankName
      } else if (values.paymentMethod === "E_WALLET") {
        paymentData.accountName = values.accountName
        paymentData.virtualAccountNumber = values.virtualAccountNumber
        paymentData.instructions = values.instructions
      } else if (values.paymentMethod === "COD") {
        paymentData.phoneNumber = values.phoneNumber
        paymentData.instructions = values.instructions
      }

      // Convert paymentData keys to snake_case
      const snakeCasePayload = toSnakeCase(paymentData)

      const endpoint = isEditing
        ? `/payment-methods/admin/${id}/edit`
        : `/payment-methods/admin/create`
      const method = isEditing ? "PUT" : "POST"

      await apiRequest(endpoint, {
        method,
        body: JSON.stringify(snakeCasePayload),
      })

      toast.success(
        isEditing
          ? "Metode pembayaran berhasil diperbarui"
          : "Metode pembayaran berhasil dibuat",
        {
          description: isEditing
            ? "Perubahan telah disimpan"
            : "Metode pembayaran baru telah ditambahkan",
        }
      )

      router.push("/dashboard/payment-methods/admin")
    } catch (error: any) {
      toast.error("Gagal menyimpan metode pembayaran", {
        description: error.message || "Terjadi kesalahan saat menyimpan data",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading && isEditing) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Memuat data...</p>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <Controller
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Metode Pembayaran</FormLabel>
                <FormControl>
                  <Input placeholder="Transfer Bank BCA" {...field} />
                </FormControl>
                <FormDescription>
                  Nama harus unik dan belum digunakan oleh metode pembayaran lain.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Controller
            name="paymentMethod"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipe Metode Pembayaran</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    setPaymentMethodType(value)
                    field.onChange(value)
                  }}
                  disabled={isEditing}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tipe metode pembayaran" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="BANK_TRANSFER">Transfer Bank</SelectItem>
                    <SelectItem value="E_WALLET">E-Wallet</SelectItem>
                    <SelectItem value="COD">Bayar di Tempat (COD)</SelectItem>
                  </SelectContent>
                </Select>
                {isEditing && (
                  <FormDescription>
                    Tipe metode pembayaran tidak dapat diubah setelah dibuat.
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Controller
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Pembayaran melalui transfer bank BCA"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Controller
          name="processingFee"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Biaya Layanan</FormLabel>
              <FormControl>
                <Input type="number" min={0} step={0.1} {...field} />
              </FormControl>
              <FormDescription>
                Biaya tambahan untuk penggunaan metode pembayaran ini (0 untuk tanpa biaya)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {paymentMethodType === "BANK_TRANSFER" && (
          <div className="space-y-6">
            <h3 className="font-semibold">Detail Akun</h3>
            <div className="grid grid-cols-2 gap-6">
              <Controller
                name="accountName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Pemilik Akun</FormLabel>
                    <FormControl>
                      <Input placeholder="PT PerbaikiinAja" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Controller
                name="accountNumber"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor Rekening</FormLabel>
                    <FormControl>
                      <Input placeholder="1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Controller
                name="bankName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Bank</FormLabel>
                    <FormControl>
                      <Input placeholder="BCA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}

        {paymentMethodType === "E_WALLET" && (
          <div className="space-y-6">
            <h3 className="font-semibold">Detail Akun</h3>
            <div className="grid grid-cols-2 gap-6">
              <Controller
                name="accountName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Pemilik Akun</FormLabel>
                    <FormControl>
                      <Input placeholder="PT PerbaikiinAja" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Controller
                name="virtualAccountNumber"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor VA</FormLabel>
                    <FormControl>
                      <Input placeholder="9876543210" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Controller
              name="instructions"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instruksi</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Instruksi pembayaran..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {paymentMethodType === "COD" && (
          <div className="space-y-6">
            <h3 className="font-semibold">Detail Kontak</h3>
            <div className="grid grid-cols-2 gap-6">
              <Controller
                name="phoneNumber"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor Telepon</FormLabel>
                    <FormControl>
                      <Input placeholder="08123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Controller
              name="instructions"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instruksi</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Instruksi pembayaran..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {/* <div className="flex items-center space-x-4">
          <Controller
            name="isActive"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Aktif</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div> */}

        <Button type="submit" disabled={loading}>
          {isEditing ? "Simpan Perubahan" : "Tambah Metode Pembayaran"}
        </Button>
      </form>
    </Form>
  )
}
