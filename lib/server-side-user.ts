import { getAuthToken } from './auth'
import { User } from '@/types/auth';

const API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL;

export default async function useUserServer(): Promise<User | undefined> {
  const token = await getAuthToken()
  if (!token) {
    return undefined
  }

  if (token) {
    try {
      const res = await fetch(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Invalid token');
      const profile: User = await res.json();
      return profile;
    } catch {
      return undefined;
    }
  }
}
