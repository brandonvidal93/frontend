'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sidebar } from '@/components/layout/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <p className="text-sm text-gray-500">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-full min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {children}
      </main>
    </div>
  );
}
