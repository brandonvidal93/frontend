import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import type { ActivityStatus, ApprovalStatus, UserRole } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Convierte string ISO a objeto Date respetando timezone local */
function parseDate(date: string): Date {
  return new Date(date);
}

export function formatDate(date: string) {
  return format(parseDate(date), "d 'de' MMMM, yyyy", { locale: es });
}

export function formatDateTime(date: string) {
  return format(parseDate(date), "d 'de' MMMM, yyyy · HH:mm", { locale: es });
}

export function formatTime(date: string) {
  return format(parseDate(date), 'HH:mm', { locale: es });
}

export function timeAgo(date: string) {
  return formatDistanceToNow(parseDate(date), { addSuffix: true, locale: es });
}

/**
 * Convierte el valor de un input datetime-local (sin zona horaria)
 * al ISO string correcto para enviar al backend.
 * El input devuelve "2024-01-15T10:00" → lo tratamos como hora local.
 */
export function localInputToISO(value: string): string {
  if (!value) return value;
  // Si ya tiene info de zona horaria, devolver tal cual
  if (value.includes('Z') || value.includes('+') || value.match(/\d{2}:\d{2}:\d{2}/)) {
    return new Date(value).toISOString();
  }
  // Interpretar como hora local del navegador
  return new Date(value).toISOString();
}

/**
 * Convierte un ISO string del backend al formato que acepta datetime-local
 * mostrando la hora en zona horaria local del usuario.
 */
export function isoToLocalInput(isoString?: string): string {
  if (!isoString) return '';
  const d = new Date(isoString);
  // Formato: YYYY-MM-DDTHH:mm (sin segundos, sin zona)
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
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
