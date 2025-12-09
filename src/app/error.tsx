'use client';

import { useEffect } from 'react';
import { AlertOctagon, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-destructive/5 p-4">
      <div className="text-center max-w-lg animate-fade-in">
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-destructive/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl" />
        
        {/* Error Icon */}
        <div className="mb-10 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-destructive/30 rounded-full blur-2xl animate-pulse" />
            <div className="relative w-28 h-28 rounded-2xl bg-gradient-to-br from-destructive to-rose-600 flex items-center justify-center shadow-2xl shadow-destructive/30">
              <AlertOctagon className="w-14 h-14 text-white" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-3">
          <Bug className="h-5 w-5 text-destructive" />
          <span className="text-sm font-medium text-destructive">Bir şeyler yanlış gitti</span>
        </div>

        <h1 className="text-3xl font-bold mb-3">Bir Hata Oluştu</h1>
        <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
          Üzgünüz, beklenmeyen bir hata oluştu. Lütfen tekrar deneyin veya 
          sorun devam ederse yönetici ile iletişime geçin.
        </p>

        {error.digest && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/50 mb-8">
            <span className="text-xs text-muted-foreground">Hata Kodu:</span>
            <code className="text-xs font-mono text-foreground">{error.digest}</code>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset} size="lg" className="shadow-xl">
            <RefreshCw className="mr-2 h-5 w-5" />
            Tekrar Dene
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Ana Sayfa
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
