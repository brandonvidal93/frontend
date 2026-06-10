'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { ActivityForm } from '@/components/activities/ActivityForm';
import { Button } from '@/components/ui/Button';
import { useActivity } from '@/hooks/useActivities';
import { isoToLocalInput } from '@/lib/utils';
import api from '@/lib/api';

export default function EditActivityPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { activity, loading } = useActivity(id);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (data: any) => {
    setSaving(true);
    try {
      await api.put(`/activities/${id}`, data);
      toast.success('Actividad actualizada correctamente');
      router.push(`/activities/${id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Error al actualizar la actividad');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col flex-1">
        <Header title="Cargando..." />
        <div className="p-8 space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 rounded-xl bg-gray-200 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!activity) return null;

  // Preparar valores por defecto para el formulario
  const committeeIds = activity.activity_committees?.map((ac) => ac.committee_id) ?? [];
  const defaultValues = {
    name: activity.name,
    description: activity.description ?? '',
    location: activity.location ?? '',
    start_date: isoToLocalInput(activity.start_date),
    end_date: isoToLocalInput(activity.end_date),
    status: activity.status,
    committee_ids: committeeIds,
  };

  return (
    <div className="flex flex-col flex-1">
      <Header title="Editar actividad" subtitle={activity.name} />
      <div className="p-6 md:p-8 max-w-2xl mx-auto w-full">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6 -ml-2">
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <ActivityForm
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            loading={saving}
          />
        </div>
      </div>
    </div>
  );
}
