"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Pencil, Trash, RefreshCw } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner" // Menggunakan sonner
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

// Interface untuk tipe data metode pembayaran yang diterima dari API Admin
// Sesuaikan dengan PaymentMethodDTO dari backend
interface PaymentMethodAdminData {
  id: string;
  name: string;
  description?: string;
  processingFee: number;
  paymentMethod: "BANK_TRANSFER" | "E_WALLET" | "COD";
  accountName?: string;
  accountNumber?: string;
  bankName?: string;
  virtualAccountNumber?: string;
  phoneNumber?: string;
  instructions?: string;
  created_by_name?: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}


// Fungsi placeholder untuk mendapatkan token JWT (GANTI DENGAN IMPLEMENTASI ASLI KAMU)
const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token"); // Ganti "jwtToken" dengan key yang kamu gunakan
  }
  return null;
}

// Komponen ini diasumsikan selalu untuk admin berdasarkan aksi dan data yang ditampilkan
export default function PaymentMethodList({ searchTerm = "", paymentType = "" }: {searchTerm?: string, paymentType?: string}) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodAdminData[]>([])
  const [loading, setLoading] = useState(true);
  // toast dari sonner di-import langsung, tidak perlu useToast hook dari shadcn lama

  const apiBaseUrl = process.env.NEXT_PUBLIC_PAYMENT_API_URL

  useEffect(() => {
    const fetchAllPaymentMethodsForAdmin = async () => {
      if (!apiBaseUrl) {
        toast.error("Error Konfigurasi", { description: "URL API tidak terkonfigurasi."});
        setLoading(false);
        return;
      }
      setLoading(true);
      const token = getAuthToken();
      if (!token) {
        toast.error("Autentikasi Gagal", { description: "Token tidak ditemukan untuk akses admin." });
        setLoading(false);
        return;
      }

      const url = `${apiBaseUrl}/payment-methods/admin`; // Endpoint GET /payment-methods/admin
      try {
        const response = await fetch(url, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const responseData = await response.json();
        if (response.ok && responseData.status === "success" && Array.isArray(responseData.data)) {
          setPaymentMethods(responseData.data as PaymentMethodAdminData[]);
        } else {
          toast.error("Gagal Memuat Daftar", { description: responseData.message || "Gagal mengambil data metode pembayaran."});
          setPaymentMethods([]);
        }
      } catch (error) {
        console.error("Error fetching payment methods for admin:", error);
        toast.error("Gagal Memuat Daftar", { description: "Terjadi kesalahan jaringan atau server."});
        setPaymentMethods([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPaymentMethodsForAdmin();
  }, [apiBaseUrl]); // Hanya fetch saat apiBaseUrl berubah (sekali saat mount)

  const filteredPaymentMethods = paymentMethods.filter(
    (method) =>
      (searchTerm === "" ||
        method.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        method.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (paymentType === "" || paymentType === "all" || method.paymentMethod === paymentType),
  );

  const handleDelete = async (id: string) => {
    if (!apiBaseUrl) return;
    const token = getAuthToken();
    if (!token) {
        toast.error("Akses Ditolak", { description: "Operasi ini memerlukan autentikasi admin." });
        return;
    }
    const url = `${apiBaseUrl}/payment-methods/admin/${id}/delete`; // Endpoint DELETE
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: { "Authorization": `Bearer ${token}` }
      });
      const responseData = await response.json();

      if (response.ok && responseData.status === "success") {
        setPaymentMethods(
          paymentMethods.map((method) =>
            method.id === id ? { ...method, deleted_at: responseData.data?.deleted_at || new Date().toISOString() } : method,
          ).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) // Sort lagi jika perlu
        );
        toast.success("Metode Pembayaran Dinonaktifkan", {
          description: responseData.message || "Metode pembayaran telah dinonaktifkan."
        });
      } else {
        toast.error("Gagal Menonaktifkan", {
          description: responseData.message || "Gagal menonaktifkan metode pembayaran."
        });
      }
    } catch (error) {
      console.error("Error deleting payment method:", error);
      toast.error("Gagal Menonaktifkan", { description: "Terjadi kesalahan jaringan atau server." });
    }
  };

  const handleReactivate = async (id: string) => {
    if (!apiBaseUrl) return;
    const token = getAuthToken();
    if (!token) {
        toast.error("Akses Ditolak", { description: "Operasi ini memerlukan autentikasi admin."});
        return;
    }
    const url = `${apiBaseUrl}/payment-methods/admin/${id}/activate`; // Endpoint PATCH
    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: { "Authorization": `Bearer ${token}` }
      });
      const responseData = await response.json();

      if (response.ok && responseData.status === "success") {
        setPaymentMethods(paymentMethods.map((method) => (method.id === id ? { ...method, deleted_at: null } : method))
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())); // Sort lagi
        toast.success("Metode Pembayaran Diaktifkan", {
          description: responseData.message || "Metode pembayaran telah diaktifkan kembali."
        });
      } else {
        toast.error("Gagal Mengaktifkan", {
          description: responseData.message || "Gagal mengaktifkan metode pembayaran."
        });
      }
    } catch (error) {
      console.error("Error reactivating payment method:", error);
      toast.error("Gagal Mengaktifkan", { description: "Terjadi kesalahan jaringan atau server."});
    }
  };

  const getPaymentMethodBadge = (type: string) => {
    switch (type) {
      case "BANK_TRANSFER":
        return (
          <Badge variant="outline" className="border-blue-600 text-blue-700 bg-blue-50 dark:border-blue-500 dark:text-blue-400 dark:bg-blue-900/30">
            Transfer Bank
          </Badge>
        );
      case "E_WALLET":
        return (
          <Badge variant="outline" className="border-orange-600 text-orange-700 bg-orange-50 dark:border-orange-500 dark:text-orange-400 dark:bg-orange-900/30">
            E-Wallet
          </Badge>
        );
      case "COD":
        return (
          <Badge variant="outline" className="border-green-600 text-green-700 bg-green-50 dark:border-green-500 dark:text-green-400 dark:bg-green-900/30">
            Bayar di Tempat
          </Badge>
        );
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Memuat daftar metode pembayaran...</div>;
  }

  return (
    <div className="rounded-md border dark:border-gray-700">
      {filteredPaymentMethods.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-muted-foreground">
            {paymentMethods.length === 0 && !loading ? "Belum ada metode pembayaran yang terdaftar." : "Tidak ada metode pembayaran yang cocok dengan filter."}
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/10 dark:bg-muted/30">
              <TableHead>Nama</TableHead>
              <TableHead>Tipe</TableHead>
              <TableHead className="hidden md:table-cell">Biaya Layanan (Rp)</TableHead>
              <TableHead>Status</TableHead>
              {/* <TableHead className="hidden lg:table-cell">Dibuat Oleh</TableHead> */}
              <TableHead className="hidden md:table-cell">Tanggal Dibuat</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPaymentMethods.map((method) => (
              <TableRow key={method.id} className="dark:border-gray-700 hover:bg-muted/5">
                <TableCell className="font-medium">{method.name}</TableCell>
                <TableCell>{getPaymentMethodBadge(method.paymentMethod)}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {method.processingFee <= 0 ? "Gratis" : method.processingFee.toLocaleString("id-ID")}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      method.deleted_at === null
                        ? "border-green-600 text-green-700 bg-green-50 dark:border-green-500 dark:text-green-400 dark:bg-green-900/20"
                        : "border-red-600 text-red-700 bg-red-50 dark:border-red-500 dark:text-red-400 dark:bg-red-900/20"
                    }
                  >
                    {method.deleted_at === null ? "Aktif" : "Tidak Aktif"}
                  </Badge>
                </TableCell>
                {/* <TableCell className="hidden lg:table-cell">{method.created_by_name || "-"}</TableCell> */}
                <TableCell className="hidden md:table-cell">{new Date(method.created_at).toLocaleDateString("id-ID", { year: 'numeric', month: 'short', day: 'numeric' })}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Link href={`/dashboard/payment-methods/admin/${method.id}`}>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary" title="Lihat Detail">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    {method.deleted_at === null && (
                      <Link href={`/dashboard/payment-methods/admin/${method.id}/edit`}>
                        <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300" title="Edit">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                    {method.deleted_at === null ? (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300" title="Nonaktifkan">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Konfirmasi Penonaktifan</AlertDialogTitle>
                            <AlertDialogDescription>
                              Apakah Anda yakin ingin menonaktifkan metode pembayaran "{method.name}"?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(method.id)} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                              Nonaktifkan
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300" title="Aktifkan Kembali">
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Konfirmasi Aktivasi</AlertDialogTitle>
                            <AlertDialogDescription>
                              Apakah Anda yakin ingin mengaktifkan kembali metode pembayaran "{method.name}"?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleReactivate(method.id)} className="bg-green-600 hover:bg-green-700 text-primary-foreground">
                              Aktifkan
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}