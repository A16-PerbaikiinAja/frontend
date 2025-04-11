"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MainNavProps {
  role: "user" | "technician" | "admin";
}

export function MainNav({ role }: MainNavProps) {
  const pathname = usePathname();

  const userLinks = [
    { href: "/dashboard/user", label: "Dashboard" },
    { href: "/dashboard/user/orders", label: "My Orders" },
    { href: "/dashboard/user/technicians", label: "Technicians" },
    { href: "/dashboard/user/reviews", label: "My Reviews" },
    { href: "/dashboard/user/profile", label: "Profile" },
  ];

  const technicianLinks = [
    { href: "/dashboard/technician", label: "Dashboard" },
    { href: "/dashboard/technician/requests", label: "Repair Requests" },
    { href: "/dashboard/technician/jobs", label: "Active Jobs" },
    { href: "/dashboard/technician/reports", label: "Reports" },
    { href: "/dashboard/technician/reviews", label: "Reviews" },
    { href: "/dashboard/technician/profile", label: "Profile" },
  ];

  const adminLinks = [
    { href: "/dashboard/admin", label: "Dashboard" },
    { href: "/dashboard/admin/technicians", label: "Technicians" },
    { href: "/dashboard/admin/coupons", label: "Coupons" },
    { href: "/dashboard/admin/reports", label: "Reports" },
    { href: "/dashboard/admin/payments", label: "Payment Methods" },
    { href: "/dashboard/admin/reviews", label: "Reviews" },
  ];

  const links =
    role === "user"
      ? userLinks
      : role === "technician"
        ? technicianLinks
        : adminLinks;

  return (
    <div className="mr-4 flex gap-8">
      <Link href="/" className="w-32 md:w-48">
        <Image src="/logo.png" width={500} height={500} alt="Logo" />
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === link.href ? "text-foreground" : "text-foreground/60",
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
