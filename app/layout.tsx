import { AuthProvider } from '@/contexts/auth-provider';
import { ThemeProvider } from '@/contexts/theme-provider';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import React from 'react';
import { Toaster as SonnerToaster } from 'sonner'; // Beri alias jika kamu punya komponen Toaster lain
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PerbaikiinAja - Your Repair Service Platform',
  description: 'Connect with skilled technicians to repair your items quickly and efficiently.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            {/* Toaster dari Sonner sebaiknya diletakkan di luar AuthProvider 
              atau di level yang lebih tinggi jika memungkinkan, 
              tapi di sini juga sudah oke.
              Yang penting ia ada di dalam ThemeProvider jika ingin mengikuti tema.
            */}
            <SonnerToaster richColors position="top-right" closeButton />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}