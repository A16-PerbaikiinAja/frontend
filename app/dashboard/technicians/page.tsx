'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  Eye,
  MoreHorizontal,
  PlusCircle,
  RefreshCw,
  Search,
  Star,
  Users,
  Wrench,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { EmptyState } from '@/components/dashboard/empty-state';
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

interface TechnicianRating {
  technicianId: string;
  fullName: string;
  profilePhoto?: string;
  specialization?: string;
  experience?: number;
  averageRating?: number;
  totalReviews?: number;
}

export default function TechniciansPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [technicians, setTechnicians] = useState<TechnicianRating[]>([]);
  const [filteredTechnicians, setFilteredTechnicians] = useState<TechnicianRating[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'ADMIN') {
        router.push('/dashboard');
        toast.error('Access Denied', {
          description: 'Only administrators can access the technicians page.',
        });
      } else {
        loadTechnicians();
      }
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!technicians.length) return;

    let filtered = [...technicians];

    if (activeTab !== 'all') {
      if (activeTab === 'experienced') {
        filtered = filtered.filter((tech) => (tech.experience || 0) >= 3);
      } else if (activeTab === 'top-rated') {
        filtered = filtered.filter((tech) => (tech.averageRating || 0) >= 4.5);
      } else if (activeTab === 'new') {
        filtered = filtered.filter((tech) => (tech.experience || 0) < 2);
      }
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (tech) =>
          tech.fullName.toLowerCase().includes(query) ||
          (tech.specialization && tech.specialization.toLowerCase().includes(query)),
      );
    }

    filtered.sort((a, b) => {
      const ratingA = a.averageRating || 0;
      const ratingB = b.averageRating || 0;
      if (ratingB !== ratingA) {
        return ratingB - ratingA;
      }
      return a.fullName.localeCompare(b.fullName);
    });

    setFilteredTechnicians(filtered);
  }, [technicians, searchQuery, activeTab]);

  const loadTechnicians = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_REVIEW_API_URL}/technician-ratings`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch technicians');
      }

      const data = await response.json();
      setTechnicians(data);
    } catch (err) {
      console.error('Failed to fetch technicians:', err);
      setError('Failed to load technicians. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshTechnicians = async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_REVIEW_API_URL}/technician-ratings`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to refresh technicians');
      }

      const data = await response.json();
      setTechnicians(data);
      toast.success('Technicians refreshed', {
        description: 'The technician list has been updated.',
      });
    } catch (err) {
      console.error('Failed to refresh technicians:', err);
      toast.error('Refresh failed', {
        description: 'Could not refresh technicians. Please try again.',
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleViewTechnician = (technicianId: string) => {
    toast.info('View technician', {
      description: `Viewing details for technician ${technicianId}`,
    });
  };

  const handleEditTechnician = (technicianId: string) => {
    toast.info('Edit technician', {
      description: `Editing technician ${technicianId}`,
    });
  };

  const handleDeleteTechnician = (technicianId: string) => {
    toast.info('Delete technician', {
      description: `Deleting technician ${technicianId}`,
    });
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
          <h1 className="text-3xl font-bold tracking-tight">Technicians</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-8 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </DashboardLayout>
    );
  }

  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex items-center gap-3">
          <Users className="text-primary h-6 w-6" />
          <h1 className="text-3xl font-bold tracking-tight">Technicians</h1>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
            <Input
              placeholder="Search technicians..."
              className="pl-8 sm:w-[250px]"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={refreshTechnicians}
            disabled={isRefreshing || isLoading}>
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </Button>
          <Button className="gap-2" onClick={() => router.push('/dashboard/technicians/create')}>
            <PlusCircle className="h-4 w-4" />
            <span>Add Technician</span>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="experienced">Experienced</TabsTrigger>
          <TabsTrigger value="top-rated">Top Rated</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-16 w-full" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-8 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : error ? (
            <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center text-center">
                  <AlertTriangle className="mb-2 h-10 w-10 text-red-500" />
                  <h3 className="mb-1 text-lg font-medium">Error Loading Technicians</h3>
                  <p className="text-muted-foreground mb-4 text-sm">{error}</p>
                  <Button onClick={loadTechnicians}>Try Again</Button>
                </div>
              </CardContent>
            </Card>
          ) : filteredTechnicians.length === 0 ? (
            <EmptyState
              icon={Users}
              title={searchQuery ? 'No matching technicians' : 'No technicians found'}
              description={
                searchQuery
                  ? 'Try adjusting your search or filters'
                  : 'No technicians have been registered yet. Add the first technician to get started.'
              }
              action={
                searchQuery ? (
                  <Button variant="outline" onClick={() => setSearchQuery('')}>
                    Clear Search
                  </Button>
                ) : (
                  <Button onClick={() => router.push('/dashboard/technicians/create')}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add First Technician
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
                {filteredTechnicians.map((technician) => (
                  <motion.div
                    key={technician.technicianId}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout>
                    <Card className="group overflow-hidden py-0 transition-all hover:shadow-md">
                      <CardHeader className="pt-6 pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                              <AvatarImage
                                src={
                                  technician.profilePhoto || '/placeholder.svg?height=48&width=48'
                                }
                                alt={technician.fullName}
                              />
                              <AvatarFallback>{technician.fullName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg">{technician.fullName}</CardTitle>
                              <CardDescription>
                                {technician.specialization || 'General Technician'}
                              </CardDescription>
                            </div>
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
                                onClick={() => handleViewTechnician(technician.technicianId)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleEditTechnician(technician.technicianId)}>
                                <Wrench className="mr-2 h-4 w-4" />
                                Edit Profile
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteTechnician(technician.technicianId)}
                                className="text-destructive">
                                <AlertTriangle className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Experience:</span>
                            <span className="font-medium">
                              {technician.experience
                                ? `${technician.experience} years`
                                : 'Not specified'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Rating:</span>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">
                                {technician.averageRating
                                  ? technician.averageRating.toFixed(1)
                                  : 'No ratings'}
                              </span>
                              {technician.totalReviews && (
                                <span className="text-muted-foreground">
                                  ({technician.totalReviews})
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="bg-muted/50 border-t px-6 py-3 pb-6">
                        <div className="flex w-full items-center justify-between">
                          <div className="flex gap-1">
                            {(technician.experience || 0) >= 5 && (
                              <Badge variant="default" className="text-xs">
                                Expert
                              </Badge>
                            )}
                            {(technician.averageRating || 0) >= 4.5 && (
                              <Badge variant="secondary" className="text-xs">
                                Top Rated
                              </Badge>
                            )}
                            {(technician.experience || 0) < 2 && (
                              <Badge variant="outline" className="text-xs">
                                New
                              </Badge>
                            )}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewTechnician(technician.technicianId)}>
                            View Profile
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
