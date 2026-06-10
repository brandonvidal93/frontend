import Link from 'next/link';
import { MapPin, Calendar, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import {
  ACTIVITY_STATUS_LABELS, ACTIVITY_STATUS_COLORS,
  APPROVAL_STATUS_LABELS, APPROVAL_STATUS_COLORS,
  formatDate
} from '@/lib/utils';
import type { Activity } from '@/types';

interface ActivityCardProps {
  activity: Activity;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const committees = activity.activity_committees ?? [];

  return (
    <Link href={`/activities/${activity.id}`}>
      <div className="group rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer">
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
        <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
          {activity.name}
        </h3>

        {/* Descripción */}
        {activity.description && (
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{activity.description}</p>
        )}

        {/* Meta */}
        <div className="mt-3 flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(activity.start_date)}
          </div>
          {activity.location && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <MapPin className="h-3.5 w-3.5" />
              {activity.location}
            </div>
          )}
        </div>

        {/* Badges de estado */}
        <div className="mt-3 flex gap-2 flex-wrap">
          <Badge className={ACTIVITY_STATUS_COLORS[activity.status]}>
            {ACTIVITY_STATUS_LABELS[activity.status]}
          </Badge>
          <Badge className={APPROVAL_STATUS_COLORS[activity.approval_status]}>
            {APPROVAL_STATUS_LABELS[activity.approval_status]}
          </Badge>
        </div>
      </div>
    </Link>
  );
}
