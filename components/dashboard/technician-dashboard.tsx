'use client';

import { motion } from 'framer-motion';
import {
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  MessageSquare,
  Star,
  PenToolIcon as Tool,
  Wrench,
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

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
import type { Technician } from '@/types/auth';

interface TechnicianDashboardProps {
  user: Technician;
}

export function TechnicianDashboard({ user }: TechnicianDashboardProps) {
  const [activeTab, setActiveTab] = useState('requests');

  // Mock data
  const incomingRequests = [
    {
      id: 'REQ-1234',
      customer: {
        name: 'John Smith',
        image: '/placeholder.svg?height=40&width=40',
      },
      item: 'iPhone 12 Pro',
      issue: 'Screen replacement',
      status: 'pending',
      date: '2023-05-20',
    },
    {
      id: 'REQ-1235',
      customer: {
        name: 'Emily Johnson',
        image: '/placeholder.svg?height=40&width=40',
      },
      item: 'Dell XPS Laptop',
      issue: 'Battery not charging',
      status: 'pending',
      date: '2023-05-19',
    },
    {
      id: 'REQ-1236',
      customer: {
        name: 'Michael Brown',
        image: '/placeholder.svg?height=40&width=40',
      },
      item: 'Samsung TV',
      issue: 'No sound',
      status: 'pending',
      date: '2023-05-18',
    },
  ];

  const jobsInProgress = [
    {
      id: 'JOB-1234',
      customer: {
        name: 'Sarah Wilson',
        image: '/placeholder.svg?height=40&width=40',
      },
      item: 'MacBook Pro',
      issue: 'Keyboard replacement',
      progress: 75,
      estimatedCompletion: '2023-05-22',
      price: 180,
    },
    {
      id: 'JOB-1235',
      customer: {
        name: 'Robert Davis',
        image: '/placeholder.svg?height=40&width=40',
      },
      item: 'Samsung Galaxy S21',
      issue: 'Battery replacement',
      progress: 40,
      estimatedCompletion: '2023-05-23',
      price: 90,
    },
  ];

  const completedJobs = [
    {
      id: 'JOB-1230',
      customer: {
        name: 'Jennifer Lee',
        image: '/placeholder.svg?height=40&width=40',
      },
      item: 'iPad Pro',
      issue: 'Screen replacement',
      completionDate: '2023-05-15',
      price: 220,
      rating: 5,
    },
    {
      id: 'JOB-1231',
      customer: {
        name: 'David Miller',
        image: '/placeholder.svg?height=40&width=40',
      },
      item: 'HP Printer',
      issue: 'Paper jam fix',
      completionDate: '2023-05-14',
      price: 60,
      rating: 4,
    },
  ];

  const stats = {
    totalJobsCompleted: user.totalJobsCompleted,
    totalEarnings: user.totalEarnings,
    pendingRequests: incomingRequests.length,
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

  const [technicianRating, setTechnicianRating] = useState<{
    averageRating: number;
    totalReviews: number;
  } | null>(null);
  const [loadingRating, setLoadingRating] = useState(true);
  const [errorRating, setErrorRating] = useState<string | null>(null);

  useEffect(() => {
    const fetchRating = async () => {
      setLoadingRating(true);
      setErrorRating(null);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_REVIEW_API_URL}/technician-ratings/${user.id}`,
        );
        if (!res.ok) throw new Error('Gagal fetch rating');
        const data = await res.json();
        setTechnicianRating({
          averageRating: data.averageRating,
          totalReviews: data.totalReviews,
        });
      } catch (err: any) {
        setTechnicianRating(null);
        setErrorRating(err instanceof Error ? err.message : 'Gagal fetch rating');
      } finally {
        setLoadingRating(false);
      }
    };
    if (user?.id) fetchRating();
  }, [user?.id]);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="space-y-6">
      <motion.div variants={fadeInUp}>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.fullName}</h1>
        <p className="text-muted-foreground">
          Here's an overview of your repair jobs and incoming requests.
        </p>
      </motion.div>

      <motion.div variants={fadeInUp} className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">Total Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckCircle className="text-primary mr-2 h-5 w-5" />
              <div className="text-2xl font-bold">{stats.totalJobsCompleted}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Total Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="text-primary mr-2 h-5 w-5" />
              <div className="text-2xl font-bold">${stats.totalEarnings}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Average Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-start">
              <div className="flex items-center">
                <Star className="mr-2 h-5 w-5 fill-current text-yellow-500" />
                <div className="text-2xl font-bold">
                  {loadingRating
                    ? '...'
                    : technicianRating
                      ? technicianRating.averageRating.toFixed(2)
                      : 'N/A'}
                </div>
              </div>
              <div className="ml-7 text-xs text-gray-500">
                {loadingRating
                  ? ''
                  : technicianRating
                    ? `${technicianRating.totalReviews} reviews`
                    : errorRating
                      ? errorRating
                      : ''}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Pending Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="text-primary mr-2 h-5 w-5" />
              <div className="text-2xl font-bold">{stats.pendingRequests}</div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={fadeInUp}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="requests" className="flex items-center gap-2">
              <Tool className="h-4 w-4" />
              <span className="hidden sm:inline">Incoming Requests</span>
              <span className="sm:hidden">Requests</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              <span className="hidden sm:inline">Jobs In Progress</span>
              <span className="sm:hidden">In Progress</span>
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Completed Jobs</span>
              <span className="sm:hidden">Completed</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="mt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {incomingRequests.map((request) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="group">
                  <Card className="overflow-hidden transition-all hover:shadow-md">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{request.item}</CardTitle>
                        <Badge variant="outline">New Request</Badge>
                      </div>
                      <CardDescription>{request.issue}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="mb-4 flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={request.customer.image || '/placeholder.svg'}
                            alt={request.customer.name}
                          />
                          <AvatarFallback>{request.customer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{request.customer.name}</span>
                      </div>
                      <div className="text-muted-foreground flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>Requested on {request.date}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-muted/50 flex items-center justify-between border-t px-6 py-3">
                      <Button variant="outline" size="sm">
                        Decline
                      </Button>
                      <Button size="sm">Accept & Provide Estimate</Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
            <div className="flex justify-center">
              <Button variant="outline" asChild>
                <Link href="/dashboard/requests">View All Requests</Link>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="progress" className="mt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {jobsInProgress.map((job) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="group">
                  <Card className="overflow-hidden transition-all hover:shadow-md">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{job.item}</CardTitle>
                        <Badge variant="secondary">In Progress</Badge>
                      </div>
                      <CardDescription>{job.issue}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="mb-4 flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={job.customer.image || '/placeholder.svg'}
                            alt={job.customer.name}
                          />
                          <AvatarFallback>{job.customer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{job.customer.name}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{job.progress}%</span>
                        </div>
                        <Progress value={job.progress} className="h-2" />
                      </div>
                      <div className="mt-4 flex items-center justify-between text-sm">
                        <div className="text-muted-foreground flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Est. completion: {job.estimatedCompletion}</span>
                        </div>
                        <div className="font-medium">${job.price}</div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-muted/50 flex items-center justify-between border-t px-6 py-3">
                      <Button variant="outline" size="sm" className="gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>Message</span>
                      </Button>
                      <Button size="sm">Update Progress</Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
            <div className="flex justify-center">
              <Button variant="outline" asChild>
                <Link href="/dashboard/jobs">View All Jobs</Link>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="completed" className="mt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {completedJobs.map((job) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="group">
                  <Card className="overflow-hidden transition-all hover:shadow-md">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{job.item}</CardTitle>
                        <Badge>Completed</Badge>
                      </div>
                      <CardDescription>{job.issue}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="mb-4 flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={job.customer.image || '/placeholder.svg'}
                            alt={job.customer.name}
                          />
                          <AvatarFallback>{job.customer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{job.customer.name}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="text-muted-foreground flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Completed on {job.completionDate}</span>
                        </div>
                        <div className="font-medium">${job.price}</div>
                      </div>
                      <div className="mt-2 flex items-center gap-1 text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < job.rating ? 'fill-current' : 'text-muted'}`}
                          />
                        ))}
                        <span className="text-muted-foreground ml-1 text-xs">Customer Rating</span>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-muted/50 flex items-center justify-between border-t px-6 py-3">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <FileText className="h-4 w-4" />
                        <span>Report</span>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
            <div className="flex justify-center">
              <Button variant="outline" asChild>
                <Link href="/dashboard/completed">View All Completed Jobs</Link>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      <motion.div variants={fadeInUp}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <span>Submit a Repair Report</span>
            </CardTitle>
            <CardDescription>
              Create a detailed report for completed repairs to maintain service quality records.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Select a completed job and provide details about the repair process, parts used, and
              any recommendations for the customer.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="gap-2">
              <FileText className="h-4 w-4" />
              <span>Create Report</span>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
}
