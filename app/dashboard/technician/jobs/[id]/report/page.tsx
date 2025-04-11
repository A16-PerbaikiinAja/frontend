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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateReport({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for the job
  const job = {
    id: params.id,
    item: "Tablet",
    issue: "Battery replacement",
    customer: "Mike Johnson",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate form submission
    setTimeout(() => {
      setIsLoading(false);
      toast("Report submitted", {
        description: "Your repair report has been submitted successfully",
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
          <h1 className="text-3xl font-bold tracking-tight">
            Create Repair Report
          </h1>
        </div>

        <Card className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Repair Report for {job.item}</CardTitle>
              <CardDescription>
                Document the repairs performed for job #{job.id}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="diagnosis">Diagnosis</Label>
                <Textarea
                  id="diagnosis"
                  placeholder="Describe what was wrong with the item"
                  className="min-h-[100px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="repairs">Repairs Performed</Label>
                <Textarea
                  id="repairs"
                  placeholder="Describe the repairs that were performed"
                  className="min-h-[100px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Parts Replaced</Label>
                <div className="grid gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="part1" />
                    <Label htmlFor="part1" className="text-sm font-normal">
                      Battery
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="part2" />
                    <Label htmlFor="part2" className="text-sm font-normal">
                      Screen
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="part3" />
                    <Label htmlFor="part3" className="text-sm font-normal">
                      Charging Port
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="part4" />
                    <Label htmlFor="part4" className="text-sm font-normal">
                      Motherboard
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="part5" />
                    <Label htmlFor="part5" className="text-sm font-normal">
                      Other
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="other-parts">Other Parts (if applicable)</Label>
                <Input
                  id="other-parts"
                  placeholder="List any other parts replaced"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="final-cost">Final Cost ($)</Label>
                <Input
                  id="final-cost"
                  type="number"
                  min="0"
                  placeholder="85"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="warranty">Warranty Information</Label>
                <Textarea
                  id="warranty"
                  placeholder="Provide details about any warranty on the repairs"
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="recommendations">Recommendations</Label>
                <Textarea
                  id="recommendations"
                  placeholder="Any recommendations for the customer"
                  className="min-h-[80px]"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit Report"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
