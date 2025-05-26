"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-provider";
import { LoadingScreen } from "@/components/dashboard/loading-screen";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PaymentMethodUsageStats from "@/components/payment-method-usage-stats";
import BackButton from "@/components/back-button";
import { UserDashboard } from "@/components/dashboard/user-dashboard";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { TechnicianDashboard } from "@/components/dashboard/technician-dashboard";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";

export default function PaymentMethodUsageStatsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return null;
  }

  if(user.role !== 'ADMIN'){
    router.push("/dashboard/payment-methods/active");
  }

  return (
      <DashboardLayout>
        <div className="space-y-6">
        <div className="flex items-center gap-4">
          <BackButton fallbackHref="/payment-methods" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Statistik Penggunaan Metode Pembayaran</h1>
            <p className="text-muted-foreground">
              Lihat seberapa sering setiap metode pembayaran digunakan dalam pesanan
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Statistik Penggunaan</CardTitle>
            <CardDescription>Data penggunaan metode pembayaran berdasarkan jumlah pesanan</CardDescription>
          </CardHeader>
          <CardContent>
            <PaymentMethodUsageStats />
          </CardContent>
        </Card>
      </div>
      </DashboardLayout>
  );
}
