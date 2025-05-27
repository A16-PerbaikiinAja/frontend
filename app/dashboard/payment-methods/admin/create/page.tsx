"use client"


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import PaymentMethodForm from "@/components/payment-method-form"
import BackButton from "@/components/back-button"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { useAuth } from "@/contexts/auth-provider";
import { redirect } from "next/navigation"
import { LoadingScreen } from "@/components/dashboard/loading-screen";

export default function CreatePaymentMethodPage() {
  const { user, isLoading } = useAuth();

  if (!isLoading && !user) {
    redirect("/login");
  }


  if (isLoading) return <LoadingScreen />;
  if (!user) return null;

  if(user.role !== 'ADMIN'){
    redirect("/dashboard/payment-methods/active");
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
      <div className="flex items-center gap-4">
        <BackButton fallbackHref="/payment-methods" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tambah Metode Pembayaran</h1>
          <p className="text-muted-foreground">Buat metode pembayaran baru untuk pengguna</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detail Metode Pembayaran</CardTitle>
          <CardDescription>Isi informasi metode pembayaran</CardDescription>
        </CardHeader>
        <CardContent>
          <PaymentMethodForm />
        </CardContent>
      </Card>
    </div>
    </DashboardLayout>
  )
}
