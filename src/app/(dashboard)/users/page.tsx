'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Header } from '@/components/layout/Header';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { useAuth } from '@/context/AuthContext';
import { ROLE_LABELS, ROLE_COLORS, formatDate } from '@/lib/utils';
import api from '@/lib/api';
import type { Profile, UserRole } from '@/types';
import { useRouter } from 'next/navigation';

const roleOptions: { value: UserRole; label: string }[] = [
  { value: 'admin', label: 'Administrador' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Visualizador' },
];

export default function UsersPage() {
  const { isAdmin, user: currentUser } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) { router.push('/'); return; }
    api.get<Profile[]>('/users')
      .then(({ data }) => setUsers(data))
      .finally(() => setLoading(false));
  }, [isAdmin]);

  const handleRoleChange = async (userId: string, role: string) => {
    try {
      await api.patch(`/users/${userId}/role`, { role });
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: role as UserRole } : u));
      toast.success('Rol actualizado');
    } catch {
      toast.error('Error al actualizar el rol');
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <Header title="Usuarios" subtitle="Gestiona los usuarios del sistema" />
      <div className="p-6 md:p-8">
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 rounded-xl bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50 text-left text-gray-500">
                  <th className="px-6 py-4 font-medium">Usuario</th>
                  <th className="px-6 py-4 font-medium">Rol actual</th>
                  <th className="px-6 py-4 font-medium">Registrado</th>
                  <th className="px-6 py-4 font-medium">Cambiar rol</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-sm flex-shrink-0">
                          {u.full_name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{u.full_name}</p>
                          {u.id === currentUser?.id && (
                            <span className="text-xs text-indigo-500">Tú</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={ROLE_COLORS[u.role]}>{ROLE_LABELS[u.role]}</Badge>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{formatDate(u.created_at)}</td>
                    <td className="px-6 py-4">
                      {u.id !== currentUser?.id ? (
                        <Select
                          options={roleOptions}
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="w-40"
                        />
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
