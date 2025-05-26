'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  CreditCard,
  Edit,
  Eye,
  MoreHorizontal,
  PlusCircle,
  RefreshCw,
  Search,
  Smartphone,
  ToggleLeft,
  ToggleRight,
  University,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import type React from 'react';
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
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/auth-provider';

type PaymentMethodType = 'COD' | 'E_WALLET' | 'BANK_TRANSFER';
type PaymentMethodStatus = 'ACTIVE' | 'INACTIVE';

interface PaymentMethodDetailsDTO {
  id: string;
  paymentMethod: PaymentMethodType;
  phoneNumber?: string;
  instructions?: string;
  accountName?: string;
  virtualAccountNumber?: string;
  accountNumber?: string;
  bankName?: string;
  status: PaymentMethodStatus;
  orderCount: number;
}

export default function PaymentMethodsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodDetailsDTO[]>([]);
  const [filteredMethods, setFilteredMethods] = useState<PaymentMethodDetailsDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [deletingIds, setDeletingIds] = useState<string[]>([]);
  const [togglingIds, setTogglingIds] = useState<string[]>([]);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'ADMIN') {
        router.push('/dashboard');
        toast.error('Access Denied', {
          description: 'Only administrators can access payment methods management.',
        });
      } else {
        loadPaymentMethods();
      }
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!paymentMethods.length) return;

    let filtered = [...paymentMethods];

    if (activeTab !== 'all') {
      if (activeTab === 'active') {
        filtered = filtered.filter((method) => method.status === 'ACTIVE');
      } else if (activeTab === 'inactive') {
        filtered = filtered.filter((method) => method.status === 'INACTIVE');
      } else {
        filtered = filtered.filter((method) => method.paymentMethod === activeTab);
      }
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (method) =>
          method.paymentMethod.toLowerCase().includes(query) ||
          method.accountName?.toLowerCase().includes(query) ||
          method.bankName?.toLowerCase().includes(query) ||
          method.instructions?.toLowerCase().includes(query),
      );
    }

    filtered.sort((a, b) => b.orderCount - a.orderCount);

    setFilteredMethods(filtered);
  }, [paymentMethods, searchQuery, activeTab]);

  const loadPaymentMethods = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PAYMENT_API_URL}/payment-methods/admin/details-with-counts`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to fetch payment methods');
      }

      const result = await response.json();
      setPaymentMethods(result.data || result);
    } catch (err) {
      console.error('Failed to fetch payment methods:', err);
      setError('Failed to load payment methods. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshPaymentMethods = async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PAYMENT_API_URL}/payment-methods/admin/details-with-counts`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to refresh payment methods');
      }

      const result = await response.json();
      setPaymentMethods(result.data || result);
      toast.success('Payment methods refreshed', {
        description: 'Payment methods have been updated.',
      });
    } catch (err) {
      console.error('Failed to refresh payment methods:', err);
      toast.error('Refresh failed', {
        description: 'Could not refresh payment methods. Please try again.',
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleToggleStatus = async (id: string, currentStatus: PaymentMethodStatus) => {
    setTogglingIds((prev) => [...prev, id]);
    try {
      const endpoint =
        currentStatus === 'ACTIVE'
          ? `${process.env.NEXT_PUBLIC_PAYMENT_API_URL}/payment-methods/admin/${id}/delete`
          : `${process.env.NEXT_PUBLIC_PAYMENT_API_URL}/payment-methods/admin/${id}/activate`;

      const method = currentStatus === 'ACTIVE' ? 'DELETE' : 'PATCH';

      const response = await fetch(endpoint, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to toggle payment method status');
      }

      setPaymentMethods((prev) =>
        prev.map((method) =>
          method.id === id
            ? { ...method, status: currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' }
            : method,
        ),
      );

      toast.success(`Payment method ${currentStatus === 'ACTIVE' ? 'deactivated' : 'activated'}`, {
        description: `The payment method has been ${
          currentStatus === 'ACTIVE' ? 'deactivated' : 'activated'
        } successfully.`,
      });
    } catch (err) {
      console.error('Failed to toggle payment method status:', err);
      toast.error('Status toggle failed', {
        description: 'Could not change payment method status. Please try again.',
      });
    } finally {
      setTogglingIds((prev) => prev.filter((toggleId) => toggleId !== id));
    }
  };

  const getPaymentMethodIcon = (type: PaymentMethodType) => {
    switch (type) {
      case 'COD':
        return <CreditCard className="h-5 w-5" />;
      case 'E_WALLET':
        return <Smartphone className="h-5 w-5" />;
      case 'BANK_TRANSFER':
        return <University className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const getPaymentMethodLabel = (type: PaymentMethodType) => {
    switch (type) {
      case 'COD':
        return 'Cash on Delivery';
      case 'E_WALLET':
        return 'E-Wallet';
      case 'BANK_TRANSFER':
        return 'Bank Transfer';
      default:
        return type;
    }
  };

  const getStatusBadge = (status: PaymentMethodStatus) => {
    return (
      <Badge variant={status === 'ACTIVE' ? 'default' : 'secondary'} className="gap-1">
        {status === 'ACTIVE' ? (
          <ToggleRight className="h-3 w-3" />
        ) : (
          <ToggleLeft className="h-3 w-3" />
        )}
        {status}
      </Badge>
    );
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
          <h1 className="text-3xl font-bold tracking-tight">Payment Methods</h1>
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
          <CreditCard className="text-primary h-6 w-6" />
          <h1 className="text-3xl font-bold tracking-tight">Payment Methods</h1>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
            <Input
              placeholder="Search payment methods..."
              className="pl-8 sm:w-[250px]"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={refreshPaymentMethods}
            disabled={isRefreshing || isLoading}>
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </Button>
          <Button className="gap-2" onClick={() => router.push('/dashboard/payments/create')}>
            <PlusCircle className="h-4 w-4" />
            <span>Add Method</span>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
          <TabsTrigger value="COD">COD</TabsTrigger>
          <TabsTrigger value="E_WALLET">E-Wallet</TabsTrigger>
          <TabsTrigger value="BANK_TRANSFER">Bank</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
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
                  <h3 className="mb-1 text-lg font-medium">Error Loading Payment Methods</h3>
                  <p className="text-muted-foreground mb-4 text-sm">{error}</p>
                  <Button onClick={loadPaymentMethods}>Try Again</Button>
                </div>
              </CardContent>
            </Card>
          ) : filteredMethods.length === 0 ? (
            <EmptyState
              icon={CreditCard}
              title={searchQuery ? 'No matching payment methods' : 'No payment methods found'}
              description={
                searchQuery
                  ? 'Try adjusting your search or filters'
                  : 'No payment methods have been configured yet. Add a payment method to get started.'
              }
              action={
                searchQuery ? (
                  <Button variant="outline" onClick={() => setSearchQuery('')}>
                    Clear Search
                  </Button>
                ) : (
                  <Button onClick={() => router.push('/dashboard/payments/create')}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Payment Method
                  </Button>
                )
              }
            />
          ) : (
            <motion.div
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden">
              <AnimatePresence>
                {filteredMethods.map((method) => (
                  <motion.div
                    key={method.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout>
                    <Card className="group overflow-hidden transition-all hover:shadow-md">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getPaymentMethodIcon(method.paymentMethod)}
                            <CardTitle className="text-lg">
                              {getPaymentMethodLabel(method.paymentMethod)}
                            </CardTitle>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="opacity-0 transition-opacity group-hover:opacity-100">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  router.push(`/dashboard/payment-methods/${method.id}`)
                                }>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  router.push(`/dashboard/payment-methods/${method.id}/edit`)
                                }>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleToggleStatus(method.id, method.status)}
                                disabled={togglingIds.includes(method.id)}>
                                {method.status === 'ACTIVE' ? (
                                  <>
                                    <ToggleLeft className="mr-2 h-4 w-4" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <ToggleRight className="mr-2 h-4 w-4" />
                                    Activate
                                  </>
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <CardDescription className="flex items-center justify-between">
                          <span>{method.orderCount} orders processed</span>
                          {getStatusBadge(method.status)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-2 text-sm">
                          {method.accountName && (
                            <div>
                              <span className="text-muted-foreground">Account:</span>
                              <p className="font-medium">{method.accountName}</p>
                            </div>
                          )}
                          {method.bankName && (
                            <div>
                              <span className="text-muted-foreground">Bank:</span>
                              <p className="font-medium">{method.bankName}</p>
                            </div>
                          )}
                          {method.accountNumber && (
                            <div>
                              <span className="text-muted-foreground">Account Number:</span>
                              <p className="font-mono text-xs">{method.accountNumber}</p>
                            </div>
                          )}
                          {method.virtualAccountNumber && (
                            <div>
                              <span className="text-muted-foreground">Virtual Account:</span>
                              <p className="font-mono text-xs">{method.virtualAccountNumber}</p>
                            </div>
                          )}
                          {method.phoneNumber && (
                            <div>
                              <span className="text-muted-foreground">Phone:</span>
                              <p className="font-medium">{method.phoneNumber}</p>
                            </div>
                          )}
                          {method.instructions && (
                            <div>
                              <span className="text-muted-foreground">Instructions:</span>
                              <p className="line-clamp-2 text-xs">{method.instructions}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="bg-muted/50 border-t px-6 py-3">
                        <div className="flex w-full items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {method.paymentMethod}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/dashboard/payment-methods/${method.id}`)}>
                            View Details
                          </Button>
                        </div>
                      </CardFooter>
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
