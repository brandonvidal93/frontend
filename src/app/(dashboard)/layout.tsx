'use client';

import { useAuth } from '@/context/AuthContext';
import { Sidebar } from '@/components/layout/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  // Sin usuario → renderizar children sin sidebar (la página decide qué mostrar)
  if (!user) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  // Con usuario → layout completo con sidebar
  return (
    <div className="flex h-full min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {children}
      </main>
    </div>
  );
}
