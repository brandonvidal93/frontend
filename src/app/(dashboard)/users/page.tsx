'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Pencil, Trash2, UserCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { useAuth } from '@/context/AuthContext';
import { ROLE_LABELS, ROLE_COLORS, formatDate } from '@/lib/utils';
import api from '@/lib/api';
import type { Profile, UserRole } from '@/types';

interface UserWithEmail extends Profile {
  email?: string;
}

// ---- Schemas ----
const createSchema = z.object({
  first_name: z.string().min(2, 'Mínimo 2 caracteres'),
  last_name: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email('Correo inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  role: z.enum(['admin', 'editor', 'viewer']),
});

const editSchema = z.object({
  first_name: z.string().min(2, 'Mínimo 2 caracteres'),
  last_name: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email('Correo inválido'),
  role: z.enum(['admin', 'editor', 'viewer']),
});

type CreateFormData = z.infer<typeof createSchema>;
type EditFormData = z.infer<typeof editSchema>;

const roleOptions = [
  { value: 'admin', label: 'Administrador' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Visualizador' },
];

// ---- Helpers ----
function splitFullName(fullName?: string) {
  if (!fullName) return { first_name: '', last_name: '' };
  const parts = fullName.trim().split(' ');
  const first_name = parts[0] || '';
  const last_name = parts.slice(1).join(' ') || '';
  return { first_name, last_name };
}

function UserAvatar({ name }: { name?: string }) {
  const letter = name?.charAt(0).toUpperCase() ?? '?';
  return (
    <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-sm flex-shrink-0">
      {letter}
    </div>
  );
}

export default function UsersPage() {
  const { isAdmin, user: currentUser } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState<UserWithEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithEmail | null>(null);

  // ---- Forms ----
  const createForm = useForm<CreateFormData>({
    resolver: zodResolver(createSchema),
    defaultValues: { role: 'viewer' },
  });

  const editForm = useForm<EditFormData>({
    resolver: zodResolver(editSchema),
  });

  // ---- Fetch ----
  const fetchUsers = async () => {
    try {
      const { data } = await api.get<UserWithEmail[]>('/users');
      setUsers(data);
    } catch {
      toast.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) { router.push('/'); return; }
    fetchUsers();
  }, [isAdmin]);

  // ---- Crear ----
  const handleCreate = async (data: CreateFormData) => {
    setSaving(true);
    try {
      await api.post('/users', data);
      toast.success('Usuario creado correctamente');
      setCreateModal(false);
      createForm.reset();
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Error al crear usuario');
    } finally {
      setSaving(false);
    }
  };

  // ---- Editar ----
  const openEdit = (u: UserWithEmail) => {
    setSelectedUser(u);
    const { first_name, last_name } = splitFullName(u.full_name);
    editForm.reset({ first_name, last_name, email: u.email ?? '', role: u.role });
    setEditModal(true);
  };

  const handleEdit = async (data: EditFormData) => {
    if (!selectedUser) return;
    setSaving(true);
    try {
      await api.put(`/users/${selectedUser.id}`, data);
      toast.success('Usuario actualizado');
      setEditModal(false);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Error al actualizar usuario');
    } finally {
      setSaving(false);
    }
  };

  // ---- Eliminar ----
  const handleDelete = async (u: UserWithEmail) => {
    if (!confirm(`¿Eliminar al usuario ${u.full_name}? Esta acción no se puede deshacer.`)) return;
    try {
      await api.delete(`/users/${u.id}`);
      toast.success('Usuario eliminado');
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Error al eliminar usuario');
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <Header title="Usuarios" subtitle="Gestiona los usuarios del sistema" />

      <div className="p-6 md:p-8 space-y-6">
        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {users.length} usuario{users.length !== 1 ? 's' : ''} registrado{users.length !== 1 ? 's' : ''}
          </p>
          <Button onClick={() => { createForm.reset({ role: 'viewer' }); setCreateModal(true); }}>
            <Plus className="h-4 w-4" />
            Nuevo usuario
          </Button>
        </div>

        {/* Tabla */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 rounded-xl bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border bg-white py-20">
            <UserCircle2 className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500">No hay usuarios registrados</p>
          </div>
        ) : (
          <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-left text-gray-500">
                    <th className="px-6 py-4 font-medium">Usuario</th>
                    <th className="px-6 py-4 font-medium">Correo</th>
                    <th className="px-6 py-4 font-medium">Rol</th>
                    <th className="px-6 py-4 font-medium">Registrado</th>
                    <th className="px-6 py-4 font-medium text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <UserAvatar name={u.full_name} />
                          <div>
                            <p className="font-medium text-gray-900">{u.full_name}</p>
                            {u.id === currentUser?.id && (
                              <span className="text-xs text-indigo-500 font-medium">Tú</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{u.email ?? '—'}</td>
                      <td className="px-6 py-4">
                        <Badge className={ROLE_COLORS[u.role]}>{ROLE_LABELS[u.role]}</Badge>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{formatDate(u.created_at)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEdit(u)}
                            className="text-gray-500 hover:text-indigo-600"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {u.id !== currentUser?.id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(u)}
                              className="text-gray-500 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Crear usuario */}
      <Modal open={createModal} onClose={() => setCreateModal(false)} title="Nuevo usuario" size="md">
        <form onSubmit={createForm.handleSubmit(handleCreate)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nombre *"
              placeholder="Juan"
              {...createForm.register('first_name')}
              error={createForm.formState.errors.first_name?.message}
            />
            <Input
              label="Apellido *"
              placeholder="Pérez"
              {...createForm.register('last_name')}
              error={createForm.formState.errors.last_name?.message}
            />
          </div>
          <Input
            label="Correo electrónico *"
            type="email"
            placeholder="correo@iglesia.com"
            {...createForm.register('email')}
            error={createForm.formState.errors.email?.message}
          />
          <Input
            label="Contraseña *"
            type="password"
            placeholder="Mínimo 6 caracteres"
            {...createForm.register('password')}
            error={createForm.formState.errors.password?.message}
          />
          <Select
            label="Rol *"
            options={roleOptions}
            {...createForm.register('role')}
            error={createForm.formState.errors.role?.message}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setCreateModal(false)}>
              Cancelar
            </Button>
            <Button type="submit" loading={saving}>
              Crear usuario
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Editar usuario */}
      <Modal open={editModal} onClose={() => setEditModal(false)} title="Editar usuario" size="md">
        <form onSubmit={editForm.handleSubmit(handleEdit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nombre *"
              placeholder="Juan"
              {...editForm.register('first_name')}
              error={editForm.formState.errors.first_name?.message}
            />
            <Input
              label="Apellido *"
              placeholder="Pérez"
              {...editForm.register('last_name')}
              error={editForm.formState.errors.last_name?.message}
            />
          </div>
          <Input
            label="Correo electrónico *"
            type="email"
            placeholder="correo@iglesia.com"
            {...editForm.register('email')}
            error={editForm.formState.errors.email?.message}
          />
          <Select
            label="Rol *"
            options={roleOptions}
            {...editForm.register('role')}
            error={editForm.formState.errors.role?.message}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setEditModal(false)}>
              Cancelar
            </Button>
            <Button type="submit" loading={saving}>
              Guardar cambios
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
