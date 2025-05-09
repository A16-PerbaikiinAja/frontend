'use client';

import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createPaymentMethod, updatePaymentMethod } from '@/hooks/use-payment-methods';
import { PaymentMethodFormValues, paymentMethodSchema } from '@/models/payment-method';

type Props = {
  defaultValues?: Partial<PaymentMethodFormValues>;
  isEditMode?: boolean;
  onSubmitted?: () => void;
};

export default function PaymentMethodForm({
  defaultValues,
  isEditMode = false,
  onSubmitted,
}: Props) {
  const [uid, setUid] = useState('');

  const form = useForm<PaymentMethodFormValues>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      name: '',
      description: '',
      processingFee: 0,
      createdBy: '',
      paymentMethod: 'COD',
      ...defaultValues,
    },
  });

  const watchMethod = useWatch({ control: form.control, name: 'paymentMethod' });

  useEffect(() => {
    const storedUid = localStorage.getItem('uid');
    if (storedUid) {
      setUid(storedUid);
      form.setValue('createdBy', storedUid);
    }

    if (defaultValues) {
      Object.entries(defaultValues).forEach(([key, value]) => {
        form.setValue(key as keyof PaymentMethodFormValues, value as any);
      });
    }
  }, [form, defaultValues]);

  const onSubmit = async (values: PaymentMethodFormValues) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token');
      return;
    }

    try {
      if (isEditMode) {
        await updatePaymentMethod(values, token);
      } else {
        await createPaymentMethod(values, token);
      }

      form.reset();
      onSubmitted?.();
    } catch (err: any) {
      console.error('Failed to submit:', err.message);
    }
  };

  return (
    <div className="max-h-[100vh] px-4 pb-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-w-2xl space-y-6"
          id="payment-method-form">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="processingFee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Processing Fee</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Method</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isEditMode}>
                  <FormControl className="cursor-pointer">
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="COD" className="cursor-pointer">
                      COD
                    </SelectItem>
                    <SelectItem value="BANK_TRANSFER" className="cursor-pointer">
                      Bank Transfer
                    </SelectItem>
                    <SelectItem value="E_WALLET" className="cursor-pointer">
                      E-Wallet
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {isEditMode && (
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl className="cursor-pointer">
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ACTIVE" className="cursor-pointer">
                        Active
                      </SelectItem>
                      <SelectItem value="INACTIVE" className="cursor-pointer">
                        Inactive
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {(watchMethod === 'BANK_TRANSFER' || watchMethod === 'E_WALLET') && (
            <FormField
              control={form.control}
              name="accountName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {watchMethod === 'BANK_TRANSFER' && (
            <>
              <FormField
                control={form.control}
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bankName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {watchMethod === 'E_WALLET' && (
            <FormField
              control={form.control}
              name="virtualAccountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Virtual Account Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {watchMethod === 'COD' && (
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {(watchMethod === 'COD' || watchMethod === 'E_WALLET') && (
            <FormField
              control={form.control}
              name="instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instructions</FormLabel>
                  <FormControl>
                    <Textarea rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* <Button type="submit">{isEditMode ? "Update" : "Submit"}</Button> */}
        </form>
      </Form>
    </div>
  );
}
