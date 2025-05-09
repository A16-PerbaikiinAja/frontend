import { z } from 'zod';

export type PaymentMethod = {
  id: string;
  name: string;
  description: string;
  processingFee: number;
  paymentMethod: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  accountName: string | null;
  accountNumber: string | null;
  bankName: string | null;
  virtualAccountNumber: string | null;
  phoneNumber: string | null;
  instructions: string | null;
};

const baseSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  description: z.string().min(1),
  processingFee: z.coerce.number().min(0),
  createdBy: z.string().min(1),
  paymentMethod: z.enum(['COD', 'BANK_TRANSFER', 'E_WALLET']),
  accountName: z.string().optional(),
  accountNumber: z.string().optional(),
  bankName: z.string().optional(),
  virtualAccountNumber: z.string().optional(),
  phoneNumber: z.string().optional(),
  instructions: z.string().optional(),
  status: z.string().min(1),
});

export const paymentMethodSchema = baseSchema.superRefine((data, ctx) => {
  if (data.paymentMethod === 'COD') {
    if (!data.phoneNumber)
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Phone number is required',
        path: ['phoneNumber'],
      });
    if (!data.instructions)
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Instructions are required',
        path: ['instructions'],
      });
  }

  if (data.paymentMethod === 'BANK_TRANSFER') {
    if (!data.accountName)
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Account Name is required',
        path: ['accountName'],
      });
    if (!data.accountNumber)
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Account Number is required',
        path: ['accountNumber'],
      });
    if (!data.bankName)
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Bank Name is required',
        path: ['bankName'],
      });
  }

  if (data.paymentMethod === 'E_WALLET') {
    if (!data.accountName)
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Account Name is required',
        path: ['accountName'],
      });
    if (!data.virtualAccountNumber)
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Virtual Account Number is required',
        path: ['virtualAccountNumber'],
      });
    if (!data.instructions)
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Instructions are required',
        path: ['instructions'],
      });
  }
});

export type PaymentMethodFormValues = z.infer<typeof paymentMethodSchema>;
