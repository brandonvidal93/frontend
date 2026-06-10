import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import type { ActivityStatus, ApprovalStatus, UserRole } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
  return format(new Date(date), "d 'de' MMMM, yyyy", { locale: es });
}

export function formatDateTime(date: string) {
  return format(new Date(date), "d 'de' MMMM, yyyy · HH:mm", { locale: es });
}

export function timeAgo(date: string) {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: es });
}

export const ACTIVITY_STATUS_LABELS: Record<ActivityStatus, string> = {
  planned: 'Planificada',
  in_progress: 'En curso',
  completed: 'Completada',
  cancelled: 'Cancelada',
};

export const ACTIVITY_STATUS_COLORS: Record<ActivityStatus, string> = {
  planned: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export const APPROVAL_STATUS_LABELS: Record<ApprovalStatus, string> = {
  pending: 'Pendiente',
  approved: 'Aprobada',
  rejected: 'Rechazada',
};

export const APPROVAL_STATUS_COLORS: Record<ApprovalStatus, string> = {
  pending: 'bg-orange-100 text-orange-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrador',
  editor: 'Editor',
  viewer: 'Visualizador',
};

export const ROLE_COLORS: Record<UserRole, string> = {
  admin: 'bg-purple-100 text-purple-700',
  editor: 'bg-blue-100 text-blue-700',
  viewer: 'bg-gray-100 text-gray-700',
};
