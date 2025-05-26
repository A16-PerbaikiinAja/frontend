'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { AlertCircle, ArrowLeft, User, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
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
        return void router.push(`/dashboard/orders/${orderId}`);
      }

      setOrder(data);
      setFormData({
        technicianId: data.technicianId ?? '',
        itemName: data.itemName,
        itemCondition: data.itemCondition,
        repairDetails: data.repairDetails,
        serviceDate: data.serviceDate.slice(0,10),
        paymentMethodId: data.paymentMethodId,
        couponId: data.couponId,
      });
    } catch (e) {
      console.error(e);
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
      console.error('Failed to fetch technicians:', error);
      toast.error('Failed to load technicians', {
        description: 'Please try again later.',
      });
    } finally {
      setIsLoadingTechnicians(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatePayload = {
        itemName: formData.itemName,
        itemCondition: formData.itemCondition,
        repairDetails: formData.repairDetails,
        technicianId: formData.technicianId || null,
        serviceDate: formData.serviceDate ? new Date(formData.serviceDate).toISOString() : null,
      };

      console.log('Sending update payload:', updatePayload);

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
        console.error('Update failed:', errorData);
        throw new Error(`Status ${res.status}`);
      }
      
      toast.success('Order updated successfully');
      router.push(`/dashboard/orders/${orderId}`);
    } catch (e) {
      console.error(e);
      toast.error('Failed to update order.');
    } finally {
      setIsSaving(false);
    }
  };

  const getSelectedTechnician = () => {
    return technicians.find(tech => tech.id === formData.technicianId);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto space-y-6 px-6">
          <Card>
            <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !order) {
    return (
      <DashboardLayout>
        <Card className="max-w-lg mx-auto border-red-200 bg-red-50">
          <CardContent className="py-10 flex flex-col items-center">
            <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
            <p className="text-red-600">{error ?? 'Order not found.'}</p>
            <Button className="mt-4" onClick={() => router.push('/dashboard/orders')}>
              Back to Orders
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6 px-6">

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/dashboard/orders')}
            aria-label="Back to Order History"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Edit Order</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="itemName">Item Name</Label>
                <Input
                  id="itemName"
                  value={formData.itemName || ''}
                  onChange={e => setFormData(f => ({ ...f, itemName: e.target.value }))}
                  placeholder="e.g., iPhone 13, Laptop ASUS"
                />
              </div>
              
              <div>
                <Label htmlFor="itemCondition">Item Condition</Label>
                <Textarea
                  id="itemCondition"
                  value={formData.itemCondition || ''}
                  onChange={e => setFormData(f => ({ ...f, itemCondition: e.target.value }))}
                  placeholder="Describe the current condition and any visible damage..."
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="repairDetails">Repair Details</Label>
                <Textarea
                  id="repairDetails"
                  value={formData.repairDetails || ''}
                  onChange={e => setFormData(f => ({ ...f, repairDetails: e.target.value }))}
                  placeholder="Describe what needs to be repaired and your expected outcome..."
                  rows={4}
                />
              </div>
              
              <div>
                <Label htmlFor="serviceDate">Service Date</Label>
                <Input
                  id="serviceDate"
                  type="date"
                  value={formData.serviceDate || ''}
                  onChange={e => setFormData(f => ({ ...f, serviceDate: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div>
                <Label className="flex items-center gap-2 mb-3">
                  <User className="h-4 w-4" />
                  Technician Selection
                </Label>
                
                {isLoadingTechnicians ? (
                  <div className="space-y-3">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Auto-assign option */}
                    <Card
                      className={`cursor-pointer transition-all ${
                        !formData.technicianId
                          ? 'border-primary ring-primary ring-1'
                          : 'hover:border-muted-foreground/50'
                      }`}
                      onClick={() => setFormData(f => ({ ...f, technicianId: '' }))}
                    >
                      <CardContent className="flex items-center gap-4 p-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>
                            <User className="h-6 w-6" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium">Auto-assign Technician</h4>
                          <p className="text-muted-foreground text-sm">
                            Let us assign the best available technician for your repair
                          </p>
                        </div>
                        {!formData.technicianId && (
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

                    {/* Available technicians */}
                    {technicians.map((technician) => (
                      <Card
                        key={technician.id}
                        className={`cursor-pointer transition-all ${
                          formData.technicianId === technician.id
                            ? 'border-primary ring-primary ring-1'
                            : 'hover:border-muted-foreground/50'
                        }`}
                        onClick={() => setFormData(f => ({ ...f, technicianId: technician.id }))}
                      >
                        <CardContent className="flex items-center gap-4 p-4">
                          <Avatar className="h-12 w-12">
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
                                  <span className="font-medium">
                                    {technician.rating.toFixed(1)}
                                  </span>
                                  <span className="text-muted-foreground text-xs">
                                    ({technician.reviews} reviews)
                                  </span>
                                </div>
                                <Badge variant="outline" className="mt-1">
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
                    ))}
                  </div>
                )}

                <p className="text-xs text-muted-foreground mt-2">
                  You can choose a specific technician or let us automatically assign the best available one for your repair.
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => router.push(`/dashboard/orders/${orderId}`)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving Changes...' : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}