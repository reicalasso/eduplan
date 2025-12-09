'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { ScrollToTop } from '@/components/ui/scroll-to-top';
import { LoadingBar } from '@/components/ui/loading-bar';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, isLoading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!isLoading && !token) {
      router.push('/login');
    }
  }, [token, isLoading, router]);

  // Load sidebar collapsed state from localStorage
  useEffect(() => {
    const collapsed = localStorage.getItem('sidebar-collapsed');
    if (collapsed === 'true') {
      setSidebarCollapsed(true);
    }
  }, []);

  const handleToggleCollapse = useCallback(() => {
    setSidebarCollapsed((prev) => {
      const newValue = !prev;
      localStorage.setItem('sidebar-collapsed', String(newValue));
      return newValue;
    });
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + K for search
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        // Search is handled in Header
      }
      
      // Ctrl + B to toggle sidebar
      if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        handleToggleCollapse();
      }
      
      // G + key for navigation
      if (e.key === 'g') {
        const handleNavigation = (event: KeyboardEvent) => {
          switch (event.key) {
            case 'h':
              router.push('/');
              break;
            case 't':
              router.push('/teachers');
              break;
            case 'c':
              router.push('/courses');
              break;
            case 'r':
              router.push('/classrooms');
              break;
            case 's':
              router.push('/schedules');
              break;
          }
          document.removeEventListener('keydown', handleNavigation);
        };
        
        document.addEventListener('keydown', handleNavigation, { once: true });
        setTimeout(() => {
          document.removeEventListener('keydown', handleNavigation);
        }, 1000);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [router, handleToggleCollapse]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground animate-pulse">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Loading Bar */}
      <Suspense fallback={null}>
        <LoadingBar />
      </Suspense>
      
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={handleToggleCollapse}
        />
      </div>
      
      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>
      
      {/* Main Content */}
      <div
        className={cn(
          'transition-all duration-300 min-h-screen',
          sidebarCollapsed ? 'md:pl-[72px]' : 'md:pl-72'
        )}
      >
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          showMenuButton
        />
        <main className="p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
      
      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
}
