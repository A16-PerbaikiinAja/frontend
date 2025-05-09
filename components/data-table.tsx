import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { PaymentMethod } from '@/models/payment-method';
import { deletePaymentMethod } from '@/hooks/use-payment-methods';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Dialog, DialogTitle, DialogContent } from '@/components/ui/dialog';

interface DataTableProps {
  data: PaymentMethod[];
  currentPage: number;
  onPageChange: (page: number) => void;
  rowsPerPage: number;
  onRowsPerPageChange: (size: number) => void;
  totalPages: number;
  setTableRefetch?: (fn: () => void) => void;
  onEditClick: (paymentMethod: PaymentMethod) => void;
}

export function DataTable({
  data,
  currentPage,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,
  totalPages,
  onEditClick,
}: DataTableProps) {
  const [tableData, setTableData] = useState<PaymentMethod[]>([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onRowsPerPageChange(Number(e.target.value));
    onPageChange(0);
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await deletePaymentMethod(id);

      if (result.status === 'success') {
        setTableData((prevData) =>
          prevData.map((item) =>
            item.id === id ? { ...item, deleted_at: new Date().toISOString() } : item,
          ),
        );
      } else {
        alert('Error: ' + result.message);
      }
    } catch (err) {
      alert('Failed to delete: ' + err);
    }
  };

  const trimString = (input: string | null | undefined): string => {
    if (!input) return '';
    const trimmed = input.slice(0, 30);
    return trimmed + (input.length > 30 ? '...' : '');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  return (
    <div className="space-y-4">
      <Dialog open={!!confirmDeleteId} onOpenChange={(open) => !open && setConfirmDeleteId(null)}>
        <DialogContent className="max-w-sm [&>Button]:hidden">
          <DialogTitle>Are you sure?</DialogTitle>
          <div className="text-muted-foreground text-sm">
            This action will mark the payment method as inactive. Edit the data to make it active.
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setConfirmDeleteId(null)}
              className="cursor-pointer">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (confirmDeleteId) {
                  await handleDelete(confirmDeleteId);
                  setConfirmDeleteId(null);
                }
              }}
              className="cursor-pointer">
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="overflow-hidden rounded-xl border shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead className="w-16 px-6">No</TableHead>
                <TableHead className="px-6">Name</TableHead>
                <TableHead className="px-6">Description</TableHead>
                <TableHead className="px-6">Type</TableHead>
                <TableHead className="px-6">Processing Fee</TableHead>
                <TableHead className="px-6">Status</TableHead>
                <TableHead className="w-10 px-6 text-center">Option</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-muted-foreground py-8 text-center">
                    No data available.
                  </TableCell>
                </TableRow>
              ) : (
                tableData.map((row, i) => (
                  <TableRow key={row.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="px-6">{currentPage * rowsPerPage + i + 1}</TableCell>
                    <TableCell className="px-6">{row.name}</TableCell>
                    <TableCell className="max-w-xs truncate px-6">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>{trimString(row.description)}</TooltipTrigger>
                          <TooltipContent>
                            <p>{row.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="px-6">
                      {row.paymentMethod === 'BANK_TRANSFER'
                        ? 'Bank Transfer'
                        : row.paymentMethod === 'E_WALLET'
                          ? 'E-Wallet'
                          : row.paymentMethod}
                    </TableCell>
                    <TableCell className="px-6">{row.processingFee}</TableCell>
                    <TableCell className="px-6">
                      <TooltipProvider>
                        <Tooltip>
                          <div
                            className={`rounded-lg px-2 text-center font-semibold text-white ${row.deleted_at == null ? 'bg-green-500' : 'bg-red-500'}`}>
                            <TooltipTrigger>
                              {row.deleted_at == null ? 'Active' : 'Inactive'}
                            </TooltipTrigger>
                          </div>
                          <TooltipContent>
                            <p>
                              {row.deleted_at
                                ? 'Deleted at: ' + formatDate(row.deleted_at)
                                : 'Active'}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Pencil
                                className="text-muted-foreground h-4 w-4 cursor-pointer hover:text-blue-500"
                                onClick={() => onEditClick(row)}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Trash2
                                className={
                                  row.deleted_at
                                    ? 'hover:text-muted-foreground h-4 w-4 cursor-not-allowed opacity-50'
                                    : 'text-muted-foreground h-4 w-4 cursor-pointer hover:text-red-500'
                                }
                                onClick={
                                  row.deleted_at ? undefined : () => setConfirmDeleteId(row.id)
                                }
                              />
                            </TooltipTrigger>
                            {!row.deleted_at && (
                              <TooltipContent>
                                <p>{row.deleted_at ? '' : 'Delete'}</p>
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="rows-per-page" className="text-muted-foreground text-sm">
            Rows per page:
          </label>
          <select
            id="rows-per-page"
            value={rowsPerPage}
            onChange={handleChangeRowsPerPage}
            className="rounded-md border p-1 text-sm">
            {[10, 25, 50, 100].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">
            Page {totalPages === 0 ? 0 : currentPage + 1} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 0}
            onClick={() => onPageChange(currentPage - 1)}>
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage + 1 >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
