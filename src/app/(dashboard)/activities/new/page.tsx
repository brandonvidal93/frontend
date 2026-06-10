'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { ActivityForm } from '@/components/activities/ActivityForm';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';

export default function NewActivityPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      await api.post('/activities', data);
      toast.success('Actividad creada correctamente');
      router.push('/activities');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Error al crear la actividad');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <Header title="Nueva actividad" subtitle="Completa la información de la actividad" />
      <div className="p-6 md:p-8 max-w-2xl mx-auto w-full">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6 -ml-2">
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <ActivityForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </div>
  );
}
