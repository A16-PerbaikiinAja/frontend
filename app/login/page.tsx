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
import { Wrench } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (role: string) => {
    setIsLoading(true);

    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);

      toast("Login successful", {
        description: `Logged in as ${role}`,
      });

      // Redirect based on role
      if (role === "user") {
        router.push("/dashboard/user");
      } else if (role === "technician") {
        router.push("/dashboard/technician");
      } else if (role === "admin") {
        router.push("/dashboard/admin");
      }
    }, 1500);
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href="/"
        className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center gap-2 font-bold"
      >
        <Wrench className="h-5 w-5" />
        <span>PerbaikiinAja</span>
      </Link>
      <Tabs defaultValue="user" className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="user">User</TabsTrigger>
          <TabsTrigger value="technician">Technician</TabsTrigger>
          <TabsTrigger value="admin">Admin</TabsTrigger>
        </TabsList>
        <TabsContent value="user">
          <LoginCard
            title="User Login"
            description="Enter your credentials to access your account"
            isLoading={isLoading}
            onLogin={() => handleLogin("user")}
          />
        </TabsContent>
        <TabsContent value="technician">
          <LoginCard
            title="Technician Login"
            description="Access your technician dashboard"
            isLoading={isLoading}
            onLogin={() => handleLogin("technician")}
          />
        </TabsContent>
        <TabsContent value="admin">
          <LoginCard
            title="Admin Login"
            description="Access the admin control panel"
            isLoading={isLoading}
            onLogin={() => handleLogin("admin")}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface LoginCardProps {
  title: string;
  description: string;
  isLoading: boolean;
  onLogin: () => void;
}

function LoginCard({ title, description, isLoading, onLogin }: LoginCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-xs text-muted-foreground underline-offset-4 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input id="password" type="password" />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button className="w-full" onClick={onLogin} disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </Button>
        <div className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="underline underline-offset-4 hover:text-primary"
          >
            Sign up
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
