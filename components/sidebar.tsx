"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import {
  BarChart3,
  Users,
  Wrench,
  CreditCard,
  Ticket,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "Pengguna", href: "/users", icon: Users },
    { name: "Teknisi", href: "/technicians", icon: Wrench },
    { name: "Metode Pembayaran", href: "/payment-methods", icon: CreditCard },
    { name: "Statistik Pembayaran", href: "/payment-methods/admin/details-with-counts", icon: TrendingUp },
    { name: "Kupon", href: "/coupons", icon: Ticket },
    { name: "Laporan", href: "/reports", icon: FileText },
    { name: "Pengaturan", href: "/settings", icon: Settings },
  ]

  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 border-r transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="p-4 border-b flex items-center justify-between">
        <div className={cn("flex items-center", collapsed && "justify-center w-full")}>
          {!collapsed && (
            <div className="flex items-center gap-2">
              <Image
                src="/perbaikiinaja-icon.png"
                alt="PerbaikiinAja Logo"
                width={24}
                height={24}
                className="dark:invert"
              />
              <span className="font-bold text-lg text-gray-900 dark:text-white">PerbaikiinAja</span>
            </div>
          )}
          {collapsed && (
            <div className="relative h-8 w-8 flex items-center justify-center">
              <Image
                src="/perbaikiinaja-icon.png"
                alt="PerbaikiinAja Logo"
                width={24}
                height={24}
                className="dark:invert"
              />
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
      <div className="py-4 flex-1">
        <div className="px-3">
          <h2
            className={cn(
              "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider",
              collapsed && "text-center",
            )}
          >
            {!collapsed && "Menu"}
          </h2>
          <nav className="mt-2 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                    isActive
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100",
                    collapsed && "justify-center",
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 flex-shrink-0 h-5 w-5",
                      isActive
                        ? "text-blue-700 dark:text-blue-300"
                        : "text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-300",
                      collapsed && "mr-0",
                    )}
                    aria-hidden="true"
                  />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )
}
