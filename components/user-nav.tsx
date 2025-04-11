"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface UserNavProps {
  role: "user" | "technician" | "admin";
  user: {
    name: string;
    email: string;
    image?: string;
  };
}

export function UserNav({ role, user }: UserNavProps) {
  const router = useRouter();

  const handleLogout = () => {
    // Simulate logout
    toast("Logged out", {
      description: "You have been logged out successfully",
    });
    router.push("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/${role}/profile`)}
          >
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/${role}/settings`)}
          >
            Settings
          </DropdownMenuItem>
          {role === "user" && (
            <DropdownMenuItem
              onClick={() => router.push("/dashboard/user/orders")}
            >
              My Orders
            </DropdownMenuItem>
          )}
          {role === "technician" && (
            <DropdownMenuItem
              onClick={() => router.push("/dashboard/technician/jobs")}
            >
              Active Jobs
            </DropdownMenuItem>
          )}
          {role === "admin" && (
            <DropdownMenuItem
              onClick={() => router.push("/dashboard/admin/reports")}
            >
              Reports
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
