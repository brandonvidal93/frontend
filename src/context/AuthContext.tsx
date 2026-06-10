'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import type { Profile, LoginCredentials } from '@/types';

interface AuthContextType {
  user: Profile | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isEditor: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchMe = useCallback(async () => {
    try {
      const { data } = await api.get<Profile>('/auth/me');
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      fetchMe();
    } else {
      setLoading(false);
    }
  }, [fetchMe]);

  const login = async (credentials: LoginCredentials) => {
    const { data } = await api.post('/auth/login', credentials);
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    await fetchMe();
    router.push('/');
  };

  const logout = async () => {
    await api.post('/auth/logout').catch(() => {});
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAdmin: user?.role === 'admin',
        isEditor: user?.role === 'admin' || user?.role === 'editor',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
