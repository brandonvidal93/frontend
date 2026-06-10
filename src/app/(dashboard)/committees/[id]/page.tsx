'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ArrowLeft, Pencil, Trash2, UserMinus } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { CommitteeForm } from '@/components/committees/CommitteeForm';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import type { Committee } from '@/types';

export default function CommitteeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isAdmin, isEditor } = useAuth();

  const [committee, setCommittee] = useState<Committee | null>(null);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchCommittee = async () => {
    try {
      const { data } = await api.get<Committee>(`/committees/${id}`);
      setCommittee(data);
    } catch {
      toast.error('Error al cargar el comité');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCommittee(); }, [id]);

  const handleUpdate = async (data: any) => {
    setSaving(true);
    try {
      await api.put(`/committees/${id}`, data);
      toast.success('Comité actualizado');
      setEditModal(false);
      fetchCommittee();
    } catch {
      toast.error('Error al actualizar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('¿Eliminar este comité?')) return;
    try {
      await api.delete(`/committees/${id}`);
      toast.success('Comité eliminado');
      router.push('/committees');
    } catch {
      toast.error('Error al eliminar');
    }
  };

  const handleRemoveMember = async (userId: string) => {
    try {
      await api.delete(`/committees/${id}/members/${userId}`);
      toast.success('Miembro removido');
      fetchCommittee();
    } catch {
      toast.error('Error al remover miembro');
    }
  };

  if (loading) return <div className="flex flex-col flex-1"><Header title="Cargando..." /></div>;
  if (!committee) return null;

  const members = committee.committee_members ?? [];

  return (
    <div className="flex flex-col flex-1">
      <Header title={committee.name} />
      <div className="p-6 md:p-8 max-w-3xl mx-auto w-full space-y-6">
        <Button variant="ghost" onClick={() => router.back()} className="-ml-2">
          <ArrowLeft className="h-4 w-4" /> Volver
        </Button>

        {/* Info del comité */}
        <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 rounded-full" style={{ backgroundColor: committee.color }} />
              <h2 className="text-xl font-semibold text-gray-900">{committee.name}</h2>
            </div>
            <div className="flex gap-2">
              {isEditor && (
                <Button variant="outline" size="sm" onClick={() => setEditModal(true)}>
                  <Pencil className="h-4 w-4" /> Editar
                </Button>
              )}
              {isAdmin && (
                <Button variant="danger" size="sm" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          {committee.description && <p className="text-gray-600">{committee.description}</p>}
        </div>

        {/* Miembros */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Miembros ({members.length})
          </h3>
          {members.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Sin miembros asignados</p>
          ) : (
            <ul className="divide-y">
              {members.map((m) => (
                <li key={m.user_id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-sm font-semibold">
                      {m.profiles?.full_name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{m.profiles?.full_name}</span>
                  </div>
                  {isAdmin && (
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveMember(m.user_id)}>
                      <UserMinus className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Modal open={editModal} onClose={() => setEditModal(false)} title="Editar comité">
        <CommitteeForm
          defaultValues={committee}
          onSubmit={handleUpdate}
          loading={saving}
        />
      </Modal>
    </div>
  );
}
