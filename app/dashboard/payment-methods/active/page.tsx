"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import PaymentMethodUserList from "@/components/payment-method-user-list"
import PaymentMethodSearchWithType from "@/components/payment-method-search-with-type"
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-provider";
import { useRouter } from "next/navigation";
import { LoadingScreen } from "@/components/dashboard/loading-screen";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export default function UserPaymentMethodsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [paymentType, setPaymentType] = useState("")

  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) return <LoadingScreen />;
  if (!user) return null;

  const handleSearch = (term: string, type: string) => {
    setSearchTerm(term)
    setPaymentType(type)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Metode Pembayaran</h1>
        <p className="text-muted-foreground">Pilih metode pembayaran yang tersedia untuk transaksi Anda</p>
      </div>

      <PaymentMethodSearchWithType onSearch={handleSearch} />

      <Card>
        <CardHeader>
          <CardTitle>Metode Pembayaran Tersedia</CardTitle>
          <CardDescription>Pilih salah satu metode pembayaran berikut untuk transaksi Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <PaymentMethodUserList searchTerm={searchTerm} paymentType={paymentType} />
        </CardContent>
      </Card>
    </div>
    </DashboardLayout>
  )
}
