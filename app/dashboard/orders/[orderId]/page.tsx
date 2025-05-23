'use client';

import { format, parseISO } from 'date-fns';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { AlertCircle, RefreshCw, Edit2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/auth-provider';

interface OrderDetail {
  id: string;
  customerId: string;
  technicianId?: string | null;
  technicianName?: string | null;
  technicianRating?: number;
  itemName: string;
  itemCondition: string;
  repairDetails: string;
  serviceDate: string;
  status: string;
  paymentMethodId: string;
  couponId?: string | null;
  estimatedCompletionTime?: string;
  estimatedPrice?: number;
  finalPrice?: number;
  repairEstimate?: string;
  repairPrice?: number;
  repairReport?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string | null;
}

export default function OrderDetailPage() {
  const router = useRouter();
  const { orderId } = useParams();
  const { user, isLoading: authLoading } = useAuth();

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canEdit =
    order?.status === 'PENDING' || order?.status === 'WAITING_APPROVAL';

  const fetchOrder = async () => {
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_ORDER_API_URL}/orders/${orderId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      if (res.status === 404) {
        setError('Order not found.');
        setOrder(null);
        return;
      }
      if (res.status === 403) {
        toast.error('Access denied');
        router.push('/dashboard/orders');
        return;
      }
      if (!res.ok) throw new Error(`Status ${res.status}`);

      // Extract wrapped order object from backend response
      const json = await res.json();
      const data = (json.order as OrderDetail) ?? (json as OrderDetail);
      setOrder(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load order. Please try again.');
      setOrder(null);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user) return void router.push('/login');
      if (user.role !== 'USER') {
        toast.error('Access Denied');
        return void router.push('/dashboard');
      }
      fetchOrder();
    }
  }, [authLoading, user, orderId]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchOrder();
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-4 px-6">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <Card className="max-w-lg mx-auto border-red-200 bg-red-50">
          <CardContent className="py-10 flex flex-col items-center">
            <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
            <p className="text-red-600">{error}</p>
            <Button className="mt-4" onClick={() => router.push('/dashboard/orders')}>
              Back to Orders
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  if (!order) return null;

  return (
    <DashboardLayout>
      <div className="max-w-lg mx-auto space-y-6 px-6">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/dashboard/orders')}
            aria-label="Back to Order History"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Order #{order.id}</h1>
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          {canEdit && (
            <Button
              variant="secondary"
              size="icon"
              onClick={() => router.push(`/dashboard/orders/${orderId}/edit`)}
              aria-label="Edit order"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
            <CardDescription>
              {/* Use parseISO to correctly parse date string */}
              {format(parseISO(order.serviceDate), 'PPPpp')}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-2">
            <p><strong>Item:</strong> {order.itemName}</p>
            <p><strong>Condition:</strong> {order.itemCondition}</p>
            <p><strong>Details:</strong> {order.repairDetails}</p>
            <p><strong>Status:</strong> {order.status}</p>
            {order.technicianName && (
              <p>
                <strong>Technician:</strong> {order.technicianName}
                {order.technicianRating != null ? ` (${order.technicianRating.toFixed(1)})` : ''}
              </p>
            )}
            {order.estimatedCompletionTime && <p><strong>Est. Completion:</strong> {order.estimatedCompletionTime}</p>}
            {order.estimatedPrice != null && <p><strong>Est. Price:</strong> {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(order.estimatedPrice)}</p>}
            {order.finalPrice != null && <p><strong>Final Price:</strong> {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(order.finalPrice)}</p>}
            {order.repairEstimate && <p><strong>Estimate:</strong> {order.repairEstimate}</p>}
            {order.repairPrice != null && <p><strong>Repair Price:</strong> {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(order.repairPrice)}</p>}
            {order.repairReport && <p><strong>Report:</strong> {order.repairReport}</p>}
            {order.couponId && <p><strong>Coupon:</strong> {order.couponId}</p>}
            <p><strong>Created At:</strong> {format(parseISO(order.createdAt), 'PPPpp')}</p>
            <p><strong>Updated At:</strong> {format(parseISO(order.updatedAt), 'PPPpp')}</p>
            {order.completedAt && <p><strong>Completed At:</strong> {format(parseISO(order.completedAt), 'PPPpp')}</p>}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
