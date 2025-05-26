'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { 
  AlertCircle, 
  ArrowLeft, 
  User, 
  Star, 
  Package, 
  Calendar, 
  FileText, 
  Settings, 
  Loader2,
  Info,
  Check,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-provider';

interface Order {
  id: string;
  customerId: string;
  technicianId?: string | null;
  itemName: string;
  itemCondition: string;
  repairDetails: string;
  serviceDate: string;
  status: 'PENDING' | 'WAITING_APPROVAL' | string;
  paymentMethodId?: string;
  couponId?: string | null;
  estimatedCompletionTime?: string | null;
  estimatedPrice?: number | null;
  finalPrice?: number | null;
  createdAt: string;
  updatedAt: string;
  completedAt?: string | null;
}

interface Technician {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  imageUrl?: string;
}

export default function EditOrderPage() {
  const router = useRouter();
  const { orderId } = useParams();
  const { user, isLoading: authLoading } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [formData, setFormData] = useState<Partial<Order>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingTechnicians, setIsLoadingTechnicians] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) return void router.push('/login');
    if (user.role !== 'USER') {
      toast.error('Access denied');
      return void router.push('/dashboard');
    }

    fetchOrder();
    fetchTechnicians();
  }, [authLoading, user, orderId, router]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_ORDER_API_URL}/orders/${orderId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      if (!res.ok) throw new Error(`Status ${res.status}`);
      
      const data = await res.json() as Order;

      if (!['PENDING','WAITING_APPROVAL'].includes(data.status)) {
        toast.error('Order cannot be edited at this stage.');
        return void router.push(`/dashboard/orders/`);
      }

      setOrder(data);
      
      const existingTechnicianId = data.technicianId?.trim();
      
      setFormData({
        technicianId: existingTechnicianId || '',
        itemName: data.itemName,
        itemCondition: data.itemCondition,
        repairDetails: data.repairDetails,
        serviceDate: data.serviceDate.slice(0,10),
        paymentMethodId: data.paymentMethodId,
        couponId: data.couponId,
      });
    } catch (e) {
      setError('Failed to load order.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTechnicians = async () => {
    setIsLoadingTechnicians(true);
    try {
      const reviewApiUrl = `${process.env.NEXT_PUBLIC_REVIEW_API_URL}/technician-ratings`;
      const response = await fetch(reviewApiUrl);

      if (!response.ok) {
        throw new Error('Failed to fetch technicians.');
      }

      const techniciansData = await response.json();
      const formattedTechnicians = techniciansData.map((technician: any) => ({
        id: technician.technicianId,
        name: technician.fullName,
        specialty: technician.specialization || 'General Technician',
        rating: technician.averageRating || 0,
        reviews: technician.totalReviews || 0,
        imageUrl: technician.profilePhoto,
      }));

      setTechnicians(formattedTechnicians);
    } catch (error) {
      toast.error('Failed to load technicians', {
        description: 'Please try again later.',
      });
    } finally {
      setIsLoadingTechnicians(false);
    }
  };

  const handleTechnicianSelect = (technicianId: string) => {
    setFormData(f => ({ ...f, technicianId }));
  };

  const handleSave = async () => {
    if (!formData.technicianId || formData.technicianId.trim() === '') {
      toast.error('Please select a technician');
      return;
    }

    setIsSaving(true);
    try {
      const updatePayload = {
        itemName: formData.itemName,
        itemCondition: formData.itemCondition,
        repairDetails: formData.repairDetails,
        technicianId: formData.technicianId.trim(),
        serviceDate: formData.serviceDate ? formData.serviceDate : null,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_ORDER_API_URL}/orders/${orderId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatePayload),
        }
      );
      
      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(`Status ${res.status}`);
      }
      
      toast.success('Order updated successfully');
      router.push('/dashboard/orders');
    } catch (e) {
      toast.error('Failed to update order.');
    } finally {
      setIsSaving(false);
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 },
    },
  };

  if (authLoading || isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6 px-6">

          <div className="flex items-center space-x-2">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-8 w-48" />
          </div>
          
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
              
              <div className="space-y-3">
                <Skeleton className="h-4 w-32" />
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="flex items-center gap-4 p-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                      <Skeleton className="h-6 w-16" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !order) {
    return (
      <DashboardLayout>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg mx-auto">
          <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30">
            <CardContent className="py-10 flex flex-col items-center text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-red-600 mb-2">
                {error ?? 'Order not found'}
              </h3>
              <p className="text-red-600/80 mb-6">
                The order you're trying to edit is not available or cannot be modified.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => router.push('/dashboard/orders')}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Orders
                </Button>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div
        className="max-w-4xl mx-auto space-y-6 px-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}>

        {/* Header */}
        <motion.div 
          className="flex items-center gap-3"
          variants={itemVariants}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/dashboard/orders')}
            aria-label="Back to Order History"
            className="hover:bg-muted/50">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <Settings className="text-primary h-6 w-6" />
            <h1 className="text-3xl font-bold tracking-tight">Edit Order</h1>
          </div>
        </motion.div>

        {/* Order Info */}
        <motion.div variants={itemVariants}>
          <Card className="border-blue-200 bg-blue-50/30 dark:border-blue-900 dark:bg-blue-950/30">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500 text-white p-2 rounded-full">
                  <Package className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">Editing Order</p>
                  <p className="text-sm text-muted-foreground">
                    {order.id}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <Badge variant="outline">{order.status}</Badge>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Form */}
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Order Details
              </CardTitle>
              <CardDescription>
                Update your order information.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              {/* Item Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <Package className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Item Information</h3>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="itemName" className="text-sm font-medium">
                      Item Name
                    </Label>
                    <Input
                      id="itemName"
                      value={formData.itemName || ''}
                      onChange={e => setFormData(f => ({ ...f, itemName: e.target.value }))}
                      placeholder="e.g., iPhone 13, MacBook Pro, etc."
                      className="transition-all focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="serviceDate" className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Service Date
                    </Label>
                    <Input
                      id="serviceDate"
                      type="date"
                      value={formData.serviceDate || ''}
                      onChange={e => setFormData(f => ({ ...f, serviceDate: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                      className="transition-all focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="itemCondition" className="text-sm font-medium flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Item Condition
                  </Label>
                  <Textarea
                    id="itemCondition"
                    value={formData.itemCondition || ''}
                    onChange={e => setFormData(f => ({ ...f, itemCondition: e.target.value }))}
                    placeholder="Describe the current condition and any visible damage..."
                    rows={3}
                    className="resize-none transition-all focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="repairDetails" className="text-sm font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Repair Details
                  </Label>
                  <Textarea
                    id="repairDetails"
                    value={formData.repairDetails || ''}
                    onChange={e => setFormData(f => ({ ...f, repairDetails: e.target.value }))}
                    placeholder="Describe what needs to be repaired and your expected outcome..."
                    rows={4}
                    className="resize-none transition-all focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              
              {/* Technician selection */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <User className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Technician Selection</h3>
                </div>
                
                {isLoadingTechnicians ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Card key={i}>
                        <CardContent className="flex items-center gap-4 p-4">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-48" />
                          </div>
                          <Skeleton className="h-6 w-16" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Available technicians */}
                    {technicians.map((technician) => (
                      <motion.div
                        key={technician.id}
                        whileHover={{ scale: 1.005 }}
                        whileTap={{ scale: 0.995 }}>
                        <Card
                          className={`cursor-pointer transition-all ${
                            formData.technicianId === technician.id
                              ? 'border-primary ring-primary ring-1 bg-primary/5'
                              : 'hover:border-muted-foreground/50 hover:bg-muted/30'
                          }`}
                          onClick={() => handleTechnicianSelect(technician.id)}
                        >
                          <CardContent className="flex items-center gap-4 p-4">
                            <Avatar className="h-12 w-12 border-2 border-muted">
                              <AvatarImage
                                src={technician.imageUrl || '/placeholder.svg'}
                                alt={technician.name}
                              />
                              <AvatarFallback>{technician.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium">{technician.name}</h4>
                                  <p className="text-muted-foreground text-sm">
                                    {technician.specialty}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="font-medium text-sm">
                                      {technician.rating.toFixed(1)}
                                    </span>
                                    <span className="text-muted-foreground text-xs">
                                      ({technician.reviews})
                                    </span>
                                  </div>
                                  <Badge variant="outline" className="mt-1 text-xs">
                                    Available
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            {formData.technicianId === technician.id && (
                              <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={2}
                                  stroke="currentColor"
                                  className="h-4 w-4">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4.5 12.75l6 6 9-13.5"
                                  />
                                </svg>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}

                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
                  <p className="text-sm text-blue-700 dark:text-blue-300 flex items-start gap-2">
                    <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    Please select a technician to handle your repair. Choose based on their expertise, rating, and availability.
                  </p>
                </div>
              </div>
            </CardContent>

            {/* Action Buttons */}
            <CardContent className="bg-muted/30 border-t p-6">
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={() => router.push('/dashboard/orders')}
                  disabled={isSaving}
                  className="flex items-center gap-2">
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="flex items-center gap-2 min-w-[140px]">
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}