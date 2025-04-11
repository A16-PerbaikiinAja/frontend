"use client";

import type React from "react";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function RepairRequestDetails({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for the repair request
  const request = {
    id: params.id,
    item: "Laptop",
    issue: "Won't turn on",
    description:
      "My laptop suddenly stopped turning on yesterday. The power light doesn't come on when I press the power button, even when it's plugged in.",
    customer: "John Doe",
    date: "2024-04-10",
    preferredDate: "2024-04-15",
    status: "Pending",
  };

  const handleAccept = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate form submission
    setTimeout(() => {
      setIsLoading(false);
      toast("Request accepted", {
        description:
          "You have accepted the repair request and provided an estimate",
      });
      router.push("/dashboard/technician/jobs");
    }, 1500);
  };

  const handleDecline = () => {
    setIsLoading(true);

    // Simulate decline process
    setTimeout(() => {
      setIsLoading(false);
      toast("Request declined", {
        description: "You have declined the repair request",
      });
      router.push("/dashboard/technician/requests");
    }, 1500);
  };

  return (
    <DashboardLayout role="technician">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            Repair Request Details
          </h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Request Information</CardTitle>
              <CardDescription>
                Details about the repair request
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Request ID</h3>
                  <p className="text-sm text-muted-foreground">{request.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Date Submitted</h3>
                  <p className="text-sm text-muted-foreground">
                    {request.date}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium">Customer</h3>
                <p className="text-sm text-muted-foreground">
                  {request.customer}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium">Item</h3>
                <p className="text-sm text-muted-foreground">{request.item}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium">Issue</h3>
                <p className="text-sm text-muted-foreground">{request.issue}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium">Description</h3>
                <p className="text-sm text-muted-foreground">
                  {request.description}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium">Preferred Repair Date</h3>
                <p className="text-sm text-muted-foreground">
                  {request.preferredDate}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <form onSubmit={handleAccept}>
              <CardHeader>
                <CardTitle>Provide Estimate</CardTitle>
                <CardDescription>
                  Accept the request and provide a cost and time estimate
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cost-estimate">Cost Estimate ($)</Label>
                  <Input
                    id="cost-estimate"
                    type="number"
                    min="0"
                    placeholder="150"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time-estimate">
                    Estimated Completion Time
                  </Label>
                  <Select required>
                    <SelectTrigger id="time-estimate">
                      <SelectValue placeholder="Select time estimate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-day">1 day</SelectItem>
                      <SelectItem value="2-3-days">2-3 days</SelectItem>
                      <SelectItem value="3-5-days">3-5 days</SelectItem>
                      <SelectItem value="1-week">1 week</SelectItem>
                      <SelectItem value="2-weeks">2 weeks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parts-needed">Parts Needed (Optional)</Label>
                  <Textarea
                    id="parts-needed"
                    placeholder="List any parts that need to be ordered"
                    className="min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional information for the customer"
                    className="min-h-[80px]"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDecline}
                  disabled={isLoading}
                >
                  Decline Request
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Processing..." : "Accept & Send Estimate"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
