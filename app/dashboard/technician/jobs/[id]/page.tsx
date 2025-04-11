"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function JobDetails({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for the job
  const job = {
    id: params.id,
    item: "Tablet",
    issue: "Battery replacement",
    description: "Battery drains very quickly and needs to be replaced.",
    customer: "Mike Johnson",
    date: "2024-04-05",
    status: "In Progress",
    estimate: "$85",
    timeEstimate: "2-3 days",
  };

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate form submission
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Status updated",
        description: "The job status has been updated successfully",
      });
      router.push("/dashboard/technician/jobs");
    }, 1500);
  };

  return (
    <DashboardLayout role="technician">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Job Details</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Job Information</CardTitle>
              <CardDescription>Details about the repair job</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Job ID</h3>
                  <p className="text-sm text-muted-foreground">{job.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Date Started</h3>
                  <p className="text-sm text-muted-foreground">{job.date}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium">Customer</h3>
                <p className="text-sm text-muted-foreground">{job.customer}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium">Item</h3>
                <p className="text-sm text-muted-foreground">{job.item}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium">Issue</h3>
                <p className="text-sm text-muted-foreground">{job.issue}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium">Description</h3>
                <p className="text-sm text-muted-foreground">
                  {job.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Cost Estimate</h3>
                  <p className="text-sm text-muted-foreground">
                    {job.estimate}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Time Estimate</h3>
                  <p className="text-sm text-muted-foreground">
                    {job.timeEstimate}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium">Current Status</h3>
                <Badge className="mt-1">{job.status}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <form onSubmit={handleUpdateStatus}>
              <CardHeader>
                <CardTitle>Update Job Status</CardTitle>
                <CardDescription>
                  Update the current status of this repair job
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">New Status</h3>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select new status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="waiting-parts">
                        Waiting for Parts
                      </SelectItem>
                      <SelectItem value="diagnostic">
                        Diagnostic Phase
                      </SelectItem>
                      <SelectItem value="repair">Repair Phase</SelectItem>
                      <SelectItem value="testing">Testing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Status Notes</h3>
                  <Textarea
                    placeholder="Provide details about the current status"
                    className="min-h-[120px]"
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Estimated Completion</h3>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select estimated completion" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="tomorrow">Tomorrow</SelectItem>
                      <SelectItem value="2-days">In 2 days</SelectItem>
                      <SelectItem value="3-days">In 3 days</SelectItem>
                      <SelectItem value="1-week">In 1 week</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    router.push(
                      `/dashboard/technician/jobs/${params.id}/report`,
                    )
                  }
                >
                  Create Report
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Status"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
