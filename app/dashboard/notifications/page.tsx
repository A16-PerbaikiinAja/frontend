'use client';

import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Bell, CheckCircle, RefreshCw, Trash2 } from 'lucide-react';
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
import type { Notification } from '@/types/notifications';

export default function NotificationsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingIds, setDeletingIds] = useState<string[]>([]);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'USER') {
        router.push('/dashboard');
        toast.error('Access Denied', {
          description: 'Only users can access the notifications page.',
        });
      } else {
        loadNotifications();
      }
    }
  }, [user, authLoading, router]);

  const loadNotifications = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_ORDER_API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      setError('Failed to load notifications. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshNotifications = async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_ORDER_API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
      toast.success('Your notifications have been updated.');
    } catch (err) {
      toast.error('Could not refresh notifications. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    setDeletingIds((prev) => [...prev, id]);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_ORDER_API_URL}/notifications/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        method: 'DELETE',
      });
      setNotifications((prev) => prev.filter((notification) => notification.id !== id));
      toast.success('The notification has been removed.');
    } catch (err) {
      toast.error('Could not delete the notification. Please try again.');
    } finally {
      setDeletingIds((prev) => prev.filter((deletingId) => deletingId !== id));
    }
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
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
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
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="text-primary h-6 w-6" />
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={refreshNotifications}
          disabled={isRefreshing || isLoading}>
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
        </Button>
      </div>

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
              <AlertCircle className="mb-2 h-10 w-10 text-red-500" />
              <h3 className="mb-1 text-lg font-medium">Error Loading Notifications</h3>
              <p className="text-muted-foreground mb-4 text-sm">{error}</p>
              <Button onClick={loadNotifications}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="You don't have any notifications at the moment."
          action={
            <Button variant="outline" onClick={refreshNotifications} disabled={isRefreshing}>
              Check Again
            </Button>
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
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout>
                <Card
                  className={`group overflow-hidden py-0 transition-all hover:shadow-md ${
                    deletingIds.includes(notification.id) ? 'opacity-60' : ''
                  }`}>
                  <CardHeader className="pt-6 pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <CardTitle className="text-lg">{notification.title}</CardTitle>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={() => handleDeleteNotification(notification.id)}
                        disabled={deletingIds.includes(notification.id)}
                        aria-label="Delete notification">
                        <Trash2 className="text-muted-foreground hover:text-destructive h-4 w-4" />
                      </Button>
                    </div>
                    <CardDescription>
                      {format(new Date(notification.createdAt), "PPP 'at' p")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">{notification.message}</p>
                  </CardContent>
                  <CardFooter className="bg-muted/50 border-t px-6 py-3 pb-6">
                    <Button variant="outline" size="sm" asChild>
                      <a href="/dashboard">View Details</a>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </DashboardLayout>
  );
}
