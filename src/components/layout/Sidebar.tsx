'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, CalendarDays, Users2, ShieldCheck, LogOut, Church, Menu, X
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

// viewer = editor de comité (acceso limitado a actividades, sin gestión de comités ni usuarios)
const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'editor', 'viewer'] },
  { href: '/activities', label: 'Actividades', icon: CalendarDays, roles: ['admin', 'editor', 'viewer'] },
  { href: '/committees', label: 'Comités', icon: ShieldCheck, roles: ['admin', 'editor'] },
  { href: '/users', label: 'Usuarios', icon: Users2, roles: ['admin'] },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout, isAdmin } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const filtered = navItems.filter((item) =>
    user ? item.roles.includes(user.role) : false
  );

  const NavContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-indigo-700">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20">
          <Church className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-white">GestiónIPUC</p>
          <p className="text-xs text-indigo-200">Panel de control</p>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {filtered.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-white/20 text-white'
                  : 'text-indigo-100 hover:bg-white/10 hover:text-white'
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User info + logout */}
      <div className="border-t border-indigo-700 px-4 py-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-semibold">
            {user?.full_name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.full_name}</p>
            <p className="text-xs text-indigo-200 capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-indigo-100 hover:bg-white/10 hover:text-white transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="fixed top-4 left-4 z-50 rounded-lg bg-indigo-600 p-2 text-white shadow-lg lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-full w-64 bg-indigo-800 shadow-xl transition-transform duration-300 lg:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <NavContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:fixed lg:left-0 lg:top-0 lg:flex lg:h-full lg:w-64 lg:flex-col bg-indigo-800 shadow-xl">
        <NavContent />
      </aside>
    </>
  );
}
