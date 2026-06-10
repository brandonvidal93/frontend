'use client';

import { CalendarDays, CheckCircle2, Clock, ShieldAlert, Church, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { ActivityCard } from '@/components/activities/ActivityCard';
import { Button } from '@/components/ui/Button';
import { useActivities } from '@/hooks/useActivities';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import type { Activity } from '@/types';

function StatCard({ label, value, icon: Icon, color }: {
  label: string; value: number; icon: any; color: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{label}</p>
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

// ─── Vista pública (sin login) ───────────────────────────────────────────────
function PublicView() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Activity[]>('/public/activities')
      .then(({ data }) => setActivities(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header público */}
      <header className="bg-indigo-800 shadow-md">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20">
              <Church className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-white text-lg leading-none">GestiónIPUC</p>
              <p className="text-xs text-indigo-200">Actividades de la iglesia</p>
            </div>
          </div>
          <Link href="/login">
            <Button variant="secondary" size="sm">
              <LogIn className="h-4 w-4" />
              Iniciar sesión
            </Button>
          </Link>
        </div>
      </header>

      {/* Contenido */}
      <main className="mx-auto max-w-6xl px-6 py-10 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Próximas actividades</h1>
          <p className="text-gray-500 mt-1">Actividades programadas por la iglesia</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 rounded-xl bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : activities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {activities.map((a) => (
              <ActivityCard key={a.id} activity={a} publicMode />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border bg-white py-20 text-center">
            <CalendarDays className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No hay actividades programadas</p>
          </div>
        )}
      </main>
    </div>
  );
}

// ─── Vista autenticada (dashboard) ──────────────────────────────────────────
function AuthenticatedView() {
  const { user } = useAuth();
  const { activities, loading } = useActivities();

  const planned    = activities.filter((a) => a.status === 'planned').length;
  const inProgress = activities.filter((a) => a.status === 'in_progress').length;
  const completed  = activities.filter((a) => a.status === 'completed').length;
  const pending    = activities.filter((a) => a.approval_status === 'pending').length;

  const upcoming = activities
    .filter((a) => a.status === 'planned' && a.approval_status === 'approved')
    .slice(0, 6);

  return (
    <div className="flex flex-col flex-1">
      <Header
        title={`Bienvenido, ${user?.full_name?.split(' ')[0]} 👋`}
        subtitle="Resumen general de actividades"
      />
      <div className="p-6 md:p-8 space-y-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Planificadas"          value={planned}    icon={CalendarDays}  color="bg-blue-100 text-blue-600" />
          <StatCard label="En curso"              value={inProgress} icon={Clock}         color="bg-yellow-100 text-yellow-600" />
          <StatCard label="Completadas"           value={completed}  icon={CheckCircle2}  color="bg-green-100 text-green-600" />
          <StatCard label="Pendientes aprobación" value={pending}    icon={ShieldAlert}   color="bg-orange-100 text-orange-600" />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Próximas actividades</h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-48 rounded-xl bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : upcoming.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {upcoming.map((a) => <ActivityCard key={a.id} activity={a} />)}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border bg-white py-16 text-center">
              <CalendarDays className="h-12 w-12 text-gray-300 mb-3" />
              <p className="text-gray-500">No hay actividades próximas</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Página raíz ─────────────────────────────────────────────────────────────
export default function HomePage() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <AuthenticatedView /> : <PublicView />;
}
