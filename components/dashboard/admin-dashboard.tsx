'use client';

import { motion } from 'framer-motion';
import {
  BarChart3,
  CreditCard,
  FileText,
  Plus,
  Search,
  Settings,
  Star,
  Tag,
  Trash2,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Admin } from '@/types/auth';

interface AdminDashboardProps {
  user: Admin;
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('technicians');

  // Mock data
  const technicians = [
    {
      id: 'TECH-1234',
      name: 'David Wilson',
      specialty: 'Electronics Repair',
      rating: 4.9,
      jobsCompleted: 243,
      earnings: 18500,
      image: '/placeholder.svg?height=40&width=40',
      status: 'active',
    },
    {
      id: 'TECH-1235',
      name: 'Maria Rodriguez',
      specialty: 'Appliance Repair',
      rating: 4.8,
      jobsCompleted: 187,
      earnings: 15200,
      image: '/placeholder.svg?height=40&width=40',
      status: 'active',
    },
    {
      id: 'TECH-1236',
      name: 'James Lee',
      specialty: 'Computer Repair',
      rating: 4.7,
      jobsCompleted: 156,
      earnings: 12800,
      image: '/placeholder.svg?height=40&width=40',
      status: 'inactive',
    },
  ];

  const [coupons, setCoupons] = useState([]);
  const [loadingCoupons, setLoadingCoupons] = useState(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_ORDER_API_URL}/coupons`);
        const data = await res.json();
        setCoupons(data.coupons);
      } catch (e) {
        console.error('Failed to fetch coupons');
      } finally {
        setLoadingCoupons(false);
      }
    };

    fetchCoupons();
  }, []);


  const reports = [
    {
      id: 'REP-1234',
      technician: 'David Wilson',
      customer: 'John Smith',
      item: 'iPhone 12 Pro',
      issue: 'Screen replacement',
      date: '2023-05-15',
      status: 'completed',
    },
    {
      id: 'REP-1235',
      technician: 'Maria Rodriguez',
      customer: 'Emily Johnson',
      item: 'Samsung Refrigerator',
      issue: 'Cooling issue',
      date: '2023-05-14',
      status: 'pending',
    },
    {
      id: 'REP-1236',
      technician: 'James Lee',
      customer: 'Michael Brown',
      item: 'Dell XPS Laptop',
      issue: 'Battery replacement',
      date: '2023-05-13',
      status: 'completed',
    },
  ];

  const paymentMethods = [
    {
      id: 'PAY-1',
      name: 'Credit Card',
      provider: 'Stripe',
      accountNumber: 'XXXX-XXXX-XXXX-4242',
      status: 'active',
    },
    {
      id: 'PAY-2',
      name: 'PayPal',
      provider: 'PayPal',
      accountNumber: 'admin@perbaikiinaja.com',
      status: 'active',
    },
    {
      id: 'PAY-3',
      name: 'Bank Transfer',
      provider: 'Bank Central Asia',
      accountNumber: '1234567890',
      status: 'active',
    },
  ];

  const stats = {
    totalTechnicians: technicians.length,
    activeTechnicians: technicians.filter((t) => t.status === 'active').length,
    totalCoupons: coupons.length,
    activeCoupons: coupons.filter((c) => c.status === 'active').length,
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

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="space-y-6">
      <motion.div variants={fadeInUp}>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage technicians, coupons, reports, and payment methods.
        </p>
      </motion.div>

      <motion.div variants={fadeInUp} className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Total Technicians
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="text-primary mr-2 h-5 w-5" />
              <div className="text-2xl font-bold">{stats.totalTechnicians}</div>
              <Badge variant="outline" className="ml-2">
                {stats.activeTechnicians} active
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Active Coupons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Tag className="text-primary mr-2 h-5 w-5" />
              <div className="text-2xl font-bold">{stats.activeCoupons}</div>
              <Badge variant="outline" className="ml-2">
                {stats.totalCoupons} total
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FileText className="text-primary mr-2 h-5 w-5" />
              <div className="text-2xl font-bold">{reports.length}</div>
              <Badge variant="outline" className="ml-2">
                {reports.filter((r) => r.status === 'pending').length} pending
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Payment Methods
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CreditCard className="text-primary mr-2 h-5 w-5" />
              <div className="text-2xl font-bold">{paymentMethods.length}</div>
              <Badge variant="outline" className="ml-2">
                {paymentMethods.filter((p) => p.status === 'active').length} active
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={fadeInUp}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="technicians" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Technicians</span>
            </TabsTrigger>
            <TabsTrigger value="coupons" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              <span className="hidden sm:inline">Coupons</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Reports</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Payment Methods</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="technicians" className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="relative w-64">
                <Input placeholder="Search technicians..." className="pl-8" />
                <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                <span>Add Technician</span>
              </Button>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Technician</TableHead>
                    <TableHead>Specialty</TableHead>
                    <TableHead className="text-center">Rating</TableHead>
                    <TableHead className="text-center">Jobs</TableHead>
                    <TableHead className="text-right">Earnings</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {technicians.map((tech) => (
                    <TableRow key={tech.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={tech.image || '/placeholder.svg'} alt={tech.name} />
                            <AvatarFallback>{tech.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{tech.name}</p>
                            <p className="text-muted-foreground text-xs">{tech.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{tech.specialty}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center">
                          <Star className="mr-1 h-4 w-4 fill-current text-yellow-500" />
                          <span>{tech.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{tech.jobsCompleted}</TableCell>
                      <TableCell className="text-right">${tech.earnings}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={tech.status === 'active' ? 'default' : 'secondary'}>
                          {tech.status === 'active' ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <BarChart3 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-center">
              <Button variant="outline" asChild>
                <Link href="/dashboard/technicians">Manage All Technicians</Link>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="coupons" className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="relative w-64">
                <Input placeholder="Search coupons..." className="pl-8" />
                <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
              </div>
              <Button asChild className="gap-2">
                <Link href="/dashboard/coupons/create">
                  <Plus className="h-4 w-4" />
                  <span>Create Coupon</span>
                </Link>
              </Button>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Valid Until</TableHead>
                    <TableHead className="text-center">Max Usage</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingCoupons ? (
                    <TableRow>
                      <TableCell colSpan={6}>Loading...</TableCell>
                    </TableRow>
                  ) : (
                    coupons.map((coupon) => {
                      const isValid =
                        new Date(coupon.end_date) > new Date();

                      return (
                        <TableRow key={coupon.id}>
                          <TableCell>
                            <p className="font-mono font-medium">{coupon.code}</p>
                          </TableCell>
                          <TableCell>
                            {coupon.couponType === 'PERCENTAGE'
                              ? `${coupon.discount_amount}%`
                              : `Rp${coupon.discount_amount.toLocaleString()}`}
                          </TableCell>
                          <TableCell>{new Date(coupon.end_date).toLocaleDateString()}</TableCell>
                          <TableCell className="text-center">
                            {coupon.max_usage}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant={isValid ? 'default' : 'secondary'}>
                              {isValid ? 'Valid' : 'Expired'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Settings className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive"
                                onClick={async () => {
                                  const confirmed = confirm(`Are you sure you want to delete coupon ${coupon.code}?`)
                                  if (!confirmed) return
                                  try {
                                    const res = await fetch(`${process.env.NEXT_PUBLIC_ORDER_API_URL}/coupons/${coupon.id}`, {
                                      method: 'DELETE',
                                      headers: {
                                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                                      },
                                    })
                                    if (!res.ok) throw new Error('Failed to delete')
                                    setCoupons(prev => prev.filter(c => c.id !== coupon.id))
                                  } catch (err) {
                                    console.error(err)
                                    alert('Failed to delete coupon')
                                  }
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>

              </Table>
            </div>
            <div className="flex justify-center">
              <Button variant="outline" asChild>
                <Link href="/dashboard/coupons">Manage All Coupons</Link>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="relative w-64">
                <Input placeholder="Search reports..." className="pl-8" />
                <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline">Filter</Button>
                <Button variant="outline">Export</Button>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Technician</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <p className="font-mono font-medium">{report.id}</p>
                      </TableCell>
                      <TableCell>{report.technician}</TableCell>
                      <TableCell>{report.customer}</TableCell>
                      <TableCell>
                        <div>
                          <p>{report.item}</p>
                          <p className="text-muted-foreground text-xs">{report.issue}</p>
                        </div>
                      </TableCell>
                      <TableCell>{report.date}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={report.status === 'completed' ? 'default' : 'secondary'}>
                          {report.status === 'completed' ? 'Completed' : 'Pending'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View Report
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-center">
              <Button variant="outline" asChild>
                <Link href="/dashboard/reports">View All Reports</Link>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="payments" className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Payment Methods Configuration</h3>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                <span>Add Payment Method</span>
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {paymentMethods.map((method) => (
                <Card key={method.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{method.name}</span>
                      <Badge variant={method.status === 'active' ? 'default' : 'secondary'}>
                        {method.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{method.provider}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted rounded-md p-3">
                      <p className="font-mono text-sm">{method.accountNumber}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
