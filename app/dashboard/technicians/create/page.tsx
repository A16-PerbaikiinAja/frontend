'use client';

import type React from 'react';

import { motion } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff, Loader2, Mail, MapPin, Phone, User, Wrench } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/auth-provider';

interface CreateTechnicianForm {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  experience: string;
  address: string;
}

export default function CreateTechnicianPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<CreateTechnicianForm>({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    experience: '',
    address: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CreateTechnicianForm, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'ADMIN') {
        router.push('/dashboard');
        toast.error('Access Denied', {
          description: 'Only administrators can create technician accounts.',
        });
      }
    }
  }, [user, authLoading, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof CreateTechnicianForm]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateTechnicianForm, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10,15}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm the password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (
      formData.experience &&
      (isNaN(Number(formData.experience)) || Number(formData.experience) < 0)
    ) {
      newErrors.experience = 'Experience must be a valid number';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    } else if (formData.address.trim().length < 10) {
      newErrors.address = 'Please provide a complete address';
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
      const requestBody = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        password: formData.password,
        experience: formData.experience ? Number(formData.experience) : undefined,
        address: formData.address.trim(),
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_API_URL}/auth/register/technician`,
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
        throw new Error(errorData.message || 'Failed to create technician account');
      }

      toast.success('Technician Created', {
        description: `Successfully created account for ${formData.fullName}`,
      });

      setFormData({
        fullName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        experience: '',
        address: '',
      });

      router.push('/dashboard/technicians');
    } catch (error) {
      console.error('Error creating technician:', error);
      toast.error('Creation Failed', {
        description: error instanceof Error ? error.message : 'Failed to create technician account',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/technicians');
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
  };

  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Create Technician</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="bg-muted h-4 w-24 animate-pulse rounded" />
                  <div className="bg-muted h-10 w-full animate-pulse rounded" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  return (
    <DashboardLayout>
      <motion.div
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible">
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={handleCancel}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-3">
              <User className="text-primary h-6 w-6" />
              <h1 className="text-3xl font-bold tracking-tight">Create Technician</h1>
            </div>
          </div>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Technician Information
              </CardTitle>
              <CardDescription>
                Create a new technician account. All fields marked with * are required.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Full Name *
                    </Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('fullName')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Enter technician's full name"
                      className={`transition-all duration-200 ${
                        errors.fullName
                          ? 'border-destructive'
                          : focusedField === 'fullName'
                            ? 'border-primary ring-primary ring-1'
                            : ''
                      }`}
                      required
                    />
                    {errors.fullName && (
                      <motion.p
                        className="text-destructive text-sm"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}>
                        {errors.fullName}
                      </motion.p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Enter email address"
                      className={`transition-all duration-200 ${
                        errors.email
                          ? 'border-destructive'
                          : focusedField === 'email'
                            ? 'border-primary ring-primary ring-1'
                            : ''
                      }`}
                      required
                    />
                    {errors.email && (
                      <motion.p
                        className="text-destructive text-sm"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}>
                        {errors.email}
                      </motion.p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number *
                    </Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('phoneNumber')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Enter phone number"
                      className={`transition-all duration-200 ${
                        errors.phoneNumber
                          ? 'border-destructive'
                          : focusedField === 'phoneNumber'
                            ? 'border-primary ring-primary ring-1'
                            : ''
                      }`}
                      required
                    />
                    {errors.phoneNumber && (
                      <motion.p
                        className="text-destructive text-sm"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}>
                        {errors.phoneNumber}
                      </motion.p>
                    )}
                  </div>

                  {/* Experience */}
                  <div className="space-y-2">
                    <Label htmlFor="experience" className="flex items-center gap-2">
                      <Wrench className="h-4 w-4" />
                      Years of Experience
                    </Label>
                    <Input
                      id="experience"
                      name="experience"
                      type="number"
                      min="0"
                      max="50"
                      value={formData.experience}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('experience')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Enter years of experience"
                      className={`transition-all duration-200 ${
                        errors.experience
                          ? 'border-destructive'
                          : focusedField === 'experience'
                            ? 'border-primary ring-primary ring-1'
                            : ''
                      }`}
                    />
                    {errors.experience && (
                      <motion.p
                        className="text-destructive text-sm"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}>
                        {errors.experience}
                      </motion.p>
                    )}
                    <p className="text-muted-foreground text-xs">
                      Optional: Leave blank if not specified
                    </p>
                  </div>
                </div>

                {/* Password Fields */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Enter password"
                        className={`pr-10 transition-all duration-200 ${
                          errors.password
                            ? 'border-destructive'
                            : focusedField === 'password'
                              ? 'border-primary ring-primary ring-1'
                              : ''
                        }`}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {errors.password && (
                      <motion.p
                        className="text-destructive text-sm"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}>
                        {errors.password}
                      </motion.p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('confirmPassword')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Confirm password"
                        className={`pr-10 transition-all duration-200 ${
                          errors.confirmPassword
                            ? 'border-destructive'
                            : focusedField === 'confirmPassword'
                              ? 'border-primary ring-primary ring-1'
                              : ''
                        }`}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {errors.confirmPassword && (
                      <motion.p
                        className="text-destructive text-sm"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}>
                        {errors.confirmPassword}
                      </motion.p>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Address *
                  </Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('address')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter complete address"
                    rows={3}
                    className={`transition-all duration-200 ${
                      errors.address
                        ? 'border-destructive'
                        : focusedField === 'address'
                          ? 'border-primary ring-primary ring-1'
                          : ''
                    }`}
                    required
                  />
                  {errors.address && (
                    <motion.p
                      className="text-destructive text-sm"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}>
                      {errors.address}
                    </motion.p>
                  )}
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Technician'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
