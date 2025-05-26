"use client"

import PaymentMethodDetail from "@/components/payment-method-detail"
import BackButton from "@/components/back-button"
import { useAuth } from "@/contexts/auth-provider";
import { redirect } from "next/navigation"
import { LoadingScreen } from "@/components/dashboard/loading-screen";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export default async function UserPaymentMethodDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { user, isLoading } = useAuth();

  if (!isLoading && !user) {
    redirect("/login");
  }

  if (isLoading) return <LoadingScreen />;
  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
      <div className="flex items-center gap-4">
        <BackButton fallbackHref="/payment-methods/active" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Detail Metode Pembayaran</h1>
          <p className="text-muted-foreground">Informasi metode pembayaran</p>
        </div>
      </div>

      <PaymentMethodDetail id={id} isAdmin={false} />
    </div>
    </DashboardLayout>
  )
}
