import Link from 'next/link';
import { Users2 } from 'lucide-react';
import type { Committee } from '@/types';

interface CommitteeCardProps {
  committee: Committee;
}

export function CommitteeCard({ committee }: CommitteeCardProps) {
  const memberCount = committee.committee_members?.length ?? 0;

  return (
    <Link href={`/committees/${committee.id}`}>
      <div className="group rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer">
        {/* Color stripe */}
        <div
          className="h-2 w-12 rounded-full mb-4"
          style={{ backgroundColor: committee.color }}
        />

        <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
          {committee.name}
        </h3>

        {committee.description && (
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{committee.description}</p>
        )}

        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${committee.color}20` }}
          >
            <Users2 className="h-4 w-4" style={{ color: committee.color }} />
          </div>
          {memberCount} {memberCount === 1 ? 'miembro' : 'miembros'}
        </div>
      </div>
    </Link>
  );
}
