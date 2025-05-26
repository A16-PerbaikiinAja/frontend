"use client"

import { usePathname } from "next/navigation"
import { ThemeToggle } from "./theme-toggle"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Settings, LogOut, Bell } from "lucide-react"

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="border-b bg-white dark:bg-gray-800 px-6 py-3">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/perbaikiinaja-icon.png"
            alt="PerbaikiinAja Logo"
            width={32}
            height={32}
            className="dark:invert"
          />
          <span className="font-bold text-lg text-gray-900 dark:text-white">PerbaikiinAja</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/features" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
            Features
          </Link>
          <Link
            href="/testimonials"
            className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            Testimonials
          </Link>
          <Link
            href="/technicians"
            className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            Technicians
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Admin User</p>
                  <p className="text-xs leading-none text-muted-foreground">admin@perbaikiinaja.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
