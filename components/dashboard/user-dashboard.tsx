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
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

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
import type { NormalUser } from '@/types/auth';

interface UserDashboardProps {
  user: NormalUser;
}

export function UserDashboard({ user }: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState('orders');

  // Mock data
  const orders = [
    {
      id: 'ORD-1234',
      item: 'iPhone 12 Pro',
      issue: 'Screen replacement',
      status: 'in-progress',
      technician: {
        name: 'David Wilson',
        image: '/technicians/1.png',
      },
      price: 120,
      progress: 65,
      date: '2023-05-15',
    },
    {
      id: 'ORD-1235',
      item: 'MacBook Air',
      issue: 'Battery replacement',
      status: 'pending',
      technician: {
        name: 'Maria Rodriguez',
        image: '/technicians/2.png',
      },
      price: 150,
      progress: 20,
      date: '2023-05-18',
    },
    {
      id: 'ORD-1236',
      item: 'Samsung TV',
      issue: 'No power',
      status: 'completed',
      technician: {
        name: 'James Lee',
        image: '/technicians/3.png',
      },
      price: 85,
      progress: 100,
      date: '2023-05-10',
    },
  ];

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

  const reviews = [
    {
      id: 'REV-1',
      technician: {
        name: 'David Wilson',
        image: '/placeholder.svg?height=40&width=40',
      },
      rating: 5,
      comment: 'Excellent service! Fixed my iPhone screen in just an hour.',
      date: '2023-05-01',
    },
    {
      id: 'REV-2',
      technician: {
        name: 'Maria Rodriguez',
        image: '/placeholder.svg?height=40&width=40',
      },
      rating: 4,
      comment: 'Good service but took a bit longer than expected.',
      date: '2023-04-15',
    },
  ];

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-blue-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

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
            <Button className="w-full gap-2">
              <Plus className="h-4 w-4" />
              <span>New Request</span>
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
              You have {orders.filter((o) => o.status !== 'completed').length} active repair orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {orders
                .filter((o) => o.status !== 'completed')
                .slice(0, 2)
                .map((order) => (
                  <div key={order.id} className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${getStatusColor(order.status)}`} />
                    <span className="flex-1 truncate text-sm">{order.item}</span>
                    <Badge variant="outline">{order.status}</Badge>
                  </div>
                ))}
            </div>
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
                        <CardTitle className="text-lg">{order.item}</CardTitle>
                        <Badge
                          variant={
                            order.status === 'completed'
                              ? 'default'
                              : order.status === 'in-progress'
                                ? 'secondary'
                                : 'outline'
                          }>
                          {order.status === 'in-progress'
                            ? 'In Progress'
                            : order.status === 'completed'
                              ? 'Completed'
                              : 'Pending'}
                        </Badge>
                      </div>
                      <CardDescription>{order.issue}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="mb-4 flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={order.technician.image || '/placeholder.svg'}
                            alt={order.technician.name}
                          />
                          <AvatarFallback>{order.technician.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{order.technician.name}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{order.progress}%</span>
                        </div>
                        <Progress value={order.progress} className="h-2" />
                      </div>
                    </CardContent>
                    <CardFooter className="bg-muted/50 flex items-center justify-between border-t px-6 py-3">
                      <div className="text-muted-foreground flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4" />
                        <span>{order.date}</span>
                      </div>
                      <div className="font-medium">${order.price}</div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
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
              {reviews.map((review) => (
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
                            src={review.technician.image || '/placeholder.svg'}
                            alt={review.technician.name}
                          />
                          <AvatarFallback>{review.technician.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base">{review.technician.name}</CardTitle>
                          <div className="flex text-yellow-500">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'text-muted'}`}
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
                      <span className="text-muted-foreground text-xs">{review.date}</span>
                      <Button variant="ghost" size="sm">
                        Edit Review
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
              <Card className="flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-primary/10 mb-4 rounded-full p-3">
                  <Star className="text-primary h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-medium">Leave a Review</h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  Share your experience with our technicians and help others find the best service.
                </p>
                <Button variant="outline" size="sm">
                  Write Review
                </Button>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
