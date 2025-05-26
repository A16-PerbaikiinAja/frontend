"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PaymentMethodList from "@/components/payment-method-list";
import PaymentMethodSearchWithType from "@/components/payment-method-search-with-type";
import { UserDashboard } from "@/components/dashboard/user-dashboard";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { TechnicianDashboard } from "@/components/dashboard/technician-dashboard";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";
import { useAuth } from "@/contexts/auth-provider";
import { LoadingScreen } from "@/components/dashboard/loading-screen";

export default function PaymentMethodsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) return <LoadingScreen />;
  if (!user) return null;

  if(user.role !== 'ADMIN'){
    router.push("/dashboard/payment-methods/active");
  }

  return (
      <DashboardLayout>
        <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Metode Pembayaran</h1>
            <p className="text-muted-foreground">
              Kelola metode pembayaran yang tersedia untuk pengguna
            </p>
          </div>
          <Link href="/dashboard/payment-methods/admin/create">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Metode
            </Button>
          </Link>
        </div>

        <PaymentMethodSearchWithType onSearch={handleSearch} />

        <Card>
          <CardHeader>
            <CardTitle>Daftar Metode Pembayaran</CardTitle>
            <CardDescription>Semua metode pembayaran yang tersedia di sistem</CardDescription>
          </CardHeader>
          <CardContent>
            <PaymentMethodList searchTerm={searchTerm} paymentType={paymentType} />
          </CardContent>
        </Card>
      </div>
      </DashboardLayout>
  );

  function handleSearch(term: string, type: string) {
    setSearchTerm(term);
    setPaymentType(type);
  }
}
