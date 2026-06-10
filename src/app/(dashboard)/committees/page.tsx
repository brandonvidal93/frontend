'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { Header } from '@/components/layout/Header';
import { CommitteeCard } from '@/components/committees/CommitteeCard';
import { CommitteeForm } from '@/components/committees/CommitteeForm';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useCommittees } from '@/hooks/useCommittees';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

export default function CommitteesPage() {
  const { committees, loading, refetch } = useCommittees();
  const { isEditor } = useAuth();
  const [modal, setModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleCreate = async (data: any) => {
    setSaving(true);
    try {
      await api.post('/committees', data);
      toast.success('Comité creado correctamente');
      setModal(false);
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Error al crear comité');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <Header title="Comités" subtitle="Comités de trabajo de la iglesia" />

      <div className="p-6 md:p-8 space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">{committees.length} comité{committees.length !== 1 ? 's' : ''} registrado{committees.length !== 1 ? 's' : ''}</p>
          {isEditor && (
            <Button onClick={() => setModal(true)}>
              <Plus className="h-4 w-4" />
              Nuevo comité
            </Button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-40 rounded-xl bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : committees.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {committees.map((c) => (
              <CommitteeCard key={c.id} committee={c} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border bg-white py-20 text-center">
            <p className="text-gray-500">Aún no hay comités registrados</p>
          </div>
        )}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Nuevo comité">
        <CommitteeForm onSubmit={handleCreate} loading={saving} />
      </Modal>
    </div>
  );
}
