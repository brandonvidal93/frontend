'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  ArrowLeft, MapPin, Calendar, User, CheckCircle2,
  XCircle, Pencil, Trash2, UserPlus
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { useActivity } from '@/hooks/useActivities';
import { useAuth } from '@/context/AuthContext';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import {
  ACTIVITY_STATUS_LABELS, ACTIVITY_STATUS_COLORS,
  APPROVAL_STATUS_LABELS, APPROVAL_STATUS_COLORS,
  formatDateTime
} from '@/lib/utils';
import api from '@/lib/api';
import { useForm } from 'react-hook-form';

export default function ActivityDetailPage() {
  const { loading: authLoading } = useRequireAuth();
  const { id } = useParams<{ id: string }>();
  if (authLoading) return null;
  const router = useRouter();
  const { user, isEditor, isAdmin } = useAuth();
  const { activity, loading } = useActivity(id);

  const [attendeeModal, setAttendeeModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const { register, handleSubmit, reset } = useForm<{ full_name: string; phone: string }>();
  const { register: registerReject, handleSubmit: handleRejectSubmit, reset: resetReject } = useForm<{ reason: string }>();

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      await api.patch(`/activities/${id}/approve`);
      toast.success('Actividad aprobada');
      router.refresh();
    } catch {
      toast.error('Error al aprobar');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async ({ reason }: { reason: string }) => {
    setActionLoading(true);
    try {
      await api.patch(`/activities/${id}/reject`, { reason });
      toast.success('Actividad rechazada');
      setRejectModal(false);
      resetReject();
      router.refresh();
    } catch {
      toast.error('Error al rechazar');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddAttendee = async (data: { full_name: string; phone: string }) => {
    setActionLoading(true);
    try {
      await api.post(`/activities/${id}/attendees`, data);
      toast.success('Asistente registrado');
      setAttendeeModal(false);
      reset();
      router.refresh();
    } catch {
      toast.error('Error al registrar asistente');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de eliminar esta actividad?')) return;
    try {
      await api.delete(`/activities/${id}`);
      toast.success('Actividad eliminada');
      router.push('/activities');
    } catch {
      toast.error('Error al eliminar');
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

  const committees = activity.activity_committees ?? [];
  const attendees = (activity as any).activity_attendees ?? [];

  return (
    <div className="flex flex-col flex-1">
      <Header title={activity.name} />
      <div className="p-6 md:p-8 max-w-4xl mx-auto w-full space-y-6">
        <Button variant="ghost" onClick={() => router.back()} className="-ml-2">
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>

        {/* Card principal */}
        <div className="rounded-xl border bg-white p-6 shadow-sm space-y-5">
          {/* Comités */}
          {committees.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {committees.map(({ committees: c }) =>
                c ? (
                  <span
                    key={c.id}
                    className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium text-white"
                    style={{ backgroundColor: c.color }}
                  >
                    {c.name}
                  </span>
                ) : null
              )}
            </div>
          )}

          {/* Badges de estado */}
          <div className="flex gap-2 flex-wrap">
            <Badge className={ACTIVITY_STATUS_COLORS[activity.status]}>
              {ACTIVITY_STATUS_LABELS[activity.status]}
            </Badge>
            <Badge className={APPROVAL_STATUS_COLORS[activity.approval_status]}>
              {APPROVAL_STATUS_LABELS[activity.approval_status]}
            </Badge>
          </div>

          {activity.description && (
            <p className="text-gray-600 leading-relaxed">{activity.description}</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Calendar className="h-4 w-4 text-indigo-500" />
              <div>
                <p className="text-xs text-gray-400">Inicio</p>
                <p>{formatDateTime(activity.start_date)}</p>
              </div>
            </div>
            {activity.end_date && (
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Calendar className="h-4 w-4 text-indigo-500" />
                <div>
                  <p className="text-xs text-gray-400">Fin</p>
                  <p>{formatDateTime(activity.end_date)}</p>
                </div>
              </div>
            )}
            {activity.location && (
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <MapPin className="h-4 w-4 text-indigo-500" />
                <div>
                  <p className="text-xs text-gray-400">Ubicación</p>
                  <p>{activity.location}</p>
                </div>
              </div>
            )}
            {activity.profiles && (
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <User className="h-4 w-4 text-indigo-500" />
                <div>
                  <p className="text-xs text-gray-400">Creado por</p>
                  <p>{activity.profiles.full_name}</p>
                </div>
              </div>
            )}
          </div>

          {activity.rejection_reason && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4">
              <p className="text-sm font-medium text-red-700">Motivo de rechazo</p>
              <p className="text-sm text-red-600 mt-1">{activity.rejection_reason}</p>
            </div>
          )}

          {/* Acciones */}
          <div className="flex flex-wrap gap-3 pt-2 border-t">
            {isEditor && (
              <Button variant="outline" onClick={() => router.push(`/activities/${id}/edit`)}>
                <Pencil className="h-4 w-4" /> Editar
              </Button>
            )}
            {isEditor && activity.approval_status === 'pending' && (
              <>
                <Button onClick={handleApprove} loading={actionLoading}>
                  <CheckCircle2 className="h-4 w-4" /> Aprobar
                </Button>
                <Button variant="danger" onClick={() => setRejectModal(true)}>
                  <XCircle className="h-4 w-4" /> Rechazar
                </Button>
              </>
            )}
            {isAdmin && (
              <Button variant="danger" onClick={handleDelete}>
                <Trash2 className="h-4 w-4" /> Eliminar
              </Button>
            )}
          </div>
        </div>

        {/* Asistentes */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Asistentes ({attendees.length})
            </h2>
            <Button size="sm" onClick={() => setAttendeeModal(true)}>
              <UserPlus className="h-4 w-4" /> Registrar
            </Button>
          </div>

          {attendees.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">
              Aún no hay asistentes registrados
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-500">
                    <th className="pb-3 pr-4 font-medium">Nombre</th>
                    <th className="pb-3 pr-4 font-medium">Celular</th>
                    <th className="pb-3 font-medium">Asistió</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {attendees.map((a: any) => (
                    <tr key={a.id} className="hover:bg-gray-50">
                      <td className="py-3 pr-4 text-gray-900">{a.full_name}</td>
                      <td className="py-3 pr-4 text-gray-500">{a.phone || '-'}</td>
                      <td className="py-3">
                        <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs ${a.attended ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                          {a.attended ? '✓' : '–'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal: registrar asistente */}
      <Modal open={attendeeModal} onClose={() => setAttendeeModal(false)} title="Registrar asistente">
        <form onSubmit={handleSubmit(handleAddAttendee)} className="space-y-4">
          <Input label="Nombre completo *" placeholder="Juan Pérez" {...register('full_name', { required: true })} />
          <Input label="Celular" placeholder="300 000 0000" {...register('phone')} />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setAttendeeModal(false)}>Cancelar</Button>
            <Button type="submit" loading={actionLoading}>Registrar</Button>
          </div>
        </form>
      </Modal>

      {/* Modal: rechazar */}
      <Modal open={rejectModal} onClose={() => setRejectModal(false)} title="Rechazar actividad">
        <form onSubmit={handleRejectSubmit(handleReject)} className="space-y-4">
          <Input label="Motivo del rechazo" placeholder="Explica por qué se rechaza..." {...registerReject('reason')} />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setRejectModal(false)}>Cancelar</Button>
            <Button type="submit" variant="danger" loading={actionLoading}>Rechazar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
