'use client';

import type React from 'react';

import { motion } from 'framer-motion';
import {
  Calendar,
  CreditCard,
  FileText,
  Info,
  Loader2,
  Package,
  Percent,
  Settings,
  Wrench,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/auth-provider';

interface Technician {
  id: string;
  name: string;
  imageUrl: string;
  specialty: string;
  rating: number;
  reviews: number;
}

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  processingFee: number;
}

interface Coupon {
  id: string;
  code: string;
  couponType: string;
  discount_amount: number;
  max_usage: number;
  start_date: string;
  end_date: string;
}

export default function CreateOrderPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    itemName: '',
    itemCondition: '',
    repairDetails: '',
    serviceDate: '',
    technicianId: '',
    paymentMethodId: '',
    couponId: '',
  });

  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [isLoadingTechnicians, setIsLoadingTechnicians] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState(true);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoadingCoupons, setIsLoadingCoupons] = useState(true);
  const [couponPreviews, setCouponPreviews] = useState<Record<string, string>>({});

  const ORDER_BASE_PRICE = 200000;

  const formatRupiah = (num: number | string) => {
    const parsed = typeof num === 'string' ? parseFloat(num) : num;
    if (isNaN(parsed)) return 'NaN';
    const rounded = Math.round(parsed);
    return 'Rp' + rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else {
        fetchTechnicians();

        fetchPayments();

        fetchCoupons().then((coupons) => {
          setCoupons(coupons);
          coupons.forEach(async (coupon) => {
            const discount = await fetchCouponPreview(coupon.id);
            setCouponPreviews((prev) => ({
              ...prev,
              [coupon.id]: discount,
            }));
          });
        });
      }
    }
  }, [user, authLoading, router]);

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

  const fetchPayments = async () => {
    setIsLoadingPayments(true);
    try {
      const paymentApiUrl = `${process.env.NEXT_PUBLIC_PAYMENT_API_URL}/payment-methods/active`;
      const response = await fetch(paymentApiUrl);
      const payload = (await response.json()) as {
        status: 'success' | 'error';
        message: string;
        data: Array<{
          id: string;
          name: string;
          description: string;
          processingFee: number;
          paymentMethod: string;
          phoneNumber?: string;
          instructions?: string;
          accountName?: string;
          virtualAccountNumber?: string;
          accountNumber?: string;
          bankName?: string;
        }>;
      };

      if (!response.ok || payload.status !== 'success') {
        throw new Error(payload.message || 'Failed to fetch payment methods.');
      }

      const formattedPaymentMethods = payload.data.map((method) => ({
        id: method.id,
        name: method.paymentMethod,
        description: method.name,
        processingFee: method.processingFee,
      }));

      setPaymentMethods(formattedPaymentMethods);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error occurred';
      toast.error('Failed to load payment methods', {
        description: msg,
      });
    } finally {
      setIsLoadingPayments(false);
    }
  };

  const fetchCoupons = async (): Promise<Coupon[]> => {
    setIsLoadingCoupons(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_ORDER_API_URL}/coupons/valid`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch coupons (HTTP ${response.status})`);
      }

      const { coupons }: { coupons: Coupon[] } = await response.json();

      if (!Array.isArray(coupons)) {
        throw new Error('Invalid response format');
      }

      return coupons;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast.error('Failed to load coupons', { description: message });
      return [];
    } finally {
      setIsLoadingCoupons(false);
    }
  };

  const fetchCouponPreview = async (couponId: string): Promise<number> => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_ORDER_API_URL}/coupons/${couponId}/preview`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ original_price: ORDER_BASE_PRICE }),
        },
      );

      if (!res.ok) throw new Error('Failed to preview coupon');

      const data = await res.json();
      return data.discounted_price;
    } catch (err) {
      console.error(err);
      return ORDER_BASE_PRICE;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateStep1 = () => {
    const newErrors: Partial<Record<string, string>> = {};

    if (!formData.itemName.trim()) newErrors.itemName = 'Item name is required';
    if (!formData.itemCondition.trim())
      newErrors.itemCondition = 'Item condition must be described';
    if (!formData.repairDetails.trim()) newErrors.repairDetails = 'Repair details are required';
    if (!formData.serviceDate.trim()) newErrors.serviceDate = 'Service date must be selected';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Partial<Record<string, string>> = {};
    if (!formData.technicianId) newErrors.technicianId = 'Please select a technician';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Partial<Record<string, string>> = {};
    if (!formData.paymentMethodId) newErrors.paymentMethodId = 'Payment method is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep3()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        itemName: formData.itemName,
        itemCondition: formData.itemCondition,
        repairDetails: formData.repairDetails,
        serviceDate: formData.serviceDate,
        technicianId: formData.technicianId,
        paymentMethodId: formData.paymentMethodId,
        couponId: formData.couponId || null,
      };

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_ORDER_API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      });

      if (response.status === 201) {
        const result = await response.json();

        toast.success('Order created successfully!', {
          description:
            result.message || 'Your repair order has been submitted and is being processed.',
        });

        setFormData({
          itemName: '',
          itemCondition: '',
          repairDetails: '',
          serviceDate: '',
          technicianId: '',
          paymentMethodId: '',
          couponId: '',
        });
        setCurrentStep(1);

        router.push('/dashboard/orders');
      } else if (response.status === 403) {
        toast.error('Access denied', {
          description:
            "You don't have permission to create orders. Please check your account status.",
        });
      } else if (response.status === 404) {
        toast.error('Invalid selection', {
          description:
            'One of the selected items (technician, payment method, or coupon) is no longer available.',
        });
      } else if (response.status === 400) {
        const errorData = await response.json().catch(() => null);
        toast.error('Invalid order data', {
          description: errorData?.message || 'Please check your order details and try again.',
        });
      } else if (response.status === 500) {
        toast.error('Server error', {
          description: 'An unexpected error occurred. Please try again later.',
        });
      } else {
        toast.error('Failed to create order', {
          description: `Unexpected error (${response.status}). Please try again later.`,
        });
      }
    } catch (error) {
      console.error('Order creation error:', error);

      if (error instanceof Error) {
        if (error.message.includes('Authentication token')) {
          toast.error('Authentication required', {
            description: 'Please log in again to continue.',
          });
          router.push('/login');
        } else if (error.message.includes('fetch')) {
          toast.error('Network error', {
            description: 'Please check your internet connection and try again.',
          });
        } else {
          toast.error('Failed to create order', {
            description: error.message,
          });
        }
      } else {
        toast.error('Failed to create order', {
          description: 'An unexpected error occurred. Please try again later.',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressSteps = [
    { number: 1, title: 'Item Details', icon: Package },
    { number: 2, title: 'Technician', icon: Wrench },
    { number: 3, title: 'Payment', icon: CreditCard },
  ];

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

  const stepVariants = {
    hidden: { x: 20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      x: -20,
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Create Order</h1>
        </div>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <motion.div
        className="space-y-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}>
        {/* Header */}
        <motion.div className="flex items-center gap-3" variants={itemVariants}>
          <Package className="text-primary h-6 w-6" />
          <h1 className="text-3xl font-bold tracking-tight">Create New Order</h1>
        </motion.div>

        {/* Progress indicator */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between">
                {progressSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.number} className="flex items-center">
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                            currentStep >= step.number
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground'
                          }`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="hidden sm:block">
                          <p className="text-sm font-medium">{step.title}</p>
                          <p className="text-muted-foreground text-xs">Step {step.number}</p>
                        </div>
                      </div>
                      {index < progressSteps.length - 1 && (
                        <div
                          className={`mx-4 h-0.5 w-16 transition-colors ${
                            currentStep > step.number ? 'bg-primary' : 'bg-muted'
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Form */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {currentStep === 1 && <Settings className="h-5 w-5" />}
                {currentStep === 2 && <Wrench className="h-5 w-5" />}
                {currentStep === 3 && <CreditCard className="h-5 w-5" />}
                {currentStep === 1 && 'Item Details'}
                {currentStep === 2 && 'Select Technician'}
                {currentStep === 3 && 'Payment & Checkout'}
              </CardTitle>
              <CardDescription>
                {currentStep === 1 && 'Provide details about the item you need repaired'}
                {currentStep === 2 && 'Choose a qualified technician for your repair'}
                {currentStep === 3 && 'Complete your order with payment information'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step 1: Item Details */}
                {currentStep === 1 && (
                  <motion.div
                    className="space-y-6"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={stepVariants}>
                    <div className="space-y-2">
                      <Label htmlFor="itemName" className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Item Name
                      </Label>
                      <Input
                        id="itemName"
                        name="itemName"
                        value={formData.itemName}
                        onChange={handleInputChange}
                        placeholder="e.g., Samsung Galaxy S22, MacBook Pro, etc."
                        className={errors.itemName ? 'border-destructive' : ''}
                        required
                      />
                      {errors.itemName && (
                        <p className="text-destructive text-sm">{errors.itemName}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="itemCondition" className="flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        Item Condition
                      </Label>
                      <Textarea
                        id="itemCondition"
                        name="itemCondition"
                        value={formData.itemCondition}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Describe the current condition and any visible damage..."
                        className={errors.itemCondition ? 'border-destructive' : ''}
                        required
                      />
                      {errors.itemCondition && (
                        <p className="text-destructive text-sm">{errors.itemCondition}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="repairDetails" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Repair Details
                      </Label>
                      <Textarea
                        id="repairDetails"
                        name="repairDetails"
                        value={formData.repairDetails}
                        onChange={handleInputChange}
                        rows={4}
                        placeholder="Describe what needs to be repaired and your expected outcome..."
                        className={errors.repairDetails ? 'border-destructive' : ''}
                        required
                      />
                      {errors.repairDetails && (
                        <p className="text-destructive text-sm">{errors.repairDetails}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="serviceDate" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Preferred Service Date
                      </Label>
                      <Input
                        id="serviceDate"
                        name="serviceDate"
                        type="date"
                        value={formData.serviceDate}
                        onChange={handleInputChange}
                        className={errors.serviceDate ? 'border-destructive' : ''}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                      {errors.serviceDate && (
                        <p className="text-destructive text-sm">{errors.serviceDate}</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Technician Selection */}
                {currentStep === 2 && (
                  <motion.div
                    className="space-y-6"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={stepVariants}>
                    {errors.technicianId && (
                      <div className="border-destructive bg-destructive/10 rounded-md border p-3">
                        <p className="text-destructive text-sm">{errors.technicianId}</p>
                      </div>
                    )}

                    {isLoadingTechnicians ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <Card key={i}>
                            <CardContent className="flex items-center gap-4 p-4">
                              <Skeleton className="h-16 w-16 rounded-full" />
                              <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-1/3" />
                                <Skeleton className="h-3 w-1/2" />
                                <Skeleton className="h-3 w-1/4" />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {technicians.map((technician) => (
                          <motion.div
                            key={technician.id}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}>
                            <Card
                              className={`cursor-pointer transition-all ${
                                formData.technicianId === technician.id
                                  ? 'border-primary ring-primary ring-1'
                                  : 'hover:border-muted-foreground/50'
                              }`}
                              onClick={() => handleSelectChange('technicianId', technician.id)}>
                              <CardContent className="flex items-center gap-4 p-4">
                                <Avatar className="h-16 w-16">
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
                                        <span className="text-yellow-500">★</span>
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
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Step 3: Payment & Coupon */}
                {currentStep === 3 && (
                  <motion.div
                    className="space-y-6"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={stepVariants}>
                    <div className="space-y-2">
                      <Label htmlFor="paymentMethodId" className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Payment Method
                      </Label>
                      {isLoadingPayments ? (
                        <Skeleton className="h-10 w-full" />
                      ) : (
                        <Select
                          value={formData.paymentMethodId}
                          onValueChange={(value) => handleSelectChange('paymentMethodId', value)}>
                          <SelectTrigger
                            className={errors.paymentMethodId ? 'border-destructive' : ''}>
                            <SelectValue placeholder="Select your payment method" />
                          </SelectTrigger>
                          <SelectContent>
                            {paymentMethods.map((method) => (
                              <SelectItem key={method.id} value={method.id}>
                                <div className="flex flex-col">
                                  <span>{method.name}</span>
                                  {method.description && (
                                    <span className="text-muted-foreground text-xs">
                                      {method.description}
                                    </span>
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      {errors.paymentMethodId && (
                        <p className="text-destructive text-sm">{errors.paymentMethodId}</p>
                      )}
                    </div>

                    <div className="space-y-4">
                      <Label className="flex items-center gap-2">
                        <Percent className="h-4 w-4" />
                        Available Coupons (Optional)
                      </Label>

                      {isLoadingCoupons ? (
                        <div className="space-y-3">
                          {[1, 2, 3].map((i) => (
                            <Card key={i}>
                              <CardContent className="flex items-center gap-3 p-3">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="flex-1 space-y-2">
                                  <Skeleton className="h-4 w-1/4" />
                                  <Skeleton className="h-3 w-1/3" />
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {coupons.length === 0 ? (
                            <Card>
                              <CardContent className="flex items-center justify-center p-6 text-center">
                                <div>
                                  <Percent className="text-muted-foreground mx-auto h-8 w-8" />
                                  <p className="text-muted-foreground mt-2 text-sm">
                                    No coupons available
                                  </p>
                                </div>
                              </CardContent>
                            </Card>
                          ) : (
                            coupons.map((coupon: Coupon) => {
                              const valid = new Date(coupon.end_date) > new Date();

                              return (
                                <motion.div
                                  key={coupon.id}
                                  whileHover={{ scale: 1.01 }}
                                  whileTap={{ scale: 0.99 }}>
                                  <Card
                                    className={`cursor-pointer transition-all ${
                                      !valid
                                        ? 'opacity-50'
                                        : formData.couponId === coupon.id
                                          ? 'border-primary ring-primary ring-1'
                                          : 'hover:border-muted-foreground/50'
                                    }`}
                                    onClick={() =>
                                      valid && handleSelectChange('couponId', coupon.id)
                                    }>
                                    <CardContent className="flex items-center justify-between p-3">
                                      <div className="flex items-center gap-3">
                                        <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
                                          <Percent className="h-5 w-5" />
                                        </div>
                                        <div>
                                          <h4 className="font-medium">{coupon.code}</h4>
                                          <p className="text-muted-foreground text-sm">
                                            Discount: {coupon.discount_amount}
                                            {coupon.couponType === 'PERCENTAGE' ? '%' : ''}
                                          </p>
                                          <p className="text-muted-foreground text-xs">
                                            Expires on:{' '}
                                            {new Date(coupon.end_date).toLocaleDateString()}
                                          </p>
                                          <p className="text-sm text-green-600">
                                            Discounted Price:{' '}
                                            {couponPreviews[coupon.id] != null
                                              ? formatRupiah(couponPreviews[coupon.id])
                                              : 'Loading...'}
                                          </p>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        {!valid && (
                                          <Badge
                                            variant="outline"
                                            className="text-muted-foreground">
                                            Expired
                                          </Badge>
                                        )}
                                        {formData.couponId === coupon.id && valid && (
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
                                      </div>
                                    </CardContent>
                                  </Card>
                                </motion.div>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Navigation buttons */}
                <div className="flex justify-between pt-6">
                  {currentStep > 1 ? (
                    <Button
                      variant="outline"
                      type="button"
                      onClick={prevStep}
                      disabled={isSubmitting}>
                      Previous
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => router.push('/dashboard/orders')}>
                      Cancel
                    </Button>
                  )}

                  {currentStep < 3 ? (
                    <Button type="button" onClick={nextStep} disabled={isSubmitting}>
                      Next Step
                    </Button>
                  ) : (
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Order...
                        </>
                      ) : (
                        'Create Order'
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
