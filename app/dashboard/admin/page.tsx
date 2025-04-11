import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DollarSign, ShieldCheck, Tag, Users, Wrench } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  // Mock data
  const technicians = [
    {
      id: 1,
      name: "Alex Smith",
      specialty: "Electronics",
      status: "Active",
      jobs: 124,
      rating: 4.9,
    },
    {
      id: 2,
      name: "Jane Doe",
      specialty: "Computers",
      status: "Active",
      jobs: 98,
      rating: 4.8,
    },
    {
      id: 3,
      name: "Mike Johnson",
      specialty: "Mobile Devices",
      status: "Inactive",
      jobs: 87,
      rating: 4.7,
    },
  ];

  const coupons = [
    {
      id: "COUPON-001",
      code: "SPRING2024",
      discount: "15%",
      status: "Active",
      usageCount: 45,
      expiry: "2024-06-30",
    },
    {
      id: "COUPON-002",
      code: "NEWUSER",
      discount: "20%",
      status: "Active",
      usageCount: 78,
      expiry: "2024-05-15",
    },
  ];

  const reports = [
    {
      id: "REP-001",
      technician: "Alex Smith",
      customer: "John Doe",
      item: "Laptop",
      date: "2024-04-01",
    },
    {
      id: "REP-002",
      technician: "Jane Doe",
      customer: "Sarah Williams",
      item: "Smartphone",
      date: "2024-03-28",
    },
  ];

  return (
    <DashboardLayout role="admin">
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Technicians
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{technicians.length}</div>
              <p className="text-xs text-muted-foreground">
                {technicians.filter((t) => t.status === "Active").length} active
                technicians
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Coupons
              </CardTitle>
              <Tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {coupons.filter((c) => c.status === "Active").length}
              </div>
              <p className="text-xs text-muted-foreground">
                {coupons.reduce((acc, c) => acc + c.usageCount, 0)} total
                redemptions
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Repair Reports
              </CardTitle>
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reports.length}</div>
              <p className="text-xs text-muted-foreground">
                {reports.length} new reports this month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Platform Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,450</div>
              <p className="text-xs text-muted-foreground">
                +23% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="technicians" className="space-y-4">
          <TabsList>
            <TabsTrigger value="technicians">Technicians</TabsTrigger>
            <TabsTrigger value="coupons">Coupons</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="technicians" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Technician Management</CardTitle>
                  <CardDescription>
                    Manage technician accounts and permissions
                  </CardDescription>
                </div>
                <Link href="/dashboard/admin/technicians/new">
                  <Button>
                    <Wrench className="mr-2 h-4 w-4" />
                    Add Technician
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {technicians.map((tech) => (
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
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant={
                              tech.status === "Active" ? "default" : "secondary"
                            }
                          >
                            {tech.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {tech.jobs} jobs completed
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Rating: {tech.rating}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/dashboard/admin/technicians/${tech.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="coupons" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Coupon Management</CardTitle>
                  <CardDescription>
                    Create and manage discount coupons
                  </CardDescription>
                </div>
                <Link href="/dashboard/admin/coupons/new">
                  <Button>
                    <Tag className="mr-2 h-4 w-4" />
                    Create Coupon
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {coupons.map((coupon) => (
                    <div
                      key={coupon.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {coupon.code}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Discount: {coupon.discount}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant={
                              coupon.status === "Active"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {coupon.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Used {coupon.usageCount} times
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Expires: {coupon.expiry}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Repair Reports</CardTitle>
                <CardDescription>
                  View technician-submitted repair reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {report.id}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Technician: {report.technician}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Customer: {report.customer}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Item: {report.item}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Date: {report.date}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/dashboard/admin/reports/${report.id}`}>
                          <Button variant="outline" size="sm">
                            View Report
                          </Button>
                        </Link>
                      </div>
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
