'use client';

import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Clock,
  PlusCircle,
  XCircle,
  AlertTriangle,
  ThumbsUp,
  Hammer,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type OrderStatus = 
  'PENDING' | 
  'WAITING_APPROVAL' | 
  'APPROVED' | 
  'IN_PROGRESS' |
  'COMPLETED' | 
  'REJECTED' | 
  'CANCELLED';

interface Order {
  id: string;
  itemName: string;
  repairDetails: string;
  serviceDate: string;
  status: OrderStatus;
  estimatedPrice?: number;
  finalPrice?: number;
  technician?: string;
  createdAt: string;
}

const mockOrders: Order[] = [
  {
    id: '2024-05-001',
    itemName: 'Samsung Galaxy S22',
    repairDetails: 'Screen replacement and battery upgrade',
    serviceDate: '2024-05-12',
    status: 'PENDING',
    estimatedPrice: 250,
    createdAt: '2024-05-04',
  },
  {
    id: '2024-05-002',
    itemName: 'MacBook Pro 2021',
    repairDetails: 'Keyboard replacement and system diagnostic',
    serviceDate: '2024-05-10',
    status: 'WAITING_APPROVAL',
    estimatedPrice: 350,
    technician: 'John Smith',
    createdAt: '2024-05-03',
  },
  {
    id: '2024-04-003',
    itemName: 'Sony 55" TV',
    repairDetails: 'Power issue troubleshooting',
    serviceDate: '2024-04-28',
    status: 'APPROVED',
    estimatedPrice: 150,
    technician: 'Mike Johnson',
    createdAt: '2024-04-25',
  },
  {
    id: '2024-04-004',
    itemName: 'Xiaomi Vacuum Cleaner',
    repairDetails: 'Motor replacement',
    serviceDate: '2024-04-20',
    status: 'IN_PROGRESS',
    estimatedPrice: 120,
    technician: 'Sarah Williams',
    createdAt: '2024-04-15',
  },
  {
    id: '2024-03-005',
    itemName: 'Dell XPS 15',
    repairDetails: 'Fan replacement and cooling system repair',
    serviceDate: '2024-03-25',
    status: 'REJECTED',
    estimatedPrice: 200,
    createdAt: '2024-03-20',
  },
  {
    id: '2024-03-006',
    itemName: 'iPhone 13',
    repairDetails: 'Camera module replacement',
    serviceDate: '2024-03-18',
    status: 'COMPLETED',
    estimatedPrice: 180,
    finalPrice: 180,
    technician: 'James Wilson',
    createdAt: '2024-03-15',
  },
  {
    id: '2024-03-007',
    itemName: 'Acer Laptop',
    repairDetails: 'Motherboard repair and memory upgrade',
    serviceDate: '2024-03-10',
    status: 'CANCELLED',
    estimatedPrice: 300,
    createdAt: '2024-03-08',
  },
];

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500';
    case 'WAITING_APPROVAL':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-500';
    case 'APPROVED':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500';
    case 'IN_PROGRESS':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-500';
    case 'COMPLETED':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500';
    case 'REJECTED':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500';
    case 'CANCELLED':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-500';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
  }
};

const getStatusIcon = (status: OrderStatus) => {
  switch (status) {
    case 'PENDING':
      return <Clock className="h-4 w-4" />;
    case 'WAITING_APPROVAL':
      return <AlertTriangle className="h-4 w-4" />;
    case 'APPROVED':
      return <ThumbsUp className="h-4 w-4" />;
    case 'IN_PROGRESS':
      return <Hammer className="h-4 w-4 animate-spin-slow" />;
    case 'COMPLETED':
      return <CheckCircle2 className="h-4 w-4" />;
    case 'REJECTED':
      return <XCircle className="h-4 w-4" />;
    case 'CANCELLED':
      return <XCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

export default function OrderHistoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOrders(mockOrders);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const filteredOrders = orders
    .filter((order) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          order.itemName.toLowerCase().includes(query) ||
          order.repairDetails.toLowerCase().includes(query) ||
          order.id.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .filter((order) => {
      if (statusFilter !== 'ALL') {
        return order.status === statusFilter;
      }
      return true;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="text-primary hover:text-primary/90 mr-4 flex items-center gap-2 transition-colors">
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm font-medium">Back to Dashboard</span>
              </Link>
              <h1 className="text-2xl font-bold tracking-tight">Order History</h1>
            </div>
            <Button asChild>
              <Link href="/order">
                <PlusCircle className="mr-2 h-4 w-4" />
                <span>New Order</span>
              </Link>
            </Button>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader className="pb-2">
                      <div className="h-6 w-32 rounded bg-muted"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-4 w-full rounded bg-muted"></div>
                      <div className="mt-2 h-4 w-2/3 rounded bg-muted"></div>
                    </CardContent>
                    <CardFooter>
                      <div className="h-6 w-20 rounded bg-muted"></div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : filteredOrders.length === 0 ? (
              <Card className="flex flex-col items-center justify-center p-8 text-center">
                <ClipboardList className="h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No orders found</h3>
                <p className="text-muted-foreground text-sm">
                  {searchQuery || statusFilter !== 'ALL'
                    ? 'Try adjusting your filters'
                    : 'Start by creating your first repair order'}
                </p>
                {!searchQuery && statusFilter === 'ALL' && (
                  <Button asChild className="mt-4">
                    <Link href="/order">Create New Order</Link>
                  </Button>
                )}
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredOrders.map((order) => (
                  <Card key={order.id} className="h-full overflow-hidden transition-all hover:shadow-md">
                    <Link
                      href={`/order-details/${order.id}`}
                      className="block h-full w-full"
                      onClick={(e) => {
                        e.preventDefault();
                        alert(`Navigating to order details: ${order.id}`);
                      }}>
                      <CardHeader className="pb-2">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <CardTitle className="text-lg">{order.itemName}</CardTitle>
                          <Badge
                            variant="outline"
                            className={`flex w-fit items-center gap-1 px-2 py-1 ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span>{order.status.replace('_', ' ')}</span>
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">Order ID: {order.id}</p>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground line-clamp-2 text-sm">{order.repairDetails}</p>
                        <div className="my-3 h-px w-full bg-border" />
                        <div className="flex flex-col gap-2 text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>Service Date: {order.serviceDate}</span>
                          </div>
                          {order.technician && (
                            <p className="text-muted-foreground text-sm">
                              Technician: {order.technician}
                            </p>
                          )}
                          <p className="font-medium">
                            {order.finalPrice
                              ? `Final Price: $${order.finalPrice}`
                              : order.estimatedPrice
                              ? `Est. Price: $${order.estimatedPrice}`
                              : 'Price pending'}
                          </p>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        {(order.status === 'PENDING' || order.status === 'WAITING_APPROVAL') && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              alert(`Cancel order: ${order.id}`);
                            }}>
                            Cancel
                          </Button>
                        )}
                      </CardFooter>
                    </Link>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}