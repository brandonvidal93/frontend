'use client';

import { useState } from 'react';
import { Plus, Search, SlidersHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { ActivityCard } from '@/components/activities/ActivityCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useActivities } from '@/hooks/useActivities';
import { useCommittees } from '@/hooks/useCommittees';
import { useAuth } from '@/context/AuthContext';
import { ACTIVITY_STATUS_LABELS, APPROVAL_STATUS_LABELS } from '@/lib/utils';

const statusOptions = [
  { value: '', label: 'Todos los estados' },
  ...Object.entries(ACTIVITY_STATUS_LABELS).map(([v, l]) => ({ value: v, label: l })),
];

const approvalOptions = [
  { value: '', label: 'Todas las aprobaciones' },
  ...Object.entries(APPROVAL_STATUS_LABELS).map(([v, l]) => ({ value: v, label: l })),
];

export default function ActivitiesPage() {
  const router = useRouter();
  const { isEditor } = useAuth();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [approvalStatus, setApprovalStatus] = useState('');
  const [committeeId, setCommitteeId] = useState('');

  const { activities, loading } = useActivities({
    status: status || undefined,
    approval_status: approvalStatus || undefined,
    committee_id: committeeId || undefined,
  });

  const { committees } = useCommittees();

  const committeeOptions = [
    { value: '', label: 'Todos los comités' },
    ...committees.map((c) => ({ value: c.id, label: c.name })),
  ];

  const filtered = activities.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col flex-1">
      <Header title="Actividades" subtitle="Gestiona todas las actividades de la iglesia" />

      <div className="p-6 md:p-8 space-y-6">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o ubicación..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {isEditor && (
            <Button onClick={() => router.push('/activities/new')}>
              <Plus className="h-4 w-4" />
              Nueva actividad
            </Button>
          )}
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-3">
          <Select options={statusOptions} value={status} onChange={(e) => setStatus(e.target.value)} className="w-48" />
          <Select options={approvalOptions} value={approvalStatus} onChange={(e) => setApprovalStatus(e.target.value)} className="w-52" />
          <Select options={committeeOptions} value={committeeId} onChange={(e) => setCommitteeId(e.target.value)} className="w-48" />
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-52 rounded-xl bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <>
            <p className="text-sm text-gray-500">{filtered.length} actividad{filtered.length !== 1 ? 'es' : ''} encontrada{filtered.length !== 1 ? 's' : ''}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border bg-white py-20 text-center">
            <SlidersHorizontal className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No se encontraron actividades</p>
            <p className="text-sm text-gray-400 mt-1">Intenta ajustar los filtros de búsqueda</p>
          </div>
        )}
      </div>
    </div>
  );
}
