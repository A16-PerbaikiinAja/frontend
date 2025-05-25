"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import PaymentMethodForm from "@/components/payment-method-form"
import BackButton from "@/components/back-button"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { useAuth } from "@/contexts/auth-provider";
import { LoadingScreen } from "@/components/dashboard/loading-screen";
import { redirect } from "next/navigation"


export default async function AdminEditPaymentMethodPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { user, isLoading } = useAuth();

  if (!isLoading && !user) {
    redirect("/login");
  }

  if (isLoading) return <LoadingScreen />;
  if (!user) return null;
  const { id } = await params

  if(user.role !== 'ADMIN'){
    redirect("/dashboard/payment-methods/active");
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
      <div className="flex items-center gap-4">
        <BackButton fallbackHref={`/dashboard/payment-methods/admin/${id}`} />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Metode Pembayaran (Admin)</h1>
          <p className="text-muted-foreground">Perbarui informasi metode pembayaran dengan akses admin</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detail Metode Pembayaran</CardTitle>
          <CardDescription>Edit informasi metode pembayaran dengan privilese admin</CardDescription>
        </CardHeader>
        <CardContent>
          <PaymentMethodForm id={id} isEditing />
        </CardContent>
      </Card>
    </div>
    </DashboardLayout>
  )
}
