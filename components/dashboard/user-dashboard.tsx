'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  Clock,
  FileText,
  Plus,
  Star,
  Tag,
  PenToolIcon as Tool,
  Wrench,
  Trash2,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { format, parseISO } from 'date-fns';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import type { NormalUser } from '@/types/auth';

interface UserDashboardProps {
  user: NormalUser;
}

interface Order {
  id: string;
  customerId: string;
  technicianId?: string | null;
  itemName: string;
  itemCondition: string;
  repairDetails: string;
  serviceDate: string;
  status: 'PENDING' | 'WAITING_APPROVAL' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED' | 'CANCELLED';
  paymentMethodId?: string | null;
  couponId?: string | null;
  estimatedCompletionTime?: string | null;
  estimatedPrice?: number | null;
  finalPrice?: number | null;
  createdAt: string;
  updatedAt: string;
  completedAt?: string | null;
}

interface OrderListResponse {
  orders: Order[];
  count: number;
}

export function UserDashboard({ user }: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState('orders');
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  const coupons = [
    {
      id: 'COUPON-1',
      code: 'REPAIR20',
      discount: '20%',
      validUntil: '2023-06-30',
      description: '20% off on any repair service',
    },
    {
      id: 'COUPON-2',
      code: 'WELCOME10',
      discount: '10%',
      validUntil: '2023-12-31',
      description: '10% off for new customers',
    },
  ];

  const [userReviews, setUserReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [deletingIds, setDeletingIds] = useState<string[]>([]);
  const router = useRouter();

  const fetchOrders = async () => {
    setIsLoadingOrders(true);
    setOrdersError(null);
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
      
      console.log('Orders API Response:', data);
      
      setOrders(data.orders || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setOrdersError('Failed to load orders. Please try again.');
      toast.error('Failed to load orders');
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchUserReviews();
  }, []);

  const fetchUserReviews = async () => {
    setLoadingReviews(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_REVIEW_API_URL}/review/user`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch reviews');
      const data = await res.json();
      setUserReviews(data);
    } catch (err) {
      toast.error('Failed fetching reviews');
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    setDeletingIds((prev) => [...prev, id]);
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_REVIEW_API_URL}/review/${id}`;
      const res = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!res.ok) throw new Error('Failed deleting review');
      setUserReviews((prev) => prev.filter((review) => review.id !== id));
      toast.success('Review deleted!');
    } catch (err: any) {
      toast.error('Failed deleting review');
    } finally {
      setDeletingIds((prev) => prev.filter((delId) => delId !== id));
    }
  };

  const goToEdit = (id: string) => {
    router.push(`/dashboard/reviews/edit/${id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-500';
      case 'WAITING_APPROVAL':
        return 'bg-orange-500';
      case 'IN_PROGRESS':
        return 'bg-blue-500';
      case 'COMPLETED':
        return 'bg-green-500';
      case 'REJECTED':
        return 'bg-red-600';
      case 'CANCELLED':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'outline';
      case 'WAITING_APPROVAL':
          return 'outline';
      case 'APPROVED':
        return 'default';
      case 'IN_PROGRESS':
        return 'secondary';
      case 'COMPLETED':
        return 'default';
      case 'REJECTED':
        return 'destructive';
      case 'CANCELLED':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Pending';
      case 'WAITING_APPROVAL':
        return 'Waiting Approval';
      case 'APPROVED':
        return 'Approved';
      case 'IN_PROGRESS':
        return 'In Progress';
      case 'COMPLETED':
        return 'Completed';
      case 'REJECTED':
        return 'Rejected';
      case 'CANCELLED':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const getProgress = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 10;
      case 'WAITING_APPROVAL':
        return 25;
      case 'APPROVED':
        return 40;
      case 'IN_PROGRESS':
        return 70;
      case 'COMPLETED':
        return 100;
      case 'REJECTED':
        return 0;
      case 'CANCELLED':
        return 0;
      default:
        return 5;
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const activeOrders = orders.filter((o) => 
    !['COMPLETED', 'CANCELLED'].includes(o.status)
  );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="space-y-6">
      <motion.div variants={fadeInUp}>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.fullName}</h1>
        <p className="text-muted-foreground">
          Here's an overview of your repair orders and available services.
        </p>
      </motion.div>

      <motion.div variants={fadeInUp} className="grid gap-4 md:grid-cols-3">
        <Card className="overflow-hidden pt-0">
          <CardHeader className="bg-primary text-primary-foreground pt-6 pb-3">
            <CardTitle className="flex items-center gap-2">
              <Tool className="h-5 w-5" />
              <span>Place New Repair Request</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-muted-foreground mb-4">
              Need something fixed? Submit a new repair request and get matched with a skilled
              technician.
            </p>
            <Button className="w-full gap-2" asChild>
              <Link href="/dashboard/orders/create">
                <Plus className="h-4 w-4" />
                New Request
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              <span>Active Orders</span>
            </CardTitle>
            <CardDescription>
              {isLoadingOrders ? (
                <Skeleton className="h-4 w-32" />
              ) : (
                `You have ${activeOrders.length} active repair orders`
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingOrders ? (
              <div className="space-y-2">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="h-2 w-2 rounded-full" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                ))}
              </div>
            ) : ordersError ? (
              <div className="flex items-center gap-2 text-red-500">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">Failed to load</span>
              </div>
            ) : (
              <div className="space-y-2">
                {activeOrders.slice(0, 2).map((order) => (
                  <div key={order.id} className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${getStatusColor(order.status)}`} />
                    <span className="flex-1 truncate text-sm">{order.itemName}</span>
                    <Badge variant={getStatusBadgeVariant(order.status)}>
                      {getStatusLabel(order.status)}
                    </Badge>
                  </div>
                ))}
                {activeOrders.length === 0 && (
                  <p className="text-sm text-muted-foreground">No active orders</p>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full gap-1" asChild>
              <Link href="/dashboard/orders">
                View all orders
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              <span>Available Coupons</span>
            </CardTitle>
            <CardDescription>You have {coupons.length} coupons available</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {coupons.slice(0, 2).map((coupon) => (
                <div key={coupon.id} className="rounded-md border p-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{coupon.discount} OFF</Badge>
                    <span className="text-muted-foreground text-xs">
                      Valid until {coupon.validUntil}
                    </span>
                  </div>
                  <div className="mt-1 font-mono text-sm">{coupon.code}</div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full gap-1" asChild>
              <Link href="/dashboard/coupons">
                View all coupons
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      <motion.div variants={fadeInUp}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Repair Orders</span>
              <span className="sm:hidden">Orders</span>
            </TabsTrigger>
            <TabsTrigger value="coupons" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              <span className="hidden sm:inline">Available Coupons</span>
              <span className="sm:hidden">Coupons</span>
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              <span className="hidden sm:inline">Your Reviews</span>
              <span className="sm:hidden">Reviews</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Your Repair Orders</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchOrders}
                disabled={isLoadingOrders}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingOrders ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {isLoadingOrders ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                      <Skeleton className="h-4 w-32" />
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="mb-4 flex items-center gap-2">
                        <Skeleton className="h-6 w-6 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-3 w-16" />
                          <Skeleton className="h-3 w-8" />
                        </div>
                        <Skeleton className="h-2 w-full" />
                      </div>
                    </CardContent>
                    <CardFooter className="bg-muted/50 border-t px-6 py-3">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-12 ml-auto" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : ordersError ? (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center text-center">
                    <AlertCircle className="mb-2 h-10 w-10 text-red-500" />
                    <h3 className="mb-1 text-lg font-medium">Error Loading Orders</h3>
                    <p className="text-sm mb-4">{ordersError}</p>
                    <Button onClick={fetchOrders}>Try Again</Button>
                  </div>
                </CardContent>
              </Card>
            ) : orders.length === 0 ? (
              <Card className="flex flex-col items-center justify-center p-12 text-center">
                <div className="bg-primary/10 mb-4 rounded-full p-3">
                  <Wrench className="text-primary h-8 w-8" />
                </div>
                <h3 className="mb-2 text-xl font-medium">No Orders Yet</h3>
                <p className="text-muted-foreground mb-6 text-sm">
                  Start your first repair request to see your orders here.
                </p>
                <Button asChild>
                  <Link href="/dashboard/orders/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Order
                  </Link>
                </Button>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {orders.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="group">
                    <Card className="overflow-hidden transition-all hover:shadow-md">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{order.itemName}</CardTitle>
                          <Badge variant={getStatusBadgeVariant(order.status)}>
                            {getStatusLabel(order.status)}
                          </Badge>
                        </div>
                        <CardDescription>{order.repairDetails}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="mb-4 flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src="/placeholder.svg"
                              alt="Technician"
                            />
                            <AvatarFallback>T</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">
                            {order.technicianId ? 
                              `Technician ID: ${order.technicianId.slice(-8)}` : 
                              'Assigning technician...'
                            }
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{getProgress(order.status)}%</span>
                          </div>
                          <Progress value={getProgress(order.status)} className="h-2" />
                        </div>
                      </CardContent>
                      <CardFooter className="bg-muted/50 flex items-center justify-between border-t px-6 py-3">
                        <div className="text-muted-foreground flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4" />
                          <span>
                            {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                          </span>
                        </div>
                        <div className="font-medium">
                          {order.finalPrice ? 
                            new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: 'USD'
                            }).format(order.finalPrice) : 
                            order.estimatedPrice ? 
                              new Intl.NumberFormat('en-US', {
                                style: 'currency', 
                                currency: 'USD'
                              }).format(order.estimatedPrice) : 
                              'Pending'
                          }
                        </div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
            
            <div className="flex justify-center">
              <Button variant="outline" asChild>
                <Link href="/dashboard/orders">View All Orders</Link>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="coupons" className="mt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {coupons.map((coupon) => (
                <motion.div
                  key={coupon.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="group">
                  <Card className="overflow-hidden transition-all hover:shadow-md">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="px-3 py-1">
                          {coupon.discount} OFF
                        </Badge>
                        <span className="text-muted-foreground text-xs">
                          Valid until {coupon.validUntil}
                        </span>
                      </div>
                      <CardDescription>{coupon.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="bg-muted/50 flex items-center justify-between rounded-md border p-3">
                        <span className="text-muted-foreground text-sm">Coupon Code</span>
                        <span className="font-mono font-medium">{coupon.code}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-muted/50 border-t px-6 py-3">
                      <Button variant="ghost" size="sm" className="ml-auto">
                        Copy Code
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
              <Card className="flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-primary/10 mb-4 rounded-full p-3">
                  <Tag className="text-primary h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-medium">Get More Coupons</h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  Complete repairs and earn special discounts for future services.
                </p>
                <Button variant="outline" size="sm">
                  Learn More
                </Button>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {loadingReviews ? (
                <div className="col-span-full flex min-h-[100px] items-center justify-center">
                  Loading reviews...
                </div>
              ) : userReviews.length === 0 ? (
                <div className="text-muted-foreground col-span-full text-center">
                  You have no reviews yet.
                </div>
              ) : (
                userReviews.map((review) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="group">
                    <Card className="overflow-hidden transition-all hover:shadow-md">
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={'/placeholder.svg?height=40&width=40'}
                              alt={review.technicianFullName}
                            />
                            <AvatarFallback>{review.technicianFullName?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-base">{review.technicianFullName}</CardTitle>
                            <div className="flex text-yellow-500">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating ? 'fill-current' : 'text-muted'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm">{review.comment}</p>
                      </CardContent>
                      <CardFooter className="bg-muted/50 flex items-center justify-between border-t px-6 py-3">
                        <span className="text-muted-foreground text-xs">
                          {review.createdAt
                            ? new Date(review.createdAt).toLocaleDateString('id-ID', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })
                            : ''}
                        </span>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => goToEdit(review.id)}>
                            Edit Review
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(review.id)}
                            disabled={deletingIds.includes(review.id)}
                            aria-label="Delete review">
                            <Trash2 className="mr-2 h-4 w-4" />
                            {deletingIds.includes(review.id) ? 'Deleting...' : 'Delete'}
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))
              )}
              <Card className="flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-primary/10 mb-4 rounded-full p-3">
                  <Star className="text-primary h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-medium">Leave a Review</h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  Share your experience with our technicians and help others find the best service.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/reviews/create">Write a Review</Link>
                </Button>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}