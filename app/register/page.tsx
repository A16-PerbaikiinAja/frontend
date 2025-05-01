'use client';

import { motion } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  User,
  Wrench,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/auth-provider';

export default function RegisterPage() {
  const router = useRouter();
  const { user, register, isLoading } = useAuth();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    address: '',
  });
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [formFocused, setFormFocused] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      router.replace('/dashboard');
    }
  }, [user, isLoading, router]);

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const validateStep1 = () => {
    const newErrors: Partial<Record<string, string>> = {};

    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email is invalid';
    if (!form.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Partial<Record<string, string>> = {};

    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';

    if (!form.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    if (!form.address.trim()) newErrors.address = 'Address is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const prevStep = () => {
    setCurrentStep(1);
  };

  const handleRegister = async () => {
    if (!validateStep2()) return;

    setFormSubmitted(true);
    try {
      await register({
        fullName: form.fullName,
        email: form.email.trim(),
        password: form.password,
        phoneNumber: form.phoneNumber.trim(),
        address: form.address.trim(),
      });
      toast.success('Registration successful');
      router.push('/dashboard');
    } catch (err: any) {
      const fieldErrors: Partial<Record<string, string>> = {};
      if (err.fullName) fieldErrors.fullName = err.fullName;
      if (err.email) fieldErrors.email = err.email;
      if (err.phoneNumber) fieldErrors.phoneNumber = err.phoneNumber;
      if (err.password) fieldErrors.password = err.password;
      if (err.address) fieldErrors.address = err.address;
      if (err.error) toast.error(err.error);
      setErrors(fieldErrors);
      setFormSubmitted(false);
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

  const progressSteps = [
    { number: 1, title: 'Personal Info' },
    { number: 2, title: 'Security & Address' },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row">
      {/* Left side - Form */}
      <motion.div
        className="flex w-full flex-col items-center justify-center p-6 md:w-1/2 md:p-12"
        initial="hidden"
        animate="visible"
        variants={containerVariants}>
        <motion.div
          className="absolute top-4 left-4 flex items-center gap-2 md:top-8 md:left-8"
          variants={itemVariants}>
          <Link
            href="/"
            className="text-primary hover:text-primary/90 flex items-center gap-2 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to home</span>
          </Link>
        </motion.div>

        <motion.div className="w-full max-w-md space-y-8" variants={containerVariants}>
          <motion.div className="space-y-2 text-center" variants={itemVariants}>
            <div className="mx-auto h-12 w-12">
              <Image
                src="/icon-light.png"
                width={500}
                height={500}
                alt="Icon"
                className="dark:hidden"
              />
              <Image
                src="/icon-dark.png"
                width={500}
                height={500}
                alt="Icon"
                className="hidden dark:inline"
              />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
            <p className="text-muted-foreground text-sm">Sign up to request repair services</p>
          </motion.div>

          <motion.div className="space-y-6" variants={itemVariants}>
            {/* Progress indicator */}
            <div className="flex justify-between">
              {progressSteps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                      currentStep >= step.number
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                    {step.number}
                  </div>
                  <div className="ml-2 hidden sm:block">
                    <p className="text-sm font-medium">{step.title}</p>
                  </div>
                  {index < progressSteps.length - 1 && (
                    <div
                      className={`mx-2 h-0.5 w-10 sm:w-16 ${currentStep > step.number ? 'bg-primary' : 'bg-muted'}`}></div>
                  )}
                </div>
              ))}
            </div>

            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <motion.div
                className="space-y-4"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={stepVariants}>
                {/* Full Name */}
                <div className="space-y-2">
                  <Label
                    htmlFor="fullName"
                    className={`flex items-center gap-2 text-sm transition-colors duration-200 ${formFocused === 'fullName' ? 'text-primary' : ''}`}>
                    <User className="h-3.5 w-3.5" />
                    Full Name
                  </Label>
                  <div className="relative">
                    <Input
                      id="fullName"
                      placeholder="John Smith"
                      value={form.fullName}
                      onChange={(e) => handleChange('fullName', e.target.value)}
                      onFocus={() => setFormFocused('fullName')}
                      onBlur={() => setFormFocused(null)}
                      className={`transition-all duration-200 ${errors.fullName ? 'border-destructive' : formFocused === 'fullName' ? 'border-primary ring-primary ring-1' : ''}`}
                    />
                    {errors.fullName && (
                      <motion.p
                        className="text-destructive mt-1 text-sm"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}>
                        {errors.fullName}
                      </motion.p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className={`flex items-center gap-2 text-sm transition-colors duration-200 ${formFocused === 'email' ? 'text-primary' : ''}`}>
                    <Mail className="h-3.5 w-3.5" />
                    Email
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@email.com"
                      value={form.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      onFocus={() => setFormFocused('email')}
                      onBlur={() => setFormFocused(null)}
                      className={`transition-all duration-200 ${errors.email ? 'border-destructive' : formFocused === 'email' ? 'border-primary ring-primary ring-1' : ''}`}
                    />
                    {errors.email && (
                      <motion.p
                        className="text-destructive mt-1 text-sm"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}>
                        {errors.email}
                      </motion.p>
                    )}
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <Label
                    htmlFor="phoneNumber"
                    className={`flex items-center gap-2 text-sm transition-colors duration-200 ${formFocused === 'phoneNumber' ? 'text-primary' : ''}`}>
                    <Phone className="h-3.5 w-3.5" />
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Input
                      id="phoneNumber"
                      type="tel"
                      autoComplete="tel"
                      placeholder="082541340369"
                      value={form.phoneNumber}
                      onChange={(e) => handleChange('phoneNumber', e.target.value)}
                      onFocus={() => setFormFocused('phoneNumber')}
                      onBlur={() => setFormFocused(null)}
                      className={`transition-all duration-200 ${errors.phoneNumber ? 'border-destructive' : formFocused === 'phoneNumber' ? 'border-primary ring-primary ring-1' : ''}`}
                    />
                    {errors.phoneNumber && (
                      <motion.p
                        className="text-destructive mt-1 text-sm"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}>
                        {errors.phoneNumber}
                      </motion.p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Security & Address */}
            {currentStep === 2 && (
              <motion.div
                className="space-y-4"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={stepVariants}>
                {/* Password */}
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className={`flex items-center gap-2 text-sm transition-colors duration-200 ${formFocused === 'password' ? 'text-primary' : ''}`}>
                    <Lock className="h-3.5 w-3.5" />
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type="password"
                      value={form.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      onFocus={() => setFormFocused('password')}
                      onBlur={() => setFormFocused(null)}
                      className={`transition-all duration-200 ${errors.password ? 'border-destructive' : formFocused === 'password' ? 'border-primary ring-primary ring-1' : ''}`}
                    />
                    {errors.password && (
                      <motion.p
                        className="text-destructive mt-1 text-sm"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}>
                        {errors.password}
                      </motion.p>
                    )}
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className={`flex items-center gap-2 text-sm transition-colors duration-200 ${formFocused === 'confirmPassword' ? 'text-primary' : ''}`}>
                    <Lock className="h-3.5 w-3.5" />
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={form.confirmPassword}
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
                      onFocus={() => setFormFocused('confirmPassword')}
                      onBlur={() => setFormFocused(null)}
                      className={`transition-all duration-200 ${errors.confirmPassword ? 'border-destructive' : formFocused === 'confirmPassword' ? 'border-primary ring-primary ring-1' : ''}`}
                    />
                    {errors.confirmPassword && (
                      <motion.p
                        className="text-destructive mt-1 text-sm"
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
                  <Label
                    htmlFor="address"
                    className={`flex items-center gap-2 text-sm transition-colors duration-200 ${formFocused === 'address' ? 'text-primary' : ''}`}>
                    <MapPin className="h-3.5 w-3.5" />
                    Address
                  </Label>
                  <div className="relative">
                    <Textarea
                      id="address"
                      rows={3}
                      autoComplete="street-address"
                      placeholder="123 Main St, Springfield, IL 62704"
                      value={form.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      onFocus={() => setFormFocused('address')}
                      onBlur={() => setFormFocused(null)}
                      className={`transition-all duration-200 ${errors.address ? 'border-destructive' : formFocused === 'address' ? 'border-primary ring-primary ring-1' : ''}`}
                    />
                    {errors.address && (
                      <motion.p
                        className="text-destructive mt-1 text-sm"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}>
                        {errors.address}
                      </motion.p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            <motion.div className="flex justify-between" variants={itemVariants}>
              {currentStep > 1 ? (
                <Button variant="outline" onClick={prevStep} className="w-1/3">
                  Back
                </Button>
              ) : (
                <div className="w-1/3"></div>
              )}

              {currentStep < 2 ? (
                <Button onClick={nextStep} className="group relative w-1/3 overflow-hidden">
                  <span>Next</span>
                  <motion.span
                    className="absolute inset-0 bg-white/10"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.5 }}
                  />
                </Button>
              ) : (
                <Button
                  onClick={handleRegister}
                  disabled={isLoading || formSubmitted}
                  className="group relative w-1/3 overflow-hidden">
                  {isLoading || formSubmitted ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Creating...</span>
                    </span>
                  ) : (
                    <>
                      <span>Create account</span>
                      <motion.span
                        className="absolute inset-0 bg-white/10"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.5 }}
                      />
                    </>
                  )}
                </Button>
              )}
            </motion.div>

            <motion.div
              className="text-muted-foreground text-center text-sm"
              variants={itemVariants}>
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:text-primary/90 transition-colors">
                Sign in
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Right side - Image/Decoration */}
      <motion.div
        className="bg-muted/50 hidden items-center justify-center p-12 md:flex md:w-1/2"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}>
        <div className="max-w-md space-y-6">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Link href="/" className="w-28 md:w-40">
              <Image
                src="/logo-light.png"
                width={500}
                height={500}
                alt="Logo"
                className="dark:hidden"
              />
              <Image
                src="/logo-dark.png"
                width={500}
                height={500}
                alt="Logo"
                className="hidden dark:inline"
              />
            </Link>
            <p className="text-muted-foreground">Your trusted platform for all repair services</p>
          </div>
          <div className="relative aspect-video overflow-hidden rounded-xl">
            <Image
              src="/auth.png"
              width={600}
              height={400}
              alt="Repair service illustration"
              className="object-cover"
            />
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div>
                  <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                </div>
                <div>
                  <p className="font-medium">Join our community</p>
                  <p className="text-muted-foreground text-sm">
                    Create an account to access repair services and connect with skilled technicians
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Tabs defaultValue="user" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="user">For Users</TabsTrigger>
              <TabsTrigger value="technician">For Technicians</TabsTrigger>
            </TabsList>
            <TabsContent value="user" className="mt-4 space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Request repairs easily</p>
                  <p className="text-muted-foreground text-xs">
                    Submit repair requests and track progress in real-time
                  </p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="technician" className="mt-4 space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full">
                  <Wrench className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Grow your business</p>
                  <p className="text-muted-foreground text-xs">
                    Connect with customers and expand your repair service business
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </div>
  );
}
