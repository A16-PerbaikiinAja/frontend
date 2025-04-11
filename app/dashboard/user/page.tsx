import { DashboardLayout } from "@/components/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  Package,
  Star,
  PenToolIcon as Tool,
  Wrench,
} from "lucide-react";
import Link from "next/link";

export default function UserDashboard() {
  // Mock data
  const activeOrders = [
    {
      id: "ORD-001",
      item: "Laptop",
      status: "In Progress",
      technician: "Alex Smith",
      date: "2024-04-05",
    },
    {
      id: "ORD-002",
      item: "Smartphone",
      status: "Pending",
      technician: "Pending",
      date: "2024-04-08",
    },
  ];

  const completedOrders = [
    {
      id: "ORD-003",
      item: "Tablet",
      status: "Completed",
      technician: "Jane Doe",
      date: "2024-03-28",
    },
    {
      id: "ORD-004",
      item: "Printer",
      status: "Completed",
      technician: "Mike Johnson",
      date: "2024-03-15",
    },
  ];

  const topTechnicians = [
    {
      id: 1,
      name: "Alex Smith",
      specialty: "Electronics",
      rating: 4.9,
      jobs: 124,
    },
    { id: 2, name: "Jane Doe", specialty: "Computers", rating: 4.8, jobs: 98 },
    {
      id: 3,
      name: "Mike Johnson",
      specialty: "Mobile Devices",
      rating: 4.7,
      jobs: 87,
    },
  ];

  return (
    <DashboardLayout role="user">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <Link href="/dashboard/user/orders/new">
            <Button>
              <Wrench className="mr-2 h-4 w-4" />
              New Repair Order
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Orders
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeOrders.length}</div>
              <p className="text-xs text-muted-foreground">
                {activeOrders.length > 0
                  ? `${activeOrders.length} orders in progress`
                  : "No active orders"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Completed Orders
              </CardTitle>
              <Tool className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedOrders.length}</div>
              <p className="text-xs text-muted-foreground">
                {completedOrders.length} repairs completed
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Favorite Technicians
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                3 technicians saved
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Next Appointment
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Apr 10</div>
              <p className="text-xs text-muted-foreground">
                Laptop repair with Alex Smith
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active">Active Orders</TabsTrigger>
            <TabsTrigger value="completed">Completed Orders</TabsTrigger>
            <TabsTrigger value="technicians">Top Technicians</TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Repair Orders</CardTitle>
                <CardDescription>
                  View and manage your current repair orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {order.item}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Order ID: {order.id}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Technician: {order.technician}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            order.status === "In Progress"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {order.status}
                        </Badge>
                        <Link href={`/dashboard/user/orders/${order.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                  {activeOrders.length === 0 && (
                    <div className="flex h-[120px] items-center justify-center rounded-lg border border-dashed">
                      <p className="text-sm text-muted-foreground">
                        No active orders
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="completed" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Completed Repair Orders</CardTitle>
                <CardDescription>View your repair history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {completedOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {order.item}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Order ID: {order.id}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Technician: {order.technician}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Completed</Badge>
                        <Link href={`/dashboard/user/orders/${order.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="technicians" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Technicians This Week</CardTitle>
                <CardDescription>
                  Highest rated repair specialists
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topTechnicians.map((tech) => (
                    <div
                      key={tech.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {tech.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Specialty: {tech.specialty}
                        </p>
                        <div className="flex items-center">
                          <Star className="mr-1 h-3 w-3 fill-primary text-primary" />
                          <span className="text-sm text-muted-foreground">
                            {tech.rating} ({tech.jobs} jobs)
                          </span>
                        </div>
                      </div>
                      <Link href={`/dashboard/user/technicians/${tech.id}`}>
                        <Button variant="outline" size="sm">
                          View Profile
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
