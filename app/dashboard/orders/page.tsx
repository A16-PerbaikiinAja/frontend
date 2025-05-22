'use client';

import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, RefreshCw, Edit2, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { EmptyState } from '@/components/dashboard/empty-state';
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

interface Order {
  id: string;
  technicianId?: string | null;
  itemName: string;
  itemCondition: string;
  repairDetails: string;
  serviceDate: string;
  status: 'PENDING' | 'WAITING_APPROVAL' | string;
  finalPrice?: number | null;
}

interface OrderListResponse {
  orders: Order[];
}

export default function OrdersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'USER') {
        router.push('/dashboard');
        toast.error('Access Denied', {
          description: 'Only users can access the orders page.',
        });
      } else {
        loadOrders();
      }
    }
  }, [user, authLoading, router]);

  const loadOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_ORDER_API_URL}/orders`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = (await res.json()) as OrderListResponse;
      setOrders(data.orders);
    } catch (err) {
      console.error(err);
      setError('Failed to load orders. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshOrders = async () => {
    setIsRefreshing(true);
    await loadOrders();
    toast.success('Your order history has been updated.');
    setIsRefreshing(false);
  };

  return (
    <DashboardLayout>
      <div className='flex items-center justify-between mb-6 px-6'>
        <h1 className='text-2xl font-bold'>Order History</h1>
        <Button variant='outline' onClick={refreshOrders} disabled={isRefreshing}>
          <RefreshCw className='mr-2 h-4 w-4' />
          Refresh
        </Button>
      </div>
      {isLoading ? (
        <div className='space-y-4 px-6'>
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className='h-4 w-1/3' />
                <Skeleton className='h-3 w-1/2 mt-2' />
              </CardHeader>
              <CardContent>
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-3/4 mt-2' />
              </CardContent>
              <CardFooter>
                <Skeleton className='h-4 w-1/4' />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className='border-red-200 bg-red-50'>
          <CardContent className='pt-6'>
            <div className='flex flex-col items-center justify-center text-center'>
              <AlertCircle className='mb-2 h-10 w-10 text-red-500' />
              <h3 className='mb-1 text-lg font-medium'>Error Loading Orders</h3>
              <p className='text-sm mb-4'>{error}</p>
              <Button onClick={loadOrders}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title='No orders'
          description="You haven't placed any orders yet."
          action={
            <Button variant='outline' onClick={refreshOrders} disabled={isRefreshing}>
              Check Again
            </Button>
          }
        />
      ) : (
        <motion.div className='space-y-4 px-6'>
          <AnimatePresence>
            {orders.map((order) => {
              const canEdit =
                order.status === 'PENDING' || order.status === 'WAITING_APPROVAL';
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <Card>
                    <CardHeader>
                      <div className='flex justify-between items-center'>
                        <div>
                          <CardTitle>Order #{order.id}</CardTitle>
                          <CardDescription>
                            {format(new Date(order.serviceDate), 'PPP')}
                          </CardDescription>
                        </div>
                        {canEdit && (
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => router.push(`/orders/${order.id}/edit`)}
                            aria-label='Edit order'
                          >
                            <Edit2 className='h-4 w-4' />
                          </Button>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent>
                      <p className='mb-1'>Item: {order.itemName}</p>
                      <p className='mb-1'>Condition: {order.itemCondition}</p>
                      <p className='mb-1'>Details: {order.repairDetails}</p>
                      <p className='mb-1'>Status: {order.status}</p>
                      <p className='mb-1'>
                        Price:{' '}
                        {order.finalPrice != null
                          ? new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: 'USD',
                            }).format(order.finalPrice)
                          : 'Pending'}
                      </p>
                    </CardContent>

                    <CardFooter className='bg-muted/50 border-t px-6 py-3'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => router.push(`/orders/${order.id}`)}
                      >
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </DashboardLayout>
  );
}