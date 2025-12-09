'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LogOut, 
  User, 
  Settings, 
  Bell, 
  Search, 
  Menu, 
  Command,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const shortcuts = [
  { key: '⌘ K', description: 'Arama' },
  { key: 'G H', description: 'Ana sayfaya git' },
  { key: 'G T', description: 'Öğretmenler' },
  { key: 'G C', description: 'Dersler' },
  { key: 'G S', description: 'Program' },
];

const notifications = [
  { 
    id: 1, 
    title: 'Program oluşturuldu', 
    message: 'Yeni ders programı başarıyla oluşturuldu.',
    time: '2 dakika önce',
    type: 'success',
    icon: CheckCircle2
  },
  { 
    id: 2, 
    title: 'Yeni öğretmen eklendi', 
    message: 'Dr. Ahmet Yılmaz sisteme eklendi.',
    time: '1 saat önce',
    type: 'info',
    icon: Info
  },
  { 
    id: 3, 
    title: 'Çakışma uyarısı', 
    message: '2 derste zaman çakışması tespit edildi.',
    time: '3 saat önce',
    type: 'warning',
    icon: AlertTriangle
  },
];

const quickLinks = [
  { name: 'Öğretmenler', href: '/teachers', icon: '👨‍🏫' },
  { name: 'Dersler', href: '/courses', icon: '📚' },
  { name: 'Derslikler', href: '/classrooms', icon: '🏫' },
  { name: 'Ders Programı', href: '/schedules', icon: '📅' },
];

interface HeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export function Header({ onMenuClick, showMenuButton = false }: HeaderProps) {
  const { user, logout, isAdmin } = useAuth();
  const pathname = usePathname();
  const [showSearch, setShowSearch] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const getPageTitle = () => {
    const routes: Record<string, string> = {
      '/': 'Ana Sayfa',
      '/teachers': 'Öğretmenler',
      '/courses': 'Dersler',
      '/classrooms': 'Derslikler',
      '/schedules': 'Ders Programı',
      '/scheduler': 'Program Oluşturucu',
      '/reports': 'Raporlar',
      '/settings': 'Ayarlar',
      '/profile': 'Profil',
      '/import-export': 'İçe/Dışa Aktar',
    };
    return routes[pathname] || 'PlanEdu';
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/40 bg-background/80 backdrop-blur-xl px-4 md:px-6">
        <div className="flex items-center gap-4">
          {showMenuButton && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onMenuClick} 
              className="md:hidden rounded-xl"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          
          {/* Page Title */}
          <div className="hidden md:block">
            <h1 className="text-lg font-semibold">{getPageTitle()}</h1>
          </div>
          
          {/* Search Button */}
          <Button 
            variant="outline" 
            className="hidden md:flex items-center gap-2 h-10 px-4 rounded-xl bg-muted/50 border-transparent hover:border-border hover:bg-muted text-muted-foreground"
            onClick={() => setShowSearch(true)}
          >
            <Search className="h-4 w-4" />
            <span className="text-sm">Hızlı arama...</span>
            <kbd className="ml-4 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <Command className="h-3 w-3" />K
            </kbd>
          </Button>
          
          {/* Mobile search */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden rounded-xl" 
            onClick={() => setShowSearch(true)}
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative rounded-xl h-10 w-10">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-background animate-pulse" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 rounded-xl p-0 overflow-hidden">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-3 border-b">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">Bildirimler</p>
                  <span className="text-xs text-muted-foreground bg-background px-2 py-0.5 rounded-full">
                    3 yeni
                  </span>
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notif) => {
                  const Icon = notif.icon;
                  return (
                    <div 
                      key={notif.id} 
                      className="flex gap-3 p-4 hover:bg-muted/50 cursor-pointer transition-colors border-b last:border-0"
                    >
                      <div className={cn(
                        'flex-shrink-0 h-9 w-9 rounded-full flex items-center justify-center',
                        notif.type === 'success' && 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
                        notif.type === 'warning' && 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
                        notif.type === 'info' && 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                      )}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{notif.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{notif.message}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">{notif.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="p-2 border-t bg-muted/30">
                <Button variant="ghost" className="w-full h-9 text-sm rounded-lg">
                  Tüm bildirimleri gör
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 h-10 px-2 rounded-xl hover:bg-muted">
                <div className="relative">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary text-white font-semibold text-sm">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-background" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium leading-none">{user?.username}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {user?.role === 'admin' ? 'Yönetici' : 'Öğretmen'}
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl">
              <div className="px-3 py-3 border-b">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary text-white font-bold">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{user?.username}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      {user?.role === 'admin' ? 'Yönetici' : 'Öğretmen'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-1">
                <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                  <Link href="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profil
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                    <Link href="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Ayarlar
                    </Link>
                  </DropdownMenuItem>
                )}
              </div>
              <DropdownMenuSeparator />
              <div className="p-1">
                <DropdownMenuItem 
                  onClick={logout} 
                  className="rounded-lg cursor-pointer text-rose-600 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/50"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Çıkış Yap
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Search Dialog */}
      <Dialog open={showSearch} onOpenChange={setShowSearch}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Arama</DialogTitle>
            <DialogDescription>
              Öğretmen, ders, derslik veya program arayın
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Aramak istediğinizi yazın..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                autoFocus
              />
            </div>
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-2">Hızlı Erişim</p>
              <div className="grid gap-1">
                <Link
                  href="/teachers"
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-accent"
                  onClick={() => setShowSearch(false)}
                >
                  <User className="h-4 w-4" />
                  Öğretmenler
                </Link>
                <Link
                  href="/courses"
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-accent"
                  onClick={() => setShowSearch(false)}
                >
                  <Search className="h-4 w-4" />
                  Dersler
                </Link>
                <Link
                  href="/schedules"
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-accent"
                  onClick={() => setShowSearch(false)}
                >
                  <Search className="h-4 w-4" />
                  Ders Programı
                </Link>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Keyboard Shortcuts Dialog */}
      <Dialog open={showShortcuts} onOpenChange={setShowShortcuts}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Klavye Kısayolları</DialogTitle>
            <DialogDescription>
              Hızlı navigasyon için klavye kısayollarını kullanın
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {shortcuts.map((shortcut) => (
              <div key={shortcut.key} className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">{shortcut.description}</span>
                <kbd className="px-2 py-1 text-xs font-semibold bg-muted rounded">
                  {shortcut.key}
                </kbd>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
