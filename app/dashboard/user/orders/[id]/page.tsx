"use client";

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
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Star, ChevronLeft, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function OrderDetails({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [rating, setRating] = useState(0);

  // Mock data for the order
  const order = {
    id: params.id,
    item: "Laptop",
    issue: "Won't turn on",
    description:
      "My laptop suddenly stopped turning on yesterday. The power light doesn't come on when I press the power button, even when it's plugged in.",
    technician: "Alex Smith",
    technicianId: "tech-001",
    date: "2024-04-05",
    status: "In Progress",
    estimate: "$150",
    timeEstimate: "3-5 days",
    updates: [
      {
        date: "2024-04-05",
        status: "Received",
        notes: "Item received for repair",
      },
      {
        date: "2024-04-06",
        status: "Diagnostic",
        notes: "Performing diagnostic tests",
      },
      {
        date: "2024-04-07",
        status: "In Progress",
        notes: "Issue identified as faulty power supply. Replacement needed.",
      },
    ],
  };

  const handleCancel = () => {
    setIsLoading(true);

    // Simulate cancellation process
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Order cancelled",
        description: "Your repair order has been cancelled",
      });
      router.push("/dashboard/user/orders");
    }, 1500);
  };

  const handleSubmitReview = () => {
    setIsLoading(true);

    // Simulate review submission
    setTimeout(() => {
      setIsLoading(false);
      setShowReviewDialog(false);
      toast({
        title: "Review submitted",
        description: "Your review has been submitted successfully",
      });
    }, 1500);
  };

  return (
    <DashboardLayout role="user">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Order Details</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Order Information</CardTitle>
                  <CardDescription>
                    Details about your repair order
                  </CardDescription>
                </div>
                <Badge>{order.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Order ID</h3>
                  <p className="text-sm text-muted-foreground">{order.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Date Submitted</h3>
                  <p className="text-sm text-muted-foreground">{order.date}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium">Item</h3>
                <p className="text-sm text-muted-foreground">{order.item}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium">Issue</h3>
                <p className="text-sm text-muted-foreground">{order.issue}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium">Description</h3>
                <p className="text-sm text-muted-foreground">
                  {order.description}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium">Assigned Technician</h3>
                <p className="text-sm text-muted-foreground">
                  {order.technician}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Cost Estimate</h3>
                  <p className="text-sm text-muted-foreground">
                    {order.estimate}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Time Estimate</h3>
                  <p className="text-sm text-muted-foreground">
                    {order.timeEstimate}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              {order.status !== "Completed" ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() =>
                      router.push(`/dashboard/user/orders/${params.id}/edit`)
                    }
                    disabled={order.status !== "Pending"}
                  >
                    Edit Order
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleCancel}
                    disabled={order.status !== "Pending"}
                  >
                    Cancel Order
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() =>
                      router.push(
                        `/dashboard/user/technicians/${order.technicianId}`,
                      )
                    }
                  >
                    View Technician
                  </Button>
                  <Dialog
                    open={showReviewDialog}
                    onOpenChange={setShowReviewDialog}
                  >
                    <DialogTrigger asChild>
                      <Button>Leave Review</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Review Technician</DialogTitle>
                        <DialogDescription>
                          Share your experience with {order.technician}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="flex justify-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-8 w-8 cursor-pointer ${
                                star <= rating
                                  ? "fill-primary text-primary"
                                  : "text-muted-foreground"
                              }`}
                              onClick={() => setRating(star)}
                            />
                          ))}
                        </div>
                        <Textarea
                          placeholder="Write your review here..."
                          className="min-h-[120px]"
                        />
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setShowReviewDialog(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSubmitReview}
                          disabled={rating === 0 || isLoading}
                        >
                          {isLoading ? "Submitting..." : "Submit Review"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </>
              )}
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Repair Status Updates</CardTitle>
              <CardDescription>
                Track the progress of your repair
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {order.updates.map((update, index) => (
                  <div key={index} className="relative pl-6 pb-6 border-l">
                    <div className="absolute left-0 top-0 -translate-x-1/2 h-3 w-3 rounded-full bg-primary"></div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium">{update.status}</h3>
                        <span className="text-xs text-muted-foreground">
                          {update.date}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {update.notes}
                      </p>
                    </div>
                    {index === order.updates.length - 1 && (
                      <div className="absolute left-0 bottom-0 -translate-x-1/2 h-3 w-3 rounded-full border-2 border-primary bg-background"></div>
                    )}
                  </div>
                ))}

                {order.updates.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <AlertTriangle className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No updates available yet
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
