'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Users,
  BookOpen,
  Building2,
  Calendar,
  Settings,
  Cog,
  GraduationCap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';
import { Separator } from '@/components/ui/separator';

const navigation = [
  { name: 'Ana Sayfa', href: '/', icon: Home },
  { name: 'Fakülteler', href: '/faculties', icon: GraduationCap },
  { name: 'Öğretmenler', href: '/teachers', icon: Users },
  { name: 'Dersler', href: '/courses', icon: BookOpen },
  { name: 'Derslikler', href: '/classrooms', icon: Building2 },
  { name: 'Ders Programı', href: '/schedules', icon: Calendar },
];

const adminNavigation = [
  { name: 'Program Oluşturucu', href: '/scheduler', icon: Cog },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, isAdmin } = useAuth();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <GraduationCap className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-xl font-bold text-primary">PlanEdu</h1>
            <p className="text-xs text-muted-foreground">
              {user?.role === 'admin' ? 'Yönetici' : 'Kullanıcı'}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}

          {isAdmin && (
            <>
              <Separator className="my-4" />
              <p className="px-3 text-xs font-semibold uppercase text-muted-foreground">
                Yönetici
              </p>
              {adminNavigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      active
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </>
          )}
        </nav>

        {/* Footer */}
        <div className="border-t p-3">
          <Link
            href="/settings"
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive('/settings')
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <Settings className="h-5 w-5" />
            Ayarlar
          </Link>
        </div>
      </div>
    </aside>
  );
}
