'use client';

import type { User } from '@/types/auth';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL;

export type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    fullName: string;
    email: string;
    password: string;
    phoneNumber: string;
    address: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_URL}/profile`, { credentials: 'include' });
        if (!res.ok) throw new Error();
        const profile: User = await res.json();
        setUser(profile);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const errors = await res.json();
        throw errors;
      }
      const pr = await fetch(`${API_URL}/profile`, { credentials: 'include' });
      if (!pr.ok) throw new Error('Failed to fetch profile');
      const profile: User = await pr.json();
      setUser(profile);
      router.push('/dashboard');
    } catch (err) {
      setUser(null);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    fullName: string;
    email: string;
    password: string;
    phoneNumber: string;
    address: string;
  }) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (!res.ok) throw body;
      await login(data.email, data.password);
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await fetch(`${API_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
