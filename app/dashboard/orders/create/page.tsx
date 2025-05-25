'use client';

import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar, 
  Loader2, 
  Percent, 
  Settings, 
  Wrench, 
  CreditCard, 
  Info, 
  FileText,
  User
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function ServiceOrderPage() {
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
  const [formFocused, setFormFocused] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  interface Technician {
    id: string;
    name: string;
    imageUrl: string;
    specialty: string;
    rating: number;
    reviews: number;
  }

  const [technicians, setTechnicians] = useState<Technician[]>([]);

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const reviewApiUrl = `${process.env.NEXT_PUBLIC_REVIEW_API_URL}/technician-ratings`;
        console.log('Review API URL:', reviewApiUrl);
        
        const response = await fetch(reviewApiUrl);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch technicians.`);
        }

        const techniciansData = await response.json();
        console.log('Technicians Data:', techniciansData);

        if (!Array.isArray(techniciansData)) {
          throw new Error('Technicians data is not an array');
        }

        const formattedTechnicians = techniciansData.map((technician: any) => ({
          id: technician.technicianId,
          name: technician.fullName,
          specialty: technician.specialization || 'General Technician',
          rating: technician.averageRating || 0,
          reviews: technician.totalReviews || 0,
          imageUrl: technician.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(technician.fullName)}&background=random`,
        }));

        setTechnicians(formattedTechnicians);
      } catch (error) {
        console.error('Error fetching technicians:', error);
        toast.error('Failed to load technicians. Please try again later.');
      }
    };

    fetchTechnicians();
  }, []);

  const paymentMethods = [
    { id: '123e4567-e89b-12d3-a456-426614174001', name: 'Transfer Bank' },
    { id: '123e4567-e89b-12d3-a456-426614174002', name: 'Kartu Kredit/Debit' },
    { id: '123e4567-e89b-12d3-a456-426614174003', name: 'E-Wallet' },
    { id: '123e4567-e89b-12d3-a456-426614174004', name: 'Bayar di Tempat' },
  ];

  const coupons = [
    { id: '123e4567-e89b-12d3-a456-426614174001', code: 'WELCOME10', discount: '10%', valid: true },
    { id: '123e4567-e89b-12d3-a456-426614174002', code: 'REPAIR20', discount: '20%', valid: true },
    { id: '123e4567-e89b-12d3-a456-426614174003', code: 'FIRST50', discount: 'Rp50.000', valid: false },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateStep1 = () => {
    const newErrors: Partial<Record<string, string>> = {};
    
    if (!formData.itemName.trim()) 
      newErrors.itemName = 'Item name is required';
      
    if (!formData.itemCondition.trim()) 
      newErrors.itemCondition = 'Item condition must be described';
      
    if (!formData.repairDetails.trim())
      newErrors.repairDetails = 'Repair details are required';
      
    if (!formData.serviceDate.trim())
      newErrors.serviceDate = 'Service date must be selected';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Partial<Record<string, string>> = {};
    
    if (!formData.technicianId)
      newErrors.technicianId = 'Please select a technician';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Partial<Record<string, string>> = {};
    
    if (!formData.paymentMethodId)
      newErrors.paymentMethodId = 'Payment method is required';

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
      const orderData = {
        itemName: formData.itemName,
        itemCondition: formData.itemCondition,
        repairDetails: formData.repairDetails,
        serviceDate: formData.serviceDate,
        technicianId: formData.technicianId,
        paymentMethodId: formData.paymentMethodId,
        couponId: formData.couponId || null,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      console.log('Sending order data:', orderData);

      const response = await fetch(`${process.env.NEXT_PUBLIC_ORDER_API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        
        if (response.status === 400) {
          toast.error(errorData?.message || 'Invalid request data');
        } else if (response.status === 401) {
          toast.error('Unauthorized. Please login again.');
        } else if (response.status === 500) {
          toast.error('Server error. Please try again later.');
        } else {
          toast.error(`Request failed with status: ${response.status}`);
        }
        
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      
      console.log('Order created successfully:', responseData);
      toast.success('Order successfully created!');
      
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
      
    } catch (error) {
      console.error('Error creating order:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error('Failed to create order. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
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
    { number: 1, title: 'Item Details' },
    { number: 2, title: 'Technician' },
    { number: 3, title: 'Payment' },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background">
      <motion.div
        className="w-full max-w-2xl px-4 py-8 md:px-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}>
        
        <motion.div
          className="mb-8 flex items-center"
          variants={itemVariants}>
          <Link
            href="/dashboard"
            className="text-primary hover:text-primary/90 flex items-center gap-2 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </Link>
        </motion.div>

        <motion.div className="space-y-8" variants={containerVariants}>
          <motion.div className="space-y-2 text-center" variants={itemVariants}>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Wrench className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Service Order Form</h1>
            <p className="text-muted-foreground text-sm">Fill in the details of your repair request</p>
          </motion.div>

          <motion.div variants={itemVariants}>
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
          </motion.div>

          <motion.div className="rounded-lg border border-border bg-card p-6 shadow-sm" variants={itemVariants}>
            <motion.form onSubmit={handleSubmit} className="space-y-6" variants={containerVariants}>
              
              {/* Step 1: Item Details */}
              {currentStep === 1 && (
                <motion.div
                  className="space-y-6"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={stepVariants}>
                  <motion.div className="space-y-2" variants={itemVariants}>
                    <Label
                      htmlFor="itemName"
                      className={`flex items-center gap-2 text-sm transition-colors duration-200 ${
                        formFocused === 'itemName' ? 'text-primary' : ''
                      }`}>
                      <Settings className="h-3.5 w-3.5" />
                      Item Name
                    </Label>
                    <div className="relative">
                      <Input
                        id="itemName"
                        name="itemName"
                        value={formData.itemName}
                        onChange={handleInputChange}
                        onFocus={() => setFormFocused('itemName')}
                        onBlur={() => setFormFocused(null)}
                        placeholder="Enter the name of the item to be repaired"
                        className={`transition-all duration-200 ${
                          errors.itemName
                            ? 'border-destructive'
                            : formFocused === 'itemName'
                            ? 'border-primary ring-primary ring-1'
                            : ''
                        }`}
                        required
                      />
                      {errors.itemName && (
                        <motion.p
                          className="text-destructive mt-1 text-sm"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}>
                          {errors.itemName}
                        </motion.p>
                      )}
                    </div>
                  </motion.div>

                  <motion.div className="space-y-2" variants={itemVariants}>
                    <Label
                      htmlFor="itemCondition"
                      className={`flex items-center gap-2 text-sm transition-colors duration-200 ${
                        formFocused === 'itemCondition' ? 'text-primary' : ''
                      }`}>
                      <Info className="h-3.5 w-3.5" />
                      Item Condition
                    </Label>
                    <div className="relative">
                      <Textarea
                        id="itemCondition"
                        name="itemCondition"
                        value={formData.itemCondition}
                        onChange={handleInputChange}
                        onFocus={() => setFormFocused('itemCondition')}
                        onBlur={() => setFormFocused(null)}
                        rows={3}
                        placeholder="Describe the current condition of the item in detail"
                        className={`transition-all duration-200 ${
                          errors.itemCondition
                            ? 'border-destructive'
                            : formFocused === 'itemCondition'
                            ? 'border-primary ring-primary ring-1'
                            : ''
                        }`}
                        required
                      />
                      {errors.itemCondition && (
                        <motion.p
                          className="text-destructive mt-1 text-sm"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}>
                          {errors.itemCondition}
                        </motion.p>
                      )}
                      <p className="text-muted-foreground mt-1 text-xs">
                        Explain any damage or issues with your item
                      </p>
                    </div>
                  </motion.div>

                  <motion.div className="space-y-2" variants={itemVariants}>
                    <Label
                      htmlFor="repairDetails"
                      className={`flex items-center gap-2 text-sm transition-colors duration-200 ${
                        formFocused === 'repairDetails' ? 'text-primary' : ''
                      }`}>
                      <FileText className="h-3.5 w-3.5" />
                      Repair Details
                    </Label>
                    <div className="relative">
                      <Textarea
                        id="repairDetails"
                        name="repairDetails"
                        value={formData.repairDetails}
                        onChange={handleInputChange}
                        onFocus={() => setFormFocused('repairDetails')}
                        onBlur={() => setFormFocused(null)}
                        rows={4}
                        placeholder="Describe the repair service you need"
                        className={`transition-all duration-200 ${
                          errors.repairDetails
                            ? 'border-destructive'
                            : formFocused === 'repairDetails'
                            ? 'border-primary ring-primary ring-1'
                            : ''
                        }`}
                        required
                      />
                      {errors.repairDetails && (
                        <motion.p
                          className="text-destructive mt-1 text-sm"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}>
                          {errors.repairDetails}
                        </motion.p>
                      )}
                      <p className="text-muted-foreground mt-1 text-xs">
                        Specify what parts need to be repaired and your expected outcome
                      </p>
                    </div>
                  </motion.div>
                  
                  <motion.div className="space-y-2" variants={itemVariants}>
                    <Label
                      htmlFor="serviceDate"
                      className={`flex items-center gap-2 text-sm transition-colors duration-200 ${
                        formFocused === 'serviceDate' ? 'text-primary' : ''
                      }`}>
                      <Calendar className="h-3.5 w-3.5" />
                      Service Date
                    </Label>
                    <div className="relative">
                      <Input
                        id="serviceDate"
                        name="serviceDate"
                        type="date"
                        value={formData.serviceDate}
                        onChange={handleInputChange}
                        onFocus={() => setFormFocused('serviceDate')}
                        onBlur={() => setFormFocused(null)}
                        className={`transition-all duration-200 ${
                          errors.serviceDate
                            ? 'border-destructive'
                            : formFocused === 'serviceDate'
                            ? 'border-primary ring-primary ring-1'
                            : ''
                        }`}
                        required
                      />
                      {errors.serviceDate && (
                        <motion.p
                          className="text-destructive mt-1 text-sm"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}>
                          {errors.serviceDate}
                        </motion.p>
                      )}
                      <p className="text-muted-foreground mt-1 text-xs">
                        Enter your preferred service date
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  className="space-y-6"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={stepVariants}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Select a Technician</h3>
                      {errors.technicianId && (
                        <motion.p
                          className="text-destructive text-sm"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}>
                          {errors.technicianId}
                        </motion.p>
                      )}
                    </div>
                    
                    <div className="grid gap-4">
                      {technicians.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                          Loading technicians...
                        </div>
                      ) : (
                        technicians.map((technician) => (
                          <motion.div
                            key={technician.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            variants={itemVariants}>
                            <Card 
                              className={`cursor-pointer transition-all overflow-hidden relative ${
                                formData.technicianId === technician.id
                                  ? 'border-primary ring-1 ring-primary'
                                  : 'hover:border-muted-foreground/50'
                              }`}
                              onClick={() => handleSelectChange('technicianId', technician.id)}>
                              <CardContent className="p-4 flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                  <AvatarImage src={technician.imageUrl} alt={technician.name} />
                                  <AvatarFallback>{technician.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <h4 className="font-medium">{technician.name}</h4>
                                      <p className="text-muted-foreground text-sm">{technician.specialty}</p>
                                    </div>
                                    <div className="text-right">
                                      <div className="flex items-center gap-1">
                                        <span className="text-yellow-500">★</span>
                                        <span className="font-medium">{technician.rating}</span>
                                        <span className="text-muted-foreground text-xs">({technician.reviews} reviews)</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="mt-2">
                                    <Badge variant="outline" className="text-xs">
                                      Available
                                    </Badge>
                                  </div>
                                </div>
                                {formData.technicianId === technician.id && (
                                  <div className="absolute inset-y-0 right-4 flex items-center">
                                    <div className="bg-primary text-primary-foreground h-6 w-6 rounded-full flex items-center justify-center">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2}
                                        stroke="currentColor"
                                        className="h-4 w-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                      </svg>
                                    </div>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  className="space-y-6"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={stepVariants}>
                  <motion.div className="space-y-2" variants={itemVariants}>
                    <Label
                      htmlFor="paymentMethodId"
                      className={`flex items-center gap-2 text-sm transition-colors duration-200 ${
                        formFocused === 'paymentMethodId' ? 'text-primary' : ''
                      }`}>
                      <CreditCard className="h-3.5 w-3.5" />
                      Metode Pembayaran
                    </Label>
                    <div className="relative">
                      <Select
                        value={formData.paymentMethodId}
                        onValueChange={(value) => handleSelectChange('paymentMethodId', value)}
                        onOpenChange={(open) => {
                          if (open) setFormFocused('paymentMethodId');
                          else setFormFocused(null);
                        }}>
                        <SelectTrigger
                          className={`w-full transition-all duration-200 ${
                            errors.paymentMethodId
                              ? 'border-destructive'
                              : formFocused === 'paymentMethodId'
                              ? 'border-primary ring-primary ring-1'
                              : ''
                          }`}>
                          <SelectValue placeholder="Select your payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          {paymentMethods.map(method => (
                            <SelectItem key={method.id} value={method.id}>{method.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.paymentMethodId && (
                        <motion.p
                          className="text-destructive mt-1 text-sm"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}>
                          {errors.paymentMethodId}
                        </motion.p>
                      )}
                    </div>
                  </motion.div>
                  
                  <motion.div className="space-y-4" variants={itemVariants}>
                    <Label className="flex items-center gap-2 text-sm">
                      <Percent className="h-3.5 w-3.5" />
                      Available Coupons
                    </Label>
                    
                    <div className="grid gap-3">
                      {coupons.map((coupon) => (
                        <motion.div
                          key={coupon.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}>
                          <Card 
                            className={`cursor-pointer transition-all ${
                              !coupon.valid ? 'opacity-50' : 
                              formData.couponId === coupon.id
                                ? 'border-primary ring-1 ring-primary'
                                : 'hover:border-muted-foreground/50'
                            }`}
                            onClick={() => coupon.valid && handleSelectChange('couponId', coupon.id)}>
                            <CardContent className="p-3 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="bg-primary/10 text-primary h-10 w-10 rounded-full flex items-center justify-center">
                                  <Percent className="h-5 w-5" />
                                </div>
                                <div>
                                  <h4 className="font-medium">{coupon.code}</h4>
                                  <p className="text-muted-foreground text-sm">Discount: {coupon.discount}</p>
                                </div>
                              </div>
                              {formData.couponId === coupon.id && (
                                <div className="bg-primary text-primary-foreground h-6 w-6 rounded-full flex items-center justify-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    className="h-4 w-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                  </svg>
                                </div>
                              )}
                              {!coupon.valid && (
                                <Badge variant="outline" className="text-xs text-muted-foreground">
                                  Expired
                                </Badge>
                              )}
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div className="pt-2" variants={itemVariants}>
                    <div className="flex items-start space-x-3">
                      <Checkbox id="terms" required />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor="terms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          I agree to the terms and conditions
                        </label>
                        <p className="text-muted-foreground text-xs">
                          By checking this box, you agree to our terms and conditions
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              <motion.div className="flex justify-between pt-4" variants={itemVariants}>
                {currentStep > 1 ? (
                  <Button variant="outline" onClick={prevStep} className="w-24">
                    Back
                  </Button>
                ) : (
                  <div className="w-24"></div>
                )}

                {currentStep < 3 ? (
                  <Button onClick={nextStep} className="group relative w-24 overflow-hidden">
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
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative w-32 overflow-hidden">
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Creating...</span>
                      </span>
                    ) : (
                      <>
                        <span>Create Order</span>
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
            </motion.form>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}