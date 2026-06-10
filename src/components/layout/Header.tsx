'use client';

import { Bell } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ROLE_LABELS, ROLE_COLORS } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { user } = useAuth();

  return (
    <div className="flex items-center justify-between py-6 px-6 md:px-8 border-b bg-white">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {user && (
          <Badge className={ROLE_COLORS[user.role]}>
            {ROLE_LABELS[user.role]}
          </Badge>
        )}
        <button className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 transition-colors">
          <Bell className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
