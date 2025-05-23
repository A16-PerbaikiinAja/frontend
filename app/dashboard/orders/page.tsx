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
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
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
  estimatedPrice?: number | null;
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

  const [modalOpen, setModalOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'USER') {
        toast.error('Access Denied', {
          description: 'Only users can access the orders page.',
        });
        router.push('/dashboard');
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
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = (await res.json()) as OrderListResponse;
      setOrders(data.orders);
    } catch (err) {
      toast.error('Failed to load orders. Please try again later.');
      setError('Failed to load orders.');
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

  const openCancelModal = (order: Order) => {
    setOrderToCancel(order);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setOrderToCancel(null);
  };

  const confirmCancel = async () => {
    if (!orderToCancel) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_ORDER_API_URL}/orders/${orderToCancel.id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const json = await res.json();
      toast.success((json as { message: string }).message);
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderToCancel.id ? { ...o, status: 'CANCELLED' } : o
        )
      );
    } catch (err) {
      toast.error('Failed to cancel order.');
    } finally {
      closeModal();
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6 px-6">
        <h1 className="text-2xl font-bold">Order History</h1>
        <Button
          variant="outline"
          onClick={refreshOrders}
          disabled={isRefreshing}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4 px-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4 mt-2" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-4 w-1/4" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center">
              <AlertCircle className="mb-2 h-10 w-10 text-red-500" />
              <h3 className="mb-1 text-lg font-medium">Error Loading Orders</h3>
              <p className="text-sm mb-4">{error}</p>
              <Button onClick={loadOrders}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title="No orders"
          description="You haven't placed any orders yet."
          action={
            <Button
              variant="outline"
              onClick={refreshOrders}
              disabled={isRefreshing}
            >
              Check Again
            </Button>
          }
        />
      ) : (
        <motion.div className="space-y-4 px-6">
          <AnimatePresence>
            {orders.map((order) => {
              const canEdit =
                order.status === 'PENDING' ||
                order.status === 'WAITING_APPROVAL';
              const canCancel = canEdit;
              const displayPrice =
                order.finalPrice ?? order.estimatedPrice;

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle>Order #{order.id}</CardTitle>
                          <CardDescription>
                            {format(new Date(order.serviceDate), 'PPP')}
                          </CardDescription>
                        </div>
                        {canEdit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              router.push(
                                `/dashboard/orders/${order.id}/edit`
                              )
                            }
                            aria-label="Edit order"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent>
                      <p className="mb-1">Item: {order.itemName}</p>
                      <p className="mb-1">
                        Condition: {order.itemCondition}
                      </p>
                      <p className="mb-1">Details: {order.repairDetails}</p>
                      <p className="mb-1">Status: {order.status}</p>
                      <p className="mb-1">
                        Price:{' '}
                        {displayPrice != null
                          ? new Intl.NumberFormat('id-ID', {
                              style: 'currency',
                              currency: 'Rp',
                            }).format(displayPrice)
                          : 'Pending'}
                      </p>
                    </CardContent>

                    <CardFooter className="flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(
                            `/dashboard/orders/${order.id}`
                          )
                        }
                      >
                        View Details
                      </Button>
                      {canCancel && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => openCancelModal(order)}
                        >
                          Cancel
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {modalOpen && orderToCancel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">
              Cancel Order
            </h2>
            <p className="mb-6">
              Are you sure you want to cancel the order for "
              <span className="font-medium">
                {orderToCancel.itemName}
              </span>
              "?
            </p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={closeModal}>
                No
              </Button>
              <Button
                variant="destructive"
                onClick={confirmCancel}
              >
                Yes, Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
