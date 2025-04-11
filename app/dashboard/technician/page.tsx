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
import { DollarSign, Star, PenToolIcon as Tool, Wrench } from "lucide-react";
import Link from "next/link";

export default function TechnicianDashboard() {
  // Mock data
  const pendingRequests = [
    {
      id: "REQ-001",
      item: "Laptop",
      issue: "Won't turn on",
      customer: "John Doe",
      date: "2024-04-10",
    },
    {
      id: "REQ-002",
      item: "Smartphone",
      issue: "Cracked screen",
      customer: "Jane Smith",
      date: "2024-04-12",
    },
  ];

  const activeJobs = [
    {
      id: "JOB-001",
      item: "Tablet",
      issue: "Battery replacement",
      customer: "Mike Johnson",
      status: "In Progress",
      date: "2024-04-05",
    },
    {
      id: "JOB-002",
      item: "Desktop PC",
      issue: "Hardware upgrade",
      customer: "Sarah Williams",
      status: "Waiting for parts",
      date: "2024-04-03",
    },
  ];

  const recentReviews = [
    {
      id: 1,
      customer: "Alex Brown",
      rating: 5,
      comment: "Excellent service, fixed my laptop quickly!",
      date: "2024-04-01",
    },
    {
      id: 2,
      customer: "Emily Davis",
      rating: 4,
      comment: "Good work, but took a bit longer than expected.",
      date: "2024-03-28",
    },
  ];

  return (
    <DashboardLayout role="technician">
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Technician Dashboard
        </h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Requests
              </CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingRequests.length}</div>
              <p className="text-xs text-muted-foreground">
                {pendingRequests.length} new repair requests
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Tool className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeJobs.length}</div>
              <p className="text-xs text-muted-foreground">
                {activeJobs.length} jobs in progress
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Rating
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.8</div>
              <p className="text-xs text-muted-foreground">
                Based on 47 reviews
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Earnings
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2,450</div>
              <p className="text-xs text-muted-foreground">
                +15% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="requests" className="space-y-4">
          <TabsList>
            <TabsTrigger value="requests">Pending Requests</TabsTrigger>
            <TabsTrigger value="active">Active Jobs</TabsTrigger>
            <TabsTrigger value="reviews">Recent Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="requests" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Repair Requests</CardTitle>
                <CardDescription>
                  New repair requests awaiting your response
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingRequests.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {request.item} - {request.issue}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Request ID: {request.id}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Customer: {request.customer}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Date: {request.date}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Link
                          href={`/dashboard/technician/requests/${request.id}`}
                        >
                          <Button size="sm">View Details</Button>
                        </Link>
                        <Button variant="outline" size="sm">
                          Decline
                        </Button>
                      </div>
                    </div>
                  ))}
                  {pendingRequests.length === 0 && (
                    <div className="flex h-[120px] items-center justify-center rounded-lg border border-dashed">
                      <p className="text-sm text-muted-foreground">
                        No pending requests
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="active" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Jobs</CardTitle>
                <CardDescription>
                  Repair jobs currently in progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeJobs.map((job) => (
                    <div
                      key={job.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {job.item} - {job.issue}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Job ID: {job.id}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Customer: {job.customer}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{job.status}</Badge>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Link href={`/dashboard/technician/jobs/${job.id}`}>
                          <Button size="sm">Update Status</Button>
                        </Link>
                        <Link
                          href={`/dashboard/technician/jobs/${job.id}/report`}
                        >
                          <Button variant="outline" size="sm">
                            Create Report
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reviews" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Reviews</CardTitle>
                <CardDescription>
                  Latest feedback from your customers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentReviews.map((review) => (
                    <div key={review.id} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{review.customer}</p>
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < review.rating ? "fill-primary text-primary" : "text-muted-foreground"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="mt-2 text-sm">{review.comment}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {review.date}
                      </p>
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
