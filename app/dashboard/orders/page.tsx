'use client';

import type React from 'react';

import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  FileText,
  Filter,
  Hammer,
  Package,
  PlusCircle,
  RefreshCw,
  Search,
  ThumbsUp,
  XCircle,
  Edit3,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { EmptyState } from '@/components/dashboard/empty-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/auth-provider';

type OrderStatus =
  | 'PENDING'
  | 'WAITING_APPROVAL'
  | 'APPROVED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'REJECTED'
  | 'CANCELLED';

interface Order {
  id: string;
  customerId: string;
  technicianId?: string | null;
  itemName: string;
  itemCondition: string;
  repairDetails: string;
  serviceDate: string;
  status: OrderStatus;
  paymentMethodId?: string | null;
  couponId?: string | null;
  estimatedCompletionTime?: string | null;
  estimatedPrice?: number | null;
  finalPrice?: number | null;
  createdAt: string;
  updatedAt: string;
  completedAt?: string | null;
}

export default function OrdersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else {
        loadOrders();
      }
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!orders.length) return;

    let filtered = [...orders];

    if (activeTab !== 'all') {
      const statusMap: { [key: string]: OrderStatus } = {
        pending: 'PENDING',
        'waiting-approval': 'WAITING_APPROVAL',
        approved: 'APPROVED',
        'in-progress': 'IN_PROGRESS',
        completed: 'COMPLETED',
        rejected: 'REJECTED',
        cancelled: 'CANCELLED',
      };
      filtered = filtered.filter((order) => order.status === statusMap[activeTab]);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(query) ||
          order.itemName.toLowerCase().includes(query) ||
          order.repairDetails.toLowerCase().includes(query),
      );
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    setFilteredOrders(filtered);
  }, [orders, searchQuery, activeTab, sortOrder]);

  const loadOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_ORDER_API_URL}/orders`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (res.ok) {
        const payload = (await res.json()) as { orders: Order[]; count: number };
        setOrders(payload.orders);
        setFilteredOrders(payload.orders);
      } else {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('Failed to load orders. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshOrders = async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_ORDER_API_URL}/orders`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (res.ok) {
        const payload = (await res.json()) as { orders: Order[]; count: number };
        setOrders(payload.orders);
        setFilteredOrders(payload.orders);
        toast.success('Orders refreshed', {
          description: 'Your orders have been updated.',
        });
      } else {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
    } catch (err) {
      console.error('Failed to refresh orders:', err);
      toast.error('Refresh failed', {
        description: 'Could not refresh orders. Please try again.',
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const openCancelConfirmation = (orderId: string) => {
    setOrderToCancel(orderId);
    setCancelConfirmOpen(true);
  };

  const closeCancelConfirmation = () => {
    setOrderToCancel(null);
    setCancelConfirmOpen(false);
    setIsCancelling(false);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && cancelConfirmOpen && !isCancelling) {
        closeCancelConfirmation();
      }
    };

    if (cancelConfirmOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [cancelConfirmOpen, isCancelling]);

  const handleCancelOrder = async () => {
    if (!orderToCancel) return;
    
    setIsCancelling(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_ORDER_API_URL}/orders/${orderToCancel}`, {
        method: 'DELETE',
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (res.ok) {
        setOrders((prev) => prev.filter((order) => order.id !== orderToCancel));
        toast.success('Order cancelled', {
          description: 'Your order has been cancelled successfully.',
        });
        closeCancelConfirmation();
      } else {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
    } catch (err) {
      console.error('Failed to cancel order:', err);
      toast.error('Cancel failed', {
        description: 'Could not cancel the order. Please try again.',
      });
      setIsCancelling(false);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-500';
      case 'WAITING_APPROVAL':
        return 'bg-orange-500';
      case 'APPROVED':
        return 'bg-blue-500';
      case 'IN_PROGRESS':
        return 'bg-purple-500';
      case 'COMPLETED':
        return 'bg-green-500';
      case 'REJECTED':
        return 'bg-red-500';
      case 'CANCELLED':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig = {
      PENDING: { icon: Clock, label: 'Pending', variant: 'outline' as const },
      WAITING_APPROVAL: {
        icon: AlertTriangle,
        label: 'Waiting Approval',
        variant: 'outline' as const,
      },
      APPROVED: { icon: ThumbsUp, label: 'Approved', variant: 'outline' as const },
      IN_PROGRESS: { icon: Hammer, label: 'In Progress', variant: 'outline' as const },
      COMPLETED: { icon: CheckCircle2, label: 'Completed', variant: 'default' as const },
      REJECTED: { icon: XCircle, label: 'Rejected', variant: 'destructive' as const },
      CANCELLED: { icon: XCircle, label: 'Cancelled', variant: 'secondary' as const },
    };

    const config = statusConfig[status] || statusConfig['PENDING'];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const formatPrice = (price: number | null | undefined) => {
    if (price === null || price === undefined) return null;
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: { duration: 0.3 },
    },
  };

  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-4 w-1/4" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex items-center gap-3">
          <Package className="text-primary h-6 w-6" />
          <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
            <Input
              placeholder="Search by order ID, item name, or repair details..."
              className="pl-8 sm:w-[250px]"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                <span>Sort</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                checked={sortOrder === 'newest'}
                onCheckedChange={() => setSortOrder('newest')}>
                Newest first
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={sortOrder === 'oldest'}
                onCheckedChange={() => setSortOrder('oldest')}>
                Oldest first
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={refreshOrders}
            disabled={isRefreshing || isLoading}>
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </Button>
          <Button className="gap-2" onClick={() => router.push('/dashboard/orders/create')}>
            <PlusCircle className="h-4 w-4" />
            <span>New Order</span>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="waiting-approval" className="hidden sm:flex">Waiting Approval</TabsTrigger>
          <TabsTrigger value="approved" className="hidden lg:flex">Approved</TabsTrigger>
          <TabsTrigger value="in-progress">Progress</TabsTrigger>
          <TabsTrigger value="completed">Done</TabsTrigger>
          <TabsTrigger value="rejected" className="hidden lg:flex">Rejected</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-16 w-full" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-4 w-1/4" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : error ? (
            <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center text-center">
                  <AlertTriangle className="mb-2 h-10 w-10 text-red-500" />
                  <h3 className="mb-1 text-lg font-medium">Error Loading Orders</h3>
                  <p className="text-muted-foreground mb-4 text-sm">{error}</p>
                  <Button onClick={loadOrders}>Try Again</Button>
                </div>
              </CardContent>
            </Card>
          ) : filteredOrders.length === 0 ? (
            <EmptyState
              icon={Package}
              title={searchQuery ? 'No matching orders' : 'No orders found'}
              description={
                searchQuery
                  ? 'Try adjusting your search or filters'
                  : "You don't have any orders yet. Place a repair request to get started."
              }
              action={
                searchQuery ? (
                  <Button variant="outline" onClick={() => setSearchQuery('')}>
                    Clear Search
                  </Button>
                ) : (
                  <Button onClick={() => router.push('/dashboard/orders/create')}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New Order
                  </Button>
                )
              }
            />
          ) : (
            <motion.div
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden">
              <AnimatePresence>
                {filteredOrders.map((order) => (
                  <motion.div
                    key={order.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout>
                    <Card className="group overflow-hidden py-0 transition-all hover:shadow-md">
                      <CardHeader className="pt-6 pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className={`h-2 w-2 rounded-full ${getStatusColor(order.status)}`}
                            />
                            <CardTitle className="text-lg">{order.itemName}</CardTitle>
                          </div>
                          {getStatusBadge(order.status)}
                        </div>
                        <CardDescription className="flex items-center justify-between">
                          <span>{order.repairDetails}</span>
                          <span className="font-mono text-xs">{order.id}</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="grid gap-2 text-sm">
                          <div className="text-muted-foreground flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>Service Date: {format(new Date(order.serviceDate), 'PPP')}</span>
                          </div>
                          {order.estimatedCompletionTime && (
                            <div className="text-muted-foreground flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>Est. Completion: {order.estimatedCompletionTime}</span>
                            </div>
                          )}
                          <div className="font-medium">
                            {order.finalPrice
                              ? `Final Price: ${formatPrice(order.finalPrice)}`
                              : order.estimatedPrice
                                ? `Est. Price: ${formatPrice(order.estimatedPrice)}`
                                : 'Price pending'}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="bg-muted/50 flex items-center justify-between border-t px-6 py-3 pb-6">
                        <div className="text-muted-foreground flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4" />
                          <span>{format(new Date(order.createdAt), 'PPP')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {(order.status === 'PENDING' || order.status === 'WAITING_APPROVAL') && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  router.push(`/dashboard/orders/${order.id}/edit`)
                                }
                                className="gap-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-colors">
                                <Edit3 className="h-4 w-4" />
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openCancelConfirmation(order.id)}
                                className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-colors">
                                <X className="h-4 w-4" />
                                Cancel
                              </Button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleOrderExpand(order.id)}
                            aria-label={
                              expandedOrderId === order.id ? 'Collapse details' : 'Expand details'
                            }>
                            {expandedOrderId === order.id ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </CardFooter>

                      {/* Expanded details */}
                      <AnimatePresence>
                        {expandedOrderId === order.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden border-t">
                            <div className="bg-muted/30 p-6">
                              <div className="space-y-6">
                                {/* Order Summary */}
                                <div className="border-b pb-4">
                                  <h3 className="text-lg font-semibold mb-2">Order #{order.id}</h3>
                                  <p className="text-muted-foreground">
                                    Service Date: {format(new Date(order.serviceDate), 'PPPpp')}
                                  </p>
                                </div>

                                {/* Order Information */}
                                <div className="space-y-4">
                                  <h4 className="text-sm font-semibold text-primary">Order Information</h4>
                                  <div className="space-y-3 text-sm">
                                    <div>
                                      <span className="text-muted-foreground font-medium">Item:</span>
                                      <p className="font-medium mt-1">{order.itemName}</p>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground font-medium">Condition:</span>
                                      <p className="mt-1">{order.itemCondition}</p>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground font-medium">Repair Details:</span>
                                      <p className="mt-1">{order.repairDetails}</p>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground font-medium">Status:</span>
                                      <div className="mt-1">{getStatusBadge(order.status)}</div>
                                    </div>
                                  </div>
                                </div>

                                {/* Timestamps */}
                                <div className="border-t pt-4">
                                  <h4 className="text-sm font-semibold text-primary mb-3">Timeline</h4>
                                  <div className="grid gap-3 text-sm md:grid-cols-3">
                                    <div>
                                      <span className="text-muted-foreground font-medium">Created:</span>
                                      <p className="mt-1">{format(new Date(order.createdAt), 'PPP')}</p>
                                      <p className="text-xs text-muted-foreground">{format(new Date(order.createdAt), 'p')}</p>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground font-medium">Last Updated:</span>
                                      <p className="mt-1">{format(new Date(order.updatedAt), 'PPP')}</p>
                                      <p className="text-xs text-muted-foreground">{format(new Date(order.updatedAt), 'p')}</p>
                                    </div>
                                    {order.completedAt && (
                                      <div>
                                        <span className="text-muted-foreground font-medium">Completed:</span>
                                        <p className="mt-1">{format(new Date(order.completedAt), 'PPP')}</p>
                                        <p className="text-xs text-muted-foreground">{format(new Date(order.completedAt), 'p')}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="border-t pt-4">
                                  <div className="flex flex-wrap gap-2">
                                    {order.status === 'COMPLETED' && (
                                      <Button size="sm" className="gap-2">
                                        <CheckCircle2 className="h-4 w-4" />
                                        Leave Review
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </TabsContent>
      </Tabs>

      {/* Cancel Confirmation Modal */}
      {cancelConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeCancelConfirmation}
          />
          
          <Card className="relative z-10 w-full max-w-md mx-4 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Cancel Order Confirmation
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm">Are you sure you want to cancel this order?</p>
              
              {orderToCancel && (
                <div className="bg-muted p-3 rounded-md space-y-2">
                  {(() => {
                    const order = orders.find(o => o.id === orderToCancel);
                    return order ? (
                      <>
                        <p className="text-sm">
                          <span className="font-medium">Order ID:</span> 
                          <span className="font-mono ml-1">{order.id}</span>
                        </p>
                        <p className="text-base">
                          <span className="font-medium">Item:</span> 
                          <span className="font-semibold ml-1">{order.itemName}</span>
                        </p>
                        <div className="text-sm flex items-center gap-2">
                          <span className="font-medium">Status:</span>
                          {getStatusBadge(order.status)}
                        </div>
                      </>
                    ) : null;
                  })()}
                </div>
              )}
              
              <p className="text-sm text-muted-foreground">
                This action cannot be undone. The order will be permanently cancelled.
              </p>
            </CardContent>
            
            <CardFooter className="flex justify-end gap-2">
              <Button 
                variant="outline"
                onClick={closeCancelConfirmation}
                disabled={isCancelling}>
                Keep Order
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancelOrder}
                disabled={isCancelling}
                className="gap-2">
                {isCancelling ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  <>
                    <X className="h-4 w-4" />
                    Yes, Cancel Order
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}