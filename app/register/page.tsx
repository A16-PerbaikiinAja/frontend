"use client";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = (role: string) => {
    setIsLoading(true);

    // Simulate registration process
    setTimeout(() => {
      setIsLoading(false);

      toast("Registration successful", {
        description: `Registered as ${role}`,
      });

      // Redirect to login
      router.push("/login");
    }, 1500);
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href="/"
        className="w-32 md:w-48 absolute left-4 top-4 md:left-8 md:top-8"
      >
        <Image src="/logo.png" width={500} height={500} alt="Logo" />
      </Link>
      <Tabs defaultValue="user" className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="user">User</TabsTrigger>
          <TabsTrigger value="technician">Technician</TabsTrigger>
        </TabsList>
        <TabsContent value="user">
          <RegisterCard
            title="User Registration"
            description="Create an account to request repair services"
            isLoading={isLoading}
            onRegister={() => handleRegister("user")}
          />
        </TabsContent>
        <TabsContent value="technician">
          <RegisterCard
            title="Technician Registration"
            description="Join our platform as a repair technician"
            isLoading={isLoading}
            onRegister={() => handleRegister("technician")}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface RegisterCardProps {
  title: string;
  description: string;
  isLoading: boolean;
  onRegister: () => void;
}

function RegisterCard({
  title,
  description,
  isLoading,
  onRegister,
}: RegisterCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First name</Label>
            <Input id="firstName" placeholder="John" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last name</Label>
            <Input id="lastName" placeholder="Doe" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input id="confirmPassword" type="password" />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button className="w-full" onClick={onRegister} disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create account"}
        </Button>
        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="underline underline-offset-4 hover:text-primary"
          >
            Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
