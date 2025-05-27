'use client';

import type React from 'react';

import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Loader2, Smartphone, University } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/auth-provider';

type PaymentMethodType = 'COD' | 'E_WALLET' | 'BANK_TRANSFER';

interface PaymentMethodFormData {
  paymentMethod: PaymentMethodType | '';
  phoneNumber: string;
  instructions: string;
  accountName: string;
  virtualAccountNumber: string;
  accountNumber: string;
  bankName: string;
}

export default function CreatePaymentMethodPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<PaymentMethodFormData>({
    paymentMethod: '',
    phoneNumber: '',
    instructions: '',
    accountName: '',
    virtualAccountNumber: '',
    accountNumber: '',
    bankName: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof PaymentMethodFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'ADMIN') {
        router.push('/dashboard');
        toast.error('Access Denied', {
          description: 'Only administrators can create payment methods.',
        });
      }
    }
  }, [user, authLoading, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof PaymentMethodFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectChange = (value: PaymentMethodType) => {
    setFormData((prev) => ({ ...prev, paymentMethod: value }));

    setErrors({});

    if (value === 'COD') {
      setFormData((prev) => ({
        ...prev,
        accountName: '',
        virtualAccountNumber: '',
        accountNumber: '',
        bankName: '',
      }));
    } else if (value === 'E_WALLET') {
      setFormData((prev) => ({
        ...prev,
        phoneNumber: '',
        accountNumber: '',
        bankName: '',
      }));
    } else if (value === 'BANK_TRANSFER') {
      setFormData((prev) => ({
        ...prev,
        phoneNumber: '',
        virtualAccountNumber: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof PaymentMethodFormData, string>> = {};

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Payment method is required';
    }

    if (formData.paymentMethod === 'COD') {
      if (!formData.phoneNumber.trim()) {
        newErrors.phoneNumber = 'Phone number is required for COD';
      } else if (!/^\d{10,15}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
        newErrors.phoneNumber = 'Please enter a valid phone number (10-15 digits)';
      }
      if (!formData.instructions.trim()) {
        newErrors.instructions = 'Instructions are required for COD';
      }
    }

    if (formData.paymentMethod === 'E_WALLET') {
      if (!formData.accountName.trim()) {
        newErrors.accountName = 'Account name is required for E-Wallet';
      }
      if (!formData.virtualAccountNumber.trim()) {
        newErrors.virtualAccountNumber = 'Virtual account number is required for E-Wallet';
      }
      if (!formData.instructions.trim()) {
        newErrors.instructions = 'Instructions are required for E-Wallet';
      }
    }

    if (formData.paymentMethod === 'BANK_TRANSFER') {
      if (!formData.accountName.trim()) {
        newErrors.accountName = 'Account name is required for Bank Transfer';
      }
      if (!formData.accountNumber.trim()) {
        newErrors.accountNumber = 'Account number is required for Bank Transfer';
      }
      if (!formData.bankName.trim()) {
        newErrors.bankName = 'Bank name is required for Bank Transfer';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Validation Error', {
        description: 'Please fix the errors in the form before submitting.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const requestBody: any = {
        payment_method: formData.paymentMethod,
      };

      if (formData.paymentMethod === 'COD') {
        requestBody.phone_number = formData.phoneNumber;
        requestBody.instructions = formData.instructions;
      } else if (formData.paymentMethod === 'E_WALLET') {
        requestBody.accountName = formData.accountName;
        requestBody.virtual_account_number = formData.virtualAccountNumber;
        requestBody.instructions = formData.instructions;
      } else if (formData.paymentMethod === 'BANK_TRANSFER') {
        requestBody.account_name = formData.accountName;
        requestBody.account_number = formData.accountNumber;
        requestBody.bank_name = formData.bankName;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PAYMENT_API_URL}/payment-methods/admin/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(requestBody),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create payment method');
      }

      toast.success('Payment method created', {
        description: 'The payment method has been created successfully.',
      });

      router.push('/dashboard/payment-methods');
    } catch (err) {
      console.error('Failed to create payment method:', err);
      toast.error('Creation failed', {
        description:
          err instanceof Error ? err.message : 'Failed to create payment method. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPaymentMethodIcon = (type: PaymentMethodType | '') => {
    switch (type) {
      case 'COD':
        return <CreditCard className="h-5 w-5" />;
      case 'E_WALLET':
        return <Smartphone className="h-5 w-5" />;
      case 'BANK_TRANSFER':
        return <University className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="mb-6 flex items-center gap-3">
          <div className="bg-muted h-6 w-6 animate-pulse rounded" />
          <div className="bg-muted h-8 w-64 animate-pulse rounded" />
        </div>
        <Card>
          <CardHeader>
            <div className="bg-muted h-6 w-48 animate-pulse rounded" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="bg-muted h-4 w-24 animate-pulse rounded" />
                <div className="bg-muted h-10 w-full animate-pulse rounded" />
              </div>
            ))}
          </CardContent>
        </Card>
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
        <motion.div className="flex items-center gap-3" variants={itemVariants}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/dashboard/payment-methods')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CreditCard className="text-primary h-6 w-6" />
          <h1 className="text-3xl font-bold tracking-tight">Create Payment Method</h1>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getPaymentMethodIcon(formData.paymentMethod)}
                Payment Method Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="paymentMethod">Payment Method Type *</Label>
                  <Select value={formData.paymentMethod} onValueChange={handleSelectChange}>
                    <SelectTrigger className={errors.paymentMethod ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select payment method type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="COD">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          Cash on Delivery (COD)
                        </div>
                      </SelectItem>
                      <SelectItem value="E_WALLET">
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4" />
                          E-Wallet
                        </div>
                      </SelectItem>
                      <SelectItem value="BANK_TRANSFER">
                        <div className="flex items-center gap-2">
                          <University className="h-4 w-4" />
                          Bank Transfer
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.paymentMethod && (
                    <p className="text-destructive text-sm">{errors.paymentMethod}</p>
                  )}
                </motion.div>

                {/* COD Fields */}
                {formData.paymentMethod === 'COD' && (
                  <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number *</Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="Enter phone number for COD contact"
                        className={errors.phoneNumber ? 'border-destructive' : ''}
                      />
                      {errors.phoneNumber && (
                        <p className="text-destructive text-sm">{errors.phoneNumber}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instructions">Instructions *</Label>
                      <Textarea
                        id="instructions"
                        name="instructions"
                        value={formData.instructions}
                        onChange={handleInputChange}
                        placeholder="Enter instructions for COD payment"
                        rows={3}
                        className={errors.instructions ? 'border-destructive' : ''}
                      />
                      {errors.instructions && (
                        <p className="text-destructive text-sm">{errors.instructions}</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* E-Wallet Fields */}
                {formData.paymentMethod === 'E_WALLET' && (
                  <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}>
                    <div className="space-y-2">
                      <Label htmlFor="accountName">Account Name *</Label>
                      <Input
                        id="accountName"
                        name="accountName"
                        value={formData.accountName}
                        onChange={handleInputChange}
                        placeholder="Enter account holder name"
                        className={errors.accountName ? 'border-destructive' : ''}
                      />
                      {errors.accountName && (
                        <p className="text-destructive text-sm">{errors.accountName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="virtualAccountNumber">Virtual Account Number *</Label>
                      <Input
                        id="virtualAccountNumber"
                        name="virtualAccountNumber"
                        value={formData.virtualAccountNumber}
                        onChange={handleInputChange}
                        placeholder="Enter virtual account number"
                        className={errors.virtualAccountNumber ? 'border-destructive' : ''}
                      />
                      {errors.virtualAccountNumber && (
                        <p className="text-destructive text-sm">{errors.virtualAccountNumber}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instructions">Instructions *</Label>
                      <Textarea
                        id="instructions"
                        name="instructions"
                        value={formData.instructions}
                        onChange={handleInputChange}
                        placeholder="Enter payment instructions (e.g., QR code scanning steps)"
                        rows={3}
                        className={errors.instructions ? 'border-destructive' : ''}
                      />
                      {errors.instructions && (
                        <p className="text-destructive text-sm">{errors.instructions}</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Bank Transfer Fields */}
                {formData.paymentMethod === 'BANK_TRANSFER' && (
                  <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}>
                    <div className="space-y-2">
                      <Label htmlFor="accountName">Account Name *</Label>
                      <Input
                        id="accountName"
                        name="accountName"
                        value={formData.accountName}
                        onChange={handleInputChange}
                        placeholder="Enter account holder name"
                        className={errors.accountName ? 'border-destructive' : ''}
                      />
                      {errors.accountName && (
                        <p className="text-destructive text-sm">{errors.accountName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Bank Name *</Label>
                      <Input
                        id="bankName"
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleInputChange}
                        placeholder="Enter bank name"
                        className={errors.bankName ? 'border-destructive' : ''}
                      />
                      {errors.bankName && (
                        <p className="text-destructive text-sm">{errors.bankName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number *</Label>
                      <Input
                        id="accountNumber"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleInputChange}
                        placeholder="Enter bank account number"
                        className={errors.accountNumber ? 'border-destructive' : ''}
                      />
                      {errors.accountNumber && (
                        <p className="text-destructive text-sm">{errors.accountNumber}</p>
                      )}
                    </div>
                  </motion.div>
                )}

                <motion.div className="flex justify-end gap-4 pt-4" variants={itemVariants}>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/dashboard/payment-methods')}
                    disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Payment Method'
                    )}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
