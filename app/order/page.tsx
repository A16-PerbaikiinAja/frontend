'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Loader2, Percent, Settings, Wrench, CreditCard, Info, FileText } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

export default function ServiceOrderPage() {
  const [formData, setFormData] = useState({
    itemName: '',
    itemCondition: '',
    repairDetails: '',
    serviceDate: '',
    paymentMethodId: '',
    couponId: '',
  });
  
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [formFocused, setFormFocused] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const validateForm = () => {
    const newErrors: Partial<Record<string, string>> = {};
    
    if (!formData.itemName.trim()) 
      newErrors.itemName = 'Nama barang tidak boleh kosong';
      
    if (!formData.itemCondition.trim()) 
      newErrors.itemCondition = 'Kondisi barang harus dijelaskan';
      
    if (!formData.repairDetails.trim())
      newErrors.repairDetails = 'Detail perbaikan tidak boleh kosong';
      
    if (!formData.serviceDate.trim())
      newErrors.serviceDate = 'Tanggal layanan harus dipilih';
      
    if (!formData.paymentMethodId)
      newErrors.paymentMethodId = 'Pilih metode pembayaran';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Mohon isi semua field yang wajib diisi');
      return;
    }
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      console.log('Form submitted:', formData);
      toast.success('Order berhasil dibuat!');
      setIsSubmitting(false);
      
      setFormData({
        itemName: '',
        itemCondition: '',
        repairDetails: '',
        serviceDate: '',
        paymentMethodId: '',
        couponId: '',
      });
    }, 1500);
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
            <span className="text-sm font-medium">Kembali ke Dashboard</span>
          </Link>
        </motion.div>

        <motion.div className="space-y-8" variants={containerVariants}>
          <motion.div className="space-y-2 text-center" variants={itemVariants}>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Wrench className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Form Order Perbaikan</h1>
            <p className="text-muted-foreground text-sm">Isi detail permintaan perbaikan Anda</p>
          </motion.div>

          <motion.div className="rounded-lg border border-border bg-card p-6 shadow-sm" variants={itemVariants}>
            <motion.form onSubmit={handleSubmit} className="space-y-6" variants={containerVariants}>

              <motion.div className="space-y-2" variants={itemVariants}>
                <Label
                  htmlFor="itemName"
                  className={`flex items-center gap-2 text-sm transition-colors duration-200 ${
                    formFocused === 'itemName' ? 'text-primary' : ''
                  }`}>
                  <Settings className="h-3.5 w-3.5" />
                  Nama Barang
                </Label>
                <div className="relative">
                  <Input
                    id="itemName"
                    name="itemName"
                    value={formData.itemName}
                    onChange={handleInputChange}
                    onFocus={() => setFormFocused('itemName')}
                    onBlur={() => setFormFocused(null)}
                    placeholder="Masukkan nama barang yang akan diperbaiki"
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
                  Kondisi Barang
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
                    placeholder="Deskripsikan kondisi barang saat ini secara detail"
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
                    Jelaskan kerusakan atau masalah pada barang Anda
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
                  Detail Perbaikan
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
                    placeholder="Jelaskan layanan perbaikan yang Anda inginkan"
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
                    Sebutkan bagian apa yang perlu diperbaiki dan hasil yang diharapkan
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
                  Tanggal Layanan
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
                    Pilih tanggal yang Anda inginkan untuk layanan perbaikan
                  </p>
                </div>
              </motion.div>

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
                      <SelectValue placeholder="Pilih metode pembayaran" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="123e4567-e89b-12d3-a456-426614174001">Transfer Bank</SelectItem>
                      <SelectItem value="123e4567-e89b-12d3-a456-426614174002">Kartu Kredit/Debit</SelectItem>
                      <SelectItem value="123e4567-e89b-12d3-a456-426614174003">E-Wallet</SelectItem>
                      <SelectItem value="123e4567-e89b-12d3-a456-426614174004">Bayar di Tempat</SelectItem>
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

              <motion.div className="space-y-2" variants={itemVariants}>
                <Label
                  htmlFor="couponId"
                  className={`flex items-center gap-2 text-sm transition-colors duration-200 ${
                    formFocused === 'couponId' ? 'text-primary' : ''
                  }`}>
                  <Percent className="h-3.5 w-3.5" />
                  Kode Kupon
                </Label>
                <div className="relative">
                  <Input
                    id="couponId"
                    name="couponId"
                    value={formData.couponId}
                    onChange={handleInputChange}
                    onFocus={() => setFormFocused('couponId')}
                    onBlur={() => setFormFocused(null)}
                    placeholder="Masukkan kode kupon jika ada"
                    className={`transition-all duration-200 ${
                      formFocused === 'couponId' ? 'border-primary ring-primary ring-1' : ''
                    }`}
                  />
                </div>
              </motion.div>

              <motion.div className="pt-2" variants={itemVariants}>
                <div className="flex items-start space-x-3">
                  <Checkbox id="terms" required />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Saya setuju dengan syarat dan ketentuan layanan
                    </label>
                    <p className="text-muted-foreground text-xs">
                      Dengan mencentang kotak ini, Anda menyetujui syarat dan ketentuan kami.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full overflow-hidden">
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Memproses...</span>
                    </span>
                  ) : (
                    <>
                      <span>Kirim Order</span>
                      <motion.span
                        className="absolute inset-0 bg-white/10"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.5 }}
                      />
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.form>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}