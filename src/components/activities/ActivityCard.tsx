import Link from 'next/link';
import { MapPin, Calendar, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import {
  ACTIVITY_STATUS_LABELS, ACTIVITY_STATUS_COLORS,
  formatDate, formatTime
} from '@/lib/utils';
import type { Activity } from '@/types';

interface ActivityCardProps {
  activity: Activity;
  publicMode?: boolean; // Si es true, no muestra badges de aprobación ni es clickeable
}

export function ActivityCard({ activity, publicMode = false }: ActivityCardProps) {
  const committees = activity.activity_committees ?? [];

  const cardContent = (
    <div className={`group rounded-xl border bg-white p-5 shadow-sm transition-all ${!publicMode ? 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer' : ''}`}>
      {/* Comités (colores) */}
      {committees.length > 0 && (
        <div className="flex gap-1.5 mb-3 flex-wrap">
          {committees.map(({ committees: c }) =>
            c ? (
              <span
                key={c.id}
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                style={{ backgroundColor: c.color }}
              >
                {c.name}
              </span>
            ) : null
          )}
        </div>
      )}

      {/* Título */}
      <h3 className={`font-semibold text-gray-900 line-clamp-1 ${!publicMode ? 'group-hover:text-indigo-600 transition-colors' : ''}`}>
        {activity.name}
      </h3>

      {/* Descripción */}
      {activity.description && (
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{activity.description}</p>
      )}

      {/* Meta */}
      <div className="mt-3 flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
          {formatDate(activity.start_date)}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock className="h-3.5 w-3.5 flex-shrink-0" />
          {formatTime(activity.start_date)}
          {activity.end_date && ` – ${formatTime(activity.end_date)}`}
        </div>
        {activity.location && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
            {activity.location}
          </div>
        )}
      </div>

      {/* Badge de estado — en modo público solo el estado, no la aprobación */}
      <div className="mt-3 flex gap-2 flex-wrap">
        <Badge className={ACTIVITY_STATUS_COLORS[activity.status]}>
          {ACTIVITY_STATUS_LABELS[activity.status]}
        </Badge>
      </div>
    </div>
  );

  if (publicMode) return cardContent;

  return <Link href={`/activities/${activity.id}`}>{cardContent}</Link>;
}
