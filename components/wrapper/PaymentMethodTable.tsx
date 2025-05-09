'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/data-table';
import { usePaymentMethods } from '@/hooks/use-payment-methods';
import { Dialog, DialogTitle, DialogContent } from '@/components/ui/dialog';
import PaymentMethodForm from '@/components/screen/payment-method-form';
import { PaymentMethod } from '@/models/payment-method';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

type ValidPaymentMethodType = 'COD' | 'BANK_TRANSFER' | 'E_WALLET' | undefined;

export default function PaymentMethodTable({
  bindRefetch,
  paymentMethod = 'ALL',
  isActive = undefined,
}: {
  bindRefetch?: (fn: () => void) => void;
  paymentMethod?: string;
  isActive?: string;
}) {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);

  const { data, loading, totalPages, refetch } = usePaymentMethods(
    page,
    size,
    paymentMethod,
    isActive,
  );

  useEffect(() => {
    if (bindRefetch) {
      bindRefetch(refetch);
    }
  }, [refetch, bindRefetch]);

  if (loading)
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="h-[300px] w-full animate-pulse rounded-xl bg-gray-200 md:h-[300px]" />
      </div>
    );

  const validatePaymentMethodType = (method: string): ValidPaymentMethodType => {
    if (method === 'COD' || method === 'BANK_TRANSFER' || method === 'E_WALLET') {
      return method as ValidPaymentMethodType;
    }

    return undefined;
  };

  return (
    <div>
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="flex max-h-[90vh] flex-col p-0 sm:max-w-[600px] [&>Button]:hidden">
          <div className="sticky top-0 z-10 border-b px-6 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold">Edit Payment Method</DialogTitle>
              <button
                onClick={() => setEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label="Close">
                <X className="h-5 w-5 cursor-pointer" />
              </button>
            </div>
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto">
            {selectedPaymentMethod && (
              <PaymentMethodForm
                isEditMode
                defaultValues={{
                  id: selectedPaymentMethod.id,
                  name: selectedPaymentMethod.name,
                  description: selectedPaymentMethod.description,
                  processingFee: selectedPaymentMethod.processingFee,
                  createdBy: selectedPaymentMethod.created_by,
                  paymentMethod: validatePaymentMethodType(selectedPaymentMethod.paymentMethod),
                  accountName: selectedPaymentMethod.accountName ?? undefined,
                  accountNumber: selectedPaymentMethod.accountNumber ?? undefined,
                  bankName: selectedPaymentMethod.bankName ?? undefined,
                  virtualAccountNumber: selectedPaymentMethod.virtualAccountNumber ?? undefined,
                  phoneNumber: selectedPaymentMethod.phoneNumber ?? undefined,
                  instructions: selectedPaymentMethod.instructions ?? undefined,
                }}
                onSubmitted={() => {
                  setEditModalOpen(false);
                  refetch();
                }}
              />
            )}
          </div>

          <div className="bottom-0 z-10 flex justify-end gap-4 border-t px-6 py-4 shadow-sm">
            <Button
              variant="outline"
              onClick={() => setEditModalOpen(false)}
              className="w-32 cursor-pointer">
              Cancel
            </Button>
            <Button type="submit" form="payment-method-form" className="w-32 cursor-pointer">
              Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <DataTable
        data={data}
        currentPage={page}
        onPageChange={setPage}
        rowsPerPage={size}
        onRowsPerPageChange={setSize}
        totalPages={totalPages}
        onEditClick={(paymentMethod: PaymentMethod) => {
          setSelectedPaymentMethod(paymentMethod);
          setEditModalOpen(true);
        }}
      />
    </div>
  );
}
