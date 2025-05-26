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
  MessageSquare,
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
          order.repairDetails.toLowerCase().includes(query) ||
          (order.technicianId && order.technicianId.toLowerCase().includes(query)),
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

  const handleCancelOrder = async (orderId: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_ORDER_API_URL}/orders/${orderId}`, {
        method: 'DELETE',
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (res.ok) {
        setOrders((prev) => prev.filter((order) => order.id !== orderId));
        toast.success('Order cancelled', {
          description: 'Your order has been cancelled successfully.',
        });
      } else {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
    } catch (err) {
      console.error('Failed to cancel order:', err);
      toast.error('Cancel failed', {
        description: 'Could not cancel the order. Please try again.',
      });
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

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4" />;
      case 'WAITING_APPROVAL':
        return <AlertTriangle className="h-4 w-4" />;
      case 'APPROVED':
        return <ThumbsUp className="h-4 w-4" />;
      case 'IN_PROGRESS':
        return <Hammer className="h-4 w-4" />;
      case 'COMPLETED':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'REJECTED':
        return <XCircle className="h-4 w-4" />;
      case 'CANCELLED':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
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
              placeholder="Search orders..."
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
          <TabsTrigger value="waiting-approval" className="hidden sm:flex">
            Waiting
          </TabsTrigger>
          <TabsTrigger value="approved" className="hidden lg:flex">
            Approved
          </TabsTrigger>
          <TabsTrigger value="in-progress">Progress</TabsTrigger>
          <TabsTrigger value="completed">Done</TabsTrigger>
          <TabsTrigger value="rejected" className="hidden lg:flex">
            Rejected
          </TabsTrigger>
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
                          {order.technicianId && (
                            <div className="text-muted-foreground flex items-center gap-2">
                              <span>Technician ID: {order.technicianId}</span>
                            </div>
                          )}
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
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              router.push(`/dashboard/orders/${order.id}`)
                            }>
                            View Details
                          </Button>
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
                                onClick={() => handleCancelOrder(order.id)}
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
                            <div className="bg-muted/30 p-4">
                              <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                  <h4 className="mb-2 text-sm font-medium">Order Details</h4>
                                  <dl className="grid grid-cols-2 gap-1 text-sm">
                                    <dt className="text-muted-foreground">Order ID:</dt>
                                    <dd className="font-mono">{order.id}</dd>
                                    <dt className="text-muted-foreground">Customer ID:</dt>
                                    <dd className="font-mono">{order.customerId}</dd>
                                    <dt className="text-muted-foreground">Created:</dt>
                                    <dd>{format(new Date(order.createdAt), 'PPP')}</dd>
                                    <dt className="text-muted-foreground">Updated:</dt>
                                    <dd>{format(new Date(order.updatedAt), 'PPP')}</dd>
                                    <dt className="text-muted-foreground">Service Date:</dt>
                                    <dd>{format(new Date(order.serviceDate), 'PPP')}</dd>
                                    <dt className="text-muted-foreground">Status:</dt>
                                    <dd>{getStatusBadge(order.status)}</dd>
                                    {order.completedAt && (
                                      <>
                                        <dt className="text-muted-foreground">Completed:</dt>
                                        <dd>{format(new Date(order.completedAt), 'PPP')}</dd>
                                      </>
                                    )}
                                  </dl>
                                </div>
                                <div>
                                  <h4 className="mb-2 text-sm font-medium">Repair Information</h4>
                                  <div className="space-y-2 text-sm">
                                    <div>
                                      <span className="text-muted-foreground">Item:</span>
                                      <p className="font-medium">{order.itemName}</p>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Condition:</span>
                                      <p>{order.itemCondition}</p>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Details:</span>
                                      <p>{order.repairDetails}</p>
                                    </div>
                                    {order.technicianId && (
                                      <div>
                                        <span className="text-muted-foreground">Technician ID:</span>
                                        <p className="font-mono">{order.technicianId}</p>
                                      </div>
                                    )}
                                    {order.estimatedCompletionTime && (
                                      <div>
                                        <span className="text-muted-foreground">Est. Completion:</span>
                                        <p className="font-medium">{order.estimatedCompletionTime}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="mt-4 flex flex-wrap gap-2">
                                {order.technicianId && (
                                  <Button variant="outline" size="sm" className="gap-2">
                                    <MessageSquare className="h-4 w-4" />
                                    <span>Contact Technician</span>
                                  </Button>
                                )}
                                <Button variant="outline" size="sm" className="gap-2">
                                  <FileText className="h-4 w-4" />
                                  <span>View Invoice</span>
                                </Button>
                                {order.status === 'COMPLETED' && (
                                  <Button size="sm" className="gap-2">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span>Leave Review</span>
                                  </Button>
                                )}
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
    </DashboardLayout>
  );
}