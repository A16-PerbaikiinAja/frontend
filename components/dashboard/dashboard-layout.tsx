'use client';

import type React from 'react';

import { motion } from 'framer-motion';
import {
  Bell,
  ChevronLeft,
  CreditCard,
  Home,
  LogOut,
  Menu,
  Settings,
  Star,
  Tag,
  PenToolIcon as Tool,
  User,
  Users,
  Wrench,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { ThemeToggle } from '@/components/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/auth-provider';
import Image from 'next/image';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState(3);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 1024) {
        setIsSidebarCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const userNavItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/orders', label: 'My Orders', icon: Tool },
    { href: '/dashboard/coupons', label: 'Coupons', icon: Tag },
    { href: '/dashboard/reviews', label: 'Reviews', icon: Star },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
  ];

  const technicianNavItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/requests', label: 'Repair Requests', icon: Tool },
    { href: '/dashboard/jobs', label: 'Jobs In Progress', icon: Wrench },
    { href: '/dashboard/earnings', label: 'Earnings', icon: CreditCard },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
  ];

  const adminNavItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/technicians', label: 'Technicians', icon: Users },
    { href: '/dashboard/coupons', label: 'Coupons', icon: Tag },
    { href: '/dashboard/reports', label: 'Reports', icon: Star },
    { href: '/dashboard/payments', label: 'Payment Methods', icon: CreditCard },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  const navItems =
    user?.role === 'ADMIN'
      ? adminNavItems
      : user?.role === 'TECHNICIAN'
        ? technicianNavItems
        : userNavItems;

  const sidebarVariants = {
    expanded: {
      width: '240px',
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
    collapsed: {
      width: '72px',
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
  };

  const contentVariants = {
    expanded: {
      marginLeft: isMobile ? 0 : '240px',
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
    collapsed: {
      marginLeft: isMobile ? 0 : '72px',
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const renderSidebarContent = () => (
    <motion.div
      className="flex h-full flex-col"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}>
      <div className="flex items-center justify-between p-4">
        <motion.div className="flex items-center gap-2" variants={fadeInUp}>
          {isSidebarCollapsed ? (
            <Link href="/dashboard" className="flex h-9 w-9 items-center justify-center">
              <Image
                src="/icon-light.png"
                width={500}
                height={500}
                alt="Icon"
                className="dark:hidden"
              />
              <Image
                src="/icon-dark.png"
                width={500}
                height={500}
                alt="Icon"
                className="hidden dark:inline"
              />
            </Link>
          ) : (
            <Link href="/dashboard" className="w-24 md:w-36">
              <Image
                src="/logo-light.png"
                width={500}
                height={500}
                alt="Logo"
                className="dark:hidden"
              />
              <Image
                src="/logo-dark.png"
                width={500}
                height={500}
                alt="Logo"
                className="hidden dark:inline"
              />
            </Link>
          )}
        </motion.div>
        <motion.button
          variants={fadeInUp}
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="hover:bg-muted rounded-md p-1">
          {isSidebarCollapsed ? <ChevronLeft className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </motion.button>
      </div>

      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href;

            return (
              <motion.div key={item.href} variants={fadeInUp}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                          isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                        }`}>
                        <item.icon className="h-4 w-4" />
                        {!isSidebarCollapsed && <span>{item.label}</span>}
                      </Link>
                    </TooltipTrigger>
                    {isSidebarCollapsed && (
                      <TooltipContent side="right">{item.label}</TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </motion.div>
            );
          })}
        </nav>
      </div>

      <motion.div className="mt-auto p-4" variants={fadeInUp}>
        <Button
          variant="outline"
          className={`w-full justify-start gap-2 ${isSidebarCollapsed ? 'px-2' : ''}`}
          onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          {!isSidebarCollapsed && <span>Logout</span>}
        </Button>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="bg-muted/30 flex min-h-screen">
      {/* Sidebar for desktop */}
      {!isMobile && (
        <motion.aside
          className="bg-background fixed inset-y-0 left-0 z-20 flex flex-col border-r shadow-sm"
          initial={isSidebarCollapsed ? 'collapsed' : 'expanded'}
          animate={isSidebarCollapsed ? 'collapsed' : 'expanded'}
          variants={sidebarVariants}>
          {renderSidebarContent()}
        </motion.aside>
      )}

      {/* Mobile sidebar with sheet */}
      {isMobile && (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="fixed top-4 left-4 z-40 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            {renderSidebarContent()}
          </SheetContent>
        </Sheet>
      )}

      {/* Main content */}
      <motion.main
        className="flex-1 overflow-hidden"
        initial={isSidebarCollapsed ? 'collapsed' : 'expanded'}
        animate={isSidebarCollapsed ? 'collapsed' : 'expanded'}
        variants={contentVariants}>
        {/* Header */}
        <header className="bg-background sticky top-0 z-10 flex h-16 items-center gap-4 border-b px-4 sm:px-6">
          {isMobile && <div className="w-8" />}

          <div className="ml-auto flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {notifications > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                      {notifications}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-auto">
                  {[...Array(notifications)].map((_, i) => (
                    <DropdownMenuItem key={i} className="flex flex-col items-start p-4">
                      <div className="flex w-full justify-between">
                        <span className="font-medium">New repair request</span>
                        <span className="text-muted-foreground text-xs">2h ago</span>
                      </div>
                      <span className="text-muted-foreground text-sm">
                        A new repair request has been submitted for your review.
                      </span>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="/placeholder.svg" alt={user?.fullName || ''} />
                    <AvatarFallback>{user?.fullName?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.fullName}</p>
                    <p className="text-muted-foreground text-xs">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Dashboard content */}
        <div className="container py-6 md:py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
            {children}
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
}
