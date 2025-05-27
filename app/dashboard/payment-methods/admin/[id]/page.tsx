"use client"

import PaymentMethodDetail from "@/components/payment-method-detail"
import BackButton from "@/components/back-button"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { useAuth } from "@/contexts/auth-provider";
import { redirect } from "next/navigation"
import { LoadingScreen } from "@/components/dashboard/loading-screen";

export default async function AdminPaymentMethodDetailPage({
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
    redirect(`/dashboard/payment-methods/active/${id}`);
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
      <div className="flex items-center gap-4">
        <BackButton fallbackHref="/dashboard/payment-methods" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Detail Metode Pembayaran (Admin)</h1>
          <p className="text-muted-foreground">Informasi lengkap tentang metode pembayaran dengan akses admin</p>
        </div>
      </div>

      <PaymentMethodDetail id={id} isAdmin={true} />
    </div>
    </DashboardLayout>
  )
}
