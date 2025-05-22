'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/auth-provider';

interface Order {
  id: string;
  technicianId?: string | null;
  itemName: string;
  itemCondition: string;
  repairDetails: string;
  serviceDate: string;
  status: 'PENDING' | 'WAITING_APPROVAL' | string;
}

interface Technician {
  id: string;
  name: string;
}

export default function EditOrderPage() {
  const router = useRouter();
  const { orderId } = useParams();
  const { user, isLoading: authLoading } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [formData, setFormData] = useState<Partial<Order>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) return void router.push('/login');
    if (user.role !== 'USER') {
      toast.error('Access denied');
      return void router.push('/dashboard');
    }

    const fetchOrder = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_ORDER_API_URL}/orders/${orderId}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = (await res.json()) as Order;

        if (!['PENDING','WAITING_APPROVAL'].includes(data.status)) {
          toast.error('Order cannot be edited at this stage.');
          return void router.push(`/orders/${orderId}`);
        }

        setOrder(data);
        setFormData({
          technicianId: data.technicianId ?? '',
          itemName: data.itemName,
          itemCondition: data.itemCondition,
          repairDetails: data.repairDetails,
          serviceDate: data.serviceDate.slice(0,10),
        });
      } catch (e) {
        console.error(e);
        setError('Failed to load order.');
      }
    };

    const fetchTechs = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_ORDER_API_URL}/orders/technicians`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        if (res.ok) setTechnicians(await res.json());
      } catch {
      }
    };

    Promise.all([fetchOrder(), fetchTechs()]).finally(() => setIsLoading(false));
  }, [authLoading, user, orderId, router]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_ORDER_API_URL}/orders/${orderId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            technicianId: formData.technicianId,
            itemName: formData.itemName,
            itemCondition: formData.itemCondition,
            repairDetails: formData.repairDetails,
            serviceDate: formData.serviceDate,
          }),
        }
      );
      if (!res.ok) throw new Error(`Status ${res.status}`);
      toast.success('Order updated successfully');
      router.push(`/orders/${orderId}`);
    } catch (e) {
      console.error(e);
      toast.error('Failed to update order.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <Card className="max-w-lg mx-auto">
          <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
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
            <Button className="mt-4" onClick={() => router.push('/orders')}>
              Back to Orders
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-lg mx-auto space-y-6">

        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/dashboard/orders')}
          aria-label="Back to Order History"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <h1 className="text-2xl font-bold">Edit Order #{order.id}</h1>

        <div className="space-y-4">
          <div>
            <Label htmlFor="itemName">Item Name</Label>
            <Input
              id="itemName"
              value={formData.itemName}
              onChange={e => setFormData(f => ({ ...f, itemName: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="itemCondition">Condition</Label>
            <Input
              id="itemCondition"
              value={formData.itemCondition}
              onChange={e => setFormData(f => ({ ...f, itemCondition: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="repairDetails">Repair Details</Label>
            <Textarea
              id="repairDetails"
              value={formData.repairDetails}
              onChange={e => setFormData(f => ({ ...f, repairDetails: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="serviceDate">Service Date</Label>
            <Input
              id="serviceDate"
              type="date"
              value={formData.serviceDate}
              onChange={e => setFormData(f => ({ ...f, serviceDate: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="technicianId">Technician</Label>
            <select
              id="technicianId"
              className="block w-full rounded border p-2"
              value={formData.technicianId || ''}
              onChange={e => setFormData(f => ({ ...f, technicianId: e.target.value }))}
            >
              <option value="">— auto pick —</option>
              {technicians.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/orders/${orderId}`)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
