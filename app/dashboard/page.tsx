'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { AdminDashboard } from '@/components/dashboard/admin-dashboard';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { LoadingScreen } from '@/components/dashboard/loading-screen';
import { TechnicianDashboard } from '@/components/dashboard/technician-dashboard';
import { UserDashboard } from '@/components/dashboard/user-dashboard';
import { useAuth } from '@/contexts/auth-provider';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      {user.role === 'USER' && <UserDashboard user={user} />}
      {user.role === 'TECHNICIAN' && <TechnicianDashboard user={user} />}
      {user.role === 'ADMIN' && <AdminDashboard user={user} />}
    </DashboardLayout>
  );
}
